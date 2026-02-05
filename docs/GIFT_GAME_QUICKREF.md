# Gift Game System - Quick Reference

## Quick Start

### Creating a Gift Game (User Flow)

```typescript
// 1. User navigates to gift game screen
navigation.navigate('GiftQuestionnaire', {});

// 2. Service creates questionnaire
const questionnaire = giftGameService.createQuestionnaire();

// 3. User fills out 6 steps
giftGameService.updateQuestionnaire(questionnaire.id, {
  recipientName: 'Sarah',
  occasion: 'birthday',
  emotionalTone: 'warm-heartfelt',
  gameStyle: 'runner',
  // ... other fields
});

// 4. Generate gift game
const giftGame = await giftGameService.generateGiftGame(questionnaire.id);

// 5. Share unique URL
console.log(giftGame.shareableUrl);
// => https://gameforge.app/play/abc123xyz
```

### Running Agent Pipeline (Automated)

```typescript
import { agentOrchestrator } from './services/AgentOrchestrator';

// Run complete research → create → test pipeline
const result = await agentOrchestrator.runCompletePipeline();

console.log('Research:', result.research.trends);
console.log('Ideas:', result.ideas);
console.log('Templates:', result.templates);
console.log('Test Results:', result.testResults);
```

### Creating Custom Workflow

```typescript
// Create workflow
const workflow = agentOrchestrator.createWorkflow(
  'Weekend Research',
  'Research weekend gifting trends'
);

// Add tasks
agentOrchestrator.addTask(workflow.id, 'market-researcher', {
  topics: ['weekend gifts', 'relaxation'],
  platforms: ['tiktok', 'instagram']
});

agentOrchestrator.addTask(workflow.id, 'idea-generator', {
  trends: ['cozy vibes', 'self-care'],
  audience: 'friends'
});

// Execute
await agentOrchestrator.executeWorkflow(workflow.id);

// Check status
const status = agentOrchestrator.getWorkflow(workflow.id);
console.log(status.status); // 'completed'
```

## Services API

### GiftGameService

```typescript
import { giftGameService } from './services/GiftGameService';

// Create questionnaire
const quest = giftGameService.createQuestionnaire();

// Update questionnaire
giftGameService.updateQuestionnaire(quest.id, {
  recipientName: 'Alex',
  senderName: 'Taylor'
});

// Validate
const validation = giftGameService.validateQuestionnaire(quest);
if (!validation.valid) {
  console.log('Missing:', validation.missingFields);
}

// Generate game
const game = await giftGameService.generateGiftGame(quest.id);

// Get gift templates
const templates = giftGameService.getGiftTemplates();

// Generate preview
const preview = giftGameService.generatePreview(quest);

// Track views
giftGameService.trackView(game.id);

// Mark completed
giftGameService.markCompleted(game.id);
```

### AgentOrchestrator

```typescript
import { agentOrchestrator } from './services/AgentOrchestrator';

// Set API key
agentOrchestrator.setApiKey(process.env.GROK_API_KEY);

// List all workflows
const workflows = agentOrchestrator.listWorkflows();

// Get specific workflow
const workflow = agentOrchestrator.getWorkflow(workflowId);

// Run complete pipeline
const result = await agentOrchestrator.runCompletePipeline();
```

## Agent Roles Reference

### Market Research Agent
```typescript
{
  agentRole: 'market-researcher',
  input: {
    topics: ['birthday gifts', 'anniversary'],
    platforms: ['tiktok', 'reddit']
  }
}
// Output: MarketResearchResult
```

### Idea Generator Agent
```typescript
{
  agentRole: 'idea-generator',
  input: {
    trends: ['cozy gaming', 'personalization'],
    audience: 'romantic partners'
  }
}
// Output: Array<{ name, description, genre }>
```

### Game Creator Agent
```typescript
{
  agentRole: 'game-creator',
  input: {
    idea: { name: 'Cozy Cat Quest', genre: 'runner', ... }
  }
}
// Output: TemplateGenerationResult
```

