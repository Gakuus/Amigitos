import { useState, useEffect, useCallback } from 'react';
import type { InventoryItem } from '@amigitos/shared';
import { api } from '@/lib/api';

export function useInventory() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchInventory = useCallback(async () => {
    setLoading(true);
    try {
      const items = await api.getInventory();
      setInventory(items);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  const getItemsByCategory = (category: string) =>
    inventory.filter((item) => item.category === category && item.quantity > 0);

  return { inventory, loading, fetchInventory, getItemsByCategory };
}
