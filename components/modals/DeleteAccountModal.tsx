import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useAuthStore } from '@/stores/authStore';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';

interface DeleteAccountModalProps {
  visible: boolean;
  onClose: () => void;
}

export const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
  visible,
  onClose,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const {  deleteAppleAccount, firebaseUser } = useAuthStore();

  const handleDeleteAppleAccount = async () => {
    // Show confirmation dialog first
    Alert.alert(
      'Confirm Account Deletion',
      'Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently lost.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete Account', 
          style: 'destructive',
          onPress: async () => {
            setIsLoading(true);
            try {
                            const success = await deleteAppleAccount();
              if (success) {
                // Close modal first
                onClose();
                
                // Show success message and navigate to welcome screen
                setTimeout(() => {
                  Alert.alert(
                    'Account Deleted',
                    'Your account has been successfully deleted.',
                    [{ 
                      text: 'OK',
                      onPress: () => {
                        router.replace('/welcome');
                      }
                    }]
                  );
                }, 500);
              } else {
                // Handle specific error cases from the auth store
                Alert.alert(
                  'Deletion Failed',
                  'Unable to delete your account. Please try again or contact support if the issue persists.',
                  [{ text: 'OK' }]
                );
              }
            } catch (error: any) {
              console.error('Delete Apple account error:', error);
              
              let errorMessage = 'Failed to delete account. Please try again.';
              
              // Handle specific error cases
              if (error.message?.includes('Apple Sign In is not available')) {
                errorMessage = 'Apple Sign In is not available on this device. Please try again later.';
              } else if (error.message?.includes('re-authentication failed')) {
                errorMessage = 'Authentication failed. Please try again.';
              } else if (error.message?.includes('network')) {
                errorMessage = 'Network error. Please check your connection and try again.';
              } else if (error.message?.includes('User document does not exist')) {
                errorMessage = 'User data not found. Please contact support.';
              }
              
              Alert.alert('Error', errorMessage);
            } finally {
              setIsLoading(false);
            }
          }
        },
      ]
    );
  };

  const isAppleUser = firebaseUser?.providerData[0]?.providerId === 'apple.com';

  if (isAppleUser) {
    return (
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={onClose}
      >
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <ThemedText style={styles.title}>Delete Account</ThemedText>
            <ThemedText style={styles.message}>
              This action cannot be undone. All your data will be permanently deleted.
              You'll need to re-authenticate with Apple to confirm account deletion.
            </ThemedText>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.deleteButton, isLoading && styles.disabledButton]} 
                onPress={handleDeleteAppleAccount}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <ThemedText style={styles.deleteButtonText}>Delete</ThemedText>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: Colors.light.background,
    borderRadius: 16,
    padding: 24,
    margin: 20,
    width: '90%',
    maxWidth: 400,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: Colors.light.text,
  },
  message: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 22,
    color: Colors.light.text,
  },
  passwordInput: {
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    marginBottom: 24,
    backgroundColor: Colors.light.background,
    color: Colors.light.text,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.light.border,
    alignItems: 'center',
  },
  deleteButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#EF4444',
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.6,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});
