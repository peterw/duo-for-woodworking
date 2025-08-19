import GeneralStatusBarColor from '@/components/GeneralStatusBarColor';
import { Button } from '@/components/ui/Button';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/DesignSystem';
import { FontFamilies } from '@/hooks/AppFonts';
import { useColorScheme } from '@/hooks/useColorScheme';
import { firestoreService } from '@/services/firestoreService';
import { useAppStore, useAuthStore, useOnboardingStore } from '@/stores';
import { RPW } from '@/utils/utils';
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  Easing,
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
  color: string;
}

const onboardingSlides: OnboardingSlide[] = [
  {
    id: 1,
    type: 'welcome',
    title: 'Hi there! I\'m Woody!',
    subtitle: 'Just **7 quick questions** before we start your first woodworking lesson!',
    icon: 'hammer.fill',
    color: '#58cc02', // Exact Duolingo green
  },
  {
    id: 2,
    type: 'name',
    title: 'What should we call you?',
    subtitle: 'Let\'s get personal! I\'ll remember your name for our woodworking journey together.',
    icon: 'person.fill',
    color: '#1cb0f6', // Duolingo blue from light mode
  },
  {
    id: 3,
    type: 'username',
    title: 'Choose your woodworker name',
    subtitle: 'This will be your unique identity in our woodworking community. Make it count!',
    icon: 'at',
    color: '#ff9600', // Duolingo orange from light mode
  },
  {
    id: 4,
    type: 'goals',
    title: 'What do you want to build?',
    subtitle: 'Choose your primary goal so I can create the perfect learning path for you.',
    icon: 'star.fill',
    color: '#ff9600', // Duolingo orange from light mode
  },
  {
    id: 5,
    type: 'experience',
    title: 'What\'s your woodworking level?',
    subtitle: 'Don\'t worry - there\'s no wrong answer! This helps me start you in the right place.',
    icon: 'trophy.fill',
    color: '#58cc02', // Exact Duolingo green
  },
  {
    id: 6,
    type: 'time',
    title: 'How much time can you practice?',
    subtitle: 'I\'ll adjust your daily goals to fit your schedule perfectly.',
    icon: 'clock.fill',
    color: '#1cb0f6', // Duolingo blue from light mode
  },
  {
    id: 7,
    type: 'motivation',
    title: 'What gets you excited?',
    subtitle: 'Understanding your motivation helps me keep you inspired and engaged.',
    icon: 'flame.fill',
    color: '#ff9600', // Duolingo orange from light mode
  },
  {
    id: 8,
    type: 'complete',
    title: 'You\'re all set!',
    subtitle: 'Your personalized woodworking journey is ready to begin. Let\'s build something amazing!',
    icon: 'checkmark.circle.fill',
    color: '#58cc02', // Exact Duolingo green
  },
];

const goals = [
  'Build furniture for my home',
  'Create artistic wooden pieces',
  'Learn basic woodworking skills',
  'Start a woodworking business',
  'Make gifts for friends & family',
  'Restore antique furniture',
];

const experienceLevels = [
  'Complete beginner - never touched wood',
  'Some experience - made a few things',
  'Intermediate - comfortable with tools',
  'Advanced - ready for complex projects',
];

const timeOptions = [
  '15 minutes daily - casual learner',
  '30 minutes daily - regular practice',
  '1 hour daily - serious commitment',
  '2+ hours daily - intense learning',
  'Weekends only - weekend warrior',
];

const motivations = [
  'Creating something with my hands',
  'Building practical things for my home',
  'Learning a valuable skill',
  'Finding a creative outlet',
  'Saving money on furniture',
  'Building a business',
  'Making unique gifts',
  'Preserving traditional crafts',
];

