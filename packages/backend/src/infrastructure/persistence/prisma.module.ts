import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { PrismaPetRepository } from './prisma-pet.repository';
import { PrismaUserRepository } from './prisma-user.repository';
import { PrismaCoupleRepository } from './prisma-couple.repository';

@Global()
@Module({
  providers: [
    PrismaService,
    PrismaPetRepository,
    PrismaUserRepository,
    PrismaCoupleRepository,
  ],
  exports: [
    PrismaService,
    PrismaPetRepository,
    PrismaUserRepository,
    PrismaCoupleRepository,
  ],
})
export class PrismaModule {}
