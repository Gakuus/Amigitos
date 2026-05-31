import { Module } from '@nestjs/common';
import { CoupleController } from './controllers/couple.controller';
import { CoupleService } from '../application/services/couple.service';
import { PrismaCoupleRepository } from '../infrastructure/persistence/prisma-couple.repository';
import { PrismaUserRepository } from '../infrastructure/persistence/prisma-user.repository';
import { PetGateway } from '../infrastructure/websockets/pet.gateway';

@Module({
  controllers: [CoupleController],
  providers: [
    {
      provide: 'CoupleService',
      useFactory: (
        coupleRepo: PrismaCoupleRepository,
        userRepo: PrismaUserRepository,
        ws: PetGateway,
      ) => new CoupleService(coupleRepo, userRepo, ws),
      inject: [PrismaCoupleRepository, PrismaUserRepository, PetGateway],
    },
  ],
})
export class CoupleModule {}
