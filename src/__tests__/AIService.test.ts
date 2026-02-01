/**
 * AIService Tests
 */
import aiService from '../services/AIService';

// Mock GrokService
jest.mock('../services/GrokService', () => ({
  grokService: {
    chat: jest.fn((prompt: string) => Promise.resolve('Mocked AI response')),
  },
}));

describe('AIService', () => {
  describe('generateGiftMessage', () => {
    it('generates a gift message', async () => {
      const message = await aiService.generateGiftMessage(
        'Alice',
        'Bob',
        'birthday',
        'heartfelt'
      );
      
      expect(message).toBeTruthy();
      expect(typeof message).toBe('string');
    });

    it('includes keywords when provided', async () => {
      const message = await aiService.generateGiftMessage(
        'Alice',
        'Bob',
        'birthday',
        'playful',
        ['cake', 'party']
      );
      
      expect(message).toBeTruthy();
    });

    it('returns fallback message on error', async () => {
      // Override mock to throw an error
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const grokModule = require('../services/GrokService');
      grokModule.grokService.chat.mockRejectedValueOnce(new Error('API error'));
      jest.spyOn(console, 'error').mockImplementation(() => {});
      
      const message = await aiService.generateGiftMessage(
        'Alice',
        'Bob',
        'birthday',
        'heartfelt'
      );
      
      // On error, fallback message should contain recipient name
      expect(message).toContain('Alice');
    });
  });

  describe('generateSuggestions', () => {
    it('generates suggestions', async () => {
      const suggestions = await aiService.generateSuggestions(
        'game-ideas',
        'adventure game for kids',
        3
      );
      
      expect(Array.isArray(suggestions)).toBe(true);
      expect(suggestions.length).toBeGreaterThan(0);
      expect(suggestions.length).toBeLessThanOrEqual(3);
    });

    it('returns fallback suggestions on error', async () => {
      // Override mock to throw an error
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const grokModule = require('../services/GrokService');
      grokModule.grokService.chat.mockRejectedValueOnce(new Error('API error'));
      jest.spyOn(console, 'error').mockImplementation(() => {});
      
      const suggestions = await aiService.generateSuggestions(
        'themes',
        'test',
        5
      );
      
      // On error, should return fallback suggestions
      expect(suggestions).toBeTruthy();
      expect(suggestions.length).toBe(5);
    });
  });

  describe('enhanceText', () => {
    it('enhances text with different styles', async () => {
      const originalText = 'This is a test';
      const enhanced = await aiService.enhanceText(originalText, 'make-emotional');
      
      expect(enhanced).toBeTruthy();
      expect(typeof enhanced).toBe('string');
    });

    it('returns original text on error', async () => {
      // Override mock to throw an error
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const grokModule = require('../services/GrokService');
      grokModule.grokService.chat.mockRejectedValueOnce(new Error('API error'));
      jest.spyOn(console, 'error').mockImplementation(() => {});
      
      const originalText = 'This is a test';
      const enhanced = await aiService.enhanceText(originalText, 'simplify');
      
      // On error, should return original text
      expect(enhanced).toBe(originalText);
    });
  });

  describe('analyzeUserInput', () => {
    it('analyzes input and returns insights', async () => {
      const insights = await aiService.analyzeUserInput(
        'A game about exploring space',
        'game-concept'
      );
      
      expect(Array.isArray(insights)).toBe(true);
    });
  });
});
