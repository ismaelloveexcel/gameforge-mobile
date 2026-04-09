import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../contexts/ThemeContext';
import { RootStackParamList, GiftType, GIFT_TYPE_LABELS } from '../types';

type NavigationProp = StackNavigationProp<RootStackParamList>;

const { width } = Dimensions.get('window');

const GIFT_OPTIONS: GiftType[] = ['gift_game', 'birthday_card', 'invitation'];

export default function OnboardingScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [selectedType, setSelectedType] = useState<GiftType | null>(null);

  const completeOnboarding = async (navigateToWizard: boolean) => {
    try {
      await AsyncStorage.setItem('onboarding_completed', 'true');
    } catch {
      // Continue regardless
    }
    if (navigateToWizard && selectedType) {
      navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }, { name: 'GiftWizard', params: { giftType: selectedType } }] });
    } else {
      navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
    }
  };

  // ─── Step 1: Welcome ──────────────────────────────────────────
  const renderWelcome = () => (
    <Animated.View entering={FadeInUp.duration(500)} style={styles.stepContainer}>
      <View style={[styles.heroIcon, { backgroundColor: theme.colors.primary + '18' }]}>
        <Icon name="gift-outline" size={56} color={theme.colors.primary} />
      </View>
      <Text style={[styles.heading, { color: theme.colors.text }]}>
        Welcome to GiftVerse
      </Text>
      <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>
        Create and send unforgettable digital gifts
      </Text>
      <TouchableOpacity
        style={[styles.primaryButton, { backgroundColor: theme.colors.primary }]}
        activeOpacity={0.85}
        onPress={() => setStep(1)}
      >
        <Text style={styles.primaryButtonText}>Get Started</Text>
      </TouchableOpacity>
    </Animated.View>
  );

  // ─── Step 2: Choose Gift Type ─────────────────────────────────
  const renderChoose = () => (
    <Animated.View entering={FadeInUp.duration(500)} style={styles.stepContainer}>
      <Text style={[styles.heading, { color: theme.colors.text }]}>
        What would you like to create first?
      </Text>
      <View style={styles.optionsContainer}>
        {GIFT_OPTIONS.map((type) => {
          const info = GIFT_TYPE_LABELS[type];
          const isSelected = selectedType === type;
          return (
            <TouchableOpacity
              key={type}
              style={[
                styles.optionCard,
                {
                  backgroundColor: isSelected ? theme.colors.primary + '15' : theme.colors.card,
                  borderColor: isSelected ? theme.colors.primary : theme.colors.border,
                },
              ]}
              activeOpacity={0.8}
              onPress={() => setSelectedType(type)}
            >
              <Icon
                name={info.icon}
                size={32}
                color={isSelected ? theme.colors.primary : theme.colors.textMuted}
              />
              <Text
                style={[
                  styles.optionLabel,
                  { color: isSelected ? theme.colors.primary : theme.colors.text },
                ]}
              >
                {info.label}
              </Text>
              <Text style={[styles.optionDesc, { color: theme.colors.textMuted }]} numberOfLines={2}>
                {info.description}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <TouchableOpacity
        style={[
          styles.primaryButton,
          { backgroundColor: selectedType ? theme.colors.primary : theme.colors.border },
        ]}
        activeOpacity={selectedType ? 0.85 : 1}
        onPress={() => { if (selectedType) setStep(2); }}
      >
        <Text style={[styles.primaryButtonText, !selectedType && { opacity: 0.5 }]}>
          Continue
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setStep(2)} style={styles.skipButton}>
        <Text style={[styles.skipText, { color: theme.colors.textMuted }]}>Skip</Text>
      </TouchableOpacity>
    </Animated.View>
  );

  // ─── Step 3: All Set ──────────────────────────────────────────
  const renderAllSet = () => (
    <Animated.View entering={FadeInUp.duration(500)} style={styles.stepContainer}>
      <View style={[styles.heroIcon, { backgroundColor: theme.colors.success + '18' }]}>
        <Icon name="party-popper" size={56} color={theme.colors.success} />
      </View>
      <Text style={[styles.heading, { color: theme.colors.text }]}>
        You're all set! 🎉
      </Text>
      <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>
        Time to create something amazing for someone special
      </Text>
      <TouchableOpacity
        style={[styles.primaryButton, { backgroundColor: theme.colors.primary }]}
        activeOpacity={0.85}
        onPress={() => completeOnboarding(!!selectedType)}
      >
        <Text style={styles.primaryButtonText}>Start Creating</Text>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Progress Dots */}
      <View style={styles.dotsRow}>
        {[0, 1, 2].map((i) => (
          <View
            key={i}
            style={[
              styles.dot,
              {
                backgroundColor: i === step ? theme.colors.primary : theme.colors.border,
                width: i === step ? 24 : 8,
              },
            ]}
          />
        ))}
      </View>

      {step === 0 && renderWelcome()}
      {step === 1 && renderChoose()}
      {step === 2 && renderAllSet()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  stepContainer: {
    alignItems: 'center',
  },
  heroIcon: {
    width: 110,
    height: 110,
    borderRadius: 55,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },
  heading: {
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
    paddingHorizontal: 10,
  },
  optionsContainer: {
    width: '100%',
    gap: 12,
    marginBottom: 28,
    marginTop: 8,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1.5,
    padding: 16,
    gap: 14,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '600',
    flex: 0,
  },
  optionDesc: {
    flex: 1,
    fontSize: 13,
    textAlign: 'right',
  },
  primaryButton: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 14,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
  skipButton: {
    marginTop: 16,
    padding: 8,
  },
  skipText: {
    fontSize: 15,
  },
});
