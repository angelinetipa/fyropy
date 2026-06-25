import { Platform } from 'react-native';
import { colors } from './colors';

/** 4pt spacing scale */
export const space = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

/** Soft, rounded cards */
export const radius = {
  sm: 12,
  md: 20,
  lg: 28,
  pill: 999,
} as const;

/** Type scale */
export const type = {
  display: { fontSize: 32, fontWeight: '700' as const, color: colors.ink },
  title: { fontSize: 22, fontWeight: '700' as const, color: colors.ink },
  body: { fontSize: 16, fontWeight: '400' as const, color: colors.ink },
  label: { fontSize: 13, fontWeight: '600' as const, color: colors.inkSoft },
  caption: { fontSize: 12, fontWeight: '400' as const, color: colors.inkFaint },
} as const;

/**
 * Claymorphism: soft raised surface.
 * Web supports layered/inset shadows; native gets a single soft drop.
 */
export const clay = Platform.select({
  web: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    boxShadow:
      '0 10px 24px rgba(120, 80, 40, 0.10), inset 0 1px 0 rgba(255,255,255,0.8)',
  },
  default: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    shadowColor: '#7A5028',
    shadowOpacity: 0.16,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
}) as object;
