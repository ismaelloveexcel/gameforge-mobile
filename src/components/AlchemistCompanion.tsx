/**
 * The Alchemist - Your friendly forge companion! 🧪
 * A quirky, nerdy creator who helps you craft magical gifts
 * No "AI" vibes - just a magical, helpful friend
 */
import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withSpring,
  withDelay,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { useTheme } from '../contexts/ThemeContext';
import { spacing, radii, typography, motion } from '../design-tokens/theme';
import { PlayGiftConsumerMode } from '../config/flags';

// Screen dimensions available if needed
const _dimensions = Dimensions.get('window');

export type AlchemistMood = 
  | 'idle' 
  | 'happy' 
  | 'thinking' 
  | 'excited' 
  | 'sleepy' 
  | 'celebrating'
  | 'curious'
  | 'waving';

export type AlchemistSize = 'mini' | 'small' | 'medium' | 'large';

interface AlchemistCompanionProps {
  mood?: AlchemistMood;
  size?: AlchemistSize;
  message?: string;
  onPress?: () => void;
  floating?: boolean;
  position?: 'left' | 'right' | 'center';
  showBubble?: boolean;
}

const SIZE_MAP = {
  mini: 32,
  small: 48,
  medium: 72,
  large: 120,
};

// The Alchemist's personality phrases
const IDLE_PHRASES = [
  "What shall we brew today? ✨",
  "I smell adventure brewing! 🌟",
  "Ooh, this is going to be fun!",
  "*happy alchemist noises* 🧪",
  "Ready when you are, friend!",
  "Let's make something magical!",
];

const THINKING_PHRASES = [
  "Hmm, let me ponder this...",
  "*adjusts glasses*",
  "The gears are turning! ⚙️",
  "Mixing just the right ingredients...",
  "One moment, brewing magic! ✨",
];

const CELEBRATING_PHRASES = [
  "WOOHOO! You did it! 🎉",
  "*does happy victory wiggle*",
  "That's absolutely brilliant!",
  "I knew you could do it! 🌟",
  "Time for a victory spark! 🧪",
];

