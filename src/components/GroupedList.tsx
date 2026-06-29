import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { Pressable, SectionList, StyleSheet, Text, View } from 'react-native';
import { colors } from '../constants/colors';
import { radius, space, transition, type } from '../constants/theme';
import { Item } from '../types';
import { ItemCard } from './ItemCard';
import { RenameModal } from './RenameModal';

function groupKey(it: Item): string {
  return it.group_name?.trim() || it.tags?.[0] || 'General';
}

type Props = {
  items: Item[];
  loading: boolean;
  emptyText: string;
  onToggleDone?: (i: Item) => void;
  onDelete?: (i: Item) => void;
  onRenameGroup?: (from: string, to: string) => void;
};

export function GroupedList({
  items, loading, emptyText, onToggleDone, onDelete, onRenameGroup,
}: Props) {
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [editing, setEditing] = useState<string | null>(null);

  const sections = useMemo(() => {
    const map = new Map<string, Item[]>();
    for (const it of items) {
      const k = groupKey(it);
      const existing = map.get(k);
      if (existing) existing.push(it);
      else map.set(k, [it]);
    }
    const arr = Array.from(map.entries()).map(([title, data]) => ({ title, data }));
    arr.sort((a, b) =>
      (b.data[0]?.created_at ?? '').localeCompare(a.data[0]?.created_at ?? '')
    );
    return arr;
  }, [items]);

  const display = sections.map((s) => ({
    title: s.title,
    count: s.data.length,
    data: collapsed.has(s.title) ? [] : s.data,
  }));

  const toggle = (title: string) =>
    setCollapsed((prev) => {
      const n = new Set(prev);
      if (n.has(title)) n.delete(title);
      else n.add(title);
      return n;
    });

  if (!loading && items.length === 0) {
    return <Text style={styles.empty}>{emptyText}</Text>;
  }

  return (
    <>
      <SectionList
        style={{ flex: 1, minHeight: 0 }}
        sections={display}
        keyExtractor={(it) => it.id}
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled={false}
        contentContainerStyle={styles.list}
        renderSectionHeader={({ section }) => {
          const isCollapsed = collapsed.has(section.title);
          return (
            <Pressable
              onPress={() => toggle(section.title)}
              style={({ hovered }) => [styles.header, transition, hovered && styles.headerHover]}
            >
              <Ionicons
                name={isCollapsed ? 'chevron-forward' : 'chevron-down'}
                size={16}
                color={colors.inkSoft}
              />
              <Text style={styles.headerText}>{section.title}</Text>
              <View style={styles.countPill}>
                <Text style={styles.countText}>{section.count}</Text>
              </View>
              {onRenameGroup ? (
                <Pressable
                  onPress={() => setEditing(section.title)}
                  hitSlop={8}
                  style={styles.editBtn}
                >
                  <Ionicons name="pencil" size={14} color={colors.inkFaint} />
                </Pressable>
              ) : null}
            </Pressable>
          );
        }}
        renderItem={({ item }) => (
          <View style={styles.itemWrap}>
            <ItemCard item={item} onToggleDone={onToggleDone} onDelete={onDelete} />
          </View>
        )}
      />

      <RenameModal
        visible={editing !== null}
        initial={editing ?? ''}
        onCancel={() => setEditing(null)}
        onSubmit={(value) => {
          const to = value.trim();
          if (to && editing && to !== editing) onRenameGroup?.(editing, to);
          setEditing(null);
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  list: { paddingTop: space.xs, paddingBottom: space.xl, paddingRight: space.sm },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    paddingVertical: space.sm,
    paddingHorizontal: space.sm,
    borderRadius: radius.sm,
    marginTop: space.sm,
  },
  headerHover: { backgroundColor: colors.surfaceSunk },
  headerText: { ...type.label, color: colors.ink, fontSize: 14 },
  countPill: {
    backgroundColor: colors.surfaceSunk,
    borderRadius: radius.pill,
    paddingHorizontal: space.sm,
    paddingVertical: 1,
  },
  countText: { ...type.mono, color: colors.inkSoft },
  editBtn: { marginLeft: space.xs, padding: 2 },
  itemWrap: { marginBottom: space.sm },
  empty: { ...type.body, color: colors.inkSoft, textAlign: 'center', marginTop: space.xl },
});