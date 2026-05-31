import { PetSpecies } from './pet-species';
import { PetMood } from './pet-mood';
import { PetLevel } from './pet-level.value-object';
import { Experience } from './experience.value-object';
import { Hunger } from './hunger.value-object';
import { Happiness } from './happiness.value-object';
import { Energy } from './energy.value-object';
import { Hygiene } from './hygiene.value-object';
import { PetId } from './pet-id.value-object';

export type InteractionType = 'FEED' | 'PLAY' | 'BATH' | 'SLEEP';

interface PetProps {
  id: PetId;
  name: string;
  species: PetSpecies;
  userId?: string;
  coupleId?: string;
  level?: PetLevel;
  experience?: Experience;
  hunger?: Hunger;
  happiness?: Happiness;
  energy?: Energy;
  hygiene?: Hygiene;
  mood?: PetMood;
  isSleeping?: boolean;
  modelUrl?: string | null;
  thumbnail?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

interface InteractionResult {
  success: boolean;
  cooldownRemaining?: number;
  reason?: string;
}

const EVOLUTION_THRESHOLDS = [0, 5, 10, 20, 35, 50];
const XP_PER_INTERACTION = 10;

export class Pet {
  private readonly _id: PetId;
  private _name: string;
  private readonly _species: PetSpecies;
  private readonly _userId: string | null;
  private readonly _coupleId: string | null;
  private _level: PetLevel;
  private _experience: Experience;
  private _hunger: Hunger;
  private _happiness: Happiness;
  private _energy: Energy;
  private _hygiene: Hygiene;
  private _mood: PetMood;
  private _isSleeping: boolean;
  private _modelUrl: string | null;
  private _thumbnail: string | null;
  private readonly _createdAt: Date;
  private _updatedAt: Date;
  private _lastInteractionAt: Map<InteractionType, Date>;

  constructor(props: PetProps) {
    this._id = props.id;
    this._name = props.name;
    this._species = props.species;
    this._userId = props.userId ?? null;
    this._coupleId = props.coupleId ?? null;
    this._level = props.level ?? PetLevel.create(1);
    this._experience = props.experience ?? Experience.create(0);
    this._hunger = props.hunger ?? Hunger.create(100);
    this._happiness = props.happiness ?? Happiness.create(100);
    this._energy = props.energy ?? Energy.create(100);
    this._hygiene = props.hygiene ?? Hygiene.create(100);
    this._mood = props.mood ?? PetMood.HAPPY;
    this._isSleeping = props.isSleeping ?? false;
    this._modelUrl = props.modelUrl ?? null;
    this._thumbnail = props.thumbnail ?? null;
    this._createdAt = props.createdAt ?? new Date();
    this._updatedAt = props.updatedAt ?? new Date();
    this._lastInteractionAt = new Map();
  }

  get id(): PetId { return this._id; }
  get name(): string { return this._name; }
  get species(): PetSpecies { return this._species; }
  get userId(): string | null { return this._userId; }
  get coupleId(): string | null { return this._coupleId; }
  get level(): PetLevel { return this._level; }
  get experience(): Experience { return this._experience; }
  get hunger(): Hunger { return this._hunger; }
  get happiness(): Happiness { return this._happiness; }
  get energy(): Energy { return this._energy; }
  get hygiene(): Hygiene { return this._hygiene; }
  get mood(): PetMood { return this._mood; }
  get isSleeping(): boolean { return this._isSleeping; }
  get modelUrl(): string | null { return this._modelUrl; }
  get thumbnail(): string | null { return this._thumbnail; }
  get createdAt(): Date { return this._createdAt; }
  get updatedAt(): Date { return this._updatedAt; }

  private touch(): void {
    this._updatedAt = new Date();
  }

  canInteract(type: InteractionType, cooldownMs: number = 600_000): InteractionResult {
    if (this._isSleeping && type !== 'SLEEP') {
      return { success: false, reason: 'PET_IS_SLEEPING' };
    }
    if (this._energy.value <= 0 && type === 'PLAY') {
      return { success: false, reason: 'NOT_ENOUGH_ENERGY' };
    }
    const lastInteraction = this._lastInteractionAt.get(type);
    if (lastInteraction) {
      const elapsed = Date.now() - lastInteraction.getTime();
      if (elapsed < cooldownMs) {
        return {
          success: false,
          cooldownRemaining: Math.ceil((cooldownMs - elapsed) / 1000),
          reason: 'COOLDOWN_ACTIVE',
        };
      }
    }
    return { success: true };
  }

