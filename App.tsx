import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppNavigator from './src/navigation/AppNavigator';
import { ThemeProvider } from './src/contexts/ThemeContext';

// ─── Error Boundary ────────────────────────────────────────
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  state = { hasError: false, error: undefined as Error | undefined };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={ebStyles.container}>
          <Text style={ebStyles.title}>Something went wrong</Text>
          <Text style={ebStyles.message}>{this.state.error?.message}</Text>
        </View>
      );
    }
    return this.props.children;
  }
}

const ebStyles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: '#1a1a2e' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#fff', marginBottom: 12 },
  message: { fontSize: 14, color: '#aaa', textAlign: 'center' },
});

// ─── Linking config for deep links ──────────────────────
const linking = {
  prefixes: ['giftverse://', 'https://giftverse.app'],
  config: {
    screens: {
      GiftView: 'gift/:giftId',
      MainTabs: '',
    },
  },
};

// ─── Root Component ────────────────────────────────────────
export default function App() {
  const [initialRoute, setInitialRoute] = useState<string | null>(null);

  useEffect(() => {
    AsyncStorage.getItem('onboarding_completed').then((value) => {
      setInitialRoute(value === 'true' ? 'MainTabs' : 'Onboarding');
    }).catch(() => setInitialRoute('Onboarding'));
  }, []);

  if (!initialRoute) return null; // splash still showing

  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <ThemeProvider>
          <NavigationContainer linking={linking}>
            <AppNavigator initialRoute={initialRoute} />
          </NavigationContainer>
        </ThemeProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}
