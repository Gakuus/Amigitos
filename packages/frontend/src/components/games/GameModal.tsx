'use client';

import { useState, useEffect } from 'react';
import { MemoryMatch } from './MemoryMatch';
import { CatchTreats } from './CatchTreats';
import { PetPuzzle } from './PetPuzzle';
import { useGameStore } from '@/stores/game.store';
import { useShopStore } from '@/stores/shop.store';
import { useAuthStore } from '@/stores/auth.store';
import {
  Gamepad2, X, ArrowLeft, Coins, Sparkles, Trophy,
  MemoryStickIcon as Memory, Pizza, Puzzle, Heart,
  Frown,
} from 'lucide-react';

interface GameModalProps {
  onClose: () => void;
}

type GameType = 'memory' | 'catch' | 'puzzle';

const GAMES: { id: GameType; name: string; icon: React.ElementType; description: string; color: string }[] = [
  { id: 'memory', name: 'Memorama', icon: Memory, description: 'Encuentra los pares', color: 'from-pastel-purple to-pastel-coral dark:from-purple-500 dark:to-purple-600' },
  { id: 'catch', name: 'Atrapa Comida', icon: Pizza, description: 'Atrapa comida en 30s', color: 'from-pastel-coral to-pastel-yellow dark:from-orange-500 dark:to-orange-600' },
  { id: 'puzzle', name: 'Rompecabezas', icon: Puzzle, description: 'Ordena el puzzle', color: 'from-pastel-mint to-pastel-lavender dark:from-blue-500 dark:to-blue-600' },
];

