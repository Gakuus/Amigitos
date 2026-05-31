import { create } from 'zustand';
import type { PetState, PetSummary, PetOutfitInfo } from '@amigitos/shared';
import { api } from '@/lib/api';
import { connectToPetRoom, disconnectFromPetRoom, getSocket } from '@/lib/socket';

interface PetStore {
  pets: PetSummary[];
  pet: PetState | null;
  outfit: PetOutfitInfo | null;
  activePetId: string | null;
  loading: boolean;
  error: string | null;
  fetchPets: () => Promise<void>;
  selectPet: (petId: string) => Promise<void>;
  adoptPet: (name: string, species: string) => Promise<string | null>;
  feed: () => Promise<void>;
  play: () => Promise<void>;
  bathe: () => Promise<void>;
  sleep: () => Promise<void>;
  wake: () => Promise<void>;
  refreshOutfit: () => Promise<void>;
}

export const usePetStore = create<PetStore>((set, get) => ({
  pets: [],
  pet: null,
  outfit: null,
  activePetId: null,
  loading: false,
  error: null,

  fetchPets: async () => {
    set({ loading: true, error: null });
    try {
      const couple = await api.getMyCouple().catch(() => null);
      if (!couple) {
        set({ pets: [], loading: false });
        return;
      }
      const pets = await api.getPetsByCouple(couple.id);
      set({
        pets: pets.map((p: PetState) => ({
          id: p.id,
          name: p.name,
          species: p.species,
          level: p.level,
          mood: p.mood,
          thumbnail: p.thumbnail,
          isSleeping: p.isSleeping,
        })),
        loading: false,
      });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to fetch pets', loading: false });
    }
  },

  selectPet: async (petId: string) => {
    const prevId = get().activePetId;
    if (prevId) {
      disconnectFromPetRoom(prevId);
    }

    set({ activePetId: petId, loading: true });
    try {
      const [pet, outfit] = await Promise.all([
        api.getPet(petId),
        api.getPetOutfit(petId),
      ]);
      connectToPetRoom(petId);

      const socket = getSocket();
      socket.on('pet:state', (data: Record<string, unknown>) => {
        if (data.petId === petId) {
          set((state) => ({
            pet: state.pet ? { ...state.pet, ...data } : state.pet,
          }));
        }
      });

      set({ pet, outfit, loading: false });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to select pet', loading: false });
    }
  },

  adoptPet: async (name: string, species: string) => {
    try {
      const pet = await api.adoptPet(name, species);
      await get().fetchPets();
      return pet.id;
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to adopt' });
      return null;
    }
  },

  feed: async () => {
    const pet = get().pet;
    if (!pet) return;
    try {
      const updated = await api.feedPet(pet.id);
      set({ pet: updated });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to feed' });
    }
  },

  play: async () => {
    const pet = get().pet;
    if (!pet) return;
    try {
      const updated = await api.playWithPet(pet.id);
      set({ pet: updated });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to play' });
    }
  },

  bathe: async () => {
    const pet = get().pet;
    if (!pet) return;
    try {
      const updated = await api.bathePet(pet.id);
      set({ pet: updated });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to bathe' });
    }
  },

  sleep: async () => {
    const pet = get().pet;
    if (!pet) return;
    try {
      const updated = await api.sleepPet(pet.id);
      set({ pet: updated });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to sleep' });
    }
  },

  wake: async () => {
    const pet = get().pet;
    if (!pet) return;
    try {
      const updated = await api.wakePet(pet.id);
      set({ pet: updated });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to wake' });
    }
  },

  refreshOutfit: async () => {
    const petId = get().activePetId;
    if (!petId) return;
    try {
      const outfit = await api.getPetOutfit(petId);
      set({ outfit });
    } catch (err) {
      console.error('Failed to refresh outfit:', err);
    }
  },
}));
