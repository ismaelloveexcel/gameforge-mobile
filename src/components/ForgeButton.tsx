/**
 * ForgeButton - Buttons that feel alive
 * Glowing, pulsing, ready for action
 */
import React, { useCallback } from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  View,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withSequence,
  withTiming,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../contexts/ThemeContext';
import { spacing, radii, typography, motion, forgeColors } from '../design-tokens/theme';

interface ForgeButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
  size?: 'small' | 'medium' | 'large';
  icon?: string;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  disabled?: boolean;
  pulsing?: boolean;
  fullWidth?: boolean;
  style?: any;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const VARIANT_COLORS = {
  primary: {
    bg: forgeColors.forge[500],
    text: '#fff',
    glow: forgeColors.forge[400],
  },
  secondary: {
    bg: forgeColors.spark[500],
    text: '#fff',
    glow: forgeColors.spark[400],
  },
  ghost: {
    bg: 'transparent',
    text: forgeColors.forge[500],
    glow: forgeColors.forge[500],
  },
  danger: {
    bg: '#EF4444',
    text: '#fff',
    glow: '#F87171',
  },
  success: {
    bg: forgeColors.moss[500],
    text: '#fff',
    glow: forgeColors.moss[400],
  },
};

const SIZE_CONFIG = {
  small: {
    paddingH: spacing.md,
    paddingV: spacing.xs,
    fontSize: typography.size.sm,
    iconSize: 16,
    borderRadius: radii.md,
  },
  medium: {
    paddingH: spacing.lg,
    paddingV: spacing.sm,
    fontSize: typography.size.base,
    iconSize: 20,
    borderRadius: radii.lg,
  },
  large: {
    paddingH: spacing.xl,
    paddingV: spacing.md,
    fontSize: typography.size.md,
    iconSize: 24,
    borderRadius: radii.xl,
  },
};

export default function ForgeButton({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  pulsing = false,
  fullWidth = false,
  style,
}: ForgeButtonProps) {
  const { isDark } = useTheme();
  
  const pressed = useSharedValue(0);
  const pulse = useSharedValue(1);
  const glow = useSharedValue(0);
  
  const colors = VARIANT_COLORS[variant];
  const sizeConfig = SIZE_CONFIG[size];
  
  // Pulsing animation
  React.useEffect(() => {
    if (pulsing && !disabled) {
      pulse.value = withRepeat(
        withSequence(
          withTiming(1.02, { duration: 1000 }),
          withTiming(1, { duration: 1000 })
        ),
        -1,
        false
      );
      glow.value = withRepeat(
        withSequence(
          withTiming(0.4, { duration: 1000 }),
          withTiming(0.2, { duration: 1000 })
        ),
        -1,
        false
      );
    }
  }, [pulsing, disabled, pulse, glow]);
  
  const handlePressIn = useCallback(() => {
    pressed.value = withSpring(1, motion.easing.snappy);
  }, [pressed]);
  
  const handlePressOut = useCallback(() => {
    pressed.value = withSpring(0, motion.easing.gentle);
  }, [pressed]);
  
  const buttonStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      pressed.value,
      [0, 1],
      [pulse.value, 0.96],
      Extrapolate.CLAMP
    );
    
    return {
      transform: [{ scale }],
    };
  });
  
  const glowStyle = useAnimatedStyle(() => ({
    opacity: glow.value,
  }));
  
  const isGhost = variant === 'ghost';
  
  return (
    <AnimatedTouchable
      style={[
        styles.button,
        {
          backgroundColor: disabled ? forgeColors.stone[400] : colors.bg,
          paddingHorizontal: sizeConfig.paddingH,
          paddingVertical: sizeConfig.paddingV,
          borderRadius: sizeConfig.borderRadius,
          borderWidth: isGhost ? 2 : 0,
          borderColor: isGhost ? colors.text : 'transparent',
          opacity: disabled ? 0.6 : 1,
        },
        fullWidth && styles.fullWidth,
        buttonStyle,
        style,
      ]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      activeOpacity={1}
    >
      {/* Glow effect */}
      {isDark && !isGhost && (
        <Animated.View
          style={[
            styles.glowEffect,
            {
              backgroundColor: colors.glow,
              borderRadius: sizeConfig.borderRadius,
            },
            glowStyle,
          ]}
        />
      )}
      
      {/* Content */}
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator size="small" color={colors.text} />
        ) : (
          <>
            {icon && iconPosition === 'left' && (
              <Icon
                name={icon}
                size={sizeConfig.iconSize}
                color={isGhost ? colors.text : colors.text}
                style={styles.iconLeft}
              />
            )}
            <Text
              style={[
                styles.text,
                {
                  fontSize: sizeConfig.fontSize,
                  color: colors.text,
                },
              ]}
            >
              {title}
            </Text>
            {icon && iconPosition === 'right' && (
              <Icon
                name={icon}
                size={sizeConfig.iconSize}
                color={colors.text}
                style={styles.iconRight}
              />
            )}
          </>
        )}
      </View>
    </AnimatedTouchable>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'relative',
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        cursor: 'pointer',
        transition: 'box-shadow 0.2s ease',
      },
    }),
  },
  fullWidth: {
    width: '100%',
  },
  glowEffect: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  text: {
    fontWeight: typography.weight.semibold,
    textAlign: 'center',
  },
  iconLeft: {
    marginRight: spacing.xs,
  },
  iconRight: {
    marginLeft: spacing.xs,
  },
});
