'use client';

import { useState, useEffect, useRef } from 'react';

const GRAVITY = 0.45;
const JUMP = -6.5;
const PIPE_WIDTH = 14;
const PIPE_GAP = 30;
const PIPE_SPEED = 2.2;
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
  const [renderScore, setRenderScore] = useState(0);
  const [renderPetY, setRenderPetY] = useState(50);
  const [renderPetRotate, setRenderPetRotate] = useState(0);
  const [renderPipes, setRenderPipes] = useState<Pipe[]>([]);

  const petYRef = useRef(50);
  const petVelRef = useRef(0);
  const pipesRef = useRef<Pipe[]>([]);
  const scoreRef = useRef(0);
  const finishedRef = useRef(false);
  const frameRef = useRef<ReturnType<typeof requestAnimationFrame>>();
  const pipeCounterRef = useRef(0);

  const syncRender = () => {
    setRenderPetY(petYRef.current);
    setRenderPetRotate(Math.min(25, Math.max(-25, petVelRef.current * 3)));
    setRenderPipes([...pipesRef.current]);
    setRenderScore(scoreRef.current);
  };

  const checkCollision = (pipes: Pipe[], py: number): boolean => {
    const petLeft = 46;
    const petRight = 46 + PET_SIZE;
    const petTop = py - PET_SIZE / 2;
    const petBottom = py + PET_SIZE / 2;
    for (const pipe of pipes) {
      if (pipe.x > petRight || pipe.x + PIPE_WIDTH < petLeft) continue;
      if (petTop < pipe.gapY || petBottom > pipe.gapY + PIPE_GAP) return true;
    }
    return false;
  };

  useEffect(() => {
    if (!started || finished) return;
    finishedRef.current = false;
    petYRef.current = 50;
    petVelRef.current = 0;
    pipesRef.current = [];
    scoreRef.current = 0;
    pipeCounterRef.current = 0;
    syncRender();

    const tick = () => {
      frameRef.current = requestAnimationFrame(tick);

      petVelRef.current += GRAVITY;
      petYRef.current += petVelRef.current;

      if (petYRef.current <= 2) {
        petYRef.current = 2;
        petVelRef.current = 0;
      }

      if (petYRef.current >= GAME_HEIGHT - GROUND_HEIGHT - PET_SIZE / 2) {
        petYRef.current = GAME_HEIGHT - GROUND_HEIGHT - PET_SIZE / 2;
        if (!finishedRef.current) {
          finishedRef.current = true;
          syncRender();
          setFinished(true);
        }
        return;
      }

      const pipes = pipesRef.current;
      for (let i = pipes.length - 1; i >= 0; i--) {
        pipes[i]!.x -= PIPE_SPEED;
        if (!pipes[i]!.scored && pipes[i]!.x + PIPE_WIDTH < 46) {
          pipes[i]!.scored = true;
          scoreRef.current++;
        }
        if (pipes[i]!.x < -PIPE_WIDTH) {
          pipes.splice(i, 1);
        }
      }

      if (checkCollision(pipes, petYRef.current)) {
        if (!finishedRef.current) {
          finishedRef.current = true;
          syncRender();
          setFinished(true);
        }
        return;
      }

      pipeCounterRef.current++;
      if (pipeCounterRef.current % 35 === 0) {
        const gapY = 18 + Math.random() * 36;
        pipes.push({ x: 105, gapY, scored: false });
      }

      syncRender();
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [started, finished]);

  useEffect(() => {
    if (finished && started) {
      const timer = setTimeout(() => onFinish(scoreRef.current), 600);
      return () => clearTimeout(timer);
    }
  }, [finished, started, onFinish]);

  const jump = () => {
    if (finished || !started) return;
    petVelRef.current = JUMP;
  };

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
          <div className="absolute inset-0 bg-gradient-to-b from-sky-200/40 to-transparent dark:from-sky-900/20 dark:to-transparent pointer-events-none" />

          <div className="absolute top-4 left-[15%] text-3xl opacity-30 dark:opacity-10 pointer-events-none animate-float-slow">☁️</div>
          <div className="absolute top-12 left-[55%] text-2xl opacity-20 dark:opacity-10 pointer-events-none animate-float-slow" style={{ animationDelay: '1.5s' }}>☁️</div>
          <div className="absolute top-6 left-[80%] text-3xl opacity-25 dark:opacity-10 pointer-events-none animate-float-slow" style={{ animationDelay: '0.8s' }}>☁️</div>

          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm px-4 py-1 rounded-full shadow-md border border-white/30 dark:border-slate-700/50">
            <span className="text-lg font-bold text-pastel-foreground dark:text-white">{renderScore}</span>
          </div>

          {renderPipes.map((pipe, i) => (
            <div key={i} className="absolute" style={{ left: `${pipe.x}%`, width: `${PIPE_WIDTH}%`, top: 0, bottom: `${GROUND_HEIGHT}%` }}>
              <div className="absolute inset-x-0 bg-gradient-to-b from-green-500 to-green-400 dark:from-green-700 dark:to-green-600 rounded-b-lg border-x-[3px] border-green-600 dark:border-green-800" style={{ height: `${pipe.gapY}%` }} />
              <div className="absolute bg-green-600 dark:bg-green-800 rounded-lg border-2 border-green-700 dark:border-green-900" style={{ width: '120%', left: '-10%', height: '8%', top: `${pipe.gapY}%`, transform: 'translateY(-50%)' }} />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-green-500 to-green-400 dark:from-green-700 dark:to-green-600 rounded-t-lg border-x-[3px] border-green-600 dark:border-green-800" style={{ height: `${GAME_HEIGHT - GROUND_HEIGHT - pipe.gapY - PIPE_GAP}%`, top: `${pipe.gapY + PIPE_GAP}%` }} />
              <div className="absolute bg-green-600 dark:bg-green-800 rounded-lg border-2 border-green-700 dark:border-green-900" style={{ width: '120%', left: '-10%', height: '8%', top: `${pipe.gapY + PIPE_GAP}%`, transform: 'translateY(-50%)' }} />
            </div>
          ))}

          <div style={{ height: `${GROUND_HEIGHT}%` }} className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-green-600 to-green-500 dark:from-green-800 dark:to-green-700 border-t-2 border-green-700 dark:border-green-900 pointer-events-none">
            <div className="absolute inset-0 opacity-20" style={{
              backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 8px, rgba(0,0,0,0.1) 8px, rgba(0,0,0,0.1) 10px)',
            }} />
          </div>

          <div
            className="absolute z-10"
            style={{
              left: '46%',
              top: `${renderPetY}%`,
              transform: `translate(-50%, -50%) rotate(${renderPetRotate}deg)`,
              transition: 'none',
            }}
          >
            <span className="text-3xl drop-shadow-lg">🐦</span>
          </div>

          {finished && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-20">
              <div className="text-center space-y-2 animate-bounce-in">
                <p className="text-4xl">💥</p>
                <p className="text-lg font-bold text-white">¡Chocaste!</p>
                <p className="text-2xl font-bold text-white">{renderScore} pts</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
