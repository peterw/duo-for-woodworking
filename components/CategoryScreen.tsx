import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { FontFamilies } from '@/hooks/AppFonts';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useUserProgressStore } from '@/stores';
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


export default function CategoryScreen({ 
  categoryId, 
  categoryTitle, 
  categoryDescription, 
  categoryColor, 
  categoryIcon 
}: CategoryScreenProps) {
  const colorScheme = useColorScheme();
  const { projects, completedSkills } = useUserProgressStore();
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
    let categoryProjects = (projects || []).filter(project => project.category === categoryId);
    
    // Filter by difficulty
    if (filters.difficulty.length > 0) {
      categoryProjects = categoryProjects.filter(project => filters.difficulty.includes(project.difficulty));
    }
    
    // Filter by time range
    if (filters.timeRange.length > 0) {
      categoryProjects = categoryProjects.filter(project => {
        return filters.timeRange.some(filter => {
          if (filter === '0-2 hours') return project.timeRange?.max <= 2;
          if (filter === '2-5 hours') return project.timeRange?.min >= 2 && project.timeRange?.max <= 5;
          if (filter === '5-10 hours') return project.timeRange?.min >= 5 && project.timeRange?.max <= 10;
          if (filter === '10+ hours') return project.timeRange?.min >= 10;
          return false;
        });
      });
    }
    
    // Filter by material cost
    if (filters.materialCost.length > 0) {
      categoryProjects = categoryProjects.filter(project => filters.materialCost.includes(project.materialCost));
    }
    
    return categoryProjects;
  }, [categoryId, filters]);

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
          // Card click - could show project preview or do nothing
          console.log('Project card clicked:', project.id);
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
            style={[
              styles.startButton, 
              { 
                backgroundColor: canStartProject(project) 
                  ? Colors[colorScheme ?? 'light'].primary 
                  : Colors[colorScheme ?? 'light'].tabIconDefault 
              }
            ]}
            disabled={!canStartProject(project)}
            onPress={() => {
              if (canStartProject(project)) {
                router.push(`/woodworking-project/${project.id}`);
              }
            }}
          >
            <Text style={styles.startButtonText}>
              {canStartProject(project) ? 'Start Project' : 'Locked'}
            </Text>
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
