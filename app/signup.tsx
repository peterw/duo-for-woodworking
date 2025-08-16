import GeneralStatusBarColor from '@/components/GeneralStatusBarColor';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAppStore, useAuthStore, useOnboardingStore } from '@/stores';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
  experience: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  experience?: string;
}

const experienceLevels = [
  { label: 'Complete Beginner', value: 'beginner', description: 'New to woodworking' },
  { label: 'Some Experience', value: 'intermediate', description: 'Basic skills, ready to learn more' },
  { label: 'Advanced', value: 'advanced', description: 'Confident with most techniques' },
];

export default function SignupScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { signup, error, setError } = useAuthStore();
  const { setOnboardingCompleted } = useAppStore();
  const { getOnboardingData } = useOnboardingStore();

  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: '',
    experience: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
    // Clear auth error when user starts typing
    if (error) {
      setError(null);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address (e.g., yourname@example.com)';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    } else if (!/(?=.*[a-z])/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one lowercase letter';
    } else if (!/(?=.*[A-Z])/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter';
    } else if (!/(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one number';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match. Please try again';
    }

    if (!formData.experience) {
      newErrors.experience = 'Please select your experience level to personalize your learning';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      setError(null);
      const onboardingData = getOnboardingData();
      if (!onboardingData?.fullName || !onboardingData?.username) {
        Alert.alert('Error', 'Onboarding data is missing. Please complete onboarding first.');
        return;
      }

      const success = await signup({
        fullName: onboardingData.fullName,
        username: onboardingData.username,
        email: formData.email.trim().toLowerCase(),
        experience: formData.experience as 'beginner' | 'intermediate' | 'advanced',
        timeCommitment: onboardingData.timeCommitment,
        motivation: onboardingData.motivation,
        goal: onboardingData.goal,
      }, formData.password);

      if (success) {
        setOnboardingCompleted();
        Alert.alert(
          'Account Created Successfully!',
          'Welcome to Wood Craft! Your account has been created and you\'re now signed in.',
          [{ text: 'Get Started', onPress: () => router.replace('/(tabs)') }]
        );
      }
    } catch (error) {
      console.error('Signup error:', error);
      // Error is already handled by the auth store
    } finally {
      setIsLoading(false);
    }
  };

  // Get error from auth store
  const { error: authError } = useAuthStore();
  
  // Display auth error if exists
  useEffect(() => {
    if (authError) {
      setError(authError);
    }
  }, [authError]);

  const handleBackToLogin = () => {
    router.back();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <GeneralStatusBarColor backgroundColor={colors.background} barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section */}
          <View style={styles.headerSection}>
            <Text style={[styles.title, { color: colors.text }]}>
              Create Your Account
            </Text>
            <Text style={[styles.subtitle, { color: colors.tabIconDefault }]}>
              Complete your account setup to start learning
            </Text>
          </View>

          {/* Form Section */}
          <View style={styles.formSection}>
            {/* Email */}
            <Input
              label="Email Address"
              value={formData.email}
              onChangeText={(value) => handleInputChange('email', value)}
              placeholder="Enter your email"
              error={errors.email}
              leftIcon="envelope.fill"
              keyboardType="email-address"
              autoCapitalize="none"
              size="medium"
            />

            {/* Password */}
            <Input
              label="Password"
              value={formData.password}
              onChangeText={(value) => handleInputChange('password', value)}
              placeholder="Create a strong password"
              error={errors.password}
              leftIcon="lock.fill"
              secureTextEntry
              helperText="Use at least 8 characters with uppercase, lowercase, and numbers"
              size="medium"
            />

            {/* Confirm Password */}
            <Input
              label="Confirm Password"
              value={formData.confirmPassword}
              onChangeText={(value) => handleInputChange('confirmPassword', value)}
              placeholder="Confirm your password"
              error={errors.confirmPassword}
              leftIcon="lock.fill"
              secureTextEntry
              size="medium"
            />

            {/* Experience Level */}
            <Select
              label="Woodworking Experience"
              options={experienceLevels}
              value={formData.experience}
              onValueChange={(value) => handleInputChange('experience', value)}
              placeholder="Select your experience level"
              error={errors.experience}
              helperText="Don't worry - you can always change this later in your profile"
              size="medium"
            />

            {/* Error Display */}
            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}
          </View>

          {/* Action Buttons */}
          <View style={styles.actionSection}>
            <Button
              title="Create Account"
              onPress={handleSignup}
              loading={isLoading}
              disabled={isLoading}
              size="large"
              style={styles.primaryButton}
            />

            <Button
              title="Back to Login"
              onPress={handleBackToLogin}
              variant="ghost"
              size="medium"
              style={styles.secondaryButton}
            />
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.tabIconDefault }]}>
              By creating an account, you agree to our{' '}
              <Text style={[styles.linkText, { color: colors.tint }]}>
                Terms of Service
              </Text>{' '}
              and{' '}
              <Text style={[styles.linkText, { color: colors.tint }]}>
                Privacy Policy
              </Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  formSection: {
    marginBottom: 32,
  },
  actionSection: {
    gap: 16,
    marginBottom: 24,
  },
  primaryButton: {
    marginBottom: 8,
  },
  secondaryButton: {
    marginTop: 8,
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  linkText: {
    fontWeight: '600',
  },
  errorContainer: {
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
});
