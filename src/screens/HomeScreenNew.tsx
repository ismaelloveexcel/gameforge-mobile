/**
 * HomeScreen - Winter Majlis Edition
 * 
 * FORGE-CHIEF MANDATE:
 * - ONE dominant action visible in ≤3 seconds
 * - User takes action in ≤10 seconds
 * - Progress/delight in ≤30 seconds
 * 
 * Active Theme: Winter Majlis (January 2026)
 * Mood: Cozy gatherings, intimate luxury, warmth
 */
import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  withSpring,
  Easing,
  FadeIn,
  FadeInDown,
  FadeInUp,
  SlideInUp,
} from 'react-native-reanimated';
import { useTheme } from '../contexts/ThemeContext';
import { RootStackParamList } from '../types';
import { 
  LivingGradient, 
  DodoCompanion, 
  ForgeCard, 
  ParticleField,
} from '../components';
import { spacing, typography, radii } from '../design-tokens/theme';

type NavigationProp = StackNavigationProp<RootStackParamList>;
const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

// Winter Majlis greetings
const getWinterGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 6) return "Late night creativity? Perfect time to create something special";
  if (hour < 12) return "Good morning — let's make someone's day";
  if (hour < 17) return "Afternoon warmth — perfect for thoughtful gifts";
  if (hour < 21) return "Evening gatherings inspire the best gifts";
  return "Cozy nights are made for creating magic";
};

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { theme, isDark, seasonalTheme } = useTheme();
  const [dodoMood, setDodoMood] = useState<'idle' | 'waving' | 'excited' | 'curious'>('waving');
  const [greeting] = useState(getWinterGreeting());
  
  // Winter Majlis colors from seasonal theme
  const winterColors = seasonalTheme.colors;
  
  // Animations - slower for cozy Winter Majlis feel
  const glow = useSharedValue(0.4);
  const heroFloat = useSharedValue(0);
  const pulseScale = useSharedValue(1);
  const shimmer = useSharedValue(0);
  
  useEffect(() => {
    // Gentle gold glow pulse - like candlelight
    glow.value = withRepeat(
      withSequence(
        withTiming(0.8, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.4, { duration: 3000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
    
    // Gentle float for hero card - like warmth rising
    heroFloat.value = withRepeat(
      withSequence(
        withTiming(-6, { duration: 3500, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 3500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
    
    // Subtle pulse for CTA
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.02, { duration: 2000 }),
        withTiming(1, { duration: 2000 })
      ),
      -1,
      false
    );
    
    // Shimmer effect
    shimmer.value = withRepeat(
      withTiming(1, { duration: 4000 }),
      -1,
      false
    );
    
    // Dodo waves, then relaxes
    const timeout = setTimeout(() => setDodoMood('idle'), 2500);
    return () => clearTimeout(timeout);
  }, [glow, heroFloat, pulseScale, shimmer]);
  
  const glowStyle = useAnimatedStyle(() => ({
    opacity: glow.value,
  }));
  
  const heroFloatStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: heroFloat.value }],
  }));
  
  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  const handleDodoPress = useCallback(() => {
    setDodoMood('excited');
    setTimeout(() => setDodoMood('idle'), 2000);
  }, []);

  const handleCreateGift = useCallback(() => {
    navigation.navigate('GiftForgeWizard');
  }, [navigation]);

  // Secondary actions - hidden below fold
  const secondaryActions = [
    {
      icon: 'folder-heart-outline',
      title: 'My Creations',
      onPress: () => navigation.navigate('Projects'),
      color: winterColors.secondary,
    },
    {
      icon: 'view-grid-outline',
      title: 'Templates',
      onPress: () => navigation.navigate('Templates'),
      color: winterColors.primary,
    },
    {
      icon: 'bird',
      title: 'Dodo Helper',
      onPress: () => {
        setDodoMood('excited');
        navigation.navigate('Genie');
      },
      color: winterColors.accent,
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: winterColors.background }]}>
      {/* Warm ambient gradient */}
      <View style={[styles.ambientGlow, { backgroundColor: winterColors.primary }]} />
      
      <ParticleField density="sparse">
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Minimal Header with Dodo */}
          <Animated.View 
            entering={FadeInDown.duration(600).delay(100)}
            style={styles.header}
          >
            <View style={styles.headerLeft}>
              <Text style={[styles.brandMark, { color: winterColors.accent }]}>
                GameForge
              </Text>
              <View style={styles.seasonBadge}>
                <Text style={[styles.seasonText, { color: winterColors.muted }]}>
                  {seasonalTheme.name}
                </Text>
              </View>
            </View>
            
            <Animated.View style={heroFloatStyle}>
              <DodoCompanion
                mood={dodoMood}
                size="small"
                message={greeting}
                onPress={handleDodoPress}
                showBubble={true}
              />
            </Animated.View>
          </Animated.View>

          {/* 
            HERO SECTION - THE DOMINANT ACTION
            Takes up ~60% of above-fold space
            ONE thing to do: Create a Gift
          */}
          <Animated.View 
            entering={SlideInUp.duration(800).delay(200)}
            style={[styles.heroSection, heroFloatStyle]}
          >
            <TouchableOpacity 
              activeOpacity={0.95}
              onPress={handleCreateGift}
              style={styles.heroTouchable}
            >
              {/* Glowing border effect - like candlelight */}
              <Animated.View 
                style={[
                  styles.heroGlowBorder,
                  { borderColor: winterColors.accent },
                  glowStyle
                ]} 
              />
              
              <View style={[
                styles.heroCard,
                { 
                  backgroundColor: winterColors.surface,
                  borderColor: winterColors.accent + '40',
                }
              ]}>
                {/* Decorative corner accents */}
                <View style={[styles.cornerAccent, styles.cornerTopLeft, { backgroundColor: winterColors.accent }]} />
                <View style={[styles.cornerAccent, styles.cornerTopRight, { backgroundColor: winterColors.accent }]} />
                <View style={[styles.cornerAccent, styles.cornerBottomLeft, { backgroundColor: winterColors.accent }]} />
                <View style={[styles.cornerAccent, styles.cornerBottomRight, { backgroundColor: winterColors.accent }]} />
                
                {/* Hero Icon */}
                <View style={styles.heroIconContainer}>
                  <View style={[styles.heroIconGlow, { backgroundColor: winterColors.accent + '30' }]}>
                    <View style={[styles.heroIconInner, { backgroundColor: winterColors.accent }]}>
                      <Icon name="gift" size={48} color={winterColors.background} />
                    </View>
                  </View>
                </View>
                
                {/* Hero Copy */}
                <Text style={[styles.heroTitle, { color: winterColors.text }]}>
                  Create a Gift
                </Text>
                <Text style={[styles.heroSubtitle, { color: winterColors.text }]}>
                  for Someone You Love
                </Text>
                
                <Text style={[styles.heroDescription, { color: winterColors.muted }]}>
                  A personalized mini-game they'll actually remember
                </Text>
                
                {/* CTA Button */}
                <Animated.View style={[styles.ctaContainer, pulseStyle]}>
                  <View style={[styles.ctaButton, { backgroundColor: winterColors.accent }]}>
                    <Text style={[styles.ctaText, { color: winterColors.background }]}>
                      Start Creating
                    </Text>
                    <Icon name="arrow-right" size={20} color={winterColors.background} />
                  </View>
                </Animated.View>
                
                {/* Trust signal */}
                <Text style={[styles.trustSignal, { color: winterColors.muted }]}>
                  Takes 60 seconds
                </Text>
              </View>
            </TouchableOpacity>
          </Animated.View>

          {/* Divider with label */}
          <Animated.View 
            entering={FadeIn.delay(600)}
            style={styles.dividerSection}
          >
            <View style={[styles.dividerLine, { backgroundColor: winterColors.muted + '30' }]} />
            <Text style={[styles.dividerText, { color: winterColors.muted }]}>
              or explore
            </Text>
            <View style={[styles.dividerLine, { backgroundColor: winterColors.muted + '30' }]} />
          </Animated.View>

          {/* Secondary Actions - Below the fold */}
          <Animated.View 
            entering={FadeInUp.duration(500).delay(700)}
            style={styles.secondarySection}
          >
            <View style={styles.secondaryActions}>
              {secondaryActions.map((action, index) => (
                <AnimatedTouchable
                  key={action.title}
                  entering={FadeInUp.duration(400).delay(800 + index * 100)}
                  style={styles.secondaryAction}
                  onPress={action.onPress}
                  activeOpacity={0.8}
                >
                  <View style={[
                    styles.secondaryCard,
                    { 
                      backgroundColor: winterColors.surface,
                      borderColor: action.color + '30',
                    }
                  ]}>
                    <View style={[styles.secondaryIcon, { backgroundColor: action.color + '20' }]}>
                      <Icon name={action.icon} size={24} color={action.color} />
                    </View>
                    <Text style={[styles.secondaryText, { color: winterColors.text }]}>
                      {action.title}
                    </Text>
                  </View>
                </AnimatedTouchable>
              ))}
            </View>
          </Animated.View>

          {/* Minimal footer with settings */}
          <Animated.View 
            entering={FadeIn.delay(1000)}
            style={styles.footer}
          >
            <TouchableOpacity 
              style={styles.settingsButton}
              onPress={() => navigation.navigate('Settings')}
            >
              <Icon name="cog-outline" size={20} color={winterColors.muted} />
              <Text style={[styles.settingsText, { color: winterColors.muted }]}>
                Settings
              </Text>
            </TouchableOpacity>
          </Animated.View>
          
          {/* Bottom spacing for tab bar */}
          <View style={{ height: 100 }} />
        </ScrollView>
      </ParticleField>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  ambientGlow: {
    position: 'absolute',
    top: -100,
    left: -50,
    width: SCREEN_WIDTH + 100,
    height: 300,
    opacity: 0.08,
    borderRadius: 200,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xxl,
  },
  
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: spacing.lg,
    paddingTop: 60,
    paddingBottom: spacing.md,
  },
  headerLeft: {
    flex: 1,
  },
  brandMark: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.black,
    letterSpacing: typography.letterSpacing.tight,
  },
  seasonBadge: {
    marginTop: spacing.xxs,
  },
  seasonText: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.medium,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  
  // Hero Section - THE DOMINANT ACTION
  heroSection: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    minHeight: SCREEN_HEIGHT * 0.5, // Takes up half the screen
  },
  heroTouchable: {
    position: 'relative',
  },
  heroGlowBorder: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: radii.xxl + 2,
    borderWidth: 2,
  },
  heroCard: {
    borderRadius: radii.xxl,
    borderWidth: 1,
    paddingVertical: spacing.xxxl,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  cornerAccent: {
    position: 'absolute',
    width: 20,
    height: 2,
  },
  cornerTopLeft: {
    top: spacing.md,
    left: spacing.md,
  },
  cornerTopRight: {
    top: spacing.md,
    right: spacing.md,
  },
  cornerBottomLeft: {
    bottom: spacing.md,
    left: spacing.md,
  },
  cornerBottomRight: {
    bottom: spacing.md,
    right: spacing.md,
  },
  heroIconContainer: {
    marginBottom: spacing.lg,
  },
  heroIconGlow: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroIconInner: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTitle: {
    fontSize: typography.size.xxl,
    fontWeight: typography.weight.black,
    letterSpacing: typography.letterSpacing.tight,
    textAlign: 'center',
    marginBottom: spacing.xxs,
  },
  heroSubtitle: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.medium,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  heroDescription: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.regular,
    textAlign: 'center',
    lineHeight: typography.size.base * typography.lineHeight.relaxed,
    maxWidth: 280,
    marginBottom: spacing.xl,
  },
  ctaContainer: {
    marginBottom: spacing.md,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: radii.full,
    gap: spacing.xs,
    ...Platform.select({
      web: { 
        boxShadow: '0 4px 20px rgba(212, 175, 55, 0.4)',
        cursor: 'pointer',
      },
      default: { 
        elevation: 8,
        shadowColor: '#D4AF37',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
      }
    }),
  },
  ctaText: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.bold,
    letterSpacing: typography.letterSpacing.normal,
  },
  trustSignal: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
  },
  
  // Divider
  dividerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xl,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    paddingHorizontal: spacing.md,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
  },
  
  // Secondary Actions
  secondarySection: {
    paddingHorizontal: spacing.lg,
  },
  secondaryActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  secondaryAction: {
    flex: 1,
  },
  secondaryCard: {
    borderRadius: radii.lg,
    borderWidth: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    alignItems: 'center',
  },
  secondaryIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  secondaryText: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.semibold,
    textAlign: 'center',
  },
  
  // Footer
  footer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    alignItems: 'center',
  },
  settingsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  settingsText: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
  },
});
