import { FlatList, StyleSheet, Text } from 'react-native';
import { ItemCard } from '../../src/components/ItemCard';
import { Screen } from '../../src/components/Screen';
import { SearchBar } from '../../src/components/SearchBar';
import { colors } from '../../src/constants/colors';
import { space, type as typo } from '../../src/constants/theme';
import { useItems } from '../../src/hooks/useItems';

export default function Tasks() {
  const { items, loading, query, setQuery, toggleDone, remove } = useItems(['task']);

  return (
    <Screen title="Tasks" subtitle="Things to do.">
      <SearchBar value={query} onChange={setQuery} />
      <FlatList
        style={{ flex: 1, minHeight: 0 }}
        data={items}
        keyExtractor={(it) => it.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <ItemCard item={item} onToggleDone={toggleDone} onDelete={remove} />
        )}
        ListEmptyComponent={
          !loading ? (
            <Text style={styles.empty}>
              {query ? 'No matches.' : 'No tasks yet. Capture one in the Inbox.'}
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