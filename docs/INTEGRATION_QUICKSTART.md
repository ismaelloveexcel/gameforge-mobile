# Integration Quickstart Guide
# Implementing Repository Recommendations

**Target Date:** February 1-7, 2026  
**Audience:** Development Team  
**Status:** Ready to Execute

---

## Week 1 Priority: Marketing Automation

### Day 1-2: Smart-Marketing-Assistant-Crew-AI

**Installation:**
```bash
cd /home/runner/work/gameforge-mobile/gameforge-mobile
npm install crewai openai
```

**Create Service:**
```typescript
// src/services/marketing/SocialMarketingService.ts
import { CrewAI } from 'crewai';

interface GameMarketingData {
  gameTitle: string;
  occasion: 'valentines' | 'ramadan' | 'birthday' | 'anniversary';
  artStyle: string;
  recipientName: string;
  locale: 'en-AE' | 'ar-AE';
}

export class SocialMarketingService {
  private crewAI: CrewAI;
  
  constructor() {
    this.crewAI = new CrewAI({
      apiKey: process.env.OPENAI_API_KEY,
      model: 'gpt-4'
    });
  }
  
  async generateInstagramStory(gameData: GameMarketingData): Promise<{
    caption: string;
    hashtags: string[];
    cta: string;
  }> {
    const prompt = `Create an engaging Instagram Story caption for a personalized gift game:
    - Game: ${gameData.gameTitle}
    - Occasion: ${gameData.occasion}
    - Style: ${gameData.artStyle}
    - Target: ${gameData.locale === 'ar-AE' ? 'UAE Arabic speakers' : 'UAE English speakers'}
    
    Make it emotional, shareable, and include relevant hashtags.`;
    
    const result = await this.crewAI.generate({
      task: 'social-content-creation',
      prompt,
      format: 'json'
    });
    
    return result;
  }
  
  async scheduleValentinesCampaign(): Promise<void> {
    const posts = [
      {
        date: '2026-02-07',
        time: '20:00',
        content: 'Launch announcement',
        platforms: ['instagram', 'twitter', 'facebook']
      },
      {
        date: '2026-02-11',
        time: '21:00',
        content: 'Valentine countdown - 3 days',
        platforms: ['instagram', 'tiktok']
      },
      {
        date: '2026-02-14',
        time: '10:00',
        content: 'Happy Valentine\'s Day',
        platforms: ['all']
      }
    ];
    
    for (const post of posts) {
      await this.crewAI.schedulePost(post);
    }
  }
}
```

**Environment Variables:**
```bash
# Add to .env
OPENAI_API_KEY=sk-your-key-here
CREWAI_API_KEY=your-crewai-key
```

---

### Day 3-4: Copywriting Service

**Installation:**
```bash
npm install @anthropic-ai/sdk copy-ai-client
```

**Create Prompt Library:**
```typescript
// src/services/marketing/CopywritingService.ts
interface CopyPrompts {
  appStoreDescription: string;
  valentinesCampaign: string;
  ramadanCampaign: string;
  socialPost: string;
}

export class CopywritingService {
  private prompts: CopyPrompts;
  
  constructor() {
    this.prompts = this.loadPromptTemplates();
  }
  
  private loadPromptTemplates(): CopyPrompts {
    return {
      appStoreDescription: `Write a compelling App Store description for GameForge Mobile:
        - Target: Premium users, gift-givers
        - Unique value: Create personalized games in 60 seconds
        - Features: AI-powered, 15+ templates, VR support
        - Tone: Premium, emotional, exciting
        - Length: 4000 characters max
        - Include: Social proof, call-to-action
        - Avoid: Generic gaming jargon`,
        
      valentinesCampaign: `Create Valentine's Day marketing copy:
        - Audience: UAE couples, gift-givers
        - Emotion: Love, thoughtfulness, uniqueness
        - Urgency: Valentine's approaching
        - CTA: Create your gift game today
        - Cultural: UAE-appropriate romance`,
        
      ramadanCampaign: `Create Ramadan marketing copy:
        - Audience: UAE families, Muslim community
        - Values: Generosity, family, spirituality
        - Cultural sensitivity: Respectful, appropriate
        - Language: Arabic + English options
        - CTA: Bring family together with games`,
        
      socialPost: `Generate engaging social media post:
        - Platform: {{platform}}
        - Content: {{gamePreview}}
        - Tone: {{tone}}
        - Hashtags: Trending + branded
        - CTA: Clear action`
    };
  }
  
  async generateAppStoreDescription(locale: 'en-AE' | 'ar-AE'): Promise<{
    title: string;
    subtitle: string;
    description: string;
    keywords: string[];
  }> {
    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    
    const response = await client.chat.completions.create({
      model: 'gpt-4',
      messages: [{
        role: 'system',
        content: 'You are an expert ASO and app marketing copywriter.'
      }, {
        role: 'user',
        content: this.prompts.appStoreDescription
      }],
      temperature: 0.7
    });
    
    return this.parseAppStoreResponse(response.choices[0].message.content);
  }
  
  async generateCampaignCopy(
    campaign: 'valentines' | 'ramadan',
    format: 'email' | 'social' | 'ad'
  ): Promise<string> {
    const prompt = campaign === 'valentines' 
      ? this.prompts.valentinesCampaign 
      : this.prompts.ramadanCampaign;
      
    // Implementation with your preferred AI service
    return await this.generateWithAI(prompt, format);
  }
}
```

