import React from 'react';
import { Image, ImageSourcePropType, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
                    },
                  ]}
                  resizeMode="contain"
                />
                {/* <Text style={[
                  styles.tabLabel,
                  { 
                    color: isFocused 
                      ? '#58CC02' // Duolingo green
                      : isDarkTheme 
                        ? colors.textSecondary 
                        : colors.textTertiary,
                    fontFamily: isFocused ? FontFamilies.featherBold : FontFamilies.dinRounded,
                    fontWeight: isFocused ? '700' : '500',
                  }
                ]}>
                  {tabItem.label}
                </Text> */}
                
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
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingTop: 8,
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    minHeight: 60,
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  tabIcon: {
    width: 24,
    height: 24,
    marginBottom: 4,
  },
  tabLabel: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -8,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#58CC02', // Duolingo green
  },
});

export default CustomBottomTabBar;
