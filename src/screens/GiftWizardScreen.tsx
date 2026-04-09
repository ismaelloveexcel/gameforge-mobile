import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, ActivityIndicator, Dimensions,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useTheme } from '../contexts/ThemeContext';
import {
  RootStackParamList, GiftType, GiftOccasion, Tone, VisualStyle,
  GiftExperience, GIFT_TYPE_LABELS, OCCASION_LABELS, TONE_LABELS, VISUAL_STYLE_LABELS,
} from '../types';
import { generateGift, GenerateGiftRequest } from '../services/AIProxyService';
import { PRICING } from '../services/PaymentService';
import { useGiftStore } from '../stores/giftStore';

type Nav = StackNavigationProp<RootStackParamList>;
type Route = RouteProp<RootStackParamList, 'GiftWizard'>;
const { width } = Dimensions.get('window');

const STEPS = ['Gift Type', 'Occasion', 'Recipient', 'Tone & Style', 'Details', 'Confirm'];

export default function GiftWizardScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { theme } = useTheme();
  const addGift = useGiftStore((s) => s.addGift);

  const preselected = route.params?.giftType ?? null;
  const [step, setStep] = useState(preselected ? 1 : 0);
  const [giftType, setGiftType] = useState<GiftType | null>(preselected);
  const [occasion, setOccasion] = useState<GiftOccasion | null>(null);
  const [recipientName, setRecipientName] = useState('');
  const [senderName, setSenderName] = useState('');
  const [personalMessage, setPersonalMessage] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [tone, setTone] = useState<Tone | null>(null);
  const [visualStyle, setVisualStyle] = useState<VisualStyle | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canNext = (): boolean => {
    switch (step) {
      case 0: return !!giftType;
      case 1: return !!occasion;
      case 2: return !!recipientName.trim() && !!senderName.trim();
      case 3: return !!tone && !!visualStyle;
      case 4: return true;
      default: return true;
    }
  };

  const handleCreate = async () => {
    if (!giftType || !occasion || !tone || !visualStyle) return;
    setIsGenerating(true);
    setError(null);
    try {
      const req: GenerateGiftRequest = {
        giftType, occasion, tone, visualStyle, senderName, recipientName, personalMessage,
        eventDetails: giftType === 'invitation' ? { date: eventDate, location: eventLocation } : undefined,
      };
      const result = await generateGift(req);
      if (result.success && result.gift) {
        const gift: GiftExperience = {
          id: result.gift.id || `gift_${Date.now()}`,
          giftType, occasion,
          sender: { name: senderName },
          recipient: { name: recipientName },
          tone, visualStyle,
          contentBlocks: result.gift.contentBlocks || [],
          assets: result.gift.assets || [],
          paymentStatus: PRICING[giftType].isFree ? 'free' : 'pending',
          shareSlug: result.gift.shareSlug || `gift_${Date.now()}`,
          personalMessage,
          createdAt: new Date().toISOString(),
          metadata: result.gift.metadata || {},
        };
        await addGift(gift);
        navigation.navigate('GiftPreview', { giftId: gift.id });
      } else {
        setError(result.error || 'Generation failed');
      }
    } catch (e: any) {
      setError(e.message || 'Something went wrong');
    } finally {
      setIsGenerating(false);
    }
  };

  const renderGiftType = () => (
    <Animated.View entering={FadeInUp.duration(400)}>
      <Text style={[s.heading, { color: theme.colors.text }]}>What are you creating?</Text>
      {(Object.keys(GIFT_TYPE_LABELS) as GiftType[]).map((t) => {
        const info = GIFT_TYPE_LABELS[t];
        const selected = giftType === t;
        return (
          <TouchableOpacity
            key={t}
            style={[s.typeCard, { backgroundColor: theme.colors.card, borderColor: selected ? theme.colors.primary : theme.colors.border }]}
            onPress={() => setGiftType(t)}
          >
            <Icon name={info.icon} size={32} color={selected ? theme.colors.primary : theme.colors.textMuted} />
            <View style={{ flex: 1, marginLeft: 16 }}>
              <Text style={[s.typeLabel, { color: theme.colors.text }]}>{info.label}</Text>
              <Text style={[s.typeSub, { color: theme.colors.textMuted }]}>{info.description}</Text>
            </View>
            {selected && <Icon name="check-circle" size={24} color={theme.colors.primary} />}
          </TouchableOpacity>
        );
      })}
    </Animated.View>
  );

  const renderOccasion = () => (
    <Animated.View entering={FadeInUp.duration(400)}>
      <Text style={[s.heading, { color: theme.colors.text }]}>What's the occasion?</Text>
      <View style={s.pillGrid}>
        {(Object.keys(OCCASION_LABELS) as GiftOccasion[]).map((o) => {
          const selected = occasion === o;
          return (
            <TouchableOpacity
              key={o}
              style={[s.pill, { backgroundColor: selected ? theme.colors.primary : theme.colors.card, borderColor: selected ? theme.colors.primary : theme.colors.border }]}
              onPress={() => setOccasion(o)}
            >
              <Text style={[s.pillText, { color: selected ? '#fff' : theme.colors.text }]}>{OCCASION_LABELS[o]}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </Animated.View>
  );

  const renderRecipient = () => (
    <Animated.View entering={FadeInUp.duration(400)}>
      <Text style={[s.heading, { color: theme.colors.text }]}>Who is this for?</Text>
      <Text style={[s.label, { color: theme.colors.textMuted }]}>Recipient's Name</Text>
      <TextInput style={[s.input, { backgroundColor: theme.colors.card, color: theme.colors.text, borderColor: theme.colors.border }]}
        value={recipientName} onChangeText={setRecipientName} placeholder="Their name" placeholderTextColor={theme.colors.textMuted} />
      <Text style={[s.label, { color: theme.colors.textMuted }]}>Your Name</Text>
      <TextInput style={[s.input, { backgroundColor: theme.colors.card, color: theme.colors.text, borderColor: theme.colors.border }]}
        value={senderName} onChangeText={setSenderName} placeholder="Your name" placeholderTextColor={theme.colors.textMuted} />
      <Text style={[s.label, { color: theme.colors.textMuted }]}>Personal Message</Text>
      <TextInput style={[s.input, s.multiline, { backgroundColor: theme.colors.card, color: theme.colors.text, borderColor: theme.colors.border }]}
        value={personalMessage} onChangeText={setPersonalMessage} placeholder="Write something special..." placeholderTextColor={theme.colors.textMuted} multiline numberOfLines={4} />
      {giftType === 'invitation' && (
        <>
          <Text style={[s.label, { color: theme.colors.textMuted }]}>Event Date</Text>
          <TextInput style={[s.input, { backgroundColor: theme.colors.card, color: theme.colors.text, borderColor: theme.colors.border }]}
            value={eventDate} onChangeText={setEventDate} placeholder="e.g. April 20, 2026" placeholderTextColor={theme.colors.textMuted} />
          <Text style={[s.label, { color: theme.colors.textMuted }]}>Location</Text>
          <TextInput style={[s.input, { backgroundColor: theme.colors.card, color: theme.colors.text, borderColor: theme.colors.border }]}
            value={eventLocation} onChangeText={setEventLocation} placeholder="Where is it?" placeholderTextColor={theme.colors.textMuted} />
        </>
      )}
    </Animated.View>
  );

  const renderToneStyle = () => (
    <Animated.View entering={FadeInUp.duration(400)}>
      <Text style={[s.heading, { color: theme.colors.text }]}>Set the mood</Text>
      <Text style={[s.subheading, { color: theme.colors.textMuted }]}>Tone</Text>
      <View style={s.pillGrid}>
        {(Object.keys(TONE_LABELS) as Tone[]).map((t) => {
          const selected = tone === t;
          return (
            <TouchableOpacity key={t}
              style={[s.pill, { backgroundColor: selected ? theme.colors.primary : theme.colors.card, borderColor: selected ? theme.colors.primary : theme.colors.border }]}
              onPress={() => setTone(t)}
            >
              <Text style={[s.pillText, { color: selected ? '#fff' : theme.colors.text }]}>{TONE_LABELS[t]}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <Text style={[s.subheading, { color: theme.colors.textMuted, marginTop: 24 }]}>Visual Style</Text>
      {(Object.keys(VISUAL_STYLE_LABELS) as VisualStyle[]).map((v) => {
        const selected = visualStyle === v;
        return (
          <TouchableOpacity key={v}
            style={[s.styleCard, { backgroundColor: theme.colors.card, borderColor: selected ? theme.colors.primary : theme.colors.border }]}
            onPress={() => setVisualStyle(v)}
          >
            <Text style={[s.styleLabel, { color: selected ? theme.colors.primary : theme.colors.text }]}>{VISUAL_STYLE_LABELS[v]}</Text>
            {selected && <Icon name="check-circle" size={20} color={theme.colors.primary} />}
          </TouchableOpacity>
        );
      })}
    </Animated.View>
  );

  const renderContent = () => (
    <Animated.View entering={FadeInUp.duration(400)}>
      <Text style={[s.heading, { color: theme.colors.text }]}>Almost there!</Text>
      {giftType === 'gift_game' && (
        <View style={[s.infoCard, { backgroundColor: theme.colors.card }]}>
          <Icon name="gamepad-variant" size={40} color={theme.colors.primary} />
          <Text style={[s.infoText, { color: theme.colors.text }]}>
            We'll generate an interactive quiz game for {recipientName || 'your recipient'}!
          </Text>
        </View>
      )}
      {giftType === 'birthday_card' && (
        <View>
          <Text style={[s.label, { color: theme.colors.textMuted }]}>Extra message (optional)</Text>
          <TextInput style={[s.input, s.multiline, { backgroundColor: theme.colors.card, color: theme.colors.text, borderColor: theme.colors.border }]}
            value={personalMessage} onChangeText={setPersonalMessage}
            placeholder="Add more to your card..." placeholderTextColor={theme.colors.textMuted} multiline numberOfLines={4} />
        </View>
      )}
      {giftType === 'invitation' && (
        <View style={[s.infoCard, { backgroundColor: theme.colors.card }]}>
          <Icon name="email-heart-outline" size={40} color={theme.colors.primary} />
          <Text style={[s.infoText, { color: theme.colors.text }]}>
            Your invitation will include RSVP tracking so you know who's coming!
          </Text>
        </View>
      )}
    </Animated.View>
  );

  const renderConfirmation = () => {
    const price = giftType ? PRICING[giftType] : null;
    return (
      <Animated.View entering={FadeInUp.duration(400)}>
        <Text style={[s.heading, { color: theme.colors.text }]}>Review your gift</Text>
        <View style={[s.summaryCard, { backgroundColor: theme.colors.card }]}>
          <Row label="Type" value={giftType ? GIFT_TYPE_LABELS[giftType].label : ''} color={theme.colors.text} />
          <Row label="Occasion" value={occasion ? OCCASION_LABELS[occasion] : ''} color={theme.colors.text} />
          <Row label="To" value={recipientName} color={theme.colors.text} />
          <Row label="From" value={senderName} color={theme.colors.text} />
          <Row label="Tone" value={tone ? TONE_LABELS[tone] : ''} color={theme.colors.text} />
          <Row label="Style" value={visualStyle ? VISUAL_STYLE_LABELS[visualStyle] : ''} color={theme.colors.text} />
          {giftType === 'invitation' && eventDate ? <Row label="Date" value={eventDate} color={theme.colors.text} /> : null}
          <View style={s.divider} />
          <Row label="Price" value={price?.label ?? 'Free'} color={theme.colors.primary} bold />
        </View>
        {error && <Text style={s.error}>{error}</Text>}
        <TouchableOpacity
          style={[s.createBtn, { backgroundColor: theme.colors.primary }]}
          onPress={handleCreate}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={s.createBtnText}>Create Gift \u2728</Text>
          )}
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderStep = () => {
    switch (step) {
      case 0: return renderGiftType();
      case 1: return renderOccasion();
      case 2: return renderRecipient();
      case 3: return renderToneStyle();
      case 4: return renderContent();
      case 5: return renderConfirmation();
    }
  };

  return (
    <View style={[s.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={s.header}>
        {step > 0 ? (
          <TouchableOpacity onPress={() => setStep(step - 1)} style={s.headerBtn}>
            <Icon name="arrow-left" size={24} color={theme.colors.text} />
          </TouchableOpacity>
        ) : <View style={s.headerBtn} />}
        <Text style={[s.headerTitle, { color: theme.colors.text }]}>{STEPS[step]}</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.headerBtn}>
          <Icon name="close" size={24} color={theme.colors.textMuted} />
        </TouchableOpacity>
      </View>

      {/* Progress */}
      <View style={[s.progressBg, { backgroundColor: theme.colors.border }]}>
        <View style={[s.progressFill, { width: `${((step + 1) / STEPS.length) * 100}%`, backgroundColor: theme.colors.primary }]} />
      </View>

      <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        {renderStep()}
      </ScrollView>

      {/* Footer */}
      {step < 5 && (
        <View style={[s.footer, { borderTopColor: theme.colors.border }]}>
          <TouchableOpacity
            style={[s.nextBtn, { backgroundColor: canNext() ? theme.colors.primary : theme.colors.border }]}
            onPress={() => canNext() && setStep(step + 1)}
            disabled={!canNext()}
          >
            <Text style={[s.nextBtnText, { color: canNext() ? '#fff' : theme.colors.textMuted }]}>Next</Text>
            <Icon name="arrow-right" size={20} color={canNext() ? '#fff' : theme.colors.textMuted} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

function Row({ label, value, color, bold }: { label: string; value: string; color: string; bold?: boolean }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 }}>
      <Text style={{ color: color + '99', fontSize: 14 }}>{label}</Text>
      <Text style={{ color, fontSize: 14, fontWeight: bold ? '700' : '500' }}>{value}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 56, paddingBottom: 12 },
  headerBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '600' },
  progressBg: { height: 4, marginHorizontal: 16, borderRadius: 2 },
  progressFill: { height: 4, borderRadius: 2 },
  scroll: { padding: 24, paddingBottom: 120 },
  heading: { fontSize: 26, fontWeight: '700', marginBottom: 20 },
  subheading: { fontSize: 15, fontWeight: '600', marginBottom: 12 },
  typeCard: { flexDirection: 'row', alignItems: 'center', padding: 20, borderRadius: 16, borderWidth: 2, marginBottom: 12 },
  typeLabel: { fontSize: 17, fontWeight: '600' },
  typeSub: { fontSize: 13, marginTop: 2 },
  pillGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  pill: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, borderWidth: 1 },
  pillText: { fontSize: 14, fontWeight: '500' },
  label: { fontSize: 13, fontWeight: '600', marginBottom: 6, marginTop: 16 },
  input: { borderWidth: 1, borderRadius: 12, padding: 14, fontSize: 16 },
  multiline: { minHeight: 100, textAlignVertical: 'top' },
  styleCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderRadius: 12, borderWidth: 2, marginBottom: 10 },
  styleLabel: { fontSize: 15, fontWeight: '500' },
  infoCard: { alignItems: 'center', padding: 32, borderRadius: 20, gap: 16 },
  infoText: { fontSize: 16, textAlign: 'center', lineHeight: 24 },
  summaryCard: { padding: 20, borderRadius: 16 },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 8 },
  error: { color: '#EF4444', textAlign: 'center', marginTop: 12, fontSize: 14 },
  createBtn: { marginTop: 24, padding: 18, borderRadius: 16, alignItems: 'center' },
  createBtnText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  footer: { padding: 16, paddingBottom: 32, borderTopWidth: 1 },
  nextBtn: { padding: 16, borderRadius: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  nextBtnText: { fontSize: 16, fontWeight: '600' },
});
