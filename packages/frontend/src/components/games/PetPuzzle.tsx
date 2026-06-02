'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

const SIZE = 3;
const MAX_MOVES = 30;
const TIMER = 90;

const EMOJIS = ['🐱', '🐶', '🐰', '🐹', '🦊', '🐼', '🐧', '🐉'];

function isSolvable(grid: number[]): boolean {
  let inversions = 0;
  const flat = grid.filter(n => n !== 0);
  for (let i = 0; i < flat.length; i++) {
    for (let j = i + 1; j < flat.length; j++) {
      if (flat[i]! > flat[j]!) inversions++;
    }
  }
  const blankRow = Math.floor(grid.indexOf(0) / SIZE);
  if (SIZE % 2 === 1) return inversions % 2 === 0;
  return (inversions + blankRow) % 2 === 1;
}

function createPuzzle(): number[] {
  let grid = Array.from({ length: SIZE * SIZE - 1 }, (_, i) => i + 1);
  grid.push(0);
  do {
    for (let i = grid.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [grid[i], grid[j]] = [grid[j]!, grid[i]!];
    }
  } while (!isSolvable(grid));
  return grid;
}

interface PetPuzzleProps {
  onFinish: (score: number) => void;
}

export function PetPuzzle({ onFinish }: PetPuzzleProps) {
  const [grid, setGrid] = useState<number[]>(createPuzzle());
  const [moves, setMoves] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIMER);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [won, setWon] = useState(false);
  const [lastMoved, setLastMoved] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const finishTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isComplete = grid.every((n, i) => n === (i + 1) % (SIZE * SIZE));
  const lost = (timeLeft <= 0 || moves >= MAX_MOVES) && !isComplete && !finished;

  const finish = useCallback((win: boolean) => {
    setFinished(true);
    setWon(win);
    if (timerRef.current) clearInterval(timerRef.current);
    const score = win
      ? Math.max(10, Math.min(100, (MAX_MOVES - moves) * 3 + Math.max(0, TIMER - timeLeft) * 0.5))
      : 0;
    finishTimeoutRef.current = setTimeout(() => onFinish(score), 600);
  }, [moves, timeLeft, onFinish]);

  useEffect(() => {
    return () => { if (finishTimeoutRef.current) clearTimeout(finishTimeoutRef.current); };
  }, []);

  useEffect(() => {
    if (isComplete && !finished) finish(true);
  }, [isComplete, finished, finish]);

  useEffect(() => {
    if (lost) finish(false);
  }, [lost, finish]);

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const handleStart = () => {
    setStarted(true);
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) return 0;
        return t - 1;
      });
    }, 1000);
  };

  const moveTile = (index: number) => {
    if (finished || lost) return;
    const tile = grid[index]!;
    if (tile === 0) return;

    const blank = grid.indexOf(0);
    const row = Math.floor(index / SIZE);
    const col = index % SIZE;
    const blankRow = Math.floor(blank / SIZE);
    const blankCol = blank % SIZE;

    if (Math.abs(row - blankRow) + Math.abs(col - blankCol) !== 1) return;

    const next = [...grid];
    [next[index], next[blank]] = [next[blank]!, next[index]!];
    setGrid(next);
    setMoves(m => m + 1);
    setLastMoved(tile);
  };

  const reset = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setGrid(createPuzzle());
    setMoves(0);
    setTimeLeft(TIMER);
    setStarted(false);
    setFinished(false);
    setWon(false);
    setLastMoved(null);
  };

  const remainingMoves = MAX_MOVES - moves;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center justify-between w-full text-xs">
        <span className={`font-semibold ${remainingMoves <= 5 ? 'text-rose-500' : 'text-pastel-muted dark:text-slate-400'}`}>
          Mov: {moves}/{MAX_MOVES}
        </span>
        <span className={`font-bold ${timeLeft <= 15 ? 'text-rose-500 animate-pulse' : 'text-pastel-muted dark:text-slate-400'}`}>
          ⏱ {timeLeft}s
        </span>
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                remainingMoves > (i + 1) * 6 ? 'bg-green-400' : remainingMoves > 0 ? 'bg-amber-400' : 'bg-rose-400'
              }`}
            />
          ))}
        </div>
      </div>

      {!started ? (
        <div className="flex flex-col items-center gap-4 py-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center shadow-lg shadow-violet-300/30">
            <span className="text-3xl">🧩</span>
          </div>
          <p className="text-pastel-muted dark:text-slate-400 text-sm text-center max-w-xs">
            Ordena las mascotas en el orden correcto.<br />
            Tienes {MAX_MOVES} movimientos y {TIMER} segundos.
          </p>
          <button
            onClick={handleStart}
            className="px-6 py-3 bg-gradient-to-r from-violet-400 to-indigo-500 hover:brightness-110 text-white rounded-2xl font-semibold shadow-lg shadow-violet-400/25 active:scale-95 transition-all"
          >
            ¡Comenzar!
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3">
          <div
            className="grid gap-1.5 bg-slate-100 dark:bg-slate-800/50 p-2 rounded-2xl shadow-inner"
            style={{ gridTemplateColumns: `repeat(${SIZE}, 1fr)` }}
          >
            {grid.map((n, i) => {
              const isLast = n !== 0 && n === lastMoved;
              return (
                <button
                  key={i}
                  onClick={() => moveTile(i)}
                  disabled={finished || n === 0}
                  className={`w-14 h-14 md:w-16 md:h-16 rounded-xl flex items-center justify-center text-xl transition-all duration-200 select-none ${
                    n === 0
                      ? 'bg-transparent'
                      : isLast
                        ? 'bg-gradient-to-br from-green-300 to-emerald-400 scale-95 ring-2 ring-white/50 shadow-lg animate-bounce-in'
                        : finished && won
                          ? 'bg-gradient-to-br from-pastel-purple/60 to-pastel-pink/60 shadow-md'
                          : 'bg-gradient-to-br from-pastel-purple to-pastel-pink text-white shadow-md hover:brightness-110 hover:scale-105 active:scale-95'
                  }`}
                >
                  {n !== 0 && (EMOJIS[n - 1] ?? n)}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={reset}
              className="text-xs px-4 py-2 bg-pastel-lavender/30 dark:bg-slate-700/50 hover:bg-pastel-lavender/50 dark:hover:bg-slate-600/50 text-pastel-foreground dark:text-slate-200 rounded-xl transition-all active:scale-95 font-medium"
            >
              🔄 Reiniciar
            </button>
            {finished && (
              <span className={`text-sm font-bold ${won ? 'text-green-500' : 'text-rose-500'} animate-bounce-in`}>
                {won ? '🎉 ¡Completado!' : '💔 Has perdido'}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
