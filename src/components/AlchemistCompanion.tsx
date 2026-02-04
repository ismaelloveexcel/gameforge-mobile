/**
 * AlchemistCompanion - The Alchemist character guide
 * Geeky/nerdy character with glasses, lab coat, potion vials aesthetic
 * Provides themed reactions for different occasions
 */

import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import { useTheme } from '../contexts/ThemeContext';
import { enableWowFeatures } from '../config/flags';

export type AlchemistMood = 
  | 'idle' 
  | 'brewing'
  | 'excited'
  | 'thinking'
  | 'celebrating';

export type AlchemistOccasion =
  | 'valentine'
  | 'ramadan'
  | 'birthday'
  | 'anniversary'
  | 'generic';

interface AlchemistCompanionProps {
  occasion?: AlchemistOccasion;
  mood?: AlchemistMood;
  message?: string;
  size?: 'small' | 'medium' | 'large';
  floating?: boolean;
}

/**
 * Themed messages for different occasions
 */
const OCCASION_MESSAGES: Record<AlchemistOccasion, string> = {
  valentine: "Brewing a potion of love and adventure! 💝",
  ramadan: "Brewing a lantern-lit Ramadan adventure! 🌙",
  birthday: "Concocting a magical birthday surprise! 🎂",
  anniversary: "Mixing up something unforgettable! 🎉",
  generic: "Brewing something magical! ✨",
};

/**
 * The Alchemist character emoji representation
 * Using emoji for lightweight rendering
 */
const ALCHEMIST_EMOJI = '🧙‍♂️';
const POTION_EMOJI = '🧪';

export const AlchemistCompanion: React.FC<AlchemistCompanionProps> = ({
  occasion = 'generic',
  mood = 'idle',
  message,
  size = 'medium',
  floating = true,
}) => {
  const { theme } = useTheme();
  const translateY = useSharedValue(0);
  const rotate = useSharedValue(0);
  const potionGlow = useSharedValue(0);

  // Size configurations
  const sizeConfig = {
    small: { container: 60, emoji: 32, message: 12 },
    medium: { container: 80, emoji: 44, message: 14 },
    large: { container: 100, emoji: 56, message: 16 },
  };

  const config = sizeConfig[size];

  // Floating animation (always on - lightweight)
  useEffect(() => {
    if (floating) {
      translateY.value = withRepeat(
        withSequence(
          withTiming(-8, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: 2000, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      );
    }
  }, [floating]);

  // Brewing animation (when mood is brewing)
  useEffect(() => {
    if (mood === 'brewing') {
      rotate.value = withRepeat(
        withSequence(
          withTiming(-5, { duration: 500, easing: Easing.inOut(Easing.ease) }),
          withTiming(5, { duration: 500, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
    } else {
      rotate.value = withTiming(0, { duration: 300 });
    }
  }, [mood]);

  // Potion glow animation (only if wow features enabled)
  useEffect(() => {
    if (enableWowFeatures() && mood === 'brewing') {
      potionGlow.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 1000 }),
          withTiming(0, { duration: 1000 })
        ),
        -1,
        false
      );
    }
  }, [mood]);

  const floatingStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { rotate: `${rotate.value}deg` },
    ],
  }));

  const potionGlowStyle = useAnimatedStyle(() => ({
    opacity: potionGlow.value * 0.6,
  }));

  const displayMessage = message || OCCASION_MESSAGES[occasion];

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.character, { height: config.container }, floatingStyle]}>
        {/* Alchemist */}
        <Text
          style={{ fontSize: config.emoji }}
          accessibilityLabel="Alchemist character"
        >
          {ALCHEMIST_EMOJI}
        </Text>
        
        {/* Potion (only when brewing) */}
        {mood === 'brewing' && (
          <View style={styles.potionContainer}>
            <Text
              style={{ fontSize: config.emoji * 0.5 }}
              accessibilityLabel="Brewing potion"
            >
              {POTION_EMOJI}
            </Text>
            
            {/* Glow effect (only if wow features enabled) */}
            {enableWowFeatures() && (
              <Animated.View 
                style={[
                  styles.potionGlow,
                  potionGlowStyle,
                  {
                    backgroundColor: 
                      occasion === 'valentine' ? 'rgba(196, 30, 58, 0.4)' :
                      occasion === 'ramadan' ? 'rgba(212, 175, 55, 0.4)' :
                      'rgba(138, 43, 226, 0.4)',
                  }
                ]} 
              />
            )}
          </View>
        )}
      </Animated.View>

      {/* Message bubble */}
      {displayMessage && (
        <View style={[
          styles.messageBubble,
          { 
            backgroundColor: theme.colors.card,
            borderColor: theme.colors.border,
          }
        ]}>
          <Text style={[
            styles.messageText,
            { 
              color: theme.colors.text,
              fontSize: config.message,
            }
          ]}>
            {displayMessage}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  character: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  potionContainer: {
    position: 'absolute',
    bottom: -8,
    right: -12,
  },
  potionGlow: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 30,
    height: 30,
    borderRadius: 15,
    marginLeft: -15,
    marginTop: -15,
    zIndex: -1,
  },
  messageBubble: {
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    maxWidth: '90%',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
      },
    }),
  },
  messageText: {
    textAlign: 'center',
    lineHeight: 20,
    fontWeight: '500',
  },
});
