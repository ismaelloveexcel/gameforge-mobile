/**
 * EmptyState - Beautiful, animated empty states with personality
 * Makes "nothing here yet" feel like an invitation, not a dead end
 */
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
  FadeInUp,
} from 'react-native-reanimated';
import { useTheme } from '../contexts/ThemeContext';
import DodoCompanion from './DodoCompanion';
import { spacing, typography, radii, forgeColors } from '../design-tokens/theme';

interface EmptyStateProps {
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  variant?: 'projects' | 'games' | 'search' | 'error' | 'welcome';
  dodoMessage?: string;
}

const VARIANT_CONFIG = {
  projects: {
    emoji: '📁',
    dodoMood: 'curious' as const,
    gradientColors: [forgeColors.forge[500], forgeColors.spark[500]],
  },
  games: {
    emoji: '🎮',
    dodoMood: 'excited' as const,
    gradientColors: [forgeColors.spark[500], forgeColors.ember[500]],
  },
  search: {
    emoji: '🔍',
    dodoMood: 'thinking' as const,
    gradientColors: [forgeColors.gold[500], forgeColors.ember[500]],
  },
  error: {
    emoji: '🌧️',
    dodoMood: 'sleepy' as const,
    gradientColors: [forgeColors.stone[500], forgeColors.forge[500]],
  },
  welcome: {
    emoji: '✨',
    dodoMood: 'waving' as const,
    gradientColors: [forgeColors.moss[500], forgeColors.forge[500]],
  },
};

export default function EmptyState({
  title,
  message,
  actionLabel,
  onAction,
  variant = 'projects',
  dodoMessage,
}: EmptyStateProps) {
  const { theme } = useTheme();
  
  const floatY = useSharedValue(0);
  const iconRotate = useSharedValue(0);
  const glowOpacity = useSharedValue(0.3);
  
  const config = VARIANT_CONFIG[variant];
  
  useEffect(() => {
    // Floating animation
    floatY.value = withRepeat(
      withSequence(
        withTiming(-10, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 2000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
    
    // Gentle rotation
    iconRotate.value = withRepeat(
      withSequence(
        withTiming(5, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
        withTiming(-5, { duration: 3000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
    
    // Glow pulse
    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.6, { duration: 2000 }),
        withTiming(0.3, { duration: 2000 })
      ),
      -1,
      false
    );
  }, [floatY, iconRotate, glowOpacity]);
  
  const iconStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: floatY.value },
      { rotate: `${iconRotate.value}deg` },
    ],
  }));
  
  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));
  
  return (
    <View style={styles.container}>
      {/* Floating illustration */}
      <Animated.View entering={FadeInUp.duration(600).delay(100)} style={styles.illustrationContainer}>
        {/* Glow effect behind icon */}
        <Animated.View
          style={[
            styles.glow,
            {
              backgroundColor: config.gradientColors[0],
            },
            glowStyle,
          ]}
        />
        
        <Animated.View style={[styles.iconContainer, iconStyle]}>
          <Text style={styles.emoji}>{config.emoji}</Text>
        </Animated.View>
        
        {/* Decorative elements */}
        <View style={styles.decorativeOrbs}>
          {[...Array(3)].map((_, i) => (
            <Animated.View
              key={i}
              entering={FadeInUp.duration(400).delay(200 + i * 100)}
              style={[
                styles.orb,
                {
                  width: 8 + i * 4,
                  height: 8 + i * 4,
                  backgroundColor: config.gradientColors[i % 2] + '40',
                  left: 20 + i * 30,
                  top: 10 + i * 20,
                },
              ]}
            />
          ))}
        </View>
      </Animated.View>
      
      {/* Dodo companion */}
      <Animated.View entering={FadeInUp.duration(600).delay(300)}>
        <DodoCompanion
          mood={config.dodoMood}
          size="medium"
          message={dodoMessage || getDefaultDodoMessage(variant)}
          showBubble
        />
      </Animated.View>
      
      {/* Text content */}
      <Animated.View entering={FadeInUp.duration(600).delay(400)} style={styles.textContainer}>
        <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>
        <Text style={[styles.message, { color: theme.colors.text + '80' }]}>{message}</Text>
      </Animated.View>
      
      {/* Action button */}
      {actionLabel && onAction && (
        <Animated.View entering={FadeInUp.duration(600).delay(500)}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              {
                backgroundColor: config.gradientColors[0],
              },
            ]}
            onPress={onAction}
            activeOpacity={0.8}
          >
            <Text style={styles.actionButtonText}>{actionLabel}</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
}

function getDefaultDodoMessage(variant: string): string {
  switch (variant) {
    case 'projects':
      return "Let's create something amazing together! 🌟";
    case 'games':
      return "Ready to forge your first game? ⚒️";
    case 'search':
      return "Hmm, nothing here... try something else?";
    case 'error':
      return "Oops! Let me help you sort this out 💪";
    case 'welcome':
      return "Welcome to the forge! I'm Dodo, your guide! 🦤";
    default:
      return "What shall we create today?";
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  illustrationContainer: {
    position: 'relative',
    marginBottom: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    opacity: 0.3,
  },
  iconContainer: {
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 64,
  },
  decorativeOrbs: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  orb: {
    position: 'absolute',
    borderRadius: 100,
  },
  textContainer: {
    alignItems: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  message: {
    fontSize: typography.size.base,
    textAlign: 'center',
    lineHeight: typography.size.base * typography.lineHeight.relaxed,
    maxWidth: 280,
  },
  actionButton: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radii.full,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      },
    }),
  },
  actionButtonText: {
    color: '#fff',
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
  },
});
