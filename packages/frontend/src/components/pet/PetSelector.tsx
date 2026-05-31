'use client';

import type { PetSummary } from '@amigitos/shared';
import { PET_SPECIES_LABELS } from '@amigitos/shared';

interface PetSelectorProps {
  pets: PetSummary[];
  activePetId: string | null;
  onSelect: (petId: string) => void;
  onAdopt: () => void;
}

const moodEmoji: Record<string, string> = {
  HAPPY: '😊',
  NEUTRAL: '😐',
  SAD: '😢',
  SLEEPING: '💤',
  SICK: '🤒',
};

export function PetSelector({ pets, activePetId, onSelect, onAdopt }: PetSelectorProps) {
  if (pets.length === 0) return null;

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 px-1 scrollbar-none">
      {pets.map((pet) => (
        <button
          key={pet.id}
          onClick={() => onSelect(pet.id)}
          className={`flex-shrink-0 flex flex-col items-center gap-1.5 px-4 py-3 rounded-2xl transition-all ${
            activePetId === pet.id
              ? 'bg-gradient-to-b from-green-500/20 to-green-600/10 ring-2 ring-green-500/50 shadow-lg shadow-green-500/10 scale-105'
              : 'bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700/30'
          }`}
        >
          <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl transition-all ${
            activePetId === pet.id
              ? 'bg-gradient-to-br from-green-400 to-emerald-500'
              : 'bg-slate-700/80'
          }`}>
            {PET_SPECIES_LABELS[pet.species]?.split(' ')[1] ?? '🐾'}
          </div>
          <div className="text-center min-w-0 max-w-[72px]">
            <p className={`text-xs font-semibold truncate ${activePetId === pet.id ? 'text-white' : 'text-slate-300'}`}>
              {pet.name}
            </p>
            <div className="flex items-center justify-center gap-1 text-[10px]">
              <span className="text-slate-500">Nv.{pet.level}</span>
              <span>{moodEmoji[pet.mood] ?? ''}</span>
            </div>
          </div>
          {pet.isSleeping && (
            <span className="text-xs absolute top-1 right-1 animate-pulse">💤</span>
          )}
        </button>
      ))}

      <button
        onClick={onAdopt}
        className="flex-shrink-0 flex flex-col items-center justify-center gap-1 w-[88px] h-[96px] rounded-2xl border-2 border-dashed border-slate-600/50 text-slate-500 hover:text-green-400 hover:border-green-500/50 active:scale-95 transition-all"
      >
        <span className="text-xl">+</span>
        <span className="text-[10px] font-medium">Adoptar</span>
      </button>
    </div>
  );
}
