/**
 * AIService - Unified AI integration service
 * Provides AI-powered content generation, personalization, and assistance
 * Supports multiple AI providers: OpenAI (ChatGPT) and Grok (x.ai)
 */

import { grokService } from './GrokService';
import { openAIService } from './OpenAIService';

export type AIProvider = 'grok' | 'openai' | 'auto';

export interface AIGenerationOptions {
  temperature?: number;
  maxTokens?: number;
  context?: string;
  style?: 'creative' | 'professional' | 'casual' | 'technical';
  provider?: AIProvider;
}

export interface PersonalizedContent {
  title: string;
  description: string;
  content: string;
  suggestions?: string[];
  metadata?: Record<string, any>;
}

export interface AIInsight {
  type: 'tip' | 'suggestion' | 'warning' | 'improvement';
  message: string;
  relevance: number;
  actionable: boolean;
}

class AIService {
  private preferredProvider: AIProvider = 'auto';

  /**
   * Set the preferred AI provider
   */
  setProvider(provider: AIProvider): void {
    this.preferredProvider = provider;
  }

  /**
   * Get the current active provider based on configuration
   */
  getActiveProvider(): 'grok' | 'openai' | 'fallback' {
    if (this.preferredProvider === 'openai' && openAIService.isConfigured()) {
      return 'openai';
    }
    if (this.preferredProvider === 'grok') {
      return 'grok';
    }
    // Auto mode: prefer OpenAI if configured, fallback to Grok
    if (this.preferredProvider === 'auto') {
      if (openAIService.isConfigured()) {
        return 'openai';
      }
      return 'grok';
    }
    return 'fallback';
  }

  /**
   * Internal method to call the appropriate AI provider
   */
  private async callAI(prompt: string, options?: AIGenerationOptions): Promise<string> {
    const provider = options?.provider || this.preferredProvider;
    
    // Try OpenAI first if preferred or auto with OpenAI configured
    if (provider === 'openai' || (provider === 'auto' && openAIService.isConfigured())) {
      try {
        return await openAIService.chat(prompt, {
          temperature: options?.temperature,
          maxTokens: options?.maxTokens,
        });
      } catch (error) {
        console.warn('OpenAI failed, falling back to Grok:', error);
        // Fall through to Grok
      }
    }

    // Try Grok
    try {
      return await grokService.chat(prompt);
    } catch (error) {
      console.warn('Grok failed:', error);
      throw new Error('All AI providers failed');
    }
  }

  /**
   * Generate personalized game content based on user input
   */
  async generateGameContent(
    gameType: string,
    personalization: {
      recipientName: string;
      occasion: string;
      interests: string[];
      tone: string;
    },
    options?: AIGenerationOptions
  ): Promise<PersonalizedContent> {
    try {
      const prompt = this.buildGameContentPrompt(gameType, personalization);
      const response = await this.callAI(prompt, options);

      return this.parseGameContent(response);
    } catch (error) {
      console.error('Error generating game content:', error);
      throw new Error('Failed to generate game content');
    }
  }

  /**
   * Generate creative gift message
   */
  async generateGiftMessage(
    recipientName: string,
    senderName: string,
    occasion: string,
    tone: string,
    keywords?: string[]
  ): Promise<string> {
    try {
      const prompt = `Write a ${tone} gift message for ${recipientName} from ${senderName} for ${occasion}.${
        keywords ? ` Include references to: ${keywords.join(', ')}.` : ''
      } Keep it heartfelt, personal, and under 150 words.`;

      const response = await this.callAI(prompt);
      return response.trim();
    } catch (error) {
      console.error('Error generating gift message:', error);
      return this.getFallbackMessage(recipientName, senderName, occasion);
    }
  }

