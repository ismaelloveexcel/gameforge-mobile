#!/usr/bin/env node
/**
 * Multi-Agent Creative Session
 * 
 * Tests BOTH agent systems:
 * - PlayGift agents (TypeScript/GitHub)
 * - Autonomous Factory agents (Python)
 * 
 * Task: Generate premium Snake & Ladders concepts
 * Using: GPT-4o for maximum creativity
 */

const fs = require('fs');
const path = require('path');

require('dotenv').config();

const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY;

async function runCreativeSession() {
  console.log('\n╔════════════════════════════════════════════════╗');
  console.log('║   🤖 MULTI-AGENT CREATIVE SESSION            ║');
  console.log('║   Premium Snake & Ladders Concepts            ║');
  console.log('╚════════════════════════════════════════════════╝\n');

  if (!OPENAI_API_KEY) {
    console.log('⚠️  OpenAI key needed for agent brainstorm');
    console.log('Run: npm run setup\n');
    process.exit(1);
  }

  const prompt = `You are leading a creative session with multiple specialized agents to reimagine Snake & Ladders as a PREMIUM gift game.

CHALLENGE:
Transform Snake & Ladders into a AED 50-75 premium personalized gift game.

REQUIREMENTS:
- Use Snake & Ladders CONCEPT (not just copy the board)
- High-resolution graphics (4K-ready)
- Animated snakes (sophisticated, not childish)
- Integrates 2 uploaded photos as characters
- Perfect for couples/friends
- Viral-worthy (shareable moments)
- Emotional depth (meaningful gift)
- Premium visual execution
- Worth AED 50+ pricing

AGENT PERSPECTIVES TO CONSIDER:

1. AESTHETICS AGENT:
   - How to make children's game feel premium?
   - Visual execution for Pixar-quality
   - Photo integration (faces feel premium not cheap)
   - Animated snakes (sophisticated not cartoonish)
   - Premium materials, lighting, depth

2. CONTENT-PIPELINE AGENT:
   - Gameplay twist (emotional depth)
   - Viral mechanics (why share?)
   - Relationship storytelling
   - Replayability factor
   - Gift-worthiness

3. DEVELOPMENT AGENT:
   - Technical feasibility
   - Animation performance
   - Photo processing pipeline
   - Asset requirements
   - Build timeline

4. MARKETING AGENT:
   - Unique selling proposition
   - Differentiation from competitors
   - Price justification
   - Target audience appeal

Generate 5 PREMIUM concepts. For each:

{
  "title": "Concept name",
  "tagline": "One-liner description",
  "coreInnovation": "What's different from classic S&L",
  "visualStyle": {
    "artDirection": "Detailed art style",
    "colorPalette": "Sophisticated colors",
    "photoTreatment": "How photos integrate",
    "snakeAnimation": "How snakes move (sophisticated!)",
    "ladderDesign": "Premium ladder concept",
    "materials": "Textures, lighting, premium signals"
  },
  "gameplayTwist": {
    "howItWorks": "Gameplay mechanics",
    "emotionalLayer": "Personal/relationship elements",
    "replayability": "Why play multiple times"
  },
  "premiumJustification": {
    "visualQuality": "Why it looks premium",
    "personalization": "Photo integration value",
    "uniqueness": "What nobody else has",
    "emotional": "Why worth gifting"
  },
  "viralPotential": {
    "shareableM oment": "Screenshot-worthy moment",
    "caption": "What users would post",
    "score": "0-100 viral score"
  },
  "technicalSpecs": {
    "resolution": "Asset resolutions needed",
    "animations": "Animation requirements",
    "assets": ["List of assets to create"],
    "estimatedCost": "DALL-E 3 generation cost"
  },
  "agentConsensus": {
    "aesthetics": "Visual approval",
    "content": "Viral approval",
    "development": "Feasibility",
    "marketing": "Market fit"
  }
}

Rank by:
1. Premium feel (worth AED 50)
2. Viral potential
3. Uniqueness
4. Technical feasibility
5. Emotional impact

Return as JSON with all 5 concepts ranked.`;

  try {
    console.log('🤖 Activating multi-agent creative brainstorm...\n');
    console.log('Using: GPT-4o (maximum creativity mode)\n');
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are a creative director leading a multi-agent brainstorm session. You synthesize input from aesthetic, content, development, and marketing agents to create premium innovative concepts.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.95,  // Maximum creativity!
        max_tokens: 8000,
        response_format: { type: 'json_object' }
      })
    });

    const data = await response.json();
    const concepts = data.choices?.[0]?.message?.content;

    if (!concepts) {
      throw new Error('No concepts generated');
    }

    // Save concepts
    const outputDir = path.join(__dirname, '..', 'agent-concepts');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    fs.writeFileSync(
      path.join(outputDir, 'premium-snake-ladders-concepts.json'),
      concepts
    );

    console.log('✅ Generated 5 premium concepts!\n');
    console.log('📁 Saved to: agent-concepts/premium-snake-ladders-concepts.json\n');

    // Parse and display summary
    const parsed = JSON.parse(concepts);
    const conceptList = parsed.concepts || [parsed];

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('TOP 3 CONCEPTS (Ranked)');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    conceptList.slice(0, 3).forEach((concept, index) => {
      console.log(`${index + 1}. ${concept.title}`);
      console.log(`   "${concept.tagline}"`);
      console.log(`   Innovation: ${concept.coreInnovation}`);
      console.log(`   Viral Score: ${concept.viralPotential?.score}/100`);
      console.log(`   Cost: ${concept.technicalSpecs?.estimatedCost || '$1-2'}\n`);
    });

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎯 Next: Review concepts and pick favorite!');
    console.log('Then: Generate high-res assets for chosen concept\n');

    console.log('💰 AI Cost: ~$0.80 (GPT-4o creative session)\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.log('Ensure OpenAI API key is configured\n');
    process.exit(1);
  }
}

runCreativeSession();
