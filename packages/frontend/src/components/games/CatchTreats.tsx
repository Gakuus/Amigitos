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
  const finishedRef = useRef(false);
  const timeLeftRef = useRef(GAME_DURATION);

  const spawnItem = useCallback(() => {
    const elapsed = GAME_DURATION - timeLeftRef.current;
    const isBad = Math.random() < 0.2 + elapsed * 0.005;
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
  }, []);

  useEffect(() => {
    if (!started || finished) return;
    finishedRef.current = false;

    const spawnRate = () => Math.max(200, 500 - (GAME_DURATION - timeLeftRef.current) * 10);

    const spawnInterval = setInterval(() => {
      if (Math.random() < 0.65) spawnItem();
    }, spawnRate());

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
            if (newMissed >= MAX_LIVES && !finishedRef.current) {
              finishedRef.current = true;
              setFinished(true);
            }
            return newMissed;
          });
          setCombo(0);
        }

        return filtered;
      });
    }, 50);

    const timer = setInterval(() => {
      setTimeLeft(t => {
        const next = t - 1;
        timeLeftRef.current = next;
        if (next <= 0 && !finishedRef.current) {
          finishedRef.current = true;
          setFinished(true);
        }
        return next;
      });
    }, 1000);

    return () => {
      clearInterval(spawnInterval);
      clearInterval(moveInterval);
      clearInterval(timer);
    };
  }, [started, finished, spawnItem]);

  useEffect(() => {
    if (finished && started) {
      const finalScore = Math.min(200, Math.max(0, score));
      const timer = setTimeout(() => onFinish(finalScore), 600);
      return () => clearTimeout(timer);
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
            <span key={i} className={`text-sm transition-all duration-300 ${i < lives ? '' : 'grayscale opacity-30'}`}>
              {i < lives ? '❤️' : '🖤'}
            </span>
          ))}
        </div>
        <span className="font-bold text-amber-500">⭐ {score}</span>
        <span className={`font-bold ${timeLeft <= 5 ? 'text-rose-500 animate-pulse' : 'text-pastel-muted dark:text-slate-400'}`}>
          ⏱ {timeLeft}s
        </span>
      </div>

      {combo >= 3 && (
        <div className="text-xs text-amber-500 font-bold animate-bounce-in bg-amber-50 dark:bg-amber-900/20 px-3 py-1 rounded-full">
          🔥 Combo x{combo}!
        </div>
      )}

      {!started ? (
        <div className="flex flex-col items-center gap-4 py-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-300/30">
            <span className="text-3xl">🍕</span>
          </div>
          <p className="text-pastel-muted dark:text-slate-400 text-sm text-center max-w-xs">
            ¡Atrapa comida 🍎, evita bombas 💣!<br />
            Si dejas caer 3 alimentos buenos, pierdes.
          </p>
          <button
            onClick={() => setStarted(true)}
            className="px-6 py-3 bg-gradient-to-r from-orange-400 to-amber-500 hover:brightness-110 text-white rounded-2xl font-semibold shadow-lg shadow-orange-400/25 active:scale-95 transition-all"
          >
            ¡Comenzar!
          </button>
        </div>
      ) : (
        <div
          ref={containerRef}
          className="relative w-full h-72 md:h-80 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-2xl overflow-hidden border border-pastel-border/20 dark:border-slate-700/50 cursor-pointer select-none"
        >
          {/* Danger zone indicator */}
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-rose-500/10 to-transparent pointer-events-none" />

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

          {finished && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
              <div className="text-center space-y-2 animate-bounce-in bg-white/80 dark:bg-slate-800/80 rounded-2xl p-6 shadow-xl">
                <p className="text-4xl">{missed >= MAX_LIVES ? '💔' : '⏰'}</p>
                <p className="text-lg font-bold text-pastel-foreground dark:text-white">{missed >= MAX_LIVES ? '¡Perdiste!' : '¡Tiempo!'}</p>
                <p className="text-amber-500 font-bold text-lg">⭐ {Math.max(0, score)} pts</p>
                <p className="text-xs text-pastel-muted dark:text-slate-400">Atrapados: {caught} | Fallados: {missed}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
