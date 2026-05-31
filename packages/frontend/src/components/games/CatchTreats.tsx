'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface FallingItem {
  id: number;
  x: number;
  y: number;
  emoji: string;
  points: number;
}

const FOODS = [
  { emoji: '🍎', points: 10 },
  { emoji: '🍕', points: 15 },
  { emoji: '🧁', points: 20 },
  { emoji: '🍦', points: 25 },
  { emoji: '🍗', points: 15 },
  { emoji: '🥕', points: 10 },
  { emoji: '🌟', points: 50 },
];

interface CatchTreatsProps {
  onFinish: (score: number) => void;
}

export function CatchTreats({ onFinish }: CatchTreatsProps) {
  const [items, setItems] = useState<FallingItem[]>([]);
  const [score, setScore] = useState(0);
  const [caught, setCaught] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(0);

  const spawnItem = useCallback(() => {
    const food = FOODS[Math.floor(Math.random() * FOODS.length)]!;
    const x = Math.random() * 85 + 5;
    const newItem: FallingItem = {
      id: idRef.current++,
      x,
      y: -5,
      emoji: food.emoji,
      points: food.points,
    };
    setItems(prev => [...prev, newItem]);
  }, []);

  useEffect(() => {
    if (!started || finished) return;

    const spawnInterval = setInterval(() => {
      if (Math.random() < 0.6) spawnItem();
    }, 400);

    const moveInterval = setInterval(() => {
      setItems(prev => {
        const next = prev
          .map(item => ({ ...item, y: item.y + 1.5 }))
          .filter(item => item.y < 100);
        return next;
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
  }, [started, finished, spawnItem]);

  useEffect(() => {
    if (finished) {
      const finalScore = Math.min(200, score);
      setTimeout(() => onFinish(finalScore), 500);
    }
  }, [finished, score, onFinish]);

  const handleCatch = (id: number) => {
    if (finished) return;
    const item = items.find(i => i.id === id);
    if (!item) return;
    setItems(prev => prev.filter(i => i.id !== id));
    setScore(s => s + item.points);
    setCaught(c => c + 1);
  };

  return (
    <div className="flex flex-col items-center gap-3">
      {/* HUD */}
      <div className="flex items-center justify-between w-full">
        <span className="text-sm text-slate-400">🎯 {caught}</span>
        <span className="text-sm font-bold text-yellow-400">⭐ {score}</span>
        <span className={`text-sm font-bold ${timeLeft <= 5 ? 'text-red-400 animate-pulse' : 'text-slate-400'}`}>
          ⏱ {timeLeft}s
        </span>
      </div>

      {!started ? (
        <div className="flex flex-col items-center gap-4 py-8">
          <span className="text-5xl">🍕</span>
          <p className="text-slate-400 text-sm text-center">¡Atrapa la mayor cantidad de comida en 30 segundos!</p>
          <button
            onClick={() => setStarted(true)}
            className="px-6 py-3 bg-green-600 hover:bg-green-500 rounded-xl font-medium transition-colors"
          >
            ¡Comenzar!
          </button>
        </div>
      ) : (
        /* Game area */
        <div
          ref={containerRef}
          className="relative w-full h-72 md:h-80 bg-slate-900/50 rounded-xl overflow-hidden border border-slate-700/50"
        >
          {/* Ground line */}
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-green-900/30 to-transparent" />

          {/* Items */}
          {items.map(item => (
            <button
              key={item.id}
              onClick={() => handleCatch(item.id)}
              className="absolute text-2xl md:text-3xl transition-transform hover:scale-110 cursor-pointer select-none"
              style={{
                left: `${item.x}%`,
                top: `${item.y}%`,
                transform: 'translate(-50%, -50%)',
                filter: item.y > 80 ? 'opacity(0.5)' : 'none',
              }}
            >
              {item.emoji}
            </button>
          ))}

          {finished && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
              <div className="text-center space-y-2">
                <p className="text-2xl">🏆</p>
                <p className="text-lg font-bold">¡Tiempo!</p>
                <p className="text-yellow-400 font-medium">⭐ {score} puntos</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
