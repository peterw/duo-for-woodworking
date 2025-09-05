import { IconSymbol } from '@/components/ui/IconSymbol';
import { FontFamilies } from '@/hooks/AppFonts';
import { QuizQuestion, skillService } from '@/services/skillService';
import { useAuthStore } from '@/stores/authStore';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Animated,
    Dimensions,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const { width } = Dimensions.get('window');

interface QuizModalProps {
  visible: boolean;
  onClose: () => void;
  skillId: string;
  microStepId: string;
  questions: QuizQuestion[];
  onComplete: (score: number, passed: boolean) => void;
}

export default function QuizModal({ 
  visible, 
  onClose, 
  skillId, 
  microStepId, 
  questions, 
  onComplete 
}: QuizModalProps) {
  const { firebaseUser } = useAuthStore();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [questionId: string]: string | number }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [quizResults, setQuizResults] = useState<{
    score: number;
    passed: boolean;
    correctAnswers: number;
    totalQuestions: number;
  } | null>(null);
  
  // New state for immediate feedback
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState<string | number | null>(null);
  const [isProcessingAnswer, setIsProcessingAnswer] = useState(false);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const buttonScaleAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const feedbackScaleAnim = useRef(new Animated.Value(0)).current;

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  // Animation functions
  const animateQuestionTransition = () => {
    // Fade out and slide out current question
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
      // Reset and fade in new question
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

  const animateFeedback = () => {
    Animated.sequence([
      Animated.timing(feedbackScaleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(feedbackScaleAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  useEffect(() => {
    // Animate progress bar when question changes
    animateProgress(progress);
  }, [currentQuestionIndex, progress]);

  useEffect(() => {
    if (visible) {
      // Reset state when modal opens
      setCurrentQuestionIndex(0);
      setSelectedAnswers({});
      setIsSubmitting(false);
      setShowResults(false);
      setQuizResults(null);
      setShowFeedback(false);
      setIsCorrect(false);
      setCorrectAnswer(null);
      setIsProcessingAnswer(false);
    }
  }, [visible]);

  const handleAnswerSelect = async (answer: string | number) => {
    if (isProcessingAnswer) return; // Prevent multiple selections
    
    // Animate button press
    animateButtonPress();
    
    setIsProcessingAnswer(true);
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: answer
    }));

    // Check if answer is correct - handle both string and boolean comparisons
    let correct = false;
    if (currentQuestion.type === 'true-false') {
      // For true-false questions, normalize both values to lowercase strings for comparison
      const normalizedAnswer = String(answer).toLowerCase();
      const normalizedCorrectAnswer = String(currentQuestion.correctAnswer).toLowerCase();
      correct = normalizedAnswer === normalizedCorrectAnswer;

    } else {
      correct = answer === currentQuestion.correctAnswer;
    }
    
    setIsCorrect(correct);
    // For true-false questions, normalize the correct answer for visual feedback
    const normalizedCorrectAnswer = currentQuestion.type === 'true-false' 
      ? String(currentQuestion.correctAnswer).toLowerCase() 
      : currentQuestion.correctAnswer;
    setCorrectAnswer(normalizedCorrectAnswer);
    setShowFeedback(true);

    // Animate feedback
    animateFeedback();

    if (correct) {
      // Show correct feedback for 1 second, then allow manual navigation
      setTimeout(() => {
        setShowFeedback(false);
        setIsProcessingAnswer(false);
      }, 1000);
    } else {
      // Show correct answer for 1 second, then allow retry
      setTimeout(() => {
        setShowFeedback(false);
        setIsProcessingAnswer(false);
      }, 1000);
    }
  };

  const handleNext = () => {
    // Reset feedback state
    setShowFeedback(false);
    setIsProcessingAnswer(false);
    
    if (currentQuestionIndex < questions.length - 1) {
      // Animate transition to next question
      animateQuestionTransition();
      
      // Delay the state update to allow animation to complete
      setTimeout(() => {
        setCurrentQuestionIndex(prev => prev + 1);
      }, 200);
    } else {
      handleSubmitQuiz();
    }
  };

  const handlePrevious = () => {
    // Reset feedback state
    setShowFeedback(false);
    setIsProcessingAnswer(false);
    
    if (currentQuestionIndex > 0) {
      // Animate transition to previous question
      animateQuestionTransition();
      
      // Delay the state update to allow animation to complete
      setTimeout(() => {
        setCurrentQuestionIndex(prev => prev - 1);
      }, 200);
    }
  };

  const handleSubmitQuiz = async () => {
    if (!firebaseUser?.uid) {
      Alert.alert('Error', 'Please log in to submit quiz');
      return;
    }

    setIsSubmitting(true);
    try {
      const answers = Object.entries(selectedAnswers).map(([questionId, answer]) => ({
        questionId,
        answer
      }));

      const results = await skillService.submitQuizAttempt(
        skillId,
        microStepId,
        firebaseUser.uid,
        answers
      );

      setQuizResults(results);
      setShowResults(true);

      // Complete the micro step
      await skillService.completeMicroStep(
        skillId,
        microStepId,
        firebaseUser.uid,
        results.score
      );

      // Don't call onComplete automatically - let user control when to close
      // onComplete(results.score, results.passed);
    } catch (error) {
      console.error('Error submitting quiz:', error);
      Alert.alert('Error', 'Failed to submit quiz. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderQuestion = () => {
    if (!currentQuestion) return null;

    return (
      <View style={styles.questionContainer}>
        <Text style={styles.questionNumber}>
          Question {currentQuestionIndex + 1} of {questions.length}
        </Text>
        <Text style={styles.questionText}>{currentQuestion.question}</Text>
        

        
        {currentQuestion.type === 'multiple-choice' && currentQuestion.options && (
          <View style={styles.optionsContainer}>
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedAnswers[currentQuestion.id] === option;
              const isCorrectAnswer = isSelected && option === correctAnswer && showFeedback;
              const isWrongAnswer = isSelected && option !== correctAnswer && showFeedback;
              
              return (
                <Animated.View
                  key={index}
                  style={{
                    transform: [{ scale: buttonScaleAnim }]
                  }}
                >
                  <TouchableOpacity
                    style={[
                      styles.optionButton,
                      isSelected && styles.selectedOption,
                      showFeedback && isCorrectAnswer && styles.correctOption,
                      showFeedback && isWrongAnswer && styles.wrongOption,
                      isProcessingAnswer && styles.disabledOption
                    ]}
                    onPress={() => handleAnswerSelect(option)}
                    disabled={isProcessingAnswer}
                  >
                  <Text style={[
                    styles.optionText,
                    isSelected && styles.selectedOptionText,
                    showFeedback && isCorrectAnswer && styles.correctOptionText,
                    showFeedback && isWrongAnswer && styles.wrongOptionText
                  ]}>
                    {option}
                  </Text>
                  {showFeedback && isCorrectAnswer && (
                    <IconSymbol name="checkmark" size={20} color="white" style={styles.feedbackIcon} />
                  )}
                  {showFeedback && isWrongAnswer && (
                    <IconSymbol name="xmark" size={20} color="white" style={styles.feedbackIcon} />
                  )}
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </View>
        )}

        {currentQuestion.type === 'true-false' && (
          <View style={styles.optionsContainer}>
            <Animated.View
              style={{
                transform: [{ scale: buttonScaleAnim }]
              }}
            >
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  selectedAnswers[currentQuestion.id] === 'true' && styles.selectedOption,
                  showFeedback && selectedAnswers[currentQuestion.id] === 'true' && correctAnswer === 'true' && styles.correctOption,
                  showFeedback && selectedAnswers[currentQuestion.id] === 'true' && correctAnswer !== 'true' && styles.wrongOption,
                  isProcessingAnswer && styles.disabledOption
                ]}
                onPress={() => handleAnswerSelect('true')}
                disabled={isProcessingAnswer}
              >
              <Text style={[
                styles.optionText,
                selectedAnswers[currentQuestion.id] === 'true' && styles.selectedOptionText,
                showFeedback && selectedAnswers[currentQuestion.id] === 'true' && correctAnswer === 'true' && styles.correctOptionText,
                showFeedback && selectedAnswers[currentQuestion.id] === 'true' && correctAnswer !== 'true' && styles.wrongOptionText
              ]}>
                True
              </Text>
              {showFeedback && selectedAnswers[currentQuestion.id] === 'true' && correctAnswer === 'true' && (
                <IconSymbol name="checkmark" size={20} color="white" style={styles.feedbackIcon} />
              )}
              {showFeedback && selectedAnswers[currentQuestion.id] === 'true' && correctAnswer !== 'true' && (
                <IconSymbol name="xmark" size={20} color="white" style={styles.feedbackIcon} />
              )}
              </TouchableOpacity>
            </Animated.View>
            <Animated.View
              style={{
                transform: [{ scale: buttonScaleAnim }]
              }}
            >
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  selectedAnswers[currentQuestion.id] === 'false' && styles.selectedOption,
                  showFeedback && selectedAnswers[currentQuestion.id] === 'false' && correctAnswer === 'false' && styles.correctOption,
                  showFeedback && selectedAnswers[currentQuestion.id] === 'false' && correctAnswer !== 'false' && styles.wrongOption,
                  isProcessingAnswer && styles.disabledOption
                ]}
                onPress={() => handleAnswerSelect('false')}
                disabled={isProcessingAnswer}
              >
              <Text style={[
                styles.optionText,
                selectedAnswers[currentQuestion.id] === 'false' && styles.selectedOptionText,
                showFeedback && selectedAnswers[currentQuestion.id] === 'false' && correctAnswer === 'false' && styles.correctOptionText,
                showFeedback && selectedAnswers[currentQuestion.id] === 'false' && correctAnswer !== 'false' && styles.wrongOptionText
              ]}>
                False
              </Text>
              {showFeedback && selectedAnswers[currentQuestion.id] === 'false' && correctAnswer === 'false' && (
                <IconSymbol name="checkmark" size={20} color="white" style={styles.feedbackIcon} />
              )}
              {showFeedback && selectedAnswers[currentQuestion.id] === 'false' && correctAnswer !== 'false' && (
                <IconSymbol name="xmark" size={20} color="white" style={styles.feedbackIcon} />
              )}
              </TouchableOpacity>
            </Animated.View>
          </View>
        )}

        {currentQuestion.type === 'fill-in-blank' && (
          <View style={styles.fillInContainer}>
            <Text style={styles.fillInLabel}>Your answer:</Text>
            <Text style={styles.fillInText}>
              {selectedAnswers[currentQuestion.id] || 'Tap to answer'}
            </Text>
          </View>
        )}
      </View>
    );
  };

  const renderResults = () => {
    if (!quizResults) return null;

    const isPassed = quizResults.passed;
    const scoreColor = isPassed ? '#58CC02' : '#FF6B35';

    return (
      <View style={styles.resultsContainer}>
        <View style={styles.resultsHeader}>
          <IconSymbol 
            name={isPassed ? "checkmark.circle.fill" : "xmark.circle.fill"} 
            size={60} 
            color={scoreColor} 
          />
          <Text style={[styles.resultsTitle, { color: scoreColor }]}>
            {isPassed ? 'Quiz Passed!' : 'Quiz Failed'}
          </Text>
          <Text style={styles.resultsScore}>
            {quizResults.correctAnswers}/{quizResults.totalQuestions} correct ({quizResults.score}%)
          </Text>
        </View>

        <View style={styles.resultsDetails}>
          <Text style={styles.resultsDescription}>
            {isPassed 
              ? 'Great job! You\'ve successfully completed this lesson.'
              : 'Don\'t worry! You can retake this quiz to improve your score.'
            }
          </Text>
          
          {!isPassed && (
            <View style={styles.passingRequirement}>
              <Text style={styles.passingRequirementTitle}>
                To unlock the next skill:
              </Text>
              <Text style={styles.passingRequirementText}>
                You need {Math.ceil(quizResults.totalQuestions * 0.7)} out of {quizResults.totalQuestions} correct answers (70% or higher)
              </Text>
              <Text style={styles.passingRequirementSubtext}>
                Current: {quizResults.correctAnswers}/{quizResults.totalQuestions} ({quizResults.score}%)
              </Text>
            </View>
          )}
        </View>

        <TouchableOpacity 
          style={styles.continueButton} 
          onPress={() => {
            if (isPassed) {
              // If passed, close and continue
              onComplete(quizResults.score, quizResults.passed);
            } else {
              // If failed, retake the quiz
              setShowResults(false);
              setCurrentQuestionIndex(0);
              setSelectedAnswers({});
              setQuizResults(null);
            }
          }}
        >
          <LinearGradient
            colors={isPassed ? ['#58CC02', '#46B700'] : ['#FF6B35', '#E55A2B']}
            style={styles.continueButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.continueButtonText}>
              {isPassed ? 'Continue Learning' : 'Retake Quiz'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <IconSymbol name="xmark" size={24} color="#666666" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Quiz</Text>
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
          <Text style={styles.progressText}>{Math.round(progress)}% Complete</Text>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Animated.View 
            style={[
              { flex: 1 },
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            {showResults ? renderResults() : renderQuestion()}
          </Animated.View>
        </ScrollView>

        {!showResults && (
          <View style={styles.footer}>
            <View style={styles.navigationButtons}>
              {currentQuestionIndex > 0 && (
                <Animated.View
                  style={{
                    transform: [{ scale: buttonScaleAnim }]
                  }}
                >
                  <TouchableOpacity 
                    style={styles.navButton} 
                    onPress={handlePrevious}
                  >
                    <Text style={styles.navButtonText}>Previous</Text>
                  </TouchableOpacity>
                </Animated.View>
              )}
              
              <Animated.View
                style={{
                  transform: [{ scale: buttonScaleAnim }]
                }}
              >
                <TouchableOpacity
                  style={[
                    styles.navButton,
                    styles.nextButton,
                    !selectedAnswers[currentQuestion?.id] && styles.disabledButton
                  ]}
                  onPress={handleNext}
                  disabled={!selectedAnswers[currentQuestion?.id] || isSubmitting}
                >
                  {isSubmitting ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <Text style={styles.nextButtonText}>
                      {currentQuestionIndex === questions.length - 1 ? 'Submit' : 'Next'}
                    </Text>
                  )}
                </TouchableOpacity>
              </Animated.View>
            </View>
          </View>
        )}
      </View>
    </Modal>
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
  questionContainer: {
    paddingVertical: 20,
    position: 'relative',
  },
  questionNumber: {
    fontSize: 14,
    fontFamily: FontFamilies.dinRounded,
    color: '#58CC02',
    marginBottom: 12,
  },
  questionText: {
    fontSize: 20,
    fontFamily: FontFamilies.featherBold,
    color: '#000000',
    lineHeight: 28,
    marginBottom: 24,
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    padding: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedOption: {
    backgroundColor: '#E8F5E8',
    borderColor: '#58CC02',
  },
  optionText: {
    fontSize: 16,
    fontFamily: FontFamilies.dinRounded,
    color: '#000000',
  },
  selectedOptionText: {
    color: '#58CC02',
    fontFamily: FontFamilies.featherBold,
  },
  fillInContainer: {
    padding: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  fillInLabel: {
    fontSize: 14,
    fontFamily: FontFamilies.dinRounded,
    color: '#666666',
    marginBottom: 8,
  },
  fillInText: {
    fontSize: 16,
    fontFamily: FontFamilies.dinRounded,
    color: '#000000',
  },
  footer: {
    paddingHorizontal: 20,
    // paddingVertical: 16,
    paddingTop:16,
    paddingBottom:32,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#F8F9FA',
  },
  nextButton: {
    backgroundColor: '#58CC02',
  },
  disabledButton: {
    backgroundColor: '#E5E5E5',
  },
  navButtonText: {
    fontSize: 16,
    fontFamily: FontFamilies.dinRounded,
    color: '#666666',
  },
  nextButtonText: {
    fontSize: 16,
    fontFamily: FontFamilies.featherBold,
    color: 'white',
  },
  resultsContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  resultsHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  resultsTitle: {
    fontSize: 24,
    fontFamily: FontFamilies.featherBold,
    marginTop: 16,
    marginBottom: 8,
  },
  resultsScore: {
    fontSize: 18,
    fontFamily: FontFamilies.dinRounded,
    color: '#666666',
  },
  resultsDetails: {
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  resultsDescription: {
    fontSize: 16,
    fontFamily: FontFamilies.dinRounded,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
  },
  continueButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  continueButtonGradient: {
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
  continueButtonText: {
    fontSize: 16,
    fontFamily: FontFamilies.featherBold,
    color: 'white',
    textAlign: 'center',
  },
  // New feedback styles
  correctOption: {
    backgroundColor: '#58CC02',
    borderColor: '#58CC02',
  },
  wrongOption: {
    backgroundColor: '#FF6B6B',
    borderColor: '#FF6B6B',
  },
  disabledOption: {
    opacity: 0.6,
  },
  correctOptionText: {
    color: 'white',
    fontFamily: FontFamilies.featherBold,
  },
  wrongOptionText: {
    color: 'white',
    fontFamily: FontFamilies.featherBold,
  },
  feedbackIcon: {
    marginLeft: 8,
  },
  feedbackOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 100,
    height: 100,
    marginTop: -50,
    marginLeft: -50,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    zIndex: 10,
  },
  correctFeedback: {
    backgroundColor: 'rgba(88, 204, 2, 0.9)',
  },
  wrongFeedback: {
    backgroundColor: 'rgba(255, 107, 107, 0.9)',
  },
  feedbackText: {
    fontSize: 12,
    fontFamily: FontFamilies.featherBold,
    color: 'white',
    marginTop: 4,
    textAlign: 'center',
  },
  correctAnswerText: {
    fontSize: 10,
    fontFamily: FontFamilies.dinRounded,
    color: 'white',
    marginTop: 2,
    textAlign: 'center',
    opacity: 0.9,
  },
  passingRequirement: {
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#FFB74D',
  },
  passingRequirementTitle: {
    fontSize: 16,
    fontFamily: FontFamilies.featherBold,
    color: '#E65100',
    marginBottom: 8,
    textAlign: 'center',
  },
  passingRequirementText: {
    fontSize: 14,
    fontFamily: FontFamilies.dinRounded,
    color: '#E65100',
    textAlign: 'center',
    marginBottom: 4,
  },
  passingRequirementSubtext: {
    fontSize: 12,
    fontFamily: FontFamilies.dinRounded,
    color: '#FF8F00',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
