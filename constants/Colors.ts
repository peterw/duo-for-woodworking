/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#8B4513'; // Wood theme primary color
const tintColorDark = '#fff';
export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    backgroundSecondary: '#f8f9fa',
    backgroundTertiary: '#f1f3f4',
    tint: tintColorLight,
    primary: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    textSecondary: '#687076',
    textTertiary: '#9BA1A6',
    white: '#ffffff',
    success: '#4CAF50',
    error: '#F44336',
    border: '#E0E0E0',
    // Wood theme colors for tab bar
    tabBarBackground: '#8B4513',
    tabBarActiveBackground: 'rgba(255, 255, 255, 0.15)',
    tabBarInactiveBackground: 'transparent',
    tabBarActiveText: '#ffffff',
    tabBarInactiveText: 'rgba(255, 255, 255, 0.7)',
    // Difficulty colors
    difficulty: {
      beginner: '#4CAF50',
      intermediate: '#FF9800',
      advanced: '#F44336',
    },
    // Streak and progress colors
    streak: '#FF6B6B',
    trophy: '#4ECDC4',
    hammer: '#45B7D1',
    star: '#96CEB4',
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    backgroundSecondary: '#1B1C1E',
    backgroundTertiary: '#1B1D1F',
    tint: tintColorDark,
    primary: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    textSecondary: '#9BA1A6',
    textTertiary: '#687076',
    white: '#ffffff',
    success: '#4CAF50',
    error: '#F44336',
    border: '#2C2C2E',
    // Wood theme colors for tab bar
    tabBarBackground: '#8B4513',
    tabBarActiveBackground: 'rgba(255, 255, 255, 0.15)',
    tabBarInactiveBackground: 'transparent',
    tabBarActiveText: '#ffffff',
    tabBarInactiveText: 'rgba(255, 255, 255, 0.7)',
    // Difficulty colors
    difficulty: {
      beginner: '#4CAF50',
      intermediate: '#FF9800',
      advanced: '#F44336',
    },
    // Streak and progress colors
    streak: '#FF6B6B',
    trophy: '#4ECDC4',
    hammer: '#45B7D1',
    star: '#96CEB4',
  },
};
export type ThemeColorTypes = {
  text: string;
  background: string;
  backgroundSecondary: string;
  backgroundTertiary: string;
  tint: string;
  primary: string;
  icon: string;
  tabIconDefault: string;
  tabIconSelected: string;
  textSecondary: string;
  textTertiary: string;
  white: string;
  success: string;
  error: string;
  border: string;
  tabBarBackground: string;
  tabBarActiveBackground: string;
  tabBarInactiveBackground: string;
  tabBarActiveText: string;
  tabBarInactiveText: string;
  difficulty: {
    beginner: string;
    intermediate: string;
    advanced: string;
  };
  streak: string;
  trophy: string;
  hammer: string;
  star: string;
};
