/**
 * GrokService - Personalized game generation using Grok API (x.ai)
 * OpenAI-compatible API interface for generating personalized gift games
 */

import {
  GiftForgeQuestionnaire,
  GeneratedGiftGame,
  GrokGameResponse,
  SafetyValidationResult,
  OCCASION_LABELS,
  AGE_LABELS,
  PERSONALITY_LABELS,
  INTEREST_LABELS,
  RELATIONSHIP_LABELS,
  TONE_LABELS,
  GAME_TYPE_LABELS,
  GAME_LENGTH_LABELS,
  VISUAL_STYLE_LABELS,
  IntroScreen,
  EndScreen,
  GameContent,
  DialogueItem,
  GameLevel,
  QuizQuestion,
  StoryBranch,
} from '../types/giftforge';

// Unsafe content patterns to reject
const UNSAFE_PATTERNS = [
  /likeness|celebrity|famous\s*person|public\s*figure/i,
  /violence|weapon|gun|knife|blood|kill|murder|death\s*threat/i,
  /nude|naked|sexual|explicit|porn/i,
  /racist|racial\s*slur|hate\s*speech|discriminat/i,
  /drug|illegal|substance/i,
  /harass|bully|threaten/i,
  /self.?harm|suicid/i,
  /minor|underage|child.*inappropriate/i,
];

// Reserved/problematic names
const UNSAFE_NAMES = [
  'hitler', 'stalin', 'nazi', 'terrorist',
  'osama', 'bin laden', 'isis', 'al qaeda',
];

class GrokService {
  private apiKey: string;
  private baseUrl: string = 'https://api.x.ai/v1/chat/completions';
  private model: string = 'grok-beta';

  constructor() {
    // API key would be loaded from environment in production
    // For demo, we use a placeholder that can be overridden
    this.apiKey = process.env.GROK_API_KEY || '';
  }

  /**
   * Set API key for Grok service
   */
  setApiKey(key: string): void {
    this.apiKey = key;
  }

  /**
   * Validate input content for safety
   */
  validateSafety(questionnaire: Partial<GiftForgeQuestionnaire>): SafetyValidationResult {
    const issues: string[] = [];
    
    // Check recipient name
    if (questionnaire.recipientName) {
      const nameLower = questionnaire.recipientName.toLowerCase();
      
      // Check for unsafe names
      for (const unsafeName of UNSAFE_NAMES) {
        if (nameLower.includes(unsafeName)) {
          issues.push('Recipient name contains inappropriate content');
          break;
        }
      }
      
      // Check for unsafe patterns in name
      for (const pattern of UNSAFE_PATTERNS) {
        if (pattern.test(questionnaire.recipientName)) {
          issues.push('Recipient name contains restricted content');
          break;
        }
      }
    }
    
    // Check sender name
    if (questionnaire.senderName) {
      const nameLower = questionnaire.senderName.toLowerCase();
      
      for (const unsafeName of UNSAFE_NAMES) {
        if (nameLower.includes(unsafeName)) {
          issues.push('Sender name contains inappropriate content');
          break;
        }
      }
    }
    
    // Check personal message
    if (questionnaire.personalMessage) {
      for (const pattern of UNSAFE_PATTERNS) {
        if (pattern.test(questionnaire.personalMessage)) {
          issues.push('Personal message contains restricted content');
          break;
        }
      }
    }
    
    return {
      isValid: issues.length === 0,
      issues,
    };
  }

