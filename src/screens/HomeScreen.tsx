import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useTheme } from '../contexts/ThemeContext';
import { useGiftStore } from '../stores/giftStore';
import { RootStackParamList, GiftType, GIFT_TYPE_LABELS, OCCASION_LABELS } from '../types';

type NavigationProp = StackNavigationProp<RootStackParamList>;

const QUICK_PICKS: GiftType[] = ['gift_game', 'birthday_card', 'invitation'];

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}

export default function HomeScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const { gifts, loadGifts, isLoaded } = useGiftStore();

  useEffect(() => {
    loadGifts();
  }, []);

  const recentGifts = gifts.slice(0, 3);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Greeting */}
      <Animated.View entering={FadeInUp.duration(500).delay(100)}>
        <Text style={[styles.greeting, { color: theme.colors.textMuted }]}>
          {getGreeting()} \u2728
        </Text>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          What will you create today?
        </Text>
      </Animated.View>

      {/* Hero CTA */}
      <Animated.View entering={FadeInUp.duration(500).delay(200)}>
        <TouchableOpacity
          style={[styles.heroCta, { backgroundColor: theme.colors.primary }]}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('GiftWizard')}
        >
          <View style={styles.heroCtaContent}>
            <Icon name="gift-outline" size={36} color="#fff" />
            <View style={styles.heroCtaText}>
              <Text style={styles.heroCtaTitle}>Create a Gift</Text>
              <Text style={styles.heroCtaSubtitle}>
                Design something unforgettable
              </Text>
            </View>
          </View>
          <Icon name="chevron-right" size={28} color="#fff" />
        </TouchableOpacity>
      </Animated.View>

      {/* Quick Pick Cards */}
      <Animated.View entering={FadeInUp.duration(500).delay(350)}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Quick Create
        </Text>
        <View style={styles.quickPickRow}>
          {QUICK_PICKS.map((type) => {
            const info = GIFT_TYPE_LABELS[type];
            return (
              <TouchableOpacity
                key={type}
                style={[styles.quickPickCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
                activeOpacity={0.8}
                onPress={() => navigation.navigate('GiftWizard', { giftType: type })}
              >
                <View style={[styles.quickPickIcon, { backgroundColor: theme.colors.primary + '15' }]}>
                  <Icon name={info.icon} size={28} color={theme.colors.primary} />
                </View>
                <Text style={[styles.quickPickLabel, { color: theme.colors.text }]} numberOfLines={1}>
                  {info.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </Animated.View>

      {/* Recent Gifts */}
      <Animated.View entering={FadeInUp.duration(500).delay(500)}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Recent Gifts
        </Text>
        {isLoaded && recentGifts.length === 0 ? (
          <View style={[styles.emptyState, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
            <Icon name="gift-open-outline" size={48} color={theme.colors.textMuted} />
            <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
              No gifts yet
            </Text>
            <Text style={[styles.emptySubtitle, { color: theme.colors.textMuted }]}>
              Create your first gift to see it here
            </Text>
          </View>
        ) : (
          recentGifts.map((gift) => (
            <TouchableOpacity
              key={gift.id}
              style={[styles.giftCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('GiftPreview', { giftId: gift.id })}
            >
              <View style={[styles.giftIconWrap, { backgroundColor: theme.colors.primary + '15' }]}>
                <Icon
                  name={GIFT_TYPE_LABELS[gift.giftType]?.icon ?? 'gift'}
                  size={24}
                  color={theme.colors.primary}
                />
              </View>
              <View style={styles.giftInfo}>
                <Text style={[styles.giftRecipient, { color: theme.colors.text }]} numberOfLines={1}>
                  To {gift.recipient.name}
                </Text>
                <Text style={[styles.giftMeta, { color: theme.colors.textMuted }]} numberOfLines={1}>
                  {GIFT_TYPE_LABELS[gift.giftType]?.label} \u00b7 {OCCASION_LABELS[gift.occasion]}
                </Text>
              </View>
              <Icon name="chevron-right" size={22} color={theme.colors.textMuted} />
            </TouchableOpacity>
          ))
        )}
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  greeting: {
    fontSize: 16,
    marginTop: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    marginTop: 4,
    marginBottom: 24,
  },
  heroCta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 16,
    padding: 20,
    marginBottom: 28,
  },
  heroCtaContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  heroCtaText: {},
  heroCtaTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  heroCtaSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 14,
  },
  quickPickRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 28,
  },
  quickPickCard: {
    flex: 1,
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 18,
    paddingHorizontal: 8,
  },
  quickPickIcon: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  quickPickLabel: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  emptyState: {
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 36,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 14,
    marginTop: 4,
    textAlign: 'center',
  },
  giftCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    marginBottom: 10,
  },
  giftIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  giftInfo: {
    flex: 1,
  },
  giftRecipient: {
    fontSize: 15,
    fontWeight: '600',
  },
  giftMeta: {
    fontSize: 13,
    marginTop: 2,
  },
});
