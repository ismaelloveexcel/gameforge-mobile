/**
 * SettingsScreen - Premium, minimal settings
 * FORGE-CHIEF: Clean, functional, no noise
 */
import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Switch,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTheme, THEME_OPTIONS } from '../contexts/ThemeContext';
import { RootStackParamList } from '../types';
import { spacing, typography, radii } from '../design-tokens/theme';

type NavigationProp = StackNavigationProp<RootStackParamList>;

export default function SettingsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { 
    isDark, 
    toggleTheme, 
    seasonalTheme, 
    themeChoice, 
    setThemeChoice 
  } = useTheme();

  const themeColors = seasonalTheme.colors;

  const SettingsItem = ({ 
    icon, 
    title, 
    subtitle, 
    onPress, 
    rightElement,
    delay = 0,
  }: {
    icon: string;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    rightElement?: React.ReactNode;
    delay?: number;
  }) => (
    <Animated.View entering={FadeInDown.delay(delay)}>
      <TouchableOpacity 
        style={[styles.settingsItem, { backgroundColor: themeColors.surface }]}
        onPress={onPress}
        disabled={!onPress && !rightElement}
        activeOpacity={onPress ? 0.7 : 1}
      >
        <View style={[styles.iconContainer, { backgroundColor: themeColors.accent + '15' }]}>
          <Icon name={icon} size={22} color={themeColors.accent} />
        </View>
        <View style={styles.itemContent}>
          <Text style={[styles.itemTitle, { color: themeColors.text }]}>{title}</Text>
          {subtitle && (
            <Text style={[styles.itemSubtitle, { color: themeColors.muted }]}>{subtitle}</Text>
          )}
        </View>
        {rightElement || (onPress && (
          <Icon name="chevron-right" size={20} color={themeColors.muted} />
        ))}
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: themeColors.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Appearance Section */}
      <Animated.View entering={FadeInDown.delay(100)}>
        <Text style={[styles.sectionTitle, { color: themeColors.muted }]}>
          Appearance
        </Text>
      </Animated.View>

      <SettingsItem
        icon="brightness-6"
        title="Dark Mode"
        subtitle={isDark ? 'On' : 'Off'}
        delay={150}
        rightElement={
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{ false: themeColors.muted + '40', true: themeColors.accent + '60' }}
            thumbColor={isDark ? themeColors.accent : '#f4f3f4'}
          />
        }
      />

      <SettingsItem
        icon="palette-outline"
        title="Theme"
        subtitle={seasonalTheme.name}
        delay={200}
        onPress={() => {
          // Navigate to theme picker or show modal
          // For now, cycle through themes
          const currentIndex = THEME_OPTIONS.findIndex(t => t.id === themeChoice);
          const nextIndex = (currentIndex + 1) % THEME_OPTIONS.length;
          setThemeChoice(THEME_OPTIONS[nextIndex].id);
        }}
      />

      {/* About Section */}
      <Animated.View entering={FadeInDown.delay(300)}>
        <Text style={[styles.sectionTitle, { color: themeColors.muted, marginTop: spacing.xl }]}>
          About
        </Text>
      </Animated.View>

      <SettingsItem
        icon="information-outline"
        title="Getting Started"
        subtitle="Learn what GameForge can do"
        delay={350}
        onPress={() => navigation.navigate('Onboarding')}
      />

      <SettingsItem
        icon="gift-outline"
        title="Create a Gift"
        subtitle="Make a personalized game for someone"
        delay={400}
        onPress={() => navigation.navigate('GiftForgeWizard')}
      />

      {/* App Info */}
      <Animated.View 
        entering={FadeInDown.delay(500)}
        style={styles.appInfo}
      >
        <Text style={[styles.appName, { color: themeColors.accent }]}>
          GameForge
        </Text>
        <Text style={[styles.appVersion, { color: themeColors.muted }]}>
          Version 1.0.0
        </Text>
        <Text style={[styles.appTagline, { color: themeColors.muted }]}>
          Create games that mean something
        </Text>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
    paddingTop: spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.bold,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.sm,
    marginLeft: spacing.xs,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radii.lg,
    marginBottom: spacing.sm,
    ...Platform.select({
      web: { cursor: 'pointer' },
    }),
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.semibold,
  },
  itemSubtitle: {
    fontSize: typography.size.sm,
    marginTop: 2,
  },
  appInfo: {
    alignItems: 'center',
    marginTop: spacing.xxxl,
    paddingTop: spacing.xl,
  },
  appName: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.black,
    letterSpacing: typography.letterSpacing.tight,
  },
  appVersion: {
    fontSize: typography.size.sm,
    marginTop: spacing.xxs,
  },
  appTagline: {
    fontSize: typography.size.sm,
    fontStyle: 'italic',
    marginTop: spacing.sm,
  },
});
