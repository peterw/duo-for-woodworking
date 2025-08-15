import React from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppFonts } from '../hooks/AppFonts';
import { useAppTheme } from '../hooks/useAppTheme';
import { trackUserActivity } from '../utils/analytics';
import { hapticSelection } from '../utils/haptics';
import { getAppColor, hexToRgbA } from '../utils/hexToRGBA';
import AppIcons from './appIcons/AppIcons';

interface TabItem {
  name: string;
  label: string;
  icon: {
    type: string;
    name: string;
  };
}

interface AnimationValues {
  iconSlide: Animated.Value;
  titleSlide: Animated.Value;
  backgroundOpacity: Animated.Value;
  opacity: Animated.Value;
}

interface CustomBottomTabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
}

const CustomBottomTabBar: React.FC<CustomBottomTabBarProps> = ({
  state,
  descriptors: _descriptors,
  navigation,
}) => {
  const { isDarkTheme, appTheme: colors } = useAppTheme();
  const insets = useSafeAreaInsets();

  // Animation values for each tab
  const [animationValues] = React.useState<AnimationValues[]>(() => 
    state.routes.map(() => ({
      iconSlide: new Animated.Value(0),
      titleSlide: new Animated.Value(0),
      backgroundOpacity: new Animated.Value(0),
      opacity: new Animated.Value(0),
    }))
  );

  // Define your tabs in order
  const tabs: TabItem[] = [
    {
      name: 'index',
      label: 'Home',
      icon: { type: 'MaterialCommunityIcons', name: 'home-variant' },
    },
    {
      name: 'learn',
      label: 'Learn',
      icon: { type: 'MaterialCommunityIcons', name: 'book-open-variant' },
    },
    {
      name: 'projects',
      label: 'Projects',
      icon: { type: 'MaterialCommunityIcons', name: 'hammer' },
    },
    {
      name: 'coach',
      label: 'Coach',
      icon: { type: 'MaterialDesignIcons', name: 'robot' },
    },
    {
      name: 'profile',
      label: 'Profile',
      icon: { type: 'MaterialCommunityIcons', name: 'account-circle' },
    },
  ];

  // Animation function
  const animateTabSelection = React.useCallback((index: number) => {
    // Reset all animations
    animationValues.forEach((anim: AnimationValues, i: number) => {
      if (i !== index) {
        anim.iconSlide.setValue(0);
        anim.titleSlide.setValue(0);
        anim.backgroundOpacity.setValue(0);
        anim.opacity.setValue(0);
      }
    });

    // Animate the selected tab
    const selectedAnim = animationValues[index];
    
    // Start background fade in
    Animated.timing(selectedAnim.backgroundOpacity, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    // After background starts, animate icon and title
    setTimeout(() => {
      Animated.parallel([
        // Icon slides to the left
        Animated.timing(selectedAnim.iconSlide, {
          toValue: -2,
          duration: 200,
          useNativeDriver: true,
        }),
        // Title slides in from the right
        Animated.timing(selectedAnim.titleSlide, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
        // Title opacity fades in
        Animated.timing(selectedAnim.opacity, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
        }),
      ]).start();
    }, 10); // Start icon/title animation after background starts
  }, [animationValues]);

  // Reset animations when tab changes
  React.useEffect(() => {
    const currentIndex = state.index;
    animateTabSelection(currentIndex);
  }, [state.index, animateTabSelection]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[
        styles.tabBar, 
        { 
          shadowColor: isDarkTheme ? '#000' : '#000',
          shadowOpacity: isDarkTheme ? 0.3 : 0.1,
          borderTopWidth: isDarkTheme ? 0.5 : 0,
          borderTopColor: isDarkTheme ? colors.border : 'transparent',
        }
      ]}>
        {state.routes.map((route: any, index: number) => {
          const isFocused = state.index === index;
          const tabItem = tabs.find(tab => tab.name === route.name);
          const animValues = animationValues[index];

          if (!tabItem) return null;

          const onPress = () => {
            // Trigger haptic feedback for tab selection
            hapticSelection();
            
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              // Track tab switch analytics
              const currentTab = state.routes[state.index]?.name;
              if (currentTab && currentTab !== route.name) {
                trackUserActivity.tabSwitched(currentTab, route.name);
              }
              
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={styles.tabItem}
              activeOpacity={0.8}
            >
              {isFocused ? (
                <Animated.View 
                  style={[
                    styles.activeTab, 
                    { 
                      backgroundColor: isDarkTheme 
                        ? hexToRgbA(colors.primary, 0.25) 
                        : colors.primary,
                      opacity: animValues.backgroundOpacity,
                    }
                  ]}
                >
                  <Animated.View
                    style={{
                      transform: [
                        { translateX: animValues.iconSlide },
                      ],
                    }}
                  >
                    <AppIcons
                      type={tabItem.icon.type as any}
                      name={tabItem.icon.name}
                      size={24}
                      color={colors.white}
                    />
                  </Animated.View>
                  <Animated.View
                    style={{
                      transform: [
                        { 
                          translateX: animValues.titleSlide.interpolate({
                            inputRange: [0, 1],
                            outputRange: [20, 0],
                          })
                        },
                      ],
                      opacity: animValues.opacity,
                    }}
                  >
                    <Text adjustsFontSizeToFit numberOfLines={1} style={[styles.activeTabText, { color: colors.white }]}>
                      {tabItem.label}
                    </Text>
                  </Animated.View>
                </Animated.View>
              ) : (
                <View style={styles.inactiveTab}>
                  <AppIcons
                    type={tabItem.icon.type as any}
                    name={tabItem.icon.name}
                    size={24}
                    color={isDarkTheme ? colors.textSecondary : colors.textTertiary}
                  />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 8,
    borderTopWidth: 1,
    borderTopColor: getAppColor('border', 0.5),
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    // elevation: 4,
  },
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 4,
    backgroundColor: 'transparent',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  activeTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
    gap: 4,
  },
  inactiveTab: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  activeTabText: {
    fontSize: AppFonts[13],
    fontWeight: '600',
  },
});

export default CustomBottomTabBar;
