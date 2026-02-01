/**
 * BrandingStudioScreen - Customize game branding and themes
 * Allows users to personalize the visual identity of their gift games
 */
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../contexts/ThemeContext';
import { RootStackParamList } from '../types';
import { spacing, radii, typography } from '../design-tokens/theme';
import { StyleCarousel, StyleOption } from '../components/StyleCarousel';
import { EmojiPicker } from '../components/EmojiPicker';
import { ForgeButton } from '../components';

type NavigationProp = StackNavigationProp<RootStackParamList>;

interface BrandingConfig {
  gameName: string;
  tagline: string;
  colorScheme: StyleOption;
  logoEmoji: string;
  accentColor: string;
  fontStyle: 'modern' | 'classic' | 'playful' | 'elegant';
}

const STYLE_OPTIONS: StyleOption[] = [
  {
    id: 'vibrant',
    name: 'Vibrant',
    description: 'Bold and energetic colors that pop!',
    colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A'],
    icon: 'palette',
    tags: ['energetic', 'fun', 'bold'],
  },
  {
    id: 'pastel',
    name: 'Pastel Dreams',
    description: 'Soft and soothing pastel tones',
    colors: ['#FFB3BA', '#BAFFC9', '#BAE1FF', '#FFFFBA'],
    icon: 'cloud',
    tags: ['soft', 'gentle', 'calm'],
  },
  {
    id: 'neon',
    name: 'Neon Nights',
    description: 'Electric neon glow effects',
    colors: ['#FF00FF', '#00FFFF', '#FFFF00', '#FF10F0'],
    icon: 'lightning-bolt',
    tags: ['electric', 'modern', 'vibrant'],
  },
  {
    id: 'earth',
    name: 'Earth Tones',
    description: 'Natural and grounding colors',
    colors: ['#8B4513', '#D2691E', '#CD853F', '#DEB887'],
    icon: 'leaf',
    tags: ['natural', 'warm', 'organic'],
  },
  {
    id: 'ocean',
    name: 'Ocean Blues',
    description: 'Deep sea inspired palette',
    colors: ['#006994', '#4A90A4', '#87CEEB', '#B0E0E6'],
    icon: 'waves',
    tags: ['calm', 'serene', 'cool'],
  },
  {
    id: 'sunset',
    name: 'Sunset Glow',
    description: 'Warm sunset gradients',
    colors: ['#FF4E50', '#FC913A', '#F9D423', '#EDE574'],
    icon: 'weather-sunset',
    tags: ['warm', 'romantic', 'dreamy'],
  },
];

const FONT_STYLES = [
  { id: 'modern', name: 'Modern', icon: 'format-font' },
  { id: 'classic', name: 'Classic', icon: 'format-letter-case' },
  { id: 'playful', name: 'Playful', icon: 'emoticon-happy-outline' },
  { id: 'elegant', name: 'Elegant', icon: 'crown' },
];

