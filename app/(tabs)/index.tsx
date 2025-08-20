import AICoach from '@/components/AICoach';
import { DailyGoals, ProgressSection, RecentProjects, SkillTree, StatsCards } from '@/components/home';
import { LevelModal, ProjectsModal, SkillModal, XPModal } from '@/components/modals';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { FontFamilies } from '@/hooks/AppFonts';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useUserProgressStore, woodworkingProjects, woodworkingSkills } from '@/stores';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
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

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const { 
    currentStreak, 
    totalXP, 
    level, 
    dailyGoals, 
    completeDailyGoal,
    checkDailyLogin,
    completedSkills,
    skillsCompleted,
    totalProjects
  } = useUserProgressStore();

  const [skills, setSkills] = useState<Skill[]>([]);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [recentProjects, setRecentProjects] = useState<any[]>([]);
  const [greeting, setGreeting] = useState('Good morning');
  const [showLevelModal, setShowLevelModal] = useState(false);
  const [showXPModal, setShowXPModal] = useState(false);
  const [showProjectsModal, setShowProjectsModal] = useState(false);

  useEffect(() => {
    checkDailyLogin();
    updateGreeting();
    initializeSkills();
    loadRecentProjects();
  }, [checkDailyLogin]);

  const updateGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 17) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  };

  const initializeSkills = () => {
    // Map woodworking skills to home screen format
    const mappedSkills: Skill[] = woodworkingSkills.slice(0, 6).map((skill, index) => {
      const isCompleted = completedSkills.includes(skill.id);
      const isLocked = index > 0 && !completedSkills.includes(woodworkingSkills[index - 1].id);
      
      return {
        id: skill.id,
        title: skill.title,
        description: skill.description,
        icon: skill.icon,
        color: getSkillColor(index),
        isLocked,
        isCompleted,
        progress: isCompleted ? 100 : Math.floor(Math.random() * 80),
        xpReward: skill.xpReward,
        lessons: skill.microSteps.length,
        crowns: isCompleted ? Math.floor(Math.random() * 3) + 1 : 0,
        level: Math.floor(Math.random() * 3) + 1,
      };
    });
    
    setSkills(mappedSkills);
  };

  const loadRecentProjects = () => {
    // Get recent projects for quick access
    const recent = woodworkingProjects.slice(0, 3).map(project => ({
      ...project,
      isStarted: Math.random() > 0.5, // Simulate project status
      progress: Math.floor(Math.random() * 100),
    }));
    setRecentProjects(recent);
  };

  const getSkillColor = (index: number) => {
    const colors = ['#FF6B35', '#1CB0F6', '#58CC02', '#FF9600', '#CE82FF', '#A274FF'];
    return colors[index % colors.length];
  };

  const handleSkillPress = (skill: Skill) => {
    if (skill.isLocked) {
      Alert.alert('Skill Locked', 'Complete previous skills to unlock this one!');
      return;
    }
    
    setSelectedSkill(skill);
    setShowSkillModal(true);
  };

  const handleContinueLearning = () => {
    // Find the next skill to learn
    const nextSkill = skills.find(skill => !skill.isLocked && !skill.isCompleted);
    if (nextSkill) {
      setSelectedSkill(nextSkill);
      setShowSkillModal(true);
    } else {
      router.push('/(tabs)/learn');
    }
  };

  const handleStartProject = (project: any) => {
    router.push({
      pathname: '/(tabs)/projects',
      params: { selectedProject: project.id }
    });
  };

  const handleViewAllProjects = () => {
    router.push('/(tabs)/projects');
  };

  const handleViewAllSkills = () => {
    router.push('/(tabs)/learn');
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <Text style={styles.greeting}>
          {greeting}, Woodworker!
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











  const renderContinueButton = () => (
    <View style={styles.continueSection}>
      <TouchableOpacity style={styles.continueButton} onPress={handleContinueLearning}>
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
        <StatsCards
          level={level}
          totalXP={totalXP}
          totalProjects={totalProjects}
          onLevelPress={() => setShowLevelModal(true)}
          onXPPress={() => setShowXPModal(true)}
          onProjectsPress={() => setShowProjectsModal(true)}
        />
        <ProgressSection totalXP={totalXP} />
        <SkillTree
          skills={skills}
          onSkillPress={handleSkillPress}
          onViewAllSkills={handleViewAllSkills}
        />
        <RecentProjects
          recentProjects={recentProjects}
          onProjectPress={handleStartProject}
          onViewAllProjects={handleViewAllProjects}
        />
        <DailyGoals
          dailyGoals={dailyGoals}
          onCompleteGoal={completeDailyGoal}
        />
        
        {renderContinueButton()}
        
        <AICoach />
      </ScrollView>

      <SkillModal
        visible={showSkillModal}
        onClose={() => setShowSkillModal(false)}
        skill={selectedSkill}
      />
      <LevelModal
        visible={showLevelModal}
        onClose={() => setShowLevelModal(false)}
        level={level}
        totalXP={totalXP}
        skillsCompleted={skillsCompleted}
        currentStreak={currentStreak}
        totalProjects={totalProjects}
      />
      <XPModal
        visible={showXPModal}
        onClose={() => setShowXPModal(false)}
        totalXP={totalXP}
        skillsCompleted={skillsCompleted}
        totalProjects={totalProjects}
        currentStreak={currentStreak}
        dailyGoals={dailyGoals}
      />
      <ProjectsModal
        visible={showProjectsModal}
        onClose={() => setShowProjectsModal(false)}
        totalProjects={totalProjects}
        recentProjects={recentProjects}
        availableProjects={woodworkingProjects.length}
      />
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
    paddingTop:10,
    paddingBottom: 100,
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

