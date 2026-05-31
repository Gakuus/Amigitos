import { Module } from '@nestjs/common';
import { PetModule } from './api/pet.module';
import { AuthModule } from './api/auth.module';
import { CoupleModule } from './api/couple.module';
import { UserModule } from './api/user.module';
import { WsModule } from './api/ws.module';
import { WardrobeModule } from './api/wardrobe.module';
import { PrismaModule } from './infrastructure/persistence/prisma.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    PetModule,
    CoupleModule,
    UserModule,
    WsModule,
    WardrobeModule,
  ],
})
export class AppModule {}
