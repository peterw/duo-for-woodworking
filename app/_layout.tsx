import { useColorScheme } from '@/hooks/useColorScheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { router, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthProvider } from '@/components/AuthProvider';
import { SplashScreen as CustomSplashScreen } from '@/components/SplashScreen';
import { useAppFonts } from '@/hooks/useAppFonts';
import { useAuthStore } from '@/stores';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { isAuthenticated, checkAuthStatus } = useAuthStore();
  const [showSplash, setShowSplash] = useState(true);
  const { fontsLoaded, fontError } = useAppFonts();

  useEffect(() => {
    if (fontsLoaded) {
      // Initialize Firebase auth
      checkAuthStatus();

      // Hide the native splash screen
      SplashScreen.hideAsync();

      // Show our custom splash for a bit longer
      if (isAuthenticated) {
        router.push('/(tabs)');
      } else {
        router.push('/welcome');
      }
    }
  }, [fontsLoaded, checkAuthStatus]);

  if (!fontsLoaded) {
    return null;
  }

  if (fontError) {
    console.error('Font loading error:', fontError);
  }

  return (
    <>
      {
        showSplash ? <CustomSplashScreen onAnimationComplete={() => setShowSplash(false)} /> : null
      }
      <SafeAreaProvider>

        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <AuthProvider>

            <Stack initialRouteName={isAuthenticated ? '(tabs)' : 'welcome'} screenOptions={{ headerShown: false }}>
              
              <Stack.Screen
                name="welcome"
                options={{
                  headerShown: false,
                  gestureEnabled: false,
                }}
              />
              <Stack.Screen
                name="onboarding"
                options={{
                  headerShown: false,
                  gestureEnabled: false,
                }}
              />
              <Stack.Screen
                name="signup"
                options={{
                  headerShown: false,
                  gestureEnabled: false,
                }}
              />
              <Stack.Screen
                name="login"
                options={{
                  headerShown: false,
                  gestureEnabled: false,
                }}
              />
              <Stack.Screen
                name="(tabs)"
                options={{
                  headerShown: false,
                  gestureEnabled: false,
                }}
              />
              <Stack.Screen
                name="settings"
                options={{
                  headerShown: false,
                  gestureEnabled: true,
                }}
              />
              <Stack.Screen
                name="+not-found"
                options={{
                  title: 'Oops!',
                }}
              />
            </Stack>
          </AuthProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </>
  );
}
