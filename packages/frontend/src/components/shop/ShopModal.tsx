'use client';

import { useEffect, useState } from 'react';
import { useShopStore } from '@/stores/shop.store';
import { usePetStore } from '@/stores/pet.store';
import type { ShopItemInfo, InventoryItem } from '@amigitos/shared';

interface ShopModalProps {
  onClose: () => void;
}

type Tab = 'shop' | 'inventory';

const CATEGORY_ICONS: Record<string, string> = {
  FOOD: '🍖',
  SPONGE: '🧽',
  TOY: '🧸',
  MEDICINE: '💊',
};

const CATEGORY_LABELS: Record<string, string> = {
  FOOD: 'Comida',
  SPONGE: 'Limpieza',
  TOY: 'Juguetes',
  MEDICINE: 'Medicina',
};

const CATEGORY_COLORS: Record<string, string> = {
  FOOD: 'bg-orange-900/30 text-orange-300 border-orange-700/30',
  SPONGE: 'bg-cyan-900/30 text-cyan-300 border-cyan-700/30',
  TOY: 'bg-yellow-900/30 text-yellow-300 border-yellow-700/30',
  MEDICINE: 'bg-red-900/30 text-red-300 border-red-700/30',
};

const RARITY_COLORS: Record<string, string> = {
  COMMON: 'bg-slate-600/50 text-slate-300',
  UNCOMMON: 'bg-green-900/50 text-green-300',
  RARE: 'bg-blue-900/50 text-blue-300',
  EPIC: 'bg-purple-900/50 text-purple-300',
  LEGENDARY: 'bg-yellow-900/50 text-yellow-300',
};

const RARITY_STARS: Record<string, string> = {
  COMMON: '★',
  UNCOMMON: '★★',
  RARE: '★★★',
  EPIC: '★★★★',
  LEGENDARY: '★★★★★',
};

function getSlotEmoji(slot?: string): string {
  const map: Record<string, string> = {
    HAT: '🎩',
    GLASSES: '👓',
    TOP: '👕',
    BOTTOM: '👖',
    SHOES: '👟',
    ACCESSORY: '📿',
    WINGS: '🪽',
    TAIL: '🦊',
  };
  return map[slot ?? ''] ?? '👒';
}

function getEffectLabel(effect?: Record<string, unknown>): string {
  if (!effect) return '';
  const e = effect as { stat: string; amount: number };
  const statLabels: Record<string, string> = {
    hunger: '🍽️ Hambre',
    happiness: '😊 Felicidad',
    energy: '⚡ Energía',
    hygiene: '🧼 Higiene',
    all: '✨ Todos',
  };
  return `${statLabels[e.stat] ?? e.stat} +${e.amount}`;
}

