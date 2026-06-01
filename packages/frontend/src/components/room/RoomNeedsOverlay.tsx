'use client';

import type { PetState } from '@amigitos/shared';
import { Apple, Smile, Zap, Sparkles } from 'lucide-react';

interface RoomNeedsOverlayProps {
  pet: PetState;
}

interface NeedDef {
  key: keyof PetState;
  Icon: React.ElementType;
}

const needs: NeedDef[] = [
  { key: 'hunger', Icon: Apple },
  { key: 'happiness', Icon: Smile },
  { key: 'energy', Icon: Zap },
  { key: 'hygiene', Icon: Sparkles },
];

function color(val: number): string {
  if (val <= 15) return 'bg-red-500';
  if (val <= 30) return 'bg-pastel-coral';
  if (val <= 60) return 'bg-pastel-yellow';
  return 'bg-pastel-mint';
}

export function RoomNeedsOverlay({ pet }: RoomNeedsOverlayProps) {
  const critical = needs.some((n) => pet[n.key] as number <= 15);
  return (
    <div className={`flex gap-2 px-2.5 py-1.5 rounded-xl backdrop-blur-md ${
      critical
        ? 'bg-red-500/20 border border-red-400/30'
        : 'bg-white/60 dark:bg-slate-800/60 border border-pastel-border/20'
    }`}>
      {needs.map(({ key, Icon }) => {
        const val = pet[key] as number;
        return (
          <div key={key} className="flex items-center gap-1" title={`${key}: ${Math.round(val)}%`}>
            <Icon size={11} className={val <= 15 ? 'text-red-400' : val <= 30 ? 'text-pastel-coral' : 'text-pastel-muted'} />
            <div className="w-10 h-1.5 bg-white/30 dark:bg-slate-700/60 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ease-out ${color(val)}`}
                style={{ width: `${val}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
