import React from 'react';
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
import { useTheme } from '../contexts/ThemeContext';
import { RootStackParamList } from '../types';

type NavigationProp = StackNavigationProp<RootStackParamList>;

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { theme } = useTheme();

  const features = [
    {
      icon: 'gift-outline',
      title: 'Personalized Gift Games',
      description: 'Create heartfelt game gifts in minutes',
      onPress: () => navigation.navigate('GiftQuestionnaire', {}),
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
      description: '5 specialized personalities',
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
    {
      icon: 'robot-industrial',
      title: 'Agent Dashboard',
      description: 'Monitor AI agent workflows',
      onPress: () => navigation.navigate('AgentDashboard'),
    },
  ];

  const quickActions = [
    {
      icon: 'gift',
      title: 'Gift Game',
      color: '#FF6B9D',
      onPress: () => navigation.navigate('GiftQuestionnaire', {}),
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
    {
      icon: 'download',
      title: 'Templates',
      color: theme.colors.accent,
      onPress: () => navigation.navigate('Templates'),
    },
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          GameForge Mobile
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.text + '80' }]}>
          AI-Powered Game Creation Platform
        </Text>
      </View>

      {/* Hero Card - Gift Games */}
      <TouchableOpacity 
        style={[styles.heroCard, styles.giftHeroCard]}
        onPress={() => navigation.navigate('GiftQuestionnaire', {})}
      >
        <Text style={styles.giftHeroEmoji}>🎁</Text>
        <Text style={styles.giftHeroTitle}>
          Create Personalized Gift Games
        </Text>
        <Text style={styles.giftHeroText}>
          Turn memories into playable adventures. Perfect for birthdays, anniversaries, and special moments.
        </Text>
        <View style={styles.giftHeroBadge}>
          <Text style={styles.giftHeroBadgeText}>NEW ✨</Text>
        </View>
      </TouchableOpacity>

      {/* Secondary Hero Card */}
      <View style={[styles.heroCard, { backgroundColor: theme.colors.card }]}>
        <Icon name="rocket-launch" size={48} color={theme.colors.primary} />
        <Text style={[styles.heroTitle, { color: theme.colors.text }]}>
          Create Without Coding
        </Text>
        <Text style={[styles.heroText, { color: theme.colors.text + '80' }]}>
          Build professional games, VR experiences, and educational content with zero coding required
        </Text>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Quick Actions
        </Text>
        <View style={styles.quickActions}>
          {quickActions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.quickAction, { backgroundColor: theme.colors.card }]}
              onPress={action.onPress}
            >
              <Icon name={action.icon} size={32} color={action.color} />
              <Text style={[styles.quickActionText, { color: theme.colors.text }]}>
                {action.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Features */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Platform Features
        </Text>
        {features.map((feature, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.featureCard, 
              { backgroundColor: theme.colors.card },
              feature.highlight && styles.highlightCard
            ]}
            onPress={feature.onPress}
          >
            <View style={[
              styles.featureIcon, 
              { backgroundColor: feature.highlight ? '#FF6B9D20' : theme.colors.primary + '20' }
            ]}>
              <Icon 
                name={feature.icon} 
                size={28} 
                color={feature.highlight ? '#FF6B9D' : theme.colors.primary} 
              />
            </View>
            <View style={styles.featureContent}>
              <Text style={[styles.featureTitle, { color: theme.colors.text }]}>
                {feature.title}
                {feature.highlight && (
                  <Text style={styles.newBadge}> NEW</Text>
                )}
              </Text>
              <Text style={[styles.featureDescription, { color: theme.colors.text + '80' }]}>
                {feature.description}
              </Text>
            </View>
            <Icon name="chevron-right" size={24} color={theme.colors.text + '40'} />
          </TouchableOpacity>
        ))}
      </View>

      {/* Stats */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Platform Stats
        </Text>
        <View style={styles.statsContainer}>
          {[
            { label: 'Templates', value: '15' },
            { label: 'Art Styles', value: '5' },
            { label: 'AI Personalities', value: '4' },
          ].map((stat, index) => (
            <View
              key={index}
              style={[styles.statCard, { backgroundColor: theme.colors.card }]}
            >
              <Text style={[styles.statValue, { color: theme.colors.primary }]}>
                {stat.value}
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.text }]}>
                {stat.label}
              </Text>
            </View>
          ))}
        </View>
      </View>
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
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  heroCard: {
    margin: 16,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  giftHeroCard: {
    backgroundColor: '#FF6B9D',
    marginBottom: 8,
  },
  giftHeroEmoji: {
    fontSize: 56,
    marginBottom: 12,
  },
  giftHeroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  giftHeroText: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 20,
    opacity: 0.95,
  },
  giftHeroBadge: {
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginTop: 16,
  },
  giftHeroBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FF6B9D',
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  heroText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickAction: {
    flex: 1,
    margin: 4,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  quickActionText: {
    marginTop: 8,
    fontSize: 12,
    textAlign: 'center',
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  highlightCard: {
    borderWidth: 2,
    borderColor: '#FF6B9D',
  },
  newBadge: {
    fontSize: 10,
    color: '#FF6B9D',
    fontWeight: 'bold',
    marginLeft: 4,
  },
  featureIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    margin: 4,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
  },
});
