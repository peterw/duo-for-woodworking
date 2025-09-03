import { DeleteAccountModal, EditProfileModal } from '@/components/modals';
import { Button } from '@/components/ui/Button';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { FontFamilies } from '@/hooks/AppFonts';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAuthStore } from '@/stores';
import { hapticSelection } from '@/utils/haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  const {top:topPadding} = useSafeAreaInsets()
  const colorScheme = useColorScheme();
  const { user, logout } = useAuthStore();
  
  // Settings state
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [hapticsEnabled, setHapticsEnabled] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            try {
              const success = await logout();
              if (success) {
                // Use setTimeout to ensure state updates complete before navigation
                setTimeout(() => {
                  router.replace('/welcome');
                }, 100);
              }
            } catch (error) {
              console.error('Logout error:', error);
            }
          }
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    setShowDeleteModal(true);
  };

  const renderSettingItem = ({
    icon,
    title,
    subtitle,
    onPress,
    rightElement,
    showBorder = true
  }: {
    icon: string;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    rightElement?: React.ReactNode;
    showBorder?: boolean;
  }) => (
    <TouchableOpacity
      style={[
        styles.settingItem,
        showBorder && styles.settingItemWithBorder
      ]}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={styles.settingItemLeft}>
        <View style={styles.settingIconContainer}>
          <Text style={styles.settingIcon}>{icon}</Text>
        </View>
        <View style={styles.settingContent}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && (
            <Text style={styles.settingSubtitle}>{subtitle}</Text>
          )}
        </View>
      </View>
      {rightElement && (
        <View style={styles.settingItemRight}>
          {rightElement}
        </View>
      )}
    </TouchableOpacity>
  );

  const renderSectionHeader = (title: string, subtitle?: string) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {subtitle && (
        <Text style={styles.sectionSubtitle}>{subtitle}</Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, {paddingTop:topPadding+10}]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <IconSymbol name="chevron.left" size={24} color="#000000" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Settings</Text>
          <Text style={styles.headerSubtitle}>Customize your experience</Text>
        </View>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Summary */}
        <View style={styles.profileSummary}>
          <LinearGradient
            colors={['#58CC02', '#46B700']}
            style={styles.profileGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.profileInfo}>
              <View style={styles.profileImageContainer}>
                {user?.profileImageUrl ? (
                  <Image 
                    source={{ uri: user.profileImageUrl }} 
                    style={styles.profileImage}
                    resizeMode="cover"
                  />
                ) : (
                  <Text style={styles.profileInitial}>
                    {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
                  </Text>
                )}
              </View>
              <View style={styles.profileTextContainer}>
                <Text style={styles.profileName}>
                  {user?.fullName || 'User'}
                </Text>
                <Text style={styles.profileEmail}>
                  {user?.email || 'user@example.com'}
                </Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Notifications Section */}
        <View style={styles.section}>
          {renderSectionHeader('Notifications', 'Manage how you receive updates')}
          
                    {renderSettingItem({
            icon: '🔔',
            title: 'Push Notifications',
            subtitle: 'Receive updates about your progress',
            rightElement: (
              <Switch
                value={notificationsEnabled}
                trackColor={{ false: '#E5E7EB', true: '#58CC02' }}
                thumbColor="#FFFFFF"
                onValueChange={(value) => {
                  setNotificationsEnabled(value);
                  hapticSelection();
                }}
              />
            ),
            showBorder: false
          })}
          
          {renderSettingItem({
            icon: '📳',
            title: 'Haptic Feedback',
            subtitle: 'Feel vibrations for interactions',
                         rightElement: (
               <Switch
                 value={hapticsEnabled}
                 trackColor={{ false: '#E5E7EB', true: '#58CC02' }}
                 thumbColor="#FFFFFF"
                 onValueChange={(value) => {
                   setHapticsEnabled(value);
                   hapticSelection();
                 }}
               />
             )
          })}
        </View>

    

        {/* Account Section */}
        <View style={styles.section}>
          {renderSectionHeader('Account', 'Manage your account settings')}
          
          {renderSettingItem({
            icon: '👤',
            title: 'Edit Profile',
            subtitle: 'Update your personal information',
            onPress: () => {
              hapticSelection();
              setShowEditProfileModal(true);
            }
          })}
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          {renderSectionHeader('Support', 'Get help and provide feedback')}
          
          {renderSettingItem({
            icon: '❓',
            title: 'Help Center',
            subtitle: 'Find answers to common questions',
            onPress: () => {
              hapticSelection();
              // Navigate to help center
            }
          })}
          
          {renderSettingItem({
            icon: '📧',
            title: 'Contact Support',
            subtitle: 'Get in touch with our team',
            onPress: () => {
              hapticSelection();
              // Navigate to contact support
            }
          })}
          
          {renderSettingItem({
            icon: '⭐',
            title: 'Rate App',
            subtitle: 'Share your experience',
            onPress: () => {
              hapticSelection();
              // Navigate to app store rating
            }
          })}
          
          {renderSettingItem({
            icon: '📝',
            title: 'Send Feedback',
            subtitle: 'Help us improve the app',
            onPress: () => {
              hapticSelection();
              // Navigate to feedback form
            }
          })}
        </View>

        {/* About Section */}
        <View style={styles.section}>
          {renderSectionHeader('About', 'App information and legal')}
          
          {renderSettingItem({
            icon: 'ℹ️',
            title: 'App Version',
            subtitle: '1.0.0',
            onPress: undefined
          })}
          
          {renderSettingItem({
            icon: '📄',
            title: 'Terms of Service',
            subtitle: 'Read our terms and conditions',
            onPress: () => {
              hapticSelection();
              // Navigate to terms
            }
          })}
          
          {renderSettingItem({
            icon: '🔒',
            title: 'Privacy Policy',
            subtitle: 'Learn about data handling',
            onPress: () => {
              hapticSelection();
              // Navigate to privacy policy
            }
          })}
          

        </View>

        {/* Account Actions */}
        <View style={styles.section}>
          {renderSectionHeader('Account Actions', 'Manage your account')}
          
          <View style={styles.actionButtons}>
            <Button
              title="Logout"
              onPress={handleLogout}
              variant="primary"
              size="large"
              style={styles.logoutButton}
            />
            
            <TouchableOpacity 
              onPress={handleDeleteAccount} 
              style={styles.deleteButton}
            >
              <Text style={styles.deleteButtonText}>Delete Account</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      
      {/* Delete Account Modal */}
      <DeleteAccountModal
        visible={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
      />
      
      {/* Edit Profile Modal */}
      <EditProfileModal
        visible={showEditProfileModal}
        onClose={() => setShowEditProfileModal(false)}
        onSuccess={() => {
          // Profile updated successfully
          console.log('Profile updated successfully');
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
  },
  headerCenter: {
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
  
  // Profile Summary
  profileSummary: {
    margin: 20,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
  profileGradient: {
    padding: 24,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    overflow: 'hidden',
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  profileInitial: {
    fontSize: 24,
    fontFamily: FontFamilies.featherBold,
    color: '#FFFFFF',
  },
  profileTextContainer: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontFamily: FontFamilies.featherBold,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    fontFamily: FontFamilies.dinRounded,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  
  // Sections
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: FontFamilies.featherBold,
    color: '#000000',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: FontFamilies.dinRounded,
    color: '#666666',
  },
  
  // Setting Items
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
  },
  settingItemWithBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingIcon: {
    fontSize: 18,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontFamily: FontFamilies.featherBold,
    color: '#000000',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    fontFamily: FontFamilies.dinRounded,
    color: '#666666',
  },
  settingItemRight: {
    alignItems: 'flex-end',
  },
  
  // Action Buttons
  actionButtons: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    gap: 12,
  },
  logoutButton: {
    backgroundColor: '#58CC02',
    borderRadius: 16,
    shadowColor: '#58CC02',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  deleteButton: {
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#EF4444',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  deleteButtonText: {
    color: '#EF4444',
    fontSize: 16,
    fontFamily: FontFamilies.featherBold,
  },
  
  scrollView: {
    flex: 1,
  },
});
