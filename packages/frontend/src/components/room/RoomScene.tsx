'use client';

import type { SleepPosition } from './sleepTileMap';

const DECOR = [
  '🪴', '🖼️', '🕯️', '📚', '🧸', '🎵', '🌸',
] as const;

/* ───────── Furniture Components ───────── */

const wallBg: Record<string, string> = {
  living: 'from-pastel-cream via-pastel-peach/40 to-pastel-cream',
  eat: 'from-pastel-cream via-pastel-peach/50 to-pastel-cream',
  play: 'from-pastel-sky/30 via-pastel-lavender/20 to-pastel-sky/30',
  bath: 'from-pastel-sky/30 via-pastel-mint/20 to-pastel-sky/30',
  sleep: 'from-pastel-lavender/30 via-pastel-moon/20 to-pastel-lavender/30',
};

const floorColor: Record<string, string> = {
  living: 'bg-gradient-to-b from-pastel-walnut/90 to-pastel-walnut/70',
  eat: 'bg-gradient-to-b from-pastel-walnut/90 to-pastel-walnut/70',
  play: 'bg-gradient-to-b from-pastel-mint/80 to-pastel-mint/60',
  bath: 'bg-gradient-to-b from-pastel-aqua/80 to-pastel-aqua/60',
  sleep: 'bg-gradient-to-b from-pastel-purple/70 to-pastel-purple/50',
};

function WallDecor() {
  return (
    <>
      <div className="absolute top-[6%] left-[15%] w-0.5 h-[40%] bg-gradient-to-b from-transparent via-pastel-border/20 to-transparent" />
      <div className="absolute top-[6%] right-[15%] w-0.5 h-[40%] bg-gradient-to-b from-transparent via-pastel-border/20 to-transparent" />
    </>
  );
}

/* ───────── Living Room ───────── */

function LivingRoom() {
  return (
    <>
      {/* Window */}
      <div className="absolute top-[6%] left-1/2 -translate-x-1/2 w-[28%] h-[34%] rounded-[50%_50%_8px_8px] bg-gradient-to-b from-pastel-sky/40 to-white/60 border-2 border-pastel-border/20" />
      <div className="absolute top-[6%] left-1/2 -translate-x-1/2 w-[28%] h-[34%] rounded-[50%_50%_8px_8px] flex items-center justify-center">
        <div className="w-full h-[60%] self-end flex gap-0">
          <div className="flex-1 border-r border-pastel-border/15" />
          <div className="flex-1" />
        </div>
        <div className="absolute top-0 left-1/2 w-px h-full bg-pastel-border/15" />
      </div>

      {/* Sofa */}
      <div className="absolute bottom-[24%] left-1/2 -translate-x-1/2 w-[52%] h-[18%]">
        <div className="absolute inset-0 bg-gradient-to-b from-pastel-purple/50 to-pastel-purple/30 rounded-2xl shadow-lg border border-pastel-border/20" />
        <div className="absolute top-[15%] left-[8%] right-[8%] bottom-[20%] bg-pastel-cream/50 rounded-xl" />
        <div className="absolute bottom-[10%] left-[2%] right-[2%] h-[40%] bg-gradient-to-b from-pastel-purple/40 to-pastel-purple/20 rounded-xl" />
        {/* Arms */}
        <div className="absolute top-[5%] left-[1%] w-[10%] bottom-[10%] bg-pastel-purple/40 rounded-xl" />
        <div className="absolute top-[5%] right-[1%] w-[10%] bottom-[10%] bg-pastel-purple/40 rounded-xl" />
        {/* Cushions */}
        <div className="absolute top-[20%] left-[14%] w-[22%] h-[30%] bg-pastel-cream/60 rounded-lg shadow-sm" />
        <div className="absolute top-[20%] left-[39%] w-[22%] h-[30%] bg-pastel-cream/60 rounded-lg shadow-sm" />
        <div className="absolute top-[20%] right-[14%] w-[22%] h-[30%] bg-pastel-cream/60 rounded-lg shadow-sm" />
      </div>

      {/* Rug */}
      <div className="absolute bottom-[18%] left-1/2 -translate-x-1/2 w-[60%] h-[12%] rounded-[50%] bg-gradient-to-r from-pastel-pink/20 via-pastel-purple/20 to-pastel-pink/20" />

      {/* Lamp */}
      <div className="absolute bottom-[26%] right-[8%] w-[6%] h-[30%]">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[55%] bg-pastel-peach/60 rounded-t-lg" />
        <div className="absolute bottom-[52%] left-1/2 -translate-x-1/2 w-[6px] h-[30%] bg-pastel-border/30 rounded-full" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200%] aspect-square rounded-full bg-pastel-yellow/30" />
      </div>

      {/* Picture */}
      <div className="absolute top-[10%] left-[6%] w-[10%] aspect-[4/3] bg-pastel-card/60 rounded-lg border border-pastel-border/20 flex items-center justify-center text-lg">
        🌸
      </div>
    </>
  );
}

