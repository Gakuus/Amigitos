'use client';

import { usePetStore } from '@/stores/pet.store';

interface PetActionsProps {
  petId: string;
}

const actions = [
  { id: 'feed' as const, label: 'Alimentar', icon: '🍽️', color: 'bg-orange-600 hover:bg-orange-500' },
  { id: 'play' as const, label: 'Jugar', icon: '🎾', color: 'bg-yellow-600 hover:bg-yellow-500' },
  { id: 'bathe' as const, label: 'Bañar', icon: '🛁', color: 'bg-cyan-600 hover:bg-cyan-500' },
  { id: 'sleep' as const, label: 'Dormir', icon: '💤', color: 'bg-purple-600 hover:bg-purple-500' },
] as const;

export function PetActions({ petId }: PetActionsProps) {
  const { feed, play, bathe, sleep, wake, pet } = usePetStore();

  const handleAction = async (actionId: string) => {
    switch (actionId) {
      case 'feed': await feed(); break;
      case 'play': await play(); break;
      case 'bathe': await bathe(); break;
      case 'sleep':
        if (pet?.isSleeping) {
          await wake();
        } else {
          await sleep();
        }
        break;
    }
  };

  return (
    <div className="bg-slate-800 rounded-2xl p-5 space-y-3">
      <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">Acciones</h3>
      <div className="grid grid-cols-2 gap-2">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={() => handleAction(action.id)}
            className={`flex flex-col items-center gap-1 p-3 rounded-xl text-white transition-all active:scale-95 ${action.color}`}
          >
            <span className="text-xl">{action.icon}</span>
            <span className="text-xs font-medium">
              {action.id === 'sleep' && pet?.isSleeping ? 'Despertar' : action.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
