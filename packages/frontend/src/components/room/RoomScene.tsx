'use client';

import type { SleepPosition } from './sleepTileMap';

const VW = 1600;
const VH = 900;

/* ───────── Diamond tile floor ───────── */

function IsometricFloor() {
  const cols = 16;
  const rows = 12;
  const tileW = VW / cols;
  const tileH = tileW * 0.5;
  const offsetX = VW / 2;
  const offsetY = 200;
  const tiles: JSX.Element[] = [];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cx = (c - r) * tileW * 0.5 + offsetX;
      const cy = (c + r) * tileH * 0.5 + offsetY;
      const dark = (c + r) % 2 === 0;
      tiles.push(
        <polygon
          key={`${r}-${c}`}
          points={`${cx},${cy - tileH} ${cx + tileW},${cy} ${cx},${cy + tileH} ${cx - tileW},${cy}`}
          fill={dark ? 'rgba(167,139,250,0.08)' : 'rgba(167,139,250,0.04)'}
          stroke="rgba(167,139,250,0.12)"
          strokeWidth="1"
        />
      );
    }
  }
  return <g>{tiles}</g>;
}

/* ───────── Walls ───────── */

function IsometricWalls() {
  return (
    <g>
      {/* Left wall */}
      <polygon
        points="0,0 400,150 400,500 0,200"
        fill="url(#wallLeft)"
        opacity={0.35}
      />
      {/* Right wall */}
      <polygon
        points="1600,0 1200,150 1200,500 1600,200"
        fill="url(#wallRight)"
        opacity={0.35}
      />
      {/* Wall baseboards */}
      <line x1="0" y1="200" x2="400" y2="350" stroke="rgba(167,139,250,0.2)" strokeWidth="4" />
      <line x1="1600" y1="200" x2="1200" y2="350" stroke="rgba(167,139,250,0.2)" strokeWidth="4" />
    </g>
  );
}

/* ───────── Room scenes ───────── */

function LivingScene() {
  return (
    <g>
      {/* Window - centered, arched */}
      <rect x={620} y={40} width={360} height={340} rx={180} ry={180} fill="url(#window)" />
      <rect x={620} y={40} width={360} height={340} rx={180} ry={180} fill="none" stroke="#a78bfa" strokeWidth="4" />
      <rect x={625} y={200} width={350} height={180} rx={10} fill="url(#windowsill)" />
      <line x1={800} y1={40} x2={800} y2={380} stroke="rgba(167,139,250,0.3)" strokeWidth="3" />
      <line x1={625} y1={190} x2={975} y2={190} stroke="rgba(167,139,250,0.3)" strokeWidth="3" />

      {/* Curtains */}
      <rect x={570} y={30} width={60} height={380} rx={10} fill="url(#curtain)" opacity={0.25} />
      <rect x={970} y={30} width={60} height={380} rx={10} fill="url(#curtain)" opacity={0.25} />

      {/* Sofa */}
      <g transform="translate(800, 530)">
        <ellipse cx={0} cy={70} rx={220} ry={16} fill="rgba(0,0,0,0.08)" />
        <rect x={-200} y={-60} width={400} height={90} rx={18} fill="url(#sofaBack)" />
        <rect x={-192} y={-52} width={384} height={60} rx={12} fill="url(#sofaCushion)" />
        <rect x={-210} y={25} width={420} height={42} rx={14} fill="url(#sofaSeat)" />
        <rect x={-192} y={30} width={384} height={30} rx={8} fill="url(#sofaCushion)" opacity={0.5} />
        <rect x={-240} y={-30} width={48} height={90} rx={14} fill="url(#sofaArm)" />
        <rect x={192} y={-30} width={48} height={90} rx={14} fill="url(#sofaArm)" />
      </g>

      {/* Rug under sofa */}
      <ellipse cx={800} cy={580} rx={300} ry={45} fill="url(#rug)" opacity={0.3} />

      {/* Lamp */}
      <g transform="translate(1310, 480)">
        <rect x={-18} y={0} width={36} height={50} rx={4} fill="#c4b5fd" />
        <rect x={-22} y={-4} width={44} height={6} rx={3} fill="#ddd6fe" />
        <line x1={0} y1={-4} x2={0} y2={-80} stroke="#a78bfa" strokeWidth="3" />
        <path d="M-30 -80 Q0 -130 30 -80" fill="#fef3c7" opacity={0.7} stroke="#fde68a" strokeWidth="2" />
        <ellipse cx={0} cy={-80} rx={34} ry={10} fill="#fef3c7" opacity={0.5} />
        {/* Lamp glow */}
        <ellipse cx={0} cy={-40} rx={60} ry={30} fill="#fef3c7" opacity={0.06} />
      </g>

      {/* Picture frame on wall */}
      <rect x={180} y={80} width={100} height={80} rx={6} fill="#e9d5ff" stroke="#c4b5fd" strokeWidth="3" />
      <circle cx={230} cy={120} r={20} fill="#f9a8d4" opacity={0.5} />
      <rect x={200} y={140} width={60} height={4} rx={2} fill="#a78bfa" opacity={0.3} />
    </g>
  );
}

