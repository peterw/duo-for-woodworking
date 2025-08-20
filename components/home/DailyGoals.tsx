import { IconSymbol } from '@/components/ui/IconSymbol';
import { FontFamilies } from '@/hooks/AppFonts';
import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface DailyGoalsProps {
  dailyGoals: {
    practice: boolean;
    skill: boolean;
  };
  onCompleteGoal: (goalType: 'practice' | 'skill') => void;
}

export default function DailyGoals({ dailyGoals, onCompleteGoal }: DailyGoalsProps) {
  return (
    <View style={styles.dailyGoalsSection}>
      <Text style={styles.sectionTitle}>
        Today's Goals
      </Text>
      <View style={styles.goalsContainer}>
        <TouchableOpacity
          style={[styles.goalCard, dailyGoals.practice && styles.goalCardCompleted]}
          onPress={() => onCompleteGoal('practice')}
        >
          <View style={[styles.goalIcon, { backgroundColor: dailyGoals.practice ? '#58CC02' : '#58CC02' }]}>
            <IconSymbol name={dailyGoals.practice ? "checkmark" : "clock.fill"} size={20} color="white" />
          </View>
          <View style={styles.goalContent}>
            <Text style={[styles.goalTitle, dailyGoals.practice && styles.goalTitleCompleted]}>
              Practice Today
            </Text>
            <Text style={[styles.goalDescription, dailyGoals.practice && styles.goalDescriptionCompleted]}>
              {dailyGoals.practice ? 'Completed!' : 'Spend 15 minutes learning'}
            </Text>
          </View>
          <Text style={[styles.goalXP, { color: dailyGoals.practice ? '#58CC02' : '#58CC02' }]}>
            {dailyGoals.practice ? '✓' : '+50 XP'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.goalCard, dailyGoals.skill && styles.goalCardCompleted]}
          onPress={() => onCompleteGoal('skill')}
        >
          <View style={[styles.goalIcon, { backgroundColor: dailyGoals.skill ? '#1CB0F6' : '#1CB0F6' }]}>
            <IconSymbol name={dailyGoals.skill ? "checkmark" : "star.fill"} size={20} color="white" />
          </View>
          <View style={styles.goalContent}>
            <Text style={[styles.goalTitle, dailyGoals.skill && styles.goalTitleCompleted]}>
              Learn a Skill
            </Text>
            <Text style={[styles.goalDescription, dailyGoals.skill && styles.goalDescriptionCompleted]}>
              {dailyGoals.skill ? 'Completed!' : 'Complete one skill lesson'}
            </Text>
          </View>
          <Text style={[styles.goalXP, { color: dailyGoals.skill ? '#1CB0F6' : '#1CB0F6' }]}>
            {dailyGoals.skill ? '✓' : '+100 XP'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  dailyGoalsSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: FontFamilies.featherBold,
    marginBottom: 16,
    paddingHorizontal: 20,
    color: '#000000',
  },
  goalsContainer: {
    paddingHorizontal: 20,
  },
  goalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  goalCardCompleted: {
    opacity: 0.7,
  },
  goalIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  goalContent: {
    flex: 1,
  },
  goalTitle: {
    fontSize: 16,
    fontFamily: FontFamilies.featherBold,
    marginBottom: 4,
    color: '#000000',
  },
  goalTitleCompleted: {
    color: '#58CC02',
  },
  goalDescription: {
    fontSize: 14,
    fontFamily: FontFamilies.dinRounded,
    color: '#666666',
  },
  goalDescriptionCompleted: {
    color: '#58CC02',
  },
  goalXP: {
    fontSize: 14,
    fontFamily: FontFamilies.featherBold,
  },
});
