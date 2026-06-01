'use client';

import type { PetMood, PetSpecies } from '@amigitos/shared';

interface PetSpriteProps {
  species: PetSpecies;
  mood: PetMood;
  isSleeping?: boolean;
  size?: number;
}

const moodGlow: Record<string, string> = {
  HAPPY: '#a78bfa',
  NEUTRAL: '#94a3b8',
  SAD: '#60a5fa',
  SLEEPING: '#8b5cf6',
  SICK: '#f87171',
};

export function PetSprite({ species, mood, isSleeping, size = 200 }: PetSpriteProps) {
  const glow = moodGlow[mood] ?? '#94a3b8';

  return (
    <div
      className={`relative flex items-center justify-center ${isSleeping ? 'animate-breathe-sleep' : ''}`}
      style={{ width: size, height: size }}
    >
      {/* Shadow */}
      <div
        className="absolute bottom-2 rounded-full bg-black/10 dark:bg-black/30"
        style={{
          width: size * 0.45,
          height: size * 0.08,
          filter: 'blur(3px)',
        }}
      />

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
        <defs>
          {/* Gradients for Cat */}
          <linearGradient id="catBody" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fdba74" />
            <stop offset="100%" stopColor="#f97316" />
          </linearGradient>
          <linearGradient id="catBelly" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fef3c7" />
            <stop offset="100%" stopColor="#fde68a" />
          </linearGradient>
          {/* Gradients for Dog */}
          <linearGradient id="dogBody" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#e9d5ff" />
            <stop offset="100%" stopColor="#c4b5fd" />
          </linearGradient>
          <linearGradient id="dogBelly" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fef3c7" />
            <stop offset="100%" stopColor="#fde68a" />
          </linearGradient>
          {/* Gradients for Rabbit */}
          <linearGradient id="rabbitBody" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#f3f4f6" />
          </linearGradient>
          <linearGradient id="rabbitEar" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#f3f4f6" />
          </linearGradient>
          {/* Gradients for Hamster */}
          <linearGradient id="hamsterBody" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fde68a" />
            <stop offset="100%" stopColor="#fbbf24" />
          </linearGradient>
          {/* Gradients for Fox */}
          <linearGradient id="foxBody" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fb923c" />
            <stop offset="100%" stopColor="#f97316" />
          </linearGradient>
          {/* Gradients for Panda */}
          <linearGradient id="pandaBody" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#f1f5f9" />
          </linearGradient>
          {/* Gradients for Penguin */}
          <linearGradient id="penguinBody" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>
          <linearGradient id="penguinBelly" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#f3f4f6" />
          </linearGradient>
          {/* Gradients for Dragon */}
          <linearGradient id="dragonBody" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#86efac" />
            <stop offset="100%" stopColor="#22c55e" />
          </linearGradient>
          {/* Gradients for Unicorn */}
          <linearGradient id="unicornBody" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#fdf2f8" />
          </linearGradient>
          <linearGradient id="unicornMane" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f9a8d4" />
            <stop offset="50%" stopColor="#c4b5fd" />
            <stop offset="100%" stopColor="#a78bfa" />
          </linearGradient>
        </defs>
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
        <path d="M65 80 Q75 72 85 80" fill="none" stroke="#475569" strokeWidth="3" strokeLinecap="round" />
        <path d="M115 80 Q125 72 135 80" fill="none" stroke="#475569" strokeWidth="3" strokeLinecap="round" />
        <line x1="68" y1="76" x2="65" y2="72" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="132" y1="76" x2="135" y2="72" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" />
      </g>
    );
  }
  if (mood === 'HAPPY') {
    return (
      <g className="animate-blink">
        <ellipse cx="75" cy="78" rx="10" ry="11" fill="white" stroke="#1e293b" strokeWidth="2" />
        <circle cx="77" cy="78" r="5" fill="#1e293b" />
        <circle cx="80" cy="75" r="2.5" fill="white" />
        <ellipse cx="125" cy="78" rx="10" ry="11" fill="white" stroke="#1e293b" strokeWidth="2" />
        <circle cx="127" cy="78" r="5" fill="#1e293b" />
        <circle cx="130" cy="75" r="2.5" fill="white" />
        {/* Eyebrows up */}
        <path d="M65 68 Q75 62 85 68" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
        <path d="M115 68 Q125 62 135 68" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
      </g>
    );
  }
  if (mood === 'SAD' || mood === 'SICK') {
    return (
      <g className="animate-blink">
        <ellipse cx="75" cy="80" rx="10" ry="11" fill="white" stroke="#1e293b" strokeWidth="2" />
        <circle cx="77" cy="81" r="5" fill="#1e293b" />
        <circle cx="79" cy="79" r="2" fill="white" />
        <ellipse cx="125" cy="80" rx="10" ry="11" fill="white" stroke="#1e293b" strokeWidth="2" />
        <circle cx="127" cy="81" r="5" fill="#1e293b" />
        <circle cx="129" cy="79" r="2" fill="white" />
        {/* Eyebrows angled */}
        <path d="M65 72 Q75 76 85 72" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
        <path d="M115 72 Q125 76 135 72" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
        {/* Teardrop */}
        {mood === 'SAD' && (
          <g className="animate-tear">
            <path d="M88 90 Q90 100 88 105" fill="none" stroke="#7dd3fc" strokeWidth="2" strokeLinecap="round" />
            <circle cx="88" cy="108" r="2" fill="#7dd3fc" />
          </g>
        )}
      </g>
    );
  }
  return (
    <g className="animate-blink">
      <ellipse cx="75" cy="78" rx="10" ry="11" fill="white" stroke="#1e293b" strokeWidth="2" />
      <circle cx="77" cy="78" r="5" fill="#1e293b" />
      <circle cx="79" cy="76" r="2" fill="white" />
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
    return (
      <g>
        <ellipse cx="100" cy="105" rx="4" ry="3" fill="#475569" opacity="0.3" />
        <path d="M94 108 Q100 112 106 108" fill="none" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      </g>
    );
  }
  if (mood === 'HAPPY') {
    return (
      <g>
        <path d="M88 103 Q100 118 112 103" fill="none" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
        {/* Open mouth */}
        <ellipse cx="100" cy="108" rx="6" ry="4" fill="#fca5a5" opacity="0.6" />
      </g>
    );
  }
  if (mood === 'SAD' || mood === 'SICK') {
    return <path d="M90 108 Q100 98 110 108" fill="none" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />;
  }
  return (
    <g>
      <line x1="92" y1="103" x2="108" y2="103" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="94" y1="107" x2="106" y2="107" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
    </g>
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

function CatSprite({ mood, isSleeping }: { mood: PetMood; isSleeping?: boolean }) {
  return (
    <g className={isSleeping ? 'animate-lie-down' : 'animate-bounce-idle'}>
      {isSleeping ? (
        <g transform="translate(0, 20)">
          <ellipse cx="100" cy="150" rx="45" ry="22" fill="url(#catBody)" />
          <circle cx="100" cy="128" r="32" fill="url(#catBody)" />
          <path d="M60 108 Q70 100 80 108" fill="none" stroke="#f97316" strokeWidth="6" strokeLinecap="round" />
          <path d="M140 108 Q130 100 120 108" fill="none" stroke="#f97316" strokeWidth="6" strokeLinecap="round" />
          <path d="M72 130 Q80 125 88 130" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
          <path d="M112 130 Q120 125 128 130" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
          <ellipse cx="100" cy="138" rx="4" ry="2.5" fill="#f472b6" />
        </g>
      ) : (
        <g>
          <g className="animate-tail-wag" transformOrigin="50 160">
            <path d="M55 160 Q35 140 30 120 Q28 112 32 108" fill="none" stroke="url(#catBody)" strokeWidth="6" strokeLinecap="round" />
          </g>
          <ellipse cx="100" cy="140" rx="40" ry="35" fill="url(#catBody)" />
          <ellipse cx="100" cy="148" rx="28" ry="20" fill="url(#catBelly)" opacity="0.6" />
          <circle cx="100" cy="85" r="40" fill="url(#catBody)" />
          <g className="animate-ear-wiggle" transformOrigin="70 50">
            <polygon points="60,45 75,50 65,75" fill="url(#catBody)" />
            <polygon points="63,50 72,53 67,70" fill="#fecdd3" />
          </g>
          <g className="animate-ear-wiggle" transformOrigin="130 50" style={{ animationDelay: '0.15s' }}>
            <polygon points="140,45 125,50 135,75" fill="url(#catBody)" />
            <polygon points="137,50 128,53 133,70" fill="#fecdd3" />
          </g>
          <Eyes mood={mood} isSleeping={isSleeping} />
          <ellipse cx="100" cy="92" rx="4" ry="3" fill="#f472b6" />
          <Mouth mood={mood} isSleeping={isSleeping} />
          <line x1="50" y1="90" x2="75" y2="92" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="48" y1="96" x2="75" y2="96" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="150" y1="90" x2="125" y2="92" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="152" y1="96" x2="125" y2="96" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
          <Blush color={mood === 'HAPPY' ? '#fca5a5' : undefined} />
          <ellipse cx="75" cy="170" rx="12" ry="8" fill="url(#catBody)" />
          <ellipse cx="125" cy="170" rx="12" ry="8" fill="url(#catBody)" />
        </g>
      )}
    </g>
  );
}

function DogSprite({ mood, isSleeping }: { mood: PetMood; isSleeping?: boolean }) {
  return (
    <g className={isSleeping ? 'animate-lie-down' : 'animate-bounce-idle'}>
      {isSleeping ? (
        <g transform="translate(0, 20)">
          <ellipse cx="105" cy="150" rx="48" ry="24" fill="url(#dogBody)" />
          <circle cx="105" cy="128" r="32" fill="url(#dogBody)" />
          <ellipse cx="95" cy="138" rx="16" ry="10" fill="#c4b5fd" />
          <path d="M78 130 Q88 124 98 130" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
          <path d="M112 130 Q122 124 132 130" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
          <ellipse cx="105" cy="140" rx="4" ry="3" fill="#1e293b" />
        </g>
      ) : (
        <g>
          <g className="animate-tail-wag" transformOrigin="60 150" style={{ animationDuration: '0.8s' }}>
            <path d="M60 150 Q40 125 45 110" fill="none" stroke="url(#dogBody)" strokeWidth="7" strokeLinecap="round" />
          </g>
          <ellipse cx="105" cy="140" rx="42" ry="36" fill="url(#dogBody)" />
          <ellipse cx="105" cy="148" rx="30" ry="20" fill="url(#dogBelly)" opacity="0.5" />
          <circle cx="105" cy="85" r="38" fill="url(#dogBody)" />
          <ellipse cx="105" cy="98" rx="18" ry="13" fill="#c4b5fd" />
          <g className="animate-ear-flop" transformOrigin="70 55">
            <ellipse cx="68" cy="78" rx="12" ry="22" fill="#a78bfa" transform="rotate(15 68 78)" />
          </g>
          <g className="animate-ear-flop" transformOrigin="140 55" style={{ animationDelay: '0.2s' }}>
            <ellipse cx="142" cy="78" rx="12" ry="22" fill="#a78bfa" transform="rotate(-15 142 78)" />
          </g>
          <Eyes mood={mood} isSleeping={isSleeping} />
          <ellipse cx="105" cy="100" rx="6" ry="5" fill="#1e293b" />
          <Mouth mood={mood} isSleeping={isSleeping} />
          {mood === 'HAPPY' && !isSleeping && (
            <ellipse cx="105" cy="112" rx="5" ry="8" fill="#fca5a5" className="animate-tongue" />
          )}
          <ellipse cx="80" cy="170" rx="13" ry="9" fill="url(#dogBody)" />
          <ellipse cx="130" cy="170" rx="13" ry="9" fill="url(#dogBody)" />
          <Blush color={mood === 'HAPPY' ? '#fca5a5' : undefined} />
        </g>
      )}
    </g>
  );
}

function RabbitSprite({ mood, isSleeping }: { mood: PetMood; isSleeping?: boolean }) {
  return (
    <g className={isSleeping ? 'animate-lie-down' : 'animate-bounce-idle'}>
      {isSleeping ? (
        <g transform="translate(0, 20)">
          <ellipse cx="100" cy="150" rx="40" ry="20" fill="url(#rabbitBody)" />
          <circle cx="100" cy="130" r="28" fill="url(#rabbitBody)" />
          <ellipse cx="90" cy="140" rx="14" ry="8" fill="#fce7f3" />
          <path d="M82 132 Q90 126 98 132" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
          <path d="M102 132 Q110 126 118 132" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
          <ellipse cx="100" cy="140" rx="3" ry="2" fill="#f472b6" />
        </g>
      ) : (
        <g>
          <ellipse cx="100" cy="140" rx="32" ry="38" fill="url(#rabbitBody)" />
          <ellipse cx="100" cy="148" rx="22" ry="24" fill="white" opacity="0.5" />
          <circle cx="100" cy="85" r="32" fill="url(#rabbitBody)" />
          <g className="animate-ear-flop" transformOrigin="82 55">
            <ellipse cx="78" cy="35" rx="9" ry="30" fill="url(#rabbitEar)" stroke="#e5e7eb" strokeWidth="1" />
            <ellipse cx="78" cy="35" rx="5" ry="22" fill="#fce7f3" />
          </g>
          <g className="animate-ear-flop" transformOrigin="118 55" style={{ animationDelay: '0.1s' }}>
            <ellipse cx="122" cy="35" rx="9" ry="30" fill="url(#rabbitEar)" stroke="#e5e7eb" strokeWidth="1" />
            <ellipse cx="122" cy="35" rx="5" ry="22" fill="#fce7f3" />
          </g>
          <Eyes mood={mood} isSleeping={isSleeping} />
          <ellipse cx="100" cy="92" rx="3" ry="2.5" fill="#f472b6" />
          <ellipse cx="75" cy="90" rx="8" ry="5" fill="#fce7f3" />
          <ellipse cx="125" cy="90" rx="8" ry="5" fill="#fce7f3" />
          <Mouth mood={mood} isSleeping={isSleeping} />
          <circle cx="100" cy="170" r="10" fill="white" stroke="#e5e7eb" strokeWidth="1" />
          <ellipse cx="80" cy="172" rx="10" ry="7" fill="url(#rabbitBody)" />
          <ellipse cx="120" cy="172" rx="10" ry="7" fill="url(#rabbitBody)" />
        </g>
      )}
    </g>
  );
}

function HamsterSprite({ mood, isSleeping }: { mood: PetMood; isSleeping?: boolean }) {
  return (
    <g className={isSleeping ? 'animate-lie-down' : 'animate-bounce-idle'}>
      {isSleeping ? (
        <g transform="translate(0, 15)">
          <ellipse cx="100" cy="145" rx="38" ry="20" fill="url(#hamsterBody)" />
          <circle cx="100" cy="128" r="26" fill="url(#hamsterBody)" />
          <ellipse cx="85" cy="135" rx="10" ry="8" fill="#fcd34d" />
          <ellipse cx="115" cy="135" rx="10" ry="8" fill="#fcd34d" />
          <path d="M82 130 Q90 125 98 130" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
          <path d="M102 130 Q110 125 118 130" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
        </g>
      ) : (
        <g>
          <circle cx="100" cy="135" r="40" fill="url(#hamsterBody)" />
          <ellipse cx="100" cy="142" rx="28" ry="22" fill="#fef3c7" opacity="0.6" />
          <circle cx="100" cy="85" r="30" fill="url(#hamsterBody)" />
          <ellipse cx="72" cy="92" rx="14" ry="12" fill="#fcd34d" />
          <ellipse cx="128" cy="92" rx="14" ry="12" fill="#fcd34d" />
          <circle cx="80" cy="58" r="8" fill="url(#hamsterBody)" />
          <circle cx="120" cy="58" r="8" fill="url(#hamsterBody)" />
          <circle cx="80" cy="58" r="5" fill="#fcd34d" />
          <circle cx="120" cy="58" r="5" fill="#fcd34d" />
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
          <ellipse cx="100" cy="90" rx="3" ry="2" fill="#f472b6" />
          <Mouth mood={mood} isSleeping={isSleeping} />
          <ellipse cx="82" cy="170" rx="10" ry="6" fill="url(#hamsterBody)" />
          <ellipse cx="118" cy="170" rx="10" ry="6" fill="url(#hamsterBody)" />
        </g>
      )}
    </g>
  );
}

function FoxSprite({ mood, isSleeping }: { mood: PetMood; isSleeping?: boolean }) {
  return (
    <g className={isSleeping ? 'animate-lie-down' : 'animate-bounce-idle'}>
      {isSleeping ? (
        <g transform="translate(0, 20)">
          <ellipse cx="105" cy="150" rx="42" ry="22" fill="url(#foxBody)" />
          <circle cx="105" cy="128" r="30" fill="url(#foxBody)" />
          <ellipse cx="105" cy="140" rx="14" ry="8" fill="#fef3c7" />
          <path d="M78 130 Q88 124 98 130" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
          <path d="M112 130 Q122 124 132 130" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
          <ellipse cx="105" cy="140" rx="3" ry="2.5" fill="#1e293b" />
        </g>
      ) : (
        <g>
          <g className="animate-tail-wag" transformOrigin="55 150">
            <path d="M60 150 Q30 130 25 100 Q22 85 28 80" fill="none" stroke="url(#foxBody)" strokeWidth="14" strokeLinecap="round" />
            <circle cx="28" cy="82" r="6" fill="#fef3c7" />
          </g>
          <ellipse cx="105" cy="138" rx="38" ry="32" fill="url(#foxBody)" />
          <ellipse cx="105" cy="145" rx="25" ry="18" fill="#fef3c7" opacity="0.6" />
          <circle cx="105" cy="85" r="34" fill="url(#foxBody)" />
          <ellipse cx="105" cy="96" rx="16" ry="10" fill="#fef3c7" />
          <g className="animate-ear-wiggle" transformOrigin="78 55">
            <polygon points="75,48 88,52 80,80" fill="url(#foxBody)" />
            <polygon points="78,52 86,55 82,74" fill="#1e293b" />
          </g>
          <g className="animate-ear-wiggle" transformOrigin="132 55" style={{ animationDelay: '0.12s' }}>
            <polygon points="125,48 112,52 120,80" fill="url(#foxBody)" />
            <polygon points="122,52 114,55 118,74" fill="#1e293b" />
          </g>
          <Eyes mood={mood} isSleeping={isSleeping} />
          <ellipse cx="105" cy="98" rx="4" ry="3" fill="#1e293b" />
          <Mouth mood={mood} isSleeping={isSleeping} />
          <ellipse cx="82" cy="168" rx="11" ry="8" fill="url(#foxBody)" />
          <ellipse cx="128" cy="168" rx="11" ry="8" fill="url(#foxBody)" />
        </g>
      )}
    </g>
  );
}

function PandaSprite({ mood, isSleeping }: { mood: PetMood; isSleeping?: boolean }) {
  return (
    <g className={isSleeping ? 'animate-lie-down' : 'animate-bounce-idle'}>
      {isSleeping ? (
        <g transform="translate(0, 20)">
          <ellipse cx="100" cy="150" rx="44" ry="22" fill="url(#pandaBody)" />
          <circle cx="100" cy="130" r="30" fill="url(#pandaBody)" />
          <ellipse cx="90" cy="138" rx="12" ry="8" fill="#1e293b" />
          <ellipse cx="110" cy="138" rx="12" ry="8" fill="#1e293b" />
          <path d="M80 130 Q90 125 100 130" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" />
          <path d="M100 130 Q110 125 120 130" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" />
          <ellipse cx="100" cy="140" rx="4" ry="3" fill="#1e293b" />
        </g>
      ) : (
        <g>
          <ellipse cx="100" cy="140" rx="40" ry="35" fill="url(#pandaBody)" />
          <circle cx="100" cy="85" r="36" fill="url(#pandaBody)" />
          <ellipse cx="78" cy="80" rx="15" ry="13" fill="#1e293b" />
          <ellipse cx="122" cy="80" rx="15" ry="13" fill="#1e293b" />
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
          <ellipse cx="100" cy="93" rx="5" ry="4" fill="#1e293b" />
          <Mouth mood={mood} isSleeping={isSleeping} />
          <circle cx="72" cy="52" r="11" fill="#1e293b" />
          <circle cx="128" cy="52" r="11" fill="#1e293b" />
          <ellipse cx="60" cy="130" rx="10" ry="16" fill="#1e293b" transform="rotate(20 60 130)" />
          <ellipse cx="140" cy="130" rx="10" ry="16" fill="#1e293b" transform="rotate(-20 140 130)" />
          <ellipse cx="80" cy="170" rx="12" ry="9" fill="#1e293b" />
          <ellipse cx="120" cy="170" rx="12" ry="9" fill="#1e293b" />
        </g>
      )}
    </g>
  );
}

function PenguinSprite({ mood, isSleeping }: { mood: PetMood; isSleeping?: boolean }) {
  return (
    <g className={isSleeping ? 'animate-lie-down' : 'animate-bounce-idle'}>
      {isSleeping ? (
        <g transform="translate(0, 15)">
          <ellipse cx="100" cy="148" rx="38" ry="22" fill="url(#penguinBody)" />
          <ellipse cx="100" cy="148" rx="24" ry="16" fill="url(#penguinBelly)" />
          <circle cx="100" cy="130" r="24" fill="url(#penguinBody)" />
          <ellipse cx="100" cy="130" rx="14" ry="10" fill="url(#penguinBelly)" />
          <path d="M88 128 Q94 124 100 128" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
          <path d="M100 128 Q106 124 112 128" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
        </g>
      ) : (
        <g>
          <ellipse cx="100" cy="135" rx="35" ry="45" fill="url(#penguinBody)" />
          <ellipse cx="100" cy="142" rx="24" ry="35" fill="url(#penguinBelly)" />
          <circle cx="100" cy="82" r="28" fill="url(#penguinBody)" />
          <ellipse cx="100" cy="82" rx="18" ry="14" fill="url(#penguinBelly)" />
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
          <polygon points="97,85 103,85 100,92" fill="#f97316" />
          {!isSleeping && mood !== 'SLEEPING' && mood === 'HAPPY' && (
            <path d="M96 90 Q100 94 104 90" fill="none" stroke="#f97316" strokeWidth="1.5" strokeLinecap="round" />
          )}
          <g className="animate-flipper" transformOrigin="65 120">
            <ellipse cx="65" cy="120" rx="8" ry="25" fill="url(#penguinBody)" transform="rotate(20 65 120)" />
          </g>
          <g className="animate-flipper" transformOrigin="135 120" style={{ animationDelay: '0.15s' }}>
            <ellipse cx="135" cy="120" rx="8" ry="25" fill="url(#penguinBody)" transform="rotate(-20 135 120)" />
          </g>
          <ellipse cx="85" cy="178" rx="12" ry="5" fill="#f97316" />
          <ellipse cx="115" cy="178" rx="12" ry="5" fill="#f97316" />
        </g>
      )}
    </g>
  );
}

function DragonSprite({ mood, isSleeping }: { mood: PetMood; isSleeping?: boolean }) {
  return (
    <g className={isSleeping ? 'animate-lie-down' : 'animate-bounce-idle'}>
      {isSleeping ? (
        <g transform="translate(0, 18)">
          <ellipse cx="100" cy="148" rx="42" ry="22" fill="url(#dragonBody)" />
          <circle cx="100" cy="130" r="26" fill="url(#dragonBody)" />
          <ellipse cx="100" cy="140" rx="12" ry="7" fill="#16a34a" />
          <path d="M78 130 Q88 125 98 130" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
          <path d="M102 130 Q112 125 122 130" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
          <polygon points="98,118 102,118 100,110" fill="#fbbf24" />
        </g>
      ) : (
        <g>
          <g className="animate-tail-wag" transformOrigin="55 145">
            <path d="M60 145 Q30 135 20 115 Q12 100 18 95" fill="none" stroke="url(#dragonBody)" strokeWidth="10" strokeLinecap="round" />
            <polygon points="18,95 12,88 22,90" fill="#fbbf24" />
          </g>
          <ellipse cx="100" cy="135" rx="35" ry="30" fill="url(#dragonBody)" />
          <ellipse cx="100" cy="142" rx="22" ry="18" fill="#86efac" opacity="0.4" />
          <circle cx="100" cy="88" r="30" fill="url(#dragonBody)" />
          <ellipse cx="100" cy="100" rx="14" ry="9" fill="#16a34a" />
          <polygon points="82,60 90,68 78,72" fill="#fbbf24" />
          <polygon points="118,60 110,68 122,72" fill="#fbbf24" />
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
          <g className="animate-wing" transformOrigin="68 100">
            <path d="M68 100 Q40 80 35 60 Q45 75 60 85 Q50 70 48 55 Q58 70 68 85 Z" fill="#16a34a" opacity="0.8" />
          </g>
          <g className="animate-wing" transformOrigin="132 100" style={{ animationDelay: '0.1s' }}>
            <path d="M132 100 Q160 80 165 60 Q155 75 140 85 Q150 70 152 55 Q142 70 132 85 Z" fill="#16a34a" opacity="0.8" />
          </g>
          <polygon points="100,50 97,42 103,42" fill="#fbbf24" />
          <polygon points="92,54 89,46 95,46" fill="#fbbf24" />
          <polygon points="108,54 105,46 111,46" fill="#fbbf24" />
          <Mouth mood={mood} isSleeping={isSleeping} />
          {mood === 'HAPPY' && !isSleeping && (
            <g className="animate-fire">
              <ellipse cx="100" cy="108" rx="4" ry="3" fill="#f97316" opacity="0.8" />
              <ellipse cx="100" cy="112" rx="2" ry="2" fill="#fbbf24" opacity="0.6" />
            </g>
          )}
          <ellipse cx="80" cy="162" rx="10" ry="8" fill="url(#dragonBody)" />
          <ellipse cx="120" cy="162" rx="10" ry="8" fill="url(#dragonBody)" />
        </g>
      )}
    </g>
  );
}

function UnicornSprite({ mood, isSleeping }: { mood: PetMood; isSleeping?: boolean }) {
  return (
    <g className={isSleeping ? 'animate-lie-down' : 'animate-bounce-idle'}>
      {isSleeping ? (
        <g transform="translate(0, 18)">
          <ellipse cx="100" cy="148" rx="40" ry="22" fill="url(#unicornBody)" />
          <circle cx="100" cy="130" r="26" fill="url(#unicornBody)" />
          <ellipse cx="100" cy="140" rx="12" ry="7" fill="#fce7f3" />
          <path d="M80 130 Q90 125 100 130" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
          <path d="M100 130 Q110 125 120 130" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
          <polygon points="98,108 102,108 100,98" fill="#fbbf24" />
        </g>
      ) : (
        <g>
          <ellipse cx="100" cy="135" rx="35" ry="28" fill="url(#unicornBody)" />
          <ellipse cx="100" cy="142" rx="22" ry="16" fill="#fce7f3" opacity="0.5" />
          <circle cx="100" cy="88" r="30" fill="url(#unicornBody)" />
          <ellipse cx="100" cy="100" rx="13" ry="9" fill="#fce7f3" />
          <g className="animate-horn-glow">
            <polygon points="98,58 102,58 100,35" fill="#fbbf24" />
            <polygon points="99,50 101,50 100,38" fill="white" opacity="0.5" />
          </g>
          <ellipse cx="80" cy="70" rx="6" ry="14" fill="#ec4899" transform="rotate(15 80 70)" />
          <ellipse cx="78" cy="85" rx="5" ry="12" fill="#8b5cf6" transform="rotate(10 78 85)" />
          <ellipse cx="76" cy="100" rx="5" ry="10" fill="#3b82f6" transform="rotate(8 76 100)" />
          <ellipse cx="55" cy="140" rx="5" ry="16" fill="#ec4899" transform="rotate(-20 55 140)" />
          <ellipse cx="52" cy="150" rx="4" ry="12" fill="#8b5cf6" transform="rotate(-15 52 150)" />
          <ellipse cx="50" cy="158" rx="4" ry="10" fill="#3b82f6" transform="rotate(-10 50 158)" />
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
              <line x1="83" y1="80" x2="82" y2="76" stroke="#1e293b" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="88" y1="78" x2="87" y2="74" stroke="#1e293b" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="117" y1="80" x2="118" y2="76" stroke="#1e293b" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="112" y1="78" x2="113" y2="74" stroke="#1e293b" strokeWidth="1.5" strokeLinecap="round" />
            </g>
          )}
          <Mouth mood={mood} isSleeping={isSleeping} />
          <ellipse cx="82" cy="162" rx="9" ry="7" fill="url(#unicornBody)" />
          <ellipse cx="118" cy="162" rx="9" ry="7" fill="url(#unicornBody)" />
        </g>
      )}
    </g>
  );
}

