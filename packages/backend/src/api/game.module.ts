import { Module } from '@nestjs/common';
import { GameController } from './controllers/game.controller';
import { GameService } from '../application/services/game.service';
import { PrismaModule } from '../infrastructure/persistence/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [GameController],
  providers: [GameService],
})
export class GameModule {}
