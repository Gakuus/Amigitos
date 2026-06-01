'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { PetSprite } from '@/components/pet/PetSprite';
import { usePetStore } from '@/stores/pet.store';
import { RoomScene } from './RoomScene';
import { getSleepPositions } from './sleepTileMap';
import { ItemSelector } from './ItemSelector';
import { RoomNeedsOverlay } from './RoomNeedsOverlay';
import { useSimulatedNeeds } from '@/hooks/useSimulatedNeeds';
import type { SleepPosition } from './sleepTileMap';
import {
  Sofa, UtensilsCrossed, Gamepad2, Bath, Moon,
  Sparkles, Apple, Bed, Droplets,
} from 'lucide-react';

const ROOMS = [
  { id: 'living', label: 'Sala', icon: Sofa },
  { id: 'eat', label: 'Comer', icon: UtensilsCrossed },
  { id: 'play', label: 'Jugar', icon: Gamepad2 },
  { id: 'bath', label: 'Baño', icon: Bath },
  { id: 'sleep', label: 'Dormir', icon: Moon },
] as const;

type RoomId = (typeof ROOMS)[number]['id'];

const PET_SIZE = 90;
const PET_SIZE_SLEEP = 80;

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
    positions.push({ x: startX + spacingX * i, depth, top: 82 });
  }
  return positions;
}

type PetPosition = SleepPosition;

const ROOM_ACTIONS: Record<RoomId, { category: string; label: string; emoji: string } | null> = {
  living: null,
  eat: { category: 'FOOD', label: '¿Qué comemos?', emoji: '🍽️' },
  play: { category: 'TOY', label: '¿Con qué jugamos?', emoji: '🎮' },
  bath: { category: 'SPONGE', label: '¿Con qué bañamos?', emoji: '🛁' },
  sleep: null,
};

