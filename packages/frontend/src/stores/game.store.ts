import { create } from 'zustand';
import { api } from '@/lib/api';

interface GameStore {
  cooldowns: Record<string, number>;
  claiming: string | null;
  claimReward: (gameType: string, score: number) => Promise<number | null>;
  fetchCooldowns: () => Promise<void>;
}

export const useGameStore = create<GameStore>((set) => ({
  cooldowns: {},
  claiming: null,

  claimReward: async (gameType: string, score: number) => {
    set({ claiming: gameType });
    try {
      const result = await api.claimGameReward(gameType, score);
      set((s) => ({
        cooldowns: { ...s.cooldowns, [gameType]: 60 },
        claiming: null,
      }));
      return result.coins;
    } catch {
      set({ claiming: null });
      return null;
    }
  },

  fetchCooldowns: async () => {
    try {
      const stats = await api.getGameStats();
      set({ cooldowns: stats.cooldowns });
    } catch {
      // ignore
    }
  },
}));
