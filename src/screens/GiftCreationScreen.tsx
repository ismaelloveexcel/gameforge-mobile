/**
 * GiftCreationScreen - Simplified gift game creation flow
 * Quick and easy way to create personalized gift games
 */
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, { FadeIn, FadeInDown, ZoomIn } from 'react-native-reanimated';
import { useTheme } from '../contexts/ThemeContext';
import { RootStackParamList } from '../types';
import { spacing, radii, typography } from '../design-tokens/theme';
import { ForgeButton, EmojiPicker, RouletteWheel, RouletteSegment } from '../components';
import { aiService } from '../services/AIService';
import { shareService } from '../services/ShareService';
import { wildCardService } from '../services/WildCardService';

type NavigationProp = StackNavigationProp<RootStackParamList>;

interface QuickGiftConfig {
  recipientName: string;
  occasion: string;
  gameType: string;
  specialMessage: string;
  surpriseElement: boolean;
}

const OCCASIONS = [
  { id: 'birthday', label: 'Birthday', emoji: '🎂', color: '#FF6B6B' },
  { id: 'anniversary', label: 'Anniversary', emoji: '💕', color: '#FF69B4' },
  { id: 'valentines', label: 'Valentine\'s', emoji: '💘', color: '#E91E63' },
  { id: 'christmas', label: 'Christmas', emoji: '🎄', color: '#4CAF50' },
  { id: 'graduation', label: 'Graduation', emoji: '🎓', color: '#2196F3' },
  { id: 'thank_you', label: 'Thank You', emoji: '🙏', color: '#FF9800' },
  { id: 'just_because', label: 'Just Because', emoji: '💝', color: '#9C27B0' },
];

const GAME_TYPES: RouletteSegment[] = [
  {
    id: 'adventure',
    label: 'Adventure',
    value: 'adventure',
    color: '#FF6B6B',
    icon: 'map',
  },
  {
    id: 'puzzle',
    label: 'Puzzle',
    value: 'puzzle',
    color: '#4ECDC4',
    icon: 'puzzle',
  },
  {
    id: 'story',
    label: 'Story',
    value: 'story',
    color: '#45B7D1',
    icon: 'book-open-variant',
  },
  {
    id: 'trivia',
    label: 'Trivia',
    value: 'trivia',
    color: '#FFA07A',
    icon: 'lightbulb',
  },
  {
    id: 'memory',
    label: 'Memory',
    value: 'memory',
    color: '#98D8C8',
    icon: 'cards',
  },
  {
    id: 'surprise',
    label: 'Surprise Me!',
    value: 'surprise',
    color: '#F7DC6F',
    icon: 'gift',
  },
];

