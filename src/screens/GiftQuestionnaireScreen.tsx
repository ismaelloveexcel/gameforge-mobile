import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, GiftQuestionnaire } from '../types';
import { giftGameService } from '../services/GiftGameService';
import { LinearGradient } from 'expo-linear-gradient';

type GiftQuestionnaireScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'GiftQuestionnaire'
>;
type GiftQuestionnaireScreenRouteProp = RouteProp<RootStackParamList, 'GiftQuestionnaire'>;

export const GiftQuestionnaireScreen: React.FC = () => {
  const navigation = useNavigation<GiftQuestionnaireScreenNavigationProp>();
  const route = useRoute<GiftQuestionnaireScreenRouteProp>();

  const [currentStep, setCurrentStep] = useState(1);
  const [questionnaire, setQuestionnaire] = useState<GiftQuestionnaire | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Initialize questionnaire
  useEffect(() => {
    if (route.params?.questionnaireId) {
      const existing = giftGameService.getQuestionnaire(route.params.questionnaireId);
      if (existing) {
        setQuestionnaire(existing);
      }
    } else {
      const newQuestionnaire = giftGameService.createQuestionnaire();
      setQuestionnaire(newQuestionnaire);
    }
  }, [route.params?.questionnaireId]);

  const totalSteps = 6;

  const updateField = <K extends keyof GiftQuestionnaire>(
    field: K,
    value: GiftQuestionnaire[K]
  ) => {
    if (!questionnaire) return;

    const updated = giftGameService.updateQuestionnaire(questionnaire.id, {
      [field]: value,
    });
    setQuestionnaire(updated);
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      handleGenerate();
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleGenerate = async () => {
    if (!questionnaire) return;

    const validation = giftGameService.validateQuestionnaire(questionnaire);
    if (!validation.valid) {
      Alert.alert(
        'Missing Information',
        `Please fill in: ${validation.missingFields.join(', ')}`
      );
      return;
    }

    setIsGenerating(true);

    try {
      const giftGame = await giftGameService.generateGiftGame(questionnaire.id);
      setIsGenerating(false);
      navigation.navigate('GiftPreview', { giftGameId: giftGame.id });
    } catch (error) {
      setIsGenerating(false);
      Alert.alert('Error', 'Failed to generate gift game. Please try again.');
    }
  };

  const renderProgress = () => (
    <View style={styles.progressContainer}>
      {Array.from({ length: totalSteps }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.progressDot,
            index < currentStep ? styles.progressDotActive : null,
          ]}
        />
      ))}
    </View>
  );

  const renderStep = () => {
    if (!questionnaire) return null;

    switch (currentStep) {
      case 1:
        return renderOccasionStep();
      case 2:
        return renderRecipientStep();
      case 3:
        return renderPersonalityStep();
      case 4:
        return renderToneStep();
      case 5:
        return renderPersonalizationStep();
      case 6:
        return renderPreferencesStep();
      default:
        return null;
    }
  };

  const renderOccasionStep = () => {
    const occasions = [
      { value: 'birthday', label: '🎂 Birthday', emoji: '🎂' },
      { value: 'anniversary', label: '💕 Anniversary', emoji: '💕' },
      { value: 'graduation', label: '🎓 Graduation', emoji: '🎓' },
      { value: 'thank-you', label: '🙏 Thank You', emoji: '🙏' },
      { value: 'just-because', label: '✨ Just Because', emoji: '✨' },
      { value: 'valentines', label: '💘 Valentine\'s Day', emoji: '💘' },
      { value: 'friendship', label: '👯 Friendship', emoji: '👯' },
    ];

    return (
      <View style={styles.stepContainer}>
        <Text style={styles.stepTitle}>What's the occasion?</Text>
        <Text style={styles.stepSubtitle}>Choose what you're celebrating</Text>

        <View style={styles.optionsGrid}>
          {occasions.map((occasion) => (
            <TouchableOpacity
              key={occasion.value}
              style={[
                styles.optionCard,
                questionnaire?.occasion === occasion.value && styles.optionCardSelected,
              ]}
              onPress={() => updateField('occasion', occasion.value as any)}
            >
              <Text style={styles.optionEmoji}>{occasion.emoji}</Text>
              <Text style={styles.optionLabel}>
                {occasion.label.replace(occasion.emoji + ' ', '')}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  const renderRecipientStep = () => {
    const relationships = [
      { value: 'partner', label: '💑 Partner' },
      { value: 'friend', label: '👫 Friend' },
      { value: 'parent', label: '👨‍👩‍👧 Parent' },
      { value: 'child', label: '👶 Child' },
      { value: 'sibling', label: '👫 Sibling' },
      { value: 'colleague', label: '💼 Colleague' },
      { value: 'other', label: '🎁 Other' },
    ];

    return (
      <View style={styles.stepContainer}>
        <Text style={styles.stepTitle}>Who's this gift for?</Text>
        <Text style={styles.stepSubtitle}>Tell us about them</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Their Name</Text>
          <TextInput
            style={styles.textInput}
            value={questionnaire?.recipientName}
            onChangeText={(text) => updateField('recipientName', text)}
            placeholder="e.g., Sarah"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Your Relationship</Text>
          <View style={styles.optionsGrid}>
            {relationships.map((rel) => (
              <TouchableOpacity
                key={rel.value}
                style={[
                  styles.chipButton,
                  questionnaire?.relationship === rel.value && styles.chipButtonSelected,
                ]}
                onPress={() => updateField('relationship', rel.value as any)}
              >
                <Text
                  style={[
                    styles.chipText,
                    questionnaire?.relationship === rel.value && styles.chipTextSelected,
                  ]}
                >
                  {rel.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    );
  };

  const renderPersonalityStep = () => {
    const traits = [
      'adventurous',
      'creative',
      'thoughtful',
      'funny',
      'competitive',
      'caring',
      'energetic',
      'calm',
      'curious',
      'artistic',
    ];

    const interests = [
      'cats',
      'dogs',
      'travel',
      'music',
      'sports',
      'reading',
      'gaming',
      'art',
      'cooking',
      'tech',
      'nature',
      'movies',
    ];

    const toggleTrait = (trait: string) => {
      const current = questionnaire?.recipientTraits || [];
      const updated = current.includes(trait)
        ? current.filter((t) => t !== trait)
        : [...current, trait];
      updateField('recipientTraits', updated);
    };

    const toggleInterest = (interest: string) => {
      const current = questionnaire?.interests || [];
      const updated = current.includes(interest)
        ? current.filter((i) => i !== interest)
        : [...current, interest];
      updateField('interests', updated);
    };

    return (
      <View style={styles.stepContainer}>
        <Text style={styles.stepTitle}>Tell us about them</Text>
        <Text style={styles.stepSubtitle}>Select all that apply</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Personality Traits</Text>
          <View style={styles.chipsContainer}>
            {traits.map((trait) => (
              <TouchableOpacity
                key={trait}
                style={[
                  styles.chip,
                  questionnaire?.recipientTraits.includes(trait) && styles.chipSelected,
                ]}
                onPress={() => toggleTrait(trait)}
              >
                <Text
                  style={[
                    styles.chipText,
                    questionnaire?.recipientTraits.includes(trait) &&
                      styles.chipTextSelected,
                  ]}
                >
                  {trait}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Interests</Text>
          <View style={styles.chipsContainer}>
            {interests.map((interest) => (
              <TouchableOpacity
                key={interest}
                style={[
                  styles.chip,
                  questionnaire?.interests.includes(interest) && styles.chipSelected,
                ]}
                onPress={() => toggleInterest(interest)}
              >
                <Text
                  style={[
                    styles.chipText,
                    questionnaire?.interests.includes(interest) &&
                      styles.chipTextSelected,
                  ]}
                >
                  {interest}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    );
  };

  const renderToneStep = () => {
    const tones = [
      { value: 'warm-heartfelt', label: '❤️ Warm & Heartfelt', desc: 'Sweet and emotional' },
      { value: 'fun-playful', label: '🎮 Fun & Playful', desc: 'Energetic and exciting' },
      { value: 'funny-silly', label: '😄 Funny & Silly', desc: 'Lighthearted and humorous' },
      { value: 'inspirational', label: '✨ Inspirational', desc: 'Motivating and uplifting' },
      { value: 'nostalgic', label: '💭 Nostalgic', desc: 'Memories and reflection' },
    ];

    const gameStyles = [
      { value: 'runner', label: '🏃 Runner', desc: 'Collect items while moving' },
      { value: 'story-choice', label: '📖 Story', desc: 'Make choices in a narrative' },
      { value: 'puzzle', label: '🧩 Puzzle', desc: 'Solve challenges' },
      { value: 'mini-quest', label: '⚔️ Quest', desc: 'Adventure with stages' },
      { value: 'educational', label: '📚 Educational', desc: 'Learn something new' },
    ];

    return (
      <View style={styles.stepContainer}>
        <Text style={styles.stepTitle}>Choose the vibe</Text>
        <Text style={styles.stepSubtitle}>Pick the emotional tone and game style</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Emotional Tone</Text>
          {tones.map((tone) => (
            <TouchableOpacity
              key={tone.value}
              style={[
                styles.listOption,
                questionnaire?.emotionalTone === tone.value && styles.listOptionSelected,
              ]}
              onPress={() => updateField('emotionalTone', tone.value as any)}
            >
              <Text style={styles.listOptionLabel}>{tone.label}</Text>
              <Text style={styles.listOptionDesc}>{tone.desc}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Game Style</Text>
          {gameStyles.map((style) => (
            <TouchableOpacity
              key={style.value}
              style={[
                styles.listOption,
                questionnaire?.gameStyle === style.value && styles.listOptionSelected,
              ]}
              onPress={() => updateField('gameStyle', style.value as any)}
            >
              <Text style={styles.listOptionLabel}>{style.label}</Text>
              <Text style={styles.listOptionDesc}>{style.desc}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  const renderPersonalizationStep = () => {
    return (
      <View style={styles.stepContainer}>
        <Text style={styles.stepTitle}>Add your personal touch</Text>
        <Text style={styles.stepSubtitle}>Make it uniquely yours</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Your Name</Text>
          <TextInput
            style={styles.textInput}
            value={questionnaire?.senderName}
            onChangeText={(text) => updateField('senderName', text)}
            placeholder="e.g., Alex"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Custom Message (Optional)</Text>
          <TextInput
            style={[styles.textInput, styles.textArea]}
            value={questionnaire?.customMessage}
            onChangeText={(text) => updateField('customMessage', text)}
            placeholder="A special message that will appear in the game..."
            placeholderTextColor="#999"
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.previewBox}>
          <Text style={styles.previewLabel}>Preview:</Text>
          <Text style={styles.previewText}>
            {giftGameService.generatePreview(questionnaire || {}).messagePreview}
          </Text>
        </View>
      </View>
    );
  };

  const renderPreferencesStep = () => {
    const durations = [
      { value: '5-min', label: '5 minutes', desc: 'Quick and sweet' },
      { value: '10-min', label: '10 minutes', desc: 'Just right' },
      { value: '15-min', label: '15 minutes', desc: 'Extended experience' },
    ];

    const difficulties = [
      { value: 'easy', label: 'Easy', desc: 'Relaxing and accessible' },
      { value: 'medium', label: 'Medium', desc: 'Balanced challenge' },
      { value: 'challenging', label: 'Challenging', desc: 'For game lovers' },
    ];

    return (
      <View style={styles.stepContainer}>
        <Text style={styles.stepTitle}>Final touches</Text>
        <Text style={styles.stepSubtitle}>Set game preferences</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Game Duration</Text>
          {durations.map((duration) => (
            <TouchableOpacity
              key={duration.value}
              style={[
                styles.listOption,
                questionnaire?.gameDuration === duration.value && styles.listOptionSelected,
              ]}
              onPress={() => updateField('gameDuration', duration.value as any)}
            >
              <Text style={styles.listOptionLabel}>{duration.label}</Text>
              <Text style={styles.listOptionDesc}>{duration.desc}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Difficulty</Text>
          {difficulties.map((difficulty) => (
            <TouchableOpacity
              key={difficulty.value}
              style={[
                styles.listOption,
                questionnaire?.difficultyLevel === difficulty.value &&
                  styles.listOptionSelected,
              ]}
              onPress={() => updateField('difficultyLevel', difficulty.value as any)}
            >
              <Text style={styles.listOptionLabel}>{difficulty.label}</Text>
              <Text style={styles.listOptionDesc}>{difficulty.desc}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  if (isGenerating) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#667EEA" />
        <Text style={styles.loadingText}>Creating your gift game... ✨</Text>
        <Text style={styles.loadingSubtext}>This usually takes 5-10 seconds</Text>
      </View>
    );
  }

  return (
    <LinearGradient colors={['#667EEA', '#764BA2']} style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Create a Gift Game 🎁</Text>
          <Text style={styles.headerSubtitle}>
            Step {currentStep} of {totalSteps}
          </Text>
        </View>

        {renderProgress()}

        <View style={styles.content}>{renderStep()}</View>

        <View style={styles.buttonContainer}>
          {currentStep > 1 && (
            <TouchableOpacity style={styles.secondaryButton} onPress={prevStep}>
              <Text style={styles.secondaryButtonText}>Back</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.primaryButton, currentStep === 1 && styles.primaryButtonFull]}
            onPress={nextStep}
          >
            <Text style={styles.primaryButtonText}>
              {currentStep === totalSteps ? 'Generate Gift 🎉' : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 30,
  },
  progressDot: {
    width: 30,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
  },
  progressDotActive: {
    backgroundColor: '#fff',
  },
  content: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
  },
  stepContainer: {
    minHeight: 400,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  textInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  optionCard: {
    width: '47%',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionCardSelected: {
    backgroundColor: '#EEF2FF',
    borderColor: '#667EEA',
  },
  optionEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  optionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  chipButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  chipButtonSelected: {
    backgroundColor: '#667EEA',
    borderColor: '#667EEA',
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  chipSelected: {
    backgroundColor: '#667EEA',
    borderColor: '#667EEA',
  },
  chipText: {
    fontSize: 14,
    color: '#333',
  },
  chipTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  listOption: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  listOptionSelected: {
    backgroundColor: '#EEF2FF',
    borderColor: '#667EEA',
  },
  listOptionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  listOptionDesc: {
    fontSize: 14,
    color: '#666',
  },
  previewBox: {
    backgroundColor: '#EEF2FF',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#667EEA',
  },
  previewLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#667EEA',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  previewText: {
    fontSize: 16,
    color: '#333',
    fontStyle: 'italic',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
  },
  primaryButtonFull: {
    flex: 1,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#667EEA',
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fff',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 40,
  },
  loadingText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginTop: 20,
    textAlign: 'center',
  },
  loadingSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
});
