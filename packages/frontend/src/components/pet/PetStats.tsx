'use client';

import type { PetState } from '@amigitos/shared';
import { Apple, Smile, Zap, Sparkles } from 'lucide-react';

interface PetStatsProps {
  pet: PetState;
}

const statDefs = [
  { label: 'Hambre', value: 'hunger' as const, icon: Apple, color: 'bg-pastel-coral', glow: '#fb7185' },
  { label: 'Felicidad', value: 'happiness' as const, icon: Smile, color: 'bg-pastel-yellow', glow: '#fde68a' },
  { label: 'Energía', value: 'energy' as const, icon: Zap, color: 'bg-pastel-sky', glow: '#7dd3fc' },
  { label: 'Higiene', value: 'hygiene' as const, icon: Sparkles, color: 'bg-pastel-mint', glow: '#a7f3d0' },
];

function StatBar({ label, value, icon: Icon, color }: { label: string; value: number; icon: React.ElementType; color: string }) {
  const pct = Math.max(0, Math.min(100, value));
  const isLow = pct <= 25;
  const isHigh = pct >= 80;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="flex items-center gap-1.5 text-pastel-foreground dark:text-slate-300">
          <Icon size={14} />
          <span>{label}</span>
        </span>
        <span className={`font-bold tabular-nums ${isLow ? 'text-pastel-coral' : isHigh ? 'text-pastel-purple' : 'text-pastel-muted dark:text-slate-400'}`}>
          {pct}%
        </span>
      </div>
      <div className="h-2.5 bg-pastel-border/50 dark:bg-slate-700/60 rounded-full overflow-hidden ring-1 ring-pastel-border/20 dark:ring-slate-600/20">
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
  HAPPY: 'text-pastel-yellow bg-pastel-yellow/10 border-pastel-yellow/20',
  NEUTRAL: 'text-pastel-muted bg-pastel-border/20 border-pastel-border/30',
  SAD: 'text-pastel-sky bg-pastel-sky/10 border-pastel-sky/20',
  SLEEPING: 'text-pastel-purple bg-pastel-purple/10 border-pastel-purple/20',
  SICK: 'text-pastel-coral bg-pastel-coral/10 border-pastel-coral/20',
};

const moodEmoji: Record<string, string> = {
  HAPPY: '😊', NEUTRAL: '😐', SAD: '😢', SLEEPING: '💤', SICK: '🤒',
};

export function PetStats({ pet }: PetStatsProps) {
  return (
    <div className="bg-white/80 dark:bg-surface-card/80 border border-pastel-border/20 dark:border-surface-border/50 rounded-3xl p-5 space-y-4 shadow-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-pastel-purple/20 to-pastel-pink/20 rounded-xl flex items-center justify-center">
            <span className="text-xl">{moodEmoji[pet.mood]}</span>
          </div>
          <div>
            <h2 className="text-base font-bold font-display text-pastel-foreground dark:text-white">{pet.name}</h2>
            <span className="text-xs text-pastel-muted dark:text-slate-500">Nv. {pet.level}</span>
          </div>
        </div>
        <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${moodColors[pet.mood] ?? 'text-pastel-muted bg-pastel-border/20'}`}>
          {moodLabels[pet.mood] ?? pet.mood}
        </span>
      </div>

      <div className="space-y-3">
        {statDefs.map((stat) => (
          <StatBar key={stat.value} label={stat.label} value={pet[stat.value]} icon={stat.icon} color={stat.color} />
        ))}
      </div>

      {pet.isSleeping && (
        <div className="text-center text-sm text-pastel-purple animate-pulse-soft bg-pastel-purple/10 rounded-xl py-2 border border-pastel-purple/20">
          💤 Durmiendo...
        </div>
      )}
    </div>
  );
}