/* ───────── Eat Room ───────── */

function EatRoom() {
  return (
    <>
      {/* Table */}
      <div className="absolute bottom-[26%] left-1/2 -translate-x-1/2 w-[45%] h-[14%]">
        <div className="absolute inset-0 bg-gradient-to-b from-pastel-cream to-pastel-peach/60 rounded-xl shadow-lg border border-pastel-border/20" />
        <div className="absolute top-[8%] left-[5%] right-[5%] bottom-[8%] bg-gradient-to-b from-white/60 to-transparent rounded-lg" />
        {/* Plates */}
        <div className="absolute top-[20%] left-[15%] w-[18%] h-[50%] rounded-full bg-white/80 border border-pastel-border/20 flex items-center justify-center text-sm">🍝</div>
        <div className="absolute top-[20%] left-[41%] w-[18%] h-[50%] rounded-full bg-white/80 border border-pastel-border/20 flex items-center justify-center text-sm">🥗</div>
        <div className="absolute top-[20%] right-[15%] w-[18%] h-[50%] rounded-full bg-white/80 border border-pastel-border/20 flex items-center justify-center text-sm">🍰</div>
        {/* Legs */}
        <div className="absolute -bottom-[6px] left-[10%] w-[8px] h-[12px] bg-pastel-walnut/60 rounded-full" />
        <div className="absolute -bottom-[6px] right-[10%] w-[8px] h-[12px] bg-pastel-walnut/60 rounded-full" />
      </div>

      {/* Chairs */}
      {[18, 58].map((left) => (
        <div
          key={left}
          className="absolute bottom-[14%] w-[14%] h-[16%]"
          style={{ left: `${left}%` }}
        >
          <div className="absolute inset-0 bg-pastel-purple/30 rounded-xl border border-pastel-border/15" />
          <div className="absolute top-[10%] left-[8%] right-[8%] h-[40%] bg-pastel-card/50 rounded-lg" />
          <div className="absolute bottom-[8%] left-1/2 -translate-x-1/2 w-[8px] h-[20%] bg-pastel-walnut/40 rounded-full" />
        </div>
      ))}

      {/* Hanging lamp */}
      <div className="absolute top-[2%] left-1/2 -translate-x-1/2 w-[18%] h-[16%]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[2px] h-[40%] bg-pastel-border/30" />
        <div className="absolute top-[38%] left-1/2 -translate-x-1/2 w-full h-[60%] rounded-b-[50%] bg-pastel-yellow/40" />
        <div className="absolute top-[38%] left-1/2 -translate-x-1/2 w-[70%] h-[30%] rounded-b-[50%] bg-pastel-yellow/20" />
      </div>

      {/* Sideboard */}
      <div className="absolute bottom-[26%] right-[4%] w-[14%] h-[18%] bg-pastel-card/50 rounded-xl border border-pastel-border/20 flex items-center justify-center gap-1 text-xs">
        🍷 🥂
      </div>
    </>
  );
}

