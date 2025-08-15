import { Colors, ThemeColorTypes } from "@/constants/Colors";

export const hexToRgbA = (hex: string, alpha: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// Get app color with opacity and theme support
export const getAppColor = (
    colorKey: keyof ThemeColorTypes,
    opacity: number = 1,
    isDarkTheme: boolean = false,
  ): string => {
    const colors = isDarkTheme ? Colors.dark : Colors.light;
    const color = colors[colorKey as keyof typeof colors];
    
    if (opacity === 1) {
      return color as string;
    }
    
    return hexToRgbA(color as string, opacity);
  }; 