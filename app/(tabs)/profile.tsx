import { Header } from '@/components/ui/Header';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAppStore, useAuthStore, useUserProgressStore } from '@/stores';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  isUnlocked: boolean;
  unlockedDate?: string;
}

interface UserStats {
  totalProjects: number;
  currentStreak: number;
  longestStreak: number;
  totalLearningTime: number;
  skillsCompleted: number;
}

const achievements: Achievement[] = [
  {
    id: 'first-project',
    title: 'First Steps',
    description: 'Complete your first woodworking project',
    icon: 'star.fill',
    isUnlocked: true,
    unlockedDate: '2024-01-15',
  },
  {
    id: 'week-streak',
    title: 'Week Warrior',
    description: 'Maintain a 7-day learning streak',
    icon: 'flame.fill',
    isUnlocked: true,
    unlockedDate: '2024-01-20',
  },
  {
    id: 'skill-master',
    title: 'Skill Master',
    description: 'Complete 5 different skills',
    icon: 'crown.fill',
    isUnlocked: false,
  },
  {
    id: 'project-collector',
    title: 'Project Collector',
    description: 'Complete 10 different projects',
    icon: 'trophy.fill',
    isUnlocked: false,
  },
  {
    id: 'month-streak',
    title: 'Monthly Master',
    description: 'Maintain a 30-day learning streak',
    icon: 'calendar.badge.clock',
    isUnlocked: false,
  },
];

