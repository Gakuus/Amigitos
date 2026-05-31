import { Controller, Get, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { PrismaUserRepository } from '../../infrastructure/persistence/prisma-user.repository';
import { JwtGuard } from '../../infrastructure/auth/jwt.guard';

@Controller('users')
@UseGuards(JwtGuard)
export class UserController {
  constructor(private readonly userRepo: PrismaUserRepository) {}

  @Get(':id')
  async getUser(@Param('id') id: string) {
    const user = await this.userRepo.findById(id);
    if (!user) {
      return { statusCode: 404, code: 'USER_NOT_FOUND' };
    }
    return user.toJSON();
  }

  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() body: { name?: string; avatarUrl?: string },
  ) {
    const user = await this.userRepo.findById(id);
    if (!user) {
      return { statusCode: 404, code: 'USER_NOT_FOUND' };
    }
    if (body.name) {
      user.updateProfile(body.name, body.avatarUrl);
    } else if (body.avatarUrl) {
      user.updateProfile(user.name, body.avatarUrl);
    }
    await this.userRepo.update(user);
    return user.toJSON();
  }
}
