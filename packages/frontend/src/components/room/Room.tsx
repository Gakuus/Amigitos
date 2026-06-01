'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { PetSprite } from '@/components/pet/PetSprite';
import { usePetStore } from '@/stores/pet.store';
import { RoomScene } from './RoomScene';
import { getSleepPositions } from './sleepTileMap';
import { ItemSelector } from './ItemSelector';
import { RoomNeedsOverlay } from './RoomNeedsOverlay';
import { useSimulatedNeeds } from '@/hooks/useSimulatedNeeds';
import { SpeechBubble } from '@/components/pet/SpeechBubble';
import { getPhrase, getActionPhrase } from '@/lib/petPhrases';
import type { SleepPosition } from './sleepTileMap';
import {
  Sofa, UtensilsCrossed, Gamepad2, Bath, Moon,
  Sparkles, Apple, Bed, Droplets, Plus,
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
  const [petRooms, setPetRooms] = useState<Record<string, RoomId>>({});
  const [petPositions, setPetPositions] = useState<PetPosition[]>([]);
  const [feedback, setFeedback] = useState<{ emoji: string; petId: string } | null>(null);
  const [speech, setSpeech] = useState<Record<string, string | null>>({});
  const [isMobile, setIsMobile] = useState(false);
  const [itemSelector, setItemSelector] = useState<{ category: string; petId: string } | null>(null);
  const fbTimeout = useRef<ReturnType<typeof setTimeout>>();
  const speechTimeouts = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  useEffect(() => {
    setIsMobile(window.innerWidth < 640);
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Init all pets in living room
  useEffect(() => {
    if (pets.length > 0 && Object.keys(petRooms).length === 0) {
      const initial: Record<string, RoomId> = {};
      for (const p of pets) {
        initial[p.id] = p.isSleeping ? 'sleep' : 'living';
      }
      setPetRooms(initial);
    }
  }, [pets, petRooms]);

  // Update positions when room changes or petRooms change
  useEffect(() => {
    const currentPets = pets.filter((p) => petRooms[p.id] === room);
    if (room === 'sleep') {
      const sleeping = currentPets.filter((p) => p.isSleeping);
      const awake = currentPets.filter((p) => !p.isSleeping);
      const bedPos = getSleepPositions(sleeping.length);
      const floorPos = distributePositions(awake.length);
      let bi = 0;
      let fi = 0;
      const positions: PetPosition[] = currentPets.map((p) => {
        if (p.isSleeping) {
          return bedPos[bi++] ?? { x: 50, depth: 0.35, top: 65 };
        }
        // Convert floorPos (decimal 0-1) to sleep position format (percentage 0-100)
        const fp = floorPos[fi++] ?? { x: 0.5, depth: 0.5, top: 82 };
        return { x: fp.x * 100, depth: fp.depth, top: fp.top };
      });
      setPetPositions(positions);
    } else {
      setPetPositions(distributePositions(currentPets.length));
    }
  }, [room, petRooms, pets]);

  const showSpeech = useCallback((petId: string, text: string) => {
    setSpeech((prev) => ({ ...prev, [petId]: text }));
    if (speechTimeouts.current[petId]) clearTimeout(speechTimeouts.current[petId]);
    speechTimeouts.current[petId] = setTimeout(() => {
      setSpeech((prev) => ({ ...prev, [petId]: null }));
    }, 3000 + Math.random() * 2000);
  }, []);

  // Natural wandering in all rooms
  useEffect(() => {
    const currentPets = pets.filter((p) => petRooms[p.id] === room && !p.isSleeping);
    if (currentPets.length === 0) return;
    const timers: ReturnType<typeof setInterval>[] = [];
    for (let i = 0; i < currentPets.length; i++) {
      const petId = currentPets[i]!.id;
      // Movement
      const moveTimer = setInterval(() => {
        setPetPositions((prev) => {
          const next = [...prev];
          const rangeX = Math.min(0.72, 0.22 + (currentPets.length - 2) * 0.16);
          next[i] = {
            x: 0.5 - rangeX / 2 + Math.random() * rangeX,
            depth: Math.min(0.85, Math.max(0.15, (next[i]?.depth ?? 0.5) + (Math.random() - 0.5) * 0.3)),
            top: next[i]?.top ?? 82,
          };
          return next;
        });
      }, rand(3000, 6000));
      timers.push(moveTimer);
      // Random speech
      const speechTimer = setInterval(() => {
        const species = pets.find((p) => p.id === petId)?.species;
        if (species) showSpeech(petId, getPhrase(species));
      }, rand(12000, 25000));
      timers.push(speechTimer);
    }
    return () => timers.forEach(clearInterval);
  }, [room, petRooms, pets, showSpeech]);

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
      showSpeech(petId, getActionPhrase(action));
    },
    [room, performAction, showSpeech],
  );

  const handleSleepToggle = useCallback(
    async (petId: string) => {
      const data = petMap[petId];
      const action = data?.isSleeping ? 'wake' : 'sleep';
      await performAction(petId, action);
      showFeedback(data?.isSleeping ? '🌅' : '💤', petId);
      showSpeech(petId, getActionPhrase(action));
    },
    [petMap, performAction, showSpeech],
  );

  const handleCallPet = useCallback(
    async (petId: string) => {
      const data = petMap[petId];
      if (data?.isSleeping) {
        await performAction(petId, 'wake');
        showFeedback('🌅', petId);
        showSpeech(petId, getActionPhrase('wake'));
      }
      setPetRooms((prev) => ({ ...prev, [petId]: room }));
      showSpeech(petId, getActionPhrase('call'));
    },
    [room, petMap, performAction, showSpeech],
  );

  const handleItemSelect = async (petId: string, itemId: string) => {
    await handleRoomAction(petId, itemId);
    setItemSelector(null);
  };

  const switchRoom = useCallback(
    (newRoom: RoomId) => {
      if (newRoom === room) return;
      setRoom(newRoom);
    },
    [room],
  );

  if (pets.length === 0) return null;

  // Pets in current room + sleeping pets that belong here (in sleep room)
  const currentPets = pets.filter((p) => petRooms[p.id] === room);
  // Pets NOT in this room (available to call)
  const otherPets = pets.filter((p) => petRooms[p.id] !== room);

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
          {currentPets.map((summary, i) => {
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

                {speech[summary.id] && (
                  <SpeechBubble text={speech[summary.id]!} />
                )}

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

        {/* Action buttons */}
        <div className="absolute inset-x-0 bottom-2 z-20 flex flex-wrap gap-1.5 justify-center px-2 pointer-events-none">
          {/* Room-specific action */}
          {room !== 'living' && room !== 'sleep' && activePetId && currentPets.some((p) => p.id === activePetId) && (
            <button
              onClick={() => {
                const config = ROOM_ACTIONS[room];
                if (config) setItemSelector({ category: config.category, petId: activePetId });
              }}
              className="pointer-events-auto flex items-center gap-1.5 px-3 py-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-2xl shadow-lg border border-pastel-border/20 hover:bg-white dark:hover:bg-slate-700/90 active:scale-95 transition-all text-xs font-semibold text-slate-700 dark:text-slate-200"
            >
              {ROOM_ACTIONS[room]?.emoji} {ROOM_ACTIONS[room]?.label}
            </button>
          )}

          {/* Sleep/wake toggles */}
          {room === 'sleep' && currentPets.map((p) => (
            <button
              key={p.id}
              onClick={() => handleSleepToggle(p.id)}
              className="pointer-events-auto flex items-center gap-1.5 px-3 py-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-2xl shadow-lg border border-pastel-border/20 hover:bg-white dark:hover:bg-slate-700/90 active:scale-95 transition-all text-xs font-semibold"
            >
              <Bed size={14} className={p.isSleeping ? 'text-amber-400' : 'text-pastel-purple'} />
              {p.isSleeping ? `Despertar ${p.name}` : `Dormir ${p.name}`}
            </button>
          ))}

          {/* Call pet buttons */}
          {otherPets.length > 0 && (
            <div className="pointer-events-auto flex flex-wrap gap-1.5 justify-center">
              {otherPets.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleCallPet(p.id)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-pastel-purple/80 to-pastel-pink/80 backdrop-blur-md rounded-2xl shadow-lg hover:brightness-110 active:scale-95 transition-all text-xs font-semibold text-white"
                >
                  <Plus size={12} />
                  Llamar {p.name}
                </button>
              ))}
            </div>
          )}
        </div>

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

        {/* Needs overlay */}
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
