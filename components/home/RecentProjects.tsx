import { IconSymbol } from '@/components/ui/IconSymbol';
import { FontFamilies } from '@/hooks/AppFonts';
import React from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');

interface Project {
  id: string;
  title: string;
  difficulty: string;
  isStarted: boolean;
  isCompleted?: boolean;
  progress: number;
}

interface RecentProjectsProps {
  recentProjects: Project[];
  onProjectPress: (project: Project) => void;
  onViewAllProjects: () => void;
}

export default function RecentProjects({ 
  recentProjects, 
  onProjectPress, 
  onViewAllProjects 
}: RecentProjectsProps) {
  const getSkillColor = (index: number) => {
    const colors = ['#FF6B35', '#1CB0F6', '#58CC02', '#FF9600', '#CE82FF', '#A274FF'];
    return colors[index % colors.length];
  };

  return (
    <View style={styles.recentProjectsSection}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          Recent Projects
        </Text>
        <TouchableOpacity onPress={onViewAllProjects}>
          <Text style={styles.viewAllButton}>View All</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.projectsScrollView}>
        {recentProjects.map((project, index) => (
          <View
            key={project.id}
            style={styles.projectCard}
          >
            <View style={styles.projectCardContent}>
              <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>

              <View style={[styles.projectIcon, { backgroundColor: getSkillColor(index) }]}>
                <IconSymbol name="hammer.fill" size={24} color="white" />
              </View>
              {project.isCompleted && (
                <View style={styles.completedBadge}>
                  <IconSymbol name="checkmark.circle.fill" size={16} color="#58CC02" />
                  <Text style={styles.completedText}>Completed</Text>
                </View>
              )}


              </View>
          
              <Text style={styles.projectTitle} numberOfLines={2}>
                {project.title}
              </Text>
              <Text style={styles.projectDifficulty}>
                {project.difficulty}
              </Text>
                <View style={styles.projectProgress}>
                  <View style={styles.projectProgressBar}>
                    <View 
                      style={[
                        styles.projectProgressFill,
                        { 
                          width: `${project.progress}%`,
                          backgroundColor: project.isCompleted ? '#58CC02' : '#1CB0F6'
                        }
                      ]} 
                    />
                  </View>
                  <Text style={styles.projectProgressText}>{project.progress}%</Text>
                </View>
            </View>
            
            <TouchableOpacity
              style={styles.startProjectButton}
              onPress={() => onProjectPress(project)}
            >
              <Text style={styles.startProjectButtonText}>
                {project.isCompleted ? 'View Project' : project.isStarted ? 'Continue' : 'Start Project'}
              </Text>
              <IconSymbol name="arrow.right" size={16} color="white" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  recentProjectsSection: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontFamily: FontFamilies.featherBold,
    color: '#000000',
  },
  viewAllButton: {
    fontSize: 14,
    fontFamily: FontFamilies.dinRounded,
    color: '#1CB0F6',
    textDecorationLine: 'underline',
  },
  projectsScrollView: {
    paddingHorizontal: 20,
  },
  projectCard: {
    width: width * 0.7, // Adjust as needed
    borderRadius: 12,
    marginRight: 16,
    marginVertical: 8,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    padding: 20,
  },
  projectCardContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  projectIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  projectTitle: {
    fontSize: 16,
    fontFamily: FontFamilies.featherBold,
    marginBottom: 4,
    color: '#000000',
  },
  projectDifficulty: {
    fontSize: 12,
    fontFamily: FontFamilies.dinRounded,
    color: '#666666',
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FFF0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  completedText: {
    fontSize: 12,
    fontFamily: FontFamilies.featherBold,
    color: '#58CC02',
  },
  projectProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginRight: 8,
  },
  projectProgressBar: {
    width: '85%',
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E5E5E5',
    overflow: 'hidden',
  },
  projectProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  projectProgressText: {
    fontSize: 12,
    fontFamily: FontFamilies.dinRounded,
    color: '#666666',
    marginLeft: 8,
  },
  startProjectButton: {
    backgroundColor: '#58CC02',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 12,
    gap: 8,
  },
  startProjectButtonText: {
    color: 'white',
    fontSize: 14,
    fontFamily: FontFamilies.featherBold,
  },
});
