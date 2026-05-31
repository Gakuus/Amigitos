'use client';

import type { PetMood, PetSpecies } from '@amigitos/shared';

interface PetSpriteProps {
  species: PetSpecies;
  mood: PetMood;
  isSleeping?: boolean;
  size?: number;
}

const moodGlow: Record<string, string> = {
  HAPPY: '#fbbf24',
  NEUTRAL: '#94a3b8',
  SAD: '#60a5fa',
  SLEEPING: '#8b5cf6',
  SICK: '#ef4444',
};

const moodFace: Record<string, { eyes: string; mouth: string; blush?: string }> = {
  HAPPY: { eyes: '^_^', mouth: 'ω', blush: '#fca5a5' },
  NEUTRAL: { eyes: '◡', mouth: '—' },
  SAD: { eyes: '◡', mouth: '︿', blush: '#93c5fd' },
  SLEEPING: { eyes: '∪', mouth: '⋯' },
  SICK: { eyes: '>_<', mouth: '︿', blush: '#fca5a5' },
};

export function PetSprite({ species, mood, isSleeping, size = 200 }: PetSpriteProps) {
  const glow = moodGlow[mood] ?? '#94a3b8';

  return (
    <div
      className={`relative flex items-center justify-center ${isSleeping ? 'animate-breathe-sleep' : ''}`}
      style={{ width: size, height: size }}
    >
      {/* Glow aura */}
      <div
        className="absolute rounded-full animate-pulse"
        style={{
          width: size * 0.9,
          height: size * 0.9,
          background: `radial-gradient(circle, ${glow}22 0%, transparent 70%)`,
        }}
      />

      {/* Pet SVG */}
      <svg
        viewBox="0 0 200 200"
        width={size}
        height={size}
        className="relative drop-shadow-lg"
      >
        <style>{animations}</style>

        {species === 'CAT' && <CatSprite mood={mood} isSleeping={isSleeping} />}
        {species === 'DOG' && <DogSprite mood={mood} isSleeping={isSleeping} />}
        {species === 'RABBIT' && <RabbitSprite mood={mood} isSleeping={isSleeping} />}
        {species === 'HAMSTER' && <HamsterSprite mood={mood} isSleeping={isSleeping} />}
        {species === 'FOX' && <FoxSprite mood={mood} isSleeping={isSleeping} />}
        {species === 'PANDA' && <PandaSprite mood={mood} isSleeping={isSleeping} />}
        {species === 'PENGUIN' && <PenguinSprite mood={mood} isSleeping={isSleeping} />}
        {species === 'DRAGON' && <DragonSprite mood={mood} isSleeping={isSleeping} />}
        {species === 'UNICORN' && <UnicornSprite mood={mood} isSleeping={isSleeping} />}
        {!['CAT','DOG','RABBIT','HAMSTER','FOX','PANDA','PENGUIN','DRAGON','UNICORN'].includes(species) && (
          <DefaultSprite mood={mood} isSleeping={isSleeping} />
        )}
      </svg>

      {/* Sleeping Zzz */}
      {isSleeping && <SleepingZzz />}
    </div>
  );
}

function Eyes({ mood, isSleeping }: { mood: PetMood; isSleeping?: boolean }) {
  if (isSleeping || mood === 'SLEEPING') {
    return (
      <g className="animate-blink-slow">
        {/* Closed eyes - curved lines */}
        <path d="M65 80 Q75 72 85 80" fill="none" stroke="#475569" strokeWidth="3" strokeLinecap="round" />
        <path d="M115 80 Q125 72 135 80" fill="none" stroke="#475569" strokeWidth="3" strokeLinecap="round" />
        {/* Tiny lashes */}
        <line x1="68" y1="76" x2="65" y2="72" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="132" y1="76" x2="135" y2="72" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" />
      </g>
    );
  }

  return (
    <g className="animate-blink">
      {/* Left eye */}
      <ellipse cx="75" cy="78" rx="10" ry="11" fill="white" stroke="#1e293b" strokeWidth="2" />
      <circle cx="77" cy="78" r="5" fill="#1e293b" />
      <circle cx="79" cy="76" r="2" fill="white" />
      {/* Right eye */}
      <ellipse cx="125" cy="78" rx="10" ry="11" fill="white" stroke="#1e293b" strokeWidth="2" />
      <circle cx="127" cy="78" r="5" fill="#1e293b" />
      <circle cx="129" cy="76" r="2" fill="white" />
    </g>
  );
}

