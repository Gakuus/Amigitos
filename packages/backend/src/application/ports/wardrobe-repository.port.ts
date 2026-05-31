import { WardrobeItem } from '../../domain/wardrobe/wardrobe-item.entity';
import { PetOutfit } from '../../domain/wardrobe/pet-outfit.entity';

export interface WardrobeRepositoryPort {
  findItemById(id: string): Promise<WardrobeItem | null>;
  findAllItems(species?: string): Promise<WardrobeItem[]>;
  saveItem(item: WardrobeItem): Promise<void>;

  getOutfit(petId: string): Promise<PetOutfit>;
  saveOutfit(outfit: PetOutfit): Promise<void>;
}