**Usage Example:**
```typescript
// In your marketing automation
const copyService = new CopywritingService();

// Generate App Store description
const appStore = await copyService.generateAppStoreDescription('en-AE');
console.log(appStore.title); // "GameForge: Create Gift Games in 60 Sec"

// Generate Valentine's ad copy
const adCopy = await copyService.generateCampaignCopy('valentines', 'ad');
```

---

### Day 5-6: Research & Analytics

**Installation:**
```bash
npm install langchain firecrawl-js
```

**Create Research Service:**
```typescript
// src/services/marketing/MarketResearchService.ts
import { FireCrawl } from 'firecrawl-js';
import { OpenAI } from 'openai';

export class MarketResearchService {
  private fireCrawl: FireCrawl;
  private openai: OpenAI;
  
  constructor() {
    this.fireCrawl = new FireCrawl({
      apiKey: process.env.FIRECRAWL_API_KEY
    });
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }
  
  async findUAEInfluencers(criteria: {
    niche: 'gaming' | 'lifestyle' | 'tech';
    minFollowers: number;
    location: 'Dubai' | 'Abu Dhabi' | 'UAE';
  }): Promise<Influencer[]> {
    // Search Instagram for influencers
    const searchQuery = `site:instagram.com ${criteria.niche} influencer ${criteria.location}`;
    
    const results = await this.fireCrawl.search(searchQuery);
    
    // Analyze with AI
    const analysis = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{
        role: 'user',
        content: `Analyze these influencer profiles and extract:
        - Name
        - Handle
        - Estimated followers
        - Engagement rate
        - Content focus
        - Contact info
        
        Data: ${JSON.stringify(results)}`
      }]
    });
    
    return this.parseInfluencerResults(analysis);
  }
  
  async analyzeCompetitor(url: string): Promise<CompetitorAnalysis> {
    // Scrape competitor website
    const data = await this.fireCrawl.scrape(url);
    
    // AI analysis
    const analysis = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{
        role: 'user',
        content: `Analyze this competitor and provide:
        1. Key features
        2. Pricing strategy
        3. Marketing approach
        4. Technology stack
        5. Strengths/Weaknesses
        6. Opportunities for GameForge
        
        Website data: ${data}`
      }]
    });
    
    return this.parseCompetitorAnalysis(analysis);
  }
  
  async discoverPartnershipOpportunities(
    industry: 'entertainment' | 'ecommerce' | 'hospitality'
  ): Promise<Partnership[]> {
    const searchQueries = [
      `${industry} companies Dubai UAE`,
      `${industry} startups Abu Dhabi`,
      `${industry} innovation partners UAE`
    ];
    
    const opportunities = [];
    
    for (const query of searchQueries) {
      const results = await this.fireCrawl.search(query);
      opportunities.push(...results);
    }
    
    return this.rankOpportunities(opportunities);
  }
}
```

---

### Day 7: Content Distribution Setup

**Installation:**
```bash
# Install Stacker (requires .NET)
dotnet tool install --global stacker

# Or use npm wrapper
npm install stacker-js
```

