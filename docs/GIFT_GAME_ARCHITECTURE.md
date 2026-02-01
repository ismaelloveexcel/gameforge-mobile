# Personalized Gift Game Architecture

## Overview

This document describes the implementation of the personalized gift game creation system - a self-improving flywheel architecture combining AI agents, user experience, and marketing automation.

## Architecture Components

### 1. Agent Team A: Research → Creation → Testing → Perfecting

#### Purpose
Continuously generates and refines game templates behind the scenes, creating polished, ready-to-personalize mini-game templates.

#### Components

**AgentOrchestrator Service** (`src/services/AgentOrchestrator.ts`)
- Coordinates multi-agent workflows
- Manages task execution and dependencies
- Supports 9 specialized agent roles

**Agent Roles:**

1. **Market Research Agent**
   - Scans trends on TikTok, Reddit, Twitter
   - Identifies popular gifting occasions
   - Analyzes viral mini-games
   - Output: `MarketResearchResult`

2. **Idea Generator Agent**
   - Proposes new template variants based on trends
   - Generates game concepts optimized for gifts
   - Example: "Cozy Cat Quest" runner for animal lovers

3. **Game Creator Agent**
   - Fills templates with new assets/dialogue
   - Uses Genie personalities (Creative Mentor for story, Technical Expert for mechanics)
   - Creates experimental templates

4. **Game Tester Agent**
   - Simulates playthroughs autonomously
   - Scores fun/emotion/playability metrics via LLM judge
   - Flags issues and provides recommendations
   - Output: `GameTestResult` with scores 1-10

5. **Perfecter Agent**
   - Iterates on templates based on test results
   - Fixes bugs, balances difficulty
   - Enhances emotional payoff

**Automation:**
- GitHub Actions workflow: `.github/workflows/nightly-agents.yml`
- Runs nightly at 2 AM UTC
- Commits to `/templates/experimental` folder
- Can be manually triggered via workflow_dispatch

**Integration Point:**
```typescript
import { agentOrchestrator } from './services/AgentOrchestrator';

// Run complete pipeline
const result = await agentOrchestrator.runCompletePipeline();
// Returns: { research, ideas, templates, testResults }
```

### 2. User-Facing Flow: Personalized Gift Experience

#### Purpose
Smooth, guided, enjoyable creation journey - like filling out a thoughtful card, not building software.

#### Components

**GiftGameService** (`src/services/GiftGameService.ts`)
- Manages gift questionnaires and games
- Maps user answers to personalization parameters
- Generates unique shareable URLs
- Handles game delivery and tracking

**GiftQuestionnaireScreen** (`src/screens/GiftQuestionnaireScreen.tsx`)
- 6-step guided questionnaire
- Live preview updates
- Beautiful, playful UI with animations
- Progress indicators

**Questionnaire Steps:**

1. **Occasion** - Birthday, Anniversary, Graduation, etc.
2. **Recipient Info** - Name, age, relationship
3. **Personality & Interests** - Traits and hobbies
4. **Tone & Style** - Emotional tone + game style
5. **Personalization** - Custom messages, sender name
6. **Preferences** - Duration (5/10/15 min), difficulty

**Gift Game Templates:**
- Heartfelt Runner (5-10 min)
- Personal Adventure Story (10-15 min)
- Memory Puzzle (10 min)
- Birthday Quest (10-15 min)
- Cozy Collection (5-10 min)

**Personalization Engine:**
```typescript
// Maps questionnaire to game parameters
const params = giftGameService.mapToPersonalizationParams(questionnaire);
// Returns: { characterName, customMessages, visualTheme, gameplay }
```

**Shareable URLs:**
- Format: `https://gameforge.app/play/{unique-code}`
- Expire after 1 year (configurable)
- Track views and completions

#### User Flow
```
1. User clicks "Create a Gift Game" 
   ↓
2. Guided questionnaire (6 steps with live preview)
   ↓
3. "Generate Gift" button → AI processing (5-10s)
   ↓
4. Preview screen with shareable URL
   ↓
5. Payment (future) → Instant delivery via email/link
```

### 3. Agent Team B: Marketing & Social Media

#### Purpose
Automates posting, engagement, and outreach to create viral loops.

#### Components

**Enhanced MarketingService** (`src/services/MarketingService.ts`)
- Extended with 4 new agent roles
- Social media API integrations (planned)
- Automated content generation

**Agent Roles:**

