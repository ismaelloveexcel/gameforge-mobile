import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import HomeScreen from '../screens/HomeScreen';
import GiftHistoryScreen from '../screens/GiftHistoryScreen';
import SettingsScreen from '../screens/SettingsScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import GiftWizardScreen from '../screens/GiftWizardScreen';
import GiftPreviewScreen from '../screens/GiftPreviewScreen';
import GiftViewScreen from '../screens/GiftViewScreen';

import { useTheme } from '../contexts/ThemeContext';
import { RootStackParamList } from '../types';
import { forgeColors } from '../design-tokens/theme';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

function MainTabs() {
  const { theme, isDark } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;
          switch (route.name) {
            case 'Home':
              iconName = focused ? 'gift' : 'gift-outline';
              break;
            case 'History':
              iconName = focused ? 'history' : 'history';
              break;
            case 'Settings':
              iconName = focused ? 'cog' : 'cog-outline';
              break;
            default:
              iconName = 'help-circle-outline';
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: forgeColors.forge[500],
        tabBarInactiveTintColor: theme.colors.textMuted,
        tabBarStyle: {
          backgroundColor: isDark ? forgeColors.stone[900] : '#fff',
          borderTopColor: theme.colors.border,
          borderTopWidth: 1,
          paddingTop: 8,
          paddingBottom: Platform.OS === 'ios' ? 24 : 8,
          height: Platform.OS === 'ios' ? 88 : 64,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="History" component={GiftHistoryScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

interface AppNavigatorProps {
  initialRoute: string;
}

export default function AppNavigator({ initialRoute }: AppNavigatorProps) {
  const { theme, isDark } = useTheme();

  return (
    <Stack.Navigator
      initialRouteName={initialRoute as keyof RootStackParamList}
      screenOptions={{
        headerStyle: { backgroundColor: isDark ? forgeColors.stone[900] : '#fff' },
        headerTintColor: theme.colors.text,
        headerTitleStyle: { fontWeight: 'bold' },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="Onboarding" component={OnboardingScreen} options={{ headerShown: false }} />
      <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
      <Stack.Screen name="GiftWizard" component={GiftWizardScreen} options={{ headerShown: false }} />
      <Stack.Screen name="GiftPreview" component={GiftPreviewScreen} options={{ headerShown: false }} />
      <Stack.Screen name="GiftView" component={GiftViewScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}
