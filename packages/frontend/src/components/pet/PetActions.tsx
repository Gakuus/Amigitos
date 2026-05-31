'use client';

import { usePetStore } from '@/stores/pet.store';
import { useState } from 'react';

interface PetActionsProps {
  petId: string;
}

const actions = [
  { id: 'feed' as const, label: 'Alimentar', icon: '🍽️', gradient: 'from-orange-500 to-orange-600', shadow: 'shadow-orange-500/25' },
  { id: 'play' as const, label: 'Jugar', icon: '🎾', gradient: 'from-yellow-500 to-amber-500', shadow: 'shadow-yellow-500/25' },
  { id: 'bathe' as const, label: 'Bañar', icon: '🛁', gradient: 'from-cyan-500 to-teal-500', shadow: 'shadow-cyan-500/25' },
  { id: 'sleep' as const, label: 'Dormir', icon: '💤', gradient: 'from-purple-500 to-violet-500', shadow: 'shadow-purple-500/25' },
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
    <div className="bg-slate-800/80 border border-slate-700/50 rounded-3xl p-5 space-y-3 shadow-xl">
      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
        <span>⚡</span>
        <span>Acciones Rápidas</span>
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => {
          const isLoading = loadingAction === action.id;
          const isSleepAction = action.id === 'sleep';
          return (
            <button
              key={action.id}
              onClick={() => handleAction(action.id)}
              disabled={isLoading}
              className={`relative flex flex-col items-center justify-center gap-2 p-4 rounded-2xl text-white font-medium transition-all active:scale-95 disabled:opacity-60 bg-gradient-to-br ${action.gradient} ${action.shadow} hover:brightness-110`}
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span className="text-2xl">{action.icon}</span>
                  <span className="text-xs font-semibold">
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
