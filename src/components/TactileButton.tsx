/**
 * TactileButton - Button with responsive squish animation
 * ALWAYS ON - Lightweight tactile feedback
 * 
 * Uses Reanimated 2 worklets for 60fps performance
 */

import React, { ReactNode } from 'react';
import {
  TouchableOpacity,
  ViewStyle,
  TextStyle,
  StyleProp,
  GestureResponderEvent,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';

interface TactileButtonProps {
  onPress?: (event: GestureResponderEvent) => void;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  squishScale?: number; // Default: 0.94
  haptic?: boolean; // Future: Add haptic feedback
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export const TactileButton: React.FC<TactileButtonProps> = ({
  onPress,
  children,
  style,
  disabled = false,
  squishScale = 0.94,
  haptic = false,
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
    // Squish down with spring
    scale.value = withSpring(squishScale, {
      damping: 15,
      stiffness: 300,
    });
  };

  const handlePressOut = () => {
    // Bounce back with slight overshoot
    scale.value = withSpring(1, {
      damping: 12,
      stiffness: 250,
      overshootClamping: false,
    });
  };

  return (
    <AnimatedTouchable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      activeOpacity={0.9}
      style={[animatedStyle, style]}
    >
      {children}
    </AnimatedTouchable>
  );
};

/**
 * Preset configurations for common button types
 */
export const TactileButtonPresets = {
  primary: {
    squishScale: 0.94,
  },
  secondary: {
    squishScale: 0.96,
  },
  card: {
    squishScale: 0.98,
  },
  icon: {
    squishScale: 0.92,
  },
};
