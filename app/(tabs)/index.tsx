import AICoach from '@/components/AICoach';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { FontFamilies } from '@/hooks/AppFonts';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useUserProgressStore } from '@/stores';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

interface Skill {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  isLocked: boolean;
  isCompleted: boolean;
  progress: number; // 0-100
  xpReward: number;
  lessons: number;
  crowns: number; // 0-5 like Duolingo
  level: number; // 1-5 like Duolingo
}

const skillsData: Skill[] = [
  {
    id: 'safety',
    title: 'Safety',
    description: 'Essential safety practices',
    icon: 'shield.fill',
    color: '#FF6B35',
    isLocked: false,
    isCompleted: false,
    progress: 0,
    xpReward: 50,
    lessons: 5,
    crowns: 0,
    level: 1,
  },
  {
    id: 'measuring',
    title: 'Measuring',
    description: 'Precision techniques',
    icon: 'ruler.fill',
    color: '#1CB0F6',
    isLocked: false,
    isCompleted: false,
    progress: 60,
    xpReward: 75,
    lessons: 7,
    crowns: 1,
    level: 2,
  },
  {
    id: 'cutting',
    title: 'Cutting',
    description: 'Saw techniques',
    icon: 'scissors',
    color: '#58CC02',
    isLocked: false,
    isCompleted: false,
    progress: 0,
    xpReward: 100,
    lessons: 8,
    crowns: 0,
    level: 1,
  },
  {
    id: 'joining',
    title: 'Joinery',
    description: 'Wood connections',
    icon: 'link',
    color: '#FF9600',
    isLocked: true,
    isCompleted: false,
    progress: 0,
    xpReward: 125,
    lessons: 10,
    crowns: 0,
    level: 1,
  },
  {
    id: 'sanding',
    title: 'Sanding',
    description: 'Surface preparation',
    icon: 'hand.raised.fill',
    color: '#CE82FF',
    isLocked: true,
    isCompleted: false,
    progress: 0,
    xpReward: 150,
    lessons: 6,
    crowns: 0,
    level: 1,
  },
  {
    id: 'design',
    title: 'Design',
    description: 'Planning & design',
    icon: 'pencil.and.outline',
    color: '#A274FF',
    isLocked: true,
    isCompleted: false,
    progress: 0,
    xpReward: 200,
    lessons: 12,
    crowns: 0,
    level: 1,
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

  const [skills, setSkills] = useState<Skill[]>(skillsData);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);

  useEffect(() => {
    checkDailyLogin();
  }, [checkDailyLogin]);

  const handleSkillPress = (skill: Skill) => {
    if (skill.isLocked) {
      Alert.alert('Skill Locked', 'Complete previous skills to unlock this one!');
      return;
    }
    
    setSelectedSkill(skill);
    // Navigate to skill lessons
    Alert.alert('Coming Soon', 'Skill lessons will be available in the next update!');
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <Text style={styles.greeting}>
          Good morning, Woodworker!
        </Text>
        <Text style={styles.welcomeText}>
          Ready to build something amazing?
        </Text>
      </View>
      <TouchableOpacity style={styles.streakBadge}>
        <LinearGradient
          colors={['#FF6B35', '#F7931E']}
          style={styles.streakBadgeContent}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <IconSymbol name="flame.fill" size={16} color="white" />
          <Text style={styles.streakBadgeText}>{currentStreak}</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  const renderStatsCards = () => (
    <View style={styles.statsContainer}>
      <View style={styles.statCard}>
        <LinearGradient
          colors={['#FFD700', '#FFA500']}
          style={styles.statIcon}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <IconSymbol name="trophy.fill" size={20} color="white" />
        </LinearGradient>
        <Text style={styles.statNumber}>
          {level}
        </Text>
        <Text style={styles.statLabel}>
          Level
        </Text>
      </View>
      
      <View style={styles.statCard}>
        <LinearGradient
          colors={['#58CC02', '#46B700']}
          style={styles.statIcon}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <IconSymbol name="star.fill" size={20} color="white" />
        </LinearGradient>
        <Text style={styles.statNumber}>
          {totalXP}
        </Text>
        <Text style={styles.statLabel}>
          Total XP
        </Text>
      </View>
      
      <View style={styles.statCard}>
        <LinearGradient
          colors={['#1CB0F6', '#007AFF']}
          style={styles.statIcon}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <IconSymbol name="crown.fill" size={20} color="white" />
        </LinearGradient>
        <Text style={styles.statNumber}>
          {skills.reduce((sum, skill) => sum + skill.crowns, 0)}
        </Text>
        <Text style={styles.statLabel}>
          Crowns
        </Text>
      </View>
    </View>
  );

  const renderProgressSection = () => (
    <View style={styles.progressSection}>
      <Text style={styles.sectionTitle}>
        Progress to Next Level
      </Text>
      <View style={styles.progressCard}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressText}>
            {totalXP % 500} / 500 XP
          </Text>
          <Text style={styles.progressPercentage}>
            {Math.round((totalXP % 500) / 5)}%
          </Text>
        </View>
        <View style={styles.progressBar}>
          <LinearGradient
            colors={['#58CC02', '#46B700']}
            style={[
              styles.progressFill, 
              { width: `${(totalXP % 500) / 5}%` }
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          />
        </View>
      </View>
    </View>
  );

  const renderSkillTree = () => (
    <View style={styles.skillTreeContainer}>
      <Text style={styles.sectionTitle}>
        Woodworking Path
      </Text>
      
      {/* Duolingo-style skill tree */}
      <View style={styles.skillTree}>
        {skills.map((skill, index) => (
          <View key={skill.id} style={styles.skillRow}>
            {/* Skill Circle */}
            <TouchableOpacity
              style={[
                styles.skillCircle,
                { backgroundColor: skill.color },
                skill.isLocked && styles.skillCircleLocked,
                skill.isCompleted && styles.skillCircleCompleted
              ]}
              onPress={() => handleSkillPress(skill)}
              disabled={skill.isLocked}
            >
              {skill.isLocked ? (
                <IconSymbol name="lock.fill" size={24} color="white" />
              ) : skill.isCompleted ? (
                <IconSymbol name="checkmark" size={24} color="white" />
              ) : (
                <IconSymbol name={skill.icon as any} size={24} color="white" />
              )}
            </TouchableOpacity>
            
            {/* Skill Info */}
            <View style={styles.skillInfo}>
              <Text style={[
                styles.skillTitle,
                skill.isLocked && styles.skillTitleLocked
              ]}>
                {skill.title}
              </Text>
              <Text style={styles.skillDescription}>
                {skill.description}
              </Text>
              
              {/* Crowns like Duolingo */}
              <View style={styles.crownsContainer}>
                {[1, 2, 3, 4, 5].map((crown) => (
                  <IconSymbol
                    key={crown}
                    name={skill.crowns >= crown ? "crown.fill" : "crown"}
                    size={16}
                    color={skill.crowns >= crown ? "#FFD700" : "#E5E5E5"}
                    style={styles.crownIcon}
                  />
                ))}
              </View>
            </View>
            
            {/* Progress indicator */}
            {!skill.isLocked && (
              <View style={styles.skillProgress}>
                <View style={styles.progressBarSmall}>
                  <View 
                    style={[
                      styles.progressFillSmall,
                      { 
                        width: `${skill.progress}%`,
                        backgroundColor: skill.color
                      }
                    ]} 
                  />
                </View>
                <Text style={styles.progressTextSmall}>{skill.progress}%</Text>
              </View>
            )}
            
            {/* Connection line to next skill */}
            {index < skills.length - 1 && (
              <View style={[
                styles.connectionLine,
                { backgroundColor: skills[index + 1].isLocked ? '#E5E5E5' : '#58CC02' }
              ]} />
            )}
          </View>
        ))}
      </View>
    </View>
  );

  const renderDailyGoals = () => (
    <View style={styles.dailyGoalsSection}>
      <Text style={styles.sectionTitle}>
        Today's Goals
      </Text>
      <View style={styles.goalsContainer}>
        <TouchableOpacity
          style={styles.goalCard}
          onPress={() => completeDailyGoal('practice')}
        >
          <View style={[styles.goalIcon, { backgroundColor: '#58CC02' }]}>
            <IconSymbol name="clock.fill" size={20} color="white" />
          </View>
          <View style={styles.goalContent}>
            <Text style={styles.goalTitle}>
              Practice Today
            </Text>
            <Text style={styles.goalDescription}>
              Spend 15 minutes learning
            </Text>
          </View>
          <Text style={[styles.goalXP, { color: '#58CC02' }]}>+50 XP</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.goalCard}
          onPress={() => completeDailyGoal('skill')}
        >
          <View style={[styles.goalIcon, { backgroundColor: '#1CB0F6' }]}>
            <IconSymbol name="star.fill" size={20} color="white" />
          </View>
          <View style={styles.goalContent}>
            <Text style={styles.goalTitle}>
              Learn a Skill
            </Text>
            <Text style={styles.goalDescription}>
              Complete one skill lesson
            </Text>
          </View>
          <Text style={[styles.goalXP, { color: '#1CB0F6' }]}>+100 XP</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderContinueButton = () => (
    <View style={styles.continueSection}>
      <TouchableOpacity style={styles.continueButton}>
        <LinearGradient
          colors={['#58CC02', '#46B700']}
          style={styles.continueButtonGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text style={styles.continueButtonText}>Continue Learning</Text>
          <IconSymbol name="arrow.right" size={20} color="white" />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {renderStatsCards()}
        {renderProgressSection()}
        {renderSkillTree()}
        {renderDailyGoals()}
        
        <AICoach />
        
        {renderContinueButton()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
    fontFamily: FontFamilies.featherBold,
    marginBottom: 4,
    color: '#000000',
  },
  welcomeText: {
    fontSize: 16,
    fontFamily: FontFamilies.dinRounded,
    fontWeight: '400',
    color: '#666666',
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
    fontFamily: FontFamilies.featherBold,
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
    backgroundColor: '#FFFFFF',
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
    fontFamily: FontFamilies.featherBold,
    marginBottom: 4,
    color: '#000000',
  },
  statLabel: {
    fontSize: 12,
    fontFamily: FontFamilies.dinRounded,
    fontWeight: '500',
    color: '#666666',
  },
  progressSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: FontFamilies.featherBold,
    marginBottom: 16,
    paddingHorizontal: 20,
    color: '#000000',
  },
  progressCard: {
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
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
    fontFamily: FontFamilies.dinRounded,
    fontWeight: '500',
    color: '#666666',
  },
  progressPercentage: {
    fontSize: 14,
    fontFamily: FontFamilies.featherBold,
    color: '#58CC02',
  },
  progressBar: {
    width: '100%',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: '#E5E5E5',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  skillTreeContainer: {
    marginBottom: 30,
  },
  skillTree: {
    paddingHorizontal: 20,
  },
  skillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  skillCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  skillCircleLocked: {
    backgroundColor: '#999999',
    opacity: 0.6,
  },
  skillCircleCompleted: {
    backgroundColor: '#58CC02',
  },
  skillInfo: {
    flex: 1,
  },
  skillTitle: {
    fontSize: 18,
    fontFamily: FontFamilies.featherBold,
    marginBottom: 4,
    color: '#000000',
  },
  skillTitleLocked: {
    color: '#999999',
  },
  skillDescription: {
    fontSize: 14,
    fontFamily: FontFamilies.dinRounded,
    marginBottom: 8,
    color: '#666666',
  },
  crownsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  crownIcon: {
    marginRight: 2,
  },
  skillProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  progressBarSmall: {
    width: 60,
    height: 6,
    backgroundColor: '#E5E5E5',
    borderRadius: 3,
    marginRight: 8,
    overflow: 'hidden',
  },
  progressFillSmall: {
    height: '100%',
    borderRadius: 3,
  },
  progressTextSmall: {
    fontSize: 12,
    fontFamily: FontFamilies.dinRounded,
    color: '#666666',
    minWidth: 30,
  },
  connectionLine: {
    position: 'absolute',
    left: 29,
    top: 60,
    width: 2,
    height: 20,
    backgroundColor: '#58CC02',
  },
  dailyGoalsSection: {
    marginBottom: 30,
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
  goalDescription: {
    fontSize: 14,
    fontFamily: FontFamilies.dinRounded,
    color: '#666666',
  },
  goalXP: {
    fontSize: 14,
    fontFamily: FontFamilies.featherBold,
  },
  continueSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  continueButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  continueButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  continueButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: FontFamilies.featherBold,
    marginRight: 8,
  },
});

