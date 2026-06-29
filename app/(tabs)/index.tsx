import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text } from 'react-native';
import { CaptureBar } from '../../src/components/CaptureBar';
import { ItemCard } from '../../src/components/ItemCard';
import { Screen } from '../../src/components/Screen';
import { colors } from '../../src/constants/colors';
import { space, type as typo } from '../../src/constants/theme';
import { useItems } from '../../src/hooks/useItems';

export default function Inbox() {
  const { items, loading, triagingIds, add, toggleDone, remove } = useItems();
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
          <ItemCard
            item={item}
            triaging={triagingIds.has(item.id)}
            onToggleDone={toggleDone}
            onDelete={remove}
          />
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

const styles = StyleSheet.create({
  empty: { ...typo.body, color: colors.inkSoft, textAlign: 'center', marginTop: space.xl },
});