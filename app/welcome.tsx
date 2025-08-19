import GeneralStatusBarColor from '@/components/GeneralStatusBarColor';
import { Button } from '@/components/ui/Button';
import { FontFamilies } from '@/hooks/AppFonts';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAuthStore } from '@/stores';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  View
} from 'react-native';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const { isAuthenticated, user } = useAuthStore();
  
  // Duolingo-style animation refs (no fade animations)
  const titleAnim = useRef(new Animated.Value(0)).current;
  const subtitleAnim = useRef(new Animated.Value(0)).current;
  const imageAnim = useRef(new Animated.Value(0)).current;
  const buttonAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // If user is already authenticated, redirect to main app
    if (isAuthenticated && user) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, user, router]);

  useFocusEffect(
    React.useCallback(() => {
      // Duolingo-style staggered entrance animations (no fade)
      Animated.sequence([
        // Title slides in from top
        Animated.timing(titleAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        // Subtitle slides up
        Animated.timing(subtitleAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        // Image bounces in
        Animated.spring(imageAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        // Buttons slide up
        Animated.timing(buttonAnim, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
      ]).start();
    }, [titleAnim, subtitleAnim, imageAnim, buttonAnim])
  );

  const handleGetStarted = () => {
    router.push('/onboarding');
  };

  const handleLogin = () => {
    router.push('/login');
  };

  return (
    <View style={styles.container}>
      <GeneralStatusBarColor backgroundColor="#FFFFFF" barStyle="dark-content" />
      
      {/* Content */}
      <View style={styles.content}>
        {/* Header section with brand and title */}
        <View style={styles.headerSection}>
          <Animated.View 
            style={[
              styles.titleContainer,
              {
                transform: [{
                  translateY: titleAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-60, 0]
                  })
                }]
              }
            ]}
          >
            <Text style={styles.mainTitle}>Wood Craft</Text>
            <Text style={styles.subtitle}>Master the art of woodworking</Text>
          </Animated.View>
        </View>

        {/* Hero image section */}
        <Animated.View 
          style={[
            styles.imageSection,
            {
              transform: [
                {
                  scale: imageAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.7, 1]
                  })
                },
                {
                  translateY: imageAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [40, 0]
                  })
                }
              ]
            }]
          }
        >
          <View style={styles.imageContainer}>
            <View style={styles.imageBackground} />
            <View style={styles.imagePlaceholder}>
              <Image source={require('../assets/images/chair.png')} style={styles.imageIcon} />
            </View>
          </View>
        </Animated.View>

        {/* Action buttons */}
        <Animated.View 
          style={[
            styles.actionSection,
            {
              transform: [{
                translateY: buttonAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [60, 0]
                })
              }]
            }]
          }
        >
          <Button
            title="Get Started"
            onPress={handleGetStarted}
            variant="primary"
            size="large"
            style={styles.primaryButton}
          />

          <Button
            title="I already have an account"
            onPress={handleLogin}
            variant="ghost"
            size="medium"
            style={styles.secondaryButton}
          />
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 80, // More top space like Duolingo
    paddingBottom: 40,
  },
  headerSection: {
    width: '100%',
    alignItems: 'center',
    paddingTop: 40, // Space from top
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 40, // More space between title and image like Duolingo
  },
  mainTitle: {
    fontSize: 52, // Perfect Duolingo title size
    fontWeight: '900', // Extra bold like Duolingo
    color: '#000000', // Pure black for maximum contrast
    textAlign: 'center',
    marginBottom: 16, // Perfect spacing between title and subtitle
    fontFamily: FontFamilies.featherBold,
    letterSpacing: -0.5, // Slight negative letter spacing for modern feel
    lineHeight: 58, // Tight line height for modern look
  },
  subtitle: {
    fontSize: 20, // Larger subtitle size like Duolingo
    color: '#666666', // Dark gray for subtitle
    textAlign: 'center',
    lineHeight: 28, // Comfortable reading line height
    fontFamily: FontFamilies.dinRounded,
    fontWeight: '400', // Regular weight
    opacity: 0.9, // Slight transparency like Duolingo
  },
  imageSection: {
    alignItems: 'center',
    marginTop: 20,
    flex: 1, // Take remaining space
    justifyContent: 'center', // Center the image vertically
  },
  imageContainer: {
    width: width * 1.3, // Slightly larger for better image visibility
    height: width * 1.3,
    borderRadius: 28, // More rounded corners for modern look
    overflow: 'hidden',
    // backgroundColor: '#F8F9FA', // Light gray background
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08, // Very subtle shadow like Duolingo
    shadowRadius: 20,
    elevation: 10,
    // borderWidth: 1, // Subtle border for definition
    borderColor: '#E9ECEF',
  },
  imageBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    // backgroundColor: '#F8F9FA', // Match container background
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent', // Transparent to show image clearly
    borderRadius: 28,
  },
  imageIcon: {
    width: '85%', // Slightly larger for better visibility
    height: '85%',
    resizeMode: 'contain',
  },
  actionSection: {
    gap: 20, // More space between buttons like Duolingo
    paddingBottom: 20, // Bottom padding
  },
  primaryButton: {
    minWidth: 280, // Wider button like Duolingo
    height: 56, // Perfect Duolingo button height
    backgroundColor: '#58CC02', // Duolingo green
    borderRadius: 16, // Perfect rounded corners like Duolingo
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#58CC02',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, // Subtle shadow like Duolingo
    shadowRadius: 8,
    elevation: 4,
  },
  secondaryButton: {
    minWidth: 280, // Same width as primary button
    height: 56, // Same height for consistency
    borderRadius: 16, // Same border radius
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2, // Border for ghost button
    borderColor: '#E5E5E5', // Light border color
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    lineHeight: 20,
  },
});
