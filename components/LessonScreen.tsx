import { IconSymbol } from '@/components/ui/IconSymbol';
import { FontFamilies } from '@/hooks/AppFonts';
import { MicroStep, Skill, skillService } from '@/services/skillService';
import { useAuthStore } from '@/stores/authStore';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  BackHandler,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import QuizModal from './QuizModal';

const { width } = Dimensions.get('window');

interface LessonScreenProps {
  skill: Skill;
  onComplete: () => void;
  onClose: () => void;
}

export default function LessonScreen({ skill, onComplete, onClose }: LessonScreenProps) {
  const { firebaseUser } = useAuthStore();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentMicroStep, setCurrentMicroStep] = useState<MicroStep | null>(null);

  const currentStep = skill.microSteps[currentStepIndex];
  const progress = ((currentStepIndex + 1) / skill.microSteps.length) * 100;

  // Animation values
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const buttonScaleAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(progress)).current;

  // Animation functions
  const animateStepTransition = () => {
    // Fade out and slide out current content
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -50,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Reset and fade in new content
      slideAnim.setValue(50);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const animateButtonPress = () => {
    Animated.sequence([
      Animated.timing(buttonScaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const animateProgress = (newProgress: number) => {
    Animated.timing(progressAnim, {
      toValue: newProgress,
      duration: 500,
      useNativeDriver: false,
    }).start();
  };

  useEffect(() => {
    // Animate progress bar when step changes
    animateProgress(progress);
  }, [currentStepIndex, progress]);

  useEffect(() => {
    if (currentStep) {
      setCurrentMicroStep(currentStep);
    }
  }, [currentStep]);

  // Handle Android back button
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        onClose();
        return true; // Prevent default behavior
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription.remove();
    }, [onClose])
  );

  const handleNextStep = async () => {
    if (!firebaseUser?.uid || !currentStep) return;

    // Animate button press
    animateButtonPress();

    try {
      setIsLoading(true);

      // If it's a quiz step, show quiz modal
      if (currentStep.type === 'quiz' && currentStep.quiz) {
        setShowQuiz(true);
        return;
      }

      // Complete the micro step
      await skillService.completeMicroStep(
        skill.id,
        currentStep.id,
        firebaseUser.uid
      );

      // Move to next step or complete skill
      if (currentStepIndex < skill.microSteps.length - 1) {
        // Animate transition to next step
        animateStepTransition();
        
        // Delay the state update to allow animation to complete
        setTimeout(() => {
          setCurrentStepIndex(prev => prev + 1);
        }, 200);
      } else {
        // Skill completed
        Alert.alert(
          'Skill Completed!',
          `Congratulations! You've completed ${skill.title}.`,
          [
            {
              text: 'Continue',
              onPress: () => {
                onComplete();
              }
            }
          ]
        );
      }
    } catch (error) {
      console.error('Error completing micro step:', error);
      Alert.alert('Error', 'Failed to complete step. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuizComplete = async (score: number, passed: boolean) => {
    setShowQuiz(false);
    
    if (passed) {
      // Move to next step
      if (currentStepIndex < skill.microSteps.length - 1) {
        setCurrentStepIndex(prev => prev + 1);
      } else {
        // Skill completed
        Alert.alert(
          'Skill Completed!',
          `Congratulations! You've completed ${skill.title}.`,
          [
            {
              text: 'Continue',
              onPress: () => {
                onComplete();
              }
            }
          ]
        );
      }
    } else {
      Alert.alert(
        'Quiz Failed',
        'You can retake this quiz to improve your score.',
        [
          {
            text: 'Try Again',
            onPress: () => setShowQuiz(true)
          },
          {
            text: 'Skip for Now',
            onPress: () => {
              if (currentStepIndex < skill.microSteps.length - 1) {
                setCurrentStepIndex(prev => prev + 1);
              } else {
                onComplete();
              }
            }
          }
        ]
      );
    }
  };

  const renderContent = () => {
    if (!currentStep) return null;

    return (
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.stepHeader}>
          <Text style={styles.stepTitle}>{currentStep.title}</Text>
          <Text style={styles.stepDescription}>{currentStep.description}</Text>
        </View>

        {currentStep.content.text && (
          <View style={styles.textContent}>
            <Text style={styles.contentText}>{currentStep.content.text}</Text>
          </View>
        )}

        {currentStep.content.instructions && currentStep.content.instructions.length > 0 && (
          <View style={styles.instructionsContainer}>
            <Text style={styles.instructionsTitle}>Instructions:</Text>
            {currentStep.content.instructions.map((instruction, index) => (
              <View key={index} style={styles.instructionItem}>
                <Text style={styles.instructionNumber}>{index + 1}.</Text>
                <Text style={styles.instructionText}>{instruction}</Text>
              </View>
            ))}
          </View>
        )}

        {currentStep.content.images && currentStep.content.images.length > 0 && (
          <View style={styles.imagesContainer}>
            <Text style={styles.imagesTitle}>Reference Images:</Text>
            {currentStep.content.images.map((image, index) => (
              <View key={index} style={styles.imagePlaceholder}>
                <IconSymbol name="photo" size={40} color="#CCCCCC" />
                <Text style={styles.imageText}>Image {index + 1}</Text>
              </View>
            ))}
          </View>
        )}

        {currentStep.type === 'quiz' && currentStep.quiz && (
          <View style={styles.quizPreview}>
            <IconSymbol name="questionmark.circle" size={24} color="#58CC02" />
            <Text style={styles.quizPreviewText}>
              This lesson includes a quiz with {currentStep.quiz.questions.length} questions.
              You need {currentStep.quiz.passingScore}% to pass.
            </Text>
          </View>
        )}
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <IconSymbol name="xmark" size={24} color="#666666" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{skill.title}</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <Animated.View 
            style={[
              styles.progressFill, 
              { 
                width: progressAnim.interpolate({
                  inputRange: [0, 100],
                  outputRange: ['0%', '100%'],
                  extrapolate: 'clamp',
                })
              }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>
          Step {currentStepIndex + 1} of {skill.microSteps.length}
        </Text>
      </View>

      <Animated.View 
        style={[
          { flex: 1 },
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        {renderContent()}
      </Animated.View>

      <View style={styles.footer}>
        <Animated.View
          style={[
            styles.nextButton,
            isLoading && styles.disabledButton,
            {
              transform: [{ scale: buttonScaleAnim }]
            }
          ]}
        >
          <TouchableOpacity
            onPress={handleNextStep}
            disabled={isLoading}
     
          >
            <LinearGradient
              colors={['#58CC02', '#46B700']}
              style={styles.nextButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <>
                  <Text style={styles.nextButtonText}>
                    {currentStep?.type === 'quiz' ? 'Start Quiz' : 
                     currentStepIndex === skill.microSteps.length - 1 ? 'Complete Skill' : 'Next Step'}
                  </Text>
                  <IconSymbol name="arrow.right" size={20} color="white" />
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </View>

      {currentMicroStep?.type === 'quiz' && currentMicroStep.quiz && (
        <QuizModal
          visible={showQuiz}
          onClose={() => setShowQuiz(false)}
          skillId={skill.id}
          microStepId={currentMicroStep.id}
          questions={currentMicroStep.quiz.questions}
          onComplete={handleQuizComplete}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  closeButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: FontFamilies.featherBold,
    color: '#000000',
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E5E5E5',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#58CC02',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    fontFamily: FontFamilies.dinRounded,
    color: '#666666',
    textAlign: 'center',
    marginTop: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  stepHeader: {
    marginBottom: 24,
  },
  stepTitle: {
    fontSize: 24,
    fontFamily: FontFamilies.featherBold,
    color: '#000000',
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 16,
    fontFamily: FontFamilies.dinRounded,
    color: '#666666',
    lineHeight: 24,
  },
  textContent: {
    marginBottom: 24,
  },
  contentText: {
    fontSize: 16,
    fontFamily: FontFamilies.dinRounded,
    color: '#000000',
    lineHeight: 24,
  },
  instructionsContainer: {
    marginBottom: 24,
  },
  instructionsTitle: {
    fontSize: 18,
    fontFamily: FontFamilies.featherBold,
    color: '#000000',
    marginBottom: 12,
  },
  instructionItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  instructionNumber: {
    fontSize: 16,
    fontFamily: FontFamilies.featherBold,
    color: '#58CC02',
    marginRight: 8,
    minWidth: 20,
  },
  instructionText: {
    fontSize: 16,
    fontFamily: FontFamilies.dinRounded,
    color: '#000000',
    flex: 1,
    lineHeight: 24,
  },
  imagesContainer: {
    marginBottom: 24,
  },
  imagesTitle: {
    fontSize: 18,
    fontFamily: FontFamilies.featherBold,
    color: '#000000',
    marginBottom: 12,
  },
  imagePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 120,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  imageText: {
    fontSize: 14,
    fontFamily: FontFamilies.dinRounded,
    color: '#CCCCCC',
    marginTop: 8,
  },
  quizPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#E8F5E8',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#58CC02',
  },
  quizPreviewText: {
    fontSize: 14,
    fontFamily: FontFamilies.dinRounded,
    color: '#58CC02',
    marginLeft: 12,
    flex: 1,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  nextButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },

  disabledButton: {
    opacity: 0.6,
  },
  nextButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  nextButtonText: {
    fontSize: 16,
    fontFamily: FontFamilies.featherBold,
    color: 'white',
    marginRight: 8,
  },
});
