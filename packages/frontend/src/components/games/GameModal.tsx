'use client';

import { useState, useEffect } from 'react';
import { MemoryMatch } from './MemoryMatch';
import { CatchTreats } from './CatchTreats';
import { PetPuzzle } from './PetPuzzle';
import { FlappyPet } from './FlappyPet';
import { useGameStore } from '@/stores/game.store';
import { useShopStore } from '@/stores/shop.store';
import { useAuthStore } from '@/stores/auth.store';
import {
  Gamepad2, X, ArrowLeft, Coins,
  Heart, Frown, Sparkles, Bird,
} from 'lucide-react';

interface GameModalProps {
  onClose: () => void;
}

type GameType = 'memory' | 'catch' | 'puzzle' | 'flappy';

const GAMES: { id: GameType; name: string; icon: React.ElementType; description: string; color: string }[] = [
  { id: 'memory', name: 'Memorama', icon: Heart, description: 'Encuentra los pares', color: 'from-pink-400 to-rose-500' },
  { id: 'catch', name: 'Atrapa Comida', icon: Sparkles, description: 'Atrapa comida en 30s', color: 'from-orange-400 to-amber-500' },
  { id: 'puzzle', name: 'Rompecabezas', icon: Gamepad2, description: 'Ordena el puzzle 3x3', color: 'from-violet-400 to-indigo-500' },
  { id: 'flappy', name: 'Flappy Pet', icon: Bird, description: 'Vuela sin chocar', color: 'from-sky-400 to-cyan-500' },
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
      <div className="bg-white/95 dark:bg-slate-900/95 rounded-t-3xl sm:rounded-2xl w-full sm:max-w-lg max-h-[85dvh] sm:max-h-[85vh] flex flex-col shadow-2xl border border-pastel-border/20 dark:border-slate-700/50 sm:m-4 animate-slide-up sm:animate-pop">
        <div className="flex justify-center pt-2 pb-0 sm:hidden">
          <div className="w-10 h-1 bg-pastel-muted/30 dark:bg-slate-600 rounded-full" />
        </div>

        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-pastel-border/20 dark:border-slate-700/50">
          <h2 className="text-lg font-bold font-display text-pastel-foreground dark:text-white flex items-center gap-2">
            <Gamepad2 size={20} className="text-pastel-purple" />
            Mini Juegos
          </h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl bg-pastel-lavender/30 dark:bg-slate-700/50 text-pastel-muted dark:text-slate-400 hover:text-pastel-foreground dark:hover:text-white active:scale-90 transition-all">
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {error && (
            <div className="mb-3 p-3 bg-red-50/80 dark:bg-red-900/30 border border-red-200/50 dark:border-red-700/30 rounded-xl text-xs text-red-600 dark:text-red-300 flex items-start gap-2">
              <span>⚠️</span><span>{error}</span>
            </div>
          )}

          {gameResult ? (
            <div className="flex flex-col items-center gap-4 py-6 text-center animate-pop">
              {gameResult.won ? (
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pastel-purple to-pastel-pink flex items-center justify-center shadow-lg shadow-pastel-purple/20">
                  <Heart size={40} className="text-white animate-bounce-in" fill="currentColor" />
                </div>
              ) : (
                <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                  <Frown size={40} className="text-slate-400 dark:text-slate-500 animate-bounce-in" />
                </div>
              )}
              <h3 className={`text-xl font-bold font-display ${gameResult.won ? 'text-pastel-purple' : 'text-pastel-muted'}`}>
                {gameResult.won ? '¡Victoria!' : 'Has perdido'}
              </h3>
              {gameResult.won ? (
                <p className="text-pastel-muted dark:text-slate-400 text-sm">Puntuación: <span className="text-pastel-foreground dark:text-white font-bold">{gameResult.score}</span></p>
              ) : (
                <p className="text-pastel-muted dark:text-slate-400 text-sm">¡La próxima será!</p>
              )}
              <div className={`flex items-center gap-2 px-6 py-3 rounded-2xl ${gameResult.coins > 0 ? 'bg-amber-50 dark:bg-amber-900/20 border border-amber-200/50 dark:border-amber-500/20' : 'bg-pastel-lavender/20 dark:bg-slate-700/30'}`}>
                {gameResult.coins > 0 ? (
                  <><Coins size={24} className="text-amber-500" /><span className="text-2xl font-bold text-amber-500">+{gameResult.coins}</span></>
                ) : (
                  <span className="text-pastel-muted dark:text-slate-500 text-sm flex items-center gap-1"><Coins size={16} />+0 monedas</span>
                )}
              </div>
              <button
                onClick={handleBack}
                className="px-8 py-3 bg-gradient-to-r from-pastel-purple to-pastel-pink text-white rounded-2xl font-bold text-sm shadow-lg shadow-pastel-purple/25 active:scale-95 hover:brightness-110 transition-all"
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
              {selectedGame === 'flappy' && <FlappyPet onFinish={handleFinish} />}
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
                    className={`group flex items-center gap-4 p-4 rounded-2xl border transition-all text-left active:scale-[0.98] ${
                      onCooldown
                        ? 'opacity-40 cursor-not-allowed bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/30'
                        : 'bg-white dark:bg-slate-800/60 border-pastel-border/20 dark:border-slate-700/50 hover:border-pastel-border/40 dark:hover:border-slate-600/50 hover:shadow-md hover:-translate-y-0.5'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${game.color} flex items-center justify-center shadow-lg shadow-black/10 group-hover:scale-110 transition-transform`}>
                      <Icon size={22} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-pastel-foreground dark:text-white">{game.name}</p>
                      <p className="text-xs text-pastel-muted dark:text-slate-400">{game.description}</p>
                    </div>
                    {onCooldown ? (
                      <span className="text-xs text-pastel-muted dark:text-slate-500 font-mono bg-slate-100 dark:bg-slate-700/50 px-2.5 py-1 rounded-lg">{cd}s</span>
                    ) : (
                      <span className="text-xs font-bold text-pastel-purple bg-pastel-purple/10 px-3 py-1.5 rounded-xl group-hover:bg-pastel-purple/20 transition-colors">
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