export default function GiftCreationScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { theme } = useTheme();

  const [step, setStep] = useState(1);
  const [config, setConfig] = useState<QuickGiftConfig>({
    recipientName: '',
    occasion: '',
    gameType: '',
    specialMessage: '',
    surpriseElement: false,
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState('🎁');

  const handleNext = useCallback(() => {
    if (step === 1 && !config.recipientName.trim()) {
      Alert.alert('Missing Info', 'Please enter the recipient\'s name');
      return;
    }
    if (step === 2 && !config.occasion) {
      Alert.alert('Missing Info', 'Please select an occasion');
      return;
    }
    if (step === 3 && !config.gameType) {
      Alert.alert('Missing Info', 'Please select a game type');
      return;
    }
    
    if (step < 4) {
      setStep(step + 1);
    } else {
      handleCreate();
    }
  }, [step, config]);

  const handleBack = useCallback(() => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigation.goBack();
    }
  }, [step, navigation]);

  const handleCreate = useCallback(async () => {
    setIsGenerating(true);

    try {
      // Add surprise element if requested
      let surpriseContent = null;
      if (config.surpriseElement) {
        surpriseContent = wildCardService.getMysterySurprise();
      }

      // Generate AI content
      const content = await aiService.generateGameContent(
        config.gameType,
        {
          recipientName: config.recipientName,
          occasion: config.occasion,
          interests: [],
          tone: 'heartfelt',
        }
      );

      // Generate shareable URL (mock for now)
      const gameId = `gift-${Date.now()}`;
      const shareUrl = shareService.generateShareableUrl(gameId);

      setIsGenerating(false);

      // Show success
      Alert.alert(
        '🎉 Gift Created!',
        `Your gift game for ${config.recipientName} is ready!`,
        [
          {
            text: 'Share Now',
            onPress: () => handleShare(shareUrl),
          },
          {
            text: 'View Game',
            onPress: () => navigation.navigate('GiftForgeGame', { gameId } as any),
          },
        ]
      );
    } catch (error) {
      setIsGenerating(false);
      Alert.alert('Error', 'Failed to create gift game. Please try again.');
    }
  }, [config, navigation]);

  const handleShare = useCallback(async (url: string) => {
    const message = shareService.generateGiftGameMessage(
      config.recipientName,
      'You',
      config.occasion,
      url
    );

    await shareService.shareNative({
      title: `Gift Game for ${config.recipientName}`,
      message,
      url,
    });
  }, [config]);

  const handleGameTypeSelect = useCallback((segment: RouletteSegment) => {
    setConfig(prev => ({ ...prev, gameType: segment.value }));
  }, []);

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <Animated.View entering={FadeInDown} style={styles.stepContainer}>
            <Text style={[styles.stepTitle, { color: theme.colors.text }]}>
              Who's this gift for? 🎁
            </Text>
            <TextInput
              style={[
                styles.largeInput,
                {
                  backgroundColor: theme.colors.surface,
                  color: theme.colors.text,
                  borderColor: theme.colors.border,
                },
              ]}
              placeholder="Enter their name..."
              placeholderTextColor={theme.colors.textSecondary}
              value={config.recipientName}
              onChangeText={text =>
                setConfig(prev => ({ ...prev, recipientName: text }))
              }
              autoFocus
            />
          </Animated.View>
        );

      case 2:
        return (
          <Animated.View entering={FadeInDown} style={styles.stepContainer}>
            <Text style={[styles.stepTitle, { color: theme.colors.text }]}>
              What's the occasion? 🎉
            </Text>
            <View style={styles.occasionsGrid}>
              {OCCASIONS.map((occasion, index) => (
                <Animated.View
                  key={occasion.id}
                  entering={ZoomIn.delay(index * 50)}
                >
                  <TouchableOpacity
                    style={[
                      styles.occasionCard,
                      {
                        backgroundColor: theme.colors.surface,
                        borderColor:
                          config.occasion === occasion.id
                            ? occasion.color
                            : theme.colors.border,
                        borderWidth: config.occasion === occasion.id ? 3 : 1,
                      },
                    ]}
                    onPress={() =>
                      setConfig(prev => ({ ...prev, occasion: occasion.id }))
                    }
                  >
                    <Text style={styles.occasionEmoji}>{occasion.emoji}</Text>
                    <Text
                      style={[
                        styles.occasionLabel,
                        {
                          color:
                            config.occasion === occasion.id
                              ? occasion.color
                              : theme.colors.text,
                        },
                      ]}
                    >
                      {occasion.label}
                    </Text>
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </View>
          </Animated.View>
        );

      case 3:
        return (
          <Animated.View entering={FadeInDown} style={styles.stepContainer}>
            <Text style={[styles.stepTitle, { color: theme.colors.text }]}>
              Pick a game type 🎮
            </Text>
            <Text style={[styles.stepSubtitle, { color: theme.colors.textSecondary }]}>
              Spin the wheel or tap to choose!
            </Text>
            <RouletteWheel
              segments={GAME_TYPES}
              onSpinComplete={handleGameTypeSelect}
              centerText="SPIN"
              spinDuration={3000}
              minSpins={3}
              maxSpins={6}
            />
            {config.gameType && (
              <Animated.View
                entering={ZoomIn}
                style={[
                  styles.selectedBadge,
                  { backgroundColor: theme.colors.primary },
                ]}
              >
                <Icon name="check-circle" size={20} color="#fff" />
                <Text style={styles.selectedText}>
                  {GAME_TYPES.find(g => g.value === config.gameType)?.label} selected!
                </Text>
              </Animated.View>
            )}
          </Animated.View>
        );

      case 4:
        return (
          <Animated.View entering={FadeInDown} style={styles.stepContainer}>
            <Text style={[styles.stepTitle, { color: theme.colors.text }]}>
              Add a special message 💌
            </Text>
            <TextInput
              style={[
                styles.messageInput,
                {
                  backgroundColor: theme.colors.surface,
                  color: theme.colors.text,
                  borderColor: theme.colors.border,
                },
              ]}
              placeholder="Write something heartfelt..."
              placeholderTextColor={theme.colors.textSecondary}
              value={config.specialMessage}
              onChangeText={text =>
                setConfig(prev => ({ ...prev, specialMessage: text }))
              }
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />

            {/* Add emoji button */}
            <TouchableOpacity
              style={[styles.emojiButton, { backgroundColor: theme.colors.surface }]}
              onPress={() => setShowEmojiPicker(!showEmojiPicker)}
            >
              <Text style={styles.buttonEmoji}>{selectedEmoji}</Text>
              <Text style={[styles.buttonText, { color: theme.colors.text }]}>
                Add Emoji
              </Text>
            </TouchableOpacity>

            {showEmojiPicker && (
              <View style={styles.emojiPickerContainer}>
                <EmojiPicker
                  onEmojiSelect={emoji => {
                    setSelectedEmoji(emoji);
                    setConfig(prev => ({
                      ...prev,
                      specialMessage: prev.specialMessage + emoji,
                    }));
                    setShowEmojiPicker(false);
                  }}
                  categories={['smileys', 'symbols']}
                  showSearch={false}
                />
              </View>
            )}

            {/* Surprise element toggle */}
            <TouchableOpacity
              style={[
                styles.surpriseToggle,
                {
                  backgroundColor: config.surpriseElement
                    ? theme.colors.primary + '20'
                    : theme.colors.surface,
                  borderColor: config.surpriseElement
                    ? theme.colors.primary
                    : theme.colors.border,
                },
              ]}
              onPress={() =>
                setConfig(prev => ({
                  ...prev,
                  surpriseElement: !prev.surpriseElement,
                }))
              }
            >
              <Icon
                name={config.surpriseElement ? 'checkbox-marked' : 'checkbox-blank-outline'}
                size={24}
                color={config.surpriseElement ? theme.colors.primary : theme.colors.textSecondary}
              />
              <Text style={[styles.surpriseText, { color: theme.colors.text }]}>
                Add surprise elements ✨
              </Text>
            </TouchableOpacity>
          </Animated.View>
        );

      default:
        return null;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <Animated.View
        entering={FadeIn}
        style={[styles.header, { backgroundColor: theme.colors.surface }]}
      >
        <TouchableOpacity onPress={handleBack}>
          <Icon name="arrow-left" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          Quick Gift Creation
        </Text>
        <View style={{ width: 24 }} />
      </Animated.View>

      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        {[1, 2, 3, 4].map(i => (
          <View
            key={i}
            style={[
              styles.progressDot,
              {
                backgroundColor:
                  i <= step ? theme.colors.primary : theme.colors.border,
              },
            ]}
          />
        ))}
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {renderStep()}
      </ScrollView>

      {/* Action Button */}
      <View style={[styles.footer, { backgroundColor: theme.colors.surface }]}>
        <ForgeButton
          title={step === 4 ? (isGenerating ? 'Creating...' : 'Create Gift 🎁') : 'Next'}
          onPress={handleNext}
          variant="primary"
          size="large"
          fullWidth
          loading={isGenerating}
          icon={step === 4 ? 'gift' : 'arrow-right'}
        />
      </View>
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
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    paddingTop: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  headerTitle: {
    fontSize: typography.size.xl,
    fontFamily: typography.fontFamily.bold,
    fontWeight: 'bold',
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  progressDot: {
    width: 40,
    height: 8,
    borderRadius: radii.full,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  stepContainer: {
    alignItems: 'center',
  },
  stepTitle: {
    fontSize: typography.size.xxl,
    fontFamily: typography.fontFamily.bold,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  stepSubtitle: {
    fontSize: typography.size.md,
    fontFamily: typography.fontFamily.regular,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  largeInput: {
    width: '100%',
    borderRadius: radii.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontSize: typography.size.xl,
    fontFamily: typography.fontFamily.regular,
    borderWidth: 1,
    textAlign: 'center',
  },
  occasionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.md,
  },
  occasionCard: {
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.xl,
    padding: spacing.sm,
  },
  occasionEmoji: {
    fontSize: 32,
    marginBottom: spacing.xs,
  },
  occasionLabel: {
    fontSize: typography.size.sm,
    fontFamily: typography.fontFamily.medium,
    textAlign: 'center',
  },
  selectedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.full,
    marginTop: spacing.lg,
    gap: spacing.xs,
  },
  selectedText: {
    color: '#fff',
    fontSize: typography.size.md,
    fontFamily: typography.fontFamily.medium,
  },
  messageInput: {
    width: '100%',
    borderRadius: radii.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: typography.size.md,
    fontFamily: typography.fontFamily.regular,
    borderWidth: 1,
    minHeight: 120,
    marginBottom: spacing.md,
  },
  emojiButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.lg,
    marginBottom: spacing.md,
  },
  buttonEmoji: {
    fontSize: 24,
    marginRight: spacing.sm,
  },
  buttonText: {
    fontSize: typography.size.md,
    fontFamily: typography.fontFamily.medium,
  },
  emojiPickerContainer: {
    height: 300,
    width: '100%',
    marginBottom: spacing.md,
  },
  surpriseToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radii.lg,
    borderWidth: 2,
    gap: spacing.sm,
  },
  surpriseText: {
    fontSize: typography.size.md,
    fontFamily: typography.fontFamily.medium,
  },
  footer: {
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
});