  /**
   * Build the prompt for Grok API based on questionnaire
   */
  private buildGamePrompt(questionnaire: GiftForgeQuestionnaire): string {
    const occasionLabel = OCCASION_LABELS[questionnaire.occasion];
    const ageLabel = AGE_LABELS[questionnaire.recipientAge];
    const personalityLabels = questionnaire.recipientPersonalities
      .map(p => PERSONALITY_LABELS[p])
      .join(', ');
    const interestLabels = questionnaire.recipientInterests
      .map(i => INTEREST_LABELS[i])
      .join(', ');
    const relationshipLabel = RELATIONSHIP_LABELS[questionnaire.relationship];
    const toneLabel = TONE_LABELS[questionnaire.tone];
    const gameTypeLabel = GAME_TYPE_LABELS[questionnaire.gameType];
    const gameLengthLabel = GAME_LENGTH_LABELS[questionnaire.gameLength];
    const visualStyleLabel = VISUAL_STYLE_LABELS[questionnaire.visualStyle];

    return `Create a personalized gift mini-game with the following specifications:

## Recipient Details
- Name: ${questionnaire.recipientName}
- Age Group: ${ageLabel}
- Personalities: ${personalityLabels}
- Interests: ${interestLabels}

## Gift Context
- Occasion: ${occasionLabel}
- From: ${questionnaire.senderName}
- Relationship: ${relationshipLabel}
- Tone: ${toneLabel}

## Game Specifications
- Type: ${gameTypeLabel}
- Length: ${gameLengthLabel}
- Visual Style: ${visualStyleLabel}

## Personal Message from Sender
"${questionnaire.personalMessage}"

Please generate a JSON response with the following structure:
{
  "title": "A creative, personalized game title",
  "introScreen": {
    "headline": "Welcoming headline for ${questionnaire.recipientName}",
    "subtext": "A warm intro message matching the ${toneLabel} tone",
    "buttonText": "Engaging call-to-action to start"
  },
  "endScreen": {
    "headline": "Celebratory completion message",
    "personalMessage": "The personal message transformed into a touching finale",
    "senderSignature": "With love, ${questionnaire.senderName}"
  },
  "gameContent": {
    "type": "${questionnaire.gameType}",
    "dialogue": [
      {"character": "Guide", "text": "...", "emotion": "happy|excited|thoughtful|encouraging|celebrating"}
    ],
    "mechanics": [
      {"type": "mechanic_type", "description": "...", "parameters": {}}
    ],
    ${questionnaire.gameType === 'runner' ? '"levels": [{"id": 1, "name": "...", "description": "...", "objectives": ["..."]}]' : ''}
    ${questionnaire.gameType === 'puzzle_challenges' || questionnaire.gameType === 'educational_playful' ? '"questions": [{"question": "...", "options": ["..."], "correctAnswer": 0, "encouragingFeedback": "..."}]' : ''}
    ${questionnaire.gameType === 'story_choices' || questionnaire.gameType === 'adventure_quest' ? '"storyBranches": [{"id": "start", "text": "...", "choices": [{"text": "...", "nextBranchId": "...", "reaction": "..."}]}]' : ''}
  }
}

Make the content:
1. Age-appropriate for ${ageLabel}
2. Deeply personalized with references to their interests (${interestLabels})
3. Match the ${toneLabel} emotional tone throughout
4. Include encouraging and joyful moments
5. End with a heartwarming message that incorporates the sender's personal note

Respond ONLY with the JSON, no additional text.`;
  }

  /**
   * Generate a gift game using Grok API
   */
  async generateGame(questionnaire: GiftForgeQuestionnaire): Promise<GrokGameResponse> {
    // Safety check first
    const safetyResult = this.validateSafety(questionnaire);
    if (!safetyResult.isValid) {
      return {
        success: false,
        error: `Content validation failed: ${safetyResult.issues.join(', ')}`,
      };
    }

    // If no API key, use fallback generation
    if (!this.apiKey) {
      console.log('No Grok API key configured, using fallback generation');
      return this.generateFallbackGame(questionnaire);
    }

    try {
      const prompt = this.buildGamePrompt(questionnaire);
      
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: 'system',
              content: 'You are a creative game designer specializing in personalized gift experiences. Generate heartfelt, age-appropriate, and engaging mini-game content. Always respond with valid JSON only.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.8,
          max_tokens: 2000,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Grok API error:', errorText);
        // Fall back to local generation
        return this.generateFallbackGame(questionnaire);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;
      
      if (!content) {
        return this.generateFallbackGame(questionnaire);
      }

      // Parse the JSON response
      const gameData = JSON.parse(content);
      
      const game: GeneratedGiftGame = {
        id: this.generateGameId(),
        title: gameData.title,
        recipientName: questionnaire.recipientName,
        senderName: questionnaire.senderName,
        introScreen: gameData.introScreen,
        endScreen: gameData.endScreen,
        gameContent: gameData.gameContent,
        visualStyle: questionnaire.visualStyle,
        createdAt: new Date(),
      };

      return {
        success: true,
        game,
      };
    } catch (error) {
      console.error('Error generating game with Grok:', error);
      // Fall back to local generation
      return this.generateFallbackGame(questionnaire);
    }
  }

