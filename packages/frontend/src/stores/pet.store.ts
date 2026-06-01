import { create } from 'zustand';
import type { PetState, PetSummary, PetOutfitInfo } from '@amigitos/shared';
import { api } from '@/lib/api';
import { connectToPetRoom, disconnectFromPetRoom, getSocket } from '@/lib/socket';

type PetAction = 'feed' | 'play' | 'bathe' | 'sleep' | 'wake';

const POLL_INTERVAL_MS = 30000;

interface PetStore {
  pets: PetSummary[];
  pet: PetState | null;
  petMap: Record<string, PetState>;
  outfit: PetOutfitInfo | null;
  outfitMap: Record<string, PetOutfitInfo>;
  activePetId: string | null;
  loading: boolean;
  error: string | null;
  fetchPets: () => Promise<void>;
  selectPet: (petId: string) => Promise<void>;
  adoptPet: (name: string, species: string) => Promise<string | null>;
  performAction: (petId: string, action: PetAction, itemId?: string) => Promise<void>;
  feed: (itemId?: string) => Promise<void>;
  play: (itemId?: string) => Promise<void>;
  bathe: (itemId?: string) => Promise<void>;
  sleep: () => Promise<void>;
  wake: () => Promise<void>;
  refreshOutfit: () => Promise<void>;
  refreshOutfitForPet: (petId: string) => Promise<void>;
}

let pollInterval: ReturnType<typeof setInterval> | null = null;

export const usePetStore = create<PetStore>((set, get) => ({
  pets: [],
  pet: null,
  petMap: {},
  outfit: null,
  outfitMap: {},
  activePetId: null,
  loading: false,
  error: null,

  fetchPets: async () => {
    set({ loading: true, error: null });
    try {
      let petList: PetState[];
      const couple = await api.getMyCouple().catch(() => null);
      if (couple) {
        petList = await api.getPetsByCouple(couple.id);
      } else {
        petList = await api.getMyPets();
      }
      const petMap: Record<string, PetState> = {};
      const summaries: PetSummary[] = petList.map((p: PetState) => {
        petMap[p.id] = p;
        return {
          id: p.id,
          name: p.name,
          species: p.species,
          level: p.level,
          mood: p.mood,
          thumbnail: p.thumbnail,
          isSleeping: p.isSleeping,
        };
      });
      set({ pets: summaries, petMap, loading: false });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to fetch pets', loading: false });
    }
  },

  selectPet: async (petId: string) => {
    const prevId = get().activePetId;
    if (prevId) {
      disconnectFromPetRoom(prevId);
    }

    if (pollInterval) {
      clearInterval(pollInterval);
      pollInterval = null;
    }

    set({ activePetId: petId, loading: true });
    try {
      const [petData, outfitData] = await Promise.all([
        api.getPet(petId),
        api.getPetOutfit(petId),
      ]);
      connectToPetRoom(petId);

      const socket = getSocket();
      socket.on('pet:state', (eventData: Record<string, unknown>) => {
        if (eventData.petId === petId) {
          set((state) => {
            const updatedPet = state.pet ? { ...state.pet, ...eventData } as PetState : state.pet;
            const updatedPetFromMap = state.petMap[petId]
              ? { ...state.petMap[petId], ...eventData } as PetState
              : state.petMap[petId];
            return {
              pet: updatedPet,
              petMap: updatedPetFromMap
                ? { ...state.petMap, [petId]: updatedPetFromMap }
                : state.petMap,
            };
          });
        }
      });

      set({
        pet: petData,
        outfit: outfitData,
        petMap: { ...get().petMap, [petId]: petData },
        outfitMap: { ...get().outfitMap, [petId]: outfitData },
        loading: false,
      });

      pollInterval = setInterval(async () => {
        const currentPetId = get().activePetId;
        if (!currentPetId) return;
        try {
          const freshPet = await api.getPet(currentPetId);
          set((state) => ({
            pet: freshPet,
            petMap: { ...state.petMap, [currentPetId]: freshPet },
          }));
        } catch {
          // ignore polling errors
        }
      }, POLL_INTERVAL_MS);
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to select pet', loading: false });
    }
  },

  adoptPet: async (name: string, species: string) => {
    try {
      const newPet = await api.adoptPet(name, species);
      await get().fetchPets();
      return newPet.id;
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to adopt' });
      return null;
    }
  },

  performAction: async (petId: string, action: PetAction, itemId?: string) => {
    try {
      let updated: PetState;
      switch (action) {
        case 'feed': updated = await api.feedPet(petId, itemId); break;
        case 'play': updated = await api.playWithPet(petId, itemId); break;
        case 'bathe': updated = await api.bathePet(petId, itemId); break;
        case 'sleep': updated = await api.sleepPet(petId); break;
        case 'wake': updated = await api.wakePet(petId); break;
      }
      set((state) => ({
        petMap: { ...state.petMap, [petId]: updated },
        pets: state.pets.map((p) =>
          p.id === petId
            ? { ...p, mood: updated.mood, level: updated.level, isSleeping: updated.isSleeping }
            : p,
        ),
        pet: state.pet?.id === petId ? updated : state.pet,
        outfitMap: state.activePetId === petId ? state.outfitMap : state.outfitMap,
      }));
    } catch (err) {
      set({ error: err instanceof Error ? err.message : `Failed to ${action}` });
    }
  },

  feed: async (itemId?: string) => {
    const pet = get().pet;
    if (!pet) return;
    await get().performAction(pet.id, 'feed', itemId);
  },

  play: async (itemId?: string) => {
    const pet = get().pet;
    if (!pet) return;
    await get().performAction(pet.id, 'play', itemId);
  },

  bathe: async (itemId?: string) => {
    const pet = get().pet;
    if (!pet) return;
    await get().performAction(pet.id, 'bathe', itemId);
  },

  sleep: async () => {
    const pet = get().pet;
    if (!pet) return;
    await get().performAction(pet.id, 'sleep');
  },

  wake: async () => {
    const pet = get().pet;
    if (!pet) return;
    await get().performAction(pet.id, 'wake');
  },

  refreshOutfit: async () => {
    const petId = get().activePetId;
    if (!petId) return;
    await get().refreshOutfitForPet(petId);
  },

  refreshOutfitForPet: async (petId: string) => {
    try {
      const outfitData = await api.getPetOutfit(petId);
      set((state) => ({
        outfit: state.activePetId === petId ? outfitData : state.outfit,
        outfitMap: { ...state.outfitMap, [petId]: outfitData },
      }));
    } catch (err) {
      console.error('Failed to refresh outfit:', err);
    }
  },
}));
