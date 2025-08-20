import CutListOptimizer from '@/components/CutListOptimizer';
import OfflineContentManager from '@/components/OfflineContentManager';
import ProjectSlicer from '@/components/ProjectSlicer';
import ToolMaterialLibrary from '@/components/ToolMaterialLibrary';
import { Header } from '@/components/ui/Header';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useUserProgressStore, woodworkingProjects } from '@/stores';
import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: screenWidth } = Dimensions.get('window');

interface ProjectCategory {
  id: string;
  title: string;
  description: string;
  icon: string;
  projectCount: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  color: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedTime: string;
  materials: string[];
  tools: string[];
  skills: string[];
  lessonSlices: any[];
  image: string;
  category: string;
}

const projectCategories: ProjectCategory[] = [
  {
    id: 'furniture',
    title: 'Furniture',
    description: 'Tables, chairs, cabinets, and more',
    icon: 'chair.lounge',
    projectCount: 24,
    difficulty: 'Intermediate',
    color: '#8B4513', // Oak brown
  },
  {
    id: 'decorative',
    title: 'Decorative',
    description: 'Wall art, signs, and decorative items',
    icon: 'paintbrush',
    projectCount: 18,
    difficulty: 'Beginner',
    color: '#D2691E', // Cedar brown
  },
  {
    id: 'outdoor',
    title: 'Outdoor',
    description: 'Decks, pergolas, and garden items',
    icon: 'leaf',
    projectCount: 15,
    difficulty: 'Advanced',
    color: '#228B22', // Pine green
  },
  {
    id: 'storage',
    title: 'Storage',
    description: 'Boxes, shelves, and organizers',
    icon: 'cube.box',
    projectCount: 22,
    difficulty: 'Beginner',
    color: '#4169E1', // Maple blue
  },
  {
    id: 'toys',
    title: 'Toys & Games',
    description: 'Wooden toys and game pieces',
    icon: 'gamecontroller',
    projectCount: 12,
    difficulty: 'Beginner',
    color: '#FF6347', // Walnut red
  },
  {
    id: 'kitchen',
    title: 'Kitchen & Dining',
    description: 'Cutting boards, utensils, and more',
    icon: 'fork.knife',
    projectCount: 20,
    difficulty: 'Intermediate',
    color: '#CD853F', // Cherry brown
  },
];