### Game Tester Agent
```typescript
{
  agentRole: 'game-tester',
  input: {
    templateId: 'template_123',
    gameData: { /* optional */ }
  }
}
// Output: GameTestResult (scores 1-10)
```

### Perfecter Agent
```typescript
{
  agentRole: 'perfecter',
  input: {
    templateId: 'template_123',
    testResults: { /* GameTestResult */ }
  }
}
// Output: { improvements: string[], newVersion: string }
```

### Marketing Agents

**Content Creator:**
```typescript
{
  agentRole: 'content-creator',
  input: {
    gameType: 'runner',
    occasion: 'birthday'
  }
}
// Output: { posts: Array<{ platform, content, hashtags }> }
```

**Scheduler:**
```typescript
{
  agentRole: 'scheduler',
  input: {
    posts: [...],
    strategy: 'viral' | 'steady' | 'launch'
  }
}
// Output: { scheduled: number, nextPostTime: Date }
```

**Engager:**
```typescript
{
  agentRole: 'engager',
  input: {
    platform: 'twitter',
    mentions: [...]
  }
}
// Output: { responses: number, engagement: number }
```

**Outreach:**
```typescript
{
  agentRole: 'outreach',
  input: {
    niche: 'personalized gifts'
  }
}
// Output: { communities: string[], messages: string[] }
```

## Navigation

```typescript
// Navigate to gift questionnaire
navigation.navigate('GiftQuestionnaire', {});

// Navigate with existing questionnaire
navigation.navigate('GiftQuestionnaire', { 
  questionnaireId: 'quest_123' 
});

// Navigate to preview
navigation.navigate('GiftPreview', { 
  giftGameId: 'gift_456' 
});

// Navigate to agent dashboard
navigation.navigate('AgentDashboard');
```

## Data Structures

### GiftQuestionnaire
```typescript
interface GiftQuestionnaire {
  id: string;
  occasion: 'birthday' | 'anniversary' | ...;
  recipientName: string;
  relationship: 'partner' | 'friend' | ...;
  recipientTraits: string[];
  interests: string[];
  emotionalTone: 'warm-heartfelt' | 'fun-playful' | ...;
  gameStyle: 'runner' | 'story-choice' | ...;
  senderName: string;
  customMessage?: string;
  memories?: string[];
  photos?: string[];
  gameDuration: '5-min' | '10-min' | '15-min';
  difficultyLevel: 'easy' | 'medium' | 'challenging';
  status: 'draft' | 'generating' | 'ready' | 'delivered';
}
```

### GiftGame
```typescript
interface GiftGame {
  id: string;
  questionnaireId: string;
  shareableUrl: string;
  recipientName: string;
  senderName: string;
  gameType: string;
  templateId: string;
  gameData: any;
  createdAt: Date;
  expiresAt?: Date;
  views: number;
  completed: boolean;
}
```

### AgentWorkflow
```typescript
interface AgentWorkflow {
  id: string;
  name: string;
  description: string;
  tasks: AgentTask[];
  status: 'idle' | 'running' | 'completed' | 'failed';
  createdAt: Date;
  completedAt?: Date;
}
```

## Environment Variables

```bash
# Required for AI agents
GROK_API_KEY=grok-...
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...

# Optional for marketing agents
TWITTER_API_KEY=...
TWITTER_API_SECRET=...
TIKTOK_ACCESS_TOKEN=...
INSTAGRAM_ACCESS_TOKEN=...

# App configuration
GIFT_GAME_BASE_URL=https://gameforge.app
```

## GitHub Actions

### Nightly Agent Pipeline

Located: `.github/workflows/nightly-agents.yml`

**Schedule:** 2 AM UTC daily

**Manual Trigger:**
```bash
# Via GitHub UI: Actions → Nightly Agent Pipeline → Run workflow

# Or via GitHub CLI
gh workflow run nightly-agents.yml
```

