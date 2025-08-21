import React from 'react';
import { Image, ImageSourcePropType, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontFamilies } from '../hooks/AppFonts';
import { useAppTheme } from '../hooks/useAppTheme';
import { trackUserActivity } from '../utils/analytics';
import { hapticSelection } from '../utils/haptics';

interface TabItem {
  name: string;
  label: string;
  icon: string;
  activeIcon: string;
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

  // Define Duolingo-style tabs
  const tabs: TabItem[] = [
    {
      name: 'index',
      label: 'Home',
      icon: require('../assets/icons/home.png'),
      activeIcon: require('../assets/icons/home.png'),
    },
    {
      name: 'learn',
      label: 'Learn',
      icon: require('../assets/icons/learn.png'),
      activeIcon: require('../assets/icons/learn.png'),
    },
    {
      name: 'projects',
      label: 'Projects',
      icon: require('../assets/icons/project.png'),
      activeIcon: require('../assets/icons/project.png'),
    },
    {
      name: 'coach',
      label: 'Coach',
      icon: require('../assets/icons/ai.png'),
      activeIcon: require('../assets/icons/ai.png'),
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[
        styles.tabBar, 
        { 
          shadowColor: isDarkTheme ? '#000' : '#000',
          shadowOpacity: isDarkTheme ? 0.3 : 0.1,
          borderTopWidth: isDarkTheme ? 0.5 : 0,
          borderTopColor: isDarkTheme ? colors.border : 'transparent',
          paddingBottom: insets.bottom,
        }
      ]}>
        {state.routes.map((route: any, index: number) => {
          const isFocused = state.index === index;
          const tabItem = tabs.find(tab => tab.name === route.name);

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
              activeOpacity={0.7}
            >
              <View style={styles.tabContent}>
                <Image
                  source={tabItem.icon as ImageSourcePropType}
                  style={[
                    styles.tabIcon,
                    { 
                      transform: [{ scale: isFocused ? 1.1 : 1.0 }],
                    },
                  ]}
                  resizeMode="contain"
                />
                <Text style={[
                  styles.tabLabel,
                  { 
                    color: isFocused 
                      ? '#58CC02' // Duolingo green
                      : isDarkTheme 
                        ? colors.textSecondary 
                        : colors.textTertiary,
                    fontFamily: isFocused ? FontFamilies.featherBold : FontFamilies.dinRounded,
                    fontWeight: isFocused ? '700' : '500',
                    textShadowColor: isDarkTheme ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.8)',
                    textShadowOffset: { width: 0, height: 1 },
                    textShadowRadius: 2,
                    transform: [{ scale: isFocused ? 1.05 : 1.0 }],
                  }
                ]}>
                  {tabItem.label}
                </Text>
                
                {/* Active indicator like Duolingo */}
                {isFocused && (
                  <View style={styles.activeIndicator} />
                )}
              </View>
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
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(0,0,0,0.08)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: 4,
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    minHeight: 70,
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  tabIcon: {
    width: 24,
    height: 24,
    marginBottom: 2,
  },
  tabLabel: {
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 14,
    marginTop: 2,
    letterSpacing: 0.2,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -10,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#58CC02', // Duolingo green
  },
});

export default CustomBottomTabBar;
