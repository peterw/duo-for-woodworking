import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  iconPosition?: 'left' | 'right';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'right',
  style,
  textStyle,
}: ButtonProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 70,
      borderWidth: variant === 'outline' ? 2 : 0,
    };

    // Size styles
    switch (size) {
      case 'small':
        baseStyle.paddingVertical = 8;
        baseStyle.paddingHorizontal = 16;
        break;
      case 'large':
        baseStyle.paddingVertical = 16;
        baseStyle.paddingHorizontal = 32;
        break;
      default: // medium
        baseStyle.paddingVertical = 12;
        baseStyle.paddingHorizontal = 24;
    }

    // Variant styles
    switch (variant) {
      case 'primary':
        baseStyle.backgroundColor = colors.tint;
        break;
      case 'secondary':
        baseStyle.backgroundColor = colors.tabIconDefault;
        break;
      case 'outline':
        baseStyle.backgroundColor = 'transparent';
        baseStyle.borderColor = colors.tint;
        break;
      case 'ghost':
        baseStyle.backgroundColor = 'transparent';
        break;
    }

    if (disabled) {
      baseStyle.opacity = 0.5;
    }

    return baseStyle;
  };

  const getTextStyle = (): TextStyle => {
    const baseTextStyle: TextStyle = {
      fontWeight: '600',
      textAlign: 'center',
    };

    // Size styles
    switch (size) {
      case 'small':
        baseTextStyle.fontSize = 14;
        break;
      case 'large':
        baseTextStyle.fontSize = 18;
        break;
      default: // medium
        baseTextStyle.fontSize = 16;
    }

    // Check if custom background color is provided via style prop
    const hasCustomBackground = style && (style as any).backgroundColor;
    
    // Variant styles
    switch (variant) {
      case 'primary':
        baseTextStyle.color = hasCustomBackground ? colors.text : 'white';
        break;
      case 'secondary':
        baseTextStyle.color = hasCustomBackground ? colors.text : 'white';
        break;
      case 'outline':
        baseTextStyle.color = colors.tint;
        break;
      case 'ghost':
        baseTextStyle.color = colors.tint;
        break;
    }

    return baseTextStyle;
  };

  const getIconColor = () => {
    // Check if custom background color is provided via style prop
    const hasCustomBackground = style && (style as any).backgroundColor;
    
    if (variant === 'primary' || variant === 'secondary') {
      return hasCustomBackground ? colors.text : 'white';
    }
    return colors.tint;
  };

  const getFinalIconColor = () => {
    // If textStyle has a custom color, use that for the icon too
    if (textStyle && (textStyle as any).color) {
      return (textStyle as any).color;
    }
    return getIconColor();
  };

  const renderIcon = () => {
    if (!icon || loading) return null;
    
    const iconSize = size === 'large' ? 20 : size === 'small' ? 16 : 18;
    
    return (
      <IconSymbol
        name={icon}
        size={iconSize}
        color={getFinalIconColor()}
        style={{ marginLeft: iconPosition === 'right' ? 8 : 0, marginRight: iconPosition === 'left' ? 8 : 0 }}
      />
    );
  };

  return (
    <TouchableOpacity
      style={[styles.button, getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={getFinalIconColor()} size="small" />
      ) : (
        <>
          {iconPosition === 'left' && renderIcon()}
          <Text style={[styles.text, getTextStyle(), textStyle]}>{title}</Text>
          {iconPosition === 'right' && renderIcon()}
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 48,
  },
  text: {
    fontWeight: '600',
  },
});
