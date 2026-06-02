'use client';

/* ═══════════════════════════════════════
   SVG Furniture — cute vector art
   Estilo juego de mascotas virtuales
   ═══════════════════════════════════════ */

/* ─── Shared palette ─── */
const C = {
  purple: '#c4a6d4', purpleD: '#a87ebd', purpleL: '#dcc8e8', purpleBg: '#e8dbf0', purpleS: '#8e6a9e',
  amber: '#e8c98a', amberD: '#d4a85a', amberL: '#f0dba8', amberS: '#b8904a',
  pink: '#f0b8c8', pinkD: '#d88aa0', pinkL: '#f5d0dc', pinkS: '#c07088',
  sky: '#a8d8e8', skyD: '#78b8d0', skyL: '#c8e8f0', skyS: '#5898b0',
  green: '#a8d8a8', greenD: '#78b878', greenL: '#c8e8c8', greenS: '#589858',
  red: '#e8a0a0', redD: '#d07878', redL: '#f0c0c0',
  yellow: '#f0d870', yellowD: '#d0b850', yellowL: '#f8e898',
  blue: '#88b8e0', blueD: '#6098c8', blueL: '#b0d8f0',
  white: '#ffffff', cream: '#faf0e0', creamD: '#f0e0c8',
  wood: '#c4a06a', woodD: '#a08050', woodL: '#d4b88a', woodS: '#806040',
  metal: '#b0b8c0', metalD: '#889098', metalL: '#d0d8e0',
};

/* ═══════════════ Living Room ═══════════════ */

