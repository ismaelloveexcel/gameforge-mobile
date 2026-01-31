/**
 * ProjectListScreen - Your creations live here! 📁
 * Beautiful empty states with Dodo encouragement
 */
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Project, RootStackParamList } from '../types';
import { LivingGradient, ForgeCard, EmptyState } from '../components';
import { spacing, typography, radii, forgeColors } from '../design-tokens/theme';

type NavigationProp = StackNavigationProp<RootStackParamList>;

export default function ProjectListScreen() {
  const { theme, isDark } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const [projects] = useState<Project[]>([]);

  const renderProject = ({ item, index }: { item: Project; index: number }) => (
    <Animated.View entering={FadeInUp.duration(400).delay(index * 80)}>
      <ForgeCard
        glowColor={forgeColors.forge[500]}
        variant="default"
        onPress={() => navigation.navigate('ProjectEditor', { projectId: item.id })}
        style={styles.projectCard}
      >
        <View style={[styles.projectIcon, { backgroundColor: forgeColors.forge[500] + '15' }]}>
          <Icon name="gamepad-variant" size={24} color={forgeColors.forge[500]} />
        </View>
        <View style={styles.projectInfo}>
          <Text style={[styles.projectName, { color: theme.colors.text }]}>
            {item.name}
          </Text>
          <Text style={[styles.projectMeta, { color: theme.colors.textMuted }]}>
            Last edited recently
          </Text>
        </View>
        <Icon name="chevron-right" size={20} color={theme.colors.textMuted} />
      </ForgeCard>
    </Animated.View>
  );

  return (
    <LivingGradient intensity="subtle">
      <View style={styles.container}>
        {/* Header */}
        <Animated.View entering={FadeInUp.duration(500)} style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            My Projects
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>
            Your creative workshop
          </Text>
        </Animated.View>

        {projects.length === 0 ? (
          <EmptyState
            title="No projects yet"
            message="Every masterpiece starts with a single step. Let's create your first game together!"
            actionLabel="Start Creating"
            onAction={() => navigation.navigate('Templates')}
            variant="projects"
            dodoMessage="Your first project is waiting to be born! ✨"
          />
        ) : (
          <FlatList
            data={projects}
            renderItem={renderProject}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </LivingGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: spacing.lg,
    paddingTop: 60,
  },
  title: {
    fontSize: typography.size.xxl,
    fontWeight: typography.weight.bold,
    marginBottom: spacing.xxs,
  },
  subtitle: {
    fontSize: typography.size.base,
  },
  list: {
    padding: spacing.md,
    paddingBottom: 100,
  },
  projectCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  projectIcon: {
    width: 48,
    height: 48,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  projectInfo: {
    flex: 1,
  },
  projectName: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.semibold,
    marginBottom: spacing.xxs,
  },
  projectMeta: {
    fontSize: typography.size.sm,
  },
});