1. **Content Creator Agent**
   - Generates posts, captions, hashtags
   - Platform-specific: Twitter/X, TikTok, Instagram
   - Example: "Just gifted my partner a custom adventure game! 🎮❤️"

2. **Scheduler Agent**
   - Posts at optimal times
   - Strategies: viral, steady, launch
   - Uses Buffer API or direct platform APIs (planned)

3. **Engager Agent**
   - Monitors mentions/replies
   - Auto-responds with empathy
   - Tracks engagement metrics

4. **Outreach Agent**
   - Finds communities: Reddit (r/GiftIdeas), TikTok hashtags
   - Suggests outreach messages
   - Identifies indie gift communities

**Viral Loop:**
```
Users create gift → Share on social → Marketing agents amplify 
   ↓                                                    ↓
More users ← Marketing content ← Auto-generate posts
   ↓
More data for research agents → Better templates
```

**Content Generation:**
```typescript
const content = await agentOrchestrator.executeTask({
  agentRole: 'content-creator',
  input: { gameType: 'runner', occasion: 'birthday' }
});
// Returns posts for Twitter, TikTok, Instagram
```

### 4. The Flywheel

```
┌──────────────────────────────────────────┐
│  SELF-IMPROVING LOOP                      │
├──────────────────────────────────────────┤
│                                           │
│  1. Agents research trends               │
│        ↓                                  │
│  2. Improve/create templates             │
│        ↓                                  │
│  3. Users love the experience            │
│        ↓                                  │
│  4. Users share on social                │
│        ↓                                  │
│  5. Marketing agents amplify             │
│        ↓                                  │
│  6. More users discover                  │
│        ↓                                  │
│  7. More data for research (loop back)   │
│                                           │
└──────────────────────────────────────────┘
```

## Grok/xAI Integration (Recommended)

The system is designed to be AI-agnostic but optimized for Grok API:

**Why Grok?**
- Real-time web search for market research
- Superior reasoning for emotional game design
- Can playtest and judge games autonomously
- Witty personality for marketing content

**Integration Points:**
```typescript
// In AgentOrchestrator.ts
class AgentOrchestrator {
  private apiKey: string = ''; // Grok/xAI API key
  
  setApiKey(key: string): void {
    this.apiKey = key;
  }
  
  // Use in any agent execution
  private async callGrokAPI(prompt: string): Promise<any> {
    // Implementation with xAI API
  }
}
```

**Setup:**
1. Get API key from xAI
2. Add to environment: `GROK_API_KEY`
3. Configure in workflow: `.github/workflows/nightly-agents.yml`

## Navigation Integration

New screens added to `RootStackParamList`:
```typescript
GiftGameCreator: undefined;
GiftQuestionnaire: { questionnaireId?: string };
GiftPreview: { giftGameId: string };
AgentDashboard: undefined;
```

Entry point from Home screen:
```typescript
<TouchableOpacity onPress={() => navigation.navigate('GiftGameCreator')}>
  <Text>🎁 Create a Gift Game</Text>
</TouchableOpacity>
```

## File Structure

```
src/
├── services/
│   ├── AgentOrchestrator.ts      # Multi-agent coordination
│   ├── GiftGameService.ts         # Gift game creation & delivery
│   ├── GenieService.ts            # Extended with 'gift-guide' personality
│   └── MarketingService.ts        # Enhanced with agent capabilities
├── screens/
│   ├── GiftQuestionnaireScreen.tsx  # Main user flow (6 steps)
│   ├── GiftPreviewScreen.tsx        # Preview & share (to be created)
│   └── AgentDashboardScreen.tsx     # Admin monitoring (to be created)
├── types/
│   └── index.ts                     # Extended with gift & agent types
.github/
└── workflows/
    └── nightly-agents.yml           # Automated agent pipeline
```

## Configuration

### Environment Variables
```bash
# AI API Keys
OPENAI_API_KEY=sk-...
GROK_API_KEY=grok-...
ANTHROPIC_API_KEY=sk-ant-...

# Social Media APIs (for marketing agents)
TWITTER_API_KEY=...
TWITTER_API_SECRET=...
TIKTOK_ACCESS_TOKEN=...
INSTAGRAM_ACCESS_TOKEN=...

# App Configuration
GIFT_GAME_BASE_URL=https://gameforge.app
```

### Agent Schedule
Modify `.github/workflows/nightly-agents.yml`:
```yaml
on:
  schedule:
    - cron: '0 2 * * *'  # 2 AM UTC daily
```

