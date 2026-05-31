export enum PetSpecies {
  CAT = 'CAT',
  DOG = 'DOG',
  RABBIT = 'RABBIT',
  HAMSTER = 'HAMSTER',
  FOX = 'FOX',
  PANDA = 'PANDA',
  PENGUIN = 'PENGUIN',
  DRAGON = 'DRAGON',
  UNICORN = 'UNICORN',
  CUSTOM = 'CUSTOM',
}

export enum PetMood {
  HAPPY = 'HAPPY',
  NEUTRAL = 'NEUTRAL',
  SAD = 'SAD',
  SLEEPING = 'SLEEPING',
  SICK = 'SICK',
}

export enum CoupleStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  DISSOLVED = 'DISSOLVED',
}

export enum InteractionType {
  FEED = 'FEED',
  PLAY = 'PLAY',
  BATH = 'BATH',
  SLEEP = 'SLEEP',
}

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

export interface PetState {
  id: string;
  name: string;
  species: PetSpecies;
  level: number;
  experience: number;
  hunger: number;
  happiness: number;
  energy: number;
  hygiene: number;
  mood: PetMood;
  isSleeping: boolean;
  modelUrl: string | null;
  thumbnail: string | null;
  isActive: boolean;
}

export interface PetSummary {
  id: string;
  name: string;
  species: PetSpecies;
  level: number;
  mood: PetMood;
  thumbnail: string | null;
  isSleeping: boolean;
}

export interface WardrobeItemInfo {
  id: string;
  name: string;
  description: string;
  slot: ClothingSlot;
  rarity: ClothingRarity;
  modelUrl: string;
  thumbnail: string;
  species: string[];
  unlockCondition: string | null;
}

export interface PetOutfitInfo {
  petId: string;
  equipped: Record<string, string>; // slot -> itemId
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  coupleId: string | null;
}

export interface CoupleInfo {
  id: string;
  status: CoupleStatus;
  user1Id: string;
  user2Id: string;
  invitedBy: string;
  acceptedAt: string | null;
}

export interface WsEvent {
  event: string;
  data: Record<string, unknown>;
}
