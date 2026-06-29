import { FlatList, StyleSheet, Text } from 'react-native';
import { ItemCard } from '../../src/components/ItemCard';
import { Screen } from '../../src/components/Screen';
import { colors } from '../../src/constants/colors';
import { space, type as typo } from '../../src/constants/theme';
import { useItems } from '../../src/hooks/useItems';

export default function Tasks() {
  const { items, loading, toggleDone, remove } = useItems(['task']);

  return (
    <Screen title="Tasks" subtitle="Things to do.">
      <FlatList
        data={items}
        keyExtractor={(it) => it.id}
        contentContainerStyle={{ paddingVertical: space.md, gap: space.sm }}
        renderItem={({ item }) => (
          <ItemCard item={item} onToggleDone={toggleDone} onDelete={remove} />
        )}
        ListEmptyComponent={
          !loading ? (
            <Text style={styles.empty}>No tasks yet. Capture one in the Inbox.</Text>
          ) : null
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  empty: { ...typo.body, color: colors.inkSoft, textAlign: 'center', marginTop: space.xl },
});