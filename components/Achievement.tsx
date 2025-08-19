import { IconSymbol } from '@/components/ui/IconSymbol';
import { BorderRadius, Colors, ComponentStyles, Spacing } from '@/constants/DesignSystem';
import { FontFamilies } from '@/hooks/AppFonts';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface AchievementProps {
  title: string;
  description: string;
  icon: string;
  iconColor?: string;
  isUnlocked: boolean;
  progress?: number; // 0-100, only for locked achievements
  onPress?: () => void;
}

export const Achievement: React.FC<AchievementProps> = ({
  title,
  description,
  icon,
  iconColor,
  isUnlocked,
  progress = 0,
  onPress,
}) => {
  const defaultIconColor = isUnlocked ? Colors.primary : Colors.gray400;
  const finalIconColor = iconColor || defaultIconColor;

  return (
    <TouchableOpacity
      style={[
        ComponentStyles.achievement.container,
        !isUnlocked && styles.locked,
      ]}
      onPress={onPress}
      disabled={!isUnlocked}
      activeOpacity={0.8}
    >
      {/* Icon */}
      <View style={[
        ComponentStyles.achievement.icon,
        { backgroundColor: finalIconColor }
      ]}>
        <IconSymbol 
          name={icon} 
          size={32} 
          color={Colors.white} 
        />
      </View>

      {/* Title */}
      <Text style={[
        ComponentStyles.achievement.title,
        !isUnlocked && styles.lockedTitle
      ]}>
        {title}
      </Text>

      {/* Description */}
      <Text style={[
        ComponentStyles.achievement.description,
        !isUnlocked && styles.lockedDescription
      ]}>
        {description}
      </Text>

      {/* Progress for locked achievements */}
      {!isUnlocked && progress > 0 && (
        <View style={styles.progressContainer}>
          <View style={ComponentStyles.progressBar.container}>
            <View
              style={[
                ComponentStyles.progressBar.fill,
                { width: `${progress}%` }
              ]}
            />
          </View>
          <Text style={styles.progressText}>{progress}%</Text>
        </View>
      )}

      {/* Lock indicator for locked achievements */}
      {!isUnlocked && (
        <View style={styles.lockIndicator}>
          <IconSymbol name="lock.fill" size={16} color={Colors.gray400} />
        </View>
      )}

      {/* Unlock animation indicator */}
      {isUnlocked && (
        <View style={styles.unlockIndicator}>
          <IconSymbol name="checkmark.circle.fill" size={20} color={Colors.success} />
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  locked: {
    opacity: 0.7,
  },
  lockedTitle: {
    color: Colors.textSecondary,
  },
  lockedDescription: {
    color: Colors.textTertiary,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  progressText: {
    fontFamily: FontFamilies.dinRounded,
    fontSize: 13,
    lineHeight: 18,
    color: Colors.textTertiary,
    fontWeight: '600',
    minWidth: 40,
    textAlign: 'right',
  },
  lockIndicator: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.round,
    padding: Spacing.xs,
    ...ComponentStyles.badge.secondary,
  },
  unlockIndicator: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.round,
    padding: Spacing.xs,
  },
});
