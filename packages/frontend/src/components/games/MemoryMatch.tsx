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
      setTimeout(() => onFinish(score), 800);
    } else {
      setTimeout(() => onFinish(0), 800);
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
        }, 700);
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
      {/* HUD */}
      <div className="flex items-center justify-between w-full text-xs">
        <span className={`font-medium ${remainingMoves <= 3 ? 'text-red-400' : 'text-slate-400'}`}>
          Movimientos: {moves}/{MAX_MOVES}
        </span>
        <span className="text-slate-400">
          Pares: {pairsFound}/{EMOJIS.length}
        </span>
        <div className="flex gap-1">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full ${
                remainingMoves > i + 1 ? 'bg-green-500' : remainingMoves > i ? 'bg-yellow-500' : 'bg-red-500'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {cards.map(card => {
          const isWrong = wrongPair.includes(card.id);
          return (
            <button
              key={card.id}
              onClick={() => handleFlip(card.id)}
              disabled={finished || lost}
              className={`w-14 h-14 md:w-16 md:h-16 rounded-xl text-2xl flex items-center justify-center transition-all duration-300 ${
                card.flipped || card.matched
                  ? 'bg-slate-600'
                  : 'bg-gradient-to-br from-green-600 to-emerald-700 hover:from-green-500 hover:to-emerald-600 hover:scale-105'
              } ${card.matched ? 'ring-2 ring-green-400/50 scale-95' : ''} ${
                isWrong ? 'animate-shake ring-2 ring-red-400' : ''
              }`}
              style={{
                transform: card.flipped || card.matched ? 'rotateY(0deg)' : 'rotateY(180deg)',
                transformStyle: 'preserve-3d',
              }}
            >
              <span style={{ opacity: card.flipped || card.matched ? 1 : 0 }}>
                {card.emoji}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={reset}
          className="text-xs px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
        >
          🔄 Reiniciar
        </button>
        {finished && (
          <span className={`text-sm font-bold ${won ? 'text-green-400' : 'text-red-400'}`}>
            {won ? '🎉 ¡Completado!' : '💔 Has perdido'}
          </span>
        )}
        {lost && !finished && (
          <span className="text-sm text-red-400 font-bold animate-pulse">
            ⚠️ ¡Último movimiento!
          </span>
        )}
      </div>
    </div>
  );
}
