import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
  Image,
  Dimensions,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Animated, {
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  useAnimatedProps,
  withTiming,
  withDelay,
  withRepeat,
  withSequence,
  interpolate,
  interpolateColor,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { RootStackParamList, GiftQuestionnaire } from '../types';
import { giftGameService } from '../services/GiftGameService';
import { AlchemistCompanion, ParticleField, PressableScale, ShimmerOverlay } from '../components';
import { artStyleService } from '../services/ArtStyleService';
import { PlayGiftConsumerMode } from '../config/flags';

let BlurView: React.ComponentType<any> | null = null;
try {
  BlurView = require('expo-blur').BlurView;
} catch (error) {
  BlurView = null;
}

let ImagePickerModule: any = null;
let ExpoAV: any = null;
try {
  ImagePickerModule = require('expo-image-picker');
} catch (error) {
  ImagePickerModule = null;
}
try {
  ExpoAV = require('expo-av');
} catch (error) {
  ExpoAV = null;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

const occasionOptions = [
  { value: 'birthday', label: '🎂 Birthday', emoji: '🎂' },
  { value: 'anniversary', label: '💕 Anniversary', emoji: '💕' },
  { value: 'ramadan', label: '🌙 Ramadan', emoji: '🌙' },
  { value: 'graduation', label: '🎓 Graduation', emoji: '🎓' },
  { value: 'thank-you', label: '🙏 Thank You', emoji: '🙏' },
  { value: 'just-because', label: '✨ Just Because', emoji: '✨' },
  { value: 'valentines', label: '💘 Valentine\'s Day', emoji: '💘' },
  { value: 'friendship', label: '👯 Friendship', emoji: '👯' },
];

const relationshipLabels: Record<string, string> = {
  partner: '💑 Partner',
  friend: '👫 Friend',
  parent: '👨‍👩‍👧 Parent',
  child: '👶 Child',
  sibling: '👫 Sibling',
  colleague: '💼 Colleague',
  other: '🎁 Other',
};

const toneLabels: Record<string, string> = {
  'warm-heartfelt': '❤️ Warm & Heartfelt',
  'fun-playful': '🎮 Fun & Playful',
  'funny-silly': '😄 Funny & Silly',
  inspirational: '✨ Inspirational',
  nostalgic: '💭 Nostalgic',
};

const gameStyleLabels: Record<string, string> = {
  runner: '🏃 Runner',
  'story-choice': '📖 Story',
  puzzle: '🧩 Puzzle',
  'mini-quest': '⚔️ Quest',
  educational: '📚 Educational',
};

type VisualTheme = {
  id: string;
  gradient: [string, string, string];
  accent: string;
  glow: string;
  particleColors: string[];
  emojiParticles: string[];
};

const VISUAL_THEMES: Record<string, VisualTheme> = {
  default: {
    id: 'default',
    gradient: ['#1B2338', '#3A2B6C', '#6C3AA8'],
    accent: '#C7B6FF',
    glow: '#9B8CFF',
    particleColors: ['#C7B6FF55', '#F7D28B55', '#7ED8FF45'],
    emojiParticles: ['✨', '💫', '🪄'],
  },
  romantic: {
    id: 'romantic',
    gradient: ['#FCE7F3', '#F9A8D4', '#F472B6'],
    accent: '#F472B6',
    glow: '#F9A8D4',
    particleColors: ['#F472B655', '#F9A8D455', '#FBCFE855'],
    emojiParticles: ['🌸', '💕', '✨'],
  },
  ramadan: {
    id: 'ramadan',
    gradient: ['#0B1220', '#143A3B', '#3C2B7B'],
    accent: '#F5C56B',
    glow: '#F5C56B',
    particleColors: ['#F5C56B55', '#67E8F955', '#34D39945'],
    emojiParticles: ['🏮', '🌙', '✨'],
  },
  valentine: {
    id: 'valentine',
    gradient: ['#FFF1F7', '#FBCFE8', '#C4B5FD'],
    accent: '#FF7FB0',
    glow: '#F9A8D4',
    particleColors: ['#FF7FB055', '#FBCFE855', '#C4B5FD55'],
    emojiParticles: ['💖', '💘', '💗'],
  },
};

type EmojiParticle = {
  id: number;
  emoji: string;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  drift: number;
};

const generateEmojiParticles = (emojis: string[]): EmojiParticle[] => {
  const count = 10;
  return Array.from({ length: count }, (_, index) => ({
    id: index,
    emoji: emojis[index % emojis.length],
    x: Math.random() * SCREEN_WIDTH,
    y: Math.random() * SCREEN_HEIGHT * 0.9,
    size: 14 + Math.random() * 10,
    duration: 8000 + Math.random() * 6000,
    delay: Math.random() * 1200,
    drift: 16 + Math.random() * 30,
  }));
};

const FloatingEmoji = ({ particle }: { particle: EmojiParticle }) => {
  const translateY = useSharedValue(particle.y);
  const translateX = useSharedValue(particle.x);
  const opacity = useSharedValue(0);

  useEffect(() => {
    translateY.value = withDelay(
      particle.delay,
      withRepeat(
        withTiming(particle.y - particle.drift, {
          duration: particle.duration,
          easing: Easing.inOut(Easing.sin),
        }),
        -1,
        true
      )
    );

    translateX.value = withDelay(
      particle.delay,
      withRepeat(
        withTiming(particle.x + particle.drift, {
          duration: particle.duration * 1.2,
          easing: Easing.inOut(Easing.sin),
        }),
        -1,
        true
      )
    );

    opacity.value = withDelay(
      particle.delay,
      withRepeat(
        withTiming(0.7, {
          duration: particle.duration / 2,
          easing: Easing.inOut(Easing.ease),
        }),
        -1,
        true
      )
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    position: 'absolute',
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.Text style={[style, { fontSize: particle.size }]}>
      {particle.emoji}
    </Animated.Text>
  );
};

const GlassPanel = ({ children, style }: { children: React.ReactNode; style?: any }) => {
  if (BlurView) {
    return (
      <BlurView intensity={28} tint="light" style={[styles.glassPanel, style]}>
        <View style={styles.glassInner}>{children}</View>
      </BlurView>
    );
  }

  return (
    <View style={[styles.glassPanelFallback, style]}>
      {children}
    </View>
  );
};

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
  const [memoryPhotoUri, setMemoryPhotoUri] = useState<string | null>(null);
  const [voiceNoteUri, setVoiceNoteUri] = useState<string | null>(null);
  const [voiceNoteDuration, setVoiceNoteDuration] = useState<number | null>(null);
  const [recording, setRecording] = useState<any | null>(null);
  const [isRecording, setIsRecording] = useState(false);

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

  useEffect(() => {
    if (questionnaire?.photos?.[0]) {
      setMemoryPhotoUri(questionnaire.photos[0]);
    }
    if (questionnaire?.voiceNoteUri) {
      setVoiceNoteUri(questionnaire.voiceNoteUri);
    }
    if (questionnaire?.voiceNoteDuration) {
      setVoiceNoteDuration(questionnaire.voiceNoteDuration);
    }
  }, [questionnaire?.photos, questionnaire?.voiceNoteUri, questionnaire?.voiceNoteDuration]);

  const totalSteps = 6;

  const themeProgress = useSharedValue(1);
  const glowPulse = useSharedValue(0);
  const shimmer = useSharedValue(0);

  const [fromTheme, setFromTheme] = useState<VisualTheme>(VISUAL_THEMES.default);
  const [toTheme, setToTheme] = useState<VisualTheme>(VISUAL_THEMES.default);

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

  const getVisualThemeKey = (data: GiftQuestionnaire | null) => {
    const occasion = data?.occasion || '';
    if (occasion.includes('ramadan')) return 'ramadan';
    if (occasion.includes('valentines')) return 'valentine';
    if (occasion.includes('anniversary') || data?.emotionalTone === 'warm-heartfelt') {
      return 'romantic';
    }
    return 'default';
  };

  useEffect(() => {
    const nextThemeKey = getVisualThemeKey(questionnaire);
    const nextTheme = VISUAL_THEMES[nextThemeKey];
    if (!PlayGiftConsumerMode) {
      if (toTheme.id !== VISUAL_THEMES.default.id) {
        setFromTheme(VISUAL_THEMES.default);
        setToTheme(VISUAL_THEMES.default);
      }
    } else if (nextTheme.id !== toTheme.id) {
      setFromTheme(toTheme);
      setToTheme(nextTheme);
      themeProgress.value = 0;
      themeProgress.value = withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.ease) });
    }

    if (nextThemeKey === 'ramadan') {
      artStyleService.setActiveStyle('ramadan-lantern-glow');
    } else if (nextThemeKey === 'valentine' || nextThemeKey === 'romantic') {
      artStyleService.setActiveStyle('valentine-iridescent');
    } else {
      artStyleService.setActiveStyle('lowpoly');
    }
  }, [questionnaire?.occasion, questionnaire?.emotionalTone]);

  useEffect(() => {
    if (!PlayGiftConsumerMode) return;
    glowPulse.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2200, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 2200, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
    shimmer.value = withRepeat(
      withTiming(1, { duration: 2400, easing: Easing.inOut(Easing.ease) }),
      -1,
      false
    );
  }, []);

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

  const handlePickPhoto = async () => {
    if (!ImagePickerModule) {
      Alert.alert('Missing dependency', 'Install expo-image-picker to add a memory photo.');
      return;
    }
    const permission = await ImagePickerModule.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission needed', 'Allow photo access to add a memory.');
      return;
    }
    const result = await ImagePickerModule.launchImageLibraryAsync({
      mediaTypes: ImagePickerModule.MediaTypeOptions.Images,
      quality: 0.85,
    });
    if (!result.canceled && result.assets?.[0]?.uri) {
      const uri = result.assets[0].uri;
      setMemoryPhotoUri(uri);
      updateField('photos', [uri]);
    }
  };

  const handleToggleRecording = async () => {
    if (!ExpoAV?.Audio) {
      Alert.alert('Missing dependency', 'Install expo-av to record a voice memory.');
      return;
    }
    if (isRecording && recording) {
      try {
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        const status = await recording.getStatusAsync();
        setRecording(null);
        setIsRecording(false);
        if (uri) {
          setVoiceNoteUri(uri);
          setVoiceNoteDuration(Math.round((status.durationMillis || 0) / 1000));
          updateField('voiceNoteUri', uri);
          updateField('voiceNoteDuration', Math.round((status.durationMillis || 0) / 1000));
        }
      } catch (error) {
        console.warn('Failed to stop recording', error);
        setRecording(null);
        setIsRecording(false);
      }
      return;
    }

    try {
      const permission = await ExpoAV.Audio.requestPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission needed', 'Allow microphone access to record a voice note.');
        return;
      }
      await ExpoAV.Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      const nextRecording = new ExpoAV.Audio.Recording();
      await nextRecording.prepareToRecordAsync(
        ExpoAV.Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      await nextRecording.startAsync();
      setRecording(nextRecording);
      setIsRecording(true);
    } catch (error) {
      console.warn('Failed to start recording', error);
      setRecording(null);
      setIsRecording(false);
    }
  };

  const handleClearMemory = () => {
    setMemoryPhotoUri(null);
    setVoiceNoteUri(null);
    setVoiceNoteDuration(null);
    updateField('photos', []);
    updateField('voiceNoteUri', undefined);
    updateField('voiceNoteDuration', undefined);
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
    return (
      <View style={styles.stepContainer}>
        <Text style={styles.stepTitle}>What are we celebrating?</Text>
        <Text style={styles.stepSubtitle}>Pick the moment that matters most</Text>

        <View style={styles.optionsGrid}>
          {occasionOptions.map((occasion) => (
            <PressableScale
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
            </PressableScale>
          ))}
        </View>
      </View>
    );
  };

  const renderRecipientStep = () => {
    return (
      <View style={styles.stepContainer}>
        <Text style={styles.stepTitle}>Who is this for?</Text>
        <Text style={styles.stepSubtitle}>A name brings the magic closer</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Their Name</Text>
          <TextInput
            style={styles.textInput}
            value={questionnaire?.recipientName}
            onChangeText={(text) => updateField('recipientName', text)}
            placeholder="e.g., Sarah"
            placeholderTextColor="rgba(255,255,255,0.6)"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Your Relationship</Text>
          <View style={styles.optionsGrid}>
            {Object.entries(relationshipLabels).map(([value, label]) => (
              <PressableScale
                key={value}
                style={[
                  styles.chipButton,
                  questionnaire?.relationship === value && styles.chipButtonSelected,
                ]}
                onPress={() => updateField('relationship', value as any)}
              >
                <Text
                  style={[
                    styles.chipText,
                    questionnaire?.relationship === value && styles.chipTextSelected,
                  ]}
                >
                  {label}
                </Text>
              </PressableScale>
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
        <Text style={styles.stepTitle}>What lights them up?</Text>
        <Text style={styles.stepSubtitle}>Pick the traits and interests that feel true</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Personality Traits</Text>
          <View style={styles.chipsContainer}>
            {traits.map((trait) => (
              <PressableScale
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
              </PressableScale>
            ))}
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Interests</Text>
          <View style={styles.chipsContainer}>
            {interests.map((interest) => (
              <PressableScale
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
              </PressableScale>
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
        <Text style={styles.stepTitle}>What vibe should it carry?</Text>
        <Text style={styles.stepSubtitle}>We will tune the story and the play style</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Emotional Tone</Text>
          {tones.map((tone) => (
            <PressableScale
              key={tone.value}
              style={[
                styles.listOption,
                questionnaire?.emotionalTone === tone.value && styles.listOptionSelected,
              ]}
              onPress={() => updateField('emotionalTone', tone.value as any)}
            >
              <Text style={styles.listOptionLabel}>{tone.label}</Text>
              <Text style={styles.listOptionDesc}>{tone.desc}</Text>
            </PressableScale>
          ))}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Game Style</Text>
          {gameStyles.map((style) => (
            <PressableScale
              key={style.value}
              style={[
                styles.listOption,
                questionnaire?.gameStyle === style.value && styles.listOptionSelected,
              ]}
              onPress={() => updateField('gameStyle', style.value as any)}
            >
              <Text style={styles.listOptionLabel}>{style.label}</Text>
              <Text style={styles.listOptionDesc}>{style.desc}</Text>
            </PressableScale>
          ))}
        </View>
      </View>
    );
  };

  const renderPersonalizationStep = () => {
    return (
      <View style={styles.stepContainer}>
        <Text style={styles.stepTitle}>Add your signature</Text>
        <Text style={styles.stepSubtitle}>Your words become the final spark</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Your Name</Text>
          <TextInput
            style={styles.textInput}
            value={questionnaire?.senderName}
            onChangeText={(text) => updateField('senderName', text)}
            placeholder="e.g., Alex"
            placeholderTextColor="rgba(255,255,255,0.6)"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Custom Message (Optional)</Text>
          <TextInput
            style={[styles.textInput, styles.textArea]}
            value={questionnaire?.customMessage}
            onChangeText={(text) => updateField('customMessage', text)}
            placeholder="A special message that will appear in the game..."
            placeholderTextColor="rgba(255,255,255,0.6)"
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.memoryWeaveCard}>
          <Text style={styles.inputLabel}>Memory Weave (Optional)</Text>
          <Text style={styles.inputHint}>
            Add one photo + one voice note. The photo reveals mid-game, the voice plays on the final unlock.
          </Text>
          <View style={styles.memoryButtons}>
            <PressableScale style={styles.uploadButton} onPress={handlePickPhoto}>
              <Text style={styles.uploadButtonText}>
                {memoryPhotoUri ? 'Replace Photo' : 'Add Photo'}
              </Text>
            </PressableScale>
            <PressableScale
              style={[
                styles.uploadButton,
                isRecording && styles.uploadButtonRecording,
              ]}
              onPress={handleToggleRecording}
            >
              <Text style={styles.uploadButtonText}>
                {isRecording
                  ? 'Stop Recording'
                  : voiceNoteUri
                  ? 'Redo Voice Note'
                  : 'Record Voice Note'}
              </Text>
            </PressableScale>
          </View>

          {(memoryPhotoUri || voiceNoteUri) && (
            <View style={styles.memoryPreview}>
              {memoryPhotoUri && (
                <Image source={{ uri: memoryPhotoUri }} style={styles.memoryImage} />
              )}
              {voiceNoteUri && (
                <View style={styles.voicePreview}>
                  <Text style={styles.voicePreviewText}>
                    Voice note ready{voiceNoteDuration ? ` · ${voiceNoteDuration}s` : ''}
                  </Text>
                </View>
              )}
            </View>
          )}

          {(memoryPhotoUri || voiceNoteUri) && (
            <PressableScale style={styles.clearMemoryButton} onPress={handleClearMemory}>
              <Text style={styles.clearMemoryText}>Clear Memory Weave</Text>
            </PressableScale>
          )}
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
        <Text style={styles.stepTitle}>Finish the brew</Text>
        <Text style={styles.stepSubtitle}>Set the pace and the challenge</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Game Duration</Text>
          {durations.map((duration) => (
            <PressableScale
              key={duration.value}
              style={[
                styles.listOption,
                questionnaire?.gameDuration === duration.value && styles.listOptionSelected,
              ]}
              onPress={() => updateField('gameDuration', duration.value as any)}
            >
              <Text style={styles.listOptionLabel}>{duration.label}</Text>
              <Text style={styles.listOptionDesc}>{duration.desc}</Text>
            </PressableScale>
          ))}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Difficulty</Text>
          {difficulties.map((difficulty) => (
            <PressableScale
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
            </PressableScale>
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

  const seasonalLine = (() => {
    if (toTheme.id === 'ramadan') return "Brewing a Ramadan lantern adventure! 🌙";
    if (toTheme.id === 'valentine' || toTheme.id === 'romantic') {
      return "Infusing hearts of love and shimmer! 💖";
    }
    return "Let's brew something unforgettable.";
  })();

  const alchemistPrompt = (() => {
    switch (currentStep) {
      case 1:
        return `${seasonalLine} What are we celebrating? I'll mix the perfect glow.`;
      case 2:
        return `${seasonalLine} Who is this gift for? Give me their name and your bond.`;
      case 3:
        return `${seasonalLine} Tell me what makes them smile. I'll thread it into the magic.`;
      case 4:
        return `${seasonalLine} Which vibe should this gift carry? I'll tune the energy.`;
      case 5:
        return `${seasonalLine} Add your signature. Your words make it unforgettable.`;
      case 6:
        return `${seasonalLine} How long should the adventure feel? Smooth or challenging?`;
      default:
        return seasonalLine;
    }
  })();

  const userEcho = (() => {
    if (!questionnaire) return null;
    if (currentStep === 1 && questionnaire.occasion) {
      const label = occasionOptions.find((o) => o.value === questionnaire.occasion)?.label;
      return label ? label.replace(/^.+?\s/, '') : questionnaire.occasion;
    }
    if (currentStep === 2 && (questionnaire.recipientName || questionnaire.relationship)) {
      const relation = questionnaire.relationship ? relationshipLabels[questionnaire.relationship] : '';
      return [questionnaire.recipientName, relation].filter(Boolean).join(' · ');
    }
    if (currentStep === 3 && (questionnaire.recipientTraits.length || questionnaire.interests.length)) {
      const traits = questionnaire.recipientTraits.slice(0, 2).join(', ');
      const interests = questionnaire.interests.slice(0, 2).join(', ');
      return [traits, interests].filter(Boolean).join(' · ');
    }
    if (currentStep === 4 && (questionnaire.emotionalTone || questionnaire.gameStyle)) {
      const tone = questionnaire.emotionalTone ? toneLabels[questionnaire.emotionalTone] : '';
      const style = questionnaire.gameStyle ? gameStyleLabels[questionnaire.gameStyle] : '';
      return [tone, style].filter(Boolean).join(' · ');
    }
    if (currentStep === 5 && (questionnaire.senderName || questionnaire.customMessage)) {
      const sender = questionnaire.senderName ? `From ${questionnaire.senderName}` : '';
      return [sender, questionnaire.customMessage].filter(Boolean).join(' · ');
    }
    if (currentStep === 6 && (questionnaire.gameDuration || questionnaire.difficultyLevel)) {
      return [questionnaire.gameDuration, questionnaire.difficultyLevel]
        .filter(Boolean)
        .join(' · ');
    }
    return null;
  })();

  const alchemistMood = userEcho ? 'happy' : 'thinking';

  const gradientProps = useAnimatedProps(() => ({
    colors: [
      interpolateColor(
        themeProgress.value,
        [0, 1],
        [fromTheme.gradient[0], toTheme.gradient[0]]
      ) as string,
      interpolateColor(
        themeProgress.value,
        [0, 1],
        [fromTheme.gradient[1], toTheme.gradient[1]]
      ) as string,
      interpolateColor(
        themeProgress.value,
        [0, 1],
        [fromTheme.gradient[2], toTheme.gradient[2]]
      ) as string,
    ],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: interpolate(glowPulse.value, [0, 1], [0.2, 0.6]),
  }));

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: interpolate(shimmer.value, [0, 1], [-120, 140]) },
    ],
  }));

  const emojiParticles = useMemo(() => generateEmojiParticles(toTheme.emojiParticles), [toTheme.id]);

  return (
    <AnimatedLinearGradient
      animatedProps={gradientProps}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <ParticleField density="sparse" colors={toTheme.particleColors} style={styles.particleWrapper}>
        {PlayGiftConsumerMode && (
          <>
            <Animated.View
              style={[styles.glowOrb, styles.glowOrbLeft, glowStyle, { backgroundColor: toTheme.glow }]}
            />
            <Animated.View
              style={[styles.glowOrb, styles.glowOrbRight, glowStyle, { backgroundColor: toTheme.accent }]}
            />
            <View style={styles.emojiLayer} pointerEvents="none">
              {emojiParticles.map((particle) => (
                <FloatingEmoji key={particle.id} particle={particle} />
              ))}
            </View>
          </>
        )}

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Alchemist's Forge</Text>
            <Text style={styles.headerSubtitle}>
              Step {currentStep} of {totalSteps}
            </Text>
          </View>

          {renderProgress()}

          <View style={styles.conversationBlock}>
            {PlayGiftConsumerMode && (
              <View style={styles.alchemistShimmer} pointerEvents="none">
                <ShimmerOverlay opacity={0.25} />
              </View>
            )}
            <AlchemistCompanion
              mood={alchemistMood as any}
              size="small"
              message={alchemistPrompt}
              showBubble
            />
            {userEcho && (
              <Animated.View entering={FadeInUp.duration(350)} style={styles.userBubble}>
                <Text style={styles.userBubbleText}>{userEcho}</Text>
              </Animated.View>
            )}
          </View>

          <Animated.View
            entering={FadeInUp.springify().damping(14).stiffness(120)}
            style={styles.contentBounce}
          >
            <GlassPanel style={styles.content}>
              {renderStep()}
            </GlassPanel>
          </Animated.View>

          <View style={styles.buttonContainer}>
          {currentStep > 1 && (
            <PressableScale style={styles.secondaryButton} onPress={prevStep}>
              <Text style={styles.secondaryButtonText}>Back</Text>
            </PressableScale>
          )}

          <PressableScale
              style={[styles.primaryButton, currentStep === 1 && styles.primaryButtonFull]}
              onPress={nextStep}
            >
              <View style={styles.primaryButtonInner}>
                <Text style={styles.primaryButtonText}>
                  {currentStep === totalSteps ? 'Forge the Gift ✨' : 'Continue'}
                </Text>
              {PlayGiftConsumerMode && (
                <Animated.View style={[styles.shimmer, shimmerStyle]} pointerEvents="none">
                  <ShimmerOverlay />
                </Animated.View>
              )}
              </View>
          </PressableScale>
          </View>
        </ScrollView>
      </ParticleField>
    </AnimatedLinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  particleWrapper: {
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
    fontWeight: '700',
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
  conversationBlock: {
    alignItems: 'center',
    marginBottom: 20,
  },
  alchemistShimmer: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 20,
    overflow: 'hidden',
  },
  userBubble: {
    marginTop: 12,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  userBubbleText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  content: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
  },
  contentBounce: {
    marginBottom: 20,
  },
  glassPanel: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  glassInner: {
    padding: 24,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  glassPanelFallback: {
    borderRadius: 24,
    padding: 24,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  stepContainer: {
    minHeight: 400,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.75)',
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 12,
  },
  textInput: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  memoryWeaveCard: {
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    marginBottom: 20,
  },
  inputHint: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 12,
  },
  memoryButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  uploadButton: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.22)',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  uploadButtonRecording: {
    backgroundColor: 'rgba(255,120,120,0.35)',
    borderColor: 'rgba(255,120,120,0.6)',
  },
  uploadButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
  memoryPreview: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  memoryImage: {
    width: 64,
    height: 64,
    borderRadius: 12,
  },
  voicePreview: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 10,
    padding: 12,
  },
  voicePreviewText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  clearMemoryButton: {
    marginTop: 12,
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  clearMemoryText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  optionCard: {
    width: '47%',
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionCardSelected: {
    backgroundColor: 'rgba(255,255,255,0.28)',
    borderColor: 'rgba(255,255,255,0.8)',
  },
  optionEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  optionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
  chipButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  chipButtonSelected: {
    backgroundColor: 'rgba(255,255,255,0.35)',
    borderColor: 'rgba(255,255,255,0.85)',
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  chipSelected: {
    backgroundColor: 'rgba(255,255,255,0.35)',
    borderColor: 'rgba(255,255,255,0.85)',
  },
  chipText: {
    fontSize: 14,
    color: '#fff',
  },
  chipTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  listOption: {
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  listOptionSelected: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderColor: 'rgba(255,255,255,0.85)',
  },
  listOptionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  listOptionDesc: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.75)',
  },
  previewBox: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: 'rgba(255,255,255,0.8)',
  },
  previewLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  previewText: {
    fontSize: 16,
    color: '#fff',
    fontStyle: 'italic',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  primaryButton: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.85)',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  primaryButtonFull: {
    flex: 1,
  },
  primaryButtonInner: {
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#3B1B6E',
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
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
  shimmer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 120,
  },
  glowOrb: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 999,
    opacity: 0.5,
    shadowColor: '#fff',
    shadowOpacity: 0.4,
    shadowRadius: 40,
  },
  glowOrbLeft: {
    top: 120,
    left: -40,
  },
  glowOrbRight: {
    top: 360,
    right: -60,
  },
  emojiLayer: {
    ...StyleSheet.absoluteFillObject,
  },
});
