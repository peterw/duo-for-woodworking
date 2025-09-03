import { IconSymbol } from '@/components/ui/IconSymbol';
import { FontFamilies } from '@/hooks/AppFonts';
import { getProjectById } from '@/services/firestoreService';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
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
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

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
  steps?: string[];
}

export default function ProjectDetailScreen() {
  const {top:topPadding} = useSafeAreaInsets()
  const { id } = useLocalSearchParams();
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'materials' | 'tools' | 'steps'>('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch project data from Firestore
  const fetchProjectData = async (projectId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const projectData = await getProjectById(projectId);
      
      if (projectData) {
        // Transform the data to match our interface
        const transformedProject: ProjectDetail = {
          id: projectData.id,
          title: projectData.title || 'Untitled Project',
          description: projectData.description || 'No description available',
          difficulty: projectData.difficulty || 'Beginner',
          estimatedTime: projectData.estimatedTime || 'Unknown',
          materials: projectData.materials || [],
          tools: projectData.tools || [],
          skills: projectData.skills || [],
          category: projectData.category || 'general',
          image: projectData.image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
          materialCost: projectData.materialCost || 'Low',
          timeRange: projectData.timeRange || { min: 1, max: 2 },
          lessonSlices: projectData.lessonSlices || [],
          steps: projectData.steps || []
        };
        
        setProject(transformedProject);
      } else {
        setError('Project not found');
      }
    } catch (err) {
      console.error('Error fetching project:', err);
      setError('Failed to load project. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Get project steps from the actual project data
  const getProjectSteps = (projectData: ProjectDetail): string[] => {
    if (projectData.steps && projectData.steps.length > 0) {
      return projectData.steps;
    }
    
    // Fallback: generate steps based on lesson slices if available
    if (projectData.lessonSlices && projectData.lessonSlices.length > 0) {
      return projectData.lessonSlices.map((slice: any, index: number) => 
        slice.title || `Step ${index + 1}`
      );
    }
    
    // Final fallback: generic steps based on difficulty
    const genericSteps = {
      'Beginner': [
        'Prepare your workspace and materials',
        'Measure and mark your wood',
        'Cut pieces to size',
        'Sand all surfaces smooth',
        'Apply finish and let dry',
        'Assemble your project',
        'Add final touches'
      ],
      'Intermediate': [
        'Plan your project layout',
        'Prepare and cut materials',
        'Create joinery connections',
        'Assemble main structure',
        'Sand and prepare for finish',
        'Apply stain or finish',
        'Add hardware and final details'
      ],
      'Advanced': [
        'Design and plan complex joinery',
        'Prepare premium materials',
        'Create precise joinery',
        'Assemble with precision',
        'Fine-tune and adjust',
        'Apply professional finish',
        'Quality check and final assembly'
      ]
    };
    
    return genericSteps[projectData.difficulty] || genericSteps['Beginner'];
  };

  useEffect(() => {
    if (id) {
      fetchProjectData(id as string);
    }
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
            // Navigate to project slicer to break down the project
            router.push({
              pathname: '/woodworking-project/project-slicer',
              params: { 
                projectId: project.id,
                projectTitle: project.title 
              }
            });
          }
        }
      ]
    );
  };

  const handleViewTutorial = () => {
    router.push('/(tabs)/learn');
  };

  const handleRetry = () => {
    if (id) {
      fetchProjectData(id as string);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#58CC02" />
          <Text style={styles.loadingText}>Loading project...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Error state
  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <IconSymbol name="exclamationmark.triangle" size={48} color="#FF6B6B" />
          <Text style={styles.errorTitle}>Oops! Something went wrong</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // No project found
  if (!project) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <IconSymbol name="questionmark.circle" size={48} color="#FF9600" />
          <Text style={styles.errorTitle}>Project Not Found</Text>
          <Text style={styles.errorText}>The project you're looking for doesn't exist or has been removed.</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={[styles.header, {top:topPadding}]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <IconSymbol name="chevron.left" size={24} color="white" />
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Project Details</Text>
        </View>
        
        <TouchableOpacity style={styles.shareButton}>
          <IconSymbol name="square.and.arrow.up" size={20} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom:100}}>
        {/* Hero Image Section */}
        <View style={styles.heroSection}>
          <Image 
            source={{ uri: project.image }} 
            style={styles.heroImage}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['rgba(0, 0, 0, 0.8)', 'rgba(0, 0, 0, 0.4)', 'rgba(0, 0, 0, 0.1)']}
            style={styles.imageOverlay}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
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
                {project.skills.length > 0 ? (
                  project.skills.map((skill, index) => (
                    <View key={index} style={styles.skillItem}>
                      <IconSymbol name="checkmark.circle.fill" size={16} color="#58CC02" />
                      <Text style={styles.skillText}>{skill.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</Text>
                    </View>
                  ))
                ) : (
                  <Text style={styles.noDataText}>No specific skills listed for this project.</Text>
                )}
              </View>
            </View>
          )}

          {selectedTab === 'materials' && (
            <View style={styles.materialsContent}>
              <Text style={styles.sectionTitle}>Materials Needed</Text>
              {project.materials.length > 0 ? (
                <View style={styles.materialsList}>
                  {project.materials.map((material, index) => (
                    <View key={index} style={styles.materialItem}>
                      <View style={styles.materialBullet} />
                      <Text style={styles.materialText}>{material}</Text>
                    </View>
                  ))}
                </View>
              ) : (
                <Text style={styles.noDataText}>No materials listed for this project.</Text>
              )}
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
              {project.tools.length > 0 ? (
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
              ) : (
                <Text style={styles.noDataText}>No tools listed for this project.</Text>
              )}
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
                {getProjectSteps(project).map((step: string, index: number) => (
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
    </View>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontFamily: FontFamilies.featherBold,
    color: '#FF6B6B',
    marginTop: 10,
    marginBottom: 5,
  },
  errorText: {
    fontSize: 16,
    fontFamily: FontFamilies.dinRounded,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#1CB0F6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 12,
  },
  retryButtonText: {
    fontSize: 16,
    fontFamily: FontFamilies.featherBold,
    color: '#FFFFFF',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    fontFamily: FontFamilies.dinRounded,
    color: '#1CB0F6',
    textDecorationLine: 'underline',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    borderBottomColor: '#F0F0F0',
    position:'absolute',
    zIndex: 1000,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: FontFamilies.featherBold,
    color: 'white',
  },
  shareButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  heroSection: {
    position: 'relative',
    height: 270,
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
    paddingBottom:30
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
    paddingVertical: 18,
    backgroundColor: '#F8F9FA',
    marginHorizontal: 20,
    marginTop: -30,
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
  noDataText: {
    fontSize: 16,
    fontFamily: FontFamilies.dinRounded,
    color: '#666666',
    textAlign: 'center',
    marginTop: 10,
    fontStyle: 'italic',
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
