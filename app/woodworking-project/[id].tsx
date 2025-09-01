import { IconSymbol } from '@/components/ui/IconSymbol';
import { FontFamilies } from '@/hooks/AppFonts';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Dimensions,
    Image,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

interface ProjectDetail {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedTime: string;
  materials: string[];
  tools: string[];
  skills: string[];
  category: string;
  image: string;
  materialCost: 'Low' | 'Medium' | 'High';
  timeRange: {
    min: number;
    max: number;
  };
  lessonSlices: any[];
}

export default function ProjectDetailScreen() {
  const { id } = useLocalSearchParams();
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'materials' | 'tools' | 'steps'>('overview');

  // Mock project data - in real app this would come from API or store
  const getProjectData = (projectId: string): ProjectDetail => {
    const projects: { [key: string]: ProjectDetail } = {
      'wooden-sign': {
        id: 'wooden-sign',
        title: 'Personalized Wooden Sign',
        description: 'Create a custom sign with your favorite quote or family name. This project teaches fundamental woodworking skills while creating a beautiful, personalized piece for your home.',
        difficulty: 'Beginner',
        estimatedTime: '2-3 hours',
        materials: [
          'Pine board (1" x 8" x 24")',
          'Wood stain (your choice of color)',
          'Acrylic paint for lettering',
          'Clear polyurethane finish',
          'Hanging hardware (screws and wire)',
          'Sandpaper (120, 220, 400 grit)'
        ],
        tools: [
          'Jigsaw or scroll saw',
          'Random orbital sander',
          'Paintbrushes (various sizes)',
          'Drill with drill bits',
          'Measuring tape and square',
          'Clamps'
        ],
        skills: ['measuring-marking', 'hand-sawing', 'sanding-finishing'],
        category: 'decorative',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
        materialCost: 'Low',
        timeRange: { min: 2, max: 3 },
        lessonSlices: []
      },
      'wall-art': {
        id: 'wall-art',
        title: 'Geometric Wall Art',
        description: 'Modern geometric patterns made from different wood species. This intermediate project will challenge your precision cutting and assembly skills while creating stunning wall decor.',
        difficulty: 'Intermediate',
        estimatedTime: '6-8 hours',
        materials: [
          'Various hardwoods (maple, walnut, cherry)',
          'Wood glue',
          'Backing board (1/4" plywood)',
          'Clear finish (polyurethane or oil)',
          'Hanging hardware',
          'Sandpaper (120, 220, 400 grit)'
        ],
        tools: [
          'Table saw',
          'Miter saw',
          'Clamps',
          'Random orbital sander',
          'Measuring tape and square',
          'Paintbrushes for finish'
        ],
        skills: ['power-tools-intro', 'basic-joinery', 'sanding-finishing'],
        category: 'decorative',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
        materialCost: 'Medium',
        timeRange: { min: 6, max: 8 },
        lessonSlices: []
      },
      'coffee-table': {
        id: 'coffee-table',
        title: 'Modern Coffee Table',
        description: 'A sleek coffee table with clean lines and hidden storage. This intermediate project combines functionality with modern design principles.',
        difficulty: 'Intermediate',
        estimatedTime: '8-12 hours',
        materials: [
          'Oak hardwood (1" x 6" x 8\')',
          'Plywood (1/2" x 2\' x 4\')',
          'Wood glue',
          'Finish (stain and polyurethane)',
          'Screws and hardware',
          'Sandpaper (120, 220, 400 grit)'
        ],
        tools: [
          'Table saw',
          'Router',
          'Clamps',
          'Random orbital sander',
          'Drill with bits',
          'Measuring tape and square'
        ],
        skills: ['advanced-joinery', 'power-tools-intro', 'sanding-finishing'],
        category: 'furniture',
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
        materialCost: 'Medium',
        timeRange: { min: 8, max: 12 },
        lessonSlices: []
      }
    };
    
    return projects[projectId] || projects['wooden-sign'];
  };

  const mockProject = getProjectData(id as string);

  const getProjectSteps = (projectId: string): string[] => {
    const projectSteps: { [key: string]: string[] } = {
      'wooden-sign': [
        'Prepare and measure your wood',
        'Cut the wood to size',
        'Sand all surfaces smooth',
        'Apply stain and let dry',
        'Paint or stencil your design',
        'Apply protective finish',
        'Attach hanging hardware'
      ],
      'wall-art': [
        'Design your geometric pattern',
        'Cut wood pieces to size',
        'Sand all edges smooth',
        'Assemble pieces with glue',
        'Clamp and let dry',
        'Sand the assembled piece',
        'Apply finish and let dry',
        'Attach hanging hardware'
      ],
      'coffee-table': [
        'Cut table top and legs to size',
        'Create mortise and tenon joints',
        'Assemble table frame',
        'Attach table top',
        'Sand all surfaces smooth',
        'Apply stain and let dry',
        'Apply protective finish',
        'Attach felt pads to bottom'
      ]
    };
    
    return projectSteps[projectId] || projectSteps['wooden-sign'];
  };

  useEffect(() => {
    // In real app, fetch project data based on id
    setProject(mockProject);
  }, [id]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return '#58CC02';
      case 'Intermediate': return '#FF9600';
      case 'Advanced': return '#CE82FF';
      default: return '#58CC02';
    }
  };

  const getMaterialCostColor = (cost: string) => {
    switch (cost) {
      case 'Low': return '#58CC02';
      case 'Medium': return '#FF9600';
      case 'High': return '#CE82FF';
      default: return '#58CC02';
    }
  };

  const handleStartProject = () => {
    if (!project) return;
    
    Alert.alert(
      'Start Project',
      `Are you ready to begin building your ${project.title}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Start Building', 
          style: 'default',
          onPress: () => {
            // Navigate to project slicer or first lesson
            router.push('/(tabs)/projects');
          }
        }
      ]
    );
  };

  const handleViewTutorial = () => {
    router.push('/(tabs)/learn');
  };

  if (!project) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading project...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <IconSymbol name="chevron.left" size={24} color="#000000" />
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Project Details</Text>
        </View>
        
        <TouchableOpacity style={styles.shareButton}>
          <IconSymbol name="square.and.arrow.up" size={20} color="#666666" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Hero Image Section */}
        <View style={styles.heroSection}>
          <Image 
            source={{ uri: project.image }} 
            style={styles.heroImage}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.7)']}
            style={styles.imageOverlay}
          >
            <View style={styles.imageContent}>
              <Text style={styles.projectTitle}>{project.title}</Text>
              <View style={styles.badgeRow}>
                <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(project.difficulty) }]}>
                  <Text style={styles.badgeText}>{project.difficulty}</Text>
                </View>
                <View style={[styles.costBadge, { backgroundColor: getMaterialCostColor(project.materialCost) }]}>
                  <Text style={styles.badgeText}>{project.materialCost} Cost</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Quick Stats */}
        <View style={styles.quickStats}>
          <View style={styles.statItem}>
            <IconSymbol name="clock" size={20} color="#58CC02" />
            <Text style={styles.statLabel}>Time</Text>
            <Text style={styles.statValue}>{project.estimatedTime}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <IconSymbol name="hammer.fill" size={20} color="#1CB0F6" />
            <Text style={styles.statLabel}>Tools</Text>
            <Text style={styles.statValue}>{project.tools.length}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <IconSymbol name="cube.box.fill" size={20} color="#FF9600" />
            <Text style={styles.statLabel}>Materials</Text>
            <Text style={styles.statValue}>{project.materials.length}</Text>
          </View>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          {['overview', 'materials', 'tools', 'steps'].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tab,
                selectedTab === tab && styles.activeTab
              ]}
              onPress={() => setSelectedTab(tab as any)}
            >
              <Text style={[
                styles.tabText,
                selectedTab === tab && styles.activeTabText
              ]}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab Content */}
        <View style={styles.tabContent}>
          {selectedTab === 'overview' && (
            <View style={styles.overviewContent}>
              <Text style={styles.sectionTitle}>About This Project</Text>
              <Text style={styles.descriptionText}>{project.description}</Text>
              
              <Text style={styles.sectionTitle}>What You'll Learn</Text>
              <View style={styles.skillsList}>
                {project.skills.map((skill, index) => (
                  <View key={index} style={styles.skillItem}>
                    <IconSymbol name="checkmark.circle.fill" size={16} color="#58CC02" />
                    <Text style={styles.skillText}>{skill.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {selectedTab === 'materials' && (
            <View style={styles.materialsContent}>
              <Text style={styles.sectionTitle}>Materials Needed</Text>
              <View style={styles.materialsList}>
                {project.materials.map((material, index) => (
                  <View key={index} style={styles.materialItem}>
                    <View style={styles.materialBullet} />
                    <Text style={styles.materialText}>{material}</Text>
                  </View>
                ))}
              </View>
              <View style={styles.costEstimate}>
                <Text style={styles.costEstimateText}>
                  Estimated Cost: ${project.materialCost === 'Low' ? '15-25' : project.materialCost === 'Medium' ? '25-50' : '50-100'}
                </Text>
              </View>
            </View>
          )}

          {selectedTab === 'tools' && (
            <View style={styles.toolsContent}>
              <Text style={styles.sectionTitle}>Tools Required</Text>
              <View style={styles.toolsList}>
                {project.tools.map((tool, index) => (
                  <View key={index} style={styles.toolItem}>
                    <View style={styles.toolIcon}>
                      <IconSymbol name="hammer.fill" size={16} color="#1CB0F6" />
                    </View>
                    <Text style={styles.toolText}>{tool}</Text>
                  </View>
                ))}
              </View>
              <View style={styles.toolsNote}>
                <Text style={styles.toolsNoteText}>
                  Don't have all the tools? Check our tool rental program or visit your local makerspace!
                </Text>
              </View>
            </View>
          )}

          {selectedTab === 'steps' && project && (
            <View style={styles.stepsContent}>
              <Text style={styles.sectionTitle}>Project Steps</Text>
              <View style={styles.stepsList}>
                {getProjectSteps(project.id).map((step: string, index: number) => (
                  <View key={index} style={styles.stepItem}>
                    <View style={styles.stepNumber}>
                      <Text style={styles.stepNumberText}>{index + 1}</Text>
                    </View>
                    <Text style={styles.stepText}>{step}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.tutorialButton}
            onPress={handleViewTutorial}
          >
            <IconSymbol name="play.circle" size={20} color="#1CB0F6" />
            <Text style={styles.tutorialButtonText}>View Tutorial</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.startProjectButton}
            onPress={handleStartProject}
          >
            <LinearGradient
              colors={['#58CC02', '#46B700']}
              style={styles.startProjectGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <IconSymbol name="hammer.fill" size={20} color="white" />
              <Text style={styles.startProjectButtonText}>Start Project</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    fontSize: 16,
    fontFamily: FontFamilies.dinRounded,
    color: '#666666',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    padding: 8,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: FontFamilies.featherBold,
    color: '#000000',
  },
  shareButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  heroSection: {
    position: 'relative',
    height: 250,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '100%',
    justifyContent: 'flex-end',
  },
  imageContent: {
    padding: 20,
  },
  projectTitle: {
    fontSize: 28,
    fontFamily: FontFamilies.featherBold,
    color: '#FFFFFF',
    marginBottom: 12,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  costBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: FontFamilies.featherBold,
  },
  quickStats: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: '#F8F9FA',
    marginHorizontal: 20,
    marginTop: -20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 8,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: FontFamilies.dinRounded,
    color: '#666666',
    marginTop: 4,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 16,
    fontFamily: FontFamilies.featherBold,
    color: '#000000',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 24,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#58CC02',
  },
  tabText: {
    fontSize: 14,
    fontFamily: FontFamilies.dinRounded,
    color: '#666666',
  },
  activeTabText: {
    color: '#58CC02',
    fontFamily: FontFamilies.featherBold,
  },
  tabContent: {
    paddingHorizontal: 20,
    minHeight: 300,
  },
  overviewContent: {
    gap: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: FontFamilies.featherBold,
    color: '#000000',
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 16,
    fontFamily: FontFamilies.dinRounded,
    color: '#333333',
    lineHeight: 24,
  },
  skillsList: {
    gap: 12,
  },
  skillItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  skillText: {
    fontSize: 16,
    fontFamily: FontFamilies.dinRounded,
    color: '#333333',
  },
  materialsContent: {
    gap: 20,
  },
  materialsList: {
    gap: 12,
  },
  materialItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  materialBullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#58CC02',
  },
  materialText: {
    fontSize: 16,
    fontFamily: FontFamilies.dinRounded,
    color: '#333333',
    flex: 1,
  },
  costEstimate: {
    backgroundColor: '#F0F8FF',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#1CB0F6',
  },
  costEstimateText: {
    fontSize: 16,
    fontFamily: FontFamilies.featherBold,
    color: '#1CB0F6',
  },
  toolsContent: {
    gap: 20,
  },
  toolsList: {
    gap: 12,
  },
  toolItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  toolIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0F8FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  toolText: {
    fontSize: 16,
    fontFamily: FontFamilies.dinRounded,
    color: '#333333',
    flex: 1,
  },
  toolsNote: {
    backgroundColor: '#FFF3CD',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9600',
  },
  toolsNoteText: {
    fontSize: 14,
    fontFamily: FontFamilies.dinRounded,
    color: '#856404',
  },
  stepsContent: {
    gap: 20,
  },
  stepsList: {
    gap: 16,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#58CC02',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  stepNumberText: {
    fontSize: 16,
    fontFamily: FontFamilies.featherBold,
    color: '#FFFFFF',
  },
  stepText: {
    fontSize: 16,
    fontFamily: FontFamilies.dinRounded,
    color: '#333333',
    flex: 1,
    lineHeight: 22,
  },
  actionButtons: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    gap: 16,
  },
  tutorialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderWidth: 2,
    borderColor: '#1CB0F6',
    borderRadius: 12,
    gap: 8,
  },
  tutorialButtonText: {
    fontSize: 16,
    fontFamily: FontFamilies.featherBold,
    color: '#1CB0F6',
  },
  startProjectButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  startProjectGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 24,
    gap: 8,
  },
  startProjectButtonText: {
    fontSize: 18,
    fontFamily: FontFamilies.featherBold,
    color: '#FFFFFF',
  },
});
