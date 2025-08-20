import { IconSymbol } from '@/components/ui/IconSymbol';
import { FontFamilies } from '@/hooks/AppFonts';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface StatsCardsProps {
  level: number;
  totalXP: number;
  totalProjects: number;
  onLevelPress: () => void;
  onXPPress: () => void;
  onProjectsPress: () => void;
}

export default function StatsCards({ 
  level, 
  totalXP, 
  totalProjects, 
  onLevelPress, 
  onXPPress, 
  onProjectsPress 
}: StatsCardsProps) {
  return (
    <View style={styles.statsContainer}>
      <TouchableOpacity style={styles.statCard} onPress={onLevelPress}>
        <LinearGradient
          colors={['#FFD700', '#FFA500']}
          style={styles.statIcon}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <IconSymbol name="trophy.fill" size={20} color="white" />
        </LinearGradient>
        <Text style={styles.statNumber}>
          {level}
        </Text>
        <Text style={styles.statLabel}>
          Level
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.statCard} onPress={onXPPress}>
        <LinearGradient
          colors={['#58CC02', '#46B700']}
          style={styles.statIcon}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <IconSymbol name="star.fill" size={20} color="white" />
        </LinearGradient>
        <Text style={styles.statNumber}>
          {totalXP}
        </Text>
        <Text style={styles.statLabel}>
          Total XP
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.statCard} onPress={onProjectsPress}>
        <LinearGradient
          colors={['#1CB0F6', '#007AFF']}
          style={styles.statIcon}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <IconSymbol name="hammer.fill" size={20} color="white" />
        </LinearGradient>
        <Text style={styles.statNumber}>
          {totalProjects}
        </Text>
        <Text style={styles.statLabel}>
          Projects
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 4,
    backgroundColor: '#FFFFFF',
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
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 20,
    fontFamily: FontFamilies.featherBold,
    marginBottom: 4,
    color: '#000000',
  },
  statLabel: {
    fontSize: 12,
    fontFamily: FontFamilies.dinRounded,
    fontWeight: '500',
    color: '#666666',
  },
});
