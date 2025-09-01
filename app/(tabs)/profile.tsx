import { Button } from '@/components/ui/Button';
import { Header } from '@/components/ui/Header';
import { Colors } from '@/constants/Colors';
import { FontFamilies } from '@/hooks/AppFonts';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAuthStore, useUserProgressStore } from '@/stores';
import { hapticSelection } from '@/utils/haptics';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

// Carousel data for woodworking achievements and stats
const carouselData = [
  {
    id: '1',
    title: 'Woodworking Journey',
    subtitle: 'Your progress so far',
    color: ['#8B4513', '#A0522D'], // Wood theme colors
    icon: '🌳',
    stats: { label: 'Total XP', value: 'XP' }
  },
  {
    id: '2',
    title: 'Safety First',
    subtitle: 'Safety achievements',
    color: ['#F44336', '#EF5350'], // App error color
    icon: '🛡️',
    stats: { label: 'Safety Score', value: 'Score' }
  },
  {
    id: '3',
    title: 'Tool Mastery',
    subtitle: 'Tools you\'ve learned',
    color: ['#4CAF50', '#66BB6A'], // App success color
    icon: '🔧',
    stats: { label: 'Tools Mastered', value: 'Tools' }
  },
  {
    id: '4',
    title: 'Project Creator',
    subtitle: 'Your woodworking projects',
    color: ['#45B7D1', '#5C9CE6'], // App hammer color
    icon: '🏗️',
    stats: { label: 'Projects', value: 'Count' }
  }
];

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const { appTheme: colors } = useAppTheme();
  const { user, logout } = useAuthStore();
  const { 
    currentStreak, 
    longestStreak, 
    totalXP, 
    level, 
    totalProjects, 
    skillsCompleted 
  } = useUserProgressStore();

  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList>(null);
  
  const styles = createStyles(colorScheme ?? 'light');

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
              await logout();
            } catch (error) {
              console.error('Logout error:', error);
            }
          }
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. All your data will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              const { deleteAccount } = useAuthStore.getState();
              await deleteAccount();
            } catch (error) {
              console.error('Delete account error:', error);
            }
          }
        },
      ]
    );
  };

  const renderCarouselItem = ({ item, index }: { item: any; index: number }) => {
    const itemWidth = width - 40;
    const inputRange = [
      (index - 1) * itemWidth,
      index * itemWidth,
      (index + 1) * itemWidth,
    ];

    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.9, 1.0, 0.9],
      extrapolate: 'clamp',
    });

    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.7, 1.0, 0.7],
      extrapolate: 'clamp',
    });

    return (
      <View style={[styles.carouselItem, { width: itemWidth }]}>
        <Animated.View
          style={[
            styles.carouselCard,
            {
              transform: [{ scale }],
              opacity,
            },
          ]}
        >
          <LinearGradient
            colors={item.color}
            style={styles.carouselGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.carouselIcon}>{item.icon}</Text>
            <Text style={styles.carouselTitle}>{item.title}</Text>
            <Text style={styles.carouselSubtitle}>{item.subtitle}</Text>
            
            <View style={styles.carouselStats}>
              <Text style={styles.carouselStatsLabel}>{item.stats.label}</Text>
              <Text style={styles.carouselStatsValue}>
                {item.stats.value === 'XP' ? totalXP : 
                 item.stats.value === 'Score' ? '95%' :
                 item.stats.value === 'Tools' ? skillsCompleted :
                 totalProjects}
              </Text>
            </View>
          </LinearGradient>
        </Animated.View>
      </View>
    );
  };

  const renderCarouselIndicator = () => {
    return (
      <View style={styles.carouselIndicators}>
        {carouselData.map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicator,
              {
                backgroundColor: index === currentCarouselIndex ? Colors[colorScheme ?? 'light'].tint : '#D1D5DB',
                width: index === currentCarouselIndex ? 20 : 8,
                opacity: index === currentCarouselIndex ? 1 : 0.5,
              },
            ]}
          />
        ))}
      </View>
    );
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>User not found</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Header 
          backgroundColor={'white'}
          title="Profile" 
          subtitle="Your woodworking journey"
          showSafeArea={false}
        />
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Profile Header with Enhanced Design */}
        <View style={styles.profileHeader}>
          <LinearGradient
            colors={['#8B4513', '#A0522D', '#CD853F']}
            style={styles.profileImageContainer}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.profileInitial}>
              {user.fullName.charAt(0).toUpperCase()}
            </Text>
            <View style={styles.levelBadge}>
              <Text style={styles.levelText}>{level}</Text>
            </View>
          </LinearGradient>
          
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user.fullName}</Text>
            <Text style={styles.profileUsername}>@{user.username}</Text>
            <View style={styles.experienceContainer}>
              <Text style={styles.profileExperience}>
                {user.experience.charAt(0).toUpperCase() + user.experience.slice(1)} Level
              </Text>
              <View style={styles.streakContainer}>
                <Text style={styles.streakIcon}>🔥</Text>
                <Text style={styles.streakText}>{currentStreak} day streak</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Beautiful Carousel Section */}
        <View style={styles.carouselSection}>
          <Text style={styles.carouselSectionTitle}>Your Progress</Text>
          <Text style={styles.carouselSectionSubtitle}>Swipe to explore your achievements</Text>
          
          <View style={styles.carouselContainer}>
            <FlatList
              ref={flatListRef}
              data={carouselData}
              renderItem={renderCarouselItem}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              pagingEnabled
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                { useNativeDriver: false }
              )}
              onMomentumScrollEnd={(event) => {
                const newIndex = Math.round(event.nativeEvent.contentOffset.x / (width - 40));
                if (newIndex !== currentCarouselIndex) {
                  setCurrentCarouselIndex(newIndex);
                  setTimeout(() => hapticSelection(), 100);
                }
              }}
              snapToInterval={width - 40}
              decelerationRate={0.8}
              getItemLayout={(data, index) => ({
                length: width - 40,
                offset: (width - 40) * index,
                index,
              })}
            />
            {renderCarouselIndicator()}
          </View>
        </View>

        {/* Enhanced Stats Grid */}
        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Quick Stats</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <LinearGradient
                colors={['#FEF3C7', '#FDE68A']}
                style={styles.statCardGradient}
              >
                <Text style={styles.statIcon}>📚</Text>
                <Text style={styles.statValue}>{skillsCompleted}</Text>
                <Text style={styles.statLabel}>Skills Completed</Text>
              </LinearGradient>
            </View>
            
            <View style={styles.statCard}>
              <LinearGradient
                colors={['#DBEAFE', '#93C5FD']}
                style={styles.statCardGradient}
              >
                <Text style={styles.statIcon}>🏆</Text>
                <Text style={styles.statValue}>{longestStreak}</Text>
                <Text style={styles.statLabel}>Longest Streak</Text>
              </LinearGradient>
            </View>
            
            <View style={styles.statCard}>
              <LinearGradient
                colors={['#D1FAE5', '#6EE7B7']}
                style={styles.statCardGradient}
              >
                <Text style={styles.statIcon}>⚡</Text>
                <Text style={styles.statValue}>{totalXP}</Text>
                <Text style={styles.statLabel}>Total XP</Text>
              </LinearGradient>
            </View>
            
            <View style={styles.statCard}>
              <LinearGradient
                colors={['#F3E8FF', '#C4B5FD']}
                style={styles.statCardGradient}
              >
                <Text style={styles.statIcon}>🔨</Text>
                <Text style={styles.statValue}>{totalProjects}</Text>
                <Text style={styles.statLabel}>Projects</Text>
              </LinearGradient>
            </View>
          </View>
        </View>

        {/* Account Info with Enhanced Design */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Information</Text>
          
          <View style={styles.infoRow}>
            <View style={styles.infoIconContainer}>
              <Text style={styles.infoIcon}>📧</Text>
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{user.email}</Text>
            </View>
          </View>
          
          <View style={styles.infoRow}>
            <View style={styles.infoIconContainer}>
              <Text style={styles.infoIcon}>📅</Text>
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Member Since</Text>
              <Text style={styles.infoValue}>
                {new Date(user.createdAt).toLocaleDateString()}
              </Text>
            </View>
          </View>
          
          {user.timeCommitment && (
            <View style={styles.infoRow}>
              <View style={styles.infoIconContainer}>
                <Text style={styles.infoIcon}>⏰</Text>
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Time Commitment</Text>
                <Text style={styles.infoValue}>{user.timeCommitment}</Text>
              </View>
            </View>
          )}
          
          {user.goal && (
            <View style={styles.infoRow}>
              <View style={styles.infoIconContainer}>
                <Text style={styles.infoIcon}>🎯</Text>
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Primary Goal</Text>
                <Text style={styles.infoValue}>{user.goal}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Enhanced Actions */}
        <View style={styles.actionsContainer}>
          <Button
            title="Logout"
            onPress={handleLogout}
            variant="outline"
            size="large"
            style={styles.logoutButton}
            textStyle={{ color: '#ffffff' }}
          />
          
          <TouchableOpacity onPress={handleDeleteAccount} style={styles.deleteButton}>
            <Text style={styles.deleteButtonText}>Delete Account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colorScheme: string) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  headerContainer: {
    marginBottom: 20,
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 80,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    paddingVertical: 20,
  },
  profileImageContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    position: 'relative',
  },
  profileInitial: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  levelBadge: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    backgroundColor: '#FFD700',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  levelText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors[colorScheme as keyof typeof Colors].tint,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: Colors[colorScheme as keyof typeof Colors].text,
    marginBottom: 6,
    fontFamily: FontFamilies.featherBold,
  },
  profileUsername: {
    fontSize: 16,
    color: Colors[colorScheme as keyof typeof Colors].textSecondary,
    marginBottom: 8,
    fontFamily: FontFamilies.dinRounded,
  },
  experienceContainer: {
    gap: 8,
  },
  profileExperience: {
    fontSize: 14,
    color: Colors[colorScheme as keyof typeof Colors].tint,
    fontWeight: '600',
    backgroundColor: Colors[colorScheme as keyof typeof Colors].backgroundTertiary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  streakIcon: {
    fontSize: 16,
  },
  streakText: {
    fontSize: 14,
    color: Colors[colorScheme as keyof typeof Colors].streak,
    fontWeight: '600',
  },
  
  // Carousel Styles
  carouselSection: {
    marginBottom: 30,
  },
  carouselSectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors[colorScheme as keyof typeof Colors].text,
    marginBottom: 8,
    textAlign: 'center',
  },
  carouselSectionSubtitle: {
    fontSize: 14,
    color: Colors[colorScheme as keyof typeof Colors].textSecondary,
    textAlign: 'center',
    marginBottom: 12,
    fontFamily: FontFamilies.dinRounded,
  },

  carouselContainer: {
    height: 260,
    marginBottom: 10,
  },
  carouselItem: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 0,
  },
  carouselCard: {
    width: width - 60,
    height: 220,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  carouselGradient: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  carouselIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  carouselTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  carouselSubtitle: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 20,
    textAlign: 'center',
  },
  carouselStats: {
    alignItems: 'center',
  },
  carouselStatsLabel: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.8,
    marginBottom: 4,
  },
  carouselStatsValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  carouselIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    gap: 10,
  },
  indicator: {
    height: 10,
    borderRadius: 5,
  },
  
  // Enhanced Stats Grid
  statsContainer: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors[colorScheme as keyof typeof Colors].text,
    marginBottom: 20,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: (width - 60) / 2,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statCardGradient: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
  },
  statIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors[colorScheme as keyof typeof Colors].text,
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 14,
    color: Colors[colorScheme as keyof typeof Colors].textSecondary,
    textAlign: 'center',
    fontWeight: '500',
    fontFamily: FontFamilies.dinRounded,
  },
  
  // Enhanced Section Styles
  section: {
    backgroundColor: Colors[colorScheme as keyof typeof Colors].background,
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  sectionSubtitle: {
    fontFamily: FontFamilies.dinRounded,
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 24,
    color: Colors[colorScheme as keyof typeof Colors].textSecondary,
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  
  // Enhanced Info Row Styles
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors[colorScheme as keyof typeof Colors].border,
  },
  infoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors[colorScheme as keyof typeof Colors].backgroundTertiary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  infoIcon: {
    fontSize: 18,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: Colors[colorScheme as keyof typeof Colors].textSecondary,
    fontWeight: '500',
    marginBottom: 4,
    fontFamily: FontFamilies.dinRounded,
  },
  infoValue: {
    fontSize: 16,
    color: Colors[colorScheme as keyof typeof Colors].text,
    fontWeight: '600',
  },
  
  // Actions
  actionsContainer: {
    marginBottom: 100,
    gap: 20,
    paddingHorizontal: 10,
  },
  logoutButton: {
    borderColor: '#58CC02',
    backgroundColor: '#58CC02',
    shadowColor: '#ffffff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderRadius: 16,

  },
  deleteButton: {

    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: Colors[colorScheme as keyof typeof Colors].border,
  },
  deleteButtonText: {
    color: Colors[colorScheme as keyof typeof Colors].error,
    fontSize: 16,
    fontWeight: '600',
  },
});