function EatScene() {
  return (
    <g>
      {/* Hanging lamp */}
      <line x1={800} y1={0} x2={800} y2={100} stroke="#c4b5fd" strokeWidth="2" />
      <path d="M740 100 Q800 150 860 100" fill="#fef3c7" opacity={0.6} stroke="#fde68a" strokeWidth="2" />
      <line x1={760} y1={105} x2={840} y2={105} stroke="#c4b5fd" strokeWidth="2" />

      {/* Dining table */}
      <g transform="translate(800, 530)">
        <ellipse cx={0} cy={85} rx={220} ry={18} fill="rgba(0,0,0,0.08)" />
        <rect x={-180} y={8} width={8} height={72} rx={3} fill="#c4b5fd" />
        <rect x={172} y={8} width={8} height={72} rx={3} fill="#c4b5fd" />
        <ellipse cx={0} cy={6} rx={220} ry={38} fill="url(#tableTop)" stroke="#a78bfa" strokeWidth="2" />
        <ellipse cx={0} cy={2} rx={210} ry={34} fill="url(#tableCloth)" />

        {/* Plates */}
        <ellipse cx={-80} cy={0} rx={32} ry={16} fill="#f8f8f8" stroke="#ddd" strokeWidth="1" />
        <ellipse cx={-80} cy={-2} rx={24} ry={11} fill="#fff" />
        <ellipse cx={80} cy={0} rx={32} ry={16} fill="#f8f8f8" stroke="#ddd" strokeWidth="1" />
        <ellipse cx={80} cy={-2} rx={24} ry={11} fill="#fff" />
        <ellipse cx={0} cy={-4} rx={32} ry={16} fill="#f8f8f8" stroke="#ddd" strokeWidth="1" />
        <ellipse cx={0} cy={-6} rx={24} ry={11} fill="#fff" />

        {/* Food on plates */}
        <ellipse cx={-80} cy={-2} rx={8} ry={5} fill="#f9a8d4" opacity={0.7} />
        <ellipse cx={80} cy={-2} rx={8} ry={5} fill="#a7f3d0" opacity={0.7} />
        <ellipse cx={0} cy={-6} rx={8} ry={5} fill="#fde68a" opacity={0.7} />

        {/* Glasses */}
        <rect x={-95} y={-20} width={10} height={18} rx={3} fill="rgba(180,220,255,0.4)" stroke="rgba(150,200,240,0.5)" strokeWidth="1" />
        <rect x={85} y={-20} width={10} height={18} rx={3} fill="rgba(180,220,255,0.4)" stroke="rgba(150,200,240,0.5)" strokeWidth="1" />
      </g>

      {/* Chairs */}
      <g transform="translate(540, 520)">
        <rect x={-20} y={-30} width={40} height={50} rx={6} fill="#c4b5fd" />
        <rect x={-24} y={-35} width={48} height={8} rx={3} fill="#ddd6fe" />
        <line x1={-15} y1={20} x2={-15} y2={40} stroke="#a78bfa" strokeWidth="3" />
        <line x1={15} y1={20} x2={15} y2={40} stroke="#a78bfa" strokeWidth="3" />
      </g>
      <g transform="translate(1060, 520)">
        <rect x={-20} y={-30} width={40} height={50} rx={6} fill="#c4b5fd" />
        <rect x={-24} y={-35} width={48} height={8} rx={3} fill="#ddd6fe" />
        <line x1={-15} y1={20} x2={-15} y2={40} stroke="#a78bfa" strokeWidth="3" />
        <line x1={15} y1={20} x2={15} y2={40} stroke="#a78bfa" strokeWidth="3" />
      </g>

      {/* Sideboard */}
      <g transform="translate(1300, 490)">
        <rect x={-50} y={-40} width={100} height={60} rx={6} fill="#e9d5ff" stroke="#c4b5fd" strokeWidth="2" />
        <rect x={-42} y={-34} width={84} height={24} rx={4} fill="#fef3c7" opacity={0.4} />
        <circle cx={-20} cy={-10} r={6} fill="#f9a8d4" opacity={0.6} />
        <circle cx={20} cy={-10} r={6} fill="#a7f3d0" opacity={0.6} />
      </g>
    </g>
  );
}

