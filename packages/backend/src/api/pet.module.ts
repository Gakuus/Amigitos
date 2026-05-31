import { Module } from '@nestjs/common';
import { PetController } from './controllers/pet.controller';
import { PetService } from '../application/services/pet.service';
import { NeedsSchedulerService } from '../application/services/needs-scheduler.service';
import { PrismaPetRepository } from '../infrastructure/persistence/prisma-pet.repository';
import { PetGateway } from '../infrastructure/websockets/pet.gateway';
import { WsModule } from './ws.module';

@Module({
  imports: [WsModule],
  controllers: [PetController],
  providers: [
    {
      provide: 'PetService',
      useFactory: (petRepo: PrismaPetRepository, ws: PetGateway) => new PetService(petRepo, ws),
      inject: [PrismaPetRepository, PetGateway],
    },
    {
      provide: NeedsSchedulerService,
      useFactory: (petRepo: PrismaPetRepository, ws: PetGateway) => new NeedsSchedulerService(petRepo, ws),
      inject: [PrismaPetRepository, PetGateway],
    },
  ],
  exports: ['PetService'],
})
export class PetModule {}
