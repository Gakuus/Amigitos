'use client';

import type { SleepPosition } from './sleepTileMap';
import {
  SofaSVG, LampSVG, CoffeeTableSVG, WallArtSVG, PlantSVG, BookshelfSVG,
  DiningTableSVG, DiningChairSVG, HangingLampSVG, SideboardSVG,
  PlayMatSVG, BlockSVG, ToyBoxSVG, BallSVG,
  BathtubSVG, ShowerSVG, MirrorSVG, TowelsSVG, BathMatSVG,
  MoonSVG, BedSVG, NightstandSVG,
} from './FurnitureSVG';

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
  const isSleep = room === 'sleep';
  const isBath = room === 'bath';
  const isPlay = room === 'play';

  return (
    <div className={`absolute top-0 left-0 right-0 h-[58%] overflow-hidden ${isSleep ? 'bg-gradient-to-b from-[#0a0a1a] via-[#12122a] to-[#1a1a3a]' : 'bg-gradient-to-b'}`}>
      <div className={`absolute inset-0 bg-gradient-to-b ${t.wall}`}>
        {/* Wallpaper pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: isBath
              ? 'repeating-linear-gradient(90deg, currentColor 0px, currentColor 1px, transparent 1px, transparent 24px), repeating-linear-gradient(0deg, currentColor 0px, currentColor 1px, transparent 1px, transparent 24px)'
              : 'radial-gradient(circle, currentColor 1px, transparent 1px)',
            backgroundSize: isBath ? '24px 24px' : '24px 24px',
            color: isSleep ? '#6b5b95' : 'inherit',
          }}
        />

        {/* Additional wallpaper for play room */}
        {isPlay && (
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: 'repeating-linear-gradient(60deg, transparent, transparent 20px, currentColor 20px, currentColor 21px)',
              backgroundSize: '40px 40px',
            }}
          />
        )}

        {/* Crown molding */}
        <div className={`absolute bottom-0 left-0 right-0 h-[6px] bg-gradient-to-r from-transparent via-white/40 to-transparent ${isSleep ? 'opacity-20' : ''}`} />

        {/* Baseboard */}
        <div className={`absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-pastel-border/30 to-transparent ${isSleep ? 'opacity-20' : ''}`} />
      </div>
    </div>
  );
}

/* ───────── Floor ───────── */

function FloorSection({ room }: { room: RoomId }) {
  const t = roomTheme[room]!;
  const isPlay = room === 'play';
  const isBath = room === 'bath';
  const isSleep = room === 'sleep';

  return (
    <div className="absolute bottom-0 left-0 right-0 h-[42%] overflow-hidden">
      {/* Floor gradient */}
      <div className={`absolute inset-0 bg-gradient-to-b ${t.floor}`} />

      {/* Play room: colorful circles */}
      {isPlay && (
        <div className="absolute inset-0 opacity-[0.08]">
          <div className="absolute bottom-[20%] left-[10%] w-12 h-12 rounded-full bg-pastel-pink" />
          <div className="absolute bottom-[40%] left-[30%] w-8 h-8 rounded-full bg-pastel-sky" />
          <div className="absolute bottom-[15%] right-[20%] w-10 h-10 rounded-full bg-pastel-yellow" />
          <div className="absolute bottom-[50%] right-[8%] w-6 h-6 rounded-full bg-pastel-green" />
        </div>
      )}

      {/* Perspective grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: isSleep
            ? 'linear-gradient(90deg, rgba(100,80,180,0.08) 1px, transparent 1px), linear-gradient(0deg, rgba(100,80,180,0.05) 1px, transparent 1px)'
            : 'linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(0deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '6% 8%',
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)',
        }}
      />

      {/* Depth fade at back of floor */}
      <div className="absolute top-0 left-0 right-0 h-[30%] bg-gradient-to-b from-black/[var(--floor-fade)] to-transparent" style={{ '--floor-fade': isSleep ? '0.15' : '0.08' } as React.CSSProperties} />

      {/* Front edge shadow */}
      <div className="absolute bottom-0 left-0 right-0 h-[8%] bg-gradient-to-b from-transparent to-black/10 pointer-events-none" />
    </div>
  );
}

/* ───────── Window ───────── */

function Window({ room }: { room: RoomId }) {
  const isDark = room === 'sleep';
  const isBath = room === 'bath';

  // No window in bathroom (has mirror instead)
  if (isBath) return null;

  const curtainColor = room === 'sleep' ? 'from-pastel-purple/20 to-pastel-purple/10'
    : room === 'play' ? 'from-pastel-sky/20 to-pastel-sky/10'
    : 'from-pastel-pink/20 to-pastel-pink/10';

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
      <div className={`absolute top-0 left-[-6%] w-[12%] h-full rounded-b-lg bg-gradient-to-b ${curtainColor}`} />
      <div className={`absolute top-0 right-[-6%] w-[12%] h-full rounded-b-lg bg-gradient-to-b ${curtainColor}`} />
    </div>
  );
}

