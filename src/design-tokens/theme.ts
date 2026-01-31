/**
 * GameForge Design Tokens
 * A unified design system for the forge aesthetic
 */

// Base unit: 4px
const BASE_UNIT = 4;

export const spacing = {
  xxs: BASE_UNIT,      // 4
  xs: BASE_UNIT * 2,   // 8
  sm: BASE_UNIT * 3,   // 12
  md: BASE_UNIT * 4,   // 16
  lg: BASE_UNIT * 6,   // 24
  xl: BASE_UNIT * 8,   // 32
  xxl: BASE_UNIT * 10, // 40
  xxxl: BASE_UNIT * 12, // 48
} as const;

export const typography = {
  // Font sizes
  size: {
    xs: 11,
    sm: 13,
    base: 15,
    md: 17,
    lg: 20,
    xl: 24,
    xxl: 32,
    display: 40,
  },
  // Font weights
  weight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    black: '800' as const,
  },
  // Line heights
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.7,
  },
  // Letter spacing
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
  },
} as const;

export const radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999,
} as const;

export const shadows = {
  // For light mode
  light: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 3,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 16,
      elevation: 6,
    },
  },
  // Forge glow shadows for dark mode
  forge: {
    sm: (color: string) => ({
      shadowColor: color,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 2,
    }),
    md: (color: string) => ({
      shadowColor: color,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.4,
      shadowRadius: 12,
      elevation: 4,
    }),
    lg: (color: string) => ({
      shadowColor: color,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.5,
      shadowRadius: 24,
      elevation: 8,
    }),
  },
} as const;

export const motion = {
  // Durations
  duration: {
    instant: 100,
    fast: 200,
    normal: 300,
    slow: 500,
    glacial: 1000,
  },
  // Easing curves (for Reanimated)
  easing: {
    // Standard easing
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
    // Bounce for playful interactions
    bounce: { damping: 12, stiffness: 180 },
    // Gentle spring for subtle movements
    gentle: { damping: 20, stiffness: 100 },
    // Snappy for quick responses
    snappy: { damping: 15, stiffness: 300 },
  },
} as const;

// Forge color palettes
export const forgeColors = {
  // Core brand
  ember: {
    50: '#FFF5F0',
    100: '#FFE8DC',
    200: '#FFD0B8',
    300: '#FFB088',
    400: '#FF8C57',
    500: '#FF6B2C', // Primary ember
    600: '#E85A1F',
    700: '#C44A19',
    800: '#9C3B14',
    900: '#7A2F10',
  },
  forge: {
    50: '#F0F4FF',
    100: '#E0E8FF',
    200: '#C7D4FF',
    300: '#A3B8FF',
    400: '#7A94FF',
    500: '#6366F1', // Primary forge purple
    600: '#5855E0',
    700: '#4A45C7',
    800: '#3C379E',
    900: '#302C7A',
  },
  spark: {
    50: '#FFF0F6',
    100: '#FFE0EB',
    200: '#FFC2D9',
    300: '#FF9BBF',
    400: '#FF6BA3',
    500: '#EC4899', // Spark pink
    600: '#D63B87',
    700: '#B32D6F',
    800: '#8F2459',
    900: '#701D46',
  },
  moss: {
    50: '#ECFDF5',
    100: '#D1FAE5',
    200: '#A7F3D0',
    300: '#6EE7B7',
    400: '#34D399',
    500: '#10B981', // Success green
    600: '#059669',
    700: '#047857',
    800: '#065F46',
    900: '#064E3B',
  },
  gold: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    200: '#FDE68A',
    300: '#FCD34D',
    400: '#FBBF24',
    500: '#F59E0B', // Warning gold
    600: '#D97706',
    700: '#B45309',
    800: '#92400E',
    900: '#78350F',
  },
  // Neutrals with warm undertones
  stone: {
    50: '#FAFAF9',
    100: '#F5F5F4',
    200: '#E7E5E4',
    300: '#D6D3D1',
    400: '#A8A29E',
    500: '#78716C',
    600: '#57534E',
    700: '#44403C',
    800: '#292524',
    900: '#1C1917',
    950: '#0C0A09',
  },
} as const;

// Emotional color shifts for different creation contexts
export const emotionalPalettes = {
  celebration: {
    primary: '#FF6B2C',
    secondary: '#FFD700',
    accent: '#FF69B4',
    gradient: ['#FF6B2C', '#FF8C57', '#FFD700'],
  },
  romance: {
    primary: '#EC4899',
    secondary: '#F472B6',
    accent: '#FFC2D9',
    gradient: ['#EC4899', '#F472B6', '#FFC2D9'],
  },
  adventure: {
    primary: '#6366F1',
    secondary: '#818CF8',
    accent: '#34D399',
    gradient: ['#6366F1', '#818CF8', '#34D399'],
  },
  calm: {
    primary: '#10B981',
    secondary: '#6EE7B7',
    accent: '#A7F3D0',
    gradient: ['#10B981', '#6EE7B7', '#A7F3D0'],
  },
  playful: {
    primary: '#FBBF24',
    secondary: '#FCD34D',
    accent: '#FF8C57',
    gradient: ['#FBBF24', '#FF8C57', '#EC4899'],
  },
} as const;

// Time-based gradient presets
export const timeGradients = {
  dawn: ['#FF9A8B', '#FF6B6B', '#FF8E53'],
  morning: ['#A8EDEA', '#FED6E3', '#FFECD2'],
  afternoon: ['#667EEA', '#764BA2', '#F093FB'],
  evening: ['#FA709A', '#FEE140', '#FA709A'],
  night: ['#1A1A2E', '#16213E', '#0F3460'],
  midnight: ['#0C0A09', '#1C1917', '#292524'],
} as const;

export type EmotionalState = keyof typeof emotionalPalettes;
export type TimeOfDay = keyof typeof timeGradients;
