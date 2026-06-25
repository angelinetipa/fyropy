import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { CaptureBar } from '../../src/components/CaptureBar';
import { Screen } from '../../src/components/Screen';
import { colors } from '../../src/constants/colors';
import { clay, space, type } from '../../src/constants/theme';
import { useItems } from '../../src/hooks/useItems';
import { Item } from '../../src/types';

export default function Inbox() {
  const { items, loading, add } = useItems();
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
        renderItem={({ item }) => <Row item={item} />}
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

function Row({ item }: { item: Item }) {
  return (
    <View style={[clay, styles.row]}>
      <Text style={styles.rowText}>{item.raw_text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { padding: space.md },
  rowText: { ...type.body },
  empty: { ...type.body, color: colors.inkSoft, textAlign: 'center', marginTop: space.xl },
});