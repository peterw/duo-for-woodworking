import { IconSymbol } from '@/components/ui/IconSymbol';
import { FontFamilies } from '@/hooks/AppFonts';
import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

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

interface SkillTreeProps {
  skills: Skill[];
  onSkillPress: (skill: Skill) => void;
  onViewAllSkills: () => void;
}

export default function SkillTree({ skills, onSkillPress, onViewAllSkills }: SkillTreeProps) {
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
        {skills.map((skill, index) => (
          <View key={skill.id} style={styles.skillRow}>
            {/* Skill Circle */}
            <TouchableOpacity
              style={[
                styles.skillCircle,
                { backgroundColor: skill.color },
                skill.isLocked && styles.skillCircleLocked
              ]}
              onPress={() => onSkillPress(skill)}
              disabled={skill.isLocked}
            >
              {skill.isLocked ? (
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
                skill.isLocked && styles.skillTitleLocked
              ]}>
                {skill.title}
              </Text>
              <Text style={[
                styles.skillDescription,
                skill.isLocked && styles.skillDescriptionLocked
              ]}>
                {skill.isLocked 
                  ? `Complete "${skills[index - 1]?.title || 'previous skill'}" to unlock`
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
                {!skill.isLocked && (
                  <Text style={styles.lessonCount}>
                    {skill.lessons} {skill.lessons === 1 ? 'lesson' : 'lessons'}
                  </Text>
                )}
              </View>
            </View>
            
            {/* Progress indicator */}
            {!skill.isLocked && (
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
            {index < skills.length - 1 && (
              <View style={[
                styles.connectionLine,
                { 
                  backgroundColor: skills[index + 1].isLocked ? '#E5E5E5' : '#58CC02',
                  opacity: skills[index + 1].isLocked ? 0.3 : 1
                }
              ]} />
            )}
          </View>
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
});
