/**
 * TemplateSelectorScreen - Choose your game blueprint! 🎮
 * Enhanced with ForgeCard design and Dodo encouragement
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { templateLibrary } from '../services/TemplateLibrary';
import { GameTemplate, RootStackParamList } from '../types';
import { LivingGradient, ForgeCard, DodoCompanion } from '../components';
import { spacing, typography, radii, forgeColors } from '../design-tokens/theme';

type NavigationProp = StackNavigationProp<RootStackParamList>;

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 32;

export default function TemplateSelectorScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const templates = templateLibrary.getAllTemplates();
  const categories = ['all', 'puzzle', 'action', 'strategy', 'racing', 'educational', 'vr'];

  const filteredTemplates = selectedCategory === 'all'
    ? templates
    : templates.filter(t => t.category === selectedCategory);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return forgeColors.moss[500];
      case 'intermediate': return forgeColors.gold[500];
      case 'advanced': return forgeColors.ember[500];
      default: return theme.colors.text;
    }
  };

  const getEngineIcon = (engine: string) => {
    switch (engine) {
      case 'pixi': return 'image-area';
      case 'babylon': return 'cube-outline';
      case 'aframe': return 'virtual-reality';
      default: return 'gamepad-variant';
    }
  };
  
  const getEngineColor = (engine: string) => {
    switch (engine) {
      case 'pixi': return forgeColors.spark[500];
      case 'babylon': return forgeColors.forge[500];
      case 'aframe': return forgeColors.ember[500];
      default: return forgeColors.gold[500];
    }
  };

  return (
    <LivingGradient intensity="subtle">
      <View style={styles.container}>
        {/* Header with Dodo */}
        <Animated.View entering={FadeInDown.duration(500)} style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={[styles.title, { color: theme.colors.text }]}>Game Templates</Text>
            <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>
              Choose from 15 ready-to-forge blueprints
            </Text>
          </View>
          <DodoCompanion
            mood="curious"
            size="mini"
            message="Pick a template to start creating! 🎮"
            showBubble={false}
          />
        </Animated.View>

        {/* Category Filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
          contentContainerStyle={styles.categoryContainer}
        >
          {categories.map((category, index) => (
            <Animated.View key={category} entering={FadeInDown.duration(300).delay(index * 50)}>
              <TouchableOpacity
                style={[
                  styles.categoryChip,
                  {
                    backgroundColor: selectedCategory === category
                      ? forgeColors.forge[500]
                      : theme.colors.card,
                  },
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text
                  style={[
                    styles.categoryText,
                    {
                      color: selectedCategory === category
                        ? '#fff'
                        : theme.colors.text,
                    },
                  ]}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </ScrollView>

        {/* Templates Grid */}
        <ScrollView style={styles.templatesContainer} showsVerticalScrollIndicator={false}>
          {filteredTemplates.map((template, index) => (
            <Animated.View key={template.id} entering={FadeInUp.duration(400).delay(index * 60)}>
              <ForgeCard
                glowColor={getEngineColor(template.engine)}
                variant="default"
                onPress={() => navigation.navigate('TemplatePreview', { templateId: template.id })}
                style={styles.templateCard}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.cardTitleRow}>
                    <View style={[styles.engineIconBg, { backgroundColor: getEngineColor(template.engine) + '15' }]}>
                      <Icon
                        name={getEngineIcon(template.engine)}
                        size={24}
                        color={getEngineColor(template.engine)}
                      />
                    </View>
                    <Text style={[styles.templateName, { color: theme.colors.text }]}>
                      {template.name}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.difficultyBadge,
                      { backgroundColor: getDifficultyColor(template.difficulty) + '20' },
                    ]}
                  >
                    <Text
                      style={[
                        styles.difficultyText,
                        { color: getDifficultyColor(template.difficulty) },
                      ]}
                    >
                      {template.difficulty}
                    </Text>
                  </View>
                </View>

                <Text style={[styles.templateDescription, { color: theme.colors.textMuted }]}>
                  {template.description}
                </Text>

                <View style={styles.featuresList}>
                  {template.features.slice(0, 3).map((feature, idx) => (
                    <View key={idx} style={styles.featureItem}>
                      <Icon name="check-circle" size={16} color={forgeColors.moss[500]} />
                      <Text style={[styles.featureText, { color: theme.colors.text }]}>
                        {feature}
                      </Text>
                    </View>
                  ))}
                </View>

                <View style={styles.cardFooter}>
                  <View style={[styles.engineBadge, { backgroundColor: theme.colors.card }]}>
                    <Text style={[styles.engineText, { color: theme.colors.textMuted }]}>
                      {template.engine.toUpperCase()}
                    </Text>
                  </View>
                  <View style={[styles.useButton, { backgroundColor: getEngineColor(template.engine) }]}>
                    <Text style={styles.useButtonText}>Use Template</Text>
                    <Icon name="arrow-right" size={16} color="#fff" />
                  </View>
                </View>
              </ForgeCard>
            </Animated.View>
          ))}
          <View style={{ height: 100 }} />
        </ScrollView>
      </View>
    </LivingGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: spacing.lg,
    paddingTop: 60,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: typography.size.xxl,
    fontWeight: typography.weight.bold,
    marginBottom: spacing.xxs,
  },
  subtitle: {
    fontSize: typography.size.base,
  },
  categoryScroll: {
    maxHeight: 50,
  },
  categoryContainer: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    gap: spacing.xs,
  },
  categoryChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radii.full,
    marginRight: spacing.xs,
  },
  categoryText: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
  },
  templatesContainer: {
    flex: 1,
    padding: spacing.md,
  },
  templateCard: {
    marginBottom: spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  engineIconBg: {
    width: 40,
    height: 40,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  templateName: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.bold,
    marginLeft: spacing.sm,
    flex: 1,
  },
  difficultyBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: radii.full,
  },
  difficultyText: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.semibold,
  },
  templateDescription: {
    fontSize: typography.size.sm,
    lineHeight: typography.size.sm * typography.lineHeight.relaxed,
    marginBottom: spacing.sm,
  },
  featuresList: {
    marginBottom: spacing.md,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xxs,
  },
  featureText: {
    fontSize: typography.size.sm,
    marginLeft: spacing.xs,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  engineBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: radii.sm,
  },
  engineText: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.semibold,
  },
  useButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radii.md,
  },
  useButtonText: {
    color: '#fff',
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
    marginRight: spacing.xxs,
  },
});
