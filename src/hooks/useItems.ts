import { useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
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
  const filterKey = filter?.join(',') ?? 'all';
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [triagingIds, setTriagingIds] = useState<Set<string>>(new Set());
  const [query, setQuery] = useState('');

  const refresh = useCallback(async () => {
    try {
      setItems(await listItems(filter));
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterKey]);

  // Re-fetch every time the tab gains focus (fixes the "press F5" issue).
  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  const runTriage = useCallback(
    async (item: Item) => {
      setTriagingIds((prev) => new Set(prev).add(item.id));
      try {
        const t = await triage(item.raw_text);
        await updateItemTriage(item.id, t);
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
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [filterKey]
  );

  const add = useCallback(
    async (text: string) => {
      const item = await createItem(text);
      setItems((prev) => [item, ...prev]);
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

  const remove = useCallback(
    async (item: Item) => {
      setItems((prev) => prev.filter((i) => i.id !== item.id));
      try {
        await deleteItem(item.id);
      } catch {
        refresh();
      }
    },
    [refresh]
  );

  // Search across raw text, summary, and tags.
  const visibleItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((i) => {
      const hay = [i.raw_text, i.summary ?? '', ...(i.tags ?? [])]
        .join(' ')
        .toLowerCase();
      return hay.includes(q);
    });
  }, [items, query]);

  return {
    items: visibleItems,
    loading,
    triagingIds,
    query,
    setQuery,
    add,
    toggleDone,
    remove,
    refresh,
  };
}