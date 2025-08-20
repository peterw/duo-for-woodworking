import { IconSymbol } from '@/components/ui/IconSymbol';
import { FontFamilies } from '@/hooks/AppFonts';
import React from 'react';
import {
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface XPModalProps {
  visible: boolean;
  onClose: () => void;
  totalXP: number;
  skillsCompleted: number;
  totalProjects: number;
  currentStreak: number;
  dailyGoals: {
    practice: boolean;
    skill: boolean;
  };
}

export default function XPModal({ 
  visible, 
  onClose, 
  totalXP, 
  skillsCompleted, 
  totalProjects, 
  currentStreak,
  dailyGoals
}: XPModalProps) {
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
          <Text style={styles.modalTitle}>XP Breakdown</Text>
          <View style={{ width: 24 }} />
        </View>
        
        <View style={styles.modalContent}>
          <View style={[styles.modalStatIcon, { backgroundColor: '#58CC02' }]}>
            <IconSymbol name="star.fill" size={40} color="white" />
          </View>
          <Text style={styles.modalStatTitle}>Total XP: {totalXP}</Text>
          <Text style={styles.modalStatDescription}>
            Experience points earned through learning and completing tasks.
          </Text>
          
          <View style={styles.modalProgressSection}>
            <Text style={styles.modalProgressTitle}>XP Sources</Text>
            <View style={styles.xpSourceItem}>
              <IconSymbol name="star.fill" size={20} color="#58CC02" />
              <Text style={styles.xpSourceText}>Daily Goals: +{dailyGoals.practice ? 50 : 0} XP</Text>
            </View>
            <View style={styles.xpSourceItem}>
              <IconSymbol name="star.fill" size={20} color="#58CC02" />
              <Text style={styles.xpSourceText}>Skill Completion: +{skillsCompleted * 100} XP</Text>
            </View>
            <View style={styles.xpSourceItem}>
              <IconSymbol name="star.fill" size={20} color="#58CC02" />
              <Text style={styles.xpSourceText}>Project Completion: +{totalProjects * 200} XP</Text>
            </View>
          </View>
          
          <View style={styles.modalStats}>
            <View style={styles.modalStat}>
              <Text style={styles.modalStatNumber}>{Math.floor(totalXP / 500)}</Text>
              <Text style={styles.modalStatLabel}>Levels Gained</Text>
            </View>
            <View style={styles.modalStat}>
              <Text style={styles.modalStatNumber}>{500 - (totalXP % 500)}</Text>
              <Text style={styles.modalStatLabel}>XP to Next Level</Text>
            </View>
            <View style={styles.modalStat}>
              <Text style={styles.modalStatNumber}>{currentStreak}</Text>
              <Text style={styles.modalStatLabel}>Day Streak</Text>
            </View>
          </View>
          
          <TouchableOpacity
            style={[styles.startLearningButton, { backgroundColor: '#58CC02' }]}
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
    fontFamily: FontFamilies.featherBold,
    marginBottom: 12,
    color: '#000000',
  },
  xpSourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  xpSourceText: {
    fontSize: 14,
    fontFamily: FontFamilies.dinRounded,
    marginLeft: 8,
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
