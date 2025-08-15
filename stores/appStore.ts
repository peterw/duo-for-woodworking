import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface AppSettings {
  // UI Settings
  darkMode: boolean;
  hapticFeedback: boolean;
  notifications: boolean;
  
  // App State
  hasCompletedOnboarding: boolean;
  lastAppVersion: string;
  isFirstLaunch: boolean;
  
  // Actions
  toggleDarkMode: () => void;
  toggleHapticFeedback: () => void;
  toggleNotifications: () => void;
  setOnboardingCompleted: () => void;
  setAppVersion: (version: string) => void;
  setFirstLaunch: (isFirst: boolean) => void;
  resetSettings: () => void;
}

export const useAppStore = create<AppSettings>()(
  persist(
    (set, get) => ({
      // Initial state
      darkMode: false,
      hapticFeedback: true,
      notifications: true,
      hasCompletedOnboarding: false,
      lastAppVersion: '1.0.0',
      isFirstLaunch: true,

      // Actions
      toggleDarkMode: () => set(state => ({ darkMode: !state.darkMode })),
      
      toggleHapticFeedback: () => set(state => ({ hapticFeedback: !state.hapticFeedback })),
      
      toggleNotifications: () => set(state => ({ notifications: !state.notifications })),
      
      setOnboardingCompleted: () => set({ hasCompletedOnboarding: true }),
      
      setAppVersion: (version: string) => set({ lastAppVersion: version }),
      
      setFirstLaunch: (isFirst: boolean) => set({ isFirstLaunch: isFirst }),
      
      resetSettings: () => set({
        darkMode: false,
        hapticFeedback: true,
        notifications: true,
        hasCompletedOnboarding: false,
        isFirstLaunch: true,
      }),
    }),
    {
      name: 'app-settings-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        darkMode: state.darkMode,
        hapticFeedback: state.hapticFeedback,
        notifications: state.notifications,
        hasCompletedOnboarding: state.hasCompletedOnboarding,
        lastAppVersion: state.lastAppVersion,
        isFirstLaunch: state.isFirstLaunch,
      }),
    }
  )
);
