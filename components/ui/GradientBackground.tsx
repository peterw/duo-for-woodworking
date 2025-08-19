import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { View, ViewStyle } from 'react-native';

interface GradientBackgroundProps {
  children: React.ReactNode;
  style?: ViewStyle;
  colors?: string[];
  start?: { x: number; y: number };
  end?: { x: number; y: number };
}

export function GradientBackground({
  children,
  style,
  colors = ['#8B4513', '#D2691E', '#CD853F'],
  start = { x: 0, y: 0 },
  end = { x: 1, y: 1 },
}: GradientBackgroundProps) {
  return (
    <View style={[{ flex: 1, backgroundColor: '#000000' }, style]}>
      <LinearGradient
        colors={colors}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
        start={start}
        end={end}
      />
      {children}
    </View>
  );
}