export default function ProjectsScreen() {
  const colorScheme = useColorScheme();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showProjectSlicer, setShowProjectSlicer] = useState(false);
  const [showCutListOptimizer, setShowCutListOptimizer] = useState(false);
  const [showToolLibrary, setShowToolLibrary] = useState(false);
  const [showOfflineManager, setShowOfflineManager] = useState(false);
  const { completedSkills, createProjectPlan, sliceProjectIntoLessons } = useUserProgressStore();

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return Colors[colorScheme ?? 'light'].difficulty.beginner;
      case 'Intermediate': return Colors[colorScheme ?? 'light'].difficulty.intermediate;
      case 'Advanced': return Colors[colorScheme ?? 'light'].difficulty.advanced;
      default: return Colors[colorScheme ?? 'light'].tabIconDefault;
    }
  };

  const canStartProject = (project: Project) => {
    // Check if user has completed all required skills
    return project.skills.every(skillId => completedSkills.includes(skillId));
  };

  const handleStartProject = (project: Project) => {
    if (canStartProject(project)) {
      setSelectedProject(project);
      setShowProjectSlicer(true);
    }
  };

  const handleProjectSlicerComplete = () => {
    setShowProjectSlicer(false);
    setSelectedProject(null);
    Alert.alert(
      'Project Ready!',
      'Your project has been sliced into lesson slices. You can now start building!',
      [{ text: 'Start Building', style: 'default' }]
    );
  };

  const handleCutListOptimize = (optimizedCuts: any[]) => {
    setShowCutListOptimizer(false);
    Alert.alert(
      'Cut List Optimized!',
      `Optimization complete with ${optimizedCuts.length} stock groups. Total waste minimized.`,
      [{ text: 'Great!', style: 'default' }]
    );
  };

  const renderCategoryCard = (category: ProjectCategory) => (
    <TouchableOpacity
      key={category.id}
      style={[
        styles.categoryCard,
        {
          backgroundColor: Colors[colorScheme ?? 'light'].background,
          borderColor: Colors[colorScheme ?? 'light'].border,
        },
      ]}
      onPress={() => setSelectedCategory(category.id)}
    >
      <View style={[styles.categoryIcon, { backgroundColor: category.color }]}>
        <IconSymbol name={category.icon as any} size={24} color="white" />
      </View>
      <View style={styles.categoryContent}>
        <Text style={[styles.categoryTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
          {category.title}
        </Text>
        <Text style={[styles.categoryDescription, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]}>
          {category.description}
        </Text>
        <Text style={[styles.categoryCount, { color: Colors[colorScheme ?? 'light'].tint }]}>
          {category.projectCount} projects
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderProjectCard = (project: Project) => {
    const canStart = canStartProject(project);
    const lessonCount = project.lessonSlices.length;
    
    return (
      <View
        key={project.id}
        style={[
          styles.projectCard,
          {
            backgroundColor: Colors[colorScheme ?? 'light'].background,
            borderColor: Colors[colorScheme ?? 'light'].border,
          },
        ]}
      >
        <View style={styles.projectHeader}>
          <View style={[styles.projectIcon, { backgroundColor: Colors[colorScheme ?? 'light'].tint }]}>
            <IconSymbol name="hammer.fill" size={20} color="white" />
          </View>
          <View style={styles.projectContent}>
            <Text style={[styles.projectTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
              {project.title}
            </Text>
            <Text style={[styles.projectDifficulty, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]}>
              {project.difficulty} • {project.estimatedTime}
            </Text>
            <Text style={[styles.projectDescription, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]}>
              {project.description}
            </Text>
          </View>
        </View>
        
        <View style={styles.projectMeta}>
          <View style={styles.projectStats}>
            <View style={styles.projectStat}>
              <IconSymbol name="book.fill" size={14} color={Colors[colorScheme ?? 'light'].tint} />
              <Text style={[styles.projectStatText, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]}>
                {lessonCount} lesson{lessonCount !== 1 ? 's' : ''}
              </Text>
            </View>
            <View style={styles.projectStat}>
              <IconSymbol name="hammer.fill" size={14} color={Colors[colorScheme ?? 'light'].tint} />
              <Text style={[styles.projectStatText, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]}>
                {project.tools.length} tools
              </Text>
            </View>
          </View>
          
          <TouchableOpacity
            style={[
              styles.startButton, 
              { 
                backgroundColor: canStart 
                  ? Colors[colorScheme ?? 'light'].tint 
                  : Colors[colorScheme ?? 'light'].tabIconDefault 
              }
            ]}
            disabled={!canStart}
            onPress={() => handleStartProject(project)}
          >
            <Text style={[styles.startButtonText, { color: 'white' }]}>
              {canStart ? 'Start' : 'Locked'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
      <Header
        title="Projects" 
        subtitle="Choose from hundreds of projects to build"
        showSafeArea={false}
      />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
            Project Categories
          </Text>
          {projectCategories.map(renderCategoryCard)}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
            Featured Projects
          </Text>
          {woodworkingProjects.map(renderProjectCard)}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
            Project Tools
          </Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.toolsScrollContainer}
            style={styles.toolsScrollView}
          >
            <TouchableOpacity
              style={[styles.toolCard, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}
              onPress={() => setShowCutListOptimizer(true)}
            >
              <View style={[styles.toolIcon, { backgroundColor: Colors[colorScheme ?? 'light'].tint }]}>
                <IconSymbol name="scissors" size={24} color="white" />
              </View>
              <Text style={[styles.toolTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
                Cut List Optimizer
              </Text>
              <Text style={[styles.toolDescription, { color: Colors[colorScheme ?? 'light'].textSecondary }]}>
                Optimize cuts to minimize waste
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.toolCard, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}
              onPress={() => setShowToolLibrary(true)}
            >
              <View style={[styles.toolIcon, { backgroundColor: Colors[colorScheme ?? 'light'].tint }]}>
                <IconSymbol name="wrench.and.screwdriver.fill" size={24} color="white" />
              </View>
              <Text style={[styles.toolTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
                Tool Library
              </Text>
              <Text style={[styles.toolDescription, { color: Colors[colorScheme ?? 'light'].textSecondary }]}>
                Tools, materials & alternatives
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.toolCard, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}
              onPress={() => setShowOfflineManager(true)}
            >
              <View style={[styles.toolIcon, { backgroundColor: Colors[colorScheme ?? 'light'].tint }]}>
                <IconSymbol name="icloud.and.arrow.down" size={24} color="white" />
              </View>
              <Text style={[styles.toolTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
                Offline Content
              </Text>
              <Text style={[styles.toolDescription, { color: Colors[colorScheme ?? 'light'].textSecondary }]}>
                Download projects for offline use
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </ScrollView>

      {/* Project Slicer Modal */}
      <Modal
        visible={showProjectSlicer}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={() => setShowProjectSlicer(false)}
              style={styles.closeButton}
            >
              <IconSymbol name="xmark" size={24} color={Colors[colorScheme ?? 'light'].text} />
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
              Project Slicer
            </Text>
            <View style={{ width: 24 }} />
          </View>
          {selectedProject && (
            <ProjectSlicer
              projectId={selectedProject.id}
              onComplete={handleProjectSlicerComplete}
            />
          )}
        </SafeAreaView>
      </Modal>

      {/* Cut List Optimizer Modal */}
      <Modal
        visible={showCutListOptimizer}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={() => setShowCutListOptimizer(false)}
              style={styles.closeButton}
            >
              <IconSymbol name="xmark" size={24} color={Colors[colorScheme ?? 'light'].text} />
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
              Cut List Optimizer
            </Text>
            <View style={{ width: 24 }} />
          </View>
          <CutListOptimizer
            cutList={[
              {
                id: '1',
                name: 'Table Top',
                quantity: 1,
                dimensions: { length: 48, width: 24, thickness: 0.75 },
                material: 'Oak',
              },
              {
                id: '2',
                name: 'Table Legs',
                quantity: 4,
                dimensions: { length: 28, width: 2, thickness: 2 },
                material: 'Oak',
              },
            ]}
            onOptimize={handleCutListOptimize}
          />
        </SafeAreaView>
      </Modal>

      {/* Tool & Material Library Modal */}
      <Modal
        visible={showToolLibrary}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={() => setShowToolLibrary(false)}
              style={styles.closeButton}
            >
              <IconSymbol name="xmark" size={24} color={Colors[colorScheme ?? 'light'].text} />
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
              Tool & Material Library
            </Text>
            <View style={{ width: 24 }} />
          </View>
          <ToolMaterialLibrary />
        </SafeAreaView>
      </Modal>

      {/* Offline Content Manager Modal */}
      <Modal
        visible={showOfflineManager}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <OfflineContentManager onClose={() => setShowOfflineManager(false)} />
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop:20,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  categoryCard: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  categoryContent: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  categoryDescription: {
    fontSize: 14,
    marginBottom: 8,
    color: '#666',
  },
  categoryCount: {
    fontSize: 12,
    color: '#999',
  },
  projectCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  projectHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  projectIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  projectContent: {
    flex: 1,
  },
  projectTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  projectDifficulty: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  projectDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  projectMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  projectStats: {
    flexDirection: 'row',
    gap: 16,
  },
  projectStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  projectStatText: {
    fontSize: 12,
    color: '#666',
  },
  startButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#8B4513',
  },
  startButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  toolsScrollView: {
    paddingHorizontal: 20,
  },
  toolsScrollContainer: {
    alignItems: 'center',
    paddingRight: 20,
  },
  toolCard: {
    width: Math.min(screenWidth * 0.35, 160), // Responsive width with max limit
    height: 220, // Increased height to accommodate all content
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'flex-start', // Start from top for consistent layout
    marginRight: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  toolIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  toolTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
    lineHeight: 20,
    flex: 0, // Don't flex, maintain natural size
  },
  toolDescription: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    color: '#666',
    paddingHorizontal: 4,
    flex: 0, // Don't flex, maintain natural size
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  closeButton: {
    padding: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  projectProgressFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: '#58CC02', // Add default color
  },
});
