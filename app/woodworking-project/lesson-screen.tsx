import { IconSymbol } from '@/components/ui/IconSymbol';
import { FontFamilies } from '@/hooks/AppFonts';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useUserProgressStore } from '@/stores';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming
} from 'react-native-reanimated';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

interface LessonStep {
  id: string;
  title: string;
  content: string;
  type: 'instruction' | 'video' | 'quiz' | 'practice';
  duration?: number; // in minutes
  materials?: string[];
  tools?: string[];
  safetyNotes?: string[];
}

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

interface LessonContent {
  id: string;
  skillId: string;
  title: string;
  subtitle: string;
  description: string;
  steps: LessonStep[];
  quiz: QuizQuestion[];
  estimatedDuration: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  prerequisites: string[];
  materials: string[];
  tools: string[];
  safetyNotes: string[];
  xpReward: number;
}

export default function LessonScreen() {
  const colorScheme = useColorScheme();
  const {top:topPadding, bottom:bottomPadding} = useSafeAreaInsets()
  const router = useRouter();
  const { lessonId, lessonTitle, lessonColor, lessonIcon, lessonType } = useLocalSearchParams();
  const { 
    completeSkill, 
    getLessonContent, 
    updateLessonProgress,
    lessonContent: allLessonContent,
    completedSkills 
  } = useUserProgressStore();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [currentQuizQuestion, setCurrentQuizQuestion] = useState(0);
  const [lessonContent, setLessonContent] = useState<LessonContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userProgress, setUserProgress] = useState<any>(null);



  // Reanimated animation values for step transitions
  const stepSlideAnim = useSharedValue(0);
  const stepScaleAnim = useSharedValue(1);
  const stepOpacityAnim = useSharedValue(1);
  const stepNumberScaleAnim = useSharedValue(1);
  const stepNumberRotationAnim = useSharedValue(0);
  const progressAnim = useSharedValue(0);

  // Fetch lesson content from Firestore
  useEffect(() => {
    const fetchLessonContent = async () => {
      if (lessonId) {
        setIsLoading(true);
        // Reset lesson state
        setCurrentStep(0);
        setShowQuiz(false);
        setSelectedAnswer(null);
        setIsCorrect(null);
        setCurrentQuizQuestion(0);
        
        try {
          // Special handling for START section
          if (lessonId === 'start') {
            console.log('🌟 Creating START section content');
            const startContent: LessonContent = {
              id: 'start',
              skillId: 'start',
              title: 'START',
              subtitle: 'Begin your woodworking journey',
              description: 'Welcome to your woodworking learning journey! Let\'s start with the basics.',
              steps: [
                {
                  id: '1',
                  title: 'Welcome to Woodworking',
                  content: 'Welcome to your woodworking journey! In this section, you\'ll learn the fundamentals of woodworking and get ready to start building amazing projects.',
                  type: 'instruction',
                  duration: 5
                },
                {
                  id: '2',
                  title: 'Safety First',
                  content: 'Safety is the most important aspect of woodworking. Always wear appropriate safety gear, work in a well-ventilated area, and keep your workspace clean and organized.',
                  type: 'instruction',
                  duration: 10,
                  safetyNotes: ['Wear safety glasses', 'Use hearing protection', 'Keep workspace clean', 'Work in well-lit area']
                },
                {
                  id: '3',
                  title: 'Getting Started',
                  content: 'You\'re now ready to begin your woodworking journey! Complete this section to unlock your first lessons and start building your skills.',
                  type: 'instruction',
                  duration: 5
                }
              ],
              quiz: [], // No quiz for START section
              estimatedDuration: 20,
              difficulty: 'Beginner',
              prerequisites: [],
              materials: [],
              tools: [],
              safetyNotes: ['Always prioritize safety', 'Start with simple projects', 'Learn proper tool handling'],
              xpReward: 0
            };
            
            setLessonContent(startContent);
            progressAnim.value = withTiming(0, { duration: 500 });
          } else {
            const content = await getLessonContent(lessonId as string);
            
            if (content) {
              
              setLessonContent(content);
              // Initialize progress animation
              progressAnim.value = withTiming(0, { duration: 500 });
            } else {
              console.log('⚠️ No content found, using fallback');
              setLessonContent(createFallbackContent(lessonId as string));
            }
          }
        } catch (error) {
          console.error('Error fetching lesson content:', error);
          setLessonContent(createFallbackContent(lessonId as string));
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchLessonContent();
  }, [lessonId, getLessonContent, allLessonContent]);

  // Create fallback content for lessons not yet in Firestore
  const createFallbackContent = (skillId: string): LessonContent => {
    const lesson = allLessonContent.find(l => l.skillId === skillId);
    const fallbackContent: LessonContent = {
      id: skillId,
      skillId: skillId,
      title: lesson?.title || 'Woodworking Lesson',
      subtitle: lesson?.subtitle || 'Learn essential woodworking techniques',
      description: lesson?.description || 'Master the fundamentals of woodworking',
      steps: [
        {
          id: '1',
          title: 'Introduction',
          content: 'Welcome to this woodworking lesson. Let\'s get started with the basics.',
          type: 'instruction',
          duration: 5
        },
        {
          id: '2',
          title: 'Safety First',
          content: 'Always wear appropriate safety gear and work in a well-ventilated area.',
          type: 'instruction',
          duration: 10,
          safetyNotes: ['Wear safety glasses', 'Use hearing protection', 'Keep workspace clean']
        },
        {
          id: '3',
          title: 'Practice Exercise',
          content: 'Practice the technique demonstrated in this lesson.',
          type: 'practice',
          duration: 15
        }
      ],
      quiz: [], // No quiz for fallback content
      estimatedDuration: 30,
      difficulty: 'Beginner',
      prerequisites: [],
      materials: ['Wood sample', 'Safety equipment'],
      tools: ['Basic hand tools'],
      safetyNotes: ['Always wear safety gear', 'Work in well-lit area'],
      xpReward: lesson?.xpReward || 50
    };
    
    return fallbackContent;
  };

  // Animated styles for step transitions
  const stepContainerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: interpolate(stepSlideAnim.value, [0, 1], [0, -50], Extrapolate.CLAMP) },
        { scale: stepScaleAnim.value }
      ],
      opacity: stepOpacityAnim.value,
    };
  });

  const stepNumberStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: stepNumberScaleAnim.value },
        { rotate: `${stepNumberRotationAnim.value}deg` }
      ],
    };
  });

  // Enhanced animated progress bar style with smooth interpolation
  const progressBarStyle = useAnimatedStyle(() => {
    return {
      width: `${progressAnim.value}%`,
      transform: [
        { scale: interpolate(progressAnim.value, [0, 100], [0.95, 1], Extrapolate.CLAMP) }
      ],
      opacity: interpolate(progressAnim.value, [0, 100], [0.8, 1], Extrapolate.CLAMP),
    };
  });

  // Handle step navigation
  const handleNextStep = () => {
    if (!lessonContent) return;
    
    if (currentStep < lessonContent.steps.length - 1) {
      // Animate out current step
      stepSlideAnim.value = withTiming(1, { duration: 300 });
      stepScaleAnim.value = withTiming(0.8, { duration: 300 });
      stepOpacityAnim.value = withTiming(0, { duration: 300 });
      
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
        // Animate in new step
        stepSlideAnim.value = withTiming(0, { duration: 300 });
        stepScaleAnim.value = withSpring(1, { damping: 15, stiffness: 150 });
        stepOpacityAnim.value = withTiming(1, { duration: 300 });
        
        // Update progress
        const progress = ((currentStep + 1) / lessonContent.steps.length) * 100;
        progressAnim.value = withTiming(progress, { duration: 500 });
      }, 300);
    } else {
      // Lesson completed
      handleLessonComplete();
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 0 && lessonContent) {
      setCurrentStep(currentStep - 1);
      const progress = (currentStep / lessonContent.steps.length) * 100;
      progressAnim.value = withTiming(progress, { duration: 500 });
    }
  };

  const handleLessonComplete = async () => {
    if (!lessonContent) return;
    
    try {
      
      // Mark skill as completed
      await completeSkill(lessonContent.skillId);
      
      // Debug: Check if START was properly added to completed skills
      if (lessonContent.skillId === 'start') {
        // Force a refresh of the completed skills to ensure it's updated
        setTimeout(() => {
          const { completedSkills } = useUserProgressStore.getState();
        }, 100);
      }
      
      // Update lesson progress in Firestore (skip for START section as it's not in Firestore)
      if (lessonContent.skillId !== 'start') {
        await updateLessonProgress(lessonContent.skillId, {
          completed: true,
          completedAt: new Date().toISOString(),
          stepsCompleted: lessonContent.steps.length,
          quizScore: null, // Will be updated after quiz
          totalTimeSpent: 0, // Could track actual time spent
          lastAccessed: new Date().toISOString()
        });
      }
      
      
      // Create buttons array based on quiz availability
      const buttons = [];
      
      // Check if quiz exists and has questions
      if (lessonContent.quiz && Array.isArray(lessonContent.quiz) && lessonContent.quiz.length > 0) {
        buttons.push(
          { 
            text: 'Take Quiz', 
            onPress: () => {
              setShowQuiz(true);
            }
          },
          { text: 'Continue Learning', onPress: () => router.back() }
        );
      } else {
        buttons.push(
          { text: 'Continue Learning', onPress: () => router.back() }
        );
      }
      
      Alert.alert(
        'Lesson Completed! 🎉',
        `Congratulations! You've earned ${lessonContent.xpReward} XP.`,
        buttons
      );
    } catch (error) {
      console.error('Error completing lesson:', error);
      Alert.alert('Error', 'Failed to complete lesson. Please try again.');
    }
  };

  const handleQuizAnswer = (answerIndex: number) => {
    if (!lessonContent || !lessonContent.quiz || lessonContent.quiz.length === 0) {
      return;
    }
    
    const currentQuestion = lessonContent.quiz[currentQuizQuestion];
    if (!currentQuestion) {
      return;
    }
    
    console.log('🎯 Answer selected:', {
      answerIndex,
      correctAnswer: currentQuestion.correct,
      question: currentQuestion.question
    });
    
    setSelectedAnswer(answerIndex);
    const isAnswerCorrect = answerIndex === currentQuestion.correct;
    setIsCorrect(isAnswerCorrect);
    
    if (isAnswerCorrect) {
      Alert.alert(
        'Correct! 🎯',
        currentQuestion.explanation || 'Great job!',
        [
          { 
            text: currentQuizQuestion < lessonContent.quiz.length - 1 ? 'Next Question' : 'Finish Quiz', 
            onPress: () => {
              if (currentQuizQuestion < lessonContent.quiz.length - 1) {
                // Move to next question
                setCurrentQuizQuestion(currentQuizQuestion + 1);
                setSelectedAnswer(null);
                setIsCorrect(null);
              } else {
                setShowQuiz(false);
                setSelectedAnswer(null);
                setIsCorrect(null);
                setCurrentQuizQuestion(0);
                router.back();
              }
            }
          }
        ]
      );
    } else {
      Alert.alert(
        'Incorrect',
        `The correct answer is: ${currentQuestion.options[currentQuestion.correct]}`,
        [
          { 
            text: 'Try Again', 
            onPress: () => {
              setSelectedAnswer(null);
              setIsCorrect(null);
            }
          }
        ]
      );
    }
  };



  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar translucent backgroundColor={'transparent'} />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading lesson...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!lessonContent) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar translucent backgroundColor={'transparent'} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Lesson not found</Text>
                     <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
             <Text style={styles.navText}>Go Back</Text>
           </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const currentStepData = lessonContent?.steps[currentStep];
  const progress = lessonContent ? ((currentStep + 1) / lessonContent.steps.length) * 100 : 0;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar translucent backgroundColor={'transparent'} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <IconSymbol name="chevron.left" size={24} color="#000" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.lessonTitle}>{lessonContent.title}</Text>
          <Text style={styles.lessonSubtitle}>{lessonContent.subtitle}</Text>
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.stepCounter}>{currentStep + 1}/{lessonContent.steps.length}</Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <Animated.View style={[styles.progressFill, progressBarStyle]} />
        </View>
        <Text style={styles.progressText}>{Math.round(progress)}% Complete</Text>
      </View>

             {/* Main Content */}
       <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
         {currentStepData && (
           <Animated.View style={[styles.stepContainer, stepContainerStyle]}>
             {/* Step Number */}
             <Animated.View style={[styles.stepNumber, stepNumberStyle]}>
               <Text style={styles.stepNumberText}>{currentStep + 1}</Text>
             </Animated.View>

             {/* Step Content */}
             <View style={styles.stepContent}>
               <Text style={styles.stepTitle}>{currentStepData.title}</Text>
               <Text style={styles.stepDescription}>{currentStepData.content}</Text>
            
            {/* Step-specific content */}
            {currentStepData.materials && currentStepData.materials.length > 0 && (
              <View style={styles.materialsSection}>
                <Text style={styles.sectionTitle}>Materials Needed:</Text>
                {currentStepData.materials.map((material, index) => (
                  <Text key={index} style={styles.materialItem}>• {material}</Text>
                ))}
              </View>
            )}
            
            {currentStepData.tools && currentStepData.tools.length > 0 && (
              <View style={styles.toolsSection}>
                <Text style={styles.sectionTitle}>Tools Required:</Text>
                {currentStepData.tools.map((tool, index) => (
                  <Text key={index} style={styles.toolItem}>• {tool}</Text>
                ))}
              </View>
            )}
            
            {currentStepData.safetyNotes && currentStepData.safetyNotes.length > 0 && (
              <View style={styles.safetySection}>
                <Text style={styles.safetyTitle}>⚠️ Safety Notes:</Text>
                {currentStepData.safetyNotes.map((note, index) => (
                  <Text key={index} style={styles.safetyItem}>• {note}</Text>
                ))}
              </View>
            )}
          </View>
        </Animated.View>
        )}
      </ScrollView>

      {/* Navigation */}
      <View style={styles.navigation}>
        <TouchableOpacity 
          style={[styles.navButton, currentStep === 0 && styles.navButtonDisabled]} 
          onPress={handlePreviousStep}
          disabled={currentStep === 0}
        >
          <IconSymbol name="chevron.left" size={20} color={currentStep === 0 ? "#999" : "#000"} />
          <Text style={[styles.navText, currentStep === 0 && styles.navTextDisabled]}>Previous</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.nextButton} 
          onPress={handleNextStep}
        >
          <Text style={styles.nextButtonText}>
            {currentStep === lessonContent.steps.length - 1 ? 'Complete Lesson' : 'Next Step'}
          </Text>
          <IconSymbol name="chevron.right" size={20} color="white" />
        </TouchableOpacity>
      </View>



      {/* Quiz Modal */}
      {showQuiz && lessonContent && lessonContent.quiz && Array.isArray(lessonContent.quiz) && lessonContent.quiz.length > 0 && (
        <View style={styles.quizModal}>
          <View style={styles.quizContent}>
            <Text style={styles.quizTitle}>
              Lesson Quiz ({currentQuizQuestion + 1}/{lessonContent.quiz.length})
            </Text>
            <Text style={styles.quizQuestion}>
              {lessonContent.quiz[currentQuizQuestion]?.question || 'Question not available'}
            </Text>
            
            <View style={styles.quizOptions}>
              {lessonContent.quiz[currentQuizQuestion]?.options?.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.quizOption,
                    selectedAnswer === index && styles.quizOptionSelected,
                    selectedAnswer !== null && index === lessonContent.quiz[currentQuizQuestion].correct && styles.quizOptionCorrect,
                    selectedAnswer !== null && selectedAnswer === index && !isCorrect && styles.quizOptionIncorrect
                  ]}
                  onPress={() => handleQuizAnswer(index)}
                  disabled={selectedAnswer !== null}
                >
                  <Text style={[
                    styles.quizOptionText,
                    selectedAnswer === index && styles.quizOptionTextSelected
                  ]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              )) || []}
            </View>
            
            {/* Close button for quiz */}
            <TouchableOpacity 
              style={styles.quizCloseButton}
              onPress={() => {
                setShowQuiz(false);
                setSelectedAnswer(null);
                setIsCorrect(null);
                setCurrentQuizQuestion(0);
              }}
            >
              <Text style={styles.quizCloseButtonText}>Close Quiz</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
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
    fontSize: 18,
    color: '#666',
    fontFamily: FontFamilies.dinRounded,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: '#666',
    fontFamily: FontFamilies.dinRounded,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  backButton: {
    padding: 8,
  },
  headerContent: {
    flex: 1,
    marginLeft: 16,
  },
  lessonTitle: {
    fontSize: 20,
    fontFamily: FontFamilies.featherBold,
    color: '#000000',
    marginBottom: 4,
  },
  lessonSubtitle: {
    fontSize: 14,
    fontFamily: FontFamilies.dinRounded,
    color: '#666666',
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  stepCounter: {
    fontSize: 14,
    fontFamily: FontFamilies.dinRounded,
    color: '#666666',
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  progressBar: {
    width: '100%',
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E5E5E5',
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: '#58CC02',
  },
  progressText: {
    fontSize: 12,
    fontFamily: FontFamilies.dinRounded,
    color: '#666666',
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  stepContainer: {
    alignItems: 'center',
  },
  stepNumber: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#58CC02',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  stepNumberText: {
    fontSize: 24,
    fontFamily: FontFamilies.featherBold,
    color: 'white',
  },
  stepContent: {
    width: '100%',
    alignItems: 'center',
  },
  stepTitle: {
    fontSize: 24,
    fontFamily: FontFamilies.featherBold,
    color: '#000000',
    marginBottom: 16,
    textAlign: 'center',
  },
  stepDescription: {
    fontSize: 16,
    fontFamily: FontFamilies.dinRounded,
    color: '#333333',
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 24,
  },
  materialsSection: {
    width: '100%',
    marginBottom: 20,
  },
  toolsSection: {
    width: '100%',
    marginBottom: 20,
  },
  safetySection: {
    width: '100%',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: FontFamilies.featherBold,
    color: '#000000',
    marginBottom: 8,
  },
  materialItem: {
    fontSize: 14,
    fontFamily: FontFamilies.dinRounded,
    color: '#666666',
    marginBottom: 4,
    paddingLeft: 16,
  },
  toolItem: {
    fontSize: 14,
    fontFamily: FontFamilies.dinRounded,
    color: '#666666',
    marginBottom: 4,
    paddingLeft: 16,
  },
  safetyTitle: {
    fontSize: 16,
    fontFamily: FontFamilies.featherBold,
    color: '#FF6B35',
    marginBottom: 8,
  },
  safetyItem: {
    fontSize: 14,
    fontFamily: FontFamilies.dinRounded,
    color: '#FF6B35',
    marginBottom: 4,
    paddingLeft: 16,
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  navText: {
    fontSize: 14,
    fontFamily: FontFamilies.dinRounded,
    color: '#000000',
    marginLeft: 4,
  },
  navTextDisabled: {
    color: '#999999',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#58CC02',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
  },
  nextButtonText: {
    fontSize: 16,
    fontFamily: FontFamilies.featherBold,
    color: 'white',
    marginRight: 8,
  },
  quizModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quizContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    margin: 20,
    width: '90%',
    maxWidth: 400,
  },
  quizTitle: {
    fontSize: 20,
    fontFamily: FontFamilies.featherBold,
    color: '#000000',
    marginBottom: 16,
    textAlign: 'center',
  },
  quizQuestion: {
    fontSize: 16,
    fontFamily: FontFamilies.dinRounded,
    color: '#333333',
    lineHeight: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  quizOptions: {
    gap: 12,
  },
  quizOption: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E5E5',
    backgroundColor: 'white',
  },
  quizOptionSelected: {
    borderColor: '#58CC02',
    backgroundColor: '#F0F9F0',
  },
  quizOptionCorrect: {
    borderColor: '#58CC02',
    backgroundColor: '#F0F9F0',
  },
  quizOptionIncorrect: {
    borderColor: '#FF6B35',
    backgroundColor: '#FFF0F0',
  },
  quizOptionText: {
    fontSize: 14,
    fontFamily: FontFamilies.dinRounded,
    color: '#333333',
    textAlign: 'center',
  },
  quizOptionTextSelected: {
    color: '#58CC02',
    fontFamily: FontFamilies.featherBold,
  },
  quizCloseButton: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#E5E5E5',
    borderRadius: 8,
    alignItems: 'center',
  },
  quizCloseButtonText: {
    fontSize: 14,
    fontFamily: FontFamilies.dinRounded,
    color: '#666666',
  },
});
