import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface User {
  id: string;
  fullName: string;
  username: string;
  email: string;
  experience: 'beginner' | 'intermediate' | 'advanced';
  createdAt: string;
}

interface AuthState {
  // State
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  isLoading: boolean;
  
  // Actions
  login: (email: string, password: string) => Promise<boolean>;
  signup: (userData: Omit<User, 'id' | 'createdAt'>) => Promise<boolean>;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  checkAuthStatus: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      isAuthenticated: false,
      user: null,
      token: null,
      isLoading: false,

      // Actions
      setLoading: (loading: boolean) => set({ isLoading: loading }),

      checkAuthStatus: async () => {
        try {
          const token = await AsyncStorage.getItem('auth_token');
          const userData = await AsyncStorage.getItem('user_data');
          
          if (token && userData) {
            const user = JSON.parse(userData);
            set({
              isAuthenticated: true,
              user,
              token,
            });
          } else {
            set({
              isAuthenticated: false,
              user: null,
              token: null,
            });
          }
        } catch (error) {
          console.error('Error checking auth status:', error);
          set({
            isAuthenticated: false,
            user: null,
            token: null,
          });
        }
      },

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          // For demo purposes, accept any email/password combination
          if (email && password) {
            // Create mock user data
            const user: User = {
              id: 'user_' + Date.now(),
              fullName: 'Demo User',
              username: 'demo_user',
              email,
              experience: 'beginner',
              createdAt: new Date().toISOString(),
            };
            
            const token = 'token_' + Date.now();
            
            // Store in AsyncStorage
            await AsyncStorage.setItem('auth_token', token);
            await AsyncStorage.setItem('user_data', JSON.stringify(user));
            
            // Update state
            set({
              isAuthenticated: true,
              user,
              token,
              isLoading: false,
            });
            
            return true;
          } else {
            set({ isLoading: false });
            return false;
          }
        } catch (error) {
          console.error('Login error:', error);
          set({ isLoading: false });
          return false;
        }
      },

      signup: async (userData: Omit<User, 'id' | 'createdAt'>) => {
        set({ isLoading: true });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          // Create user
          const user: User = {
            ...userData,
            id: 'user_' + Date.now(),
            createdAt: new Date().toISOString(),
          };
          
          const token = 'token_' + Date.now();
          
          // Store in AsyncStorage
          await AsyncStorage.setItem('auth_token', token);
          await AsyncStorage.setItem('user_data', JSON.stringify(user));
          await AsyncStorage.setItem('onboarding_completed', 'true');
          
          // Update state
          set({
            isAuthenticated: true,
            user,
            token,
            isLoading: false,
          });
          
          return true;
        } catch (error) {
          console.error('Signup error:', error);
          set({ isLoading: false });
          return false;
        }
      },

      logout: async () => {
        try {
          // Clear AsyncStorage
          await AsyncStorage.removeItem('auth_token');
          await AsyncStorage.removeItem('user_data');
          await AsyncStorage.removeItem('onboarding_completed');
          
          // Clear state
          set({
            isAuthenticated: false,
            user: null,
            token: null,
          });
        } catch (error) {
          console.error('Logout error:', error);
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        token: state.token,
      }),
    }
  )
);
