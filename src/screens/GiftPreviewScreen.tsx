import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Share,
  StatusBar,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  RootStackParamList,
  GiftExperience,
  GiftType,
  ContentBlock,
  GIFT_TYPE_LABELS,
  OCCASION_LABELS,
  TextBlockData,
  RSVPBlockData,
  QuizGameBlockData,
} from '../types';
import { useGiftStore } from '../stores/giftStore';
import { useTheme } from '../contexts/ThemeContext';
import { forgeColors, spacing } from '../design-tokens/theme';

type PreviewRoute = RouteProp<RootStackParamList, 'GiftPreview'>;
type NavProp = StackNavigationProp<RootStackParamList>;

export default function GiftPreviewScreen() {
  const { theme, isDark } = useTheme();
  const navigation = useNavigation<NavProp>();
  const route = useRoute<PreviewRoute>();
  const { giftId } = route.params;
  const gift = useGiftStore((s) => s.gifts.find((g) => g.id === giftId));

  if (!gift) {
    return (
      <View style={[styles.center, { backgroundColor: theme.colors.background }]}>
        <Icon name="gift-off-outline" size={64} color={theme.colors.textMuted} />
        <Text style={[styles.notFoundText, { color: theme.colors.text }]}>Gift not found</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backLink}>
          <Text style={{ color: theme.colors.primary }}>Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const typeInfo = GIFT_TYPE_LABELS[gift.giftType];
  const occasionLabel = OCCASION_LABELS[gift.occasion];

  const handleShare = async () => {
    try {
      await Share.share({
        title: `${typeInfo.label} for ${gift.recipient.name}`,
        message: `Check out this gift! giftverse.app/gift/${gift.shareSlug}`,
        url: gift.shareUrl,
      });
    } catch {}
  };

  const handleViewAsRecipient = () => {
    navigation.navigate('GiftView', { giftId: gift.id });
  };

  const paymentBadge = () => {
    switch (gift.paymentStatus) {
      case 'free':
        return { label: 'Free', color: forgeColors.moss[500], icon: 'check-circle' };
      case 'paid':
        return { label: 'Paid', color: forgeColors.moss[500], icon: 'check-decagram' };
      case 'pending':
        return { label: 'Pending', color: forgeColors.gold[500], icon: 'clock-outline' };
      case 'failed':
        return { label: 'Failed', color: forgeColors.ember[500], icon: 'alert-circle' };
      default:
        return { label: 'Unknown', color: theme.colors.textMuted, icon: 'help-circle' };
    }
  };

  const payment = paymentBadge();

  const firstTextBlock = gift.contentBlocks.find((b) => b.type === 'text');
  const firstTextData = firstTextBlock?.data as TextBlockData | undefined;

  const rsvpBlock = gift.contentBlocks.find((b) => b.type === 'rsvp');
  const rsvpData = rsvpBlock?.data as RSVPBlockData | undefined;

  const quizBlock = gift.contentBlocks.find((b) => b.type === 'quiz_game');
  const quizData = quizBlock?.data as QuizGameBlockData | undefined;

  const renderCardContent = () => {
    switch (gift.giftType) {
      case 'birthday_card':
        return (
          <View style={styles.cardInner}>
            {firstTextData?.heading && (
              <Text style={[styles.cardHeading, { color: theme.colors.text }]}>
                {firstTextData.heading}
              </Text>
            )}
            <Text style={[styles.cardMessage, { color: theme.colors.textMuted }]}>
              {gift.personalMessage || firstTextData?.body || 'A heartfelt message awaits...'}
            </Text>
            <View style={[styles.styleBadge, { backgroundColor: theme.colors.primary + '20' }]}>
              <Icon name="palette-outline" size={14} color={theme.colors.primary} />
              <Text style={[styles.styleBadgeText, { color: theme.colors.primary }]}>
                {gift.visualStyle.replace(/_/g, ' ')}
              </Text>
            </View>
          </View>
        );

      case 'invitation':
        return (
          <View style={styles.cardInner}>
            {rsvpData ? (
              <>
                <Text style={[styles.cardHeading, { color: theme.colors.text }]}>
                  {rsvpData.eventName}
                </Text>
                <View style={styles.infoRow}>
                  <Icon name="calendar" size={16} color={theme.colors.accent} />
                  <Text style={[styles.infoText, { color: theme.colors.textMuted }]}>
                    {rsvpData.eventDate}
                  </Text>
                </View>
                {rsvpData.eventLocation && (
                  <View style={styles.infoRow}>
                    <Icon name="map-marker" size={16} color={theme.colors.accent} />
                    <Text style={[styles.infoText, { color: theme.colors.textMuted }]}>
                      {rsvpData.eventLocation}
                    </Text>
                  </View>
                )}
                <View style={[styles.rsvpArea, { borderColor: theme.colors.border }]}>
                  <Icon name="email-check-outline" size={18} color={theme.colors.primary} />
                  <Text style={[styles.rsvpText, { color: theme.colors.primary }]}>
                    RSVP awaiting response
                  </Text>
                </View>
              </>
            ) : (
              <Text style={[styles.cardMessage, { color: theme.colors.textMuted }]}>
                {gift.personalMessage || 'Invitation details inside'}
              </Text>
            )}
          </View>
        );

      case 'gift_game':
        return (
          <View style={styles.cardInner}>
            <View style={styles.gameHeader}>
              <Icon name="gamepad-variant" size={28} color={theme.colors.accent} />
              <Text style={[styles.cardHeading, { color: theme.colors.text, marginLeft: spacing.xs }]}>
                Interactive Quiz
              </Text>
            </View>
            {quizData && (
              <Text style={[styles.cardMessage, { color: theme.colors.textMuted }]}>
                {quizData.questions.length} question{quizData.questions.length !== 1 ? 's' : ''} to explore
              </Text>
            )}
            <View style={[styles.gameBadge, { backgroundColor: forgeColors.forge[500] + '20' }]}>
              <Icon name="star-four-points" size={14} color={forgeColors.forge[500]} />
              <Text style={[styles.gameBadgeText, { color: forgeColors.forge[500] }]}>
                Interactive Quiz
              </Text>
            </View>
          </View>
        );
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Header */}
      <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="arrow-left" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Gift Preview</Text>
        <View style={{ width: 40 }} />
      </Animated.View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Gift Type Badge */}
        <Animated.View entering={FadeInUp.duration(400).delay(100)} style={styles.typeBadgeRow}>
          <View style={[styles.typeBadge, { backgroundColor: theme.colors.primary + '15' }]}>
            <Icon name={typeInfo.icon} size={18} color={theme.colors.primary} />
            <Text style={[styles.typeBadgeLabel, { color: theme.colors.primary }]}>
              {typeInfo.label}
            </Text>
          </View>
          <Text style={[styles.occasionText, { color: theme.colors.textMuted }]}>
            {occasionLabel}
          </Text>
        </Animated.View>

        {/* Main Gift Card */}
        <Animated.View
          entering={FadeInUp.duration(500).delay(200)}
          style={[
            styles.card,
            {
              backgroundColor: theme.colors.card,
              borderColor: theme.colors.border,
            },
          ]}
        >
          {renderCardContent()}
        </Animated.View>

        {/* Recipient & Sender */}
        <Animated.View entering={FadeInUp.duration(400).delay(300)} style={styles.peopleRow}>
          <View style={[styles.personCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
            <Icon name="account-arrow-right" size={20} color={theme.colors.accent} />
            <View style={styles.personInfo}>
              <Text style={[styles.personLabel, { color: theme.colors.textMuted }]}>To</Text>
              <Text style={[styles.personName, { color: theme.colors.text }]}>{gift.recipient.name}</Text>
            </View>
          </View>
          <View style={[styles.personCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
            <Icon name="account" size={20} color={theme.colors.primary} />
            <View style={styles.personInfo}>
              <Text style={[styles.personLabel, { color: theme.colors.textMuted }]}>From</Text>
              <Text style={[styles.personName, { color: theme.colors.text }]}>{gift.sender.name}</Text>
            </View>
          </View>
        </Animated.View>

        {/* Payment Status */}
        <Animated.View entering={FadeInUp.duration(400).delay(400)}>
          <View style={[styles.paymentBadge, { backgroundColor: payment.color + '15' }]}>
            <Icon name={payment.icon} size={18} color={payment.color} />
            <Text style={[styles.paymentText, { color: payment.color }]}>{payment.label}</Text>
          </View>
        </Animated.View>

        {/* Actions */}
        <Animated.View entering={FadeInUp.duration(400).delay(500)} style={styles.actions}>
          <TouchableOpacity
            onPress={handleShare}
            style={[styles.shareBtn, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
            activeOpacity={0.7}
          >
            <Icon name="share-variant" size={20} color={theme.colors.primary} />
            <Text style={[styles.shareBtnText, { color: theme.colors.primary }]}>Share Gift</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleViewAsRecipient}
            style={[styles.viewBtn, { backgroundColor: theme.colors.primary }]}
            activeOpacity={0.7}
          >
            <Icon name="eye-outline" size={20} color="#FFF" />
            <Text style={styles.viewBtnText}>View as Recipient</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.md,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  typeBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs + 2,
    borderRadius: 20,
    gap: spacing.xxs,
  },
  typeBadgeLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  occasionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  cardInner: {
    gap: spacing.sm,
  },
  cardHeading: {
    fontSize: 24,
    fontWeight: '800',
    lineHeight: 30,
  },
  cardMessage: {
    fontSize: 15,
    lineHeight: 22,
  },
  styleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: 12,
    gap: spacing.xxs,
    marginTop: spacing.xs,
  },
  styleBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  infoText: {
    fontSize: 14,
  },
  rsvpArea: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    borderTopWidth: 1,
    paddingTop: spacing.sm,
    marginTop: spacing.xs,
  },
  rsvpText: {
    fontSize: 14,
    fontWeight: '600',
  },
  gameHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gameBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: 12,
    gap: spacing.xxs,
    marginTop: spacing.xs,
  },
  gameBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  peopleRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  personCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    borderRadius: 14,
    borderWidth: 1,
    padding: spacing.sm,
  },
  personInfo: {
    flex: 1,
  },
  personLabel: {
    fontSize: 11,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  personName: {
    fontSize: 15,
    fontWeight: '700',
  },
  paymentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 20,
    gap: spacing.xs,
    marginBottom: spacing.lg,
  },
  paymentText: {
    fontSize: 14,
    fontWeight: '700',
  },
  actions: {
    gap: spacing.sm,
  },
  shareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.md,
    borderRadius: 16,
    borderWidth: 1,
  },
  shareBtnText: {
    fontSize: 16,
    fontWeight: '700',
  },
  viewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.md,
    borderRadius: 16,
  },
  viewBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },
});
