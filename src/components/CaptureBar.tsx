import { useState } from 'react';
import {
    ActivityIndicator,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { colors } from '../constants/colors';
import { clay, glow, noOutline, radius, space, type } from '../constants/theme';

type Props = { onCapture: (text: string) => Promise<void> };

export function CaptureBar({ onCapture }: Props) {
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);

  async function send() {
    const value = text.trim();
    if (!value || busy) return;
    setBusy(true);
    try {
      await onCapture(value);
      setText('');
    } finally {
      setBusy(false);
    }
  }

  return (
    <View style={[clay, styles.bar]}>
      <TextInput
        style={[styles.input, noOutline]}
        placeholder="Catch a thought, link, or task…"
        placeholderTextColor={colors.inkFaint}
        value={text}
        onChangeText={setText}
        onSubmitEditing={send}
        returnKeyType="done"
        multiline
      />
      <Pressable style={[styles.button, glow]} onPress={send} disabled={busy}>
        {busy ? <ActivityIndicator color="#fff" /> : <Text style={styles.plus}>+</Text>}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: space.sm,
    gap: space.sm,
  },
  input: {
    ...type.body,
    flex: 1,
    paddingHorizontal: space.sm,
    paddingVertical: space.sm,
    maxHeight: 120,
  },
  button: {
    backgroundColor: colors.accent,
    width: 46,
    height: 46,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plus: { color: '#fff', fontSize: 26, fontWeight: '700', lineHeight: 28 },
});