**Configure Buffer Integration:**
```typescript
// src/services/marketing/ContentDistributionService.ts
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export class ContentDistributionService {
  async distributeGameContent(game: GameData): Promise<void> {
    // Create content JSON
    const content = {
      title: game.title,
      description: game.description,
      imageUrl: game.previewImage,
      url: game.playUrl,
      tags: game.tags,
      timestamp: new Date().toISOString()
    };
    
    // Save to file
    await this.saveContentFile(content);
    
    // Use Stacker to distribute
    await this.distributeToSocialPlatforms(content);
  }
  
  async scheduleValentinesContent(): Promise<void> {
    const command = `
      stacker buffer create \\
        --source ./content/valentines-games.json \\
        --filter-by-tag valentines \\
        --platforms instagram,facebook,twitter \\
        --schedule-times "20:00,21:00,22:00" \\
        --timezone "Asia/Dubai" \\
        --item-count 3 \\
        --randomise
    `;
    
    await execAsync(command);
  }
  
  async scheduleRamadanContent(): Promise<void> {
    const command = `
      stacker buffer create \\
        --source ./content/ramadan-games.json \\
        --filter-by-tag ramadan \\
        --platforms instagram,facebook \\
        --schedule-times "20:00,21:00" \\
        --timezone "Asia/Dubai" \\
        --item-count 2 \\
        --randomise
    `;
    
    await execAsync(command);
  }
  
  private async distributeToSocialPlatforms(content: any): Promise<void> {
    const platforms = ['instagram', 'twitter', 'facebook', 'linkedin'];
    
    for (const platform of platforms) {
      await this.postToPlatform(platform, content);
    }
  }
}
```

**Content JSON Format:**
```json
{
  "items": [
    {
      "id": "game-001",
      "title": "Valentine's Love Runner",
      "description": "A personalized game for Sarah by John",
      "imageUrl": "https://gameforge.app/previews/game-001.jpg",
      "url": "https://gameforge.app/play/game-001",
      "tags": ["valentines", "romantic", "runner"],
      "timestamp": "2026-02-10T20:00:00Z"
    }
  ]
}
```

---

## Week 2 Priority: Game Template Enhancements

### Optional: Phaser Integration

**Installation:**
```bash
npm install phaser
```

**Create Phaser Engine:**
```typescript
// src/engines/PhaserEngine.ts
import Phaser from 'phaser';
import { IGameEngine, GameScene } from './IGameEngine';

export class PhaserEngine implements IGameEngine {
  private game: Phaser.Game | null = null;
  
  async initialize(container: HTMLDivElement): Promise<void> {
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      parent: container,
      width: 800,
      height: 600,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 300 },
          debug: false
        }
      },
      scene: []
    };
    
    this.game = new Phaser.Game(config);
  }
  
  async loadTemplate(templateId: string): Promise<void> {
    const template = await this.getTemplate(templateId);
    this.game?.scene.add(templateId, template);
    this.game?.scene.start(templateId);
  }
  
  async createValentineRunner(params: {
    recipientName: string;
    message: string;
    difficulty: 'easy' | 'medium' | 'hard';
  }): Promise<void> {
    // Create Valentine's themed runner game
    const scene = new ValentineRunnerScene(params);
    this.game?.scene.add('valentine-runner', scene);
    this.game?.scene.start('valentine-runner');
  }
}

class ValentineRunnerScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private hearts!: Phaser.Physics.Arcade.Group;
  private score: number = 0;
  private params: any;
  
  constructor(params: any) {
    super({ key: 'valentine-runner' });
    this.params = params;
  }
  
  preload() {
    // Load Valentine's assets
    this.load.image('player', '/assets/templates/valentine/player.png');
    this.load.image('heart', '/assets/templates/valentine/heart.png');
    this.load.image('background', '/assets/templates/valentine/bg.png');
  }
  
  create() {
    // Setup game
    this.add.image(400, 300, 'background');
    
    this.player = this.physics.add.sprite(100, 450, 'player');
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);
    
    this.hearts = this.physics.add.group();
    
    // Spawn hearts periodically
    this.time.addEvent({
      delay: 1000,
      callback: this.spawnHeart,
      callbackScope: this,
      loop: true
    });
    
    // Collision detection
    this.physics.add.overlap(
      this.player,
      this.hearts,
      this.collectHeart,
      undefined,
      this
    );
    
    // Show personalized message
    this.add.text(400, 50, `For ${this.params.recipientName}`, {
      fontSize: '32px',
      color: '#ff69b4'
    }).setOrigin(0.5);
  }
  
  update() {
    // Game logic
    const cursors = this.input.keyboard?.createCursorKeys();
    
    if (cursors?.left.isDown) {
      this.player.setVelocityX(-160);
    } else if (cursors?.right.isDown) {
      this.player.setVelocityX(160);
    } else {
      this.player.setVelocityX(0);
    }
    
    if (cursors?.up.isDown && this.player.body?.touching.down) {
      this.player.setVelocityY(-330);
    }
  }
  
  private spawnHeart() {
    const x = Phaser.Math.Between(50, 750);
    const heart = this.hearts.create(x, 0, 'heart');
    heart.setVelocityY(100);
  }
  
  private collectHeart(
    player: Phaser.GameObjects.GameObject,
    heart: Phaser.GameObjects.GameObject
  ) {
    (heart as Phaser.Physics.Arcade.Sprite).disableBody(true, true);
    this.score += 10;
    
    if (this.score >= 100) {
      this.showWinMessage();
    }
  }
  
  private showWinMessage() {
    this.scene.pause();
    this.add.text(400, 300, this.params.message, {
      fontSize: '48px',
      color: '#ff1493',
      backgroundColor: '#fff',
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5);
  }
}
```

