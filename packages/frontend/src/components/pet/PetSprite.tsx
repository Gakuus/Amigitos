'use client';

import { useEffect, useRef, useState } from 'react';
import type { PetMood, PetSpecies } from '@amigitos/shared';
import { loadPetImage } from '@/lib/petImageLoader';

interface PetSpriteProps {
  species: PetSpecies;
  mood: PetMood;
  isSleeping?: boolean;
  size?: number;
  customImageUrl?: string;
}

/* ─── Pixel palette ─── */
const C = {
  w: '#FFFFFF', W: '#F1F5F9', c: '#FEF3C7', C_: '#FDE68A',
  p: '#FCE7F3', P: '#F472B6', r: '#FCA5A5', o: '#FDBA74',
  O: '#F97316', y: '#FDE68A', Y: '#FBBF24', g: '#86EFAC',
  G: '#4ADE80', t: '#5EEAD4', T: '#2DD4BF', s: '#BAE6FD',
  S: '#7DD3FC', b: '#93C5FD', B: '#60A5FA', v: '#D8B4FE',
  V: '#A78BFA', m: '#F472B6', M: '#EC4899', n: '#D4A574',
  N: '#A88B6E', d: '#1E293B', D: '#0F172A', k: '#475569',
  K: '#64748B', a: '#9CA3AF', _: '' as const, X: '#A78BFA',
  L: '#C4B5FD', q: '#F8FAFC', Q: '#E2E8F0', J: '#FB923C',
  H: '#14B8A6', z: '#0D9488',
};

type CK = keyof typeof C;

/* ─── Pixel grid helpers ─── */
type Grid = CK[][];

const SZ = 32;

function g(): Grid {
  return Array.from({ length: SZ }, () => Array(SZ).fill('_' as CK));
}

function px(g: Grid, x: number, y: number, c: CK) {
  if (x >= 0 && x < SZ && y >= 0 && y < SZ) g[y]![x] = c;
}

function rect(g: Grid, x: number, y: number, w: number, h: number, c: CK) {
  for (let dy = 0; dy < h; dy++)
    for (let dx = 0; dx < w; dx++)
      px(g, x + dx, y + dy, c);
}

function circle(g: Grid, cx: number, cy: number, r: number, c: CK) {
  for (let y = cy - r; y <= cy + r; y++)
    for (let x = cx - r; x <= cx + r; x++)
      if ((x - cx) ** 2 + (y - cy) ** 2 <= r * r)
        px(g, x, y, c);
}

function hr(g: Grid, y: number, x1: number, x2: number, c: CK) {
  for (let x = x1; x <= x2; x++) px(g, x, y, c);
}

function vr(g: Grid, x: number, y1: number, y2: number, c: CK) {
  for (let y = y1; y <= y2; y++) px(g, x, y, c);
}

/* ─── Eye templates ─── */
function eyesHappy(g: Grid, cx: number, y: number, dx: number, sleep: boolean) {
  if (sleep) {
    hr(g, y, cx - dx - 1, cx - dx + 1, 'd');
    hr(g, y + 1, cx - dx, cx - dx + 1, 'd');
    hr(g, y, cx + dx - 1, cx + dx + 1, 'd');
    hr(g, y + 1, cx + dx - 1, cx + dx, 'd');
    return;
  }
  circle(g, cx - dx, y, 2, 'w');
  circle(g, cx + dx, y, 2, 'w');
  px(g, cx - dx, y, 'd');
  px(g, cx + dx, y, 'd');
  px(g, cx - dx + 1, y - 1, 'w');
  px(g, cx + dx + 1, y - 1, 'w');
}

function eyesAngry(g: Grid, cx: number, y: number, dx: number, sleep: boolean) {
  if (sleep) {
    hr(g, y, cx - dx - 1, cx - dx + 1, 'd');
    hr(g, y, cx + dx - 1, cx + dx + 1, 'd');
    return;
  }
  circle(g, cx - dx, y, 2, 'w');
  circle(g, cx + dx, y, 2, 'w');
  px(g, cx - dx, y, 'd');
  px(g, cx + dx, y, 'd');
  px(g, cx - dx - 1, y - 2, 'd');
  px(g, cx + dx + 1, y - 2, 'd');
}

