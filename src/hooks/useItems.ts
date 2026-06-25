import { useCallback, useEffect, useState } from 'react';
import { createItem, listItems } from '../services/items';
import { Item } from '../types';

export function useItems() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      setItems(await listItems());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const add = useCallback(async (text: string) => {
    const item = await createItem(text);
    setItems((prev) => [item, ...prev]);
  }, []);

  return { items, loading, add, refresh };
}