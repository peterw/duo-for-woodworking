import { useFonts } from 'expo-font';
import { FontFamilies } from './AppFonts';

export const useAppFonts = () => {
  const [fontsLoaded, fontError] = useFonts({
    [FontFamilies.featherBold]: require('../assets/fonts/Feather Bold.ttf'),
    [FontFamilies.dinRounded]: require('../assets/fonts/din-next-rounded-lt-pro-regular.ttf'),
  });

  return {
    fontsLoaded,
    fontError,
    // Helper to check if specific fonts are loaded
    isFontLoaded: (fontFamily: keyof typeof FontFamilies) => {
      return fontsLoaded;
    },
  };
};
