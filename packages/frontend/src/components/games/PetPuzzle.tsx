'use client';

import { useState, useEffect, useCallback } from 'react';

const GRID = 3;
const TILES = GRID * GRID;

function createPuzzle(): number[] {
  const arr: (number | undefined)[] = Array.from({ length: TILES }, (_, i) => i);
  do {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = arr[i]!;
      arr[i] = arr[j];
      arr[j] = temp;
    }
  } while (!isSolvable(arr) || isSolved(arr));
  return arr.map(v => v!);
}

function isSolvable(arr: (number | undefined)[]): boolean {
  let inv = 0;
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i]! && arr[j]! && arr[i]! > arr[j]!) inv++;
    }
  }
  return inv % 2 === 0;
}

function isSolved(arr: (number | undefined)[]): boolean {
  return arr.every((v, i) => v === i);
}

const BG_EMOJIS = ['🐱', '🐶', '🐰', '🐹', '🦊', '🐼', '🐧', '🐉', ' '];

const EMOJI_GRID = [
  ['🐱', '🐶', '🐰'],
  ['🐹', '🦊', '🐼'],
  ['🐧', '🐉', ' '],
];

function getTileEmoji(index: number): string {
  if (index === 8) return ' ';
  const row = Math.floor(index / GRID);
  const col = index % GRID;
  return EMOJI_GRID[row]![col]!;
}

interface PetPuzzleProps {
  onFinish: (score: number) => void;
}

export function PetPuzzle({ onFinish }: PetPuzzleProps) {
  const [tiles, setTiles] = useState<number[]>(createPuzzle);
  const [moves, setMoves] = useState(0);
  const [startTime] = useState(Date.now());
  const [finished, setFinished] = useState(false);
  const [started, setStarted] = useState(false);

  const emptyIndex = tiles.indexOf(TILES - 1);

  const canMove = useCallback((idx: number) => {
    const emptyRow = Math.floor(emptyIndex / GRID);
    const emptyCol = emptyIndex % GRID;
    const tileRow = Math.floor(idx / GRID);
    const tileCol = idx % GRID;
    const dr = Math.abs(emptyRow - tileRow);
    const dc = Math.abs(emptyCol - tileCol);
    return (dr === 1 && dc === 0) || (dr === 0 && dc === 1);
  }, [emptyIndex]);

  const handleMove = useCallback((idx: number) => {
    if (finished || !started) return;
    if (!canMove(idx)) return;

    setTiles(prev => {
      const next: number[] = [...prev];
      const temp = next[idx]!;
      next[idx] = next[emptyIndex]!;
      next[emptyIndex] = temp;
      return next;
    });
    setMoves(m => m + 1);
  }, [finished, started, canMove, emptyIndex]);

  useEffect(() => {
    if (started && isSolved(tiles) && !finished) {
      setFinished(true);
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const score = Math.max(0, 100 - moves * 2 - elapsed);
      setTimeout(() => onFinish(score), 500);
    }
  }, [tiles, finished, moves, startTime, started, onFinish]);

  const reset = () => {
    setTiles(createPuzzle());
    setMoves(0);
    setFinished(false);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center justify-between w-full">
        <span className="text-sm text-slate-400">Movimientos: {moves}</span>
        <button
          onClick={reset}
          className="text-xs px-2 py-1 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
        >
          🔄 Reiniciar
        </button>
      </div>

      {!started ? (
        <div className="flex flex-col items-center gap-4 py-8">
          <span className="text-5xl">🧩</span>
          <p className="text-slate-400 text-sm text-center">Ordena las mascotas en el menor tiempo posible</p>
          <button
            onClick={() => setStarted(true)}
            className="px-6 py-3 bg-green-600 hover:bg-green-500 rounded-xl font-medium transition-colors"
          >
            ¡Comenzar!
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-1.5 bg-slate-700/50 p-2 rounded-xl">
          {tiles.map((tile, idx) => (
            <button
              key={idx}
              onClick={() => handleMove(idx)}
              disabled={tile === TILES - 1}
              className={`w-16 h-16 md:w-20 md:h-20 rounded-lg text-2xl md:text-3xl flex items-center justify-center font-bold transition-all ${
                tile === TILES - 1
                  ? 'bg-transparent'
                  : canMove(idx)
                    ? 'bg-gradient-to-br from-green-600 to-emerald-700 hover:from-green-500 hover:to-emerald-600 cursor-pointer scale-100 hover:scale-105'
                    : 'bg-slate-600 cursor-pointer'
              } ${isSolved(tiles) ? 'ring-2 ring-yellow-400/50' : ''}`}
            >
              {tile !== TILES - 1 && (
                <span>{getTileEmoji(tile)}</span>
              )}
            </button>
          ))}
        </div>
      )}

      {finished && (
        <div className="text-center space-y-1">
          <p className="text-yellow-400 font-medium text-sm">🏆 ¡Completado en {moves} movimientos!</p>
        </div>
      )}
    </div>
  );
}
