import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  FadeIn,
  FadeOut,
  SlideInRight,
  SlideOutLeft,
} from 'react-native-reanimated';
import { useTheme } from '../contexts/ThemeContext';
import { RootStackParamList } from '../types';
import {
  GiftForgeQuestionnaire,
  WizardStep,
  GiftOccasion,
  AgeRange,
  PersonalityTrait,
  Interest,
  Relationship,
  Tone,
  GiftGameType,
  GameLength,
  GiftVisualStyle,
  OCCASION_LABELS,
  AGE_LABELS,
  PERSONALITY_LABELS,
  INTEREST_LABELS,
  RELATIONSHIP_LABELS,
  TONE_LABELS,
  GAME_TYPE_LABELS,
  GAME_TYPE_DESCRIPTIONS,
  GAME_LENGTH_LABELS,
  VISUAL_STYLE_LABELS,
  GeneratedGiftGame,
} from '../types/giftforge';
import { grokService } from '../services/GrokService';

type NavigationProp = StackNavigationProp<RootStackParamList>;

const { width, height } = Dimensions.get('window');

const WIZARD_STEPS: WizardStep[] = [
  'occasion',
  'recipient_profile',
  'relationship_tone',
  'game_type',
  'visual_style',
  'personalization',
  'confirmation',
];

const STEP_TITLES: Record<WizardStep, string> = {
  occasion: 'What\'s the Occasion?',
  recipient_profile: 'Tell Us About Them',
  relationship_tone: 'Your Connection',
  game_type: 'Choose the Game Style',
  visual_style: 'Pick a Look',
  personalization: 'Make It Personal',
  confirmation: 'Review & Create',
};

const ENCOURAGING_MESSAGES = [
  '✨ This is going to be amazing!',
  '🎉 They\'re going to love it!',
  '💝 What a thoughtful gift!',
  '🌟 You\'re creating something special!',
  '🎁 Almost there - keep going!',
];

