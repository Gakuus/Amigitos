'use client';

const VW = 1600;
const VH = 900;
const FLOOR_Y = 675;

function PetBed({ cx }: { cx: number }) {
  return (
    <g transform={`translate(${cx}, ${FLOOR_Y - 55})`}>
      <ellipse cx={0} cy={70} rx={160} ry={14} fill="rgba(0,0,0,0.12)" />
      <rect x={-150} y={-25} width={300} height={80} rx={12} fill="url(#bedFrame)" stroke="#6d28d9" strokeWidth={2} />
      <rect x={-140} y={-35} width={280} height={50} rx={10} fill="url(#mattress)" />
      <rect x={-140} y={-38} width={280} height={8} rx={4} fill="rgba(255,255,255,0.3)" />
      <rect x={-130} y={-30} width={90} height={35} rx={8} fill="url(#pillow)" />
      <rect x={-30} y={-15} width={160} height={40} rx={8} fill="url(#blanket)" opacity={0.85} />
      <line x1={-30} y1={-15} x2={-30} y2={25} stroke="rgba(255,255,255,0.25)" strokeWidth={3} />
    </g>
  );
}

function LivingScene() {
  return (
    <g>
      <rect x={100} y={40} width={220} height={480} rx={10} fill="url(#curtain)" opacity={0.35} />
      <rect x={1280} y={40} width={220} height={480} rx={10} fill="url(#curtain)" opacity={0.35} />
      <rect x={550} y={60} width={500} height={420} rx={200} ry={200} fill="url(#window)" />
      <rect x={550} y={60} width={500} height={420} rx={200} ry={200} fill="none" stroke="#d4a056" strokeWidth={4} />
      <rect x={555} y={280} width={490} height={200} rx={10} fill="url(#windowsill)" />
      <line x1={800} y1={60} x2={800} y2={480} stroke="rgba(180,120,60,0.4)" strokeWidth={3} />
      <line x1={555} y1={270} x2={1045} y2={270} stroke="rgba(180,120,60,0.4)" strokeWidth={3} />
      <g transform="translate(800, 560)">
        <ellipse cx={0} cy={85} rx={280} ry={20} fill="rgba(0,0,0,0.12)" />
        <rect x={-260} y={-80} width={520} height={120} rx={20} fill="url(#sofaBack)" />
        <rect x={-250} y={-70} width={500} height={80} rx={14} fill="url(#sofaCushion)" />
        <rect x={-270} y={30} width={540} height={55} rx={16} fill="url(#sofaSeat)" />
        <rect x={-250} y={38} width={500} height={40} rx={10} fill="url(#sofaCushion)" opacity={0.5} />
        <rect x={-310} y={-40} width={60} height={120} rx={16} fill="url(#sofaArm)" />
        <rect x={250} y={-40} width={60} height={120} rx={16} fill="url(#sofaArm)" />
      </g>
      <g transform="translate(1300, 520)">
        <rect x={-25} y={0} width={50} height={60} rx={4} fill="#8B7355" />
        <rect x={-30} y={-5} width={60} height={8} rx={3} fill="#A0896C" />
        <line x1={0} y1={-5} x2={0} y2={-100} stroke="#6B5B3E" strokeWidth={3} />
        <path d="M-40 -100 Q0 -160 40 -100" fill="#F5DEB3" opacity={0.7} stroke="#D4A056" strokeWidth={2} />
        <ellipse cx={0} cy={-100} rx={45} ry={12} fill="#F5DEB3" opacity={0.5} />
      </g>
    </g>
  );
}

