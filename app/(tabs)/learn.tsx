import { LessonCard } from '@/components/LessonCard';
import { Header } from '@/components/ui/Header';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { FontFamilies } from '@/hooks/AppFonts';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useUserProgressStore, woodworkingSkills } from '@/stores';
import React, { useState } from 'react';
import {
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

interface SkillNode {
  id: string;
  title: string;
  description: string;
  level: number;
  isUnlocked: boolean;
  isCompleted: boolean;
  icon: string;
  prerequisites: string[];
  microSteps: string[];
  xpReward: number;
  category: string;
  x: number;
  y: number;
}

export default function LearnScreen() {
  const colorScheme = useColorScheme();
  const { completedSkills, unlockSkill, completeSkill } = useUserProgressStore();
  const [selectedSkill, setSelectedSkill] = useState<SkillNode | null>(null);

  // Transform skills from store to match the UI requirements
  const uiSkills: SkillNode[] = woodworkingSkills.map((skill: any, index: number) => {
    const isUnlocked = skill.prerequisites.length === 0 || 
      skill.prerequisites.every((prereq: string) => completedSkills.includes(prereq));
    const isCompleted = completedSkills.includes(skill.id);
    
    // Calculate position based on level and category
    const level = skill.level;
    const categoryIndex = ['safety', 'tools', 'techniques', 'joinery', 'finishing', 'design'].indexOf(skill.category as any);
    
    return {
      ...skill,
      isUnlocked,
      isCompleted,
      x: (width / 4) + (categoryIndex * (width / 3)),
      y: 120 + (level * 120),
    };
  });

  const renderSkillNode = (skill: SkillNode) => {
    const isActive = skill.isUnlocked && !skill.isCompleted;
    const isCompleted = skill.isCompleted;
    const isLocked = !skill.isUnlocked;
    
    // Calculate progress for active skills
    const progress = isActive ? Math.floor(Math.random() * 80) + 20 : 0;
    
    return (
      <TouchableOpacity
        key={skill.id}
        style={[
          styles.skillNode,
          {
            left: skill.x - 60,
            top: skill.y - 40,
            backgroundColor: isCompleted 
              ? Colors[colorScheme ?? 'light'].success 
              : isActive 
                ? Colors[colorScheme ?? 'light'].primary 
                : isLocked
                  ? Colors[colorScheme ?? 'light'].tabIconDefault
                  : Colors[colorScheme ?? 'light'].border,
            borderColor: isActive ? Colors[colorScheme ?? 'light'].primary : 'transparent',
            borderWidth: isActive ? 2 : 0,
          },
        ]}
        onPress={() => {
          if (isActive) {
            setSelectedSkill(skill);
          } else if (isLocked) {
            // Show prerequisites needed
            setSelectedSkill(skill);
          }
        }}
        disabled={skill.isCompleted}
      >
        <IconSymbol 
          name={skill.icon as any} 
          size={24} 
          color={Colors[colorScheme ?? 'light'].background} 
        />
        <Text style={[
          styles.skillTitle,
          { color: Colors[colorScheme ?? 'light'].background }
        ]}>
          {skill.title}
        </Text>
        <Text style={[
          styles.skillLevel,
          { color: Colors[colorScheme ?? 'light'].background }
        ]}>
          Level {skill.level}
        </Text>
        
        {/* Progress bar for active skills */}
        {isActive && (
          <View style={styles.skillProgressBar}>
            <View style={[styles.skillProgressFill, { width: `${progress}%` }]} />
          </View>
        )}
        
        {skill.isCompleted && (
          <IconSymbol 
            name="checkmark.circle.fill" 
            size={20} 
            color={Colors[colorScheme ?? 'light'].background} 
            style={styles.completedIcon}
          />
        )}
        {isLocked && (
          <IconSymbol 
            name="lock.fill" 
            size={16} 
            color={Colors[colorScheme ?? 'light'].background} 
            style={styles.lockedIcon}
          />
        )}
      </TouchableOpacity>
    );
  };

  const renderConnections = () => {
    return uiSkills.map((skill, index) => {
      if (skill.prerequisites.length === 0) return null;
      
      // Find prerequisite skills to draw connections
      const prereqSkills = skill.prerequisites.map(prereqId => 
        uiSkills.find(s => s.id === prereqId)
      ).filter(Boolean) as SkillNode[];
      
      return prereqSkills.map((prereq, prereqIndex) => {
        const startX = prereq.x;
        const startY = prereq.y + 40;
        const endX = skill.x;
        const endY = skill.y - 40;
        
        const isUnlocked = skill.isUnlocked;
        
        return (
          <View
            key={`connection-${skill.id}-${prereq.id}`}
            style={[
              styles.connection,
              {
                left: Math.min(startX, endX),
                top: startY,
                width: Math.abs(endX - startX),
                height: Math.abs(endY - startY),
                backgroundColor: isUnlocked 
                  ? Colors[colorScheme ?? 'light'].primary 
                  : Colors[colorScheme ?? 'light'].tabIconDefault,
              },
            ]}
          />
        );
      });
    });
  };

  const renderSkillDetails = () => {
    if (!selectedSkill) return null;
    
    const isUnlocked = selectedSkill.isUnlocked;
    const isCompleted = selectedSkill.isCompleted;
    
    return (
      <View style={[styles.skillDetailsContainer, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
        <View style={styles.skillDetailsHeader}>
          <View style={[styles.skillDetailsIconContainer, { backgroundColor: Colors[colorScheme ?? 'light'].primary }]}>
            <IconSymbol name={selectedSkill.icon as any} size={32} color="white" />
          </View>
          <View style={styles.skillDetailsContent}>
            <Text style={[styles.skillDetailsTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
              {selectedSkill.title}
            </Text>
            <View style={styles.skillDetailsMeta}>
              <View style={[styles.levelBadge, { backgroundColor: Colors[colorScheme ?? 'light'].primary }]}>
                <Text style={styles.levelBadgeText}>Level {selectedSkill.level}</Text>
              </View>
              <View style={[styles.xpBadge, { backgroundColor: Colors[colorScheme ?? 'light'].success }]}>
                <Text style={styles.xpBadgeText}>+{selectedSkill.xpReward} XP</Text>
              </View>
            </View>
            <Text style={[styles.skillDetailsDescription, { color: Colors[colorScheme ?? 'light'].text }]}>
              {selectedSkill.description}
            </Text>
          </View>
        </View>
        
     
        
        {!isUnlocked && (
          <View style={styles.prerequisitesSection}>
            <Text style={[styles.sectionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
              Prerequisites Required
            </Text>
            <Text style={[styles.prerequisitesDescription, { color: Colors[colorScheme ?? 'light'].textSecondary }]}>
              Complete these skills to unlock "{selectedSkill.title}"
            </Text>
            <View style={styles.prerequisitesList}>
              {selectedSkill.prerequisites.map((prereqId: string) => {
                const prereqSkill = woodworkingSkills.find((s: any) => s.id === prereqId);
                const isCompleted = completedSkills.includes(prereqId);
                return (
                  <View key={prereqId} style={[styles.prerequisiteItem, { 
                    backgroundColor: isCompleted 
                      ? Colors[colorScheme ?? 'light'].success + '15' 
                      : Colors[colorScheme ?? 'light'].backgroundSecondary 
                  }]}>
                    <IconSymbol 
                      name={isCompleted ? "checkmark.circle.fill" : "circle"} 
                      size={20} 
                      color={isCompleted ? Colors[colorScheme ?? 'light'].success : Colors[colorScheme ?? 'light'].tabIconDefault} 
                    />
                    <Text style={[styles.prerequisiteText, { 
                      color: isCompleted 
                        ? Colors[colorScheme ?? 'light'].success 
                        : Colors[colorScheme ?? 'light'].text 
                    }]}>
                      {prereqSkill?.title || prereqId}
                    </Text>
                    {!isCompleted && (
                      <Text style={[styles.prerequisiteHint, { color: Colors[colorScheme ?? 'light'].textTertiary }]}>
                        Not started
                      </Text>
                    )}
                  </View>
                );
              })}
            </View>
          </View>
        )}
        
        {isUnlocked && !isCompleted && (
          <View style={styles.microStepsSection}>
            <Text style={[styles.sectionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
              What You'll Learn
            </Text>
            <View style={styles.microStepsList}>
              {selectedSkill.microSteps.map((step, index) => (
                <View key={index} style={styles.microStepItem}>
                  <View style={[styles.microStepNumber, { backgroundColor: Colors[colorScheme ?? 'light'].primary }]}>
                    <Text style={styles.microStepNumberText}>{index + 1}</Text>
                  </View>
                  <Text style={[styles.microStepText, { color: Colors[colorScheme ?? 'light'].text }]}>
                    {step}
                  </Text>
                </View>
              ))}
            </View>
            
            <TouchableOpacity
              style={[styles.startLearningButton, { backgroundColor: Colors[colorScheme ?? 'light'].primary }]}
              onPress={() => {
                completeSkill(selectedSkill.id);
                setSelectedSkill(null);
              }}
            >
              <Text style={styles.startLearningButtonText}>Start Learning</Text>
              <IconSymbol name="arrow.right" size={20} color="white" />
            </TouchableOpacity>
          </View>
        )}
        
        {isCompleted && (
          <View style={styles.completedSection}>
            <IconSymbol name="checkmark.circle.fill" size={60} color={Colors[colorScheme ?? 'light'].success} />
            <Text style={[styles.completedText, { color: Colors[colorScheme ?? 'light'].success }]}>
              Skill Completed!
            </Text>
            <Text style={[styles.completedSubtext, { color: Colors[colorScheme ?? 'light'].textSecondary }]}>
              You earned {selectedSkill.xpReward} XP
            </Text>
          </View>
        )}

           {/* Action Buttons Section */}
           <View style={[styles.actionButtonsSection, { borderTopColor: Colors[colorScheme ?? 'light'].border + '30' }]}>
          <View style={styles.skillDetailsActions}>

              <TouchableOpacity
                style={[styles.startButton, { backgroundColor: Colors[colorScheme ?? 'light'].primary }]}
                onPress={() => {
                  completeSkill(selectedSkill.id);
                  setSelectedSkill(null);
                }}
              >
                <IconSymbol name="play.fill" size={18} color="white" />
                <Text style={styles.startButtonText}>Start Learning</Text>
              </TouchableOpacity>

            
            <TouchableOpacity
              style={[styles.closeButton, { 
                borderColor: Colors[colorScheme ?? 'light'].border,
                backgroundColor: Colors[colorScheme ?? 'light'].backgroundSecondary
              }]}
              onPress={() => setSelectedSkill(null)}
            >
              <Text style={[styles.closeButtonText, { color: Colors[colorScheme ?? 'light'].textSecondary }]}>
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
            <StatusBar translucent backgroundColor={'transparent'} />
        <Header 
          title="Skills" 
          subtitle="Master the craft, one skill at a time"
          showSafeArea={false}
        />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
      
        
        <View style={styles.skillTree}>
          {renderConnections()}
          {uiSkills.map(renderSkillNode)}
        </View>
        
        {renderSkillDetails()}
        
        {/* Duolingo-style Lesson List */}
        <View style={[styles.lessonSection, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
          <Text style={[styles.sectionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
            Today's Lessons
          </Text>
          <Text style={[styles.sectionSubtitle, { color: Colors[colorScheme ?? 'light'].textSecondary }]}>
            Continue your woodworking journey
          </Text>
          
          <View style={styles.lessonList}>
            <LessonCard
              title="Basic Tool Safety"
              description="Learn essential safety practices for using hand tools and power tools in the workshop."
              difficulty="Beginner"
              progress={75}
              duration="15 min"
              lessonsCompleted={3}
              totalLessons={4}
              onPress={() => console.log('Basic Tool Safety pressed')}
            />
            
            <LessonCard
              title="Measuring & Marking"
              description="Master the fundamentals of accurate measurement and marking techniques."
              difficulty="Beginner"
              progress={100}
              duration="20 min"
              lessonsCompleted={5}
              totalLessons={5}
              onPress={() => console.log('Measuring & Marking pressed')}
              isCompleted={true}
            />
            
            <LessonCard
              title="Sawing Techniques"
              description="Learn proper sawing techniques for different types of cuts and materials."
              difficulty="Intermediate"
              progress={0}
              duration="25 min"
              lessonsCompleted={0}
              totalLessons={6}
              unlockRequirement="Complete 'Basic Tool Safety' and 'Measuring & Marking' to unlock"
              onPress={() => console.log('Sawing Techniques pressed')}
              isLocked={true}
            />
            
            <LessonCard
              title="Joinery Basics"
              description="Explore fundamental woodworking joints and their applications."
              difficulty="Intermediate"
              progress={45}
              duration="30 min"
              lessonsCompleted={2}
              totalLessons={8}
              onPress={() => console.log('Joinery Basics pressed')}
            />
          </View>
        </View>
        
        <View style={styles.progressSection}>
          <Text style={[styles.sectionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
            Your Progress
          </Text>
          <View style={[styles.progressBar, { backgroundColor: Colors[colorScheme ?? 'light'].border }]}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  width: `${(completedSkills.length / woodworkingSkills.length) * 100}%`,
                  backgroundColor: Colors[colorScheme ?? 'light'].primary,
                }
              ]} 
            />
          </View>
          <Text style={[styles.progressText, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]}>
            {completedSkills.length} of {woodworkingSkills.length} skills completed
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 10, // Add top padding to account for fixed header with safe area
    paddingBottom: 100,
  },
  skillTree: {
    position: 'relative',
    height: 600,
    marginHorizontal: 20,
  },
  skillNode: {
    position: 'absolute',
    width: 120,
    height: 80,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  skillTitle: {
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 12,
  },
  skillLevel: {
    fontSize: 8,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 2,
    color: '#666',
  },
  completedIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  lockedIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  connection: {
    position: 'absolute',
    backgroundColor: '#ccc',
  },
  skillDetailsContainer: {
    marginHorizontal: 20,
    marginTop: 20,
    padding: 24,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  skillDetailsHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  skillDetailsIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  skillDetailsContent: {
    flex: 1,
  },
  skillDetailsTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    lineHeight: 28,
  },
  skillDetailsMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  levelBadge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginRight: 12,
  },
  levelBadgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  xpBadge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  xpBadgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  skillDetailsDescription: {
    fontSize: 16,
    lineHeight: 24,

    opacity: 0.9,
  },
  skillDetailsActions: {
    flexDirection: 'row',
    gap: 16,
  },
  actionButtonsSection: {
    paddingTop: 20,
    borderTopWidth: 1,
  },
  startButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  startButtonText: {
    fontSize: 17,
    fontWeight: '600',
    marginLeft: 8,
    color: 'white',
  },
  closeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  prerequisitesSection: {
    marginBottom: 28,
    paddingTop: 8,
  },
  prerequisitesDescription: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 16,
    fontStyle: 'italic',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'left',
  },
  prerequisitesList: {
    gap: 10,
  },
  prerequisiteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  prerequisiteText: {
    fontSize: 15,
    marginLeft: 12,
    flex: 1,
    fontWeight: '500',
  },
  prerequisiteHint: {
    fontSize: 12,
    marginLeft: 12,
    fontStyle: 'italic',
    marginTop: 2,
  },
  microStepsSection: {
    marginBottom: 28,
    paddingTop: 8,
  },
  microStepsList: {
    gap: 16,
    marginBottom: 24,
  },
  microStepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  microStepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  microStepNumberText: {
    fontSize: 14,
    fontWeight: '700',
    color: 'white',
  },
  microStepText: {
    fontSize: 15,
    lineHeight: 22,
    flex: 1,
    fontWeight: '500',
  },
  startLearningButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 28,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  startLearningButtonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: '600',
    marginRight: 10,
  },
  completedSection: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingTop: 8,
  },
  completedText: {
    fontSize: 22,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  completedSubtext: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.8,
  },
  lessonSection: {
    marginHorizontal: 20,
    marginTop: 30,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionSubtitle: {
    fontFamily: FontFamilies.dinRounded,
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
  lessonList: {
    gap: 16,
  },
  progressSection: {
    marginHorizontal: 20,
    marginTop: 30,
    padding: 20,
    borderRadius: 16,
    backgroundColor: '#f8f9fa',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  progressBar: {
    height: 12,
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    borderRadius: 6,
  },
  progressText: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
  skillProgressBar: {
    width: '80%',
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    marginTop: 4,
    overflow: 'hidden',
  },
  skillProgressFill: {
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 2,
  },
});
