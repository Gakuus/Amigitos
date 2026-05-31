import { Injectable } from '@nestjs/common';
import { WardrobeRepositoryPort } from '../../application/ports/wardrobe-repository.port';
import { WardrobeItem, WardrobeItemId, ClothingSlot, ClothingRarity } from '../../domain/wardrobe/wardrobe-item.entity';
import { PetOutfit } from '../../domain/wardrobe/pet-outfit.entity';
import { PrismaService } from './prisma.service';

@Injectable()
export class PrismaWardrobeRepository implements WardrobeRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async findItemById(id: string): Promise<WardrobeItem | null> {
    const data = await this.prisma.wardrobeItem.findUnique({ where: { id } });
    if (!data) return null;
    return this.toDomain(data);
  }

  async findAllItems(species?: string): Promise<WardrobeItem[]> {
    const where = species
      ? { OR: [{ species: { has: species } }, { species: { equals: [] } }] }
      : {};
    const items = await this.prisma.wardrobeItem.findMany({ where });
    return items.map((i) => this.toDomain(i));
  }

  async saveItem(item: WardrobeItem): Promise<void> {
    const data = item.toJSON();
    await this.prisma.wardrobeItem.create({ data });
  }

  async getOutfit(petId: string): Promise<PetOutfit> {
    const equipment = await this.prisma.petEquipment.findMany({
      where: { petId },
      include: { item: true },
    });

    const equipped = new Map<ClothingSlot, string>();
    for (const eq of equipment) {
      equipped.set(eq.item.slot as ClothingSlot, eq.itemId);
    }

    return new PetOutfit(petId, equipped);
  }

  async saveOutfit(outfit: PetOutfit): Promise<void> {
    const petId = outfit.petId;

    await this.prisma.petEquipment.deleteMany({ where: { petId } });

    const entries = Array.from(outfit.equipped.entries()).map(([slot, itemId]) => ({
      petId,
      itemId,
    }));

    if (entries.length > 0) {
      await this.prisma.petEquipment.createMany({ data: entries });
    }
  }

  private toDomain(data: any): WardrobeItem {
    return new WardrobeItem({
      id: WardrobeItemId.create(data.id),
      name: data.name,
      description: data.description,
      slot: data.slot as ClothingSlot,
      rarity: data.rarity as ClothingRarity,
      modelUrl: data.modelUrl,
      thumbnail: data.thumbnail,
      species: data.species,
      unlockCondition: data.unlockCondition,
      createdAt: data.createdAt,
    });
  }
}
