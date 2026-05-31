import { Module } from '@nestjs/common';
import { WardrobeController } from './controllers/wardrobe.controller';
import { WardrobeService } from '../application/services/wardrobe.service';
import { PrismaWardrobeRepository } from '../infrastructure/persistence/prisma-wardrobe.repository';
import { PrismaPetRepository } from '../infrastructure/persistence/prisma-pet.repository';
import { PetGateway } from '../infrastructure/websockets/pet.gateway';

@Module({
  controllers: [WardrobeController],
  providers: [
    PrismaWardrobeRepository,
    PrismaPetRepository,
    PetGateway,
    {
      provide: 'WardrobeService',
      useFactory: (
        wardrobeRepo: PrismaWardrobeRepository,
        petRepo: PrismaPetRepository,
        ws: PetGateway,
      ) => new WardrobeService(wardrobeRepo, petRepo, ws),
      inject: [PrismaWardrobeRepository, PrismaPetRepository, PetGateway],
    },
  ],
  exports: ['WardrobeService'],
})
export class WardrobeModule {}
