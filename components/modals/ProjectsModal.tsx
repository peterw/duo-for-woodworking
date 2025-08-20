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

interface Project {
  id: string;
  title: string;
  difficulty: string;
  isStarted: boolean;
  progress: number;
}

interface ProjectsModalProps {
  visible: boolean;
  onClose: () => void;
  totalProjects: number;
  recentProjects: Project[];
  availableProjects: number;
}

export default function ProjectsModal({ 
  visible, 
  onClose, 
  totalProjects, 
  recentProjects, 
  availableProjects 
}: ProjectsModalProps) {
  const getSkillColor = (index: number) => {
    const colors = ['#FF6B35', '#1CB0F6', '#58CC02', '#FF9600', '#CE82FF', '#A274FF'];
    return colors[index % colors.length];
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
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <IconSymbol name="xmark" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Projects Overview</Text>
          <View style={{ width: 24 }} />
        </View>
        
        <View style={styles.modalContent}>
          <View style={[styles.modalStatIcon, { backgroundColor: '#1CB0F6' }]}>
            <IconSymbol name="hammer.fill" size={40} color="white" />
          </View>
          <Text style={styles.modalStatTitle}>Total Projects: {totalProjects}</Text>
          <Text style={styles.modalStatDescription}>
            Projects you've completed and are currently working on.
          </Text>
          
          <View style={styles.modalProgressSection}>
            <Text style={styles.modalProgressTitle}>Recent Projects</Text>
            {recentProjects.slice(0, 3).map((project, index) => (
              <View key={project.id} style={styles.projectModalItem}>
                <View style={[styles.projectModalIcon, { backgroundColor: getSkillColor(index) }]}>
                  <IconSymbol name="hammer.fill" size={20} color="white" />
                </View>
                <View style={styles.projectModalInfo}>
                  <Text style={styles.projectModalTitle}>{project.title}</Text>
                  <Text style={styles.projectModalDifficulty}>{project.difficulty}</Text>
                </View>
                {project.isStarted && (
                  <Text style={styles.projectModalProgress}>{project.progress}%</Text>
                )}
              </View>
            ))}
          </View>
          
          <View style={styles.modalStats}>
            <View style={styles.modalStat}>
              <Text style={styles.modalStatNumber}>{recentProjects.filter(p => p.isStarted).length}</Text>
              <Text style={styles.modalStatLabel}>In Progress</Text>
            </View>
            <View style={styles.modalStat}>
              <Text style={styles.modalStatNumber}>{recentProjects.filter(p => p.progress === 100).length}</Text>
              <Text style={styles.modalStatLabel}>Completed</Text>
            </View>
            <View style={styles.modalStat}>
              <Text style={styles.modalStatNumber}>{availableProjects}</Text>
              <Text style={styles.modalStatLabel}>Available</Text>
            </View>
          </View>
          
          <TouchableOpacity
            style={[styles.startLearningButton, { backgroundColor: '#1CB0F6' }]}
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
  projectModalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  projectModalIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  projectModalInfo: {
    flex: 1,
  },
  projectModalTitle: {
    fontSize: 16,
    fontFamily: FontFamilies.dinRounded,
    marginBottom: 2,
    color: '#000000',
  },
  projectModalDifficulty: {
    fontSize: 12,
    fontFamily: FontFamilies.dinRounded,
    color: '#666666',
  },
  projectModalProgress: {
    fontSize: 14,
    fontFamily: FontFamilies.featherBold,
    color: '#58CC02',
    marginLeft: 10,
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
