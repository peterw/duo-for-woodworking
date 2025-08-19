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

export default function SignupScreen() {
  const router = useRouter();
  const { setOnboardingCompleted } = useAppStore();
  const { isAuthenticated, user, appleSignUp, isLoading, error } = useAuthStore();
  const [isSigningUp, setIsSigningUp] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, user, router]);

  // Show error alerts
  useEffect(() => {
    if (error) {
      Alert.alert('Sign Up Error', error, [
        { text: 'OK', onPress: () => {} }
      ]);
    }
  }, [error]);

  const handleAppleSignUp = async () => {
    if (isSigningUp) return; // Prevent multiple taps
    
    setIsSigningUp(true);
    try {
      // For signup, we'll use basic user data that can be enhanced later
      const userData = {
        experience: 'beginner' as const,
        // Other fields will be filled from Apple's response
      };
      
      const success = await appleSignUp(userData);
      if (success) {
        // Success - user will be redirected automatically
        console.log('Apple Sign Up successful');
      }
    } catch (error) {
      console.error('Apple Sign Up error:', error);
      Alert.alert('Sign Up Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setIsSigningUp(false);
    }
  };

  const handleBackToLogin = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <GeneralStatusBarColor backgroundColor="#FFFFFF" barStyle="dark-content" />
      
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBackToLogin} style={styles.backButton}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
        </View>

        {/* Main Content */}
        <View style={styles.mainContainer}>
          {/* Welcome Content */}
          <View style={styles.welcomeContent}>
            <Text style={styles.welcomeTitle}>
              Join Wood Craft!
            </Text>
            
            <Text style={styles.welcomeSubtitle}>
              Start your woodworking adventure today
            </Text>
            
            {/* Apple Sign Up Button */}
            <View style={styles.buttonContainer}>
              <Button
                title={isSigningUp ? "Creating Account..." : "Sign Up with Apple"}
                onPress={handleAppleSignUp}
                variant="primary"
                size="large"
                icon={isSigningUp ? undefined : "applelogo"}
                iconPosition="left"
                style={{
                  ...styles.appleButton,
                  ...(isSigningUp ? styles.appleButtonLoading : {})
                }}
                textStyle={styles.appleButtonText}
                disabled={isSigningUp || isLoading}
              />
            </View>
          </View>
          
          {/* Actions */}
          <View style={styles.welcomeActions}>
            <TouchableOpacity onPress={handleBackToLogin} style={styles.loginLink}>
              <Text style={styles.loginText}>
                Already have an account? <Text style={styles.loginTextBold}>Sign in</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // Assuming a white background for the main container
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24, // Duolingo standard padding
    paddingTop: 20, // Reduced from 50px - closer to top like Duolingo
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
    opacity: 0.7, // Slightly transparent when loading
  },
  appleButtonText: {
    fontFamily: FontFamilies.dinRounded,
    fontSize: 17, // Apple's standard button text size
    fontWeight: '600', // Semi-bold like Apple
    color: '#FFFFFF', // Pure white for maximum contrast
  },
  welcomeActions: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 40, // More padding like Duolingo
    paddingBottom: 60, // Extra bottom padding for safe area
  },
  loginLink: {
    marginTop: 24,
    paddingVertical: 12, // Larger touch target
    paddingHorizontal: 16,
  },
  loginText: {
    fontFamily: FontFamilies.dinRounded, // Custom font like Duolingo
    fontSize: 16,
    color: '#666666', // Dark gray like Duolingo
    textAlign: 'center',
    opacity: 0.9,
    lineHeight: 22, // Better readability
  },
  loginTextBold: {
    fontWeight: '700',
    color: '#58CC02', // Duolingo green for emphasis
    opacity: 1,
    fontFamily: FontFamilies.featherBold,
  },
});
