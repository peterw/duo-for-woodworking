import { IconSymbol } from '@/components/ui/IconSymbol';
import { BorderRadius, Colors, Spacing } from '@/constants/DesignSystem';
import { useColorScheme } from '@/hooks/useColorScheme';
import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    TextInputProps,
    TextStyle,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native';

interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: string;
  rightIcon?: string;
  onRightIconPress?: () => void;
  containerStyle?: ViewStyle;
  inputStyle?: ViewStyle;
  labelStyle?: TextStyle;
  errorStyle?: TextStyle;
  helperStyle?: TextStyle;
  variant?: 'default' | 'outlined' | 'filled';
  size?: 'small' | 'medium' | 'large';
}

export function Input({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  onRightIconPress,
  containerStyle,
  inputStyle,
  labelStyle,
  errorStyle,
  helperStyle,
  variant = 'default',
  size = 'medium',
  ...textInputProps
}: InputProps) {
  const colorScheme = useColorScheme();
  const [isFocused, setIsFocused] = useState(false);

  const getContainerStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      marginBottom: Spacing.md,
    };

    return baseStyle;
  };

  const getInputContainerStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: BorderRadius.md,
      borderWidth: 1,
      backgroundColor: Colors.background,
    };

    // Size styles
    switch (size) {
      case 'small':
        baseStyle.paddingVertical = Spacing.sm;
        baseStyle.paddingHorizontal = Spacing.md;
        baseStyle.minHeight = 40;
        break;
      case 'large':
        baseStyle.paddingVertical = Spacing.md;
        baseStyle.paddingHorizontal = Spacing.lg;
        baseStyle.minHeight = 56;
        break;
      default: // medium
        baseStyle.paddingVertical = Spacing.md;
        baseStyle.paddingHorizontal = Spacing.md;
        baseStyle.minHeight = 48;
    }

    // Variant styles
    switch (variant) {
      case 'outlined':
        baseStyle.borderColor = error ? Colors.error : isFocused ? Colors.primary : Colors.gray200;
        baseStyle.backgroundColor = Colors.background;
        break;
      case 'filled':
        baseStyle.borderColor = 'transparent';
        baseStyle.backgroundColor = Colors.gray100;
        break;
      default:
        baseStyle.borderColor = error ? Colors.error : isFocused ? Colors.primary : Colors.gray200;
        baseStyle.backgroundColor = Colors.background;
    }

    if (isFocused) {
      baseStyle.borderWidth = 2;
    }

    return baseStyle;
  };

  const getInputStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      flex: 1,
      color: colors.text,
      fontSize: size === 'large' ? 18 : size === 'small' ? 14 : 16,
      fontWeight: '400',
    };

    return baseStyle;
  };

  const getLabelStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      color: colors.text,
      fontSize: size === 'large' ? 16 : size === 'small' ? 12 : 14,
      fontWeight: '500',
      marginBottom: 8,
    };

    return baseStyle;
  };

  const getErrorStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      color: colors.error,
      fontSize: size === 'small' ? 11 : 12,
      fontWeight: '400',
      marginTop: 4,
    };

    return baseStyle;
  };

  const getHelperStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      color: colors.tabIconDefault,
      fontSize: size === 'small' ? 11 : 12,
      fontWeight: '400',
      marginTop: 4,
    };

    return baseStyle;
  };

  const getIconSize = () => {
    switch (size) {
      case 'small':
        return 16;
      case 'large':
        return 22;
      default:
        return 20;
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    textInputProps.onFocus?.(undefined as any);
  };

  const handleBlur = () => {
    setIsFocused(false);
    textInputProps.onBlur?.(undefined as any);
  };

  return (
    <View style={[styles.container, getContainerStyle(), containerStyle]}>
      {label && (
        <Text style={[styles.label, getLabelStyle(), labelStyle]}>{label}</Text>
      )}
      
      <View style={[styles.inputContainer, getInputContainerStyle()]}>
        {leftIcon && (
          <IconSymbol
            name={leftIcon}
            size={getIconSize()}
            color={colors.tabIconDefault}
            style={styles.leftIcon}
          />
        )}
        
        <TextInput
          {...textInputProps}
          style={[styles.input, getInputStyle(), inputStyle]}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholderTextColor={colors.tabIconDefault}
        />
        
        {rightIcon && (
          <TouchableOpacity
            onPress={onRightIconPress}
            style={styles.rightIconContainer}
            disabled={!onRightIconPress}
          >
            <IconSymbol
              name={rightIcon}
              size={getIconSize()}
              color={onRightIconPress ? colors.tint : colors.tabIconDefault}
            />
          </TouchableOpacity>
        )}
      </View>
      
      {error && (
        <Text style={[styles.error, getErrorStyle(), errorStyle]}>{error}</Text>
      )}
      
      {helperText && !error && (
        <Text style={[styles.helper, getHelperStyle(), helperStyle]}>{helperText}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
  },
  leftIcon: {
    marginRight: 12,
  },
  rightIconContainer: {
    marginLeft: 12,
    padding: 4,
  },
  error: {
    fontWeight: '400',
  },
  helper: {
    fontWeight: '400',
  },
});
