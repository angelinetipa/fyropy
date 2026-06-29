import { FlatList, StyleSheet, Text } from 'react-native';
import { ItemCard } from '../../src/components/ItemCard';
import { Screen } from '../../src/components/Screen';
import { colors } from '../../src/constants/colors';
import { space, type as typo } from '../../src/constants/theme';
import { useItems } from '../../src/hooks/useItems';

export default function Notes() {
  const { items, loading, remove } = useItems(['note', 'idea']);

  return (
    <Screen title="Notes" subtitle="Things to keep.">
      <FlatList
        data={items}
        keyExtractor={(it) => it.id}
        contentContainerStyle={{ paddingVertical: space.md, gap: space.sm }}
        renderItem={({ item }) => <ItemCard item={item} onDelete={remove} />}
        ListEmptyComponent={
          !loading ? (
            <Text style={styles.empty}>No notes or ideas yet.</Text>
          ) : null
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  empty: { ...typo.body, color: colors.inkSoft, textAlign: 'center', marginTop: space.xl },
});