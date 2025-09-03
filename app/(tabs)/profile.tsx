import { DeleteAccountModal } from '@/components/modals';
import { Button } from '@/components/ui/Button';
import { Header } from '@/components/ui/Header';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { FontFamilies } from '@/hooks/AppFonts';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAuthStore, useUserProgressStore } from '@/stores';
import { hapticSelection } from '@/utils/haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

// Professional achievement cards data
const achievementCards = [
  {
    id: '1',
    title: 'Woodworking Journey',
    subtitle: 'Your progress so far',
    color: ['#58CC02', '#46B700'], // Duolingo green
    icon: '🌳',
    stats: { label: 'Total XP', value: 'XP' }
  },
  {
    id: '2',
    title: 'Safety First',
    subtitle: 'Safety achievements',
    color: ['#1CB0F6', '#0EA5E9'], // Duolingo blue
    icon: '🛡️',
    stats: { label: 'Safety Score', value: 'Score' }
  },
  {
    id: '3',
    title: 'Tool Mastery',
    subtitle: 'Tools you\'ve learned',
    color: ['#FF9600', '#F59E0B'], // Duolingo orange
    icon: '🔧',
    stats: { label: 'Tools Mastered', value: 'Tools' }
  },
  {
    id: '4',
    title: 'Project Creator',
    subtitle: 'Your woodworking projects',
    color: ['#CE82FF', '#A855F7'], // Duolingo purple
    icon: '🏗️',
    stats: { label: 'Projects', value: 'Count' }
  }
];

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const { user, logout } = useAuthStore();
  const { 
    currentStreak, 
    longestStreak, 
    totalXP, 
    level, 
    totalProjects, 
    skillsCompleted 
  } = useUserProgressStore();

  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList>(null);

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

  const renderAchievementCard = ({ item, index }: { item: any; index: number }) => {
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
      <View style={[styles.cardItem, { width: itemWidth }]}>
        <Animated.View
          style={[
            styles.achievementCard,
            {
              transform: [{ scale }],
              opacity,
            },
          ]}
        >
          <LinearGradient
            colors={item.color}
            style={styles.cardGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.cardIcon}>{item.icon}</Text>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
            
            <View style={styles.cardStats}>
              <Text style={styles.cardStatsLabel}>{item.stats.label}</Text>
              <Text style={styles.cardStatsValue}>
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

  const renderCardIndicator = () => {
    return (
      <View style={styles.cardIndicators}>
        {achievementCards.map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicator,
              {
                backgroundColor: index === currentCardIndex ? '#58CC02' : '#E5E7EB',
                width: index === currentCardIndex ? 20 : 8,
                opacity: index === currentCardIndex ? 1 : 0.5,
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
        <Text style={styles.errorText}>User not found</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        title="Profile" 
        subtitle="Your woodworking journey"
        showSafeArea={false}
      />
      
      {/* Settings Button */}
      <View style={styles.settingsButtonContainer}>
        <TouchableOpacity 
          style={styles.settingsButton}
          onPress={() => {
            hapticSelection();
            router.push('/settings');
          }}
          activeOpacity={0.7}
        >
          <IconSymbol name="gearshape.fill" size={24} color="#000000" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Header Section */}
        <View style={styles.profileHeader}>
          <View style={styles.profileImageContainer}>
            <LinearGradient
              colors={['#58CC02', '#46B700']}
              style={styles.profileImageGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              {user.profileImageUrl ? (
                <Image 
                  source={{ uri: user.profileImageUrl }} 
                  style={styles.profileImage}
                  resizeMode="cover"
                />
              ) : (
                <Text style={styles.profileInitial}>
                  {user.fullName.charAt(0).toUpperCase()}
                </Text>
              )}
            </LinearGradient>
            <View style={styles.levelBadge}>
              <Text style={styles.levelText}>{level}</Text>
            </View>
          </View>
          
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user.fullName}</Text>
            <Text style={styles.profileUsername}>@{user.username}</Text>
            <View style={styles.experienceContainer}>
              <Text style={styles.profileExperience}>
                {user.experience.charAt(0).toUpperCase() + user.experience.slice(1)} Level
              </Text>
            </View>
          </View>
        </View>

        {/* Streak Badge */}
        <View style={styles.streakSection}>
          <TouchableOpacity style={styles.streakBadge}>
            <LinearGradient
              colors={['#FF9600', '#F59E0B']}
              style={styles.streakBadgeContent}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <IconSymbol name="flame.fill" size={20} color="white" />
              <Text style={styles.streakBadgeText}>{currentStreak} day streak</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Achievement Cards Section */}
        <View style={styles.achievementsSection}>
          <Text style={styles.sectionTitle}>Your Achievements</Text>
          <Text style={styles.sectionSubtitle}>Swipe to explore your progress</Text>
          
          <View style={styles.cardsContainer}>
            <FlatList
              ref={flatListRef}
              data={achievementCards}
              renderItem={renderAchievementCard}
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
                if (newIndex !== currentCardIndex) {
                  setCurrentCardIndex(newIndex);
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
            {renderCardIndicator()}
          </View>
        </View>

        {/* Stats Grid Section */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Quick Stats</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <View style={styles.statCardContent}>
                <Text style={styles.statIcon}>📚</Text>
                <Text style={styles.statValue}>{skillsCompleted}</Text>
                <Text style={styles.statLabel}>Skills Completed</Text>
              </View>
            </View>
            
            <View style={styles.statCard}>
              <View style={styles.statCardContent}>
                <Text style={styles.statIcon}>🏆</Text>
                <Text style={styles.statValue}>{longestStreak}</Text>
                <Text style={styles.statLabel}>Longest Streak</Text>
              </View>
            </View>
            
            <View style={styles.statCard}>
              <View style={styles.statCardContent}>
                <Text style={styles.statIcon}>⚡</Text>
                <Text style={styles.statValue}>{totalXP}</Text>
                <Text style={styles.statLabel}>Total XP</Text>
              </View>
            </View>
            
            <View style={styles.statCard}>
              <View style={styles.statCardContent}>
                <Text style={styles.statIcon}>🔨</Text>
                <Text style={styles.statValue}>{totalProjects}</Text>
                <Text style={styles.statLabel}>Projects</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Saved Tips Section */}
        <View style={styles.savedTipsSection}>
          <TouchableOpacity 
            style={styles.savedTipsCard}
            onPress={() => {
              hapticSelection();
              router.push('/saved-tips');
            }}
            activeOpacity={0.7}
          >

                <View style={styles.savedTipsLeft}>
                  <Text style={styles.savedTipsIcon}>💡</Text>
                  <View style={styles.savedTipsTextContainer}>
                    <Text style={styles.savedTipsTitle}>Saved Tips</Text>
                    <Text style={styles.savedTipsSubtitle}>Your favorite woodworking tips</Text>
                  </View>
                </View>
                <View style={styles.savedTipsRight}>
                  <IconSymbol name="chevron.right" size={20} color="gray" />
                </View>
          </TouchableOpacity>
        </View>

        {/* Account Information Section */}
        <View style={styles.accountSection}>
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

        {/* Actions Section */}
        <View style={styles.actionsSection}>
          <Button
            title="Logout"
            onPress={handleLogout}
            variant="primary"
            size="large"
            style={styles.logoutButton}
          />
          
          <TouchableOpacity onPress={handleDeleteAccount} style={styles.deleteButton}>
            <Text style={styles.deleteButtonText}>Delete Account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      
      {/* Delete Account Modal */}
      <DeleteAccountModal
        visible={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  settingsButtonContainer: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 1000,
  },
  settingsButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 20,
    paddingBottom: 100,
  },
  
  // Profile Header
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  profileImageContainer: {
    position: 'relative',
    marginRight: 20,
  },
  profileImageGradient: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  profileInitial: {
    fontSize: 36,
    fontFamily: FontFamilies.featherBold,
    color: '#FFFFFF',
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  levelText: {
    fontSize: 14,
    fontFamily: FontFamilies.featherBold,
    color: '#000000',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontFamily: FontFamilies.featherBold,
    color: '#000000',
    marginBottom: 6,
  },
  profileUsername: {
    fontSize: 16,
    fontFamily: FontFamilies.dinRounded,
    color: '#666666',
    marginBottom: 8,
  },
  experienceContainer: {
    alignSelf: 'flex-start',
  },
  profileExperience: {
    fontSize: 14,
    fontFamily: FontFamilies.dinRounded,
    color: '#58CC02',
    fontWeight: '600',
    backgroundColor: '#F0F9F0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  
  // Streak Section
  streakSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  streakBadge: {
    alignSelf: 'center',
  },
  streakBadgeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  streakBadgeText: {
    color: 'white',
    fontSize: 16,
    fontFamily: FontFamilies.featherBold,
    marginLeft: 8,
  },
  
  // Achievements Section
  achievementsSection: {
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: FontFamilies.featherBold,
    color: '#000000',
    marginBottom: 8,
    textAlign: 'center',
  },
  sectionSubtitle: {
    fontSize: 16,
    fontFamily: FontFamilies.dinRounded,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 20,
  },
  cardsContainer: {
    height: 260,
    marginBottom: 10,
  },
  cardItem: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 0,
  },
  achievementCard: {
    width: width - 60,
    height: 220,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  cardGradient: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontFamily: FontFamilies.featherBold,
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  cardSubtitle: {
    fontSize: 16,
    fontFamily: FontFamilies.dinRounded,
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 20,
    textAlign: 'center',
  },
  cardStats: {
    alignItems: 'center',
  },
  cardStatsLabel: {
    fontSize: 14,
    fontFamily: FontFamilies.dinRounded,
    color: '#FFFFFF',
    opacity: 0.8,
    marginBottom: 4,
  },
  cardStatsValue: {
    fontSize: 24,
    fontFamily: FontFamilies.featherBold,
    color: '#FFFFFF',
  },
  cardIndicators: {
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
  
  // Stats Section
  statsSection: {
    marginBottom: 30,
    paddingHorizontal: 20,
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
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  statCardContent: {
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
    fontFamily: FontFamilies.featherBold,
    color: '#000000',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 14,
    fontFamily: FontFamilies.dinRounded,
    color: '#666666',
    textAlign: 'center',
    fontWeight: '500',
  },
  
  // Saved Tips Section
  savedTipsSection: {
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  savedTipsCard: {
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.10,
    shadowRadius: 10,
    elevation: 8,
    backgroundColor:'white',
    width: '100%',
    paddingVertical:20,
    paddingHorizontal:20,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between',
  },
  savedTipsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  savedTipsIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  savedTipsTextContainer: {
    flex: 1,
  },
  savedTipsTitle: {
    fontSize: 18,
    fontFamily: FontFamilies.featherBold,
    color: 'black',
    marginBottom: 4,
  },
  savedTipsSubtitle: {
    fontSize: 14,
    fontFamily: FontFamilies.dinRounded,
    color: 'gray',
    opacity: 0.9,
  },
  savedTipsRight: {
    marginLeft: 16,
  },
  
  // Account Section
  accountSection: {
    backgroundColor: '#F8F9FA',
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  infoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  infoIcon: {
    fontSize: 18,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    fontFamily: FontFamilies.dinRounded,
    color: '#666666',
    fontWeight: '500',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontFamily: FontFamilies.dinRounded,
    color: '#000000',
    fontWeight: '600',
  },
  
  // Actions Section
  actionsSection: {
    marginBottom: 100,
    gap: 16,
    paddingHorizontal: 20,
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
    marginHorizontal:10,
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
  
  // Error State
  errorText: {
    fontSize: 18,
    fontFamily: FontFamilies.dinRounded,
    color: '#666666',
    textAlign: 'center',
    marginTop: 100,
  },
});
