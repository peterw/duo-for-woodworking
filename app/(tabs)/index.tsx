import AICoach from '@/components/AICoach';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useUserProgressStore } from '@/stores';
import React, { useEffect } from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

interface DailyGoal {
  id: string;
  title: string;
  description: string;
  icon: string;
  isCompleted: boolean;
  xp: number;
}

interface QuickLesson {
  id: string;
  title: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  icon: string;
}

const dailyGoalsData = [
  {
    id: 'practice',
    title: 'Practice Today',
    description: 'Spend 15 minutes learning',
    icon: 'clock.fill',
    xp: 50,
  },
  {
    id: 'skill',
    title: 'Learn a Skill',
    description: 'Complete one skill lesson',
    icon: 'star.fill',
    xp: 100,
  },
  {
    id: 'project',
    title: 'Work on Project',
    description: 'Make progress on a project',
    icon: 'hammer.fill',
    xp: 75,
  },
];

const quickLessons: QuickLesson[] = [
  {
    id: 'safety',
    title: 'Tool Safety Basics',
    duration: '10 min',
    difficulty: 'Beginner',
    icon: 'shield.fill',
  },
  {
    id: 'measuring',
    title: 'Precision Measuring',
    duration: '15 min',
    difficulty: 'Beginner',
    icon: 'ruler.fill',
  },
  {
    id: 'sanding',
    title: 'Sanding Techniques',
    duration: '12 min',
    difficulty: 'Beginner',
    icon: 'hand.raised.fill',
  },
];

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const { 
    currentStreak, 
    totalXP, 
    level, 
    dailyGoals, 
    completeDailyGoal,
    checkDailyLogin 
  } = useUserProgressStore();

  useEffect(() => {
    // Check daily login and streak
    checkDailyLogin();
  }, [checkDailyLogin]);

  const completeGoal = (goalId: string) => {
    // Update goal completion using Zustand store
    if (goalId === 'practice') {
      completeDailyGoal('practice');
    } else if (goalId === 'skill') {
      completeDailyGoal('skill');
    } else if (goalId === 'project') {
      completeDailyGoal('project');
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <Text style={[styles.greeting, { color: Colors[colorScheme ?? 'light'].text }]}>
          Good morning
        </Text>
        <Text style={[styles.welcomeText, { color: Colors[colorScheme ?? 'light'].textSecondary }]}>
          Ready to build something amazing?
        </Text>
      </View>
      <TouchableOpacity style={styles.streakBadge}>
        <View style={[styles.streakBadgeContent, { backgroundColor: Colors[colorScheme ?? 'light'].streak }]}>
          <IconSymbol name="flame.fill" size={16} color="white" />
          <Text style={styles.streakBadgeText}>{currentStreak}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  const renderStatsCards = () => (
    <View style={styles.statsContainer}>
      <View style={[styles.statCard, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
        <View style={[styles.statIcon, { backgroundColor: Colors[colorScheme ?? 'light'].trophy }]}>
          <IconSymbol name="trophy.fill" size={20} color="white" />
        </View>
        <Text style={[styles.statNumber, { color: Colors[colorScheme ?? 'light'].text }]}>
          {level}
        </Text>
        <Text style={[styles.statLabel, { color: Colors[colorScheme ?? 'light'].textSecondary }]}>
          Level
        </Text>
      </View>
      
      <View style={[styles.statCard, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
        <View style={[styles.statIcon, { backgroundColor: Colors[colorScheme ?? 'light'].star }]}>
          <IconSymbol name="star.fill" size={20} color="white" />
        </View>
        <Text style={[styles.statNumber, { color: Colors[colorScheme ?? 'light'].text }]}>
          {totalXP}
        </Text>
        <Text style={[styles.statLabel, { color: Colors[colorScheme ?? 'light'].textSecondary }]}>
          Total XP
        </Text>
      </View>
      
      <View style={[styles.statCard, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
        <View style={[styles.statIcon, { backgroundColor: Colors[colorScheme ?? 'light'].hammer }]}>
          <IconSymbol name="hammer.fill" size={20} color="white" />
        </View>
        <Text style={[styles.statNumber, { color: Colors[colorScheme ?? 'light'].text }]}>
          {Math.floor(totalXP / 500) + 1}
        </Text>
        <Text style={[styles.statLabel, { color: Colors[colorScheme ?? 'light'].textSecondary }]}>
          Projects
        </Text>
      </View>
    </View>
  );

  const renderProgressSection = () => (
    <View style={styles.progressSection}>
      <Text style={[styles.sectionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
        Progress to Next Level
      </Text>
      <View style={[styles.progressCard, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
        <View style={styles.progressHeader}>
          <Text style={[styles.progressText, { color: Colors[colorScheme ?? 'light'].textSecondary }]}>
            {totalXP % 500} / 500 XP
          </Text>
          <Text style={[styles.progressPercentage, { color: Colors[colorScheme ?? 'light'].tint }]}>
            {Math.round((totalXP % 500) / 5)}%
          </Text>
        </View>
        <View style={[styles.progressBar, { backgroundColor: Colors[colorScheme ?? 'light'].border }]}>
          <View 
            style={[
              styles.progressFill, 
              { 
                width: `${(totalXP % 500) / 5}%`,
                backgroundColor: Colors[colorScheme ?? 'light'].tint,
              }
            ]} 
          />
        </View>
      </View>
    </View>
  );

  const renderDailyGoals = () => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
        Today's Goals
      </Text>
      {dailyGoalsData.map((goal) => {
        const isCompleted = dailyGoals[goal.id as keyof typeof dailyGoals];
        return (
          <TouchableOpacity
            key={goal.id}
            style={[
              styles.goalCard,
              {
                backgroundColor: Colors[colorScheme ?? 'light'].background,
                borderColor: isCompleted 
                  ? Colors[colorScheme ?? 'light'].success 
                  : Colors[colorScheme ?? 'light'].border,
              },
            ]}
            onPress={() => completeGoal(goal.id)}
            disabled={isCompleted}
          >
            <View style={styles.goalLeft}>
              <View style={[
                styles.goalIcon, 
                { 
                  backgroundColor: isCompleted 
                    ? Colors[colorScheme ?? 'light'].success 
                    : Colors[colorScheme ?? 'light'].tint,
                }
              ]}>
                <IconSymbol name={goal.icon as any} size={20} color="white" />
              </View>
              <View style={styles.goalContent}>
                <Text style={[styles.goalTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
                  {goal.title}
                </Text>
                <Text style={[styles.goalDescription, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]}>
                  {goal.description}
                </Text>
              </View>
            </View>
            <View style={styles.goalRight}>
              <Text style={[styles.goalXP, { color: Colors[colorScheme ?? 'light'].tint }]}>
                +{goal.xp} XP
              </Text>
              {isCompleted && (
                <IconSymbol 
                  name="checkmark.circle.fill" 
                  size={24} 
                  color={Colors[colorScheme ?? 'light'].success} 
                />
              )}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  const renderQuickLessons = () => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
        Quick Lessons
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.lessonsContainer}>
        {quickLessons.map((lesson) => (
          <TouchableOpacity
            key={lesson.id}
            style={[
              styles.lessonCard,
              { backgroundColor: Colors[colorScheme ?? 'light'].background },
            ]}
          >
            <View style={[styles.lessonIcon, { backgroundColor: Colors[colorScheme ?? 'light'].tint }]}>
              <IconSymbol name={lesson.icon as any} size={24} color="white" />
            </View>
            <Text style={[styles.lessonTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
              {lesson.title}
            </Text>
            <Text style={[styles.lessonDuration, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]}>
              {lesson.duration}
            </Text>
            <View style={[
              styles.difficultyBadge, 
              { 
                backgroundColor: lesson.difficulty === 'Beginner' 
                  ? Colors[colorScheme ?? 'light'].difficulty.beginner
                  : lesson.difficulty === 'Intermediate' 
                    ? Colors[colorScheme ?? 'light'].difficulty.intermediate
                    : Colors[colorScheme ?? 'light'].difficulty.advanced,
              }
            ]}>
              <Text style={styles.difficultyText}>{lesson.difficulty}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
      {renderHeader()}
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {renderStatsCards()}
        {renderProgressSection()}
        {renderDailyGoals()}
        {renderQuickLessons()}
        
        <AICoach />
        
        <View style={styles.continueSection}>
          <Text style={[styles.continueTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
            Continue Learning
          </Text>
          <TouchableOpacity
            style={[styles.continueButton, { backgroundColor: Colors[colorScheme ?? 'light'].tint }]}
          >
            <Text style={styles.continueButtonText}>Resume Last Lesson</Text>
            <IconSymbol name="arrow.right" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  welcomeText: {
    fontSize: 16,
    fontWeight: '400',
  },
  streakBadge: {
    marginLeft: 16,
  },
  streakBadgeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  streakBadgeText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 6,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  progressSection: {
    marginBottom: 30,
  },
  progressCard: {
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '500',
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: '700',
  },
  progressBar: {
    width: '100%',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  goalCard: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  goalLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
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
    fontWeight: '600',
    marginBottom: 4,
  },
  goalDescription: {
    fontSize: 14,
  },
  goalRight: {
    alignItems: 'center',
  },
  goalXP: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  lessonsContainer: {
    paddingHorizontal: 20,
  },
  lessonCard: {
    width: 160,
    padding: 16,
    borderRadius: 12,
    marginRight: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lessonIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  lessonTitle: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  lessonDuration: {
    fontSize: 14,
    marginBottom: 12,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  continueSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  continueTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
    color: Colors.light.text,
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  continueButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
});

