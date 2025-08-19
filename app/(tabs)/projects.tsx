import { Header } from '@/components/ui/Header';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useUserProgressStore, woodworkingProjects } from '@/stores';
import React, { useState } from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

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
  const { completedSkills } = useUserProgressStore();

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
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Header 
          title="Wood Working Projects" 
          subtitle="Choose from hundreds of projects to build"
          showSafeArea={false}
        />

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
      </ScrollView>
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
});
