import { Module } from '@nestjs/common';
import { PetController } from './controllers/pet.controller';
import { PetService } from '../application/services/pet.service';
import { PrismaPetRepository } from '../infrastructure/persistence/prisma-pet.repository';
import { PetGateway } from '../infrastructure/websockets/pet.gateway';

@Module({
  controllers: [PetController],
  providers: [
    {
      provide: 'PetService',
      useFactory: (petRepo: PrismaPetRepository, ws: PetGateway) => new PetService(petRepo, ws),
      inject: [PrismaPetRepository, PetGateway],
    },
    PetGateway,
  ],
  exports: ['PetService'],
})
export class PetModule {}