function EatScene() {
  return (
    <g>
      <line x1={800} y1={0} x2={800} y2={120} stroke="#8B7355" strokeWidth={2} />
      <path d="M740 120 Q800 180 860 120" fill="#F5DEB3" opacity={0.6} stroke="#D4A056" strokeWidth={2} />
      <line x1={760} y1={125} x2={840} y2={125} stroke="#D4A056" strokeWidth={2} />
      <ellipse cx={800} cy={180} rx={200} ry={80} fill="rgba(255,230,150,0.08)" />
      <g transform="translate(800, 560)">
        <ellipse cx={0} cy={100} rx={280} ry={22} fill="rgba(0,0,0,0.12)" />
        <rect x={-220} y={10} width={10} height={85} rx={4} fill="#8B7355" />
        <rect x={210} y={10} width={10} height={85} rx={4} fill="#8B7355" />
        <rect x={-220} y={10} width={10} height={85} rx={4} fill="#8B7355" />
        <rect x={210} y={10} width={10} height={85} rx={4} fill="#8B7355" />
        <ellipse cx={0} cy={8} rx={280} ry={45} fill="url(#tableTop)" stroke="#8B7355" strokeWidth={2} />
        <ellipse cx={0} cy={4} rx={270} ry={40} fill="url(#tableCloth)" />
        <ellipse cx={-110} cy={0} rx={38} ry={20} fill="#f8f8f8" stroke="#ddd" strokeWidth={1} />
        <ellipse cx={-110} cy={-2} rx={28} ry={14} fill="#fff" />
        <ellipse cx={110} cy={0} rx={38} ry={20} fill="#f8f8f8" stroke="#ddd" strokeWidth={1} />
        <ellipse cx={110} cy={-2} rx={28} ry={14} fill="#fff" />
        <ellipse cx={0} cy={-5} rx={38} ry={20} fill="#f8f8f8" stroke="#ddd" strokeWidth={1} />
        <ellipse cx={0} cy={-7} rx={28} ry={14} fill="#fff" />
        <rect x={-115} y={-22} width={14} height={20} rx={3} fill="rgba(180,220,255,0.5)" stroke="rgba(150,200,240,0.6)" strokeWidth={1} />
        <rect x={105} y={-22} width={14} height={20} rx={3} fill="rgba(180,220,255,0.5)" stroke="rgba(150,200,240,0.6)" strokeWidth={1} />
      </g>
    </g>
  );
}

function PlayScene() {
  const toys = [
    { x: 300, y: 580, r: 32, fill: '#ef4444' },
    { x: 460, y: 545, r: 26, fill: '#3b82f6' },
    { x: 1100, y: 565, r: 30, fill: '#22c55e' },
    { x: 1260, y: 535, r: 24, fill: '#eab308' },
    { x: 1360, y: 575, r: 28, fill: '#a855f7' },
  ];
  return (
    <g>
      <rect x={200} y={240} width={300} height={16} rx={4} fill="#A0896C" />
      <rect x={200} y={240} width={10} height={220} rx={3} fill="#8B7355" />
      <rect x={490} y={240} width={10} height={220} rx={3} fill="#8B7355" />
      <circle cx={260} cy={225} r={20} fill="#ef4444" />
      <circle cx={320} cy={228} r={16} fill="#3b82f6" />
      <rect x={355} y={208} width={30} height={30} rx={4} fill="#22c55e" />
      <circle cx={410} cy={226} r={17} fill="#eab308" />
      <rect x={440} y={212} width={22} height={22} rx={3} fill="#a855f7" />
      <rect x={350} y={610} width={900} height={55} rx={20} fill="url(#playMat)" opacity={0.5} />
      {toys.map((t, i) => (
        <g key={i}>
          <ellipse cx={t.x} cy={t.y + t.r + 5} rx={t.r} ry={7} fill="rgba(0,0,0,0.1)" />
          <circle cx={t.x} cy={t.y} r={t.r} fill={t.fill} opacity={0.55} />
          <circle cx={t.x - 6} cy={t.y - 6} r={t.r * 0.3} fill="rgba(255,255,255,0.3)" />
        </g>
      ))}
      <rect x={650} y={555} width={42} height={42} rx={5} fill="#f97316" opacity={0.55} stroke="#ea580c" strokeWidth={2} />
      <rect x={705} y={535} width={38} height={38} rx={5} fill="#06b6d4" opacity={0.55} stroke="#0891b2" strokeWidth={2} transform="rotate(12 724 554)" />
      <rect x={920} y={550} width={40} height={40} rx={5} fill="#ec4899" opacity={0.55} stroke="#db2777" strokeWidth={2} />
    </g>
  );
}

