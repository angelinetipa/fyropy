/**
 * Fyropy palette — "fire opal"
 * Warm cream base, charcoal ink, one glowing amber accent.
 */
export const colors = {
  // Backgrounds
  bg: '#FBF4EA',          // soft cream
  surface: '#FFFFFF',     // card
  surfaceSunk: '#F3E9DA', // pressed / inset

  // Ink (text)
  ink: '#241F1B',         // near-charcoal
  inkSoft: '#6B615A',     // secondary
  inkFaint: '#A89C90',    // hints, placeholders

  // Fire-opal accent
  accent: '#FF7A2F',      // glowing orange
  accentSoft: '#FFB06B',  // lighter glow
  accentSunk: '#E85F12',  // pressed

  // Utility
  line: '#EADfce',        // hairline borders
  good: '#3FA66B',        // done / success
  warn: '#E0A93F',
} as const;

export type ColorKey = keyof typeof colors;
