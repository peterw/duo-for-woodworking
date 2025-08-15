import {MMKVLoader} from 'react-native-mmkv-storage';

// Create MMKV instance
export const mmkv = new MMKVLoader()
  .withInstanceID('mmkvWithEncryptionAndID')
  .withEncryption()
  .initialize();

// Create Zustand storage adapter for MMKV
export const zuStandStorage = {
  getItem: (name: string): string | null => {
    try {
      const value = mmkv.getString(name);
      return value || null;
    } catch {
      return null;
    }
  },
  setItem: (name: string, value: string): void => {
    try {
      mmkv.setString(name, value);
    } catch {
      // Handle error silently
    }
  },
  removeItem: (name: string): void => {
    try {
      mmkv.removeItem(name);
    } catch {
      // Handle error silently
    }
  },
}; 