export default function GiftForgeWizardScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { theme } = useTheme();
  
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [questionnaire, setQuestionnaire] = useState<Partial<GiftForgeQuestionnaire>>({
    recipientPersonalities: [],
    recipientInterests: [],
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedGame, setGeneratedGame] = useState<GeneratedGiftGame | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);
  
  // Animation values
  const progress = useSharedValue(0);
  const cardScale = useSharedValue(1);
  
  const currentStep = WIZARD_STEPS[currentStepIndex];
  
  // Update progress animation
  useEffect(() => {
    progress.value = withSpring((currentStepIndex + 1) / WIZARD_STEPS.length);
  }, [currentStepIndex]);
  
  const progressStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  const canProceed = useCallback((): boolean => {
    switch (currentStep) {
      case 'occasion':
        return !!questionnaire.occasion;
      case 'recipient_profile':
        return !!questionnaire.recipientAge && 
               (questionnaire.recipientPersonalities?.length || 0) > 0 &&
               (questionnaire.recipientInterests?.length || 0) > 0;
      case 'relationship_tone':
        return !!questionnaire.relationship && !!questionnaire.tone;
      case 'game_type':
        return !!questionnaire.gameType && !!questionnaire.gameLength;
      case 'visual_style':
        return !!questionnaire.visualStyle;
      case 'personalization':
        return !!questionnaire.recipientName && 
               !!questionnaire.senderName && 
               !!questionnaire.personalMessage;
      case 'confirmation':
        return true;
      default:
        return false;
    }
  }, [currentStep, questionnaire]);

  const handleNext = useCallback(() => {
    if (currentStepIndex < WIZARD_STEPS.length - 1) {
      cardScale.value = withSpring(0.95, {}, () => {
        cardScale.value = withSpring(1);
      });
      setCurrentStepIndex(prev => prev + 1);
    }
  }, [currentStepIndex]);

  const handleBack = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    } else {
      navigation.goBack();
    }
  }, [currentStepIndex, navigation]);

  const handleGenerate = useCallback(async () => {
    // Show fake paywall first
    setShowPaywall(true);
  }, []);

  const handleFakePayment = useCallback(async () => {
    setShowPaywall(false);
    setIsGenerating(true);
    setError(null);
    
    try {
      const result = await grokService.generateGame(questionnaire as GiftForgeQuestionnaire);
      
      if (result.success && result.game) {
        setGeneratedGame(result.game);
        // Navigate to result screen
        navigation.navigate('GiftForgeResult', { gameId: result.game.id });
      } else {
        setError(result.error || 'Failed to generate game. Please try again.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  }, [questionnaire, navigation]);

  const updateQuestionnaire = useCallback((updates: Partial<GiftForgeQuestionnaire>) => {
    setQuestionnaire(prev => ({ ...prev, ...updates }));
  }, []);

  const toggleArrayItem = useCallback(<T extends string>(
    field: 'recipientPersonalities' | 'recipientInterests',
    item: T,
    maxItems: number = 3
  ) => {
    setQuestionnaire(prev => {
      const currentArray = (prev[field] as T[]) || [];
      const isSelected = currentArray.includes(item);
      
      if (isSelected) {
        return { ...prev, [field]: currentArray.filter(i => i !== item) };
      } else if (currentArray.length < maxItems) {
        return { ...prev, [field]: [...currentArray, item] };
      }
      return prev;
    });
  }, []);

  // Render selection grid
  const renderSelectionGrid = <T extends string>(
    items: Record<T, string>,
    selectedValue: T | undefined,
    onSelect: (value: T) => void,
    columns: number = 2
  ) => (
    <View style={[styles.selectionGrid, { flexWrap: 'wrap' }]}>
      {(Object.entries(items) as [T, string][]).map(([key, label]) => (
        <Animated.View
          key={key}
          entering={FadeIn.delay(100)}
          style={{ width: `${100 / columns - 2}%`, margin: '1%' }}
        >
          <TouchableOpacity
            style={[
              styles.selectionItem,
              { backgroundColor: theme.colors.card },
              selectedValue === key && { 
                backgroundColor: theme.colors.primary,
                borderColor: theme.colors.primary,
              },
            ]}
            onPress={() => onSelect(key)}
          >
            <Text
              style={[
                styles.selectionItemText,
                { color: theme.colors.text },
                selectedValue === key && { color: '#fff' },
              ]}
            >
              {label}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      ))}
    </View>
  );

  // Render multi-selection grid
  const renderMultiSelectionGrid = <T extends string>(
    items: Record<T, string>,
    selectedValues: T[],
    onToggle: (value: T) => void,
    maxItems: number,
    columns: number = 2
  ) => (
    <View>
      <Text style={[styles.selectionHint, { color: theme.colors.text + '80' }]}>
        Select up to {maxItems} ({selectedValues.length}/{maxItems})
      </Text>
      <View style={[styles.selectionGrid, { flexWrap: 'wrap' }]}>
        {(Object.entries(items) as [T, string][]).map(([key, label]) => {
          const isSelected = selectedValues.includes(key);
          return (
            <Animated.View
              key={key}
              entering={FadeIn.delay(100)}
              style={{ width: `${100 / columns - 2}%`, margin: '1%' }}
            >
              <TouchableOpacity
                style={[
                  styles.selectionItem,
                  { backgroundColor: theme.colors.card },
                  isSelected && { 
                    backgroundColor: theme.colors.primary,
                    borderColor: theme.colors.primary,
                  },
                ]}
                onPress={() => onToggle(key)}
              >
                <Text
                  style={[
                    styles.selectionItemText,
                    { color: theme.colors.text },
                    isSelected && { color: '#fff' },
                  ]}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </View>
    </View>
  );

  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 'occasion':
        return renderSelectionGrid(
          OCCASION_LABELS,
          questionnaire.occasion,
          (value) => updateQuestionnaire({ occasion: value }),
          2
        );
        
      case 'recipient_profile':
        return (
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={[styles.sectionLabel, { color: theme.colors.text }]}>
              Age Group
            </Text>
            {renderSelectionGrid(
              AGE_LABELS,
              questionnaire.recipientAge,
              (value) => updateQuestionnaire({ recipientAge: value }),
              2
            )}
            
            <Text style={[styles.sectionLabel, { color: theme.colors.text, marginTop: 24 }]}>
              Personality Traits
            </Text>
            {renderMultiSelectionGrid(
              PERSONALITY_LABELS,
              questionnaire.recipientPersonalities || [],
              (value) => toggleArrayItem('recipientPersonalities', value, 3),
              3,
              2
            )}
            
            <Text style={[styles.sectionLabel, { color: theme.colors.text, marginTop: 24 }]}>
              Interests
            </Text>
            {renderMultiSelectionGrid(
              INTEREST_LABELS,
              questionnaire.recipientInterests || [],
              (value) => toggleArrayItem('recipientInterests', value, 3),
              3,
              2
            )}
          </ScrollView>
        );
        
      case 'relationship_tone':
        return (
          <View>
            <Text style={[styles.sectionLabel, { color: theme.colors.text }]}>
              Your Relationship
            </Text>
            {renderSelectionGrid(
              RELATIONSHIP_LABELS,
              questionnaire.relationship,
              (value) => updateQuestionnaire({ relationship: value }),
              3
            )}
            
            <Text style={[styles.sectionLabel, { color: theme.colors.text, marginTop: 24 }]}>
              Tone & Feel
            </Text>
            {renderSelectionGrid(
              TONE_LABELS,
              questionnaire.tone,
              (value) => updateQuestionnaire({ tone: value }),
              2
            )}
          </View>
        );
        
      case 'game_type':
        return (
          <View>
            <Text style={[styles.sectionLabel, { color: theme.colors.text }]}>
              Game Style
            </Text>
            {(Object.entries(GAME_TYPE_LABELS) as [GiftGameType, string][]).map(([key, label]) => (
              <Animated.View key={key} entering={FadeIn.delay(100)}>
                <TouchableOpacity
                  style={[
                    styles.gameTypeCard,
                    { backgroundColor: theme.colors.card },
                    questionnaire.gameType === key && {
                      backgroundColor: theme.colors.primary + '20',
                      borderColor: theme.colors.primary,
                      borderWidth: 2,
                    },
                  ]}
                  onPress={() => updateQuestionnaire({ gameType: key })}
                >
                  <Text style={[styles.gameTypeTitle, { color: theme.colors.text }]}>
                    {label}
                  </Text>
                  <Text style={[styles.gameTypeDesc, { color: theme.colors.text + '80' }]}>
                    {GAME_TYPE_DESCRIPTIONS[key]}
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            ))}
            
            <Text style={[styles.sectionLabel, { color: theme.colors.text, marginTop: 24 }]}>
              Game Length
            </Text>
            {renderSelectionGrid(
              GAME_LENGTH_LABELS,
              questionnaire.gameLength,
              (value) => updateQuestionnaire({ gameLength: value }),
              3
            )}
          </View>
        );
        
      case 'visual_style':
        return (
          <View>
            <Text style={[styles.sectionLabel, { color: theme.colors.text }]}>
              Visual Theme
            </Text>
            {renderSelectionGrid(
              VISUAL_STYLE_LABELS,
              questionnaire.visualStyle,
              (value) => updateQuestionnaire({ visualStyle: value }),
              2
            )}
          </View>
        );
        
      case 'personalization':
        return (
          <View>
            <Text style={[styles.sectionLabel, { color: theme.colors.text }]}>
              Recipient's Name
            </Text>
            <TextInput
              style={[styles.textInput, { backgroundColor: theme.colors.card, color: theme.colors.text }]}
              placeholder="Who is this gift for?"
              placeholderTextColor={theme.colors.text + '60'}
              value={questionnaire.recipientName}
              onChangeText={(text) => updateQuestionnaire({ recipientName: text })}
              maxLength={50}
            />
            
            <Text style={[styles.sectionLabel, { color: theme.colors.text, marginTop: 20 }]}>
              Your Name
            </Text>
            <TextInput
              style={[styles.textInput, { backgroundColor: theme.colors.card, color: theme.colors.text }]}
              placeholder="From..."
              placeholderTextColor={theme.colors.text + '60'}
              value={questionnaire.senderName}
              onChangeText={(text) => updateQuestionnaire({ senderName: text })}
              maxLength={50}
            />
            
            <Text style={[styles.sectionLabel, { color: theme.colors.text, marginTop: 20 }]}>
              Personal Message
            </Text>
            <TextInput
              style={[styles.textInputMulti, { backgroundColor: theme.colors.card, color: theme.colors.text }]}
              placeholder="Write a heartfelt message that will appear at the end of the game..."
              placeholderTextColor={theme.colors.text + '60'}
              value={questionnaire.personalMessage}
              onChangeText={(text) => updateQuestionnaire({ personalMessage: text })}
              multiline
              numberOfLines={4}
              maxLength={500}
            />
            <Text style={[styles.charCount, { color: theme.colors.text + '60' }]}>
              {questionnaire.personalMessage?.length || 0}/500
            </Text>
          </View>
        );
        
      case 'confirmation':
        return (
          <ScrollView showsVerticalScrollIndicator={false}>
            <Animated.View entering={FadeIn}>
              <View style={[styles.confirmationCard, { backgroundColor: theme.colors.card }]}>
                <Text style={[styles.confirmationTitle, { color: theme.colors.primary }]}>
                  🎁 Gift Summary
                </Text>
                
                <View style={styles.confirmationRow}>
                  <Text style={[styles.confirmationLabel, { color: theme.colors.text + '80' }]}>
                    For:
                  </Text>
                  <Text style={[styles.confirmationValue, { color: theme.colors.text }]}>
                    {questionnaire.recipientName}
                  </Text>
                </View>
                
                <View style={styles.confirmationRow}>
                  <Text style={[styles.confirmationLabel, { color: theme.colors.text + '80' }]}>
                    From:
                  </Text>
                  <Text style={[styles.confirmationValue, { color: theme.colors.text }]}>
                    {questionnaire.senderName}
                  </Text>
                </View>
                
                <View style={styles.confirmationRow}>
                  <Text style={[styles.confirmationLabel, { color: theme.colors.text + '80' }]}>
                    Occasion:
                  </Text>
                  <Text style={[styles.confirmationValue, { color: theme.colors.text }]}>
                    {questionnaire.occasion && OCCASION_LABELS[questionnaire.occasion]}
                  </Text>
                </View>
                
                <View style={styles.confirmationRow}>
                  <Text style={[styles.confirmationLabel, { color: theme.colors.text + '80' }]}>
                    Game:
                  </Text>
                  <Text style={[styles.confirmationValue, { color: theme.colors.text }]}>
                    {questionnaire.gameType && GAME_TYPE_LABELS[questionnaire.gameType]}
                  </Text>
                </View>
                
                <View style={styles.confirmationRow}>
                  <Text style={[styles.confirmationLabel, { color: theme.colors.text + '80' }]}>
                    Style:
                  </Text>
                  <Text style={[styles.confirmationValue, { color: theme.colors.text }]}>
                    {questionnaire.visualStyle && VISUAL_STYLE_LABELS[questionnaire.visualStyle]}
                  </Text>
                </View>
                
                <View style={[styles.messagePreview, { backgroundColor: theme.colors.background }]}>
                  <Text style={[styles.messagePreviewLabel, { color: theme.colors.text + '80' }]}>
                    Your Message:
                  </Text>
                  <Text style={[styles.messagePreviewText, { color: theme.colors.text }]}>
                    "{questionnaire.personalMessage}"
                  </Text>
                </View>
              </View>
              
              <Text style={[styles.encouragingMessage, { color: theme.colors.primary }]}>
                {ENCOURAGING_MESSAGES[Math.floor(Math.random() * ENCOURAGING_MESSAGES.length)]}
              </Text>
            </Animated.View>
          </ScrollView>
        );
        
      default:
        return null;
    }
  };

  // Render paywall modal
  const renderPaywall = () => (
    <View style={styles.paywallOverlay}>
      <Animated.View 
        entering={FadeIn}
        style={[styles.paywallCard, { backgroundColor: theme.colors.card }]}
      >
        <Icon name="gift" size={64} color={theme.colors.primary} />
        <Text style={[styles.paywallTitle, { color: theme.colors.text }]}>
          Create Your Gift! 🎁
        </Text>
        <Text style={[styles.paywallSubtitle, { color: theme.colors.text + '80' }]}>
          Generate a personalized mini-game for your special someone
        </Text>
        
        <View style={styles.paywallFeatures}>
          <Text style={[styles.paywallFeature, { color: theme.colors.text }]}>
            ✓ Unique playable game link
          </Text>
          <Text style={[styles.paywallFeature, { color: theme.colors.text }]}>
            ✓ Personalized content & dialogue
          </Text>
          <Text style={[styles.paywallFeature, { color: theme.colors.text }]}>
            ✓ Beautiful custom intro & outro
          </Text>
          <Text style={[styles.paywallFeature, { color: theme.colors.text }]}>
            ✓ Share via link or message
          </Text>
        </View>
        
        <TouchableOpacity
          style={[styles.paywallButton, { backgroundColor: theme.colors.primary }]}
          onPress={handleFakePayment}
        >
          <Text style={styles.paywallButtonText}>
            Create Gift - $4.99
          </Text>
        </TouchableOpacity>
        
        <Text style={[styles.paywallDisclaimer, { color: theme.colors.text + '60' }]}>
          (Demo mode - no actual payment required)
        </Text>
        
        <TouchableOpacity
          style={styles.paywallCancel}
          onPress={() => setShowPaywall(false)}
        >
          <Text style={[styles.paywallCancelText, { color: theme.colors.text + '80' }]}>
            Cancel
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );

  // Render generating overlay
  const renderGenerating = () => (
    <View style={styles.generatingOverlay}>
      <Animated.View 
        entering={FadeIn}
        style={[styles.generatingCard, { backgroundColor: theme.colors.card }]}
      >
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.generatingTitle, { color: theme.colors.text }]}>
          Creating Your Gift...
        </Text>
        <Text style={[styles.generatingSubtitle, { color: theme.colors.text + '80' }]}>
          Crafting a personalized experience for {questionnaire.recipientName}
        </Text>
        <Text style={[styles.generatingHint, { color: theme.colors.primary }]}>
          ✨ Adding a touch of magic...
        </Text>
      </Animated.View>
    </View>
  );

  // Live preview pane
  const renderPreviewPane = () => {
    if (!questionnaire.recipientName && currentStepIndex < 5) return null;
    
    return (
      <Animated.View 
        entering={FadeIn}
        style={[styles.previewPane, { backgroundColor: theme.colors.primary + '10' }]}
      >
        <Text style={[styles.previewTitle, { color: theme.colors.primary }]}>
          📱 Preview
        </Text>
        <Text style={[styles.previewText, { color: theme.colors.text }]}>
          {questionnaire.recipientName 
            ? `"Welcome, ${questionnaire.recipientName}!"` 
            : 'Enter name to see preview'}
        </Text>
        {questionnaire.gameType && (
          <Text style={[styles.previewGameType, { color: theme.colors.text + '80' }]}>
            {GAME_TYPE_LABELS[questionnaire.gameType]}
          </Text>
        )}
      </Animated.View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Icon 
            name={currentStepIndex === 0 ? 'close' : 'arrow-left'} 
            size={24} 
            color={theme.colors.text} 
          />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          Create Gift Game
        </Text>
        <View style={styles.headerRight}>
          <Text style={[styles.stepIndicator, { color: theme.colors.text + '80' }]}>
            {currentStepIndex + 1}/{WIZARD_STEPS.length}
          </Text>
        </View>
      </View>
      
      {/* Progress Bar */}
      <View style={[styles.progressBarContainer, { backgroundColor: theme.colors.card }]}>
        <Animated.View 
          style={[
            styles.progressBarFill, 
            { backgroundColor: theme.colors.primary },
            progressStyle
          ]} 
        />
      </View>
      
      {/* Step Title */}
      <Animated.View 
        key={currentStep}
        entering={SlideInRight.duration(300)}
        style={styles.stepTitleContainer}
      >
        <Text style={[styles.stepTitle, { color: theme.colors.text }]}>
          {STEP_TITLES[currentStep]}
        </Text>
      </Animated.View>
      
      {/* Content */}
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View 
          key={currentStep}
          entering={FadeIn.duration(300)}
        >
          {renderStepContent()}
        </Animated.View>
      </ScrollView>
      
      {/* Preview Pane */}
      {renderPreviewPane()}
      
      {/* Error Message */}
      {error && (
        <Animated.View 
          entering={FadeIn}
          style={[styles.errorContainer, { backgroundColor: theme.colors.error + '20' }]}
        >
          <Text style={[styles.errorText, { color: theme.colors.error }]}>
            {error}
          </Text>
        </Animated.View>
      )}
      
      {/* Bottom Navigation */}
      <View style={[styles.bottomNav, { backgroundColor: theme.colors.background }]}>
        {currentStep !== 'confirmation' ? (
          <TouchableOpacity
            style={[
              styles.nextButton,
              { backgroundColor: theme.colors.primary },
              !canProceed() && { opacity: 0.5 },
            ]}
            onPress={handleNext}
            disabled={!canProceed()}
          >
            <Text style={styles.nextButtonText}>Continue</Text>
            <Icon name="arrow-right" size={20} color="#fff" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.generateButton, { backgroundColor: theme.colors.success }]}
            onPress={handleGenerate}
          >
            <Icon name="magic-staff" size={24} color="#fff" />
            <Text style={styles.generateButtonText}>Create My Gift!</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {/* Overlays */}
      {showPaywall && renderPaywall()}
      {isGenerating && renderGenerating()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  headerRight: {
    width: 50,
    alignItems: 'flex-end',
  },
  stepIndicator: {
    fontSize: 14,
  },
  progressBarContainer: {
    height: 4,
    marginHorizontal: 16,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  stepTitleContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  selectionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  selectionItem: {
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'transparent',
    alignItems: 'center',
  },
  selectionItemText: {
    fontSize: 14,
    textAlign: 'center',
  },
  selectionHint: {
    fontSize: 13,
    marginBottom: 8,
  },
  gameTypeCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  gameTypeTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  gameTypeDesc: {
    fontSize: 14,
  },
  textInput: {
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
  },
  textInputMulti: {
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  charCount: {
    textAlign: 'right',
    marginTop: 4,
    fontSize: 12,
  },
  confirmationCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
  },
  confirmationTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  confirmationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  confirmationLabel: {
    fontSize: 14,
  },
  confirmationValue: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  messagePreview: {
    padding: 16,
    borderRadius: 12,
    marginTop: 12,
  },
  messagePreviewLabel: {
    fontSize: 12,
    marginBottom: 8,
  },
  messagePreviewText: {
    fontSize: 14,
    fontStyle: 'italic',
    lineHeight: 20,
  },
  encouragingMessage: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginVertical: 16,
  },
  previewPane: {
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
  },
  previewTitle: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  previewText: {
    fontSize: 14,
  },
  previewGameType: {
    fontSize: 12,
    marginTop: 4,
  },
  errorContainer: {
    padding: 12,
    marginHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    textAlign: 'center',
  },
  bottomNav: {
    padding: 16,
    paddingBottom: 32,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  generateButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  // Paywall styles
  paywallOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  paywallCard: {
    width: '100%',
    maxWidth: 400,
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
  },
  paywallTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  paywallSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  paywallFeatures: {
    alignSelf: 'stretch',
    marginBottom: 24,
  },
  paywallFeature: {
    fontSize: 14,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  paywallButton: {
    width: '100%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  paywallButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  paywallDisclaimer: {
    fontSize: 12,
    marginTop: 12,
    fontStyle: 'italic',
  },
  paywallCancel: {
    marginTop: 16,
    padding: 8,
  },
  paywallCancelText: {
    fontSize: 14,
  },
  // Generating overlay
  generatingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  generatingCard: {
    width: '100%',
    maxWidth: 320,
    padding: 32,
    borderRadius: 20,
    alignItems: 'center',
  },
  generatingTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 8,
  },
  generatingSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  generatingHint: {
    fontSize: 14,
    fontWeight: '500',
  },
});
