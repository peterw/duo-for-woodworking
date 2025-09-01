import { IconSymbol } from '@/components/ui/IconSymbol';
import { FontFamilies } from '@/hooks/AppFonts';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useUserProgressStore } from '@/stores';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
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

export default function LessonScreen() {
  const colorScheme = useColorScheme();
  const {top:topPadding, bottom:bottomPadding} = useSafeAreaInsets()
  const router = useRouter();
  const { lessonId, lessonTitle, lessonColor, lessonIcon, lessonType } = useLocalSearchParams();
  const { completeSkill } = useUserProgressStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  // Reanimated animation values for step transitions
  const stepSlideAnim = useSharedValue(0);
  const stepScaleAnim = useSharedValue(1);
  const stepOpacityAnim = useSharedValue(1);
  const stepNumberScaleAnim = useSharedValue(1);
  const stepNumberRotationAnim = useSharedValue(0);
  const progressAnim = useSharedValue(0); // New shared value for progress bar animation

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

  // Lesson content data - Updated to match actual skill IDs from userProgressStore
  const lessonContent = {
    'safety-basics': {
      title: 'Safety Fundamentals',
      subtitle: 'Essential safety practices for woodworking',
      steps: [
        'PPE requirements and usage',
        'Workspace safety setup',
        'Tool safety basics',
        'Emergency procedures',
        'Dust management'
      ],
      questions: [
        {
          question: 'What is the most important aspect of woodworking?',
          options: ['Speed', 'Safety', 'Cost', 'Tools'],
          correct: 1
        }
      ]
    },
    'measuring-marking': {
      title: 'Measuring & Marking',
      subtitle: 'Precision measuring and layout techniques',
      steps: [
        'Tape measure reading',
        'Square usage and checking',
        'Marking tools and techniques',
        'Layout planning',
        'Cutting line accuracy'
      ],
      questions: [
        {
          question: 'What is the golden rule of measuring?',
          options: ['Measure once', 'Measure twice, cut once', 'Guess and check', 'Use any tool'],
          correct: 1
        }
      ]
    },
    'hand-sawing': {
      title: 'Hand Sawing',
      subtitle: 'Master basic hand saw techniques',
      steps: [
        'Saw selection and setup',
        'Proper grip and stance',
        'Cutting straight lines',
        'Cross-cutting techniques',
        'Rip-cutting techniques'
      ],
      questions: [
        {
          question: 'What should you do before making a cut?',
          options: ['Start cutting immediately', 'Mark the cut line', 'Use any saw', 'Cut freehand'],
          correct: 1
        }
      ]
    },
    'chiseling': {
      title: 'Chiseling Basics',
      subtitle: 'Learn chisel safety and techniques',
      steps: [
        'Chisel types and selection',
        'Sharpening and maintenance',
        'Safe chiseling techniques',
        'Mortise cutting',
        'Clean-up techniques'
      ],
      questions: [
        {
          question: 'What is the safest way to use a chisel?',
          options: ['Push towards your body', 'Push away from your body', 'Use both hands', 'Use any grip'],
          correct: 1
        }
      ]
    },
    'basic-joinery': {
      title: 'Basic Joinery',
      subtitle: 'Simple wood joining methods',
      steps: [
        'Butt joint basics',
        'Lap joint techniques',
        'Simple dado joints',
        'Glue application',
        'Clamping strategies'
      ],
      questions: [
        {
          question: 'What is the strongest type of joint?',
          options: ['Butt joint', 'Dado joint', 'Dovetail joint', 'Lap joint'],
          correct: 2
        }
      ]
    },
    'sanding-finishing': {
      title: 'Sanding & Finishing',
      subtitle: 'Professional finishing techniques',
      steps: [
        'Sandpaper grit selection',
        'Proper sanding techniques',
        'Surface preparation',
        'Stain application',
        'Clear coat finishing'
      ],
      questions: [
        {
          question: 'What grit sandpaper should you start with?',
          options: ['Coarse (60-80)', 'Medium (120-150)', 'Fine (220-240)', 'Any grit'],
          correct: 0
        }
      ]
    },
    // Keep legacy lesson IDs for backward compatibility
    'start': {
      title: 'Welcome to Woodworking!',
      subtitle: 'Begin your journey into the world of woodworking',
      steps: [
        'Welcome to your woodworking journey!',
        'Learn the basics of working with wood',
        'Understand safety first approach',
        'Get familiar with essential tools'
      ],
      questions: [
        {
          question: 'What is the most important aspect of woodworking?',
          options: ['Speed', 'Safety', 'Cost', 'Tools'],
          correct: 1
        }
      ]
    },
    'tool-safety': {
      title: 'Tool Safety Fundamentals',
      subtitle: 'Master essential safety practices for a secure workshop',
      steps: [
        'Always wear safety glasses',
        'Keep tools sharp and clean',
        'Use proper grip and stance',
        'Never rush your work'
      ],
      questions: [
        {
          question: 'When should you wear safety glasses?',
          options: ['Only when cutting', 'Always in the workshop', 'Never', 'Only with power tools'],
          correct: 1
        }
      ]
    },
    'measuring': {
      title: 'Precision Measuring',
      subtitle: 'Learn accurate measurement techniques for perfect results',
      steps: [
        'Use the right measuring tool',
        'Measure twice, cut once',
        'Mark clearly with pencil',
        'Check your measurements'
      ],
      questions: [
        {
          question: 'What is the golden rule of measuring?',
          options: ['Measure once', 'Measure twice, cut once', 'Guess and check', 'Use any tool'],
          correct: 1
        }
      ]
    },
    'sawing': {
      title: 'Sawing Techniques',
      subtitle: 'Master the art of precise cutting and sawing',
      steps: [
        'Choose the right saw for the job',
        'Mark your cut line clearly',
        'Use proper sawing motion',
        'Support your workpiece properly'
      ],
      questions: [
        {
          question: 'What should you do before making a cut?',
          options: ['Start cutting immediately', 'Mark the cut line', 'Use any saw', 'Cut freehand'],
          correct: 1
        }
      ]
    },
    'chest-1': {
      title: 'Reward Chest!',
      subtitle: 'Congratulations on completing the first section!',
      steps: [
        'Congratulations on completing the first section!',
        'You earned 25 XP points',
        'Unlock new tools and techniques',
        'Ready for the next challenge!'
      ],
      questions: []
    },
    'joinery': {
      title: 'Basic Joinery',
      subtitle: 'Explore fundamental woodworking joints and techniques',
      steps: [
        'Learn about different joint types',
        'Practice making simple joints',
        'Understand wood grain direction',
        'Master the basics of gluing'
      ],
      questions: [
        {
          question: 'What is the strongest type of joint?',
          options: ['Butt joint', 'Dado joint', 'Dovetail joint', 'Lap joint'],
          correct: 2
        }
      ]
    },
    'character-1': {
      title: 'Meet Owl Master',
      subtitle: 'Your woodworking mentor for advanced techniques',
      steps: [
        'Welcome to advanced techniques!',
        'Owl Master will guide you',
        'Learn professional tips and tricks',
        'Unlock the master craftsman path'
      ],
      questions: []
    },
    'finishing': {
      title: 'Wood Finishing Techniques',
      subtitle: 'Learn professional finishing methods for beautiful results',
      steps: [
        'Prepare the wood surface properly',
        'Choose the right finish for your project',
        'Apply stain evenly and consistently',
        'Protect with clear coat or varnish'
      ],
      questions: [
        {
          question: 'What is the first step in wood finishing?',
          options: ['Apply stain', 'Sand the surface', 'Apply varnish', 'Choose color'],
          correct: 1
        }
      ]
    },
  };

  const currentLesson = lessonContent[lessonId as keyof typeof lessonContent];
  const totalSteps = currentLesson?.steps.length || 0;
  const hasQuiz = currentLesson?.questions && currentLesson.questions.length > 0;

  // Smooth animation function for step transitions
  const animateStepTransition = (nextStep: number) => {
    // Animate current step out - slower and smoother
    stepSlideAnim.value = withTiming(1, { duration: 500 }); // Increased from 300ms
    stepScaleAnim.value = withTiming(0.95, { duration: 500 }); // Increased from 300ms
    stepOpacityAnim.value = withTiming(0.7, { duration: 500 }); // Increased from 300ms
    
    // Animate step number with gentler bounce and rotation
    stepNumberScaleAnim.value = withSpring(1.15, { // Reduced from 1.2 for gentler effect
      damping: 12, // Reduced damping for smoother movement
      stiffness: 120, // Reduced stiffness for slower movement
      mass: 1.2 // Increased mass for more natural feel
    });
    stepNumberRotationAnim.value = withSpring(360, { 
      damping: 12, // Reduced damping for smoother movement
      stiffness: 120, // Reduced stiffness for slower movement
      mass: 1.2 // Increased mass for more natural feel
    });

    // After animation completes, update step and animate in
    setTimeout(() => {
      setCurrentStep(nextStep);
      
      // Reset animation values
      stepSlideAnim.value = 0;
      stepScaleAnim.value = 0.8;
      stepOpacityAnim.value = 0;
      
      // Animate new step in - slower and smoother
      stepSlideAnim.value = withTiming(0, { duration: 600 }); // Increased from 400ms
      stepScaleAnim.value = withSpring(1, { 
        damping: 18, // Increased damping for smoother movement
        stiffness: 100, // Reduced stiffness for slower movement
        mass: 1.5 // Increased mass for more natural feel
      });
      stepOpacityAnim.value = withTiming(1, { duration: 600 }); // Increased from 400ms
      
      // Animate step number back to normal - smoother
      stepNumberScaleAnim.value = withSpring(1, { 
        damping: 18, // Increased damping for smoother movement
        stiffness: 100, // Reduced stiffness for slower movement
        mass: 1.5 // Increased mass for more natural feel
      });
      stepNumberRotationAnim.value = withSpring(0, { 
        damping: 18, // Increased damping for smoother movement
        stiffness: 100, // Reduced stiffness for slower movement
        mass: 1.5 // Increased mass for more natural feel
      });

      // Animate progress bar smoothly
      const newProgress = ((nextStep + 1) / totalSteps) * 100;
      progressAnim.value = withSpring(newProgress, {
        damping: 20, // Increased damping for smoother, more controlled movement
        stiffness: 80, // Reduced stiffness for gentler, more elegant movement
        mass: 1.5, // Increased mass for more natural, weighty feel
        overshootClamping: false, // Allow slight overshoot for natural bounce
        restDisplacementThreshold: 0.1, // More precise stopping
        restSpeedThreshold: 0.1 // More precise stopping
      });
    }, 500); // Increased delay to match new animation duration
  };

  // Initialize progress bar on component mount with beautiful animation
  useEffect(() => {
    const initialProgress = ((currentStep + 1) / totalSteps) * 100;
    progressAnim.value = withSpring(initialProgress, {
      damping: 18, // Smooth damping for initial load
      stiffness: 90, // Gentle stiffness for elegant movement
      mass: 1.3, // Natural mass for realistic feel
      overshootClamping: false, // Allow natural overshoot
      restDisplacementThreshold: 0.05, // Very precise stopping
      restSpeedThreshold: 0.05 // Very precise stopping
    });
  }, []);

  const handleNextStep = () => {
    if (currentStep < totalSteps - 1) {
      animateStepTransition(currentStep + 1);
    } else if (hasQuiz && !showQuiz) {
      setShowQuiz(true);
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    const correct = answerIndex === currentLesson?.questions[0]?.correct;
    setIsCorrect(correct);
  };

  const handleCompleteLesson = () => {
    if (lessonId) {
      completeSkill(lessonId as string);
      router.back();
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  if (!currentLesson) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar translucent backgroundColor={'transparent'} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Lesson not found</Text>
          <TouchableOpacity style={styles.errorBackButton} onPress={handleGoBack}>
            <Text style={styles.errorBackButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    // <SafeAreaView style={styles.container}>
    <View style={styles.container}>


      <StatusBar translucent backgroundColor={'transparent'} />
      
      {/* Stunning Header with Premium Gradient */}
      <LinearGradient
        colors={[
          lessonColor as string || '#667eea', 
          `${lessonColor as string || '#667eea'}CC`,
          `${lessonColor as string || '#667eea'}99`
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        {/* Premium Header Navigation */}
        <View style={[styles.header, {marginTop:topPadding+5}]}>
          <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
            <View style={styles.backButtonInner}>
              <IconSymbol name="chevron.left" size={20} color="#2D3748" />
            </View>
          </TouchableOpacity>
          
                      <View style={styles.headerContent}>
              <View style={styles.headerText}>
                <Text style={styles.headerTitle}>{currentLesson.title}</Text>
              </View>
            </View>
        </View>

        {/* Enhanced Progress Section */}
        <View style={styles.progressSection}>
          
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <Animated.View 
                style={[
                  styles.progressFill, 
                  progressBarStyle
                ]} 
              />
            </View>
            <View style={styles.progressStats}>
              <Text style={styles.progressText}>
                {currentStep + 1} / {totalSteps}
              </Text>
              <Text style={styles.progressPercentage}>
                {Math.round(progressAnim.value)}%
              </Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      {/* Main Content with Premium Design */}
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        {!showQuiz ? (
          // Premium Lesson Steps
          <Animated.View style={[styles.stepContainer, stepContainerStyle]}>
            <View style={styles.stepHeader}>
              <Animated.View style={[styles.stepNumberContainer, stepNumberStyle]}>
                <Text style={styles.stepNumberText}>{currentStep + 1}</Text>
              </Animated.View>
              <Text style={styles.stepLabel}>STEP {currentStep + 1}</Text>
            </View>
            
            <View style={styles.stepContent}>
              <Text style={styles.stepText}>
                {currentLesson.steps[currentStep]}
              </Text>
            </View>

            {/* Enhanced Step Navigation Dots */}
            <View style={styles.stepDotsContainer}>
              {currentLesson.steps.map((_, index) => (
                <View 
                  key={index} 
                  style={[
                    styles.stepDot,
                    index === currentStep && styles.stepDotActive
                  ]} 
                />
              ))}
            </View>
          </Animated.View>
        ) : (
          // Premium Quiz Design
          <View style={styles.quizContainer}>
            <View style={styles.quizHeader}>
              <View style={styles.quizIconContainer}>
                <IconSymbol name="questionmark.circle.fill" size={32} color={lessonColor as string || '#667eea'} />
              </View>
              <Text style={styles.quizTitle}>Quick Quiz</Text>
              <Text style={styles.quizSubtitle}>Test what you&apos;ve learned</Text>
            </View>
            
            <View style={styles.quizQuestionContainer}>
              <Text style={styles.quizQuestion}>
                {currentLesson.questions?.[0]?.question}
              </Text>
            </View>
            
            <View style={styles.quizOptions}>
              {currentLesson.questions?.[0]?.options.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.quizOption,
                    selectedAnswer === index && {
                      backgroundColor: isCorrect === null ? '#EBF8FF' : 
                        isCorrect ? '#F0FFF4' : '#FFF5F5',
                      borderColor: isCorrect === null ? '#3182CE' : 
                        isCorrect ? '#38A169' : '#E53E3E',
                    }
                  ]}
                  onPress={() => handleAnswerSelect(index)}
                  disabled={selectedAnswer !== null}
                >
                  <View style={styles.quizOptionContent}>
                    <View style={styles.quizOptionLetter}>
                      <Text style={styles.quizOptionLetterText}>
                        {String.fromCharCode(65 + index)}
                      </Text>
                    </View>
                    <Text style={[
                      styles.quizOptionText,
                      selectedAnswer === index && {
                        color: isCorrect === null ? '#3182CE' : 
                          isCorrect ? '#38A169' : '#E53E3E',
                      }
                    ]}>
                      {option}
                    </Text>
                  </View>
                  
                  {selectedAnswer === index && (
                    <View style={styles.quizOptionIcon}>
                      <IconSymbol 
                        name={isCorrect ? "checkmark.circle.fill" : "xmark.circle.fill"} 
                        size={24} 
                        color={isCorrect ? "#38A169" : "#E53E3E"} 
                      />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>

            {isCorrect !== null && (
              <View style={styles.quizFeedback}>
                <View style={[
                  styles.feedbackIcon,
                  { backgroundColor: isCorrect ? '#F0FFF4' : '#FFF5F5' }
                ]}>
                  <IconSymbol 
                    name={isCorrect ? "checkmark.circle.fill" : "xmark.circle.fill"} 
                    size={24} 
                    color={isCorrect ? "#38A169" : "#E53E3E"} 
                  />
                </View>
                <Text style={[
                  styles.feedbackText,
                  { color: isCorrect ? '#38A169' : '#E53E3E' }
                ]}>
                  {isCorrect ? 'Excellent! You got it right!' : 'Not quite right. Keep learning!'}
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* Premium Action Button */}
      <View style={[styles.actionContainer, {paddingBottom:bottomPadding+5}]}>
        {!showQuiz ? (
          <TouchableOpacity
            style={styles.nextButton}
            onPress={handleNextStep}
          >
            <LinearGradient
              colors={[lessonColor as string || '#667eea', `${lessonColor as string || '#667eea'}DD`]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.nextButtonGradient}
            >
              <Text style={styles.nextButtonText}>
                {currentStep < totalSteps - 1 ? 'Continue to Next Step' : 'Take Quiz'}
              </Text>
              <IconSymbol name="arrow.right" size={20} color="white" />
            </LinearGradient>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[
              styles.completeButton,
              selectedAnswer === null && styles.completeButtonDisabled
            ]}
            onPress={handleCompleteLesson}
            disabled={selectedAnswer === null}
          >
            <LinearGradient
              colors={selectedAnswer === null ? ['#A0AEC0', '#718096'] : ['#48BB78', '#38A169']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[
                styles.completeButtonGradient,
                selectedAnswer === null && styles.completeButtonGradientDisabled
              ]}
            >
              <IconSymbol name="checkmark.circle.fill" size={20} color="white" />
              <Text style={[
                styles.completeButtonText,
                selectedAnswer === null && styles.completeButtonTextDisabled
              ]}>
                {selectedAnswer === null ? 'Select an answer to continue' : 'Complete Lesson'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  
  // Stunning Header Styles
  headerGradient: {
    paddingTop: 12, // Reduced from 20 to 12
    paddingBottom: 24, // Reduced from 40 to 24
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 12, // Reduced from 20 to 12
  },
  backButton: {
    marginRight: 16, // Reduced from 20 to 16
  },
  backButtonInner: {
    width: 36, // Reduced from 44 to 36
    height: 36, // Reduced from 44 to 36
    borderRadius: 18, // Reduced from 22 to 18
    backgroundColor: 'rgba(255,255,255,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIconContainer: {
    marginRight: 16, // Reduced from 20 to 16
  },
  headerIcon: {
    width: 48, // Reduced from 64 to 48
    height: 48, // Reduced from 64 to 48
    borderRadius: 24, // Reduced from 32 to 24
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24, // Reduced from 28 to 24
    fontWeight: '800',
    color: 'white',
    fontFamily: FontFamilies.dinRounded,
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  headerSubtitle: {
    fontSize: 16, // Reduced from 18 to 16
    color: 'rgba(255,255,255,0.95)',
    fontFamily: FontFamilies.dinRounded,
    lineHeight: 20, // Reduced from 24 to 20
    fontWeight: '500',
  },
  
  // Enhanced Progress Section
  progressSection: {
    paddingHorizontal: 24,
    marginTop:10
  },
  progressHeader: {
    // marginBottom: 10, // Reduced from 24 to 16
  },
  progressTitle: {
    fontSize: 18, // Reduced from 20 to 18
    fontWeight: '700',
    color: 'white',
    fontFamily: FontFamilies.dinRounded,
    marginBottom: 4, // Reduced from 6 to 4
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  progressSubtitle: {
    fontSize: 14, // Reduced from 16 to 14
    color: 'rgba(255,255,255,0.9)',
    fontFamily: FontFamilies.dinRounded,
    fontWeight: '500',
  },
  progressContainer: {
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 8, // Reduced from 10 to 8
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 4, // Reduced from 5 to 4
    overflow: 'hidden',
    marginBottom: 12, // Reduced from 16 to 12
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4, // Reduced from 5 to 4
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  progressStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16, // Reduced from 20 to 16
  },
  progressText: {
    fontSize: 16, // Reduced from 18 to 16
    color: 'white',
    fontWeight: '700',
    fontFamily: FontFamilies.dinRounded,
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  progressPercentage: {
    fontSize: 14, // Reduced from 16 to 14
    color: 'rgba(255,255,255,0.9)',
    fontFamily: FontFamilies.dinRounded,
    fontWeight: '600',
  },
  
  // Content
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
    paddingBottom: 120,
  },
  
  // Premium Step Container
  stepContainer: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 36,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
    minHeight: 320,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
  },
  stepHeader: {
    alignItems: 'center',
    marginBottom: 36,
  },
  stepNumberContainer: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#EBF8FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#3182CE',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 3,
    borderColor: 'rgba(49, 130, 206, 0.1)',
  },
  stepNumberText: {
    fontSize: 36,
    fontWeight: '800',
    color: '#3182CE',
    fontFamily: FontFamilies.dinRounded,
  },
  stepLabel: {
    fontSize: 16,
    color: '#4A5568',
    fontWeight: '700',
    fontFamily: FontFamilies.dinRounded,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  stepContent: {
    alignItems: 'center',
    marginBottom: 36,
    flex: 1,
    justifyContent: 'center',
  },
  stepText: {
    fontSize: 24,
    lineHeight: 32,
    color: '#2D3748',
    textAlign: 'center',
    fontFamily: FontFamilies.dinRounded,
    fontWeight: '600',
  },
  stepDotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  stepDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  stepDotActive: {
    backgroundColor: '#667eea',
    width: 14,
    height: 14,
    borderRadius: 7,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  
  // Premium Quiz Container
  quizContainer: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
  },
  quizHeader: {
    alignItems: 'center',
    marginBottom: 28,
  },
  quizIconContainer: {
    marginBottom: 20,
  },
  quizTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#2D3748',
    textAlign: 'center',
    marginBottom: 10,
    fontFamily: FontFamilies.dinRounded,
  },
  quizSubtitle: {
    fontSize: 18,
    color: '#4A5568',
    textAlign: 'center',
    fontFamily: FontFamilies.dinRounded,
    fontWeight: '500',
  },
  quizQuestionContainer: {
    backgroundColor: '#F7FAFC',
    padding: 24,
    borderRadius: 20,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.8)',
  },
  quizQuestion: {
    fontSize: 20,
    lineHeight: 28,
    color: '#2D3748',
    textAlign: 'center',
    fontFamily: FontFamilies.dinRounded,
    fontWeight: '700',
  },
  quizOptions: {
    gap: 16,
    marginBottom: 28,
  },
  quizOption: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 20,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  quizOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  quizOptionLetter: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F7FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  quizOptionLetterText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#4A5568',
    fontFamily: FontFamilies.dinRounded,
  },
  quizOptionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3748',
    flex: 1,
    fontFamily: FontFamilies.dinRounded,
  },
  quizOptionIcon: {
    position: 'absolute',
    right: 20,
    top: 20,
  },
  quizFeedback: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderRadius: 20,
    backgroundColor: 'white',
    gap: 16,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.8)',
  },
  feedbackIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  feedbackText: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: FontFamilies.dinRounded,
  },
  
  // Premium Action Container
  actionContainer: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: 'rgba(226, 232, 240, 0.8)',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  nextButton: {
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
    overflow: 'hidden',
  },
  nextButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 28,
    gap: 10,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '700',
    fontFamily: FontFamilies.dinRounded,
  },
  completeButton: {
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
    overflow: 'hidden',
  },
  completeButtonDisabled: {
    opacity: 0.7,
  },
  completeButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 28,
    gap: 10,
  },
  completeButtonGradientDisabled: {
    opacity: 0.7,
  },
  completeButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '700',
    fontFamily: FontFamilies.dinRounded,
  },
  completeButtonTextDisabled: {
    color: 'rgba(255,255,255,0.7)',
  },
  
  // Error Container
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    fontSize: 20,
    color: '#4A5568',
    marginBottom: 24,
    fontFamily: FontFamilies.dinRounded,
    fontWeight: '600',
  },
  errorBackButton: {
    paddingVertical: 16,
    paddingHorizontal: 28,
    backgroundColor: '#667eea',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  errorBackButtonText: {
    fontSize: 18,
    color: 'white',
    fontWeight: '700',
    fontFamily: FontFamilies.dinRounded,
  },
});
