/**
 * Magic Egg Hatcher
 * 
 * VIRAL MECHANIC: Mysterious egg that hatches into your gift!
 * Perfect for Valentine's mystery campaign
 * 
 * User experience:
 * 1. See mysterious glowing egg
 * 2. Tap/shake to help it hatch
 * 3. Cracks appear with each interaction
 * 4. HATCHES into personalized gift game
 * 5. WOW moment + shareable reveal
 */

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  withRepeat,
  interpolate,
  runOnJS,
} from 'react-native-reanimated';
import { useTheme } from '../contexts/ThemeContext';
import { spacing, radii } from '../design-tokens/theme';
import DodoCompanion from './DodoCompanion';

export interface MagicEggProps {
  theme: 'valentine' | 'ramadan' | 'birthday' | 'generic';
  onHatchComplete: () => void;
  recipientName?: string;
  autoHatch?: boolean;
  hatchDuration?: number; // seconds
}

export default function MagicEggHatcher({
  theme,
  onHatchComplete,
  recipientName,
  autoHatch = false,
  hatchDuration = 5,
}: MagicEggProps) {
  const { theme: appTheme } = useTheme();
  const [hatchProgress, setHatchProgress] = useState(0);
  const [isHatching, setIsHatching] = useState(false);
  const [hasHatched, setHasHatched] = useState(false);
  
  const eggScale = useSharedValue(1);
  const eggRotation = useSharedValue(0);
  const glowPulse = useSharedValue(0);
  const crackOpacity = useSharedValue(0);
  const sparkleScale = useSharedValue(0);

  // Theme-based egg colors
  const eggColors = {
    valentine: {
      base: ['#FF1493', '#FF69B4', '#FFB6C1'],
      glow: 'rgba(255, 20, 147, 0.6)',
      cracks: '#C41E3A',
    },
    ramadan: {
      base: ['#D4AF37', '#F4A460', '#FFD700'],
      glow: 'rgba(212, 175, 55, 0.6)',
      cracks: '#8B4513',
    },
    birthday: {
      base: ['#4169E1', '#87CEEB', '#FFD700'],
      glow: 'rgba(65, 105, 225, 0.6)',
      cracks: '#FF6347',
    },
    generic: {
      base: ['#9B59B6', '#C39BD3', '#E8DAEF'],
      glow: 'rgba(155, 89, 182, 0.6)',
      cracks: '#6C3483',
    },
  };

  const colors = eggColors[theme];

  // Idle animation - gentle breathing
  useEffect(() => {
    if (!isHatching && !hasHatched) {
      eggScale.value = withRepeat(
        withSequence(
          withTiming(1.05, { duration: 2000 }),
          withTiming(1, { duration: 2000 })
        ),
        -1,
        false
      );

      glowPulse.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 1500 }),
          withTiming(0.3, { duration: 1500 })
        ),
        -1,
        false
      );
    }
  }, [isHatching, hasHatched]);

  // Auto-hatch countdown
  useEffect(() => {
    if (autoHatch && !isHatching && !hasHatched) {
      const timer = setInterval(() => {
        setHatchProgress(prev => {
          const next = prev + (100 / hatchDuration);
          if (next >= 100) {
            startHatching();
            return 100;
          }
          return next;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [autoHatch, isHatching, hasHatched, hatchDuration]);

  const handleTap = useCallback(() => {
    if (hasHatched || isHatching) return;

    // Add progress on tap
    const newProgress = Math.min(hatchProgress + 10, 100);
    setHatchProgress(newProgress);

    // Shake animation
    eggRotation.value = withSequence(
      withTiming(-10, { duration: 50 }),
      withTiming(10, { duration: 50 }),
      withTiming(-10, { duration: 50 }),
      withTiming(0, { duration: 50 })
    );

    // Show cracks as progress increases
    crackOpacity.value = newProgress / 100;

    // If reached 100%, hatch!
    if (newProgress >= 100) {
      startHatching();
    }
  }, [hatchProgress, hasHatched, isHatching]);

  const startHatching = useCallback(() => {
    setIsHatching(true);

    // Intense shaking
    eggRotation.value = withRepeat(
      withSequence(
        withTiming(-20, { duration: 100 }),
        withTiming(20, { duration: 100 })
      ),
      10,
      true
    );

    // Scale up then explode
    eggScale.value = withSequence(
      withTiming(1.2, { duration: 500 }),
      withTiming(1.5, { duration: 300 }),
      withTiming(0, { duration: 200 })
    );

    // Sparkle explosion
    setTimeout(() => {
      sparkleScale.value = withSpring(3, { damping: 8 });
      
      // Complete hatching
      setTimeout(() => {
        setHasHatched(true);
        onHatchComplete();
      }, 500);
    }, 1000);
  }, [onHatchComplete]);

  const eggStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: eggScale.value },
      { rotate: `${eggRotation.value}deg` },
    ],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowPulse.value,
  }));

  const crackStyle = useAnimatedStyle(() => ({
    opacity: crackOpacity.value,
  }));

  const sparkleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: sparkleScale.value }],
    opacity: interpolate(sparkleScale.value, [0, 1, 3], [0, 1, 0]),
  }));

  if (hasHatched) {
    return (
      <View style={styles.container}>
        <Animated.View style={[styles.sparkleExplosion, sparkleStyle]}>
          <Text style={styles.sparkle}>✨</Text>
          <Text style={styles.sparkle}>💫</Text>
          <Text style={styles.sparkle}>⭐</Text>
          <Text style={styles.sparkle}>✨</Text>
        </Animated.View>
        
        <DodoCompanion
          mood="celebrating"
          size="large"
          message={`${recipientName ? recipientName + "'s" : 'Your'} gift has hatched! 🎉`}
          floating={true}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Dodo watching */}
      <View style={styles.dodoWatcher}>
        <DodoCompanion
          mood={isHatching ? 'excited' : 'curious'}
          size="small"
          message={
            isHatching
              ? "It's hatching! 🥚✨"
              : hatchProgress > 50
              ? "Almost there! Keep going!"
              : "Help hatch the magic egg!"
          }
          showBubble={true}
        />
      </View>

      {/* Egg container */}
      <TouchableOpacity
        onPress={handleTap}
        activeOpacity={0.9}
        disabled={isHatching}
        style={styles.eggContainer}
      >
        {/* Glow effect */}
        <Animated.View
          style={[
            styles.glow,
            glowStyle,
            { backgroundColor: colors.glow },
          ]}
        />

        {/* The egg */}
        <Animated.View style={[styles.egg, eggStyle]}>
          {/* Gradient layers */}
          <View
            style={[
              styles.eggLayer,
              { backgroundColor: colors.base[0] },
            ]}
          />
          <View
            style={[
              styles.eggLayer,
              styles.eggMiddle,
              { backgroundColor: colors.base[1] },
            ]}
          />
          <View
            style={[
              styles.eggLayer,
              styles.eggTop,
              { backgroundColor: colors.base[2] },
            ]}
          />

          {/* Cracks */}
          {hatchProgress > 0 && (
            <Animated.View style={[styles.cracks, crackStyle]}>
              <View style={[styles.crack, styles.crack1, { backgroundColor: colors.cracks }]} />
              {hatchProgress > 30 && (
                <View style={[styles.crack, styles.crack2, { backgroundColor: colors.cracks }]} />
              )}
              {hatchProgress > 60 && (
                <View style={[styles.crack, styles.crack3, { backgroundColor: colors.cracks }]} />
              )}
            </Animated.View>
          )}

          {/* Sparkles */}
          {hatchProgress > 50 && (
            <View style={styles.sparkles}>
              <Text style={styles.miniSparkle}>✨</Text>
              <Text style={styles.miniSparkle}>💫</Text>
            </View>
          )}
        </Animated.View>
      </TouchableOpacity>

      {/* Progress indicator */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { backgroundColor: appTheme.colors.border }]}>
          <View
            style={[
              styles.progressFill,
              {
                backgroundColor: colors.base[0],
                width: `${hatchProgress}%`,
              },
            ]}
          />
        </View>
        <Text style={[styles.progressText, { color: appTheme.colors.text }]}>
          {isHatching
            ? 'Hatching... 🥚✨'
            : autoHatch
            ? `Auto-hatching in ${Math.ceil((100 - hatchProgress) * hatchDuration / 100)}s`
            : 'Tap egg to help it hatch!'}
        </Text>
      </View>

      {/* Shake prompt for mobile */}
      {hatchProgress > 0 && !isHatching && (
        <Text style={[styles.shakePrompt, { color: appTheme.colors.notification }]}>
          Or shake your phone! 📱
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl,
  },
  dodoWatcher: {
    position: 'absolute',
    top: 0,
    right: 20,
    zIndex: 10,
  },
  eggContainer: {
    width: 200,
    height: 260,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing.xl,
  },
  glow: {
    position: 'absolute',
    width: 220,
    height: 280,
    borderRadius: 110,
    zIndex: -1,
  },
  egg: {
    width: 160,
    height: 200,
    borderRadius: 80,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  eggLayer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 80,
  },
  eggMiddle: {
    top: '15%',
    height: '70%',
    opacity: 0.8,
  },
  eggTop: {
    top: '30%',
    height: '40%',
    opacity: 0.6,
  },
  cracks: {
    ...StyleSheet.absoluteFillObject,
  },
  crack: {
    position: 'absolute',
    width: 3,
    opacity: 0.8,
  },
  crack1: {
    height: 80,
    top: 40,
    left: 80,
    transform: [{ rotate: '15deg' }],
  },
  crack2: {
    height: 60,
    top: 60,
    right: 50,
    transform: [{ rotate: '-25deg' }],
  },
  crack3: {
    height: 100,
    top: 30,
    left: 60,
    transform: [{ rotate: '45deg' }],
  },
  sparkles: {
    position: 'absolute',
    top: 20,
    right: 20,
    flexDirection: 'row',
    gap: 4,
  },
  miniSparkle: {
    fontSize: 16,
  },
  progressContainer: {
    width: '80%',
    alignItems: 'center',
    marginTop: spacing.lg,
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
    marginTop: spacing.sm,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  shakePrompt: {
    marginTop: spacing.md,
    fontSize: 12,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  sparkleExplosion: {
    flexDirection: 'row',
    gap: 40,
  },
  sparkle: {
    fontSize: 48,
  },
});
