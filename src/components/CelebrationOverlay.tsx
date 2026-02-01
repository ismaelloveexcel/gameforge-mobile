/**
 * CelebrationOverlay - Magical celebration moments! 🎉
 * Confetti, particles, and joy for achievements
 */
import React, { useEffect, useState, memo } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Platform,
  Text,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSpring,
  withRepeat,
  Easing,
} from 'react-native-reanimated';
import { spacing, motion, forgeColors } from '../design-tokens/theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface Particle {
  id: number;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  color: string;
  emoji?: string;
  delay: number;
  duration: number;
}

interface CelebrationOverlayProps {
  visible: boolean;
  type?: 'confetti' | 'fireworks' | 'sparkles' | 'hearts' | 'stars';
  message?: string;
  subMessage?: string;
  duration?: number;
  onComplete?: () => void;
}

const CONFETTI_COLORS = [
  forgeColors.ember[500],
  forgeColors.forge[500],
  forgeColors.spark[500],
  forgeColors.moss[500],
  forgeColors.gold[500],
  '#fff',
];

const EMOJIS = {
  confetti: ['🎉', '🎊', '✨', '🌟', '⭐'],
  fireworks: ['🎆', '🎇', '✨', '💫', '🌟'],
  sparkles: ['✨', '💫', '⭐', '🌟', '💎'],
  hearts: ['❤️', '💕', '💖', '💝', '💗'],
  stars: ['⭐', '🌟', '💫', '✨', '🌠'],
};

const generateParticles = (count: number, type: string): Particle[] => {
  const particles: Particle[] = [];
  const emojis = EMOJIS[type as keyof typeof EMOJIS] || EMOJIS.confetti;
  
  for (let i = 0; i < count; i++) {
    particles.push({
      id: i,
      x: Math.random() * SCREEN_WIDTH,
      y: -50 - Math.random() * 100,
      rotation: Math.random() * 360,
      scale: 0.5 + Math.random() * 1,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      delay: Math.random() * 500,
      duration: 2000 + Math.random() * 2000,
    });
  }
  
  return particles;
};

const ConfettiPiece = memo(({ particle }: { particle: Particle }) => {
  const translateY = useSharedValue(particle.y);
  const translateX = useSharedValue(particle.x);
  const rotation = useSharedValue(particle.rotation);
  const opacity = useSharedValue(1);
  
  useEffect(() => {
    translateY.value = withDelay(
      particle.delay,
      withTiming(SCREEN_HEIGHT + 100, {
        duration: particle.duration,
        easing: Easing.out(Easing.quad),
      })
    );
    
    translateX.value = withDelay(
      particle.delay,
      withTiming(particle.x + (Math.random() - 0.5) * 200, {
        duration: particle.duration,
        easing: Easing.inOut(Easing.sin),
      })
    );
    
    rotation.value = withDelay(
      particle.delay,
      withTiming(particle.rotation + 720, {
        duration: particle.duration,
        easing: Easing.linear,
      })
    );
    
    opacity.value = withDelay(
      particle.delay + particle.duration * 0.7,
      withTiming(0, { duration: particle.duration * 0.3 })
    );
  }, []);
  
  const style = useAnimatedStyle(() => ({
    position: 'absolute',
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${rotation.value}deg` },
      { scale: particle.scale },
    ],
    opacity: opacity.value,
  }));
  
  if (particle.emoji) {
    return (
      <Animated.Text style={[styles.emoji, style]}>
        {particle.emoji}
      </Animated.Text>
    );
  }
  
  return (
    <Animated.View
      style={[
        styles.confettiPiece,
        {
          backgroundColor: particle.color,
          width: 8 + Math.random() * 8,
          height: 8 + Math.random() * 8,
          borderRadius: Math.random() > 0.5 ? 100 : 2,
        },
        style,
      ]}
    />
  );
});

export default function CelebrationOverlay({
  visible,
  type = 'confetti',
  message,
  subMessage,
  duration = 3000,
  onComplete,
}: CelebrationOverlayProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [showContent, setShowContent] = useState(false);
  
  const overlayOpacity = useSharedValue(0);
  const messageScale = useSharedValue(0);
  
  useEffect(() => {
    if (visible) {
      setParticles(generateParticles(50, type));
      setShowContent(true);
      
      overlayOpacity.value = withTiming(1, { duration: 200 });
      messageScale.value = withDelay(
        300,
        withSpring(1, motion.easing.bounce)
      );
      
      // Auto-hide after duration
      const timeout = setTimeout(() => {
        overlayOpacity.value = withTiming(0, { duration: 500 });
        messageScale.value = withTiming(0, { duration: 300 });
        
        setTimeout(() => {
          setShowContent(false);
          setParticles([]);
          onComplete?.();
        }, 500);
      }, duration);
      
      return () => clearTimeout(timeout);
    }
  }, [visible, type, duration, onComplete, overlayOpacity, messageScale]);
  
  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));
  
  const messageStyle = useAnimatedStyle(() => ({
    transform: [{ scale: messageScale.value }],
  }));
  
  if (!showContent) return null;
  
  return (
    <Animated.View style={[styles.overlay, overlayStyle]} pointerEvents="none">
      {/* Particles */}
      <View style={styles.particleContainer}>
        {particles.map((particle) => (
          <ConfettiPiece key={particle.id} particle={particle} />
        ))}
      </View>
      
      {/* Message */}
      {message && (
        <Animated.View style={[styles.messageContainer, messageStyle]}>
          <View style={styles.messageBubble}>
            <Text style={styles.messageText}>{message}</Text>
            {subMessage && (
              <Text style={styles.subMessageText}>{subMessage}</Text>
            )}
          </View>
        </Animated.View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  particleContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  confettiPiece: {
    position: 'absolute',
  },
  emoji: {
    fontSize: 24,
  },
  messageContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageBubble: {
    backgroundColor: 'rgba(0,0,0,0.85)',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    borderRadius: 24,
    alignItems: 'center',
    maxWidth: SCREEN_WIDTH * 0.8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
      },
    }),
  },
  messageText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  subMessageText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});
