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
  SeasonalTheme,
  getActiveSeasonalTheme,
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

// Available theme options for user selection
export type ThemeChoice = 'auto' | 'eternal-romance' | 'winter-majlis' | 'creator-wave' | 'neon-dubai-summer';

export const THEME_OPTIONS: { id: ThemeChoice; label: string; description: string }[] = [
  { id: 'auto', label: 'Seasonal', description: 'Changes with the season' },
  { id: 'eternal-romance', label: 'Romance', description: 'Valentine\'s elegance' },
  { id: 'winter-majlis', label: 'Majlis', description: 'Cozy gatherings' },
  { id: 'creator-wave', label: 'Creator', description: 'Bold creativity' },
  { id: 'neon-dubai-summer', label: 'Neon', description: 'Summer nights' },
];

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
  // Seasonal theming (UAE)
  seasonalTheme: SeasonalTheme;
  themeChoice: ThemeChoice;
  setThemeChoice: (choice: ThemeChoice) => void;
  getSeasonalColors: () => SeasonalTheme['colors'];
  getSeasonalGradient: () => string[];
  // Utilities
  getContrastText: (backgroundColor: string) => string;
  applyGlow: (color?: string) => object;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const PREFERENCES_KEY = '@gameforge_user_preferences';
const THEME_CHOICE_KEY = '@gameforge_theme_choice';

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
  const [themeChoice, setThemeChoiceState] = useState<ThemeChoice>('auto');
  const [seasonalTheme, setSeasonalTheme] = useState<SeasonalTheme>(getActiveSeasonalTheme());
  
  // Load user preferences and theme choice on mount
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
        
        // Load theme choice
        const storedTheme = await AsyncStorage.getItem(THEME_CHOICE_KEY);
        if (storedTheme) {
          const choice = storedTheme as ThemeChoice;
          setThemeChoiceState(choice);
          // Apply the theme immediately
          if (choice === 'auto') {
            setSeasonalTheme(getActiveSeasonalTheme());
          } else {
            setSeasonalTheme(getActiveSeasonalTheme(choice));
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
  
  // Update seasonal theme when choice changes or periodically for auto mode
  useEffect(() => {
    const updateTheme = () => {
      if (themeChoice === 'auto') {
        setSeasonalTheme(getActiveSeasonalTheme());
      } else {
        setSeasonalTheme(getActiveSeasonalTheme(themeChoice));
      }
    };
    
    updateTheme();
    
    // Only poll for auto mode
    if (themeChoice === 'auto') {
      const interval = setInterval(updateTheme, 3600000); // Check every hour
      return () => clearInterval(interval);
    }
  }, [themeChoice]);
  
  // Set theme choice and persist
  const setThemeChoice = useCallback(async (choice: ThemeChoice) => {
    setThemeChoiceState(choice);
    try {
      await AsyncStorage.setItem(THEME_CHOICE_KEY, choice);
    } catch (e) {
      console.log('Failed to save theme choice');
    }
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
  
  const getSeasonalColors = useCallback(() => {
    return seasonalTheme.colors;
  }, [seasonalTheme]);
  
  const getSeasonalGradient = useCallback(() => {
    return seasonalTheme.gradient;
  }, [seasonalTheme]);
  
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
        seasonalTheme,
        themeChoice,
        setThemeChoice,
        getSeasonalColors,
        getSeasonalGradient,
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
export type { ThemeChoice };