function eyesSad(g: Grid, cx: number, y: number, dx: number, sleep: boolean) {
  if (sleep) {
    hr(g, y, cx - dx - 1, cx - dx, 'd');
    hr(g, y, cx + dx, cx + dx + 1, 'd');
    return;
  }
  circle(g, cx - dx, y, 2, 'w');
  circle(g, cx + dx, y + 1, 2, 'w');
  px(g, cx - dx, y, 'd');
  px(g, cx + dx, y + 1, 'd');
}

function mouthHappy(g: Grid, cx: number, y: number) {
  rect(g, cx - 2, y, 4, 2, 'r');
}

function mouthSad(g: Grid, cx: number, y: number) {
  hr(g, y, cx - 2, cx + 1, 'd');
}

function mouthNeutral(g: Grid, cx: number, y: number) {
  hr(g, y, cx - 2, cx + 1, 'd');
}

/* ─── Species drawers ─── */

function drawCat(g: Grid, mood: PetMood, sleep: boolean) {
  const s = sleep;
  if (s) {
    // curled body
    ellipse(g, 12, 22, 10, 8, 'o');
    ellipse(g, 12, 22, 8, 6, 'c');
    // head tucked
    circle(g, 18, 20, 7, 'o');
    hr(g, 13, 20, 24, 'o');
    // closed eyes
    hr(g, 18, 14, 16, 'd');
    hr(g, 18, 20, 22, 'd');
    // ears
    px(g, 14, 14, 'o'); px(g, 15, 13, 'o');
    px(g, 22, 14, 'o'); px(g, 21, 13, 'o');
    return;
  }
  // body
  circle(g, 16, 22, 9, 'o');
  circle(g, 16, 22, 7, 'c');
  // head
  circle(g, 16, 10, 8, 'o');
  // ears
  px(g, 10, 3, 'o'); px(g, 11, 2, 'o'); px(g, 12, 3, 'o');
  px(g, 20, 3, 'o'); px(g, 21, 2, 'o'); px(g, 22, 3, 'o');
  // inner ear
  px(g, 11, 4, 'p'); px(g, 21, 4, 'p');
  // eyes
  if (mood === 'HAPPY') { eyesHappy(g, 16, 9, 4, false); }
  else if (mood === 'SAD' || mood === 'SICK') { eyesSad(g, 16, 9, 4, false); }
  else { eyesHappy(g, 16, 9, 4, false); }
  // nose
  px(g, 16, 11, 'P');
  px(g, 15, 12, 'd'); px(g, 16, 12, 'P'); px(g, 17, 12, 'd');
  // mouth
  if (mood === 'HAPPY') mouthHappy(g, 16, 14);
  else if (mood === 'SAD' || mood === 'SICK') mouthSad(g, 16, 14);
  else mouthNeutral(g, 16, 13);
  // whiskers
  hr(g, 10, 6, 11, 'k'); hr(g, 11, 6, 11, 'k');
  hr(g, 10, 21, 26, 'k'); hr(g, 11, 21, 26, 'k');
  // tail
  vr(g, 6, 18, 23, 'o');
  // legs
  rect(g, 11, 28, 4, 3, 'o');
  rect(g, 17, 28, 4, 3, 'o');
}