## Deployment Checklist

- [ ] Set up API keys in GitHub Secrets
- [ ] Configure social media API access
- [ ] Enable GitHub Actions workflow
- [ ] Create `/templates/experimental` directory
- [ ] Set up monitoring/alerting for agent failures
- [ ] Configure payment integration (Stripe, etc.)
- [ ] Set up email delivery service
- [ ] Add analytics tracking
- [ ] Create admin dashboard for monitoring agents

## Usage Examples

### For Developers

**Running agent pipeline manually:**
```typescript
import { agentOrchestrator } from './services/AgentOrchestrator';

// Full pipeline
const result = await agentOrchestrator.runCompletePipeline();
console.log('Generated templates:', result.templates);

// Individual workflow
const workflow = agentOrchestrator.createWorkflow(
  'Custom Research',
  'Research specific niche'
);

agentOrchestrator.addTask(workflow.id, 'market-researcher', {
  topics: ['anniversary gifts', 'couple games'],
  platforms: ['tiktok']
});

await agentOrchestrator.executeWorkflow(workflow.id);
```

**Creating a gift game:**
```typescript
import { giftGameService } from './services/GiftGameService';

// Create questionnaire
const quest = giftGameService.createQuestionnaire();

// Update fields
giftGameService.updateQuestionnaire(quest.id, {
  recipientName: 'Sarah',
  occasion: 'birthday',
  emotionalTone: 'warm-heartfelt',
  gameStyle: 'runner'
});

// Generate game
const giftGame = await giftGameService.generateGiftGame(quest.id);
console.log('Shareable URL:', giftGame.shareableUrl);
```

### For Users

1. Navigate to "Create a Gift Game" from home screen
2. Follow the 6-step questionnaire
3. Preview and adjust
4. Generate game (5-10 seconds)
5. Share the unique URL with recipient

## Next Steps

### Phase 1: ✅ Core Infrastructure (Current)
- [x] AgentOrchestrator service
- [x] GiftGameService
- [x] GiftQuestionnaireScreen
- [x] Extended GenieService
- [x] GitHub Actions workflow

### Phase 2: 🚧 UI Completion
- [ ] GiftPreviewScreen (show game, share options)
- [ ] AgentDashboardScreen (monitor agent performance)
- [ ] Update HomeScreen with gift game CTA
- [ ] Add navigation wiring

### Phase 3: 🔮 Integration & Polish
- [ ] Real AI API integration (Grok/OpenAI)
- [ ] Social media APIs
- [ ] Payment integration
- [ ] Email delivery
- [ ] Analytics tracking
- [ ] Performance optimization

### Phase 4: 🚀 Launch
- [ ] User testing
- [ ] Marketing campaign
- [ ] Monitor agent performance
- [ ] Iterate based on data

## Best Practices

### For Agent Development
- Keep agents focused on single responsibilities
- Log all agent actions for debugging
- Handle API failures gracefully
- Rate limit API calls
- Cache results when possible

### For Gift Game UX
- Keep questionnaire under 3 minutes
- Show progress clearly
- Provide instant previews
- Make it feel playful, not technical
- Emphasize emotional connection

### For Marketing Automation
- Always disclose automated posts
- Maintain authentic tone
- Respect platform rate limits
- Monitor engagement metrics
- A/B test content strategies

## Monitoring & Metrics

### Agent Metrics
- Templates generated per night
- Test scores (playability, emotional engagement, etc.)
- Success rate of pipeline
- API usage and costs

### User Metrics
- Questionnaire completion rate
- Time to complete questionnaire
- Gift game shares
- Recipient engagement (views, completions)
- Conversion rate (free → paid)

### Marketing Metrics
- Social media reach
- Engagement rate
- Click-through rate on shared links
- Viral coefficient (how many new users per existing user)

## Support & Troubleshooting

### Common Issues

**Agents not running:**
- Check GitHub Actions are enabled
- Verify API keys in secrets
- Check workflow logs

**Gift generation fails:**
- Verify GiftGameService is initialized
- Check input validation
- Review error logs

**Preview not updating:**
- Ensure state management is working
- Check generatePreview() method
- Verify questionnaire updates

## License & Credits

MIT License - See LICENSE file

Built with:
- React Native + Expo
- TypeScript
- AI APIs (OpenAI, Grok, Anthropic)
- Social Media APIs

---

**Questions?** Open an issue or contact the development team.

**Contributing?** See CONTRIBUTING.md for guidelines.