function Blush({ color }: { color?: string }) {
  if (!color) return null;
  return (
    <g>
      <ellipse cx="55" cy="95" rx="10" ry="6" fill={color} opacity="0.5" />
      <ellipse cx="145" cy="95" rx="10" ry="6" fill={color} opacity="0.5" />
    </g>
  );
}

function Mouth({ mood, isSleeping }: { mood: PetMood; isSleeping?: boolean }) {
  if (isSleeping || mood === 'SLEEPING') {
    return <ellipse cx="100" cy="105" rx="4" ry="3" fill="#475569" opacity="0.3" />;
  }
  if (mood === 'HAPPY') {
    return <path d="M90 100 Q100 115 110 100" fill="none" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />;
  }
  if (mood === 'SAD' || mood === 'SICK') {
    return <path d="M90 105 Q100 95 110 105" fill="none" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />;
  }
  return <line x1="92" y1="103" x2="108" y2="103" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />;
}

function SleepingZzz() {
  return (
    <div className="absolute -top-2 right-2 flex flex-col items-center animate-float-up">
      <span className="text-xs font-bold text-indigo-400" style={{ animationDelay: '0s' }}>z</span>
      <span className="text-sm font-bold text-indigo-400" style={{ animationDelay: '0.5s' }}>z</span>
      <span className="text-base font-bold text-indigo-400" style={{ animationDelay: '1s' }}>Z</span>
    </div>
  );
}

function CatSprite({ mood, isSleeping }: { mood: PetMood; isSleeping?: boolean }) {
  return (
    <g className="animate-bounce-idle">
      {/* Tail */}
      <g className="animate-tail-wag" transformOrigin="50 160">
        <path d="M55 160 Q35 140 30 120 Q28 112 32 108" fill="none" stroke="#f97316" strokeWidth="6" strokeLinecap="round" />
      </g>
      {/* Body */}
      <ellipse cx="100" cy="140" rx="40" ry="35" fill="#f97316" />
      <ellipse cx="100" cy="148" rx="28" ry="20" fill="#fef3c7" opacity="0.6" />
      {/* Head */}
      <circle cx="100" cy="85" r="40" fill="#f97316" />
      {/* Ears */}
      <g className="animate-ear-wiggle" transformOrigin="70 50">
        <polygon points="60,45 75,50 65,75" fill="#f97316" />
        <polygon points="63,50 72,53 67,70" fill="#fecdd3" />
      </g>
      <g className="animate-ear-wiggle" transformOrigin="130 50" style={{ animationDelay: '0.15s' }}>
        <polygon points="140,45 125,50 135,75" fill="#f97316" />
        <polygon points="137,50 128,53 133,70" fill="#fecdd3" />
      </g>
      {/* Eyes */}
      <Eyes mood={mood} isSleeping={isSleeping} />
      {/* Nose */}
      <ellipse cx="100" cy="92" rx="4" ry="3" fill="#f472b6" />
      {/* Mouth */}
      <Mouth mood={mood} isSleeping={isSleeping} />
      {/* Whiskers */}
      <line x1="50" y1="90" x2="75" y2="92" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="48" y1="96" x2="75" y2="96" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="150" y1="90" x2="125" y2="92" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="152" y1="96" x2="125" y2="96" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
      {/* Blush */}
      <Blush color={mood === 'HAPPY' ? '#fca5a5' : undefined} />
      {/* Legs */}
      <ellipse cx="75" cy="170" rx="12" ry="8" fill="#f97316" />
      <ellipse cx="125" cy="170" rx="12" ry="8" fill="#f97316" />
    </g>
  );
}

