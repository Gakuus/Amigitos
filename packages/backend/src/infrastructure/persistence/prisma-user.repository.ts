import { Injectable } from '@nestjs/common';
import { UserRepositoryPort } from '../../application/ports/user-repository.port';
import { User, Email, UserId } from '../../domain/user/user.entity';
import { PrismaService } from './prisma.service';

@Injectable()
export class PrismaUserRepository implements UserRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<User | null> {
    const data = await this.prisma.user.findUnique({ where: { id } });
    if (!data) return null;
    return this.toDomain(data);
  }

  async findByEmail(email: string): Promise<User | null> {
    const data = await this.prisma.user.findUnique({ where: { email } });
    if (!data) return null;
    return this.toDomain(data);
  }

  async save(user: User): Promise<void> {
    const data = user.toJSON();
    await this.prisma.user.create({ data });
  }

  async update(user: User): Promise<void> {
    const data = user.toJSON();
    await this.prisma.user.update({
      where: { id: data.id },
      data,
    });
  }

  async savePasswordHash(userId: string, passwordHash: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: passwordHash },
    });
  }

  async getPasswordHash(userId: string): Promise<string | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { password: true },
    });
    return user?.password ?? null;
  }

  private toDomain(data: any): User {
    return new User({
      id: UserId.create(data.id),
      email: Email.create(data.email),
      name: data.name,
      avatarUrl: data.avatarUrl,
      coupleId: data.coupleId,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }
}