/* ───────── Living Room ───────── */

function LivingFurniture({ depth }: { depth: (d: number) => React.CSSProperties }) {
  return (
    <>
      {/* Sofa */}
      <div className="absolute bottom-[20%] left-1/2 -translate-x-1/2" style={depth(0.55)}>
        <div className="w-[52vw] max-w-[320px] h-[80px]">
          <SofaSVG />
        </div>
      </div>

      {/* Coffee Table */}
      <div className="absolute bottom-[11%] left-1/2 -translate-x-1/2" style={depth(0.45)}>
        <div className="w-[38vw] max-w-[220px] h-[55px]">
          <CoffeeTableSVG />
        </div>
      </div>

      {/* Lamp */}
      <div className="absolute bottom-[22%] right-[6%]" style={depth(0.7)}>
        <div className="w-[36px] h-[100px]">
          <LampSVG />
        </div>
      </div>

      {/* Wall Art */}
      <div className="absolute top-[8%] left-[5%] w-[72px] h-[54px]">
        <WallArtSVG />
      </div>

      {/* Plant */}
      <div className="absolute top-[38%] left-[4%] w-[42px] h-[68px]">
        <PlantSVG />
      </div>

      {/* Bookshelf */}
      <div className="absolute top-[6%] right-[3%] w-[52px] h-[120px]">
        <BookshelfSVG />
      </div>
    </>
  );
}

/* ───────── Eat Room ───────── */

function EatFurniture({ petPositions, depth }: { petPositions: SleepPosition[]; depth: (d: number) => React.CSSProperties }) {
  return (
    <>
      {/* Table */}
      <div className="absolute bottom-[22%] left-1/2 -translate-x-1/2" style={depth(0.5)}>
        <div className="w-[52vw] max-w-[320px] h-[65px]">
          <DiningTableSVG />
        </div>
      </div>

      {/* Chairs — one per pet, positioned around the table */}
      {petPositions.map((pos, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: `${pos.x * 100}%`,
            bottom: `calc(16% + ${(1 - pos.depth) * 40}px)`,
            transform: `translateX(-50%) scale(${0.5 + pos.depth * 0.55})`,
            transformOrigin: 'bottom center',
          }}
        >
          <div className="w-[14vw] max-w-[80px] h-[90px]">
            <DiningChairSVG />
          </div>
        </div>
      ))}

      {/* Hanging lamp */}
      <div className="absolute top-[1%] left-1/2 -translate-x-1/2 w-[64px] h-[80px]">
        <HangingLampSVG />
      </div>

      {/* Sideboard */}
      <div className="absolute bottom-[22%] right-[6%]" style={depth(0.45)}>
        <div className="w-[60px] h-[48px]">
          <SideboardSVG />
        </div>
      </div>
    </>
  );
}

/* ───────── Play Room ───────── */

function PlayFurniture({ depth }: { depth: (d: number) => React.CSSProperties }) {
  return (
    <>
      {/* Play mat */}
      <div className="absolute bottom-[18%] left-1/2 -translate-x-1/2 w-[72%] max-w-[420px] h-[50px]">
        <PlayMatSVG />
      </div>

      {/* Bookshelf */}
      <div className="absolute top-[10%] left-[3%] w-[48px] h-[110px]">
        <BookshelfSVG />
      </div>

      {/* Blocks */}
      <div className="absolute bottom-[28%] left-[8%]" style={depth(0.6)}>
        <div className="w-[32px] h-[32px]">
          <BlockSVG color="#d88aa0" />
        </div>
      </div>
      <div className="absolute bottom-[26%] left-[16%]" style={depth(0.55)}>
        <div className="w-[28px] h-[28px]">
          <BlockSVG color="#78b8d0" />
        </div>
      </div>
      <div className="absolute bottom-[30%] right-[10%]" style={depth(0.53)}>
        <div className="w-[30px] h-[30px]">
          <BlockSVG color="#d0b850" />
        </div>
      </div>

      {/* Toy box */}
      <div className="absolute bottom-[18%] right-[3%]" style={depth(0.55)}>
        <div className="w-[54px] h-[44px]">
          <ToyBoxSVG />
        </div>
      </div>

      {/* Scattered balls */}
      <div className="absolute bottom-[22%] left-[28%]" style={depth(0.5)}>
        <div className="w-[22px] h-[22px] animate-bounce-gentle" style={{ animationDelay: '0.2s' }}>
          <BallSVG color="#e8a0a0" />
        </div>
      </div>
      <div className="absolute bottom-[24%] right-[28%]" style={depth(0.48)}>
        <div className="w-[20px] h-[20px] animate-bounce-gentle" style={{ animationDelay: '0.6s' }}>
          <BallSVG color="#78b8d0" />
        </div>
      </div>
    </>
  );
}