function DogSprite({ mood, isSleeping }: { mood: PetMood; isSleeping?: boolean }) {
  return (
    <g className="animate-bounce-idle">
      {/* Tail */}
      <g className="animate-tail-wag" transformOrigin="60 150">
        <path d="M60 150 Q40 125 45 110" fill="none" stroke="#d4a574" strokeWidth="7" strokeLinecap="round" />
      </g>
      {/* Body */}
      <ellipse cx="105" cy="140" rx="42" ry="36" fill="#d4a574" />
      <ellipse cx="105" cy="148" rx="30" ry="20" fill="#fef3c7" opacity="0.5" />
      {/* Head */}
      <circle cx="105" cy="85" r="38" fill="#d4a574" />
      {/* Snout */}
      <ellipse cx="105" cy="98" rx="18" ry="13" fill="#c4956a" />
      {/* Floppy ears */}
      <g className="animate-ear-flop" transformOrigin="70 55">
        <ellipse cx="68" cy="78" rx="12" ry="22" fill="#a67c52" transform="rotate(15 68 78)" />
      </g>
      <g className="animate-ear-flop" transformOrigin="140 55" style={{ animationDelay: '0.2s' }}>
        <ellipse cx="142" cy="78" rx="12" ry="22" fill="#a67c52" transform="rotate(-15 142 78)" />
      </g>
      {/* Eyes */}
      <Eyes mood={mood} isSleeping={isSleeping} />
      {/* Nose */}
      <ellipse cx="105" cy="100" rx="6" ry="5" fill="#1e293b" />
      {/* Mouth */}
      <Mouth mood={mood} isSleeping={isSleeping} />
      {/* Tongue when happy */}
      {mood === 'HAPPY' && !isSleeping && (
        <ellipse cx="105" cy="112" rx="5" ry="8" fill="#fca5a5" className="animate-tongue" />
      )}
      {/* Legs */}
      <ellipse cx="80" cy="170" rx="13" ry="9" fill="#d4a574" />
      <ellipse cx="130" cy="170" rx="13" ry="9" fill="#d4a574" />
      <Blush color={mood === 'HAPPY' ? '#fca5a5' : undefined} />
    </g>
  );
}

function RabbitSprite({ mood, isSleeping }: { mood: PetMood; isSleeping?: boolean }) {
  return (
    <g className="animate-bounce-idle">
      {/* Body */}
      <ellipse cx="100" cy="140" rx="32" ry="38" fill="#f3f4f6" />
      <ellipse cx="100" cy="148" rx="22" ry="24" fill="white" opacity="0.5" />
      {/* Head */}
      <circle cx="100" cy="85" r="32" fill="#f3f4f6" />
      {/* Long ears */}
      <g className="animate-ear-flop" transformOrigin="82 55">
        <ellipse cx="78" cy="35" rx="9" ry="30" fill="#f3f4f6" />
        <ellipse cx="78" cy="35" rx="5" ry="22" fill="#fce7f3" />
      </g>
      <g className="animate-ear-flop" transformOrigin="118 55" style={{ animationDelay: '0.1s' }}>
        <ellipse cx="122" cy="35" rx="9" ry="30" fill="#f3f4f6" />
        <ellipse cx="122" cy="35" rx="5" ry="22" fill="#fce7f3" />
      </g>
      {/* Eyes */}
      <Eyes mood={mood} isSleeping={isSleeping} />
      {/* Nose */}
      <ellipse cx="100" cy="92" rx="3" ry="2.5" fill="#f472b6" />
      {/* Cheeks */}
      <ellipse cx="75" cy="90" rx="8" ry="5" fill="#fce7f3" />
      <ellipse cx="125" cy="90" rx="8" ry="5" fill="#fce7f3" />
      {/* Mouth */}
      <Mouth mood={mood} isSleeping={isSleeping} />
      {/* Tail */}
      <circle cx="100" cy="170" r="10" fill="white" />
      {/* Legs */}
      <ellipse cx="80" cy="172" rx="10" ry="7" fill="#f3f4f6" />
      <ellipse cx="120" cy="172" rx="10" ry="7" fill="#f3f4f6" />
    </g>
  );
}

