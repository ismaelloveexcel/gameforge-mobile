# AI Integration Guide

This guide explains how to set up and configure real AI integration for GameForge Mobile's Genie Assistant.

## Overview

GameForge Mobile's AI system supports multiple providers:
1. **OpenAI (ChatGPT)** - GPT-4, GPT-4o-mini, and other OpenAI models
2. **Grok AI (x.ai)** - Grok models from xAI
3. **Simulation Mode** (Fallback) - Uses hardcoded responses, requires no API keys

## Quick Start

### Option 1: OpenAI / ChatGPT (Recommended)

1. Get an API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create a `.env` file in the project root:

```env
OPENAI_API_KEY=sk-your_openai_api_key_here
AI_PROVIDER=openai
```

3. The app will automatically use OpenAI for all AI features.

### Option 2: Grok AI (x.ai)

1. Get an API key from [x.ai](https://x.ai)
2. Create a `.env` file:

```env
GROK_API_KEY=your_grok_api_key_here
AI_PROVIDER=grok
```

### Auto Mode (Default)

By default, the app uses "auto" mode which:
- Uses OpenAI if `OPENAI_API_KEY` is configured
- Falls back to Grok if `GROK_API_KEY` is configured
- Uses simulation mode if no API keys are available

```env
AI_PROVIDER=auto
```

## Why Real AI Integration Matters

The external review identified that simulated AI responses:
- Lack genuine intelligence and the "wow factor"
- Cannot adapt to unique user queries
- Don't provide the competitive edge promised in the product vision
- Undermine the "AI-powered" value proposition

**Solution**: Integrate with OpenAI or Grok AI API for production-ready AI assistance.

## Setting Up OpenAI (ChatGPT)

### 1. Get an OpenAI API Key

1. Sign up at [platform.openai.com](https://platform.openai.com)
2. Navigate to API Keys section
3. Create a new secret key
4. Copy and store securely

### 2. Configure the Application

#### Environment Variables (Recommended)

Create a `.env` file in the project root:

```env
OPENAI_API_KEY=sk-your_api_key_here
AI_PROVIDER=openai
```

#### Runtime Configuration

```typescript
import { openAIService } from './services/OpenAIService';
import { aiService } from './services/AIService';

// Configure OpenAI directly
openAIService.setApiKey('sk-your_api_key_here');
openAIService.setModel('gpt-4o-mini'); // or 'gpt-4', 'gpt-3.5-turbo'

// Or set provider preference
aiService.setProvider('openai');
```

### 3. Using the OpenAI Service

```typescript
import { openAIService } from './services/OpenAIService';

// Simple chat
const response = await openAIService.chat('How do I make a fun birthday game?');

// With options
const response = await openAIService.chat(
  'Create a game concept for a 10-year-old',
  {
    temperature: 0.8,
    maxTokens: 1000,
    systemPrompt: 'You are a creative game designer.',
  }
);

// Generate gift game content
const gameContent = await openAIService.generateGiftGameContent({
  recipientName: 'Sarah',
  senderName: 'John',
  occasion: 'birthday',
  tone: 'playful',
  interests: ['cats', 'puzzles'],
  gameType: 'adventure',
});
```

## Setting Up Grok AI

### 1. Get a Grok API Key

1. Sign up at [x.ai](https://x.ai)
2. Navigate to API settings
3. Generate a new API key
4. Keep your API key secure

### 2. Configure the Application

```env
GROK_API_KEY=your_api_key_here
AI_PROVIDER=grok
```

Or in code:

```typescript
import { grokService } from './services/GrokService';

grokService.setApiKey('your_api_key_here');
```

## Using the Unified AI Service

The `AIService` provides a unified interface that works with any configured provider:

```typescript
import { aiService } from './services/AIService';

// Set preferred provider (optional, defaults to 'auto')
aiService.setProvider('auto'); // 'openai' | 'grok' | 'auto'

// Check active provider
console.log('Using:', aiService.getActiveProvider());

// Generate content (uses best available provider)
const content = await aiService.generateGameContent(
  'adventure',
  {
    recipientName: 'Sarah',
    occasion: 'birthday',
    interests: ['cats', 'music'],
    tone: 'playful',
  }
);

// Generate gift message
const message = await aiService.generateGiftMessage(
  'Sarah',
  'John', 
  'birthday',
  'heartfelt',
  ['cats', 'music']
);

// Generate suggestions
const ideas = await aiService.generateSuggestions('game-ideas', 'birthday gift', 5);
```

## API Response Format

The service expects OpenAI-compatible responses:

```json
{
  "choices": [
    {
      "message": {
        "content": "AI response text here..."
      }
    }
  ]
}
```

## Error Handling & Fallback

The service automatically falls back to simulation mode if:
- No API key is configured
- API request fails
- Network is unavailable
- Response is malformed

This ensures a seamless user experience even when AI is unavailable.

```typescript
try {
  const response = await genieService.processMessage(message, personality);
  // Response will be either real AI or simulation
} catch (error) {
  // Fallback is automatic, errors are logged
  console.error('Genie error:', error);
}
```

## Personality System

Genie has 4 specialized personalities, each with custom system prompts:

### 1. Creative Mentor 🎨
- **Focus**: Game design, storytelling, creative concepts
- **Best for**: Brainstorming, narrative design, world-building
- **Tone**: Enthusiastic, supportive, imaginative

### 2. Technical Expert ⚙️
- **Focus**: Implementation, optimization, debugging
- **Best for**: Code help, performance issues, architecture
- **Tone**: Precise, professional, solution-oriented

### 3. Marketing Guru 📈
- **Focus**: Promotion, monetization, user acquisition
- **Best for**: Marketing strategy, analytics, campaigns
- **Tone**: Persuasive, data-driven, results-focused

### 4. Educator 📚
- **Focus**: Teaching, learning paths, explanations
- **Best for**: Tutorials, concept explanation, skill building
- **Tone**: Patient, encouraging, clear

## Context-Aware Responses

Provide context for smarter responses:

```typescript
const context = {
  projectId: 'puzzle-game-123',
  currentScene: 'level-2',
  recentActions: [
    'user added 3D models',
    'user enabled physics',
    'user tested collision'
  ],
  userPreferences: {
    engine: 'babylon',
    difficulty: 'intermediate',
  },
};

const response = await genieService.processMessage(
  'How can I improve physics performance?',
  'technical',
  context
);
```

## Cost Management

### OpenAI Pricing
- GPT-4o-mini: ~$0.15 per 1M input tokens, ~$0.60 per 1M output tokens
- GPT-4: ~$30 per 1M input tokens, ~$60 per 1M output tokens
- Check current pricing at [OpenAI Pricing](https://openai.com/pricing)

### Grok AI Pricing
- Check current pricing at [x.ai pricing](https://x.ai/pricing)

### Best Practices
1. **Use GPT-4o-mini** for cost-effective responses (recommended default)
2. **Cache responses** for common questions
3. **Implement rate limiting** to control costs
4. **Use simulation mode** for development
5. **Monitor token usage** in production
6. **Set up usage alerts** in your AI provider dashboard

## Testing AI Integration

### Unit Tests

```typescript
import { openAIService } from './services/OpenAIService';
import { aiService } from './services/AIService';

describe('OpenAIService', () => {
  it('should return fallback when no API key', async () => {
    const response = await openAIService.chat('test message');
    expect(response).toContain('not configured');
  });

  it('should check configuration status', () => {
    expect(openAIService.isConfigured()).toBe(false);
    openAIService.setApiKey('test-key');
    expect(openAIService.isConfigured()).toBe(true);
  });
});

describe('AIService', () => {
  it('should select correct provider', () => {
    aiService.setProvider('auto');
    const provider = aiService.getActiveProvider();
    expect(['openai', 'grok', 'fallback']).toContain(provider);
  });
});
```

### Manual Testing

1. Configure with a real API key (OpenAI or Grok)
2. Open Genie assistant in the app
3. Switch between personalities
4. Ask complex questions requiring real AI
5. Verify responses are contextual and intelligent

## Security Best Practices

1. **Never commit API keys** to version control
2. **Use environment variables** for sensitive data
3. **Add `.env` to `.gitignore`** (already done)
4. **Implement server-side proxy** for production (recommended)
5. **Rotate keys regularly**
6. **Monitor for unusual usage patterns**

## Production Architecture

For production, consider this architecture:

```
Mobile App
    ↓
Your Backend API (with rate limiting, auth)
    ↓
Grok AI / OpenAI
```

Benefits:
- API keys stay server-side
- Better rate limiting
- Usage monitoring
- Cost control
- Analytics

## Troubleshooting

### Issue: "Using simulation mode" message
**Solution**: Verify API key is configured correctly in `.env` file

### Issue: API requests failing
**Solutions**:
- Check network connectivity
- Verify API key is valid and not expired
- Check API endpoint URL
- Review API provider status page
- Ensure you have credits/quota remaining

### Issue: Responses are generic
**Solutions**:
- Provide more context in requests
- Use appropriate personality for the task
- Check if real AI mode is actually enabled with `aiService.getActiveProvider()`

### Issue: High API costs
**Solutions**:
- Use GPT-4o-mini instead of GPT-4 (10-20x cheaper)
- Implement response caching
- Add rate limiting
- Consider hybrid approach (AI + simulation)

### Issue: OpenAI rate limits
**Solutions**:
- Implement exponential backoff
- Use lower tier models during high traffic
- Consider enterprise tier for higher limits

## Roadmap: Agent Orchestration

The product vision includes an agent orchestration system. Future enhancements:

1. **Market Research Agent** - Analyzes trends, suggests game ideas
2. **Testing Agent** - Automated QA and bug detection
3. **Promotion Agent** - Generates marketing campaigns
4. **Supervisor (Grok/GPT-4)** - Coordinates multiple agents

This requires backend infrastructure not yet implemented in the mobile app.

## Support

For issues with AI integration:
- Check the [OpenAI API docs](https://platform.openai.com/docs)
- Check the [Grok AI docs](https://docs.x.ai)
- Open an issue on GitHub
- Contact support@gameforge.mobile

## Summary

✅ **Implemented**: Multi-provider AI integration (OpenAI + Grok)
✅ **OpenAI Service**: Full ChatGPT API support via OpenAIService
✅ **Unified Interface**: AIService works with any configured provider
✅ **Fallback**: Automatic simulation mode when API unavailable
✅ **Personalities**: 4 specialized AI assistants via GenieService
✅ **Security**: Environment-based configuration
⏳ **Future**: Full agent orchestration system

Start with simulation mode for development, then add real AI (OpenAI recommended) for production to deliver the "wow factor" users expect from an AI-powered platform.
