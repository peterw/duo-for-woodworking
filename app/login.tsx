import AppleSignupModal from '@/components/AppleSignupModal';
import GeneralStatusBarColor from '@/components/GeneralStatusBarColor';
import { Button } from '@/components/ui/Button';
import { FontFamilies } from '@/hooks/AppFonts';
import { useAppStore, useAuthStore } from '@/stores';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
  const router = useRouter();
  const { setOnboardingCompleted } = useAppStore();
  const { isAuthenticated, user, appleSignIn, isLoading, error, clearAuthError } = useAuthStore();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);

  // Clear any existing auth errors when component mounts
  useEffect(() => {
    clearAuthError();
  }, [clearAuthError]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, user, router]);

  // Show error alerts (but not for expected scenarios)
  useEffect(() => {
    if (error && !error.includes('no-current-user') && !error.includes('Unable to verify')) {
      Alert.alert('Sign In Error', error, [
        { text: 'OK', onPress: () => {} }
      ]);
    }
  }, [error]);

  const handleAppleSignIn = async () => {
    if (isSigningIn) return; // Prevent multiple taps
    
    setIsSigningIn(true);
    try {
      const result = await appleSignIn();
      if (result === true) {
        // Success - user will be redirected automatically
        console.log('Apple Sign In successful');
      } else if (result === 'NEEDS_SIGNUP') {
        // User needs to complete signup
        setShowSignupModal(true);
      }
    } catch (error) {
      console.error('Apple Sign In error:', error);
      Alert.alert('Sign In Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignupModalClose = () => {
    setShowSignupModal(false);
  };

  const handleSignupModalSignup = () => {
    setShowSignupModal(false);
    // The modal will handle navigation to onboarding
  };

  const handleBackToWelcome = () => {
    router.back();
  };

  const handleSignup = () => {
    router.push('/signup');
  };

  return (
    <View style={styles.container}>
      <GeneralStatusBarColor backgroundColor="#FFFFFF" barStyle="dark-content" />
      
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBackToWelcome} style={styles.backButton}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
        </View>

        {/* Main Content */}
        <View style={styles.mainContainer}>
          {/* Welcome Content */}
          <View style={styles.welcomeContent}>
            <Text style={styles.welcomeTitle}>
              Welcome Back!
            </Text>
            
            <Text style={styles.welcomeSubtitle}>
              Continue your woodworking journey with a single tap
            </Text>
            
            {/* Apple Sign In Button */}
            <View style={styles.buttonContainer}>
              <Button
                title={isSigningIn ? "Signing In..." : "Sign In with Apple"}
                onPress={handleAppleSignIn}
                variant="primary"
                size="large"
                icon={isSigningIn ? undefined : "applelogo"}
                iconPosition="left"
                style={{
                  ...styles.appleButton,
                  ...(isSigningIn ? styles.appleButtonLoading : {})
                }}
                textStyle={styles.appleButtonText}
                disabled={isSigningIn || isLoading}
              />
            </View>
          </View>
          
          {/* Actions */}
          <View style={styles.welcomeActions}>
            <TouchableOpacity onPress={handleSignup} style={styles.signupLink}>
              <Text style={styles.signupText}>
                Don't have an account? <Text style={styles.signupTextBold}>Create one</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      {/* Apple Signup Modal */}
      <AppleSignupModal
        visible={showSignupModal}
        onClose={handleSignupModalClose}
        onSignup={handleSignupModalSignup}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // Clean white background like Duolingo
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24, // Duolingo standard padding
    paddingTop: 20, // Reduced from 60px - closer to top like Duolingo
    paddingBottom: 20,
    alignItems: 'flex-start',
  },
  backButton: {
    padding: 12, // Larger touch target like Duolingo
    borderRadius: 8, // Rounded corners
  },
  backButtonText: {
    fontSize: 28, // Larger back arrow like Duolingo
    color: '#000000', // Pure black for maximum contrast
    fontWeight: '600',
  },
  mainContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24, // Duolingo standard padding
    paddingTop: 40,
  },
  welcomeContent: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingTop: 40, // Space from header
  },
  welcomeTitle: {
    fontFamily: FontFamilies.featherBold, // Custom font like Duolingo
    fontSize: 44, // Perfect Duolingo title size
    fontWeight: '900', // Extra bold like Duolingo
    color: '#000000', // Pure black for maximum contrast
    textAlign: 'center',
    marginBottom: 24, // Perfect spacing between title and subtitle
    letterSpacing: -0.8, // Slight negative letter spacing for modern feel
    lineHeight: 50, // Tight line height for modern look
  },
  welcomeSubtitle: {
    fontFamily: FontFamilies.dinRounded, // Custom font like Duolingo
    fontSize: 20, // Larger subtitle size like Duolingo
    fontWeight: '400', // Regular weight
    color: '#666666', // Dark gray for subtitle like Duolingo
    textAlign: 'center',
    lineHeight: 28, // Comfortable reading line height
    maxWidth: 320,
    marginBottom: 60, // More space before button like Duolingo
    opacity: 0.9, // Slight transparency like Duolingo
  },
  buttonContainer: {
    width: '100%',
    minWidth: 280, // Wider button like Duolingo
    alignItems: 'center',
    marginBottom: 20,
  },
  appleButton: {
    width: '100%',
    minWidth: 280, // Same width as container
    height: 56, // Perfect Duolingo button height
    backgroundColor: '#000000', // Apple's signature black
    borderRadius: 12, // Apple's standard border radius
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, // Very subtle shadow like Apple
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1, // Subtle border like Apple
    borderColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  appleButtonLoading: {
    opacity: 0.7, // Slightly dimmed when loading
  },
  appleButtonText: {
    fontFamily: FontFamilies.dinRounded,
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  // COMMENTED OUT: Styles for other sign-in methods
  /*
  googleButton: {
    width: '100%',
    minWidth: 280,
    height: 56,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E5E5E5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  emailButton: {
    width: '100%',
    minWidth: 280,
    height: 56,
    backgroundColor: '#58CC02', // Duolingo green
    borderRadius: 16,
    shadowColor: '#58CC02',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  facebookButton: {
    width: '100%',
    minWidth: 280,
    height: 56,
    backgroundColor: '#1877F2', // Facebook blue
    borderRadius: 16,
    shadowColor: '#1877F2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  */
  welcomeActions: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 40, // More padding like Duolingo
    paddingBottom: 60, // Extra bottom padding for safe area
  },
  signupLink: {
    marginTop: 24,
    paddingVertical: 12, // Larger touch target
    paddingHorizontal: 16,
  },
  signupText: {
    fontFamily: FontFamilies.dinRounded, // Custom font like Duolingo
    fontSize: 16,
    color: '#666666', // Dark gray like Duolingo
    textAlign: 'center',
    opacity: 0.9,
    lineHeight: 22, // Better readability
  },
  signupTextBold: {
    fontWeight: '700',
    color: '#58CC02', // Duolingo green for emphasis
    opacity: 1,
  },
});
