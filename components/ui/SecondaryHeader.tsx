import React from 'react';
import { StyleProp, StyleSheet, Text, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import { IconSymbol } from './IconSymbol';

interface SecondaryHeaderProps {
  title: string;
  onBack: () => void;
  style?: ViewStyle;
  titleStyle?: StyleProp<TextStyle>;
}

export function SecondaryHeader({ title, onBack, style, titleStyle }: SecondaryHeaderProps) {
  return (
    <View style={[styles.header, style]}>
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <IconSymbol name="chevron.left" size={24} color="#FFFFFF" />
      </TouchableOpacity>
      
      <Text style={[styles.title, titleStyle]}>
        {title}
      </Text>
      
      <View style={styles.spacer} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  spacer: {
    width: 40,
  },
});
