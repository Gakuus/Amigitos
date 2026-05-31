export enum ClothingSlot {
  HAT = 'HAT',
  GLASSES = 'GLASSES',
  TOP = 'TOP',
  BOTTOM = 'BOTTOM',
  SHOES = 'SHOES',
  ACCESSORY = 'ACCESSORY',
  WINGS = 'WINGS',
  TAIL = 'TAIL',
}

export enum ClothingRarity {
  COMMON = 'COMMON',
  UNCOMMON = 'UNCOMMON',
  RARE = 'RARE',
  EPIC = 'EPIC',
  LEGENDARY = 'LEGENDARY',
}

export class WardrobeItemId {
  private constructor(private readonly _value: string) {
    if (!_value) throw new Error('WardrobeItemId cannot be empty');
  }
  get value(): string { return this._value; }
  static create(value?: string): WardrobeItemId {
    return new WardrobeItemId(value ?? uuidv4());
  }
  equals(other: WardrobeItemId): boolean { return this._value === other._value; }
}

export class WardrobeItem {
  private readonly _id: WardrobeItemId;
  private _name: string;
  private _description: string;
  private _slot: ClothingSlot;
  private _rarity: ClothingRarity;
  private _modelUrl: string;
  private _thumbnail: string;
  private _species: string[]; // compatible species (empty = all)
  private _unlockCondition: string | null; // e.g. "level_5", "login_7days"
  private readonly _createdAt: Date;

  constructor(props: {
    id?: WardrobeItemId;
    name: string;
    description: string;
    slot: ClothingSlot;
    rarity: ClothingRarity;
    modelUrl: string;
    thumbnail: string;
    species?: string[];
    unlockCondition?: string | null;
    createdAt?: Date;
  }) {
    this._id = props.id ?? WardrobeItemId.create();
    this._name = props.name;
    this._description = props.description;
    this._slot = props.slot;
    this._rarity = props.rarity;
    this._modelUrl = props.modelUrl;
    this._thumbnail = props.thumbnail;
    this._species = props.species ?? [];
    this._unlockCondition = props.unlockCondition ?? null;
    this._createdAt = props.createdAt ?? new Date();
  }

  get id(): WardrobeItemId { return this._id; }
  get name(): string { return this._name; }
  get description(): string { return this._description; }
  get slot(): ClothingSlot { return this._slot; }
  get rarity(): ClothingRarity { return this._rarity; }
  get modelUrl(): string { return this._modelUrl; }
  get thumbnail(): string { return this._thumbnail; }
  get species(): string[] { return this._species; }
  get unlockCondition(): string | null { return this._unlockCondition; }
  get createdAt(): Date { return this._createdAt; }

  isCompatibleWith(species: string): boolean {
    return this._species.length === 0 || this._species.includes(species);
  }

  toJSON() {
    return {
      id: this._id.value,
      name: this._name,
      description: this._description,
      slot: this._slot,
      rarity: this._rarity,
      modelUrl: this._modelUrl,
      thumbnail: this._thumbnail,
      species: this._species,
      unlockCondition: this._unlockCondition,
      createdAt: this._createdAt,
    };
  }
}
