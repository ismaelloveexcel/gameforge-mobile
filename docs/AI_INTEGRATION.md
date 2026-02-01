# AI Integration Guide

This guide explains how to set up and configure real AI integration for GameForge Mobile's Genie Assistant.

## Overview

GameForge Mobile's Genie AI assistant supports two modes:
1. **Simulation Mode** (Default) - Uses hardcoded responses, requires no API keys
2. **Real AI Mode** - Connects to Grok AI (x.ai) or OpenAI-compatible APIs

## Why Real AI Integration Matters

The external review identified that simulated AI responses:
- Lack genuine intelligence and the "wow factor"
- Cannot adapt to unique user queries
- Don't provide the competitive edge promised in the product vision
- Undermine the "AI-powered" value proposition

**Solution**: Integrate with Grok AI API for production-ready AI assistance.

## Setting Up Grok AI (Recommended)

### 1. Get a Grok API Key

1. Sign up at [x.ai](https://x.ai)
2. Navigate to API settings
3. Generate a new API key
4. Keep your API key secure

### 2. Configure the Application

#### Option A: Environment Variables (Recommended for Production)

Create a `.env` file in the project root:

```env
GROK_API_KEY=your_api_key_here
GROK_MODEL=grok-beta
```

#### Option B: Runtime Configuration (Development)

In your app initialization code:

```typescript
import { genieService } from './services/GenieService';

// Configure Genie with your API key
genieService.configure(
  'your_api_key_here',
  'https://api.x.ai/v1/chat/completions',
  'grok-beta'
);
```

### 3. Using the Genie Service

```typescript
import { genieService } from './services/GenieService';
import { GeniePersonality } from './types';

// Check if real AI is enabled
if (genieService.isRealAIEnabled()) {
  console.log('✅ Real AI mode active');
} else {
  console.log('⚠️ Using simulation mode');
}

// Send a message
const response = await genieService.processMessage(
  'How do I optimize game performance?',
  'technical' as GeniePersonality,
  {
    projectId: 'my-project',
    currentScene: 'level-1',
    recentActions: ['added sprites', 'enabled physics'],
    userPreferences: {},
  }
);

console.log('AI Response:', response.content);
if (response.suggestions) {
  console.log('Suggestions:', response.suggestions);
}
if (response.codeSnippet) {
  console.log('Code:', response.codeSnippet);
}
```

## Alternative: OpenAI Integration

GameForge's Genie service is compatible with OpenAI and other OpenAI-compatible APIs:

```typescript
import { genieService } from './services/GenieService';

// Configure for OpenAI
genieService.configure(
  'sk-your_openai_api_key',
  'https://api.openai.com/v1/chat/completions',
  'gpt-4'
);
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

### Grok AI Pricing
- Check current pricing at [x.ai pricing](https://x.ai/pricing)
- Implement rate limiting for production
- Consider caching frequent queries

### Best Practices
1. **Cache responses** for common questions
2. **Implement rate limiting** to control costs
3. **Use simulation mode** for development
4. **Monitor token usage** in production
5. **Set up usage alerts** in your AI provider dashboard

## Testing AI Integration

### Unit Tests

```typescript
import { genieService } from './services/GenieService';

describe('GenieService', () => {
  it('should fall back to simulation when no API key', async () => {
    const response = await genieService.processMessage(
      'test message',
      'creative'
    );
    expect(response.content).toBeDefined();
  });

  it('should use real AI when configured', async () => {
    genieService.configure('test-key');
    expect(genieService.isRealAIEnabled()).toBe(true);
  });
});
```

### Manual Testing

1. Configure with a real API key
2. Open Genie assistant in the app
3. Switch between personalities
4. Ask complex questions requiring real AI
5. Verify responses are contextual and intelligent

## Security Best Practices

1. **Never commit API keys** to version control
2. **Use environment variables** for sensitive data
3. **Implement server-side proxy** for production (recommended)
4. **Rotate keys regularly**
5. **Monitor for unusual usage patterns**

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
**Solution**: Verify API key is configured correctly

### Issue: API requests failing
**Solutions**:
- Check network connectivity
- Verify API key is valid
- Check API endpoint URL
- Review API provider status page

### Issue: Responses are generic
**Solutions**:
- Provide more context in requests
- Use appropriate personality for the task
- Check if real AI mode is actually enabled

### Issue: High API costs
**Solutions**:
- Implement response caching
- Add rate limiting
- Use cheaper models for simple queries
- Consider hybrid approach (AI + simulation)

## Roadmap: Agent Orchestration

The product vision includes an agent orchestration system. Future enhancements:

1. **Market Research Agent** - Analyzes trends, suggests game ideas
2. **Testing Agent** - Automated QA and bug detection
3. **Promotion Agent** - Generates marketing campaigns
4. **Supervisor (Grok)** - Coordinates multiple agents

This requires backend infrastructure not yet implemented in the mobile app.

## Support

For issues with AI integration:
- Check the [Grok AI docs](https://docs.x.ai)
- Review [OpenAI API docs](https://platform.openai.com/docs)
- Open an issue on GitHub
- Contact support@gameforge.mobile

## Summary

✅ **Implemented**: Real AI integration via GenieService
✅ **Fallback**: Automatic simulation mode when API unavailable
✅ **Personalities**: 4 specialized AI assistants
✅ **Security**: Environment-based configuration
⏳ **Future**: Full agent orchestration system

Start with simulation mode for development, then add real AI for production to deliver the "wow factor" users expect from an AI-powered platform.
