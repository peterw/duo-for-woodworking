import { CreateUserData, firestoreService, FirestoreUser } from '@/services/firestoreService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { AppleAuthenticationScope, isAvailableAsync, signInAsync } from 'expo-apple-authentication';
import { sha256 } from 'js-sha256';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface User extends FirestoreUser {}

interface AuthState {
  // State
  isAuthenticated: boolean;
  user: User | null;
  firebaseUser: FirebaseAuthTypes.User | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (email: string, password: string) => Promise<boolean>;
  signup: (userData: CreateUserData, password: string) => Promise<boolean>;
  appleSignIn: () => Promise<boolean | 'NEEDS_SIGNUP'>;
  appleSignUp: (userData: Partial<CreateUserData>) => Promise<boolean>;
  logout: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  checkAuthStatus: () => Promise<void>;
  resetPassword: (email: string) => Promise<boolean>;
  updateProfile: (updates: Partial<User>) => Promise<boolean>;
  deleteAccount: () => Promise<boolean>;
  recoverAccount: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      isAuthenticated: false,
      user: null,
      firebaseUser: null,
      isLoading: false,
      error: null,

      // Actions
      setLoading: (loading: boolean) => set({ isLoading: loading }),
      setError: (error: string | null) => set({ error }),
      clearError: () => set({ error: null }),
      clearAuthError: () => set({ error: null }),