  /**
   * Generate game narrative/story
   */
  async generateStory(
    setting: string,
    characters: string[],
    plotPoints: string[],
    tone: string = 'adventure'
  ): Promise<{
    introduction: string;
    chapters: Array<{
      title: string;
      content: string;
      choices?: string[];
    }>;
    conclusion: string;
  }> {
    try {
      const prompt = `Create an interactive ${tone} story set in ${setting} with characters: ${characters.join(
        ', '
      )}. Include these plot points: ${plotPoints.join(
        ', '
      )}. Format as: Introduction, 3 chapters with choices, and a conclusion.`;

      const response = await this.callAI(prompt);
      return this.parseStory(response);
    } catch (error) {
      console.error('Error generating story:', error);
      throw new Error('Failed to generate story');
    }
  }

  /**
   * Generate creative suggestions
   */
  async generateSuggestions(
    category: 'game-ideas' | 'improvements' | 'features' | 'themes',
    context: string,
    count: number = 5
  ): Promise<string[]> {
    try {
      const prompt = `Generate ${count} creative ${category} suggestions for: ${context}. List them as numbered items.`;
      const response = await this.callAI(prompt);
      
      return this.parseSuggestions(response, count);
    } catch (error) {
      console.error('Error generating suggestions:', error);
      return this.getFallbackSuggestions(category, count);
    }
  }

  /**
   * Analyze user input and provide insights
   */
  async analyzeUserInput(
    input: string,
    type: 'game-concept' | 'gift-idea' | 'story-outline'
  ): Promise<AIInsight[]> {
    try {
      const prompt = `Analyze this ${type}: "${input}". Provide 3-5 constructive insights including tips, suggestions, and potential improvements. Format as bullet points.`;
      
      const response = await this.callAI(prompt);
      return this.parseInsights(response);
    } catch (error) {
      console.error('Error analyzing input:', error);
      return [];
    }
  }

  /**
   * Generate game dialogue
   */
  async generateDialogue(
    character: string,
    situation: string,
    mood: string,
    previousContext?: string
  ): Promise<string> {
    try {
      const contextStr = previousContext ? `Previous context: ${previousContext}. ` : '';
      const prompt = `${contextStr}Generate dialogue for ${character} who is ${mood} in this situation: ${situation}. Make it natural and character-appropriate.`;

      const response = await this.callAI(prompt);
      return response.trim();
    } catch (error) {
      console.error('Error generating dialogue:', error);
      return `[${character}]: ...`;
    }
  }

  /**
   * Enhance text with AI
   */
  async enhanceText(
    text: string,
    enhancement: 'make-emotional' | 'make-professional' | 'make-funny' | 'simplify'
  ): Promise<string> {
    try {
      const prompts = {
        'make-emotional': `Make this text more emotional and heartfelt: "${text}"`,
        'make-professional': `Make this text more professional: "${text}"`,
        'make-funny': `Add humor to this text while keeping its meaning: "${text}"`,
        'simplify': `Simplify this text for better clarity: "${text}"`,
      };

      const response = await this.callAI(prompts[enhancement]);
      return response.trim();
    } catch (error) {
      console.error('Error enhancing text:', error);
      return text;
    }
  }

  /**
   * Generate quiz questions
   */
  async generateQuizQuestions(
    topic: string,
    difficulty: 'easy' | 'medium' | 'hard',
    count: number = 5
  ): Promise<Array<{
    question: string;
    options: string[];
    correctAnswer: number;
    explanation?: string;
  }>> {
    try {
      const prompt = `Create ${count} ${difficulty} quiz questions about ${topic}. For each question, provide 4 options and indicate the correct answer. Format clearly.`;
      
      const response = await this.callAI(prompt);
      return this.parseQuizQuestions(response);
    } catch (error) {
      console.error('Error generating quiz questions:', error);
      return [];
    }
  }

  // Helper Methods

  private buildGameContentPrompt(
    gameType: string,
    personalization: any
  ): string {
    return `Create personalized ${gameType} game content for ${personalization.recipientName}. 
    Occasion: ${personalization.occasion}
    Interests: ${personalization.interests.join(', ')}
    Tone: ${personalization.tone}
    
    Include: game title, description, objectives, and key gameplay elements.`;
  }

