/**
 * HomeScreen - The Forge's welcoming entrance 🏠
 * Features: Living gradients, Dodo companion, emotional UI, celebration moments
 */
import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
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
  Easing,
  FadeInDown,
  FadeInUp,
} from 'react-native-reanimated';
import { useTheme } from '../contexts/ThemeContext';
import { RootStackParamList } from '../types';
import { 
  LivingGradient, 
  DodoCompanion, 
  ForgeCard, 
  ParticleField,
  CelebrationOverlay,
} from '../components';
import { spacing, typography, radii, forgeColors } from '../design-tokens/theme';

type NavigationProp = StackNavigationProp<RootStackParamList>;
const _screenDimensions = Dimensions.get('window');

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

// Dodo's context-aware greetings
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 5) return "Burning the midnight oil? Let's create something magical! 🌙";
  if (hour < 12) return "Good morning! Ready to forge some dreams? ☀️";
  if (hour < 17) return "Afternoon creative session? I'm in! 🌤️";
  if (hour < 21) return "Evening vibes! Perfect time to build something special ✨";
  return "Night owl mode activated! Let's make something cool 🦉";
};

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { theme, isDark } = useTheme();
  const [dodoMood, setDodoMood] = useState<'idle' | 'waving' | 'excited' | 'curious'>('waving');
  const [showCelebration, setShowCelebration] = useState(false);
  const [greeting] = useState(getGreeting());
  
  // Animations
  const glow = useSharedValue(0);
  const sparkle = useSharedValue(0);
  const heroFloat = useSharedValue(0);
  
  useEffect(() => {
    // Glow pulse for dark mode
    glow.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2000 }),
        withTiming(0.4, { duration: 2000 })
      ),
      -1,
      false
    );
    
    // Sparkle rotation
    sparkle.value = withRepeat(
      withTiming(360, { duration: 6000, easing: Easing.linear }),
      -1,
      false
    );
    
    // Hero float
    heroFloat.value = withRepeat(
      withSequence(
        withTiming(-8, { duration: 2500, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 2500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
    
    // Dodo waves on entry, then becomes idle
    const timeout = setTimeout(() => setDodoMood('idle'), 3000);
    return () => clearTimeout(timeout);
  }, [glow, sparkle, heroFloat]);
  
  const glowStyle = useAnimatedStyle(() => ({
    opacity: isDark ? glow.value * 0.3 : 0,
  }));
  
  const sparkleStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${sparkle.value}deg` }],
  }));
  
  const heroFloatStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: heroFloat.value }],
  }));

  // Feature cards - renamed from "AI" focused terminology
  const features = [
    {
      icon: 'gift',
      title: 'Gift Games',
      description: 'Create personalized mini-games for loved ones',
      onPress: () => navigation.navigate('GiftForgeWizard'),
      highlight: true,
      color: forgeColors.spark[500],
    },
    {
      icon: 'view-grid-plus',
      title: 'Game Templates',
      description: '15 ready-to-customize game blueprints',
      onPress: () => navigation.navigate('Templates'),
      color: forgeColors.forge[500],
    },
    {
      icon: 'bird', // Dodo reference!
      title: 'Dodo Helper',
      description: 'Your friendly forge companion',
      onPress: () => {
        setDodoMood('excited');
        navigation.navigate('Genie'); // Still uses old route name for now
      },
      color: forgeColors.gold[500],
    },
    {
      icon: 'palette',
      title: 'Art Styles',
      description: '5 signature visual themes',
      onPress: () => navigation.navigate('Templates'),
      color: forgeColors.moss[500],
    },
    {
      icon: 'cube-outline',
      title: 'VR Worlds',
      description: 'Create immersive 3D experiences',
      onPress: () => navigation.navigate('Templates'),
      color: forgeColors.ember[500],
    },
  ];

  const quickActions = [
    {
      icon: 'gift-outline',
      title: 'Gift Game',
      color: forgeColors.spark[500],
      onPress: () => navigation.navigate('GiftForgeWizard'),
    },
    {
      icon: 'plus-circle-outline',
      title: 'New Project',
      color: forgeColors.forge[500],
      onPress: () => navigation.navigate('Templates'),
    },
    {
      icon: 'folder-outline',
      title: 'My Projects',
      color: forgeColors.gold[500],
      onPress: () => navigation.navigate('Projects'),
    },
  ];

  const handleDodoPress = useCallback(() => {
    setDodoMood('excited');
    setTimeout(() => setDodoMood('idle'), 2000);
  }, []);

  return (
    <LivingGradient intensity="subtle">
      <ParticleField density="sparse">
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header with Dodo */}
          <Animated.View 
            entering={FadeInDown.duration(600).delay(100)}
            style={styles.header}
          >
            <View style={styles.headerContent}>
              <Text style={[styles.title, { color: theme.colors.text }]}>
                GameForge
              </Text>
              <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>
                Where ideas become playable
              </Text>
            </View>
            
            {/* Floating Dodo */}
            <Animated.View style={[styles.headerDodo, heroFloatStyle]}>
              <DodoCompanion
                mood={dodoMood}
                size="small"
                message={greeting}
                onPress={handleDodoPress}
                showBubble={true}
              />
            </Animated.View>
          </Animated.View>

          {/* Hero Card - GiftForge spotlight */}
          <Animated.View entering={FadeInUp.duration(700).delay(200)}>
            <TouchableOpacity 
              activeOpacity={0.95}
              onPress={() => navigation.navigate('GiftForgeWizard')}
            >
              <ForgeCard
                glowColor={forgeColors.spark[500]}
                glowIntensity="intense"
                variant="elevated"
                style={styles.heroCard}
              >
                {/* Glow effect */}
                <Animated.View 
                  style={[
                    styles.heroGlow,
                    { backgroundColor: forgeColors.spark[500] },
                    glowStyle
                  ]} 
                />
                
                <View style={styles.heroContent}>
                  {/* Icon cluster */}
                  <View style={styles.heroIconArea}>
                    <View style={[styles.heroIconOuter, { backgroundColor: forgeColors.spark[500] + '20' }]}>
                      <View style={[styles.heroIconInner, { backgroundColor: forgeColors.spark[500] }]}>
                        <Icon name="gift" size={32} color="#fff" />
                      </View>
                    </View>
                    <Animated.View style={[styles.heroSparkle, sparkleStyle]}>
                      <Text style={styles.sparkleEmoji}>✨</Text>
                    </Animated.View>
                    
                    {/* NEW badge */}
                    <View style={[styles.newBadge, { backgroundColor: forgeColors.moss[500] }]}>
                      <Text style={styles.newBadgeText}>NEW</Text>
                    </View>
                  </View>
                  
                  {/* Text content */}
                  <View style={styles.heroTextArea}>
                    <Text style={[styles.heroTitle, { color: theme.colors.text }]}>
                      Create a Gift Game 🎁
                    </Text>
                    <Text style={[styles.heroDescription, { color: theme.colors.textMuted }]}>
                      Personalized mini-games for birthdays, anniversaries & special moments
                    </Text>
                    
                    {/* Feature pills */}
                    <View style={styles.heroPills}>
                      <View style={[styles.pill, { backgroundColor: forgeColors.spark[500] + '15' }]}>
                        <Text style={[styles.pillText, { color: forgeColors.spark[500] }]}>🎮 5 Game Types</Text>
                      </View>
                      <View style={[styles.pill, { backgroundColor: forgeColors.forge[500] + '15' }]}>
                        <Text style={[styles.pillText, { color: forgeColors.forge[500] }]}>⚡ Instant Magic</Text>
                      </View>
                    </View>
                  </View>
                  
                  {/* Arrow */}
                  <View style={[styles.heroArrow, { backgroundColor: forgeColors.spark[500] }]}>
                    <Icon name="arrow-right" size={20} color="#fff" />
                  </View>
                </View>
              </ForgeCard>
            </TouchableOpacity>
          </Animated.View>

          {/* Quick Actions */}
          <Animated.View 
            entering={FadeInUp.duration(600).delay(300)}
            style={styles.section}
          >
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Quick Actions
            </Text>
            <View style={styles.quickActions}>
              {quickActions.map((action, index) => (
                <AnimatedTouchable
                  key={action.title}
                  entering={FadeInUp.duration(400).delay(400 + index * 80)}
                  style={[styles.quickAction]}
                  onPress={action.onPress}
                  activeOpacity={0.8}
                >
                  <ForgeCard 
                    glowColor={action.color} 
                    variant="default"
                    style={styles.quickActionCard}
                  >
                    <View style={[styles.quickActionIcon, { backgroundColor: action.color + '15' }]}>
                      <Icon name={action.icon} size={26} color={action.color} />
                    </View>
                    <Text style={[styles.quickActionText, { color: theme.colors.text }]}>
                      {action.title}
                    </Text>
                  </ForgeCard>
                </AnimatedTouchable>
              ))}
            </View>
          </Animated.View>

          {/* Features */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Forge Features
            </Text>
            {features.map((feature, index) => (
              <Animated.View
                key={feature.title}
                entering={FadeInUp.duration(400).delay(500 + index * 60)}
              >
                <ForgeCard
                  glowColor={feature.color}
                  variant={feature.highlight ? 'elevated' : 'default'}
                  onPress={feature.onPress}
                  style={{
                    ...styles.featureCard,
                    ...(feature.highlight ? styles.featureCardHighlight : {}),
                  }}
                >
                  <View style={[styles.featureIcon, { backgroundColor: feature.color + '15' }]}>
                    <Icon name={feature.icon} size={26} color={feature.color} />
                  </View>
                  <View style={styles.featureContent}>
                    <Text style={[styles.featureTitle, { color: theme.colors.text }]}>
                      {feature.title}
                      {feature.highlight && ' ✨'}
                    </Text>
                    <Text style={[styles.featureDescription, { color: theme.colors.textMuted }]}>
                      {feature.description}
                    </Text>
                  </View>
                  <View style={[styles.featureArrow, { backgroundColor: feature.color + '10' }]}>
                    <Icon name="chevron-right" size={20} color={feature.color} />
                  </View>
                </ForgeCard>
              </Animated.View>
            ))}
          </View>

          {/* Stats with personality */}
          <Animated.View 
            entering={FadeInUp.duration(500).delay(700)}
            style={styles.section}
          >
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Your Forge
            </Text>
            <View style={styles.statsContainer}>
              {[
                { label: 'Templates', value: '15', icon: 'view-grid', color: forgeColors.forge[500] },
                { label: 'Art Styles', value: '5', icon: 'palette', color: forgeColors.spark[500] },
                { label: 'Dodo Modes', value: '4', icon: 'bird', color: forgeColors.gold[500] },
              ].map((stat, index) => (
                <AnimatedTouchable
                  key={stat.label}
                  entering={FadeInUp.duration(400).delay(800 + index * 80)}
                  activeOpacity={0.8}
                >
                  <ForgeCard 
                    glowColor={stat.color}
                    variant="default"
                    style={styles.statCard}
                  >
                    <View style={[styles.statIconBg, { backgroundColor: stat.color + '15' }]}>
                      <Icon name={stat.icon} size={20} color={stat.color} />
                    </View>
                    <Text style={[styles.statValue, { color: stat.color }]}>
                      {stat.value}
                    </Text>
                    <Text style={[styles.statLabel, { color: theme.colors.textMuted }]}>
                      {stat.label}
                    </Text>
                  </ForgeCard>
                </AnimatedTouchable>
              ))}
            </View>
          </Animated.View>
          
          {/* Bottom spacing for tab bar */}
          <View style={{ height: 120 }} />
        </ScrollView>
        
        {/* Celebration overlay */}
        <CelebrationOverlay
          visible={showCelebration}
          type="sparkles"
          message="Welcome to the Forge!"
          onComplete={() => setShowCelebration(false)}
        />
      </ParticleField>
    </LivingGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: spacing.lg,
    paddingTop: 60,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: typography.size.display,
    fontWeight: typography.weight.black,
    letterSpacing: typography.letterSpacing.tight,
    marginBottom: spacing.xxs,
  },
  subtitle: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.medium,
    letterSpacing: typography.letterSpacing.normal,
  },
  headerDodo: {
    marginLeft: spacing.md,
  },
  heroCard: {
    marginHorizontal: spacing.md,
    marginTop: spacing.xs,
    overflow: 'hidden',
    position: 'relative',
  },
  heroGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.1,
  },
  heroContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.xs,
  },
  heroIconArea: {
    position: 'relative',
    marginRight: spacing.md,
  },
  heroIconOuter: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroIconInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroSparkle: {
    position: 'absolute',
    top: -8,
    right: -8,
  },
  sparkleEmoji: {
    fontSize: 20,
  },
  newBadge: {
    position: 'absolute',
    top: -4,
    left: -4,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: radii.sm,
  },
  newBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: typography.weight.black,
    letterSpacing: 0.5,
  },
  heroTextArea: {
    flex: 1,
  },
  heroTitle: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    marginBottom: spacing.xxs,
  },
  heroDescription: {
    fontSize: typography.size.sm,
    lineHeight: typography.size.sm * typography.lineHeight.normal,
    marginBottom: spacing.sm,
  },
  heroPills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  pill: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: radii.full,
  },
  pillText: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.semibold,
  },
  heroArrow: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.sm,
  },
  section: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    marginBottom: spacing.md,
    letterSpacing: typography.letterSpacing.tight,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  quickAction: {
    flex: 1,
  },
  quickActionCard: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  quickActionIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  quickActionText: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
    textAlign: 'center',
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  featureCardHighlight: {
    borderWidth: 1,
    borderColor: forgeColors.spark[500] + '30',
  },
  featureIcon: {
    width: 52,
    height: 52,
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.semibold,
    marginBottom: spacing.xxs,
  },
  featureDescription: {
    fontSize: typography.size.sm,
    lineHeight: typography.size.sm * typography.lineHeight.normal,
  },
  featureArrow: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  statIconBg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  statValue: {
    fontSize: typography.size.xxl,
    fontWeight: typography.weight.black,
    marginBottom: spacing.xxs,
  },
  statLabel: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.medium,
  },
});
