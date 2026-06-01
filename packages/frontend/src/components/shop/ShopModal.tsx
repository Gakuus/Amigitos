'use client';

import { useEffect, useState } from 'react';
import { useShopStore } from '@/stores/shop.store';
import { usePetStore } from '@/stores/pet.store';
import type { ShopItemInfo, InventoryItem } from '@amigitos/shared';
import {
  ShoppingBag, Backpack, Coins, X,
  Beef, Droplets, Puzzle, Pill, Crown,
  Glasses, Shirt, Footprints, Sparkles, Feather,
  Cat, Star, Search, ScrollText,
} from 'lucide-react';

interface ShopModalProps {
  onClose: () => void;
}

type Tab = 'shop' | 'inventory';

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  FOOD: Beef,
  SPONGE: Droplets,
  TOY: Puzzle,
  MEDICINE: Pill,
};

const CATEGORY_LABELS: Record<string, string> = {
  FOOD: 'Comida', SPONGE: 'Limpieza', TOY: 'Juguetes', MEDICINE: 'Medicina',
};

const CATEGORY_COLORS: Record<string, string> = {
  FOOD: 'bg-pastel-coral/20 text-pastel-coral border-pastel-coral/30 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-700/30',
  SPONGE: 'bg-pastel-mint/20 text-pastel-mint-dark border-pastel-mint/30 dark:bg-cyan-900/30 dark:text-cyan-300 dark:border-cyan-700/30',
  TOY: 'bg-pastel-yellow/20 text-pastel-yellow-dark border-pastel-yellow/30 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-700/30',
  MEDICINE: 'bg-pastel-coral/20 text-pastel-coral border-pastel-coral/30 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700/30',
};

const RARITY_COLORS: Record<string, string> = {
  COMMON: 'bg-pastel-lavender/30 text-pastel-muted dark:bg-slate-600/50 dark:text-slate-300',
  UNCOMMON: 'bg-pastel-purple/20 text-pastel-purple dark:bg-brand-900/50 dark:text-brand-300',
  RARE: 'bg-blue-100/50 text-blue-500 dark:bg-blue-900/50 dark:text-blue-300',
  EPIC: 'bg-purple-100/50 text-purple-500 dark:bg-purple-900/50 dark:text-purple-300',
  LEGENDARY: 'bg-amber-100/50 text-amber-500 dark:bg-amber-900/50 dark:text-amber-300',
};

const RARITY_STARS: Record<string, string> = {
  COMMON: '★', UNCOMMON: '★★', RARE: '★★★', EPIC: '★★★★', LEGENDARY: '★★★★★',
};

function getSlotIcon(slot?: string): React.ElementType {
  const map: Record<string, React.ElementType> = {
    HAT: Crown, GLASSES: Glasses, TOP: Shirt, BOTTOM: Shirt,
    SHOES: Footprints, ACCESSORY: Sparkles, WINGS: Feather, TAIL: Cat,
  };
  return map[slot ?? ''] ?? Sparkles;
}

