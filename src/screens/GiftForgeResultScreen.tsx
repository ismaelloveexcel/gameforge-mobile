import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Share,
  ActivityIndicator,
  Clipboard,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, {
  FadeIn,
  FadeInUp,
  SlideInDown,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
} from 'react-native-reanimated';
import { useTheme } from '../contexts/ThemeContext';
import { RootStackParamList } from '../types';
import {
  GeneratedGiftGame,
  GAME_TYPE_LABELS,
  VISUAL_STYLE_LABELS,
} from '../types/giftforge';
import { grokService } from '../services/GrokService';
import AsyncStorage from '@react-native-async-storage/async-storage';

type NavigationProp = StackNavigationProp<RootStackParamList>;
type ResultRouteProp = RouteProp<RootStackParamList, 'GiftForgeResult'>;

// Storage key for saved games
const GAMES_STORAGE_KEY = '@giftforge_games';

export default function GiftForgeResultScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<ResultRouteProp>();
  const { theme } = useTheme();
  
  const [game, setGame] = useState<GeneratedGiftGame | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Animation values
  const celebrationScale = useSharedValue(1);
  
  const loadGame = useCallback(async () => {
    try {
      // Try to load from AsyncStorage
      const storedGames = await AsyncStorage.getItem(GAMES_STORAGE_KEY);
      if (storedGames) {
        const games: GeneratedGiftGame[] = JSON.parse(storedGames);
        const foundGame = games.find(g => g.id === route.params.gameId);
        if (foundGame) {
          setGame(foundGame);
          setIsLoading(false);
          return;
        }
      }
      
      // If not found, the game might still be in the generating state
      // In a real app, we'd fetch from a backend
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading game:', error);
      setIsLoading(false);
    }
  }, [route.params.gameId]);

  useEffect(() => {
    // Celebration animation
    celebrationScale.value = withRepeat(
      withSpring(1.1, { damping: 2 }),
      -1,
      true
    );
    
    loadGame();
  }, [celebrationScale, loadGame]);
  
  const celebrationStyle = useAnimatedStyle(() => ({
    transform: [{ scale: celebrationScale.value }],
  }));
  
  const playableUrl = grokService.generatePlayableUrl(route.params.gameId);
  
  const handleShare = async () => {
    try {
      const shareMessage = `${game?.recipientName}, I made something special for you. Play it here: ${playableUrl}`;
      await Share.share({
        message: shareMessage,
        url: playableUrl,
        title: game?.title || 'A Gift For You',
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };
  
  const handleCopyLink = () => {
    Clipboard.setString(playableUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handlePlayGame = () => {
    setIsPlaying(true);
  };
  
  const handleGoHome = () => {
    navigation.navigate('MainTabs');
  };
  
  // Render game player (simplified version)
  const renderGamePlayer = () => {
    if (!game) return null;
    
    return (
      <View style={styles.gamePlayerContainer}>
        <View style={[styles.gamePlayerHeader, { backgroundColor: theme.colors.primary }]}>
          <TouchableOpacity onPress={() => setIsPlaying(false)} style={styles.closeButton}>
            <Icon name="close" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.gamePlayerTitle}>{game.title}</Text>
        </View>
        
        <ScrollView style={styles.gamePlayerContent}>
          {/* Intro Screen */}
          <Animated.View 
            entering={FadeIn.delay(300)}
            style={[styles.gameScreen, { backgroundColor: theme.colors.card }]}
          >
            <Text style={[styles.gameHeadline, { color: theme.colors.text }]}>
              {game.introScreen.headline}
            </Text>
            <Text style={[styles.gameSubtext, { color: theme.colors.text + '80' }]}>
              {game.introScreen.subtext}
            </Text>
          </Animated.View>
          
          {/* Game Content Preview */}
          <Animated.View 
            entering={FadeIn.delay(500)}
            style={[styles.gameSection, { backgroundColor: theme.colors.card }]}
          >
            <Text style={[styles.gameSectionTitle, { color: theme.colors.primary }]}>
              Game Preview
            </Text>
            
            {game.gameContent.dialogue.map((item, index) => (
              <View key={index} style={styles.dialogueItem}>
                <Text style={[styles.dialogueCharacter, { color: theme.colors.primary }]}>
                  {item.character}:
                </Text>
                <Text style={[styles.dialogueText, { color: theme.colors.text }]}>
                  {item.text}
                </Text>
              </View>
            ))}
          </Animated.View>
          
          {/* Game Type Specific Content */}
          {game.gameContent.levels && (
            <Animated.View 
              entering={FadeIn.delay(700)}
              style={[styles.gameSection, { backgroundColor: theme.colors.card }]}
            >
            <Text style={[styles.gameSectionTitle, { color: theme.colors.primary }]}>
                Levels
            </Text>
              {game.gameContent.levels.map((level, index) => (
                <View key={index} style={styles.levelItem}>
                  <Text style={[styles.levelName, { color: theme.colors.text }]}>
                    Level {level.id}: {level.name}
                  </Text>
                  <Text style={[styles.levelDesc, { color: theme.colors.text + '80' }]}>
                    {level.description}
                  </Text>
                </View>
              ))}
            </Animated.View>
          )}
          
          {game.gameContent.questions && (
            <Animated.View 
              entering={FadeIn.delay(700)}
              style={[styles.gameSection, { backgroundColor: theme.colors.card }]}
            >
            <Text style={[styles.gameSectionTitle, { color: theme.colors.primary }]}>
                Quiz Questions
            </Text>
              {game.gameContent.questions.map((q, index) => (
                <View key={index} style={styles.questionItem}>
                  <Text style={[styles.questionText, { color: theme.colors.text }]}>
                    Q{index + 1}: {q.question}
                  </Text>
                </View>
              ))}
            </Animated.View>
          )}
          
          {game.gameContent.storyBranches && (
            <Animated.View 
              entering={FadeIn.delay(700)}
              style={[styles.gameSection, { backgroundColor: theme.colors.card }]}
            >
            <Text style={[styles.gameSectionTitle, { color: theme.colors.primary }]}>
                Story Branches
            </Text>
              {game.gameContent.storyBranches.slice(0, 2).map((branch, index) => (
                <View key={index} style={styles.branchItem}>
                  <Text style={[styles.branchText, { color: theme.colors.text }]}>
                    {branch.text}
                  </Text>
                </View>
              ))}
            </Animated.View>
          )}
          
          {/* End Screen */}
          <Animated.View 
            entering={FadeIn.delay(900)}
            style={[styles.gameScreen, styles.endScreen, { backgroundColor: theme.colors.primary + '20' }]}
          >
            <Text style={[styles.gameHeadline, { color: theme.colors.primary }]}>
              {game.endScreen.headline}
            </Text>
            <Text style={[styles.personalMessage, { color: theme.colors.text }]}>
              "{game.endScreen.personalMessage}"
            </Text>
            <Text style={[styles.senderSignature, { color: theme.colors.primary }]}>
              {game.endScreen.senderSignature}
            </Text>
            
            {/* Made by Stamp */}
            <View style={[styles.madeByStamp, { borderColor: theme.colors.primary + '40' }]}>
              <Text style={[styles.madeByLabel, { color: theme.colors.text + '60' }]}>
                Made with love by
              </Text>
              <Text style={[styles.madeByName, { color: theme.colors.primary }]}>
                {game.senderName}
              </Text>
            </View>
          </Animated.View>
        </ScrollView>
      </View>
    );
  };
  
  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.loadingText, { color: theme.colors.text }]}>
          Loading your gift...
        </Text>
      </View>
    );
  }
  
  if (isPlaying) {
    return renderGamePlayer();
  }
  
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Success Header */}
        <Animated.View 
          entering={FadeInUp.delay(200)}
          style={styles.successHeader}
        >
          <Animated.View style={[styles.celebrationIcon, celebrationStyle]}>
            <Icon name="check-circle" size={80} color={theme.colors.success} />
          </Animated.View>
          
          <Text style={[styles.successTitle, { color: theme.colors.text }]}>
            Gift Created
          </Text>
          <Text style={[styles.successSubtitle, { color: theme.colors.text + '80' }]}>
            Your personalized game is ready to share
          </Text>
        </Animated.View>
        
        {/* Game Info Card */}
        {game && (
          <Animated.View 
            entering={FadeIn.delay(400)}
            style={[styles.gameInfoCard, { backgroundColor: theme.colors.card }]}
          >
            <Text style={[styles.gameTitle, { color: theme.colors.text }]}>
              {game.title}
            </Text>
            
            <View style={styles.gameInfoRow}>
              <Icon name="account" size={18} color={theme.colors.primary} />
              <Text style={[styles.gameInfoText, { color: theme.colors.text }]}>
                For: {game.recipientName}
              </Text>
            </View>
            
            <View style={styles.gameInfoRow}>
              <Icon name="heart" size={18} color={theme.colors.primary} />
              <Text style={[styles.gameInfoText, { color: theme.colors.text }]}>
                From: {game.senderName}
              </Text>
            </View>
            
            <View style={styles.gameInfoRow}>
              <Icon name="gamepad-variant" size={18} color={theme.colors.primary} />
              <Text style={[styles.gameInfoText, { color: theme.colors.text }]}>
                {GAME_TYPE_LABELS[game.gameContent.type]}
              </Text>
            </View>
            
            <View style={styles.gameInfoRow}>
              <Icon name="palette" size={18} color={theme.colors.primary} />
              <Text style={[styles.gameInfoText, { color: theme.colors.text }]}>
                {VISUAL_STYLE_LABELS[game.visualStyle]}
              </Text>
            </View>
          </Animated.View>
        )}
        
        {/* Share Link Card */}
        <Animated.View 
          entering={FadeIn.delay(600)}
          style={[styles.linkCard, { backgroundColor: theme.colors.card }]}
        >
          <Text style={[styles.linkTitle, { color: theme.colors.primary }]}>
            Shareable Link
          </Text>
          
          <View style={[styles.linkBox, { backgroundColor: theme.colors.background }]}>
            <Text 
              style={[styles.linkText, { color: theme.colors.text }]}
              numberOfLines={1}
              ellipsizeMode="middle"
            >
              {playableUrl}
            </Text>
          </View>
          
          <TouchableOpacity
            style={[styles.copyButton, { backgroundColor: theme.colors.primary }]}
            onPress={handleCopyLink}
          >
            <Icon name={copied ? 'check' : 'content-copy'} size={20} color="#fff" />
            <Text style={styles.copyButtonText}>
              {copied ? 'Copied!' : 'Copy Link'}
            </Text>
          </TouchableOpacity>
        </Animated.View>
        
        {/* Action Buttons */}
        <Animated.View 
          entering={SlideInDown.delay(800)}
          style={styles.actionButtons}
        >
          <TouchableOpacity
            style={[styles.primaryButton, { backgroundColor: theme.colors.success }]}
            onPress={handlePlayGame}
          >
            <Icon name="play-circle" size={24} color="#fff" />
            <Text style={styles.primaryButtonText}>Preview Game</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.primaryButton, { backgroundColor: theme.colors.primary }]}
            onPress={handleShare}
          >
            <Icon name="share-variant" size={24} color="#fff" />
            <Text style={styles.primaryButtonText}>Share Gift</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.secondaryButton, { borderColor: theme.colors.primary }]}
            onPress={handleGoHome}
          >
            <Text style={[styles.secondaryButtonText, { color: theme.colors.primary }]}>
              Back to Home
            </Text>
          </TouchableOpacity>
        </Animated.View>
        
        {/* Encouragement */}
        <Animated.View 
          entering={FadeIn.delay(1000)}
          style={styles.encouragement}
        >
          <Text style={[styles.encouragementText, { color: theme.colors.text + '80' }]}>
            Your recipient is going to love this. Send them the link and watch their face light up.
          </Text>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  successHeader: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  celebrationIcon: {
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  successSubtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  gameInfoCard: {
    margin: 16,
    padding: 20,
    borderRadius: 16,
  },
  gameTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  gameInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  gameInfoText: {
    fontSize: 14,
    marginLeft: 10,
  },
  linkCard: {
    margin: 16,
    marginTop: 0,
    padding: 20,
    borderRadius: 16,
  },
  linkTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  linkBox: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  linkText: {
    fontSize: 14,
    fontFamily: 'monospace',
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  copyButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  actionButtons: {
    padding: 16,
    gap: 12,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  encouragement: {
    padding: 20,
    paddingBottom: 40,
  },
  encouragementText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
  },
  // Game Player Styles
  gamePlayerContainer: {
    flex: 1,
  },
  gamePlayerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  closeButton: {
    padding: 8,
    marginRight: 12,
  },
  gamePlayerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  gamePlayerContent: {
    flex: 1,
    padding: 16,
  },
  gameScreen: {
    padding: 24,
    borderRadius: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  gameHeadline: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  gameSubtext: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  gameSection: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
  },
  gameSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  dialogueItem: {
    marginBottom: 12,
  },
  dialogueCharacter: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  dialogueText: {
    fontSize: 14,
    lineHeight: 20,
  },
  levelItem: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  levelName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  levelDesc: {
    fontSize: 13,
  },
  questionItem: {
    marginBottom: 12,
  },
  questionText: {
    fontSize: 14,
    lineHeight: 20,
  },
  branchItem: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  branchText: {
    fontSize: 14,
    lineHeight: 20,
  },
  endScreen: {
    marginTop: 8,
  },
  personalMessage: {
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 16,
  },
  senderSignature: {
    fontSize: 14,
    fontWeight: '600',
  },
  // Made by Stamp
  madeByStamp: {
    marginTop: 24,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderTopWidth: 1,
    alignItems: 'center',
    width: '100%',
  },
  madeByLabel: {
    fontSize: 11,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  madeByName: {
    fontSize: 18,
    fontWeight: '700',
    fontStyle: 'italic',
  },
});
