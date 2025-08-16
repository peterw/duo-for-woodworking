import GeneralStatusBarColor from '@/components/GeneralStatusBarColor';
import { Button } from '@/components/ui/Button';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAuthStore } from '@/stores';
import { RPH, RPW } from '@/utils/utils';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
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
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const { isAuthenticated, user } = useAuthStore();
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // If user is already authenticated, redirect to main app
    if (isAuthenticated && user) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, user, router]);

  useFocusEffect(
    React.useCallback(() => {
      // Animate the rotation when screen is focused
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();
    }, [rotateAnim])
  );

  const handleGetStarted = () => {
    router.push('/onboarding');
  };

  const handleLogin = () => {
    router.push('/login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <GeneralStatusBarColor backgroundColor="#8B4513" barStyle="light-content" />
      {/* Background gradient */}
      <LinearGradient
        colors={['#8B4513', '#D2691E', '#CD853F']}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Wood texture overlay */}
      <View style={styles.woodTexture} />

      {/* Content */}
      <View style={styles.content}>
        {/* Logo and title section */}
        {/* <View style={styles.headerSection}>
          <View style={styles.logoContainer}>
            <IconSymbol name="hammer.fill" size={60} color="white" />
          </View>
          <Text style={styles.title}>Wood Craft</Text>
          <Text style={styles.subtitle}>Master the art of woodworking</Text>
        </View> */}

        {/* Features section */}
        {/* <View style={styles.featuresSection}>
          <View style={styles.featureItem}>
            <IconSymbol name="star.fill" size={24} color="white" />
            <Text style={styles.featureText}>Learn step by step</Text>
          </View>
          <View style={styles.featureItem}>
            <IconSymbol name="flame.fill" size={24} color="white" />
            <Text style={styles.featureText}>Build your streak</Text>
          </View>
          <View style={styles.featureItem}>
            <IconSymbol name="trophy.fill" size={24} color="white" />
            <Text style={styles.featureText}>Earn achievements</Text>
          </View>
        </View> */}

        {/* Action buttons */}

        {/* Footer */}
        <View style={{ justifyContent: 'space-between', flex: 1 }}>
       
          {/* Header section with brand and title */}
          <View style={styles.headerSection}>
            <View style={styles.brandContainer}>
              <Animated.Text 
                style={[
                  styles.brandText,
                  {
                    transform: [{
                      rotate: rotateAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0deg', '270deg']
                      })
                    }]
                  }
                ]}
              >
                Learn Craft
              </Animated.Text>
              <View style={styles.verticalSeparator} />
              <View style={styles.titleContainer}>
                <Text style={styles.mainTitle}>Wood Craft</Text>
                <Text style={styles.mainTitle}>in your</Text>
                <Text style={styles.mainTitle}>style</Text>
              </View>
            </View>
          </View>

          <Image resizeMode='contain' style={{ height: RPH(60), width: RPW(100) }} source={require('../assets/images/chairWithLamp.png')} />
          <View style={styles.actionSection}>
            <Button
              title="Get Started"
              onPress={handleGetStarted}
              variant="primary"
              size="large"
              icon="arrow.right"
              style={styles.primaryButton}
              textStyle={{ color: '#8B4513' }}
            />

            <Button
              title="I already have an account"
              onPress={handleLogin}
              variant="ghost"
              size="medium"
              style={styles.secondaryButton}
              textStyle={{ color: '#FFFFFF' }}
            />
          </View>
          {/* <View style={styles.footer}>
          <Text style={styles.footerText}>
            By continuing, you agree to our Terms & Privacy Policy
          </Text>
        </View> */}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  woodTexture: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(139, 69, 19, 0.1)',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  headerSection: {
    width: '100%',
    alignItems: 'center',
    // marginTop: 40,
    // position: 'absolute',
    // left: 200
    top: -20
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 24,
  },
  featuresSection: {
    alignItems: 'center',
    gap: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  featureText: {
    fontSize: 18,
    color: 'white',
    fontWeight: '500',
  },
  actionSection: {
    gap: 16,
  },
  primaryButton: {
    minWidth: 200,
    backgroundColor: 'white',
  },
  secondaryButton: {
    minWidth: 200,
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
  brandContainer: {
    flexDirection: 'row',
  },
  brandText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginRight: 15,
    marginTop: 10,
    // width: 20,
    textAlign: 'center',
    letterSpacing: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.7,
    shadowRadius: 4,
    elevation: 4,
  },
  verticalSeparator: {
    width: 1,
    height: '100%',
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginTop: 5,
    left: -110
  },
  titleContainer: {
    left: -106,
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: 'white',
    textAlign: 'left',
    marginBottom: 2,
    letterSpacing: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.7,
    shadowRadius: 4,
    elevation: 4,
  },
});