function getEffectLabel(effect?: Record<string, unknown>): string {
  if (!effect) return '';
  const e = effect as { stat: string; amount: number };
  const statLabels: Record<string, string> = {
    hunger: 'Hambre', happiness: 'Felicidad', energy: 'Energía', hygiene: 'Higiene', all: 'Todos',
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
  const filteredItems = filterCategory ? items.filter(i => i.type === 'CONSUMABLE' && i.category === filterCategory) : items;
  const activePet = activePetId ? petMap[activePetId] : null;

  const handleBuy = async (item: ShopItemInfo) => {
    const ok = await buyItem(item.type, item.id);
    if (ok) await fetchBalance();
  };

  const handleUseItem = async (item: InventoryItem) => {
    if (!activePetId) { alert('Selecciona una mascota primero'); return; }
    const ok = await applyConsumable(item.itemId, activePetId);
    if (ok) await fetchInventory();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white/95 dark:bg-surface-card/95 rounded-t-3xl sm:rounded-2xl w-full sm:max-w-2xl max-h-[85dvh] sm:max-h-[85vh] flex flex-col shadow-2xl border border-pastel-purple/15 dark:border-surface-border/50 sm:m-4 animate-slide-up sm:animate-pop">
        <div className="flex justify-center pt-2 pb-0 sm:hidden">
          <div className="w-10 h-1 bg-pastel-purple/20 dark:bg-slate-600 rounded-full" />
        </div>

        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-pastel-purple/15 dark:border-surface-border/50">
          <div>
            <h2 className="text-lg font-bold font-display text-pastel-foreground dark:text-white flex items-center gap-2">
              <ShoppingBag size={20} className="text-pastel-purple dark:text-amber-400" />
              Tienda
            </h2>
            <div className="flex items-center gap-3 mt-0.5">
              {balance && (
                <span className="text-pastel-purple dark:text-amber-400 text-sm font-semibold flex items-center gap-1">
                  <Coins size={16} /> {balance.coins}
                </span>
              )}
              {activePet && <span className="text-xs text-pastel-muted dark:text-slate-500">{activePet.name}</span>}
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl bg-pastel-lavender/30 dark:bg-slate-700/50 text-pastel-muted dark:text-slate-400 hover:text-pastel-foreground dark:hover:text-white active:scale-90 transition-all">
            <X size={16} />
          </button>
        </div>

        <div className="flex gap-2 px-5 pt-3 pb-1">
          <button
            onClick={() => setTab('shop')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${tab === 'shop' ? 'bg-pastel-purple text-white shadow-lg shadow-pastel-purple/30 dark:bg-brand-600 dark:shadow-brand-600/20' : 'bg-pastel-lavender/30 dark:bg-slate-700/50 text-pastel-muted dark:text-slate-400 hover:bg-pastel-lavender/50 dark:hover:bg-slate-600'}`}
          >
            <ShoppingBag size={14} className="inline mr-1 -mt-0.5" />
            Tienda
          </button>
          <button
            onClick={() => setTab('inventory')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${tab === 'inventory' ? 'bg-pastel-purple text-white shadow-lg shadow-pastel-purple/30 dark:bg-brand-600 dark:shadow-brand-600/20' : 'bg-pastel-lavender/30 dark:bg-slate-700/50 text-pastel-muted dark:text-slate-400 hover:bg-pastel-lavender/50 dark:hover:bg-slate-600'}`}
          >
            <Backpack size={14} className="inline mr-1 -mt-0.5" />
            Inventario
            {inventory.length > 0 && (
              <span className="ml-1.5 text-[10px] bg-pastel-purple/20 dark:bg-slate-600 px-1.5 py-0.5 rounded-full text-pastel-purple dark:text-white">{inventory.length}</span>
            )}
          </button>
        </div>

        {(error || success) && (
          <div className="mx-5 mt-2">
            <div className={`px-3 py-2 rounded-xl text-xs font-medium ${error ? 'bg-pastel-coral/20 border border-pastel-coral/30 text-pastel-coral dark:bg-red-900/40 dark:border-red-700/30 dark:text-red-300' : 'bg-pastel-purple/20 border border-pastel-purple/30 text-pastel-purple dark:bg-brand-900/40 dark:border-brand-700/30 dark:text-brand-300'}`}>
              {error ?? success}
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-5">
          {tab === 'shop' && (
            <>
              <div className="flex gap-1.5 mb-4 flex-wrap">
                <button
                  onClick={() => setFilterCategory(null)}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${filterCategory === null ? 'bg-pastel-purple text-white shadow-lg shadow-pastel-purple/30 dark:bg-brand-600 dark:shadow-brand-600/20' : 'bg-pastel-lavender/30 dark:bg-slate-700/50 text-pastel-muted dark:text-slate-400 hover:bg-pastel-lavender/50 dark:hover:bg-slate-600'}`}
                >
                  <Search size={12} className="inline mr-1 -mt-0.5" />
                  Todos
                </button>
                <button
                  onClick={() => setFilterCategory('COSMETIC')}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1 ${filterCategory === 'COSMETIC' ? 'bg-pastel-purple text-white shadow-lg shadow-pastel-purple/30 dark:bg-brand-600 dark:shadow-brand-600/20' : 'bg-pastel-lavender/30 dark:bg-slate-700/50 text-pastel-muted dark:text-slate-400 hover:bg-pastel-lavender/50 dark:hover:bg-slate-600'}`}
                >
                  <Sparkles size={12} />
                  Cosméticos
                </button>
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setFilterCategory(cat)}
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1 ${filterCategory === cat ? 'bg-pastel-purple text-white shadow-lg shadow-pastel-purple/30 dark:bg-brand-600 dark:shadow-brand-600/20' : 'bg-pastel-lavender/30 dark:bg-slate-700/50 text-pastel-muted dark:text-slate-400 hover:bg-pastel-lavender/50 dark:hover:bg-slate-600'}`}
                  >
                    {(() => { const CatIcon = CATEGORY_ICONS[cat]; return CatIcon ? <CatIcon size={12} /> : null; })()}
                    <span>{CATEGORY_LABELS[cat] ?? cat}</span>
                  </button>
                ))}
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin w-8 h-8 border-2 border-pastel-purple dark:border-brand-500 border-t-transparent rounded-full" />
                </div>
              ) : filteredItems.length === 0 ? (
                <p className="text-pastel-muted dark:text-slate-500 text-center py-8">No hay artículos disponibles</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {filteredItems.map((item) => {
                    const SlotIcon = getSlotIcon(item.slot);
                    const CatIcon = CATEGORY_ICONS[item.category ?? ''];

                    return (
                      <div key={`${item.type}-${item.id}`} className="bg-white/60 dark:bg-slate-700/50 rounded-2xl p-3 flex flex-col gap-2 border border-pastel-purple/15 dark:border-slate-600/30 hover:border-pastel-purple/30 dark:hover:border-slate-500/50 transition-all active:scale-[0.97]">
                        <div className="w-full aspect-square bg-pastel-lavender/20 dark:bg-slate-600/30 rounded-xl flex items-center justify-center relative overflow-hidden">
                          {item.type === 'CONSUMABLE' ? (
                            CatIcon ? <CatIcon size={40} className="text-pastel-muted dark:text-slate-400" /> : <Sparkles size={40} className="text-pastel-muted dark:text-slate-400" />
                          ) : (
                            <SlotIcon size={40} className="text-pastel-muted dark:text-slate-400" />
                          )}
                          {item.type === 'COSMETIC' && item.rarity && (
                            <span className="absolute top-1 left-1 text-[10px] opacity-70 text-pastel-foreground dark:text-white">{RARITY_STARS[item.rarity]}</span>
                          )}
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-semibold text-pastel-foreground dark:text-white truncate">{item.name}</p>
                          <p className="text-[11px] text-pastel-muted dark:text-slate-400 line-clamp-2">{item.description}</p>
                          {item.type === 'CONSUMABLE' && item.category && (
                            <span className={`inline-block text-[10px] px-1.5 py-0.5 rounded-full font-medium ${CATEGORY_COLORS[item.category] ?? ''}`}>
                              {CatIcon && <CatIcon size={10} className="inline mr-0.5 -mt-0.5" />}
                              {CATEGORY_LABELS[item.category] ?? item.category}
                            </span>
                          )}
                          {item.type === 'COSMETIC' && item.rarity && (
                            <span className={`inline-block text-[10px] px-1.5 py-0.5 rounded-full font-medium ${RARITY_COLORS[item.rarity] ?? ''}`}>{item.rarity}</span>
                          )}
                          {item.effect && (
                            <p className="text-[10px] text-pastel-purple dark:text-brand-400 font-semibold flex items-center gap-0.5">
                              <ScrollText size={10} /> {getEffectLabel(item.effect)}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => handleBuy(item)}
                          disabled={buying || (balance !== null && balance.coins < item.price)}
                          className="w-full px-3 py-2 rounded-xl text-xs font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-gradient-to-r from-pastel-purple to-pastel-coral dark:from-brand-600 dark:to-emerald-600 hover:brightness-90 dark:hover:from-brand-500 dark:hover:to-emerald-500 text-white flex items-center justify-center gap-1 active:scale-[0.97]"
                        >
                          {buying ? (
                            <span className="animate-spin w-3 h-3 border-2 border-white border-t-transparent rounded-full" />
                          ) : (
                            <><Coins size={14} /><span>{item.price}</span></>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {tab === 'inventory' && (
            <>
              {inventory.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center space-y-3">
                  <Backpack size={48} className="text-pastel-muted dark:text-slate-500" />
                  <p className="text-pastel-muted dark:text-slate-400">Inventario vacío</p>
                  <p className="text-xs text-pastel-muted/60 dark:text-slate-500">Compra artículos en la tienda</p>
                  <button onClick={() => setTab('shop')} className="px-5 py-2.5 bg-gradient-to-r from-pastel-purple to-pastel-coral dark:from-brand-600 dark:to-emerald-600 rounded-xl text-sm font-semibold text-white transition-all active:scale-[0.97]">
                    Ir a la tienda
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {inventory.map((item) => {
                    const CatIcon = CATEGORY_ICONS[item.category ?? ''];

                    return (
                      <div key={item.id} className="bg-white/60 dark:bg-slate-700/50 rounded-2xl p-3 flex flex-col gap-2 border border-pastel-purple/15 dark:border-slate-600/30">
                        <div className="w-full aspect-square bg-pastel-lavender/20 dark:bg-slate-600/30 rounded-xl flex items-center justify-center relative">
                          {CatIcon ? <CatIcon size={40} className="text-pastel-muted dark:text-slate-400" /> : <Sparkles size={40} className="text-pastel-muted dark:text-slate-400" />}
                          <span className="absolute top-1 right-1 bg-pastel-purple dark:bg-brand-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">{item.quantity}</span>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-semibold text-pastel-foreground dark:text-white truncate">{item.name}</p>
                          <p className="text-[11px] text-pastel-muted dark:text-slate-400 line-clamp-2">{item.description}</p>
                          <span className={`inline-block text-[10px] px-1.5 py-0.5 rounded-full font-medium ${CATEGORY_COLORS[item.category] ?? ''}`}>
                            {CatIcon && <CatIcon size={10} className="inline mr-0.5 -mt-0.5" />}
                            {CATEGORY_LABELS[item.category] ?? item.category}
                          </span>
                          {item.effect && <p className="text-[10px] text-pastel-purple dark:text-brand-400 font-semibold">{getEffectLabel(item.effect)}</p>}
                        </div>
                        <button
                          onClick={() => handleUseItem(item)}
                          disabled={using || !activePetId}
                          className="w-full px-3 py-2 rounded-xl text-xs font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-gradient-to-r from-pastel-mint to-pastel-mint-dark dark:from-blue-600 dark:to-indigo-600 hover:brightness-90 dark:hover:from-blue-500 dark:hover:to-indigo-500 text-white flex items-center justify-center gap-1 active:scale-[0.97]"
                        >
                          {using ? <span className="animate-spin w-3 h-3 border-2 border-white border-t-transparent rounded-full" /> : 'Usar'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
