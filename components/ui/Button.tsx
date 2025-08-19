import { IconSymbol } from '@/components/ui/IconSymbol';
import { BorderRadius, Colors, Spacing } from '@/constants/DesignSystem';
import { useColorScheme } from '@/hooks/useColorScheme';
import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
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
  const isDarkTheme = colorScheme === 'dark';
  
  const [isPressed, setIsPressed] = useState(false);
  const [buttonTranslateY] = useState(new Animated.Value(0));
  const [bottomLayerOpacity] = useState(new Animated.Value(1));
  const [iconScaleValue] = useState(new Animated.Value(1));
  const [textScale] = useState(new Animated.Value(1));
  const [glowOpacity] = useState(new Animated.Value(0));
  
  const buttonRef = useRef<any>(null);

  const handlePressIn = () => {
    if (disabled || loading) return;
    
    setIsPressed(true);
    
    Animated.parallel([
      Animated.timing(buttonTranslateY, {
        toValue: 4,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.timing(iconScaleValue, {
        toValue: 0.95,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.timing(textScale, {
        toValue: 0.98,
        duration: 120,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.timing(bottomLayerOpacity, {
      toValue: 0.5,
      duration: 120,
      useNativeDriver: false,
    }).start();
  };

  const handlePressOut = () => {
    if (disabled || loading) return;
    
    setIsPressed(false);
    
    Animated.parallel([
      Animated.timing(buttonTranslateY, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(iconScaleValue, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(textScale, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.timing(bottomLayerOpacity, {
      toValue: 1,
      duration: 180,
      useNativeDriver: false,
    }).start();
  };

  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: variant === 'ghost' ? BorderRadius.round : BorderRadius.md,
      borderWidth: variant === 'outline' ? 2 : 0,
    };

    // Size styles
    switch (size) {
      case 'small':
        baseStyle.paddingVertical = variant === 'ghost' ? 0 : Spacing.sm;
        baseStyle.paddingHorizontal = variant === 'ghost' ? 0 : Spacing.md;
        baseStyle.minHeight = variant === 'ghost' ? 0 : 40;
        break;
      case 'large':
        baseStyle.paddingVertical = variant === 'ghost' ? 0 : Spacing.md;
        baseStyle.paddingHorizontal = variant === 'ghost' ? 0 : Spacing.lg;
        baseStyle.minHeight = variant === 'ghost' ? 0 : 56;
        break;
      default: // medium
        baseStyle.paddingVertical = variant === 'ghost' ? 0 : Spacing.md;
        baseStyle.paddingHorizontal = variant === 'ghost' ? 0 : Spacing.md;
        baseStyle.minHeight = variant === 'ghost' ? 0 : 48;
    }

    // Variant styles
    switch (variant) {
      case 'primary':
        baseStyle.backgroundColor = Colors.primary;
        baseStyle.borderWidth = 1;
        baseStyle.borderColor = Colors.primary;
        break;
      case 'secondary':
        baseStyle.backgroundColor = isDarkTheme ? 'rgba(255, 255, 255, 0.08)' : Colors.white;
        baseStyle.borderWidth = 1;
        baseStyle.borderColor = isDarkTheme ? 'rgba(255, 255, 255, 0.15)' : Colors.gray300;
        break;
      case 'outline':
        baseStyle.backgroundColor = 'transparent';
        baseStyle.borderColor = Colors.primary;
        break;
      case 'ghost':
        baseStyle.backgroundColor = 'transparent';
        break;
    }

    if (disabled) {
      baseStyle.opacity = 0.6;
    }

    return baseStyle;
  };

  const getTextStyle = (): TextStyle => {
    const baseTextStyle: TextStyle = {
      fontWeight: '600',
      textAlign: 'center',
      letterSpacing: 0.5,
    };

    // Size styles
    switch (size) {
      case 'small':
        baseTextStyle.fontSize = 14;
        baseTextStyle.lineHeight = 20;
        break;
      case 'large':
        baseTextStyle.fontSize = 18;
        baseTextStyle.lineHeight = 26;
        break;
      default: // medium
        baseTextStyle.fontSize = 16;
        baseTextStyle.lineHeight = 24;
    }

    // Check if custom background color is provided via style prop
    const hasCustomBackground = style && (style as any).backgroundColor;
    
    // Variant styles
    switch (variant) {
      case 'primary':
        baseTextStyle.color = hasCustomBackground ? Colors.textPrimary : 'white';
        break;
      case 'secondary':
        baseTextStyle.color = hasCustomBackground ? Colors.textPrimary : Colors.primary;
        break;
      case 'outline':
        baseTextStyle.color = Colors.primary;
        break;
      case 'ghost':
        baseTextStyle.color = Colors.primary;
        break;
    }

    return baseTextStyle;
  };

  const getIconColor = () => {
    // Check if custom background color is provided via style prop
    const hasCustomBackground = style && (style as any).backgroundColor;
    
    if (variant === 'primary') {
      return hasCustomBackground ? Colors.textPrimary : 'white';
    }
    return Colors.primary;
  };

  const getFinalIconColor = () => {
    // If textStyle has a custom color, use that for the icon too
    if (textStyle && (textStyle as any).color) {
      return (textStyle as any).color;
    }
    return getIconColor();
  };

  const getIconSize = (): number => {
    switch (size) {
      case 'small':
        return 16;
      case 'large':
        return 20;
      default: // medium
        return 18;
    }
  };

  const getEnhancedButtonStyle = () => {
    const baseStyle = {
      opacity: disabled ? 0.6 : 1,
    };

    // Ghost variant has no shadows
    if (variant === 'ghost') {
      return baseStyle;
    }

    if (isPressed) {
      return {
        ...baseStyle,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: isDarkTheme ? 0.05 : 0.02,
        shadowRadius: isDarkTheme ? 4 : 3,
        elevation: isDarkTheme ? 3 : 2,
      };
    }

    return {
      ...baseStyle,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: isDarkTheme ? 10 : 6 },
      shadowOpacity: isDarkTheme ? 0.2 : 0.1,
      shadowRadius: isDarkTheme ? 16 : 12,
      elevation: isDarkTheme ? 12 : 8,
    };
  };

  const getBottomLayerColor = () => {
    return isDarkTheme ? 'rgba(0, 0, 0, 0.35)' : 'rgba(0, 0, 0, 0.18)';
  };

  const getGlowColor = () => {
    if (variant === 'primary') {
      return Colors.primary + '40';
    }
    return 'transparent';
  };

  const renderIcon = () => {
    if (!icon || loading) return null;
    
    return (
      <Animated.View style={{
        transform: [{ scale: iconScaleValue }],
        marginLeft: iconPosition === 'right' ? 8 : 0,
        marginRight: iconPosition === 'left' ? 8 : 0,
      }}>
        <IconSymbol
          name={icon}
          size={getIconSize()}
          color={getFinalIconColor()}
        />
      </Animated.View>
    );
  };

  // For ghost variant, render simple button without 3D effects
  if (variant === 'ghost') {
    return (
      <TouchableOpacity
        ref={buttonRef}
        style={[
          styles.ghostButton,
          getButtonStyle(),
          style,
        ]}
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

  return (
    <View style={styles.buttonWrapper}>
      {/* 3D Bottom Layer */}
      <Animated.View style={[
        styles.bottomLayer,
        {
          backgroundColor: getBottomLayerColor(),
          borderRadius: 16,
          opacity: bottomLayerOpacity,
        }
      ]} />
      
      {/* Secondary Shadow Layer */}
      <View style={[
        styles.secondaryShadowLayer,
        {
          backgroundColor: isDarkTheme ? 'rgba(0, 0, 0, 0.15)' : 'rgba(0, 0, 0, 0.04)',
          borderRadius: 16,
          transform: [{ translateY: 8 }],
        }
      ]} />
      
      {/* Glow Effect */}
      <Animated.View style={[
        styles.glowLayer,
        {
          backgroundColor: getGlowColor(),
          borderRadius: 16,
          opacity: glowOpacity,
        }
      ]} />
      
      {/* Main Button */}
      <Animated.View
        style={[
          styles.buttonContainer,
          {
            transform: [{ translateY: buttonTranslateY }],
          }
        ]}
      >
        <TouchableOpacity
          ref={buttonRef}
          style={[
            styles.button,
            getButtonStyle(),
            getEnhancedButtonStyle(),
            style,
          ]}
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={disabled || loading}
          activeOpacity={1}
        >
          {loading ? (
            <ActivityIndicator color={getFinalIconColor()} size="small" />
          ) : (
            <>
              {iconPosition === 'left' && renderIcon()}
              <Animated.View style={{ transform: [{ scale: textScale }] }}>
                <Text style={[styles.text, getTextStyle(), textStyle]}>{title}</Text>
              </Animated.View>
              {iconPosition === 'right' && renderIcon()}
            </>
          )}
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonWrapper: {
    position: 'relative',
    marginVertical: 12,
    marginHorizontal: 8,
  },
  bottomLayer: {
    position: 'absolute',
    top: 6,
    left: 0,
    right: 0,
    bottom: -6,
    zIndex: 1,
  },
  secondaryShadowLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2,
  },
  glowLayer: {
    position: 'absolute',
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    zIndex: 0,
  },
  buttonContainer: {
    borderRadius: 16,
    zIndex: 3,
  },
  button: {
    borderRadius: 16,
    borderWidth: 1,
    position: 'relative',
  },
  ghostButton: {
    borderRadius: 70,
    borderWidth: 0,
    position: 'relative',
    padding: 0,
    margin: 0,
  },
  text: {
    fontWeight: '600',
  },
});
