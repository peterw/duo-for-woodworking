import { FontFamilies } from '@/hooks/AppFonts';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

interface ProgressSectionProps {
  totalXP: number;
}

export default function ProgressSection({ totalXP }: ProgressSectionProps) {
  return (
    <View style={styles.progressSection}>
      <Text style={styles.sectionTitle}>
        Progress to Next Level
      </Text>
      <View style={styles.progressCard}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressText}>
            {totalXP % 500} / 500 XP
          </Text>
          <Text style={styles.progressPercentage}>
            {Math.round((totalXP % 500) / 5)}%
          </Text>
        </View>
        <View style={styles.progressBar}>
          <LinearGradient
            colors={['#58CC02', '#46B700']}
            style={[
              styles.progressFill, 
              { width: `${Math.min((totalXP % 500) / 5, 100)}%` }
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  progressSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: FontFamilies.featherBold,
    marginBottom: 16,
    paddingHorizontal: 20,
    color: '#000000',
  },
  progressCard: {
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressText: {
    fontSize: 14,
    fontFamily: FontFamilies.dinRounded,
    fontWeight: '500',
    color: '#666666',
  },
  progressPercentage: {
    fontSize: 14,
    fontFamily: FontFamilies.featherBold,
    color: '#58CC02',
  },
  progressBar: {
    width: '100%',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: '#E5E5E5',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
});
