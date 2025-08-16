import { useAuthStore } from '@/stores';
import React, { createContext, useContext, useState } from 'react';

interface AuthContextType {
  isInitialized: boolean;
}

const AuthContext = createContext<AuthContextType>({
  isInitialized: false,
});

export const useAuthContext = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const { checkAuthStatus } = useAuthStore();

  // useEffect(() => {
  //   const initializeAuth = async () => {
  //     try {
  //       // Set up Firebase auth state listener
  //       const unsubscribe = auth().onAuthStateChanged(async (firebaseUser) => {
  //         if (firebaseUser) {
  //           // User is signed in
  //           try {
  //             // Get user data from Firestore
  //             const userData = await firestoreService.getUser(firebaseUser.uid);
              
  //             if (userData) {
  //               // Update daily login and streak
  //               await firestoreService.updateDailyLogin(firebaseUser.uid);
  //             }
  //           } catch (error) {
  //             console.error('Error fetching user data:', error);
  //           }
  //         }
          
  //         // Mark auth as initialized
  //         setIsInitialized(true);
  //       });

  //       // Initialize auth status
  //       await checkAuthStatus();

  //       return () => unsubscribe();
  //     } catch (error) {
  //       console.error('Error initializing auth:', error);
  //       setIsInitialized(true);
  //     }
  //   };

  //   initializeAuth();
  // }, [checkAuthStatus]);

  // if (!isInitialized) {
  //   // You could show a loading screen here
  //   return null;
  // }

  return (
    <AuthContext.Provider value={{ isInitialized }}>
      {children}
    </AuthContext.Provider>
  );
};
