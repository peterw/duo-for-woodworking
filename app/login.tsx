import GeneralStatusBarColor from '@/components/GeneralStatusBarColor';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAppStore, useAuthStore } from '@/stores';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { login, isLoading, error, setError } = useAuthStore();
  const { setOnboardingCompleted } = useAppStore();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
    // Clear auth error when user starts typing
    if (error) {
      setError(null);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    try {
      setError(null);
      const success = await login(formData.email, formData.password);
      
      if (success) {
        setOnboardingCompleted();
        Alert.alert(
          'Welcome Back!',
          'You\'ve successfully signed in to Wood Craft.',
          [{ text: 'Continue', onPress: () => router.replace('/(tabs)') }]
        );
      }
    } catch (error) {
      console.error('Login error:', error);
      // Error is already handled by the auth store
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

  const handleSignup = () => {
    router.push('/signup');
  };

  const handleForgotPassword = async () => {
    if (!formData.email.trim()) {
      Alert.alert('Error', 'Please enter your email address first.');
      return;
    }

    try {
      const { resetPassword } = useAuthStore.getState();
      const success = await resetPassword(formData.email.trim());
      
      if (success) {
        Alert.alert(
          'Password Reset Email Sent',
          'Check your email for a link to reset your password. If you don\'t see it, check your spam folder.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Password reset error:', error);
      // Error is already handled by the auth store
    }
  };

  const handleBackToWelcome = () => {
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
            <View style={styles.logoContainer}>
              <View style={[styles.logoBackground, { backgroundColor: colors.tint }]}>
                <Text style={styles.logoText}>WC</Text>
              </View>
            </View>
            <Text style={[styles.title, { color: colors.text }]}>
              Welcome Back
            </Text>
            <Text style={[styles.subtitle, { color: colors.tabIconDefault }]}>
              Continue your woodworking journey
            </Text>
          </View>

          {/* Form Section */}
          <View style={styles.formSection}>
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

            <Input
              label="Password"
              value={formData.password}
              onChangeText={(value) => handleInputChange('password', value)}
              placeholder="Enter your password"
              error={errors.password}
              leftIcon="lock.fill"
              secureTextEntry
              size="medium"
            />

            {/* Forgot Password */}
            <TouchableOpacity onPress={handleForgotPassword} style={styles.forgotPasswordContainer}>
              <Text style={[styles.forgotPasswordText, { color: colors.tint }]}>
                Forgot Password?
              </Text>
            </TouchableOpacity>

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
              title="Sign In"
              onPress={handleLogin}
              loading={isLoading}
              disabled={isLoading}
              size="large"
              style={styles.primaryButton}
            />

            <Button
              title="Back to Welcome"
              onPress={handleBackToWelcome}
              variant="ghost"
              size="medium"
              style={styles.secondaryButton}
            />
          </View>



          {/* Signup link */}
          <View style={styles.signupSection}>
            <Text style={[styles.signupText, { color: colors.tabIconDefault }]}>
              Don't have an account?{' '}
            </Text>
            <TouchableOpacity onPress={handleSignup}>
              <Text style={[styles.signupLink, { color: colors.tint }]}>
                Create Account
              </Text>
            </TouchableOpacity>
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
  logoContainer: {
    marginBottom: 24,
  },
  logoBackground: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  logoText: {
    fontSize: 32,
    fontWeight: '700',
    color: 'white',
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
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginTop: -8,
    marginBottom: 8,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: '500',
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
  signupSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupText: {
    fontSize: 16,
  },
  signupLink: {
    fontSize: 16,
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