/* ───────── Play Room ───────── */

function PlayRoom() {
  return (
    <>
      {/* Play mat */}
      <div className="absolute bottom-[22%] left-1/2 -translate-x-1/2 w-[70%] h-[20%] rounded-2xl bg-gradient-to-r from-pastel-pink/25 via-pastel-purple/25 to-pastel-sky/25 border-2 border-dashed border-pastel-border/20" />

      {/* Shelves */}
      <div className="absolute top-[12%] left-[4%] w-[22%] h-[4px] bg-pastel-walnut/40 rounded-full" />
      <div className="absolute top-[12%] left-[4%] w-[4px] h-[28%] bg-pastel-walnut/30 rounded-full" />
      <div className="absolute top-[12%] left-[26%] w-[4px] h-[28%] bg-pastel-walnut/30 rounded-full" />
      {/* Toys on shelf */}
      <div className="absolute top-[4%] left-[6%] text-lg">🧸</div>
      <div className="absolute top-[6%] left-[14%] text-lg">🎲</div>
      <div className="absolute top-[5%] left-[20%] text-lg">📖</div>

      {/* Blocks */}
      <div className="absolute bottom-[34%] left-[10%] w-[8%] aspect-square rounded-md bg-pastel-coral/50 rotate-12 border border-pastel-coral/30" />
      <div className="absolute bottom-[32%] left-[18%] w-[7%] aspect-square rounded-md bg-pastel-sky/50 -rotate-6 border border-pastel-sky/30" />
      <div className="absolute bottom-[36%] right-[12%] w-[8%] aspect-square rounded-md bg-pastel-yellow/50 rotate-8 border border-pastel-yellow/30" />
      <div className="absolute bottom-[33%] right-[20%] w-[6%] aspect-square rounded-md bg-pastel-mint/50 -rotate-12 border border-pastel-mint/30" />

      {/* Toy box */}
      <div className="absolute bottom-[22%] right-[4%] w-[14%] h-[16%] bg-pastel-card/60 rounded-xl border border-pastel-border/20 flex items-center justify-center text-xl">
        🧸
      </div>

      {/* Scattered toys */}
      <div className="absolute bottom-[28%] left-[28%] text-base animate-bounce-gentle" style={{ animationDelay: '0.2s' }}>⚽</div>
      <div className="absolute bottom-[30%] right-[32%] text-base animate-bounce-gentle" style={{ animationDelay: '0.6s' }}>🎾</div>
      <div className="absolute bottom-[26%] left-[50%] text-sm animate-bounce-gentle" style={{ animationDelay: '1s' }}>🪀</div>
    </>
  );
}

/* ───────── Bath Room ───────── */