  private parseGameContent(response: string): PersonalizedContent {
    // Simple parsing - in production, this would be more sophisticated
    const lines = response.split('\n').filter(l => l.trim());
    
    return {
      title: lines[0]?.replace(/^(Title:|Game:)\s*/i, '').trim() || 'Untitled Game',
      description: lines[1]?.trim() || 'A personalized game experience.',
      content: response,
      suggestions: [],
      metadata: {},
    };
  }

  private parseStory(response: string): any {
    // Basic story parsing
    const sections = response.split(/\n\n+/);
    
    return {
      introduction: sections[0] || '',
      chapters: sections.slice(1, -1).map((section, i) => ({
        title: `Chapter ${i + 1}`,
        content: section,
        choices: [],
      })),
      conclusion: sections[sections.length - 1] || '',
    };
  }

  private parseSuggestions(response: string, count: number): string[] {
    const lines = response
      .split('\n')
      .filter(l => l.trim())
      .map(l => l.replace(/^\d+\.\s*/, '').replace(/^[-*]\s*/, '').trim())
      .filter(l => l.length > 0);
    
    return lines.slice(0, count);
  }

  private parseInsights(response: string): AIInsight[] {
    const lines = response
      .split('\n')
      .filter(l => l.trim() && (l.includes('•') || l.includes('-') || l.match(/^\d+\./)))
      .map(l => l.replace(/^[-*•]\s*/, '').replace(/^\d+\.\s*/, '').trim());

    return lines.map(message => ({
      type: this.classifyInsight(message),
      message,
      relevance: 0.8,
      actionable: message.toLowerCase().includes('consider') || message.toLowerCase().includes('try'),
    }));
  }

  private classifyInsight(message: string): AIInsight['type'] {
    const lower = message.toLowerCase();
    if (lower.includes('tip') || lower.includes('helpful')) return 'tip';
    if (lower.includes('suggest') || lower.includes('recommend')) return 'suggestion';
    if (lower.includes('warning') || lower.includes('careful')) return 'warning';
    return 'improvement';
  }

  private parseQuizQuestions(response: string): any[] {
    // Basic quiz parsing - would be more sophisticated in production
    return [];
  }

  private getFallbackMessage(recipientName: string, senderName: string, occasion: string): string {
    const messages: Record<string, string> = {
      birthday: `Happy Birthday ${recipientName}! 🎉 Wishing you a day filled with joy, laughter, and wonderful memories. From ${senderName} with love! ❤️`,
      anniversary: `Happy Anniversary ${recipientName}! 💕 Celebrating another year of wonderful moments together. Love, ${senderName}`,
      valentines: `Happy Valentine's Day ${recipientName}! 💘 You make every day brighter. With all my love, ${senderName}`,
      christmas: `Merry Christmas ${recipientName}! 🎄 Wishing you joy, peace, and happiness this holiday season. From ${senderName}`,
      default: `Dear ${recipientName}, thinking of you and sending warm wishes your way! With love, ${senderName} 💝`,
    };

    return messages[occasion.toLowerCase()] || messages.default;
  }

  private getFallbackSuggestions(category: string, count: number): string[] {
    const fallbacks: Record<string, string[]> = {
      'game-ideas': [
        'Adventure Quest Game',
        'Puzzle Challenge',
        'Memory Match Game',
        'Story Adventure',
        'Trivia Challenge',
      ],
      'improvements': [
        'Add more visual effects',
        'Include background music',
        'Add achievement system',
        'Improve user interface',
        'Add social sharing',
      ],
      'features': [
        'Leaderboard system',
        'Daily challenges',
        'Reward system',
        'Multiplayer mode',
        'Custom themes',
      ],
      'themes': [
        'Space Adventure',
        'Underwater World',
        'Fantasy Kingdom',
        'City Life',
        'Nature Explorer',
      ],
    };

    return (fallbacks[category] || fallbacks['game-ideas']).slice(0, count);
  }
}

// Export singleton instance
export const aiService = new AIService();
export default aiService;
