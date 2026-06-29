import { useCallback, useEffect, useState } from 'react';
import { triage } from '../services/ai';
import {
    createItem,
    deleteItem,
    listItems,
    setDone,
    updateItemTriage,
} from '../services/items';
import { Item, ItemType } from '../types';

export function useItems(filter?: ItemType[]) {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [triagingIds, setTriagingIds] = useState<Set<string>>(new Set());

  const refresh = useCallback(async () => {
    try {
      setItems(await listItems(filter));
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const runTriage = useCallback(
    async (item: Item) => {
      setTriagingIds((prev) => new Set(prev).add(item.id));
      try {
        const t = await triage(item.raw_text);
        await updateItemTriage(item.id, t);
        // If this list is filtered and the new type doesn't match, drop it.
        setItems((prev) =>
          prev
            .map((i) => (i.id === item.id ? { ...i, ...t } : i))
            .filter((i) => !filter || (i.type && filter.includes(i.type)))
        );
      } catch {
        // leave as raw text on failure
      } finally {
        setTriagingIds((prev) => {
          const next = new Set(prev);
          next.delete(item.id);
          return next;
        });
      }
    },
    [filter]
  );

  const add = useCallback(
    async (text: string) => {
      const item = await createItem(text);
      setItems((prev) => [item, ...prev]); // Inbox shows it immediately
      runTriage(item);
    },
    [runTriage]
  );

  const toggleDone = useCallback(async (item: Item) => {
    const next = !item.done;
    setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, done: next } : i)));
    try {
      await setDone(item.id, next);
    } catch {
      setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, done: item.done } : i)));
    }
  }, []);

  const remove = useCallback(async (item: Item) => {
    setItems((prev) => prev.filter((i) => i.id !== item.id));
    try {
      await deleteItem(item.id);
    } catch {
      refresh();
    }
  }, [refresh]);

  return { items, loading, triagingIds, add, toggleDone, remove, refresh };
}