export default function AlchemistCompanion({
  mood = 'idle',
  size = 'medium',
  message,
  onPress,
  floating = false,
  position = 'right',
  showBubble = true,
}: AlchemistCompanionProps) {
  const { theme, isDark } = useTheme();
  const [currentPhrase, setCurrentPhrase] = useState('');
  const effectiveMood = PlayGiftConsumerMode ? mood : 'idle';
  const effectiveShowBubble = PlayGiftConsumerMode ? showBubble : false;
  
  // Animation values
  const bounce = useSharedValue(0);
  const wiggle = useSharedValue(0);
  const blink = useSharedValue(1);
  const wingFlap = useSharedValue(0);
  const bubbleScale = useSharedValue(0);
  
  const alchemistSize = SIZE_MAP[size];
  
  // Mood-based animations
  useEffect(() => {
    if (!PlayGiftConsumerMode) {
      bounce.value = 0;
      wiggle.value = 0;
      wingFlap.value = 0;
      blink.value = 1;
      return;
    }
    // Blinking animation
    blink.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2500 }),
        withTiming(0.1, { duration: 100 }),
        withTiming(1, { duration: 100 })
      ),
      -1,
      false
    );
    
    switch (effectiveMood) {
      case 'idle':
        bounce.value = withRepeat(
          withSequence(
            withTiming(-3, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
            withTiming(0, { duration: 1000, easing: Easing.inOut(Easing.ease) })
          ),
          -1,
          false
        );
        break;
        
      case 'happy':
      case 'excited':
        bounce.value = withRepeat(
          withSequence(
            withSpring(-8, motion.easing.bounce),
            withSpring(0, motion.easing.bounce)
          ),
          -1,
          false
        );
        wiggle.value = withRepeat(
          withSequence(
            withTiming(-5, { duration: 150 }),
            withTiming(5, { duration: 150 })
          ),
          -1,
          true
        );
        break;
        
      case 'thinking':
        wiggle.value = withRepeat(
          withSequence(
            withTiming(3, { duration: 800 }),
            withTiming(-3, { duration: 800 })
          ),
          -1,
          true
        );
        break;
        
      case 'celebrating':
        bounce.value = withRepeat(
          withSequence(
            withSpring(-15, motion.easing.snappy),
            withSpring(0, motion.easing.snappy)
          ),
          6,
          false
        );
        wingFlap.value = withRepeat(
          withSequence(
            withTiming(1, { duration: 100 }),
            withTiming(0, { duration: 100 })
          ),
          -1,
          false
        );
        break;
        
      case 'sleepy':
        bounce.value = withRepeat(
          withSequence(
            withTiming(-2, { duration: 2000 }),
            withTiming(0, { duration: 2000 })
          ),
          -1,
          false
        );
        blink.value = withRepeat(
          withSequence(
            withTiming(0.3, { duration: 1500 }),
            withTiming(0.5, { duration: 1500 })
          ),
          -1,
          true
        );
        break;
        
      case 'waving':
        wingFlap.value = withRepeat(
          withSequence(
            withTiming(1, { duration: 200 }),
            withTiming(0.3, { duration: 200 })
          ),
          5,
          false
        );
        break;
        
      case 'curious':
        wiggle.value = withSequence(
          withTiming(15, { duration: 300 }),
          withSpring(0, motion.easing.gentle)
        );
        break;
    }
    
    // Show bubble with delay
    if (effectiveShowBubble && (message || effectiveMood !== 'idle')) {
      bubbleScale.value = withDelay(
        300,
        withSpring(1, motion.easing.bounce)
      );
    }
    
    return () => {
      bounce.value = 0;
      wiggle.value = 0;
      wingFlap.value = 0;
    };
  }, [effectiveMood, message, effectiveShowBubble]);
  
  // Set phrase based on mood
  useEffect(() => {
    if (message) {
      setCurrentPhrase(message);
      return;
    }
    
    const phrases = effectiveMood === 'thinking' ? THINKING_PHRASES 
      : effectiveMood === 'celebrating' ? CELEBRATING_PHRASES 
      : IDLE_PHRASES;
    
    setCurrentPhrase(phrases[Math.floor(Math.random() * phrases.length)]);
  }, [effectiveMood, message]);
  
  // Animated styles
  const bodyStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: bounce.value },
      { rotate: `${wiggle.value}deg` },
    ],
  }));
  
  const eyeStyle = useAnimatedStyle(() => ({
    transform: [{ scaleY: blink.value }],
  }));
  
  const wingStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${interpolate(wingFlap.value, [0, 1], [0, -45])}deg` },
    ],
  }));
  
  const bubbleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: bubbleScale.value }],
    opacity: bubbleScale.value,
  }));
  
  const handlePress = useCallback(() => {
    // Quick wiggle on press
    wiggle.value = withSequence(
      withTiming(-10, { duration: 100 }),
      withTiming(10, { duration: 100 }),
      withTiming(0, { duration: 100 })
    );
    onPress?.();
  }, [onPress, wiggle]);
  
  // Companion colors
  const bodyColor = isDark ? '#4A5568' : '#718096';
  const beakColor = '#F6AD55';
  const eyeColor = isDark ? '#F7FAFC' : '#1A202C';
  const blushColor = '#FEB2B2';
  
  const containerStyle = [
    styles.container,
    floating && styles.floating,
    floating && position === 'left' && styles.floatingLeft,
    floating && position === 'right' && styles.floatingRight,
    floating && position === 'center' && styles.floatingCenter,
  ];
  
  return (
    <View style={containerStyle}>
      {/* Speech bubble */}
      {effectiveShowBubble && currentPhrase && (
        <Animated.View 
          style={[
            styles.bubble,
            { backgroundColor: isDark ? theme.colors.card : '#fff' },
            bubbleStyle,
          ]}
        >
          <Text style={[styles.bubbleText, { color: theme.colors.text }]}>
            {currentPhrase}
          </Text>
          <View 
            style={[
              styles.bubbleTail,
              { borderTopColor: isDark ? theme.colors.card : '#fff' },
            ]} 
          />
        </Animated.View>
      )}
      
      {/* The Alchemist */}
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.9}
        disabled={!onPress}
      >
        <Animated.View style={[styles.dodo, { width: alchemistSize, height: alchemistSize }, bodyStyle]}>
          {/* Body */}
          <View 
            style={[
              styles.body,
              {
                width: alchemistSize * 0.8,
                height: alchemistSize * 0.7,
                backgroundColor: bodyColor,
                borderRadius: alchemistSize * 0.35,
              },
            ]}
          >
            {/* Belly */}
            <View 
              style={[
                styles.belly,
                {
                  width: alchemistSize * 0.5,
                  height: alchemistSize * 0.4,
                  backgroundColor: isDark ? '#5A6578' : '#A0AEC0',
                  borderRadius: alchemistSize * 0.25,
                  bottom: alchemistSize * 0.05,
                },
              ]}
            />
          </View>
          
          {/* Head */}
          <View 
            style={[
              styles.head,
              {
                width: alchemistSize * 0.55,
                height: alchemistSize * 0.5,
                backgroundColor: bodyColor,
                borderRadius: alchemistSize * 0.275,
                top: -alchemistSize * 0.15,
              },
            ]}
          >
            {/* Eyes */}
            <View style={styles.eyes}>
              <Animated.View 
                style={[
                  styles.eye,
                  {
                    width: alchemistSize * 0.12,
                    height: alchemistSize * 0.12,
                    backgroundColor: '#fff',
                    borderRadius: alchemistSize * 0.06,
                  },
                  eyeStyle,
                ]}
              >
                <View 
                  style={[
                    styles.pupil,
                    {
                      width: alchemistSize * 0.06,
                      height: alchemistSize * 0.06,
                      backgroundColor: eyeColor,
                      borderRadius: alchemistSize * 0.03,
                    },
                  ]}
                />
              </Animated.View>
              <Animated.View 
                style={[
                  styles.eye,
                  {
                    width: alchemistSize * 0.12,
                    height: alchemistSize * 0.12,
                    backgroundColor: '#fff',
                    borderRadius: alchemistSize * 0.06,
                    marginLeft: alchemistSize * 0.08,
                  },
                  eyeStyle,
                ]}
              >
                <View 
                  style={[
                    styles.pupil,
                    {
                      width: alchemistSize * 0.06,
                      height: alchemistSize * 0.06,
                      backgroundColor: eyeColor,
                      borderRadius: alchemistSize * 0.03,
                    },
                  ]}
                />
              </Animated.View>
            </View>
            
            {/* Blush */}
            <View style={styles.blushContainer}>
              <View 
                style={[
                  styles.blush,
                  {
                    width: alchemistSize * 0.08,
                    height: alchemistSize * 0.04,
                    backgroundColor: blushColor,
                    borderRadius: alchemistSize * 0.02,
                    opacity: 0.6,
                  },
                ]}
              />
              <View 
                style={[
                  styles.blush,
                  {
                    width: alchemistSize * 0.08,
                    height: alchemistSize * 0.04,
                    backgroundColor: blushColor,
                    borderRadius: alchemistSize * 0.02,
                    opacity: 0.6,
                    marginLeft: alchemistSize * 0.2,
                  },
                ]}
              />
            </View>
            
            {/* Beak */}
            <View 
              style={[
                styles.beak,
                {
                  width: alchemistSize * 0.25,
                  height: alchemistSize * 0.15,
                  backgroundColor: beakColor,
                  borderRadius: alchemistSize * 0.05,
                  top: alchemistSize * 0.18,
                },
              ]}
            >
              <View 
                style={[
                  styles.beakTip,
                  {
                    width: alchemistSize * 0.08,
                    height: alchemistSize * 0.08,
                    backgroundColor: '#DD6B20',
                    borderRadius: alchemistSize * 0.04,
                    right: -alchemistSize * 0.02,
                  },
                ]}
              />
            </View>
            
            {/* Tuft/Crest */}
            <View 
              style={[
                styles.tuft,
                {
                  top: -alchemistSize * 0.08,
                },
              ]}
            >
              {[0, 1, 2].map((i) => (
                <View
                  key={i}
                  style={[
                    styles.feather,
                    {
                      width: alchemistSize * 0.03,
                      height: alchemistSize * 0.1,
                      backgroundColor: isDark ? '#6B7280' : '#9CA3AF',
                      borderRadius: alchemistSize * 0.015,
                      transform: [{ rotate: `${(i - 1) * 15}deg` }],
                      marginHorizontal: 1,
                    },
                  ]}
                />
              ))}
            </View>
          </View>
          
          {/* Wings */}
          <Animated.View 
            style={[
              styles.wing,
              styles.leftWing,
              {
                width: alchemistSize * 0.25,
                height: alchemistSize * 0.35,
                backgroundColor: isDark ? '#5A6578' : '#A0AEC0',
                borderRadius: alchemistSize * 0.125,
                left: -alchemistSize * 0.08,
              },
              wingStyle,
            ]}
          />
          <View 
            style={[
              styles.wing,
              styles.rightWing,
              {
                width: alchemistSize * 0.25,
                height: alchemistSize * 0.35,
                backgroundColor: isDark ? '#5A6578' : '#A0AEC0',
                borderRadius: alchemistSize * 0.125,
                right: -alchemistSize * 0.08,
                transform: [{ scaleX: -1 }],
              },
            ]}
          />
          
          {/* Feet */}
          <View style={styles.feet}>
            <View 
              style={[
                styles.foot,
                {
                  width: alchemistSize * 0.15,
                  height: alchemistSize * 0.08,
                  backgroundColor: beakColor,
                  borderRadius: alchemistSize * 0.04,
                },
              ]}
            />
            <View 
              style={[
                styles.foot,
                {
                  width: alchemistSize * 0.15,
                  height: alchemistSize * 0.08,
                  backgroundColor: beakColor,
                  borderRadius: alchemistSize * 0.04,
                  marginLeft: alchemistSize * 0.1,
                },
              ]}
            />
          </View>
          
          {/* Mood indicators */}
          {mood === 'thinking' && (
            <View style={[styles.thinkingDots, { top: -alchemistSize * 0.3 }]}>
              {[0, 1, 2].map((i) => (
                <Animated.View
                  key={i}
                  style={[
                    styles.dot,
                    {
                      width: alchemistSize * 0.06,
                      height: alchemistSize * 0.06,
                      backgroundColor: theme.colors.primary,
                      borderRadius: alchemistSize * 0.03,
                      marginLeft: i * alchemistSize * 0.08,
                      opacity: 0.4 + i * 0.2,
                    },
                  ]}
                />
              ))}
            </View>
          )}
          
          {mood === 'sleepy' && (
            <Text style={[styles.sleepyZ, { top: -alchemistSize * 0.25, fontSize: alchemistSize * 0.15 }]}>
              💤
            </Text>
          )}
          
          {(mood === 'celebrating' || mood === 'excited') && (
            <View style={[styles.sparkles, { top: -alchemistSize * 0.3 }]}>
              <Text style={{ fontSize: alchemistSize * 0.12 }}>✨</Text>
              <Text style={{ fontSize: alchemistSize * 0.1, marginLeft: alchemistSize * 0.1 }}>🌟</Text>
              <Text style={{ fontSize: alchemistSize * 0.08 }}>✨</Text>
            </View>
          )}
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  floating: {
    position: 'absolute',
    zIndex: 1000,
    bottom: 100,
  },
  floatingLeft: {
    left: spacing.md,
  },
  floatingRight: {
    right: spacing.md,
  },
  floatingCenter: {
    alignSelf: 'center',
  },
  bubble: {
    maxWidth: 200,
    padding: spacing.sm,
    borderRadius: radii.lg,
    marginBottom: spacing.xs,
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
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      },
    }),
  },
  bubbleText: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
    textAlign: 'center',
    lineHeight: typography.size.sm * typography.lineHeight.normal,
  },
  bubbleTail: {
    position: 'absolute',
    bottom: -8,
    alignSelf: 'center',
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  dodo: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  belly: {
    position: 'absolute',
  },
  head: {
    position: 'absolute',
    alignItems: 'center',
  },
  eyes: {
    flexDirection: 'row',
    marginTop: '20%',
  },
  eye: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pupil: {},
  blushContainer: {
    flexDirection: 'row',
    marginTop: 2,
  },
  blush: {},
  beak: {
    position: 'absolute',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  beakTip: {
    position: 'absolute',
  },
  tuft: {
    position: 'absolute',
    flexDirection: 'row',
  },
  feather: {},
  wing: {
    position: 'absolute',
  },
  leftWing: {
    top: '30%',
    transformOrigin: 'top right',
  },
  rightWing: {
    top: '30%',
  },
  feet: {
    position: 'absolute',
    bottom: -5,
    flexDirection: 'row',
  },
  foot: {},
  thinkingDots: {
    position: 'absolute',
    flexDirection: 'row',
  },
  dot: {},
  sleepyZ: {
    position: 'absolute',
  },
  sparkles: {
    position: 'absolute',
    flexDirection: 'row',
  },
});
