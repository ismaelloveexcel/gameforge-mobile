/**
 * InstantGiftScreen - Quick gift flow for featured games
 * 
 * Minimal personalization: just name + optional message
 * For users who want to gift in under 30 seconds
 */
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Share,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, {
  FadeIn,
  FadeInUp,
  SlideInRight,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
} from 'react-native-reanimated';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useTheme } from '../contexts/ThemeContext';
import { spacing, typography, radii } from '../design-tokens/theme';
import { FeaturedGame, GiftOrder } from '../services/FeaturedGamesService';
import { contentDatabase } from '../services/ContentDatabase';
import { paymentService } from '../services/PaymentService';

type InstantGiftParams = {
  game: FeaturedGame;
};

type InstantGiftRouteProp = RouteProp<{ InstantGift: InstantGiftParams }, 'InstantGift'>;

export default function InstantGiftScreen() {
  const navigation = useNavigation();
  const route = useRoute<InstantGiftRouteProp>();
  const { theme, seasonalTheme } = useTheme();
  const colors = seasonalTheme.colors;
  
  const { game } = route.params;
  
  const [recipientName, setRecipientName] = useState('');
  const [senderName, setSenderName] = useState('');
  const [message, setMessage] = useState('');
  const [step, setStep] = useState<'personalize' | 'confirm' | 'success'>('personalize');
  const [isLoading, setIsLoading] = useState(false);
  const [order, setOrder] = useState<GiftOrder | null>(null);
  
  const buttonScale = useSharedValue(1);
  
  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));
  
  const handleContinue = useCallback(async () => {
    if (!recipientName.trim() || !senderName.trim()) return;
    
    buttonScale.value = withSequence(
      withSpring(0.95),
      withSpring(1)
    );
    
    if (step === 'personalize') {
      setStep('confirm');
    } else if (step === 'confirm') {
      setIsLoading(true);
      
      try {
        // Create the gift order
        const newOrder = await contentDatabase.createGiftOrder(
          game,
          recipientName.trim(),
          senderName.trim(),
          message.trim()
        );
        
        setOrder(newOrder);
        
        // Track the event
        await contentDatabase.trackEvent('gift_sent', game.id);
        
        // Record the memory
        await contentDatabase.recordGiftMemory(
          newOrder.id,
          'sent',
          game.name,
          recipientName.trim()
        );
        
        // For free games, go straight to success
        if (game.priceAED === 0) {
          setStep('success');
        } else {
          // Process payment with PaymentService
          try {
            const paymentIntent = await paymentService.createPaymentIntent(
              newOrder.id,
              game.id,
              recipientName.trim(),
              senderName.trim(),
              game.priceAED
            );
            
            const paymentResult = await paymentService.processPayment(paymentIntent);
            
            if (paymentResult.success) {
              // Payment successful - order status already updated by PaymentService
              setStep('success');
            } else {
              // Payment failed
              console.error('Payment failed:', paymentResult.error);
              await contentDatabase.updateOrderStatus(newOrder.id, 'failed');
              // In production, show payment error modal
              // For now, still show success in demo mode
              if (paymentService.isDemoMode()) {
                setStep('success');
              }
            }
          } catch (paymentError) {
            console.error('Payment error:', paymentError);
            // In demo mode, continue anyway
            if (paymentService.isDemoMode()) {
              await contentDatabase.updateOrderStatus(newOrder.id, 'paid');
              setStep('success');
            }
          }
        }
      } catch (error) {
        console.error('Gift creation failed:', error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [step, recipientName, senderName, message, game, buttonScale]);
  
  const handleShare = useCallback(async () => {
    if (!order) return;
    
    try {
      await Share.share({
        message: `I made something special for you, ${recipientName}. Play it here: ${order.shareUrl}`,
        url: order.shareUrl,
      });
      
      await contentDatabase.updateOrderStatus(order.id, 'shared');
      await contentDatabase.trackEvent('game_shared', game.id);
    } catch {
      // User cancelled sharing
    }
  }, [order, recipientName, game.id]);
  
  const handleDone = useCallback(() => {
    navigation.goBack();
  }, [navigation]);
  
  const canContinue = recipientName.trim().length > 0 && senderName.trim().length > 0;
  
  // Render personalization step
  const renderPersonalizeStep = () => (
    <Animated.View entering={FadeIn.duration(300)} style={styles.stepContent}>
      <View style={[styles.gamePreview, { backgroundColor: colors.surface }]}>
        <View style={[styles.gameThumbnail, { backgroundColor: colors.accent + '20' }]}>
          <Icon name="gamepad-variant" size={32} color={colors.accent} />
        </View>
        <View style={styles.gameInfo}>
          <Text style={[styles.gameName, { color: colors.text }]}>{game.name}</Text>
          <Text style={[styles.gameTagline, { color: colors.muted }]}>{game.tagline}</Text>
          {game.priceAED > 0 && (
            <Text style={[styles.gamePrice, { color: colors.accent }]}>
              AED {game.priceAED}
            </Text>
          )}
          {game.priceAED === 0 && (
            <Text style={[styles.gameFree, { color: '#10B981' }]}>Free</Text>
          )}
        </View>
      </View>
      
      <Text style={[styles.sectionLabel, { color: colors.text }]}>Who is this for?</Text>
      <TextInput
        style={[styles.input, { 
          backgroundColor: colors.surface, 
          color: colors.text,
          borderColor: colors.muted + '30',
        }]}
        placeholder="Their name"
        placeholderTextColor={colors.muted}
        value={recipientName}
        onChangeText={setRecipientName}
        autoFocus
      />
      
      <Text style={[styles.sectionLabel, { color: colors.text }]}>From</Text>
      <TextInput
        style={[styles.input, { 
          backgroundColor: colors.surface, 
          color: colors.text,
          borderColor: colors.muted + '30',
        }]}
        placeholder="Your name"
        placeholderTextColor={colors.muted}
        value={senderName}
        onChangeText={setSenderName}
      />
      
      <Text style={[styles.sectionLabel, { color: colors.text }]}>
        Add a message <Text style={{ color: colors.muted }}>(optional)</Text>
      </Text>
      <TextInput
        style={[styles.input, styles.messageInput, { 
          backgroundColor: colors.surface, 
          color: colors.text,
          borderColor: colors.muted + '30',
        }]}
        placeholder="Write something personal..."
        placeholderTextColor={colors.muted}
        value={message}
        onChangeText={setMessage}
        multiline
        numberOfLines={3}
      />
    </Animated.View>
  );
  
  // Render confirmation step
  const renderConfirmStep = () => (
    <Animated.View entering={SlideInRight.duration(300)} style={styles.stepContent}>
      <View style={[styles.confirmCard, { backgroundColor: colors.surface }]}>
        <Text style={[styles.confirmTitle, { color: colors.text }]}>Ready to send?</Text>
        
        <View style={styles.confirmRow}>
          <Text style={[styles.confirmLabel, { color: colors.muted }]}>Game</Text>
          <Text style={[styles.confirmValue, { color: colors.text }]}>{game.name}</Text>
        </View>
        
        <View style={styles.confirmRow}>
          <Text style={[styles.confirmLabel, { color: colors.muted }]}>To</Text>
          <Text style={[styles.confirmValue, { color: colors.text }]}>{recipientName}</Text>
        </View>
        
        <View style={styles.confirmRow}>
          <Text style={[styles.confirmLabel, { color: colors.muted }]}>From</Text>
          <Text style={[styles.confirmValue, { color: colors.text }]}>{senderName}</Text>
        </View>
        
        {message && (
          <View style={styles.confirmRow}>
            <Text style={[styles.confirmLabel, { color: colors.muted }]}>Message</Text>
            <Text style={[styles.confirmValue, { color: colors.text }]} numberOfLines={2}>
              {message}
            </Text>
          </View>
        )}
        
        <View style={[styles.confirmDivider, { backgroundColor: colors.muted + '20' }]} />
        
        <View style={styles.confirmRow}>
          <Text style={[styles.confirmLabel, { color: colors.muted }]}>Total</Text>
          <Text style={[styles.confirmPrice, { color: colors.accent }]}>
            {game.priceAED === 0 ? 'Free' : `AED ${game.priceAED}`}
          </Text>
        </View>
      </View>
      
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => setStep('personalize')}
      >
        <Icon name="chevron-left" size={20} color={colors.muted} />
        <Text style={[styles.backButtonText, { color: colors.muted }]}>Edit details</Text>
      </TouchableOpacity>
    </Animated.View>
  );
  
  // Render success step
  const renderSuccessStep = () => (
    <Animated.View entering={FadeInUp.duration(500)} style={styles.successContent}>
      <View style={[styles.successIcon, { backgroundColor: colors.accent + '20' }]}>
        <Icon name="check-circle" size={64} color={colors.accent} />
      </View>
      
      <Text style={[styles.successTitle, { color: colors.text }]}>Gift Created</Text>
      <Text style={[styles.successSubtitle, { color: colors.muted }]}>
        {recipientName}'s game is ready to play
      </Text>
      
      <View style={[styles.linkCard, { backgroundColor: colors.surface }]}>
        <Icon name="link-variant" size={20} color={colors.muted} />
        <Text 
          style={[styles.linkText, { color: colors.text }]} 
          numberOfLines={1}
          ellipsizeMode="middle"
        >
          {order?.shareUrl || 'gameforge.app/play/...'}
        </Text>
      </View>
      
      {/* Payment provider badge for demo mode */}
      {paymentService.isDemoMode() && game.priceAED > 0 && (
        <View style={[styles.demoBadge, { backgroundColor: colors.accent + '20' }]}>
          <Icon name="information" size={16} color={colors.accent} />
          <Text style={[styles.demoText, { color: colors.accent }]}>
            Demo mode - No payment processed
          </Text>
        </View>
      )}
      
      <TouchableOpacity
        style={[styles.shareButton, { backgroundColor: colors.accent }]}
        onPress={handleShare}
      >
        <Icon name="share-variant" size={20} color={colors.background} />
        <Text style={[styles.shareButtonText, { color: colors.background }]}>
          Share with {recipientName}
        </Text>
      </TouchableOpacity>
      
      {/* Made by stamp */}
      <View style={[styles.madeByStamp, { borderColor: colors.accent + '40' }]}>
        <Text style={[styles.madeByLabel, { color: colors.muted }]}>Made with love by</Text>
        <Text style={[styles.madeByName, { color: colors.accent }]}>{senderName}</Text>
      </View>
    </Animated.View>
  );
  
  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={step === 'success' ? handleDone : () => navigation.goBack()}>
          <Icon name={step === 'success' ? 'check' : 'close'} size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          {step === 'personalize' && 'Create Gift'}
          {step === 'confirm' && 'Confirm'}
          {step === 'success' && 'Done'}
        </Text>
        <View style={{ width: 24 }} />
      </View>
      
      {/* Progress */}
      {step !== 'success' && (
        <View style={styles.progress}>
          <View style={[styles.progressStep, { backgroundColor: colors.accent }]} />
          <View style={[
            styles.progressStep, 
            { backgroundColor: step === 'confirm' ? colors.accent : colors.muted + '30' }
          ]} />
        </View>
      )}
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {step === 'personalize' && renderPersonalizeStep()}
        {step === 'confirm' && renderConfirmStep()}
        {step === 'success' && renderSuccessStep()}
      </ScrollView>
      
      {/* Bottom Action */}
      {step !== 'success' && (
        <View style={[styles.bottomAction, { backgroundColor: colors.background }]}>
          <Animated.View style={animatedButtonStyle}>
            <TouchableOpacity
              style={[
                styles.continueButton,
                { backgroundColor: canContinue ? colors.accent : colors.muted + '30' }
              ]}
              onPress={handleContinue}
              disabled={!canContinue || isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={colors.background} />
              ) : (
                <>
                  <Text style={[
                    styles.continueButtonText, 
                    { color: canContinue ? colors.background : colors.muted }
                  ]}>
                    {step === 'personalize' ? 'Continue' : `${game.priceAED === 0 ? 'Send Gift' : `Pay AED ${game.priceAED}`}`}
                  </Text>
                  <Icon 
                    name="arrow-right" 
                    size={20} 
                    color={canContinue ? colors.background : colors.muted} 
                  />
                </>
              )}
            </TouchableOpacity>
          </Animated.View>
        </View>
      )}
      
      {step === 'success' && (
        <View style={[styles.bottomAction, { backgroundColor: colors.background }]}>
          <TouchableOpacity
            style={[styles.doneButton, { borderColor: colors.accent }]}
            onPress={handleDone}
          >
            <Text style={[styles.doneButtonText, { color: colors.accent }]}>Done</Text>
          </TouchableOpacity>
        </View>
      )}
    </KeyboardAvoidingView>
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
    marginBottom: spacing.lg,
  },
  progressStep: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 120,
  },
  stepContent: {
    flex: 1,
  },
  gamePreview: {
    flexDirection: 'row',
    padding: spacing.md,
    borderRadius: radii.lg,
    marginBottom: spacing.xl,
  },
  gameThumbnail: {
    width: 64,
    height: 64,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gameInfo: {
    flex: 1,
    marginLeft: spacing.md,
    justifyContent: 'center',
  },
  gameName: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.bold,
  },
  gameTagline: {
    fontSize: typography.size.sm,
    marginTop: 2,
  },
  gamePrice: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.bold,
    marginTop: spacing.xs,
  },
  gameFree: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.bold,
    marginTop: spacing.xs,
  },
  sectionLabel: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
    marginBottom: spacing.sm,
    marginTop: spacing.md,
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
  confirmCard: {
    padding: spacing.lg,
    borderRadius: radii.lg,
  },
  confirmTitle: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  confirmRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  confirmLabel: {
    fontSize: typography.size.sm,
  },
  confirmValue: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
    flex: 1,
    textAlign: 'right',
    marginLeft: spacing.md,
  },
  confirmDivider: {
    height: 1,
    marginVertical: spacing.md,
  },
  confirmPrice: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.lg,
  },
  backButtonText: {
    fontSize: typography.size.sm,
  },
  successContent: {
    alignItems: 'center',
    paddingTop: spacing.xl,
  },
  successIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  successTitle: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    marginBottom: spacing.sm,
  },
  successSubtitle: {
    fontSize: typography.size.base,
    marginBottom: spacing.xl,
  },
  linkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radii.md,
    marginBottom: spacing.lg,
    width: '100%',
    gap: spacing.sm,
  },
  linkText: {
    flex: 1,
    fontSize: typography.size.sm,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    borderRadius: radii.md,
    width: '100%',
    gap: spacing.sm,
  },
  shareButtonText: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.bold,
  },
  madeByStamp: {
    alignItems: 'center',
    marginTop: spacing.xl,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    width: '100%',
  },
  madeByLabel: {
    fontSize: typography.size.xs,
    fontStyle: 'italic',
  },
  madeByName: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    fontStyle: 'italic',
    marginTop: spacing.xxs,
  },
  bottomAction: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    borderRadius: radii.md,
    gap: spacing.sm,
  },
  continueButtonText: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.bold,
  },
  doneButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    borderRadius: radii.md,
    borderWidth: 2,
  },
  doneButtonText: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.bold,
  },
  demoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    borderRadius: radii.sm,
    marginTop: spacing.md,
    gap: spacing.xs,
  },
  demoText: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.medium,
  },
});
