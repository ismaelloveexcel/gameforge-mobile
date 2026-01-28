import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Share,
  Alert,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, GiftGame } from '../types';
import { giftGameService } from '../services/GiftGameService';
import { LinearGradient } from 'expo-linear-gradient';

type GiftPreviewScreenNavigationProp = StackNavigationProp<RootStackParamList, 'GiftPreview'>;
type GiftPreviewScreenRouteProp = RouteProp<RootStackParamList, 'GiftPreview'>;

export const GiftPreviewScreen: React.FC = () => {
  const navigation = useNavigation<GiftPreviewScreenNavigationProp>();
  const route = useRoute<GiftPreviewScreenRouteProp>();

  const [giftGame, setGiftGame] = useState<GiftGame | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (route.params?.giftGameId) {
      const game = giftGameService.getGiftGame(route.params.giftGameId);
      if (game) {
        setGiftGame(game);
      } else {
        Alert.alert('Error', 'Gift game not found');
        navigation.goBack();
      }
    }
  }, [route.params?.giftGameId]);

  const handleCopyLink = () => {
    if (giftGame) {
      // In React Native, use a clipboard library like @react-native-clipboard/clipboard
      // For now, just show feedback
      setCopied(true);
      Alert.alert('Copied!', 'Link copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = async () => {
    if (!giftGame) return;

    try {
      await Share.share({
        message: `🎁 ${giftGame.senderName} made you a special gift! Play your personalized game: ${giftGame.shareableUrl}`,
        title: `Gift for ${giftGame.recipientName}`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handlePlayDemo = () => {
    Alert.alert(
      'Demo Mode',
      'This would launch the game in demo/test mode. Full game engine integration coming soon!'
    );
  };

  const handleCreateAnother = () => {
    navigation.navigate('GiftQuestionnaire', {});
  };

  if (!giftGame) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const { recipientName, senderName, gameType, shareableUrl, gameData } = giftGame;
  const params = gameData?.params;

  return (
    <LinearGradient colors={['#667EEA', '#764BA2']} style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Success Header */}
        <View style={styles.header}>
          <Text style={styles.successEmoji}>🎉</Text>
          <Text style={styles.headerTitle}>Your Gift is Ready!</Text>
          <Text style={styles.headerSubtitle}>
            A personalized game for {recipientName}
          </Text>
        </View>

        {/* Preview Card */}
        <View style={styles.previewCard}>
          <View style={styles.gameInfoSection}>
            <View style={styles.gameIcon}>
              <Text style={styles.gameIconText}>
                {gameType === 'runner'
                  ? '🏃‍♀️'
                  : gameType === 'story-choice'
                  ? '📖'
                  : gameType === 'puzzle'
                  ? '🧩'
                  : gameType === 'mini-quest'
                  ? '⚔️'
                  : '🎮'}
              </Text>
            </View>

            <View style={styles.gameInfo}>
              <Text style={styles.gameTitle}>
                {gameType === 'runner'
                  ? 'Heartfelt Runner'
                  : gameType === 'story-choice'
                  ? 'Personal Adventure'
                  : gameType === 'puzzle'
                  ? 'Memory Puzzle'
                  : gameType === 'mini-quest'
                  ? 'Birthday Quest'
                  : 'Custom Game'}
              </Text>
              <Text style={styles.gameSubtitle}>
                From {senderName} with love ❤️
              </Text>
            </View>
          </View>

          {params && (
            <View style={styles.detailsSection}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Emotional Tone:</Text>
                <Text style={styles.detailValue}>
                  {params.occasion.charAt(0).toUpperCase() + params.occasion.slice(1)}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Duration:</Text>
                <Text style={styles.detailValue}>
                  ~{Math.floor(params.gameplay.duration / 60)} minutes
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Difficulty:</Text>
                <Text style={styles.detailValue}>
                  {params.gameplay.difficulty === 1
                    ? 'Easy'
                    : params.gameplay.difficulty === 3
                    ? 'Medium'
                    : 'Challenging'}
                </Text>
              </View>
            </View>
          )}

          {params?.customMessages && (
            <View style={styles.messagePreview}>
              <Text style={styles.messageLabel}>Your Message:</Text>
              <Text style={styles.messageText}>{params.customMessages.intro}</Text>
            </View>
          )}

          {/* Demo Button */}
          <TouchableOpacity style={styles.demoButton} onPress={handlePlayDemo}>
            <Text style={styles.demoButtonText}>▶️ Play Demo</Text>
          </TouchableOpacity>
        </View>

        {/* Share Section */}
        <View style={styles.shareSection}>
          <Text style={styles.shareSectionTitle}>Share Your Gift</Text>
          <Text style={styles.shareSectionSubtitle}>
            Send this unique link to {recipientName}
          </Text>

          <View style={styles.urlContainer}>
            <Text style={styles.urlText} numberOfLines={1}>
              {shareableUrl}
            </Text>
          </View>

          <View style={styles.shareButtons}>
            <TouchableOpacity
              style={[styles.shareButton, styles.copyButton]}
              onPress={handleCopyLink}
            >
              <Text style={styles.shareButtonText}>
                {copied ? '✓ Copied!' : '📋 Copy Link'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.shareButton, styles.shareNativeButton]}
              onPress={handleShare}
            >
              <Text style={styles.shareButtonText}>📤 Share</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsSection}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{giftGame.views}</Text>
            <Text style={styles.statLabel}>Views</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statValue}>
              {giftGame.completed ? '✓' : '⏳'}
            </Text>
            <Text style={styles.statLabel}>
              {giftGame.completed ? 'Completed!' : 'Pending'}
            </Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statValue}>
              {giftGame.expiresAt
                ? Math.ceil(
                    (giftGame.expiresAt.getTime() - Date.now()) /
                      (1000 * 60 * 60 * 24)
                  )
                : '365'}
            </Text>
            <Text style={styles.statLabel}>Days Left</Text>
          </View>
        </View>

        {/* Tips */}
        <View style={styles.tipsSection}>
          <Text style={styles.tipsTitle}>💡 Gift Tips</Text>
          <Text style={styles.tipText}>
            • Personalize the message with inside jokes or special memories
          </Text>
          <Text style={styles.tipText}>
            • Send it at a meaningful time (morning of their birthday, etc.)
          </Text>
          <Text style={styles.tipText}>
            • Watch their reaction and share the moment!
          </Text>
          <Text style={styles.tipText}>
            • Games expire in 1 year, so they have plenty of time to play
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.secondaryActionButton}
            onPress={handleCreateAnother}
          >
            <Text style={styles.secondaryActionButtonText}>
              🎁 Create Another Gift
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.primaryActionButton}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.primaryActionButtonText}>Done</Text>
          </TouchableOpacity>
        </View>

        {/* Upgrade CTA (for future monetization) */}
        <View style={styles.upgradeSection}>
          <Text style={styles.upgradeTitle}>🌟 Unlock Premium Features</Text>
          <Text style={styles.upgradeText}>
            • Unlimited game duration
          </Text>
          <Text style={styles.upgradeText}>• Custom assets & photos</Text>
          <Text style={styles.upgradeText}>• Advanced personalization</Text>
          <Text style={styles.upgradeText}>• Priority support</Text>

          <TouchableOpacity style={styles.upgradeButton}>
            <Text style={styles.upgradeButtonText}>Coming Soon!</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  successEmoji: {
    fontSize: 60,
    marginBottom: 16,
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
  previewCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
  },
  gameInfoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  gameIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  gameIconText: {
    fontSize: 32,
  },
  gameInfo: {
    flex: 1,
  },
  gameTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  gameSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  detailsSection: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  messagePreview: {
    backgroundColor: '#EEF2FF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#667EEA',
  },
  messageLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#667EEA',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  messageText: {
    fontSize: 16,
    color: '#333',
    fontStyle: 'italic',
    lineHeight: 24,
  },
  demoButton: {
    backgroundColor: '#667EEA',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  demoButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  shareSection: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
  },
  shareSectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  shareSectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  urlContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  urlText: {
    fontSize: 14,
    color: '#667EEA',
    fontWeight: '500',
  },
  shareButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  shareButton: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  copyButton: {
    backgroundColor: '#EEF2FF',
  },
  shareNativeButton: {
    backgroundColor: '#667EEA',
  },
  shareButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#667EEA',
  },
  statsSection: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#667EEA',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  tipsSection: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  tipText: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 8,
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  primaryActionButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
  },
  primaryActionButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#667EEA',
  },
  secondaryActionButton: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fff',
  },
  secondaryActionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  upgradeSection: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  upgradeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
    textAlign: 'center',
  },
  upgradeText: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 6,
    opacity: 0.9,
  },
  upgradeButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    marginTop: 16,
  },
  upgradeButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#667EEA',
  },
});
