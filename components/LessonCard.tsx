import { IconSymbol } from '@/components/ui/IconSymbol';
import { BorderRadius, Colors, ComponentStyles, Spacing } from '@/constants/DesignSystem';
import { FontFamilies } from '@/hooks/AppFonts';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface LessonCardProps {
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  progress: number; // 0-100
  duration: string;
  onPress: () => void;
  isCompleted?: boolean;
  isLocked?: boolean;
}

export const LessonCard: React.FC<LessonCardProps> = ({
  title,
  description,
  difficulty,
  progress,
  duration,
  onPress,
  isCompleted = false,
  isLocked = false,
}) => {
  const getDifficultyColor = () => {
    switch (difficulty) {
      case 'Beginner':
        return Colors.success;
      case 'Intermediate':
        return Colors.warning;
      case 'Advanced':
        return Colors.error;
      default:
        return Colors.gray500;
    }
  };

  const getDifficultyIcon = () => {
    switch (difficulty) {
      case 'Beginner':
        return 'leaf.fill';
      case 'Intermediate':
        return 'flame.fill';
      case 'Advanced':
        return 'star.fill';
      default:
        return 'questionmark.circle.fill';
    }
  };

  const getProgressColor = () => {
    if (progress === 100) return Colors.success;
    if (progress > 50) return Colors.primary;
    return Colors.gray300;
  };

  return (
    <TouchableOpacity
      style={[
        ComponentStyles.lessonCard.container,
        isLocked && styles.locked,
        isCompleted && styles.completed,
      ]}
      onPress={onPress}
      disabled={isLocked}
      activeOpacity={0.8}
    >
      {/* Header */}
      <View style={ComponentStyles.lessonCard.header}>
        <View style={styles.titleContainer}>
          <Text style={ComponentStyles.lessonCard.title}>{title}</Text>
          {isCompleted && (
            <IconSymbol name="checkmark.circle.fill" size={20} color={Colors.success} />
          )}
        </View>
        
        <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor() }]}>
          <IconSymbol name={getDifficultyIcon()} size={12} color={Colors.white} />
          <Text style={styles.difficultyText}>{difficulty}</Text>
        </View>
      </View>

      {/* Description */}
      <Text style={ComponentStyles.lessonCard.description}>{description}</Text>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={ComponentStyles.progressBar.container}>
          <View
            style={[
              ComponentStyles.progressBar.fill,
              { width: `${progress}%`, backgroundColor: getProgressColor() }
            ]}
          />
        </View>
        <Text style={styles.progressText}>{progress}%</Text>
      </View>

      {/* Footer */}
      <View style={ComponentStyles.lessonCard.footer}>
        <View style={styles.durationContainer}>
          <IconSymbol name="clock.fill" size={14} color={Colors.textTertiary} />
          <Text style={styles.durationText}>{duration}</Text>
        </View>
        
        <View style={styles.statusContainer}>
          {isLocked ? (
            <IconSymbol name="lock.fill" size={16} color={Colors.gray400} />
          ) : isCompleted ? (
            <Text style={[styles.statusText, { color: Colors.success }]}>Completed</Text>
          ) : (
            <Text style={[styles.statusText, { color: Colors.primary }]}>Continue</Text>
          )}
        </View>
      </View>

      {/* Locked Overlay */}
      {isLocked && (
        <View style={styles.lockedOverlay}>
          <IconSymbol name="lock.fill" size={32} color={Colors.gray400} />
          <Text style={styles.lockedText}>Complete previous lessons to unlock</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  locked: {
    opacity: 0.6,
  },
  completed: {
    borderLeftWidth: 4,
    borderLeftColor: Colors.success,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: Spacing.sm,
  },
  difficultyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.round,
    gap: Spacing.xs,
  },
  difficultyText: {
    fontFamily: FontFamilies.dinRounded,
    fontSize: 13,
    lineHeight: 18,
    color: Colors.white,
    fontWeight: '600',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.md,
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
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  durationText: {
    fontFamily: FontFamilies.dinRounded,
    fontSize: 13,
    lineHeight: 18,
    color: Colors.textTertiary,
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  statusText: {
    fontFamily: FontFamilies.dinRounded,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
  },
  lockedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: BorderRadius.lg,
  },
  lockedText: {
    fontFamily: FontFamilies.dinRounded,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
});