function DefaultSprite({ mood, isSleeping }: { mood: PetMood; isSleeping?: boolean }) {
  return (
    <g className={isSleeping ? 'animate-lie-down' : 'animate-bounce-idle'}>
      <ellipse cx="100" cy="140" rx="35" ry="30" fill="#86efac" />
      <circle cx="100" cy="85" r="30" fill="#86efac" />
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
    from { transform: translateY(0) rotate(0deg); }
    to { transform: translateY(20px) rotate(90deg); }
  }
  @keyframes wake-up {
    from { transform: translateY(20px) rotate(90deg); }
    to { transform: translateY(0) rotate(0deg); }
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
    0%, 100% { transform: rotate(-8deg); }
    50% { transform: rotate(12deg); }
  }
  @keyframes ear-wiggle {
    0%, 100% { transform: rotate(0deg); }
    25% { transform: rotate(-10deg); }
    75% { transform: rotate(6deg); }
  }
  @keyframes ear-flop {
    0%, 100% { transform: rotate(0deg); }
    50% { transform: rotate(10deg); }
  }
  @keyframes float-up {
    0% { transform: translateY(0) scale(0.8); opacity: 0; }
    20% { opacity: 1; transform: translateY(-8px) scale(1); }
    100% { transform: translateY(-28px) scale(1.2); opacity: 0; }
  }
  @keyframes tongue {
    0%, 100% { transform: scaleY(1); }
    50% { transform: scaleY(1.3); }
  }
  @keyframes wing {
    0%, 100% { transform: scaleX(1); }
    50% { transform: scaleX(0.6); }
  }
  @keyframes flipper {
    0%, 100% { transform: rotate(20deg); }
    50% { transform: rotate(35deg); }
  }
  @keyframes fire {
    0%, 100% { opacity: 0.8; transform: scale(1); }
    50% { opacity: 0.3; transform: scale(1.4); }
  }
  @keyframes horn-glow {
    0%, 100% { opacity: 1; filter: brightness(1); }
    50% { opacity: 0.6; filter: brightness(1.3); }
  }
  @keyframes tear {
    0%, 100% { transform: translateY(0); opacity: 1; }
    50% { transform: translateY(3px); opacity: 0.7; }
  }
  .animate-bounce-idle { animation: bounce-idle 2.5s ease-in-out infinite; }
  .animate-blink { animation: blink 4s ease-in-out infinite; transform-origin: center; }
  .animate-blink-slow { animation: blink-slow 6s ease-in-out infinite; transform-origin: center; }
  .animate-tail-wag { animation: tail-wag 1.2s ease-in-out infinite; transform-origin: bottom; }
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
  .animate-tear { animation: tear 2s ease-in-out infinite; }
`;