  feed(): void {
    this._hunger = Hunger.create(Math.min(100, this._hunger.value + 20));
    this._happiness = Happiness.create(Math.min(100, this._happiness.value + 5));
    this._energy = Energy.create(Math.min(100, this._energy.value + 10));
    this._lastInteractionAt.set('FEED', new Date());
    this.addExperience(XP_PER_INTERACTION);
    this.calculateMood();
    this.touch();
  }

  play(): void {
    this._happiness = Happiness.create(Math.min(100, this._happiness.value + 25));
    this._energy = Energy.create(Math.max(0, this._energy.value - 15));
    this._lastInteractionAt.set('PLAY', new Date());
    this.addExperience(XP_PER_INTERACTION);
    this.calculateMood();
    this.touch();
  }

  bathe(): void {
    this._hygiene = Hygiene.create(Math.min(100, this._hygiene.value + 30));
    this._happiness = Happiness.create(Math.min(100, this._happiness.value + 5));
    this._lastInteractionAt.set('BATH', new Date());
    this.addExperience(XP_PER_INTERACTION);
    this.calculateMood();
    this.touch();
  }

  sleep(): void {
    this._isSleeping = true;
    this._lastInteractionAt.set('SLEEP', new Date());
    this.touch();
  }

  wakeUp(): void {
    this._isSleeping = false;
    this._energy = Energy.create(Math.min(100, this._energy.value + 40));
    this.touch();
  }

  decay(hoursPassed: number): void {
    const decayRate = 0.05;
    const decay = Math.floor(hoursPassed * decayRate * 100);

    this._hunger = Hunger.create(Math.max(0, this._hunger.value - decay));
    this._happiness = Happiness.create(Math.max(0, this._happiness.value - decay));
    this._energy = Energy.create(Math.max(0, this._energy.value - decay));
    this._hygiene = Hygiene.create(Math.max(0, this._hygiene.value - decay));

    if (this._isSleeping) {
      this._energy = Energy.create(Math.min(100, this._energy.value + Math.floor(hoursPassed * 20)));
      if (this._energy.value >= 100) {
        this._isSleeping = false;
      }
    }

    this.calculateMood();
    this.touch();
  }

  addExperience(amount: number): void {
    this._experience = Experience.create(this._experience.value + amount);
    this.checkEvolution();
  }

  private checkEvolution(): void {
    const currentLevel = this._level.value;
    let newLevel = currentLevel;

    for (const threshold of EVOLUTION_THRESHOLDS) {
      if (this._experience.value >= threshold * 100) {
        newLevel = threshold;
      }
    }

    if (newLevel > currentLevel) {
      this._level = PetLevel.create(newLevel);
    }
  }

  calculateMood(): PetMood {
    const avg = (this._hunger.value + this._happiness.value + this._energy.value + this._hygiene.value) / 4;

    if (this._isSleeping) {
      this._mood = PetMood.SLEEPING;
    } else if (avg >= 70) {
      this._mood = PetMood.HAPPY;
    } else if (avg >= 40) {
      this._mood = PetMood.NEUTRAL;
    } else if (avg >= 20) {
      this._mood = PetMood.SAD;
    } else {
      this._mood = PetMood.SICK;
    }

    return this._mood;
  }

  setModelUrl(url: string): void {
    this._modelUrl = url;
    this.touch();
  }

  setThumbnail(url: string): void {
    this._thumbnail = url;
    this.touch();
  }

  rename(newName: string): void {
    this._name = newName;
    this.touch();
  }

  toJSON() {
    return {
      id: this._id.value,
      name: this._name,
      species: this._species,
      userId: this._userId,
      coupleId: this._coupleId,
      level: this._level.value,
      experience: this._experience.value,
      hunger: this._hunger.value,
      happiness: this._happiness.value,
      energy: this._energy.value,
      hygiene: this._hygiene.value,
      mood: this._mood,
      isSleeping: this._isSleeping,
      modelUrl: this._modelUrl,
      thumbnail: this._thumbnail,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }
}
