import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable, StyleSheet,
  Text, TextInput,
  View,
} from 'react-native';
import { colors } from '../../src/constants/colors';
import { clay, glow, inset, noOutline, radius, space, type } from '../../src/constants/theme';
import { supabase } from '../../src/lib/supabase';

function friendly(message: string): string {
  const m = message.toLowerCase();
  if (m.includes('invalid login')) return 'Wrong email or password.';
  if (m.includes('already registered')) return 'That email already has an account — sign in instead.';
  if (m.includes('email not confirmed')) return 'Please confirm your email first, then sign in.';
  if (m.includes('password')) return 'Password must be at least 6 characters.';
  return message;
}

export default function Login() {
  const [mode, setMode] = useState<'in' | 'up'>('in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const notify = (msg: string) =>
    Platform.OS === 'web' ? window.alert(msg) : Alert.alert('Fyropy', msg);

  async function submit() {
    setError('');
    if (!email.trim() || !password) {
      setError('Enter your email and password.');
      return;
    }
    if (mode === 'up' && password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setBusy(true);
    const { error: err } =
      mode === 'in'
        ? await supabase.auth.signInWithPassword({ email: email.trim(), password })
        : await supabase.auth.signUp({ email: email.trim(), password });
    setBusy(false);
    if (err) setError(friendly(err.message));
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
          style={[inset, styles.input, noOutline]}
          placeholder="Email"
          placeholderTextColor={colors.inkFaint}
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={(v) => { setEmail(v); setError(''); }}
        />
        <TextInput
          style={[inset, styles.input, noOutline]}
          placeholder="Password"
          placeholderTextColor={colors.inkFaint}
          secureTextEntry
          value={password}
          onChangeText={(v) => { setPassword(v); setError(''); }}
          onSubmitEditing={submit}
          returnKeyType="done"
        />

        {mode === 'up' ? (
          <Text style={styles.hint}>Use at least 6 characters.</Text>
        ) : null}
        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Pressable
          onPress={submit}
          disabled={busy}
          style={({ hovered, pressed }) => [
            styles.button, glow,
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
          {busy ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>{mode === 'in' ? 'Sign in' : 'Sign up'}</Text>
          )}
        </Pressable>

        <Pressable onPress={() => { setMode(mode === 'in' ? 'up' : 'in'); setError(''); }}>
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
  logo: { ...type.display, color: colors.accent, fontSize: 44 },
  tag: { ...type.body, color: colors.inkSoft, marginTop: space.xs },
  card: { padding: space.lg },
  heading: { ...type.title, marginBottom: space.md },
  input: {
    borderRadius: radius.md,
    paddingHorizontal: space.md,
    paddingVertical: space.md,
    ...type.body,
    marginBottom: space.sm,
  },
  hint: { ...type.caption, marginBottom: space.xs },
  error: { ...type.label, color: colors.accentSunk, marginBottom: space.sm },
  button: {
    borderRadius: radius.md,
    paddingVertical: space.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: space.sm,
    overflow: 'hidden',
  },
  btnHover: { transform: [{ scale: 1.02 }] },
  btnPress: { transform: [{ scale: 0.98 }] },
  buttonText: { ...type.label, color: '#fff', fontSize: 16 },
  switch: { ...type.label, color: colors.accent, textAlign: 'center', marginTop: space.md },
});