import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { CaptureBar } from '../../src/components/CaptureBar';
import { Screen } from '../../src/components/Screen';
import { colors } from '../../src/constants/colors';
import { clay, radius, space, type as typo } from '../../src/constants/theme';
import { useItems } from '../../src/hooks/useItems';
import { Item, ItemType } from '../../src/types';

const TYPE_COLOR: Record<ItemType, string> = {
  task: colors.accent,
  idea: '#8B6CF6',
  note: colors.inkSoft,
};

export default function Inbox() {
  const { items, loading, triagingIds, add } = useItems();
  const router = useRouter();

  return (
    <Screen
      title="Inbox"
      subtitle="Catch it. Keep it."
      headerRight={
        <Pressable onPress={() => router.push('/settings')} hitSlop={8}>
          <Ionicons name="settings-outline" size={22} color={colors.inkSoft} />
        </Pressable>
      }
    >
      <CaptureBar onCapture={add} />
      <FlatList
        data={items}
        keyExtractor={(it) => it.id}
        contentContainerStyle={{ paddingVertical: space.md, gap: space.sm }}
        renderItem={({ item }) => (
          <Row item={item} triaging={triagingIds.has(item.id)} />
        )}
        ListEmptyComponent={
          !loading ? (
            <Text style={styles.empty}>
              Nothing caught yet. Drop your first thought above.
            </Text>
          ) : null
        }
      />
    </Screen>
  );
}

function Row({ item, triaging }: { item: Item; triaging: boolean }) {
  return (
    <View style={[clay, styles.row]}>
      <Text style={styles.rowText}>{item.raw_text}</Text>

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
          {item.summary ? (
            <Text style={styles.summary}>{item.summary}</Text>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { padding: space.md },
  rowText: { ...typo.body },
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
  empty: { ...typo.body, color: colors.inkSoft, textAlign: 'center', marginTop: space.xl },
});