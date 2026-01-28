import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, {
  FadeIn,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  runOnJS,
} from 'react-native-reanimated';
import { useTheme } from '../contexts/ThemeContext';
import { RootStackParamList } from '../types';
import {
  GeneratedGiftGame,
  GiftVisualStyle,
} from '../types/giftforge';
import AsyncStorage from '@react-native-async-storage/async-storage';

type NavigationProp = StackNavigationProp<RootStackParamList>;
type GameRouteProp = RouteProp<RootStackParamList, 'GiftForgeGame'>;

// Storage key for saved games
const GAMES_STORAGE_KEY = '@giftforge_games';

// Visual style theme mappings
const VISUAL_STYLE_THEMES: Record<GiftVisualStyle, {
  primary: string;
  secondary: string;
  background: string;
  accent: string;
}> = {
  colorful_cartoon: {
    primary: '#FF6B6B',
    secondary: '#4ECDC4',
    background: '#FFF9E6',
    accent: '#FFE66D',
  },
  elegant_minimal: {
    primary: '#2C3E50',
    secondary: '#95A5A6',
    background: '#FAFAFA',
    accent: '#E74C3C',
  },
  retro_pixel: {
    primary: '#00FF00',
    secondary: '#FF00FF',
    background: '#0D0D0D',
    accent: '#00FFFF',
  },
  cozy_handdrawn: {
    primary: '#D4A574',
    secondary: '#8FBC8F',
    background: '#FDF5E6',
    accent: '#CD853F',
  },
  magical_sparkle: {
    primary: '#9B59B6',
    secondary: '#3498DB',
    background: '#1A1A2E',
    accent: '#F39C12',
  },
};

type GamePhase = 'intro' | 'playing' | 'end';

