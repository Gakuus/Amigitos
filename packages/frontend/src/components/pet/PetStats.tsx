'use client';

import type { PetState } from '@amigitos/shared';
import { Apple, Smile, Zap, Sparkles } from 'lucide-react';

interface PetStatsProps {
  pet: PetState;
}

const statDefs = [
  { label: 'Hambre', value: 'hunger' as const, icon: Apple, color: 'bg-warm-500', glow: '#f97316' },
  { label: 'Felicidad', value: 'happiness' as const, icon: Smile, color: 'bg-pet-happy', glow: '#fbbf24' },
  { label: 'Energía', value: 'energy' as const, icon: Zap, color: 'bg-blue-500', glow: '#3b82f6' },
  { label: 'Higiene', value: 'hygiene' as const, icon: Sparkles, color: 'bg-cyan-500', glow: '#06b6d4' },
];

function StatBar({ label, value, icon: Icon, color }: { label: string; value: number; icon: React.ElementType; color: string }) {
  const pct = Math.max(0, Math.min(100, value));
  const isLow = pct <= 25;
  const isHigh = pct >= 80;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="flex items-center gap-1.5 text-slate-300">
          <Icon size={14} />
          <span>{label}</span>
        </span>
        <span className={`font-bold tabular-nums ${isLow ? 'text-coral-400' : isHigh ? 'text-brand-400' : 'text-slate-300'}`}>
          {pct}%
        </span>
      </div>
      <div className="h-2.5 bg-slate-700/60 rounded-full overflow-hidden ring-1 ring-slate-600/20">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${color} ${isLow ? 'animate-pulse-soft' : ''}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

const moodLabels: Record<string, string> = {
  HAPPY: 'Feliz', NEUTRAL: 'Neutral', SAD: 'Triste', SLEEPING: 'Durmiendo', SICK: 'Enferma',
};

const moodColors: Record<string, string> = {
  HAPPY: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
  NEUTRAL: 'text-slate-400 bg-slate-500/10 border-slate-500/20',
  SAD: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  SLEEPING: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  SICK: 'text-red-400 bg-red-500/10 border-red-500/20',
};

const moodEmoji: Record<string, string> = {
  HAPPY: '😊', NEUTRAL: '😐', SAD: '😢', SLEEPING: '💤', SICK: '🤒',
};

export function PetStats({ pet }: PetStatsProps) {
  return (
    <div className="bg-surface-card/80 border border-surface-border/50 rounded-3xl p-5 space-y-4 shadow-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-brand-400/20 to-emerald-500/20 rounded-xl flex items-center justify-center">
            <span className="text-xl">{moodEmoji[pet.mood]}</span>
          </div>
          <div>
            <h2 className="text-base font-bold font-display text-white">{pet.name}</h2>
            <span className="text-xs text-slate-500">Nv. {pet.level}</span>
          </div>
        </div>
        <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${moodColors[pet.mood] ?? 'text-slate-400 bg-slate-500/10'}`}>
          {moodLabels[pet.mood] ?? pet.mood}
        </span>
      </div>

      <div className="space-y-3">
        {statDefs.map((stat) => (
          <StatBar key={stat.value} label={stat.label} value={pet[stat.value]} icon={stat.icon} color={stat.color} />
        ))}
      </div>

      {pet.isSleeping && (
        <div className="text-center text-sm text-purple-400 animate-pulse-soft bg-purple-500/10 rounded-xl py-2 border border-purple-500/20">
          💤 Durmiendo...
        </div>
      )}
    </div>
  );
}
