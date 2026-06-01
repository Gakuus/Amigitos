'use client';

import { useMemo } from 'react';
import type { PetState } from '@amigitos/shared';
import { Apple, Smile, Zap, Sparkles, TrendingDown } from 'lucide-react';

interface PetStatsProps {
  pet: PetState;
  simulated?: boolean;
}

const DECAY_PER_HOUR = 5;
const DECAY_PER_HOUR_SLEEP = 0;

const statDefs = [
  { label: 'Hambre', value: 'hunger' as const, icon: Apple, lowColor: 'bg-pastel-coral', midColor: 'bg-pastel-peach', highColor: 'bg-pastel-mint', glow: '#fb7185' },
  { label: 'Felicidad', value: 'happiness' as const, icon: Smile, lowColor: 'bg-pastel-coral', midColor: 'bg-pastel-yellow', highColor: 'bg-pastel-yellow', glow: '#fde68a' },
  { label: 'Energía', value: 'energy' as const, icon: Zap, lowColor: 'bg-pastel-coral', midColor: 'bg-pastel-sky', highColor: 'bg-pastel-sky', glow: '#7dd3fc' },
  { label: 'Higiene', value: 'hygiene' as const, icon: Sparkles, lowColor: 'bg-pastel-coral', midColor: 'bg-pastel-aqua', highColor: 'bg-pastel-mint', glow: '#a7f3d0' },
];

function barColor(pct: number, def: typeof statDefs[number]) {
  if (pct <= 25) return def.lowColor;
  if (pct <= 60) return def.midColor;
  return def.highColor;
}

function StatBar({ label, value, icon: Icon, def }: { label: string; value: number; icon: React.ElementType; def: typeof statDefs[number] }) {
  const pct = Math.max(0, Math.min(100, value));
  const isLow = pct <= 25;
  const isCritical = pct <= 10;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="flex items-center gap-1.5 text-pastel-foreground dark:text-slate-300">
          <Icon size={14} className={isLow ? 'animate-pulse-soft' : ''} />
          <span>{label}</span>
        </span>
        <span className={`font-bold tabular-nums transition-colors duration-500 ${
          isCritical ? 'text-red-500' : isLow ? 'text-pastel-coral' : 'text-pastel-purple'
        }`}>
          {pct}%
        </span>
      </div>
      <div className={`h-2.5 bg-pastel-border/50 dark:bg-slate-700/60 rounded-full overflow-hidden ring-1 ${
        isCritical ? 'ring-red-400/40' : isLow ? 'ring-pastel-coral/30' : 'ring-pastel-border/20 dark:ring-slate-600/20'
      }`}>
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-out ${barColor(pct, def)} ${
            isCritical ? 'animate-pulse-soft' : isLow ? 'animate-pulse-soft' : ''
          }`}
          style={{
            width: `${pct}%`,
            boxShadow: isCritical
              ? '0 0 8px rgba(239,68,68,0.4), inset 0 0 4px rgba(255,255,255,0.2)'
              : isLow
              ? '0 0 6px rgba(251,113,133,0.25), inset 0 0 3px rgba(255,255,255,0.15)'
              : 'inset 0 0 3px rgba(255,255,255,0.15)',
          }}
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

function avgStats(pet: PetState) {
  return Math.round((pet.hunger + pet.happiness + pet.energy + pet.hygiene) / 4);
}

export function PetStats({ pet, simulated }: PetStatsProps) {
  const avg = useMemo(() => avgStats(pet), [pet]);
  const overallColor = avg <= 25 ? 'from-red-400/30 to-pastel-coral/20' : avg <= 50 ? 'from-pastel-yellow/20 to-pastel-peach/20' : 'from-pastel-purple/20 to-pastel-pink/20';

  return (
    <div className={`bg-white/80 dark:bg-surface-card/80 border border-pastel-border/20 dark:border-surface-border/50 rounded-3xl p-5 space-y-4 shadow-xl transition-all duration-700 ${
      avg <= 25 ? 'ring-2 ring-red-400/20' : avg <= 50 ? 'ring-1 ring-pastel-yellow/20' : ''
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 bg-gradient-to-br ${overallColor} rounded-xl flex items-center justify-center transition-all duration-700`}>
            <span className="text-xl">{moodEmoji[pet.mood]}</span>
          </div>
          <div>
            <h2 className="text-base font-bold font-display text-pastel-foreground dark:text-white">{pet.name}</h2>
            <span className="text-xs text-pastel-muted dark:text-slate-500">Nv. {pet.level}</span>
          </div>
        </div>
        <span className={`text-xs font-semibold px-3 py-1 rounded-full border transition-all duration-500 ${moodColors[pet.mood] ?? 'text-pastel-muted bg-pastel-border/20'}`}>
          {moodLabels[pet.mood] ?? pet.mood}
        </span>
      </div>

      <div className="space-y-3">
        {statDefs.map((stat) => (
          <StatBar key={stat.value} label={stat.label} value={pet[stat.value]} icon={stat.icon} def={stat} />
        ))}
      </div>

      {simulated && (
        <div className="flex items-center justify-center gap-1 text-[10px] text-pastel-muted dark:text-slate-500">
          <TrendingDown size={10} />
          <span>~{pet.isSleeping ? '0' : DECAY_PER_HOUR}%/h</span>
        </div>
      )}

      {pet.isSleeping && (
        <div className="text-center text-sm text-pastel-purple animate-pulse-soft bg-pastel-purple/10 rounded-xl py-2 border border-pastel-purple/20">
          💤 Durmiendo... <span className="text-[10px] opacity-60">+20 energía/h</span>
        </div>
      )}
    </div>
  );
}