function drawDog(g: Grid, mood: PetMood, sleep: boolean) {
  const s = sleep;
  if (s) {
    ellipse(g, 14, 22, 11, 8, 'v');
    ellipse(g, 14, 22, 8, 6, 'c');
    circle(g, 20, 18, 7, 'v');
    hr(g, 16, 16, 24, 'v');
    hr(g, 17, 18, 21, 'd');
    px(g, 14, 14, 'v'); px(g, 15, 13, 'v');
    px(g, 22, 14, 'v'); px(g, 23, 13, 'v');
    return;
  }
  circle(g, 16, 22, 9, 'v');
  circle(g, 16, 22, 7, 'c');
  circle(g, 16, 10, 8, 'v');
  // floppy ears
  ellipse(g, 8, 12, 3, 5, 'V');
  ellipse(g, 24, 12, 3, 5, 'V');
  // eyes
  if (mood === 'HAPPY') eyesHappy(g, 16, 9, 4, false);
  else eyesSad(g, 16, 9, 4, false);
  // snout
  circle(g, 16, 13, 4, 'c');
  px(g, 16, 12, 'd');
  // mouth
  if (mood === 'HAPPY') { rect(g, 13, 15, 6, 2, 'r'); px(g, 14, 17, 'r'); }
  else mouthNeutral(g, 16, 14);
  // tail
  vr(g, 6, 19, 22, 'v');
  rect(g, 11, 28, 4, 3, 'v');
  rect(g, 17, 28, 4, 3, 'v');
}

function drawRabbit(g: Grid, mood: PetMood, sleep: boolean) {
  const s = sleep;
  if (s) {
    ellipse(g, 13, 22, 10, 7, 'w');
    ellipse(g, 13, 22, 7, 5, 'q');
    circle(g, 19, 19, 6, 'w');
    hr(g, 16, 17, 24, 'd');
    ellipse(g, 20, 10, 2, 6, 'w');
    return;
  }
  circle(g, 16, 22, 8, 'w');
  circle(g, 16, 10, 7, 'w');
  // ears
  rect(g, 11, 1, 3, 7, 'w');
  rect(g, 18, 1, 3, 7, 'w');
  px(g, 12, 3, 'p'); px(g, 19, 3, 'p');
  px(g, 12, 4, 'p'); px(g, 19, 4, 'p');
  // face
  if (mood === 'HAPPY') eyesHappy(g, 16, 8, 3, false);
  else eyesSad(g, 16, 8, 3, false);
  px(g, 16, 10, 'P');
  // cheeks
  px(g, 11, 10, 'p'); px(g, 21, 10, 'p');
  px(g, 12, 11, 'p'); px(g, 20, 11, 'p');
  if (mood === 'HAPPY') mouthHappy(g, 16, 12);
  else mouthNeutral(g, 16, 12);
  // feet
  ellipse(g, 12, 29, 4, 2, 'w');
  ellipse(g, 20, 29, 4, 2, 'w');
}

function drawHamster(g: Grid, mood: PetMood, sleep: boolean) {
  const s = sleep;
  if (s) {
    ellipse(g, 14, 22, 10, 8, 'y');
    circle(g, 18, 19, 6, 'y');
    hr(g, 17, 15, 20, 'd');
    return;
  }
  // round body
  circle(g, 16, 20, 10, 'y');
  circle(g, 16, 10, 8, 'y');
  // ears
  circle(g, 10, 4, 3, 'y');
  circle(g, 22, 4, 3, 'y');
  px(g, 10, 4, 'p'); px(g, 22, 4, 'p');
  // cheeks
  circle(g, 10, 10, 4, 'c');
  circle(g, 22, 10, 4, 'c');
  // eyes
  if (mood === 'HAPPY') eyesHappy(g, 16, 8, 3, false);
  else eyesSad(g, 16, 8, 3, false);
  // nose
  px(g, 16, 10, 'P');
  if (mood === 'HAPPY') mouthHappy(g, 16, 12);
  else mouthNeutral(g, 16, 12);
  // feet
  rect(g, 11, 28, 4, 3, 'c');
  rect(g, 17, 28, 4, 3, 'c');
}