export function SofaSVG() {
  return (
    <svg viewBox="0 0 200 140" className="w-full h-full" fill="none">
      <defs>
        <linearGradient id="s-body" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={C.purpleL} /><stop offset="1" stopColor={C.purple} /></linearGradient>
        <linearGradient id="s-arm" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={C.purple} /><stop offset="1" stopColor={C.purpleD} /></linearGradient>
        <linearGradient id="s-cush" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={C.purpleBg} /><stop offset="1" stopColor={C.purpleL} /></linearGradient>
        <linearGradient id="s-pillow" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={C.pinkL} /><stop offset="1" stopColor={C.pink} /></linearGradient>
      </defs>
      <ellipse cx="100" cy="135" rx="90" ry="6" fill="rgba(0,0,0,0.1)" />
      <rect x="22" y="118" width="8" height="16" rx="4" fill={C.woodS} />
      <rect x="170" y="118" width="8" height="16" rx="4" fill={C.woodS} />
      <rect x="42" y="120" width="8" height="14" rx="4" fill={C.woodS} />
      <rect x="150" y="120" width="8" height="14" rx="4" fill={C.woodS} />
      <rect x="8" y="40" width="184" height="86" rx="18" fill="url(#s-body)" stroke={C.purpleD} strokeWidth="0.5" />
      <rect x="12" y="44" width="176" height="82" rx="14" fill="rgba(255,255,255,0.12)" />
      <rect x="2" y="44" width="28" height="76" rx="14" fill="url(#s-arm)" stroke={C.purpleD} strokeWidth="0.5" />
      <rect x="170" y="44" width="28" height="76" rx="14" fill="url(#s-arm)" stroke={C.purpleD} strokeWidth="0.5" />
      <rect x="2" y="48" width="8" height="72" rx="4" fill="rgba(255,255,255,0.1)" />
      <rect x="190" y="48" width="8" height="72" rx="4" fill="rgba(255,255,255,0.1)" />
      <rect x="30" y="76" width="64" height="42" rx="12" fill="url(#s-cush)" stroke={C.purple} strokeWidth="0.5" />
      <rect x="106" y="76" width="64" height="42" rx="12" fill="url(#s-cush)" stroke={C.purple} strokeWidth="0.5" />
      <rect x="34" y="80" width="56" height="6" rx="3" fill="rgba(255,255,255,0.2)" />
      <rect x="110" y="80" width="56" height="6" rx="3" fill="rgba(255,255,255,0.2)" />
      <path d="M35 88 L85 88" stroke={C.purpleD} strokeWidth="0.5" strokeDasharray="3 3" opacity="0.4" />
      <path d="M111 88 L161 88" stroke={C.purpleD} strokeWidth="0.5" strokeDasharray="3 3" opacity="0.4" />
      <rect x="68" y="12" width="28" height="30" rx="8" fill="url(#s-pillow)" stroke={C.pink} strokeWidth="0.5" />
      <rect x="104" y="14" width="28" height="28" rx="8" fill="url(#s-pillow)" stroke={C.pink} strokeWidth="0.5" />
      <path d="M76 18 L88 18" stroke={C.pinkD} strokeWidth="0.5" strokeLinecap="round" opacity="0.5" />
      <path d="M112 20 L124 20" stroke={C.pinkD} strokeWidth="0.5" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}

export function LampSVG() {
  return (
    <svg viewBox="0 0 60 170" className="w-full h-full" fill="none">
      <ellipse cx="30" cy="164" rx="18" ry="5" fill="rgba(0,0,0,0.1)" />
      <rect x="27" y="64" width="6" height="94" rx="3" fill="url(#lamp-pole)" />
      <rect x="20" y="156" width="20" height="8" rx="4" fill={C.woodD} />
      <rect x="25" y="158" width="10" height="4" rx="2" fill="rgba(255,255,255,0.15)" />
      <path d="M8 64 L52 64 L44 10 L16 10 Z" fill={C.yellowL} stroke={C.yellowD} strokeWidth="0.5" />
      <path d="M16 10 L44 10 L40 16 L20 16 Z" fill="rgba(255,255,255,0.35)" />
      <path d="M12 60 L48 60" stroke={C.yellowD} strokeWidth="0.5" opacity="0.5" />
      <circle cx="30" cy="54" r="34" fill="rgba(240,216,112,0.08)" />
      <circle cx="30" cy="50" r="20" fill="rgba(240,216,112,0.06)" />
      <defs>
        <linearGradient id="lamp-pole" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor={C.metalD} /><stop offset="0.3" stopColor={C.metalL} /><stop offset="0.7" stopColor={C.metal} /><stop offset="1" stopColor={C.metalD} /></linearGradient>
      </defs>
    </svg>
  );
}

export function CoffeeTableSVG() {
  return (
    <svg viewBox="0 0 160 70" className="w-full h-full" fill="none">
      <ellipse cx="80" cy="66" rx="74" ry="5" fill="rgba(0,0,0,0.1)" />
      <rect x="22" y="56" width="6" height="10" rx="3" fill={C.woodS} />
      <rect x="132" y="56" width="6" height="10" rx="3" fill={C.woodS} />
      <rect x="38" y="58" width="6" height="8" rx="3" fill={C.woodS} />
      <rect x="116" y="58" width="6" height="8" rx="3" fill={C.woodS} />
      <rect x="8" y="32" width="144" height="26" rx="8" fill={C.wood} stroke={C.woodD} strokeWidth="0.5" />
      <rect x="10" y="34" width="140" height="6" rx="3" fill="rgba(255,255,255,0.2)" />
      <rect x="8" y="38" width="144" height="18" rx="6" fill={C.woodL} opacity="0.4" />
      <rect x="10" y="50" width="140" height="6" rx="3" fill="rgba(0,0,0,0.04)" />
      <rect x="12" y="40" width="14" height="14" rx="2" fill={C.red} opacity="0.7" />
      <rect x="12" y="40" width="14" height="3" rx="1.5" fill="rgba(255,255,255,0.25)" />
      <rect x="34" y="42" width="12" height="12" rx="2" fill={C.skyD} opacity="0.7" />
      <rect x="34" y="42" width="12" height="3" rx="1.5" fill="rgba(255,255,255,0.25)" />
      <path d="M110 42 Q125 40 132 42 L130 54 Q125 52 110 52 Z" fill={C.cream} stroke={C.creamD} strokeWidth="0.5" />
      <path d="M110 42 Q125 40 132 42" stroke={C.creamD} strokeWidth="0.5" fill="none" />
      <path d="M116 46 Q120 45 126 46" stroke="rgba(160,140,120,0.3)" strokeWidth="0.8" fill="none" />
      <ellipse cx="126" cy="48" rx="2" ry="1.5" fill="rgba(160,140,120,0.15)" />
    </svg>
  );
}

export function BookshelfSVG() {
  const bx = (x: number, y: number, w: number, h: number, c: string) => (
    <><rect x={x} y={y} width={w} height={h} rx={2} fill={c} /><rect x={x+1} y={y+1} width={w-2} height={3} rx={1} fill="rgba(255,255,255,0.15)" /></>
  );
  return (
    <svg viewBox="0 0 80 180" className="w-full h-full" fill="none">
      <rect x="4" y="4" width="72" height="172" rx="6" fill={C.woodL} stroke={C.woodD} strokeWidth="0.5" />
      <rect x="6" y="6" width="68" height="170" rx="4" fill="rgba(255,255,255,0.08)" />
      <rect x="6" y="48" width="68" height="4" rx="2" fill={C.wood} />
      <rect x="6" y="48" width="68" height="2" rx="1" fill="rgba(0,0,0,0.05)" />
      <rect x="6" y="92" width="68" height="4" rx="2" fill={C.wood} />
      <rect x="6" y="92" width="68" height="2" rx="1" fill="rgba(0,0,0,0.05)" />
      <rect x="6" y="136" width="68" height="4" rx="2" fill={C.wood} />
      <rect x="6" y="136" width="68" height="2" rx="1" fill="rgba(0,0,0,0.05)" />
      {bx(12, 8, 14, 36, C.redL)}
      {bx(30, 6, 10, 38, C.blueL)}
      {bx(44, 12, 16, 32, C.greenL)}
      {bx(64, 8, 8, 36, C.yellowL)}
      {bx(10, 54, 18, 34, C.pinkL)}
      {bx(32, 52, 12, 36, C.redL)}
      {bx(48, 56, 14, 32, C.skyL)}
      {bx(66, 58, 6, 30, C.purpleL)}
      {bx(14, 98, 16, 34, C.yellowL)}
      {bx(34, 96, 10, 36, C.greenL)}
      {bx(48, 100, 14, 32, C.pinkL)}
      {bx(66, 102, 6, 30, C.blueL)}
      {bx(10, 142, 14, 30, C.purpleL)}
      {bx(28, 140, 18, 32, C.skyL)}
      {bx(50, 144, 12, 28, C.redL)}
      {bx(66, 142, 6, 30, C.greenL)}
      <rect x="4" y="4" width="72" height="6" rx="2" fill="rgba(255,255,255,0.08)" />
    </svg>
  );
}

export function WallArtSVG({ color = C.pink }: { color?: string }) {
  return (
    <svg viewBox="0 0 80 60" className="w-full h-full" fill="none">
      <rect x="2" y="2" width="76" height="56" rx="8" fill={C.cream} stroke={C.woodD} strokeWidth="1.5" />
      <rect x="6" y="6" width="68" height="48" rx="5" fill="rgba(255,255,255,0.5)" />
      <rect x="6" y="6" width="68" height="48" rx="5" fill={color} opacity="0.15" />
      <circle cx="40" cy="30" r="14" fill={color} opacity="0.5" />
      <circle cx="40" cy="30" r="8" fill={color} opacity="0.3" />
      <circle cx="36" cy="26" r="3" fill="rgba(255,255,255,0.4)" />
      <path d="M-2 54 L82 54" stroke={C.woodD} strokeWidth="1" />
      <rect x="30" y="52" width="20" height="6" rx="3" fill={C.wood} />
      <rect x="34" y="54" width="12" height="2" rx="1" fill="rgba(255,255,255,0.2)" />
    </svg>
  );
}

export function PlantSVG() {
  return (
    <svg viewBox="0 0 50 80" className="w-full h-full" fill="none">
      <ellipse cx="25" cy="76" rx="16" ry="4" fill="rgba(0,0,0,0.1)" />
      <rect x="12" y="52" width="26" height="26" rx="7" fill={C.redD} stroke={C.red} strokeWidth="0.5" />
      <rect x="14" y="54" width="22" height="22" rx="5" fill="rgba(255,255,255,0.08)" />
      <rect x="16" y="56" width="18" height="20" rx="4" fill={C.red} opacity="0.3" />
      <path d="M25 52 Q25 38 16 28 Q12 24 10 26 Q14 30 18 32 Q16 26 14 22 Q12 18 10 20" stroke={C.greenD} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M25 52 Q25 36 32 26 Q36 22 38 24 Q34 28 30 30 Q32 24 34 20 Q36 16 34 18" stroke={C.green} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M25 52 Q25 40 26 30" stroke={C.greenD} strokeWidth="2" fill="none" strokeLinecap="round" />
      <circle cx="16" cy="24" r="4" fill={C.greenL} opacity="0.6" />
      <circle cx="32" cy="22" r="3.5" fill={C.greenL} opacity="0.6" />
      <circle cx="22" cy="18" r="3" fill={C.greenL} opacity="0.4" />
    </svg>
  );
}

/* ═══════════════ Eat Room ═══════════════ */

export function DiningTableSVG() {
  return (
    <svg viewBox="0 0 240 100" className="w-full h-full" fill="none">
      <defs>
        <linearGradient id="dt-top" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={C.woodL} /><stop offset="1" stopColor={C.wood} /></linearGradient>
      </defs>
      <ellipse cx="120" cy="96" rx="112" ry="5" fill="rgba(0,0,0,0.1)" />
      <rect x="30" y="82" width="8" height="14" rx="4" fill={C.woodS} />
      <rect x="202" y="82" width="8" height="14" rx="4" fill={C.woodS} />
      <rect x="62" y="84" width="8" height="12" rx="4" fill={C.woodS} />
      <rect x="170" y="84" width="8" height="12" rx="4" fill={C.woodS} />
      <rect x="8" y="48" width="224" height="36" rx="10" fill="url(#dt-top)" stroke={C.woodD} strokeWidth="0.5" />
      <rect x="10" y="50" width="220" height="8" rx="4" fill="rgba(255,255,255,0.2)" />
      <rect x="8" y="56" width="224" height="26" rx="8" fill={C.wood} />
      <rect x="10" y="56" width="220" height="4" rx="2" fill="rgba(255,255,255,0.1)" />
      <rect x="10" y="78" width="220" height="4" rx="2" fill="rgba(0,0,0,0.04)" />
      <circle cx="48" cy="67" r="14" fill={C.cream} stroke={C.creamD} strokeWidth="0.5" />
      <circle cx="48" cy="67" r="10" fill="rgba(255,255,255,0.3)" />
      <circle cx="44" cy="64" r="6" fill={C.redL} opacity="0.8" />
      <circle cx="44" cy="64" r="2.5" fill={C.green} />
      <circle cx="120" cy="67" r="14" fill={C.cream} stroke={C.creamD} strokeWidth="0.5" />
      <circle cx="120" cy="67" r="10" fill="rgba(255,255,255,0.3)" />
      <circle cx="116" cy="64" r="6" fill={C.skyL} opacity="0.8" />
      <circle cx="116" cy="64" r="2.5" fill={C.yellow} />
      <circle cx="192" cy="67" r="14" fill={C.cream} stroke={C.creamD} strokeWidth="0.5" />
      <circle cx="192" cy="67" r="10" fill="rgba(255,255,255,0.3)" />
      <circle cx="188" cy="64" r="6" fill={C.yellowL} opacity="0.8" />
      <circle cx="188" cy="64" r="2.5" fill={C.red} />
    </svg>
  );
}

export function DiningChairSVG() {
  return (
    <svg viewBox="0 0 60 100" className="w-full h-full" fill="none">
      <defs>
        <linearGradient id="dc-seat" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={C.purpleL} /><stop offset="1" stopColor={C.purple} /></linearGradient>
      </defs>
      <ellipse cx="30" cy="96" rx="26" ry="4" fill="rgba(0,0,0,0.1)" />
      <rect x="15" y="82" width="5" height="14" rx="2.5" fill={C.woodS} />
      <rect x="40" y="82" width="5" height="14" rx="2.5" fill={C.woodS} />
      <rect x="8" y="54" width="44" height="30" rx="8" fill="url(#dc-seat)" stroke={C.purpleD} strokeWidth="0.5" />
      <rect x="10" y="56" width="40" height="6" rx="3" fill="rgba(255,255,255,0.2)" />
      <rect x="10" y="36" width="40" height="22" rx="8" fill={C.purpleL} stroke={C.purple} strokeWidth="0.5" />
      <rect x="12" y="38" width="36" height="6" rx="3" fill="rgba(255,255,255,0.2)" />
      <path d="M8 36 Q8 26 14 22 L46 22 Q52 26 52 36" fill={C.purpleL} stroke={C.purple} strokeWidth="0.5" />
      <rect x="16" y="24" width="28" height="10" rx="5" fill="rgba(255,255,255,0.15)" />
      <path d="M18 42 L42 42" stroke={C.purpleD} strokeWidth="0.5" strokeDasharray="2 3" opacity="0.4" />
    </svg>
  );
}

export function HangingLampSVG() {
  return (
    <svg viewBox="0 0 80 100" className="w-full h-full" fill="none">
      <rect x="39" y="0" width="2" height="28" rx="1" fill={C.metal} />
      <path d="M10 28 L70 28 L60 56 L20 56 Z" fill={C.yellowL} stroke={C.yellowD} strokeWidth="0.5" />
      <path d="M20 28 L60 28 L56 34 L24 34 Z" fill="rgba(255,255,255,0.3)" />
      <path d="M10 28 L70 28" stroke={C.yellowD} strokeWidth="1" opacity="0.5" />
      <circle cx="40" cy="44" r="32" fill="rgba(240,216,112,0.06)" />
      <circle cx="40" cy="42" r="18" fill="rgba(240,216,112,0.04)" />
    </svg>
  );
}

export function SideboardSVG() {
  return (
    <svg viewBox="0 0 80 60" className="w-full h-full" fill="none">
      <ellipse cx="40" cy="57" rx="38" ry="4" fill="rgba(0,0,0,0.1)" />
      <rect x="8" y="48" width="6" height="10" rx="3" fill={C.woodS} />
      <rect x="66" y="48" width="6" height="10" rx="3" fill={C.woodS} />
      <rect x="4" y="10" width="72" height="40" rx="6" fill={C.cream} stroke={C.woodD} strokeWidth="0.5" />
      <rect x="6" y="12" width="68" height="6" rx="3" fill="rgba(255,255,255,0.3)" />
      <rect x="8" y="20" width="64" height="26" rx="4" fill={C.wood} opacity="0.25" />
      <rect x="8" y="20" width="64" height="26" rx="4" stroke={C.wood} strokeWidth="0.5" fill="none" />
      <rect x="64" y="30" width="4" height="12" rx="2" fill={C.woodD} />
      <rect x="12" y="22" width="56" height="22" rx="3" fill="rgba(255,255,255,0.08)" />
    </svg>
  );
}

/* ═══════════════ Play Room ═══════════════ */

export function PlayMatSVG() {
  return (
    <svg viewBox="0 0 300 60" className="w-full h-full" fill="none">
      <rect x="2" y="2" width="296" height="56" rx="20" fill="rgba(180,160,200,0.12)" stroke={C.pink} strokeWidth="1.5" strokeDasharray="6 4" />
      <rect x="2" y="2" width="296" height="56" rx="20" fill="rgba(255,255,255,0.05)" />
      <circle cx="40" cy="20" r="8" fill={C.pink} opacity="0.25" />
      <circle cx="90" cy="32" r="6" fill={C.sky} opacity="0.25" />
      <circle cx="150" cy="18" r="10" fill={C.yellow} opacity="0.25" />
      <circle cx="210" cy="30" r="7" fill={C.green} opacity="0.25" />
      <circle cx="260" cy="22" r="6" fill={C.purple} opacity="0.25" />
      <circle cx="40" cy="20" r="3" fill="rgba(255,255,255,0.3)" />
      <circle cx="150" cy="18" r="4" fill="rgba(255,255,255,0.3)" />
    </svg>
  );
}

export function BlockSVG({ color = C.pink }: { color?: string }) {
  return (
    <svg viewBox="0 0 30 30" className="w-full h-full" fill="none">
      <rect x="1" y="1" width="28" height="28" rx="6" fill={color} stroke="rgba(255,255,255,0.25)" strokeWidth="0.5" />
      <rect x="3" y="3" width="24" height="6" rx="2" fill="rgba(255,255,255,0.2)" />
      <rect x="3" y="22" width="12" height="3" rx="1" fill="rgba(255,255,255,0.1)" />
      <rect x="3" y="3" width="3" height="24" rx="1" fill="rgba(255,255,255,0.08)" />
    </svg>
  );
}

export function ToyBoxSVG() {
  return (
    <svg viewBox="0 0 80 62" className="w-full h-full" fill="none">
      <ellipse cx="40" cy="59" rx="36" ry="3" fill="rgba(0,0,0,0.1)" />
      <rect x="4" y="22" width="72" height="38" rx="8" fill={C.cream} stroke={C.pinkD} strokeWidth="0.5" />
      <rect x="6" y="24" width="68" height="6" rx="3" fill="rgba(255,255,255,0.25)" />
      <path d="M4 22 L8 4 L72 4 L76 22 Z" fill={C.pinkL} stroke={C.pinkD} strokeWidth="0.5" />
      <rect x="10" y="6" width="60" height="4" rx="2" fill="rgba(255,255,255,0.25)" />
      <rect x="8" y="14" width="64" height="2" rx="1" fill="rgba(0,0,0,0.04)" />
      <rect x="18" y="28" width="12" height="14" rx="3" fill={C.redL} opacity="0.6" />
      <rect x="18" y="28" width="12" height="3" rx="1.5" fill="rgba(255,255,255,0.2)" />
      <rect x="34" y="30" width="10" height="12" rx="2" fill={C.skyL} opacity="0.6" />
      <circle cx="60" cy="34" r="9" fill={C.yellowL} opacity="0.6" />
      <circle cx="60" cy="34" r="4" fill="rgba(255,255,255,0.3)" />
      <circle cx="58" cy="32" r="2" fill="rgba(255,255,255,0.4)" />
    </svg>
  );
}

export function BallSVG({ color = C.redL }: { color?: string }) {
  return (
    <svg viewBox="0 0 24 24" className="w-full h-full" fill="none">
      <defs>
        <radialGradient id="ball-grad" cx="0.35" cy="0.35" r="0.65">
          <stop offset="0" stopColor="rgba(255,255,255,0.4)" />
          <stop offset="1" stopColor={color} />
        </radialGradient>
      </defs>
      <circle cx="12" cy="12" r="11" fill={`url(#ball-grad)`} stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
    </svg>
  );
}

/* ═══════════════ Bath Room ═══════════════ */

export function BathtubSVG() {
  return (
    <svg viewBox="0 0 280 120" className="w-full h-full" fill="none">
      <defs>
        <linearGradient id="tub-body" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={C.white} /><stop offset="1" stopColor={C.skyL} /></linearGradient>
        <linearGradient id="tub-water" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={C.skyL} /><stop offset="1" stopColor={C.sky} /></linearGradient>
      </defs>
      <ellipse cx="140" cy="116" rx="132" ry="5" fill="rgba(0,0,0,0.1)" />
      <rect x="30" y="100" width="12" height="16" rx="6" fill={C.metal} />
      <rect x="238" y="100" width="12" height="16" rx="6" fill={C.metal} />
      <rect x="32" y="104" width="8" height="10" rx="4" fill={C.metalD} />
      <rect x="240" y="104" width="8" height="10" rx="4" fill={C.metalD} />
      <path d="M8 38 Q8 92 40 100 L240 100 Q272 92 272 38 Z" fill="url(#tub-body)" stroke={C.sky} strokeWidth="0.5" />
      <path d="M16 44 Q16 88 44 94 L236 94 Q264 88 264 44 Z" fill="url(#tub-water)" opacity="0.5" />
      <path d="M24 50 Q24 82 50 88 L230 88 Q256 82 256 50 Z" fill={C.sky} opacity="0.25" />
      <path d="M8 38 L272 38" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
      <path d="M12 40 L268 40" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
      <circle cx="50" cy="34" r="7" fill="rgba(255,255,255,0.5)" />
      <circle cx="80" cy="30" r="5" fill="rgba(255,255,255,0.35)" />
      <circle cx="140" cy="28" r="8" fill="rgba(255,255,255,0.5)" />
      <circle cx="180" cy="32" r="5" fill="rgba(255,255,255,0.35)" />
      <circle cx="220" cy="30" r="6" fill="rgba(255,255,255,0.45)" />
      <circle cx="160" cy="24" r="4" fill="rgba(255,255,255,0.3)" />
      <circle cx="110" cy="36" r="4" fill="rgba(255,255,255,0.3)" />
    </svg>
  );
}

export function ShowerSVG() {
  return (
    <svg viewBox="0 0 40 130" className="w-full h-full" fill="none">
      <defs>
        <linearGradient id="shower-rail" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor={C.metalD} /><stop offset="0.5" stopColor={C.metalL} /><stop offset="1" stopColor={C.metalD} /></linearGradient>
      </defs>
      <rect x="18" y="0" width="4" height="52" rx="2" fill="url(#shower-rail)" />
      <rect x="6" y="50" width="28" height="6" rx="3" fill="url(#shower-rail)" />
      <circle cx="20" cy="50" r="5" fill={C.metalL} stroke={C.metal} strokeWidth="0.5" />
      <circle cx="20" cy="50" r="2" fill={C.sky} opacity="0.5" />
      <rect x="4" y="56" width="32" height="70" rx="16" fill={C.skyL} opacity="0.15" stroke={C.sky} strokeWidth="0.5" strokeDasharray="4 4" />
      <path d="M12 60 L12 68" stroke={C.sky} strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
      <path d="M20 58 L20 70" stroke={C.sky} strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
      <path d="M28 62 L28 68" stroke={C.sky} strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
      <path d="M16 72 L16 76" stroke={C.sky} strokeWidth="1" strokeLinecap="round" opacity="0.3" />
      <path d="M24 66 L24 72" stroke={C.sky} strokeWidth="1" strokeLinecap="round" opacity="0.3" />
    </svg>
  );
}

export function MirrorSVG() {
  return (
    <svg viewBox="0 0 60 80" className="w-full h-full" fill="none">
      <defs>
        <linearGradient id="mirror-shine" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="rgba(255,255,255,0.5)" /><stop offset="0.3" stopColor="rgba(255,255,255,0.05)" /><stop offset="0.7" stopColor="rgba(255,255,255,0.05)" /><stop offset="1" stopColor="rgba(255,255,255,0.25)" /></linearGradient>
      </defs>
      <rect x="2" y="2" width="56" height="76" rx="12" fill={C.woodL} stroke={C.woodD} strokeWidth="1.5" />
      <rect x="4" y="4" width="52" height="72" rx="10" fill="rgba(255,255,255,0.15)" />
      <rect x="8" y="8" width="44" height="64" rx="8" fill={C.skyL} opacity="0.15" />
      <rect x="8" y="8" width="44" height="64" rx="8" fill="url(#mirror-shine)" />
      <rect x="8" y="8" width="44" height="64" rx="8" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
    </svg>
  );
}

export function TowelsSVG() {
  return (
    <svg viewBox="0 0 30 50" className="w-full h-full" fill="none">
      <rect x="2" y="2" width="12" height="46" rx="3" fill={C.skyL} stroke={C.sky} strokeWidth="0.5" />
      <rect x="2" y="2" width="12" height="6" rx="2" fill={C.sky} opacity="0.3" />
      <path d="M2 14 L14 14" stroke={C.sky} strokeWidth="0.5" strokeDasharray="2 3" opacity="0.4" />
      <path d="M2 24 L14 24" stroke={C.sky} strokeWidth="0.5" strokeDasharray="2 3" opacity="0.4" />
      <rect x="16" y="6" width="12" height="42" rx="3" fill={C.pinkL} stroke={C.pink} strokeWidth="0.5" />
      <rect x="16" y="6" width="12" height="6" rx="2" fill={C.pink} opacity="0.3" />
      <path d="M16 18 L28 18" stroke={C.pink} strokeWidth="0.5" strokeDasharray="2 3" opacity="0.4" />
      <path d="M16 28 L28 28" stroke={C.pink} strokeWidth="0.5" strokeDasharray="2 3" opacity="0.4" />
    </svg>
  );
}

export function BathMatSVG() {
  return (
    <svg viewBox="0 0 120 24" className="w-full h-full" fill="none">
      <rect x="2" y="2" width="116" height="20" rx="10" fill={C.sky} opacity="0.2" stroke={C.sky} strokeWidth="0.5" />
      <rect x="2" y="2" width="116" height="20" rx="10" fill="rgba(255,255,255,0.05)" />
      <line x1="20" y1="8" x2="28" y2="16" stroke={C.sky} strokeWidth="1" opacity="0.2" strokeLinecap="round" />
      <line x1="50" y1="8" x2="58" y2="16" stroke={C.sky} strokeWidth="1" opacity="0.2" strokeLinecap="round" />
      <line x1="80" y1="8" x2="88" y2="16" stroke={C.sky} strokeWidth="1" opacity="0.2" strokeLinecap="round" />
      <line x1="100" y1="8" x2="108" y2="16" stroke={C.sky} strokeWidth="1" opacity="0.2" strokeLinecap="round" />
    </svg>
  );
}

/* ═══════════════ Sleep Room ═══════════════ */

export function MoonSVG() {
  return (
    <svg viewBox="0 0 40 40" className="w-full h-full" fill="none">
      <circle cx="20" cy="20" r="18" fill={C.yellow} opacity="0.08" />
      <circle cx="20" cy="20" r="14" fill={C.yellow} opacity="0.12" />
      <path d="M22 8 A16 16 0 1 1 8 32 A14 14 0 0 0 22 8 Z" fill={C.yellowL} opacity="0.5" />
      <circle cx="26" cy="14" r="1.5" fill={C.yellow} opacity="0.3" />
      <circle cx="18" cy="20" r="1" fill={C.yellow} opacity="0.25" />
      <circle cx="28" cy="24" r="1" fill={C.yellow} opacity="0.2" />
    </svg>
  );
}

export function BedSVG() {
  return (
    <svg viewBox="0 0 200 150" className="w-full h-full" fill="none">
      <defs>
        <linearGradient id="bd-head" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={C.woodL} /><stop offset="1" stopColor={C.wood} /></linearGradient>
        <linearGradient id="bd-frame" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={C.wood} /><stop offset="1" stopColor={C.woodD} /></linearGradient>
        <linearGradient id="bd-matt" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={C.cream} /><stop offset="1" stopColor={C.creamD} /></linearGradient>
        <linearGradient id="bd-blanket" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={C.skyL} /><stop offset="1" stopColor={C.sky} /></linearGradient>
        <linearGradient id="bd-pillow" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ffffff" /><stop offset="1" stopColor={C.cream} /></linearGradient>
      </defs>
      <ellipse cx="100" cy="145" rx="88" ry="5" fill="rgba(0,0,0,0.1)" />
      <rect x="24" y="130" width="8" height="14" rx="4" fill={C.woodS} />
      <rect x="168" y="130" width="8" height="14" rx="4" fill={C.woodS} />
      <rect x="44" y="132" width="6" height="12" rx="3" fill={C.woodS} />
      <rect x="150" y="132" width="6" height="12" rx="3" fill={C.woodS} />
      <rect x="10" y="66" width="180" height="66" rx="8" fill="url(#bd-frame)" stroke={C.woodD} strokeWidth="0.5" />
      <rect x="12" y="68" width="176" height="4" rx="2" fill="rgba(255,255,255,0.12)" />
      <rect x="10" y="128" width="180" height="4" rx="2" fill="rgba(0,0,0,0.06)" />
      <rect x="14" y="16" width="172" height="52" rx="8" fill="url(#bd-head)" stroke={C.woodD} strokeWidth="0.5" />
      <rect x="14" y="16" width="172" height="6" rx="3" fill="rgba(255,255,255,0.12)" />
      <rect x="14" y="62" width="172" height="6" rx="3" fill="rgba(0,0,0,0.06)" />
      <rect x="16" y="74" width="168" height="52" rx="4" fill="url(#bd-matt)" />
      <rect x="16" y="74" width="168" height="5" rx="2.5" fill="rgba(255,255,255,0.2)" />
      <rect x="16" y="122" width="168" height="4" rx="2" fill="rgba(0,0,0,0.06)" />
      <rect x="18" y="80" width="116" height="44" rx="5" fill="url(#bd-blanket)" />
      <rect x="18" y="80" width="116" height="5" rx="2.5" fill="rgba(255,255,255,0.12)" />
      <rect x="18" y="120" width="116" height="4" rx="2" fill={C.skyD} />
      <rect x="16" y="68" width="52" height="14" rx="7" fill="url(#bd-pillow)" stroke={C.creamD} strokeWidth="0.3" />
      <rect x="18" y="70" width="48" height="3" rx="1.5" fill="rgba(255,255,255,0.35)" />
      <line x1="28" y1="92" x2="126" y2="92" stroke={C.skyD} strokeWidth="0.5" strokeDasharray="4 4" opacity="0.2" />
      <line x1="28" y1="104" x2="126" y2="104" stroke={C.skyD} strokeWidth="0.5" strokeDasharray="4 4" opacity="0.2" />
      <line x1="28" y1="116" x2="126" y2="116" stroke={C.skyD} strokeWidth="0.5" strokeDasharray="4 4" opacity="0.2" />
    </svg>
  );
}

export function NightstandSVG() {
  return (
    <svg viewBox="0 0 60 70" className="w-full h-full" fill="none">
      <ellipse cx="30" cy="67" rx="28" ry="4" fill="rgba(0,0,0,0.1)" />
      <rect x="10" y="58" width="5" height="10" rx="2.5" fill={C.woodS} />
      <rect x="45" y="58" width="5" height="10" rx="2.5" fill={C.woodS} />
      <rect x="4" y="22" width="52" height="38" rx="6" fill={C.wood} stroke={C.woodD} strokeWidth="0.5" />
      <rect x="6" y="24" width="48" height="6" rx="3" fill="rgba(255,255,255,0.2)" />
      <rect x="8" y="32" width="44" height="24" rx="4" fill={C.wood} opacity="0.25" stroke={C.wood} strokeWidth="0.5" />
      <rect x="44" y="42" width="4" height="10" rx="2" fill={C.woodD} />
      <rect x="8" y="34" width="44" height="4" rx="2" fill="rgba(255,255,255,0.08)" />
      <rect x="4" y="12" width="52" height="14" rx="6" fill={C.cream} stroke={C.woodD} strokeWidth="0.5" />
      <rect x="6" y="14" width="48" height="4" rx="2" fill="rgba(255,255,255,0.25)" />
      <rect x="22" y="8" width="16" height="8" rx="4" fill={C.yellowL} stroke={C.yellowD} strokeWidth="0.3" />
      <circle cx="30" cy="6" r="14" fill={C.yellow} opacity="0.08" />
    </svg>
  );
}
