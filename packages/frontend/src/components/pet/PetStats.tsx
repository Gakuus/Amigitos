'use client';

import type { PetState } from '@amigitos/shared';

interface PetStatsProps {
  pet: PetState;
}

function StatBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-slate-400">{label}</span>
        <span className="text-slate-300">{value}%</span>
      </div>
      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

const moodLabels: Record<string, string> = {
  HAPPY: 'Feliz',
  NEUTRAL: 'Neutral',
  SAD: 'Triste',
  SLEEPING: 'Durmiendo',
  SICK: 'Enferma',
};

const moodColors: Record<string, string> = {
  HAPPY: 'text-yellow-400',
  NEUTRAL: 'text-gray-400',
  SAD: 'text-blue-400',
  SLEEPING: 'text-purple-400',
  SICK: 'text-red-400',
};

export function PetStats({ pet }: PetStatsProps) {
  return (
    <div className="bg-slate-800 rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">{pet.name}</h2>
          <span className="text-sm text-slate-400">Nv. {pet.level}</span>
        </div>
        <span className={`text-sm font-medium ${moodColors[pet.mood] ?? 'text-slate-400'}`}>
          {moodLabels[pet.mood] ?? pet.mood}
        </span>
      </div>

      <StatBar label="Hambre" value={pet.hunger} color="bg-orange-500" />
      <StatBar label="Felicidad" value={pet.happiness} color="bg-yellow-500" />
      <StatBar label="Energía" value={pet.energy} color="bg-blue-500" />
      <StatBar label="Higiene" value={pet.hygiene} color="bg-cyan-500" />

      {pet.isSleeping && (
        <div className="text-center text-sm text-purple-400 animate-pulse">
          💤 Durmiendo...
        </div>
      )}
    </div>
  );
}
