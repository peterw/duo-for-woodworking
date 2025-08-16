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

class FirestoreService {
  private usersCollection = firestore().collection('users');

  // Create a new user document
  async createUser(userData: CreateUserData): Promise<FirestoreUser> {
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
      timeCommitment: userData.timeCommitment,
      motivation: userData.motivation,
      goal: userData.goal,
    };

    await this.usersCollection.doc(currentUser.uid).set(userDoc);

    return {
      uid: currentUser.uid,
      ...userDoc,
    };
  }

  // Get user data by UID
  async getUser(uid: string): Promise<FirestoreUser | null> {
    try {
      const doc = await this.usersCollection.doc(uid).get();
      if (doc.exists) {
        return { uid: doc.id, ...doc.data() } as FirestoreUser;
      }
      return null;
    } catch (error) {
      console.error('Error fetching user:', error);
      return null;
    }
  }

  // Update user data
  async updateUser(uid: string, updates: Partial<FirestoreUser>): Promise<void> {
    try {
      await this.usersCollection.doc(uid).update({
        ...updates,
        lastLoginAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  // Update user progress
  async updateUserProgress(uid: string, progressUpdates: Partial<Pick<FirestoreUser, 'currentStreak' | 'longestStreak' | 'totalXP' | 'level' | 'totalProjects' | 'skillsCompleted' | 'completedSkills' | 'completedProjects' | 'dailyGoals'>>): Promise<void> {
    try {
      await this.usersCollection.doc(uid).update({
        ...progressUpdates,
        lastLoginAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error updating user progress:', error);
      throw error;
    }
  }

  // Check if username is available
  async isUsernameAvailable(username: string): Promise<boolean> {
    try {
      const query = await this.usersCollection.where('username', '==', username).get();
      return query.empty;
    } catch (error) {
      console.error('Error checking username availability:', error);
      return false;
    }
  }

  // Get user by username
  async getUserByUsername(username: string): Promise<FirestoreUser | null> {
    try {
      const query = await this.usersCollection.where('username', '==', username).get();
      if (!query.empty) {
        const doc = query.docs[0];
        return { uid: doc.id, ...doc.data() } as FirestoreUser;
      }
      return null;
    } catch (error) {
      console.error('Error fetching user by username:', error);
      return null;
    }
  }

  // Update daily login and streak
  async updateDailyLogin(uid: string): Promise<{ currentStreak: number; longestStreak: number }> {
    try {
      const user = await this.getUser(uid);
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

        await this.updateUserProgress(uid, {
          currentStreak: newCurrentStreak,
          longestStreak: newLongestStreak,
          dailyGoals: {
            practice: false,
            skill: false,
            project: false,
          },
        });

        return {
          currentStreak: newCurrentStreak,
          longestStreak: newLongestStreak,
        };
      }

      return {
        currentStreak: user.currentStreak,
        longestStreak: user.longestStreak,
      };
    } catch (error) {
      console.error('Error updating daily login:', error);
      throw error;
    }
  }

  // Delete user account
  async deleteUser(uid: string): Promise<void> {
    try {
      await this.usersCollection.doc(uid).delete();
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }
}

export const firestoreService = new FirestoreService();
