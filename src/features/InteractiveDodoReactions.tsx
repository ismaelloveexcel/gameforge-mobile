/**
 * Interactive Dodo Reactions
 * 
 * WOW FACTOR: Dodo watches and reacts to gameplay in real-time
 * Uses YOUR existing DodoCompanion mood system
 * 
 * Makes games feel alive and responsive
 */

import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import DodoCompanion, { DodoMood } from '../components/DodoCompanion';

export type GameEvent = 
  | 'game_start'
  | 'item_collected'
  | 'obstacle_hit'
  | 'level_complete'
  | 'question_correct'
  | 'question_wrong'
  | 'game_complete'
  | 'achievement_unlocked';

interface DodoReaction {
  mood: DodoMood;
  message: string;
  duration: number;
}

interface InteractiveDodoReactionsProps {
  onGameEvent: (event: GameEvent) => void;
  recipientName: string;
  senderName: string;
}

export default function InteractiveDodoReactions({
  onGameEvent,
  recipientName,
  senderName,
}: InteractiveDodoReactionsProps) {
  const [currentReaction, setCurrentReaction] = useState<DodoReaction>({
    mood: 'idle',
    message: `${senderName} made this for you!`,
    duration: 0,
  });

  const REACTIONS: Record<GameEvent, DodoReaction[]> = {
    game_start: [
      { mood: 'waving', message: `Welcome ${recipientName}! Let's play!`, duration: 3000 },
      { mood: 'excited', message: `This is going to be fun!`, duration: 3000 },
    ],
    
    item_collected: [
      { mood: 'happy', message: 'Nice catch! ⭐', duration: 2000 },
      { mood: 'excited', message: 'You got it! ✨', duration: 2000 },
      { mood: 'happy', message: 'Keep going!', duration: 2000 },
    ],
    
    obstacle_hit: [
      { mood: 'curious', message: 'Oops! Try again!', duration: 2000 },
      { mood: 'thinking', message: 'So close!', duration: 2000 },
    ],
    
    level_complete: [
      { mood: 'celebrating', message: 'AMAZING! Level cleared! 🎉', duration: 3000 },
      { mood: 'excited', message: `${recipientName} is crushing it!`, duration: 3000 },
    ],
    
    question_correct: [
      { mood: 'celebrating', message: 'Brilliant! 🌟', duration: 2000 },
      { mood: 'excited', message: 'You're so smart!', duration: 2000 },
    ],
    
    question_wrong: [
      { mood: 'thinking', message: 'Hmm, try another!', duration: 2000 },
      { mood: 'curious', message: 'Give it another shot!', duration: 2000 },
    ],
    
    game_complete: [
      { mood: 'celebrating', message: `${recipientName} finished! 🎊`, duration: 5000 },
      { mood: 'celebrating', message: `${senderName} is so proud!`, duration: 5000 },
    ],
    
    achievement_unlocked: [
      { mood: 'celebrating', message: 'Achievement unlocked! 🏆', duration: 3000 },
      { mood: 'excited', message: 'You're unstoppable!', duration: 3000 },
    ],
  };

  const reactToEvent = useCallback((event: GameEvent) => {
    const possibleReactions = REACTIONS[event];
    if (possibleReactions && possibleReactions.length > 0) {
      const reaction = possibleReactions[Math.floor(Math.random() * possibleReactions.length)];
      
      setCurrentReaction(reaction);

      // Return to idle after reaction duration
      setTimeout(() => {
        setCurrentReaction({
          mood: 'idle',
          message: '*happy dodo noises* 🦤',
          duration: 0,
        });
      }, reaction.duration);
    }
  }, [REACTIONS]);

  // Expose reaction function
  useEffect(() => {
    // Create global event handler
    const handleGameEvent = (event: CustomEvent<GameEvent>) => {
      reactToEvent(event.detail);
    };

    // Listen for game events
    if (typeof window !== 'undefined') {
      window.addEventListener('game_event' as any, handleGameEvent as any);
      
      return () => {
        window.removeEventListener('game_event' as any, handleGameEvent as any);
      };
    }
  }, [reactToEvent]);

  return (
    <View style={styles.container}>
      <DodoCompanion
        mood={currentReaction.mood}
        size="small"
        message={currentReaction.message}
        floating={true}
        position="right"
        showBubble={true}
      />
    </View>
  );
}

/**
 * Helper function to emit game events
 */
export function emitGameEvent(event: GameEvent) {
  if (typeof window !== 'undefined') {
    const customEvent = new CustomEvent('game_event', { detail: event });
    window.dispatchEvent(customEvent);
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 100,
    right: 16,
    zIndex: 1000,
  },
});
