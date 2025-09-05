import firestore from '@react-native-firebase/firestore';

export interface Skill {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  level: number;
  order: number;
  xpReward: number;
  prerequisites: string[];
  microSteps: MicroStep[];
  category: 'safety' | 'tools' | 'techniques' | 'joinery' | 'finishing' | 'design';
  isUnlocked: boolean;
  isCompleted: boolean;
  progress: number; // 0-100
  crowns: number; // 0-5 like Duolingo
  lessons: number;
  createdAt: string;
  updatedAt: string;
}

export interface MicroStep {
  id: string;
  title: string;
  description: string;
  type: 'lesson' | 'quiz' | 'practice';
  order: number;
  isCompleted: boolean;
  xpReward: number;
  content: {
    text?: string;
    images?: string[];
    videos?: string[];
    instructions?: string[];
  };
  quiz?: {
    questions: QuizQuestion[];
    passingScore: number; // percentage
  };
}

export interface QuizQuestion {
  id: string;
  question: string;
  type: 'multiple-choice' | 'true-false' | 'fill-in-blank';
  options?: string[];
  correctAnswer: string | number;
  explanation: string;
  points: number;
}

export interface UserSkillProgress {
  skillId: string;
  userId: string;
  isCompleted: boolean;
  progress: number; // 0-100
  completedMicroSteps: string[];
  currentMicroStep: string;
  crowns: number;
  xpEarned: number;
  lastAccessed: string;
  completedAt?: string;
  quizAttempts: QuizAttempt[];
}

export interface QuizAttempt {
  id: string;
  microStepId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  completedAt: string;
  answers: { questionId: string; answer: string | number; isCorrect: boolean }[];
}

// Get skills collection reference
const getSkillsCollection = () => firestore().collection('skills');

// Get user skill progress collection reference
const getUserSkillProgressCollection = (userId: string) => 
  firestore().collection('users').doc(userId).collection('skillProgress');

// Get all skills with user progress
export const getSkillsWithProgress = async (userId: string): Promise<Skill[]> => {
  try {
    const [skillsSnapshot, userProgressSnapshot] = await Promise.all([
      getSkillsCollection().orderBy('order').get(),
      getUserSkillProgressCollection(userId).get()
    ]);

    const skills = skillsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Skill[];
    const userProgress = userProgressSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        skillId: data.skillId || '',
        userId: data.userId || '',
        isCompleted: data.isCompleted || false,
        progress: data.progress || 0,
        completedMicroSteps: data.completedMicroSteps || [],
        currentMicroStep: data.currentMicroStep || '',
        crowns: data.crowns || 0,
        xpEarned: data.xpEarned || 0,
        lastAccessed: data.lastAccessed || '',
        completedAt: data.completedAt,
        quizAttempts: data.quizAttempts || []
      } as UserSkillProgress;
    });

    // Merge skills with user progress
    return skills.map(skill => {
      const progress = userProgress.find(p => p.skillId === skill.id);
      
      if (progress) {
        return {
          ...skill,
          isCompleted: progress.isCompleted,
          progress: progress.progress,
          crowns: progress.crowns,
          isUnlocked: true, // If user has progress, it's unlocked
        };
      }

      // Check if skill should be unlocked based on prerequisites
      const isUnlocked = checkSkillUnlockStatus(skill, userProgress);
      
      return {
        ...skill,
        isCompleted: false,
        progress: 0,
        crowns: 0,
        isUnlocked,
      };
    });
  } catch (error) {
    console.error('Error fetching skills with progress:', error);
    return [];
  }
};

// Check if a skill should be unlocked based on prerequisites
const checkSkillUnlockStatus = (skill: Skill, userProgress: UserSkillProgress[]): boolean => {
  if (skill.prerequisites.length === 0) {
    return true; // First skill is always unlocked
  }

  const result = skill.prerequisites.every(prereqId => {
    const prereqProgress = userProgress.find(p => p.skillId === prereqId);
    const isCompleted = prereqProgress?.isCompleted || false;
    return isCompleted;
  });
  return result;
};

