import GeneralStatusBarColor from '@/components/GeneralStatusBarColor';
import { Button } from '@/components/ui/Button';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAppStore, useOnboardingStore } from '@/stores';
import { RPH, RPW } from '@/utils/utils';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
const { width, height } = Dimensions.get('window');

interface OnboardingSlide {
  id: number;
  type: 'welcome' | 'name' | 'username' | 'goals' | 'experience' | 'time' | 'motivation' | 'complete';
  title: string;
  subtitle: string;
  icon: string;
}

const onboardingSlides: OnboardingSlide[] = [
  {
    id: 1,
    type: 'welcome',
    title: 'Welcome to Wood Craft',
    subtitle: 'Your journey to becoming a master woodworker starts here. Learn essential skills, build amazing projects, and join a community of craftsmen.',
    icon: 'hammer.fill',
  },
  {
    id: 2,
    type: 'name',
    title: 'What should we call you?',
    subtitle: 'Let us know your name so we can personalize your experience.',
    icon: 'person.fill',
  },
  {
    id: 3,
    type: 'username',
    title: 'Choose your username',
    subtitle: 'This will be your unique identifier in the Wood Craft community.',
    icon: 'at',
  },
  {
    id: 4,
    type: 'goals',
    title: 'What do you want to achieve?',
    subtitle: 'Choose your primary goal to help us personalize your learning experience.',
    icon: 'star.fill',
  },
  {
    id: 5,
    type: 'experience',
    title: 'What\'s your experience level?',
    subtitle: 'This helps us create the perfect learning path for you.',
    icon: 'trophy.fill',
  },
  {
    id: 6,
    type: 'time',
    title: 'How much time can you dedicate?',
    subtitle: 'We\'ll adjust your daily goals based on your available time.',
    icon: 'clock.fill',
  },
  {
    id: 7,
    type: 'motivation',
    title: 'What motivates you most?',
    subtitle: 'Understanding your motivation helps us keep you engaged.',
    icon: 'flame.fill',
  },
  {
    id: 8,
    type: 'complete',
    title: 'You\'re all set!',
    subtitle: 'Your personalized woodworking journey is ready to begin.',
    icon: 'checkmark.circle.fill',
  },
];

const goals = [
  'Learn basic woodworking skills',
  'Build furniture for my home',
  'Start a woodworking business',
  'Create artistic pieces',
  'Learn advanced techniques',
  'Teach others woodworking',
];

const experienceLevels = [
  'Complete beginner',
  'Some experience',
  'Advanced',
];

const timeOptions = [
  '15 minutes daily',
  '30 minutes daily',
  '1 hour daily',
  '2+ hours daily',
  'Weekends only',
];

const motivations = [
  'Creative expression',
  'Practical skills',
  'Stress relief',
  'Building community',
  'Financial opportunity',
  'Personal achievement',
];

