import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/persistence/prisma.service';
import { PrismaUserRepository } from '../../infrastructure/persistence/prisma-user.repository';

type GameConfig = { minScore: number; maxScore: number; coinPerPoint: number; maxCoins: number; cooldownMs: number; minWinScore: number; baseReward: number };
const GAME_CONFIGS: Record<string, GameConfig> = {
  memory:    { minScore: 0, maxScore: 100, coinPerPoint: 2,  maxCoins: 50,  cooldownMs: 30_000, minWinScore: 1, baseReward: 15 },
  catch:     { minScore: 0, maxScore: 200, coinPerPoint: 1,  maxCoins: 60,  cooldownMs: 20_000, minWinScore: 10, baseReward: 10 },
  puzzle:    { minScore: 0, maxScore: 100, coinPerPoint: 2,  maxCoins: 50,  cooldownMs: 30_000, minWinScore: 1, baseReward: 15 },
};

@Injectable()
export class GameService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userRepo: PrismaUserRepository,
  ) {}

  async claimReward(userId: string, gameType: string, score: number) {
    const config = GAME_CONFIGS[gameType];
    if (!config) throw new BadRequestException('Invalid game type');

    const clamped = Math.max(config.minScore, Math.min(config.maxScore, score));
    const won = clamped >= config.minWinScore;
    const coins = won
      ? Math.min(config.baseReward + clamped * config.coinPerPoint, config.maxCoins)
      : 0;

    const user = await this.userRepo.findById(userId);
    if (!user) throw new BadRequestException('User not found');

    // Check cooldown from last claim
    const lastClaim = await this.prisma.gameResult.findFirst({
      where: { userId, gameType },
      orderBy: { createdAt: 'desc' },
    });
    if (lastClaim) {
      const elapsed = Date.now() - lastClaim.createdAt.getTime();
      if (elapsed < config.cooldownMs) {
        const remaining = Math.ceil((config.cooldownMs - elapsed) / 1000);
        throw new BadRequestException(`Wait ${remaining}s before playing again`);
      }
    }

    user.addCoins(coins);
    await this.userRepo.update(user);

    await this.prisma.gameResult.create({
      data: { userId, gameType, score, coinsEarned: coins },
    });

    return { coins, totalCoins: user.coins, gameType, won };
  }

  async getStats(userId: string) {
    const results = await this.prisma.gameResult.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    const totals = await this.prisma.gameResult.groupBy({
      by: ['gameType'],
      where: { userId },
      _sum: { coinsEarned: true },
      _count: true,
    });

    const cooldowns: Record<string, number> = {};
    const gameKeys = Object.keys(GAME_CONFIGS) as (keyof typeof GAME_CONFIGS)[];
    for (const gameType of gameKeys) {
      const config = GAME_CONFIGS[gameType]!;
      const last = results.find(r => r.gameType === gameType);
      if (last) {
        const elapsed = Date.now() - last.createdAt.getTime();
        const remaining = Math.max(0, config.cooldownMs - elapsed);
        cooldowns[gameType] = Math.ceil(remaining / 1000);
      } else {
        cooldowns[gameType] = 0;
      }
    }

    return { results, totals, cooldowns };
  }
}