function BathRoom() {
  return (
    <>
      {/* Mirror */}
      <div className="absolute top-[6%] left-1/2 -translate-x-1/2 w-[18%] aspect-[3/4] rounded-2xl bg-gradient-to-b from-pastel-sky/20 to-pastel-mint/20 border-2 border-pastel-border/20 flex items-center justify-center">
        <div className="w-[85%] h-[85%] rounded-xl bg-gradient-to-br from-white/80 to-pastel-sky/30" />
      </div>

      {/* Bathtub */}
      <div className="absolute bottom-[18%] left-1/2 -translate-x-1/2 w-[55%] h-[24%]">
        <div className="absolute inset-0 bg-gradient-to-b from-white/80 to-pastel-sky/20 rounded-[50%_50%_16px_16px] border-2 border-pastel-border/20 shadow-inner" />
        {/* Water */}
        <div className="absolute top-[15%] left-[4%] right-[4%] bottom-[8%] rounded-[50%_50%_8px_8px] bg-gradient-to-b from-pastel-sky/40 to-pastel-sky/20" />
        {/* Bubbles */}
        <div className="absolute top-[10%] left-[10%] w-4 h-4 rounded-full bg-white/60" />
        <div className="absolute top-[14%] left-[20%] w-3 h-3 rounded-full bg-white/50" />
        <div className="absolute top-[8%] left-[35%] w-5 h-5 rounded-full bg-white/60" />
        <div className="absolute top-[12%] left-[55%] w-3 h-3 rounded-full bg-white/50" />
        <div className="absolute top-[9%] right-[15%] w-4 h-4 rounded-full bg-white/60" />
        {/* Feet */}
        <div className="absolute -bottom-[4px] left-[8%] w-3 h-3 rounded-full bg-pastel-border/30" />
        <div className="absolute -bottom-[4px] right-[8%] w-3 h-3 rounded-full bg-pastel-border/30" />
      </div>

      {/* Towel rack */}
      <div className="absolute top-[12%] left-[5%] w-[14%] h-[2px] bg-pastel-border/40 rounded-full" />
      <div className="absolute top-[14%] left-[6%] w-[6%] h-[18%] bg-pastel-sky/40 rounded-md" />
      <div className="absolute top-[14%] left-[12%] w-[6%] h-[14%] bg-pastel-pink/40 rounded-md" />

      {/* Shower */}
      <div className="absolute bottom-[26%] right-[5%] w-[8%] h-[28%]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[8px] h-[60%] bg-pastel-border/30 rounded-full" />
        <div className="absolute top-[58%] left-1/2 -translate-x-1/2 w-[80%] h-[8px] bg-pastel-border/30 rounded-full" />
        <div className="absolute top-[65%] left-1/2 -translate-x-1/2 w-[60%] h-[35%] rounded-[50%] bg-pastel-sky/20" />
        {/* Drops */}
        <div className="absolute top-[68%] left-[10%] w-1 h-2 rounded-full bg-pastel-sky/30" />
        <div className="absolute top-[72%] right-[15%] w-1 h-1.5 rounded-full bg-pastel-sky/30" />
        <div className="absolute top-[78%] left-[20%] w-1 h-2 rounded-full bg-pastel-sky/30" />
      </div>
    </>
  );
}

/* ───────── Sleep Room ───────── */

