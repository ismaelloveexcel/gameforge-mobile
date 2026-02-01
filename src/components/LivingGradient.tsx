/**
 * LivingGradient - Animated background that breathes and shifts
 * Based on time of day, emotional context, and user activity
 */
import React, { useEffect, useMemo } from 'react';
import { StyleSheet, View, Platform, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../contexts/ThemeContext';
import { timeGradients, emotionalPalettes, EmotionalState } from '../design-tokens/theme';

// Dimensions available for responsive calculations if needed

interface LivingGradientProps {
  emotion?: EmotionalState;
  intensity?: 'subtle' | 'normal' | 'vibrant';
  children?: React.ReactNode;
  style?: any;
}

const getTimeOfDay = (): keyof typeof timeGradients => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 8) return 'dawn';
  if (hour >= 8 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 20) return 'evening';
  if (hour >= 20 && hour < 24) return 'night';
  return 'midnight';
};

export default function LivingGradient({
  emotion,
  intensity = 'normal',
  children,
  style,
}: LivingGradientProps) {
  const { isDark } = useTheme();
  const breathe = useSharedValue(0);
  const shift = useSharedValue(0);
  
  const timeOfDay = useMemo(() => getTimeOfDay(), []);
  
  // Breathing animation
  useEffect(() => {
    breathe.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 4000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
    
    // Slow color shift
    shift.value = withRepeat(
      withTiming(1, { duration: 20000, easing: Easing.linear }),
      -1,
      true
    );
  }, [breathe, shift]);
  
  // Determine colors based on context
  const colors = useMemo(() => {
    if (emotion && emotionalPalettes[emotion]) {
      return emotionalPalettes[emotion].gradient;
    }
    
    if (isDark) {
      return timeGradients[timeOfDay];
    }
    
    // Light mode - softer gradients
    return ['#FAFAF9', '#F5F5F4', '#E7E5E4'];
  }, [emotion, isDark, timeOfDay]);
  
  const opacityMultiplier = intensity === 'subtle' ? 0.3 : intensity === 'vibrant' ? 1 : 0.6;
  
  const animatedOverlayStyle = useAnimatedStyle(() => {
    return {
      opacity: 0.1 + breathe.value * 0.15 * opacityMultiplier,
      transform: [
        { scale: 1 + breathe.value * 0.02 },
      ],
    };
  });

  // Use CSS gradient for web, expo-linear-gradient for native
  if (Platform.OS === 'web') {
    return (
      <View style={[styles.container, style]}>
        <View
          style={[
            styles.gradient,
            {
              background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]}, ${colors[2] || colors[1]})`,
            } as any,
          ]}
        />
        <Animated.View style={[styles.breathingOverlay, animatedOverlayStyle]}>
          <View
            style={[
              styles.gradient,
              {
                background: `radial-gradient(circle at 30% 30%, ${colors[0]}40, transparent 60%)`,
              } as any,
            ]}
          />
        </Animated.View>
        <View style={styles.content}>{children}</View>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <LinearGradient
        colors={colors as any}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      />
      <Animated.View style={[styles.breathingOverlay, animatedOverlayStyle]}>
        <LinearGradient
          colors={[colors[0] + '40', 'transparent']}
          start={{ x: 0.3, y: 0.3 }}
          end={{ x: 0.7, y: 0.7 }}
          style={styles.gradient}
        />
      </Animated.View>
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  breathingOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.2,
  },
  content: {
    flex: 1,
    position: 'relative',
    zIndex: 1,
  },
});