function HamsterSprite({ mood, isSleeping }: { mood: PetMood; isSleeping?: boolean }) {
  return (
    <g className="animate-bounce-idle">
      {/* Body */}
      <circle cx="100" cy="135" r="40" fill="#fbbf24" />
      <ellipse cx="100" cy="142" rx="28" ry="22" fill="#fef3c7" opacity="0.6" />
      {/* Head */}
      <circle cx="100" cy="85" r="30" fill="#fbbf24" />
      {/* Puffy cheeks */}
      <ellipse cx="72" cy="92" rx="14" ry="12" fill="#fcd34d" />
      <ellipse cx="128" cy="92" rx="14" ry="12" fill="#fcd34d" />
      {/* Ears */}
      <circle cx="80" cy="58" r="8" fill="#fbbf24" />
      <circle cx="120" cy="58" r="8" fill="#fbbf24" />
      <circle cx="80" cy="58" r="5" fill="#fcd34d" />
      <circle cx="120" cy="58" r="5" fill="#fcd34d" />
      {/* Eyes */}
      {isSleeping || mood === 'SLEEPING' ? (
        <g className="animate-blink-slow">
          <line x1="80" y1="78" x2="88" y2="75" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="112" y1="75" x2="120" y2="78" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
        </g>
      ) : (
        <g>
          <circle cx="86" cy="78" r="6" fill="#1e293b" />
          <circle cx="114" cy="78" r="6" fill="#1e293b" />
          <circle cx="88" cy="76" r="2.5" fill="white" />
          <circle cx="116" cy="76" r="2.5" fill="white" />
        </g>
      )}
      {/* Nose */}
      <ellipse cx="100" cy="90" rx="3" ry="2" fill="#f472b6" />
      {/* Mouth */}
      <Mouth mood={mood} isSleeping={isSleeping} />
      {/* Legs */}
      <ellipse cx="82" cy="170" rx="10" ry="6" fill="#fbbf24" />
      <ellipse cx="118" cy="170" rx="10" ry="6" fill="#fbbf24" />
    </g>
  );
}

function FoxSprite({ mood, isSleeping }: { mood: PetMood; isSleeping?: boolean }) {
  return (
    <g className="animate-bounce-idle">
      {/* Bushy tail */}
      <g className="animate-tail-wag" transformOrigin="55 150">
        <path d="M60 150 Q30 130 25 100 Q22 85 28 80" fill="none" stroke="#f97316" strokeWidth="14" strokeLinecap="round" />
        <circle cx="28" cy="82" r="6" fill="#fef3c7" />
      </g>
      {/* Body */}
      <ellipse cx="105" cy="138" rx="38" ry="32" fill="#f97316" />
      <ellipse cx="105" cy="145" rx="25" ry="18" fill="#fef3c7" opacity="0.6" />
      {/* Head */}
      <circle cx="105" cy="85" r="34" fill="#f97316" />
      {/* Snout */}
      <ellipse cx="105" cy="96" rx="16" ry="10" fill="#fef3c7" />
      {/* Ears */}
      <g className="animate-ear-wiggle" transformOrigin="78 55">
        <polygon points="75,48 88,52 80,80" fill="#f97316" />
        <polygon points="78,52 86,55 82,74" fill="#1e293b" />
      </g>
      <g className="animate-ear-wiggle" transformOrigin="132 55" style={{ animationDelay: '0.12s' }}>
        <polygon points="125,48 112,52 120,80" fill="#f97316" />
        <polygon points="122,52 114,55 118,74" fill="#1e293b" />
      </g>
      {/* Eyes */}
      <Eyes mood={mood} isSleeping={isSleeping} />
      {/* Nose */}
      <ellipse cx="105" cy="98" rx="4" ry="3" fill="#1e293b" />
      {/* Mouth */}
      <Mouth mood={mood} isSleeping={isSleeping} />
      {/* Legs */}
      <ellipse cx="82" cy="168" rx="11" ry="8" fill="#f97316" />
      <ellipse cx="128" cy="168" rx="11" ry="8" fill="#f97316" />
    </g>
  );
}

