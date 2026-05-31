import {
  Controller, Post, Get, Body, UseGuards, BadRequestException,
} from '@nestjs/common';
import { GameService } from '../../application/services/game.service';
import { JwtGuard } from '../../infrastructure/auth/jwt.guard';
import { CurrentUser } from '../../infrastructure/auth/current-user.decorator';

@Controller('games')
@UseGuards(JwtGuard)
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post('claim')
  async claim(
    @Body() body: { gameType: string; score: number },
    @CurrentUser() user: { userId: string },
  ) {
    if (!body.gameType || typeof body.score !== 'number') {
      throw new BadRequestException('Invalid request body');
    }
    return this.gameService.claimReward(user.userId, body.gameType, body.score);
  }

  @Get('stats')
  async stats(@CurrentUser() user: { userId: string }) {
    return this.gameService.getStats(user.userId);
  }
}
