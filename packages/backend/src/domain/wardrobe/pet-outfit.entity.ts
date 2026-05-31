import { ClothingSlot } from './wardrobe-item.entity';

export class PetOutfit {
  private readonly _petId: string;
  private _equipped: Map<ClothingSlot, string>; // slot -> itemId

  constructor(petId: string, equipped?: Map<ClothingSlot, string>) {
    this._petId = petId;
    this._equipped = equipped ?? new Map();
  }

  get petId(): string { return this._petId; }
  get equipped(): Map<ClothingSlot, string> { return this._equipped; }

  equip(slot: ClothingSlot, itemId: string): void {
    this._equipped.set(slot, itemId);
  }

  unequip(slot: ClothingSlot): void {
    this._equipped.delete(slot);
  }

  getItemInSlot(slot: ClothingSlot): string | undefined {
    return this._equipped.get(slot);
  }

  isSlotEquipped(slot: ClothingSlot): boolean {
    return this._equipped.has(slot);
  }

  clearOutfit(): void {
    this._equipped.clear();
  }

  toJSON() {
    return {
      petId: this._petId,
      equipped: Object.fromEntries(this._equipped),
    };
  }
}