export function ShopModal({ onClose }: ShopModalProps) {
  const {
    items, inventory, balance, loading, buying, using, error, success,
    fetchItems, fetchInventory, fetchBalance, buyItem, applyConsumable, clearMessages,
  } = useShopStore();
  const { petMap, activePetId } = usePetStore();
  const [tab, setTab] = useState<Tab>('shop');
  const [filterCategory, setFilterCategory] = useState<string | null>(null);

  useEffect(() => {
    fetchItems();
    fetchInventory();
    fetchBalance();
  }, [fetchItems, fetchInventory, fetchBalance]);

  useEffect(() => {
    if (error || success) {
      const t = setTimeout(clearMessages, 3000);
      return () => clearTimeout(t);
    }
  }, [error, success, clearMessages]);

  const categories = [...new Set(items.filter(i => i.type === 'CONSUMABLE').map(i => i.category).filter(Boolean))] as string[];

  const filteredItems = filterCategory
    ? items.filter(i => i.type === 'CONSUMABLE' && i.category === filterCategory)
    : items;

  const handleBuy = async (item: ShopItemInfo) => {
    const ok = await buyItem(item.type, item.id);
    if (ok) {
      await fetchBalance();
    }
  };

  const handleUseItem = async (item: InventoryItem) => {
    if (!activePetId) {
      alert('Selecciona una mascota primero');
      return;
    }
    const ok = await applyConsumable(item.itemId, activePetId);
    if (ok) {
      await fetchInventory();
    }
  };

  const activePet = activePetId ? petMap[activePetId] : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-800 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl border border-slate-700">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              🏪 Tienda
            </h2>
            <div className="flex items-center gap-3 mt-1">
              {balance && (
                <span className="text-yellow-400 text-sm font-medium flex items-center gap-1">
                  🪙 {balance.coins}
                </span>
              )}
              {activePet && (
                <span className="text-xs text-slate-400">
                  Mascota activa: {activePet.name}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-xl leading-none p-1"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 px-4 pt-3 pb-1">
          <button
            onClick={() => setTab('shop')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              tab === 'shop'
                ? 'bg-green-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            🛒 Tienda
          </button>
          <button
            onClick={() => setTab('inventory')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              tab === 'inventory'
                ? 'bg-green-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            🎒 Inventario
            {inventory.length > 0 && (
              <span className="ml-1.5 text-xs bg-slate-600 px-1.5 py-0.5 rounded-full">
                {inventory.length}
              </span>
            )}
          </button>
        </div>

        {/* Messages */}
        {error && (
          <div className="mx-4 mt-2 px-3 py-2 bg-red-900/50 border border-red-700 rounded-lg text-sm text-red-300">
            {error}
          </div>
        )}
        {success && (
          <div className="mx-4 mt-2 px-3 py-2 bg-green-900/50 border border-green-700 rounded-lg text-sm text-green-300">
            {success}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {tab === 'shop' && (
            <>
              {/* Category filter */}
              <div className="flex gap-1.5 mb-4 flex-wrap">
                <button
                  onClick={() => setFilterCategory(null)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                    filterCategory === null
                      ? 'bg-green-600 text-white'
                      : 'bg-slate-700/50 text-slate-400 hover:bg-slate-600'
                  }`}
                >
                  🎯 Todos
                </button>
                <button
                  onClick={() => setFilterCategory('COSMETIC')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 ${
                    filterCategory === 'COSMETIC'
                      ? 'bg-green-600 text-white'
                      : 'bg-slate-700/50 text-slate-400 hover:bg-slate-600'
                  }`}
                >
                  👒 Cosméticos
                </button>
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setFilterCategory(cat)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 ${
                      filterCategory === cat
                        ? 'bg-green-600 text-white'
                        : 'bg-slate-700/50 text-slate-400 hover:bg-slate-600'
                    }`}
                  >
                    <span>{CATEGORY_ICONS[cat] ?? '📦'}</span>
                    <span>{CATEGORY_LABELS[cat] ?? cat}</span>
                  </button>
                ))}
              </div>

              {/* Items grid */}
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full" />
                </div>
              ) : filteredItems.length === 0 ? (
                <p className="text-slate-500 text-center py-8">No hay artículos disponibles</p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {filteredItems.map((item) => (
                    <div
                      key={`${item.type}-${item.id}`}
                      className="bg-slate-700/50 rounded-xl p-3 flex flex-col gap-2 border border-slate-600/50 hover:border-slate-500 transition-all hover:-translate-y-0.5"
                    >
                      {/* Icon */}
                      <div className="w-full aspect-square bg-slate-600/50 rounded-lg flex items-center justify-center text-4xl relative overflow-hidden">
                        {item.type === 'CONSUMABLE' ? (
                          <span>{CATEGORY_ICONS[item.category ?? ''] ?? '📦'}</span>
                        ) : (
                          <span>{getSlotEmoji(item.slot)}</span>
                        )}
                        {item.type === 'COSMETIC' && item.rarity && (
                          <span className="absolute top-1 left-1 text-[10px] opacity-70">
                            {RARITY_STARS[item.rarity] ?? ''}
                          </span>
                        )}
                      </div>
                      {/* Info */}
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium text-white truncate">{item.name}</p>
                        <p className="text-[11px] text-slate-400 line-clamp-2">{item.description}</p>
                        {item.type === 'CONSUMABLE' && item.category && (
                          <span className={`inline-block text-[10px] px-1.5 py-0.5 rounded-full font-medium ${CATEGORY_COLORS[item.category] ?? 'bg-slate-600/50 text-slate-300'}`}>
                            {CATEGORY_ICONS[item.category] ?? ''} {CATEGORY_LABELS[item.category] ?? item.category}
                          </span>
                        )}
                        {item.type === 'COSMETIC' && item.rarity && (
                          <span className={`inline-block text-[10px] px-1.5 py-0.5 rounded-full font-medium ${RARITY_COLORS[item.rarity] ?? ''}`}>
                            {item.rarity}
                          </span>
                        )}
                        {item.effect && (
                          <p className="text-[10px] text-green-400 font-medium">
                            {getEffectLabel(item.effect)}
                          </p>
                        )}
                      </div>
                      {/* Buy button */}
                      <button
                        onClick={() => handleBuy(item)}
                        disabled={buying || (balance !== null && balance.coins < item.price)}
                        className="w-full px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed bg-green-600 hover:bg-green-500 text-white flex items-center justify-center gap-1"
                      >
                        {buying ? (
                          <span className="animate-spin w-3 h-3 border-2 border-white border-t-transparent rounded-full" />
                        ) : (
                          <>
                            <span>🪙</span>
                            <span>{item.price}</span>
                          </>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {tab === 'inventory' && (
            <>
              {inventory.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center space-y-3">
                  <span className="text-5xl">🎒</span>
                  <p className="text-slate-400">Inventario vacío</p>
                  <p className="text-xs text-slate-500">Compra artículos en la tienda</p>
                  <button
                    onClick={() => setTab('shop')}
                    className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-xl text-sm font-medium transition-colors"
                  >
                    Ir a la tienda
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {inventory.map((item) => (
                    <div
                      key={item.id}
                      className="bg-slate-700/50 rounded-xl p-3 flex flex-col gap-2 border border-slate-600/50"
                    >
                      <div className="w-full aspect-square bg-slate-600/50 rounded-lg flex items-center justify-center text-4xl relative">
                        <span>{CATEGORY_ICONS[item.category] ?? '📦'}</span>
                        <span className="absolute top-1 right-1 bg-green-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-white truncate">{item.name}</p>
                        <p className="text-[11px] text-slate-400 line-clamp-2">{item.description}</p>
                        <span className={`inline-block text-[10px] px-1.5 py-0.5 rounded-full font-medium ${CATEGORY_COLORS[item.category] ?? 'bg-slate-600/50 text-slate-300'}`}>
                          {CATEGORY_ICONS[item.category] ?? ''} {CATEGORY_LABELS[item.category] ?? item.category}
                        </span>
                        {item.effect && (
                          <p className="text-[10px] text-green-400 font-medium">
                            {getEffectLabel(item.effect)}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => handleUseItem(item)}
                        disabled={using || !activePetId}
                        className="w-full px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center gap-1"
                      >
                        {using ? (
                          <span className="animate-spin w-3 h-3 border-2 border-white border-t-transparent rounded-full" />
                        ) : (
                          'Usar'
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
