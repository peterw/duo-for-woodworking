export const AppFonts = {
  // Font sizes (inspired by Duolingo's typography scale)
  13: 13,
  14: 14,
  16: 16,
  18: 18,
  20: 20,
  24: 24,
  28: 28,
  32: 32,
  36: 36,
  48: 48,
} as const;

// Duolingo-style font families
export const FontFamilies = {
  // Primary font - Feather Bold (for headings, titles, emphasis)
  featherBold: 'Feather Bold',
  
  // Secondary font - DIN Next Rounded (for body text, buttons, UI elements)
  dinRounded: 'DIN Next Rounded LT Pro',
  
  // Fallback fonts
  system: 'System',
} as const;

// Typography styles inspired by Duolingo
export const Typography = {
  // Headings
  h1: {
    fontFamily: FontFamilies.featherBold,
    fontSize: 48,
    lineHeight: 56,
  },
  h2: {
    fontFamily: FontFamilies.featherBold,
    fontSize: 36,
    lineHeight: 44,
  },
  h3: {
    fontFamily: FontFamilies.featherBold,
    fontSize: 28,
    lineHeight: 36,
  },
  h4: {
    fontFamily: FontFamilies.featherBold,
    fontSize: 24,
    lineHeight: 32,
  },
  
  // Body text
  bodyLarge: {
    fontFamily: FontFamilies.dinRounded,
    fontSize: 18,
    lineHeight: 26,
  },
  bodyMedium: {
    fontFamily: FontFamilies.dinRounded,
    fontSize: 16,
    lineHeight: 24,
  },
  bodySmall: {
    fontFamily: FontFamilies.dinRounded,
    fontSize: 14,
    lineHeight: 20,
  },
  
  // Buttons and interactive elements
  buttonLarge: {
    fontFamily: FontFamilies.dinRounded,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: 'bold',
  },
  buttonMedium: {
    fontFamily: FontFamilies.dinRounded,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: 'bold',
  },
  buttonSmall: {
    fontFamily: FontFamilies.dinRounded,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: 'bold',
  },
  
  // Captions and labels
  caption: {
    fontFamily: FontFamilies.dinRounded,
    fontSize: 13,
    lineHeight: 18,
  },
} as const;
