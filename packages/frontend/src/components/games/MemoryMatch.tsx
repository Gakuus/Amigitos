'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface Card {
  id: number;
  emoji: string;
  flipped: boolean;
  matched: boolean;
}

const EMOJIS = ['🐱', '🐶', '🐰', '🐹', '🦊', '🐼', '🐧', '🐉'];
const MAX_MOVES = 20;

function shuffleArray<T>(arr: T[]): T[] {
  const a: (T | undefined)[] = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = a[i]!;
    a[i] = a[j];
    a[j] = temp;
  }
  return a as T[];
}

function createBoard(): Card[] {
  const pairs = EMOJIS.flatMap((emoji, idx) => [
    { id: idx * 2, emoji, flipped: false, matched: false },
    { id: idx * 2 + 1, emoji, flipped: false, matched: false },
  ]);
  return shuffleArray(pairs);
}

interface MemoryMatchProps {
  onFinish: (score: number) => void;
}

function CardBack() {
  return (
    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-pastel-purple to-pastel-pink shadow-lg shadow-pastel-purple/20 flex items-center justify-center">
      <div className="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center">
        <div className="w-3 h-3 rounded-full bg-white/20" />
      </div>
      <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-white/10" />
      <div className="absolute bottom-2 right-2 w-1.5 h-1.5 rounded-full bg-white/10" />
    </div>
  );
}

export function MemoryMatch({ onFinish }: MemoryMatchProps) {
  const [cards, setCards] = useState<Card[]>(createBoard);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [locked, setLocked] = useState(false);
  const [finished, setFinished] = useState(false);
  const [won, setWon] = useState(false);
  const [wrongPair, setWrongPair] = useState<number[]>([]);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startTimeRef = useRef(Date.now());

  const matchedCount = cards.filter(c => c.matched).length;
  const allMatched = matchedCount === cards.length;
  const lost = moves >= MAX_MOVES && !allMatched && !finished;

  const finish = useCallback((win: boolean) => {
    setFinished(true);
    setWon(win);
    if (win) {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      const score = Math.max(10, Math.min(100, (MAX_MOVES - moves) * 5 + Math.max(0, 60 - elapsed)));
      setTimeout(() => onFinish(score), 900);
    } else {
      setTimeout(() => onFinish(0), 900);
    }
  }, [moves, onFinish]);

  useEffect(() => {
    if (allMatched && !finished) finish(true);
  }, [allMatched, finished, finish]);

  useEffect(() => {
    if (lost) finish(false);
  }, [lost, finish]);

  useEffect(() => {
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, []);

  const handleFlip = useCallback((id: number) => {
    if (locked || finished || lost) return;
    const card = cards.find(c => c.id === id);
    if (!card || card.flipped || card.matched) return;
    if (flipped.length >= 2) return;

    setCards(prev => prev.map(c => c.id === id ? { ...c, flipped: true } : c));
    setFlipped(prev => [...prev, id]);
  }, [locked, finished, lost, cards, flipped.length]);

  useEffect(() => {
    if (flipped.length === 2) {
      setLocked(true);
      setMoves(m => m + 1);
      const [first, second] = flipped as [number, number];
      const card1 = cards.find(c => c.id === first);
      const card2 = cards.find(c => c.id === second);
      if (!card1 || !card2) { setLocked(false); setFlipped([]); return; }

      if (card1.emoji === card2.emoji) {
        setCards(prev => prev.map(c =>
          c.id === first || c.id === second ? { ...c, matched: true, flipped: true } : c,
        ));
        setFlipped([]);
        setLocked(false);
      } else {
        setWrongPair([first, second]);
        timeoutRef.current = setTimeout(() => {
          setCards(prev => prev.map(c =>
            c.id === first || c.id === second ? { ...c, flipped: false } : c,
          ));
          setFlipped([]);
          setLocked(false);
          setWrongPair([]);
        }, 800);
      }
    }
  }, [flipped, cards]);

  const reset = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setCards(createBoard());
    setFlipped([]);
    setMoves(0);
    setLocked(false);
    setFinished(false);
    setWon(false);
    setWrongPair([]);
    startTimeRef.current = Date.now();
  };

  const pairsFound = matchedCount / 2;
  const remainingMoves = MAX_MOVES - moves;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center justify-between w-full text-xs">
        <span className={`font-semibold ${remainingMoves <= 3 ? 'text-rose-500' : 'text-pastel-muted dark:text-slate-400'}`}>
          Movimientos: {moves}/{MAX_MOVES}
        </span>
        <span className="text-pastel-muted dark:text-slate-400 font-medium">
          Pares: {pairsFound}/{EMOJIS.length}
        </span>
        <div className="flex gap-1.5">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                remainingMoves > i + 1 ? 'bg-green-400 shadow-sm shadow-green-400/50' : remainingMoves > i ? 'bg-amber-400' : 'bg-rose-400'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2.5">
        {cards.map(card => {
          const isWrong = wrongPair.includes(card.id);
          const isFlipped = card.flipped || card.matched;
          return (
            <button
              key={card.id}
              onClick={() => handleFlip(card.id)}
              disabled={finished || lost || card.matched}
              className={`relative w-14 h-14 md:w-16 md:h-16 [perspective:200px] bg-transparent border-0 p-0 cursor-pointer ${isWrong ? 'animate-shake' : ''}`}
            >
              <div
                className={`relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] ${
                  isFlipped ? '[transform:rotateY(180deg)]' : ''
                } ${card.matched ? 'after:absolute after:inset-0 after:rounded-xl after:ring-2 after:ring-green-400 after:ring-offset-2 after:ring-offset-transparent after:animate-pulse-soft' : ''}`}
              >
                <div className="absolute inset-0 [backface-visibility:hidden] rounded-xl bg-white dark:bg-slate-700 shadow-md flex items-center justify-center text-2xl [transform:rotateY(180deg)]">
                  <span className={card.matched ? 'animate-bounce-in' : ''}>{card.emoji}</span>
                </div>
                <div className="absolute inset-0 [backface-visibility:hidden] rounded-xl">
                  <CardBack />
                </div>
              </div>
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
        {lost && !finished && (
          <span className="text-sm text-rose-500 font-bold animate-pulse">
            ⚠️ ¡Último movimiento!
          </span>
        )}
      </div>
    </div>
  );
}
