'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

const GRAVITY = 0.5;
const JUMP = -7;
const PIPE_WIDTH = 14;
const PIPE_GAP = 32;
const PIPE_SPEED = 2.5;
const GAME_WIDTH = 100;
const GAME_HEIGHT = 100;
const PET_SIZE = 7;
const GROUND_HEIGHT = 8;

interface Pipe {
  x: number;
  gapY: number;
  scored: boolean;
}

interface FlappyPetProps {
  onFinish: (score: number) => void;
}

export function FlappyPet({ onFinish }: FlappyPetProps) {
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [petY, setPetY] = useState(50);
  const [petVelocity, setPetVelocity] = useState(0);
  const [pipes, setPipes] = useState<Pipe[]>([]);
  const pipeIdRef = useRef(0);
  const frameRef = useRef<ReturnType<typeof requestAnimationFrame>>();
  const finishedRef = useRef(false);
  const scoreRef = useRef(0);

  const jump = useCallback(() => {
    if (finished || !started) return;
    setPetVelocity(JUMP);
  }, [finished, started]);

  useEffect(() => {
    if (!started || finished) return;
    finishedRef.current = false;
    scoreRef.current = 0;

    let frameCount = 0;
    const tick = () => {
      frameRef.current = requestAnimationFrame(tick);
      frameCount++;

      if (frameCount % 2 !== 0) return;

      setPetY(prev => {
        const next = prev + petVelocity;
        if (next <= 0) {
          setPetVelocity(0);
          return 2;
        }
        if (next >= GAME_HEIGHT - GROUND_HEIGHT - PET_SIZE / 2) {
          if (!finishedRef.current) {
            finishedRef.current = true;
            setFinished(true);
          }
          return GAME_HEIGHT - GROUND_HEIGHT - PET_SIZE / 2;
        }
        return next;
      });

      setPetVelocity(prev => prev + GRAVITY);

      setPipes(prev => {
        let next = prev.map(p => ({ ...p, x: p.x - PIPE_SPEED }));
        next = next.filter(p => p.x > -PIPE_WIDTH);

        for (const p of next) {
          if (!p.scored && p.x + PIPE_WIDTH / 2 < 50 - PET_SIZE / 2) {
            p.scored = true;
            scoreRef.current += 1;
            setScore(scoreRef.current);
          }
        }

        return next;
      });

      if (frameCount % 60 === 0) {
        const gapY = 20 + Math.random() * 35;
        setPipes(prev => [...prev, { x: GAME_WIDTH + 5, gapY, scored: false }]);
      }
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [started, finished]);

  useEffect(() => {
    if (finished && started) {
      const timer = setTimeout(() => onFinish(score), 600);
      return () => clearTimeout(timer);
    }
  }, [finished, started, score, onFinish]);

  useEffect(() => {
    if (!pipes.length || !started || finished) return;
    const petLeft = 50 - PET_SIZE / 2;
    const petRight = 50 + PET_SIZE / 2;
    const petTop = petY - PET_SIZE / 2;
    const petBottom = petY + PET_SIZE / 2;

    for (const pipe of pipes) {
      if (pipe.x > petRight || pipe.x + PIPE_WIDTH < petLeft) continue;
      if (petTop < pipe.gapY || petBottom > pipe.gapY + PIPE_GAP) {
        if (!finishedRef.current) {
          finishedRef.current = true;
          setFinished(true);
        }
        break;
      }
    }
  }, [pipes, petY, started, finished]);

  return (
    <div className="flex flex-col items-center gap-3">
      {!started ? (
        <div className="flex flex-col items-center gap-4 py-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-400 to-cyan-500 flex items-center justify-center shadow-lg shadow-sky-300/30">
            <span className="text-3xl">🐦</span>
          </div>
          <p className="text-pastel-muted dark:text-slate-400 text-sm text-center max-w-xs">
            Toca la pantalla para volar.<br />
            Evita los obstáculos y consigue la mayor distancia.
          </p>
          <button
            onClick={() => setStarted(true)}
            className="px-6 py-3 bg-gradient-to-r from-sky-400 to-cyan-500 hover:brightness-110 text-white rounded-2xl font-semibold shadow-lg shadow-sky-400/25 active:scale-95 transition-all"
          >
            ¡Comenzar!
          </button>
        </div>
      ) : (
        <div
          onClick={jump}
          className="relative w-full h-72 md:h-80 bg-gradient-to-b from-sky-100 via-sky-50 to-white dark:from-slate-800 dark:via-slate-800/80 dark:to-slate-900 rounded-2xl overflow-hidden border border-pastel-border/20 dark:border-slate-700/50 cursor-pointer select-none"
        >
          {/* Sky gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-sky-200/40 to-transparent dark:from-sky-900/20 dark:to-transparent pointer-events-none" />

          {/* Clouds */}
          <div className="absolute top-4 left-[15%] text-3xl opacity-30 dark:opacity-10 pointer-events-none animate-float-slow">☁️</div>
          <div className="absolute top-12 left-[55%] text-2xl opacity-20 dark:opacity-10 pointer-events-none animate-float-slow" style={{ animationDelay: '1.5s' }}>☁️</div>
          <div className="absolute top-6 left-[80%] text-3xl opacity-25 dark:opacity-10 pointer-events-none animate-float-slow" style={{ animationDelay: '0.8s' }}>☁️</div>

          {/* Score */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm px-4 py-1 rounded-full shadow-md border border-white/30 dark:border-slate-700/50">
            <span className="text-lg font-bold text-pastel-foreground dark:text-white">{score}</span>
          </div>

          {/* Pipes */}
          {pipes.map(pipe => (
            <div key={pipe.x + pipe.gapY} className="absolute" style={{ left: `${pipe.x}%`, width: `${PIPE_WIDTH}%`, top: 0, bottom: `${GROUND_HEIGHT}%` }}>
              {/* Top pipe */}
              <div className="absolute inset-x-0 bg-gradient-to-b from-green-500 to-green-400 dark:from-green-700 dark:to-green-600 rounded-b-lg border-x-[3px] border-green-600 dark:border-green-800" style={{ height: `${pipe.gapY}%` }} />
              {/* Pipe cap top */}
              <div className="absolute bg-green-600 dark:bg-green-800 rounded-lg border-2 border-green-700 dark:border-green-900" style={{ width: '120%', left: '-10%', height: '8%', top: `${pipe.gapY}%`, transform: 'translateY(-50%)' }} />

              {/* Bottom pipe */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-green-500 to-green-400 dark:from-green-700 dark:to-green-600 rounded-t-lg border-x-[3px] border-green-600 dark:border-green-800" style={{ height: `${GAME_HEIGHT - GROUND_HEIGHT - pipe.gapY - PIPE_GAP}%`, top: `${pipe.gapY + PIPE_GAP}%` }} />
              {/* Pipe cap bottom */}
              <div className="absolute bg-green-600 dark:bg-green-800 rounded-lg border-2 border-green-700 dark:border-green-900" style={{ width: '120%', left: '-10%', height: '8%', top: `${pipe.gapY + PIPE_GAP}%`, transform: 'translateY(-50%)' }} />
            </div>
          ))}

          {/* Ground */}
          <div style={{ height: `${GROUND_HEIGHT}%` }} className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-green-600 to-green-500 dark:from-green-800 dark:to-green-700 border-t-2 border-green-700 dark:border-green-900 pointer-events-none">
            <div className="absolute inset-0 opacity-20" style={{
              backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 8px, rgba(0,0,0,0.1) 8px, rgba(0,0,0,0.1) 10px)',
            }} />
          </div>

          {/* Pet */}
          <div
            className="absolute z-10 transition-transform"
            style={{
              left: '46%',
              top: `${petY}%`,
              transform: `translate(-50%, -50%) rotate(${Math.min(30, petVelocity * 3)}deg)`,
            }}
          >
            <span className="text-3xl drop-shadow-lg">🐦</span>
          </div>

          {finished && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-20">
              <div className="text-center space-y-2 animate-bounce-in">
                <p className="text-4xl">💥</p>
                <p className="text-lg font-bold text-white">¡Chocaste!</p>
                <p className="text-2xl font-bold text-white">{score} pts</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
