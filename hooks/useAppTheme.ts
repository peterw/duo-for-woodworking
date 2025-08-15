import { Colors } from '@/constants/Colors';
import { useColorScheme } from 'react-native';

export const useAppTheme = () => {
  const colorScheme = useColorScheme();
  const isDarkTheme = colorScheme === 'dark';
  const appTheme = Colors[colorScheme ?? 'light'];

  return {
    isDarkTheme,
    appTheme,
  };
};
