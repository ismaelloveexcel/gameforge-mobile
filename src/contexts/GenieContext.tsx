import React, { createContext, useContext, useState, ReactNode } from 'react';
import { GeniePersonality, GenieMessage, GenieContext as GenieContextType } from '../types';
import { genieService } from '../services/GenieService';

interface GenieContextValue {
  personality: GeniePersonality;
  setPersonality: (personality: GeniePersonality) => void;
  messages: GenieMessage[];
  sendMessage: (content: string, context?: GenieContextType) => Promise<void>;
  clearMessages: () => void;
  isProcessing: boolean;
}

const GenieContext = createContext<GenieContextValue | undefined>(undefined);

export const GenieProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [personality, setPersonality] = useState<GeniePersonality>('creative');
  const [messages, setMessages] = useState<GenieMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const sendMessage = async (content: string, context?: GenieContextType) => {
    setIsProcessing(true);

    // Add user message
    const userMessage: GenieMessage = {
      id: Date.now().toString(),
      personality,
      role: 'user',
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    try {
      // Get AI response
      const response = await genieService.processMessage(content, personality, context);

      // Add assistant message
      const assistantMessage: GenieMessage = {
        id: (Date.now() + 1).toString(),
        personality,
        role: 'assistant',
        content: response.content,
        timestamp: new Date(),
        suggestions: response.suggestions,
        codeSnippet: response.codeSnippet,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error processing message:', error);
      const errorMessage: GenieMessage = {
        id: (Date.now() + 1).toString(),
        personality,
        role: 'assistant',
        content: 'I apologize, but I encountered an error processing your request. Please try again.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return (
    <GenieContext.Provider
      value={{
        personality,
        setPersonality,
        messages,
        sendMessage,
        clearMessages,
        isProcessing,
      }}
    >
      {children}
    </GenieContext.Provider>
  );
};

export const useGenie = () => {
  const context = useContext(GenieContext);
  if (context === undefined) {
    throw new Error('useGenie must be used within a GenieProvider');
  }
  return context;
};
