import { useState } from 'react';
import {
    ActivityIndicator, Alert, Platform,
    Pressable, StyleSheet,
    Text, TextInput,
    View,
} from 'react-native';
import { colors } from '../../src/constants/colors';
import { clay, radius, space, type } from '../../src/constants/theme';
import { supabase } from '../../src/lib/supabase';

export default function Login() {
  const [mode, setMode] = useState<'in' | 'up'>('in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  const notify = (msg: string) =>
    Platform.OS === 'web' ? window.alert(msg) : Alert.alert('Fyropy', msg);

  async function submit() {
    if (!email || !password) return notify('Enter email and password.');
    setBusy(true);
    const { error } =
      mode === 'in'
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });
    setBusy(false);
    if (error) notify(error.message);
    else if (mode === 'up') notify('Account created. You can sign in now.');
  }

  return (
    <View style={styles.wrap}>
      <View style={styles.brand}>
        <Text style={styles.logo}>Fyropy</Text>
        <Text style={styles.tag}>Catch it. Keep it.</Text>
      </View>

      <View style={[clay, styles.card]}>
        <Text style={styles.heading}>
          {mode === 'in' ? 'Welcome back' : 'Create account'}
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={colors.inkFaint}
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={colors.inkFaint}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Pressable style={styles.button} onPress={submit} disabled={busy}>
          {busy ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>
              {mode === 'in' ? 'Sign in' : 'Sign up'}
            </Text>
          )}
        </Pressable>

        <Pressable onPress={() => setMode(mode === 'in' ? 'up' : 'in')}>
          <Text style={styles.switch}>
            {mode === 'in' ? "No account? Sign up" : 'Have an account? Sign in'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1, backgroundColor: colors.bg, justifyContent: 'center',
    padding: space.lg, maxWidth: 460, width: '100%', alignSelf: 'center',
  },
  brand: { alignItems: 'center', marginBottom: space.xl },
  logo: { ...type.display, color: colors.accent, fontSize: 40 },
  tag: { ...type.body, color: colors.inkSoft, marginTop: space.xs },
  card: { padding: space.lg },
  heading: { ...type.title, marginBottom: space.md },
  input: {
    backgroundColor: colors.surfaceSunk, borderRadius: radius.md,
    paddingHorizontal: space.md, paddingVertical: space.md,
    fontSize: 16, color: colors.ink, marginBottom: space.sm,
  },
  button: {
    backgroundColor: colors.accent, borderRadius: radius.md,
    paddingVertical: space.md, alignItems: 'center', marginTop: space.sm,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  switch: { ...type.label, color: colors.accent, textAlign: 'center', marginTop: space.md },
});