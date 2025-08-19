import { FontFamilies, Typography } from '@/hooks/AppFonts';

// Duolingo-inspired Color Palette
export const Colors = {
  // Primary Colors (Duolingo Green)
  primary: '#58cc02',
  primaryDark: '#46a102',
  primaryLight: '#7ed321',
  
  // Secondary Colors
  secondary: '#ff9600',
  secondaryDark: '#e6850e',
  secondaryLight: '#ffb84d',
  
  // Success & Progress
  success: '#58cc02',
  warning: '#ff9600',
  error: '#ff4b4b',
  info: '#4a90e2',
  
  // Neutral Colors
  white: '#ffffff',
  black: '#000000',
  gray50: '#f8f9fa',
  gray100: '#e9ecef',
  gray200: '#dee2e6',
  gray300: '#ced4da',
  gray400: '#adb5bd',
  gray500: '#6c757d',
  gray600: '#495057',
  gray700: '#343a40',
  gray800: '#212529',
  gray900: '#1a1d20',
  
  // Background Colors
  background: '#f8f9fa',
  surface: '#ffffff',
  card: '#ffffff',
  
  // Text Colors
  textPrimary: '#2c3e50',
  textSecondary: '#495057',
  textTertiary: '#6c757d',
  textInverse: '#ffffff',
  
  // Woodworking Theme Colors
  wood: {
    light: '#d4a574',
    medium: '#8b4513',
    dark: '#654321',
    accent: '#cd853f',
  },
} as const;

// Spacing Scale (Duolingo-style)
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
} as const;

// Border Radius (Duolingo-style rounded corners)
export const BorderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  round: 50,
} as const;

// Shadows (Duolingo-style elevation)
export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 12,
  },
} as const;