function PlayScene() {
  const toys = [
    { x: 300, y: 560, r: 28, fill: '#f9a8d4' },
    { x: 460, y: 530, r: 22, fill: '#a78bfa' },
    { x: 1100, y: 545, r: 26, fill: '#a7f3d0' },
    { x: 1260, y: 520, r: 20, fill: '#fde68a' },
    { x: 1360, y: 555, r: 24, fill: '#c4b5fd' },
  ];
  return (
    <g>
      {/* Play mat */}
      <rect x={250} y={500} width={1100} height={120} rx={30} fill="url(#playMat)" opacity={0.35} />
      <rect x={260} y={508} width={1080} height={104} rx={24} fill="none" stroke="rgba(167,139,250,0.2)" strokeWidth="2" strokeDasharray="8 4" />

      {/* Shelf with toys */}
      <rect x={200} y={220} width={280} height={14} rx={4} fill="#c4b5fd" />
      <rect x={200} y={220} width={8} height={200} rx={3} fill="#a78bfa" />
      <rect x={472} y={220} width={8} height={200} rx={3} fill="#a78bfa" />
      {/* Toys on shelf */}
      <circle cx={230} cy={210} r={14} fill="#f9a8d4" />
      <circle cx={280} cy={212} r={12} fill="#a78bfa" />
      <rect x={315} y={196} width={24} height={24} rx={4} fill="#a7f3d0" />
      <circle cx={365} cy={210} r={13} fill="#fde68a" />
      <rect x={400} y={200} width={18} height={18} rx={3} fill="#c4b5fd" />
      <rect x={430} y={196} width={20} height={20} rx={3} fill="#f9a8d4" />

      {/* Toy box */}
      <g transform="translate(1380, 480)">
        <rect x={-30} y={-30} width={60} height={50} rx={6} fill="#e9d5ff" stroke="#a78bfa" strokeWidth="2" />
        <rect x={-30} y={-35} width={60} height={8} rx={4} fill="#c4b5fd" />
        <text x={0} y={-5} textAnchor="middle" fill="#a78bfa" fontSize="16" fontFamily="sans-serif">🧸</text>
      </g>

      {/* Scattered toys on floor */}
      {toys.map((t, i) => (
        <g key={i}>
          <ellipse cx={t.x} cy={t.y + t.r + 4} rx={t.r} ry={6} fill="rgba(0,0,0,0.08)" />
          <circle cx={t.x} cy={t.y} r={t.r} fill={t.fill} opacity={0.55} />
          <circle cx={t.x - 4} cy={t.y - 4} r={t.r * 0.25} fill="rgba(255,255,255,0.35)" />
        </g>
      ))}

      {/* Building blocks */}
      <rect x={650} y={535} width={36} height={36} rx={4} fill="#fdba74" opacity={0.55} stroke="#fb923c" strokeWidth="2" />
      <rect x={700} y={518} width={32} height={32} rx={4} fill="#67e8f9" opacity={0.55} stroke="#22d3ee" strokeWidth="2" transform="rotate(12 716 534)" />
      <rect x={920} y={530} width={34} height={34} rx={4} fill="#f9a8d4" opacity={0.55} stroke="#e879b9" strokeWidth="2" />
    </g>
  );
}