  /**
   * Generate a fallback game when API is unavailable
   * This provides a complete game experience without requiring API access
   */
  private async generateFallbackGame(questionnaire: GiftForgeQuestionnaire): Promise<GrokGameResponse> {
    // Simulate API delay for smooth UX
    await new Promise(resolve => setTimeout(resolve, 1500));

    const title = this.generateTitle(questionnaire);
    const introScreen = this.generateIntroScreen(questionnaire);
    const endScreen = this.generateEndScreen(questionnaire);
    const gameContent = this.generateGameContent(questionnaire);

    const game: GeneratedGiftGame = {
      id: this.generateGameId(),
      title,
      recipientName: questionnaire.recipientName,
      senderName: questionnaire.senderName,
      introScreen,
      endScreen,
      gameContent,
      visualStyle: questionnaire.visualStyle,
      createdAt: new Date(),
    };

    return {
      success: true,
      game,
    };
  }

  /**
   * Generate a creative game title
   */
  private generateTitle(questionnaire: GiftForgeQuestionnaire): string {
    const titles: Record<string, string[]> = {
      birthday: [
        `${questionnaire.recipientName}'s Birthday Adventure`,
        `Happy Birthday, ${questionnaire.recipientName}!`,
        `A Special Day for ${questionnaire.recipientName}`,
      ],
      anniversary: [
        `Our Journey Together, ${questionnaire.recipientName}`,
        `Celebrating Us: A Love Story`,
        `${questionnaire.recipientName}'s Anniversary Quest`,
      ],
      valentines: [
        `With Love to ${questionnaire.recipientName}`,
        `A Valentine's Journey for You`,
        `Hearts & Adventures for ${questionnaire.recipientName}`,
      ],
      christmas: [
        `${questionnaire.recipientName}'s Holiday Magic`,
        `A Christmas Surprise for ${questionnaire.recipientName}`,
        `Winter Wonderland Adventure`,
      ],
      graduation: [
        `Congratulations, ${questionnaire.recipientName}!`,
        `${questionnaire.recipientName}'s Achievement Quest`,
        `The Graduate's Adventure`,
      ],
      thank_you: [
        `Thank You, ${questionnaire.recipientName}!`,
        `A Gratitude Adventure`,
        `For ${questionnaire.recipientName}, With Thanks`,
      ],
      get_well: [
        `Get Well Soon, ${questionnaire.recipientName}!`,
        `Healing Wishes for ${questionnaire.recipientName}`,
        `A Cheerful Journey to Wellness`,
      ],
      congratulations: [
        `Celebrating ${questionnaire.recipientName}'s Success!`,
        `Way to Go, ${questionnaire.recipientName}!`,
        `A Victory Lap for ${questionnaire.recipientName}`,
      ],
      just_because: [
        `Just for ${questionnaire.recipientName}`,
        `A Surprise Adventure`,
        `Because ${questionnaire.recipientName} is Awesome!`,
      ],
      farewell: [
        `Until We Meet Again, ${questionnaire.recipientName}`,
        `A Fond Farewell Adventure`,
        `Wishing ${questionnaire.recipientName} Well`,
      ],
    };

    const occasionTitles = titles[questionnaire.occasion] || titles.just_because;
    return occasionTitles[Math.floor(Math.random() * occasionTitles.length)];
  }

  /**
   * Generate intro screen content
   */
  private generateIntroScreen(questionnaire: GiftForgeQuestionnaire): IntroScreen {
    const toneIntros: Record<string, string> = {
      heartfelt: `${questionnaire.senderName} has created something special just for you...`,
      playful: `Hey ${questionnaire.recipientName}! Ready for some fun?`,
      nostalgic: `A little trip down memory lane awaits you...`,
      encouraging: `You've got this, ${questionnaire.recipientName}! Let's go!`,
      romantic: `My dearest ${questionnaire.recipientName}, this is for you...`,
      humorous: `Warning: Extreme fun ahead! Proceed with joy!`,
      inspirational: `Every great journey begins with a single step...`,
    };

    return {
      headline: `Welcome, ${questionnaire.recipientName}! 🎉`,
      subtext: toneIntros[questionnaire.tone] || toneIntros.heartfelt,
      buttonText: 'Start Your Adventure! ✨',
    };
  }