function PandaSprite({ mood, isSleeping }: { mood: PetMood; isSleeping?: boolean }) {
  return (
    <g className="animate-bounce-idle">
      {/* Body */}
      <ellipse cx="100" cy="140" rx="40" ry="35" fill="white" />
      {/* Head */}
      <circle cx="100" cy="85" r="36" fill="white" />
      {/* Eye patches */}
      <ellipse cx="78" cy="80" rx="15" ry="13" fill="#1e293b" />
      <ellipse cx="122" cy="80" rx="15" ry="13" fill="#1e293b" />
      {/* Eyes */}
      {isSleeping || mood === 'SLEEPING' ? (
        <g className="animate-blink-slow">
          <line x1="72" y1="78" x2="84" y2="75" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="128" y1="75" x2="116" y2="78" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
        </g>
      ) : (
        <g>
          <circle cx="78" cy="80" r="5" fill="white" />
          <circle cx="122" cy="80" r="5" fill="white" />
          <circle cx="79" cy="79" r="2.5" fill="#1e293b" />
          <circle cx="123" cy="79" r="2.5" fill="#1e293b" />
        </g>
      )}
      {/* Nose */}
      <ellipse cx="100" cy="93" rx="5" ry="4" fill="#1e293b" />
      {/* Mouth */}
      <Mouth mood={mood} isSleeping={isSleeping} />
      {/* Ears */}
      <circle cx="72" cy="52" r="11" fill="#1e293b" />
      <circle cx="128" cy="52" r="11" fill="#1e293b" />
      {/* Arms */}
      <ellipse cx="60" cy="130" rx="10" ry="16" fill="#1e293b" transform="rotate(20 60 130)" />
      <ellipse cx="140" cy="130" rx="10" ry="16" fill="#1e293b" transform="rotate(-20 140 130)" />
      {/* Legs */}
      <ellipse cx="80" cy="170" rx="12" ry="9" fill="#1e293b" />
      <ellipse cx="120" cy="170" rx="12" ry="9" fill="#1e293b" />
    </g>
  );
}

function PenguinSprite({ mood, isSleeping }: { mood: PetMood; isSleeping?: boolean }) {
  return (
    <g className="animate-bounce-idle">
      {/* Body */}
      <ellipse cx="100" cy="135" rx="35" ry="45" fill="#1e293b" />
      {/* Belly */}
      <ellipse cx="100" cy="142" rx="24" ry="35" fill="#f3f4f6" />
      {/* Head */}
      <circle cx="100" cy="82" r="28" fill="#1e293b" />
      {/* Face */}
      <ellipse cx="100" cy="82" rx="18" ry="14" fill="#f3f4f6" />
      {/* Eyes */}
      {isSleeping || mood === 'SLEEPING' ? (
        <g className="animate-blink-slow">
          <line x1="88" y1="78" x2="95" y2="75" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
          <line x1="112" y1="75" x2="105" y2="78" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
        </g>
      ) : (
        <g>
          <circle cx="92" cy="78" r="4" fill="#1e293b" />
          <circle cx="108" cy="78" r="4" fill="#1e293b" />
          <circle cx="93" cy="77" r="1.5" fill="white" />
          <circle cx="109" cy="77" r="1.5" fill="white" />
        </g>
      )}
      {/* Beak */}
      <polygon points="97,85 103,85 100,92" fill="#f97316" />
      {/* Mouth */}
      {!isSleeping && mood !== 'SLEEPING' && (
        mood === 'HAPPY' ? (
          <path d="M96 90 Q100 94 104 90" fill="none" stroke="#f97316" strokeWidth="1.5" strokeLinecap="round" />
        ) : null
      )}
      {/* Flippers */}
      <g className="animate-flipper" transformOrigin="65 120">
        <ellipse cx="65" cy="120" rx="8" ry="25" fill="#1e293b" transform="rotate(20 65 120)" />
      </g>
      <g className="animate-flipper" transformOrigin="135 120" style={{ animationDelay: '0.15s' }}>
        <ellipse cx="135" cy="120" rx="8" ry="25" fill="#1e293b" transform="rotate(-20 135 120)" />
      </g>
      {/* Feet */}
      <ellipse cx="85" cy="178" rx="12" ry="5" fill="#f97316" />
      <ellipse cx="115" cy="178" rx="12" ry="5" fill="#f97316" />
    </g>
  );
}

