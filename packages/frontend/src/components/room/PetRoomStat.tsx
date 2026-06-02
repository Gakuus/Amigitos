'use client';

import type { PetState } from '@amigitos/shared';
import { Apple, Smile, Zap, Droplets } from 'lucide-react';

interface PetRoomStatProps {
  pet: PetState;
  room: string;
  simulated?: PetState | null;
}

type RoomStatDef = {
  key: keyof PetState;
  Icon: React.ElementType;
  label: string;
  gradient: string;
};

const ROOM_STATS: Record<string, RoomStatDef> = {
  eat: { key: 'hunger', Icon: Apple, label: 'Hambre', gradient: 'from-rose-400 to-orange-400' },
  play: { key: 'happiness', Icon: Smile, label: 'Felicidad', gradient: 'from-yellow-400 to-amber-400' },
  bath: { key: 'hygiene', Icon: Droplets, label: 'Higiene', gradient: 'from-teal-400 to-emerald-400' },
  sleep: { key: 'energy', Icon: Zap, label: 'Energía', gradient: 'from-sky-400 to-blue-400' },
};

export function PetRoomStat({ pet, room, simulated }: PetRoomStatProps) {
  const def = ROOM_STATS[room];
  if (!def) return null;

  const data = simulated ?? pet;
  const val = data[def.key] as number;

  return (
    <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-lg bg-white/70 backdrop-blur-sm border border-pastel-border/20 shadow-sm">
      <def.Icon size={10} className="text-pastel-muted shrink-0" />
      <div className="w-14 h-1.5 bg-white/40 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${def.gradient} transition-all duration-1000`}
          style={{ width: `${Math.max(0, val)}%` }}
        />
      </div>
    </div>
  );
}
