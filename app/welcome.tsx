import GeneralStatusBarColor from '@/components/GeneralStatusBarColor';
import { Button } from '@/components/ui/Button';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useColorScheme } from '@/hooks/useColorScheme';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();

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
        <View style={styles.headerSection}>
          <View style={styles.logoContainer}>
            <IconSymbol name="hammer.fill" size={60} color="white" />
          </View>
          <Text style={styles.title}>Wood Craft</Text>
          <Text style={styles.subtitle}>Master the art of woodworking</Text>
        </View>

        {/* Features section */}
        <View style={styles.featuresSection}>
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
        </View>

        {/* Action buttons */}
        <View style={styles.actionSection}>
          <Button
            title="Get Started"
            onPress={handleGetStarted}
            variant="primary"
            size="large"
            icon="arrow.right"
            style={[styles.primaryButton, { backgroundColor: 'white' }]}
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

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            By continuing, you agree to our Terms & Privacy Policy
          </Text>
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
    alignItems: 'center',
    marginTop: 40,
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
});