**Secrets Required:**
- `OPENAI_API_KEY`
- `GROK_API_KEY`

## Styling Guide

### Gift Game Colors
```typescript
// Emotional tone colors
const colors = {
  'warm-heartfelt': { primary: '#FF6B9D', accent: '#FFC371' },
  'fun-playful': { primary: '#667EEA', accent: '#F093FB' },
  'funny-silly': { primary: '#FFD93D', accent: '#FF6F91' },
  'inspirational': { primary: '#4ECDC4', accent: '#44A08D' },
  'nostalgic': { primary: '#A8DADC', accent: '#F1FAEE' },
};
```

### Component Styles
```typescript
// Gift screens use LinearGradient
<LinearGradient colors={['#667EEA', '#764BA2']} style={styles.container}>

// Highlight color for new features
highlightColor: '#FF6B9D'

// Agent dashboard accent
agentColor: '#667EEA'
```

## Testing

### Test Gift Game Creation
```typescript
import { giftGameService } from './services/GiftGameService';

describe('Gift Game Service', () => {
  it('creates questionnaire', () => {
    const quest = giftGameService.createQuestionnaire();
    expect(quest.id).toBeDefined();
    expect(quest.status).toBe('draft');
  });

  it('generates gift game', async () => {
    const quest = giftGameService.createQuestionnaire();
    giftGameService.updateQuestionnaire(quest.id, {
      recipientName: 'Test User',
      senderName: 'Tester',
      occasion: 'birthday',
      // ... required fields
    });

    const game = await giftGameService.generateGiftGame(quest.id);
    expect(game.shareableUrl).toContain('https://');
    expect(game.recipientName).toBe('Test User');
  });
});
```

### Test Agent Pipeline
```typescript
import { agentOrchestrator } from './services/AgentOrchestrator';

describe('Agent Orchestrator', () => {
  it('runs complete pipeline', async () => {
    const result = await agentOrchestrator.runCompletePipeline();
    
    expect(result.research).toBeDefined();
    expect(result.ideas.length).toBeGreaterThan(0);
    expect(result.templates.length).toBeGreaterThan(0);
    expect(result.testResults.length).toBeGreaterThan(0);
  });

  it('creates workflow', () => {
    const workflow = agentOrchestrator.createWorkflow('Test', 'Description');
    expect(workflow.status).toBe('idle');
  });
});
```

## Common Patterns

### Error Handling
```typescript
try {
  const game = await giftGameService.generateGiftGame(questionnaireId);
  navigation.navigate('GiftPreview', { giftGameId: game.id });
} catch (error) {
  Alert.alert('Error', 'Failed to generate gift game. Please try again.');
  console.error(error);
}
```

### Loading States
```typescript
const [isGenerating, setIsGenerating] = useState(false);

const handleGenerate = async () => {
  setIsGenerating(true);
  try {
    const game = await giftGameService.generateGiftGame(questionnaireId);
    navigation.navigate('GiftPreview', { giftGameId: game.id });
  } finally {
    setIsGenerating(false);
  }
};
```

### Validation
```typescript
const validation = giftGameService.validateQuestionnaire(questionnaire);

if (!validation.valid) {
  Alert.alert(
    'Missing Information',
    `Please fill in: ${validation.missingFields.join(', ')}`
  );
  return;
}
```

## Deployment Checklist

- [ ] Set environment variables in Vercel/hosting
- [ ] Configure GitHub Secrets for actions
- [ ] Enable GitHub Actions
- [ ] Set up social media API access
- [ ] Configure payment provider (future)
- [ ] Set up email delivery service (future)
- [ ] Test complete user flow
- [ ] Monitor agent pipeline runs
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Configure analytics

## Support

- Documentation: `/docs/GIFT_GAME_ARCHITECTURE.md`
- Issues: GitHub Issues
- Questions: Open a discussion

## License

MIT - See LICENSE file
