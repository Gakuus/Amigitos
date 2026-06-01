'use client';

import type { SleepPosition } from './sleepTileMap';

/* ───────── Room config ───────── */

const roomTheme: Record<string, { wall: string; floor: string; accent: string }> = {
  living: { wall: 'from-pastel-cream via-pastel-peach/30 to-pastel-cream', floor: 'from-pastel-walnut/60 to-pastel-walnut/40', accent: 'pastel-purple' },
  eat: { wall: 'from-pastel-cream via-pastel-peach/40 to-pastel-cream', floor: 'from-pastel-walnut/60 to-pastel-walnut/40', accent: 'pastel-coral' },
  play: { wall: 'from-pastel-sky/20 via-pastel-lavender/15 to-pastel-sky/20', floor: 'from-pastel-mint/60 to-pastel-mint/40', accent: 'pastel-pink' },
  bath: { wall: 'from-pastel-sky/20 via-pastel-mint/15 to-pastel-sky/20', floor: 'from-pastel-aqua/50 to-pastel-aqua/30', accent: 'pastel-sky' },
  sleep: { wall: 'from-pastel-lavender/20 via-pastel-moon/15 to-pastel-lavender/20', floor: 'from-pastel-purple/50 to-pastel-purple/30', accent: 'pastel-yellow' },
};

type RoomId = keyof typeof roomTheme;

/* ───────── Wall ───────── */

function WallSection({ room }: { room: RoomId }) {
  const t = roomTheme[room]!;

  return (
    <div className="absolute top-0 left-0 right-0 h-[58%] bg-gradient-to-b overflow-hidden" style={{ backgroundImage: `linear-gradient(to bottom, ${['from-pastel-cream', 'from-pastel-sky/20'].some(x => t.wall.includes(x)) ? '#fef3c7' : '#e9d5ff'}11, transparent)` }}>
      <div className={`absolute inset-0 bg-gradient-to-b ${t.wall}`}>
        {/* Wallpaper pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
            backgroundSize: '24px 24px',
            color: 'inherit',
          }}
        />

        {/* Crown molding */}
        <div className="absolute bottom-0 left-0 right-0 h-[6px] bg-gradient-to-r from-transparent via-white/40 to-transparent" />

        {/* Baseboard */}
        <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-pastel-border/30 to-transparent" />
      </div>
    </div>
  );
}

/* ───────── Floor ───────── */

function FloorSection({ room }: { room: RoomId }) {
  const t = roomTheme[room]!;

  return (
    <div className="absolute bottom-0 left-0 right-0 h-[42%] overflow-hidden">
      {/* Floor gradient */}
      <div className={`absolute inset-0 bg-gradient-to-b ${t.floor}`} />

      {/* Perspective grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(0deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '6% 8%',
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)',
        }}
      />

      {/* Depth fade at back of floor */}
      <div className="absolute top-0 left-0 right-0 h-[30%] bg-gradient-to-b from-black/[var(--floor-fade)] to-transparent" style={{ '--floor-fade': '0.08' } as React.CSSProperties} />

      {/* Front edge shadow */}
      <div className="absolute bottom-0 left-0 right-0 h-[8%] bg-gradient-to-b from-transparent to-black/10 pointer-events-none" />
    </div>
  );
}

/* ───────── Window ───────── */

function Window({ room }: { room: RoomId }) {
  const isDark = ['sleep'].includes(room);

  return (
    <div className="absolute top-[4%] left-1/2 -translate-x-1/2 w-[30%] h-[42%]">
      {/* Frame */}
      <div className="absolute inset-0 rounded-2xl border-[3px] border-pastel-border/25 bg-gradient-to-b from-transparent via-transparent to-pastel-border/5">
        {/* Glass */}
        <div className={`absolute inset-[6px] rounded-xl ${isDark ? 'bg-pastel-lavender/15' : 'bg-gradient-to-b from-pastel-sky/25 via-pastel-sky/15 to-white/40'}`}>
          {/* Window panes */}
          <div className="absolute inset-0 flex">
            <div className="flex-1 border-r border-pastel-border/15" />
            <div className="flex-1" />
          </div>
          <div className="absolute top-1/2 left-0 right-0 h-px bg-pastel-border/15" />
          {isDark && (
            <>
              <div className="absolute top-[15%] left-[20%] w-1 h-1 rounded-full bg-pastel-yellow/50" />
              <div className="absolute top-[25%] left-[60%] w-0.5 h-0.5 rounded-full bg-pastel-yellow/40" />
              <div className="absolute top-[35%] left-[35%] w-1 h-1 rounded-full bg-pastel-yellow/50" />
            </>
          )}
        </div>
      </div>
      {/* Curtains */}
      <div className="absolute top-0 left-[-6%] w-[12%] h-full rounded-b-lg bg-gradient-to-b from-pastel-pink/20 to-pastel-pink/10" />
      <div className="absolute top-0 right-[-6%] w-[12%] h-full rounded-b-lg bg-gradient-to-b from-pastel-pink/20 to-pastel-pink/10" />
    </div>
  );
}

