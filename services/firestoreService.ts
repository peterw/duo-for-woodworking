import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export interface FirestoreUser {
  uid: string;
  email: string;
  fullName: string;
  username: string;
  experience: 'beginner' | 'intermediate' | 'advanced';
  createdAt: string;
  lastLoginAt: string;
  currentStreak: number;
  longestStreak: number;
  totalXP: number;
  level: number;
  totalProjects: number;
  skillsCompleted: number;
  completedSkills: string[];
  completedProjects: string[];
  dailyGoals: {
    practice: boolean;
    skill: boolean;
    project: boolean;
  };
  isOnboardingCompleted: boolean;
  profileImageUrl?: string;
  timeCommitment?: string;
  motivation?: string;
  goal?: string;
}

export interface CreateUserData {
  email: string;
  fullName: string;
  username: string;
  experience: 'beginner' | 'intermediate' | 'advanced';
  timeCommitment?: string;
  motivation?: string;
  goal?: string;
}

// Get the users collection reference
const getUsersCollection = () => firestore().collection('users');

// Create a new user document
export const createUser = async (userData: CreateUserData): Promise<FirestoreUser> => {
  const currentUser = auth().currentUser;
  if (!currentUser) {
    throw new Error('No authenticated user found');
  }

  const userDoc: Omit<FirestoreUser, 'uid'> = {
    email: userData.email,
    fullName: userData.fullName,
    username: userData.username,
    experience: userData.experience,
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
    currentStreak: 0,
    longestStreak: 0,
    totalXP: 0,
    level: 1,
    totalProjects: 0,
    skillsCompleted: 0,
    completedSkills: [],
    completedProjects: [],
    dailyGoals: {
      practice: false,
      skill: false,
      project: false,
    },
    isOnboardingCompleted: true,
    // Only include optional fields if they have values
    ...(userData.timeCommitment && { timeCommitment: userData.timeCommitment }),
    ...(userData.motivation && { motivation: userData.motivation }),
    ...(userData.goal && { goal: userData.goal }),
  };

  await getUsersCollection().doc(currentUser.uid).set(userDoc);

  return {
    uid: currentUser.uid,
    ...userDoc,
  };
};

// Get user data by UID
export const getUser = async (uid: string): Promise<FirestoreUser | null> => {
  try {
    const doc = await getUsersCollection().doc(uid).get();
    if (doc.exists()) {
      return { uid: doc.id, ...doc.data() } as FirestoreUser;
    }
    return null;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
};

// Update user data
export const updateUser = async (uid: string, updates: Partial<FirestoreUser>): Promise<void> => {
  try {
    // Filter out undefined values from updates
    const filteredUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, value]) => value !== undefined)
    );
    
    await getUsersCollection().doc(uid).update({
      ...filteredUpdates,
      lastLoginAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

// Update user progress
export const updateUserProgress = async (uid: string, progressUpdates: Partial<Pick<FirestoreUser, 'currentStreak' | 'longestStreak' | 'totalXP' | 'level' | 'totalProjects' | 'skillsCompleted' | 'completedSkills' | 'completedProjects' | 'dailyGoals'>>): Promise<void> => {
  try {
    // Filter out undefined values from progressUpdates
    const filteredUpdates = Object.fromEntries(
      Object.entries(progressUpdates).filter(([_, value]) => value !== undefined)
    );
    
    await getUsersCollection().doc(uid).update({
      ...filteredUpdates,
      lastLoginAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error updating user progress:', error);
    throw error;
  }
};

// Check if username is available
export const isUsernameAvailable = async (username: string): Promise<boolean> => {
  try {
    const query = await getUsersCollection().where('username', '==', username).get();
    return query.empty;
  } catch (error) {
    console.error('Error checking username availability:', error);
    return false;
  }
};

// Get user by username
export const getUserByUsername = async (username: string): Promise<FirestoreUser | null> => {
  try {
    const query = await getUsersCollection().where('username', '==', username).get();
    if (!query.empty) {
      const doc = query.docs[0];
      return { uid: doc.id, ...doc.data() } as FirestoreUser;
    }
    return null;
  } catch (error) {
    console.error('Error fetching user by username:', error);
    return null;
  }
};

// Update daily login and streak
export const updateDailyLogin = async (uid: string): Promise<{ currentStreak: number; longestStreak: number }> => {
  try {
    const user = await getUser(uid);
    if (!user) {
      throw new Error('User not found');
    }

    const today = new Date().toDateString();
    const lastLogin = new Date(user.lastLoginAt).toDateString();
    
    if (lastLogin !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const isConsecutive = lastLogin === yesterday.toDateString();
      
      let newCurrentStreak: number;
      let newLongestStreak: number;
      
      if (isConsecutive) {
        newCurrentStreak = user.currentStreak + 1;
        newLongestStreak = Math.max(newCurrentStreak, user.longestStreak);
      } else {
        newCurrentStreak = 1;
        newLongestStreak = user.longestStreak;
      }

      const progressData = {
        currentStreak: newCurrentStreak,
        longestStreak: newLongestStreak,
        dailyGoals: {
          practice: false,
          skill: false,
          project: false,
        },
      };
      
      console.log('Updating user progress with:', progressData);
      await updateUserProgress(uid, progressData);

      return {
        currentStreak: newCurrentStreak,
        longestStreak: newLongestStreak,
      };
    }

    return {
      currentStreak: user.currentStreak,
      longestStreak: user.longestStreak,
    };
  } catch (error: any) {
    console.error('Error updating daily login:', error);
    if (error.message === 'User not found') {
      console.error('User document does not exist in Firestore for UID:', uid);
    }
    throw error;
  }
};

// Delete user account
export const deleteUser = async (uid: string): Promise<void> => {
  try {
    await getUsersCollection().doc(uid).delete();
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

// Export all functions as a service object for backward compatibility
export const firestoreService = {
  createUser,
  getUser,
  updateUser,
  updateUserProgress,
  isUsernameAvailable,
  getUserByUsername,
  updateDailyLogin,
  deleteUser,
};
