/**
 * Enhanced ThemeContext with emotional states and forge aesthetics
 * Supports personalization, time-awareness, and context-driven theming
 */
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  spacing,
  typography,
  radii,
  shadows,
  motion,
  forgeColors,
  emotionalPalettes,
  timeGradients,
  EmotionalState,
  TimeOfDay,
} from '../design-tokens/theme';

// Theme type definitions
interface ThemeColors {
  primary: string;
  background: string;
  card: string;
  text: string;
  textMuted: string;
  textSubtle: string;
  border: string;
  notification: string;
  secondary: string;
  accent: string;
  success: string;
  warning: string;
  error: string;
  // Forge-specific
  glow: string;
  ember: string;
  spark: string;
}

interface Theme {
  dark: boolean;
  colors: ThemeColors;
  spacing: typeof spacing;
  typography: typeof typography;
  radii: typeof radii;
  shadows: typeof shadows;
  motion: typeof motion;
}

// Signature color - user's personal touch
interface UserPreferences {
  signatureColor?: string;
  makerMark?: string;
  prefersDarkMode?: boolean;
  reducedMotion?: boolean;
}

// Light theme
const lightTheme: Theme = {
  dark: false,
  colors: {
    primary: forgeColors.forge[500],
    background: '#FAFAF9',
    card: '#FFFFFF',
    text: forgeColors.stone[900],
    textMuted: forgeColors.stone[600],
    textSubtle: forgeColors.stone[400],
    border: forgeColors.stone[200],
    notification: forgeColors.ember[500],
    secondary: forgeColors.spark[500],
    accent: forgeColors.spark[500],
    success: forgeColors.moss[500],
    warning: forgeColors.gold[500],
    error: '#EF4444',
    // Forge-specific
    glow: forgeColors.forge[400],
    ember: forgeColors.ember[500],
    spark: forgeColors.spark[500],
  },
  spacing,
  typography,
  radii,
  shadows,
  motion,
};

// Dark theme with forge glow
const darkTheme: Theme = {
  dark: true,
  colors: {
    primary: forgeColors.forge[400],
    background: '#0C0A09',
    card: forgeColors.stone[900],
    text: forgeColors.stone[50],
    textMuted: forgeColors.stone[400],
    textSubtle: forgeColors.stone[600],
    border: forgeColors.stone[800],
    notification: forgeColors.ember[400],
    secondary: forgeColors.spark[400],
    accent: forgeColors.spark[400],
    success: forgeColors.moss[400],
    warning: forgeColors.gold[400],
    error: '#F87171',
    // Forge-specific - enhanced glow in dark mode
    glow: forgeColors.forge[500],
    ember: forgeColors.ember[400],
    spark: forgeColors.spark[400],
  },
  spacing,
  typography,
  radii,
  shadows,
  motion,
};

// Context value type
interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  setDarkMode: (dark: boolean) => void;
  // Emotional theming
  emotionalState: EmotionalState | null;
  setEmotionalState: (state: EmotionalState | null) => void;
  getEmotionalColors: () => typeof emotionalPalettes.celebration | null;
  // Personalization
  userPreferences: UserPreferences;
  setSignatureColor: (color: string) => void;
  setMakerMark: (mark: string) => void;
  // Time awareness
  timeOfDay: TimeOfDay;
  getTimeGradient: () => string[];
  // Utilities
  getContrastText: (backgroundColor: string) => string;
  applyGlow: (color?: string) => object;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const PREFERENCES_KEY = '@gameforge_user_preferences';

// Get current time of day
const getTimeOfDay = (): TimeOfDay => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 8) return 'dawn';
  if (hour >= 8 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 20) return 'evening';
  if (hour >= 20 && hour < 24) return 'night';
  return 'midnight';
};

// Simple contrast calculator
const getContrastText = (backgroundColor: string): string => {
  const hex = backgroundColor.replace('#', '');
  if (hex.length < 6) return '#000000';
  
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  
  return brightness > 128 ? '#000000' : '#FFFFFF';
};

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [isDark, setIsDark] = useState(systemColorScheme === 'dark');
  const [emotionalState, setEmotionalState] = useState<EmotionalState | null>(null);
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>(getTimeOfDay());
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({});
  
  // Load user preferences on mount
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const stored = await AsyncStorage.getItem(PREFERENCES_KEY);
        if (stored) {
          const prefs = JSON.parse(stored);
          setUserPreferences(prefs);
          if (prefs.prefersDarkMode !== undefined) {
            setIsDark(prefs.prefersDarkMode);
          }
        }
      } catch (e) {
        console.log('Failed to load preferences');
      }
    };
    loadPreferences();
  }, []);
  
  // Update time of day periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeOfDay(getTimeOfDay());
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Save preferences
  const savePreferences = useCallback(async (prefs: UserPreferences) => {
    try {
      await AsyncStorage.setItem(PREFERENCES_KEY, JSON.stringify(prefs));
    } catch (e) {
      console.log('Failed to save preferences');
    }
  }, []);
  
  const theme = isDark ? darkTheme : lightTheme;
  
  const toggleTheme = useCallback(() => {
    const newDark = !isDark;
    setIsDark(newDark);
    const newPrefs = { ...userPreferences, prefersDarkMode: newDark };
    setUserPreferences(newPrefs);
    savePreferences(newPrefs);
  }, [isDark, userPreferences, savePreferences]);
  
  const setDarkMode = useCallback((dark: boolean) => {
    setIsDark(dark);
    const newPrefs = { ...userPreferences, prefersDarkMode: dark };
    setUserPreferences(newPrefs);
    savePreferences(newPrefs);
  }, [userPreferences, savePreferences]);
  
  const getEmotionalColors = useCallback(() => {
    if (!emotionalState) return null;
    return emotionalPalettes[emotionalState];
  }, [emotionalState]);
  
  const getTimeGradient = useCallback(() => {
    return timeGradients[timeOfDay];
  }, [timeOfDay]);
  
  const setSignatureColor = useCallback((color: string) => {
    const newPrefs = { ...userPreferences, signatureColor: color };
    setUserPreferences(newPrefs);
    savePreferences(newPrefs);
  }, [userPreferences, savePreferences]);
  
  const setMakerMark = useCallback((mark: string) => {
    const newPrefs = { ...userPreferences, makerMark: mark };
    setUserPreferences(newPrefs);
    savePreferences(newPrefs);
  }, [userPreferences, savePreferences]);
  
  const applyGlow = useCallback((color?: string) => {
    if (!isDark) return {};
    
    const glowColor = color || theme.colors.glow;
    return shadows.forge.md(glowColor);
  }, [isDark, theme.colors.glow]);
  
  return (
    <ThemeContext.Provider
      value={{
        theme,
        isDark,
        toggleTheme,
        setDarkMode,
        emotionalState,
        setEmotionalState,
        getEmotionalColors,
        userPreferences,
        setSignatureColor,
        setMakerMark,
        timeOfDay,
        getTimeGradient,
        getContrastText,
        applyGlow,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Re-export tokens for convenience
export { spacing, typography, radii, shadows, motion, forgeColors };
