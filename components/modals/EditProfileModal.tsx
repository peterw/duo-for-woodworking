import { Button } from '@/components/ui/Button';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Input } from '@/components/ui/Input';
import { FontFamilies } from '@/hooks/AppFonts';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAuthStore } from '@/stores';
import { hapticSelection } from '@/utils/haptics';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

interface EditProfileModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function EditProfileModal({ visible, onClose, onSuccess }: EditProfileModalProps) {
  const colorScheme = useColorScheme();
  const { user, updateProfile } = useAuthStore();
  
  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    experience: 'beginner',
    timeCommitment: '',
    motivation: '',
    goal: ''
  });
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Animation values
  const modalScale = useSharedValue(0);
  const modalOpacity = useSharedValue(0);
  const backdropOpacity = useSharedValue(0);
  const slideY = useSharedValue(height);
  const contentOpacity = useSharedValue(0);

  // Initialize form data when modal opens
  useEffect(() => {
    if (visible && user) {
      setFormData({
        fullName: user.fullName || '',
        username: user.username || '',
        email: user.email || '',
        experience: user.experience || 'beginner',
        timeCommitment: user.timeCommitment || '',
        motivation: user.motivation || '',
        goal: user.goal || ''
      });
      setProfileImage(user.profileImageUrl || null);
      setErrors({});
    }
  }, [visible, user]);

  // Animation effects
  useEffect(() => {
    if (visible) {
      // Animate in with smooth timing
      backdropOpacity.value = withTiming(1, { duration: 300 });
      modalScale.value = withTiming(1, { duration: 300 });
      modalOpacity.value = withTiming(1, { duration: 300 });
      slideY.value = withTiming(0, { duration: 300 });
      contentOpacity.value = withTiming(1, { duration: 400 });
    } else {
      // Animate out with smooth timing
      backdropOpacity.value = withTiming(0, { duration: 250 });
      modalScale.value = withTiming(0, { duration: 250 });
      modalOpacity.value = withTiming(0, { duration: 250 });
      slideY.value = withTiming(height, { duration: 300 });
      contentOpacity.value = withTiming(0, { duration: 200 });
    }
  }, [visible]);

  // Animated styles
  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const modalStyle = useAnimatedStyle(() => ({
    opacity: modalOpacity.value,
    transform: [
      { scale: modalScale.value },
      { translateY: slideY.value }
    ],
  }));

  const contentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [
      { translateY: interpolate(contentOpacity.value, [0, 1], [20, 0], Extrapolate.CLAMP) }
    ],
  }));

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleImagePicker = async () => {
    hapticSelection();
    
    try {
      // Check if ImagePicker is available
      if (!ImagePicker || !ImagePicker.requestMediaLibraryPermissionsAsync) {
        Alert.alert(
          'Feature Not Available',
          'Image picker is not available. Please rebuild the app to enable this feature.',
          [{ text: 'OK' }]
        );
        return;
      }

      // Request permission to access media library
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert(
          'Permission Required',
          'Please allow access to your photo library to select a profile picture.',
          [{ text: 'OK' }]
        );
        return;
      }

      // Show action sheet for image source
      Alert.alert(
        'Select Profile Picture',
        'Choose how you want to add your profile picture',
        [
          {
            text: 'Camera',
            onPress: () => openCamera(),
          },
          {
            text: 'Photo Library',
            onPress: () => openImageLibrary(),
          },
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ]
      );
    } catch (error) {
      console.error('Error requesting permissions:', error);
      Alert.alert('Error', 'Failed to access photo library. Please try again.');
    }
  };

  const openCamera = async () => {
    try {
      if (!ImagePicker || !ImagePicker.requestCameraPermissionsAsync) {
        Alert.alert('Error', 'Camera functionality is not available. Please rebuild the app.');
        return;
      }

      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert(
          'Permission Required',
          'Please allow access to your camera to take a profile picture.',
          [{ text: 'OK' }]
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        setProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error opening camera:', error);
      Alert.alert('Error', 'Failed to open camera. Please try again.');
    }
  };

  const openImageLibrary = async () => {
    try {
      if (!ImagePicker || !ImagePicker.launchImageLibraryAsync) {
        Alert.alert('Error', 'Photo library functionality is not available. Please rebuild the app.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        setProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error opening image library:', error);
      Alert.alert('Error', 'Failed to open photo library. Please try again.');
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    hapticSelection();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      const { email, ...updateData } = formData;
      const success = await updateProfile({
        ...updateData,
        experience: formData.experience as 'beginner' | 'intermediate' | 'advanced',
        ...(profileImage && { profileImageUrl: profileImage })
      });
      
      if (success) {
        Alert.alert(
          'Success! 🎉',
          'Your profile has been updated successfully.',
          [
            {
              text: 'OK',
              onPress: () => {
                onSuccess?.();
                onClose();
              }
            }
          ]
        );
      } else {
        Alert.alert('Error', 'Failed to update profile. Please try again.');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    hapticSelection();
    onClose();
  };

  const handleBackdropPress = () => {
    handleClose();
  };

  if (!visible) return null;

  return (
    <View style={styles.container}>
      {/* Backdrop */}
      <Animated.View style={[styles.backdrop, backdropStyle]}>
        <TouchableWithoutFeedback onPress={handleBackdropPress}>
          <View style={styles.backdropTouchable} />
        </TouchableWithoutFeedback>
      </Animated.View>

      {/* Modal */}
      <Animated.View style={[styles.modal, modalStyle]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingView}
        >
          <SafeAreaView style={styles.safeArea}>
            {/* Header */}
            <Animated.View style={[styles.header, contentStyle]}>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={handleClose}
              >
                <IconSymbol name="xmark" size={24} color="#666666" />
              </TouchableOpacity>
              
              <View style={styles.headerContent}>
                <Text style={styles.headerTitle}>Edit Profile</Text>
                <Text style={styles.headerSubtitle}>Update your personal information</Text>
              </View>
              
              <View style={styles.headerRight} />
            </Animated.View>

            {/* Content */}
            <ScrollView 
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              <Animated.View style={contentStyle}>
                {/* Profile Picture Section */}
                <TouchableOpacity 
                  style={styles.profileSection}
                  onPress={handleImagePicker}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={['#58CC02', '#46B700']}
                    style={styles.profileGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <View style={styles.profileImageContainer}>
                      {profileImage ? (
                        <Image 
                          source={{ uri: profileImage }} 
                          style={styles.profileImage}
                          resizeMode="cover"
                        />
                      ) : (
                        <Text style={styles.profileInitial}>
                          {formData.fullName.charAt(0)?.toUpperCase() || 'U'}
                        </Text>
                      )}
                    </View>
                    <Text style={styles.profileText}>
                      {profileImage ? 'Change Picture' : 'Add Picture'}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>

                {/* Form Fields */}
                <View style={styles.formSection}>
                  <Input
                    label="Full Name"
                    value={formData.fullName}
                    onChangeText={(value) => handleInputChange('fullName', value)}
                    error={errors.fullName}
                    placeholder="Enter your full name"
                    leftIcon="person"
                    size="large"
                  />

                  <Input
                    label="Username"
                    value={formData.username}
                    onChangeText={(value) => handleInputChange('username', value)}
                    error={errors.username}
                    placeholder="Choose a unique username"
                    leftIcon="at"
                    size="large"
                  />

                  <View style={styles.readOnlyField}>
                    <Text style={styles.readOnlyLabel}>Email</Text>
                    <View style={styles.readOnlyContainer}>
                      <IconSymbol name="envelope" size={20} color="#666666" style={styles.readOnlyIcon} />
                      <Text style={styles.readOnlyText}>{formData.email}</Text>
                    </View>
                    <Text style={styles.readOnlyHelper}>Email cannot be changed</Text>
                  </View>

                  <View style={styles.selectContainer}>
                    <Text style={styles.selectLabel}>Experience Level</Text>
                    <View style={styles.selectOptions}>
                      {['beginner', 'intermediate', 'advanced'].map((level) => (
                        <TouchableOpacity
                          key={level}
                          style={[
                            styles.selectOption,
                            formData.experience === level && styles.selectOptionActive
                          ]}
                          onPress={() => handleInputChange('experience', level)}
                        >
                          <Text 
                            style={[
                              styles.selectOptionText,
                              formData.experience === level && styles.selectOptionTextActive
                            ]}
                            numberOfLines={1}
                          >
                            {level.charAt(0).toUpperCase() + level.slice(1)}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  <Input
                    label="Time Commitment (Optional)"
                    value={formData.timeCommitment}
                    onChangeText={(value) => handleInputChange('timeCommitment', value)}
                    placeholder="e.g., 2 hours per week"
                    leftIcon="clock"
                    size="large"
                  />

                  <Input
                    label="Motivation (Optional)"
                    value={formData.motivation}
                    onChangeText={(value) => handleInputChange('motivation', value)}
                    placeholder="What motivates you to learn woodworking?"
                    leftIcon="heart"
                    multiline
                    numberOfLines={3}
                    size="large"
                  />

                  <Input
                    label="Goal (Optional)"
                    value={formData.goal}
                    onChangeText={(value) => handleInputChange('goal', value)}
                    placeholder="What do you want to achieve?"
                    leftIcon="target"
                    multiline
                    numberOfLines={3}
                    size="large"
                  />
                </View>
              </Animated.View>
            </ScrollView>

            {/* Footer */}
            <Animated.View style={[styles.footer, contentStyle]}>
              <View style={styles.buttonContainer}>
                <Button
                  title="Cancel"
                  onPress={handleClose}
                  variant="secondary"
                  size="large"
                  style={styles.cancelButton}
                />
                
                <Button
                  title="Save Changes"
                  onPress={handleSave}
                  variant="primary"
                  size="large"
                  style={styles.saveButton}
                  loading={isLoading}
                />
              </View>
            </Animated.View>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  backdropTouchable: {
    flex: 1,
  },
  modal: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 16,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: FontFamilies.featherBold,
    color: '#000000',
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: FontFamilies.dinRounded,
    color: '#666666',
  },
  headerRight: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  profileGradient: {
    alignItems: 'center',
    padding: 24,
    borderRadius: 20,
    width: '100%',
    maxWidth: 200,
  },
  profileImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  profileInitial: {
    fontSize: 32,
    fontFamily: FontFamilies.featherBold,
    color: '#FFFFFF',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  profileText: {
    fontSize: 16,
    fontFamily: FontFamilies.dinRounded,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  formSection: {
    gap: 20,
  },
  selectContainer: {
    marginBottom: 8,
  },
  selectLabel: {
    fontSize: 16,
    fontFamily: FontFamilies.featherBold,
    color: '#000000',
    marginBottom: 12,
  },
  selectOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  selectOption: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  selectOptionActive: {
    borderColor: '#58CC02',
    backgroundColor: '#F0F9F0',
  },
  selectOptionText: {
    fontSize: 14,
    fontFamily: FontFamilies.dinRounded,
    color: '#666666',
    textAlign: 'center',
  },
  selectOptionTextActive: {
    color: '#58CC02',
    fontFamily: FontFamilies.featherBold,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 0,
  },
  cancelButton: {
    backgroundColor: '#F8F9FA',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  saveButton: {
    shadowColor: '#58CC02',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  readOnlyField: {
    marginBottom: 20,
  },
  readOnlyLabel: {
    fontSize: 16,
    fontFamily: FontFamilies.featherBold,
    color: '#000000',
    marginBottom: 8,
  },
  readOnlyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F8F9FA',
    minHeight: 56,
  },
  readOnlyIcon: {
    marginRight: 12,
  },
  readOnlyText: {
    flex: 1,
    fontSize: 16,
    fontFamily: FontFamilies.dinRounded,
    color: '#666666',
  },
  readOnlyHelper: {
    fontSize: 12,
    fontFamily: FontFamilies.dinRounded,
    color: '#999999',
    marginTop: 4,
  },
});
