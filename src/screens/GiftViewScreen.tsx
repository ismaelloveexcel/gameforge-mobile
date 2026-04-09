import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  RootStackParamList,
  ContentBlock,
  TextBlockData,
  MediaBlockData,
  RSVPBlockData,
  QuizGameBlockData,
  CTABlockData,
  CountdownBlockData,
  QuizQuestion,
} from '../types';
import { useGiftStore } from '../stores/giftStore';
import { useTheme } from '../contexts/ThemeContext';
import { forgeColors, spacing } from '../design-tokens/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type ViewRoute = RouteProp<RootStackParamList, 'GiftView'>;
type NavProp = StackNavigationProp<RootStackParamList>;

export default function GiftViewScreen() {
  const { theme, isDark } = useTheme();
  const navigation = useNavigation<NavProp>();
  const route = useRoute<ViewRoute>();
  const { giftId } = route.params;
  const gift = useGiftStore((s) => s.gifts.find((g) => g.id === giftId));

  const [blockIndex, setBlockIndex] = useState(0);
  const [quizState, setQuizState] = useState<{
    questionIndex: number;
    selectedAnswer: number | null;
    score: number;
    answered: boolean;
  }>({ questionIndex: 0, selectedAnswer: null, score: 0, answered: false });
  const [rsvpChoice, setRsvpChoice] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);

  const blocks = gift?.contentBlocks ?? [];
  const isLastBlock = blockIndex >= blocks.length - 1;

  const handleNext = useCallback(() => {
    if (isLastBlock) {
      setCompleted(true);
      return;
    }
    setBlockIndex((i) => i + 1);
    // Reset quiz state for next block
    setQuizState({ questionIndex: 0, selectedAnswer: null, score: 0, answered: false });
    setRsvpChoice(null);
  }, [isLastBlock]);

  const handleQuizAnswer = useCallback(
    (optionIndex: number, question: QuizQuestion) => {
      if (quizState.answered) return;
      const isCorrect = optionIndex === question.correctAnswer;
      setQuizState((prev) => ({
        ...prev,
        selectedAnswer: optionIndex,
        answered: true,
        score: isCorrect ? prev.score + 1 : prev.score,
      }));
    },
    [quizState.answered],
  );

  const handleQuizNext = useCallback(
    (questions: QuizQuestion[]) => {
      if (quizState.questionIndex < questions.length - 1) {
        setQuizState((prev) => ({
          ...prev,
          questionIndex: prev.questionIndex + 1,
          selectedAnswer: null,
          answered: false,
        }));
      } else {
        handleNext();
      }
    },
    [quizState.questionIndex, handleNext],
  );

  if (!gift) {
    return (
      <View style={[styles.fullCenter, { backgroundColor: '#0C0A09' }]}>
        <Icon name="gift-off-outline" size={64} color={forgeColors.stone[500]} />
        <Text style={[styles.notFoundText, { color: forgeColors.stone[300] }]}>Gift not found</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backLink}>
          <Text style={{ color: forgeColors.forge[400] }}>Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const bg = isDark ? forgeColors.stone[950] : theme.colors.background;
  const accent = theme.colors.primary;

  if (completed) {
    return (
      <View style={[styles.fullCenter, { backgroundColor: bg }]}>
        <StatusBar barStyle="light-content" />
        <Animated.View entering={FadeInUp.duration(600)} style={styles.completionContainer}>
          <Text style={styles.completionEmoji}>🎉</Text>
          <Text style={[styles.completionTitle, { color: theme.colors.text }]}>Gift Complete!</Text>
          <Text style={[styles.completionSender, { color: theme.colors.textMuted }]}>
            With love from {gift.sender.name}
          </Text>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={[styles.doneBtn, { backgroundColor: accent }]}
            activeOpacity={0.7}
          >
            <Text style={styles.doneBtnText}>Done</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  }

  const currentBlock = blocks[blockIndex];

  const renderBlock = (block: ContentBlock) => {
    switch (block.type) {
      case 'text': {
        const data = block.data as TextBlockData;
        return (
          <Animated.View entering={FadeInUp.duration(500)} style={styles.blockContainer} key={block.id}>
            {data.heading && (
              <Text style={[styles.textHeading, { color: theme.colors.text }]}>{data.heading}</Text>
            )}
            <Text style={[styles.textBody, { color: theme.colors.textMuted }]}>{data.body}</Text>
          </Animated.View>
        );
      }

      case 'media': {
        const data = block.data as MediaBlockData;
        return (
          <Animated.View entering={FadeInUp.duration(500)} style={styles.blockContainer} key={block.id}>
            <View style={[styles.mediaPlaceholder, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
              <Icon name="image-outline" size={48} color={theme.colors.textMuted} />
              <Text style={[styles.mediaText, { color: theme.colors.textMuted }]}>Media content</Text>
              {data.caption && (
                <Text style={[styles.mediaCaption, { color: theme.colors.textSubtle }]}>
                  {data.caption}
                </Text>
              )}
            </View>
          </Animated.View>
        );
      }

      case 'rsvp': {
        const data = block.data as RSVPBlockData;
        return (
          <Animated.View entering={FadeInUp.duration(500)} style={styles.blockContainer} key={block.id}>
            <Text style={[styles.textHeading, { color: theme.colors.text }]}>{data.eventName}</Text>
            <View style={styles.rsvpInfo}>
              <Icon name="calendar" size={16} color={accent} />
              <Text style={[styles.rsvpInfoText, { color: theme.colors.textMuted }]}>{data.eventDate}</Text>
            </View>
            {data.eventLocation && (
              <View style={styles.rsvpInfo}>
                <Icon name="map-marker" size={16} color={accent} />
                <Text style={[styles.rsvpInfoText, { color: theme.colors.textMuted }]}>
                  {data.eventLocation}
                </Text>
              </View>
            )}
            <View style={styles.rsvpOptions}>
              {data.options.map((opt) => {
                const selected = rsvpChoice === opt;
                return (
                  <TouchableOpacity
                    key={opt}
                    onPress={() => setRsvpChoice(opt)}
                    style={[
                      styles.rsvpPill,
                      {
                        backgroundColor: selected ? accent : theme.colors.card,
                        borderColor: selected ? accent : theme.colors.border,
                      },
                    ]}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.rsvpPillText,
                        { color: selected ? '#FFF' : theme.colors.text },
                      ]}
                    >
                      {opt}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </Animated.View>
        );
      }

      case 'quiz_game': {
        const data = block.data as QuizGameBlockData;
        const question = data.questions[quizState.questionIndex];
        if (!question) return null;
        return (
          <Animated.View entering={FadeInUp.duration(500)} style={styles.blockContainer} key={`${block.id}-${quizState.questionIndex}`}>
            <Text style={[styles.quizProgress, { color: theme.colors.textMuted }]}>
              Question {quizState.questionIndex + 1} of {data.questions.length}
            </Text>
            <Text style={[styles.quizQuestion, { color: theme.colors.text }]}>
              {question.question}
            </Text>
            <View style={styles.quizOptions}>
              {question.options.map((opt, idx) => {
                const selected = quizState.selectedAnswer === idx;
                const isCorrect = idx === question.correctAnswer;
                const showResult = quizState.answered;
                let optBg = theme.colors.card;
                let optBorder = theme.colors.border;
                let optTextColor = theme.colors.text;
                if (showResult && selected && isCorrect) {
                  optBg = forgeColors.moss[500] + '20';
                  optBorder = forgeColors.moss[500];
                  optTextColor = forgeColors.moss[500];
                } else if (showResult && selected && !isCorrect) {
                  optBg = forgeColors.ember[500] + '20';
                  optBorder = forgeColors.ember[500];
                  optTextColor = forgeColors.ember[500];
                } else if (showResult && isCorrect) {
                  optBg = forgeColors.moss[500] + '10';
                  optBorder = forgeColors.moss[400];
                }
                return (
                  <TouchableOpacity
                    key={idx}
                    onPress={() => handleQuizAnswer(idx, question)}
                    style={[styles.quizOptionBtn, { backgroundColor: optBg, borderColor: optBorder }]}
                    activeOpacity={0.7}
                    disabled={quizState.answered}
                  >
                    <Text style={[styles.quizOptionText, { color: optTextColor }]}>{opt}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            {quizState.answered && (
              <Animated.View entering={FadeInUp.duration(300)}>
                <Text style={[styles.quizFeedback, { color: theme.colors.textMuted }]}>
                  {question.feedback}
                </Text>
                <TouchableOpacity
                  onPress={() => handleQuizNext(data.questions)}
                  style={[styles.quizNextBtn, { backgroundColor: accent }]}
                  activeOpacity={0.7}
                >
                  <Text style={styles.quizNextBtnText}>
                    {quizState.questionIndex < data.questions.length - 1 ? 'Next Question' : 'Continue'}
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            )}
          </Animated.View>
        );
      }

      case 'cta': {
        const data = block.data as CTABlockData;
        return (
          <Animated.View entering={FadeInUp.duration(500)} style={styles.blockContainer} key={block.id}>
            <TouchableOpacity
              style={[styles.ctaButton, { backgroundColor: accent }]}
              activeOpacity={0.7}
            >
              <Text style={styles.ctaButtonText}>{data.label}</Text>
            </TouchableOpacity>
          </Animated.View>
        );
      }

      case 'countdown': {
        const data = block.data as CountdownBlockData;
        return (
          <Animated.View entering={FadeInUp.duration(500)} style={styles.blockContainer} key={block.id}>
            <Icon name="timer-sand" size={40} color={accent} style={{ alignSelf: 'center' }} />
            <Text style={[styles.countdownLabel, { color: theme.colors.text }]}>
              Counting down to {data.label}
            </Text>
            <Text style={[styles.countdownDate, { color: theme.colors.textMuted }]}>
              {data.targetDate}
            </Text>
          </Animated.View>
        );
      }

      default:
        return null;
    }
  };

  // For quiz blocks, the quiz handles its own next; for others show Continue
  const showContinueBtn = currentBlock?.type !== 'quiz_game';

  return (
    <View style={[styles.screen, { backgroundColor: bg }]}>
      <StatusBar barStyle="light-content" />

      {/* Accent bar at top */}
      <View style={[styles.accentBar, { backgroundColor: accent }]} />

      {/* Progress indicator */}
      <View style={styles.progressRow}>
        {blocks.map((_, idx) => (
          <View
            key={idx}
            style={[
              styles.progressDot,
              {
                backgroundColor: idx <= blockIndex ? accent : theme.colors.border,
                flex: 1,
              },
            ]}
          />
        ))}
      </View>

      {/* Block content */}
      <View style={styles.contentArea}>
        {renderBlock(currentBlock)}
      </View>

      {/* Continue button */}
      {showContinueBtn && (
        <View style={styles.bottomActions}>
          <TouchableOpacity
            onPress={handleNext}
            style={[styles.continueBtn, { backgroundColor: accent }]}
            activeOpacity={0.7}
          >
            <Text style={styles.continueBtnText}>{isLastBlock ? 'Finish' : 'Continue'}</Text>
            <Icon name={isLastBlock ? 'check' : 'arrow-right'} size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  fullCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
  },
  notFoundText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: spacing.sm,
  },
  backLink: {
    marginTop: spacing.xs,
  },
  accentBar: {
    height: 3,
    width: '100%',
  },
  progressRow: {
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.md,
  },
  progressDot: {
    height: 4,
    borderRadius: 2,
  },
  contentArea: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  blockContainer: {
    alignItems: 'center',
    gap: spacing.md,
    width: '100%',
  },
  // text block
  textHeading: {
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 36,
  },
  textBody: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
  // media block
  mediaPlaceholder: {
    width: SCREEN_WIDTH - spacing.lg * 2,
    height: 200,
    borderRadius: 16,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.xs,
  },
  mediaText: {
    fontSize: 15,
    fontWeight: '500',
  },
  mediaCaption: {
    fontSize: 13,
  },
  // rsvp block
  rsvpInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  rsvpInfoText: {
    fontSize: 15,
  },
  rsvpOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.sm,
    marginTop: spacing.sm,
    width: '100%',
  },
  rsvpPill: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 24,
    borderWidth: 1.5,
  },
  rsvpPillText: {
    fontSize: 15,
    fontWeight: '600',
  },
  // quiz block
  quizProgress: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  quizQuestion: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 30,
  },
  quizOptions: {
    width: '100%',
    gap: spacing.sm,
  },
  quizOptionBtn: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: 'center',
  },
  quizOptionText: {
    fontSize: 16,
    fontWeight: '600',
  },
  quizFeedback: {
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: spacing.sm,
  },
  quizNextBtn: {
    alignSelf: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
    borderRadius: 14,
    marginTop: spacing.md,
  },
  quizNextBtnText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
  },
  // cta block
  ctaButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xxl,
    borderRadius: 16,
  },
  ctaButtonText: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '700',
  },
  // countdown block
  countdownLabel: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  countdownDate: {
    fontSize: 15,
    textAlign: 'center',
  },
  // completion
  completionContainer: {
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  completionEmoji: {
    fontSize: 64,
  },
  completionTitle: {
    fontSize: 32,
    fontWeight: '800',
  },
  completionSender: {
    fontSize: 16,
  },
  doneBtn: {
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.md,
    borderRadius: 16,
    marginTop: spacing.lg,
  },
  doneBtnText: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '700',
  },
  // bottom actions
  bottomActions: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
    paddingTop: spacing.md,
  },
  continueBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.md,
    borderRadius: 16,
  },
  continueBtnText: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '700',
  },
});