/* ───────── Living Room ───────── */

function LivingFurniture({ depth }: { depth: (d: number) => React.CSSProperties }) {
  return (
    <>
      {/* Sofa */}
      <div className="absolute bottom-[20%] left-1/2 -translate-x-1/2" style={depth(0.55)}>
        <div className="w-[52vw] max-w-[320px] h-[80px] rounded-2xl bg-gradient-to-b from-pastel-purple/45 to-pastel-purple/25 shadow-lg border border-pastel-border/15">
          <div className="absolute top-[14%] left-[6%] right-[6%] bottom-[22%] bg-pastel-cream/40 rounded-xl" />
          <div className="absolute bottom-[10%] left-[3%] right-[3%] h-[35%] bg-pastel-purple/30 rounded-xl" />
          <div className="absolute top-[6%] left-[2%] w-[10%] bottom-[12%] bg-pastel-purple/35 rounded-xl" />
          <div className="absolute top-[6%] right-[2%] w-[10%] bottom-[12%] bg-pastel-purple/35 rounded-xl" />
          <div className="absolute top-[18%] left-[14%] w-[20%] h-[28%] bg-pastel-cream/50 rounded-lg" />
          <div className="absolute top-[18%] left-[40%] w-[20%] h-[28%] bg-pastel-cream/50 rounded-lg" />
          <div className="absolute top-[18%] right-[14%] w-[20%] h-[28%] bg-pastel-cream/50 rounded-lg" />
        </div>
        {/* Shadow */}
        <div className="absolute -bottom-[6px] left-[4%] right-[4%] h-[6px] rounded-full bg-black/8" />
      </div>

      {/* Rug */}
      <div className="absolute bottom-[14%] left-1/2 -translate-x-1/2 w-[65%] max-w-[380px] h-[40px] rounded-[50%] bg-gradient-to-r from-pastel-pink/15 via-pastel-purple/15 to-pastel-pink/15" />

      {/* Lamp */}
      <div className="absolute bottom-[22%] right-[6%]" style={depth(0.7)}>
        <div className="relative w-[40px] h-[100px]">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[50%] bg-pastel-peach/50 rounded-t-lg" />
          <div className="absolute bottom-[48%] left-1/2 -translate-x-1/2 w-[4px] h-[35%] bg-pastel-border/25 rounded-full" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60px] aspect-square rounded-full bg-pastel-yellow/25" />
        </div>
        <div className="absolute -bottom-[4px] left-1/2 -translate-x-1/2 w-[50px] h-[4px] rounded-full bg-black/8" />
      </div>

      {/* Picture frame */}
      <div className="absolute top-[8%] left-[5%] w-[80px] aspect-[4/3] rounded-lg bg-pastel-card/50 border border-pastel-border/20 flex items-center justify-center text-xl shadow-sm">
        🌸
      </div>

      {/* Plant */}
      <div className="absolute top-[38%] left-[4%] text-2xl">🪴</div>
    </>
  );
}

/* ───────── Eat Room ───────── */

