'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface FallingItem {
  id: number;
  x: number;
  y: number;
  emoji: string;
  points: number;
  bad: boolean;
}

const GOOD = [
  { emoji: '🍎', points: 10 },
  { emoji: '🍕', points: 15 },
  { emoji: '🧁', points: 20 },
  { emoji: '🍦', points: 25 },
  { emoji: '🍗', points: 15 },
  { emoji: '🥕', points: 10 },
  { emoji: '🌟', points: 50 },
  { emoji: '🍩', points: 18 },
  { emoji: '🍇', points: 12 },
];

const BAD = [
  { emoji: '💣', points: -30 },
  { emoji: '🗑️', points: -15 },
  { emoji: '🕷️', points: -20 },
];

const MAX_LIVES = 3;
const GAME_DURATION = 30;

interface CatchTreatsProps {
  onFinish: (score: number) => void;
}

export function CatchTreats({ onFinish }: CatchTreatsProps) {
  const [items, setItems] = useState<FallingItem[]>([]);
  const [score, setScore] = useState(0);
  const [caught, setCaught] = useState(0);
  const [missed, setMissed] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [combo, setCombo] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(0);
  const spawnRateRef = useRef(500);

  const spawnItem = useCallback(() => {
    const isBad = Math.random() < 0.2 + (GAME_DURATION - timeLeft) * 0.005;
    const pool = isBad ? BAD : GOOD;
    const item = pool[Math.floor(Math.random() * pool.length)]!;
    const x = Math.random() * 85 + 5;
    const newItem: FallingItem = {
      id: idRef.current++,
      x,
      y: -8,
      emoji: item.emoji,
      points: item.points,
      bad: isBad,
    };
    setItems(prev => [...prev, newItem]);
  }, [timeLeft]);

  useEffect(() => {
    if (!started || finished) return;

    spawnRateRef.current = Math.max(200, 500 - (GAME_DURATION - timeLeft) * 10);

    const spawnInterval = setInterval(() => {
      if (Math.random() < 0.65) spawnItem();
    }, spawnRateRef.current);

    const moveInterval = setInterval(() => {
      setItems(prev => {
        const next = prev
          .map(item => ({ ...item, y: item.y + (item.bad ? 1.8 : 1.5) }));

        const hitGround: FallingItem[] = [];
        const filtered = next.filter(item => {
          if (item.y >= 95) {
            if (!item.bad) hitGround.push(item);
            return false;
          }
          return true;
        });

        if (hitGround.length > 0) {
          setMissed(m => {
            const newMissed = m + hitGround.length;
            if (newMissed >= MAX_LIVES) setFinished(true);
            return newMissed;
          });
          setCombo(0);
        }

        return filtered;
      });
    }, 50);

    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          setFinished(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => {
      clearInterval(spawnInterval);
      clearInterval(moveInterval);
      clearInterval(timer);
    };
  }, [started, finished, spawnItem, timeLeft]);

  useEffect(() => {
    if (finished && started) {
      const finalScore = Math.min(200, Math.max(0, score));
      setTimeout(() => onFinish(finalScore), 600);
    }
  }, [finished, started, score, onFinish]);

  const handleCatch = (id: number) => {
    if (finished) return;
    const item = items.find(i => i.id === id);
    if (!item) return;

    setItems(prev => prev.filter(i => i.id !== id));
    setCombo(c => (item.bad ? 0 : c + 1));

    if (item.bad) {
      setScore(s => Math.max(0, s + item.points));
    } else {
      const comboBonus = Math.min(combo, 10);
      setScore(s => s + item.points + comboBonus);
    }
    setCaught(c => c + 1);
  };

  const lives = MAX_LIVES - missed;

  return (
    <div className="flex flex-col items-center gap-3">
      {/* HUD */}
      <div className="flex items-center justify-between w-full text-xs">
        <div className="flex gap-0.5">
          {Array.from({ length: MAX_LIVES }).map((_, i) => (
            <span key={i} className={i < lives ? '' : 'opacity-30'}>
              {i < lives ? '❤️' : '🖤'}
            </span>
          ))}
        </div>
        <span className="font-bold text-yellow-400">⭐ {score}</span>
        <span className={`font-bold ${timeLeft <= 5 ? 'text-red-400 animate-pulse' : 'text-slate-400'}`}>
          ⏱ {timeLeft}s
        </span>
      </div>

      {combo >= 3 && (
        <div className="text-xs text-yellow-400 font-bold animate-bounce-in">
          🔥 Combo x{combo}!
        </div>
      )}

      {!started ? (
        <div className="flex flex-col items-center gap-4 py-8">
          <span className="text-5xl">🍕</span>
          <p className="text-slate-400 text-sm text-center max-w-xs">
            ¡Atrapa comida 🍎, evita bombas 💣!<br />
            Si dejas caer 3 items, pierdes.
          </p>
          <button
            onClick={() => setStarted(true)}
            className="px-6 py-3 bg-green-600 hover:bg-green-500 rounded-xl font-medium transition-colors"
          >
            ¡Comenzar!
          </button>
        </div>
      ) : (
        <div
          ref={containerRef}
          className="relative w-full h-72 md:h-80 bg-slate-900/50 rounded-xl overflow-hidden border border-slate-700/50 cursor-pointer select-none"
        >
          {/* Danger zone indicator */}
          <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-red-900/20 to-transparent pointer-events-none" />

          {items.map(item => (
            <button
              key={item.id}
              onPointerDown={() => handleCatch(item.id)}
              className={`absolute text-2xl md:text-3xl transition-transform active:scale-125 pointer-events-auto ${
                item.bad ? 'active:rotate-12' : ''
              }`}
              style={{
                left: `${item.x}%`,
                top: `${item.y}%`,
                transform: 'translate(-50%, -50%)',
                filter: item.y > 75 ? 'opacity(0.4)' : 'none',
              }}
            >
              {item.emoji}
            </button>
          ))}

          {/* Lost lives flash */}
          {missed > 0 && (
            <div className="absolute top-2 right-2 text-xs text-red-400 font-bold animate-float-up pointer-events-none">
              ❌
            </div>
          )}

          {finished && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm">
              <div className="text-center space-y-2 animate-bounce-in">
                <p className="text-4xl">{missed >= MAX_LIVES ? '💔' : '⏰'}</p>
                <p className="text-lg font-bold">{missed >= MAX_LIVES ? '¡Perdiste!' : '¡Tiempo!'}</p>
                <p className="text-yellow-400 font-medium text-lg">⭐ {Math.max(0, score)} pts</p>
                <p className="text-xs text-slate-400">Atrapados: {caught} | Fallados: {missed}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