  /**
   * Generate end screen content
   */
  private generateEndScreen(questionnaire: GiftForgeQuestionnaire): EndScreen {
    const occasionEndings: Record<string, string> = {
      birthday: 'Happy Birthday! May this year bring you endless joy! 🎂',
      anniversary: 'Here\'s to many more wonderful years together! 💕',
      valentines: 'You mean the world to me! 💝',
      christmas: 'Wishing you magic and warmth this season! 🎄',
      graduation: 'So proud of you! The world is yours! 🎓',
      thank_you: 'Your kindness means more than words can say! 🙏',
      get_well: 'Sending healing thoughts and warm wishes! 💐',
      congratulations: 'You did it! Celebrating your amazing achievement! 🏆',
      just_because: 'Just wanted you to know how special you are! ⭐',
      farewell: 'Until we meet again, take care! 👋',
    };

    return {
      headline: occasionEndings[questionnaire.occasion] || '🎉 You did it!',
      personalMessage: questionnaire.personalMessage || `Made with love for ${questionnaire.recipientName}`,
      senderSignature: `With love, ${questionnaire.senderName} 💝`,
    };
  }

  /**
   * Generate game content based on game type
   */
  private generateGameContent(questionnaire: GiftForgeQuestionnaire): GameContent {
    const dialogue = this.generateDialogue(questionnaire);
    
    const content: GameContent = {
      type: questionnaire.gameType,
      dialogue,
      mechanics: this.generateMechanics(questionnaire),
    };

    // Add type-specific content
    switch (questionnaire.gameType) {
      case 'runner':
        content.levels = this.generateRunnerLevels(questionnaire);
        break;
      case 'puzzle_challenges':
      case 'educational_playful':
        content.questions = this.generateQuestions(questionnaire);
        break;
      case 'story_choices':
      case 'adventure_quest':
        content.storyBranches = this.generateStoryBranches(questionnaire);
        break;
    }

    return content;
  }

  /**
   * Generate dialogue based on tone and context
   */
  private generateDialogue(questionnaire: GiftForgeQuestionnaire): DialogueItem[] {
    const interest = questionnaire.recipientInterests[0] || 'fun';
    const personality = questionnaire.recipientPersonalities[0] || 'adventurous';
    
    return [
      {
        character: 'Guide',
        text: `Welcome, ${questionnaire.recipientName}! ${questionnaire.senderName} prepared this special adventure for you!`,
        emotion: 'happy',
      },
      {
        character: 'Guide',
        text: `I heard you love ${INTEREST_LABELS[interest]?.replace(/^.+?\s/, '') || interest}! This game was made with that in mind.`,
        emotion: 'excited',
      },
      {
        character: 'Guide',
        text: `Being ${PERSONALITY_LABELS[personality]?.replace(/^.+?\s/, '') || personality}, I know you'll enjoy this!`,
        emotion: 'encouraging',
      },
      {
        character: 'Guide',
        text: 'Let\'s make some wonderful memories together!',
        emotion: 'celebrating',
      },
    ];
  }

  /**
   * Generate game mechanics
   */
  private generateMechanics(questionnaire: GiftForgeQuestionnaire): any[] {
    const baseMechanics: Record<string, any[]> = {
      runner: [
        { type: 'collect', description: 'Collect special items', parameters: { items: 10 } },
        { type: 'avoid', description: 'Avoid obstacles', parameters: { obstacles: 5 } },
        { type: 'powerup', description: 'Grab power-ups for boosts', parameters: { powerups: 3 } },
      ],
      story_choices: [
        { type: 'choice', description: 'Make meaningful decisions', parameters: { branches: 4 } },
        { type: 'dialogue', description: 'Engage in conversations', parameters: { characters: 3 } },
      ],
      puzzle_challenges: [
        { type: 'puzzle', description: 'Solve puzzles to progress', parameters: { puzzles: 5 } },
        { type: 'hint', description: 'Use hints when stuck', parameters: { hints: 3 } },
      ],
      adventure_quest: [
        { type: 'explore', description: 'Explore different areas', parameters: { areas: 4 } },
        { type: 'quest', description: 'Complete quests', parameters: { quests: 3 } },
      ],
      educational_playful: [
        { type: 'learn', description: 'Learn fun facts', parameters: { facts: 5 } },
        { type: 'quiz', description: 'Test your knowledge', parameters: { questions: 5 } },
      ],
    };

    return baseMechanics[questionnaire.gameType] || baseMechanics.story_choices;
  }

