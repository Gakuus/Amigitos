import { Injectable } from '@nestjs/common';
import { CoupleRepositoryPort } from '../../application/ports/couple-repository.port';
import { Couple, CoupleId } from '../../domain/couple/couple.entity';
import { PrismaService } from './prisma.service';

@Injectable()
export class PrismaCoupleRepository implements CoupleRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Couple | null> {
    const data = await this.prisma.couple.findUnique({ where: { id } });
    if (!data) return null;
    return this.toDomain(data);
  }

  async findByUserId(userId: string): Promise<Couple | null> {
    const data = await this.prisma.couple.findFirst({
      where: {
        OR: [{ user1Id: userId }, { user2Id: userId }],
      },
    });
    if (!data) return null;
    return this.toDomain(data);
  }

  async findPendingByUserId(userId: string): Promise<Couple[]> {
    const data = await this.prisma.couple.findMany({
      where: {
        OR: [{ user1Id: userId }, { user2Id: userId }],
        status: 'PENDING',
      },
    });
    return data.map((d: any) => this.toDomain(d));
  }

  async save(couple: Couple): Promise<void> {
    const data = couple.toJSON();
    await this.prisma.couple.create({ data });
  }

  async update(couple: Couple): Promise<void> {
    const data = couple.toJSON();
    await this.prisma.couple.update({
      where: { id: data.id },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.couple.delete({ where: { id } });
  }

  private toDomain(data: any): Couple {
    return new Couple({
      id: CoupleId.create(data.id),
      user1Id: data.user1Id,
      user2Id: data.user2Id,
      status: data.status,
      invitedBy: data.invitedBy,
      invitedAt: data.invitedAt,
      acceptedAt: data.acceptedAt,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }
}
