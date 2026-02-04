/**
 * AlchemistContext - Your magical companion's brain! 🧪
 * Manages The Alchemist's personality, conversations, and mood
 * Note: No "AI" terminology - this is magic, not machines!
 */
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { genieService } from '../services/GenieService';

// The Alchemist has different "specialties" (not "AI modes")
export type AlchemistSpecialty = 'creative' | 'technical' | 'marketing' | 'educator';

// The Alchemist's moods affect how it responds
export type AlchemistMood = 'idle' | 'thinking' | 'excited' | 'celebrating' | 'curious';

// Messages in conversations
export interface AlchemistMessage {
  id: string;
  role: 'user' | 'alchemist';
  content: string;
  timestamp: Date;
  specialty: AlchemistSpecialty;
  suggestions?: string[];
  codeSnippet?: string;
}

// Specialty configurations - personality-driven, not robot-like
export const ALCHEMIST_SPECIALTIES = {
  creative: {
    name: 'Creative Spark',
    icon: 'palette',
    color: '#EC4899',
    description: 'Game ideas, stories & visuals',
    greeting: "Let's dream up something wonderful! What kind of game feels exciting to you? ✨",
    personality: [
      "Ooh, that's giving me ideas!",
      "What if we added a twist?",
      "I love where this is going!",
    ],
  },
  technical: {
    name: 'Code Wizard',
    icon: 'wand-magic-sparkles',
    color: '#6366F1',
    description: 'Logic, mechanics & puzzles',
    greeting: "Ready to build something clever! What mechanics are you thinking about? 🔮",
    personality: [
      "Here's the clever bit...",
      "Let me show you a neat trick!",
      "This is where the magic happens!",
    ],
  },
  marketing: {
    name: 'Hype Bird',
    icon: 'megaphone',
    color: '#F59E0B',
    description: 'Promotion & sharing',
    greeting: "Let's make your game famous! Who do you want to reach? 📣",
    personality: [
      "People are gonna love this!",
      "Here's how we get noticed...",
      "Trust me, this works!",
    ],
  },
  educator: {
    name: 'Wise Owl Mode',
    icon: 'book-open',
    color: '#10B981',
    description: 'Learning & teaching',
    greeting: "Learning is an adventure! What do you want to explore? 📚",
    personality: [
      "Here's a fun way to think about it...",
      "Let me break that down!",
      "Great question! So basically...",
    ],
  },
};

interface AlchemistContextValue {
  specialty: AlchemistSpecialty;
  setSpecialty: (specialty: AlchemistSpecialty) => void;
  mood: AlchemistMood;
  messages: AlchemistMessage[];
  sendMessage: (content: string, context?: any) => Promise<void>;
  clearMessages: () => void;
  isThinking: boolean;
  getSpecialtyConfig: () => typeof ALCHEMIST_SPECIALTIES.creative;
}

const AlchemistContext = createContext<AlchemistContextValue | undefined>(undefined);

export const AlchemistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [specialty, setSpecialty] = useState<AlchemistSpecialty>('creative');
  const [mood, setMood] = useState<AlchemistMood>('idle');
  const [messages, setMessages] = useState<AlchemistMessage[]>([]);
  const [isThinking, setIsThinking] = useState(false);

  const getSpecialtyConfig = useCallback(() => {
    return ALCHEMIST_SPECIALTIES[specialty];
  }, [specialty]);

  const sendMessage = useCallback(async (content: string, context?: any) => {
    setIsThinking(true);
    setMood('thinking');

    // Add user message
    const userMessage: AlchemistMessage = {
      id: Date.now().toString(),
      specialty,
      role: 'user',
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    try {
      // Get response (using existing service under the hood)
      const response = await genieService.processMessage(content, specialty, context);

      // Transform response to be more Alchemist-like
      const config = ALCHEMIST_SPECIALTIES[specialty];
      const personalityTouch = config.personality[Math.floor(Math.random() * config.personality.length)];
      
      // Make the response feel more personal
      let alchemistContent = response.content;
      
      // Add The Alchemist's personality touch occasionally
      if (Math.random() > 0.5 && !alchemistContent.includes('!')) {
        alchemistContent = `${personalityTouch}\n\n${alchemistContent}`;
      }

      // Add Alchemist message
      const alchemistMessage: AlchemistMessage = {
        id: (Date.now() + 1).toString(),
        specialty,
        role: 'alchemist',
        content: alchemistContent,
        timestamp: new Date(),
        suggestions: response.suggestions,
        codeSnippet: response.codeSnippet,
      };
      setMessages((prev) => [...prev, alchemistMessage]);
      setMood('excited');
      
      // Return to idle after a moment
      setTimeout(() => setMood('idle'), 2000);
      
    } catch (error) {
      console.error('The Alchemist got confused:', error);
      const errorMessage: AlchemistMessage = {
        id: (Date.now() + 1).toString(),
        specialty,
        role: 'alchemist',
        content: "Whoops! I got a bit tangled up there. 🧪💫 Can you try asking again? Sometimes I need a second to gather my ingredients!",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      setMood('idle');
    } finally {
      setIsThinking(false);
    }
  }, [specialty]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setMood('idle');
  }, []);

  return (
    <AlchemistContext.Provider
      value={{
        specialty,
        setSpecialty,
        mood,
        messages,
        sendMessage,
        clearMessages,
        isThinking,
        getSpecialtyConfig,
      }}
    >
      {children}
    </AlchemistContext.Provider>
  );
};

export const useAlchemist = () => {
  const context = useContext(AlchemistContext);
  if (context === undefined) {
    throw new Error('useAlchemist must be used within an AlchemistProvider');
  }
  return context;
};

// Keep old export for backwards compatibility during migration
export const useGenie = useAlchemist;
export const GenieProvider = AlchemistProvider;
