'use client';

import { usePetStore } from '@/stores/pet.store';
import { useState } from 'react';
import { Apple, Gamepad2, Bath, Moon, Sun, Zap } from 'lucide-react';

interface PetActionsProps {
  petId: string;
}

const actions = [
  { id: 'feed' as const, label: 'Alimentar', icon: Apple, color: 'from-warm-500 to-orange-600', shadow: 'shadow-warm-500/25' },
  { id: 'play' as const, label: 'Jugar', icon: Gamepad2, color: 'from-yellow-500 to-amber-500', shadow: 'shadow-yellow-500/25' },
  { id: 'bathe' as const, label: 'Bañar', icon: Bath, color: 'from-cyan-500 to-teal-500', shadow: 'shadow-cyan-500/25' },
  { id: 'sleep' as const, label: 'Dormir', icon: Moon, color: 'from-purple-500 to-violet-500', shadow: 'shadow-purple-500/25' },
] as const;

export function PetActions({ petId }: PetActionsProps) {
  const { feed, play, bathe, sleep, wake, pet } = usePetStore();
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const handleAction = async (actionId: string) => {
    setLoadingAction(actionId);
    try {
      switch (actionId) {
        case 'feed': await feed(); break;
        case 'play': await play(); break;
        case 'bathe': await bathe(); break;
        case 'sleep':
          if (pet?.isSleeping) await wake();
          else await sleep();
          break;
      }
    } finally {
      setLoadingAction(null);
    }
  };

  const isSleeping = pet?.isSleeping;

  return (
    <div className="bg-surface-card/80 border border-surface-border/50 rounded-3xl p-5 space-y-3 shadow-xl">
      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
        <Zap size={14} />
        <span>Acciones Rápidas</span>
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => {
          const isLoading = loadingAction === action.id;
          const isSleepAction = action.id === 'sleep';
          const Icon = isSleepAction && isSleeping ? Sun : action.icon;

          return (
            <button
              key={action.id}
              onClick={() => handleAction(action.id)}
              disabled={isLoading}
              className={`relative flex flex-col items-center justify-center gap-2 p-4 rounded-2xl text-white font-semibold transition-all active:scale-95 disabled:opacity-60 bg-gradient-to-br ${action.color} ${action.shadow} hover:brightness-110`}
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Icon size={24} />
                  <span className="text-xs font-bold">
                    {isSleepAction && isSleeping ? 'Despertar' : action.label}
                  </span>
                </>
              )}
              {isSleepAction && isSleeping && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-purple-400 rounded-full animate-ping" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
