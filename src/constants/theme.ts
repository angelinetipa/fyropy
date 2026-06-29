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
  md: 18,
  lg: 26,
  pill: 999,
} as const;

/** Font families (loaded in app/_layout.tsx) */
export const fonts = {
  display: 'SpaceGrotesk_700Bold',
  displaySemi: 'SpaceGrotesk_600SemiBold',
  body: 'Manrope_400Regular',
  bodyMedium: 'Manrope_500Medium',
  bodySemi: 'Manrope_600SemiBold',
  bodyBold: 'Manrope_700Bold',
  mono: 'JetBrainsMono_500Medium',
  monoBold: 'JetBrainsMono_700Bold',
} as const;

/** Type scale — custom fonts carry their own weight, so no fontWeight here */
export const type = {
  display: { fontFamily: fonts.display, fontSize: 30, color: colors.ink },
  title: { fontFamily: fonts.displaySemi, fontSize: 20, color: colors.ink },
  body: { fontFamily: fonts.body, fontSize: 16, color: colors.ink },
  bodyMedium: { fontFamily: fonts.bodyMedium, fontSize: 16, color: colors.ink },
  label: { fontFamily: fonts.bodySemi, fontSize: 13, color: colors.inkSoft },
  mono: { fontFamily: fonts.mono, fontSize: 11, color: colors.inkSoft },
  caption: { fontFamily: fonts.body, fontSize: 12.5, color: colors.inkFaint },
} as const;

/** Claymorphism: soft raised surface with inner highlight */
export const clay = Platform.select({
  web: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    boxShadow:
      'inset 0 1px 0 rgba(255,255,255,0.9), 0 12px 28px rgba(150,90,40,0.10), 0 2px 6px rgba(150,90,40,0.06)',
  },
  default: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    shadowColor: '#9A5A28',
    shadowOpacity: 0.18,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 5,
  },
}) as object;

/** Glowing accent — for primary buttons */
export const glow = Platform.select({
  web: { boxShadow: '0 8px 20px rgba(255,122,47,0.35)' },
  default: {
    shadowColor: colors.accent,
    shadowOpacity: 0.4,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
}) as object;

/** Sunk / inset surface — for inputs */
export const inset = Platform.select({
  web: {
    backgroundColor: colors.surfaceSunk,
    boxShadow: 'inset 0 2px 5px rgba(150,90,40,0.10)',
  },
  default: { backgroundColor: colors.surfaceSunk },
}) as object;

/** Remove the default blue/black focus ring on web inputs */
export const noOutline = Platform.select({
  web: { outlineStyle: 'none' },
  default: {},
}) as object;