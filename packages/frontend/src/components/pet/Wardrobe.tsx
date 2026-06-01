'use client';

import { useState, useEffect } from 'react';
import type { WardrobeItemInfo, PetOutfitInfo } from '@amigitos/shared';
import { ClothingSlot, CLOTHING_SLOT_LABELS } from '@amigitos/shared';
import { api } from '@/lib/api';
import {
  Shirt, Crown, Glasses, Footprints, Sparkles, Feather, Cat, Check,
} from 'lucide-react';

interface WardrobeProps {
  petId: string;
  species: string;
  outfit: PetOutfitInfo | null;
  onEquip: () => void;
}

const rarityColors: Record<string, string> = {
  COMMON: 'text-pastel-muted dark:text-slate-400',
  UNCOMMON: 'text-pastel-purple dark:text-brand-400',
  RARE: 'text-blue-400',
  EPIC: 'text-purple-400',
  LEGENDARY: 'text-amber-400',
};

const slotIcons: Record<string, React.ElementType> = {
  HAT: Crown, GLASSES: Glasses, TOP: Shirt, BOTTOM: Shirt,
  SHOES: Footprints, ACCESSORY: Sparkles, WINGS: Feather, TAIL: Cat,
};

export function Wardrobe({ petId, species, outfit, onEquip }: WardrobeProps) {
  const [items, setItems] = useState<WardrobeItemInfo[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<ClothingSlot | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadItems(); }, [petId]);

  const loadItems = async () => {
    setLoading(true);
    try { setItems(await api.getWardrobeItems(species)); }
    catch { console.error('Failed to load wardrobe'); }
    finally { setLoading(false); }
  };

  const equippedIds = new Set(Object.values(outfit?.equipped ?? {}));
  const itemsBySlot = items.reduce((acc, item) => {
    if (!acc[item.slot]) acc[item.slot] = [];
    acc[item.slot]!.push(item);
    return acc;
  }, {} as Record<string, WardrobeItemInfo[]>);

  const handleEquip = async (itemId: string) => {
    try { await api.equipItem(petId, itemId); onEquip(); }
    catch { console.error('Failed to equip'); }
  };

  const handleUnequip = async (slot: ClothingSlot) => {
    try { await api.unequipItem(petId, slot); onEquip(); }
    catch { console.error('Failed to unequip'); }
  };

  const slots = Object.values(ClothingSlot);

  return (
    <div className="bg-white/70 dark:bg-surface-card/80 border border-pastel-purple/15 dark:border-surface-border/50 rounded-3xl p-5 space-y-4 shadow-xl">
      <h3 className="text-xs font-semibold text-pastel-muted dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
        <Shirt size={14} />
        <span>Armario</span>
      </h3>

      <div className="flex flex-wrap gap-1.5">
        {slots.map((slot) => {
          const SlotIcon = slotIcons[slot] ?? Sparkles;
          return (
            <button
              key={slot}
              onClick={() => setSelectedSlot(selectedSlot === slot ? null : slot)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all active:scale-95 ${
                selectedSlot === slot
                  ? 'bg-pastel-purple/20 border border-pastel-purple/40 text-pastel-purple shadow-lg shadow-pastel-purple/10 dark:bg-brand-600/20 dark:border-brand-500/40 dark:text-brand-300 dark:shadow-brand-500/10'
                  : outfit?.equipped[slot]
                    ? 'bg-pastel-lavender/30 dark:bg-slate-700/50 border border-pastel-purple/20 dark:border-slate-500/30 text-pastel-foreground dark:text-slate-200'
                    : 'bg-pastel-lavender/15 dark:bg-slate-700/30 border border-transparent text-pastel-muted dark:text-slate-400 hover:bg-pastel-lavender/30 dark:hover:bg-slate-700/50'
              }`}
            >
              <SlotIcon size={14} />
              <span>{CLOTHING_SLOT_LABELS[slot] ?? slot}</span>
              {outfit?.equipped[slot] && <Check size={12} className="text-pastel-purple dark:text-brand-400" />}
            </button>
          );
        })}
      </div>

      {selectedSlot && (
        <div className="space-y-2 animate-fade-in">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-pastel-foreground dark:text-slate-300 flex items-center gap-2">
              {(() => { const SI = slotIcons[selectedSlot]; return SI ? <SI size={16} /> : null; })()}
              {CLOTHING_SLOT_LABELS[selectedSlot]}
            </h4>
            {outfit?.equipped[selectedSlot] && (
              <button onClick={() => handleUnequip(selectedSlot)} className="text-xs text-pastel-coral dark:text-red-400 hover:text-pastel-coral-dark dark:hover:text-red-300 font-semibold active:scale-95">
                Quitar
              </button>
            )}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-6">
              <div className="animate-spin w-5 h-5 border-2 border-pastel-purple dark:border-brand-500 border-t-transparent rounded-full" />
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto">
              {(itemsBySlot[selectedSlot] ?? []).map((item) => {
                const ItemIcon = slotIcons[item.slot] ?? Sparkles;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleEquip(item.id)}
                    disabled={equippedIds.has(item.id)}
                    className={`flex items-center gap-2 p-3 rounded-2xl text-left transition-all border active:scale-[0.97] ${
                      equippedIds.has(item.id)
                        ? 'bg-pastel-purple/20 border-pastel-purple/40 dark:bg-brand-600/20 dark:border-brand-500/40'
                        : 'bg-pastel-lavender/15 dark:bg-slate-700/30 border-transparent hover:bg-pastel-lavender/30 dark:hover:bg-slate-700/50'
                    } disabled:opacity-80`}
                  >
                    <div className="w-10 h-10 bg-pastel-lavender/30 dark:bg-slate-600/50 rounded-xl flex items-center justify-center">
                      <ItemIcon size={18} className="text-pastel-muted dark:text-slate-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-pastel-foreground dark:text-slate-200 truncate">{item.name}</div>
                      <div className={`text-[10px] font-medium ${rarityColors[item.rarity]?.split(' ')[0] ?? 'text-pastel-muted dark:text-slate-500'}`}>
                        {item.rarity}
                      </div>
                    </div>
                  </button>
                );
              })}
              {(!itemsBySlot[selectedSlot] || itemsBySlot[selectedSlot].length === 0) && (
                <div className="col-span-full text-sm text-pastel-muted dark:text-slate-500 py-6 text-center">
                  No hay items para esta categoría
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {!selectedSlot && (
        <div className="text-sm text-pastel-muted dark:text-slate-500 text-center py-4 bg-pastel-lavender/15 dark:bg-slate-700/20 rounded-2xl">
          Selecciona una categoría
        </div>
      )}
    </div>
  );
}
