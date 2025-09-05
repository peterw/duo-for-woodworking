import { IconSymbol } from '@/components/ui/IconSymbol';
import { FontFamilies } from '@/hooks/AppFonts';
import { Skill } from '@/services/skillService';
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

interface SkillModalProps {
  visible: boolean;
  onClose: () => void;
  skill: Skill | null;
  onRefresh?: () => void;
}

export default function SkillModal({ visible, onClose, skill, onRefresh }: SkillModalProps) {
  if (!skill) return null;

  const handleStartLearning = () => {
    onClose(); // Close the modal first
    // Navigate to the lesson screen
    router.push({
      pathname: '/lesson-screen',
      params: {
        skillId: skill.id || '',
        skillTitle: skill.title || '',
        skillDescription: skill.description || '',
        skillIcon: skill.icon || '',
        skillColor: skill.color || '#58CC02',
        skillLevel: (skill.level || 1).toString(),
        skillXpReward: (skill.xpReward || 0).toString(),
        skillCategory: skill.category || 'beginner',
        skillPrerequisites: JSON.stringify(skill.prerequisites || []),
        skillMicroSteps: JSON.stringify(skill.microSteps || []),
        skillIsUnlocked: (skill.isUnlocked || false).toString(),
        skillIsCompleted: (skill.isCompleted || false).toString(),
        skillProgress: (skill.progress || 0).toString(),
        skillCrowns: (skill.crowns || 0).toString(),
        skillLessons: (skill.lessons || 0).toString()
      }
    });
  };

  const handleClose = () => {
    onClose();
    // Refresh data when modal closes
    if (onRefresh) {
      onRefresh();
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
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

          {skill.progress > 0 && (
            <View style={styles.progressContainer}>
              <Text style={styles.progressLabel}>Progress</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${skill.progress}%` }]} />
              </View>
              <Text style={styles.progressText}>{skill.progress}%</Text>
            </View>
          )}

          <View style={styles.crownsContainer}>
            <Text style={styles.crownsLabel}>Crowns</Text>
            <View style={styles.crownsRow}>
              {[1, 2, 3, 4, 5].map((crown) => (
                <IconSymbol
                  key={crown}
                  name={skill.crowns >= crown ? "crown.fill" : "crown"}
                  size={20}
                  color={skill.crowns >= crown ? "#FFD700" : "#E5E5E5"}
                  style={styles.crownIcon}
                />
              ))}
            </View>
          </View>
          
          <TouchableOpacity
            style={[styles.startLearningButton, { backgroundColor: skill.color }]}
            onPress={handleStartLearning}
          >
            <Text style={styles.startLearningButtonText}>
              {skill.isCompleted ? 'Review Skill' : 'Start Learning'}
            </Text>
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
  progressContainer: {
    width: '100%',
    marginBottom: 20,
  },
  progressLabel: {
    fontSize: 14,
    fontFamily: FontFamilies.dinRounded,
    color: '#666666',
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E5E5',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#58CC02',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    fontFamily: FontFamilies.dinRounded,
    color: '#666666',
    textAlign: 'center',
    marginTop: 4,
  },
  crownsContainer: {
    width: '100%',
    marginBottom: 20,
  },
  crownsLabel: {
    fontSize: 14,
    fontFamily: FontFamilies.dinRounded,
    color: '#666666',
    marginBottom: 8,
  },
  crownsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  crownIcon: {
    marginHorizontal: 2,
  },
});
