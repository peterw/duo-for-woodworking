import { IconSymbol } from '@/components/ui/IconSymbol';
import { FontFamilies } from '@/hooks/AppFonts';
import { router } from 'expo-router';
import React from 'react';
import {
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Skill {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  isLocked: boolean;
  isCompleted: boolean;
  progress: number;
  xpReward: number;
  lessons: number;
  crowns: number;
  level: number;
}

interface SkillModalProps {
  visible: boolean;
  onClose: () => void;
  skill: Skill | null;
}

export default function SkillModal({ visible, onClose, skill }: SkillModalProps) {
  if (!skill) return null;

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
          <Text style={styles.modalTitle}>Skill Details</Text>
          <View style={{ width: 24 }} />
        </View>
        
        <View style={styles.modalContent}>
          <View style={[styles.modalSkillIcon, { backgroundColor: skill.color }]}>
            <IconSymbol name={skill.icon as any} size={40} color="white" />
          </View>
          <Text style={styles.modalSkillTitle}>{skill.title}</Text>
          <Text style={styles.modalSkillDescription}>{skill.description}</Text>
          
          <View style={styles.modalStats}>
            <View style={styles.modalStat}>
              <Text style={styles.modalStatNumber}>{skill.lessons}</Text>
              <Text style={styles.modalStatLabel}>Lessons</Text>
            </View>
            <View style={styles.modalStat}>
              <Text style={styles.modalStatNumber}>{skill.xpReward}</Text>
              <Text style={styles.modalStatLabel}>XP Reward</Text>
            </View>
            <View style={styles.modalStat}>
              <Text style={styles.modalStatNumber}>{skill.level}</Text>
              <Text style={styles.modalStatLabel}>Level</Text>
            </View>
          </View>
          
          <TouchableOpacity
            style={[styles.startLearningButton, { backgroundColor: skill.color }]}
            onPress={() => {
              onClose();
              router.push('/(tabs)/learn');
            }}
          >
            <Text style={styles.startLearningButtonText}>Start Learning</Text>
            <IconSymbol name="arrow.right" size={20} color="white" />
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
  modalSkillIcon: {
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
  modalSkillTitle: {
    fontSize: 24,
    fontFamily: FontFamilies.featherBold,
    marginBottom: 8,
    color: '#000000',
  },
  modalSkillDescription: {
    fontSize: 16,
    fontFamily: FontFamilies.dinRounded,
    marginBottom: 20,
    color: '#666666',
    textAlign: 'center',
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
