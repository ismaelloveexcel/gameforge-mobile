import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
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
  interpolateColor,
  Easing,
  FadeInDown,
  FadeInUp,
} from 'react-native-reanimated';
import { useTheme } from '../contexts/ThemeContext';
import { RootStackParamList } from '../types';

type NavigationProp = StackNavigationProp<RootStackParamList>;

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { theme } = useTheme();
  
  // Animations
  const shimmer = useSharedValue(0);
  const glow = useSharedValue(0);
  const sparkle = useSharedValue(0);
  
  useEffect(() => {
    // Shimmer animation
    shimmer.value = withRepeat(
      withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
    
    // Glow pulse
    glow.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1500 }),
        withTiming(0.3, { duration: 1500 })
      ),
      -1,
      false
    );
    
    // Sparkle animation
    sparkle.value = withRepeat(
      withTiming(360, { duration: 4000, easing: Easing.linear }),
      -1,
      false
    );
  }, [shimmer, glow, sparkle]);
  
  const glowStyle = useAnimatedStyle(() => ({
    opacity: glow.value,
  }));
  
  const sparkleStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${sparkle.value}deg` }],
  }));

  const features = [
    {
      icon: 'gift',
      title: 'Gift Games',
      description: 'Create personalized mini-games',
      onPress: () => navigation.navigate('GiftForgeWizard'),
      highlight: true,
    },
    {
      icon: 'creation',
      title: 'Create Games',
      description: '15 ready-to-use game templates',
      onPress: () => navigation.navigate('Templates'),
    },
    {
      icon: 'robot',
      title: 'AI Assistant',
      description: '4 specialized personalities',
      onPress: () => navigation.navigate('Genie'),
    },
    {
      icon: 'palette',
      title: 'Art Styles',
      description: '5 signature visual styles',
      onPress: () => navigation.navigate('Templates'),
    },
    {
      icon: 'virtual-reality',
      title: 'VR Support',
      description: 'Create immersive VR experiences',
      onPress: () => navigation.navigate('Templates'),
    },
  ];

  const quickActions = [
    {
      icon: 'gift-outline',
      title: 'Gift Game',
      color: theme.colors.accent,
      onPress: () => navigation.navigate('GiftForgeWizard'),
    },
    {
      icon: 'plus-circle',
      title: 'New Project',
      color: theme.colors.primary,
      onPress: () => navigation.navigate('Templates'),
    },
    {
      icon: 'folder-open',
      title: 'My Projects',
      color: theme.colors.secondary,
      onPress: () => navigation.navigate('Projects'),
    },
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header with Animation */}
      <Animated.View 
        entering={FadeInDown.duration(600).delay(100)}
        style={styles.header}
      >
        <Text style={[styles.title, { color: theme.colors.text }]}>
          GameForge Mobile
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.text + '80' }]}>
          AI-Powered Game Creation Platform
        </Text>
      </Animated.View>

      {/* Hero Card */}
      <Animated.View 
        entering={FadeInUp.duration(600).delay(200)}
        style={[styles.heroCard, { backgroundColor: theme.colors.card }]}
      >
        <View style={styles.heroIconWrapper}>
          <Animated.View style={sparkleStyle}>
            <Icon name="star-four-points" size={16} color={theme.colors.primary} style={styles.heroSparkle1} />
          </Animated.View>
          <Icon name="rocket-launch" size={56} color={theme.colors.primary} />
          <Animated.View style={sparkleStyle}>
            <Icon name="star-four-points" size={12} color={theme.colors.secondary} style={styles.heroSparkle2} />
          </Animated.View>
        </View>
        <Text style={[styles.heroTitle, { color: theme.colors.text }]}>
          Create Without Coding
        </Text>
        <Text style={[styles.heroText, { color: theme.colors.text + '80' }]}>
          Build professional games, VR experiences, and educational content with zero coding required
        </Text>
      </Animated.View>

      {/* ✨ PREMIUM GiftForge Hero Card ✨ */}
      <Animated.View entering={FadeInUp.duration(700).delay(300)}>
        <TouchableOpacity 
          style={styles.giftForgeCardWrapper}
          onPress={() => navigation.navigate('GiftForgeWizard')}
          activeOpacity={0.9}
        >
          {/* Glow Effect Background */}
          <Animated.View 
            style={[
              styles.giftForgeGlow,
              { backgroundColor: theme.colors.accent },
              glowStyle
            ]} 
          />
          
          {/* Main Card */}
          <View style={[styles.giftForgeCard, { 
            backgroundColor: theme.dark ? '#2D1F3D' : '#FFF5F8',
            borderColor: theme.colors.accent + '40',
          }]}>
            {/* Decorative Elements */}
            <View style={styles.giftForgeDecorations}>
              <Text style={styles.giftForgeEmoji}>✨</Text>
              <Animated.View style={sparkleStyle}>
                <Icon name="star-four-points" size={14} color={theme.colors.accent + '60'} />
              </Animated.View>
              <Text style={styles.giftForgeEmoji2}>🎉</Text>
            </View>
            
            <View style={styles.giftForgeContent}>
              {/* Icon with Gradient-like effect */}
              <View style={styles.giftForgeIconWrapper}>
                <View style={[styles.giftForgeIconOuter, { backgroundColor: theme.colors.accent + '20' }]}>
                  <View style={[styles.giftForgeIconInner, { backgroundColor: theme.colors.accent }]}>
                    <Icon name="gift" size={28} color="#fff" />
                  </View>
                </View>
                {/* Badge */}
                <View style={[styles.giftForgeBadge, { backgroundColor: theme.colors.success }]}>
                  <Text style={styles.giftForgeBadgeText}>NEW</Text>
                </View>
              </View>
              
              <View style={styles.giftForgeTextContent}>
                <View style={styles.giftForgeTitleRow}>
                  <Text style={[styles.giftForgeTitle, { color: theme.colors.text }]}>
                    Create a Gift Game
                  </Text>
                  <Text style={styles.giftForgeTitleEmoji}>🎁</Text>
                </View>
                <Text style={[styles.giftForgeSubtitle, { color: theme.colors.text + '90' }]}>
                  Personalized mini-games for birthdays, anniversaries & special moments
                </Text>
                
                {/* Feature Pills */}
                <View style={styles.giftForgePills}>
                  <View style={[styles.giftForgePill, { backgroundColor: theme.colors.accent + '15' }]}>
                    <Text style={[styles.giftForgePillText, { color: theme.colors.accent }]}>🎮 5 Game Types</Text>
                  </View>
                  <View style={[styles.giftForgePill, { backgroundColor: theme.colors.primary + '15' }]}>
                    <Text style={[styles.giftForgePillText, { color: theme.colors.primary }]}>⚡ AI-Powered</Text>
                  </View>
                </View>
              </View>
              
              {/* Arrow */}
              <View style={[styles.giftForgeArrow, { backgroundColor: theme.colors.accent }]}>
                <Icon name="arrow-right" size={20} color="#fff" />
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>

      {/* Quick Actions */}
      <Animated.View 
        entering={FadeInUp.duration(600).delay(400)}
        style={styles.section}
      >
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Quick Actions
        </Text>
        <View style={styles.quickActions}>
          {quickActions.map((action, index) => (
            <AnimatedTouchable
              key={index}
              entering={FadeInUp.duration(400).delay(500 + index * 100)}
              style={[styles.quickAction, { 
                backgroundColor: theme.colors.card,
                ...Platform.select({
                  web: { boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
                  default: { elevation: 2 }
                })
              }]}
              onPress={action.onPress}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: action.color + '15' }]}>
                <Icon name={action.icon} size={28} color={action.color} />
              </View>
              <Text style={[styles.quickActionText, { color: theme.colors.text }]}>
                {action.title}
              </Text>
            </AnimatedTouchable>
          ))}
        </View>
      </Animated.View>

      {/* Features */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Platform Features
        </Text>
        {features.map((feature, index) => (
          <Animated.View
            key={index}
            entering={FadeInUp.duration(400).delay(600 + index * 80)}
          >
            <TouchableOpacity
              style={[
                styles.featureCard, 
                { 
                  backgroundColor: theme.colors.card,
                  ...Platform.select({
                    web: { boxShadow: '0 2px 8px rgba(0,0,0,0.05)' },
                    default: { elevation: 1 }
                  })
                },
                feature.highlight && { 
                  backgroundColor: theme.dark ? '#2D1F3D' : '#FFF5F8',
                  borderWidth: 2,
                  borderColor: theme.colors.accent + '50',
                },
              ]}
              onPress={feature.onPress}
            >
              <View style={[
                styles.featureIcon, 
                { backgroundColor: feature.highlight ? theme.colors.accent + '20' : theme.colors.primary + '15' }
              ]}>
                <Icon 
                  name={feature.icon} 
                  size={28} 
                  color={feature.highlight ? theme.colors.accent : theme.colors.primary} 
                />
              </View>
              <View style={styles.featureContent}>
                <Text style={[styles.featureTitle, { color: theme.colors.text }]}>
                  {feature.title}
                  {feature.highlight && ' ✨'}
                </Text>
                <Text style={[styles.featureDescription, { color: theme.colors.text + '80' }]}>
                  {feature.description}
                </Text>
              </View>
              <View style={[styles.featureArrow, { backgroundColor: theme.colors.primary + '10' }]}>
                <Icon name="chevron-right" size={20} color={theme.colors.primary} />
              </View>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>

      {/* Stats */}
      <Animated.View 
        entering={FadeInUp.duration(500).delay(900)}
        style={styles.section}
      >
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Platform Stats
        </Text>
        <View style={styles.statsContainer}>
          {[
            { label: 'Templates', value: '15', icon: 'view-grid', color: theme.colors.primary },
            { label: 'Art Styles', value: '5', icon: 'palette', color: theme.colors.secondary },
            { label: 'AI Modes', value: '4', icon: 'robot', color: theme.colors.accent },
          ].map((stat, index) => (
            <AnimatedTouchable
              key={index}
              entering={FadeInUp.duration(400).delay(1000 + index * 100)}
              style={[styles.statCard, { 
                backgroundColor: theme.colors.card,
                ...Platform.select({
                  web: { boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
                  default: { elevation: 2 }
                })
              }]}
            >
              <View style={[styles.statIconBg, { backgroundColor: stat.color + '15' }]}>
                <Icon name={stat.icon} size={20} color={stat.color} />
              </View>
              <Text style={[styles.statValue, { color: stat.color }]}>
                {stat.value}
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.text + '80' }]}>
                {stat.label}
              </Text>
            </AnimatedTouchable>
          ))}
        </View>
      </Animated.View>
      
      {/* Bottom Spacing */}
      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 24,
    paddingTop: 60,
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    letterSpacing: 0.2,
  },
  heroCard: {
    margin: 16,
    padding: 28,
    borderRadius: 20,
    alignItems: 'center',
  },
  heroIconWrapper: {
    position: 'relative',
    marginBottom: 8,
  },
  heroSparkle1: {
    position: 'absolute',
    top: -8,
    right: -12,
  },
  heroSparkle2: {
    position: 'absolute',
    bottom: 0,
    left: -16,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '700',
    marginTop: 12,
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  heroText: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  // Premium GiftForge Card Styles
  giftForgeCardWrapper: {
    marginHorizontal: 16,
    marginTop: 4,
    marginBottom: 8,
    position: 'relative',
  },
  giftForgeGlow: {
    position: 'absolute',
    top: 4,
    left: 4,
    right: 4,
    bottom: -4,
    borderRadius: 24,
    opacity: 0.3,
  },
  giftForgeCard: {
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    overflow: 'hidden',
  },
  giftForgeDecorations: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 12,
  },
  giftForgeEmoji: {
    fontSize: 16,
    marginRight: 8,
    opacity: 0.6,
  },
  giftForgeEmoji2: {
    fontSize: 14,
    marginLeft: 8,
    opacity: 0.5,
  },
  giftForgeContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  giftForgeIconWrapper: {
    position: 'relative',
    marginRight: 16,
  },
  giftForgeIconOuter: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  giftForgeIconInner: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  giftForgeBadge: {
    position: 'absolute',
    top: -4,
    right: -8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  giftForgeBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  giftForgeTextContent: {
    flex: 1,
  },
  giftForgeTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  giftForgeTitle: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  giftForgeTitleEmoji: {
    fontSize: 18,
    marginLeft: 8,
  },
  giftForgeSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  giftForgePills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  giftForgePill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 4,
  },
  giftForgePillText: {
    fontSize: 12,
    fontWeight: '600',
  },
  giftForgeArrow: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
    letterSpacing: -0.2,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickAction: {
    flex: 1,
    margin: 5,
    padding: 16,
    paddingVertical: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  quickActionText: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  featureIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    letterSpacing: -0.1,
  },
  featureDescription: {
    fontSize: 13,
    lineHeight: 18,
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
  },
  statCard: {
    flex: 1,
    margin: 5,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  statIconBg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
});
