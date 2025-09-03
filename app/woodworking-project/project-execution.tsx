import { IconSymbol } from '@/components/ui/IconSymbol';
import { FontFamilies } from '@/hooks/AppFonts';
import { getProjectById, updateProjectProgress } from '@/services/firestoreService';
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

interface ProjectSlice {
  id: string;
  title: string;
  description: string;
  type: 'planning' | 'cutting' | 'assembly' | 'finishing' | 'safety';
  duration: number; // in minutes
  steps: string[];
  successCriteria: string[];
  photoCheckRequired: boolean;
  materials: string[];
  tools: string[];
  order: number;
  isCompleted?: boolean;
  completedPhotos?: string[];
  notes?: string;
}

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

export default function ProjectExecutionScreen() {
  const { top: topPadding } = useSafeAreaInsets();
  const { projectId, projectTitle } = useLocalSearchParams();
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [slices, setSlices] = useState<ProjectSlice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSliceIndex, setCurrentSliceIndex] = useState(0);
  const [showProgress, setShowProgress] = useState(false);

  // Fetch project data
  const fetchProjectData = async (projectId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const projectData = await getProjectById(projectId);
      
      if (projectData) {
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
        
        // Generate default slices if none exist
        if (!projectData.lessonSlices || projectData.lessonSlices.length === 0) {
          generateDefaultSlices(transformedProject);
        } else {
          setSlices(projectData.lessonSlices.map((slice: any, index: number) => ({
            id: slice.id || `slice-${index}`,
            title: slice.title || `Step ${index + 1}`,
            description: slice.description || '',
            type: slice.type || 'planning',
            duration: slice.duration || 30,
            steps: slice.steps || [],
            successCriteria: slice.successCriteria || [],
            photoCheckRequired: slice.photoCheckRequired || false,
            materials: slice.materials || [],
            tools: slice.tools || [],
            order: index + 1,
            isCompleted: slice.isCompleted || false,
            completedPhotos: slice.completedPhotos || [],
            notes: slice.notes || ''
          })));
        }
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

  // Generate default slices based on project difficulty
  const generateDefaultSlices = (projectData: ProjectDetail) => {
    const defaultSlices: ProjectSlice[] = [
      {
        id: 'slice-1',
        title: 'Project Planning & Setup',
        description: 'Plan your workspace and gather all materials and tools',
        type: 'planning',
        duration: 30,
        steps: [
          'Review project requirements',
          'Gather all materials',
          'Prepare your workspace',
          'Check all tools are ready'
        ],
        successCriteria: [
          'All materials are gathered',
          'Workspace is clean and organized',
          'Safety equipment is ready'
        ],
        photoCheckRequired: true,
        materials: projectData.materials.slice(0, 3),
        tools: projectData.tools.slice(0, 3),
        order: 1,
        isCompleted: false,
        completedPhotos: [],
        notes: ''
      },
      {
        id: 'slice-2',
        title: 'Material Preparation',
        description: 'Cut and prepare all wood pieces to size',
        type: 'cutting',
        duration: 60,
        steps: [
          'Measure and mark wood pieces',
          'Cut pieces to required dimensions',
          'Sand edges smooth',
          'Label pieces for assembly'
        ],
        successCriteria: [
          'All pieces are cut to size',
          'Edges are sanded smooth',
          'Pieces are properly labeled'
        ],
        photoCheckRequired: true,
        materials: projectData.materials,
        tools: projectData.tools.filter(tool => 
          tool.toLowerCase().includes('saw') || 
          tool.toLowerCase().includes('sander') ||
          tool.toLowerCase().includes('measure')
        ),
        order: 2,
        isCompleted: false,
        completedPhotos: [],
        notes: ''
      },
      {
        id: 'slice-3',
        title: 'Assembly & Joinery',
        description: 'Assemble the project using appropriate joinery techniques',
        type: 'assembly',
        duration: 90,
        steps: [
          'Dry fit all pieces',
          'Apply glue or fasteners',
          'Clamp pieces together',
          'Check alignment and squareness'
        ],
        successCriteria: [
          'All pieces are properly joined',
          'Project is square and aligned',
          'Joints are secure and clean'
        ],
        photoCheckRequired: true,
        materials: projectData.materials.filter(material => 
          material.toLowerCase().includes('glue') || 
          material.toLowerCase().includes('screw') ||
          material.toLowerCase().includes('nail')
        ),
        tools: projectData.tools.filter(tool => 
          tool.toLowerCase().includes('clamp') || 
          tool.toLowerCase().includes('drill') ||
          tool.toLowerCase().includes('hammer')
        ),
        order: 3,
        isCompleted: false,
        completedPhotos: [],
        notes: ''
      },
      {
        id: 'slice-4',
        title: 'Finishing & Details',
        description: 'Apply finish and add final details',
        type: 'finishing',
        duration: 60,
        steps: [
          'Sand all surfaces smooth',
          'Apply stain or finish',
          'Add final details and hardware',
          'Quality check the final result'
        ],
        successCriteria: [
          'All surfaces are smooth',
          'Finish is applied evenly',
          'Project meets quality standards'
        ],
        photoCheckRequired: true,
        materials: projectData.materials.filter(material => 
          material.toLowerCase().includes('stain') || 
          material.toLowerCase().includes('finish') ||
          material.toLowerCase().includes('sandpaper')
        ),
        tools: projectData.tools.filter(tool => 
          tool.toLowerCase().includes('brush') || 
          tool.toLowerCase().includes('sander')
        ),
        order: 4,
        isCompleted: false,
        completedPhotos: [],
        notes: ''
      }
    ];
    
    setSlices(defaultSlices);
  };

  useEffect(() => {
    if (projectId) {
      fetchProjectData(projectId as string);
    }
  }, [projectId]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'planning': return '#FFEAA7';
      case 'cutting': return '#FF6B6B';
      case 'assembly': return '#4ECDC4';
      case 'finishing': return '#45B7D1';
      case 'safety': return '#96CEB4';
      default: return '#58CC02';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'planning': return 'pencil';
      case 'cutting': return 'scissors';
      case 'assembly': return 'link';
      case 'finishing': return 'paintbrush.fill';
      case 'safety': return 'shield.fill';
      default: return 'lightbulb.fill';
    }
  };

  const handleSlicePress = (sliceIndex: number) => {
    setCurrentSliceIndex(sliceIndex);
    setShowProgress(true);
  };

  const handleCompleteSlice = (sliceId: string) => {
    Alert.alert(
      'Complete Lesson Slice',
      'Are you sure you want to mark this slice as complete?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Complete', 
          style: 'default',
          onPress: async () => {
            try {
              // Update local state first
              const updatedSlices = slices.map(slice => 
                slice.id === sliceId 
                  ? { ...slice, isCompleted: true }
                  : slice
              );
              
              setSlices(updatedSlices);
              
              // Save progress to Firebase
              if (projectId) {
                await updateProjectProgress(projectId as string, updatedSlices);
              }
              
              // Check if all slices are completed
              const allCompleted = updatedSlices.every(slice => slice.isCompleted);
              
              if (allCompleted) {
                Alert.alert(
                  '🎉 Project Complete!',
                  'Congratulations! You have successfully completed your woodworking project!',
                  [
                    { 
                      text: 'View Progress', 
                      onPress: () => setShowProgress(false)
                    },
                    { 
                      text: 'Back to Projects', 
                      onPress: () => router.push('/(tabs)/projects')
                    }
                  ]
                );
              } else {
                // Navigate back to the main execution view after completing a slice
                setShowProgress(false);
              }
            } catch (error) {
              console.error('Error saving progress:', error);
              Alert.alert(
                'Error',
                'Failed to save progress. Please try again.',
                [{ text: 'OK' }]
              );
            }
          }
        }
      ]
    );
  };

  const handleRetry = () => {
    if (projectId) {
      fetchProjectData(projectId as string);
    }
  };

  const getProgressPercentage = () => {
    if (slices.length === 0) return 0;
    const completedCount = slices.filter(slice => slice.isCompleted).length;
    return Math.round((completedCount / slices.length) * 100);
  };

  const getCurrentSlice = () => slices[currentSliceIndex];

  // Loading state
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#58CC02" />
          <Text style={styles.loadingText}>Loading project execution...</Text>
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

  if (!project) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <IconSymbol name="questionmark.circle" size={48} color="#FF9600" />
          <Text style={styles.errorTitle}>Project Not Found</Text>
          <Text style={styles.errorText}>The project you're looking for doesn't exist.</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Show progress view
  if (showProgress && getCurrentSlice()) {
    const currentSlice = getCurrentSlice();
    
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        
        {/* Header */}
        <View style={[styles.header, { paddingTop: topPadding }]}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => setShowProgress(false)}
          >
            <IconSymbol name="chevron.left" size={24} color="black" />
          </TouchableOpacity>
          
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Lesson {currentSlice.order}</Text>
          </View>
          
          <TouchableOpacity style={styles.helpButton}>
            <IconSymbol name="questionmark.circle" size={20} color="black" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom:80}}>
          {/* Progress Header */}
          <View style={styles.progressHeader}>
            <View style={styles.progressInfo}>
              <Text style={styles.progressTitle}>{currentSlice.title}</Text>
              <Text style={styles.progressDescription}>{currentSlice.description}</Text>
              <View style={styles.progressMeta}>
                <View style={[styles.typeBadge, { backgroundColor: getTypeColor(currentSlice.type) }]}>
                  <IconSymbol name={getTypeIcon(currentSlice.type)} size={12} color="white" />
                  <Text style={styles.typeText}>{currentSlice.type}</Text>
                </View>
                <View style={styles.durationBadge}>
                  <IconSymbol name="clock" size={12} color="#666" />
                  <Text style={styles.durationText}>{currentSlice.duration} min</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Steps */}
          <View style={styles.stepsSection}>
            <Text style={styles.sectionTitle}>Steps to Complete</Text>
            {currentSlice.steps.map((step, stepIndex) => (
              <View key={stepIndex} style={styles.stepItem}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>{stepIndex + 1}</Text>
                </View>
                <Text style={styles.stepText}>{step}</Text>
              </View>
            ))}
          </View>

          {/* Success Criteria */}
          <View style={styles.criteriaSection}>
            <Text style={styles.sectionTitle}>Success Criteria</Text>
            {currentSlice.successCriteria.map((criteria, criteriaIndex) => (
              <View key={criteriaIndex} style={styles.criteriaItem}>
                <IconSymbol name="checkmark.circle.fill" size={16} color="#58CC02" />
                <Text style={styles.criteriaText}>{criteria}</Text>
              </View>
            ))}
          </View>

          {/* Materials & Tools */}
          <View style={styles.resourcesSection}>
            <View style={styles.materialsSection}>
              <Text style={styles.sectionTitle}>Materials Needed</Text>
              {currentSlice.materials.map((material, index) => (
                <View key={index} style={styles.resourceItem}>
                  <View style={styles.resourceBullet} />
                  <Text style={styles.resourceText}>{material}</Text>
                </View>
              ))}
            </View>
            
            <View style={styles.toolsSection}>
              <Text style={styles.sectionTitle}>Tools Required</Text>
              {currentSlice.tools.map((tool, index) => (
                <View key={index} style={styles.resourceItem}>
                  <View style={styles.toolIcon}>
                    <IconSymbol name="hammer.fill" size={12} color="#1CB0F6" />
                  </View>
                  <Text style={styles.resourceText}>{tool}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Complete Button */}
          <View style={styles.completeSection}>
            <TouchableOpacity 
              style={styles.completeButton}
              onPress={() => handleCompleteSlice(currentSlice.id)}
            >
              <LinearGradient
                colors={['#58CC02', '#46B700']}
                style={styles.completeButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <IconSymbol name="checkmark.circle.fill" size={20} color="white" />
                <Text style={styles.completeButtonText}>Mark as Complete</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }

  // Main execution view
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPadding }]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <IconSymbol name="chevron.left" size={24} color="black" />
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Project Execution</Text>
        </View>
        
        <TouchableOpacity style={styles.helpButton}>
          <IconSymbol name="questionmark.circle" size={20} color="black" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom:80}}>
        {/* Project Info */}
        <View style={styles.projectInfo}>
          <Image 
            source={{ uri: project.image }} 
            style={styles.projectImage}
            resizeMode="cover"
          />
          <View style={styles.projectDetails}>
            <Text style={styles.projectTitle}>{project.title}</Text>
            <Text style={styles.projectDescription}>{project.description}</Text>
            
            {/* Progress Bar */}
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { width: `${getProgressPercentage()}%` }
                  ]} 
                />
              </View>
              <Text style={styles.progressText}>
                {getProgressPercentage()}% Complete
              </Text>
            </View>
          </View>
        </View>

        {/* Instructions */}
        <View style={styles.instructions}>
          <Text style={styles.instructionsTitle}>Work Through Your Project</Text>
          <Text style={styles.instructionsText}>
            Click on any lesson slice to view detailed steps and mark it as complete when finished.
          </Text>
        </View>

        {/* Slices */}
        <View style={styles.slicesContainer}>
          {slices.map((slice, index) => (
            <TouchableOpacity
              key={slice.id}
              style={[
                styles.sliceCard,
                slice.isCompleted && styles.completedSliceCard
              ]}
              onPress={() => handleSlicePress(index)}
            >
              <View style={styles.sliceHeader}>
                <View style={[
                  styles.sliceNumber,
                  slice.isCompleted && styles.completedSliceNumber
                ]}>
                  {slice.isCompleted ? (
                    <IconSymbol name="checkmark" size={20} color="white" />
                  ) : (
                    <Text style={styles.sliceNumberText}>{slice.order}</Text>
                  )}
                </View>
                <View style={styles.sliceInfo}>
                  <Text style={[
                    styles.sliceTitle,
                    slice.isCompleted && styles.completedSliceTitle
                  ]}>
                    {slice.title}
                  </Text>
                  <Text style={styles.sliceDescription}>{slice.description}</Text>
                  <View style={styles.sliceMeta}>
                    <View style={[styles.typeBadge, { backgroundColor: getTypeColor(slice.type) }]}>
                      <IconSymbol name={getTypeIcon(slice.type)} size={12} color="white" />
                      <Text style={styles.typeText}>{slice.type}</Text>
                    </View>
                    <View style={styles.durationBadge}>
                      <IconSymbol name="clock" size={12} color="#666" />
                      <Text style={styles.durationText}>{slice.duration} min</Text>
                    </View>
                    {slice.isCompleted && (
                      <View style={styles.completedBadge}>
                        <IconSymbol name="checkmark.circle.fill" size={12} color="#58CC02" />
                        <Text style={styles.completedText}>Complete</Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Navigation */}
        <View style={styles.navigationSection}>
          <TouchableOpacity 
            style={styles.navigationButton}
            onPress={() => router.push('/(tabs)/projects')}
          >
            <IconSymbol name="list.bullet" size={20} color="#1CB0F6" />
            <Text style={styles.navigationButtonText}>Back to Projects</Text>
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
    paddingVertical: 16,
    backgroundColor: 'white',
    zIndex: 1000,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: FontFamilies.featherBold,
    color: 'black',
  },
  helpButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
    paddingTop: 10,
  },
  projectInfo: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#F8F9FA',
    margin: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  projectImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 16,
  },
  projectDetails: {
    flex: 1,
  },
  projectTitle: {
    fontSize: 20,
    fontFamily: FontFamilies.featherBold,
    color: '#000000',
    marginBottom: 8,
  },
  projectDescription: {
    fontSize: 14,
    fontFamily: FontFamilies.dinRounded,
    color: '#666666',
    marginBottom: 16,
    lineHeight: 20,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#58CC02',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    fontFamily: FontFamilies.featherBold,
    color: '#58CC02',
  },
  instructions: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  instructionsTitle: {
    fontSize: 18,
    fontFamily: FontFamilies.featherBold,
    color: '#000000',
    marginBottom: 8,
  },
  instructionsText: {
    fontSize: 14,
    fontFamily: FontFamilies.dinRounded,
    color: '#666666',
    lineHeight: 20,
  },
  slicesContainer: {
    paddingHorizontal: 20,
    gap: 16,
  },
  sliceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  completedSliceCard: {
    backgroundColor: '#F8FFF8',
    borderColor: '#58CC02',
  },
  sliceHeader: {
    flexDirection: 'row',
  },
  sliceNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#58CC02',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  completedSliceNumber: {
    backgroundColor: '#58CC02',
  },
  sliceNumberText: {
    fontSize: 18,
    fontFamily: FontFamilies.featherBold,
    color: '#FFFFFF',
  },
  sliceInfo: {
    flex: 1,
  },
  sliceTitle: {
    fontSize: 18,
    fontFamily: FontFamilies.featherBold,
    color: '#000000',
    marginBottom: 4,
  },
  completedSliceTitle: {
    color: '#58CC02',
  },
  sliceDescription: {
    fontSize: 14,
    fontFamily: FontFamilies.dinRounded,
    color: '#666666',
    marginBottom: 8,
    lineHeight: 20,
  },
  sliceMeta: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  typeText: {
    fontSize: 12,
    fontFamily: FontFamilies.featherBold,
    color: '#FFFFFF',
    textTransform: 'capitalize',
  },
  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  durationText: {
    fontSize: 12,
    fontFamily: FontFamilies.dinRounded,
    color: '#666666',
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FFF0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  completedText: {
    fontSize: 12,
    fontFamily: FontFamilies.featherBold,
    color: '#58CC02',
  },
  navigationSection: {
    padding: 20,
    marginTop: 20,
  },
  navigationButton: {
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
  navigationButtonText: {
    fontSize: 16,
    fontFamily: FontFamilies.featherBold,
    color: '#1CB0F6',
  },
  // Progress view styles
  progressHeader: {
    padding: 20,
    backgroundColor: '#F8F9FA',
    margin: 20,
    borderRadius: 16,
  },
  progressInfo: {
    alignItems: 'center',
  },
  progressTitle: {
    fontSize: 24,
    fontFamily: FontFamilies.featherBold,
    color: '#000000',
    marginBottom: 8,
    textAlign: 'center',
  },
  progressDescription: {
    fontSize: 16,
    fontFamily: FontFamilies.dinRounded,
    color: '#666666',
    marginBottom: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  progressMeta: {
    flexDirection: 'row',
    gap: 8,
  },
  stepsSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: FontFamilies.featherBold,
    color: '#000000',
    marginBottom: 16,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
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
    flex: 1,
    fontSize: 16,
    fontFamily: FontFamilies.dinRounded,
    color: '#333333',
    lineHeight: 22,
  },
  criteriaSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  criteriaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  criteriaText: {
    fontSize: 16,
    fontFamily: FontFamilies.dinRounded,
    color: '#333333',
    flex: 1,
  },
  resourcesSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 20,
  },
  materialsSection: {
    flex: 1,
  },
  toolsSection: {
    flex: 1,
  },
  resourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 12,
  },
  resourceBullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#58CC02',
  },
  toolIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F0F8FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resourceText: {
    fontSize: 16,
    fontFamily: FontFamilies.dinRounded,
    color: '#333333',
    flex: 1,
  },
  completeSection: {
    padding: 20,
    marginTop: 20,
  },
  completeButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  completeButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 24,
    gap: 12,
  },
  completeButtonText: {
    fontSize: 18,
    fontFamily: FontFamilies.featherBold,
    color: '#FFFFFF',
  },
});