function drawFox(g: Grid, mood: PetMood, sleep: boolean) {
  const s = sleep;
  if (s) {
    ellipse(g, 13, 22, 10, 8, 'J');
    circle(g, 19, 18, 7, 'J');
    hr(g, 16, 16, 23, 'd');
    px(g, 14, 13, 'J'); px(g, 15, 12, 'J');
    px(g, 22, 13, 'J'); px(g, 23, 12, 'J');
    return;
  }
  circle(g, 16, 22, 9, 'J');
  circle(g, 16, 22, 7, 'c');
  circle(g, 16, 10, 7, 'J');
  // ears
  px(g, 10, 4, 'J'); px(g, 11, 3, 'J'); px(g, 12, 4, 'J');
  px(g, 20, 4, 'J'); px(g, 21, 3, 'J'); px(g, 22, 4, 'J');
  px(g, 11, 5, 'd'); px(g, 21, 5, 'd');
  // snout
  circle(g, 16, 13, 4, 'c');
  px(g, 16, 12, 'd');
  // eyes
  if (mood === 'HAPPY') eyesHappy(g, 16, 8, 4, false);
  else eyesSad(g, 16, 8, 4, false);
  if (mood === 'HAPPY') mouthHappy(g, 16, 14);
  else mouthNeutral(g, 16, 14);
  // tail
  for (let i = 0; i < 4; i++) { px(g, 7 + i, 20 + i, 'J'); }
  px(g, 10, 24, 'c');
  rect(g, 11, 28, 4, 3, 'J');
  rect(g, 17, 28, 4, 3, 'J');
}

function drawPanda(g: Grid, mood: PetMood, sleep: boolean) {
  const s = sleep;
  if (s) {
    ellipse(g, 13, 22, 10, 8, 'w');
    circle(g, 19, 18, 7, 'w');
    hr(g, 16, 16, 24, 'd');
    circle(g, 17, 16, 3, 'd'); circle(g, 23, 16, 3, 'd');
    return;
  }
  circle(g, 16, 22, 9, 'w');
  circle(g, 16, 10, 8, 'w');
  // eye patches
  circle(g, 12, 9, 4, 'd');
  circle(g, 20, 9, 4, 'd');
  // ears
  circle(g, 10, 4, 3, 'd');
  circle(g, 22, 4, 3, 'd');
  // eyes
  if (sleep) {
    hr(g, 8, 10, 13, 'd'); hr(g, 9, 11, 12, 'd');
    hr(g, 8, 19, 22, 'd'); hr(g, 9, 20, 21, 'd');
  } else if (mood === 'HAPPY') { eyesHappy(g, 16, 9, 4, false); }
  else { eyesSad(g, 16, 9, 4, false); }
  // nose
  px(g, 16, 12, 'd');
  if (mood === 'HAPPY') mouthHappy(g, 16, 14);
  else mouthNeutral(g, 16, 13);
  // arms
  circle(g, 9, 22, 3, 'd');
  circle(g, 23, 22, 3, 'd');
  rect(g, 11, 28, 4, 3, 'd');
  rect(g, 17, 28, 4, 3, 'd');
}

function drawPenguin(g: Grid, mood: PetMood, sleep: boolean) {
  const s = sleep;
  if (s) {
    ellipse(g, 14, 22, 9, 8, 'd');
    ellipse(g, 14, 22, 6, 6, 'w');
    circle(g, 19, 19, 6, 'd');
    hr(g, 17, 16, 21, 'd');
    return;
  }
  // body
  ellipse(g, 16, 20, 8, 10, 'd');
  ellipse(g, 16, 20, 5, 8, 'w');
  // head
  circle(g, 16, 8, 7, 'd');
  circle(g, 16, 8, 5, 'w');
  // beak
  px(g, 16, 9, 'O'); px(g, 15, 10, 'O'); px(g, 16, 10, 'O'); px(g, 17, 10, 'O');
  // eyes
  if (sleep) { hr(g, 7, 13, 15, 'd'); hr(g, 7, 17, 19, 'd'); }
  else if (mood === 'HAPPY') { eyesHappy(g, 16, 7, 3, false); }
  else { eyesSad(g, 16, 7, 3, false); }
  if (mood === 'HAPPY') { hr(g, 12, 14, 18, 'O'); }
  // flippers
  ellipse(g, 7, 20, 2, 5, 'd');
  ellipse(g, 25, 20, 2, 5, 'd');
  // feet
  rect(g, 11, 29, 4, 2, 'O');
  rect(g, 17, 29, 4, 2, 'O');
}

