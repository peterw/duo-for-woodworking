import { IconSymbol } from '@/components/ui/IconSymbol';
import { FontFamilies } from '@/hooks/AppFonts';
import { Skill, skillService } from '@/services/skillService';
import { useAuthStore } from '@/stores/authStore';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

interface SkillTreeProps {
  skills: Skill[];
  onSkillPress: (skill: Skill) => void;
  onViewAllSkills: () => void;
  onRefresh?: () => void;
}

export default function SkillTree({ skills, onSkillPress, onViewAllSkills, onRefresh }: SkillTreeProps) {
  const { firebaseUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [dynamicSkills, setDynamicSkills] = useState<Skill[]>(skills);

  useEffect(() => {
    if (firebaseUser?.uid) {
      loadSkillsWithProgress();
    } else {
      setDynamicSkills(skills);
    }
  }, [firebaseUser?.uid, skills]);

  const loadSkillsWithProgress = async () => {
    if (!firebaseUser?.uid) return;
    
    setIsLoading(true);
    try {
      const skillsWithProgress = await skillService.getSkillsWithProgress(firebaseUser.uid);
      setDynamicSkills(skillsWithProgress.slice(0, 6)); // Show first 6 skills
    } catch (error) {
      console.error('Error loading skills with progress:', error);
      setDynamicSkills(skills); // Fallback to static skills
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkillPress = async (skill: Skill) => {
    if (!skill.isUnlocked) {
      Alert.alert('Skill Locked', 'Complete previous skills to unlock this one!');
      return;
    }

    if (!firebaseUser?.uid) {
      Alert.alert('Authentication Required', 'Please log in to access skills.');
      return;
    }

    try {
      // Start the skill if not already started
      await skillService.startSkill(skill.id, firebaseUser.uid);
      
      // Call the parent handler first
      onSkillPress(skill);
    } catch (error) {
      console.error('Error starting skill:', error);
      Alert.alert('Error', 'Failed to start skill. Please try again.');
    }
  };

  const handleRefresh = async () => {
    if (onRefresh) {
      onRefresh();
    } else {
      await loadSkillsWithProgress();
    }
  };

  if (isLoading) {
    return (
      <View style={styles.skillTreeContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Woodworking Path</Text>
          <TouchableOpacity onPress={onViewAllSkills}>
            <Text style={styles.viewAllButton}>View All</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#58CC02" />
          <Text style={styles.loadingText}>Loading your progress...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.skillTreeContainer}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          Woodworking Path
        </Text>
        <TouchableOpacity onPress={onViewAllSkills}>
          <Text style={styles.viewAllButton}>View All</Text>
        </TouchableOpacity>
      </View>
      
      {/* Duolingo-style skill tree */}
      <View style={styles.skillTree}>
        {dynamicSkills.map((skill, index) => (
          <TouchableOpacity key={skill.id} style={styles.skillRow} onPress={() => handleSkillPress(skill)} disabled={!skill.isUnlocked}>
            {/* Skill Circle */}
            <TouchableOpacity
              style={[
                styles.skillCircle,
                { backgroundColor: skill.color },
                !skill.isUnlocked && styles.skillCircleLocked
              ]}
             
            >
              {!skill.isUnlocked ? (
                <View style={styles.lockedIconContainer}>
                  <IconSymbol name="lock.fill" size={20} color="#999999" />
                </View>
              ) : skill.isCompleted ? (
                <IconSymbol name="checkmark" size={24} color="white" />
              ) : (
                <IconSymbol name={skill.icon as any} size={24} color="white" />
              )}
            </TouchableOpacity>
            
            {/* Skill Info */}
            <View style={styles.skillInfo}>
              <Text style={[
                styles.skillTitle,
                !skill.isUnlocked && styles.skillTitleLocked
              ]}>
                {skill.title}
              </Text>
              <Text style={[
                styles.skillDescription,
                !skill.isUnlocked && styles.skillDescriptionLocked
              ]}>
                {!skill.isUnlocked 
                  ? `Complete "${dynamicSkills[index - 1]?.title || 'previous skill'}" to unlock`
                  : skill.description
                }
              </Text>
              
              {/* Skill details */}
              <View style={styles.skillDetails}>
                <View style={styles.crownsContainer}>
                  {[1, 2, 3, 4, 5].map((crown) => (
                    <IconSymbol
                      key={crown}
                      name={skill.crowns >= crown ? "crown.fill" : "crown"}
                      size={16}
                      color={skill.crowns >= crown ? "#FFD700" : "#E5E5E5"}
                      style={styles.crownIcon}
                    />
                  ))}
                </View>
                {skill.isUnlocked && (
                  <Text style={styles.lessonCount}>
                    {skill.lessons} {skill.lessons === 1 ? 'lesson' : 'lessons'}
                  </Text>
                )}
              </View>
            </View>
            
            {/* Progress indicator */}
            {skill.isUnlocked && (
              <View style={styles.skillProgress}>
                <View style={styles.progressBarSmall}>
                  <View 
                    style={[
                      styles.progressFillSmall,
                      { 
                        width: `${skill.progress}%`,
                        backgroundColor: skill.color
                      }
                    ]} 
                  />
                </View>
                <Text style={styles.progressTextSmall}>{skill.progress}%</Text>
              </View>
            )}
            
            {/* Connection line to next skill */}
            {index < dynamicSkills.length - 1 && (
              <View style={[
                styles.connectionLine,
                { 
                  backgroundColor: !dynamicSkills[index + 1].isUnlocked ? '#E5E5E5' : '#58CC02',
                  opacity: !dynamicSkills[index + 1].isUnlocked ? 0.3 : 1
                }
              ]} />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  skillTreeContainer: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
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
  skillTree: {
    paddingHorizontal: 20,
  },
  skillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 28,
    position: 'relative',
    paddingVertical: 8,
  },
  skillCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  skillCircleLocked: {
    backgroundColor: '#F5F5F5',
    borderWidth: 2,
    borderColor: '#E5E5E5',
  },
  lockedIconContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  skillInfo: {
    flex: 1,
    paddingRight: 16,
  },
  skillTitle: {
    fontSize: 18,
    fontFamily: FontFamilies.featherBold,
    marginBottom: 6,
    color: '#000000',
    lineHeight: 22,
  },
  skillTitleLocked: {
    color: '#999999',
  },
  skillDescription: {
    fontSize: 15,
    fontFamily: FontFamilies.dinRounded,
    marginBottom: 12,
    color: '#666666',
    lineHeight: 20,
  },
  skillDescriptionLocked: {
    color: '#999999',
    fontStyle: 'italic',
    fontWeight: '500',
  },
  skillDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  crownsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lessonCount: {
    fontSize: 12,
    fontFamily: FontFamilies.dinRounded,
    color: '#58CC02',
    fontWeight: '500',
  },
  crownIcon: {
    marginRight: 2,
  },
  skillProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  progressBarSmall: {
    width: 60,
    height: 6,
    backgroundColor: '#E5E5E5',
    borderRadius: 3,
    marginRight: 8,
    overflow: 'hidden',
  },
  progressFillSmall: {
    height: '100%',
    borderRadius: 3,
  },
  progressTextSmall: {
    fontSize: 12,
    fontFamily: FontFamilies.dinRounded,
    color: '#666666',
    minWidth: 30,
  },
  connectionLine: {
    position: 'absolute',
    left: 29,
    top: 60,
    width: 2,
    height: 28,
    backgroundColor: '#58CC02',
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    fontFamily: FontFamilies.dinRounded,
    color: '#666666',
  },
});
