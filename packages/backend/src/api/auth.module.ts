import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from '../application/services/auth.service';
import { PrismaUserRepository } from '../infrastructure/persistence/prisma-user.repository';

@Module({
  controllers: [AuthController],
  providers: [
    {
      provide: 'AuthService',
      useFactory: (userRepo: PrismaUserRepository) => new AuthService(userRepo),
      inject: [PrismaUserRepository],
    },
  ],
  exports: ['AuthService'],
})
export class AuthModule {}