export default function BrandingStudioScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { theme } = useTheme();

  const [branding, setBranding] = useState<BrandingConfig>({
    gameName: '',
    tagline: '',
    colorScheme: STYLE_OPTIONS[0],
    logoEmoji: '🎮',
    accentColor: '#FF6B6B',
    fontStyle: 'modern',
  });

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleStyleSelect = useCallback((style: StyleOption) => {
    setBranding(prev => ({
      ...prev,
      colorScheme: style,
      accentColor: style.colors[0],
    }));
  }, []);

  const handleEmojiSelect = useCallback((emoji: string) => {
    setBranding(prev => ({ ...prev, logoEmoji: emoji }));
    setShowEmojiPicker(false);
  }, []);

  const handleSave = useCallback(() => {
    if (!branding.gameName.trim()) {
      Alert.alert('Missing Name', 'Please enter a game name');
      return;
    }

    // In production, this would save to storage/API
    Alert.alert(
      'Branding Saved! 🎨',
      `Your branding for "${branding.gameName}" has been saved successfully!`,
      [
        {
          text: 'Create Game',
          onPress: () => navigation.navigate('GiftCreationScreen' as any),
        },
        {
          text: 'OK',
          style: 'cancel',
        },
      ]
    );
  }, [branding, navigation]);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <Animated.View
        entering={FadeIn}
        style={[styles.header, { backgroundColor: theme.colors.surface }]}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          Branding Studio
        </Text>
        <TouchableOpacity onPress={handleSave}>
          <Icon name="check" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
      </Animated.View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Preview Card */}
        <Animated.View entering={FadeInDown.delay(100)} style={styles.previewSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Preview
          </Text>
          <LinearGradient
            colors={branding.colorScheme.colors.slice(0, 2)}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.previewCard}
          >
            <Text style={styles.previewEmoji}>{branding.logoEmoji}</Text>
            <Text style={styles.previewName}>
              {branding.gameName || 'Your Game'}
            </Text>
            <Text style={styles.previewTagline}>
              {branding.tagline || 'Your tagline here'}
            </Text>
          </LinearGradient>
        </Animated.View>

        {/* Game Name */}
        <Animated.View entering={FadeInDown.delay(200)} style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Game Name
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.colors.surface,
                color: theme.colors.text,
                borderColor: theme.colors.border,
              },
            ]}
            placeholder="Enter your game name"
            placeholderTextColor={theme.colors.textSecondary}
            value={branding.gameName}
            onChangeText={text => setBranding(prev => ({ ...prev, gameName: text }))}
          />
        </Animated.View>

        {/* Tagline */}
        <Animated.View entering={FadeInDown.delay(300)} style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Tagline
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.colors.surface,
                color: theme.colors.text,
                borderColor: theme.colors.border,
              },
            ]}
            placeholder="A catchy tagline..."
            placeholderTextColor={theme.colors.textSecondary}
            value={branding.tagline}
            onChangeText={text => setBranding(prev => ({ ...prev, tagline: text }))}
          />
        </Animated.View>

        {/* Logo Emoji */}
        <Animated.View entering={FadeInDown.delay(400)} style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Logo Icon
          </Text>
          <TouchableOpacity
            style={[
              styles.emojiButton,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
              },
            ]}
            onPress={() => setShowEmojiPicker(!showEmojiPicker)}
          >
            <Text style={styles.selectedEmoji}>{branding.logoEmoji}</Text>
            <Text style={[styles.emojiLabel, { color: theme.colors.textSecondary }]}>
              Tap to change
            </Text>
          </TouchableOpacity>

          {showEmojiPicker && (
            <View style={styles.emojiPickerContainer}>
              <EmojiPicker
                onEmojiSelect={handleEmojiSelect}
                selectedEmoji={branding.logoEmoji}
                categories={['smileys', 'animals', 'food', 'activities', 'objects', 'symbols']}
                showSearch={false}
              />
            </View>
          )}
        </Animated.View>

        {/* Color Scheme */}
        <Animated.View entering={FadeInDown.delay(500)} style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Color Scheme
          </Text>
          <StyleCarousel
            styles={STYLE_OPTIONS}
            selectedStyleId={branding.colorScheme.id}
            onStyleSelect={handleStyleSelect}
            showDetails={true}
            showTags={true}
            cardWidth={280}
            cardHeight={350}
          />
        </Animated.View>

        {/* Font Style */}
        <Animated.View entering={FadeInDown.delay(600)} style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Font Style
          </Text>
          <View style={styles.fontGrid}>
            {FONT_STYLES.map(font => (
              <TouchableOpacity
                key={font.id}
                style={[
                  styles.fontOption,
                  {
                    backgroundColor: theme.colors.surface,
                    borderColor:
                      branding.fontStyle === font.id
                        ? theme.colors.primary
                        : theme.colors.border,
                    borderWidth: branding.fontStyle === font.id ? 3 : 1,
                  },
                ]}
                onPress={() =>
                  setBranding(prev => ({ ...prev, fontStyle: font.id as any }))
                }
              >
                <Icon
                  name={font.icon}
                  size={32}
                  color={
                    branding.fontStyle === font.id
                      ? theme.colors.primary
                      : theme.colors.textSecondary
                  }
                />
                <Text
                  style={[
                    styles.fontLabel,
                    {
                      color:
                        branding.fontStyle === font.id
                          ? theme.colors.primary
                          : theme.colors.text,
                    },
                  ]}
                >
                  {font.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Save Button */}
        <Animated.View entering={FadeInDown.delay(700)} style={styles.saveSection}>
          <ForgeButton
            title="Save Branding"
            onPress={handleSave}
            variant="primary"
            size="large"
            fullWidth
            icon="check-circle"
          />
        </Animated.View>
      </ScrollView>
    </View>
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
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    paddingTop: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  headerTitle: {
    fontSize: typography.size.xl,
    fontFamily: typography.fontFamily.bold,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xl * 2,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.size.lg,
    fontFamily: typography.fontFamily.bold,
    fontWeight: 'bold',
    marginBottom: spacing.md,
  },
  previewSection: {
    marginBottom: spacing.xl,
  },
  previewCard: {
    borderRadius: radii.xl,
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  previewEmoji: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  previewName: {
    fontSize: typography.size.xxl,
    fontFamily: typography.fontFamily.bold,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  previewTagline: {
    fontSize: typography.size.md,
    fontFamily: typography.fontFamily.regular,
    color: '#fff',
    opacity: 0.9,
    textAlign: 'center',
  },
  input: {
    borderRadius: radii.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: typography.size.md,
    fontFamily: typography.fontFamily.regular,
    borderWidth: 1,
  },
  emojiButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radii.lg,
    borderWidth: 1,
  },
  selectedEmoji: {
    fontSize: 48,
    marginRight: spacing.md,
  },
  emojiLabel: {
    fontSize: typography.size.sm,
    fontFamily: typography.fontFamily.regular,
  },
  emojiPickerContainer: {
    marginTop: spacing.md,
    height: 400,
    borderRadius: radii.lg,
    overflow: 'hidden',
  },
  fontGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  fontOption: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radii.lg,
  },
  fontLabel: {
    marginTop: spacing.xs,
    fontSize: typography.size.sm,
    fontFamily: typography.fontFamily.medium,
  },
  saveSection: {
    marginTop: spacing.xl,
  },
});