// Component Styles
export const ComponentStyles = {
  // Card Styles
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  
  // Button Styles
  button: {
    primary: {
      backgroundColor: Colors.primary,
      borderRadius: BorderRadius.md,
      paddingVertical: Spacing.md,
      paddingHorizontal: Spacing.lg,
      fontFamily: FontFamilies.dinRounded,
      fontSize: 16,
      lineHeight: 22,
      fontWeight: 'bold',
      color: Colors.textInverse,
      textAlign: 'center',
      overflow: 'hidden',
    },
    secondary: {
      backgroundColor: Colors.white,
      borderWidth: 2,
      borderColor: Colors.primary,
      borderRadius: BorderRadius.md,
      paddingVertical: Spacing.md,
      paddingHorizontal: Spacing.lg,
      fontFamily: FontFamilies.dinRounded,
      fontSize: 16,
      lineHeight: 22,
      fontWeight: 'bold',
      color: Colors.primary,
      textAlign: 'center',
    },
    outline: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: Colors.gray300,
      borderRadius: BorderRadius.md,
      paddingVertical: Spacing.md,
      paddingHorizontal: Spacing.lg,
      fontFamily: FontFamilies.dinRounded,
      fontSize: 16,
      lineHeight: 22,
      fontWeight: 'bold',
      color: Colors.textPrimary,
      textAlign: 'center',
    },
    ghost: {
      backgroundColor: 'transparent',
      borderRadius: BorderRadius.md,
      paddingVertical: Spacing.md,
      paddingHorizontal: Spacing.lg,
      fontFamily: FontFamilies.dinRounded,
      fontSize: 16,
      lineHeight: 22,
      fontWeight: 'bold',
      color: Colors.primary,
      textAlign: 'center',
    },
  },
  
  // Input Styles
  input: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.gray200,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    fontFamily: FontFamilies.dinRounded,
    fontSize: 16,
    lineHeight: 24,
    color: Colors.textPrimary,
  },
  
  // Badge Styles
  badge: {
    primary: {
      backgroundColor: Colors.primary,
      borderRadius: BorderRadius.round,
      paddingVertical: Spacing.xs,
      paddingHorizontal: Spacing.sm,
      fontFamily: FontFamilies.dinRounded,
      fontSize: 13,
      lineHeight: 18,
      color: Colors.textInverse,
    },
    secondary: {
      backgroundColor: Colors.gray100,
      borderRadius: BorderRadius.round,
      paddingVertical: Spacing.xs,
      paddingHorizontal: Spacing.sm,
      fontFamily: FontFamilies.dinRounded,
      fontSize: 13,
      lineHeight: 18,
      color: Colors.textSecondary,
    },
    success: {
      backgroundColor: Colors.success,
      borderRadius: BorderRadius.round,
      paddingVertical: Spacing.xs,
      paddingHorizontal: Spacing.sm,
      fontFamily: FontFamilies.dinRounded,
      fontSize: 13,
      lineHeight: 18,
      color: Colors.textInverse,
    },
    warning: {
      backgroundColor: Colors.warning,
      borderRadius: BorderRadius.round,
      paddingVertical: Spacing.xs,
      paddingHorizontal: Spacing.sm,
      fontFamily: FontFamilies.dinRounded,
      fontSize: 13,
      lineHeight: 18,
      color: Colors.textInverse,
    },
  },
  
  // Progress Bar Styles
  progressBar: {
    container: {
      backgroundColor: Colors.gray200,
      borderRadius: BorderRadius.round,
      height: 8,
      overflow: 'hidden',
    },
    fill: {
      backgroundColor: Colors.primary,
      height: '100%',
      borderRadius: BorderRadius.round,
    },
  },
  
  // Lesson Card Styles
  lessonCard: {
    container: {
      backgroundColor: Colors.white,
      borderRadius: BorderRadius.lg,
      padding: Spacing.lg,
      marginBottom: Spacing.md,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: Spacing.md,
    },
    title: {
      fontFamily: FontFamilies.featherBold,
      fontSize: 24,
      lineHeight: 32,
      color: Colors.textPrimary,
      flex: 1,
    },
    difficulty: {
      fontFamily: FontFamilies.dinRounded,
      fontSize: 13,
      lineHeight: 18,
      color: Colors.textSecondary,
    },
    description: {
      fontFamily: FontFamilies.dinRounded,
      fontSize: 16,
      lineHeight: 24,
      color: Colors.textSecondary,
      marginBottom: Spacing.md,
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    progress: {
      fontFamily: FontFamilies.dinRounded,
      fontSize: 13,
      lineHeight: 18,
      color: Colors.textTertiary,
    },
  },
  
  // Achievement Styles
  achievement: {
    container: {
      backgroundColor: Colors.white,
      borderRadius: BorderRadius.lg,
      padding: Spacing.lg,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    icon: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: Colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: Spacing.md,
    },
    title: {
      fontFamily: FontFamilies.featherBold,
      fontSize: 24,
      lineHeight: 32,
      color: Colors.textPrimary,
      textAlign: 'center',
      marginBottom: Spacing.xs,
    },
    description: {
      fontFamily: FontFamilies.dinRounded,
      fontSize: 14,
      lineHeight: 20,
      color: Colors.textSecondary,
      textAlign: 'center',
    },
  },
} as const;

// Layout Constants
export const Layout = {
  // Screen Dimensions
  screenPadding: Spacing.lg,
  screenPaddingHorizontal: Spacing.lg,
  screenPaddingVertical: Spacing.lg,
  
  // Content Width
  contentMaxWidth: 400,
  
  // Header Heights
  headerHeight: 56,
  tabBarHeight: 80,
  
  // Card Dimensions
  cardMinHeight: 120,
  cardMaxWidth: 350,
  
  // Button Dimensions
  buttonHeight: 48,
  buttonMinWidth: 120,
  
  // Input Dimensions
  inputHeight: 48,
  inputMinWidth: 200,
} as const;

// Animation Constants
export const Animations = {
  // Durations
  fast: 200,
  normal: 300,
  slow: 500,
  
  // Easing
  easeInOut: 'ease-in-out',
  easeOut: 'ease-out',
  easeIn: 'ease-in',
  
  // Scale Values
  scale: {
    pressed: 0.95,
    hover: 1.02,
    active: 1.05,
  },
} as const;

// Export everything
export default {
  Colors,
  Spacing,
  BorderRadius,
  Shadows,
  ComponentStyles,
  Layout,
  Animations,
  Typography,
  FontFamilies,
};