function BathScene() {
  return (
    <g>
      {/* Mirror */}
      <circle cx={800} cy={180} r={110} fill="url(#mirror)" stroke="#c4b5fd" strokeWidth="4" />
      <circle cx={800} cy={180} r={105} fill="url(#mirrorGlass)" />
      <ellipse cx={780} cy={162} rx={35} ry={18} fill="rgba(255,255,255,0.12)" transform="rotate(-20 780 162)" />

      {/* Mirror shelf */}
      <rect x={720} y={295} width={160} height={8} rx={4} fill="#c4b5fd" />

      {/* Towel rack */}
      <g transform="translate(120, 280)">
        <line x1={0} y1={0} x2={180} y2={0} stroke="#c4b5fd" strokeWidth="5" strokeLinecap="round" />
        <rect x={16} y={2} width={30} height={110} rx={6} fill="url(#towel1)" />
        <rect x={56} y={2} width={30} height={90} rx={6} fill="url(#towel2)" />
        <rect x={120} y={2} width={30} height={100} rx={6} fill="url(#towel1)" />
      </g>

      {/* Bathtub */}
      <g transform="translate(800, 570)">
        <ellipse cx={0} cy={65} rx={240} ry={16} fill="rgba(0,0,0,0.08)" />
        <path d="M-220 -8 Q-230 54 -198 58 L198 58 Q230 54 220 -8 Z" fill="url(#tubFill)" stroke="#c4b5fd" strokeWidth="2" />
        <path d="M-205 -4 Q-210 46 -188 50 L188 50 Q210 46 205 -4 Z" fill="url(#tubWater)" opacity={0.75} />
        <path d="M-220 -8 Q0 -18 220 -8" fill="none" stroke="#ddd6fe" strokeWidth="6" strokeLinecap="round" />

        {/* Bubbles */}
        <circle cx={-70} cy={16} r={12} fill="rgba(255,255,255,0.55)" />
        <circle cx={-42} cy={6} r={8} fill="rgba(255,255,255,0.45)" />
        <circle cx={-98} cy={5} r={9} fill="rgba(255,255,255,0.45)" />
        <circle cx={0} cy={10} r={14} fill="rgba(255,255,255,0.55)" />
        <circle cx={50} cy={5} r={8} fill="rgba(255,255,255,0.45)" />
        <circle cx={90} cy={16} r={10} fill="rgba(255,255,255,0.45)" />

        {/* Bathtub feet */}
        <circle cx={-200} cy={58} r={9} fill="#ddd6fe" />
        <circle cx={200} cy={58} r={9} fill="#ddd6fe" />
      </g>

      {/* Shower */}
      <g transform="translate(1400, 230)">
        <line x1={0} y1={0} x2={0} y2={200} stroke="#c4b5fd" strokeWidth="3" />
        <ellipse cx={0} cy={-4} rx={18} ry={9} fill="#ddd6fe" />
        <path d="M-10 200 L10 200" stroke="#c4b5fd" strokeWidth="4" strokeLinecap="round" />
        {/* Water drops */}
        <circle cx={-18} cy={210} r={5} fill="rgba(100,200,255,0.3)" />
        <circle cx={10} cy={220} r={4} fill="rgba(100,200,255,0.3)" />
        <circle cx={-6} cy={230} r={5} fill="rgba(100,200,255,0.3)" />
        <circle cx={18} cy={218} r={3} fill="rgba(100,200,255,0.3)" />
      </g>
    </g>
  );
}

