import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { colors } from '../constants/colors';
import { inset, noOutline, radius, space, type } from '../constants/theme';

type Props = { value: string; onChange: (v: string) => void };

export function SearchBar({ value, onChange }: Props) {
  return (
    <View style={[inset, styles.wrap]}>
      <Ionicons name="search" size={18} color={colors.inkFaint} />
      <TextInput
        style={[styles.input, noOutline]}
        placeholder="Search…"
        placeholderTextColor={colors.inkFaint}
        value={value}
        onChangeText={onChange}
        autoCapitalize="none"
      />
      {value ? (
        <Pressable onPress={() => onChange('')} hitSlop={8}>
          <Ionicons name="close-circle" size={18} color={colors.inkFaint} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    borderRadius: radius.pill,
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
    marginBottom: space.sm,
  },
  input: { ...type.body, flex: 1, paddingVertical: 2 },
});