---

## Testing & Validation

### Marketing Automation Test
```typescript
// __tests__/marketing/SocialMarketing.test.ts
import { SocialMarketingService } from '@/services/marketing/SocialMarketingService';

describe('SocialMarketingService', () => {
  let service: SocialMarketingService;
  
  beforeEach(() => {
    service = new SocialMarketingService();
  });
  
  it('should generate Instagram story for Valentine game', async () => {
    const result = await service.generateInstagramStory({
      gameTitle: 'Love Runner for Sarah',
      occasion: 'valentines',
      artStyle: 'pixel-perfect',
      recipientName: 'Sarah',
      locale: 'en-AE'
    });
    
    expect(result.caption).toContain('Valentine');
    expect(result.hashtags).toContain('#ValentinesDubai');
    expect(result.cta).toBeTruthy();
  });
  
  it('should schedule Valentine campaign posts', async () => {
    await expect(
      service.scheduleValentinesCampaign()
    ).resolves.not.toThrow();
  });
});
```

### Integration Checklist

- [ ] Marketing automation services created
- [ ] Copywriting prompts configured
- [ ] Research tools integrated
- [ ] Content distribution setup
- [ ] Environment variables configured
- [ ] Unit tests passing
- [ ] Integration tests passing
- [ ] Documentation updated
- [ ] Team training completed

---

## Environment Setup

**Required API Keys:**
```bash
# .env.local
OPENAI_API_KEY=sk-xxx
CREWAI_API_KEY=xxx
FIRECRAWL_API_KEY=xxx
BUFFER_API_KEY=xxx
INSTAGRAM_ACCESS_TOKEN=xxx
```

**Install Dependencies:**
```bash
npm install
npm install crewai openai langchain firecrawl-js
npm install phaser  # Optional
```

**Run Tests:**
```bash
npm run test:marketing
npm run test:integration
```

---

## Monitoring & Analytics

**Track:**
- API usage and costs
- Content generation success rate
- Social media engagement
- Campaign performance
- User acquisition from each channel

**Tools:**
- Vercel Analytics (built-in)
- Google Analytics
- Social platform insights
- Custom dashboard in app

---

## Support & Resources

**Documentation:**
- Smart-Marketing-Assistant-Crew-AI: https://github.com/praj2408/Smart-Marketing-Assistant-Crew-AI
- Awesome AI Copywriting: https://github.com/best-of-ai/awesome-ai-copyrighting
- AI Company Researcher: https://github.com/mayooear/ai-company-researcher
- Stacker: https://github.com/endjin/Stacker

**Team Contacts:**
- Technical Lead: [TBD]
- Marketing Lead: [TBD]
- Product Manager: [TBD]

---

**Status:** Ready for Implementation ✅  
**Next Update:** After Week 1 completion
