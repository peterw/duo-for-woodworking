import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface OnboardingData {
  fullName: string;
  username: string;
  goal: string;
  experience: 'beginner' | 'intermediate' | 'advanced';
  timeCommitment: string;
  motivation: string;
}

interface OnboardingState {
  // State
  data: Partial<OnboardingData> | null;
  isCompleted: boolean;
  
  // Actions
  setOnboardingData: (data: Partial<OnboardingData>) => void;
  setOnboardingCompleted: () => void;
  clearOnboardingData: () => void;
  getOnboardingData: () => Partial<OnboardingData> | null;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set, get) => ({
      // Initial state
      data: null,
      isCompleted: false,

      // Actions
      setOnboardingData: (newData: Partial<OnboardingData>) => {
        const currentData = get().data || {};
        set({ data: { ...currentData, ...newData } });
      },

      setOnboardingCompleted: () => {
        set({ isCompleted: true });
      },

      clearOnboardingData: () => {
        set({ data: null, isCompleted: false });
      },

      getOnboardingData: () => {
        return get().data;
      },
    }),
    {
      name: 'onboarding-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        data: state.data,
        isCompleted: state.isCompleted,
      }),
    }
  )
);
