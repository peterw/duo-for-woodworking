import { FontFamilies } from '@/hooks/AppFonts';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    Alert,
    Dimensions,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface AppleSignupModalProps {
  visible: boolean;
  onClose: () => void;
  onSignup: () => void;
}

const { width, height } = Dimensions.get('window');

export default function AppleSignupModal({ visible, onClose, onSignup }: AppleSignupModalProps) {
  const router = useRouter();

  const handleSignup = () => {
    onSignup();
    // Navigate to onboarding with Apple Sign In parameter
    router.push('/onboarding?fromAppleSignIn=true');
  };

  const handleCancel = () => {
    Alert.alert(
      'Cancel Sign Up',
      'Are you sure you want to cancel? You\'ll need to complete sign up to use the app.',
      [
        { text: 'Continue Sign Up', style: 'cancel' },
        { 
          text: 'Cancel', 
          style: 'destructive',
          onPress: onClose 
        },
      ]
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <LinearGradient
            colors={['#FFFFFF', '#F8F9FA']}
            style={styles.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.iconContainer}>
                <Text style={styles.icon}>🍎</Text>
              </View>
              <Text style={styles.title}>Complete Your Profile</Text>
              <Text style={styles.subtitle}>
                Welcome! Let's set up your woodworking journey
              </Text>
            </View>

            {/* Content */}
            <View style={styles.content}>
              <View style={styles.benefitItem}>
                <Text style={styles.benefitIcon}>🎯</Text>
                <View style={styles.benefitText}>
                  <Text style={styles.benefitTitle}>Personalized Learning</Text>
                  <Text style={styles.benefitDescription}>
                    Get custom lessons based on your experience level
                  </Text>
                </View>
              </View>

              <View style={styles.benefitItem}>
                <Text style={styles.benefitIcon}>📊</Text>
                <View style={styles.benefitText}>
                  <Text style={styles.benefitTitle}>Track Your Progress</Text>
                  <Text style={styles.benefitDescription}>
                    Monitor your skills and project completion
                  </Text>
                </View>
              </View>

              <View style={styles.benefitItem}>
                <Text style={styles.benefitIcon}>🏆</Text>
                <View style={styles.benefitText}>
                  <Text style={styles.benefitTitle}>Earn Achievements</Text>
                  <Text style={styles.benefitDescription}>
                    Unlock badges and celebrate your milestones
                  </Text>
                </View>
              </View>
            </View>

            {/* Actions */}
            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.signupButton}
                onPress={handleSignup}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#007AFF', '#0056CC']}
                  style={styles.signupGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.signupButtonText}>Complete Sign Up</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCancel}
                activeOpacity={0.6}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: width * 0.9,
    maxWidth: 400,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  gradient: {
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  icon: {
    fontSize: 40,
  },
  title: {
    fontSize: 24,
    fontFamily: FontFamilies.Bold,
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: FontFamilies.Regular,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 22,
  },
  content: {
    marginBottom: 32,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  benefitIcon: {
    fontSize: 24,
    marginRight: 16,
    width: 32,
    textAlign: 'center',
  },
  benefitText: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: 16,
    fontFamily: FontFamilies.Bold,
    color: '#1A1A1A',
    marginBottom: 4,
  },
  benefitDescription: {
    fontSize: 14,
    fontFamily: FontFamilies.Regular,
    color: '#666666',
    lineHeight: 20,
  },
  actions: {
    gap: 12,
  },
  signupButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  signupGradient: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  signupButtonText: {
    fontSize: 16,
    fontFamily: FontFamilies.Bold,
    color: '#FFFFFF',
  },
  cancelButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: FontFamilies.Regular,
    color: '#666666',
  },
});
