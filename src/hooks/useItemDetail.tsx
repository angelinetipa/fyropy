import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text, TextInput,
  View,
} from 'react-native';
import { ConfirmModal } from '../components/ConfirmModal';
import { colors } from '../constants/colors';
import { clay, noOutline, radius, space, type } from '../constants/theme';
import { timeAgo } from '../lib/time';
import { Item, ItemType } from '../types';

const TYPE_COLOR: Record<ItemType, string> = {
  task: colors.accent,
  idea: colors.idea,
  note: colors.inkSoft,
};

const INPUT_MIN = 60;
const INPUT_MAX = 320;

type Actions = {
  onSaveText: (item: Item, text: string) => void | Promise<void>;
  onDelete: (item: Item) => void | Promise<void>;
  onToggleDone?: (item: Item) => void | Promise<void>;
};

export function useItemDetail(actions: Actions) {
  const [item, setItem] = useState<Item | null>(null);
  const open = (it: Item) => setItem(it);
  const close = () => setItem(null);

  const element = item ? (
    <DetailInner key={item.id} item={item} actions={actions} onClose={close} />
  ) : null;

  return { open, element };
}

function DetailInner({
  item, actions, onClose,
}: { item: Item; actions: Actions; onClose: () => void }) {
  const [text, setText] = useState(item.raw_text);
  const [done, setDone] = useState(item.done);
  const [busy, setBusy] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [inputH, setInputH] = useState(0);

  const changed = text.trim() !== item.raw_text && text.trim().length > 0;
  const inputHeight = inputH
    ? Math.min(Math.max(inputH, INPUT_MIN), INPUT_MAX)
    : INPUT_MIN;

  async function saveAndSort() {
    setBusy(true);
    try {
      await actions.onSaveText(item, text);
      onClose();
    } finally {
      setBusy(false);
    }
  }

  function toggleDone() {
    setDone((d) => !d);
    actions.onToggleDone?.(item);
  }

  async function del() {
    setConfirmDelete(false);
    await actions.onDelete(item);
    onClose();
  }

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={[clay, styles.card]} onPress={(e) => e.stopPropagation?.()}>
          <View style={styles.head}>
            <Text style={styles.time}>{timeAgo(item.created_at)}</Text>
            <Pressable onPress={onClose} hitSlop={8}>
              <Ionicons name="close" size={22} color={colors.inkSoft} />
            </Pressable>
          </View>

          <ScrollView style={styles.scroll} keyboardShouldPersistTaps="handled">
            <TextInput
              style={[styles.input, noOutline, { height: inputHeight }]}
              value={text}
              onChangeText={setText}
              onContentSizeChange={(e) => setInputH(e.nativeEvent.contentSize.height)}
              multiline
              scrollEnabled
              placeholder="Your thought…"
              placeholderTextColor={colors.inkFaint}
            />

            {item.type ? (
              <View style={styles.chipRow}>
                <View style={[styles.typeChip, { backgroundColor: TYPE_COLOR[item.type] }]}>
                  <Text style={styles.typeText}>{item.type}</Text>
                </View>
                {item.group_name ? (
                  <View style={styles.groupChip}>
                    <Text style={styles.groupText}>{item.group_name}</Text>
                  </View>
                ) : null}
                {item.tags?.map((t) => (
                  <View key={t} style={styles.tag}>
                    <Text style={styles.tagText}>#{t}</Text>
                  </View>
                ))}
              </View>
            ) : null}

            {item.summary ? <Text style={styles.summary}>{item.summary}</Text> : null}
          </ScrollView>

          <Pressable style={styles.primary} onPress={saveAndSort} disabled={busy}>
            {busy ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.primaryText}>
                {changed ? 'Save & re-sort' : 'Re-sort with AI'}
              </Text>
            )}
          </Pressable>

          <View style={styles.footer}>
            {item.type === 'task' && actions.onToggleDone ? (
              <Pressable style={styles.footBtn} onPress={toggleDone}>
                <Ionicons
                  name={done ? 'checkmark-circle' : 'ellipse-outline'}
                  size={18}
                  color={done ? colors.good : colors.inkSoft}
                />
                <Text style={styles.footText}>{done ? 'Done' : 'Mark done'}</Text>
              </Pressable>
            ) : (
              <View />
            )}
            <Pressable style={styles.footBtn} onPress={() => setConfirmDelete(true)}>
              <Ionicons name="trash-outline" size={18} color={colors.accentSunk} />
              <Text style={[styles.footText, { color: colors.accentSunk }]}>Delete</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>

      <ConfirmModal
        visible={confirmDelete}
        title="Delete this?"
        message="This thought will be gone for good. You can't undo it."
        confirmLabel="Delete"
        danger
        onCancel={() => setConfirmDelete(false)}
        onConfirm={del}
      />
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
  card: { width: '100%', maxWidth: 460, maxHeight: '85%', padding: space.lg },
  head: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  time: { ...type.mono, color: colors.inkFaint },
  scroll: { marginTop: space.sm },
  input: {
    ...type.body,
    fontSize: 18,
    lineHeight: 26,
    minHeight: INPUT_MIN,
    paddingVertical: space.sm,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space.xs,
    alignItems: 'center',
    marginTop: space.sm,
  },
  typeChip: { paddingHorizontal: space.sm, paddingVertical: 3, borderRadius: radius.pill },
  typeText: {
    ...type.mono, color: '#fff', fontSize: 10, letterSpacing: 0.5, textTransform: 'uppercase',
  },
  groupChip: {
    paddingHorizontal: space.sm, paddingVertical: 3, borderRadius: radius.pill,
    backgroundColor: 'rgba(255,122,47,0.12)',
  },
  groupText: { ...type.mono, color: colors.accentSunk },
  tag: {
    paddingHorizontal: space.sm, paddingVertical: 3, borderRadius: radius.pill,
    backgroundColor: colors.surfaceSunk,
  },
  tagText: { ...type.mono, color: colors.inkSoft },
  summary: { ...type.body, color: colors.inkSoft, marginTop: space.md, lineHeight: 22 },
  primary: {
    backgroundColor: colors.accent, borderRadius: radius.md,
    paddingVertical: space.md, alignItems: 'center', marginTop: space.lg,
  },
  primaryText: { ...type.label, color: '#fff', fontSize: 15 },
  footer: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginTop: space.md,
  },
  footBtn: { flexDirection: 'row', alignItems: 'center', gap: space.xs, padding: space.sm },
  footText: { ...type.label, color: colors.inkSoft },
});