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
  return (
    <div className="bg-slate-800 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">
          Mis Mascotas ({pets.length})
        </h3>
        {pets.length < 6 && (
          <button
            onClick={onAdopt}
            className="text-xs px-3 py-1.5 bg-green-600 hover:bg-green-500 rounded-lg transition-colors"
          >
            + Adoptar
          </button>
        )}
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {pets.map((pet) => (
          <button
            key={pet.id}
            onClick={() => onSelect(pet.id)}
            className={`flex flex-col items-center gap-1 min-w-[80px] p-3 rounded-xl transition-all ${
              activePetId === pet.id
                ? 'bg-green-600/30 ring-2 ring-green-500'
                : 'bg-slate-700/50 hover:bg-slate-700'
            }`}
          >
            <div className="w-12 h-12 bg-slate-600 rounded-full flex items-center justify-center text-xl">
              {pet.thumbnail ? (
                <img src={pet.thumbnail} alt={pet.name} className="w-full h-full rounded-full object-cover" />
              ) : (
                PET_SPECIES_LABELS[pet.species]?.split(' ')[1] ?? '🐾'
              )}
            </div>
            <span className="text-xs font-medium truncate w-full text-center">{pet.name}</span>
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-slate-400">Nv.{pet.level}</span>
              <span className="text-xs">{moodEmoji[pet.mood] ?? ''}</span>
            </div>
          </button>
        ))}

        {pets.length === 0 && (
          <div className="text-center py-6 w-full text-sm text-slate-500">
            Aún no tienes mascotas. ¡Adopta una!
          </div>
        )}
      </div>
    </div>
  );
}
