'use client';

import { useState, useEffect } from 'react';
import type { InventoryItem } from '@amigitos/shared';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/auth.store';
import { Apple, Bath, Gamepad2, X, ShoppingBag, AlertCircle } from 'lucide-react';

interface ItemSelectorProps {
  category: string;
  petId: string;
  actionLabel: string;
  actionEmoji: string;
  onAction: (petId: string, itemId: string) => Promise<void>;
  onClose: () => void;
}

export function ItemSelector({ category, petId, actionLabel, actionEmoji, onAction, onClose }: ItemSelectorProps) {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const refreshBalance = useAuthStore((s) => s.refreshBalance);

  useEffect(() => {
    api.getInventory()
      .then((items) => setInventory(items.filter((i) => i.category === category && i.quantity > 0)))
      .catch(() => setError('Error al cargar inventario'))
      .finally(() => setLoading(false));
  }, [category]);

  const handleSelect = async (itemId: string) => {
    setActing(true);
    setError(null);
    try {
      await onAction(petId, itemId);
      await refreshBalance?.();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al realizar acción');
    } finally {
      setActing(false);
    }
  };

  const categoryIcons: Record<string, React.ReactNode> = {
    FOOD: <Apple size={20} />,
    SPONGE: <Bath size={20} />,
    TOY: <Gamepad2 size={20} />,
  };

  const categoryColors: Record<string, string> = {
    FOOD: 'from-rose-400 to-orange-400',
    SPONGE: 'from-cyan-400 to-teal-400',
    TOY: 'from-violet-400 to-purple-400',
  };

  const emptyMessages: Record<string, string> = {
    FOOD: 'No tienes comida. ¡Compra en la tienda!',
    SPONGE: 'No tienes esponjas. ¡Compra en la tienda!',
    TOY: 'No tienes juguetes. ¡Compra en la tienda!',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-gradient-to-b from-pastel-card to-white dark:from-slate-800 dark:to-slate-900 w-full sm:max-w-sm rounded-t-3xl sm:rounded-3xl p-5 pb-8 animate-slide-up shadow-2xl border border-pastel-border/30">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${categoryColors[category] || 'from-pastel-pink to-pastel-coral'} flex items-center justify-center text-white shadow-lg`}>
              {categoryIcons[category] || <Apple size={20} />}
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white font-display">
              {actionLabel}
            </h3>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">
            <X size={16} className="text-slate-500 dark:text-slate-300" />
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-2 px-4 py-3 mb-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl text-sm text-red-600 dark:text-red-400">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-10">
            <div className="w-7 h-7 border-2 border-pastel-purple border-t-transparent rounded-full animate-spin" />
          </div>
        ) : inventory.length === 0 ? (
          <div className="text-center py-10 space-y-3">
            <div className="text-4xl">{actionEmoji}</div>
            <p className="text-slate-500 dark:text-slate-400 text-sm">{emptyMessages[category]}</p>
            <button
              onClick={onClose}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-pastel-purple to-pastel-pink text-white rounded-2xl font-semibold text-sm shadow-lg hover:shadow-xl active:scale-95 transition-all"
            >
              <ShoppingBag size={16} />
              Ir a la Tienda
            </button>
          </div>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-none">
            {inventory.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSelect(item.itemId)}
                disabled={acting}
                className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-white/60 dark:bg-slate-700/40 border border-pastel-border/20 hover:border-pastel-purple/40 hover:bg-pastel-purple/5 dark:hover:bg-slate-700/60 transition-all active:scale-[0.98] disabled:opacity-50"
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${categoryColors[category] || 'from-pastel-pink to-pastel-coral'} flex items-center justify-center text-white shadow-md shrink-0`}>
                  <span className="text-lg">{actionEmoji}</span>
                </div>
                <div className="flex-1 text-left">
                  <p className="font-semibold text-sm text-slate-700 dark:text-slate-200">{item.name}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 line-clamp-1">{item.description}</p>
                </div>
                <span className="text-xs font-bold text-pastel-purple dark:text-pastel-lavender bg-pastel-purple/10 dark:bg-pastel-purple/20 px-2.5 py-1 rounded-full">
                  x{item.quantity}
                </span>
              </button>
            ))}
          </div>
        )}

        {acting && (
          <div className="flex items-center justify-center gap-2 mt-3 text-sm text-pastel-purple font-semibold">
            <div className="w-5 h-5 border-2 border-pastel-purple border-t-transparent rounded-full animate-spin" />
            Realizando acción...
          </div>
        )}
      </div>
    </div>
  );
}
