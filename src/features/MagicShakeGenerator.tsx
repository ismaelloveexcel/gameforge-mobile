/**
 * Magic Shake Generator
 * 
 * WOW FACTOR: Shake phone like a magic wand to generate gift!
 * Uses device accelerometer + YOUR Dodo animations
 * 
 * Premium tactile experience that makes creation feel magical
 */

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import DodoCompanion, { DodoMood } from '../components/DodoCompanion';
import { useTheme } from '../contexts/ThemeContext';

interface MagicShakeProps {
  onShakeDetected: () => void;
  enabled: boolean;
  message?: string;
}

export default function MagicShakeGenerator({
  onShakeDetected,
  enabled,
  message = "Shake your phone like a magic wand!"
}: MagicShakeProps) {
  const { theme } = useTheme();
  const [dodoMood, setDodoMood] = useState<DodoMood>('idle');
  const [shakeProgress, setShakeProgress] = useState(0);
  
  const sparkleOpacity = useSharedValue(0);
  const dodoScale = useSharedValue(1);
  const wandGlow = useSharedValue(0);

  useEffect(() => {
    if (!enabled) return;

    let subscription: any;
    let shakeTimeout: NodeJS.Timeout;
    let currentShakeIntensity = 0;

    const startAccelerometer = async () => {
      // Set update interval to 100ms for responsive detection
      Accelerometer.setUpdateInterval(100);

      subscription = Accelerometer.addListener(({ x, y, z }) => {
        // Calculate shake intensity
        const acceleration = Math.sqrt(x * x + y * y + z * z);
        currentShakeIntensity = acceleration;

        // Detect significant shake (> 2.0 g-force)
        if (acceleration > 2.0) {
          // Clear previous timeout
          if (shakeTimeout) clearTimeout(shakeTimeout);

          // Update progress
          const progress = Math.min((acceleration - 2.0) * 50, 100);
          setShakeProgress(progress);

          // Animate Dodo excitement
          setDodoMood('excited');
          dodoScale.value = withSpring(1.1 + (progress / 200));
          wandGlow.value = progress / 100;

          // If shake is strong enough (>2.5), trigger magic!
          if (acceleration > 2.5) {
            triggerMagic();
          }

          // Reset after 1 second of no shaking
          shakeTimeout = setTimeout(() => {
            setShakeProgress(0);
            setDodoMood('idle');
            dodoScale.value = withSpring(1);
            wandGlow.value = withTiming(0);
          }, 1000);
        }
      });
    };

    startAccelerometer();

    return () => {
      if (subscription) {
        subscription.remove();
      }
      if (shakeTimeout) {
        clearTimeout(shakeTimeout);
      }
    };
  }, [enabled]);

  const triggerMagic = useCallback(() => {
    // Visual magic effect
    setDodoMood('celebrating');
    
    // Sparkle burst
    sparkleOpacity.value = withSequence(
      withTiming(1, { duration: 100 }),
      withTiming(0, { duration: 500 })
    );

    // Dodo celebration animation
    dodoScale.value = withSequence(
      withSpring(1.3),
      withSpring(1.1),
      withSpring(1)
    );

    // Haptic feedback (if available)
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate([100, 50, 100]);
    }

    // Trigger the actual generation
    setTimeout(() => {
      onShakeDetected();
    }, 500);
  }, [onShakeDetected]);

  const dodoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: dodoScale.value }],
  }));

  const sparkleStyle = useAnimatedStyle(() => ({
    opacity: sparkleOpacity.value,
  }));

  const wandGlowStyle = useAnimatedStyle(() => ({
    opacity: wandGlow.value,
  }));

  if (!enabled) return null;

  return (
    <View style={styles.container}>
      {/* Magic wand glow effect */}
      <Animated.View 
        style={[
          styles.wandGlow,
          wandGlowStyle,
          { backgroundColor: theme.colors.primary }
        ]} 
      />

      {/* Sparkle burst effect */}
      <Animated.View style={[styles.sparkles, sparkleStyle]}>
        <Text style={styles.sparkle}>✨</Text>
        <Text style={styles.sparkle}>🌟</Text>
        <Text style={styles.sparkle}>✨</Text>
        <Text style={styles.sparkle}>💫</Text>
      </Animated.View>

      {/* Dodo character */}
      <Animated.View style={dodoAnimatedStyle}>
        <DodoCompanion
          mood={dodoMood}
          size="large"
          message={shakeProgress > 50 ? "Almost there! Keep shaking!" : message}
          showBubble={true}
        />
      </Animated.View>

      {/* Shake progress indicator */}
      {shakeProgress > 0 && (
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { backgroundColor: theme.colors.border }]}>
            <Animated.View
              style={[
                styles.progressFill,
                {
                  backgroundColor: theme.colors.primary,
                  width: `${shakeProgress}%`,
                },
              ]}
            />
          </View>
          <Text style={[styles.progressText, { color: theme.colors.text }]}>
            {shakeProgress < 100 ? 'Casting spell...' : 'MAGIC! ✨'}
          </Text>
        </View>
      )}

      {/* Instruction */}
      <View style={[styles.instructionCard, { backgroundColor: theme.colors.card }]}>
        <Text style={[styles.instructionIcon, { fontSize: 32 }]}>📱</Text>
        <Text style={[styles.instructionText, { color: theme.colors.text }]}>
          Shake your phone to cast Dodo's spell!
        </Text>
        <Text style={[styles.instructionSubtext, { color: theme.colors.notification }]}>
          (or tap "Generate" below like a muggle)
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  wandGlow: {
    position: 'absolute',
    top: '40%',
    width: 200,
    height: 200,
    borderRadius: 100,
    zIndex: -1,
  },
  sparkles: {
    position: 'absolute',
    top: '30%',
    flexDirection: 'row',
    gap: 20,
  },
  sparkle: {
    fontSize: 28,
  },
  progressContainer: {
    marginTop: 20,
    alignItems: 'center',
    width: '80%',
  },
  progressBar: {
    width: '100%',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
  },
  instructionCard: {
    marginTop: 24,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    maxWidth: '85%',
  },
  instructionIcon: {
    marginBottom: 8,
  },
  instructionText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  instructionSubtext: {
    fontSize: 12,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});
