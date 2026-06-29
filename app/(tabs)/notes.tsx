import { FlatList, StyleSheet, Text } from 'react-native';
import { ItemCard } from '../../src/components/ItemCard';
import { Screen } from '../../src/components/Screen';
import { SearchBar } from '../../src/components/SearchBar';
import { colors } from '../../src/constants/colors';
import { space, type as typo } from '../../src/constants/theme';
import { useItems } from '../../src/hooks/useItems';

export default function Notes() {
  const { items, loading, query, setQuery, remove } = useItems(['note', 'idea']);

  return (
    <Screen title="Notes" subtitle="Things to keep.">
      <SearchBar value={query} onChange={setQuery} />
      <FlatList
        style={{ flex: 1, minHeight: 0 }}
        data={items}
        keyExtractor={(it) => it.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => <ItemCard item={item} onDelete={remove} />}
        ListEmptyComponent={
          !loading ? (
            <Text style={styles.empty}>
              {query ? 'No matches.' : 'No notes or ideas yet.'}
            </Text>
          ) : null
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { paddingTop: space.xs, paddingBottom: space.xl, paddingRight: space.sm, gap: space.sm },
  empty: { ...typo.body, color: colors.inkSoft, textAlign: 'center', marginTop: space.xl },
});