function DragonSprite({ mood, isSleeping }: { mood: PetMood; isSleeping?: boolean }) {
  return (
    <g className="animate-bounce-idle">
      {/* Tail */}
      <g className="animate-tail-wag" transformOrigin="55 145">
        <path d="M60 145 Q30 135 20 115 Q12 100 18 95" fill="none" stroke="#22c55e" strokeWidth="10" strokeLinecap="round" />
        <polygon points="18,95 12,88 22,90" fill="#fbbf24" />
      </g>
      {/* Body */}
      <ellipse cx="100" cy="135" rx="35" ry="30" fill="#22c55e" />
      <ellipse cx="100" cy="142" rx="22" ry="18" fill="#86efac" opacity="0.4" />
      {/* Head */}
      <circle cx="100" cy="88" r="30" fill="#22c55e" />
      {/* Snout */}
      <ellipse cx="100" cy="100" rx="14" ry="9" fill="#16a34a" />
      {/* Horns */}
      <polygon points="82,60 90,68 78,72" fill="#fbbf24" />
      <polygon points="118,60 110,68 122,72" fill="#fbbf24" />
      {/* Eyes */}
      {isSleeping || mood === 'SLEEPING' ? (
        <g className="animate-blink-slow">
          <line x1="84" y1="82" x2="94" y2="78" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="116" y1="78" x2="106" y2="82" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
        </g>
      ) : (
        <g>
          <ellipse cx="88" cy="82" rx="7" ry="5" fill="#fbbf24" />
          <ellipse cx="112" cy="82" rx="7" ry="5" fill="#fbbf24" />
          <ellipse cx="89" cy="82" rx="3" ry="4" fill="#1e293b" />
          <ellipse cx="113" cy="82" rx="3" ry="4" fill="#1e293b" />
        </g>
      )}
      {/* Wings */}
      <g className="animate-wing" transformOrigin="68 100">
        <path d="M68 100 Q40 80 35 60 Q45 75 60 85 Q50 70 48 55 Q58 70 68 85 Z" fill="#16a34a" opacity="0.8" />
      </g>
      <g className="animate-wing" transformOrigin="132 100" style={{ animationDelay: '0.1s' }}>
        <path d="M132 100 Q160 80 165 60 Q155 75 140 85 Q150 70 152 55 Q142 70 132 85 Z" fill="#16a34a" opacity="0.8" />
      </g>
      {/* Spikes */}
      <polygon points="100,50 97,42 103,42" fill="#fbbf24" />
      <polygon points="92,54 89,46 95,46" fill="#fbbf24" />
      <polygon points="108,54 105,46 111,46" fill="#fbbf24" />
      {/* Mouth */}
      <Mouth mood={mood} isSleeping={isSleeping} />
      {/* Fire breath when happy */}
      {mood === 'HAPPY' && !isSleeping && (
        <g className="animate-fire">
          <ellipse cx="100" cy="108" rx="4" ry="3" fill="#f97316" opacity="0.8" />
          <ellipse cx="100" cy="112" rx="2" ry="2" fill="#fbbf24" opacity="0.6" />
        </g>
      )}
      {/* Legs */}
      <ellipse cx="80" cy="162" rx="10" ry="8" fill="#22c55e" />
      <ellipse cx="120" cy="162" rx="10" ry="8" fill="#22c55e" />
    </g>
  );
}

