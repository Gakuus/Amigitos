import type { PetState, UserProfile, CoupleInfo, WardrobeItemInfo, PetOutfitInfo, ShopItemInfo, InventoryItem, UserBalance } from '@amigitos/shared';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api/v1';

class ApiError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const res = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(res.status, body.code ?? 'UNKNOWN', body.message ?? res.statusText);
  }

  return res.json();
}

export const api = {
  // Auth
  register: (email: string, name: string, password: string) =>
    request<{ user: UserProfile; accessToken: string; refreshToken: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, name, password }),
    }),

  login: (email: string, password: string) =>
    request<{ user: UserProfile; accessToken: string; refreshToken: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  // Pets
  adoptPet: (name: string, species: string) =>
    request<PetState>('/pets/adopt', {
      method: 'POST',
      body: JSON.stringify({ name, species }),
    }),

  getPet: (id: string) => request<PetState>(`/pets/${id}`),

  getPetsByCouple: (coupleId: string) =>
    request<PetState[]>(`/pets/couple/${coupleId}`),

  feedPet: (id: string, itemId?: string) =>
    request<PetState>(`/pets/${id}/feed`, {
      method: 'POST',
      body: JSON.stringify({ itemId }),
    }),

  playWithPet: (id: string, itemId?: string) =>
    request<PetState>(`/pets/${id}/play`, {
      method: 'POST',
      body: JSON.stringify({ itemId }),
    }),

  bathePet: (id: string, itemId?: string) =>
    request<PetState>(`/pets/${id}/bathe`, {
      method: 'POST',
      body: JSON.stringify({ itemId }),
    }),

  sleepPet: (id: string) =>
    request<PetState>(`/pets/${id}/sleep`, { method: 'POST' }),

  wakePet: (id: string) =>
    request<PetState>(`/pets/${id}/wake`, { method: 'POST' }),

  // Wardrobe
  getWardrobeItems: (species?: string) =>
    request<WardrobeItemInfo[]>(`/wardrobe${species ? `?species=${species}` : ''}`),

  getPetOutfit: (petId: string) =>
    request<PetOutfitInfo>(`/pets/${petId}/outfit`),

  equipItem: (petId: string, itemId: string) =>
    request<PetOutfitInfo>(`/pets/${petId}/equip`, {
      method: 'POST',
      body: JSON.stringify({ itemId }),
    }),

  unequipItem: (petId: string, slot: string) =>
    request<PetOutfitInfo>(`/pets/${petId}/unequip`, {
      method: 'POST',
      body: JSON.stringify({ slot }),
    }),

  // Couples
  invitePartner: (userEmail: string) =>
    request<CoupleInfo>('/couples/invite', {
      method: 'POST',
      body: JSON.stringify({ userEmail }),
    }),

  acceptInvitation: (id: string) =>
    request<CoupleInfo>(`/couples/${id}/accept`, { method: 'POST' }),

  getMyCouple: () => request<CoupleInfo>('/couples/mine'),

  getPendingInvitations: () =>
    request<CoupleInfo[]>('/couples/pending'),

  dissolveCouple: (id: string) =>
    request<{ success: boolean }>(`/couples/${id}/dissolve`, { method: 'POST' }),

  // Users
  getMyPets: () => request<PetState[]>('/pets/mine'),

  getMe: () => request<UserProfile>('/auth/me'),

  // Shop
  getShopItems: () => request<ShopItemInfo[]>('/shop/items'),

  buyShopItem: (itemType: string, itemId: string) =>
    request<{ success: boolean; name: string; price: number; coins: number }>(`/shop/buy/${itemType}/${itemId}`, {
      method: 'POST',
    }),

  getInventory: () => request<InventoryItem[]>('/shop/inventory'),

  getBalance: () => request<UserBalance>('/shop/balance'),

  useConsumable: (itemId: string, petId: string) =>
    request<{ success: boolean; pet: PetState }>(`/shop/use/${itemId}`, {
      method: 'POST',
      body: JSON.stringify({ petId }),
    }),

  // Games
  claimGameReward: (gameType: string, score: number) =>
    request<{ coins: number; totalCoins: number; gameType: string; won: boolean }>('/games/claim', {
      method: 'POST',
      body: JSON.stringify({ gameType, score }),
    }),

  getGameStats: () =>
    request<{ results: unknown[]; totals: unknown[]; cooldowns: Record<string, number> }>('/games/stats'),
};
