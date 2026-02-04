/**
 * ShimmerOverlay - Iridescent shimmer pulse for CTAs
 */
import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

interface ShimmerOverlayProps {
  opacity?: number;
}

export default function ShimmerOverlay({ opacity = 0.45 }: ShimmerOverlayProps) {
  const shimmer = useSharedValue(0);

  useEffect(() => {
    shimmer.value = withRepeat(
      withTiming(1, { duration: 2200 }),
      -1,
      false
    );
  }, [shimmer]);

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: interpolate(shimmer.value, [0, 1], [-140, 140]) }],
    opacity,
  }));

  return (
    <AnimatedLinearGradient
      colors={['transparent', 'rgba(255,255,255,0.7)', 'transparent']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={[styles.shimmer, shimmerStyle]}
    />
  );
}

const styles = StyleSheet.create({
  shimmer: {
    ...StyleSheet.absoluteFillObject,
  },
});
