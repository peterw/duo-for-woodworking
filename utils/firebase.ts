import analytics from '@react-native-firebase/analytics';
import auth from '@react-native-firebase/auth';
import crashlytics from '@react-native-firebase/crashlytics';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';
import perf from '@react-native-firebase/perf';
import remoteConfig from '@react-native-firebase/remote-config';
import storage from '@react-native-firebase/storage';

// Configure Remote Config
remoteConfig()
  .setDefaults({
    welcome_message: 'Welcome to Wood Craft!',
    max_project_images: '10',
    ai_coach_enabled: 'true',
    premium_features: 'false'
  })
  .then(() => {
    remoteConfig().fetchAndActivate();
  });

// Export Firebase services
export { analytics, auth, crashlytics, firestore, messaging, perf, remoteConfig, storage };

// Helper function to get current user ID
export const getCurrentUserId = (): string | null => {
  return auth().currentUser?.uid || null;
};

// Helper function to check if user is authenticated
export const isUserAuthenticated = (): boolean => {
  return auth().currentUser !== null;
};
