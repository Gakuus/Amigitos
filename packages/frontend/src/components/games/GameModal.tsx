'use client';

import { useState, useEffect } from 'react';
import { MemoryMatch } from './MemoryMatch';
import { CatchTreats } from './CatchTreats';
import { PetPuzzle } from './PetPuzzle';
import { useGameStore } from '@/stores/game.store';
import { useShopStore } from '@/stores/shop.store';
import { useAuthStore } from '@/stores/auth.store';

interface GameModalProps {
  onClose: () => void;
}

type GameType = 'memory' | 'catch' | 'puzzle';

const GAMES: { id: GameType; name: string; icon: string; description: string; color: string }[] = [
  { id: 'memory', name: 'Memorama', icon: '🃏', description: 'Encuentra los pares de mascotas', color: 'from-purple-600 to-purple-700' },
  { id: 'catch', name: 'Atrapa Comida', icon: '🍕', description: 'Atrapa la mayor comida en 30s', color: 'from-orange-600 to-orange-700' },
  { id: 'puzzle', name: 'Rompecabezas', icon: '🧩', description: 'Ordena el puzzle de mascotas', color: 'from-blue-600 to-blue-700' },
];

export function GameModal({ onClose }: GameModalProps) {
  const [selectedGame, setSelectedGame] = useState<GameType | null>(null);
  const [gameResult, setGameResult] = useState<{ score: number; coins: number; won: boolean } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [errorCount, setErrorCount] = useState(0);
  const { claimReward, cooldowns, fetchCooldowns } = useGameStore();
  const { fetchBalance } = useShopStore();
  const updateCoins = useAuthStore(s => s.updateCoins);

  useEffect(() => {
    fetchCooldowns();
  }, [fetchCooldowns]);

  const handleFinish = async (score: number) => {
    if (!selectedGame) return;
    setError(null);
    const data = await claimReward(selectedGame, Math.round(score));
    if (data !== null) {
      setGameResult({ score: Math.round(score), coins: data.coins, won: data.won });
      fetchBalance();
      updateCoins(data.totalCoins);
    } else {
      setErrorCount(c => c + 1);
      setError(errorCount > 0
        ? 'El servidor no responde. Asegurate de tener el backend corriendo.'
        : 'Error al reclamar recompensa. ¿El backend está funcionando?');
    }
  };

  const handleBack = () => {
    setSelectedGame(null);
    setGameResult(null);
    setError(null);
    fetchCooldowns();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-800 rounded-2xl w-full max-w-lg max-h-[85vh] flex flex-col shadow-2xl border border-slate-700">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            🎮 Mini Juegos
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-xl leading-none p-1"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {error && (
            <div className="mb-3 p-3 bg-red-900/40 border border-red-700/50 rounded-xl text-sm text-red-300 flex items-start gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {gameResult ? (
            /* Result screen */
            <div className="flex flex-col items-center gap-4 py-8 text-center">
              <span className="text-6xl animate-bounce-in">{gameResult.won ? '🎉' : '💔'}</span>
              <h3 className={`text-xl font-bold ${gameResult.won ? 'text-green-400' : 'text-red-400'}`}>
                {gameResult.won ? '¡Victoria!' : 'Has perdido'}
              </h3>
              {gameResult.won ? (
                <p className="text-slate-400">Puntuación: <span className="text-white font-medium">{gameResult.score}</span></p>
              ) : (
                <p className="text-slate-400">Sigue intentando, ¡la próxima será!</p>
              )}

              {/* Coins display */}
              <div className={`flex items-center gap-2 px-6 py-3 rounded-xl ${
                gameResult.coins > 0
                  ? 'bg-yellow-500/10 border border-yellow-500/30'
                  : 'bg-slate-700/30'
              }`}>
                {gameResult.coins > 0 ? (
                  <>
                    <span className="text-2xl animate-bounce-in">🪙</span>
                    <span className="text-2xl font-bold text-yellow-400">
                      +{gameResult.coins}
                    </span>
                  </>
                ) : (
                  <span className="text-slate-500 text-sm">🪙 +0 monedas</span>
                )}
              </div>

              {gameResult.coins > 0 && (
                <p className="text-xs text-slate-500">
                  {gameResult.score >= 50 ? '🏆 ¡Excelente partida!' : gameResult.score >= 20 ? '👍 Buen trabajo!' : '💪 Sigue así!'}
                </p>
              )}

              <button
                onClick={handleBack}
                className="mt-2 px-6 py-2.5 bg-green-600 hover:bg-green-500 rounded-xl font-medium transition-colors"
              >
                Volver a juegos
              </button>
            </div>
          ) : selectedGame ? (
            /* Game screen */
            <div className="space-y-4">
              <button
                onClick={handleBack}
                className="text-xs text-slate-400 hover:text-white transition-colors flex items-center gap-1"
              >
                ← Volver
              </button>
              {selectedGame === 'memory' && <MemoryMatch onFinish={handleFinish} />}
              {selectedGame === 'catch' && <CatchTreats onFinish={handleFinish} />}
              {selectedGame === 'puzzle' && <PetPuzzle onFinish={handleFinish} />}
            </div>
          ) : (
            /* Game selection */
            <div className="grid gap-3">
              {GAMES.map(game => {
                const cd = cooldowns[game.id] ?? 0;
                const onCooldown = cd > 0;
                return (
                  <button
                    key={game.id}
                    onClick={() => !onCooldown && setSelectedGame(game.id)}
                    disabled={onCooldown}
                    className={`flex items-center gap-4 p-4 rounded-xl border border-slate-700/50 transition-all text-left ${
                      onCooldown
                        ? 'opacity-40 cursor-not-allowed bg-slate-800/50'
                        : 'bg-slate-700/30 hover:bg-slate-700/60 hover:border-slate-500 active:scale-[0.98]'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${game.color} flex items-center justify-center text-xl`}>
                      {game.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">{game.name}</p>
                      <p className="text-xs text-slate-400">{game.description}</p>
                    </div>
                    {onCooldown ? (
                      <span className="text-xs text-slate-500">{cd}s</span>
                    ) : (
                      <span className="text-xs text-green-400">🎮 Jugar</span>
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
