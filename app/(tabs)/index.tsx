import AICoach from '@/components/AICoach';
import { DailyGoals, ProgressSection, RecentProjects, SkillTree, StatsCards } from '@/components/home';
import { LevelModal, ProjectsModal, SkillModal, XPModal } from '@/components/modals';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { FontFamilies } from '@/hooks/AppFonts';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useUserProgressStore } from '@/stores';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

interface HomeSkill {
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
    totalProjects,
    skills,
    projects,
    categories,
    isLoading,
    fetchAllData
  } = useUserProgressStore();

  const [selectedSkill, setSelectedSkill] = useState<HomeSkill | null>(null);
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [recentProjects, setRecentProjects] = useState<any[]>([]);
  const [greeting, setGreeting] = useState('Good morning');
  const [showLevelModal, setShowLevelModal] = useState(false);
  const [showXPModal, setShowXPModal] = useState(false);
  const [showProjectsModal, setShowProjectsModal] = useState(false);
  const [homeSkills, setHomeSkills] = useState<HomeSkill[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  // Calculate total completed projects
  const getTotalCompletedProjects = () => {
    if (projects.length === 0) return 0;
    
    return projects.filter(project => {
      if (project.lessonSlices && project.lessonSlices.length > 0) {
        const completedSlices = project.lessonSlices.filter((slice: any) => slice.isCompleted);
        const progress = (completedSlices.length / project.lessonSlices.length) * 100;
        return progress === 100;
      }
      return false;
    }).length;
  };

  useEffect(() => {
    checkDailyLogin();
    updateGreeting();
    fetchAllData();
  }, [checkDailyLogin, fetchAllData]);

  useEffect(() => {
    if (skills.length > 0) {
      initializeSkills();
      loadRecentProjects();
    }
  }, [skills, projects]);

  // Refresh data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      if (skills.length > 0) {
        initializeSkills();
        loadRecentProjects();
      }
    }, [skills, projects])
  );

  const updateGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 17) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  };

  const initializeSkills = () => {
    // Map Firestore skills to home screen format
    if (skills.length === 0) return;
    
    const mappedSkills: HomeSkill[] = skills.slice(0, 6).map((skill, index) => {
      const isCompleted = completedSkills.includes(skill.id);
      const isLocked = index > 0 && !completedSkills.includes(skills[index - 1].id);
      
      // Calculate real progress based on completed microSteps
      let progress = 0;
      if (skill.microSteps && skill.microSteps.length > 0) {
        const completedSteps = skill.microSteps.filter((step: any) => step.isCompleted);
        progress = Math.round((completedSteps.length / skill.microSteps.length) * 100);
      } else if (isCompleted) {
        progress = 100;
      }
      
      return {
        id: skill.id,
        title: skill.title,
        description: skill.description,
        icon: skill.icon,
        color: getSkillColor(index),
        isLocked,
        isCompleted,
        progress,
        xpReward: skill.xpReward,
        lessons: skill.microSteps?.length || 0,
        crowns: isCompleted ? Math.floor(Math.random() * 3) + 1 : 0,
        level: Math.floor(Math.random() * 3) + 1,
      };
    });
    
    setHomeSkills(mappedSkills);
  };

  const loadRecentProjects = () => {
    // Get recent projects for quick access from Firestore
    if (projects.length === 0) return;
    
    const recent = projects.slice(0, 3).map(project => {
      // Calculate actual progress based on completed lesson slices
      let progress = 0;
      let isStarted = false;
      let isCompleted = false;
      
      if (project.lessonSlices && project.lessonSlices.length > 0) {
        const completedSlices = project.lessonSlices.filter((slice: any) => slice.isCompleted);
        progress = Math.round((completedSlices.length / project.lessonSlices.length) * 100);
        isStarted = completedSlices.length > 0 || progress > 0;
        isCompleted = progress === 100;
      }
      
      return {
        ...project,
        isStarted,
        isCompleted,
        progress,
      };
    });
    setRecentProjects(recent);
  };

  const getSkillColor = (index: number) => {
    const colors = ['#FF6B35', '#1CB0F6', '#58CC02', '#FF9600', '#CE82FF', '#A274FF'];
    return colors[index % colors.length];
  };

  const handleSkillPress = (skill: HomeSkill) => {
    if (skill.isLocked) {
      Alert.alert('Skill Locked', 'Complete previous skills to unlock this one!');
      return;
    }
    
    setSelectedSkill(skill);
    setShowSkillModal(true);
  };

  const handleContinueLearning = () => {
    // Find the next skill to learn
    const nextSkill = homeSkills.find(skill => !skill.isLocked && !skill.isCompleted);
    if (nextSkill) {
      setSelectedSkill(nextSkill);
      setShowSkillModal(true);
    } else {
      router.push('/(tabs)/learn');
    }
  };

  const handleStartProject = (project: any) => {
    router.push(`/woodworking-project/${project.id}`);
  };

  const handleViewAllProjects = () => {
    router.push('/(tabs)/projects');
  };

  const handleViewAllSkills = () => {
    router.push('/(tabs)/learn');
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchAllData();
      if (skills.length > 0) {
        initializeSkills();
        loadRecentProjects();
      }
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <Text style={styles.greeting}>
          {greeting}
        </Text>
        <Text style={styles.woodWorkerTitle}>
           Woodworker!
        </Text>
        <Text style={styles.welcomeText}>
          Ready to build something amazing?
        </Text>
      </View>
      <TouchableOpacity style={styles.streakBadge}>
        <LinearGradient
          colors={['#58CC02', '#46B700']}
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

  const renderContinueButton = () => {
    // Find the next skill to learn
    const nextSkill = homeSkills.find(skill => !skill.isLocked && !skill.isCompleted);
    const buttonText = nextSkill 
      ? `Continue ${nextSkill.title}` 
      : 'View All Skills';
    
    return (
      <View style={styles.continueSection}>
        <TouchableOpacity style={styles.continueButton} onPress={handleContinueLearning}>
          <LinearGradient
            colors={['#58CC02', '#46B700']}
            style={styles.continueButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.continueButtonText}>{buttonText}</Text>
            <IconSymbol name="arrow.right" size={20} color="white" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading your woodworking journey...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#58CC02']}
            tintColor="#58CC02"
          />
        }
      >
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
          skills={homeSkills}
          onSkillPress={handleSkillPress}
          onViewAllSkills={handleViewAllSkills}
        />
        
        {renderContinueButton()}
        
        <RecentProjects
          recentProjects={recentProjects}
          onProjectPress={handleStartProject}
          onViewAllProjects={handleViewAllProjects}
        />
        <DailyGoals
          dailyGoals={dailyGoals}
          onCompleteGoal={completeDailyGoal}
        />
        
        {/* Projects Summary */}
        <View style={styles.projectsSummary}>
          <Text style={styles.projectsSummaryTitle}>Your Projects</Text>
          <View style={styles.projectsSummaryStats}>
            <View style={styles.projectsSummaryItem}>
              <Text style={styles.projectsSummaryNumber}>{projects.length}</Text>
              <Text style={styles.projectsSummaryLabel}>Total</Text>
            </View>
            <View style={styles.projectsSummaryItem}>
              <Text style={styles.projectsSummaryNumber}>{getTotalCompletedProjects()}</Text>
              <Text style={styles.projectsSummaryLabel}>Completed</Text>
            </View>
            <View style={styles.projectsSummaryItem}>
              <Text style={styles.projectsSummaryNumber}>
                {projects.length > 0 ? Math.round((getTotalCompletedProjects() / projects.length) * 100) : 0}%
              </Text>
              <Text style={styles.projectsSummaryLabel}>Success Rate</Text>
            </View>
          </View>
        </View>
        
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
        availableProjects={projects.length}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
    fontFamily: FontFamilies.dinRounded,
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
    fontSize: 26,
    fontFamily: FontFamilies.featherBold,
    color: '#000000',
  },
  woodWorkerTitle: {
    fontSize: 20,
    fontFamily: FontFamilies.featherBold,
    marginBottom: 4,
    color: '#000000',
  },
  welcomeText: {
    fontSize: 16,
    fontFamily: FontFamilies.dinRounded,
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
    paddingTop: 20,
    paddingBottom: 100,
  },
  continueSection: {
    marginBottom: 24,
    paddingHorizontal: 20,
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
  projectsSummary: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  projectsSummaryTitle: {
    fontSize: 20,
    fontFamily: FontFamilies.featherBold,
    color: '#000000',
    marginBottom: 16,
  },
  projectsSummaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
  },
  projectsSummaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  projectsSummaryNumber: {
    fontSize: 24,
    fontFamily: FontFamilies.featherBold,
    color: '#58CC02',
    marginBottom: 4,
  },
  projectsSummaryLabel: {
    fontSize: 12,
    fontFamily: FontFamilies.dinRounded,
    color: '#666666',
  },
});

