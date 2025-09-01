import { FontFamilies } from '@/hooks/AppFonts';
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
    <View style={[
      styles.header, 
      { 
        backgroundColor: backgroundColor ? backgroundColor : 'transparent' 
      }
    ]}>
      <View style={styles.headerContent}>
        <Text style={[styles.title, { color: colors?.text || '#1a1a1a' }]}>
          {title}
        </Text>
        {subtitle && (
          <Text style={[styles.subtitle, { color: colors?.tabIconDefault || '#666' }]}>
            {subtitle}
          </Text>
        )}
      </View>
      
      {/* Decorative accent line */}
      <View style={[styles.accentLine, { backgroundColor: colors?.primary || '#58CC02' }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 24,
    paddingBottom: 20,
    backgroundColor: 'transparent',
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10},
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 3,
  },
  headerContent: {
    gap: 6,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    fontFamily: FontFamilies.featherBold,
  },
  subtitle: {
    fontSize: 17,
    fontFamily: FontFamilies.dinRounded,
    opacity: 0.8,
    fontWeight: '500',
  },
  accentLine: {
    height: 3,
    borderRadius: 1.5,
    width: 60,
    marginTop: 10,
  },
});
