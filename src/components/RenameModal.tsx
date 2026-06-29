import { useEffect, useState } from 'react';
import {
    Modal,
    Pressable, StyleSheet,
    Text, TextInput,
    View,
} from 'react-native';
import { colors } from '../constants/colors';
import { clay, noOutline, radius, space, type } from '../constants/theme';

type Props = {
  visible: boolean;
  initial: string;
  title?: string;
  onCancel: () => void;
  onSubmit: (value: string) => void;
};

export function RenameModal({ visible, initial, title = 'Rename group', onCancel, onSubmit }: Props) {
  const [value, setValue] = useState(initial);

  useEffect(() => {
    if (visible) setValue(initial);
  }, [visible, initial]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <Pressable style={styles.backdrop} onPress={onCancel}>
        <Pressable style={[clay, styles.card]} onPress={(e) => e.stopPropagation?.()}>
          <Text style={styles.heading}>{title}</Text>
          <TextInput
            style={[styles.input, noOutline]}
            value={value}
            onChangeText={setValue}
            placeholder="Group name"
            placeholderTextColor={colors.inkFaint}
            autoFocus
            onSubmitEditing={() => onSubmit(value)}
            returnKeyType="done"
          />
          <View style={styles.actions}>
            <Pressable style={styles.cancel} onPress={onCancel}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
            <Pressable style={styles.save} onPress={() => onSubmit(value)}>
              <Text style={styles.saveText}>Save</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(36,31,27,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: space.lg,
  },
  card: { width: '100%', maxWidth: 380, padding: space.lg },
  heading: { ...type.title, marginBottom: space.md },
  input: {
    backgroundColor: colors.surfaceSunk,
    borderRadius: radius.md,
    paddingHorizontal: space.md,
    paddingVertical: space.md,
    ...type.body,
  },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', gap: space.sm, marginTop: space.lg },
  cancel: { paddingVertical: space.sm, paddingHorizontal: space.md, borderRadius: radius.md },
  cancelText: { ...type.label, color: colors.inkSoft },
  save: {
    paddingVertical: space.sm,
    paddingHorizontal: space.lg,
    borderRadius: radius.md,
    backgroundColor: colors.accent,
  },
  saveText: { ...type.label, color: '#fff' },
});