export function Room() {
  const { pets, petMap, performAction, activePetId } = usePetStore();
  const activePetData = (activePetId ? petMap[activePetId] : null) ?? null;
  const simulatedPet = useSimulatedNeeds(activePetData);
  const [room, setRoom] = useState<RoomId>('living');
  const [petPositions, setPetPositions] = useState<PetPosition[]>([]);
  const [feedback, setFeedback] = useState<{ emoji: string; petId: string } | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [itemSelector, setItemSelector] = useState<{ category: string; petId: string } | null>(null);
  const [cooldowns, setCooldowns] = useState<Record<string, number>>({});
  const fbTimeout = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    setIsMobile(window.innerWidth < 640);
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (room === 'sleep') {
      setPetPositions(getSleepPositions(pets.length));
    } else {
      setPetPositions(distributePositions(pets.length));
    }
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

  const showFeedback = (emoji: string, petId: string) => {
    setFeedback({ emoji, petId });
    if (fbTimeout.current) clearTimeout(fbTimeout.current);
    fbTimeout.current = setTimeout(() => setFeedback(null), 1500);
  };

  const handleRoomAction = useCallback(
    async (petId: string, itemId?: string) => {
      const actionMap: Record<string, 'feed' | 'play' | 'bathe' | 'sleep'> = {
        eat: 'feed', play: 'play', bath: 'bathe', sleep: 'sleep',
      };
      const action = actionMap[room];
      if (!action) return;

      const feedbackEmojis: Record<string, string> = {
        feed: '🍽️', play: '🎮', bathe: '🛁', sleep: '💤',
      };

      await performAction(petId, action, itemId);
      showFeedback(feedbackEmojis[action] || '✨', petId);
    },
    [room, performAction],
  );

  const handleSleepToggle = useCallback(
    async (petId: string) => {
      const data = petMap[petId];
      const action = data?.isSleeping ? 'wake' : 'sleep';
      await performAction(petId, action);
      showFeedback(data?.isSleeping ? '🌅' : '💤', petId);
    },
    [petMap, performAction],
  );

  const handleItemSelect = async (petId: string, itemId: string) => {
    await handleRoomAction(petId, itemId);
    setItemSelector(null);
  };

  const switchRoom = useCallback(
    async (newRoom: RoomId) => {
      if (newRoom === room) return;
      setRoom(newRoom);

      if (newRoom === 'sleep') {
        for (const p of pets) {
          const data = petMap[p.id];
          if (!data?.isSleeping) {
            await performAction(p.id, 'sleep');
          }
        }
      }
    },
    [room, pets, petMap, performAction],
  );

  if (pets.length === 0) return null;

  return (
    <div className="space-y-2">
      {/* Room Tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-0.5 px-0.5 scrollbar-none">
        {ROOMS.map((r) => (
          <button
            key={r.id}
            onClick={() => switchRoom(r.id)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${
              room === r.id
                ? 'bg-gradient-to-r from-pastel-purple to-pastel-pink text-white shadow-lg shadow-pastel-purple/30 scale-105'
                : 'bg-pastel-card/60 text-pastel-muted hover:bg-pastel-card hover:text-pastel-foreground border border-pastel-border/30'
            }`}
          >
            <r.icon size={16} />
            <span>{r.label}</span>
          </button>
        ))}
      </div>

      {/* Room Container */}
      <div
        className="relative w-full rounded-2xl overflow-hidden select-none shadow-2xl"
        style={{
          aspectRatio: isMobile ? '4/3' : '16/9',
          minHeight: isMobile ? '280px' : '380px',
        }}
      >
        <RoomScene room={room} petPositions={petPositions} />

        {/* Pets Layer */}
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
                  <div className="text-[11px] font-medium px-2 py-0.5 rounded-full shadow-lg bg-white/70 text-pastel-foreground backdrop-blur-sm border border-pastel-border/20">
                    {summary.name}
                  </div>
                </div>

                <PetSprite
                  species={summary.species}
                  mood={data?.mood ?? summary.mood}
                  isSleeping={isSleeping}
                  size={Math.round(size)}
                />

                {/* Feedback per pet */}
                {feedback?.petId === summary.id && (
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 z-30 pointer-events-none animate-float-up text-2xl">
                    {feedback.emoji}
                  </div>
                )}


              </div>
            );
          })}
        </div>

        {/* Interactive Action Zones inside the room */}
        {room !== 'living' && activePetId && (
          <div className="absolute inset-0 z-20 pointer-events-none">
            {room === 'eat' && (
              <button
                onClick={() => setItemSelector({ category: 'FOOD', petId: activePetId })}
                className="absolute pointer-events-auto bottom-[30%] left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2.5 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-2xl shadow-lg border border-pastel-border/20 hover:bg-white dark:hover:bg-slate-700/90 hover:shadow-xl active:scale-95 transition-all animate-bounce-gentle"
              >
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-rose-400 to-orange-400 flex items-center justify-center text-white shadow-md">
                  <Apple size={16} />
                </div>
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">¡A comer!</span>
              </button>
            )}
            {room === 'play' && (
              <button
                onClick={() => setItemSelector({ category: 'TOY', petId: activePetId })}
                className="absolute pointer-events-auto bottom-[30%] left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2.5 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-2xl shadow-lg border border-pastel-border/20 hover:bg-white dark:hover:bg-slate-700/90 hover:shadow-xl active:scale-95 transition-all animate-bounce-gentle"
              >
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-400 to-purple-400 flex items-center justify-center text-white shadow-md">
                  <Gamepad2 size={16} />
                </div>
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">¡A jugar!</span>
              </button>
            )}
            {room === 'bath' && (
              <button
                onClick={() => setItemSelector({ category: 'SPONGE', petId: activePetId })}
                className="absolute pointer-events-auto bottom-[30%] left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2.5 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-2xl shadow-lg border border-pastel-border/20 hover:bg-white dark:hover:bg-slate-700/90 hover:shadow-xl active:scale-95 transition-all animate-bounce-gentle"
              >
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-400 to-teal-400 flex items-center justify-center text-white shadow-md">
                  <Droplets size={16} />
                </div>
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">¡A bañarse!</span>
              </button>
            )}
            {room === 'sleep' && (
              <div className="absolute pointer-events-auto bottom-[30%] left-1/2 -translate-x-1/2 flex gap-2">
                {pets.map((p) => {
                  const isSleeping = p.isSleeping;
                  return (
                    <button
                      key={p.id}
                      onClick={() => handleSleepToggle(p.id)}
                      className="flex items-center gap-1.5 px-3 py-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-2xl shadow-lg border border-pastel-border/20 hover:bg-white dark:hover:bg-slate-700/90 hover:shadow-xl active:scale-95 transition-all"
                    >
                      <Bed size={14} className={isSleeping ? 'text-amber-400' : 'text-pastel-purple'} />
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                        {isSleeping ? 'Despertar' : p.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Room Label */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
          <div className="bg-white/60 dark:bg-slate-800/60 text-pastel-foreground text-[10px] px-2.5 py-1 rounded-full backdrop-blur-md shadow-lg flex items-center gap-1 border border-pastel-border/20">
            {(() => {
              const roomData = ROOMS.find((r) => r.id === room);
              const Icon = roomData?.icon;
              return Icon ? <Icon size={12} /> : null;
            })()}
            <span className="font-semibold">{ROOMS.find((r) => r.id === room)?.label}</span>
          </div>
        </div>

        {/* Needs overlay — top right */}
        {simulatedPet && (
          <div className="absolute top-2 right-2 z-30 pointer-events-auto">
            <RoomNeedsOverlay pet={simulatedPet} />
          </div>
        )}
      </div>

      {/* Item Selector Modal */}
      {itemSelector && (
        <ItemSelector
          category={itemSelector.category}
          petId={itemSelector.petId}
          actionLabel={ROOM_ACTIONS[room]?.label ?? ''}
          actionEmoji={ROOM_ACTIONS[room]?.emoji ?? '✨'}
          onAction={handleItemSelect}
          onClose={() => setItemSelector(null)}
        />
      )}
    </div>
  );
}
