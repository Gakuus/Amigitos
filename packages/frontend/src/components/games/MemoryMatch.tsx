'use client';

import { useState, useEffect, useCallback } from 'react';

interface Card {
  id: number;
  emoji: string;
  flipped: boolean;
  matched: boolean;
}

const EMOJIS = ['🐱', '🐶', '🐰', '🐹', '🦊', '🐼', '🐧', '🐉'];

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
  const [startTime] = useState(Date.now());
  const [finished, setFinished] = useState(false);

  const matchedCount = cards.filter(c => c.matched).length;
  const allMatched = matchedCount === cards.length;

  useEffect(() => {
    if (allMatched && !finished) {
      setFinished(true);
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const score = Math.max(0, 100 - moves * 3 - elapsed);
      setTimeout(() => onFinish(score), 600);
    }
  }, [allMatched, finished, moves, startTime, onFinish]);

  const handleFlip = useCallback((id: number) => {
    if (locked || finished) return;
    const card = cards.find(c => c.id === id);
    if (!card || card.flipped || card.matched) return;
    if (flipped.length >= 2) return;

    setCards(prev => prev.map(c => c.id === id ? { ...c, flipped: true } : c));
    setFlipped(prev => [...prev, id]);
  }, [locked, finished, cards, flipped.length]);

  useEffect(() => {
    if (flipped.length === 2) {
      setLocked(true);
      setMoves(m => m + 1);
      const [first, second] = flipped;
      const card1 = cards.find(c => c.id === first)!;
      const card2 = cards.find(c => c.id === second)!;

      if (card1.emoji === card2.emoji) {
        setCards(prev => prev.map(c =>
          c.id === first || c.id === second ? { ...c, matched: true, flipped: true } : c,
        ));
        setFlipped([]);
        setLocked(false);
      } else {
        setTimeout(() => {
          setCards(prev => prev.map(c =>
            c.id === first || c.id === second ? { ...c, flipped: false } : c,
          ));
          setFlipped([]);
          setLocked(false);
        }, 800);
      }
    }
  }, [flipped, cards]);

  const reset = () => {
    setCards(createBoard());
    setFlipped([]);
    setMoves(0);
    setLocked(false);
    setFinished(false);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center justify-between w-full">
        <span className="text-sm text-slate-400">Movimientos: {moves}</span>
        <span className="text-sm text-slate-400">
          {cards.length - matchedCount} pares restantes
        </span>
        <button onClick={reset} className="text-xs px-2 py-1 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors">
          🔄 Reiniciar
        </button>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {cards.map(card => (
          <button
            key={card.id}
            onClick={() => handleFlip(card.id)}
            className={`w-14 h-14 md:w-16 md:h-16 rounded-xl text-2xl flex items-center justify-center transition-all duration-300 ${
              card.flipped || card.matched
                ? 'bg-slate-600 rotate-y-0'
                : 'bg-gradient-to-br from-green-600 to-emerald-700 hover:from-green-500 hover:to-emerald-600 rotate-y-180'
            } ${card.matched ? 'ring-2 ring-green-400/50' : ''}`}
            style={{
              transform: card.flipped || card.matched ? 'rotateY(0deg)' : 'rotateY(180deg)',
              transformStyle: 'preserve-3d',
            }}
          >
            <span style={{ opacity: card.flipped || card.matched ? 1 : 0 }}>
              {card.emoji}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
