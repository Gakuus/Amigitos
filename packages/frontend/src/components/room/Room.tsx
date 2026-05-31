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

const PET_SIZE = 90;
const PET_SIZE_SLEEP = 80;

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

function distributePositions(count: number): { x: number; depth: number }[] {
  if (count <= 1) return [{ x: 0.5, depth: 0.5 }];

  const spreadX = Math.min(0.72, 0.22 + (count - 2) * 0.16);
  const spacingX = spreadX / (count - 1);
  const startX = 0.5 - spreadX / 2;

  const positions: { x: number; depth: number }[] = [];
  for (let i = 0; i < count; i++) {
    const t = count <= 1 ? 0.5 : i / (count - 1);
    const depth = 0.15 + t * 0.7;
    positions.push({
      x: startX + spacingX * i,
      depth,
    });
  }
  return positions;
}

type PetPosition = { x: number; depth: number };

export function Room() {
  const { pets, petMap, performAction } = usePetStore();
  const [room, setRoom] = useState<RoomId>('living');
  const [petPositions, setPetPositions] = useState<PetPosition[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);
  const fbTimeout = useRef<ReturnType<typeof setTimeout>>();
  const previousRoom = useRef<RoomId>('living');

  useEffect(() => {
    setPetPositions(distributePositions(pets.length));
    previousRoom.current = room;
  }, [room, pets.length]);

  useEffect(() => {
    if (room !== 'living') return;
    const timers: ReturnType<typeof setInterval>[] = [];
    for (let i = 0; i < pets.length; i++) {
      const t = setInterval(() => {
        const data = petMap[pets[i]?.id ?? ''];
        if (data?.isSleeping) return;
        setPetPositions((prev) => {
          const next = [...prev];
          const rangeX = Math.min(0.72, 0.22 + (pets.length - 2) * 0.16);
          next[i] = {
            x: 0.5 - rangeX / 2 + Math.random() * rangeX,
            depth: next[i]?.depth ?? 0.5,
          };
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
        style={{
          aspectRatio: '16/9',
          minHeight: '420px',
          perspective: '900px',
          perspectiveOrigin: 'center 40%',
        }}
      >
        {/* 3D Room interior */}
        <div
          className="absolute inset-0 transition-transform duration-700"
          style={{
            transform: 'rotateX(6deg)',
            transformOrigin: 'center bottom',
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Wall */}
          <div
            className={`absolute inset-0 bottom-[25%] bg-gradient-to-b ${design.wall} transition-colors duration-700 z-0`}
          >
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(0,0,0,0.2) 1px, transparent 1px)',
                backgroundSize: '30px 30px',
              }}
            />
            <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-b from-black/5 to-black/20" />
          </div>

          {/* Floor */}
          <div
            className={`absolute bottom-0 left-0 right-0 h-[25%] bg-gradient-to-b ${design.floor} transition-colors duration-700 z-0`}
            style={{
              transform: 'rotateX(2deg)',
              transformOrigin: 'top center',
            }}
          >
            <div
              className="absolute inset-0 opacity-15"
              style={{
                backgroundImage:
                  'linear-gradient(90deg, transparent 0%, transparent 96%, rgba(255,255,255,0.06) 96%), linear-gradient(0deg, transparent 0%, transparent 96%, rgba(255,255,255,0.04) 96%)',
                backgroundSize: '6% 20%',
              }}
            />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-full bg-gradient-to-b from-white/5 to-transparent rounded-full" />
          </div>

          {/* Floor shadow gradient for depth */}
          <div
            className="absolute bottom-0 left-0 right-0 h-[25%] z-[1] pointer-events-none"
            style={{
              background: 'linear-gradient(to top, rgba(0,0,0,0.3) 0%, transparent 40%, transparent 100%)',
            }}
          />
        </div>

        {/* Furniture SVG (fills full room container) */}
        <RoomScene room={room} petPositions={petPositions} />

        {/* Pets */}
        {pets.map((summary, i) => {
          const pos = petPositions[i];
          if (!pos) return null;
          const data = petMap[summary.id];
          const isSleeping = summary.isSleeping;
          const depth = pos.depth;

          const depthScale = 0.55 + depth * 0.55;
          const size = isSleeping ? PET_SIZE_SLEEP * depthScale : PET_SIZE * depthScale;
          const floorY = room === 'sleep' && isSleeping ? 32 : 16;
          const baseBottom = `calc(${floorY}% + ${(1 - depth) * 40}px)`;

          return (
            <div
              key={summary.id}
              className="absolute z-20 transition-all duration-[1000ms] ease-out"
              style={{
                left: `${pos.x * 100}%`,
                bottom: baseBottom,
                transform: `translateX(-50%) ${isSleeping ? 'rotate(90deg)' : 'rotate(0deg)'}`,
                transformOrigin: 'center center',
                zIndex: Math.round(depth * 100) + 10,
                filter: `brightness(${0.75 + depth * 0.3})`,
              }}
            >
              <div
                className="absolute whitespace-nowrap z-30 pointer-events-none"
                style={{
                  left: '50%',
                  [isSleeping ? 'bottom' : 'top']: isSleeping ? '-8px' : '-22px',
                  transform: isSleeping ? 'translate(-50%, 0)' : 'translateX(-50%)',
                }}
              >
                <div className="text-[11px] font-medium px-2 py-0.5 rounded-full shadow-lg bg-slate-900/60 text-slate-200 backdrop-blur-sm">
                  {summary.name}
                </div>
              </div>

              <PetSprite
                species={summary.species}
                mood={data?.mood ?? summary.mood}
                isSleeping={isSleeping}
                size={Math.round(size)}
              />

              {isSleeping && (
                <div className="absolute text-sm animate-pulse z-30" style={{ top: '-10px', left: '60%' }}>💤</div>
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
