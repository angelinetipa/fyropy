import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../constants/colors';
import { space, type } from '../constants/theme';

type Props = {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  headerRight?: ReactNode;
  children?: ReactNode;
};

export function Screen({ title, subtitle, onBack, headerRight, children }: Props) {
  const showTopRow = onBack || headerRight;
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <LinearGradient
        colors={[colors.accentGlow, 'transparent']}
        style={styles.glow}
        pointerEvents="none"
      />
      <View style={styles.header}>
        {showTopRow ? (
          <View style={styles.topRow}>
            {onBack ? (
              <Pressable onPress={onBack} hitSlop={8}>
                <Ionicons name="chevron-back" size={26} color={colors.ink} />
              </Pressable>
            ) : (
              <View />
            )}
            {headerRight ?? <View />}
          </View>
        ) : null}
        <Text style={type.display}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      <View style={styles.body}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  glow: { position: 'absolute', top: 0, left: 0, right: 0, height: 220 },
  header: {
    paddingHorizontal: space.lg,
    paddingTop: space.lg,
    paddingBottom: space.md,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: space.sm,
  },
  subtitle: { ...type.body, color: colors.inkSoft, marginTop: space.xs },
  body: { flex: 1, paddingHorizontal: space.lg },
});