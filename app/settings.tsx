import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Platform,
    Pressable, StyleSheet,
    Text, TextInput,
    View,
} from 'react-native';
import { Screen } from '../src/components/Screen';
import { colors } from '../src/constants/colors';
import { clay, radius, space, type } from '../src/constants/theme';
import { supabase } from '../src/lib/supabase';
import { AiProvider, getSettings, saveSettings } from '../src/services/settings';

export default function Settings() {
  const router = useRouter();
  const [provider, setProvider] = useState<AiProvider>('gemini');
  const [key, setKey] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const notify = (m: string) =>
    Platform.OS === 'web' ? window.alert(m) : Alert.alert('Fyropy', m);

  useEffect(() => {
    getSettings()
      .then((s) => {
        if (s.ai_provider) setProvider(s.ai_provider);
        if (s.ai_key) setKey(s.ai_key);
      })
      .finally(() => setLoading(false));
  }, []);

  async function save() {
    setSaving(true);
    try {
      await saveSettings({ ai_provider: provider, ai_key: key.trim() || null });
      notify('Saved.');
    } catch (e: any) {
      notify(e.message ?? 'Could not save.');
    } finally {
      setSaving(false);
    }
  }

  async function signOut() {
    await supabase.auth.signOut(); // auth listener routes back to /login
  }

  return (
    <Screen title="Settings" onBack={() => router.back()}>
      {loading ? (
        <ActivityIndicator color={colors.accent} style={{ marginTop: space.xl }} />
      ) : (
        <>
          <View style={[clay, styles.card]}>
            <Text style={styles.label}>AI provider</Text>
            <View style={styles.row}>
              {(['gemini', 'groq'] as AiProvider[]).map((p) => (
                <Pressable
                  key={p}
                  style={[styles.pill, provider === p && styles.pillOn]}
                  onPress={() => setProvider(p)}
                >
                  <Text style={[styles.pillText, provider === p && styles.pillTextOn]}>
                    {p === 'gemini' ? 'Gemini' : 'Groq'}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text style={[styles.label, { marginTop: space.md }]}>API key</Text>
            <TextInput
              style={styles.input}
              placeholder="Paste your free API key"
              placeholderTextColor={colors.inkFaint}
              autoCapitalize="none"
              secureTextEntry
              value={key}
              onChangeText={setKey}
            />
            <Text style={styles.hint}>
              Bring your own key — free tier from Gemini or Groq. Saved only to your account.
            </Text>

            <Pressable style={styles.saveBtn} onPress={save} disabled={saving}>
              {saving ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.saveText}>Save</Text>
              )}
            </Pressable>
          </View>

          <Pressable style={styles.signOut} onPress={signOut}>
            <Text style={styles.signOutText}>Sign out</Text>
          </Pressable>
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { padding: space.lg, marginTop: space.sm },
  label: { ...type.label },
  row: { flexDirection: 'row', gap: space.sm, marginTop: space.sm },
  pill: {
    paddingVertical: space.sm, paddingHorizontal: space.md,
    borderRadius: radius.pill, backgroundColor: colors.surfaceSunk,
  },
  pillOn: { backgroundColor: colors.accent },
  pillText: { ...type.label, color: colors.inkSoft },
  pillTextOn: { color: '#fff' },
  input: {
    backgroundColor: colors.surfaceSunk, borderRadius: radius.md,
    paddingHorizontal: space.md, paddingVertical: space.md,
    fontSize: 16, color: colors.ink, marginTop: space.sm,
  },
  hint: { ...type.caption, marginTop: space.sm },
  saveBtn: {
    backgroundColor: colors.accent, borderRadius: radius.md,
    paddingVertical: space.md, alignItems: 'center', marginTop: space.lg,
  },
  saveText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  signOut: {
    marginTop: space.lg, paddingVertical: space.md, alignItems: 'center',
  },
  signOutText: { ...type.label, color: colors.accent },
});