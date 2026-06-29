import {
    Modal,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { colors } from '../constants/colors';
import { clay, radius, space, type } from '../constants/theme';

type Props = {
  visible: boolean;
  title?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function ConfirmModal({
  visible,
  title = 'Are you sure?',
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  danger = false,
  onCancel,
  onConfirm,
}: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <Pressable style={styles.backdrop} onPress={onCancel}>
        <Pressable style={[clay, styles.card]} onPress={(e) => e.stopPropagation?.()}>
          <Text style={styles.heading}>{title}</Text>
          {message ? <Text style={styles.message}>{message}</Text> : null}

          <View style={styles.actions}>
            <Pressable style={styles.cancel} onPress={onCancel}>
              <Text style={styles.cancelText}>{cancelLabel}</Text>
            </Pressable>
            <Pressable
              style={[styles.confirm, danger && styles.confirmDanger]}
              onPress={onConfirm}
            >
              <Text style={styles.confirmText}>{confirmLabel}</Text>
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
  heading: { ...type.title, marginBottom: space.sm },
  message: { ...type.body, color: colors.inkSoft, lineHeight: 22 },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: space.sm,
    marginTop: space.lg,
  },
  cancel: { paddingVertical: space.sm, paddingHorizontal: space.md, borderRadius: radius.md },
  cancelText: { ...type.label, color: colors.inkSoft },
  confirm: {
    paddingVertical: space.sm,
    paddingHorizontal: space.lg,
    borderRadius: radius.md,
    backgroundColor: colors.accent,
  },
  confirmDanger: { backgroundColor: colors.accentSunk },
  confirmText: { ...type.label, color: '#fff' },
});