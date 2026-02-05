/**
 * GiftChainPrompt - Post-game viral prompt
 * 
 * Appears after a recipient plays a gift game, encouraging them to:
 * 1. Gift the sender back
 * 2. Gift someone else
 * 3. First gift free for recipients (viral loop incentive)
 * 
 * Target: 15% gift-back rate
 */
import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, {
  FadeIn,
  FadeInUp,
  SlideInUp,
  SlideOutDown,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTheme } from '../contexts/ThemeContext';
import { spacing, typography, radii } from '../design-tokens/theme';
import { RootStackParamList } from '../types';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface GiftChainPromptProps {
  visible: boolean;
  onClose: () => void;
  senderName: string;
  gameName: string;
}

type NavigationProp = StackNavigationProp<RootStackParamList>;

export default function GiftChainPrompt({
  visible,
  onClose,
  senderName,
  gameName,
}: GiftChainPromptProps) {
  const navigation = useNavigation<NavigationProp>();
  const { seasonalTheme } = useTheme();
  const colors = seasonalTheme.colors;
  
  const buttonScale = useSharedValue(1);
  
  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));
  
  const handleGiftBack = useCallback(() => {
    buttonScale.value = withSequence(
      withSpring(0.95),
      withSpring(1)
    );
    
    onClose();
    // Navigate to home to start gifting
    // In production, would pre-fill sender as recipient
    navigation.navigate('MainTabs');
  }, [onClose, navigation, buttonScale]);
  
  const handleGiftOther = useCallback(() => {
    buttonScale.value = withSequence(
      withSpring(0.95),
      withSpring(1)
    );
    
    onClose();
    navigation.navigate('MainTabs');
  }, [onClose, navigation, buttonScale]);
  
  const handleMaybeLater = useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity 
          style={styles.backdrop} 
          activeOpacity={1}
          onPress={handleMaybeLater}
        />
        
        <Animated.View 
          entering={SlideInUp.springify().damping(15)}
          exiting={SlideOutDown}
          style={[styles.container, { backgroundColor: colors.background }]}
        >
          {/* Confetti-like decorations */}
          <View style={styles.decorations}>
            <Animated.View 
              entering={FadeIn.delay(200)}
              style={[styles.decoration, { backgroundColor: colors.accent + '30', left: '10%', top: -20 }]}
            />
            <Animated.View 
              entering={FadeIn.delay(300)}
              style={[styles.decoration, { backgroundColor: colors.secondary + '30', right: '15%', top: -15 }]}
            />
            <Animated.View 
              entering={FadeIn.delay(400)}
              style={[styles.decoration, { backgroundColor: colors.primary + '30', left: '25%', top: -25 }]}
            />
          </View>
          
          {/* Pull indicator */}
          <View style={[styles.pullIndicator, { backgroundColor: colors.muted + '50' }]} />
          
          {/* Success message */}
          <Animated.View entering={FadeInUp.delay(100)} style={styles.successSection}>
            <View style={[styles.successIcon, { backgroundColor: colors.accent + '15' }]}>
              <Icon name="check-decagram" size={48} color={colors.accent} />
            </View>
            <Text style={[styles.successTitle, { color: colors.text }]}>
              You finished {gameName}
            </Text>
            <Text style={[styles.successSubtitle, { color: colors.muted }]}>
              {senderName} made this just for you
            </Text>
          </Animated.View>
          
          {/* Divider */}
          <View style={[styles.divider, { backgroundColor: colors.muted + '20' }]} />
          
          {/* Gift back prompt */}
          <Animated.View entering={FadeInUp.delay(200)} style={styles.promptSection}>
            <Text style={[styles.promptTitle, { color: colors.text }]}>
              Want to gift someone back?
            </Text>
            
            <Animated.View style={animatedButtonStyle}>
              <TouchableOpacity
                style={[styles.primaryButton, { backgroundColor: colors.accent }]}
                onPress={handleGiftBack}
              >
                <Icon name="gift" size={20} color={colors.background} />
                <Text style={[styles.primaryButtonText, { color: colors.background }]}>
                  Gift {senderName} Back
                </Text>
              </TouchableOpacity>
            </Animated.View>
            
            <TouchableOpacity
              style={[styles.secondaryButton, { borderColor: colors.accent }]}
              onPress={handleGiftOther}
            >
              <Icon name="account-multiple" size={18} color={colors.accent} />
              <Text style={[styles.secondaryButtonText, { color: colors.accent }]}>
                Gift Someone Else
              </Text>
            </TouchableOpacity>
            
            {/* Free gift incentive */}
            <View style={[styles.incentiveCard, { backgroundColor: colors.accent + '10' }]}>
              <Icon name="star" size={16} color={colors.accent} />
              <Text style={[styles.incentiveText, { color: colors.accent }]}>
                Your first gift is free when you've been gifted
              </Text>
            </View>
          </Animated.View>
          
          {/* Maybe later */}
          <Animated.View entering={FadeIn.delay(500)} style={styles.footerSection}>
            <TouchableOpacity onPress={handleMaybeLater}>
              <Text style={[styles.laterText, { color: colors.muted }]}>
                Maybe later
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
    maxHeight: SCREEN_HEIGHT * 0.75,
    overflow: 'hidden',
  },
  decorations: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 30,
  },
  decoration: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  pullIndicator: {
    width: 36,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  successSection: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  successTitle: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    textAlign: 'center',
  },
  successSubtitle: {
    fontSize: typography.size.base,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  divider: {
    height: 1,
    marginVertical: spacing.lg,
  },
  promptSection: {
    alignItems: 'center',
  },
  promptTitle: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: spacing.md,
    borderRadius: radii.md,
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  primaryButtonText: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.bold,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: spacing.md,
    borderRadius: radii.md,
    borderWidth: 2,
    gap: spacing.xs,
    marginBottom: spacing.lg,
  },
  secondaryButtonText: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.semibold,
  },
  incentiveCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.md,
    gap: spacing.xs,
  },
  incentiveText: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
    flex: 1,
  },
  footerSection: {
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  laterText: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
  },
});