function EatFurniture({ depth }: { depth: (d: number) => React.CSSProperties }) {
  return (
    <>
      {/* Table */}
      <div className="absolute bottom-[22%] left-1/2 -translate-x-1/2" style={depth(0.5)}>
        <div className="w-[50vw] max-w-[300px] h-[60px] rounded-xl bg-gradient-to-b from-pastel-cream to-pastel-peach/50 shadow-lg border border-pastel-border/15">
          <div className="absolute top-[10%] left-[6%] right-[6%] bottom-[10%] bg-white/40 rounded-lg" />
          <div className="absolute top-[18%] left-[12%] w-[18%] h-[55%] rounded-full bg-white/70 border border-pastel-border/15 flex items-center justify-center text-sm">🍝</div>
          <div className="absolute top-[18%] left-[41%] w-[18%] h-[55%] rounded-full bg-white/70 border border-pastel-border/15 flex items-center justify-center text-sm">🥗</div>
          <div className="absolute top-[18%] right-[12%] w-[18%] h-[55%] rounded-full bg-white/70 border border-pastel-border/15 flex items-center justify-center text-sm">🍰</div>
        </div>
        <div className="absolute -bottom-[4px] left-[8%] w-[6px] h-[10px] bg-pastel-walnut/40 rounded-full" />
        <div className="absolute -bottom-[4px] right-[8%] w-[6px] h-[10px] bg-pastel-walnut/40 rounded-full" />
        <div className="absolute -bottom-[3px] left-[4%] right-[4%] h-[4px] rounded-full bg-black/8" />
      </div>

      {/* Chairs */}
      {[14, 58].map((left) => (
        <div key={left} className="absolute bottom-[12%] w-[12%] max-w-[70px]" style={{ left: `${left}%`, ...depth(0.4) }}>
          <div className="w-full aspect-[3/4] rounded-xl bg-pastel-purple/25 border border-pastel-border/12">
            <div className="absolute top-[12%] left-[10%] right-[10%] h-[35%] bg-pastel-card/40 rounded-lg" />
          </div>
          <div className="absolute -bottom-[3px] left-[10%] right-[10%] h-[3px] rounded-full bg-black/8" />
        </div>
      ))}

      {/* Hanging lamp */}
      <div className="absolute top-[1%] left-1/2 -translate-x-1/2">
        <div className="relative w-[80px] h-[70px]">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[2px] h-[35px] bg-pastel-border/25" />
          <div className="absolute top-[34px] left-1/2 -translate-x-1/2 w-full h-[36px] rounded-b-[50%] bg-pastel-yellow/35 shadow-lg" />
          <div className="absolute top-[38px] left-1/2 -translate-x-1/2 w-[60%] h-[20px] rounded-b-[50%] bg-pastel-yellow/15" />
        </div>
      </div>

      {/* Sideboard */}
      <div className="absolute bottom-[22%] right-[3%]" style={depth(0.45)}>
        <div className="w-[70px] h-[60px] rounded-xl bg-pastel-card/50 border border-pastel-border/15 flex items-center justify-center gap-1 text-sm shadow-sm">
          🍷🥂
        </div>
        <div className="absolute -bottom-[3px] left-[8%] right-[8%] h-[3px] rounded-full bg-black/8" />
      </div>
    </>
  );
}

/* ───────── Play Room ───────── */

function PlayFurniture({ depth }: { depth: (d: number) => React.CSSProperties }) {
  return (
    <>
      {/* Play mat */}
      <div className="absolute bottom-[18%] left-1/2 -translate-x-1/2 w-[72%] max-w-[420px] h-[70px] rounded-2xl bg-gradient-to-r from-pastel-pink/20 via-pastel-purple/20 to-pastel-sky/20 border-2 border-dashed border-pastel-border/15 shadow-inner" />

      {/* Shelves */}
      <div className="absolute top-[10%] left-[3%] w-[24%] max-w-[140px]">
        <div className="h-[3px] bg-pastel-walnut/30 rounded-full" />
        <div className="absolute top-0 left-0 w-[3px] h-[80px] bg-pastel-walnut/20 rounded-full" />
        <div className="absolute top-0 right-0 w-[3px] h-[80px] bg-pastel-walnut/20 rounded-full" />
        <div className="absolute top-[-20px] left-[8px] text-lg">🧸</div>
        <div className="absolute top-[-16px] left-[45px] text-lg">🎲</div>
        <div className="absolute top-[-18px] right-[8px] text-lg">📖</div>
      </div>

      {/* Blocks */}
      <div className="absolute bottom-[28%] left-[8%]" style={depth(0.6)}>
        <div className="w-[35px] h-[35px] rounded-md bg-pastel-coral/50 rotate-12 border border-pastel-coral/25 shadow-sm" />
      </div>
      <div className="absolute bottom-[26%] left-[16%]" style={depth(0.55)}>
        <div className="w-[30px] h-[30px] rounded-md bg-pastel-sky/50 -rotate-6 border border-pastel-sky/25 shadow-sm" />
      </div>
      <div className="absolute bottom-[30%] right-[10%]" style={depth(0.53)}>
        <div className="w-[32px] h-[32px] rounded-md bg-pastel-yellow/50 rotate-8 border border-pastel-yellow/25 shadow-sm" />
      </div>

      {/* Toy box */}
      <div className="absolute bottom-[18%] right-[3%]" style={depth(0.55)}>
        <div className="w-[60px] h-[55px] rounded-xl bg-pastel-card/50 border border-pastel-border/15 flex items-center justify-center text-xl shadow-sm">
          🧸
        </div>
        <div className="absolute -bottom-[3px] left-[10%] right-[10%] h-[3px] rounded-full bg-black/8" />
      </div>

      {/* Scattered toys */}
      <div className="absolute bottom-[22%] left-[28%] text-lg animate-bounce-gentle" style={{ animationDelay: '0.2s' }}>⚽</div>
      <div className="absolute bottom-[24%] right-[28%] text-lg animate-bounce-gentle" style={{ animationDelay: '0.6s' }}>🎾</div>
    </>
  );
}

