'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { PetSprite } from '@/components/pet/PetSprite';
import { usePetStore } from '@/stores/pet.store';
import { RoomScene } from './RoomScene';
import { getBedPositions } from './sleepTileMap';
import { ItemSelector } from './ItemSelector';

import { SpeechBubble } from '@/components/pet/SpeechBubble';
import { getPhrase, getActionPhrase, getLovingPhrase } from '@/lib/petPhrases';
import type { SleepPosition } from './sleepTileMap';
import type { PetOutfitInfo } from '@amigitos/shared';
import { CUSTOM_SPECIES_IMAGES } from '@amigitos/shared';
import {
  Sofa, UtensilsCrossed, Gamepad2, Bath, Moon,
  Sparkles, Apple, Bed, Droplets, Plus,
  ShoppingBag, HeartHandshake, User, Shirt, Coins,
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

function distributePositions(count: number, isMobile: boolean): PetPosition[] {
  if (count <= 1) return [{ x: 0.5, depth: 0.5, top: 82 }];
  const spreadX = isMobile ? Math.min(0.88, 0.3 + (count - 1) * 0.2) : Math.min(0.72, 0.22 + (count - 2) * 0.16);
  const spacingX = spreadX / (count - 1);
  const startX = 0.5 - spreadX / 2;
  const positions: PetPosition[] = [];
  for (let i = 0; i < count; i++) {
    const t = count <= 1 ? 0.5 : i / (count - 1);
    const depth = isMobile ? 0.1 + t * 0.78 : 0.15 + t * 0.7;
    positions.push({ x: startX + spacingX * i, depth, top: 82 });
  }
  return positions;
}

function getEatPositions(count: number): PetPosition[] {
  const cx = 0.5, cy = 0.5;
  const rx = 0.22, ry = 0.22;
  const positions: PetPosition[] = [];
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
    positions.push({
      x: cx + Math.cos(angle) * rx,
      depth: cy + Math.sin(angle) * ry,
      top: 82,
    });
  }
  return positions;
}

type PetPosition = SleepPosition;

const ROOM_STAT: Record<RoomId, { label: string; icon: string; key: 'hunger' | 'happiness' | 'energy' | 'hygiene' }> = {
  living: { label: 'Felicidad', icon: '😊', key: 'happiness' },
  eat: { label: 'Hambre', icon: '🍽️', key: 'hunger' },
  play: { label: 'Diversión', icon: '🎮', key: 'happiness' },
  bath: { label: 'Higiene', icon: '🛁', key: 'hygiene' },
  sleep: { label: 'Energía', icon: '🌙', key: 'energy' },
};

const ROOM_ACTIONS: Record<RoomId, { category: string; label: string; emoji: string } | null> = {
  living: null,
  eat: { category: 'FOOD', label: '¿Qué comemos?', emoji: '🍽️' },
  play: { category: 'TOY', label: '¿Con qué jugamos?', emoji: '🎮' },
  bath: { category: 'SPONGE', label: '¿Con qué bañamos?', emoji: '🛁' },
  sleep: null,
};

interface RoomProps {
  userCoins?: number;
  userName?: string;
  showWardrobe?: boolean;
  outfit?: PetOutfitInfo | null;
  onWardrobeToggle?: () => void;
  onWardrobeEquip?: () => Promise<void>;
  onOpenShop?: () => void;
  onOpenGames?: () => void;
  onOpenCouple?: () => void;
  onOpenProfile?: () => void;
  onOpenAdopt?: () => void;
}