function SleepScene({ petPositions }: { petPositions: SleepPosition[] }) {
  return (
    <g>
      {/* Moon */}
      <circle cx={1280} cy={80} r={48} fill="#fef3c7" opacity={0.65} />
      <circle cx={1300} cy={72} r={44} fill="#2e1065" />

      {/* Stars */}
      <circle cx={200} cy={60} r={3} fill="#fef3c7" opacity={0.5} />
      <circle cx={380} cy={110} r={2.5} fill="#fef3c7" opacity={0.4} />
      <circle cx={540} cy={45} r={3} fill="#fef3c7" opacity={0.6} />
      <circle cx={1080} cy={95} r={2} fill="#fef3c7" opacity={0.35} />
      <circle cx={500} cy={160} r={2} fill="#fef3c7" opacity={0.45} />
      <circle cx={740} cy={55} r={2.5} fill="#fef3c7" opacity={0.55} />
      <circle cx={160} cy={150} r={2} fill="#fef3c7" opacity={0.4} />
      <circle cx={1450} cy={120} r={2.5} fill="#fef3c7" opacity={0.45} />
      <circle cx={460} cy={80} r={1.8} fill="#fef3c7" opacity={0.5} />
      <circle cx={1000} cy={50} r={2.8} fill="#fef3c7" opacity={0.5} />

      {/* Sleep area */}
      <rect x={80} y={610} width={1440} height={260} rx={40} fill="rgba(167,139,250,0.15)" />
      <rect x={100} y={620} width={1400} height={240} rx={30} fill="rgba(167,139,250,0.08)" />

      {/* Nightstand left */}
      <g transform="translate(250, 530)">
        <rect x={-20} y={-30} width={40} height={50} rx={4} fill="#c4b5fd" />
        <rect x={-16} y={-26} width={32} height={20} rx={3} fill="#e9d5ff" opacity={0.5} />
        {/* Small lamp */}
        <line x1={0} y1={-30} x2={0} y2={-50} stroke="#a78bfa" strokeWidth="2" />
        <circle cx={0} cy={-55} r={6} fill="#fde68a" opacity={0.8} />
        <circle cx={0} cy={-55} r={15} fill="#fde68a" opacity={0.08} />
      </g>

      {/* Nightstand right */}
      <g transform="translate(1350, 530)">
        <rect x={-20} y={-30} width={40} height={50} rx={4} fill="#c4b5fd" />
        <rect x={-16} y={-26} width={32} height={20} rx={3} fill="#e9d5ff" opacity={0.5} />
        <line x1={0} y1={-30} x2={0} y2={-50} stroke="#a78bfa" strokeWidth="2" />
        <circle cx={0} cy={-55} r={6} fill="#fde68a" opacity={0.8} />
        <circle cx={0} cy={-55} r={15} fill="#fde68a" opacity={0.08} />
      </g>

      {/* Pet beds */}
      {petPositions.map((pos, i) => (
        <Bed2D
          key={i}
          cx={(pos.x / 100) * VW}
          cy={(pos.top / 100) * VH}
          depth={pos.depth}
          index={i}
        />
      ))}
    </g>
  );
}

/* ───────── Bed (2D isometric style) ───────── */

function Bed2D({ cx, cy, depth, index }: { cx: number; cy: number; depth: number; index: number }) {
  // Beds closer together and larger
  const scale = 0.65 + depth * 0.5;
  const bw = 200 * scale;       // wider
  const bh = 100 * scale;       // taller
  const sideH = 8 * scale;
  const x = cx - bw / 2;
  const y = cy - bh / 2 - sideH;

  // Alternate colors per bed
  const colors = [
    { frame: '#a78bfa', frameDark: '#8b5cf6', head: '#c4b5fd', pillow: '#fef3c7', blanket: '#f9a8d4' },
    { frame: '#f9a8d4', frameDark: '#e879b9', head: '#fecdd3', pillow: '#fef3c7', blanket: '#a78bfa' },
  ];
  const c = colors[index % colors.length]!;

  return (
    <g>
      {/* Shadow */}
      <ellipse cx={cx} cy={y + bh + sideH + 6 * scale} rx={bw * 0.5} ry={6 * scale} fill="rgba(0,0,0,0.12)" />

      {/* Headboard */}
      <rect x={x + bw * 0.04} y={y - 14 * scale} width={bw * 0.92} height={14 * scale} rx={4 * scale} fill={c.head} />
      <rect x={x + bw * 0.04} y={y - 14 * scale} width={bw * 0.92} height={3 * scale} rx={1.5 * scale} fill="rgba(255,255,255,0.15)" />

      {/* Base */}
      <rect x={x} y={y + bh} width={bw} height={sideH} rx={0} fill={c.frameDark} />

      {/* Mattress */}
      <rect x={x} y={y} width={bw} height={bh} rx={8 * scale} fill={c.frame} stroke={c.frameDark} strokeWidth={1.5 * scale} />

      {/* Sheet */}
      <rect x={x + 6 * scale} y={y + 5 * scale} width={bw - 12 * scale} height={bh * 0.42} rx={5 * scale} fill="#f1f5f9" />

      {/* Pillow */}
      <rect x={x + 8 * scale} y={y + 7 * scale} width={bw * 0.22} height={bh * 0.3} rx={4 * scale} fill={c.pillow} />

      {/* Blanket */}
      <rect x={x + bw * 0.22} y={y + bh * 0.35} width={bw * 0.7} height={bh * 0.55} rx={5 * scale} fill={c.blanket} opacity={0.92} />

      {/* Blanket fold line */}
      <rect x={x + bw * 0.22} y={y + bh * 0.36} width={bw * 0.7} height={2 * scale} rx={1 * scale} fill="rgba(255,255,255,0.12)" />

      {/* If no depth (foreground bed), add extra detail */}
      {depth < 0.3 && (
        <>
          <rect x={x + bw * 0.1} y={y + bh * 0.38} width={2 * scale} height={bh * 0.35} rx={1 * scale} fill="rgba(255,255,255,0.08)" />
        </>
      )}
    </g>
  );
}

