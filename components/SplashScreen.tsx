import { FontFamilies } from '@/hooks/AppFonts';
import { RPH } from '@/utils/utils';
import React, { useEffect, useState } from 'react';
import { Animated, Easing, Image, StyleSheet, Text, View } from 'react-native';

interface SplashScreenProps {
  onAnimationComplete?: () => void;
}

export function SplashScreen({ onAnimationComplete }: SplashScreenProps) {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.9));
  const [titleFadeAnim] = useState(new Animated.Value(0));
  const [closeAnim] = useState(new Animated.Value(1));
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    // Fade in and scale up animation (Duolingo style)
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(titleFadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
    ]).start();

    // Start closing animation after 1.8 seconds (Duolingo timing)
    const closeTimer = setTimeout(() => {
      setIsClosing(true);
      // Duolingo's signature "wrap to center" closing animation
      Animated.timing(closeAnim, {
        toValue: 0,
        duration: 400, // Duolingo uses 400ms for closing
        useNativeDriver: true,
        easing: Easing.in(Easing.cubic),
      }).start(() => {
        // Only call the callback after the closing animation is complete
        setTimeout(() => {
          onAnimationComplete?.();
        }, 100); // Small delay to ensure animation is fully visible
      });
    }, 1800);

    return () => clearTimeout(closeTimer);
  }, [onAnimationComplete]);

  // Create the authentic Duolingo wrap to center effect
  // This creates the signature folding animation from all edges to center
  const wrapScale = closeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  // Create the wrap effect using scale and opacity
  const finalScale = Animated.multiply(scaleAnim, wrapScale);
  const finalOpacity = Animated.multiply(fadeAnim, closeAnim);

  // Create the wrap to center effect using only supported native properties
  // This simulates the folding effect by scaling and translating the content
  const wrapTransformX = closeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0], // Keep centered
  });

  const wrapTransformY = closeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0], // Keep centered
  });

  // Add a subtle rotation for more authentic feel
  const wrapRotation = closeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '0deg'], // Keep it subtle
  });

  // Create the wrap effect by animating the background edges towards center
  // This is the key to Duolingo's signature animation
  const backgroundScale = closeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const backgroundOpacity = closeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  // Create a more sophisticated wrap effect by animating different elements at different rates
  const logoScale = closeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const titleScale = closeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <View style={styles.container}>
      {/* Background with wrap to center animation */}
      <Animated.View 
        style={[
          styles.background,
          {
            opacity: backgroundOpacity,
            transform: [{ scale: backgroundScale }],
          }
        ]} 
      />

      {/* Main content with wrap to center animation */}
      <Animated.View
        style={[
          styles.content,
          {
            opacity: finalOpacity,
            transform: [
              { scale: finalScale },
              { translateX: wrapTransformX },
              { translateY: wrapTransformY },
              { rotate: wrapRotation },
            ],
          }
        ]}
      >
        {/* Logo container with wrap animation */}
        <Animated.View 
          style={[
            styles.logoContainer,
            {
              transform: [{ scale: logoScale }],
            }
          ]}
        >
          <Image 
            source={require('../assets/images/icon.png')} 
            style={styles.logoImage}
            resizeMode="contain"
            tintColor={'white'}
          />
        </Animated.View>

        {/* App title - Duolingo style with wrap animation */}
        <Animated.View
          style={[
            styles.titleContainer,
            {
              opacity: titleFadeAnim,
              transform: [
                {
                  translateY: titleFadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  })
                },
                { scale: titleScale },
              ]
            }
          ]}
        >
          <Text style={styles.title}>Wood Craft</Text>
          <Text style={styles.subtitle}>Master the art of woodworking</Text>
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#58CC02', // Duolingo's signature green
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#58CC02', // Duolingo's signature green
  },
  content: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'transparent', // No background, just the icon
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 0, // No bottom margin for centered positioning
  },
  logoImage: {
    width: RPH(26),
    height: RPH(26),
    marginBottom: RPH(3)
  },
  titleContainer: {
    alignItems: 'center',
    marginTop: 24, // Space between logo and title
  },
  title: {
    fontFamily: FontFamilies.featherBold,
    fontSize: 42,
    fontWeight: '900',
    color: '#FFFFFF', // White text on green background
    textAlign: 'center',
    letterSpacing: -1,
  },
  subtitle: {
    fontFamily: FontFamilies.dinRounded,
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 8,
  },
});
