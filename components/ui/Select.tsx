import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import React, { useState } from 'react';
import {
    FlatList,
    Modal,
    StyleSheet,
    Text,
    TextStyle,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native';

interface SelectOption {
  label: string;
  value: string;
  description?: string;
}

interface SelectProps {
  label?: string;
  placeholder?: string;
  options: SelectOption[];
  value?: string;
  onValueChange: (value: string) => void;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
  errorStyle?: TextStyle;
  helperStyle?: TextStyle;
  size?: 'small' | 'medium' | 'large';
}

export function Select({
  label,
  placeholder = 'Select an option',
  options,
  value,
  onValueChange,
  error,
  helperText,
  disabled = false,
  containerStyle,
  labelStyle,
  errorStyle,
  helperStyle,
  size = 'medium',
}: SelectProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find(option => option.value === value);

  const getContainerStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      marginBottom: 16,
    };

    return baseStyle;
  };

  const getSelectStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderRadius: 12,
      borderWidth: 1,
      backgroundColor: colors.background,
    };

    // Size styles
    switch (size) {
      case 'small':
        baseStyle.paddingVertical = 8;
        baseStyle.paddingHorizontal = 12;
        baseStyle.minHeight = 40;
        break;
      case 'large':
        baseStyle.paddingVertical = 16;
        baseStyle.paddingHorizontal = 20;
        baseStyle.minHeight = 56;
        break;
      default: // medium
        baseStyle.paddingVertical = 12;
        baseStyle.paddingHorizontal = 16;
        baseStyle.minHeight = 48;
    }

    baseStyle.borderColor = error ? colors.error : colors.border;
    baseStyle.opacity = disabled ? 0.5 : 1;

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

  const getTextStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      color: selectedOption ? colors.text : colors.tabIconDefault,
      fontSize: size === 'large' ? 18 : size === 'small' ? 14 : 16,
      fontWeight: '400',
      flex: 1,
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

  const handleSelect = (optionValue: string) => {
    onValueChange(optionValue);
    setIsOpen(false);
  };

  const renderOption = ({ item }: { item: SelectOption }) => (
    <TouchableOpacity
      style={[
        styles.option,
        {
          backgroundColor: item.value === value ? colors.tint : colors.background,
          borderBottomColor: colors.border,
        }
      ]}
      onPress={() => handleSelect(item.value)}
    >
      <View style={styles.optionContent}>
        <Text
          style={[
            styles.optionLabel,
            {
              color: item.value === value ? 'white' : colors.text,
              fontSize: size === 'large' ? 18 : size === 'small' ? 14 : 16,
            }
          ]}
        >
          {item.label}
        </Text>
        {item.description && (
          <Text
            style={[
              styles.optionDescription,
              {
                color: item.value === value ? 'rgba(255,255,255,0.8)' : colors.tabIconDefault,
                fontSize: size === 'small' ? 11 : 12,
              }
            ]}
          >
            {item.description}
          </Text>
        )}
      </View>
      {item.value === value && (
        <IconSymbol name="checkmark" size={getIconSize()} color="white" />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, getContainerStyle(), containerStyle]}>
      {label && (
        <Text style={[styles.label, getLabelStyle(), labelStyle]}>{label}</Text>
      )}
      
      <TouchableOpacity
        style={[styles.select, getSelectStyle()]}
        onPress={() => !disabled && setIsOpen(true)}
        disabled={disabled}
        activeOpacity={0.8}
      >
        <Text style={[styles.selectText, getTextStyle()]}>
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <IconSymbol
          name="chevron.down"
          size={getIconSize()}
          color={colors.tabIconDefault}
        />
      </TouchableOpacity>
      
      {error && (
        <Text style={[styles.error, getErrorStyle(), errorStyle]}>{error}</Text>
      )}
      
      {helperText && !error && (
        <Text style={[styles.helper, getHelperStyle(), helperStyle]}>{helperText}</Text>
      )}

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
        >
          <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                {label || 'Select Option'}
              </Text>
              <TouchableOpacity onPress={() => setIsOpen(false)}>
                <IconSymbol name="xmark" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={options}
              renderItem={renderOption}
              keyExtractor={(item) => item.value}
              showsVerticalScrollIndicator={false}
              style={styles.optionsList}
            />
          </View>
        </TouchableOpacity>
      </Modal>
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
  select: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectText: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    borderRadius: 16,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  optionsList: {
    maxHeight: 400,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
  },
  optionContent: {
    flex: 1,
  },
  optionLabel: {
    fontWeight: '500',
    marginBottom: 2,
  },
  optionDescription: {
    fontWeight: '400',
  },
  error: {
    fontWeight: '400',
  },
  helper: {
    fontWeight: '400',
  },
});
