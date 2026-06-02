export const COOLDOWN_MS = {
  FEED: 600_000,
  PLAY: 600_000,
  BATH: 600_000,
} as const;

export const DECAY_RATE_PER_HOUR = 0.05;

export const EVOLUTION_THRESHOLDS = [1, 5, 10, 20, 35, 50];

export const MAX_STAT_VALUE = 100;
export const MIN_STAT_VALUE = 0;

export const XP_PER_INTERACTION = 10;

export const API_VERSION = 'v1';
export const API_PREFIX = `/api/${API_VERSION}`;

export const MAX_PETS_PER_COUPLE = 6;

export const PET_SPECIES_LABELS: Record<string, string> = {
  CAT: 'Gato 🐱',
  DOG: 'Perro 🐶',
  RABBIT: 'Conejo 🐰',
  HAMSTER: 'Hámster 🐹',
  FOX: 'Zorro 🦊',
  PANDA: 'Panda 🐼',
  PENGUIN: 'Pingüino 🐧',
  DRAGON: 'Dragón 🐉',
  UNICORN: 'Unicornio 🦄',
  MONKEY: 'Mono 🐵',
  PIG: 'Cerdo 🐷',
  CUSTOM: 'Personalizado ✨',
};

export const CUSTOM_SPECIES_IMAGES: Record<string, string> = {
  MONKEY: '/pets/Monito.png',
  PENGUIN: '/pets/pinguino.png',
  PIG: '/pets/cerdo.png',
};

export const CLOTHING_SLOT_LABELS: Record<string, string> = {
  HAT: 'Sombrero',
  GLASSES: 'Gafas',
  TOP: 'Camiseta',
  BOTTOM: 'Pantalón',
  SHOES: 'Zapatos',
  ACCESSORY: 'Accesorio',
  WINGS: 'Alas',
  TAIL: 'Cola',
};
