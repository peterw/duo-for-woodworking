import LessonScreen from '@/components/LessonScreen';
import { Skill } from '@/services/skillService';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';

export default function LessonScreenRoute() {
  const params = useLocalSearchParams();


  // Helper function to safely parse JSON
  const safeJsonParse = (jsonString: string, fallback: any) => {
    try {
      return JSON.parse(jsonString);
    } catch (error) {
      console.warn('Failed to parse JSON:', jsonString, error);
      return fallback;
    }
  };

  // Helper function to safely parse integer
  const safeParseInt = (value: string, fallback: number) => {
    const parsed = parseInt(value);
    return isNaN(parsed) ? fallback : parsed;
  };

  // Parse the skill data from route parameters with safe fallbacks
  const skill: Skill = {
    id: (params.skillId as string) || '',
    title: (params.skillTitle as string) || 'Unknown Skill',
    description: (params.skillDescription as string) || '',
    icon: (params.skillIcon as string) || 'hammer',
    color: (params.skillColor as string) || '#58CC02',
    level: safeParseInt(params.skillLevel as string, 1),
    order: 0,
    xpReward: safeParseInt(params.skillXpReward as string, 0),
    prerequisites: safeJsonParse(params.skillPrerequisites as string, []),
    microSteps: safeJsonParse(params.skillMicroSteps as string, []),
    category: (params.skillCategory as any) || 'beginner',
    isUnlocked: (params.skillIsUnlocked as string) === 'true',
    isCompleted: (params.skillIsCompleted as string) === 'true',
    progress: safeParseInt(params.skillProgress as string, 0),
    crowns: safeParseInt(params.skillCrowns as string, 0),
    lessons: safeParseInt(params.skillLessons as string, 0),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Debug: Log the parsed skill

  const handleComplete = () => {
    // Navigate back to home screen
    router.back();
  };

  const handleClose = () => {
    // Navigate back to previous screen
    router.back();
  };

  return (
    <LessonScreen
      skill={skill}
      onComplete={handleComplete}
      onClose={handleClose}
    />
  );
}