/* ───────── Bath Room ───────── */

function BathFurniture({ depth }: { depth: (d: number) => React.CSSProperties }) {
  return (
    <>
      {/* Mirror */}
      <div className="absolute top-[4%] left-1/2 -translate-x-1/2 w-[15%] max-w-[90px] h-[110px]">
        <MirrorSVG />
      </div>

      {/* Bathtub */}
      <div className="absolute bottom-[14%] left-1/2 -translate-x-1/2" style={depth(0.5)}>
        <div className="w-[60vw] max-w-[350px] h-[90px]">
          <BathtubSVG />
        </div>
      </div>

      {/* Towels */}
      <div className="absolute top-[10%] left-[4%] w-[24px] h-[44px]">
        <TowelsSVG />
      </div>

      {/* Shower */}
      <div className="absolute bottom-[22%] right-[4%]" style={depth(0.65)}>
        <div className="w-[28px] h-[90px]">
          <ShowerSVG />
        </div>
      </div>

      {/* Bath mat */}
      <div className="absolute bottom-[6%] left-1/2 -translate-x-1/2 w-[45%] max-w-[260px] h-[18px]">
        <BathMatSVG />
      </div>
    </>
  );
}

/* ───────── Sleep Room ───────── */

function SleepFurniture({ petPositions, depth: _depth }: { petPositions: SleepPosition[]; depth: (d: number) => React.CSSProperties }) {
  return (
    <>
      {/* Moon */}
      <div className="absolute top-[2%] right-[8%] w-[44px] h-[44px]">
        <MoonSVG />
      </div>

      {/* Stars */}
      <div className="absolute top-[5%] left-[8%] w-1.5 h-1.5 rounded-full bg-pastel-yellow/50 animate-pulse-soft" style={{ animationDelay: '0.3s' }} />
      <div className="absolute top-[9%] left-[22%] w-1 h-1 rounded-full bg-pastel-yellow/40 animate-pulse-soft" style={{ animationDelay: '0.7s' }} />
      <div className="absolute top-[3%] left-[40%] w-1.5 h-1.5 rounded-full bg-pastel-yellow/50 animate-pulse-soft" style={{ animationDelay: '1.2s' }} />
      <div className="absolute top-[7%] left-[55%] w-1 h-1 rounded-full bg-pastel-yellow/35 animate-pulse-soft" style={{ animationDelay: '0.5s' }} />
      <div className="absolute top-[2%] left-[70%] w-1 h-1 rounded-full bg-pastel-yellow/40 animate-pulse-soft" style={{ animationDelay: '0.9s' }} />

      {/* Nightstands */}
      <div className="absolute bottom-[18%] left-[3%]" style={_depth(0.55)}>
        <div className="w-[46px] h-[56px]">
          <NightstandSVG />
        </div>
      </div>
      <div className="absolute bottom-[18%] right-[3%]" style={_depth(0.55)}>
        <div className="w-[46px] h-[56px]">
          <NightstandSVG />
        </div>
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
          <div className="w-full h-full">
            <BedSVG />
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
        {room === 'eat' && <EatFurniture petPositions={petPositions} depth={depth} />}
        {room === 'play' && <PlayFurniture depth={depth} />}
        {room === 'bath' && <BathFurniture depth={depth} />}
        {room === 'sleep' && <SleepFurniture petPositions={petPositions} depth={depth} />}
      </div>

      <Window room={room} />

      {/* Room ambient overlays */}
      {room === 'sleep' && (
        <div className="absolute inset-0 pointer-events-none">
          {/* Moonbeam */}
          <div className="absolute top-0 right-[8%] w-[20%] h-[70%] bg-gradient-to-b from-pastel-yellow/[0.03] via-pastel-yellow/[0.02] to-transparent" style={{ clipPath: 'polygon(40% 0%, 60% 0%, 100% 100%, 0% 100%)', transform: 'skewX(-8deg)' }} />
        </div>
      )}

      {room === 'living' && (
        <div className="absolute inset-0 pointer-events-none">
          {/* Warm glow from lamp */}
          <div className="absolute bottom-[22%] right-[6%] w-[120px] h-[120px] rounded-full bg-pastel-yellow/[0.04]" />
        </div>
      )}

      {/* Ambient fade */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/[0.04] via-transparent to-black/[0.02]" />
    </div>
  );
}

export type { RoomId };
