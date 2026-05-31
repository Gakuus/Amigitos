'use client';

import { useEffect, useState } from 'react';
import { useShopStore } from '@/stores/shop.store';
import type { ShopItemInfo, InventoryItem } from '@amigitos/shared';

interface ShopModalProps {
  onClose: () => void;
}

type Tab = 'shop' | 'inventory';

export function ShopModal({ onClose }: ShopModalProps) {
  const {
    items, inventory, balance, loading, buying, error, success,
    fetchItems, fetchInventory, fetchBalance, buyItem, clearMessages,
  } = useShopStore();
  const [tab, setTab] = useState<Tab>('shop');
  const [filter, setFilter] = useState<'ALL' | 'COSMETIC' | 'CONSUMABLE'>('ALL');

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

  const filteredItems = filter === 'ALL' ? items : items.filter((i) => i.type === filter);

  const handleBuy = async (item: ShopItemInfo) => {
    const ok = await buyItem(item.type, item.id);
    if (ok) {
      await fetchBalance();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-800 rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl border border-slate-700">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <div>
            <h2 className="text-lg font-bold text-white">Tienda</h2>
            {balance && (
              <p className="text-sm text-yellow-400 font-medium">
                🪙 {balance.coins} monedas
              </p>
            )}
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
            Tienda
          </button>
          <button
            onClick={() => setTab('inventory')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              tab === 'inventory'
                ? 'bg-green-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            Inventario
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
              <div className="flex gap-2 mb-4">
                {(['ALL', 'CONSUMABLE', 'COSMETIC'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                      filter === f
                        ? 'bg-slate-600 text-white'
                        : 'bg-slate-700/50 text-slate-400 hover:bg-slate-600'
                    }`}
                  >
                    {f === 'ALL' ? 'Todos' : f === 'CONSUMABLE' ? 'Consumibles' : 'Cosméticos'}
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
                      className="bg-slate-700/50 rounded-xl p-3 flex flex-col gap-2 border border-slate-600/50 hover:border-slate-500 transition-colors"
                    >
                      <div className="w-full aspect-square bg-slate-600/50 rounded-lg flex items-center justify-center text-3xl">
                        {item.type === 'CONSUMABLE' ? '🍖' : '👒'}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white truncate">{item.name}</p>
                        <p className="text-xs text-slate-400 line-clamp-2 mt-0.5">{item.description}</p>
                        {item.type === 'COSMETIC' && item.rarity && (
                          <span className={`inline-block mt-1 text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                            item.rarity === 'LEGENDARY' ? 'bg-yellow-900/50 text-yellow-300' :
                            item.rarity === 'EPIC' ? 'bg-purple-900/50 text-purple-300' :
                            item.rarity === 'RARE' ? 'bg-blue-900/50 text-blue-300' :
                            item.rarity === 'UNCOMMON' ? 'bg-green-900/50 text-green-300' :
                            'bg-slate-600/50 text-slate-300'
                          }`}>
                            {item.rarity}
                          </span>
                        )}
                        {item.category && item.category !== 'FOOD' && item.category !== 'SPONGE' && (
                          <span className="inline-block mt-1 ml-1 text-[10px] px-1.5 py-0.5 rounded-full bg-slate-600/50 text-slate-300">
                            {item.category}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => handleBuy(item)}
                        disabled={buying || (balance !== null && balance.coins < item.price)}
                        className="w-full px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed bg-green-600 hover:bg-green-500 text-white"
                      >
                        {buying ? '...' : `🪙 ${item.price}`}
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
                <p className="text-slate-500 text-center py-8">Inventario vacío</p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {inventory.map((item) => (
                    <div
                      key={item.id}
                      className="bg-slate-700/50 rounded-xl p-3 flex flex-col gap-2 border border-slate-600/50"
                    >
                      <div className="w-full aspect-square bg-slate-600/50 rounded-lg flex items-center justify-center text-3xl relative">
                        {'🍖'}
                        <span className="absolute top-1 right-1 bg-green-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                          {item.quantity}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white truncate">{item.name}</p>
                        <p className="text-[11px] text-slate-400">{item.description}</p>
                        <span className="inline-block mt-1 text-[10px] px-1.5 py-0.5 rounded-full bg-slate-600/50 text-slate-300">
                          {item.category}
                        </span>
                      </div>
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
