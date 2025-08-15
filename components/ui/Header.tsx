import { useAppTheme } from '@/hooks/useAppTheme';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showSafeArea?: boolean;
  backgroundColor?: string;
}

export function Header({ title, subtitle, showSafeArea = true, backgroundColor = '#fff' }: HeaderProps) {
  const { appTheme: colors } = useAppTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.header, showSafeArea && { paddingTop: insets.top, backgroundColor: backgroundColor ? backgroundColor : 'transparent' }]}>
      <Text style={[styles.title, { color: colors?.text || '#1a1a1a' }]}>
        {title}
      </Text>
      {subtitle && (
        <Text style={[styles.subtitle, { color: colors?.tabIconDefault || '#666' }]}>
          {subtitle}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
});