// Get a specific skill with user progress
export const getSkillWithProgress = async (skillId: string, userId: string): Promise<Skill | null> => {
  try {
    const [skillDoc, progressDoc] = await Promise.all([
      getSkillsCollection().doc(skillId).get(),
      getUserSkillProgressCollection(userId).doc(skillId).get()
    ]);

    if (!skillDoc.exists()) {
      return null;
    }

    const skill = { id: skillDoc.id, ...skillDoc.data() } as Skill;
    const progress = progressDoc.exists() ? (() => {
      const data = progressDoc.data();
      return {
        id: progressDoc.id,
        skillId: data?.skillId || '',
        userId: data?.userId || '',
        isCompleted: data?.isCompleted || false,
        progress: data?.progress || 0,
        completedMicroSteps: data?.completedMicroSteps || [],
        currentMicroStep: data?.currentMicroStep || '',
        crowns: data?.crowns || 0,
        xpEarned: data?.xpEarned || 0,
        lastAccessed: data?.lastAccessed || '',
        completedAt: data?.completedAt,
        quizAttempts: data?.quizAttempts || []
      } as UserSkillProgress;
    })() : null;

    if (progress) {
      return {
        ...skill,
        isCompleted: progress.isCompleted,
        progress: progress.progress,
        crowns: progress.crowns,
        isUnlocked: true,
      };
    }

    // Check unlock status
    const allSkills = await getSkillsWithProgress(userId);
    const isUnlocked = checkSkillUnlockStatus(skill, allSkills.map(s => ({
      skillId: s.id,
      isCompleted: s.isCompleted,
    } as UserSkillProgress)));

    return {
      ...skill,
      isCompleted: false,
      progress: 0,
      crowns: 0,
      isUnlocked,
    };
  } catch (error) {
    console.error('Error fetching skill with progress:', error);
    return null;
  }
};

