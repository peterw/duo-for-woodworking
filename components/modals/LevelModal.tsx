import { IconSymbol } from '@/components/ui/IconSymbol';
import { FontFamilies } from '@/hooks/AppFonts';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface LevelModalProps {
  visible: boolean;
  onClose: () => void;
  level: number;
  totalXP: number;
  skillsCompleted: number;
  currentStreak: number;
  totalProjects: number;
}

export default function LevelModal({ 
  visible, 
  onClose, 
  level, 
  totalXP, 
  skillsCompleted, 
  currentStreak, 
  totalProjects 
}: LevelModalProps) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <IconSymbol name="xmark" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Level Details</Text>
          <View style={{ width: 24 }} />
        </View>
        
        <View style={styles.modalContent}>
          <View style={[styles.modalStatIcon, { backgroundColor: '#FFD700' }]}>
            <IconSymbol name="trophy.fill" size={40} color="white" />
          </View>
          <Text style={styles.modalStatTitle}>Current Level: {level}</Text>
          <Text style={styles.modalStatDescription}>
            You're making great progress! Keep learning to reach the next level.
          </Text>
          
          <View style={styles.modalProgressSection}>
            <Text style={styles.modalProgressTitle}>Progress to Level {level + 1}</Text>
            <View style={styles.modalProgressBar}>
              <LinearGradient
                colors={['#FFD700', '#FFA500']}
                style={[
                  styles.modalProgressFill, 
                  { width: `${Math.min((totalXP % 500) / 5, 100)}%` }
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              />
            </View>
            <Text style={styles.modalProgressText}>
              {totalXP % 500} / 500 XP needed
            </Text>
          </View>
          
          <View style={styles.modalStats}>
            <View style={styles.modalStat}>
              <Text style={styles.modalStatNumber}>{skillsCompleted}</Text>
              <Text style={styles.modalStatLabel}>Skills Completed</Text>
            </View>
            <View style={styles.modalStat}>
              <Text style={styles.modalStatNumber}>{currentStreak}</Text>
              <Text style={styles.modalStatLabel}>Day Streak</Text>
            </View>
            <View style={styles.modalStat}>
              <Text style={styles.modalStatNumber}>{totalProjects}</Text>
              <Text style={styles.modalStatLabel}>Projects Done</Text>
            </View>
          </View>
          
          <TouchableOpacity
            style={[styles.startLearningButton, { backgroundColor: '#FFD700' }]}
            onPress={onClose}
          >
            <Text style={styles.startLearningButtonText}>Close</Text>
            <IconSymbol name="xmark" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  closeButton: {
    padding: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: FontFamilies.featherBold,
    color: '#000000',
  },
  modalContent: {
    padding: 20,
    alignItems: 'center',
  },
  modalStatIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  modalStatTitle: {
    fontSize: 20,
    fontFamily: FontFamilies.featherBold,
    marginBottom: 8,
    color: '#000000',
  },
  modalStatDescription: {
    fontSize: 14,
    fontFamily: FontFamilies.dinRounded,
    marginBottom: 20,
    color: '#666666',
    textAlign: 'center',
  },
  modalProgressSection: {
    width: '100%',
    marginBottom: 20,
  },
  modalProgressTitle: {
    fontSize: 18,
    fontFamily: FontFamilies.system,
    marginBottom: 12,
    color: '#000000',
  },
  modalProgressBar: {
    width: '100%',
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E5E5E5',
    overflow: 'hidden',
  },
  modalProgressFill: {
    height: '100%',
    borderRadius: 4,
  },
  modalProgressText: {
    paddingTop: 10,
    fontSize: 14,
    fontFamily: FontFamilies.dinRounded,
    color: '#666666',
  },
  modalStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  modalStat: {
    alignItems: 'center',
  },
  modalStatNumber: {
    fontSize: 24,
    fontFamily: FontFamilies.featherBold,
    color: '#000000',
  },
  modalStatLabel: {
    fontSize: 14,
    fontFamily: FontFamilies.dinRounded,
    color: '#666666',
  },
  startLearningButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  startLearningButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: FontFamilies.featherBold,
    marginRight: 8,
  },
});
