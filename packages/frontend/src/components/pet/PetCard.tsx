'use client';

import { useState } from 'react';
import type { PetSummary } from '@amigitos/shared';
import { PET_SPECIES_LABELS } from '@amigitos/shared';
import { PetSprite } from './PetSprite';
import { Wardrobe } from './Wardrobe';
import { usePetStore } from '@/stores/pet.store';

interface PetCardProps {
  summary: PetSummary;
}

const moodEmoji: Record<string, string> = {
  HAPPY: '😊',
  NEUTRAL: '😐',
  SAD: '😢',
  SLEEPING: '💤',
  SICK: '🤒',
};

const moodLabels: Record<string, string> = {
  HAPPY: 'Feliz',
  NEUTRAL: 'Neutral',
  SAD: 'Triste',
  SLEEPING: 'Durmiendo',
  SICK: 'Enferma',
};

const moodColors: Record<string, string> = {
  HAPPY: 'text-yellow-400',
  NEUTRAL: 'text-slate-400',
  SAD: 'text-blue-400',
  SLEEPING: 'text-purple-400',
  SICK: 'text-red-400',
};

function MiniStatBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-500 ${color}`}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

export function PetCard({ summary }: PetCardProps) {
  const { petMap, performAction, outfitMap, refreshOutfitForPet } = usePetStore();
  const [showWardrobe, setShowWardrobe] = useState(false);
  const pet = petMap[summary.id];
  const outfit = outfitMap[summary.id] ?? null;

  const speciesLabel = PET_SPECIES_LABELS[summary.species] ?? summary.species;
  const speciesName = speciesLabel.includes(' ') ? speciesLabel.split(' ').slice(1).join(' ') : speciesLabel;
  const speciesEmoji = speciesLabel.includes(' ') ? speciesLabel.split(' ')[0] : '🐾';

  const handleAction = async (action: string) => {
    if (action === 'sleep' && pet?.isSleeping) {
      await performAction(summary.id, 'wake');
    } else {
      await performAction(summary.id, action as 'feed' | 'play' | 'bathe' | 'sleep');
    }
  };

  if (!pet) {
    return (
      <div className="bg-slate-800 rounded-2xl p-4 flex flex-col items-center gap-3 animate-pulse">
        <div className="w-24 h-24 bg-slate-700 rounded-full" />
        <div className="h-4 w-20 bg-slate-700 rounded" />
      </div>
    );
  }

  return (
    <div className="bg-slate-800 rounded-2xl p-4 flex flex-col items-center gap-3 transition-all hover:ring-1 hover:ring-green-500/30">
      {/* Sprite + Mood glow */}
      <div className="relative">
        <PetSprite species={pet.species} mood={pet.mood} isSleeping={pet.isSleeping} size={140} />
        {pet.isSleeping && (
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-xs text-purple-400 animate-pulse">
            💤 Durmiendo
          </div>
        )}
      </div>

      {/* Name + Species + Level */}
      <div className="text-center w-full">
        <h3 className="font-semibold text-sm truncate">{pet.name}</h3>
        <div className="flex items-center justify-center gap-1 text-xs text-slate-400">
          <span>{speciesEmoji}</span>
          <span>{speciesName}</span>
          <span className="text-slate-500">·</span>
          <span>Nv.{pet.level}</span>
        </div>
      </div>

      {/* Mood */}
      <div className={`text-xs font-medium ${moodColors[pet.mood] ?? 'text-slate-400'}`}>
        {moodEmoji[pet.mood] ?? ''} {moodLabels[pet.mood] ?? pet.mood}
      </div>

      {/* Mini stat bars */}
      <div className="w-full space-y-1.5">
        <div className="flex items-center gap-2 text-[10px] text-slate-500">
          <span>🍽️</span>
          <MiniStatBar value={pet.hunger} color="bg-orange-500" />
          <span className="w-6 text-right">{pet.hunger}%</span>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-slate-500">
          <span>🎾</span>
          <MiniStatBar value={pet.happiness} color="bg-yellow-500" />
          <span className="w-6 text-right">{pet.happiness}%</span>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-slate-500">
          <span>⚡</span>
          <MiniStatBar value={pet.energy} color="bg-blue-500" />
          <span className="w-6 text-right">{pet.energy}%</span>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-slate-500">
          <span>🧼</span>
          <MiniStatBar value={pet.hygiene} color="bg-cyan-500" />
          <span className="w-6 text-right">{pet.hygiene}%</span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="grid grid-cols-4 gap-1.5 w-full">
        <button
          onClick={() => handleAction('feed')}
          className="flex flex-col items-center gap-0.5 p-1.5 rounded-lg bg-orange-600/20 hover:bg-orange-600/40 text-orange-300 transition-all active:scale-95 text-[10px]"
          title="Alimentar"
        >
          <span className="text-sm">🍽️</span>
        </button>
        <button
          onClick={() => handleAction('play')}
          className="flex flex-col items-center gap-0.5 p-1.5 rounded-lg bg-yellow-600/20 hover:bg-yellow-600/40 text-yellow-300 transition-all active:scale-95 text-[10px]"
          title="Jugar"
        >
          <span className="text-sm">🎾</span>
        </button>
        <button
          onClick={() => handleAction('bathe')}
          className="flex flex-col items-center gap-0.5 p-1.5 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/40 text-cyan-300 transition-all active:scale-95 text-[10px]"
          title="Bañar"
        >
          <span className="text-sm">🛁</span>
        </button>
        <button
          onClick={() => handleAction(pet.isSleeping ? 'wake' : 'sleep')}
          className={`flex flex-col items-center gap-0.5 p-1.5 rounded-lg transition-all active:scale-95 text-[10px] ${
            pet.isSleeping
              ? 'bg-yellow-600/20 hover:bg-yellow-600/40 text-yellow-300'
              : 'bg-purple-600/20 hover:bg-purple-600/40 text-purple-300'
          }`}
          title={pet.isSleeping ? 'Despertar' : 'Dormir'}
        >
          <span className="text-sm">{pet.isSleeping ? '☀️' : '💤'}</span>
        </button>
      </div>

      {/* Wardrobe toggle */}
      <button
        onClick={() => setShowWardrobe(!showWardrobe)}
        className="text-[10px] text-slate-500 hover:text-slate-300 transition-colors"
      >
        {showWardrobe ? '▲ Cerrar armario' : '▼ Armario'}
      </button>

      {showWardrobe && (
        <div className="w-full">
          <Wardrobe
            petId={pet.id}
            species={pet.species}
            outfit={outfit}
            onEquip={() => refreshOutfitForPet(pet.id)}
          />
        </div>
      )}
    </div>
  );
}
