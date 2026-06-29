import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text } from 'react-native';
import { CaptureBar } from '../../src/components/CaptureBar';
import { ItemCard } from '../../src/components/ItemCard';
import { Screen } from '../../src/components/Screen';
import { SearchBar } from '../../src/components/SearchBar';
import { colors } from '../../src/constants/colors';
import { space, type as typo } from '../../src/constants/theme';
import { useItemDetail } from '../../src/hooks/useItemDetail';
import { useItems } from '../../src/hooks/useItems';

export default function Inbox() {
  const { items, loading, triagingIds, query, setQuery, add, saveText, toggleDone, remove } =
    useItems();
  const router = useRouter();
  const detail = useItemDetail({ onSaveText: saveText, onDelete: remove, onToggleDone: toggleDone });

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
      <SearchBar value={query} onChange={setQuery} />
      <FlatList
        style={{ flex: 1, minHeight: 0 }}
        data={items}
        keyExtractor={(it) => it.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <ItemCard
            item={item}
            triaging={triagingIds.has(item.id)}
            onToggleDone={toggleDone}
            onDelete={remove}
            onPress={detail.open}
          />
        )}
        ListEmptyComponent={
          !loading ? (
            <Text style={styles.empty}>
              {query ? 'No matches.' : 'Nothing caught yet. Drop your first thought above.'}
            </Text>
          ) : null
        }
      />
      {detail.element}
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { paddingTop: space.xs, paddingBottom: space.xl, paddingRight: space.sm, gap: space.sm },
  empty: { ...typo.body, color: colors.inkSoft, textAlign: 'center', marginTop: space.xl },
});