import { Injectable } from '@nestjs/common';
import { PetRepositoryPort } from '../../application/ports/pet-repository.port';
import { Pet } from '../../domain/pet/pet.entity';
import { PetId } from '../../domain/pet/pet-id.value-object';
import { PetLevel } from '../../domain/pet/pet-level.value-object';
import { Experience } from '../../domain/pet/experience.value-object';
import { Hunger } from '../../domain/pet/hunger.value-object';
import { Happiness } from '../../domain/pet/happiness.value-object';
import { Energy } from '../../domain/pet/energy.value-object';
import { Hygiene } from '../../domain/pet/hygiene.value-object';
import { PrismaService } from './prisma.service';

@Injectable()
export class PrismaPetRepository implements PetRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Pet | null> {
    const data = await this.prisma.pet.findUnique({ where: { id } });
    if (!data) return null;

    return this.toDomain(data);
  }

  async findByCoupleId(coupleId: string): Promise<Pet[]> {
    const pets = await this.prisma.pet.findMany({ where: { coupleId } });
    return pets.map((p) => this.toDomain(p));
  }

  async save(pet: Pet): Promise<void> {
    const data = pet.toJSON();
    await this.prisma.pet.create({ data });
  }

  async update(pet: Pet): Promise<void> {
    const data = pet.toJSON();
    await this.prisma.pet.update({
      where: { id: data.id },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.pet.delete({ where: { id } });
  }

  private toDomain(data: any): Pet {
    return new Pet({
      id: PetId.create(data.id),
      name: data.name,
      species: data.species,
      coupleId: data.coupleId,
      level: PetLevel.create(data.level),
      experience: Experience.create(data.experience),
      hunger: Hunger.create(data.hunger),
      happiness: Happiness.create(data.happiness),
      energy: Energy.create(data.energy),
      hygiene: Hygiene.create(data.hygiene),
      mood: data.mood,
      isSleeping: data.isSleeping,
      modelUrl: data.modelUrl,
      thumbnail: data.thumbnail,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }
}