export default function OnboardingScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const { setOnboardingCompleted } = useAppStore();
  const { setOnboardingData } = useOnboardingStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [selectedGoal, setSelectedGoal] = useState('');
  const [selectedExperience, setSelectedExperience] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedMotivation, setSelectedMotivation] = useState('');
  
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const titleAnim = useRef(new Animated.Value(0)).current;
  const subtitleAnim = useRef(new Animated.Value(0)).current;
  const contentAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);

  // Initialize animations when step changes
  useEffect(() => {
    // Reset animations
    fadeAnim.setValue(1);
    slideAnim.setValue(0);
    scaleAnim.setValue(1);
    titleAnim.setValue(0);
    subtitleAnim.setValue(0);
    contentAnim.setValue(0);

    // Animate progress bar
    Animated.timing(progressAnim, {
      toValue: ((currentStep + 1) / onboardingSlides.length) * 100,
      duration: 800,
      useNativeDriver: false,
    }).start();

    // Animate in new content with different timing for welcome slide
    if (currentStep === 0) {
      // Welcome slide has special entrance animation
      Animated.sequence([
        Animated.timing(titleAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(subtitleAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(contentAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Other slides have parallel animations
      Animated.parallel([
        Animated.timing(titleAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(subtitleAnim, {
          toValue: 1,
          duration: 500,
          delay: 150,
          useNativeDriver: true,
        }),
        Animated.timing(contentAnim, {
          toValue: 1,
          duration: 500,
          delay: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [currentStep, fadeAnim, slideAnim, scaleAnim, titleAnim, subtitleAnim, contentAnim, progressAnim]);

  const handleNext = () => {
    // Safety check to ensure currentStep is within bounds
    if (currentStep >= onboardingSlides.length) {
      console.error('Current step out of bounds:', currentStep, 'onboardingSlides length:', onboardingSlides.length);
      setCurrentStep(0);
      return;
    }

    if (currentStep < onboardingSlides.length - 1) {
      // Save current step data
      const currentSlide = onboardingSlides[currentStep];
      if (currentSlide.type === 'name') {
        setOnboardingData({ fullName });
      } else if (currentSlide.type === 'username') {
        setOnboardingData({ username });
      } else if (currentSlide.type === 'goals') {
        setOnboardingData({ goal: selectedGoal });
      } else if (currentSlide.type === 'experience') {
        let experience: 'beginner' | 'intermediate' | 'advanced';
        if (selectedExperience === 'Complete beginner') {
          experience = 'beginner';
        } else if (selectedExperience === 'Some experience') {
          experience = 'intermediate';
        } else if (selectedExperience === 'Advanced') {
          experience = 'advanced';
        } else {
          experience = 'beginner'; // fallback
        }
        setOnboardingData({ experience });
      } else if (currentSlide.type === 'time') {
        setOnboardingData({ timeCommitment: selectedTime });
      } else if (currentSlide.type === 'motivation') {
        setOnboardingData({ motivation: selectedMotivation });
      }

      // Add button press animation
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.95,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();

      // Animate out current content
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: -50,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Move to next step
        setCurrentStep(prev => prev + 1);
      });
    } else {
      // Save final step data
      setOnboardingData({ motivation: selectedMotivation });
      
      // Complete onboarding and go to signup
      setOnboardingCompleted();
      router.replace('/signup');
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 50,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setCurrentStep(prev => prev - 1);
      });
    }
  };

  const handleSkip = () => {
    setOnboardingCompleted();
    router.replace('/signup');
  };

  const handleOptionSelect = (option: string, type: string) => {
    // Add haptic feedback for selection
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    switch (type) {
      case 'goal':
        setSelectedGoal(option);
        break;
      case 'experience':
        setSelectedExperience(option);
        break;
      case 'time':
        setSelectedTime(option);
        break;
      case 'motivation':
        setSelectedMotivation(option);
        break;
    }
  };

  const renderWelcomeSlide = () => (
    <Animated.View 
      style={[
        styles.welcomeContainer,
        {
          opacity: fadeAnim,
          transform: [
            { translateY: slideAnim },
            { scale: scaleAnim }
          ]
        }
      ]}
    >
      <View style={styles.welcomeContent}>
        {/* <Animated.View 
          style={[
            styles.iconContainer,
            {
              opacity: titleAnim,
              transform: [{ scale: titleAnim }]
            }
          ]}
        >
          <IconSymbol name="hammer.fill" size={80} color="#FFFFFF" />
        </Animated.View> */}
        <Animated.Text 
          style={[
            styles.welcomeTitle,
            {
              opacity: titleAnim,
              transform: [{ translateY: Animated.multiply(titleAnim, 30) }]
            }
          ]}
        >
          {`Welcome to\nWood Craft`}
        </Animated.Text>
        <Animated.View
          style={{
            opacity: subtitleAnim,
            transform: [{ translateY: Animated.multiply(subtitleAnim, 20) }]
          }}
        >
          <Image resizeMode='contain' source={require('@/assets/images/chair.png')} style={styles.welcomeImage} />
        </Animated.View>
      </View>
      
      <Animated.View 
        style={[
          styles.welcomeActions,
          {
            opacity: contentAnim,
            transform: [{ translateY: Animated.multiply(contentAnim, 20) }]
          }
        ]}
      >
        <Button
          title="Continue"
          onPress={handleNext}
          size="large"
          style={styles.welcomeButton}
        />
      </Animated.View>
    </Animated.View>
  );

  const renderNameSlide = () => (
    <Animated.View 
      style={[
        styles.slideContainer,
        {
          opacity: fadeAnim,
          transform: [
            { translateX: slideAnim },
            { scale: scaleAnim }
          ]
        }
      ]}
    >
      <Animated.View 
        style={[
          styles.slideHeader,
          {
            opacity: titleAnim,
            transform: [{ translateY: Animated.multiply(titleAnim, 30) }]
          }
        ]}
      >
        <Text style={styles.slideTitle}>What should we call you?</Text>
        <Text style={styles.slideSubtitle}>
          Let us know your name so we can personalize your experience.
        </Text>
      </Animated.View>
      
      <Animated.View 
        style={[
          styles.inputContainer,
          {
            opacity: contentAnim,
            transform: [{ translateY: Animated.multiply(contentAnim, 20) }]
          }
        ]}
      >
        <Text style={styles.inputLabel}>Full Name</Text>
        <TextInput
          style={styles.textInput}
          value={fullName}
          onChangeText={setFullName}
          placeholder="Enter your full name"
          placeholderTextColor="rgba(255, 255, 255, 0.5)"
        />
      </Animated.View>
      
      <Animated.View 
        style={[
          styles.slideFooter,
          {
            opacity: contentAnim,
            transform: [{ translateY: Animated.multiply(contentAnim, 20) }]
          }
        ]}
      >
        <Button
          title="Continue"
          onPress={handleNext}
          disabled={!fullName.trim()}
          size="large"
          style={styles.continueButton}
        />
      </Animated.View>
    </Animated.View>
  );

  const renderUsernameSlide = () => (
    <Animated.View 
      style={[
        styles.slideContainer,
        {
          opacity: fadeAnim,
          transform: [
            { translateX: slideAnim },
            { scale: scaleAnim }
          ]
        }
      ]}
    >
      <Animated.View 
        style={[
          styles.slideHeader,
          {
            opacity: titleAnim,
            transform: [{ translateY: Animated.multiply(titleAnim, 30) }]
          }
        ]}
      >
        <Text style={styles.slideTitle}>Choose your username</Text>
        <Text style={styles.slideSubtitle}>
          This will be your unique identifier in the Wood Craft community.
        </Text>
      </Animated.View>
      
      <Animated.View 
        style={[
          styles.inputContainer,
          {
            opacity: contentAnim,
            transform: [{ translateY: Animated.multiply(contentAnim, 20) }]
          }
        ]}
      >
        <Text style={styles.inputLabel}>Username</Text>
        <TextInput
          style={styles.textInput}
          value={username}
          onChangeText={setUsername}
          placeholder="Enter username"
          placeholderTextColor="rgba(255, 255, 255, 0.5)"
          autoCapitalize="none"
        />
        <Text style={styles.inputHelper}>
          Username must be 3-20 characters, letters and numbers only
        </Text>
      </Animated.View>
      
      <Animated.View 
        style={[
          styles.slideFooter,
          {
            opacity: contentAnim,
            transform: [{ translateY: Animated.multiply(contentAnim, 20) }]
          }
        ]}
      >
        <Button
          title="Continue"
          onPress={handleNext}
          disabled={!username.trim() || username.length < 3}
          size="large"
          style={styles.continueButton}
        />
      </Animated.View>
    </Animated.View>
  );

  const renderGoalsSlide = () => (
    <Animated.View 
      style={[
        styles.slideContainer,
        {
          opacity: fadeAnim,
          transform: [
            { translateX: slideAnim },
            { scale: scaleAnim }
          ]
        }
      ]}
    >
      <Animated.View 
        style={[
          styles.slideHeader,
          {
            opacity: titleAnim,
            transform: [{ translateY: Animated.multiply(titleAnim, 30) }]
          }
        ]}
      >
        <Text style={styles.slideTitle}>What do you want to achieve?</Text>
        <Text style={styles.slideSubtitle}>
          Choose your primary goal to help us personalize your learning experience.
        </Text>
      </Animated.View>
      
      <ScrollView style={styles.optionsContainer} showsVerticalScrollIndicator={false}>
        {goals.map((goal, index) => (
          <Animated.View 
            key={goal} 
            style={{
              opacity: contentAnim,
              transform: [
                { translateY: Animated.multiply(contentAnim, 20 + index * 10) },
                { scale: contentAnim }
              ]
            }}
          >
            <TouchableOpacity
              style={[
                styles.optionButton,
                selectedGoal === goal && styles.optionButtonSelected
              ]}
              onPress={() => handleOptionSelect(goal, 'goal')}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.optionButtonText,
                selectedGoal === goal && styles.optionButtonTextSelected
              ]}>
                {goal}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </ScrollView>
      
      <Animated.View 
        style={[
          styles.slideFooter,
          {
            opacity: contentAnim,
            transform: [{ translateY: Animated.multiply(contentAnim, 20) }]
          }
        ]}
      >
        <Button
          title="Continue"
          onPress={handleNext}
          disabled={!selectedGoal}
          size="large"
          style={styles.continueButton}
        />
      </Animated.View>
    </Animated.View>
  );

  const renderExperienceSlide = () => (
    <Animated.View 
      style={[
        styles.slideContainer,
        {
          opacity: fadeAnim,
          transform: [
            { translateX: slideAnim },
            { scale: scaleAnim }
          ]
        }
      ]}
    >
      <Animated.View 
        style={[
          styles.slideHeader,
          {
            opacity: titleAnim,
            transform: [{ translateY: Animated.multiply(titleAnim, 30) }]
          }
        ]}
      >
        <Text style={styles.slideTitle}>What's your experience level?</Text>
        <Text style={styles.slideSubtitle}>
          This helps us create the perfect learning path for you.
        </Text>
      </Animated.View>
      
      <View style={styles.optionsContainer}>
        {experienceLevels.map((level, index) => (
          <Animated.View 
            key={level}
            style={{
              opacity: contentAnim,
              transform: [
                { translateY: Animated.multiply(contentAnim, 20 + index * 10) },
                { scale: contentAnim }
              ]
            }}
          >
            <TouchableOpacity
              style={[
                styles.optionButton,
                selectedExperience === level && styles.optionButtonSelected
              ]}
              onPress={() => handleOptionSelect(level, 'experience')}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.optionButtonText,
                selectedExperience === level && styles.optionButtonTextSelected
              ]}>
                {level}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>
      
      <Animated.View 
        style={[
          styles.slideFooter,
          {
            opacity: contentAnim,
            transform: [{ translateY: Animated.multiply(contentAnim, 20) }]
          }
        ]}
      >
        <Button
          title="Continue"
          onPress={handleNext}
          disabled={!selectedExperience}
          size="large"
          style={styles.continueButton}
        />
      </Animated.View>
    </Animated.View>
  );

  const renderTimeSlide = () => (
    <Animated.View 
      style={[
        styles.slideContainer,
        {
          opacity: fadeAnim,
          transform: [
            { translateX: slideAnim },
            { scale: scaleAnim }
          ]
        }
      ]}
    >
      <Animated.View 
        style={[
          styles.slideHeader,
          {
            opacity: titleAnim,
            transform: [{ translateY: Animated.multiply(titleAnim, 30) }]
          }
        ]}
      >
        <Text style={styles.slideTitle}>How much time can you dedicate?</Text>
        <Text style={styles.slideSubtitle}>
          We'll adjust your daily goals based on your available time.
        </Text>
      </Animated.View>
      
      <View style={styles.optionsContainer}>
        {timeOptions.map((option, index) => (
          <Animated.View 
            key={option}
            style={{
              opacity: contentAnim,
              transform: [
                { translateY: Animated.multiply(contentAnim, 20 + index * 10) },
                { scale: contentAnim }
              ]
            }}
          >
            <TouchableOpacity
              style={[
                styles.optionButton,
                selectedTime === option && styles.optionButtonSelected
              ]}
              onPress={() => handleOptionSelect(option, 'time')}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.optionButtonText,
                selectedTime === option && styles.optionButtonTextSelected
              ]}>
                {option}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>
      
      <Animated.View 
        style={[
          styles.slideFooter,
          {
            opacity: contentAnim,
            transform: [{ translateY: Animated.multiply(contentAnim, 20) }]
          }
        ]}
      >
        <Button
          title="Continue"
          onPress={handleNext}
          disabled={!selectedTime}
          size="large"
          style={styles.continueButton}
        />
      </Animated.View>
    </Animated.View>
  );

  const renderMotivationSlide = () => (
    <Animated.View 
      style={[
        styles.slideContainer,
        {
          opacity: fadeAnim,
          transform: [
            { translateX: slideAnim },
            { scale: scaleAnim }
          ]
        }
      ]}
    >
      <Animated.View 
        style={[
          styles.slideHeader,
          {
            opacity: titleAnim,
            transform: [{ translateY: Animated.multiply(titleAnim, 30) }]
          }
        ]}
      >
        <Text style={styles.slideTitle}>What motivates you most?</Text>
        <Text style={styles.slideSubtitle}>
          Understanding your motivation helps us keep you engaged.
        </Text>
      </Animated.View>
      
      <ScrollView contentContainerStyle={{paddingBottom: 70}} style={styles.optionsContainer} showsVerticalScrollIndicator={false}>
        {motivations.map((motivation, index) => (
          <Animated.View 
            key={motivation}
            style={{
              opacity: contentAnim,
              transform: [
                { translateY: Animated.multiply(contentAnim, 20 + index * 10) },
                { scale: contentAnim }
              ]
            }}
          >
            <TouchableOpacity
              style={[
                styles.optionButton,
                selectedMotivation === motivation && styles.optionButtonSelected
              ]}
              onPress={() => handleOptionSelect(motivation, 'motivation')}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.optionButtonText,
                selectedMotivation === motivation && styles.optionButtonTextSelected
              ]}>
                {motivation}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </ScrollView>
      
      <Animated.View 
        style={[
          styles.slideFooter,
          {
            opacity: contentAnim,
            transform: [{ translateY: Animated.multiply(contentAnim, 20) }]
          }
        ]}
      >
        <Button
          title="Continue"
          onPress={handleNext}
          disabled={!selectedMotivation}
          size="large"
          style={styles.continueButton}
        />
      </Animated.View>
    </Animated.View>
  );

  const renderCompleteSlide = () => (
    <Animated.View 
      style={[
        styles.completeContainer,
        {
          opacity: fadeAnim,
          transform: [
            { translateY: slideAnim },
            { scale: scaleAnim }
          ]
        }
      ]}
    >
      <Animated.View 
        style={[
          styles.completeContent,
          {
            opacity: titleAnim,
            transform: [{ scale: titleAnim }]
          }
        ]}
      >
        <Animated.View 
          style={[
            styles.iconContainer,
            {
              opacity: titleAnim,
              transform: [{ scale: titleAnim }]
            }
          ]}
        >
          <IconSymbol name="checkmark.circle.fill" size={100} color="#FFFFFF" />
        </Animated.View>
        <Animated.Text 
          style={[
            styles.completeTitle,
            {
              opacity: subtitleAnim,
              transform: [{ translateY: Animated.multiply(subtitleAnim, 20) }]
            }
          ]}
        >
          You're all set!
        </Animated.Text>
        <Animated.Text 
          style={[
            styles.completeSubtitle,
            {
              opacity: contentAnim,
              transform: [{ translateY: Animated.multiply(contentAnim, 20) }]
            }
          ]}
        >
          Your personalized woodworking journey is ready to begin.
        </Animated.Text>
      </Animated.View>
      
      <Animated.View 
        style={[
          styles.completeActions,
          {
            opacity: contentAnim,
            transform: [{ translateY: Animated.multiply(contentAnim, 20) }]
          }
        ]}
      >
        <Button
          title="Start Learning"
          onPress={handleNext}
          size="large"
          style={styles.startButton}
        />
      </Animated.View>
    </Animated.View>
  );

  const renderSlide = () => {
    const currentSlide = onboardingSlides[currentStep];
    console.log('Current step:', currentStep, 'Slide type:', currentSlide?.type);
    
    // Safety check to prevent undefined access
    if (!currentSlide) {
      console.error('Invalid currentStep:', currentStep, 'onboardingSlides length:', onboardingSlides.length);
      return renderWelcomeSlide();
    }
    
    switch (currentSlide.type) {
      case 'welcome':
        return renderWelcomeSlide();
      case 'name':
        return renderNameSlide();
      case 'username':
        return renderUsernameSlide();
      case 'goals':
        return renderGoalsSlide();
      case 'experience':
        return renderExperienceSlide();
      case 'time':
        return renderTimeSlide();
      case 'motivation':
        return renderMotivationSlide();
      case 'complete':
        return renderCompleteSlide();
      default:
        console.warn('Unknown slide type:', currentSlide.type);
        return renderWelcomeSlide();
    }
  };

  return (
    <View style={styles.container}>
      <GeneralStatusBarColor backgroundColor="#8B4513" barStyle="light-content" />
      <LinearGradient
        colors={['#8B4513', '#D2691E', '#CD853F']}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      <SafeAreaView style={styles.safeArea}>
        {currentStep > 0 && (
          <Animated.View 
            style={[
              styles.header,
              {
                opacity: fadeAnim,
                transform: [{ translateY: Animated.multiply(fadeAnim, 10) }]
              }
            ]}
          >
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <IconSymbol name="chevron.left" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <View style={styles.progressBarContainer}>
              <Animated.View 
                style={[
                  styles.progressBar, 
                  { width: progressAnim }
                ]} 
              />
            </View>
            <View style={{ width: 40 }} />
          </Animated.View>
        )}
        
        {renderSlide()}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  progressBarContainer: {
    flex: 1,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    marginLeft: 20,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Welcome slide styles
  welcomeContainer: {
    flex: 1,
    justifyContent: 'space-between',
    // alignItems: 'center',
    paddingHorizontal: 30,
    paddingTop: 50,
    // paddingBottom: 80,
  },
  welcomeContent: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  welcomeTitle: {
    fontSize: 50,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'left',
    lineHeight: 56,
    marginBottom: 24,
    letterSpacing: -1,
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 8,
    width:'100%',
    textTransform:'uppercase',
  },
  welcomeSubtitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.95,
    lineHeight: 26,
    maxWidth: 320,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  welcomeActions: {
    width: '100%',
    alignItems: 'center',
  },
  welcomeButton: {
    backgroundColor: '#FFFFFF',
    minWidth: 200,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    width: '100%',
  },

  
  // General slide styles
  slideContainer: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 40,
  },
  slideHeader: {
    alignItems: 'center',
    marginBottom: 40,
  },
  slideTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 40,
    marginBottom: 16,
    letterSpacing: -0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 6,
  },
  slideSubtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.95,
    lineHeight: 24,
    maxWidth: 300,
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  optionsContainer: {
    flex: 1,
    paddingBottom: 40,
  },
  optionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  optionButtonSelected: {
    borderColor: '#FFFFFF',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },
  optionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  optionButtonTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  slideFooter: {
    paddingBottom: 40,
  },
  continueButton: {
    backgroundColor: '#FFFFFF',
    minWidth: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  
  // Input styles
  inputContainer: {
    flex: 1,
    marginBottom: 40,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  textInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    color: '#FFFFFF',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  inputHelper: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.7,
    marginTop: 8,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  
  // Complete slide styles
  completeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  completeContent: {
    alignItems: 'center',
    marginBottom: 60,
  },
  completeTitle: {
    fontSize: 36,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 8,
  },
  completeSubtitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.95,
    lineHeight: 26,
    maxWidth: 300,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  completeActions: {
    width: '100%',
    alignItems: 'center',
  },
  startButton: {
    backgroundColor: '#FFFFFF',
    minWidth: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  welcomeImage: {
    width: RPW(100),
    height: RPH(150),
  },
});
