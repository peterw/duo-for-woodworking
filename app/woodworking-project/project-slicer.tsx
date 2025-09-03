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
    TextInput,
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

export default function ProjectSlicerScreen() {
  const { top: topPadding } = useSafeAreaInsets();
  const { projectId, projectTitle } = useLocalSearchParams();
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [slices, setSlices] = useState<ProjectSlice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingSlice, setEditingSlice] = useState<string | null>(null);
  const [newStep, setNewStep] = useState('');
  const [newCriteria, setNewCriteria] = useState('');

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
            order: index + 1
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
        order: 1
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
        order: 2
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
        order: 3
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
        order: 4
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

  const addStep = (sliceId: string) => {
    if (!newStep.trim()) return;
    
    setSlices(prev => prev.map(slice => 
      slice.id === sliceId 
        ? { ...slice, steps: [...slice.steps, newStep.trim()] }
        : slice
    ));
    setNewStep('');
  };

  const removeStep = (sliceId: string, stepIndex: number) => {
    setSlices(prev => prev.map(slice => 
      slice.id === sliceId 
        ? { ...slice, steps: slice.steps.filter((_, i) => i !== stepIndex) }
        : slice
    ));
  };

  const addSuccessCriteria = (sliceId: string) => {
    if (!newCriteria.trim()) return;
    
    setSlices(prev => prev.map(slice => 
      slice.id === sliceId 
        ? { ...slice, successCriteria: [...slice.successCriteria, newCriteria.trim()] }
        : slice
    ));
    setNewCriteria('');
  };

  const removeSuccessCriteria = (sliceId: string, criteriaIndex: number) => {
    setSlices(prev => prev.map(slice => 
      slice.id === sliceId 
        ? { ...slice, successCriteria: slice.successCriteria.filter((_, i) => i !== criteriaIndex) }
        : slice
    ));
  };

  const updateSlice = (sliceId: string, updates: Partial<ProjectSlice>) => {
    setSlices(prev => prev.map(slice => 
      slice.id === sliceId ? { ...slice, ...updates } : slice
    ));
  };

  const handleCompleteSlicing = () => {
    Alert.alert(
      'Project Slicing Complete!',
      'Your project has been broken down into manageable lesson slices. You can now start building!',
      [
        { text: 'Start Building', onPress: () => {
          router.push({
            pathname: '/woodworking-project/project-execution',
            params: { 
              projectId: project?.id,
              projectTitle: project?.title 
            }
          });
        }},
        { text: 'Continue Editing', style: 'cancel' }
      ]
    );
  };

  const handleRetry = () => {
    if (projectId) {
      fetchProjectData(projectId as string);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#58CC02" />
          <Text style={styles.loadingText}>Preparing project slices...</Text>
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
          <Text style={styles.headerTitle}>Project Slicer</Text>
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
            <View style={styles.projectStats}>
              <View style={styles.statItem}>
                <IconSymbol name="clock" size={16} color="#58CC02" />
                <Text style={styles.statText}>{project.estimatedTime}</Text>
              </View>
              <View style={styles.statItem}>
                <IconSymbol name="hammer.fill" size={16} color="#1CB0F6" />
                <Text style={styles.statText}>{project.tools.length} tools</Text>
              </View>
              <View style={styles.statItem}>
                <IconSymbol name="cube.box.fill" size={16} color="#FF9600" />
                <Text style={styles.statText}>{project.materials.length} materials</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Instructions */}
        <View style={styles.instructions}>
          <Text style={styles.instructionsTitle}>Break Down Your Project</Text>
          <Text style={styles.instructionsText}>
            Your project has been automatically sliced into manageable lesson slices. 
            Review and customize each slice, then start building!
          </Text>
        </View>

        {/* Slices */}
        <View style={styles.slicesContainer}>
          {slices.map((slice, index) => (
            <View key={slice.id} style={styles.sliceCard}>
              <View style={styles.sliceHeader}>
                <View style={styles.sliceNumber}>
                  <Text style={styles.sliceNumberText}>{slice.order}</Text>
                </View>
                <View style={styles.sliceInfo}>
                  <Text style={styles.sliceTitle}>{slice.title}</Text>
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
                  </View>
                </View>
              </View>

              {/* Steps */}
              <View style={styles.stepsSection}>
                <Text style={styles.sectionTitle}>Steps</Text>
                {slice.steps.map((step, stepIndex) => (
                  <View key={stepIndex} style={styles.stepItem}>
                    <View style={styles.stepNumber}>
                      <Text style={styles.stepNumberText}>{stepIndex + 1}</Text>
                    </View>
                    <Text style={styles.stepText}>{step}</Text>
                    <TouchableOpacity 
                      style={styles.removeButton}
                      onPress={() => removeStep(slice.id, stepIndex)}
                    >
                      <IconSymbol name="minus.circle.fill" size={16} color="#FF6B6B" />
                    </TouchableOpacity>
                  </View>
                ))}
                <View style={styles.addStepContainer}>
                  <TextInput
                    style={styles.addStepInput}
                    placeholder="Add a new step..."
                    value={newStep}
                    onChangeText={setNewStep}
                    multiline
                  />
                  <TouchableOpacity 
                    style={styles.addStepButton}
                    onPress={() => addStep(slice.id)}
                  >
                    <IconSymbol name="plus.circle.fill" size={20} color="#58CC02" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Success Criteria */}
              <View style={styles.criteriaSection}>
                <Text style={styles.sectionTitle}>Success Criteria</Text>
                {slice.successCriteria.map((criteria, criteriaIndex) => (
                  <View key={criteriaIndex} style={styles.criteriaItem}>
                    <IconSymbol name="checkmark.circle.fill" size={16} color="#58CC02" />
                    <Text style={styles.criteriaText}>{criteria}</Text>
                    <TouchableOpacity 
                      style={styles.removeButton}
                      onPress={() => removeSuccessCriteria(slice.id, criteriaIndex)}
                    >
                      <IconSymbol name="minus.circle.fill" size={16} color="#FF6B6B" />
                    </TouchableOpacity>
                  </View>
                ))}
                <View style={styles.addCriteriaContainer}>
                  <TextInput
                    style={styles.addCriteriaInput}
                    placeholder="Add success criteria..."
                    value={newCriteria}
                    onChangeText={setNewCriteria}
                    multiline
                  />
                  <TouchableOpacity 
                    style={styles.addCriteriaButton}
                    onPress={() => addSuccessCriteria(slice.id)}
                  >
                    <IconSymbol name="plus.circle.fill" size={20} color="#58CC02" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Photo Check */}
              <View style={styles.photoCheckSection}>
                <TouchableOpacity
                  style={styles.photoCheckButton}
                  onPress={() => updateSlice(slice.id, { photoCheckRequired: !slice.photoCheckRequired })}
                >
                  <IconSymbol 
                    name={slice.photoCheckRequired ? "checkmark.circle.fill" : "circle"} 
                    size={20} 
                    color={slice.photoCheckRequired ? "#58CC02" : "#666"} 
                  />
                  <Text style={styles.photoCheckText}>Photo check required for completion</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Complete Button */}
        <View style={styles.completeSection}>
          <TouchableOpacity 
            style={styles.completeButton}
            onPress={handleCompleteSlicing}
          >
            <LinearGradient
              colors={['#58CC02', '#46B700']}
              style={styles.completeButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <IconSymbol name="hammer.fill" size={20} color="white" />
              <Text style={styles.completeButtonText}>Start Building Project</Text>
              <IconSymbol name="arrow.right" size={20} color="white" />
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
    paddingVertical: 16,
    backgroundColor:'white',
    // position: 'absolute',
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
    marginBottom: 12,
    lineHeight: 20,
  },
  projectStats: {
    flexDirection: 'row',
    gap: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    fontFamily: FontFamilies.dinRounded,
    color: '#666666',
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
    gap: 20,
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
  sliceHeader: {
    flexDirection: 'row',
    marginBottom: 20,
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
  stepsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: FontFamilies.featherBold,
    color: '#000000',
    marginBottom: 12,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 12,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  stepNumberText: {
    fontSize: 12,
    fontFamily: FontFamilies.featherBold,
    color: '#666666',
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    fontFamily: FontFamilies.dinRounded,
    color: '#333333',
  },
  removeButton: {
    padding: 4,
  },
  addStepContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    marginTop: 8,
  },
  addStepInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 8,
    fontSize: 14,
    fontFamily: FontFamilies.dinRounded,
    minHeight: 40,
  },
  addStepButton: {
    padding: 8,
  },
  criteriaSection: {
    marginBottom: 20,
  },
  criteriaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 12,
  },
  criteriaText: {
    flex: 1,
    fontSize: 14,
    fontFamily: FontFamilies.dinRounded,
    color: '#333333',
  },
  addCriteriaContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    marginTop: 8,
  },
  addCriteriaInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 8,
    fontSize: 14,
    fontFamily: FontFamilies.dinRounded,
    minHeight: 40,
  },
  addCriteriaButton: {
    padding: 8,
  },
  photoCheckSection: {
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 16,
  },
  photoCheckButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  photoCheckText: {
    fontSize: 14,
    fontFamily: FontFamilies.dinRounded,
    color: '#666666',
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