      checkAuthStatus: async () => {
        try {
          set({ isLoading: true });
          
          // Listen to Firebase auth state changes
          auth().onAuthStateChanged(async (firebaseUser) => {
            if (firebaseUser) {
              // User is signed in
              try {
                // Get user data from Firestore
                const userData = await firestoreService.getUser(firebaseUser.uid);
                
                if (userData) {
                  // Update daily login and streak
                  const streakData = await firestoreService.updateDailyLogin(firebaseUser.uid);
                  
                  const updatedUser = {
                    ...userData,
                    ...streakData,
                  };
                  
                  set({
                    isAuthenticated: true,
                    user: updatedUser,
                    firebaseUser,
                    isLoading: false,
                    error: null,
                  });
                } else {
                  // User exists in Firebase Auth but not in Firestore
                  // Don't show error immediately, just sign out the user
                  console.log('User exists in Firebase Auth but not in Firestore, signing out');
                  await auth().signOut();
                  set({
                    isAuthenticated: false,
                    user: null,
                    firebaseUser: null,
                    isLoading: false,
                    error: null,
                  });
                }
                              } catch (error: any) {
                  console.error('Error fetching user data:', error);
                  
                  // Don't show error for expected scenarios like no current user
                  if (error.code === 'auth/no-current-user') {
                    set({
                      isAuthenticated: false,
                      user: null,
                      firebaseUser: null,
                      isLoading: false,
                      error: null,
                    });
                  } else {
                    set({
                      isAuthenticated: false,
                      user: null,
                      firebaseUser: null,
                      isLoading: false,
                      error: 'Unable to load your profile. Please check your connection and try again.',
                    });
                  }
                }
            } else {
              // User is signed out
              set({
                isAuthenticated: false,
                user: null,
                firebaseUser: null,
                isLoading: false,
                error: null,
              });
            }
          });
        } catch (error: any) {
          console.error('Error checking auth status:', error);
          
          // Don't show error for expected scenarios like no current user
          if (error.code === 'auth/no-current-user') {
            set({
              isAuthenticated: false,
              user: null,
              firebaseUser: null,
              isLoading: false,
              error: null,
            });
          } else {
            set({
              isAuthenticated: false,
              user: null,
              firebaseUser: null,
              isLoading: false,
              error: 'Unable to verify your account status. Please check your connection and try again.',
            });
          }
        }
      },

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        
        try {
          const userCredential = await auth().signInWithEmailAndPassword(email, password);
          const firebaseUser = userCredential.user;
          
          if (firebaseUser) {
            // Get user data from Firestore
            const userData = await firestoreService.getUser(firebaseUser.uid);
            
            if (userData) {
              try {
                // Update daily login and streak
                const streakData = await firestoreService.updateDailyLogin(firebaseUser.uid);
                
                const updatedUser = {
                  ...userData,
                  ...streakData,
                };
                
                set({
                  isAuthenticated: true,
                  user: updatedUser,
                  firebaseUser,
                  isLoading: false,
                  error: null,
                });
                
                return true;
              } catch (streakError: any) {
                console.error('Error updating daily login:', streakError);
                
                // Still allow login even if streak update fails
                set({
                  isAuthenticated: true,
                  user: userData,
                  firebaseUser,
                  isLoading: false,
                  error: null,
                });
                
                return true;
              }
            } else {
              set({ 
                isLoading: false, 
                error: 'User profile not found. Please contact support to restore your account.' 
              });
              return false;
            }
          } else {
            set({ 
              isLoading: false, 
              error: 'Login failed. Please check your credentials.' 
            });
            return false;
          }
        } catch (error: any) {
          console.error('Login error:', error);
          let errorMessage = 'Login failed. Please try again.';
          
          if (error.code === 'auth/user-not-found') {
            errorMessage = 'No account found with this email address. Please check your email or create a new account.';
          } else if (error.code === 'auth/wrong-password') {
            errorMessage = 'Incorrect password. Please check your password and try again.';
          } else if (error.code === 'auth/invalid-email') {
            errorMessage = 'Please enter a valid email address.';
          } else if (error.code === 'auth/too-many-requests') {
            errorMessage = 'Too many failed login attempts. Please wait a few minutes before trying again.';
          } else if (error.code === 'auth/network-request-failed') {
            errorMessage = 'Network error. Please check your internet connection and try again.';
          } else if (error.code === 'auth/user-disabled') {
            errorMessage = 'This account has been disabled. Please contact support.';
          } else if (error.code === 'auth/invalid-credential') {
            errorMessage = 'Invalid login credentials. Please check your email and password.';
          }
          
          set({ isLoading: false, error: errorMessage });
          return false;
        }
      },

      signup: async (userData: CreateUserData, password: string) => {
        set({ isLoading: true, error: null });
        
        try {
          // Check if username is available
          const isUsernameAvailable = await firestoreService.isUsernameAvailable(userData.username);
          if (!isUsernameAvailable) {
            set({ 
              isLoading: false, 
              error: 'Username is already taken. Please choose a different username.' 
            });
            return false;
          }
          
          // Create Firebase Auth user
          const userCredential = await auth().createUserWithEmailAndPassword(userData.email, password);
          const firebaseUser = userCredential.user;
          
          if (firebaseUser) {
            try {
              // Create user document in Firestore
              const newUser = await firestoreService.createUser(userData);
              
              set({
                isAuthenticated: true,
                user: newUser,
                firebaseUser,
                isLoading: false,
                error: null,
              });
              
              return true;
            } catch (firestoreError: any) {
              console.error('Firestore user creation error:', firestoreError);
              
              // Delete the Firebase Auth user if Firestore creation fails
              try {
                await firebaseUser.delete();
              } catch (deleteError) {
                console.error('Error deleting Firebase user after Firestore failure:', deleteError);
              }
              
              let errorMessage = 'Account creation failed. Please try again.';
              if (firestoreError.message?.includes('network')) {
                errorMessage = 'Network error during account creation. Please check your connection and try again.';
              } else if (firestoreError.message?.includes('permission')) {
                errorMessage = 'Permission denied. Please contact support.';
              }
              
              set({ 
                isLoading: false, 
                error: errorMessage 
              });
              return false;
            }
          } else {
            set({ 
              isLoading: false, 
              error: 'Account creation failed. Please try again.' 
            });
            return false;
          }
        } catch (error: any) {
          console.error('Signup error:', error);
          let errorMessage = 'Account creation failed. Please try again.';
          
          if (error.code === 'auth/email-already-in-use') {
            errorMessage = 'An account with this email already exists. Please use a different email or try logging in instead.';
          } else if (error.code === 'auth/invalid-email') {
            errorMessage = 'Please enter a valid email address.';
          } else if (error.code === 'auth/weak-password') {
            errorMessage = 'Password is too weak. Please use at least 6 characters and include a mix of letters, numbers, and symbols.';
          } else if (error.code === 'auth/network-request-failed') {
            errorMessage = 'Network error. Please check your internet connection and try again.';
          } else if (error.code === 'auth/operation-not-allowed') {
            errorMessage = 'Account creation is currently disabled. Please contact support.';
          } else if (error.code === 'auth/too-many-requests') {
            errorMessage = 'Too many signup attempts. Please wait a few minutes before trying again.';
          }
          
          set({ isLoading: false, error: errorMessage });
          return false;
        }
      },

      appleSignIn: async () => {
        set({ isLoading: true, error: null });
        
        try {
          // Check if Apple Sign In is available
          const isAvailable = await isAvailableAsync();
          if (!isAvailable) {
            set({ 
              isLoading: false, 
              error: 'Apple Sign In is not available on this device.' 
            });
            return false;
          }

          // Generate a random nonce for security
          const rawNonce = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
          const nonce = sha256(rawNonce);

          // Request Apple Sign In with proper error handling
          let credential;
          try {
            credential = await signInAsync({
              requestedScopes: [
                AppleAuthenticationScope.FULL_NAME,
                AppleAuthenticationScope.EMAIL,
              ],
              nonce: nonce,
            });
          } catch (signInError: any) {
            console.error('Apple Sign In modal error:', signInError);
            
            // Handle specific Apple Sign In errors
            if (signInError.code === 'ERR_CANCELED') {
              set({ 
                isLoading: false, 
                error: null // Don't show error for user cancellation
              });
              return false;
            } else if (signInError.code === 'ERR_INVALID_RESPONSE') {
              set({ 
                isLoading: false, 
                error: 'Apple Sign In failed. Please try again.' 
              });
              return false;
            } else {
              throw signInError; // Re-throw other errors
            }
          }

          if (credential.identityToken) {
            console.log('Apple Sign In successful, creating Firebase credential...');
            
            // Create Firebase credential
            const { AppleAuthProvider } = await import('@react-native-firebase/auth');
            const appleProvider = AppleAuthProvider.credential(
              credential.identityToken,
              rawNonce
            );

            console.log('Firebase credential created, signing in...');
            
            // Sign in with Firebase
            const userCredential = await auth().signInWithCredential(appleProvider);
            const firebaseUser = userCredential.user;
            
            console.log('Firebase sign in successful:', firebaseUser.uid);

            if (firebaseUser) {
              // Check if user exists in Firestore
              let userData = await firestoreService.getUser(firebaseUser.uid);
              
              if (!userData) {
                // User doesn't exist - show signup modal instead of auto-creating
                set({ 
                  isLoading: false, 
                  error: null 
                });
                
                // Return special flag to indicate user needs to signup
                return 'NEEDS_SIGNUP';
              }

              // User exists, update daily login and streak
              try {
                console.log('Updating daily login for user:', firebaseUser.uid);
                const streakData = await firestoreService.updateDailyLogin(firebaseUser.uid);
                console.log('Streak data received:', streakData);
                
                const updatedUser = {
                  ...userData,
                  ...streakData,
                };
                
                set({
                  isAuthenticated: true,
                  user: updatedUser,
                  firebaseUser,
                  isLoading: false,
                  error: null,
                });
                
                return true;
              } catch (updateError: any) {
                console.error('Error updating daily login:', updateError);
                
                // If update fails, still allow login with existing user data
                set({
                  isAuthenticated: true,
                  user: userData,
                  firebaseUser,
                  isLoading: false,
                  error: null,
                });
                
                return true;
              }
            } else {
              set({ 
                isLoading: false, 
                error: 'Apple Sign In failed. Please try again.' 
              });
              return false;
            }
          } else {
            set({ 
              isLoading: false, 
              error: 'Apple Sign In was cancelled or failed.' 
            });
            return false;
          }
        } catch (error: any) {
          console.error('Apple Sign In error:', error);
          console.error('Error details:', {
            code: error.code,
            message: error.message,
            stack: error.stack
          });
          let errorMessage = 'Apple Sign In failed. Please try again.';
          
          if (error.code === 'auth/account-exists-with-different-credential') {
            errorMessage = 'An account already exists with this email using a different sign-in method.';
          } else if (error.code === 'auth/invalid-credential') {
            errorMessage = 'Invalid Apple Sign In credentials. Please try again.';
          } else if (error.code === 'auth/network-request-failed') {
            errorMessage = 'Network error. Please check your internet connection and try again.';
          } else if (error.code === 'auth/operation-not-allowed') {
            errorMessage = 'Apple Sign In is currently disabled. Please contact support.';
          } else if (error.code === 'auth/user-disabled') {
            errorMessage = 'This account has been disabled. Please contact support.';
          } else if (error.code === 'auth/user-not-found') {
            errorMessage = 'No account found. Please try signing up instead.';
          }
          
          set({ isLoading: false, error: errorMessage });
          return false;
        }
      },

      appleSignUp: async (userData: Partial<CreateUserData>) => {
        set({ isLoading: true, error: null });
        
        try {
          // Check if Apple Sign In is available
          const isAvailable = await isAvailableAsync();
          if (!isAvailable) {
            set({ 
              isLoading: false, 
              error: 'Apple Sign In is not available on this device.' 
            });
            return false;
          }

          // Generate a random nonce for security
          const rawNonce = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
          const nonce = sha256(rawNonce);

          // Request Apple Sign In with proper error handling
          let credential;
          try {
            credential = await signInAsync({
              requestedScopes: [
                AppleAuthenticationScope.FULL_NAME,
                AppleAuthenticationScope.EMAIL,
              ],
              nonce: nonce,
            });
          } catch (signInError: any) {
            console.error('Apple Sign Up modal error:', signInError);
            
            // Handle specific Apple Sign In errors
            if (signInError.code === 'ERR_CANCELED') {
              set({ 
                isLoading: false, 
                error: null // Don't show error for user cancellation
              });
              return false;
            } else if (signInError.code === 'ERR_INVALID_RESPONSE') {
              set({ 
                isLoading: false, 
                error: 'Apple Sign Up failed. Please try again.' 
              });
              return false;
            } else {
              throw signInError; // Re-throw other errors
            }
          }

          if (credential.identityToken) {
            // Create Firebase credential
            const { AppleAuthProvider } = await import('@react-native-firebase/auth');
            const appleProvider = AppleAuthProvider.credential(
              credential.identityToken,
              rawNonce
            );

            // Sign up with Firebase
            const userCredential = await auth().signInWithCredential(appleProvider);
            const firebaseUser = userCredential.user;

            if (firebaseUser) {
              // Create complete user profile with proper undefined handling
              const completeUserData: CreateUserData = {
                email: firebaseUser.email || credential.email || userData.email || '',
                fullName: credential.fullName?.givenName && credential.fullName?.familyName 
                  ? `${credential.fullName.givenName} ${credential.fullName.familyName}`
                  : userData.fullName || 'Apple User',
                username: userData.username || `user_${firebaseUser.uid.slice(0, 8)}`,
                experience: userData.experience || 'beginner',
                // Only include optional fields if they have values
                ...(userData.timeCommitment && { timeCommitment: userData.timeCommitment }),
                ...(userData.motivation && { motivation: userData.motivation }),
                ...(userData.goal && { goal: userData.goal }),
              };
              
              // Create user document in Firestore
              console.log('Creating user with data:', completeUserData);
              const newUser = await firestoreService.createUser(completeUserData);
              console.log('User created successfully:', newUser.uid);
              
              set({
                isAuthenticated: true,
                user: newUser,
                firebaseUser,
                isLoading: false,
                error: null,
              });
              
              return true;
            } else {
              set({ 
                isLoading: false, 
                error: 'Apple Sign Up failed. Please try again.' 
              });
              return false;
            }
          } else {
            set({ 
              isLoading: false, 
              error: 'Apple Sign Up was cancelled or failed.' 
            });
            return false;
          }
        } catch (error: any) {
          console.error('Apple Sign Up error:', error);
          console.error('Error details:', {
            code: error.code,
            message: error.message,
            stack: error.stack
          });
          let errorMessage = 'Apple Sign Up failed. Please try again.';
          
          if (error.code === 'auth/account-exists-with-different-credential') {
            errorMessage = 'An account already exists with this email using a different sign-in method.';
          } else if (error.code === 'auth/invalid-credential') {
            errorMessage = 'Invalid Apple Sign Up credentials. Please try again.';
          } else if (error.code === 'auth/network-request-failed') {
            errorMessage = 'Network error. Please check your internet connection and try again.';
          } else if (error.code === 'auth/operation-not-allowed') {
            errorMessage = 'Apple Sign Up is currently disabled. Please contact support.';
          } else if (error.code === 'auth/email-already-in-use') {
            errorMessage = 'An account with this email already exists. Please try signing in instead.';
          }
          
          set({ isLoading: false, error: errorMessage });
          return false;
        }
      },

      logout: async () => {
        try {
          set({ isLoading: true });
          await auth().signOut();
          
          set({
            isAuthenticated: false,
            user: null,
            firebaseUser: null,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          console.error('Logout error:', error);
          
          let errorMessage = 'Logout failed. Please try again.';
          if (error.message?.includes('network')) {
            errorMessage = 'Network error during logout. Please check your connection and try again.';
          } else if (error.message?.includes('permission')) {
            errorMessage = 'Permission denied. Please contact support.';
          }
          
          set({ isLoading: false, error: errorMessage });
        }
      },

      resetPassword: async (email: string) => {
        set({ isLoading: true, error: null });
        
        try {
          await auth().sendPasswordResetEmail(email);
          set({ isLoading: false, error: null });
          return true;
        } catch (error: any) {
          console.error('Password reset error:', error);
          let errorMessage = 'Password reset failed. Please try again.';
          
          if (error.code === 'auth/user-not-found') {
            errorMessage = 'No account found with this email address. Please check your email or create a new account.';
          } else if (error.code === 'auth/invalid-email') {
            errorMessage = 'Please enter a valid email address.';
          } else if (error.code === 'auth/network-request-failed') {
            errorMessage = 'Network error. Please check your internet connection and try again.';
          } else if (error.code === 'auth/too-many-requests') {
            errorMessage = 'Too many password reset attempts. Please wait a few minutes before trying again.';
          } else if (error.code === 'auth/operation-not-allowed') {
            errorMessage = 'Password reset is currently disabled. Please contact support.';
          }
          
          set({ isLoading: false, error: errorMessage });
          return false;
        }
      },

      updateProfile: async (updates: Partial<User>) => {
        const { user } = get();
        if (!user) {
          set({ error: 'You must be logged in to update your profile.' });
          return false;
        }
        
        try {
          await firestoreService.updateUser(user.uid, updates);
          
          // Update local state
          set({
            user: { ...user, ...updates },
            error: null,
          });
          
          return true;
        } catch (error: any) {
          console.error('Profile update error:', error);
          
          let errorMessage = 'Profile update failed. Please try again.';
          if (error.message?.includes('network')) {
            errorMessage = 'Network error. Please check your connection and try again.';
          } else if (error.message?.includes('permission')) {
            errorMessage = 'Permission denied. Please contact support.';
          }
          
          set({ error: errorMessage });
          return false;
        }
      },

      deleteAccount: async () => {
        const { user, firebaseUser } = get();
        if (!user || !firebaseUser) {
          set({ error: 'You must be logged in to delete your account.' });
          return false;
        }
        
        try {
          // Delete from Firestore first
          await firestoreService.deleteUser(user.uid);
          
          // Delete Firebase Auth user
          await firebaseUser.delete();
          
          set({
            isAuthenticated: false,
            user: null,
            firebaseUser: null,
            isLoading: false,
            error: null,
          });
          
          return true;
        } catch (error: any) {
          console.error('Account deletion error:', error);
          
          let errorMessage = 'Account deletion failed. Please try again.';
          if (error.message?.includes('network')) {
            errorMessage = 'Network error. Please check your connection and try again.';
          } else if (error.message?.includes('permission')) {
            errorMessage = 'Permission denied. Please contact support.';
          } else if (error.message?.includes('requires-recent-login')) {
            errorMessage = 'For security, please log in again before deleting your account.';
          }
          
          set({ error: errorMessage });
          return false;
        }
      },

      recoverAccount: async () => {
        const { firebaseUser } = get();
        if (!firebaseUser) {
          set({ error: 'No user to recover. Please sign in first.' });
          return false;
        }
        
        try {
          set({ isLoading: true, error: null });
          
          // Create a basic user profile for the existing Firebase Auth user
          const basicUserData: CreateUserData = {
            email: firebaseUser.email || '',
            fullName: firebaseUser.displayName || 'Recovered User',
            username: `user_${firebaseUser.uid.slice(0, 8)}`,
            experience: 'beginner',
          };
          
          const userData = await firestoreService.createUser(basicUserData);
          
          set({
            isAuthenticated: true,
            user: userData,
            firebaseUser,
            isLoading: false,
            error: null,
          });
          
          return true;
        } catch (error: any) {
          console.error('Account recovery error:', error);
          set({ 
            isLoading: false, 
            error: 'Failed to recover account. Please try signing up again.' 
          });
          return false;
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        isLoading: state.isLoading,
      }),
    }
  )
);