/* ───────── Bath Room ───────── */

function BathFurniture({ depth }: { depth: (d: number) => React.CSSProperties }) {
  return (
    <>
      {/* Mirror */}
      <div className="absolute top-[4%] left-1/2 -translate-x-1/2 w-[15%] max-w-[90px] aspect-[3/4] rounded-2xl bg-gradient-to-b from-pastel-sky/15 to-pastel-mint/15 border-2 border-pastel-border/15 flex items-center justify-center shadow-sm">
        <div className="w-[85%] h-[85%] rounded-xl bg-gradient-to-br from-white/70 to-pastel-sky/20" />
      </div>

      {/* Bathtub */}
      <div className="absolute bottom-[14%] left-1/2 -translate-x-1/2" style={depth(0.5)}>
        <div className="w-[58vw] max-w-[340px] h-[80px] rounded-[50%_50%_16px_16px] bg-gradient-to-b from-white/70 to-pastel-sky/15 border-2 border-pastel-border/15 shadow-inner">
          {/* Water */}
          <div className="absolute top-[18%] left-[5%] right-[5%] bottom-[10%] rounded-[50%_50%_8px_8px] bg-gradient-to-b from-pastel-sky/35 to-pastel-sky/15" />
          {/* Bubbles */}
          <div className="absolute top-[12%] left-[10%] w-4 h-4 rounded-full bg-white/50" />
          <div className="absolute top-[16%] left-[22%] w-3 h-3 rounded-full bg-white/40" />
          <div className="absolute top-[10%] left-[38%] w-5 h-5 rounded-full bg-white/50" />
          <div className="absolute top-[14%] left-[58%] w-3 h-3 rounded-full bg-white/40" />
          <div className="absolute top-[11%] right-[12%] w-4 h-4 rounded-full bg-white/50" />
        </div>
        {/* Feet */}
        <div className="absolute -bottom-[3px] left-[8%] w-2.5 h-2.5 rounded-full bg-pastel-border/25" />
        <div className="absolute -bottom-[3px] right-[8%] w-2.5 h-2.5 rounded-full bg-pastel-border/25" />
        <div className="absolute -bottom-[3px] left-[5%] right-[5%] h-[3px] rounded-full bg-black/8" />
      </div>

      {/* Towels */}
      <div className="absolute top-[10%] left-[4%] w-[15%] max-w-[80px]">
        <div className="h-[2px] bg-pastel-border/30 rounded-full mb-1" />
        <div className="flex gap-1">
          <div className="w-[30%] h-[50px] rounded-md bg-pastel-sky/35" />
          <div className="w-[30%] h-[40px] rounded-md bg-pastel-pink/35" />
        </div>
      </div>

      {/* Shower */}
      <div className="absolute bottom-[22%] right-[4%]" style={depth(0.65)}>
        <div className="relative w-[30px] h-[90px]">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[4px] h-[60%] bg-pastel-border/25 rounded-full" />
          <div className="absolute top-[58%] left-1/2 -translate-x-1/2 w-[24px] h-[6px] bg-pastel-border/25 rounded-full" />
          <div className="absolute top-[64%] left-1/2 -translate-x-1/2 w-[18px] h-[35%] rounded-[50%] bg-pastel-sky/15" />
          <div className="absolute top-[68%] left-[2px] w-1 h-2 rounded-full bg-pastel-sky/25" />
          <div className="absolute top-[74%] right-[2px] w-1 h-1.5 rounded-full bg-pastel-sky/25" />
        </div>
      </div>
    </>
  );
}

/* ───────── Sleep Room ───────── */

