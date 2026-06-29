import { useCallback, useEffect, useState } from 'react';
import { triage } from '../services/ai';
import { createItem, listItems, updateItemTriage } from '../services/items';
import { Item } from '../types';

export function useItems() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [triagingIds, setTriagingIds] = useState<Set<string>>(new Set());

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

  const runTriage = useCallback(async (item: Item) => {
    setTriagingIds((prev) => new Set(prev).add(item.id));
    try {
      const t = await triage(item.raw_text);
      await updateItemTriage(item.id, t);
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, ...t } : i))
      );
    } catch {
      // If AI fails (no key, network), item stays as raw text — no crash.
    } finally {
      setTriagingIds((prev) => {
        const next = new Set(prev);
        next.delete(item.id);
        return next;
      });
    }
  }, []);

  const add = useCallback(
    async (text: string) => {
      const item = await createItem(text);
      setItems((prev) => [item, ...prev]);
      runTriage(item);
    },
    [runTriage]
  );

  return { items, loading, triagingIds, add, refresh };
}