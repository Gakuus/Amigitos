import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/persistence/prisma.service';
import { PrismaUserRepository } from '../../infrastructure/persistence/prisma-user.repository';
import type { WardrobeItem, Consumable } from '@prisma/client';

@Injectable()
export class ShopService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userRepo: PrismaUserRepository,
  ) {}

  async getShopItems() {
    const cosmetics: WardrobeItem[] = await this.prisma.wardrobeItem.findMany({
      where: { price: { gt: 0 } },
      orderBy: { price: 'asc' },
    });

    const consumables: Consumable[] = await this.prisma.consumable.findMany({
      orderBy: { price: 'asc' },
    });

    return [
      ...cosmetics.map((c: WardrobeItem) => ({
        id: c.id,
        type: 'COSMETIC' as const,
        name: c.name,
        description: c.description,
        price: c.price,
        imageUrl: c.thumbnail,
        slot: c.slot,
        rarity: c.rarity,
        species: c.species,
      })),
      ...consumables.map((c: Consumable) => ({
        id: c.id,
        type: 'CONSUMABLE' as const,
        name: c.name,
        description: c.description,
        price: c.price,
        imageUrl: c.imageUrl,
        category: c.category,
        effect: c.effect as Record<string, unknown>,
      })),
    ];
  }

  async buyItem(userId: string, itemType: string, itemId: string) {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    let price = 0;
    let name = '';

    if (itemType === 'COSMETIC') {
      const item = await this.prisma.wardrobeItem.findUnique({ where: { id: itemId } });
      if (!item) throw new NotFoundException('Item not found');
      if (item.price <= 0) throw new BadRequestException('Item is not purchasable');
      price = item.price;
      name = item.name;

      const alreadyOwned = await this.prisma.userCosmetic.findUnique({
        where: { userId_itemId: { userId, itemId } },
      });
      if (alreadyOwned) throw new BadRequestException('Already owned');

      user.spendCoins(price);
      await this.userRepo.update(user);

      await this.prisma.userCosmetic.create({ data: { userId, itemId } });
    } else if (itemType === 'CONSUMABLE') {
      const item = await this.prisma.consumable.findUnique({ where: { id: itemId } });
      if (!item) throw new NotFoundException('Item not found');
      if (item.price <= 0) throw new BadRequestException('Item is not purchasable');
      price = item.price;
      name = item.name;

      user.spendCoins(price);
      await this.userRepo.update(user);

      await this.prisma.userConsumable.upsert({
        where: { userId_consumableId: { userId, consumableId: itemId } },
        update: { quantity: { increment: 1 } },
        create: { userId, consumableId: itemId, quantity: 1 },
      });
    } else {
      throw new BadRequestException('Invalid item type');
    }

    return { success: true, name, price, coins: user.coins };
  }

  async getInventory(userId: string) {
    const consumables = await this.prisma.userConsumable.findMany({
      where: { userId },
      include: { consumable: true },
    });

    const cosmetics = await this.prisma.userCosmetic.findMany({
      where: { userId },
      include: { wardrobeItem: true },
    });

    return [
      ...consumables.map((uc: typeof consumables[0]) => ({
        id: uc.id,
        type: 'CONSUMABLE' as const,
        itemId: uc.consumableId,
        name: uc.consumable.name,
        description: uc.consumable.description,
        imageUrl: uc.consumable.imageUrl,
        quantity: uc.quantity,
        category: uc.consumable.category,
        effect: uc.consumable.effect as Record<string, unknown>,
      })),
      ...cosmetics.map((uc: typeof cosmetics[0]) => ({
        id: uc.id,
        type: 'COSMETIC' as const,
        itemId: uc.itemId,
        name: uc.wardrobeItem.name,
        description: uc.wardrobeItem.description,
        imageUrl: uc.wardrobeItem.thumbnail,
        slot: uc.wardrobeItem.slot,
        rarity: uc.wardrobeItem.rarity,
      })),
    ];
  }

  async getBalance(userId: string) {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    return { coins: user.coins };
  }
}