// Start a skill (unlock and initialize progress)
export const startSkill = async (skillId: string, userId: string): Promise<void> => {
  try {
    const skillDoc = await getSkillsCollection().doc(skillId).get();
    if (!skillDoc.exists()) {
      throw new Error('Skill not found');
    }

    const skill = { id: skillDoc.id, ...skillDoc.data() } as Skill;
    
    // Check if skill can be unlocked
    const allSkills = await getSkillsWithProgress(userId);
    const isUnlocked = checkSkillUnlockStatus(skill, allSkills.map(s => ({
      skillId: s.id,
      isCompleted: s.isCompleted,
    } as UserSkillProgress)));

    if (!isUnlocked) {
      throw new Error('Skill prerequisites not met');
    }

    // Check if progress already exists
    const existingProgressDoc = await getUserSkillProgressCollection(userId).doc(skillId).get();
    
    if (!existingProgressDoc.exists()) {
      // Only initialize progress if it doesn't exist
      const progressData: UserSkillProgress = {
        skillId,
        userId,
        isCompleted: false,
        progress: 0,
        completedMicroSteps: [],
        currentMicroStep: skill.microSteps[0]?.id || '',
        crowns: 0,
        xpEarned: 0,
        lastAccessed: new Date().toISOString(),
        quizAttempts: [],
      };

      await getUserSkillProgressCollection(userId).doc(skillId).set(progressData);
    } else {
      // Just update lastAccessed for existing progress
      await getUserSkillProgressCollection(userId).doc(skillId).update({
        lastAccessed: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error('Error starting skill:', error);
    throw error;
  }
};

// Complete a micro step
export const completeMicroStep = async (
  skillId: string, 
  microStepId: string, 
  userId: string,
  quizScore?: number
): Promise<void> => {
  try {
    const progressRef = getUserSkillProgressCollection(userId).doc(skillId);
    const progressDoc = await progressRef.get();
    
    if (!progressDoc.exists()) {
      throw new Error('Skill progress not found');
    }

    const data = progressDoc.data();
    const progress = {
      id: progressDoc.id,
      skillId: data?.skillId || '',
      userId: data?.userId || '',
      isCompleted: data?.isCompleted || false,
      progress: data?.progress || 0,
      completedMicroSteps: data?.completedMicroSteps || [],
      currentMicroStep: data?.currentMicroStep || '',
      crowns: data?.crowns || 0,
      xpEarned: data?.xpEarned || 0,
      lastAccessed: data?.lastAccessed || new Date().toISOString(),
      completedAt: data?.completedAt || '',
      quizAttempts: data?.quizAttempts || []
    } as UserSkillProgress;
    
    // Check if micro step is already completed
    if (progress.completedMicroSteps.includes(microStepId)) {
      return; // Already completed
    }

    // Get skill data to calculate XP
    const skillDoc = await getSkillsCollection().doc(skillId).get();
    const skill = { id: skillDoc.id, ...skillDoc.data() } as Skill;
    const microStep = skill.microSteps.find(ms => ms.id === microStepId);
    
    if (!microStep) {
      throw new Error('Micro step not found');
    }

    // Calculate XP based on quiz score if applicable
    let xpEarned = microStep.xpReward;
    if (microStep.type === 'quiz' && quizScore !== undefined) {
      const passingScore = microStep.quiz?.passingScore || 70;
      if (quizScore >= passingScore) {
        xpEarned = microStep.xpReward;
      } else {
        xpEarned = Math.floor(microStep.xpReward * (quizScore / 100));
      }
    }

    // Update progress
    const updatedCompletedSteps = [...progress.completedMicroSteps, microStepId];
    const newProgress = Math.round((updatedCompletedSteps.length / skill.microSteps.length) * 100);
    const isCompleted = newProgress === 100;

    // Calculate crowns (1-5 based on completion quality)
    let newCrowns = progress.crowns;
    if (isCompleted) {
      if (quizScore !== undefined && quizScore >= 90) {
        newCrowns = Math.min(5, progress.crowns + 2);
      } else if (quizScore !== undefined && quizScore >= 70) {
        newCrowns = Math.min(5, progress.crowns + 1);
      } else {
        newCrowns = Math.min(5, progress.crowns + 1);
      }
    }

    const updatedProgress: Partial<UserSkillProgress> = {
      completedMicroSteps: updatedCompletedSteps,
      progress: newProgress,
      isCompleted,
      crowns: newCrowns,
      xpEarned: progress.xpEarned + xpEarned,
      lastAccessed: new Date().toISOString(),
    };

    // Only add completedAt if the skill is completed
    if (isCompleted) {
      updatedProgress.completedAt = new Date().toISOString();
    }

    // Set next micro step as current
    const currentStepIndex = skill.microSteps.findIndex(ms => ms.id === microStepId);
    if (currentStepIndex < skill.microSteps.length - 1) {
      updatedProgress.currentMicroStep = skill.microSteps[currentStepIndex + 1].id;
    } else {
      // If this was the last step, keep the current micro step as is
      updatedProgress.currentMicroStep = microStepId;
    }

    await progressRef.update(updatedProgress);

    // Update user's total XP and level
    await updateUserXP(userId, xpEarned);
  } catch (error) {
    console.error('Error completing micro step:', error);
    throw error;
  }
};

// Submit quiz attempt
export const submitQuizAttempt = async (
  skillId: string,
  microStepId: string,
  userId: string,
  answers: { questionId: string; answer: string | number }[]
): Promise<{ score: number; passed: boolean; correctAnswers: number; totalQuestions: number }> => {
  try {
    const skillDoc = await getSkillsCollection().doc(skillId).get();
    const skill = { id: skillDoc.id, ...skillDoc.data() } as Skill;
    const microStep = skill.microSteps.find(ms => ms.id === microStepId);
    
    if (!microStep?.quiz) {
      throw new Error('Quiz not found for this micro step');
    }

    // Calculate score
    let correctAnswers = 0;
    const totalQuestions = microStep.quiz.questions.length;
    const quizAnswers = answers.map(answer => {
      const question = microStep.quiz!.questions.find(q => q.id === answer.questionId);
      
      // Handle true-false questions with case-insensitive comparison
      let isCorrect = false;
      if (question?.type === 'true-false') {
        const normalizedAnswer = String(answer.answer).toLowerCase();
        const normalizedCorrectAnswer = String(question.correctAnswer).toLowerCase();
        isCorrect = normalizedAnswer === normalizedCorrectAnswer;
      } else {
        isCorrect = question?.correctAnswer === answer.answer;
      }
      
      if (isCorrect) correctAnswers++;
      
      return {
        ...answer,
        isCorrect,
      };
    });

    const score = Math.round((correctAnswers / totalQuestions) * 100);
    const passed = score >= (microStep.quiz.passingScore || 70);

    // Save quiz attempt
    const attemptId = `attempt_${Date.now()}`;
    const quizAttempt: QuizAttempt = {
      id: attemptId,
      microStepId,
      score,
      totalQuestions,
      correctAnswers,
      completedAt: new Date().toISOString(),
      answers: quizAnswers,
    };

    const progressRef = getUserSkillProgressCollection(userId).doc(skillId);
    await progressRef.update({
      quizAttempts: firestore.FieldValue.arrayUnion(quizAttempt),
    });

    return {
      score,
      passed,
      correctAnswers,
      totalQuestions,
    };
  } catch (error) {
    console.error('Error submitting quiz attempt:', error);
    throw error;
  }
};

// Update user XP and level
const updateUserXP = async (userId: string, xpEarned: number): Promise<void> => {
  try {
    const userRef = firestore().collection('users').doc(userId);
    await userRef.update({
      totalXP: firestore.FieldValue.increment(xpEarned),
      lastLoginAt: new Date().toISOString(),
    });

    // Update level based on total XP
    const userDoc = await userRef.get();
    const userData = userDoc.data();
    if (userData) {
      const newTotalXP = userData.totalXP;
      const newLevel = Math.floor(newTotalXP / 500) + 1;
      
      if (newLevel > userData.level) {
        await userRef.update({ level: newLevel });
      }
    }
  } catch (error) {
    console.error('Error updating user XP:', error);
    throw error;
  }
};

// Get user's skill statistics
export const getUserSkillStats = async (userId: string): Promise<{
  totalSkills: number;
  completedSkills: number;
  totalXP: number;
  totalCrowns: number;
  currentStreak: number;
}> => {
  try {
    const [skillsSnapshot, progressSnapshot, userDoc] = await Promise.all([
      getSkillsCollection().get(),
      getUserSkillProgressCollection(userId).get(),
      firestore().collection('users').doc(userId).get()
    ]);

    const totalSkills = skillsSnapshot.size;
    const completedSkills = progressSnapshot.docs.filter(doc => {
      const progress = doc.data() as UserSkillProgress;
      return progress.isCompleted;
    }).length;

    const totalXP = progressSnapshot.docs.reduce((sum, doc) => {
      const progress = doc.data() as UserSkillProgress;
      return sum + progress.xpEarned;
    }, 0);

    const totalCrowns = progressSnapshot.docs.reduce((sum, doc) => {
      const progress = doc.data() as UserSkillProgress;
      return sum + progress.crowns;
    }, 0);

    const userData = userDoc.data();
    const currentStreak = userData?.currentStreak || 0;

    return {
      totalSkills,
      completedSkills,
      totalXP,
      totalCrowns,
      currentStreak,
    };
  } catch (error) {
    console.error('Error fetching user skill stats:', error);
    return {
      totalSkills: 0,
      completedSkills: 0,
      totalXP: 0,
      totalCrowns: 0,
      currentStreak: 0,
    };
  }
};

// Reset skill progress (for testing or user request)
export const resetSkillProgress = async (skillId: string, userId: string): Promise<void> => {
  try {
    await getUserSkillProgressCollection(userId).doc(skillId).delete();
  } catch (error) {
    console.error('Error resetting skill progress:', error);
    throw error;
  }
};

// Get next recommended skill
export const getNextRecommendedSkill = async (userId: string): Promise<Skill | null> => {
  try {
    const skills = await getSkillsWithProgress(userId);
    
    // Find the first incomplete skill that's unlocked
    const nextSkill = skills.find(skill => 
      skill.isUnlocked && !skill.isCompleted
    );
    
    return nextSkill || null;
  } catch (error) {
    console.error('Error getting next recommended skill:', error);
    return null;
  }
};

// Helper function to fix prerequisite IDs
export const fixPrerequisiteIds = async (userId: string): Promise<void> => {
  try {
    // Get raw skills from Firestore (not processed with user progress)
    const skillsSnapshot = await getSkillsCollection().orderBy('order').get();
    const skills = skillsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Skill[];
    
    // Create a mapping of skill titles to IDs
    const skillIdMap: { [title: string]: string } = {};
    skills.forEach(skill => {
      skillIdMap[skill.title] = skill.id;
    });
    
    // Update prerequisites for each skill
    for (const skill of skills) {
      if (skill.prerequisites.length > 0) {
        const updatedPrerequisites = skill.prerequisites.map(prereq => {
          // Map old prerequisite names to actual skill IDs
          const mapping: { [key: string]: string } = {
            'safety-basics': skillIdMap['Safety Fundamentals'] || prereq,
            'measuring-marking': skillIdMap['Measuring & Marking'] || prereq,
            'hand-sawing': skillIdMap['Hand Sawing'] || prereq,
            'chiseling': skillIdMap['Chiseling Basics'] || prereq,
            'basic-joinery': skillIdMap['Basic Joinery'] || prereq,
            'sanding-finishing': skillIdMap['Sanding & Finishing'] || prereq,
          };
          
          return mapping[prereq] || prereq;
        });
        
        // Only update if prerequisites changed
        if (JSON.stringify(updatedPrerequisites) !== JSON.stringify(skill.prerequisites)) {
          await getSkillsCollection().doc(skill.id).update({
            prerequisites: updatedPrerequisites
          });
        }
      }
    }
  } catch (error) {
    console.error('❌ Error fixing prerequisite IDs:', error);
    throw error;
  }
};

export const skillService = {
  getSkillsWithProgress,
  getSkillWithProgress,
  startSkill,
  completeMicroStep,
  submitQuizAttempt,
  getUserSkillStats,
  resetSkillProgress,
  getNextRecommendedSkill,
  fixPrerequisiteIds,
};