/* ───────── Floor vignette ───────── */

function FloorVignette() {
  return (
    <g>
      <rect x={0} y={672} width={VW} height={3} fill="rgba(0,0,0,0.08)" />
      <rect x={0} y={675} width={VW} height={2} fill="rgba(0,0,0,0.05)" />
    </g>
  );
}

/* ───────── Main export ───────── */

type RoomId = 'living' | 'eat' | 'play' | 'bath' | 'sleep';

export function RoomScene({ room, petPositions }: { room: RoomId; petPositions: SleepPosition[] }) {
  return (
    <svg
      viewBox={`0 0 ${VW} ${VH}`}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id="wallLeft" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#c4b5fd" />
        </linearGradient>
        <linearGradient id="wallRight" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#c4b5fd" />
          <stop offset="100%" stopColor="#a78bfa" />
        </linearGradient>
        <linearGradient id="curtain" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#f9a8d4" />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>
        <linearGradient id="window" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#bae6fd" />
          <stop offset="100%" stopColor="#e0f2fe" />
        </linearGradient>
        <linearGradient id="windowsill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ddd6fe" />
          <stop offset="100%" stopColor="#c4b5fd" />
        </linearGradient>
        <linearGradient id="sofaBack" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c4b5fd" />
          <stop offset="100%" stopColor="#a78bfa" />
        </linearGradient>
        <linearGradient id="sofaCushion" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ddd6fe" />
          <stop offset="100%" stopColor="#c4b5fd" />
        </linearGradient>
        <linearGradient id="sofaSeat" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
        <linearGradient id="sofaArm" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c4b5fd" />
          <stop offset="100%" stopColor="#a78bfa" />
        </linearGradient>
        <radialGradient id="tableTop">
          <stop offset="0%" stopColor="#e9d5ff" />
          <stop offset="100%" stopColor="#c4b5fd" />
        </radialGradient>
        <radialGradient id="tableCloth">
          <stop offset="0%" stopColor="#fef3c7" />
          <stop offset="100%" stopColor="#fde68a" />
        </radialGradient>
        <linearGradient id="playMat" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="25%" stopColor="#a7f3d0" />
          <stop offset="50%" stopColor="#fde68a" />
          <stop offset="75%" stopColor="#f9a8d4" />
          <stop offset="100%" stopColor="#c4b5fd" />
        </linearGradient>
        <radialGradient id="mirror">
          <stop offset="0%" stopColor="#c4b5fd" />
          <stop offset="100%" stopColor="#a78bfa" />
        </radialGradient>
        <radialGradient id="mirrorGlass">
          <stop offset="0%" stopColor="#e0f2fe" />
          <stop offset="100%" stopColor="#bae6fd" />
        </radialGradient>
        <linearGradient id="towel1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7dd3fc" />
          <stop offset="100%" stopColor="#38bdf8" />
        </linearGradient>
        <linearGradient id="towel2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f9a8d4" />
          <stop offset="100%" stopColor="#e879b9" />
        </linearGradient>
        <linearGradient id="tubFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f8fafc" />
          <stop offset="100%" stopColor="#e2e8f0" />
        </linearGradient>
        <linearGradient id="tubWater" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7dd3fc" />
          <stop offset="100%" stopColor="#0ea5e9" />
        </linearGradient>
        <radialGradient id="rug">
          <stop offset="0%" stopColor="#c4b5fd" />
          <stop offset="100%" stopColor="#a78bfa" />
        </radialGradient>
        <linearGradient id="roomBg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fdf2f8" />
          <stop offset="100%" stopColor="#fef3c7" />
        </linearGradient>
      </defs>

      {/* Background */}
      <rect width={VW} height={VH} fill="url(#roomBg)" />

      {/* Isometric floor */}
      <IsometricFloor />
      <IsometricWalls />

      {/* Room scenes */}
      {room === 'living' && <LivingScene />}
      {room === 'eat' && <EatScene />}
      {room === 'play' && <PlayScene />}
      {room === 'bath' && <BathScene />}
      {room === 'sleep' && <SleepScene petPositions={petPositions} />}

      {/* Final vignette */}
      <FloorVignette />
    </svg>
  );
}
