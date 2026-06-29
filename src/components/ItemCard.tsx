import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../constants/colors';
import { clay, clayHover, radius, space, transition, type } from '../constants/theme';
import { timeAgo } from '../lib/time';
import { Item, ItemType } from '../types';

const TYPE_COLOR: Record<ItemType, string> = {
  task: colors.accent,
  idea: colors.idea,
  note: colors.inkSoft,
};

type Props = {
  item: Item;
  triaging?: boolean;
  onToggleDone?: (item: Item) => void;
  onDelete?: (item: Item) => void;
  onPress?: (item: Item) => void;
};

export function ItemCard({ item, triaging, onToggleDone, onDelete, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress ? () => onPress(item) : undefined}
      style={({ hovered, pressed }) => [
        clay,
        transition,
        styles.row,
        hovered && clayHover,
        hovered && styles.lift,
        pressed && styles.press,
      ]}
    >
      <View style={styles.top}>
        {onToggleDone && item.type === 'task' ? (
          <Pressable onPress={() => onToggleDone(item)} hitSlop={8} style={styles.check}>
            <Ionicons
              name={item.done ? 'checkmark-circle' : 'ellipse-outline'}
              size={24}
              color={item.done ? colors.good : colors.inkFaint}
            />
          </Pressable>
        ) : null}

        <Text
          style={[styles.text, item.done && styles.done]}
          numberOfLines={4}
          ellipsizeMode="tail"
        >
          {item.raw_text}
        </Text>

        {onDelete ? (
          <Pressable onPress={() => onDelete(item)} hitSlop={8} style={styles.trash}>
            <Ionicons name="trash-outline" size={18} color={colors.inkFaint} />
          </Pressable>
        ) : null}
      </View>

      {triaging ? (
        <View style={styles.sortingRow}>
          <View style={styles.dot} />
          <Text style={styles.sorting}>sorting…</Text>
        </View>
      ) : item.type ? (
        <View style={styles.meta}>
          <View style={styles.chipRow}>
            <View style={[styles.typeChip, { backgroundColor: TYPE_COLOR[item.type] }]}>
              <Text style={styles.typeText}>{item.type}</Text>
            </View>
            {item.tags?.map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>#{tag}</Text>
              </View>
            ))}
          </View>
          {item.summary ? (
            <Text style={styles.summary} numberOfLines={2} ellipsizeMode="tail">
              {item.summary}
            </Text>
          ) : null}
        </View>
      ) : null}

      <Text style={styles.time}>{timeAgo(item.created_at)}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { padding: space.md },
  lift: { transform: [{ translateY: -3 }] },
  press: { transform: [{ translateY: -1 }] },
  top: { flexDirection: 'row', alignItems: 'flex-start', gap: space.sm },
  check: { paddingTop: 1 },
  text: { ...type.bodyMedium, flex: 1, flexShrink: 1, minWidth: 0, lineHeight: 22 },
  done: { textDecorationLine: 'line-through', color: colors.inkFaint },
  trash: { paddingTop: 1 },
  sortingRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: space.sm },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.accent },
  sorting: { ...type.mono, color: colors.accent },
  meta: { marginTop: space.sm },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: space.xs, alignItems: 'center' },
  typeChip: { paddingHorizontal: space.sm, paddingVertical: 3, borderRadius: radius.pill },
  typeText: {
    ...type.mono,
    color: '#fff',
    fontSize: 10,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  tag: {
    paddingHorizontal: space.sm,
    paddingVertical: 3,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceSunk,
  },
  tagText: { ...type.mono, color: colors.inkSoft },
  summary: { ...type.caption, color: colors.inkSoft, marginTop: space.xs, lineHeight: 18 },
  time: { ...type.mono, color: colors.inkFaint, fontSize: 10, marginTop: space.sm },
});