function BathScene() {
  return (
    <g>
      <circle cx={800} cy={200} r={130} fill="url(#mirror)" stroke="#94a3b8" strokeWidth={4} />
      <circle cx={800} cy={200} r={125} fill="url(#mirrorGlass)" />
      <ellipse cx={775} cy={178} rx={45} ry={22} fill="rgba(255,255,255,0.12)" transform="rotate(-20 775 178)" />
      <rect x={700} y={335} width={200} height={10} rx={5} fill="#94a3b8" />
      <g transform="translate(100, 300)">
        <line x1={0} y1={0} x2={220} y2={0} stroke="#94a3b8" strokeWidth={5} strokeLinecap="round" />
        <rect x={20} y={2} width={38} height={130} rx={7} fill="url(#towel1)" />
        <rect x={70} y={2} width={38} height={110} rx={7} fill="url(#towel2)" />
        <rect x={145} y={2} width={38} height={120} rx={7} fill="url(#towel1)" />
      </g>
      <g transform="translate(800, 590)">
        <ellipse cx={0} cy={78} rx={280} ry={20} fill="rgba(0,0,0,0.12)" />
        <path d="M-270 -10 Q-280 65 -240 70 L240 70 Q280 65 270 -10 Z" fill="url(#tubFill)" stroke="#94a3b8" strokeWidth={2} />
        <path d="M-252 -5 Q-258 55 -228 60 L228 60 Q258 55 252 -5 Z" fill="url(#tubWater)" opacity={0.75} />
        <path d="M-270 -10 Q0 -22 270 -10" fill="none" stroke="#cbd5e1" strokeWidth={7} strokeLinecap="round" />
        <circle cx={-90} cy={18} r={14} fill="rgba(255,255,255,0.55)" />
        <circle cx={-55} cy={6} r={9} fill="rgba(255,255,255,0.45)" />
        <circle cx={-120} cy={5} r={11} fill="rgba(255,255,255,0.45)" />
        <circle cx={0} cy={12} r={16} fill="rgba(255,255,255,0.55)" />
        <circle cx={65} cy={6} r={10} fill="rgba(255,255,255,0.45)" />
        <circle cx={110} cy={18} r={12} fill="rgba(255,255,255,0.45)" />
        <circle cx={200} cy={70} r={11} fill="#cbd5e1" />
        <circle cx={-200} cy={70} r={11} fill="#cbd5e1" />
      </g>
      <g transform="translate(1350, 250)">
        <line x1={0} y1={0} x2={0} y2={220} stroke="#94a3b8" strokeWidth={3} />
        <ellipse cx={0} cy={-5} rx={22} ry={11} fill="#cbd5e1" />
        <path d="M-12 220 L12 220" stroke="#94a3b8" strokeWidth={5} strokeLinecap="round" />
        <circle cx={-22} cy={230} r={7} fill="rgba(100,200,255,0.3)" />
        <circle cx={12} cy={242} r={5} fill="rgba(100,200,255,0.3)" />
        <circle cx={-8} cy={252} r={6} fill="rgba(100,200,255,0.3)" />
        <circle cx={22} cy={238} r={4} fill="rgba(100,200,255,0.3)" />
      </g>
    </g>
  );
}

type PetPos = { x: number; depth: number };

