import { create } from 'zustand';
import type { ShopItemInfo, InventoryItem, UserBalance, PetState } from '@amigitos/shared';
import { api } from '@/lib/api';

interface ShopStore {
  items: ShopItemInfo[];
  inventory: InventoryItem[];
  balance: UserBalance | null;
  loading: boolean;
  buying: boolean;
  using: boolean;
  error: string | null;
  success: string | null;

  fetchItems: () => Promise<void>;
  fetchInventory: () => Promise<void>;
  fetchBalance: () => Promise<void>;
  buyItem: (itemType: string, itemId: string) => Promise<boolean>;
  applyConsumable: (itemId: string, petId: string) => Promise<boolean>;
  clearMessages: () => void;
}

export const useShopStore = create<ShopStore>((set, get) => ({
  items: [],
  inventory: [],
  balance: null,
  loading: false,
  buying: false,
  using: false,
  error: null,
  success: null,

  fetchItems: async () => {
    set({ loading: true, error: null });
    try {
      const items = await api.getShopItems();
      set({ items, loading: false });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to fetch shop items', loading: false });
    }
  },

  fetchInventory: async () => {
    try {
      const inventory = await api.getInventory();
      set({ inventory });
    } catch (err) {
      console.error('Failed to fetch inventory:', err);
    }
  },

  fetchBalance: async () => {
    try {
      const balance = await api.getBalance();
      set({ balance });
    } catch (err) {
      console.error('Failed to fetch balance:', err);
    }
  },

  buyItem: async (itemType: string, itemId: string) => {
    set({ buying: true, error: null, success: null });
    try {
      const result = await api.buyShopItem(itemType, itemId);
      set({ balance: { coins: result.coins }, buying: false, success: `¡${result.name} comprado!` });
      if (itemType === 'CONSUMABLE') {
        await get().fetchInventory();
      }
      return true;
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Failed to buy item',
        buying: false,
      });
      return false;
    }
  },

  applyConsumable: async (itemId: string, petId: string) => {
    set({ using: true, error: null });
    try {
      const result = await api.useConsumable(itemId, petId);
      set({ using: false, success: '¡Usado con éxito!' });
      await get().fetchInventory();
      return true;
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Failed to use item',
        using: false,
      });
      return false;
    }
  },

  clearMessages: () => set({ error: null, success: null }),
}));
