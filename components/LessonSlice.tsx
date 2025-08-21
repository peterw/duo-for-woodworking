import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface LessonSliceProps {
  slice: {
    id: string;
    title: string;
    description: string;
    duration: string;
    type: 'cutting' | 'assembly' | 'finishing' | 'safety' | 'planning';
    steps: string[];
    successCriteria: string[];
    photoCheckRequired: boolean;
  };
  isCompleted?: boolean;
  onComplete?: () => void;
}

export default function LessonSlice({ slice, isCompleted = false, onComplete }: LessonSliceProps) {
  const colorScheme = useColorScheme();
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'cutting': return '#FF6B6B';
      case 'assembly': return '#4ECDC4';
      case 'finishing': return '#45B7D1';
      case 'safety': return '#FFEAA7';
      case 'planning': return '#96CEB4';
      default: return Colors[colorScheme ?? 'light'].primary;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'cutting': return 'scissors';
      case 'assembly': return 'link';
      case 'finishing': return 'paintbrush.fill';
      case 'safety': return 'shield.fill';
      case 'planning': return 'pencil';
      default: return 'lightbulb.fill';
    }
  };

  const handleStepComplete = () => {
    if (currentStep < slice.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // All steps completed
      onComplete?.();
    }
  };

  const renderStep = (step: string, index: number) => {
    const isActive = index === currentStep;
    const isCompleted = index < currentStep;
    
    return (
      <View key={index} style={styles.stepContainer}>
        <View style={styles.stepHeader}>
          <View style={[
            styles.stepNumber,
            {
              backgroundColor: isCompleted 
                ? Colors[colorScheme ?? 'light'].success 
                : isActive 
                  ? getTypeColor(slice.type)
                  : Colors[colorScheme ?? 'light'].border,
            }
          ]}>
            <Text style={styles.stepNumberText}>
              {isCompleted ? '✓' : index + 1}
            </Text>
          </View>
          <Text style={[
            styles.stepText,
            {
              color: isCompleted 
                ? Colors[colorScheme ?? 'light'].success 
                : isActive 
                  ? Colors[colorScheme ?? 'light'].text
                  : Colors[colorScheme ?? 'light'].textSecondary,
              fontWeight: isActive ? '600' : '400',
            }
          ]}>
            {step}
          </Text>
        </View>
        
        {isActive && (
          <View style={styles.stepActions}>
            <TouchableOpacity
              style={[styles.stepButton, { backgroundColor: getTypeColor(slice.type) }]}
              onPress={handleStepComplete}
            >
              <Text style={styles.stepButtonText}>
                {index === slice.steps.length - 1 ? 'Complete Step' : 'Next Step'}
              </Text>
              <IconSymbol 
                name={index === slice.steps.length - 1 ? "checkmark" : "arrow.right"} 
                size={16} 
                color="white" 
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={[
      styles.container,
      {
        backgroundColor: Colors[colorScheme ?? 'light'].background,
        borderColor: isCompleted ? Colors[colorScheme ?? 'light'].success : Colors[colorScheme ?? 'light'].border,
      }
    ]}>
      <TouchableOpacity
        style={styles.header}
        onPress={() => setIsExpanded(!isExpanded)}
        activeOpacity={0.7}
      >
        <View style={styles.headerLeft}>
          <View style={[styles.typeIcon, { backgroundColor: getTypeColor(slice.type) }]}>
            <IconSymbol name={getTypeIcon(slice.type) as any} size={20} color="white" />
          </View>
          <View style={styles.headerContent}>
            <Text style={[styles.title, { color: Colors[colorScheme ?? 'light'].text }]}>
              {slice.title}
            </Text>
            <Text style={[styles.description, { color: Colors[colorScheme ?? 'light'].textSecondary }]}>
              {slice.description}
            </Text>
          </View>
        </View>
        
        <View style={styles.headerRight}>
          <View style={styles.metaInfo}>
            <IconSymbol name="clock" size={14} color={Colors[colorScheme ?? 'light'].tabIconDefault} />
            <Text style={[styles.duration, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]}>
              {slice.duration}
            </Text>
          </View>
          {slice.photoCheckRequired && (
            <View style={styles.photoCheck}>
              <IconSymbol name="camera.fill" size={14} color={Colors[colorScheme ?? 'light'].primary} />
            </View>
          )}
          <IconSymbol 
            name={isExpanded ? "chevron.up" : "chevron.down"} 
            size={20} 
            color={Colors[colorScheme ?? 'light'].tabIconDefault} 
          />
        </View>
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.content}>
          <View style={styles.stepsSection}>
            <Text style={[styles.sectionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
              Steps ({currentStep + 1} of {slice.steps.length})
            </Text>
            {slice.steps.map(renderStep)}
          </View>

          <View style={styles.successCriteriaSection}>
            <Text style={[styles.sectionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
              Success Criteria
            </Text>
            {slice.successCriteria.map((criterion, index) => (
              <View key={index} style={styles.criterionItem}>
                <IconSymbol name="checkmark.circle" size={16} color={Colors[colorScheme ?? 'light'].primary} />
                <Text style={[styles.criterionText, { color: Colors[colorScheme ?? 'light'].textSecondary }]}>
                  {criterion}
                </Text>
              </View>
            ))}
          </View>

          {slice.photoCheckRequired && (
            <View style={styles.photoCheckSection}>
              <View style={styles.photoCheckHeader}>
                <IconSymbol name="camera.fill" size={20} color={Colors[colorScheme ?? 'light'].primary} />
                <Text style={[styles.photoCheckTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
                  Photo Check Required
                </Text>
              </View>
              <Text style={[styles.photoCheckDescription, { color: Colors[colorScheme ?? 'light'].textSecondary }]}>
                Take a photo of your work to verify completion and get feedback.
              </Text>
              <TouchableOpacity style={[styles.photoButton, { backgroundColor: Colors[colorScheme ?? 'light'].primary }]}>
                <IconSymbol name="camera.fill" size={16} color="white" />
                <Text style={styles.photoButtonText}>Take Photo</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    borderWidth: 2,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  typeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  metaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  duration: {
    fontSize: 12,
    marginLeft: 4,
  },
  photoCheck: {
    marginBottom: 8,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  stepsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  stepContainer: {
    marginBottom: 16,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  stepText: {
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
  stepActions: {
    marginLeft: 40,
  },
  stepButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  stepButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 8,
  },
  successCriteriaSection: {
    marginBottom: 20,
  },
  criterionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  criterionText: {
    fontSize: 14,
    marginLeft: 8,
    lineHeight: 20,
  },
  photoCheckSection: {
    padding: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
  },
  photoCheckHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  photoCheckTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  photoCheckDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  photoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  photoButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
});
