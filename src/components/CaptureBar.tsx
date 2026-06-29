import { LinearGradient } from 'expo-linear-gradient';
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
import {
    clay, glow, glowHover, noOutline, radius, space, transition, type,
} from '../constants/theme';

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
      <Pressable
        onPress={send}
        disabled={busy}
        style={({ hovered, pressed }) => [
          styles.button,
          glow,
          transition,
          hovered && glowHover,
          hovered && styles.btnHover,
          pressed && styles.btnPress,
        ]}
      >
        <LinearGradient
          colors={[colors.accentSoft, colors.accent, colors.accentSunk]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
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
    marginBottom: space.md,
  },
  input: {
    ...type.body,
    flex: 1,
    paddingHorizontal: space.sm,
    paddingVertical: space.sm,
    maxHeight: 120,
  },
  button: {
    width: 46,
    height: 46,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  btnHover: { transform: [{ scale: 1.06 }] },
  btnPress: { transform: [{ scale: 0.95 }] },
  plus: { color: '#fff', fontSize: 26, fontWeight: '700', lineHeight: 28 },
});