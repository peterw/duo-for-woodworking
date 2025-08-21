import AICoach from '@/components/AICoach';
import { DailyGoals, ProgressSection, RecentProjects, SkillTree, StatsCards } from '@/components/home';
import { LevelModal, ProjectsModal, SkillModal, XPModal } from '@/components/modals';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { FontFamilies } from '@/hooks/AppFonts';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useUserProgressStore, woodworkingSkills } from '@/stores';
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

// Enhanced project data with proper categorization
const enhancedProjects = [
  // Furniture Projects
  {
    id: 'coffee-table',
    title: 'Modern Coffee Table',
    description: 'A sleek coffee table with clean lines and hidden storage',
    difficulty: 'Intermediate',
    estimatedTime: '8-12 hours',
    materials: ['Oak hardwood', 'Plywood', 'Wood glue', 'Finish'],
    tools: ['Table saw', 'Router', 'Clamps', 'Sander'],
    skills: ['advanced-joinery', 'power-tools-intro', 'sanding-finishing'],
    category: 'furniture',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
    materialCost: 'Medium',
    timeRange: { min: 8, max: 12 },
    lessonSlices: []
  },
  {
    id: 'bookshelf',
    title: 'Floating Bookshelf',
    description: 'A minimalist bookshelf that appears to float on the wall',
    difficulty: 'Beginner',
    estimatedTime: '4-6 hours',
    materials: ['Pine boards', 'Wall brackets', 'Screws', 'Paint'],
    tools: ['Circular saw', 'Drill', 'Level', 'Paintbrush'],
    skills: ['measuring-marking', 'basic-joinery', 'sanding-finishing'],
    category: 'furniture',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
    materialCost: 'Low',
    timeRange: { min: 4, max: 6 },
    lessonSlices: []
  },
  {
    id: 'dining-chair',
    title: 'Rustic Dining Chair',
    description: 'A comfortable dining chair with traditional joinery',
    difficulty: 'Advanced',
    estimatedTime: '12-16 hours',
    materials: ['Hardwood', 'Wood glue', 'Wedges', 'Finish'],
    tools: ['Chisels', 'Mallet', 'Clamps', 'Hand planes'],
    skills: ['advanced-joinery', 'chiseling', 'sanding-finishing'],
    category: 'furniture',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
    materialCost: 'Medium',
    timeRange: { min: 12, max: 16 },
    lessonSlices: []
  },

  // Decorative Projects
  {
    id: 'wooden-sign',
    title: 'Personalized Wooden Sign',
    description: 'Create a custom sign with your favorite quote or family name',
    difficulty: 'Beginner',
    estimatedTime: '2-3 hours',
    materials: ['Pine board', 'Stain', 'Paint', 'Hanging hardware'],
    tools: ['Jigsaw', 'Sander', 'Paintbrushes', 'Drill'],
    skills: ['measuring-marking', 'hand-sawing', 'sanding-finishing'],
    category: 'decorative',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
    materialCost: 'Low',
    timeRange: { min: 2, max: 3 },
    lessonSlices: []
  },
  {
    id: 'wall-art',
    title: 'Geometric Wall Art',
    description: 'Modern geometric patterns made from different wood species',
    difficulty: 'Intermediate',
    estimatedTime: '6-8 hours',
    materials: ['Various hardwoods', 'Wood glue', 'Backing board', 'Finish'],
    tools: ['Table saw', 'Miter saw', 'Clamps', 'Sander'],
    skills: ['power-tools-intro', 'basic-joinery', 'sanding-finishing'],
    category: 'decorative',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
    materialCost: 'Medium',
    timeRange: { min: 6, max: 8 },
    lessonSlices: []
  },

  // Outdoor Projects
  {
    id: 'garden-bench',
    title: 'Garden Bench',
    description: 'A sturdy bench perfect for your garden or patio',
    difficulty: 'Intermediate',
    estimatedTime: '10-14 hours',
    materials: ['Cedar or pressure-treated lumber', 'Screws', 'Finish'],
    tools: ['Circular saw', 'Drill', 'Clamps', 'Sander'],
    skills: ['power-tools-intro', 'basic-joinery', 'sanding-finishing'],
    category: 'outdoor',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
    materialCost: 'Medium',
    timeRange: { min: 10, max: 14 },
    lessonSlices: []
  },
  {
    id: 'planter-box',
    title: 'Raised Planter Box',
    description: 'A raised garden bed for growing vegetables and flowers',
    difficulty: 'Beginner',
    estimatedTime: '3-5 hours',
    materials: ['Cedar boards', 'Screws', 'Landscape fabric', 'Soil'],
    tools: ['Circular saw', 'Drill', 'Measuring tape', 'Level'],
    skills: ['measuring-marking', 'basic-joinery'],
    category: 'outdoor',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
    materialCost: 'Low',
    timeRange: { min: 3, max: 5 },
    lessonSlices: []
  },

  // Storage Projects
  {
    id: 'jewelry-box',
    title: 'Jewelry Box with Dividers',
    description: 'A beautiful box with custom dividers for organizing jewelry',
    difficulty: 'Intermediate',
    estimatedTime: '6-8 hours',
    materials: ['Hardwood', 'Felt lining', 'Hinges', 'Finish'],
    tools: ['Table saw', 'Router', 'Chisels', 'Sander'],
    skills: ['advanced-joinery', 'chiseling', 'sanding-finishing'],
    category: 'storage',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
    materialCost: 'Medium',
    timeRange: { min: 6, max: 8 },
    lessonSlices: []
  },
  {
    id: 'shoe-rack',
    title: 'Shoe Storage Rack',
    description: 'Organize your shoes with this simple rack',
    difficulty: 'Beginner',
    estimatedTime: '2-4 hours',
    materials: ['Pine boards', 'Screws', 'Paint or stain'],
    tools: ['Circular saw', 'Drill', 'Sander', 'Paintbrush'],
    skills: ['measuring-marking', 'basic-joinery', 'sanding-finishing'],
    category: 'storage',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
    materialCost: 'Low',
    timeRange: { min: 2, max: 4 },
    lessonSlices: []
  },

  // Toys & Games Projects
  {
    id: 'wooden-puzzle',
    title: 'Wooden Puzzle',
    description: 'A custom puzzle with interlocking pieces',
    difficulty: 'Beginner',
    estimatedTime: '3-4 hours',
    materials: ['Plywood', 'Paint', 'Clear finish'],
    tools: ['Scroll saw', 'Sander', 'Paintbrushes'],
    skills: ['measuring-marking', 'hand-sawing', 'sanding-finishing'],
    category: 'toys',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
    materialCost: 'Low',
    timeRange: { min: 3, max: 4 },
    lessonSlices: []
  },
  {
    id: 'chess-set',
    title: 'Wooden Chess Set',
    description: 'Handcrafted chess pieces and board',
    difficulty: 'Advanced',
    estimatedTime: '20-30 hours',
    materials: ['Various hardwoods', 'Wood glue', 'Finish'],
    tools: ['Lathe', 'Chisels', 'Sander', 'Drill'],
    skills: ['advanced-joinery', 'chiseling', 'sanding-finishing'],
    category: 'toys',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
    materialCost: 'High',
    timeRange: { min: 20, max: 30 },
    lessonSlices: []
  },

  // Kitchen Projects
  {
    id: 'cutting-board',
    title: 'Simple Cutting Board',
    description: 'A beautiful and functional cutting board perfect for beginners',
    difficulty: 'Beginner',
    estimatedTime: '2-3 hours',
    materials: ['Hardwood (maple, walnut)', 'Food-safe oil', 'Sandpaper'],
    tools: ['Hand saw', 'Chisel', 'Sandpaper', 'Clamps'],
    skills: ['safety-basics', 'measuring-marking', 'hand-sawing', 'sanding-finishing'],
    category: 'kitchen',
    image: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=400&h=300&fit=crop',
    materialCost: 'Low',
    timeRange: { min: 2, max: 3 },
    lessonSlices: []
  },
  {
    id: 'spice-rack',
    title: 'Wall-Mounted Spice Rack',
    description: 'Organize your spices with this wall-mounted rack',
    difficulty: 'Beginner',
    estimatedTime: '3-4 hours',
    materials: ['Pine boards', 'Screws', 'Paint or stain'],
    tools: ['Circular saw', 'Drill', 'Sander', 'Paintbrush'],
    skills: ['measuring-marking', 'basic-joinery', 'sanding-finishing'],
    category: 'kitchen',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
    materialCost: 'Low',
    timeRange: { min: 3, max: 4 },
    lessonSlices: []
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
    const recent = enhancedProjects.slice(0, 3).map(project => ({
      ...project,
      isStarted: true, // Show all recent projects as started
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











  const renderContinueButton = () => {
    // Find the next skill to learn
    const nextSkill = skills.find(skill => !skill.isLocked && !skill.isCompleted);
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
        availableProjects={enhancedProjects.length}
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




});

