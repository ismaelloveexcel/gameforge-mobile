/**
 * Couples Game Creator
 * 
 * PREMIUM FEATURE: Create games with BOTH partners as characters!
 * Perfect for Valentine's, anniversaries, relationship milestones
 * 
 * Features:
 * - Dual character creation (both partners)
 * - Both appear in the game together
 * - Relationship-focused gameplay
 * - Premium tier (AED 50)
 * - HIGHLY shareable (relationship goals content)
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Animated, { FadeIn, SlideInRight } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../contexts/ThemeContext';
import { spacing, typography, radii } from '../design-tokens/theme';
import DodoCompanion from '../components/DodoCompanion';
import MagicEggHatcher from '../components/MagicEggHatcher';

export interface CoupleCharacter {
  name: string;
  trait: string;
  favoriteColor: string;
  role: 'player1' | 'player2';
}

export interface CouplesGameConfig {
  partner1: CoupleCharacter;
  partner2: CoupleCharacter;
  relationshipType: 'dating' | 'engaged' | 'married' | 'best_friends';
  occasion: 'valentine' | 'anniversary' | 'just_because';
  sharedMemory: string;
  gameStyle: 'adventure' | 'puzzle' | 'runner' | 'story';
}

interface CouplesGameCreatorProps {
  onComplete: (config: CouplesGameConfig) => void;
  onCancel: () => void;
}

export default function CouplesGameCreator({
  onComplete,
  onCancel,
}: CouplesGameCreatorProps) {
  const { theme, seasonalTheme } = useTheme();
  const colors = seasonalTheme.colors;

  const [step, setStep] = useState<'intro' | 'partner1' | 'partner2' | 'relationship' | 'preview'>('intro');
  const [config, setConfig] = useState<Partial<CouplesGameConfig>>({
    relationshipType: 'dating',
    occasion: 'valentine',
    gameStyle: 'adventure',
  });

  const [isGenerating, setIsGenerating] = useState(false);

  // Render intro screen
  const renderIntro = () => (
    <Animated.View entering={FadeIn} style={styles.stepContainer}>
      <DodoCompanion
        mood="excited"
        size="large"
        message="Create a game where BOTH of you are the stars! 💕"
        floating={true}
      />

      <View style={[styles.featureCard, { backgroundColor: colors.surface }]}>
        <Icon name="account-multiple-plus" size={48} color={colors.accent} />
        <Text style={[styles.featureTitle, { color: colors.text }]}>
          Couples Game
        </Text>
        <Text style={[styles.featureDescription, { color: colors.muted }]}>
          A personalized adventure starring BOTH of you
        </Text>

        <View style={styles.featureList}>
          <View style={styles.featureItem}>
            <Icon name="check-circle" size={20} color="#10B981" />
            <Text style={[styles.featureItemText, { color: colors.text }]}>
              2 personalized characters (both of you!)
            </Text>
          </View>
          <View style={styles.featureItem}>
            <Icon name="check-circle" size={20} color="#10B981" />
            <Text style={[styles.featureItemText, { color: colors.text }]}>
              Play together through your love story
            </Text>
          </View>
          <View style={styles.featureItem}>
            <Icon name="check-circle" size={20} color="#10B981" />
            <Text style={[styles.featureItemText, { color: colors.text }]}>
              Pixar-quality 3D rendering
            </Text>
          </View>
          <View style={styles.featureItem}>
            <Icon name="check-circle" size={20} color="#10B981" />
            <Text style={[styles.featureItemText, { color: colors.text }]}>
              Relationship goals content (super shareable!)
            </Text>
          </View>
        </View>

        <View style={[styles.premiumBadge, { backgroundColor: colors.accent + '20' }]}>
          <Icon name="crown" size={20} color={colors.accent} />
          <Text style={[styles.premiumText, { color: colors.accent }]}>
            Premium Feature • AED 50
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.continueButton, { backgroundColor: colors.accent }]}
        onPress={() => setStep('partner1')}
      >
        <Text style={[styles.continueButtonText, { color: colors.background }]}>
          Create Our Game! 💕
        </Text>
        <Icon name="arrow-right" size={20} color={colors.background} />
      </TouchableOpacity>
    </Animated.View>
  );

  // Render partner 1 form
  const renderPartner1 = () => (
    <Animated.View entering={SlideInRight} style={styles.stepContainer}>
      <Text style={[styles.stepTitle, { color: colors.text }]}>
        Partner 1 (That's you!)
      </Text>
      
      <TextInput
        style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.muted + '30' }]}
        placeholder="Your name"
        placeholderTextColor={colors.muted}
        value={config.partner1?.name}
        onChangeText={(text) => setConfig(prev => ({
          ...prev,
          partner1: { ...prev.partner1, name: text, role: 'player1' } as CoupleCharacter
        }))}
        autoFocus
      />

      <Text style={[styles.label, { color: colors.text }]}>Your personality trait</Text>
      <View style={styles.optionGrid}>
        {['Adventurous', 'Romantic', 'Funny', 'Thoughtful'].map((trait) => (
          <TouchableOpacity
            key={trait}
            style={[
              styles.optionButton,
              { 
                backgroundColor: config.partner1?.trait === trait ? colors.accent : colors.surface,
                borderColor: colors.muted + '30',
              }
            ]}
            onPress={() => setConfig(prev => ({
              ...prev,
              partner1: { ...prev.partner1!, trait }
            }))}
          >
            <Text style={[
              styles.optionText,
              { color: config.partner1?.trait === trait ? colors.background : colors.text }
            ]}>
              {trait}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.continueButton, { backgroundColor: config.partner1?.name ? colors.accent : colors.muted + '30' }]}
        onPress={() => setStep('partner2')}
        disabled={!config.partner1?.name}
      >
        <Text style={[styles.continueButtonText, { color: colors.background }]}>
          Next: Partner 2 →
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );

  // Render partner 2 form
  const renderPartner2 = () => (
    <Animated.View entering={SlideInRight} style={styles.stepContainer}>
      <Text style={[styles.stepTitle, { color: colors.text }]}>
        Partner 2 (Your special someone!)
      </Text>
      
      <TextInput
        style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.muted + '30' }]}
        placeholder="Their name"
        placeholderTextColor={colors.muted}
        value={config.partner2?.name}
        onChangeText={(text) => setConfig(prev => ({
          ...prev,
          partner2: { ...prev.partner2, name: text, role: 'player2' } as CoupleCharacter
        }))}
        autoFocus
      />

      <Text style={[styles.label, { color: colors.text }]}>Their personality trait</Text>
      <View style={styles.optionGrid}>
        {['Adventurous', 'Romantic', 'Funny', 'Thoughtful'].map((trait) => (
          <TouchableOpacity
            key={trait}
            style={[
              styles.optionButton,
              { 
                backgroundColor: config.partner2?.trait === trait ? colors.accent : colors.surface,
                borderColor: colors.muted + '30',
              }
            ]}
            onPress={() => setConfig(prev => ({
              ...prev,
              partner2: { ...prev.partner2!, trait }
            }))}
          >
            <Text style={[
              styles.optionText,
              { color: config.partner2?.trait === trait ? colors.background : colors.text }
            ]}>
              {trait}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.continueButton, { backgroundColor: config.partner2?.name ? colors.accent : colors.muted + '30' }]}
        onPress={() => setStep('relationship')}
        disabled={!config.partner2?.name}
      >
        <Text style={[styles.continueButtonText, { color: colors.background }]}>
          Next: Your Story →
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );

  // Render relationship details
  const renderRelationship = () => (
    <Animated.View entering={SlideInRight} style={styles.stepContainer}>
      <Text style={[styles.stepTitle, { color: colors.text }]}>
        Tell us about you two
      </Text>

      <Text style={[styles.label, { color: colors.text }]}>Share a special memory</Text>
      <TextInput
        style={[styles.input, styles.messageInput, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.muted + '30' }]}
        placeholder="Our first date, when we met, a special moment..."
        placeholderTextColor={colors.muted}
        value={config.sharedMemory}
        onChangeText={(text) => setConfig(prev => ({ ...prev, sharedMemory: text }))}
        multiline
        numberOfLines={4}
        autoFocus
      />

      <Text style={[styles.label, { color: colors.text }]}>Game style</Text>
      <View style={styles.optionGrid}>
        {[
          { value: 'adventure', label: 'Adventure', icon: 'map' },
          { value: 'puzzle', label: 'Puzzle', icon: 'puzzle' },
          { value: 'runner', label: 'Runner', icon: 'run' },
          { value: 'story', label: 'Story', icon: 'book-open-variant' },
        ].map((style) => (
          <TouchableOpacity
            key={style.value}
            style={[
              styles.styleButton,
              { 
                backgroundColor: config.gameStyle === style.value ? colors.accent : colors.surface,
                borderColor: colors.muted + '30',
              }
            ]}
            onPress={() => setConfig(prev => ({ ...prev, gameStyle: style.value as any }))}
          >
            <Icon 
              name={style.icon} 
              size={24} 
              color={config.gameStyle === style.value ? colors.background : colors.text} 
            />
            <Text style={[
              styles.optionText,
              { color: config.gameStyle === style.value ? colors.background : colors.text }
            ]}>
              {style.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.continueButton, { backgroundColor: config.sharedMemory ? colors.accent : colors.muted + '30' }]}
        onPress={() => {
          setIsGenerating(true);
          setStep('preview');
        }}
        disabled={!config.sharedMemory}
      >
        <Text style={[styles.continueButtonText, { color: colors.background }]}>
          Hatch Our Game! 🥚✨
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );

  // Render egg hatching
  const renderPreview = () => {
    if (isGenerating) {
      return (
        <View style={styles.stepContainer}>
          <MagicEggHatcher
            theme="valentine"
            recipientName={`${config.partner1?.name} & ${config.partner2?.name}`}
            autoHatch={true}
            hatchDuration={60}
            onHatchComplete={() => {
              setIsGenerating(false);
              // In production, actually generate the game here
              onComplete(config as CouplesGameConfig);
            }}
          />

          <Text style={[styles.hatchingMessage, { color: colors.muted }]}>
            Dodo is brewing magic for {config.partner1?.name} and {config.partner2?.name}! 🥚
          </Text>
        </View>
      );
    }

    return (
      <Animated.View entering={FadeIn} style={styles.stepContainer}>
        <DodoCompanion
          mood="celebrating"
          size="large"
          message="Your couple's game has hatched! 🎉"
          floating={true}
        />

        <Text style={[styles.successTitle, { color: colors.text }]}>
          Your adventure awaits!
        </Text>
        <Text style={[styles.successSubtitle, { color: colors.muted }]}>
          Starring: {config.partner1?.name} & {config.partner2?.name}
        </Text>

        {/* Preview what was created */}
        <View style={[styles.previewCard, { backgroundColor: colors.surface }]}>
          <View style={styles.characterPair}>
            <View style={[styles.characterIcon, { backgroundColor: '#FF6B9D' }]}>
              <Icon name="account" size={32} color="#fff" />
              <Text style={styles.characterName}>{config.partner1?.name}</Text>
            </View>
            <Icon name="heart" size={24} color={colors.accent} />
            <View style={[styles.characterIcon, { backgroundColor: '#C44569' }]}>
              <Icon name="account" size={32} color="#fff" />
              <Text style={styles.characterName}>{config.partner2?.name}</Text>
            </View>
          </View>

          <Text style={[styles.previewText, { color: colors.text }]}>
            Play through your story together in a {config.gameStyle} adventure!
          </Text>
        </View>
      </Animated.View>
    );
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onCancel}>
          <Icon name="close" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Couples Game
        </Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Progress */}
      {step !== 'preview' && (
        <View style={styles.progress}>
          <View style={[styles.progressStep, { backgroundColor: colors.accent }]} />
          <View style={[styles.progressStep, { backgroundColor: step === 'partner2' || step === 'relationship' ? colors.accent : colors.muted + '30' }]} />
          <View style={[styles.progressStep, { backgroundColor: step === 'relationship' ? colors.accent : colors.muted + '30' }]} />
        </View>
      )}

      {/* Content */}
      {step === 'intro' && renderIntro()}
      {step === 'partner1' && renderPartner1()}
      {step === 'partner2' && renderPartner2()}
      {step === 'relationship' && renderRelationship()}
      {step === 'preview' && renderPreview()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  headerTitle: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
  },
  progress: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    gap: spacing.xs,
    marginBottom: spacing.xl,
  },
  progressStep: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  stepContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
  featureCard: {
    padding: spacing.xl,
    borderRadius: radii.xl,
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  featureTitle: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    marginTop: spacing.md,
  },
  featureDescription: {
    fontSize: typography.size.base,
    textAlign: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  featureList: {
    width: '100%',
    gap: spacing.sm,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  featureItemText: {
    fontSize: typography.size.sm,
    flex: 1,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radii.md,
    marginTop: spacing.lg,
  },
  premiumText: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.bold,
  },
  stepTitle: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  label: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  input: {
    fontSize: typography.size.base,
    padding: spacing.md,
    borderRadius: radii.md,
    borderWidth: 1,
  },
  messageInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  optionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  optionButton: {
    flex: 1,
    minWidth: '45%',
    padding: spacing.md,
    borderRadius: radii.md,
    borderWidth: 1,
    alignItems: 'center',
  },
  styleButton: {
    flex: 1,
    minWidth: '45%',
    padding: spacing.md,
    borderRadius: radii.md,
    borderWidth: 1,
    alignItems: 'center',
    gap: spacing.xs,
  },
  optionText: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    borderRadius: radii.md,
    marginTop: spacing.xl,
    gap: spacing.sm,
  },
  continueButtonText: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.bold,
  },
  hatchingMessage: {
    fontSize: typography.size.base,
    textAlign: 'center',
    marginTop: spacing.xl,
    fontStyle: 'italic',
  },
  successTitle: {
    fontSize: typography.size.xxl,
    fontWeight: typography.weight.bold,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
  successSubtitle: {
    fontSize: typography.size.base,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  previewCard: {
    padding: spacing.xl,
    borderRadius: radii.xl,
    marginTop: spacing.xl,
  },
  characterPair: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  characterIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  characterName: {
    position: 'absolute',
    bottom: -20,
    fontSize: typography.size.xs,
    fontWeight: typography.weight.bold,
    color: '#fff',
  },
  previewText: {
    fontSize: typography.size.sm,
    textAlign: 'center',
  },
});