  /**
   * Generate runner game levels
   */
  private generateRunnerLevels(questionnaire: GiftForgeQuestionnaire): GameLevel[] {
    const interest = questionnaire.recipientInterests[0] || 'fun';
    const interestName = INTEREST_LABELS[interest]?.replace(/^.+?\s/, '') || interest;
    
    return [
      {
        id: 1,
        name: 'Getting Started',
        description: `Warm up and collect your first ${interestName}-themed items!`,
        objectives: ['Collect 5 items', 'Reach the checkpoint'],
      },
      {
        id: 2,
        name: 'Picking Up Speed',
        description: 'The pace picks up! Can you keep going?',
        objectives: ['Collect 10 items', 'Avoid all obstacles'],
      },
      {
        id: 3,
        name: 'The Final Sprint',
        description: `${questionnaire.recipientName}'s ultimate challenge!`,
        objectives: ['Collect 15 items', 'Reach the celebration!'],
      },
    ];
  }

  /**
   * Generate quiz questions
   */
  private generateQuestions(questionnaire: GiftForgeQuestionnaire): QuizQuestion[] {
    const interest = questionnaire.recipientInterests[0] || 'fun';
    const interestName = INTEREST_LABELS[interest]?.replace(/^.+?\s/, '') || interest;
    
    return [
      {
        question: `What makes ${questionnaire.recipientName} awesome?`,
        options: ['Everything!', 'Their smile', 'Their kindness', 'All of the above'],
        correctAnswer: 3,
        encouragingFeedback: 'Absolutely right! They\'re amazing in every way! ✨',
      },
      {
        question: `${questionnaire.recipientName} loves ${interestName}. What else do they enjoy?`,
        options: ['Having fun', 'Being awesome', 'Making memories', 'All of these!'],
        correctAnswer: 3,
        encouragingFeedback: 'You know them so well! 🎉',
      },
      {
        question: `Who created this game just for ${questionnaire.recipientName}?`,
        options: [questionnaire.senderName, 'A friend', 'Someone special', 'All correct!'],
        correctAnswer: 0,
        encouragingFeedback: `That's right! ${questionnaire.senderName} made this with love! 💝`,
      },
    ];
  }

  /**
   * Generate story branches
   */
  private generateStoryBranches(questionnaire: GiftForgeQuestionnaire): StoryBranch[] {
    const occasion = OCCASION_LABELS[questionnaire.occasion]?.replace(/^.+?\s/, '') || 'special day';
    
    return [
      {
        id: 'start',
        text: `It's ${occasion} time, ${questionnaire.recipientName}! You find yourself at the beginning of an adventure. ${questionnaire.senderName} has hidden a special surprise for you. Where do you want to explore first?`,
        choices: [
          { text: 'Follow the sparkling path', nextBranchId: 'path1', reaction: 'Ooh, shiny! Good choice!' },
          { text: 'Check the mysterious door', nextBranchId: 'path2', reaction: 'How adventurous of you!' },
        ],
      },
      {
        id: 'path1',
        text: 'The sparkling path leads you to a beautiful garden filled with your favorite things! You see something glinting in the flowers.',
        choices: [
          { text: 'Pick up the glinting object', nextBranchId: 'finale', reaction: 'You found it!' },
          { text: 'Explore more of the garden', nextBranchId: 'finale', reaction: 'What a lovely journey!' },
        ],
      },
      {
        id: 'path2',
        text: 'Behind the door is a cozy room decorated just for you! There\'s a gift box on the table with your name on it.',
        choices: [
          { text: 'Open the gift box', nextBranchId: 'finale', reaction: 'Surprise!' },
          { text: 'Read the card first', nextBranchId: 'finale', reaction: 'So thoughtful!' },
        ],
      },
      {
        id: 'finale',
        text: `Congratulations, ${questionnaire.recipientName}! You've completed your adventure! ${questionnaire.senderName} is so happy you played this game. 🎉`,
        choices: [],
      },
    ];
  }

  /**
   * Generate a unique game ID
   */
  private generateGameId(): string {
    const timestamp = Date.now().toString(36);
    const randomPart = Math.random().toString(36).substring(2, 8);
    return `gift-${timestamp}-${randomPart}`;
  }

  /**
   * Generate a playable URL for the game
   */
  generatePlayableUrl(gameId: string): string {
    // In production, this would create a proper dynamic route
    const baseUrl = typeof window !== 'undefined' 
      ? window.location.origin 
      : 'https://gameforge.app';
    return `${baseUrl}/play/${gameId}`;
  }
}

export const grokService = new GrokService();
