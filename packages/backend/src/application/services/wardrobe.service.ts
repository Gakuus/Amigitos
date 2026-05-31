import { WardrobeItem, ClothingSlot } from '../../domain/wardrobe/wardrobe-item.entity';
import { PetOutfit } from '../../domain/wardrobe/pet-outfit.entity';
import { WardrobeRepositoryPort } from '../ports/wardrobe-repository.port';
import { PetRepositoryPort } from '../ports/pet-repository.port';
import { WebSocketNotifierPort } from '../ports/websocket-notifier.port';

export class WardrobeService {
  constructor(
    private readonly wardrobeRepo: WardrobeRepositoryPort,
    private readonly petRepo: PetRepositoryPort,
    private readonly wsNotifier: WebSocketNotifierPort,
  ) {}

  async getAvailableItems(species?: string): Promise<WardrobeItem[]> {
    return this.wardrobeRepo.findAllItems(species);
  }

  async getItem(itemId: string): Promise<WardrobeItem | null> {
    return this.wardrobeRepo.findItemById(itemId);
  }

  async equipItem(petId: string, itemId: string): Promise<PetOutfit> {
    const pet = await this.petRepo.findById(petId);
    if (!pet) throw new Error('PET_NOT_FOUND');

    const item = await this.wardrobeRepo.findItemById(itemId);
    if (!item) throw new Error('ITEM_NOT_FOUND');

    if (!item.isCompatibleWith(pet.species)) {
      throw new Error('ITEM_NOT_COMPATIBLE');
    }

    const outfit = await this.wardrobeRepo.getOutfit(petId);
    outfit.equip(item.slot, itemId);
    await this.wardrobeRepo.saveOutfit(outfit);

    this.wsNotifier.notifyPetState(petId, {
      equipped: Object.fromEntries(outfit.equipped),
    });

    return outfit;
  }

  async unequipItem(petId: string, slot: ClothingSlot): Promise<PetOutfit> {
    const outfit = await this.wardrobeRepo.getOutfit(petId);
    outfit.unequip(slot);
    await this.wardrobeRepo.saveOutfit(outfit);

    this.wsNotifier.notifyPetState(petId, {
      equipped: Object.fromEntries(outfit.equipped),
    });

    return outfit;
  }

  async getPetOutfit(petId: string): Promise<PetOutfit> {
    return this.wardrobeRepo.getOutfit(petId);
  }

  async getAllOutfits(petIds: string[]): Promise<Map<string, PetOutfit>> {
    const outfits = new Map<string, PetOutfit>();
    for (const petId of petIds) {
      const outfit = await this.wardrobeRepo.getOutfit(petId);
      outfits.set(petId, outfit);
    }
    return outfits;
  }
}
