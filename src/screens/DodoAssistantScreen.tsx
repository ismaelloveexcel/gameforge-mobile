/**
 * DodoAssistantScreen - Chat with your friendly Dodo companion! 🦤
 * No "AI" vibes - this is your magical helper bird
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
import { useDodo, DodoSpecialty } from '../contexts/DodoContext';
import { LivingGradient, DodoCompanion, ForgeCard } from '../components';
import { spacing, typography, radii, forgeColors } from '../design-tokens/theme';

const specialties: {
  type: DodoSpecialty;
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

export default function DodoAssistantScreen() {
  const { theme, isDark } = useTheme();
  const { specialty, setSpecialty, messages, sendMessage, isThinking, mood, getSpecialtyConfig } = useDodo();
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

        {/* Dodo Header */}
        <Animated.View entering={FadeIn.duration(500)}>
          <ForgeCard 
            variant="default" 
            glowColor={currentSpecialty?.color}
            style={styles.dodoHeader}
          >
            <DodoCompanion
              mood={isThinking ? 'thinking' : mood === 'excited' ? 'excited' : 'idle'}
              size="small"
              showBubble={false}
            />
            <View style={styles.dodoInfo}>
              <Text style={[styles.dodoTitle, { color: currentSpecialty?.color }]}>
                {currentSpecialty?.name}
              </Text>
              <Text style={[styles.dodoDesc, { color: theme.colors.textMuted }]}>
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
              <DodoCompanion
                mood="waving"
                size="large"
                message={specialtyConfig.greeting}
                showBubble
              />
              
              {/* Quick suggestions */}
              <Text style={[styles.suggestionsTitle, { color: theme.colors.textMuted }]}>
                Try asking about...
              </Text>
              <View style={styles.quickSuggestions}>
                {quickSuggestions.map((suggestion, index) => (
                  <Animated.View 
                    key={suggestion}
                    entering={FadeInUp.duration(400).delay(300 + index * 80)}
                  >
                    <TouchableOpacity
                      style={[styles.suggestionChip, { backgroundColor: theme.colors.card }]}
                      onPress={() => setInputText(suggestion)}
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
            messages.map((message, _index) => (
              <Animated.View
                key={message.id}
                entering={SlideInRight.duration(300).delay(50)}
                style={[
                  styles.messageBubble,
                  {
                    backgroundColor:
                      message.role === 'user' 
                        ? currentSpecialty?.color 
                        : theme.colors.card,
                    alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start',
                    maxWidth: '85%',
                  },
                ]}
              >
                {message.role === 'dodo' && (
                  <View style={styles.dodoAvatar}>
                    <Text style={styles.dodoAvatarEmoji}>🦤</Text>
                  </View>
                )}
                <Text
                  style={[
                    styles.messageText,
                    {
                      color: message.role === 'user' ? '#fff' : theme.colors.text,
                    },
                  ]}
                >
                  {message.content}
                </Text>
                
                {/* Code snippet */}
                {message.codeSnippet && (
                  <View style={[styles.codeContainer, { backgroundColor: isDark ? '#000' : '#f5f5f5' }]}>
                    <Text style={[styles.codeText, { color: theme.colors.text }]}>
                      {message.codeSnippet}
                    </Text>
                  </View>
                )}
                
                {/* Suggestions */}
                {message.suggestions && message.suggestions.length > 0 && (
                  <View style={styles.messageSuggestions}>
                    {message.suggestions.map((suggestion, idx) => (
                      <TouchableOpacity
                        key={idx}
                        style={[styles.messageSuggestionChip, { borderColor: currentSpecialty?.color }]}
                        onPress={() => setInputText(suggestion)}
                      >
                        <Text style={[styles.messageSuggestionText, { color: currentSpecialty?.color }]}>
                          {suggestion}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </Animated.View>
            ))
          )}
          
          {/* Thinking indicator */}
          {isThinking && (
            <Animated.View 
              entering={FadeIn.duration(200)}
              style={[styles.messageBubble, { backgroundColor: theme.colors.card, alignSelf: 'flex-start' }]}
            >
              <View style={styles.dodoAvatar}>
                <Text style={styles.dodoAvatarEmoji}>🦤</Text>
              </View>
              <Text style={[styles.thinkingText, { color: theme.colors.textMuted }]}>
                *ruffles feathers thoughtfully*
              </Text>
            </Animated.View>
          )}
        </ScrollView>

        {/* Input Area */}
        <Animated.View style={[styles.inputArea, inputContainerStyle]}>
          <ForgeCard 
            variant="default" 
            glowColor={currentSpecialty?.color}
            style={styles.inputCard}
            padded={false}
          >
            <TextInput
              style={[styles.textInput, { color: theme.colors.text }]}
              placeholder="Ask Dodo anything..."
              placeholderTextColor={theme.colors.textSubtle}
              value={inputText}
              onChangeText={setInputText}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              onSubmitEditing={handleSend}
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                { 
                  backgroundColor: inputText.trim() ? currentSpecialty?.color : theme.colors.card,
                },
              ]}
              onPress={handleSend}
              disabled={!inputText.trim() || isThinking}
            >
              <Icon 
                name={isThinking ? 'dots-horizontal' : 'send'} 
                size={20} 
                color={inputText.trim() ? '#fff' : theme.colors.textMuted} 
              />
            </TouchableOpacity>
          </ForgeCard>
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
    maxHeight: 60,
    marginTop: 50,
  },
  specialtySelectorContent: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    gap: spacing.xs,
  },
  specialtyChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radii.full,
    marginRight: spacing.xs,
  },
  specialtyName: {
    marginLeft: spacing.xs,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
  },
  dodoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.md,
    marginTop: spacing.sm,
  },
  dodoInfo: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  dodoTitle: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.bold,
  },
  dodoDesc: {
    fontSize: typography.size.sm,
  },
  thinkingIndicator: {
    marginLeft: spacing.sm,
  },
  thinkingEmoji: {
    fontSize: 24,
  },
  messagesContainer: {
    flex: 1,
    marginTop: spacing.sm,
  },
  messagesContent: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: spacing.xl,
  },
  suggestionsTitle: {
    fontSize: typography.size.sm,
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
  },
  quickSuggestions: {
    width: '100%',
    gap: spacing.xs,
  },
  suggestionChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.lg,
  },
  suggestionText: {
    fontSize: typography.size.sm,
    textAlign: 'center',
  },
  messageBubble: {
    padding: spacing.md,
    borderRadius: radii.xl,
    marginBottom: spacing.sm,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dodoAvatar: {
    marginRight: spacing.xs,
  },
  dodoAvatarEmoji: {
    fontSize: 20,
  },
  messageText: {
    fontSize: typography.size.base,
    lineHeight: typography.size.base * typography.lineHeight.relaxed,
    flex: 1,
  },
  thinkingText: {
    fontSize: typography.size.sm,
    fontStyle: 'italic',
  },
  codeContainer: {
    width: '100%',
    marginTop: spacing.sm,
    padding: spacing.sm,
    borderRadius: radii.md,
  },
  codeText: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: typography.size.sm,
  },
  messageSuggestions: {
    width: '100%',
    marginTop: spacing.sm,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  messageSuggestionChip: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: radii.full,
    borderWidth: 1,
  },
  messageSuggestionText: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.medium,
  },
  inputArea: {
    paddingHorizontal: spacing.md,
    paddingBottom: Platform.OS === 'ios' ? spacing.lg : spacing.md,
  },
  inputCard: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  textInput: {
    flex: 1,
    fontSize: typography.size.base,
    maxHeight: 100,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
