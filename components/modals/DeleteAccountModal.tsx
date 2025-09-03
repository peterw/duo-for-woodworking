import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useAuthStore } from '@/stores/authStore';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

interface DeleteAccountModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
  visible,
  onClose,
  onSuccess,
}) => {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [shouldNavigate, setShouldNavigate] = useState(false);
  const { deleteAccount, firebaseUser } = useAuthStore();

  // Handle navigation after modal closes
  useEffect(() => {
    if (shouldNavigate && !visible) {
      setShouldNavigate(false);
      if (onSuccess) {
        onSuccess();
      } else {
        // For Apple Sign-In case, navigate to welcome screen
        router.replace('/welcome');
      }
    }
  }, [shouldNavigate, visible, onSuccess]);

  const handleDeleteAccount = async () => {
    if (!password.trim()) {
      Alert.alert('Error', 'Please enter your password to confirm account deletion.');
      return;
    }

    setIsLoading(true);
    try {
      const success = await deleteAccount(password);
      if (success) {
        if (onSuccess) {
          // Set flag to navigate after modal closes
          setShouldNavigate(true);
          onClose();
        } else {
          // Close modal and show alert
          onClose();
          setTimeout(() => {
            Alert.alert(
              'Account Deleted',
              'Your account has been successfully deleted.',
              [{ text: 'OK' }]
            );
          }, 500);
        }
      }
    } catch (error) {
      console.error('Delete account error:', error);
      Alert.alert('Error', 'Failed to delete account. Please try again.');
    } finally {
      setIsLoading(false);
    }
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
              For Apple Sign-In users, you'll need to sign out and sign in again before deleting your account.
            </ThemedText>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.deleteButton} 
                onPress={async () => {
                  // Sign out the user so they can sign in again
                  const success = await useAuthStore.getState().logout();
                  if (success) {
                    // Set flag to navigate after modal closes
                    setShouldNavigate(true);
                    onClose();
                  }
                }}
              >
                <ThemedText style={styles.deleteButtonText}>Delete</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }

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
            Please enter your password to confirm.
          </ThemedText>
          
          <TextInput
            style={styles.passwordInput}
            placeholder="Enter your password"
            placeholderTextColor={Colors.light.text}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            autoCapitalize="none"
            autoCorrect={false}
          />
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.deleteButton, isLoading && styles.disabledButton]} 
              onPress={handleDeleteAccount}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <ThemedText style={styles.deleteButtonText}>Delete Account</ThemedText>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
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
