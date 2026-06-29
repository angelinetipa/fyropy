import { useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { triage } from '../services/ai';
import {
  createItem,
  deleteItem,
  listItems,
  renameGroup,
  setDone,
  updateItemText, updateItemTriage,
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
            .map((i) =>
              i.id === item.id
                ? { ...i, type: t.type, tags: t.tags, summary: t.summary, group_name: t.group }
                : i
            )
            .filter((i) => !filter || (i.type && filter.includes(i.type)))
        );
      } catch {
        // leave as-is on failure
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

  const saveText = useCallback(
    async (item: Item, text: string) => {
      const t = text.trim();
      if (!t || t === item.raw_text) return;
      setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, raw_text: t } : i)));
      await updateItemText(item.id, t);
      await runTriage({ ...item, raw_text: t });
    },
    [runTriage]
  );

  const retriage = useCallback((item: Item) => runTriage(item), [runTriage]);

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

  const rename = useCallback(
    async (from: string, to: string) => {
      const target = to.trim();
      if (!target || target === from) return;
      setItems((prev) =>
        prev.map((i) => (i.group_name === from ? { ...i, group_name: target } : i))
      );
      try {
        await renameGroup(from, target);
      } catch {
        refresh();
      }
    },
    [refresh]
  );

  const visibleItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((i) => {
      const hay = [i.raw_text, i.summary ?? '', i.group_name ?? '', ...(i.tags ?? [])]
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
    saveText,
    retriage,
    toggleDone,
    remove,
    rename,
    refresh,
  };
}