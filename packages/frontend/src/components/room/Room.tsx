'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { PetSprite } from '@/components/pet/PetSprite';
import { usePetStore } from '@/stores/pet.store';
import { RoomScene } from './RoomScene';
import { getSleepPositions } from './sleepTileMap';
import type { SleepPosition } from './sleepTileMap';

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

function distributePositions(count: number): PetPosition[] {
  if (count <= 1) return [{ x: 0.5, depth: 0.5, top: 82 }];

  const spreadX = Math.min(0.72, 0.22 + (count - 2) * 0.16);
  const spacingX = spreadX / (count - 1);
  const startX = 0.5 - spreadX / 2;

  const positions: PetPosition[] = [];
  for (let i = 0; i < count; i++) {
    const t = count <= 1 ? 0.5 : i / (count - 1);
    const depth = 0.15 + t * 0.7;
    positions.push({
      x: startX + spacingX * i,
      depth,
      top: 82,
    });
  }
  return positions;
}

type PetPosition = SleepPosition;

export function Room() {
  const { pets, petMap, performAction } = usePetStore();
  const [room, setRoom] = useState<RoomId>('living');
  const [petPositions, setPetPositions] = useState<PetPosition[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);
  const fbTimeout = useRef<ReturnType<typeof setTimeout>>();
  const previousRoom = useRef<RoomId>('living');

  useEffect(() => {
    if (room === 'sleep') {
      setPetPositions(getSleepPositions(pets.length));
    } else {
      setPetPositions(distributePositions(pets.length));
    }
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
            top: next[i]?.top ?? 82,
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
          perspective: '800px',
        }}
      >
        {/* 3D background layer: wall + floor + furniture */}
        <div
          className="absolute inset-0"
          style={{
            transform: 'rotateX(5deg)',
            transformOrigin: 'center 60%',
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Wall */}
          <div
            className={`absolute inset-0 bottom-[25%] bg-gradient-to-b ${design.wall} transition-colors duration-700`}
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
            className={`absolute bottom-0 left-0 right-0 ${room === 'sleep' ? 'h-[35%]' : 'h-[25%]'} bg-gradient-to-b ${design.floor} transition-colors duration-700`}
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
            className={`absolute bottom-0 left-0 right-0 ${room === 'sleep' ? 'h-[35%]' : 'h-[25%]'} pointer-events-none`}
            style={{
              background: 'linear-gradient(to top, rgba(0,0,0,0.3) 0%, transparent 40%, transparent 100%)',
            }}
          />

          {/* Furniture SVG (fills full room container) */}
          <RoomScene room={room} petPositions={petPositions} />
        </div>

        {/* Flat pets layer (no 3D transform to prevent distortion) */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          {pets.map((summary, i) => {
            const pos = petPositions[i];
            if (!pos) return null;
            const data = petMap[summary.id];
            const isSleeping = summary.isSleeping;
            const depth = pos.depth;

            const depthScale = 0.55 + depth * 0.55;
            const size = isSleeping ? PET_SIZE_SLEEP * depthScale : PET_SIZE * depthScale;

            const petScale = isSleeping ? 'scaleY(0.75)' : 'scaleY(1)';
            const posStyle: Record<string, string | number | undefined> = room === 'sleep' ? {
              left: `${pos.x}%`,
              top: `${(pos as SleepPosition).top}%`,
              transform: `translate(-50%, -50%) ${petScale}`,
            } : {
              left: `${pos.x * 100}%`,
              bottom: `calc(16% + ${(1 - depth) * 40}px)`,
              transform: `translateX(-50%) ${petScale}`,
            };

            return (
              <div
                key={summary.id}
                className="absolute transition-all duration-[1000ms] ease-out pointer-events-auto"
                style={{
                  ...posStyle,
                  transformOrigin: 'center center',
                  zIndex: Math.round(depth * 100) + 10,
                  filter: `brightness(${0.75 + depth * 0.3})`,
                }}
              >
                <div
                  className="absolute whitespace-nowrap pointer-events-none"
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

                {isSleeping && room === 'sleep' && (
                  <div
                    className="absolute z-30 pointer-events-none"
                    style={{
                      bottom: '-2px',
                      left: '-10%',
                      width: '120%',
                      height: '60%',
                      background: 'linear-gradient(180deg, #a78bfa 0%, #7c3aed 100%)',
                      borderRadius: '10px 10px 6px 6px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
                      opacity: 0.92,
                    }}
                  >
                    <div className="absolute left-[28%] inset-y-1.5 w-[2.5px] bg-white/20 rounded-full" />
                    <div className="absolute w-2 h-2 bg-white/15 rounded-full" style={{ top: '36%', left: '45%' }} />
                    <div className="absolute w-1.5 h-1.5 bg-white/12 rounded-full" style={{ top: '52%', left: '22%' }} />
                    <div className="absolute w-1.5 h-1.5 bg-white/12 rounded-full" style={{ top: '28%', left: '65%' }} />
                    <div className="absolute w-1.5 h-1.5 bg-white/15 rounded-full" style={{ top: '55%', left: '72%' }} />
                  </div>
                )}

                {isSleeping && (
                  <div className="absolute text-sm animate-pulse" style={{ top: '-10px', left: '60%' }}>💤</div>
                )}
              </div>
            );
          })}
        </div>

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