export default function ProfileScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const { logout } = useAuthStore();
  const { currentStreak, longestStreak, totalProjects, skillsCompleted } = useUserProgressStore();
  const { notifications, hapticFeedback, darkMode, toggleNotifications, toggleHapticFeedback, toggleDarkMode } = useAppStore();

  const handleLogout = async () => {
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
              await logout();
              // Navigate back to welcome screen
              router.replace('/welcome');
            } catch (error) {
              console.error('Logout error:', error);
            }
          }
        },
      ]
    );
  };

  const renderStatCard = (title: string, value: string | number, icon: string, color: string) => (
    <View style={[styles.statCard, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
      <View style={[styles.statIcon, { backgroundColor: color }]}>
        <IconSymbol name={icon as any} size={20} color="white" />
      </View>
      <Text style={[styles.statValue, { color: Colors[colorScheme ?? 'light'].text }]}>
        {value}
      </Text>
      <Text style={[styles.statTitle, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]}>
        {title}
      </Text>
    </View>
  );

  const renderAchievement = (achievement: Achievement) => (
    <View
      key={achievement.id}
      style={[
        styles.achievementCard,
        {
          backgroundColor: Colors[colorScheme ?? 'light'].background,
          borderColor: Colors[colorScheme ?? 'light'].border,
          opacity: achievement.isUnlocked ? 1 : 0.6,
        },
      ]}
    >
      <View style={[
        styles.achievementIcon,
        {
          backgroundColor: achievement.isUnlocked 
            ? Colors[colorScheme ?? 'light'].tint 
            : Colors[colorScheme ?? 'light'].tabIconDefault,
        }
      ]}>
        <IconSymbol 
          name={achievement.icon as any} 
          size={24} 
          color="white" 
        />
      </View>
      <View style={styles.achievementContent}>
        <Text style={[styles.achievementTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
          {achievement.title}
        </Text>
        <Text style={[styles.achievementDescription, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]}>
          {achievement.description}
        </Text>
        {achievement.isUnlocked && achievement.unlockedDate && (
          <Text style={[styles.unlockedDate, { color: Colors[colorScheme ?? 'light'].tint }]}>
            Unlocked {achievement.unlockedDate}
          </Text>
        )}
      </View>
      {achievement.isUnlocked && (
        <IconSymbol 
          name="checkmark.circle.fill" 
          size={24} 
          color={Colors[colorScheme ?? 'light'].success} 
        />
      )}
    </View>
  );

  const renderSettingItem = (
    title: string,
    subtitle: string,
    icon: string,
    rightElement?: React.ReactNode
  ) => (
    <View style={[styles.settingItem, { borderBottomColor: Colors[colorScheme ?? 'light'].border }]}>
      <View style={styles.settingLeft}>
        <View style={[styles.settingIcon, { backgroundColor: Colors[colorScheme ?? 'light'].tint }]}>
          <IconSymbol name={icon as any} size={20} color="white" />
        </View>
        <View style={styles.settingContent}>
          <Text style={[styles.settingTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
            {title}
          </Text>
          <Text style={[styles.settingSubtitle, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]}>
            {subtitle}
          </Text>
        </View>
      </View>
      {rightElement}
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Header 
          title="Profile" 
          subtitle="Track your progress and customize your experience"
          showSafeArea={false}
        />
        
        {/* User Stats */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
            Your Stats
          </Text>
          <View style={styles.statsGrid}>
            {renderStatCard('Current Streak', `${currentStreak} days`, 'flame.fill', Colors[colorScheme ?? 'light'].streak)}
            {renderStatCard('Longest Streak', `${longestStreak} days`, 'trophy.fill', Colors[colorScheme ?? 'light'].trophy)}
            {renderStatCard('Projects', totalProjects, 'hammer.fill', Colors[colorScheme ?? 'light'].hammer)}
            {renderStatCard('Skills', skillsCompleted, 'star.fill', Colors[colorScheme ?? 'light'].star)}
          </View>
        </View>

        {/* Achievements */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
            Achievements
          </Text>
          {achievements.map(renderAchievement)}
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
            Settings
          </Text>
          <View style={[styles.settingsContainer, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
            {renderSettingItem(
              'Notifications',
              'Get reminded to practice daily',
              'bell.fill',
              <Switch
                value={notifications}
                onValueChange={toggleNotifications}
                trackColor={{ false: Colors[colorScheme ?? 'light'].border, true: Colors[colorScheme ?? 'light'].tint }}
                thumbColor={notifications ? Colors[colorScheme ?? 'light'].background : Colors[colorScheme ?? 'light'].tabIconDefault}
              />
            )}
            {renderSettingItem(
              'Haptic Feedback',
              'Feel the woodworking experience',
              'hand.tap.fill',
              <Switch
                value={hapticFeedback}
                onValueChange={toggleHapticFeedback}
                trackColor={{ false: Colors[colorScheme ?? 'light'].border, true: Colors[colorScheme ?? 'light'].tint }}
                thumbColor={hapticFeedback ? Colors[colorScheme ?? 'light'].background : Colors[colorScheme ?? 'light'].tabIconDefault}
              />
            )}
            {renderSettingItem(
              'Dark Mode',
              'Switch between light and dark themes',
              'moon.fill',
              <Switch
                value={darkMode}
                onValueChange={toggleDarkMode}
                trackColor={{ false: Colors[colorScheme ?? 'light'].border, true: Colors[colorScheme ?? 'light'].tint }}
                thumbColor={darkMode ? Colors[colorScheme ?? 'light'].background : Colors[colorScheme ?? 'light'].tabIconDefault}
              />
            )}
            {renderSettingItem(
              'Privacy Policy',
              'Read our privacy policy',
              'hand.raised.fill'
            )}
            {renderSettingItem(
              'Terms of Service',
              'Read our terms of service',
              'doc.text.fill'
            )}
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={[styles.logoutButton, { backgroundColor: Colors[colorScheme ?? 'light'].error }]}
          onPress={handleLogout}
        >
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  statCard: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 14,
    textAlign: 'center',
  },
  achievementCard: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  achievementIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 14,
    marginBottom: 4,
  },
  unlockedDate: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  settingsContainer: {
    marginHorizontal: 20,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  settingSubtitle: {
    fontSize: 14,
  },
  logoutButton: {
    marginHorizontal: 20,
    marginTop: 20,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