function UnicornSprite({ mood, isSleeping }: { mood: PetMood; isSleeping?: boolean }) {
  return (
    <g className="animate-bounce-idle">
      {/* Body */}
      <ellipse cx="100" cy="135" rx="35" ry="28" fill="#fdf2f8" />
      <ellipse cx="100" cy="142" rx="22" ry="16" fill="#fce7f3" opacity="0.5" />
      {/* Head */}
      <circle cx="100" cy="88" r="30" fill="#fdf2f8" />
      {/* Snout */}
      <ellipse cx="100" cy="100" rx="13" ry="9" fill="#fce7f3" />
      {/* Horn */}
      <g className="animate-horn-glow">
        <polygon points="98,58 102,58 100,35" fill="#fbbf24" />
        <polygon points="99,50 101,50 100,38" fill="white" opacity="0.5" />
      </g>
      {/* Mane */}
      <ellipse cx="80" cy="70" rx="6" ry="14" fill="#ec4899" transform="rotate(15 80 70)" />
      <ellipse cx="78" cy="85" rx="5" ry="12" fill="#8b5cf6" transform="rotate(10 78 85)" />
      <ellipse cx="76" cy="100" rx="5" ry="10" fill="#3b82f6" transform="rotate(8 76 100)" />
      {/* Tail */}
      <ellipse cx="55" cy="140" rx="5" ry="16" fill="#ec4899" transform="rotate(-20 55 140)" />
      <ellipse cx="52" cy="150" rx="4" ry="12" fill="#8b5cf6" transform="rotate(-15 52 150)" />
      <ellipse cx="50" cy="158" rx="4" ry="10" fill="#3b82f6" transform="rotate(-10 50 158)" />
      {/* Eyes */}
      {isSleeping || mood === 'SLEEPING' ? (
        <g className="animate-blink-slow">
          <line x1="84" y1="85" x2="94" y2="81" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="116" y1="81" x2="106" y2="85" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
        </g>
      ) : (
        <g>
          <ellipse cx="88" cy="86" rx="7" ry="8" fill="white" stroke="#1e293b" strokeWidth="1.5" />
          <ellipse cx="112" cy="86" rx="7" ry="8" fill="white" stroke="#1e293b" strokeWidth="1.5" />
          <circle cx="89" cy="86" r="3.5" fill="#1e293b" />
          <circle cx="113" cy="86" r="3.5" fill="#1e293b" />
          <circle cx="90" cy="84" r="1.5" fill="white" />
          <circle cx="114" cy="84" r="1.5" fill="white" />
          {/* Eyelashes */}
          <line x1="83" y1="80" x2="82" y2="76" stroke="#1e293b" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="88" y1="78" x2="87" y2="74" stroke="#1e293b" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="117" y1="80" x2="118" y2="76" stroke="#1e293b" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="112" y1="78" x2="113" y2="74" stroke="#1e293b" strokeWidth="1.5" strokeLinecap="round" />
        </g>
      )}
      {/* Mouth */}
      <Mouth mood={mood} isSleeping={isSleeping} />
      {/* Legs */}
      <ellipse cx="82" cy="162" rx="9" ry="7" fill="#fdf2f8" />
      <ellipse cx="118" cy="162" rx="9" ry="7" fill="#fdf2f8" />
    </g>
  );
}

