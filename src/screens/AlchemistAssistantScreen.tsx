/**
 * AlchemistAssistantScreen - Chat with The Alchemist! 🧪
 * No "AI" vibes - this is your magical helper
 */
import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Animated, { 
  FadeIn, 
  FadeInUp, 
  FadeInDown,
  SlideInRight,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../contexts/ThemeContext';
import { useAlchemist, AlchemistSpecialty } from '../contexts/AlchemistContext';
import { LivingGradient, AlchemistCompanion, ForgeCard } from '../components';
import { spacing, typography, radii, forgeColors } from '../design-tokens/theme';

const specialties: {
  type: AlchemistSpecialty;
  name: string;
  icon: string;
  color: string;
  description: string;
}[] = [
  {
    type: 'creative',
    name: 'Creative Spark',
    icon: 'palette',
    color: forgeColors.spark[500],
    description: 'Ideas & storytelling',
  },
  {
    type: 'technical',
    name: 'Code Wizard',
    icon: 'auto-fix',
    color: forgeColors.forge[500],
    description: 'Logic & mechanics',
  },
  {
    type: 'marketing',
    name: 'Hype Bird',
    icon: 'bullhorn',
    color: forgeColors.gold[500],
    description: 'Promotion tips',
  },
  {
    type: 'educator',
    name: 'Wise Owl',
    icon: 'school',
    color: forgeColors.moss[500],
    description: 'Learning help',
  },
];

export default function AlchemistAssistantScreen() {
  const { theme, isDark } = useTheme();
  const { specialty, setSpecialty, messages, sendMessage, isThinking, mood, getSpecialtyConfig } = useAlchemist();
  const [inputText, setInputText] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);
  
  const inputScale = useSharedValue(1);
  const currentSpecialty = specialties.find((s) => s.type === specialty);
  const specialtyConfig = getSpecialtyConfig();

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const handleSend = useCallback(async () => {
    if (inputText.trim() && !isThinking) {
      const text = inputText.trim();
      setInputText('');
      await sendMessage(text);
    }
  }, [inputText, isThinking, sendMessage]);

  const handleInputFocus = useCallback(() => {
    inputScale.value = withSpring(1.02);
  }, [inputScale]);

  const handleInputBlur = useCallback(() => {
    inputScale.value = withSpring(1);
  }, [inputScale]);

  const inputContainerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: inputScale.value }],
  }));

  // Quick suggestion chips
  const quickSuggestions = [
    "Help me design a puzzle game",
    "I need a birthday gift idea",
    "How do I add animations?",
    "Make my game more fun",
  ];

  return (
    <LivingGradient intensity="subtle">
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={100}
      >
        {/* Specialty Selector */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.specialtySelector}
          contentContainerStyle={styles.specialtySelectorContent}
        >
          {specialties.map((s, index) => (
            <Animated.View 
              key={s.type}
              entering={FadeInDown.duration(400).delay(index * 50)}
            >
              <TouchableOpacity
                style={[
                  styles.specialtyChip,
                  {
                    backgroundColor: specialty === s.type ? s.color + '20' : theme.colors.card,
                    borderColor: specialty === s.type ? s.color : 'transparent',
                    borderWidth: 2,
                  },
                ]}
                onPress={() => setSpecialty(s.type)}
                activeOpacity={0.7}
              >
                <Icon
                  name={s.icon}
                  size={20}
                  color={specialty === s.type ? s.color : theme.colors.textMuted}
                />
                <Text
                  style={[
                    styles.specialtyName,
                    {
                      color: specialty === s.type ? s.color : theme.colors.text,
                    },
                  ]}
                >
                  {s.name}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </ScrollView>

        {/* Alchemist Header */}
        <Animated.View entering={FadeIn.duration(500)}>
          <ForgeCard 
            variant="default" 
            glowColor={currentSpecialty?.color}
            style={styles.alchemistHeader}
          >
            <AlchemistCompanion
              mood={isThinking ? 'thinking' : mood === 'excited' ? 'excited' : 'idle'}
              size="small"
              showBubble={false}
            />
            <View style={styles.alchemistInfo}>
              <Text style={[styles.alchemistTitle, { color: currentSpecialty?.color }]}>
                {currentSpecialty?.name}
              </Text>
              <Text style={[styles.alchemistDesc, { color: theme.colors.textMuted }]}>
                {currentSpecialty?.description}
              </Text>
            </View>
            {isThinking && (
              <View style={styles.thinkingIndicator}>
                <Text style={styles.thinkingEmoji}>💭</Text>
              </View>
            )}
          </ForgeCard>
        </Animated.View>

        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.length === 0 ? (
            <Animated.View entering={FadeInUp.duration(600)} style={styles.emptyState}>
              <AlchemistCompanion
                mood="waving"
                size="large"
              />
              <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
                {specialtyConfig.greeting}
              </Text>
              <Text style={[styles.emptySubtitle, { color: theme.colors.textMuted }]}>
                Pick a specialty or ask The Alchemist anything.
              </Text>
              <View style={styles.quickSuggestions}>
                {quickSuggestions.map((suggestion, index) => (
                  <Animated.View
                    key={suggestion}
                    entering={FadeInUp.duration(400).delay(200 + index * 80)}
                  >
                    <TouchableOpacity
                      style={[
                        styles.suggestionChip,
                        { borderColor: currentSpecialty?.color + '80' }
                      ]}
                      onPress={() => sendMessage(suggestion)}
                    >
                      <Text style={[styles.suggestionText, { color: theme.colors.text }]}>
                        {suggestion}
                      </Text>
                    </TouchableOpacity>
                  </Animated.View>
                ))}
              </View>
            </Animated.View>
          ) : (
            messages.map((message, index) => {
              const isUser = message.role === 'user';
              return (
                <Animated.View
                  key={message.id}
                  entering={isUser ? FadeInUp.duration(300) : SlideInRight.duration(300)}
                  style={[
                    styles.messageBubble,
                    isUser ? styles.userBubble : styles.alchemistBubble,
                    {
                      backgroundColor: isUser
                        ? theme.colors.primary + '20'
                        : isDark
                        ? theme.colors.card
                        : '#fff',
                      borderColor: isUser
                        ? theme.colors.primary
                        : currentSpecialty?.color + '60',
                    },
                  ]}
                >
                  <Text style={[
                    styles.messageText,
                    { color: theme.colors.text }
                  ]}>
                    {message.content}
                  </Text>
                </Animated.View>
              );
            })
          )}
        </ScrollView>

        {/* Input */}
        <Animated.View style={[styles.inputContainer, inputContainerStyle]}>
          <TextInput
            value={inputText}
            onChangeText={setInputText}
            placeholder="Ask The Alchemist..."
            placeholderTextColor={theme.colors.textMuted}
            style={[
              styles.input,
              { 
                color: theme.colors.text,
                backgroundColor: isDark ? theme.colors.card : '#fff',
                borderColor: currentSpecialty?.color + '50',
              },
            ]}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            multiline
          />
          <TouchableOpacity
            onPress={handleSend}
            disabled={!inputText.trim() || isThinking}
            style={[
              styles.sendButton,
              { 
                backgroundColor: currentSpecialty?.color,
                opacity: inputText.trim() ? 1 : 0.5,
              },
            ]}
          >
            <Icon name="send" size={18} color="#fff" />
          </TouchableOpacity>
        </Animated.View>
      </KeyboardAvoidingView>
    </LivingGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  specialtySelector: {
    paddingVertical: spacing.sm,
  },
  specialtySelectorContent: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  specialtyChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: 999,
  },
  specialtyName: {
    fontSize: 12,
    fontWeight: '600',
  },
  alchemistHeader: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  alchemistInfo: {
    flex: 1,
  },
  alchemistTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  alchemistDesc: {
    fontSize: 12,
    marginTop: 2,
  },
  thinkingIndicator: {
    marginLeft: spacing.sm,
  },
  thinkingEmoji: {
    fontSize: 18,
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
  messagesContent: {
    paddingBottom: spacing.lg,
  },
  messageBubble: {
    padding: spacing.sm,
    borderRadius: radii.lg,
    marginBottom: spacing.sm,
    borderWidth: 1,
  },
  userBubble: {
    alignSelf: 'flex-end',
    maxWidth: '80%',
  },
  alchemistBubble: {
    alignSelf: 'flex-start',
    maxWidth: '85%',
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  emptySubtitle: {
    fontSize: 13,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  quickSuggestions: {
    marginTop: spacing.md,
    gap: spacing.xs,
  },
  suggestionChip: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 999,
    borderWidth: 1,
  },
  suggestionText: {
    fontSize: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    borderRadius: radii.lg,
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    fontSize: 14,
    maxHeight: 120,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
