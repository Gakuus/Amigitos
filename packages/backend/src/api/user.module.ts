import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { PrismaUserRepository } from '../infrastructure/persistence/prisma-user.repository';

@Module({
  controllers: [UserController],
  providers: [PrismaUserRepository],
})
export class UserModule {}