function DefaultSprite({ mood, isSleeping }: { mood: PetMood; isSleeping?: boolean }) {
  return (
    <g className="animate-bounce-idle">
      <ellipse cx="100" cy="135" rx="35" ry="30" fill="#22c55e" />
      <circle cx="100" cy="85" r="30" fill="#22c55e" />
      <Eyes mood={mood} isSleeping={isSleeping} />
      <Mouth mood={mood} isSleeping={isSleeping} />
    </g>
  );
}

const animations = `
  @keyframes bounce-idle {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-6px); }
  }
  @keyframes breathe-sleep {
    0%, 100% { transform: scaleY(1) translateY(0); }
    50% { transform: scaleY(1.03) translateY(-2px); }
  }
  @keyframes lie-down {
    from { transform: rotate(0deg); }
    to { transform: rotate(90deg); }
  }
  @keyframes wake-up {
    from { transform: rotate(90deg); }
    to { transform: rotate(0deg); }
  }
  @keyframes blink {
    0%, 95%, 100% { transform: scaleY(1); }
    97% { transform: scaleY(0.1); }
  }
  @keyframes blink-slow {
    0%, 90%, 100% { transform: scaleY(1); }
    95% { transform: scaleY(0.1); }
  }
  @keyframes tail-wag {
    0%, 100% { transform: rotate(-5deg); }
    50% { transform: rotate(10deg); }
  }
  @keyframes ear-wiggle {
    0%, 100% { transform: rotate(0deg); }
    25% { transform: rotate(-8deg); }
    75% { transform: rotate(5deg); }
  }
  @keyframes ear-flop {
    0%, 100% { transform: rotate(0deg); }
    50% { transform: rotate(8deg); }
  }
  @keyframes float-up {
    0% { transform: translateY(0); opacity: 0; }
    20% { opacity: 1; }
    100% { transform: translateY(-20px); opacity: 0; }
  }
  @keyframes tongue {
    0%, 100% { transform: scaleY(1); }
    50% { transform: scaleY(1.2); }
  }
  @keyframes wing {
    0%, 100% { transform: scaleX(1); }
    50% { transform: scaleX(0.7); }
  }
  @keyframes flipper {
    0%, 100% { transform: rotate(20deg); }
    50% { transform: rotate(30deg); }
  }
  @keyframes fire {
    0%, 100% { opacity: 0.8; transform: scale(1); }
    50% { opacity: 0.4; transform: scale(1.3); }
  }
  @keyframes horn-glow {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  }
  .animate-bounce-idle { animation: bounce-idle 2s ease-in-out infinite; }
  .animate-blink { animation: blink 4s ease-in-out infinite; transform-origin: center; }
  .animate-blink-slow { animation: blink-slow 6s ease-in-out infinite; transform-origin: center; }
  .animate-tail-wag { animation: tail-wag 1.5s ease-in-out infinite; transform-origin: bottom; }
  .animate-ear-wiggle { animation: ear-wiggle 3s ease-in-out infinite; transform-origin: bottom; }
  .animate-ear-flop { animation: ear-flop 2.5s ease-in-out infinite; transform-origin: top; }
  .animate-float-up { animation: float-up 2s ease-out infinite; }
  .animate-tongue { animation: tongue 1s ease-in-out infinite; transform-origin: top; }
  .animate-wing { animation: wing 0.8s ease-in-out infinite; transform-origin: right; }
  .animate-flipper { animation: flipper 2s ease-in-out infinite; transform-origin: right; }
  .animate-fire { animation: fire 0.6s ease-in-out infinite; transform-origin: center; }
  .animate-horn-glow { animation: horn-glow 1.5s ease-in-out infinite; }
  .animate-breathe-sleep { animation: breathe-sleep 3s ease-in-out infinite; }
  .animate-lie-down { animation: lie-down 0.5s ease-in-out forwards; }
  .animate-wake-up { animation: wake-up 0.5s ease-in-out forwards; }
`;