export default function OnboardingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const { setOnboardingCompleted } = useAppStore();
  const { setOnboardingData } = useOnboardingStore();
  const { isAuthenticated, user, appleSignUp } = useAuthStore();
  
  // Username validation state
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [usernameError, setUsernameError] = useState('');
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(false);
  
  // Check if user came from Apple Sign In
  const isFromAppleSignIn = params.fromAppleSignIn === 'true';

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, user, router]);

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
  const iconAnim = useRef(new Animated.Value(0)).current;
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
    iconAnim.setValue(0);

    // Calculate accurate progress percentage
    // We have 8 steps (0-7), but step 0 is welcome (0% progress)
    // Steps 1-6 are content steps, step 7 is complete (100% progress)
    let progressValue = 0;
    let currentContentStep = 0;
    let contentSteps = 0;
    
    if (currentStep === 0) {
      // Welcome step: 0% progress
      progressValue = 0;
    } else if (currentStep >= onboardingSlides.length - 2) {
      // Last content step (motivation) and complete step: 100% progress
      progressValue = 100;
    } else {
      // Content steps: Calculate progress from 1 to 5 (excluding welcome and complete)
      // Step 1 (name) = 20%, Step 2 (username) = 40%, etc.
      contentSteps = onboardingSlides.length - 3; // Exclude welcome, last content step, and complete
      currentContentStep = currentStep; // currentStep is already 1-based for content
      progressValue = (currentContentStep / contentSteps) * 100;
    }

    // Debug progress calculation
    console.log(`Step ${currentStep}: Progress = ${progressValue.toFixed(1)}% (${currentContentStep}/${contentSteps})`);
    console.log(`Progress bar width will be: ${progressValue}% of 200px = ${(progressValue * 200 / 100).toFixed(1)}px`);

    // Animate progress bar with Duolingo-style easing
    Animated.timing(progressAnim, {
      toValue: progressValue,
      duration: 600, // Duolingo uses 600ms for smooth progress
      useNativeDriver: false,
      easing: Easing.out(Easing.cubic), // Smooth cubic easing like Duolingo
    }).start();

    // Duolingo-style entrance animations
    if (currentStep === 0) {
      // Welcome slide has special entrance animation like Duolingo
      Animated.sequence([
        // Title slides in from left with bounce
        Animated.timing(titleAnim, {
          toValue: 1,
          duration: 700, // Duolingo uses longer duration for welcome
          useNativeDriver: true,
          easing: Easing.out(Easing.back(1.2)), // Bounce effect like Duolingo
        }),
        // Subtitle fades in with slight delay
        Animated.timing(subtitleAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }),
        // Content slides up smoothly
        Animated.timing(contentAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }),
      ]).start();
    } else {
      // Other slides have Duolingo-style parallel animations
      Animated.parallel([
        // Title slides in from left
        Animated.timing(titleAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }),
        // Subtitle slides in with slight delay
        Animated.timing(subtitleAnim, {
          toValue: 1,
          duration: 600,
          delay: 150, // Staggered entrance like Duolingo
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }),
        // Content slides up with more delay
        Animated.timing(contentAnim, {
          toValue: 1,
          duration: 600,
          delay: 300, // Progressive reveal like Duolingo
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }),
      ]).start();
    }
  }, [currentStep, fadeAnim, slideAnim, scaleAnim, titleAnim, subtitleAnim, contentAnim, progressAnim, iconAnim]);

  const handleNext = async () => {
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
        if (selectedExperience === 'Complete beginner - never touched wood') {
          experience = 'beginner';
        } else if (selectedExperience === 'Some experience - made a few things') {
          experience = 'intermediate';
        } else if (selectedExperience === 'Intermediate - comfortable with tools') {
          experience = 'intermediate';
        } else if (selectedExperience === 'Advanced - ready for complex projects') {
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

      // Duolingo-style button press animation with haptics
      if (Platform.OS === 'ios') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); // Medium impact like Duolingo
      } else if (Platform.OS === 'android') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }

      // Button press animation like Duolingo
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.95,
          duration: 80, // Quick press down
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 120, // Smooth release
          useNativeDriver: true,
          easing: Easing.out(Easing.back(1.5)), // Slight bounce like Duolingo
        }),
      ]).start();

      // Duolingo-style slide transition
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.cubic),
        }),
        Animated.timing(slideAnim, {
          toValue: -100, // Slide out to left like Duolingo
          duration: 300,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.cubic),
        }),
      ]).start(() => {
        // Move to next step
        setCurrentStep(prev => prev + 1);
      });
    } else {
      // Save final step data
      setOnboardingData({ motivation: selectedMotivation });
      
      // Success haptics for completion
      if (Platform.OS === 'ios') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); // Success haptic like Duolingo
      } else if (Platform.OS === 'android') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy); // Heavy impact for completion
      }
      
      // Complete onboarding
      setOnboardingCompleted();
      
      if (isFromAppleSignIn) {
        // For Apple Sign In users, complete the signup process
        try {
          const userData = {
            fullName: fullName,
            username: username,
            goal: selectedGoal,
            experience: selectedExperience as 'beginner' | 'intermediate' | 'advanced',
            timeCommitment: selectedTime,
            motivation: selectedMotivation,
          };
          
          const success = await appleSignUp(userData);
          if (success) {
            // User will be automatically redirected to main app
            console.log('Apple Sign Up completed successfully');
          } else {
            Alert.alert('Sign Up Error', 'Failed to complete sign up. Please try again.');
          }
        } catch (error) {
          console.error('Apple Sign Up error:', error);
          Alert.alert('Sign Up Error', 'An unexpected error occurred. Please try again.');
        }
      } else {
        // For regular users, go to signup
        router.replace('/signup');
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      // Back button haptics like Duolingo
      if (Platform.OS === 'ios') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); // Light impact for back
      } else if (Platform.OS === 'android') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }

      // Duolingo-style back transition
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.cubic),
        }),
        Animated.timing(slideAnim, {
          toValue: 100, // Slide out to right like Duolingo
          duration: 300,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.cubic),
        }),
      ]).start(() => {
        setCurrentStep(prev => prev - 1);
      });
    } else {
      // If on first step, go back to welcome screen
      if (Platform.OS === 'ios') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } else if (Platform.OS === 'android') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      
      router.back(); // Navigate back to previous screen
    }
  };

  const handleSkip = async () => {
    setOnboardingCompleted();
    
    if (isFromAppleSignIn) {
      // For Apple Sign In users, complete with default values
      try {
        const userData = {
          fullName: fullName || 'Apple User',
          username: username || `user_${Date.now().toString(36)}`,
          goal: selectedGoal || 'Learning new skills',
          experience: (selectedExperience as 'beginner' | 'intermediate' | 'advanced') || 'beginner',
          timeCommitment: selectedTime || 'A few hours per week',
          motivation: selectedMotivation || 'Personal growth',
        };
        
        const success = await appleSignUp(userData);
        if (success) {
          console.log('Apple Sign Up completed successfully (skipped)');
        } else {
          Alert.alert('Sign Up Error', 'Failed to complete sign up. Please try again.');
        }
      } catch (error) {
        console.error('Apple Sign Up error:', error);
        Alert.alert('Sign Up Error', 'An unexpected error occurred. Please try again.');
      }
    } else {
      // For regular users, go to signup
      router.replace('/signup');
    }
  };

  // Check username availability
  const checkUsernameAvailability = async (usernameToCheck: string) => {
    if (!usernameToCheck || usernameToCheck.length < 3) {
      setUsernameError('');
      setIsUsernameAvailable(false);
      return;
    }

    // Basic validation
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(usernameToCheck)) {
      setUsernameError('Username can only contain letters, numbers, and underscores');
      setIsUsernameAvailable(false);
      return;
    }

    setIsCheckingUsername(true);
    setUsernameError('');

    try {
      const isAvailable = await firestoreService.isUsernameAvailable(usernameToCheck);
      setIsUsernameAvailable(isAvailable);
      
      if (!isAvailable) {
        setUsernameError('Username is already taken. Please choose a different one.');
      } else {
        setUsernameError('');
      }
    } catch (error) {
      console.error('Error checking username availability:', error);
      setUsernameError('Unable to check username availability. Please try again.');
      setIsUsernameAvailable(false);
    } finally {
      setIsCheckingUsername(false);
    }
  };

  // Debounced username check
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (username && username.length >= 3) {
        checkUsernameAvailability(username);
      } else {
        setUsernameError('');
        setIsUsernameAvailable(false);
      }
    }, 500); // 500ms delay

    return () => clearTimeout(timeoutId);
  }, [username]);

  const handleOptionSelect = (option: string, type: string) => {
    // Duolingo-style selection haptics
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); // Light impact for selection
    } else if (Platform.OS === 'android') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    // Duolingo-style selection animation
    const selectedAnim = new Animated.Value(1);
    Animated.sequence([
      Animated.timing(selectedAnim, {
        toValue: 1.05, // Slight scale up
        duration: 100,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(selectedAnim, {
        toValue: 1, // Return to normal
        duration: 100,
        useNativeDriver: true,
        easing: Easing.out(Easing.back(1.2)), // Slight bounce
      }),
    ]).start();

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

  const renderWelcomeSlide = () => {
    const currentSlide = onboardingSlides[currentStep];
    
    return (
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
          <Animated.Text 
            style={[
              styles.welcomeTitle,
              {
                opacity: titleAnim,
                transform: [{ translateY: Animated.multiply(titleAnim, 30) }]
              }
            ]}
          >
            {currentSlide.title}
          </Animated.Text>

          <Animated.Text
            style={[
              styles.welcomeSubtitle,
              {
                opacity: subtitleAnim,
                transform: [{ translateY: Animated.multiply(subtitleAnim, 20) }]
              }
            ]}
          >
            {currentSlide.subtitle}
          </Animated.Text>
        </View>
        
        <Animated.View 
          style={[
            styles.bottomButtonContainer,
            {
              opacity: contentAnim,
              transform: [{ translateY: Animated.multiply(contentAnim, 20) }]
            }
          ]}
        >
          <Button
            title="Continue"
            onPress={handleNext}
            variant="primary"
            size="large"
            style={styles.primaryButton}
          />
        </Animated.View>
      </Animated.View>
    );
  };

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
      {renderSlideHeader(
        'What should we call you?',
        'Let\'s get personal! I\'ll remember your name for our woodworking journey together.',
        'person.fill',
        Colors.secondary
      )}
      
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
          placeholderTextColor={Colors.gray400}
        />
      </Animated.View>
      
      <Animated.View 
        style={[
          styles.bottomButtonContainer,
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
          variant="primary"
          size="large"
          style={styles.primaryButton}
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
      {renderSlideHeader(
        'Choose your woodworker name',
        'This will be your unique identity in our woodworking community. Make it count!',
        'at',
        Colors.info
      )}
      
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
        <View style={styles.usernameInputContainer}>
          <TextInput
            style={[
              styles.textInput,
              usernameError ? styles.textInputError : null,
              isUsernameAvailable ? styles.textInputSuccess : null
            ]}
            value={username}
            onChangeText={setUsername}
            placeholder="Enter username"
            placeholderTextColor={Colors.gray400}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {isCheckingUsername && (
            <View style={styles.checkingIndicator}>
              <Text style={styles.checkingText}>Checking...</Text>
            </View>
          )}
          {isUsernameAvailable && !isCheckingUsername && (
            <View style={styles.availableIndicator}>
              <Text style={styles.availableText}>✓ Available</Text>
            </View>
          )}
        </View>
        
        {usernameError ? (
          <Text style={styles.inputError}>{usernameError}</Text>
        ) : (
          <Text style={styles.inputHelper}>
            Username must be 3-20 characters, letters, numbers, and underscores only
          </Text>
        )}
      </Animated.View>
      
      <Animated.View 
        style={[
          styles.bottomButtonContainer,
          {
            opacity: contentAnim,
            transform: [{ translateY: Animated.multiply(contentAnim, 20) }]
          }
        ]}
      >
        <Button
          title="Continue"
          onPress={handleNext}
          disabled={!username.trim() || username.length < 3 || !isUsernameAvailable || !!usernameError}
          variant="primary"
          size="large"
          style={styles.primaryButton}
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
      {renderSlideHeader(
        'What do you want to build?',
        'Choose your primary goal so I can create the perfect learning path for you.',
        'star.fill',
        Colors.warning
      )}
      
      <ScrollView style={styles.optionsContainer} showsVerticalScrollIndicator={false}>
        {goals.map((goal, index) => (
          <Animated.View 
            key={goal} 
            style={{
              opacity: contentAnim,
              transform: [
                { 
                  translateY: contentAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [50 + index * 20, 0] // Staggered entrance like Duolingo
                  })
                },
                { 
                  scale: contentAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1] // Scale up entrance
                  })
                }
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
          styles.bottomButtonContainer,
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
          variant="primary"
          size="large"
          style={styles.primaryButton}
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
      {renderSlideHeader(
        'What\'s your woodworking level?',
        'Don\'t worry - there\'s no wrong answer! This helps me start you in the right place.',
        'trophy.fill',
        Colors.success
      )}
      
      <View style={styles.optionsContainer}>
        {experienceLevels.map((level, index) => (
          <Animated.View 
            key={level}
            style={{
              opacity: contentAnim,
              transform: [
                { 
                  translateY: contentAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [50 + index * 20, 0] // Staggered entrance like Duolingo
                  })
                },
                { 
                  scale: contentAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1] // Scale up entrance
                  })
                }
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
          styles.bottomButtonContainer,
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
          variant="primary"
          size="large"
          style={styles.primaryButton}
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
      {renderSlideHeader(
        'How much time can you practice?',
        'I\'ll adjust your daily goals to fit your schedule perfectly.',
        'clock.fill',
        Colors.primary
      )}
      
      <View style={styles.optionsContainer}>
        {timeOptions.map((option, index) => (
          <Animated.View 
            key={option}
            style={{
              opacity: contentAnim,
              transform: [
                { 
                  translateY: contentAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [50 + index * 20, 0] // Staggered entrance like Duolingo
                  })
                },
                { 
                  scale: contentAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1] // Scale up entrance
                  })
                }
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
          styles.bottomButtonContainer,
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
          variant="primary"
          size="large"
          style={styles.primaryButton}
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
      {renderSlideHeader(
        'What gets you excited?',
        'Understanding your motivation helps me keep you inspired and engaged.',
        'flame.fill',
        Colors.secondary
      )}
      
      <ScrollView contentContainerStyle={{paddingBottom: 70}} style={styles.optionsContainer} showsVerticalScrollIndicator={false}>
        {motivations.map((motivation, index) => (
          <Animated.View 
            key={motivation}
            style={{
              opacity: contentAnim,
              transform: [
                { 
                  translateY: contentAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [50 + index * 20, 0] // Staggered entrance like Duolingo
                  })
                },
                { 
                  scale: contentAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1] // Scale up entrance
                  })
                }
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
          styles.bottomButtonContainer,
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
          variant="primary"
          size="large"
          style={styles.primaryButton}
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
          Your personalized woodworking journey is ready to begin. Let's build something amazing!
        </Animated.Text>
      </Animated.View>
      
      <Animated.View 
        style={[
          styles.bottomButtonContainer,
          {
            opacity: contentAnim,
            transform: [{ translateY: Animated.multiply(contentAnim, 20) }]
          }
        ]}
      >
        <Button
          title="Start Learning"
          onPress={handleNext}
          variant="primary"
          size="large"
          style={styles.primaryButton}
        />
      </Animated.View>
    </Animated.View>
  );

  const renderSlideHeader = (title: string, subtitle: string, icon: string, color: string) => (
    <Animated.View 
      style={[
        styles.slideHeader,
        {
          opacity: titleAnim,
          transform: [{ translateY: Animated.multiply(titleAnim, 30) }]
        }
      ]}
    >
      <Text style={styles.slideTitle}>{title}</Text>
      <Text style={styles.slideSubtitle}>{subtitle}</Text>
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
      <GeneralStatusBarColor backgroundColor="#FFFFFF" barStyle="dark-content" />
      
      <SafeAreaView style={styles.safeArea}>
        {/* Step 1 (Welcome): Only back button */}
        {currentStep === 0 && (
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
              <IconSymbol name="chevron.left" size={24} color="#000000" />
            </TouchableOpacity>
            <View style={{ flex: 1 }} />
            <View style={{ width: 40 }} />
          </Animated.View>
        )}
        
        {/* Steps 2-8: Back button + progress bar */}
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
              <IconSymbol name="chevron.left" size={24} color="#000000" />
            </TouchableOpacity>
            <View style={styles.progressSection}>
              {/* Step counter */}
              {/* <Text style={styles.stepCounter}>
                Step {currentStep} of {onboardingSlides.length - 2}
              </Text> */}
              {/* Progress bar */}
              <View style={styles.progressBarContainer}>
                <Animated.View 
                  style={[
                    styles.progressBar, 
                    { 
                      width: progressAnim.interpolate({
                        inputRange: [0, 100],
                        outputRange: [0, 200] // Convert percentage to pixel width
                      })
                    }
                  ]} 
                />
              </View>
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
    backgroundColor: '#FFFFFF', // Pure white like Duolingo
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
  progressSection: {
    flexDirection: 'column',
    alignItems: 'center',
    marginLeft: 20,
  },
  stepCounter: {
    fontFamily: FontFamilies.dinRounded,
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  progressBarContainer: {
    width: RPW(70), // Fixed width to ensure light gray background is visible
    height: 12, // Wider height like Duolingo (increased from 8px)
    backgroundColor: '#F0F0F0', // Light gray background like Duolingo
    borderRadius: 6, // Rounded corners to match the new height
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#FFD700', // Golden yellow like Duolingo
    borderRadius: 6, // Rounded corners to match container
    // Add gradient effect like Duolingo
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Welcome slide styles - Perfect Duolingo branding
  welcomeContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24, // Duolingo standard padding
    paddingTop: 60, // More top space for better visual balance
    paddingBottom: 120, // Space for bottom button
  },
  welcomeContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start', // Left-aligned like Duolingo
    paddingTop: 40,
  },
  welcomeTitle: {
    fontFamily: FontFamilies.featherBold,
    fontSize: 42, // Perfect Duolingo title size
    lineHeight: 48, // Tight line height for modern look
    color: '#000000', // Pure black for maximum contrast
    textAlign: 'left', // Left-aligned like Duolingo
    marginBottom: 24, // Perfect spacing between title and subtitle
    letterSpacing: -0.5, // Slight negative letter spacing for modern feel
    fontWeight: '900', // Extra bold like Duolingo
  },
  welcomeSubtitle: {
    fontFamily: FontFamilies.dinRounded,
    fontSize: 18, // Perfect subtitle size
    lineHeight: 26, // Comfortable reading line height
    color: '#333333', // Dark gray for subtitle - not pure black
    textAlign: 'left', // Left-aligned like Duolingo
    maxWidth: '100%', // Full width for better readability
    fontWeight: '400', // Regular weight for subtitle
  },
  welcomeActions: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 32, // More bottom padding for better balance
    paddingBottom: 40, // Extra bottom padding for safe area
  },
  welcomeButton: {
    width: '100%', // Full width like Duolingo
    minWidth: 280, // Minimum width for proper button sizing
    height: 56, // Perfect button height like Duolingo
  },

  
  // General slide styles - Perfect Duolingo branding
  slideContainer: {
    flex: 1,
    paddingHorizontal: 24, // Duolingo standard padding
    paddingTop: 60, // More top space
    paddingBottom: 120, // Space for bottom button
  },
  slideHeader: {
    alignItems: 'flex-start', // Left-aligned like Duolingo
    marginBottom: 48, // More space for better visual hierarchy
  },
  slideTitle: {
    fontFamily: FontFamilies.featherBold,
    fontSize: 32, // Perfect slide title size
    lineHeight: 38, // Tight line height
    color: '#000000', // Pure black
    textAlign: 'left', // Left-aligned like Duolingo
    marginBottom: 16, // Perfect spacing
    letterSpacing: -0.3, // Slight negative letter spacing
    fontWeight: '800', // Bold but not as bold as welcome
  },
  slideSubtitle: {
    fontFamily: FontFamilies.dinRounded,
    fontSize: 16, // Perfect subtitle size
    lineHeight: 24, // Comfortable reading
    color: '#666666', // Medium gray for subtitle
    textAlign: 'left', // Left-aligned like Duolingo
    maxWidth: '100%', // Full width
    fontWeight: '400', // Regular weight
  },
  optionsContainer: {
    flex: 1,
    paddingBottom: 20, // Reduced since button is absolute positioned
  },
  optionButton: {
    backgroundColor: '#FFFFFF', // Pure white
    borderRadius: 16, // Perfect rounded corners like Duolingo
    padding: 20, // Generous padding
    marginBottom: 16, // Perfect spacing between options
    borderWidth: 2, // Slightly thicker border
    borderColor: '#E5E5E5', // Light gray border
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, // Very subtle shadow
    shadowRadius: 8,
    elevation: 2,
    minHeight: 64, // Minimum height for better touch targets
  },
  optionButtonSelected: {
    borderColor: '#58cc02', // Duolingo green
    backgroundColor: '#F0F9F0', // Very light green background
    shadowColor: '#58cc02',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15, // Slightly more visible shadow when selected
    shadowRadius: 12,
    elevation: 4,
  },
  optionButtonText: {
    fontFamily: FontFamilies.dinRounded,
    fontSize: 16, // Perfect text size
    fontWeight: '600', // Semi-bold for options
    color: '#000000', // Pure black
    textAlign: 'left', // Left-aligned like Duolingo
    lineHeight: 22, // Comfortable line height
  },
  optionButtonTextSelected: {
    color: '#000000', // Keep black text
    fontWeight: '700', // Slightly bolder when selected
  },
  
  // Input styles - Perfect Duolingo branding
  inputContainer: {
    flex: 1,
    marginBottom: 20, // Reduced since button is absolute positioned
  },
  inputLabel: {
    fontFamily: FontFamilies.dinRounded,
    fontSize: 16, // Perfect label size
    fontWeight: '600', // Semi-bold for labels
    color: '#000000', // Pure black
    marginBottom: 12, // Perfect spacing
    lineHeight: 22, // Comfortable line height
  },
  textInput: {
    fontFamily: FontFamilies.dinRounded,
    backgroundColor: '#FFFFFF', // Pure white
    borderRadius: 16, // Perfect rounded corners
    padding: 20, // Generous padding
    fontSize: 16, // Perfect text size
    color: '#000000', // Pure black
    borderWidth: 2, // Slightly thicker border
    borderColor: '#E5E5E5', // Light gray border
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, // Very subtle shadow
    shadowRadius: 8,
    elevation: 2,
    minHeight: 64, // Minimum height for better touch targets
  },
  inputHelper: {
    fontFamily: FontFamilies.dinRounded,
    fontSize: 14, // Perfect helper text size
    color: '#666666', // Medium gray
    marginTop: 12, // Perfect spacing
    textAlign: 'left', // Left-aligned
    fontStyle: 'normal', // No italic
    lineHeight: 20, // Comfortable line height
  },
  inputError: {
    fontFamily: FontFamilies.dinRounded,
    fontSize: 14, // Perfect error text size
    color: '#FF3B30', // iOS red
    marginTop: 12, // Perfect spacing
    textAlign: 'left', // Left-aligned
    lineHeight: 20, // Comfortable line height
  },
  usernameInputContainer: {
    position: 'relative',
  },
  textInputError: {
    borderColor: '#FF3B30', // iOS red
    backgroundColor: '#FFF5F5', // Light red background
  },
  textInputSuccess: {
    borderColor: '#34C759', // iOS green
    backgroundColor: '#F0FFF0', // Light green background
  },
  checkingIndicator: {
    position: 'absolute',
    right: 16,
    top: 20,
  },
  checkingText: {
    fontFamily: FontFamilies.dinRounded,
    fontSize: 12,
    color: '#666666',
    fontStyle: 'italic',
  },
  availableIndicator: {
    position: 'absolute',
    right: 16,
    top: 20,
  },
  availableText: {
    fontFamily: FontFamilies.dinRounded,
    fontSize: 12,
    color: '#34C759', // iOS green
    fontWeight: '600',
  },
  
  // Complete slide styles - Perfect Duolingo branding
  completeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24, // Duolingo standard padding
    paddingBottom: 120, // Space for bottom button
  },
  completeContent: {
    alignItems: 'center',
    marginBottom: 60, // More space
  },
  completeTitle: {
    fontFamily: FontFamilies.featherBold,
    fontSize: 36, // Perfect complete title size
    lineHeight: 42, // Tight line height
    color: '#000000', // Pure black
    textAlign: 'center', // Center-aligned for completion
    marginBottom: 20, // Perfect spacing
    fontWeight: '800', // Bold
    letterSpacing: -0.3, // Slight negative letter spacing
  },
  completeSubtitle: {
    fontFamily: FontFamilies.dinRounded,
    fontSize: 18, // Perfect subtitle size
    lineHeight: 26, // Comfortable reading
    color: '#666666', // Medium gray
    textAlign: 'center', // Center-aligned for completion
    maxWidth: '100%', // Full width
    fontWeight: '400', // Regular weight
  },
  
  // Bottom button container - Perfect Duolingo positioning
  bottomButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingBottom: 40, // Safe area padding
    paddingTop: 24,
    backgroundColor: '#FFFFFF', // White background to ensure button is visible
  },
  primaryButton: {
    width: '100%',
    minWidth: 280,
    height: 56, // Perfect Duolingo button height
  },
});