function drawDragon(g: Grid, mood: PetMood, sleep: boolean) {
  const s = sleep;
  if (s) {
    ellipse(g, 13, 22, 10, 8, 'g');
    circle(g, 19, 18, 7, 'g');
    hr(g, 16, 16, 24, 'd');
    px(g, 14, 13, 'g'); px(g, 15, 12, 'g');
    px(g, 22, 13, 'g'); px(g, 23, 12, 'g');
    return;
  }
  circle(g, 16, 22, 9, 'g');
  circle(g, 16, 22, 7, 'G');
  circle(g, 16, 10, 7, 'g');
  // horns
  px(g, 12, 4, 'd'); px(g, 13, 3, 'd');
  px(g, 20, 4, 'd'); px(g, 19, 3, 'd');
  // wings
  for (let i = 0; i < 4; i++) {
    rect(g, 2 + i, 14 + i * 2, 3, 2, 'g');
    rect(g, 27 - i, 14 + i * 2, 3, 2, 'g');
  }
  // eyes
  if (sleep) { hr(g, 8, 13, 15, 'd'); hr(g, 8, 17, 19, 'd'); }
  else if (mood === 'HAPPY') { rect(g, 12, 8, 3, 3, 'Y'); rect(g, 17, 8, 3, 3, 'Y'); px(g, 13, 8, 'd'); px(g, 18, 8, 'd'); }
  else { rect(g, 12, 8, 3, 3, 'Y'); rect(g, 17, 8, 3, 3, 'Y'); px(g, 13, 8, 'd'); px(g, 18, 8, 'd'); }
  // snout
  rect(g, 14, 12, 4, 3, 'G');
  if (mood === 'HAPPY') { rect(g, 14, 14, 4, 2, 'r'); }
  else mouthNeutral(g, 16, 13);
  // spikes
  px(g, 13, 5, 'Y'); px(g, 19, 5, 'Y');
  rect(g, 11, 28, 4, 3, 'g');
  rect(g, 17, 28, 4, 3, 'g');
}

function drawUnicorn(g: Grid, mood: PetMood, sleep: boolean) {
  const s = sleep;
  if (s) {
    ellipse(g, 13, 22, 10, 8, 'w');
    circle(g, 19, 18, 7, 'w');
    hr(g, 16, 16, 24, 'd');
    px(g, 20, 10, 'Y');
    return;
  }
  circle(g, 16, 22, 8, 'w');
  circle(g, 16, 10, 7, 'w');
  // horn
  px(g, 16, 2, 'Y'); px(g, 16, 3, 'Y'); px(g, 15, 4, 'Y'); px(g, 16, 4, 'Y'); px(g, 17, 4, 'Y');
  // mane
  for (let i = 0; i < 5; i++) {
    px(g, 9 - Math.floor(i / 2), 7 + i * 2, 'P');
    px(g, 10 - Math.floor(i / 2), 8 + i * 2, 'P');
  }
  // ears
  px(g, 12, 5, 'w'); px(g, 20, 5, 'w');
  // eyes
  if (sleep) { hr(g, 8, 13, 15, 'd'); hr(g, 8, 17, 19, 'd'); }
  else if (mood === 'HAPPY') eyesHappy(g, 16, 8, 3, false);
  else eyesSad(g, 16, 8, 3, false);
  // snout
  px(g, 16, 11, 'P');
  if (mood === 'HAPPY') mouthHappy(g, 16, 12);
  else mouthNeutral(g, 16, 12);
  rect(g, 11, 28, 4, 3, 'w');
  rect(g, 17, 28, 4, 3, 'w');
}

function ellipse(g: Grid, cx: number, cy: number, rx: number, ry: number, c: CK) {
  for (let y = cy - ry; y <= cy + ry; y++)
    for (let x = cx - rx; x <= cx + rx; x++)
      if (((x - cx) * (x - cx)) / (rx * rx) + ((y - cy) * (y - cy)) / (ry * ry) <= 1)
        px(g, x, y, c);
}

