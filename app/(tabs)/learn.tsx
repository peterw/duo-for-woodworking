import { Header } from '@/components/ui/Header';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { FontFamilies } from '@/hooks/AppFonts';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useUserProgressStore } from '@/stores';

import React, { useState } from 'react';
import {
  Alert,
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

export default function LearnScreen() {
  const colorScheme = useColorScheme();
  const { completedSkills, completeSkill } = useUserProgressStore();
  const [selectedLesson, setSelectedLesson] = useState<any>(null);
  const [showLessonContent, setShowLessonContent] = useState(false);
  const [currentLesson, setCurrentLesson] = useState<any>(null);
  const [lessonProgress, setLessonProgress] = useState(0);

  // Duolingo-style lesson data with proper state management
  const lessons = [
    {
      id: 'start',
      title: 'START',
      type: 'start',
      isCompleted: completedSkills.includes('start'),
      isUnlocked: true,
      icon: 'star.fill',
      color: '#58CC02',
      xpReward: 0,
      description: 'Begin your woodworking journey',
    },
    {
      id: 'tool-safety',
      title: 'Tool Safety',
      type: 'lesson',
      isCompleted: completedSkills.includes('tool-safety'),
      isUnlocked: true,
      icon: 'hammer.fill',
      color: '#FF9600',
      xpReward: 10,
      description: 'Learn essential safety practices for using hand tools and power tools',
    },
    {
      id: 'measuring',
      title: 'Measuring',
      type: 'lesson',
      isCompleted: completedSkills.includes('measuring'),
      isUnlocked: completedSkills.includes('tool-safety'),
      icon: 'ruler.fill',
      color: '#FF9600',
      xpReward: 10,
      description: 'Master the fundamentals of accurate measurement and marking techniques',
    },
    {
      id: 'sawing',
      title: 'Sawing',
      type: 'lesson',
      isCompleted: completedSkills.includes('sawing'),
      isUnlocked: completedSkills.includes('measuring'),
      icon: 'scissors',
      color: '#FF9600',
      xpReward: 15,
      description: 'Learn proper sawing techniques for different types of cuts and materials',
    },
    {
      id: 'chest-1',
      title: 'Chest',
      type: 'chest',
      isCompleted: completedSkills.includes('chest-1'),
      isUnlocked: completedSkills.includes('sawing'),
      icon: 'shippingbox.fill',
      color: '#FF4B4B',
      xpReward: 25,
      description: 'Collect your rewards for completing the first section',
    },
    {
      id: 'joinery',
      title: 'Joinery',
      type: 'lesson',
      isCompleted: completedSkills.includes('joinery'),
      isUnlocked: completedSkills.includes('chest-1'),
      icon: 'square.stack.3d.up.fill',
      color: '#FF9600',
      xpReward: 20,
      description: 'Explore fundamental woodworking joints and their applications',
    },
    {
      id: 'character-1',
      title: 'Owl Master',
      type: 'character',
      isCompleted: completedSkills.includes('character-1'),
      isUnlocked: completedSkills.includes('joinery'),
      icon: 'person.fill',
      color: '#1CB0F6',
      xpReward: 0,
      description: 'Meet your woodworking mentor and unlock new techniques',
    },
    {
      id: 'finishing',
      title: 'Finishing',
      type: 'lesson',
      isCompleted: completedSkills.includes('finishing'),
      isUnlocked: completedSkills.includes('character-1'),
      icon: 'paintbrush.fill',
      color: '#FF9600',
      xpReward: 25,
      description: 'Learn wood finishing techniques and surface preparation',
    },
  ];

  // Lesson content data
  const lessonContent = {
    'start': {
      title: 'Welcome to Woodworking!',
      steps: [
        'Welcome to your woodworking journey!',
        'Learn the basics of working with wood',
        'Understand safety first approach',
        'Get familiar with essential tools'
      ],
      questions: [
        {
          question: 'What is the most important aspect of woodworking?',
          options: ['Speed', 'Safety', 'Cost', 'Tools'],
          correct: 1
        }
      ]
    },
    'tool-safety': {
      title: 'Tool Safety Fundamentals',
      steps: [
        'Always wear safety glasses',
        'Keep tools sharp and clean',
        'Use proper grip and stance',
        'Never rush your work'
      ],
      questions: [
        {
          question: 'When should you wear safety glasses?',
          options: ['Only when cutting', 'Always in the workshop', 'Never', 'Only with power tools'],
          correct: 1
        }
      ]
    },
    'measuring': {
      title: 'Precision Measuring',
      steps: [
        'Use the right measuring tool',
        'Measure twice, cut once',
        'Mark clearly with pencil',
        'Check your measurements'
      ],
      questions: [
        {
          question: 'What is the golden rule of measuring?',
          options: ['Measure once', 'Measure twice, cut once', 'Guess and check', 'Use any tool'],
          correct: 1
        }
      ]
    },
    'sawing': {
      title: 'Sawing Techniques',
      steps: [
        'Choose the right saw for the job',
        'Mark your cut line clearly',
        'Use proper sawing motion',
        'Support your workpiece properly'
      ],
      questions: [
        {
          question: 'What should you do before making a cut?',
          options: ['Start cutting immediately', 'Mark the cut line', 'Use any saw', 'Cut freehand'],
          correct: 1
        }
      ]
    },
    'chest-1': {
      title: 'Reward Chest!',
      steps: [
        'Congratulations on completing the first section!',
        'You earned 25 XP points',
        'Unlock new tools and techniques',
        'Ready for the next challenge!'
      ],
      questions: []
    },
    'joinery': {
      title: 'Basic Joinery',
      steps: [
        'Learn about different joint types',
        'Practice making simple joints',
        'Understand wood grain direction',
        'Master the basics of gluing'
      ],
      questions: [
        {
          question: 'What is the strongest type of joint?',
          options: ['Butt joint', 'Dado joint', 'Dovetail joint', 'Lap joint'],
          correct: 2
        }
      ]
    },
    'character-1': {
      title: 'Meet Owl Master',
      steps: [
        'Welcome to advanced techniques!',
        'Owl Master will guide you',
        'Learn professional tips and tricks',
        'Unlock the master craftsman path'
      ],
      questions: []
    },
    'finishing': {
      title: 'Wood Finishing Techniques',
      steps: [
        'Prepare the wood surface properly',
        'Choose the right finish for your project',
        'Apply stain evenly and consistently',
        'Protect with clear coat or varnish'
      ],
      questions: [
        {
          question: 'What is the first step in wood finishing?',
          options: ['Apply stain', 'Sand the surface', 'Apply varnish', 'Choose color'],
          correct: 1
        }
      ]
    },
  };

  const handleStartLesson = (lesson: any) => {
    console.log('Starting lesson:', lesson.title);
    Alert.alert('Lesson Started!', `Starting ${lesson.title} lesson`);
    setCurrentLesson(lesson);
    setLessonProgress(0);
    setShowLessonContent(true);
    setSelectedLesson(null);
  };

  const handleLessonComplete = () => {
    if (currentLesson) {
      completeSkill(currentLesson.id);
      Alert.alert(
        'Lesson Completed! 🎉',
        `You earned ${currentLesson.xpReward} XP points!`,
        [
          {
            text: 'Continue',
            onPress: () => {
              setShowLessonContent(false);
              setCurrentLesson(null);
              setLessonProgress(0);
            }
          }
        ]
      );
    }
  };

    const renderLessonNode = (lesson: any, index: number) => {
    const isCompleted = lesson.isCompleted;
    const isUnlocked = lesson.isUnlocked;
    const isLocked = !isUnlocked;
    
    // Dynamic pattern: Center → Left → Center → Right → Center → Left → Center → Right...
    const getNodePosition = (index: number) => {
      // Pattern: 0=center, 1=left, 2=center, 3=right, 4=center, 5=left, 6=center, 7=right...
      const patternIndex = index % 4;
      
      if (patternIndex === 0) {
        return { align: 'center', marginLeft: 0, marginRight: 0 }; // Center position
      } else if (patternIndex === 1) {
        return { align: 'left', marginLeft: 40, marginRight: 0 }; // Left position
      } else if (patternIndex === 2) {
        return { align: 'center', marginLeft: 0, marginRight: 0 }; // Center position
      } else {
        return { align: 'right', marginLeft: 0, marginRight: 40 }; // Right position
      }
    };
    
    const position = getNodePosition(index);
    
    return (
      <View key={lesson.id} style={[
        styles.lessonNodeContainer,
        {
          alignItems: position.align === 'left' ? 'flex-start' : position.align === 'right' ? 'flex-end' : 'center',
          marginLeft: position.marginLeft,
          marginRight: position.marginRight,
        }
      ]}>
        {/* Connection line above last item */}
        {index === lessons.length - 1 && (
          <View style={[
            styles.connectionLine,
            { 
              backgroundColor: lessons[index - 1]?.isCompleted ? '#58CC02' : '#E5E5E5',
              height: 25,
              width: 2,
              alignSelf: 'center',
              marginBottom: 5,
            }
          ]} />
        )}
        
        {/* Connection line to next node */}
        {index < lessons.length - 1 && (
          <View style={[
            styles.connectionLine,
            { 
              backgroundColor: isCompleted ? '#58CC02' : '#E5E5E5',
              height: 35,
              width: 2,
              alignSelf: 'center',
            }
          ]} />
        )}
        
      <TouchableOpacity
        style={[
            styles.lessonNode,
          {
            backgroundColor: isCompleted 
                ? '#58CC02' 
                : isUnlocked 
                  ? lesson.color
                  : '#E5E5E5',
              borderColor: isUnlocked ? lesson.color : '#E5E5E5',
              borderWidth: isUnlocked ? 3 : 2,
          },
        ]}
        onPress={() => {
            if (isUnlocked) {
              setSelectedLesson(lesson);
            }
          }}
          disabled={isLocked}
        >
          {lesson.type === 'start' && (
            <IconSymbol name="star.fill" size={32} color="white" />
          )}
          {lesson.type === 'lesson' && (
            <IconSymbol name={lesson.icon} size={28} color="white" />
          )}
          {lesson.type === 'chest' && (
            <IconSymbol name="shippingbox.fill" size={28} color="white" />
          )}
          {lesson.type === 'character' && (
            <IconSymbol name="person.fill" size={28} color="white" />
          )}
          
          {isCompleted && (
          <IconSymbol 
            name="checkmark.circle.fill" 
            size={20} 
              color="white" 
              style={styles.completedBadge}
          />
        )}
          
        {isLocked && (
          <IconSymbol 
            name="lock.fill" 
            size={16} 
              color="#999" 
              style={styles.lockedBadge}
          />
        )}
      </TouchableOpacity>
        
        <Text style={[
          styles.lessonTitle,
          { 
            color: isUnlocked ? '#333' : '#999',
            fontWeight: isUnlocked ? '600' : '400',
            textAlign: 'center',
          }
        ]}>
          {lesson.title}
        </Text>
      </View>
    );
  };


    
    return (
    <SafeAreaView style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
      <StatusBar translucent backgroundColor={'transparent'} />
      
      {/* Original Header Component */}
      <Header 
        title="Learn" 
        subtitle="Master woodworking skills step by step"
        showSafeArea={false}
      />
      
      {/* Duolingo-style Progress Header */}
      <View style={styles.progressHeader}>
        <View style={styles.progressHeaderContent}>
          <View style={styles.progressHeaderLeft}>
            <Text style={styles.sectionTitle}>Section 1: Beginner Woodworker</Text>
            <Text style={styles.progressText}>
              {completedSkills.length} of {lessons.length} lessons completed
            </Text>
              </View>
          <View style={styles.progressHeaderRight}>
            {/* Streak */}
            <View style={styles.headerItem}>
              <IconSymbol name="flame.fill" size={20} color="#FF4B4B" />
              <Text style={styles.headerText}>7</Text>
              </View>
            
            {/* Coins */}
            <View style={styles.headerItem}>
              <IconSymbol name="leaf.fill" size={20} color="#FFD700" />
              <Text style={styles.headerText}>1,250</Text>
            </View>
            
            {/* Lives */}
            <View style={styles.headerItem}>
              <IconSymbol name="heart.fill" size={20} color="#FF4B4B" />
              <Text style={styles.headerText}>5</Text>
          </View>
        </View>
                  </View>
            </View>
        
      {/* Main Learning Path */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.learningPath}>
          {lessons.map((lesson, index) => renderLessonNode(lesson, index))}
          </View>
        
        
      </ScrollView>
      
      {/* Lesson Details Modal - Outside ScrollView */}
      {selectedLesson && (
        <View style={styles.lessonDetailsModal}>
          <View style={styles.lessonDetailsContent}>
            <View style={styles.lessonDetailsHeader}>
              <View style={[styles.lessonDetailsIcon, { backgroundColor: selectedLesson.color }]}>
                <IconSymbol name={selectedLesson.icon} size={32} color="white" />
              </View>
              <View style={styles.lessonDetailsText}>
                <Text style={styles.lessonDetailsTitle}>{selectedLesson.title}</Text>
                <Text style={styles.lessonDetailsSubtitle}>
                  {selectedLesson.type === 'start' && 'Begin your woodworking journey'}
                  {selectedLesson.type === 'lesson' && 'Learn essential woodworking skills'}
                  {selectedLesson.type === 'chest' && 'Collect your rewards'}
                  {selectedLesson.type === 'character' && 'Meet your woodworking mentor'}
                </Text>
              </View>
            </View>
            
            <View style={styles.lessonDetailsActions}>
              {selectedLesson.isUnlocked && !selectedLesson.isCompleted && (
                <TouchableOpacity
                  style={[styles.startLessonButton, { backgroundColor: selectedLesson.color }]}
                  onPress={() => handleStartLesson(selectedLesson)}
                >
                  <Text style={styles.startLessonButtonText}>
                    {selectedLesson.type === 'start' && 'Start Journey'}
                    {selectedLesson.type === 'lesson' && 'Start Lesson'}
                    {selectedLesson.type === 'chest' && 'Open Chest'}
                    {selectedLesson.type === 'character' && 'Meet Character'}
                  </Text>
                </TouchableOpacity>
              )}
              
              {selectedLesson.isCompleted && (
                <View style={[styles.completedButton, { backgroundColor: '#58CC02' }]}>
                  <IconSymbol name="checkmark.circle.fill" size={20} color="white" />
                  <Text style={styles.completedButtonText}>Completed!</Text>
                </View>
              )}
              
              {!selectedLesson.isUnlocked && (
                <View style={styles.lockedButton}>
                  <IconSymbol name="lock.fill" size={20} color="#999" />
                  <Text style={styles.lockedButtonText}>Complete previous lessons to unlock</Text>
                </View>
              )}
              
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setSelectedLesson(null)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
      
      {/* Lesson Content Modal - Outside ScrollView */}
      {showLessonContent && currentLesson && (
        <View style={styles.lessonContentModal}>
          <View style={styles.lessonContentContainer}>
            <View style={styles.lessonContentHeader}>
              <View style={[styles.lessonContentIcon, { backgroundColor: currentLesson.color }]}>
                <IconSymbol name={currentLesson.icon} size={32} color="white" />
        </View>
              <View style={styles.lessonContentTitleContainer}>
                <Text style={styles.lessonContentTitle}>
                  {lessonContent[currentLesson.id as keyof typeof lessonContent]?.title || currentLesson.title}
          </Text>
                <Text style={styles.lessonContentSubtitle}>
                  Step {lessonProgress + 1} of {lessonContent[currentLesson.id as keyof typeof lessonContent]?.steps.length || 1}
          </Text>
          </View>
              <TouchableOpacity
                style={styles.closeContentButton}
                onPress={() => {
                  setShowLessonContent(false);
                  setCurrentLesson(null);
                  setLessonProgress(0);
                }}
              >
                <IconSymbol name="xmark" size={20} color="#666" />
              </TouchableOpacity>
        </View>
        
            <ScrollView style={styles.lessonContentBody}>
              <View style={styles.lessonStepContainer}>
                <Text style={styles.lessonStepText}>
                  {lessonContent[currentLesson.id as keyof typeof lessonContent]?.steps[lessonProgress] || 'Loading...'}
          </Text>
              </View>
              
              {/* Progress Bar */}
              <View style={styles.lessonProgressContainer}>
                <View style={styles.lessonProgressBar}>
            <View 
              style={[
                      styles.lessonProgressFill, 
                { 
                        width: `${((lessonProgress + 1) / (lessonContent[currentLesson.id as keyof typeof lessonContent]?.steps.length || 1)) * 100}%`,
                        backgroundColor: currentLesson.color,
                }
              ]} 
            />
          </View>
                <Text style={styles.lessonProgressText}>
                  {lessonProgress + 1} / {lessonContent[currentLesson.id as keyof typeof lessonContent]?.steps.length || 1}
          </Text>
        </View>
      </ScrollView>
            
            <View style={styles.lessonContentActions}>
              {lessonProgress < (lessonContent[currentLesson.id as keyof typeof lessonContent]?.steps.length || 1) - 1 ? (
                <TouchableOpacity
                  style={[styles.nextStepButton, { backgroundColor: currentLesson.color }]}
                  onPress={() => setLessonProgress(lessonProgress + 1)}
                >
                  <Text style={styles.nextStepButtonText}>Next Step</Text>
                  <IconSymbol name="arrow.right" size={20} color="white" />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[styles.completeLessonButton, { backgroundColor: '#58CC02' }]}
                  onPress={handleLessonComplete}
                >
                  <Text style={styles.completeLessonButtonText}>Complete Lesson</Text>
                  <IconSymbol name="checkmark.circle.fill" size={20} color="white" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      )}

            {/* Bottom Navigation */}
      <View style={styles.bottomNavigation}>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => console.log('Navigate to Home')}
        >
          <IconSymbol name="house.fill" size={24} color="#58CC02" />
          <Text style={[styles.navText, { color: '#58CC02' }]}>Home</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => console.log('Navigate to Tools')}
        >
          <IconSymbol name="hammer.fill" size={24} color="#999" />
          <Text style={styles.navText}>Tools</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => console.log('Navigate to Community')}
        >
          <IconSymbol name="person.2.fill" size={24} color="#999" />
          <Text style={styles.navText}>Community</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => console.log('Navigate to Rewards')}
        >
          <IconSymbol name="shippingbox.fill" size={24} color="#999" />
          <Text style={styles.navText}>Rewards</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => console.log('Navigate to Notifications')}
        >
          <IconSymbol name="bell.fill" size={24} color="#999" />
          <Text style={styles.navText}>Notifications</Text>
        </TouchableOpacity>
        </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  
  // Progress Header Styles
  progressHeader: {
    backgroundColor: '#58CC02',
    paddingTop: 10,
    paddingBottom: 15,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  progressHeaderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressHeaderLeft: {
    flex: 1,
  },
  progressHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  headerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  headerText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  sectionTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
    fontFamily: FontFamilies.dinRounded,
  },
  progressText: {
    color: 'white',
    fontSize: 14,
    opacity: 0.9,
    marginTop: 2,
  },
  
  // Scroll View
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  
  // Learning Path
  learningPath: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    flex: 1,
    alignItems: 'center',
  },
  lessonNodeContainer: {
    marginBottom: 15,
    minHeight: 140,
    justifyContent: 'center',
    width: '100%',
    maxWidth: 300,
    paddingVertical: 10,
  },
  connectionLine: {
    marginBottom: 15,
    borderRadius: 1,
    alignSelf: 'center',
  },
  lessonNode: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    position: 'relative',
  },
  lessonTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
    fontFamily: FontFamilies.dinRounded,
    maxWidth: 100,
    lineHeight: 18,
    textAlign: 'center',

  },
  completedBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
  },
  lockedBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
  },
  
  // Lesson Details Modal
  lessonDetailsModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  lessonDetailsContent: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
    width: width - 40,
  },
  lessonDetailsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  lessonDetailsIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  lessonDetailsText: {
    flex: 1,
  },
  lessonDetailsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
    fontFamily: FontFamilies.dinRounded,
  },
  lessonDetailsSubtitle: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  lessonDetailsActions: {
    gap: 12,
  },
  startLessonButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  startLessonButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: FontFamilies.dinRounded,
  },
  closeButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
  },
  closeButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: FontFamilies.dinRounded,
  },
  completedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    gap: 8,
  },
  completedButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: FontFamilies.dinRounded,
  },
  lockedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    backgroundColor: '#F0F0F0',
    gap: 8,
  },
  lockedButtonText: {
    color: '#999',
    fontSize: 14,
    fontWeight: '500',
    fontFamily: FontFamilies.dinRounded,
    textAlign: 'center',
  },
  
  // Bottom Navigation
  bottomNavigation: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  navText: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
    color: '#999',
    fontFamily: FontFamilies.dinRounded,
  },
  
  // Lesson Content Modal Styles
  lessonContentModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
    elevation: 10,
  },
  lessonContentContainer: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
    width: width - 40,
    maxHeight: '80%',
  },
  lessonContentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  lessonContentIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  lessonContentTitleContainer: {
    flex: 1,
  },
  lessonContentTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
    fontFamily: FontFamilies.dinRounded,
  },
  lessonContentSubtitle: {
    fontSize: 14,
    color: '#666',
    fontFamily: FontFamilies.dinRounded,
  },
  closeContentButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lessonContentBody: {
    flex: 1,
    marginBottom: 24,
  },
  lessonStepContainer: {
    backgroundColor: '#F8F9FA',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
  },
  lessonStepText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    textAlign: 'center',
    fontFamily: FontFamilies.dinRounded,
  },
  lessonProgressContainer: {
    alignItems: 'center',
  },
  lessonProgressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#E5E5E5',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  lessonProgressFill: {
    height: '100%',
    borderRadius: 4,
  },
  lessonProgressText: {
    fontSize: 14,
    color: '#666',
    fontFamily: FontFamilies.dinRounded,
  },
  lessonContentActions: {
    gap: 12,
  },
  nextStepButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  nextStepButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: FontFamilies.dinRounded,
  },
  completeLessonButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  completeLessonButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: FontFamilies.dinRounded,
  },
});
