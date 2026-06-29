import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../constants/colors';
import { clay, radius, space, type as typo } from '../constants/theme';
import { Item, ItemType } from '../types';

const TYPE_COLOR: Record<ItemType, string> = {
  task: colors.accent,
  idea: '#8B6CF6',
  note: colors.inkSoft,
};

type Props = {
  item: Item;
  triaging?: boolean;
  onToggleDone?: (item: Item) => void;
  onDelete?: (item: Item) => void;
};

export function ItemCard({ item, triaging, onToggleDone, onDelete }: Props) {
  return (
    <View style={[clay, styles.row]}>
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

        <Text style={[styles.text, item.done && styles.done]}>{item.raw_text}</Text>

        {onDelete ? (
          <Pressable onPress={() => onDelete(item)} hitSlop={8}>
            <Ionicons name="trash-outline" size={18} color={colors.inkFaint} />
          </Pressable>
        ) : null}
      </View>

      {triaging ? (
        <Text style={styles.sorting}>sorting…</Text>
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
          {item.summary ? <Text style={styles.summary}>{item.summary}</Text> : null}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { padding: space.md },
  top: { flexDirection: 'row', alignItems: 'flex-start', gap: space.sm },
  check: { paddingTop: 1 },
  text: { ...typo.body, flex: 1 },
  done: { textDecorationLine: 'line-through', color: colors.inkFaint },
  sorting: { ...typo.caption, color: colors.accent, marginTop: space.sm, fontStyle: 'italic' },
  meta: { marginTop: space.sm },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: space.xs, alignItems: 'center' },
  typeChip: { paddingHorizontal: space.sm, paddingVertical: 2, borderRadius: radius.pill },
  typeText: { color: '#fff', fontSize: 11, fontWeight: '700', textTransform: 'uppercase' },
  tag: {
    paddingHorizontal: space.sm, paddingVertical: 2,
    borderRadius: radius.pill, backgroundColor: colors.surfaceSunk,
  },
  tagText: { ...typo.caption, color: colors.inkSoft },
  summary: { ...typo.caption, color: colors.inkSoft, marginTop: space.xs },
});