/* ─── Drawing dispatch ─── */
function draw(species: PetSpecies, mood: PetMood, sleep: boolean): Grid {
  const grid = g();
  const fns: Record<string, (g: Grid, m: PetMood, s: boolean) => void> = {
    CAT: drawCat, DOG: drawDog, RABBIT: drawRabbit,
    HAMSTER: drawHamster, FOX: drawFox, PANDA: drawPanda,
    PENGUIN: drawPenguin, DRAGON: drawDragon, UNICORN: drawUnicorn,
  };
  const fn = fns[species] ?? drawCat;
  fn(grid, mood, sleep);
  return grid;
}

/* ─── Render ─── */
export function PetSprite({ species, mood, isSleeping, size = 200, customImageUrl }: PetSpriteProps) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [externalGrid, setExternalGrid] = useState<string[][] | null>(null);
  const scale = Math.max(4, Math.round(size / SZ));

  useEffect(() => {
    if (!customImageUrl) {
      setExternalGrid(null);
      return;
    }
    let cancelled = false;
    loadPetImage(customImageUrl).then((grid) => {
      if (!cancelled) setExternalGrid(grid);
    });
    return () => { cancelled = true; };
  }, [customImageUrl]);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, c.width, c.height);

    if (externalGrid) {
      for (let y = 0; y < Math.min(SZ, externalGrid.length); y++) {
        for (let x = 0; x < Math.min(SZ, externalGrid[y]?.length ?? 0); x++) {
          const v = externalGrid[y]![x]!;
          if (v && v !== '_') {
            ctx.fillStyle = v;
            ctx.fillRect(x, y, 1, 1);
          }
        }
      }
      return;
    }

    const grid = draw(species, mood, isSleeping ?? false);
    for (let y = 0; y < SZ; y++) {
      for (let x = 0; x < SZ; x++) {
        const v = C[grid[y]![x] as CK];
        if (v) {
          ctx.fillStyle = v;
          ctx.fillRect(x, y, 1, 1);
        }
      }
    }
  }, [species, mood, isSleeping, externalGrid]);

  const displaySize = SZ * scale;

  return (
    <div
      className={`relative flex items-center justify-center ${isSleeping ? 'animate-breathe-sleep' : 'animate-bounce-idle'}`}
      style={{ width: size, height: size }}
    >
      {/* Shadow */}
      <div
        className="absolute bottom-2 rounded-full bg-black/10 dark:bg-black/30"
        style={{
          width: size * 0.4,
          height: size * 0.08,
          filter: 'blur(3px)',
        }}
      />
      {/* Glow aura */}
      <div
        className="absolute rounded-full animate-pulse"
        style={{
          width: size * 0.8,
          height: size * 0.8,
          background: `radial-gradient(circle, ${mood === 'HAPPY' ? '#a78bfa' : mood === 'SAD' ? '#60a5fa' : '#94a3b8'}22 0%, transparent 70%)`,
        }}
      />
      <canvas
        ref={ref}
        width={SZ}
        height={SZ}
        className="relative drop-shadow-lg"
        style={{
          width: displaySize,
          height: displaySize,
          imageRendering: 'pixelated',
          transform: isSleeping ? 'scaleY(0.75)' : undefined,
        }}
      />
      {isSleeping && <SleepingZzz />}
    </div>
  );
}

function SleepingZzz() {
  return (
    <div className="absolute -top-2 -right-1 flex flex-col items-center">
      <span className="text-xs font-bold text-pastel-purple dark:text-indigo-400 animate-float-up" style={{ animationDelay: '0s' }}>z</span>
      <span className="text-sm font-bold text-pastel-purple dark:text-indigo-400 animate-float-up" style={{ animationDelay: '0.4s' }}>z</span>
      <span className="text-base font-bold text-pastel-purple-dark dark:text-indigo-300 animate-float-up" style={{ animationDelay: '0.8s' }}>Z</span>
    </div>
  );
}