function SleepScene({ petPositions }: { petPositions: PetPos[] }) {
  return (
    <g>
      <circle cx={1300} cy={100} r={55} fill="#fef3c7" opacity={0.7} />
      <circle cx={1325} cy={88} r={50} fill="#1e1b4b" />
      <circle cx={200} cy={80} r={3.5} fill="#fef3c7" opacity={0.6} />
      <circle cx={400} cy={140} r={2.5} fill="#fef3c7" opacity={0.5} />
      <circle cx={550} cy={55} r={3.5} fill="#fef3c7" opacity={0.7} />
      <circle cx={1050} cy={110} r={2} fill="#fef3c7" opacity={0.4} />
      <circle cx={1450} cy={70} r={3.5} fill="#fef3c7" opacity={0.6} />
      <circle cx={750} cy={70} r={2} fill="#fef3c7" opacity={0.5} />
      <g transform="translate(200, 500)">
        <rect x={-35} y={0} width={70} height={85} rx={5} fill="#6d597a" />
        <rect x={-40} y={-6} width={80} height={10} rx={4} fill="#7d6a8a" />
        <line x1={0} y1={-6} x2={0} y2={-75} stroke="#4a3a55" strokeWidth={2} />
        <path d="M-28 -75 Q0 -118 28 -75" fill="#fef3c7" opacity={0.55} stroke="#d4a017" strokeWidth={1.5} />
        <ellipse cx={0} cy={-75} rx={32} ry={9} fill="#fef3c7" opacity={0.35} />
        <ellipse cx={0} cy={-30} rx={90} ry={65} fill="rgba(254,243,199,0.04)" />
      </g>
      {petPositions.map((pos, i) => (
        <PetBed key={i} cx={pos.x * VW} />
      ))}
    </g>
  );
}

type RoomId = 'living' | 'eat' | 'play' | 'bath' | 'sleep';

export function RoomScene({ room, petPositions }: { room: RoomId; petPositions: PetPos[] }) {
  return (
    <svg
      viewBox={`0 0 ${VW} ${VH}`}
      className="absolute inset-0 w-full h-full pointer-events-none z-10"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id="curtain" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#d97706" />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>
        <linearGradient id="window" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#87CEEB" />
          <stop offset="100%" stopColor="#B0E0E6" />
        </linearGradient>
        <linearGradient id="windowsill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c4956a" />
          <stop offset="100%" stopColor="#a0764a" />
        </linearGradient>
        <linearGradient id="sofaBack" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d97706" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>
        <linearGradient id="sofaCushion" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
        <linearGradient id="sofaSeat" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d97706" />
          <stop offset="100%" stopColor="#92400e" />
        </linearGradient>
        <linearGradient id="sofaArm" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>
        <radialGradient id="tableTop">
          <stop offset="0%" stopColor="#d4a574" />
          <stop offset="100%" stopColor="#b8860b" />
        </radialGradient>
        <radialGradient id="tableCloth">
          <stop offset="0%" stopColor="#fff8dc" />
          <stop offset="100%" stopColor="#f5e6c8" />
        </radialGradient>
        <linearGradient id="playMat" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="25%" stopColor="#22c55e" />
          <stop offset="50%" stopColor="#eab308" />
          <stop offset="75%" stopColor="#ef4444" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>
        <radialGradient id="mirror">
          <stop offset="0%" stopColor="#64748b" />
          <stop offset="100%" stopColor="#475569" />
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
          <stop offset="0%" stopColor="#86efac" />
          <stop offset="100%" stopColor="#22c55e" />
        </linearGradient>
        <linearGradient id="tubFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f8fafc" />
          <stop offset="100%" stopColor="#e2e8f0" />
        </linearGradient>
        <linearGradient id="tubWater" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7dd3fc" />
          <stop offset="100%" stopColor="#0ea5e9" />
        </linearGradient>
        <linearGradient id="bedFrame" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#6d28d9" />
        </linearGradient>
        <linearGradient id="mattress" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f8fafc" />
          <stop offset="100%" stopColor="#e2e8f0" />
        </linearGradient>
        <linearGradient id="pillow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fef3c7" />
          <stop offset="100%" stopColor="#fde68a" />
        </linearGradient>
        <linearGradient id="blanket" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
      </defs>

      {room === 'living' && <LivingScene />}
      {room === 'eat' && <EatScene />}
      {room === 'play' && <PlayScene />}
      {room === 'bath' && <BathScene />}
      {room === 'sleep' && <SleepScene petPositions={petPositions} />}
    </svg>
  );
}
