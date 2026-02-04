/**
 * OpenAIService - ChatGPT API integration service
 * Provides OpenAI/ChatGPT-powered content generation and AI assistance
 */

export interface OpenAIChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface OpenAIChatOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
}

export interface OpenAIChatResponse {
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

class OpenAIService {
  private apiKey: string;
  private baseUrl: string = 'https://api.openai.com/v1/chat/completions';
  private defaultModel: string = 'gpt-4o-mini';

  constructor() {
    // API key loaded from environment
    this.apiKey = process.env.OPENAI_API_KEY || '';
  }

  /**
   * Set API key for OpenAI service
   */
  setApiKey(key: string): void {
    this.apiKey = key;
  }

  /**
   * Check if OpenAI API is configured
   */
  isConfigured(): boolean {
    return Boolean(this.apiKey);
  }

  /**
   * Set the default model
   */
  setModel(model: string): void {
    this.defaultModel = model;
  }

  /**
   * Generic chat completion method
   */
  async chat(
    prompt: string,
    options?: OpenAIChatOptions
  ): Promise<string> {
    if (!this.apiKey) {
      console.log('No OpenAI API key configured, using fallback response');
      return 'AI response generated locally (OpenAI not configured)';
    }

    try {
      const messages: OpenAIChatMessage[] = [];
      
      // Add system prompt if provided
      if (options?.systemPrompt) {
        messages.push({
          role: 'system',
          content: options.systemPrompt,
        });
      } else {
        messages.push({
          role: 'system',
          content: 'You are a helpful and creative AI assistant for a game development platform.',
        });
      }

      // Add user message
      messages.push({
        role: 'user',
        content: prompt,
      });

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: options?.model || this.defaultModel,
          messages,
          temperature: options?.temperature ?? 0.7,
          max_tokens: options?.maxTokens ?? 1000,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('OpenAI API error:', errorText);
        throw new Error(`OpenAI API request failed: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;

      if (!content) {
        throw new Error('No content in OpenAI response');
      }

      return content;
    } catch (error) {
      console.error('OpenAI chat error:', error);
      throw error;
    }
  }

  /**
   * Chat completion with full response including usage stats
   */
  async chatWithDetails(
    prompt: string,
    options?: OpenAIChatOptions
  ): Promise<OpenAIChatResponse> {
    if (!this.apiKey) {
      return {
        content: 'AI response generated locally (OpenAI not configured)',
      };
    }

    try {
      const messages: OpenAIChatMessage[] = [];
      
      if (options?.systemPrompt) {
        messages.push({
          role: 'system',
          content: options.systemPrompt,
        });
      } else {
        messages.push({
          role: 'system',
          content: 'You are a helpful and creative AI assistant for a game development platform.',
        });
      }

      messages.push({
        role: 'user',
        content: prompt,
      });

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: options?.model || this.defaultModel,
          messages,
          temperature: options?.temperature ?? 0.7,
          max_tokens: options?.maxTokens ?? 1000,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('OpenAI API error:', errorText);
        throw new Error(`OpenAI API request failed: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;

      return {
        content: content || '',
        usage: data.usage ? {
          promptTokens: data.usage.prompt_tokens,
          completionTokens: data.usage.completion_tokens,
          totalTokens: data.usage.total_tokens,
        } : undefined,
      };
    } catch (error) {
      console.error('OpenAI chat error:', error);
      throw error;
    }
  }

  /**
   * Generate creative content (stories, dialogues, descriptions)
   */
  async generateCreativeContent(
    contentType: 'story' | 'dialogue' | 'description' | 'game-concept',
    context: string,
    options?: OpenAIChatOptions
  ): Promise<string> {
    const systemPrompts = {
      story: 'You are a creative storyteller who crafts engaging, personalized narratives. Write vivid, emotionally resonant stories.',
      dialogue: 'You are an expert dialogue writer. Create natural, character-appropriate conversations with distinct voices.',
      description: 'You are a descriptive writer. Create vivid, engaging descriptions that bring ideas to life.',
      'game-concept': 'You are a game designer. Create innovative, fun game concepts with clear mechanics and engaging themes.',
    };

    return this.chat(context, {
      ...options,
      systemPrompt: systemPrompts[contentType],
      temperature: options?.temperature ?? 0.8,
    });
  }

  /**
   * Generate personalized gift game content
   */
  async generateGiftGameContent(params: {
    recipientName: string;
    senderName: string;
    occasion: string;
    tone: string;
    interests: string[];
    gameType: string;
  }): Promise<{
    title: string;
    introMessage: string;
    gameDialogue: string[];
    endMessage: string;
  }> {
    const prompt = `Create personalized gift game content:
- Recipient: ${params.recipientName}
- From: ${params.senderName}
- Occasion: ${params.occasion}
- Tone: ${params.tone}
- Interests: ${params.interests.join(', ')}
- Game Type: ${params.gameType}

Generate a JSON response with:
{
  "title": "Creative game title",
  "introMessage": "Welcoming message for the recipient",
  "gameDialogue": ["Array of 4-5 encouraging dialogue lines"],
  "endMessage": "Heartfelt closing message from sender"
}

Respond ONLY with valid JSON.`;

    try {
      const response = await this.chat(prompt, {
        temperature: 0.8,
        maxTokens: 800,
      });

      // Parse JSON response
      const parsed = JSON.parse(response);
      return {
        title: parsed.title || `${params.recipientName}'s Special Game`,
        introMessage: parsed.introMessage || `Welcome, ${params.recipientName}!`,
        gameDialogue: parsed.gameDialogue || ['Have fun!', 'You\'re doing great!'],
        endMessage: parsed.endMessage || `With love, ${params.senderName}`,
      };
    } catch (error) {
      console.error('Error generating gift game content:', error);
      // Return fallback content
      return {
        title: `${params.recipientName}'s ${params.occasion} Adventure`,
        introMessage: `Welcome, ${params.recipientName}! ${params.senderName} created this special game just for you!`,
        gameDialogue: [
          `Let's begin this ${params.tone} adventure!`,
          'You\'re doing amazing!',
          'Keep going, you\'ve got this!',
          'Almost there!',
        ],
        endMessage: `${params.recipientName}, you're wonderful! With love, ${params.senderName} 💝`,
      };
    }
  }

  /**
   * Generate game suggestions based on user preferences
   */
  async generateGameSuggestions(
    preferences: {
      genres?: string[];
      targetAudience?: string;
      complexity?: 'simple' | 'medium' | 'complex';
      themes?: string[];
    },
    count: number = 5
  ): Promise<string[]> {
    const prompt = `Generate ${count} unique game ideas based on:
- Genres: ${preferences.genres?.join(', ') || 'any'}
- Target Audience: ${preferences.targetAudience || 'general'}
- Complexity: ${preferences.complexity || 'medium'}
- Themes: ${preferences.themes?.join(', ') || 'any'}

Provide ${count} creative, detailed game concepts. List them as numbered items with a brief description for each.`;

    try {
      const response = await this.chat(prompt, { temperature: 0.9 });
      
      // Parse numbered list
      const lines = response
        .split('\n')
        .filter(l => l.trim())
        .map(l => l.replace(/^\d+\.\s*/, '').trim())
        .filter(l => l.length > 0);

      return lines.slice(0, count);
    } catch (error) {
      console.error('Error generating game suggestions:', error);
      return [
        'Adventure Quest - Explore mystical lands',
        'Puzzle Master - Brain-teasing challenges',
        'Speed Runner - Fast-paced action',
        'Story Weaver - Interactive narrative',
        'Quiz Champion - Knowledge challenge',
      ].slice(0, count);
    }
  }

  /**
   * Enhance text with AI improvements
   */
  async enhanceText(
    text: string,
    style: 'emotional' | 'professional' | 'fun' | 'concise'
  ): Promise<string> {
    const stylePrompts = {
      emotional: 'Make this text more emotional, heartfelt, and touching while keeping its meaning:',
      professional: 'Make this text more professional, polished, and clear:',
      fun: 'Make this text more fun, playful, and engaging:',
      concise: 'Make this text more concise and impactful while keeping its core message:',
    };

    try {
      return await this.chat(`${stylePrompts[style]}\n\n"${text}"`, {
        temperature: 0.7,
        maxTokens: 500,
      });
    } catch (error) {
      console.error('Error enhancing text:', error);
      return text;
    }
  }
}

// Export singleton instance
export const openAIService = new OpenAIService();
export default openAIService;