export default function GiftForgeGameScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<GameRouteProp>();
  const { theme: appTheme } = useTheme();
  
  const [game, setGame] = useState<GeneratedGiftGame | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [phase, setPhase] = useState<GamePhase>('intro');
  const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0);
  const [currentBranchId, setCurrentBranchId] = useState('start');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  
  // Animation values
  const fadeAnim = useSharedValue(0);
  const sparkleRotation = useSharedValue(0);
  
  const loadGame = useCallback(async () => {
    try {
      const storedGames = await AsyncStorage.getItem(GAMES_STORAGE_KEY);
      if (storedGames) {
        const games: GeneratedGiftGame[] = JSON.parse(storedGames);
        const foundGame = games.find(g => g.id === route.params.gameId);
        if (foundGame) {
          setGame(foundGame);
        }
      }
    } catch (error) {
      console.error('Error loading game:', error);
    } finally {
      setIsLoading(false);
    }
  }, [route.params.gameId]);

  useEffect(() => {
    fadeAnim.value = withTiming(1, { duration: 500 });
    sparkleRotation.value = withRepeat(
      withTiming(360, { duration: 4000 }),
      -1,
      false
    );
    loadGame();
  }, [fadeAnim, sparkleRotation, loadGame]);
  
  const fadeStyle = useAnimatedStyle(() => ({
    opacity: fadeAnim.value,
  }));
  
  const sparkleStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${sparkleRotation.value}deg` }],
  }));
  
  // Get visual theme based on game style
  const getVisualTheme = () => {
    if (!game) return VISUAL_STYLE_THEMES.colorful_cartoon;
    return VISUAL_STYLE_THEMES[game.visualStyle] || VISUAL_STYLE_THEMES.colorful_cartoon;
  };
  
  const visualTheme = getVisualTheme();
  
  // Handle starting the game
  const handleStart = () => {
    fadeAnim.value = withTiming(0, { duration: 300 }, () => {
      runOnJS(setPhase)('playing');
      fadeAnim.value = withTiming(1, { duration: 300 });
    });
  };
  
  // Handle continuing dialogue
  const handleNextDialogue = () => {
    if (!game) return;
    
    if (currentDialogueIndex < game.gameContent.dialogue.length - 1) {
      setCurrentDialogueIndex(prev => prev + 1);
    } else {
      // Move to game-specific content or end
      if (game.gameContent.storyBranches?.length) {
        // Story mode - already handled
      } else if (game.gameContent.questions?.length) {
        // Quiz mode - start questions
      } else if (game.gameContent.levels?.length) {
        // Runner mode - show levels
      } else {
        // End game
        goToEnd();
      }
    }
  };
  
  // Handle story choice
  const handleStoryChoice = (nextBranchId: string) => {
    if (nextBranchId === 'finale' || !game?.gameContent.storyBranches?.find(b => b.id === nextBranchId)) {
      goToEnd();
    } else {
      setCurrentBranchId(nextBranchId);
      setScore(prev => prev + 10);
    }
  };
  
  // Handle quiz answer
  const handleQuizAnswer = (answerIndex: number) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(answerIndex);
    setShowFeedback(true);
    
    const question = game?.gameContent.questions?.[currentQuestionIndex];
    if (question && answerIndex === question.correctAnswer) {
      setScore(prev => prev + 20);
    }
    
    // Move to next question after delay
    setTimeout(() => {
      setSelectedAnswer(null);
      setShowFeedback(false);
      
      if (game?.gameContent.questions && currentQuestionIndex < game.gameContent.questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        goToEnd();
      }
    }, 2000);
  };
  
  // Handle level completion (simplified for runner)
  const handleLevelComplete = () => {
    if (game?.gameContent.levels && currentLevelIndex < game.gameContent.levels.length - 1) {
      setCurrentLevelIndex(prev => prev + 1);
      setScore(prev => prev + 30);
    } else {
      goToEnd();
    }
  };
  
  // Go to end screen
  const goToEnd = () => {
    fadeAnim.value = withTiming(0, { duration: 300 }, () => {
      runOnJS(setPhase)('end');
      fadeAnim.value = withTiming(1, { duration: 300 });
    });
  };
  
  // Render intro screen
  const renderIntro = () => {
    if (!game) return null;
    
    return (
      <Animated.View style={[styles.screenContainer, fadeStyle, { backgroundColor: visualTheme.background }]}>
        <View style={styles.centeredContent}>
          <Animated.View style={sparkleStyle}>
            <Text style={styles.sparkleEmoji}>✨</Text>
          </Animated.View>
          
          <Text style={[styles.introHeadline, { color: visualTheme.primary }]}>
            {game.introScreen.headline}
          </Text>
          
          <Text style={[styles.introSubtext, { color: visualTheme.secondary }]}>
            {game.introScreen.subtext}
          </Text>
          
          <TouchableOpacity
            style={[styles.startButton, { backgroundColor: visualTheme.primary }]}
            onPress={handleStart}
          >
            <Text style={styles.startButtonText}>
              {game.introScreen.buttonText}
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  };
  
  // Render gameplay screen
  const renderPlaying = () => {
    if (!game) return null;
    
    // Get current dialogue if any
    const currentDialogue = game.gameContent.dialogue[currentDialogueIndex];
    
    // Story & Choices mode
    if (game.gameContent.storyBranches?.length) {
      const currentBranch = game.gameContent.storyBranches.find(b => b.id === currentBranchId);
      
      if (!currentBranch) return renderDialogue(currentDialogue);
      
      return (
        <Animated.View style={[styles.screenContainer, fadeStyle, { backgroundColor: visualTheme.background }]}>
          <View style={styles.header}>
            <Text style={[styles.scoreText, { color: visualTheme.primary }]}>
              ⭐ {score}
            </Text>
          </View>
          
          <ScrollView style={styles.contentArea}>
            <Animated.View entering={FadeIn} style={styles.storyCard}>
              <Text style={[styles.storyText, { color: visualTheme.primary }]}>
                {currentBranch.text}
              </Text>
            </Animated.View>
            
            {currentBranch.choices.length > 0 && (
              <View style={styles.choicesContainer}>
                {currentBranch.choices.map((choice, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[styles.choiceButton, { 
                      backgroundColor: visualTheme.primary + '20',
                      borderColor: visualTheme.primary,
                    }]}
                    onPress={() => handleStoryChoice(choice.nextBranchId)}
                  >
                    <Text style={[styles.choiceText, { color: visualTheme.primary }]}>
                      {choice.text}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            
            {currentBranch.choices.length === 0 && (
              <TouchableOpacity
                style={[styles.continueButton, { backgroundColor: visualTheme.primary }]}
                onPress={goToEnd}
              >
                <Text style={styles.continueButtonText}>Continue →</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </Animated.View>
      );
    }
    
    // Quiz mode
    if (game.gameContent.questions?.length) {
      const question = game.gameContent.questions[currentQuestionIndex];
      
      return (
        <Animated.View style={[styles.screenContainer, fadeStyle, { backgroundColor: visualTheme.background }]}>
          <View style={styles.header}>
            <Text style={[styles.progressText, { color: visualTheme.secondary }]}>
              Question {currentQuestionIndex + 1} of {game.gameContent.questions.length}
            </Text>
            <Text style={[styles.scoreText, { color: visualTheme.primary }]}>
              ⭐ {score}
            </Text>
          </View>
          
          <View style={styles.contentArea}>
            <Animated.View entering={FadeIn}>
              <Text style={[styles.questionText, { color: visualTheme.primary }]}>
                {question.question}
              </Text>
              
              <View style={styles.optionsContainer}>
                {question.options.map((option, index) => {
                  const isSelected = selectedAnswer === index;
                  const isCorrect = index === question.correctAnswer;
                  const showResult = showFeedback && (isSelected || isCorrect);
                  
                  return (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.optionButton,
                        { borderColor: visualTheme.primary },
                        showResult && isCorrect && styles.correctOption,
                        showResult && isSelected && !isCorrect && styles.wrongOption,
                      ]}
                      onPress={() => handleQuizAnswer(index)}
                      disabled={selectedAnswer !== null}
                    >
                      <Text style={[styles.optionText, { color: visualTheme.primary }]}>
                        {option}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              
              {showFeedback && (
                <Animated.View entering={FadeIn} style={styles.feedbackContainer}>
                  <Text style={[styles.feedbackText, { color: visualTheme.accent }]}>
                    {question.encouragingFeedback}
                  </Text>
                </Animated.View>
              )}
            </Animated.View>
          </View>
        </Animated.View>
      );
    }
    
    // Runner mode (simplified level progress)
    if (game.gameContent.levels?.length) {
      const level = game.gameContent.levels[currentLevelIndex];
      
      return (
        <Animated.View style={[styles.screenContainer, fadeStyle, { backgroundColor: visualTheme.background }]}>
          <View style={styles.header}>
            <Text style={[styles.progressText, { color: visualTheme.secondary }]}>
              Level {currentLevelIndex + 1} of {game.gameContent.levels.length}
            </Text>
            <Text style={[styles.scoreText, { color: visualTheme.primary }]}>
              ⭐ {score}
            </Text>
          </View>
          
          <View style={styles.contentArea}>
            <Animated.View entering={FadeIn} style={[styles.levelCard, { backgroundColor: visualTheme.primary + '10' }]}>
              <Text style={[styles.levelTitle, { color: visualTheme.primary }]}>
                🏃 {level.name}
              </Text>
              <Text style={[styles.levelDesc, { color: visualTheme.secondary }]}>
                {level.description}
              </Text>
              
              <View style={styles.objectivesContainer}>
                <Text style={[styles.objectivesTitle, { color: visualTheme.primary }]}>
                  Objectives:
                </Text>
                {level.objectives.map((obj, index) => (
                  <Text key={index} style={[styles.objectiveItem, { color: visualTheme.secondary }]}>
                    • {obj}
                  </Text>
                ))}
              </View>
              
              <TouchableOpacity
                style={[styles.playLevelButton, { backgroundColor: visualTheme.primary }]}
                onPress={handleLevelComplete}
              >
                <Text style={styles.playLevelButtonText}>
                  Complete Level! ✨
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </Animated.View>
      );
    }
    
    // Default dialogue mode
    return renderDialogue(currentDialogue);
  };
  
  // Render dialogue screen
  const renderDialogue = (dialogue: any) => {
    if (!dialogue || !game) return null;
    
    return (
      <Animated.View style={[styles.screenContainer, fadeStyle, { backgroundColor: visualTheme.background }]}>
        <View style={styles.header}>
          <Text style={[styles.scoreText, { color: visualTheme.primary }]}>
            ⭐ {score}
          </Text>
        </View>
        
        <View style={styles.dialogueContainer}>
          <Animated.View 
            entering={FadeIn}
            style={[styles.dialogueBubble, { backgroundColor: visualTheme.primary + '20' }]}
          >
            <Text style={[styles.dialogueCharacter, { color: visualTheme.accent }]}>
              {dialogue.character}
            </Text>
            <Text style={[styles.dialogueText, { color: visualTheme.primary }]}>
              {dialogue.text}
            </Text>
          </Animated.View>
          
          <TouchableOpacity
            style={[styles.nextButton, { backgroundColor: visualTheme.primary }]}
            onPress={handleNextDialogue}
          >
            <Text style={styles.nextButtonText}>
              {currentDialogueIndex < game.gameContent.dialogue.length - 1 ? 'Next →' : 'Continue →'}
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  };
  
  // Render end screen
  const renderEnd = () => {
    if (!game) return null;
    
    return (
      <Animated.View style={[styles.screenContainer, fadeStyle, { backgroundColor: visualTheme.background }]}>
        <ScrollView contentContainerStyle={styles.endContent}>
          <Text style={styles.endEmoji}>🎉</Text>
          
          <Text style={[styles.endHeadline, { color: visualTheme.primary }]}>
            {game.endScreen.headline}
          </Text>
          
          <View style={[styles.messageCard, { backgroundColor: visualTheme.primary + '10' }]}>
            <Text style={[styles.personalMessage, { color: visualTheme.primary }]}>
              "{game.endScreen.personalMessage}"
            </Text>
            
            <Text style={[styles.signature, { color: visualTheme.accent }]}>
              {game.endScreen.senderSignature}
            </Text>
          </View>
          
          <View style={[styles.scoreCard, { backgroundColor: visualTheme.accent + '20' }]}>
            <Text style={[styles.finalScoreLabel, { color: visualTheme.secondary }]}>
              Your Score
            </Text>
            <Text style={[styles.finalScoreValue, { color: visualTheme.accent }]}>
              ⭐ {score}
            </Text>
          </View>
          
          <TouchableOpacity
            style={[styles.homeButton, { backgroundColor: visualTheme.primary }]}
            onPress={() => navigation.navigate('MainTabs')}
          >
            <Text style={styles.homeButtonText}>Back to Home</Text>
          </TouchableOpacity>
        </ScrollView>
      </Animated.View>
    );
  };
  
  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: appTheme.colors.background }]}>
        <ActivityIndicator size="large" color={appTheme.colors.primary} />
        <Text style={[styles.loadingText, { color: appTheme.colors.text }]}>
          Loading your gift...
        </Text>
      </View>
    );
  }
  
  if (!game) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: appTheme.colors.background }]}>
        <Icon name="alert-circle" size={48} color={appTheme.colors.error} />
        <Text style={[styles.errorText, { color: appTheme.colors.text }]}>
          Game not found
        </Text>
        <TouchableOpacity
          style={[styles.errorButton, { backgroundColor: appTheme.colors.primary }]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.errorButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      {phase === 'intro' && renderIntro()}
      {phase === 'playing' && renderPlaying()}
      {phase === 'end' && renderEnd()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    marginTop: 16,
    marginBottom: 24,
  },
  errorButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  errorButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  screenContainer: {
    flex: 1,
  },
  centeredContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  sparkleEmoji: {
    fontSize: 48,
    marginBottom: 24,
  },
  introHeadline: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  introSubtext: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 26,
  },
  startButton: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 30,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  progressText: {
    fontSize: 14,
  },
  scoreText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  contentArea: {
    flex: 1,
    padding: 20,
  },
  storyCard: {
    marginBottom: 24,
  },
  storyText: {
    fontSize: 18,
    lineHeight: 28,
    textAlign: 'center',
  },
  choicesContainer: {
    gap: 12,
  },
  choiceButton: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
  },
  choiceText: {
    fontSize: 16,
    textAlign: 'center',
  },
  continueButton: {
    alignSelf: 'center',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 25,
    marginTop: 24,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  questionText: {
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 30,
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    backgroundColor: '#fff',
  },
  optionText: {
    fontSize: 16,
    textAlign: 'center',
  },
  correctOption: {
    backgroundColor: '#D4EDDA',
    borderColor: '#28A745',
  },
  wrongOption: {
    backgroundColor: '#F8D7DA',
    borderColor: '#DC3545',
  },
  feedbackContainer: {
    marginTop: 24,
    padding: 16,
    borderRadius: 12,
  },
  feedbackText: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
  levelCard: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  levelTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  levelDesc: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  objectivesContainer: {
    alignSelf: 'stretch',
    marginBottom: 24,
  },
  objectivesTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  objectiveItem: {
    fontSize: 14,
    marginBottom: 4,
  },
  playLevelButton: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 25,
  },
  playLevelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dialogueContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  dialogueBubble: {
    padding: 24,
    borderRadius: 20,
    marginBottom: 32,
  },
  dialogueCharacter: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  dialogueText: {
    fontSize: 18,
    lineHeight: 26,
  },
  nextButton: {
    alignSelf: 'center',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 25,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  endContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    paddingTop: 60,
  },
  endEmoji: {
    fontSize: 64,
    marginBottom: 24,
  },
  endHeadline: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  messageCard: {
    padding: 24,
    borderRadius: 16,
    marginBottom: 24,
    width: '100%',
  },
  personalMessage: {
    fontSize: 18,
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: 16,
  },
  signature: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  scoreCard: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 32,
  },
  finalScoreLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  finalScoreValue: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  homeButton: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 25,
  },
  homeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