function SleepFurniture({ petPositions, depth: _depth }: { petPositions: SleepPosition[]; depth: (d: number) => React.CSSProperties }) {
  return (
    <>
      {/* Moon */}
      <div className="absolute top-[2%] right-[8%]">
        <div className="relative w-[50px] h-[50px]">
          <div className="w-full h-full rounded-full bg-pastel-yellow/40 shadow-lg shadow-pastel-yellow/20" />
          <div className="absolute top-[8%] left-[14%] w-[85%] h-[85%] rounded-full bg-pastel-lavender/35" style={{ boxShadow: 'inset 0 0 15px rgba(0,0,0,0.12)' }} />
        </div>
      </div>

      {/* Stars */}
      <div className="absolute top-[5%] left-[8%] w-1.5 h-1.5 rounded-full bg-pastel-yellow/50" />
      <div className="absolute top-[9%] left-[22%] w-1 h-1 rounded-full bg-pastel-yellow/40" />
      <div className="absolute top-[3%] left-[40%] w-1.5 h-1.5 rounded-full bg-pastel-yellow/50" />
      <div className="absolute top-[7%] left-[55%] w-1 h-1 rounded-full bg-pastel-yellow/35" />
      <div className="absolute top-[2%] left-[70%] w-1 h-1 rounded-full bg-pastel-yellow/40" />

      {/* Nightstands */}
      <div className="absolute bottom-[18%] left-[3%]" style={_depth(0.55)}>
        <div className="w-[50px] h-[50px] rounded-xl bg-pastel-card/50 border border-pastel-border/15 shadow-sm">
          <div className="absolute top-[4%] left-1/2 -translate-x-1/2 w-[4px] h-[35%] bg-pastel-border/15 rounded-full" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-pastel-yellow/50" />
        </div>
        <div className="absolute -bottom-[3px] left-[10%] right-[10%] h-[3px] rounded-full bg-black/8" />
      </div>
      <div className="absolute bottom-[18%] right-[3%]" style={_depth(0.55)}>
        <div className="w-[50px] h-[50px] rounded-xl bg-pastel-card/50 border border-pastel-border/15 shadow-sm">
          <div className="absolute top-[4%] left-1/2 -translate-x-1/2 w-[4px] h-[35%] bg-pastel-border/15 rounded-full" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-pastel-yellow/50" />
        </div>
        <div className="absolute -bottom-[3px] left-[10%] right-[10%] h-[3px] rounded-full bg-black/8" />
      </div>

      {/* Sleep zone background */}
      <div className="absolute bottom-[6%] left-[3%] right-[3%] h-[38%] rounded-2xl bg-pastel-purple/8 border border-pastel-purple/10" />

      {/* Beds aligned with sleep positions */}
      {petPositions.map((pos, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: `calc(${pos.x}% - 10%)`,
            top: `calc(${pos.top}% - 4%)`,
            width: '20%',
            maxWidth: '120px',
            aspectRatio: '2/1',
          }}
        >
          <div className="absolute -bottom-[2px] left-[3%] right-[3%] h-[4px] rounded-full bg-black/8" />
          <div className="absolute inset-0 bg-gradient-to-b from-pastel-purple/40 to-pastel-purple/25 rounded-xl border border-pastel-border/15 shadow-sm">
            <div className="absolute -top-[4px] left-[5%] right-[5%] h-[7px] bg-pastel-purple/35 rounded-t-lg" />
            <div className="absolute top-[14%] left-[5%] right-[5%] bottom-[12%] bg-white/50 rounded-lg" />
            <div className="absolute top-[16%] left-[7%] w-[20%] h-[25%] bg-pastel-yellow/35 rounded-lg" />
            <div className="absolute bottom-[12%] left-[26%] right-[5%] h-[50%] bg-gradient-to-b from-pastel-pink/40 to-pastel-pink/25 rounded-lg" />
            <div className="absolute top-[38%] left-[30%] w-[2px] h-[35%] bg-white/10 rounded-full" />
          </div>
        </div>
      ))}
    </>
  );
}

/* ───────── Main export ───────── */

export function RoomScene({ room, petPositions }: { room: RoomId; petPositions: SleepPosition[] }) {
  const depth = (d: number): React.CSSProperties => ({
    transform: `scale(${0.5 + d * 0.55})`,
    transformOrigin: 'bottom center',
  });

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      <WallSection room={room} />
      <FloorSection room={room} />
      <div className="absolute top-[58%] left-0 right-0 h-px bg-gradient-to-r from-transparent via-pastel-border/25 to-transparent" />

      <div className="absolute inset-0">
        {room === 'living' && <LivingFurniture depth={depth} />}
        {room === 'eat' && <EatFurniture depth={depth} />}
        {room === 'play' && <PlayFurniture depth={depth} />}
        {room === 'bath' && <BathFurniture depth={depth} />}
        {room === 'sleep' && <SleepFurniture petPositions={petPositions} depth={depth} />}
      </div>

      <Window room={room} />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/[0.04] via-transparent to-black/[0.02]" />
    </div>
  );
}

export type { RoomId };
