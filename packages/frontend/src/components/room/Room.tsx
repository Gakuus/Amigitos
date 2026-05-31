'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { PetSprite } from '@/components/pet/PetSprite';
import { usePetStore } from '@/stores/pet.store';
import { RoomScene } from './RoomScene';

const ROOMS = [
  { id: 'living', label: 'Sala', icon: '🏠' },
  { id: 'eat', label: 'Comedor', icon: '🍽️' },
  { id: 'play', label: 'Juegos', icon: '🎾' },
  { id: 'bath', label: 'Baño', icon: '🛁' },
  { id: 'sleep', label: 'Dormitorio', icon: '🛏️' },
] as const;

type RoomId = (typeof ROOMS)[number]['id'];

const PET_SIZE = 100;

const ROOM_DESIGNS: Record<RoomId, { wall: string; floor: string }> = {
  living: {
    wall: 'from-amber-50 via-orange-50 to-amber-100',
    floor: 'from-amber-600 via-amber-700 to-amber-800',
  },
  eat: {
    wall: 'from-yellow-50 via-orange-50 to-rose-50',
    floor: 'from-yellow-600 via-yellow-700 to-amber-800',
  },
  play: {
    wall: 'from-sky-50 via-blue-50 to-indigo-50',
    floor: 'from-sky-500 via-sky-600 to-blue-700',
  },
  bath: {
    wall: 'from-cyan-50 via-teal-50 to-emerald-50',
    floor: 'from-teal-500 via-teal-600 to-cyan-700',
  },
  sleep: {
    wall: 'from-indigo-100 via-purple-100 to-violet-100',
    floor: 'from-indigo-600 via-purple-700 to-violet-800',
  },
};

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function distributeXs(count: number): number[] {
  if (count <= 1) return [0.5];
  const spread = Math.min(0.76, 0.22 + (count - 2) * 0.18);
  const spacing = spread / (count - 1);
  const startX = 0.5 - spread / 2;
  return Array.from({ length: count }, (_, i) => startX + spacing * i);
}

export function Room() {
  const { pets, petMap, performAction } = usePetStore();
  const [room, setRoom] = useState<RoomId>('living');
  const [petXs, setPetXs] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);
  const fbTimeout = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    setPetXs(distributeXs(pets.length));
  }, [room, pets.length]);

  useEffect(() => {
    if (room !== 'living') return;
    const timers: ReturnType<typeof setInterval>[] = [];
    for (let i = 0; i < pets.length; i++) {
      const t = setInterval(() => {
        const data = petMap[pets[i]?.id ?? ''];
        if (data?.isSleeping) return;
        setPetXs((prev) => {
          const next = [...prev];
          const range = Math.min(0.76, 0.22 + (pets.length - 2) * 0.18);
          next[i] = 0.5 - range / 2 + Math.random() * range;
          return next;
        });
      }, rand(4000, 7000));
      timers.push(t);
    }
    return () => timers.forEach(clearInterval);
  }, [room, pets, petMap]);

  const switchRoom = useCallback(
    async (newRoom: RoomId) => {
      if (newRoom === room) return;
      setRoom(newRoom);
      if (newRoom === 'living') return;

      const actionMap: Record<string, 'feed' | 'play' | 'bathe' | 'sleep'> = {
        eat: 'feed', play: 'play', bath: 'bathe', sleep: 'sleep',
      };
      const action = actionMap[newRoom];
      if (!action) return;

      setFeedback(ROOMS.find((r) => r.id === newRoom)?.icon ?? '✅');
      if (fbTimeout.current) clearTimeout(fbTimeout.current);
      fbTimeout.current = setTimeout(() => setFeedback(null), 2000);

      for (const p of pets) {
        const data = petMap[p.id];
        if (action === 'sleep') {
          await performAction(p.id, data?.isSleeping ? 'wake' : 'sleep');
        } else {
          await performAction(p.id, action);
        }
      }
    },
    [room, pets, petMap, performAction],
  );

  if (pets.length === 0) return null;

  const design = ROOM_DESIGNS[room];
  const petBottom = room === 'sleep' ? 'calc(35% - 15px)' : 'calc(25% - 15px)';

  return (
    <div className="space-y-3">
      <div className="flex gap-2 overflow-x-auto pb-1 px-1">
        {ROOMS.map((r) => (
          <button
            key={r.id}
            onClick={() => switchRoom(r.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-medium transition-all whitespace-nowrap ${
              room === r.id
                ? 'bg-green-600 text-white shadow-lg shadow-green-600/25 scale-105'
                : 'bg-slate-800/80 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
            }`}
          >
            <span className="text-lg">{r.icon}</span>
            <span>{r.label}</span>
          </button>
        ))}
      </div>

      <div
        className="relative w-full rounded-2xl overflow-hidden select-none shadow-xl"
        style={{ aspectRatio: '16/9', minHeight: '380px' }}
      >
        {/* Wall */}
        <div
          className={`absolute inset-0 bottom-[25%] bg-gradient-to-b ${design.wall} transition-all duration-700 z-0`}
        >
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(0,0,0,0.2) 1px, transparent 1px)',
              backgroundSize: '30px 30px',
            }}
          />
          <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-b from-black/5 to-black/15" />
        </div>

        {/* Floor */}
        <div
          className={`absolute bottom-0 left-0 right-0 h-[25%] bg-gradient-to-b ${design.floor} transition-all duration-700 z-0`}
        >
          <div
            className="absolute inset-0 opacity-15"
            style={{
              backgroundImage: 'linear-gradient(90deg, transparent 0%, transparent 98%, rgba(255,255,255,0.08) 98%)',
              backgroundSize: '8% 100%',
            }}
          />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-full bg-gradient-to-b from-white/5 to-transparent rounded-full" />
        </div>

        {/* Furniture SVG (fills full room container so viewBox coordinates match) */}
        <RoomScene room={room} petXs={petXs} />

        {/* Pets */}
        {pets.map((summary, i) => {
          const x = petXs[i];
          if (x === undefined) return null;
          const data = petMap[summary.id];

          return (
            <div
              key={summary.id}
              className="absolute z-20 transition-all duration-[1000ms] ease-out"
              style={{
                left: `${x * 100}%`,
                bottom: petBottom,
                transform: 'translateX(-50%)',
              }}
            >
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap z-30">
                <div className="text-[11px] font-medium px-2 py-0.5 rounded-full shadow-lg bg-slate-900/60 text-slate-200 backdrop-blur-sm">
                  {summary.name}
                </div>
              </div>

              <PetSprite
                species={summary.species}
                mood={data?.mood ?? summary.mood}
                isSleeping={summary.isSleeping}
                size={PET_SIZE}
              />

              {summary.isSleeping && (
                <div className="absolute -top-1 -right-2 text-sm animate-pulse z-30">💤</div>
              )}
            </div>
          );
        })}

        {/* Room label */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
          <div className="bg-slate-900/50 text-white text-xs px-4 py-1.5 rounded-full backdrop-blur-md shadow-lg flex items-center gap-1.5">
            <span className="text-base">{ROOMS.find((r) => r.id === room)?.icon}</span>
            <span className="font-medium">{ROOMS.find((r) => r.id === room)?.label}</span>
          </div>
        </div>

        {/* Action feedback */}
        {feedback && (
          <div className="absolute top-12 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
            <div className="text-4xl animate-bounce drop-shadow-lg">{feedback}</div>
          </div>
        )}
      </div>
    </div>
  );
}
