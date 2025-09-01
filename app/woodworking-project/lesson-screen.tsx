import { IconSymbol } from '@/components/ui/IconSymbol';
import { FontFamilies } from '@/hooks/AppFonts';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useUserProgressStore } from '@/stores';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Dimensions,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

export default function LessonScreen() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const { lessonId, lessonTitle, lessonColor, lessonIcon, lessonType } = useLocalSearchParams();
  const { completeSkill } = useUserProgressStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  // Lesson content data
  const lessonContent = {
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

  const handleNextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
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
    <SafeAreaView style={styles.container}>
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
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
            <View style={styles.backButtonInner}>
              <IconSymbol name="chevron.left" size={20} color="#2D3748" />
            </View>
          </TouchableOpacity>
          
                      <View style={styles.headerContent}>
              <View style={styles.headerText}>
                <Text style={styles.headerTitle}>{currentLesson.title}</Text>
                <Text style={styles.headerSubtitle}>{currentLesson.subtitle}</Text>
              </View>
            </View>
        </View>

        {/* Enhanced Progress Section */}
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>
              {showQuiz ? 'Quiz Time!' : `Step ${currentStep + 1} of ${totalSteps}`}
            </Text>
            <Text style={styles.progressSubtitle}>
              {showQuiz ? 'Test your knowledge' : 'Keep going, you&apos;re doing great!'}
            </Text>
          </View>
          
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    width: `${((currentStep + 1) / totalSteps) * 100}%`,
                  }
                ]} 
              />
            </View>
            <View style={styles.progressStats}>
              <Text style={styles.progressText}>
                {currentStep + 1} / {totalSteps}
              </Text>
              <Text style={styles.progressPercentage}>
                {Math.round(((currentStep + 1) / totalSteps) * 100)}%
              </Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      {/* Main Content with Premium Design */}
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        {!showQuiz ? (
          // Premium Lesson Steps
          <View style={styles.stepContainer}>
            <View style={styles.stepHeader}>
              <View style={styles.stepNumberContainer}>
                <Text style={styles.stepNumberText}>{currentStep + 1}</Text>
              </View>
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
          </View>
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
      <View style={styles.actionContainer}>
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
            style={styles.completeButton}
            onPress={handleCompleteLesson}
            disabled={selectedAnswer === null}
          >
            <LinearGradient
              colors={['#48BB78', '#38A169']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.completeButtonGradient}
            >
              <IconSymbol name="checkmark.circle.fill" size={20} color="white" />
              <Text style={styles.completeButtonText}>Complete Lesson</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  
  // Stunning Header Styles
  headerGradient: {
    paddingTop: 20,
    paddingBottom: 40,
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
    marginBottom: 20,
  },
  backButton: {
    marginRight: 20,
  },
  backButtonInner: {
    width: 44,
    height: 44,
    borderRadius: 22,
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
    marginRight: 20,
  },
  headerIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
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
    fontSize: 28,
    fontWeight: '800',
    color: 'white',
    fontFamily: FontFamilies.dinRounded,
    marginBottom: 6,
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  headerSubtitle: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.95)',
    fontFamily: FontFamilies.dinRounded,
    lineHeight: 24,
    fontWeight: '500',
  },
  
  // Enhanced Progress Section
  progressSection: {
    paddingHorizontal: 24,
  },
  progressHeader: {
    marginBottom: 24,
  },
  progressTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
    fontFamily: FontFamilies.dinRounded,
    marginBottom: 6,
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  progressSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    fontFamily: FontFamilies.dinRounded,
    fontWeight: '500',
  },
  progressContainer: {
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 10,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  progressFill: {
    height: '100%',
    borderRadius: 5,
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
    gap: 20,
  },
  progressText: {
    fontSize: 18,
    color: 'white',
    fontWeight: '700',
    fontFamily: FontFamilies.dinRounded,
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  progressPercentage: {
    fontSize: 16,
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
  completeButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 28,
    gap: 10,
  },
  completeButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '700',
    fontFamily: FontFamilies.dinRounded,
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
