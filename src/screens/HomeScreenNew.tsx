/**
 * HomeScreen - Dynamic Seasonal Edition
 * 
 * FORGE-CHIEF MANDATE:
 * - ONE dominant action visible in ≤3 seconds
 * - User takes action in ≤10 seconds
 * - Progress/delight in ≤30 seconds
 * 
 * Supports: Valentine's, Winter Majlis, and all seasonal themes
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
  Modal,
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
import { useTheme, THEME_OPTIONS, ThemeChoice } from '../contexts/ThemeContext';
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

// Theme-aware greetings
const getThemeGreeting = (themeId: string) => {
  const hour = new Date().getHours();
  const isNight = hour < 6 || hour >= 21;
  const isMorning = hour >= 6 && hour < 12;
  const isAfternoon = hour >= 12 && hour < 17;
  
  // Valentine's / Romance greetings
  if (themeId === 'eternal-romance') {
    if (isNight) return "Love knows no hour — create something unforgettable";
    if (isMorning) return "Start the day with a gesture of love";
    if (isAfternoon) return "An afternoon to craft something from the heart";
    return "Romance is in the air — make it memorable";
  }
  
  // Winter Majlis greetings
  if (themeId === 'winter-majlis') {
    if (isNight) return "Late night creativity? Perfect time to create something special";
    if (isMorning) return "Good morning — let's make someone's day";
    if (isAfternoon) return "Afternoon warmth — perfect for thoughtful gifts";
    return "Cozy nights are made for creating magic";
  }
  
  // Neon Summer greetings
  if (themeId === 'neon-dubai-summer') {
    if (isNight) return "The city never sleeps — neither does creativity";
    if (isMorning) return "Beat the heat with something cool";
    if (isAfternoon) return "Pool vibes, creative energy";
    return "Summer nights call for bold moves";
  }
  
  // Default creative greeting
  if (isNight) return "Midnight inspiration strikes";
  if (isMorning) return "A fresh canvas awaits";
  if (isAfternoon) return "Perfect time to create";
  return "Let your creativity flow";
};

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { theme, isDark, seasonalTheme, themeChoice, setThemeChoice } = useTheme();
  const [dodoMood, setDodoMood] = useState<'idle' | 'waving' | 'excited' | 'curious'>('waving');
  const [showThemePicker, setShowThemePicker] = useState(false);
  const greeting = getThemeGreeting(seasonalTheme.id);
  
  // Dynamic colors from current seasonal theme
  const themeColors = seasonalTheme.colors;
  
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
      color: themeColors.secondary,
    },
    {
      icon: 'view-grid-outline',
      title: 'Templates',
      onPress: () => navigation.navigate('Templates'),
      color: themeColors.primary,
    },
    {
      icon: 'bird',
      title: 'Dodo Helper',
      onPress: () => {
        setDodoMood('excited');
        navigation.navigate('Genie');
      },
      color: themeColors.accent,
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      {/* Warm ambient gradient */}
      <View style={[styles.ambientGlow, { backgroundColor: themeColors.primary }]} />
      
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
              <Text style={[styles.brandMark, { color: themeColors.accent }]}>
                GameForge
              </Text>
            <TouchableOpacity 
              style={[styles.seasonBadge, { borderColor: themeColors.accent + '40' }]}
              onPress={() => setShowThemePicker(true)}
              activeOpacity={0.7}
            >
              <Text style={[styles.seasonText, { color: themeColors.accent }]}>
                {seasonalTheme.name}
              </Text>
              <Icon name="chevron-down" size={12} color={themeColors.accent} />
            </TouchableOpacity>
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
                  { borderColor: themeColors.accent },
                  glowStyle
                ]} 
              />
              
              <View style={[
                styles.heroCard,
                { 
                  backgroundColor: themeColors.surface,
                  borderColor: themeColors.accent + '40',
                }
              ]}>
                {/* Decorative corner accents */}
                <View style={[styles.cornerAccent, styles.cornerTopLeft, { backgroundColor: themeColors.accent }]} />
                <View style={[styles.cornerAccent, styles.cornerTopRight, { backgroundColor: themeColors.accent }]} />
                <View style={[styles.cornerAccent, styles.cornerBottomLeft, { backgroundColor: themeColors.accent }]} />
                <View style={[styles.cornerAccent, styles.cornerBottomRight, { backgroundColor: themeColors.accent }]} />
                
                {/* Hero Icon */}
                <View style={styles.heroIconContainer}>
                  <View style={[styles.heroIconGlow, { backgroundColor: themeColors.accent + '30' }]}>
                    <View style={[styles.heroIconInner, { backgroundColor: themeColors.accent }]}>
                      <Icon name="gift" size={48} color={themeColors.background} />
                    </View>
                  </View>
                </View>
                
                {/* Hero Copy */}
                <Text style={[styles.heroTitle, { color: themeColors.text }]}>
                  Create a Gift
                </Text>
                <Text style={[styles.heroSubtitle, { color: themeColors.text }]}>
                  for Someone You Love
                </Text>
                
                <Text style={[styles.heroDescription, { color: themeColors.muted }]}>
                  A personalized mini-game they'll actually remember
                </Text>
                
                {/* CTA Button */}
                <Animated.View style={[styles.ctaContainer, pulseStyle]}>
                  <View style={[styles.ctaButton, { backgroundColor: themeColors.accent }]}>
                    <Text style={[styles.ctaText, { color: themeColors.background }]}>
                      Start Creating
                    </Text>
                    <Icon name="arrow-right" size={20} color={themeColors.background} />
                  </View>
                </Animated.View>
                
                {/* Trust signal */}
                <Text style={[styles.trustSignal, { color: themeColors.muted }]}>
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
            <View style={[styles.dividerLine, { backgroundColor: themeColors.muted + '30' }]} />
            <Text style={[styles.dividerText, { color: themeColors.muted }]}>
              or explore
            </Text>
            <View style={[styles.dividerLine, { backgroundColor: themeColors.muted + '30' }]} />
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
                      backgroundColor: themeColors.surface,
                      borderColor: action.color + '30',
                    }
                  ]}>
                    <View style={[styles.secondaryIcon, { backgroundColor: action.color + '20' }]}>
                      <Icon name={action.icon} size={24} color={action.color} />
                    </View>
                    <Text style={[styles.secondaryText, { color: themeColors.text }]}>
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
              <Icon name="cog-outline" size={20} color={themeColors.muted} />
              <Text style={[styles.settingsText, { color: themeColors.muted }]}>
                Settings
              </Text>
            </TouchableOpacity>
          </Animated.View>
          
          {/* Bottom spacing for tab bar */}
          <View style={{ height: 100 }} />
        </ScrollView>
      </ParticleField>
      
      {/* Theme Picker Modal */}
      <Modal
        visible={showThemePicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowThemePicker(false)}
      >
        <View style={styles.modalOverlay}>
          {/* Backdrop - tapping closes modal */}
          <TouchableOpacity 
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={() => setShowThemePicker(false)}
          />
          
          {/* Theme Picker Content - stops propagation */}
          <Animated.View 
            entering={FadeInUp.duration(300)}
            style={[styles.themePicker, { backgroundColor: themeColors.surface }]}
          >
            <Text style={[styles.themePickerTitle, { color: themeColors.text }]}>
              Choose Your Vibe
            </Text>
            
            {THEME_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.themeOption,
                  themeChoice === option.id && { 
                    backgroundColor: themeColors.accent + '20',
                    borderColor: themeColors.accent,
                  },
                ]}
                onPress={() => {
                  setThemeChoice(option.id);
                  setShowThemePicker(false);
                }}
                activeOpacity={0.7}
              >
                <View style={styles.themeOptionContent}>
                  <Text style={[
                    styles.themeOptionLabel, 
                    { color: themeChoice === option.id ? themeColors.accent : themeColors.text }
                  ]}>
                    {option.label}
                  </Text>
                  <Text style={[styles.themeOptionDesc, { color: themeColors.muted }]}>
                    {option.description}
                  </Text>
                </View>
                {themeChoice === option.id && (
                  <Icon name="check" size={20} color={themeColors.accent} />
                )}
              </TouchableOpacity>
            ))}
          </Animated.View>
        </View>
      </Modal>
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
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
    paddingVertical: spacing.xxs,
    paddingHorizontal: spacing.sm,
    borderRadius: radii.full,
    borderWidth: 1,
    gap: 4,
  },
  seasonText: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
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
  
  // Modal & Theme Picker
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  themePicker: {
    width: '100%',
    maxWidth: 340,
    borderRadius: radii.xl,
    padding: spacing.lg,
  },
  themePickerTitle: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  themeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: 'transparent',
    marginBottom: spacing.xs,
  },
  themeOptionContent: {
    flex: 1,
  },
  themeOptionLabel: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.semibold,
  },
  themeOptionDesc: {
    fontSize: typography.size.sm,
    marginTop: 2,
  },
});
