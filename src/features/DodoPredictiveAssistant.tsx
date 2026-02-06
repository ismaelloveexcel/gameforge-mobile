/**
 * Dodo Predictive Assistant
 * 
 * WOW FACTOR: Dodo predicts what you need before you ask!
 * Context-aware suggestions based on date, time, user behavior
 * 
 * Makes app feel intelligent and helpful
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';
import DodoCompanion from '../components/DodoCompanion';
import { useTheme } from '../contexts/ThemeContext';
import { spacing, radii, typography } from '../design-tokens/theme';

export interface PredictiveSuggestion {
  id: string;
  message: string;
  quickAction?: {
    label: string;
    occasion: string;
    recipientPlaceholder: string;
  };
  urgency: 'low' | 'medium' | 'high';
  dismissible: boolean;
}

interface DodoPredictiveAssistantProps {
  onQuickAction?: (occasion: string) => void;
}

export default function DodoPredictiveAssistant({
  onQuickAction
}: DodoPredictiveAssistantProps) {
  const { theme, seasonalTheme } = useTheme();
  const [suggestion, setSuggestion] = useState<PredictiveSuggestion | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Check for contextual suggestions on mount and every hour
    checkPredictiveSuggestions();
    
    const interval = setInterval(checkPredictiveSuggestions, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const checkPredictiveSuggestions = () => {
    const now = new Date();
    const suggestion = getContextualSuggestion(now);
    
    if (suggestion) {
      setSuggestion(suggestion);
      setVisible(true);
    }
  };

  const handleQuickAction = () => {
    if (suggestion?.quickAction && onQuickAction) {
      onQuickAction(suggestion.quickAction.occasion);
      setVisible(false);
    }
  };

  const handleDismiss = () => {
    setVisible(false);
    // Remember dismissal to avoid showing again today
    const dismissKey = `dismissed_${suggestion?.id}_${new Date().toDateString()}`;
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(dismissKey, 'true');
    }
  };

  if (!visible || !suggestion) return null;

  const urgencyColors = {
    low: theme.colors.notification,
    medium: '#F59E0B',
    high: '#EF4444',
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleDismiss}
    >
      <View style={styles.modalOverlay}>
        <Animated.View 
          entering={SlideInDown.springify()}
          style={[styles.suggestionCard, { backgroundColor: theme.colors.card }]}
        >
          {/* Urgency indicator */}
          <View 
            style={[
              styles.urgencyBadge, 
              { backgroundColor: urgencyColors[suggestion.urgency] }
            ]}
          />

          {/* Dodo */}
          <DodoCompanion
            mood="excited"
            size="medium"
            showBubble={false}
          />

          {/* Message */}
          <Text style={[styles.suggestionMessage, { color: theme.colors.text }]}>
            {suggestion.message}
          </Text>

          {/* Quick action button */}
          {suggestion.quickAction && (
            <TouchableOpacity
              style={[styles.quickActionButton, { backgroundColor: theme.colors.primary }]}
              onPress={handleQuickAction}
            >
              <Text style={[styles.quickActionText, { color: '#fff' }]}>
                {suggestion.quickAction.label}
              </Text>
            </TouchableOpacity>
          )}

          {/* Dismiss */}
          {suggestion.dismissible && (
            <TouchableOpacity onPress={handleDismiss} style={styles.dismissButton}>
              <Text style={[styles.dismissText, { color: theme.colors.notification }]}>
                Not now
              </Text>
            </TouchableOpacity>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
}

/**
 * Get contextual suggestion based on current context
 */
function getContextualSuggestion(now: Date): PredictiveSuggestion | null {
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const dayAfterTomorrow = new Date(now);
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);

  // Check if already dismissed today
  const checkDismissed = (id: string): boolean => {
    if (typeof localStorage === 'undefined') return false;
    const dismissKey = `dismissed_${id}_${now.toDateString()}`;
    return localStorage.getItem(dismissKey) === 'true';
  };

  // Valentine's Day proximity check
  if (isDate(tomorrow, 2, 14)) {
    const suggestionId = 'valentine-tomorrow';
    if (checkDismissed(suggestionId)) return null;
    
    return {
      id: suggestionId,
      message: "🚨 Valentine's Day is TOMORROW! Need a last-minute gift that'll make them cry happy tears?",
      quickAction: {
        label: 'Yes, save me! 💝',
        occasion: 'valentines',
        recipientPlaceholder: 'Your love'
      },
      urgency: 'high',
      dismissible: true,
    };
  }

  if (isDateInRange(now, 2, 10, 2, 13)) {
    const suggestionId = 'valentine-week';
    if (checkDismissed(suggestionId)) return null;
    
    return {
      id: suggestionId,
      message: `Valentine's Day in ${daysUntil(new Date('2026-02-14'))} days! Create something special now ❤️`,
      quickAction: {
        label: 'Create Love Game 💕',
        occasion: 'valentines',
        recipientPlaceholder: 'Their name'
      },
      urgency: 'medium',
      dismissible: true,
    };
  }

  // Ramadan proximity (evening/post-iftar)
  if (isRamadan(now) && now.getHours() >= 19) {
    const suggestionId = `ramadan-evening-${now.toDateString()}`;
    if (checkDismissed(suggestionId)) return null;
    
    return {
      id: suggestionId,
      message: "Perfect time after iftar! 🌙 Want to create an Eid gift for family?",
      quickAction: {
        label: 'Create Eid Gift ✨',
        occasion: 'eid',
        recipientPlaceholder: 'Family member'
      },
      urgency: 'low',
      dismissible: true,
    };
  }

  // Weekend suggestion
  if ([0, 5, 6].includes(now.getDay()) && now.getHours() >= 10 && now.getHours() <= 14) {
    const suggestionId = `weekend-${now.toDateString()}`;
    if (checkDismissed(suggestionId)) return null;
    
    return {
      id: suggestionId,
      message: "It's the weekend! Perfect time to create a 'just because' gift for someone special 🎁",
      quickAction: {
        label: 'Make Someone Smile 😊',
        occasion: 'just_because',
        recipientPlaceholder: 'Someone special'
      },
      urgency: 'low',
      dismissible: true,
    };
  }

  return null;
}

// Helper functions
function isDate(date: Date, month: number, day: number): boolean {
  return date.getMonth() + 1 === month && date.getDate() === day;
}

function isDateInRange(date: Date, startMonth: number, startDay: number, endMonth: number, endDay: number): boolean {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  if (startMonth === endMonth) {
    return month === startMonth && day >= startDay && day <= endDay;
  }
  
  return (month === startMonth && day >= startDay) || 
         (month === endMonth && day <= endDay);
}

function isRamadan(date: Date): boolean {
  // Ramadan 2026: Feb 28 - Mar 29
  return isDateInRange(date, 2, 28, 3, 29);
}

function daysUntil(targetDate: Date): number {
  const now = new Date();
  const diff = targetDate.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    paddingBottom: 100,
  },
  suggestionCard: {
    margin: spacing.lg,
    padding: spacing.xl,
    borderRadius: radii.xl,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  urgencyBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  suggestionMessage: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    textAlign: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.lg,
    lineHeight: typography.size.lg * 1.4,
  },
  quickActionButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: radii.lg,
    marginBottom: spacing.sm,
    minWidth: 200,
  },
  quickActionText: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.bold,
    textAlign: 'center',
  },
  dismissButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  dismissText: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
  },
});
