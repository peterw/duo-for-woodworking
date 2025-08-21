import CutListOptimizer from '@/components/CutListOptimizer';
import OfflineContentManager from '@/components/OfflineContentManager';
import ProjectSlicer from '@/components/ProjectSlicer';
import ToolMaterialLibrary from '@/components/ToolMaterialLibrary';
import { Header } from '@/components/ui/Header';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { FontFamilies } from '@/hooks/AppFonts';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useUserProgressStore } from '@/stores';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
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
  materialCost: 'Low' | 'Medium' | 'High';
  timeRange: {
    min: number;
    max: number;
  };
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

// Enhanced project data with more projects and proper categorization
const enhancedProjects: Project[] = [
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

export default function ProjectsScreen() {
  const colorScheme = useColorScheme();
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

  const getMaterialCostColor = (cost: string) => {
    switch (cost) {
      case 'Low': return '#4CAF50';
      case 'Medium': return '#FF9800';
      case 'High': return '#F44336';
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

  const handleCategoryPress = (categoryId: string) => {
    router.push(`/category/${categoryId}`);
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
      onPress={() => handleCategoryPress(category.id)}
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
        <Text style={[styles.categoryCount, { color: Colors[colorScheme ?? 'light'].primary }]}>
          {enhancedProjects.filter(p => p.category === category.id).length} projects
        </Text>
      </View>
      <View style={styles.categoryArrow}>
        <IconSymbol name="chevron.right" size={20} color={Colors[colorScheme ?? 'light'].tabIconDefault} />
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
          <View style={[styles.projectIcon, { backgroundColor: Colors[colorScheme ?? 'light'].primary }]}>
            <IconSymbol name="hammer.fill" size={20} color="white" />
          </View>
          <View style={styles.projectContent}>
            <Text style={[styles.projectTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
              {project.title}
            </Text>
            <View style={styles.projectMetaRow}>
              <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(project.difficulty) }]}>
                <Text style={styles.difficultyBadgeText}>{project.difficulty}</Text>
              </View>
              <View style={[styles.costBadge, { backgroundColor: getMaterialCostColor(project.materialCost) }]}>
                <Text style={styles.costBadgeText}>{project.materialCost} Cost</Text>
              </View>
            </View>
            <Text style={[styles.projectDescription, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]}>
              {project.description}
            </Text>
          </View>
        </View>
        
        <View style={styles.projectFooter}>
          <View style={styles.projectStats}>
            <View style={styles.projectStat}>
              <IconSymbol name="clock.fill" size={14} color={Colors[colorScheme ?? 'light'].primary} />
              <Text style={[styles.projectStatText, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]}>
                {project.estimatedTime}
              </Text>
            </View>
            <View style={styles.projectStat}>
              <IconSymbol name="hammer.fill" size={14} color={Colors[colorScheme ?? 'light'].primary} />
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
                  ? Colors[colorScheme ?? 'light'].primary 
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
          {enhancedProjects.slice(0, 6).map(renderProjectCard)}
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
              <View style={[styles.toolIcon, { backgroundColor: Colors[colorScheme ?? 'light'].primary }]}>
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
              <View style={[styles.toolIcon, { backgroundColor: Colors[colorScheme ?? 'light'].primary }]}>
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
              <View style={[styles.toolIcon, { backgroundColor: Colors[colorScheme ?? 'light'].primary }]}>
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
    fontFamily: FontFamilies.featherBold,
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  categoryCard: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
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
    fontFamily: FontFamilies.featherBold,
    marginBottom: 4,
  },
  categoryDescription: {
    fontSize: 14,
    fontFamily: FontFamilies.dinRounded,
    marginBottom: 8,
    color: '#666',
  },
  categoryCount: {
    fontSize: 12,
    fontFamily: FontFamilies.dinRounded,
    color: '#999',
  },
  categoryArrow: {
    padding: 8,
  },
  projectCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  projectHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  projectIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  projectContent: {
    flex: 1,
  },
  projectTitle: {
    fontSize: 16,
    fontFamily: FontFamilies.featherBold,
    marginBottom: 8,
  },
  projectMetaRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyBadgeText: {
    color: 'white',
    fontSize: 10,
    fontFamily: FontFamilies.dinRounded,
  },
  costBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  costBadgeText: {
    color: 'white',
    fontSize: 10,
    fontFamily: FontFamilies.dinRounded,
  },
  projectDescription: {
    fontSize: 14,
    fontFamily: FontFamilies.dinRounded,
    lineHeight: 20,
    marginBottom: 12,
  },
  projectFooter: {
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
    fontFamily: FontFamilies.dinRounded,
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
    fontFamily: FontFamilies.dinRounded,
  },
  toolsScrollView: {
    paddingHorizontal: 20,
  },
  toolsScrollContainer: {
    alignItems: 'center',
    paddingRight: 20,
  },
  toolCard: {
    width: Math.min(screenWidth * 0.35, 160),
    height: 220,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginRight: 16,
    marginVertical: 8,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    fontFamily: FontFamilies.featherBold,
    marginBottom: 12,
    textAlign: 'center',
    lineHeight: 20,
    flex: 0,
  },
  toolDescription: {
    fontSize: 13,
    fontFamily: FontFamilies.dinRounded,
    textAlign: 'center',
    lineHeight: 18,
    color: '#666',
    paddingHorizontal: 4,
    flex: 0,
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
    fontFamily: FontFamilies.featherBold,
  },
  projectProgressFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: '#58CC02',
  },
});
