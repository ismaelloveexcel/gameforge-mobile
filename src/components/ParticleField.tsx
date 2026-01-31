/**
 * ParticleField - Ambient floating particles for magical atmosphere
 * Subtle, performant, delightful
 */
import React, { useEffect, useMemo, memo } from 'react';
import { View, StyleSheet, Dimensions, Platform } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { useTheme } from '../contexts/ThemeContext';
import { forgeColors } from '../design-tokens/theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface Particle {
  id: number;
  initialX: number;
  initialY: number;
  size: number;
  color: string;
  duration: number;
  delay: number;
  amplitude: number;
}

interface ParticleFieldProps {
  density?: 'sparse' | 'normal' | 'dense';
  colors?: string[];
  style?: any;
  children?: React.ReactNode;
}

const generateParticles = (count: number, colors: string[]): Particle[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    initialX: Math.random() * SCREEN_WIDTH,
    initialY: Math.random() * SCREEN_HEIGHT,
    size: 2 + Math.random() * 4,
    color: colors[Math.floor(Math.random() * colors.length)],
    duration: 15000 + Math.random() * 20000,
    delay: Math.random() * 5000,
    amplitude: 30 + Math.random() * 50,
  }));
};

const FloatingParticle = memo(({ particle }: { particle: Particle }) => {
  const translateY = useSharedValue(particle.initialY);
  const translateX = useSharedValue(particle.initialX);
  const opacity = useSharedValue(0);
  
  useEffect(() => {
    // Vertical float
    translateY.value = withDelay(
      particle.delay,
      withRepeat(
        withTiming(particle.initialY - particle.amplitude, {
          duration: particle.duration,
          easing: Easing.inOut(Easing.sin),
        }),
        -1,
        true
      )
    );
    
    // Horizontal drift
    translateX.value = withDelay(
      particle.delay,
      withRepeat(
        withTiming(particle.initialX + particle.amplitude * 0.5, {
          duration: particle.duration * 1.3,
          easing: Easing.inOut(Easing.sin),
        }),
        -1,
        true
      )
    );
    
    // Fade in/out
    opacity.value = withDelay(
      particle.delay,
      withRepeat(
        withTiming(0.6, {
          duration: particle.duration / 2,
          easing: Easing.inOut(Easing.ease),
        }),
        -1,
        true
      )
    );
  }, []);
  
  const style = useAnimatedStyle(() => ({
    position: 'absolute',
    width: particle.size,
    height: particle.size,
    borderRadius: particle.size / 2,
    backgroundColor: particle.color,
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
    opacity: opacity.value,
  }));
  
  return <Animated.View style={style} />;
});

export default function ParticleField({
  density = 'normal',
  colors,
  style,
  children,
}: ParticleFieldProps) {
  const { isDark } = useTheme();
  
  const particleCount = density === 'sparse' ? 15 : density === 'dense' ? 40 : 25;
  
  const defaultColors = isDark
    ? [
        forgeColors.forge[400] + '30',
        forgeColors.spark[400] + '25',
        forgeColors.ember[400] + '20',
        '#fff' + '15',
      ]
    : [
        forgeColors.forge[300] + '40',
        forgeColors.spark[300] + '35',
        forgeColors.ember[300] + '30',
      ];
  
  const particles = useMemo(
    () => generateParticles(particleCount, colors || defaultColors),
    [particleCount, colors, isDark]
  );
  
  // Skip on web for performance (CSS particles would be better)
  if (Platform.OS === 'web') {
    return (
      <View style={[styles.container, style]}>
        {children}
      </View>
    );
  }
  
  return (
    <View style={[styles.container, style]}>
      <View style={styles.particleLayer} pointerEvents="none">
        {particles.map((particle) => (
          <FloatingParticle key={particle.id} particle={particle} />
        ))}
      </View>
      {children && <View style={styles.content}>{children}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  particleLayer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    zIndex: 1,
  },
});