function MenuButton({ icon, label, onClick, highlight }: { icon: React.ReactNode; label: string; onClick?: () => void; highlight?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all active:scale-95 w-full ${
        highlight
          ? 'bg-gradient-to-r from-pastel-purple to-pastel-pink text-white hover:brightness-110 shadow-sm'
          : 'text-pastel-muted hover:text-pastel-foreground hover:bg-pastel-card/60'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

export function Room({
  userCoins,
  userName,
  outfit,
  onWardrobeToggle,
  onOpenShop,
  onOpenGames,
  onOpenCouple,
  onOpenProfile,
  onOpenAdopt,
}: RoomProps = {}) {
  const { pets, petMap, performAction, activePetId } = usePetStore();
  const [room, setRoom] = useState<RoomId>('living');
  const [petRooms, setPetRooms] = useState<Record<string, RoomId>>({});
  const [petPositions, setPetPositions] = useState<PetPosition[]>([]);
  const [feedback, setFeedback] = useState<{ emoji: string; petId: string } | null>(null);
  const [speech, setSpeech] = useState<Record<string, string | null>>({});
  const [isMobile, setIsMobile] = useState(false);
  const [itemSelector, setItemSelector] = useState<{ category: string; petId: string } | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const fbTimeout = useRef<ReturnType<typeof setTimeout>>();
  const speechTimeouts = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const petDirection = useRef<Record<string, 'left' | 'right'>>({});
  const prevPositionsRef = useRef<Record<string, number>>({});

  useEffect(() => {
    setIsMobile(window.innerWidth < 640);
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (pets.length > 0 && Object.keys(petRooms).length === 0) {
      const initial: Record<string, RoomId> = {};
      for (const p of pets) {
        initial[p.id] = p.isSleeping ? 'sleep' : 'living';
      }
      setPetRooms(initial);
    }
  }, [pets, petRooms]);

  useEffect(() => {
    const currentPets = pets.filter((p) => petRooms[p.id] === room);
    if (room === 'sleep') {
      const sleeping = currentPets.filter((p) => p.isSleeping);
      const awake = currentPets.filter((p) => !p.isSleeping);
      const bedPos = getBedPositions(sleeping.length);
      const floorPos = distributePositions(awake.length, isMobile);
      let bi = 0;
      let fi = 0;
      const positions: PetPosition[] = currentPets.map((p) => {
        if (p.isSleeping) {
          return bedPos[bi++] ?? { x: 50, depth: 0.35, top: 65 };
        }
        const fp = floorPos[fi++] ?? { x: 0.5, depth: 0.5, top: 82 };
        return { x: fp.x * 100, depth: fp.depth, top: fp.top };
      });
      setPetPositions(positions);
    } else if (room === 'eat') {
      setPetPositions(getEatPositions(currentPets.length));
    } else {
      setPetPositions(distributePositions(currentPets.length, isMobile));
    }
  }, [room, petRooms, pets, isMobile]);

  const showSpeech = useCallback((petId: string, text: string) => {
    setSpeech((prev) => ({ ...prev, [petId]: text }));
    if (speechTimeouts.current[petId]) clearTimeout(speechTimeouts.current[petId]);
    speechTimeouts.current[petId] = setTimeout(() => {
      setSpeech((prev) => ({ ...prev, [petId]: null }));
    }, 8000);
  }, []);

  useEffect(() => {
    if (room === 'eat') return;
    const currentPets = pets.filter((p) => petRooms[p.id] === room && !p.isSleeping);
    if (currentPets.length === 0) return;
    const timers: ReturnType<typeof setInterval>[] = [];
    for (let i = 0; i < currentPets.length; i++) {
      const petId = currentPets[i]!.id;
      const moveTimer = setInterval(() => {
        setPetPositions((prev) => {
          const next = [...prev];
          const cur = next[i];
          if (!cur) return prev;
          const rangeX = isMobile ? 0.88 : 0.72;
          const minX = 0.5 - rangeX / 2;
          const maxX = 0.5 + rangeX / 2;
          const stepX = (Math.random() - 0.5) * 0.12;
          const stepDepth = (Math.random() - 0.5) * 0.12;
          const newX = Math.max(minX, Math.min(maxX, cur.x + stepX));
          const newDepth = Math.min(0.88, Math.max(0.08, (cur.depth ?? 0.5) + stepDepth));
          const prevX = prevPositionsRef.current[petId];
          if (prevX !== undefined && Math.abs(newX - prevX) > 0.005) {
            petDirection.current[petId] = newX < prevX ? 'left' : 'right';
          }
          prevPositionsRef.current[petId] = newX;
          next[i] = { x: newX, depth: newDepth, top: cur.top ?? 82 };
          return next;
        });
      }, rand(3000, 6000));
      timers.push(moveTimer);
      const speechTimer = setInterval(() => {
        const species = pets.find((p) => p.id === petId)?.species;
        if (species) {
          const text = Math.random() < 0.35 ? getLovingPhrase() : getPhrase(species);
          showSpeech(petId, text);
        }
      }, rand(25000, 45000));
      timers.push(speechTimer);
    }
    return () => timers.forEach(clearInterval);
  }, [room, petRooms, pets, showSpeech, isMobile]);

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

  const currentPets = pets.filter((p) => petRooms[p.id] === room);
  const otherPets = pets.filter((p) => petRooms[p.id] !== room);

  return (
    <div className="space-y-2">
      {/* Room Container */}
      <div
        className="relative w-full rounded-2xl overflow-hidden select-none shadow-2xl"
        style={isMobile ? {
          height: 'min(calc(100dvh - 72px), 520px)',
        } : {
          aspectRatio: '16/9',
          minHeight: '380px',
        }}
      >
        <RoomScene room={room} petPositions={petPositions} totalPets={currentPets.length} />

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
            const dir = petDirection.current[summary.id];
            const flipX = dir === 'left' ? 'scaleX(-1)' : '';
            const sleepTransform = `translate(-50%, -50%) ${petScale}`;
            const awakeTransform = `translateX(-50%) ${petScale}`;

            const posStyle: Record<string, string | number | undefined> = room === 'sleep' ? {
              left: `${pos.x}%`,
              top: `${(pos as SleepPosition).top}%`,
              transform: sleepTransform,
            } : {
              left: `${pos.x * 100}%`,
              bottom: `calc(16% + ${(1 - depth) * 40}px)`,
              transform: awakeTransform,
            };

            return (
              <div
                key={summary.id}
                className="absolute transition-all duration-[3500ms] ease-out pointer-events-auto"
                style={{
                  ...posStyle,
                  transformOrigin: 'center center',
                  zIndex: Math.round(depth * 100) + 10,
                  filter: `brightness(${0.75 + depth * 0.3})`,
                }}
              >
                {/* Name label (not flipped) */}
                <div
                  className="absolute whitespace-nowrap pointer-events-none"
                  style={{
                    left: '50%',
                    [isSleeping ? 'bottom' : 'top']: isSleeping ? '-8px' : '-22px',
                    transform: isSleeping ? 'translate(-50%, 0)' : 'translateX(-50%)',
                  }}
                >
                  <div className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-white/70 text-pastel-foreground shadow-sm">
                    {summary.name}
                  </div>
                </div>

                {/* Speech bubble (not flipped) */}
                {speech[summary.id] && (
                  <SpeechBubble text={speech[summary.id]!} />
                )}

                {/* Pet sprite with direction flip */}
                <div style={{ transform: flipX }} className={dir && !isSleeping ? 'animate-walk-bob' : ''}>
                  <PetSprite
                    species={summary.species}
                    mood={data?.mood ?? summary.mood}
                    isSleeping={isSleeping}
                    size={Math.round(size)}
                    customImageUrl={CUSTOM_SPECIES_IMAGES[summary.species]}
                  />
                </div>

                {/* Room-based stat bar (not flipped) */}
                {!isSleeping && (() => {
                  const stat = ROOM_STAT[room];
                  const val = data?.[stat.key];
                  if (val === undefined || val === null) return null;
                  const color = val > 60
                    ? 'from-green-400 to-green-500'
                    : val > 25
                      ? 'from-yellow-400 to-amber-400'
                      : 'from-rose-400 to-red-500';
                  return (
                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-14 pointer-events-none">
                      <div className="flex items-center gap-1 bg-white/80 rounded-full px-1.5 py-0.5 shadow-sm border border-pastel-border/20 text-[10px] font-semibold text-pastel-foreground">
                        <span>{stat.icon}</span>
                        <div className="flex-1 h-1.5 rounded-full bg-pastel-border/30 overflow-hidden">
                          <div
                            className={`h-full rounded-full bg-gradient-to-r ${color} transition-all duration-1000`}
                            style={{ width: `${val}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Feedback per pet (not flipped) */}
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
        <div className={`absolute inset-x-0 z-20 flex flex-wrap gap-1.5 justify-center pointer-events-none ${
          isMobile ? 'bottom-1 gap-1' : 'bottom-2'
        }`}>
          {room !== 'living' && room !== 'sleep' && activePetId && currentPets.some((p) => p.id === activePetId) && (
            <button
              onClick={() => {
                const config = ROOM_ACTIONS[room];
                if (config) setItemSelector({ category: config.category, petId: activePetId });
              }}
              className={`pointer-events-auto flex items-center gap-1.5 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-2xl shadow-lg border border-pastel-border/20 hover:bg-white dark:hover:bg-slate-700/90 active:scale-95 transition-all font-semibold text-slate-700 dark:text-slate-200 ${
                isMobile ? 'px-2.5 py-1.5 text-[10px]' : 'px-3 py-2 text-xs'
              }`}
            >
              {ROOM_ACTIONS[room]?.emoji} {isMobile ? '' : ROOM_ACTIONS[room]?.label}
              {isMobile && <span className="sm:hidden">{ROOM_ACTIONS[room]?.label}</span>}
            </button>
          )}

          {room === 'sleep' && currentPets.map((p) => (
            <button
              key={p.id}
              onClick={() => handleSleepToggle(p.id)}
              className={`pointer-events-auto flex items-center gap-1.5 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-2xl shadow-lg border border-pastel-border/20 hover:bg-white dark:hover:bg-slate-700/90 active:scale-95 transition-all font-semibold ${
                isMobile ? 'px-2.5 py-1.5 text-[10px]' : 'px-3 py-2 text-xs'
              }`}
            >
              <Bed size={isMobile ? 12 : 14} className={p.isSleeping ? 'text-amber-400' : 'text-pastel-purple'} />
              {isMobile ? (p.isSleeping ? 'Despertar' : 'Dormir') : `${p.isSleeping ? 'Despertar' : 'Dormir'} ${p.name}`}
            </button>
          ))}
        </div>

        {/* Room tabs inside room */}
        <div className={`absolute left-1/2 -translate-x-1/2 z-20 pointer-events-auto ${
          isMobile ? 'bottom-0 w-full px-1.5 pb-1' : 'bottom-3 w-[calc(100%-2rem)] max-w-lg'
        }`}>
          <div className={`flex bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-2xl shadow-2xl border border-pastel-border/40 ${
            isMobile ? 'gap-0 p-0.5' : 'gap-1 p-1'
          }`}>
            {ROOMS.map((r) => (
              <button
                key={r.id}
                onClick={() => switchRoom(r.id)}
                className={`flex items-center justify-center flex-1 font-semibold transition-all whitespace-nowrap ${
                  isMobile
                    ? 'gap-0 py-2.5 rounded-xl text-[10px]'
                    : 'gap-1 px-3 py-2 rounded-xl text-xs'
                } ${
                  room === r.id
                    ? 'bg-gradient-to-br from-pastel-purple to-pastel-pink text-white shadow-lg shadow-pastel-purple/30 scale-105'
                    : 'text-pastel-muted hover:text-pastel-foreground hover:bg-pastel-card/60'
                }`}
              >
                <r.icon size={isMobile ? 16 : 16} />
                <span className={isMobile ? 'hidden sm:inline' : ''}>{r.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Expandable sidebar toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className={`absolute top-2 right-2 z-30 pointer-events-auto bg-white/80 dark:bg-slate-800/80 backdrop-blur-md shadow-lg border border-pastel-border/20 hover:bg-white dark:hover:bg-slate-700/90 transition-all active:scale-95 ${
            isMobile ? 'rounded-lg p-1.5' : 'rounded-xl p-2'
          }`}
        >
          <div className="flex flex-col gap-0.5 items-center">
            <span className="w-1 h-1 rounded-full bg-pastel-muted" />
            <span className="w-1 h-1 rounded-full bg-pastel-muted" />
            <span className="w-1 h-1 rounded-full bg-pastel-muted" />
          </div>
        </button>

        {/* Expandable sidebar panel */}
        {menuOpen && (
          <>
            {/* Backdrop */}
            <div className="absolute inset-0 z-30 bg-black/20" onClick={() => setMenuOpen(false)} />
            <div className={`absolute z-40 pointer-events-auto ${
              isMobile
                ? 'inset-x-0 bottom-0 rounded-t-2xl'
                : 'top-2 right-2'
            }`}>
              <div className={`bg-white/95 dark:bg-slate-800/95 backdrop-blur-md shadow-xl border border-pastel-border/20 ${
                isMobile ? 'rounded-t-2xl p-3' : 'rounded-2xl p-2 w-48'
              }`}>
                {/* User info */}
                {userName && (
                  <div className="px-2 py-1.5 text-xs font-semibold text-pastel-foreground flex items-center justify-between border-b border-pastel-border/20 mb-1">
                    <span className="truncate max-w-[100px]">{userName}</span>
                    {userCoins !== undefined && (
                      <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                        <Coins size={10} />
                        {userCoins}
                      </span>
                    )}
                  </div>
                )}
                <div className={`${isMobile ? 'grid grid-cols-2 gap-1' : 'flex flex-col gap-0.5'}`}>
                  <MenuButton icon={<ShoppingBag size={13} />} label="Tienda" onClick={onOpenShop} />
                  <MenuButton icon={<Gamepad2 size={13} />} label="Juegos" onClick={onOpenGames} />
                  <MenuButton icon={<HeartHandshake size={13} />} label="Pareja" onClick={onOpenCouple} />
                  <MenuButton icon={<User size={13} />} label="Perfil" onClick={onOpenProfile} />
                  <div className={`${isMobile ? 'col-span-2' : ''} border-t border-pastel-border/20 my-1`} />
                  <MenuButton icon={<Shirt size={13} />} label="Vestir" onClick={onWardrobeToggle} />
                  <MenuButton icon={<Sparkles size={13} />} label="Adoptar" onClick={onOpenAdopt} highlight />
                </div>

                {/* Call pets section */}
                {otherPets.length > 0 && (
                  <>
                    <div className="border-t border-pastel-border/20 my-1" />
                    <div className="text-[10px] font-semibold text-pastel-muted px-2 py-1 uppercase tracking-wider">
                      Llamar mascotas
                    </div>
                    <div className="flex flex-col gap-0.5 max-h-32 overflow-y-auto">
                      {otherPets.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => {
                            handleCallPet(p.id);
                            if (isMobile) setMenuOpen(false);
                          }}
                          className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs font-medium text-pastel-muted hover:text-pastel-foreground hover:bg-pastel-card/60 transition-all active:scale-95"
                        >
                          <div className="w-4 h-4 rounded-full overflow-hidden bg-pastel-card flex items-center justify-center">
                            <PetSprite
                              species={p.species}
                              mood={petMap[p.id]?.mood ?? p.mood}
                              isSleeping={p.isSleeping}
                              size={16}
                              customImageUrl={CUSTOM_SPECIES_IMAGES[p.species]}
                            />
                          </div>
                          <span className="truncate flex-1">{p.name}</span>
                          {p.isSleeping && <span className="text-[10px]">💤</span>}
                          <Plus size={10} className="shrink-0" />
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </>
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