function SleepRoom({ petPositions }: { petPositions: SleepPosition[] }) {
  return (
    <>
      {/* Moon */}
      <div className="absolute top-[4%] right-[10%] w-[10%] aspect-square">
        <div className="w-full h-full rounded-full bg-pastel-yellow/50" />
        <div className="absolute top-[6%] left-[12%] w-[85%] h-[85%] rounded-full bg-pastel-lavender/40" style={{ boxShadow: 'inset 0 0 20px rgba(0,0,0,0.15)' }} />
      </div>

      {/* Stars */}
      <div className="absolute top-[6%] left-[8%] w-1.5 h-1.5 rounded-full bg-pastel-yellow/50" />
      <div className="absolute top-[10%] left-[22%] w-1 h-1 rounded-full bg-pastel-yellow/40" />
      <div className="absolute top-[4%] left-[40%] w-1.5 h-1.5 rounded-full bg-pastel-yellow/50" />
      <div className="absolute top-[8%] left-[55%] w-1 h-1 rounded-full bg-pastel-yellow/35" />
      <div className="absolute top-[3%] left-[70%] w-1 h-1 rounded-full bg-pastel-yellow/40" />

      {/* Sleep zone */}
      <div className="absolute bottom-[8%] left-[4%] right-[4%] h-[40%] rounded-2xl bg-pastel-purple/8 border border-pastel-purple/10" />

      {/* Nightstands */}
      <div className="absolute bottom-[20%] left-[4%] w-[10%] h-[14%] bg-pastel-card/60 rounded-xl border border-pastel-border/20">
        <div className="absolute top-[2%] left-1/2 -translate-x-1/2 w-[8px] h-[40%] bg-pastel-border/20 rounded-full" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-pastel-yellow/50" />
      </div>
      <div className="absolute bottom-[20%] right-[4%] w-[10%] h-[14%] bg-pastel-card/60 rounded-xl border border-pastel-border/20">
        <div className="absolute top-[2%] left-1/2 -translate-x-1/2 w-[8px] h-[40%] bg-pastel-border/20 rounded-full" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-pastel-yellow/50" />
      </div>

      {/* Beds positioned to align with sleep positions */}
      {petPositions.map((pos, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: `calc(${pos.x}% - 10%)`,
            top: `calc(${pos.top}% - 4%)`,
            width: '20%',
            aspectRatio: '2/1',
          }}
        >
          {/* Shadow */}
          <div className="absolute -bottom-[2px] left-[2%] right-[2%] h-[6px] rounded-full bg-black/8" />
          {/* Bed frame */}
          <div className="absolute inset-0 bg-gradient-to-b from-pastel-purple/50 to-pastel-purple/30 rounded-xl border border-pastel-border/20" />
          {/* Headboard */}
          <div className="absolute -top-[6px] left-[4%] right-[4%] h-[10px] bg-pastel-purple/40 rounded-t-lg" />
          {/* Sheet */}
          <div className="absolute top-[12%] left-[4%] right-[4%] bottom-[10%] bg-white/60 rounded-lg" />
          {/* Pillow */}
          <div className="absolute top-[14%] left-[6%] w-[22%] h-[28%] bg-pastel-yellow/40 rounded-lg" />
          {/* Blanket */}
          <div className="absolute bottom-[10%] left-[24%] right-[4%] h-[55%] bg-gradient-to-b from-pastel-pink/50 to-pastel-pink/30 rounded-lg" />
          <div className="absolute bottom-[9%] left-[24%] right-[4%] h-[3px] bg-white/20 rounded-full" />
          {/* Fold detail */}
          <div className="absolute top-[40%] left-[28%] w-[2px] h-[35%] bg-white/10 rounded-full" />
        </div>
      ))}
    </>
  );
}

/* ───────── Main export ───────── */

type RoomId = 'living' | 'eat' | 'play' | 'bath' | 'sleep';

export function RoomScene({ room, petPositions }: { room: RoomId; petPositions: SleepPosition[] }) {
  return (
    <div
      className="absolute inset-0 w-full h-full"
      style={{
        perspective: '1000px',
        perspectiveOrigin: 'center 40%',
      }}
    >
      <div
        className="absolute inset-0 w-full h-full overflow-hidden"
        style={{
          transform: 'rotateX(58deg) rotateZ(45deg)',
          transformOrigin: 'center 60%',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Room background */}
        <div
          className={`absolute inset-0 bg-gradient-to-b ${wallBg[room] ?? wallBg.living} transition-colors duration-700`}
        />

        {/* Floor */}
        <div
          className={`absolute bottom-0 left-0 right-0 h-[45%] ${floorColor[room] ?? floorColor.living} transition-colors duration-700`}
        >
          {/* Floor grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                'linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(0deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
              backgroundSize: '7% 14%',
            }}
          />
          {/* Floor accent */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[30%] bg-gradient-to-b from-white/5 to-transparent rounded-full" />
        </div>

        {/* Wall base line */}
        <div className="absolute bottom-[45%] left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-pastel-border/20 to-transparent" />

        {/* Wall decorations */}
        <WallDecor />

        {/* Room-specific furniture */}
        {room === 'living' && <LivingRoom />}
        {room === 'eat' && <EatRoom />}
        {room === 'play' && <PlayRoom />}
        {room === 'bath' && <BathRoom />}
        {room === 'sleep' && <SleepRoom petPositions={petPositions} />}

        {/* Floor vignette */}
        <div className="absolute bottom-0 left-0 right-0 h-[8%] bg-gradient-to-b from-transparent to-black/10 pointer-events-none" />
      </div>
    </div>
  );
}