export function GameModal({ onClose }: GameModalProps) {
  const [selectedGame, setSelectedGame] = useState<GameType | null>(null);
  const [gameResult, setGameResult] = useState<{ score: number; coins: number; won: boolean } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { claimReward, cooldowns, fetchCooldowns } = useGameStore();
  const { fetchBalance } = useShopStore();
  const updateCoins = useAuthStore(s => s.updateCoins);

  useEffect(() => { fetchCooldowns(); }, [fetchCooldowns]);

  const handleFinish = async (score: number) => {
    if (!selectedGame) return;
    setError(null);
    const data = await claimReward(selectedGame, Math.round(score));
    if (data !== null && !('error' in data)) {
      setGameResult({ score: Math.round(score), coins: data.coins, won: data.won });
      fetchBalance();
      updateCoins(data.totalCoins);
    } else if (data !== null && 'error' in data) {
      setError(data.error);
    }
  };

  const handleBack = () => {
    setSelectedGame(null);
    setGameResult(null);
    setError(null);
    fetchCooldowns();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white/95 dark:bg-surface-card/95 rounded-t-3xl sm:rounded-2xl w-full sm:max-w-lg max-h-[85dvh] sm:max-h-[85vh] flex flex-col shadow-2xl border border-pastel-purple/15 dark:border-surface-border/50 sm:m-4 animate-slide-up sm:animate-pop">
        <div className="flex justify-center pt-2 pb-0 sm:hidden">
          <div className="w-10 h-1 bg-pastel-purple/20 dark:bg-slate-600 rounded-full" />
        </div>

        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-pastel-purple/15 dark:border-surface-border/50">
          <h2 className="text-lg font-bold font-display text-pastel-foreground dark:text-white flex items-center gap-2">
            <Gamepad2 size={20} className="text-pastel-purple dark:text-purple-400" />
            Mini Juegos
          </h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl bg-pastel-lavender/30 dark:bg-slate-700/50 text-pastel-muted dark:text-slate-400 hover:text-pastel-foreground dark:hover:text-white active:scale-90 transition-all">
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {error && (
            <div className="mb-3 p-3 bg-pastel-coral/20 dark:bg-red-900/40 border border-pastel-coral/30 dark:border-red-700/30 rounded-xl text-xs text-pastel-coral dark:text-red-300 flex items-start gap-2">
              <span>⚠️</span><span>{error}</span>
            </div>
          )}

          {gameResult ? (
            <div className="flex flex-col items-center gap-4 py-6 text-center animate-pop">
              {gameResult.won ? (
                <Heart size={56} className="text-pastel-coral dark:text-coral-400 animate-bounce-in" fill="currentColor" />
              ) : (
                <Frown size={56} className="text-pastel-muted dark:text-slate-500 animate-bounce-in" />
              )}
              <h3 className={`text-xl font-bold font-display ${gameResult.won ? 'text-pastel-purple dark:text-brand-400' : 'text-pastel-muted dark:text-slate-400'}`}>
                {gameResult.won ? '¡Victoria!' : 'Has perdido'}
              </h3>
              {gameResult.won ? (
                <p className="text-pastel-muted dark:text-slate-400 text-sm">Puntuación: <span className="text-pastel-foreground dark:text-white font-bold">{gameResult.score}</span></p>
              ) : (
                <p className="text-pastel-muted dark:text-slate-400 text-sm">¡La próxima será!</p>
              )}
              <div className={`flex items-center gap-2 px-6 py-3 rounded-2xl ${gameResult.coins > 0 ? 'bg-pastel-yellow/20 dark:bg-amber-500/10 border border-pastel-yellow/30 dark:border-amber-500/30' : 'bg-pastel-lavender/20 dark:bg-slate-700/30'}`}>
                {gameResult.coins > 0 ? (
                  <><Coins size={24} className="text-pastel-yellow-dark dark:text-amber-400" /><span className="text-2xl font-bold text-pastel-yellow-dark dark:text-amber-400">+{gameResult.coins}</span></>
                ) : (
                  <span className="text-pastel-muted dark:text-slate-500 text-sm flex items-center gap-1"><Coins size={16} />+0 monedas</span>
                )}
              </div>
              <button
                onClick={handleBack}
                className="px-8 py-3 bg-gradient-to-r from-pastel-purple to-pastel-coral dark:from-brand-500 dark:to-emerald-500 rounded-2xl font-bold text-sm shadow-lg shadow-pastel-purple/30 dark:shadow-brand-500/25 text-white active:scale-95 transition-all"
              >
                Volver a juegos
              </button>
            </div>
          ) : selectedGame ? (
            <div className="space-y-4">
              <button onClick={handleBack} className="text-xs text-pastel-muted dark:text-slate-400 hover:text-pastel-foreground dark:hover:text-white flex items-center gap-1 transition-all">
                <ArrowLeft size={14} /> Volver
              </button>
              {selectedGame === 'memory' && <MemoryMatch onFinish={handleFinish} />}
              {selectedGame === 'catch' && <CatchTreats onFinish={handleFinish} />}
              {selectedGame === 'puzzle' && <PetPuzzle onFinish={handleFinish} />}
            </div>
          ) : (
            <div className="grid gap-3">
              {GAMES.map(game => {
                const cd = cooldowns[game.id] ?? 0;
                const onCooldown = cd > 0;
                const Icon = game.icon;

                return (
                  <button
                    key={game.id}
                    onClick={() => !onCooldown && setSelectedGame(game.id)}
                    disabled={onCooldown}
                    className={`flex items-center gap-4 p-4 rounded-2xl border transition-all text-left active:scale-[0.98] ${
                      onCooldown ? 'opacity-40 cursor-not-allowed bg-pastel-lavender/15 dark:bg-slate-800/50 border-pastel-purple/10 dark:border-slate-700/30' : 'bg-white/60 dark:bg-slate-700/30 border-pastel-purple/15 dark:border-slate-700/30 hover:bg-white/80 dark:hover:bg-slate-700/60 hover:border-pastel-purple/30 dark:hover:border-slate-500/50'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${game.color} flex items-center justify-center shadow-lg`}>
                      <Icon size={22} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-pastel-foreground dark:text-white">{game.name}</p>
                      <p className="text-xs text-pastel-muted dark:text-slate-400">{game.description}</p>
                    </div>
                    {onCooldown ? (
                      <span className="text-xs text-pastel-muted dark:text-slate-500 font-mono">{cd}s</span>
                    ) : (
                      <span className="text-xs font-bold text-pastel-purple dark:text-brand-400 bg-pastel-purple/10 dark:bg-brand-500/10 px-3 py-1.5 rounded-xl">
                        <Gamepad2 size={14} className="inline mr-1 -mt-0.5" />
                        Jugar
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
