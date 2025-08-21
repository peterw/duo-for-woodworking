import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { FontFamilies } from '@/hooks/AppFonts';
import { useColorScheme } from '@/hooks/useColorScheme';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  Dimensions,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: screenWidth } = Dimensions.get('window');

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

interface CategoryScreenProps {
  categoryId: string;
  categoryTitle: string;
  categoryDescription: string;
  categoryColor: string;
  categoryIcon: string;
}

interface FilterState {
  difficulty: string[];
  timeRange: string[];
  materialCost: string[];
}

// Enhanced project data
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

export default function CategoryScreen({ 
  categoryId, 
  categoryTitle, 
  categoryDescription, 
  categoryColor, 
  categoryIcon 
}: CategoryScreenProps) {
  const colorScheme = useColorScheme();
  const [filters, setFilters] = useState<FilterState>({
    difficulty: [],
    timeRange: [],
    materialCost: [],
  });
  const [showFiltersModal, setShowFiltersModal] = useState(false);

  // Filter options
  const filterOptions = {
    difficulty: ['Beginner', 'Intermediate', 'Advanced'],
    timeRange: ['0-2 hours', '2-5 hours', '5-10 hours', '10+ hours'],
    materialCost: ['Low', 'Medium', 'High'],
  };

  // Filter projects based on selected category and filters
  const filteredProjects = useMemo(() => {
    let projects = enhancedProjects.filter(project => project.category === categoryId);
    
    // Filter by difficulty
    if (filters.difficulty.length > 0) {
      projects = projects.filter(project => filters.difficulty.includes(project.difficulty));
    }
    
    // Filter by time range
    if (filters.timeRange.length > 0) {
      projects = projects.filter(project => {
        return filters.timeRange.some(filter => {
          if (filter === '0-2 hours') return project.timeRange.max <= 2;
          if (filter === '2-5 hours') return project.timeRange.min >= 2 && project.timeRange.max <= 5;
          if (filter === '5-10 hours') return project.timeRange.min >= 5 && project.timeRange.max <= 10;
          if (filter === '10+ hours') return project.timeRange.min >= 10;
          return false;
        });
      });
    }
    
    // Filter by material cost
    if (filters.materialCost.length > 0) {
      projects = projects.filter(project => filters.materialCost.includes(project.materialCost));
    }
    
    return projects;
  }, [categoryId, filters]);

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

  const toggleFilter = (filterType: keyof FilterState, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType].includes(value)
        ? prev[filterType].filter(item => item !== value)
        : [...prev[filterType], value]
    }));
  };

  const clearFilters = () => {
    setFilters({
      difficulty: [],
      timeRange: [],
      materialCost: [],
    });
  };

  const renderFilterChip = (filterType: keyof FilterState, value: string) => {
    const isSelected = filters[filterType].includes(value);
    return (
      <TouchableOpacity
        key={value}
        style={[
          styles.filterChip,
          {
            backgroundColor: isSelected 
              ? Colors[colorScheme ?? 'light'].primary 
              : Colors[colorScheme ?? 'light'].background,
            borderColor: Colors[colorScheme ?? 'light'].border,
          },
        ]}
        onPress={() => toggleFilter(filterType, value)}
      >
        <Text style={[
          styles.filterChipText,
          { 
            color: isSelected 
              ? 'white' 
              : Colors[colorScheme ?? 'light'].text 
          }
        ]}>
          {value}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderFiltersModal = () => (
    <Modal
      visible={showFiltersModal}
      animationType="slide"
      presentationStyle="pageSheet"
      transparent={false}
    >
      <View style={[styles.modalContainer, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
        <View style={styles.modalHeader}>
          <TouchableOpacity
            onPress={() => setShowFiltersModal(false)}
            style={styles.closeButton}
          >
            <IconSymbol name="xmark" size={24} color={Colors[colorScheme ?? 'light'].text} />
          </TouchableOpacity>
          <Text style={[styles.modalTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
            Filters & Sorting
          </Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
          {/* Difficulty Section */}
          <View style={styles.modalSection}>
            <Text style={[styles.modalSectionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
              Difficulty Level
            </Text>
            <View style={styles.filterChipsGrid}>
              {filterOptions.difficulty.map(value => renderFilterChip('difficulty', value))}
            </View>
          </View>

          {/* Time Range Section */}
          <View style={styles.modalSection}>
            <Text style={[styles.modalSectionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
              Time Range
            </Text>
            <View style={styles.filterChipsGrid}>
              {filterOptions.timeRange.map(value => renderFilterChip('timeRange', value))}
            </View>
          </View>

          {/* Material Cost Section */}
          <View style={styles.modalSection}>
            <Text style={[styles.modalSectionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
              Material Cost
            </Text>
            <View style={styles.filterChipsGrid}>
              {filterOptions.materialCost.map(value => renderFilterChip('materialCost', value))}
            </View>
          </View>
        </ScrollView>

        <View style={styles.modalFooter}>
          <TouchableOpacity
            style={[styles.clearFiltersButton, { backgroundColor: Colors[colorScheme ?? 'light'].backgroundSecondary }]}
            onPress={clearFilters}
          >
            <Text style={[styles.clearFiltersButtonText, { color: Colors[colorScheme ?? 'light'].text }]}>
              Clear All
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.applyButton, { backgroundColor: Colors[colorScheme ?? 'light'].primary }]}
            onPress={() => setShowFiltersModal(false)}
          >
            <Text style={styles.applyButtonText}>Apply Filters</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const renderProjectCard = (project: Project) => {
    return (
      <TouchableOpacity
        key={project.id}
        style={[
          styles.projectCard,
          {
            backgroundColor: Colors[colorScheme ?? 'light'].background,
            borderColor: Colors[colorScheme ?? 'light'].border,
          },
        ]}
        onPress={() => {
          // Navigate to project detail or start project
          console.log('Navigate to project:', project.id);
        }}
      >
        <View style={styles.projectImageContainer}>
          <Image 
            source={{ uri: project.image }} 
            style={styles.projectImage}
            resizeMode="cover"
          />
          <View style={styles.projectOverlay}>
            <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(project.difficulty) }]}>
              <Text style={styles.difficultyBadgeText}>{project.difficulty}</Text>
            </View>
            <View style={[styles.costBadge, { backgroundColor: getMaterialCostColor(project.materialCost) }]}>
              <Text style={styles.costBadgeText}>{project.materialCost}</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.projectContent}>
          <Text style={[styles.projectTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
            {project.title}
          </Text>
          <Text style={[styles.projectDescription, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]}>
            {project.description}
          </Text>
          
          <View style={styles.projectMeta}>
            <View style={styles.projectMetaItem}>
              <IconSymbol name="clock.fill" size={14} color={Colors[colorScheme ?? 'light'].primary} />
              <Text style={[styles.projectMetaText, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]}>
                {project.estimatedTime}
              </Text>
            </View>
            <View style={styles.projectMetaItem}>
              <IconSymbol name="hammer.fill" size={14} color={Colors[colorScheme ?? 'light'].primary} />
              <Text style={[styles.projectMetaText, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]}>
                {project.tools.length} tools
              </Text>
            </View>
            <View style={styles.projectMetaItem}>
              <IconSymbol name="star.fill" size={14} color={Colors[colorScheme ?? 'light'].primary} />
              <Text style={[styles.projectMetaText, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]}>
                {project.difficulty}
              </Text>
            </View>
          </View>
          
          <TouchableOpacity
            style={[styles.startButton, { backgroundColor: Colors[colorScheme ?? 'light'].primary }]}
            onPress={() => {
              // Navigate to start project
              console.log('Start project:', project.id);
            }}
          >
            <Text style={styles.startButtonText}>Start Project</Text>
            <IconSymbol name="arrow.right" size={16} color="white" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <IconSymbol name="chevron.left" size={24} color={Colors[colorScheme ?? 'light'].text} />
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <View style={[styles.categoryIcon, { backgroundColor: categoryColor }]}>
            <IconSymbol name={categoryIcon as any} size={28} color="white" />
          </View>
          <View style={styles.headerText}>
            <Text style={[styles.categoryTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
              {categoryTitle}
            </Text>
            <Text style={[styles.categoryDescription, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]}>
              {categoryDescription}
            </Text>
          </View>
        </View>
      </View>

      {/* Filters Button */}
      <View style={styles.filtersSection}>
        <TouchableOpacity
          style={[styles.filtersButton, { backgroundColor: Colors[colorScheme ?? 'light'].backgroundSecondary }]}
          onPress={() => setShowFiltersModal(true)}
        >
          <IconSymbol name="slider.horizontal.3" size={20} color={Colors[colorScheme ?? 'light'].text} />
          <Text style={[styles.filtersButtonText, { color: Colors[colorScheme ?? 'light'].text }]}>
            Filters
          </Text>
        </TouchableOpacity>
        
        <Text style={[styles.projectsCount, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]}>
          {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''} found
        </Text>
      </View>

      {/* Projects Section */}
      <View style={styles.projectsSection}>
        <ScrollView 
          style={styles.projectsScroll}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.projectsContent}
        >
          {filteredProjects.map(renderProjectCard)}
        </ScrollView>
      </View>

      {/* Filters Modal */}
      {renderFiltersModal()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerText: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 24,
    fontFamily: FontFamilies.featherBold,
    marginBottom: 4,
  },
  categoryDescription: {
    fontSize: 16,
    fontFamily: FontFamilies.dinRounded,
    lineHeight: 22,
  },
  filtersSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    // borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  filtersButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  filtersButtonText: {
    fontSize: 14,
    fontFamily: FontFamilies.dinRounded,
    marginLeft: 8,
  },
  projectsCount: {
    fontSize: 14,
    fontFamily: FontFamilies.dinRounded,
  },
  projectsSection: {
    flex: 1,
    // paddingHorizontal: 20,
    paddingTop: 20,
  },
  projectsScroll: {
    flex: 1,
  },
  projectsContent: {
    paddingTop:5,
    paddingBottom: 40,
  },
  projectCard: {
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width:"88%",
    alignSelf:'center'
  },
  projectImageContainer: {
    position: 'relative',
    height: 140,
    borderTopLeftRadius:10,
    borderTopRightRadius:10,
    overflow: 'hidden',
  },
  projectImage: {
    width: '100%',
    height: '100%',
  },
  projectOverlay: {
    borderRadius:10,
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    gap: 6,
  },
  difficultyBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  difficultyBadgeText: {
    color: 'white',
    fontSize: 10,
    fontFamily: FontFamilies.dinRounded,
  },
  costBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  costBadgeText: {
    color: 'white',
    fontSize: 10,
    fontFamily: FontFamilies.dinRounded,
  },
  projectContent: {
    padding: 16,
  },
  projectTitle: {
    fontSize: 18,
    fontFamily: FontFamilies.featherBold,
    marginBottom: 6,
    lineHeight: 22,
  },
  projectDescription: {
    fontSize: 14,
    fontFamily: FontFamilies.dinRounded,
    lineHeight: 18,
    marginBottom: 12,
  },
  projectMeta: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  projectMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  projectMetaText: {
    fontSize: 12,
    fontFamily: FontFamilies.dinRounded,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  startButtonText: {
    color: 'white',
    fontSize: 14,
    fontFamily: FontFamilies.dinRounded,
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  closeButton: {
    padding: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: FontFamilies.featherBold,
  },
  modalContent: {
    flex: 1,
  },
  modalSection: {
    marginBottom: 20,
  },
  modalSectionTitle: {
    fontSize: 18,
    fontFamily: FontFamilies.featherBold,
    marginBottom: 12,
  },
  filterChipsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  filterChipText: {
    fontSize: 14,
    fontFamily: FontFamilies.dinRounded,
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 12,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  clearFiltersButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: '#F8F8F8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  clearFiltersButtonText: {
    fontSize: 16,
    fontFamily: FontFamilies.dinRounded,
    color: '#666666',
  },
  applyButton: {
    flex: 2,
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  applyButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: FontFamilies.dinRounded,
  },
});
