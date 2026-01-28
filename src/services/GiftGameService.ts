/**
 * Gift Game Service
 * Handles personalized game gift creation and delivery
 */

export interface GiftQuestionnaire {
  id: string;
  // Step 1: Occasion
  occasion:
    | 'birthday'
    | 'anniversary'
    | 'graduation'
    | 'thank-you'
    | 'just-because'
    | 'valentines'
    | 'friendship';

  // Step 2: Recipient Info
  recipientName: string;
  recipientAge?: number;
  relationship:
    | 'partner'
    | 'friend'
    | 'parent'
    | 'child'
    | 'sibling'
    | 'colleague'
    | 'other';

  // Step 3: Personality & Interests
  recipientTraits: string[]; // e.g., 'adventurous', 'thoughtful', 'funny', 'creative'
  interests: string[]; // e.g., 'cats', 'travel', 'music', 'sports'

  // Step 4: Tone & Style
  emotionalTone:
    | 'warm-heartfelt'
    | 'fun-playful'
    | 'funny-silly'
    | 'inspirational'
    | 'nostalgic';
  gameStyle: 'runner' | 'story-choice' | 'puzzle' | 'mini-quest' | 'educational';

  // Step 5: Personalization
  senderName: string;
  customMessage?: string;
  memories?: string[]; // Key memories or inside jokes
  photos?: string[]; // Optional photo URLs

  // Step 6: Preferences
  gameDuration: '5-min' | '10-min' | '15-min';
  difficultyLevel: 'easy' | 'medium' | 'challenging';

  createdAt: Date;
  status: 'draft' | 'generating' | 'ready' | 'delivered';
}

export interface GiftGame {
  id: string;
  questionnaireId: string;
  shareableUrl: string;
  recipientName: string;
  senderName: string;
  gameType: string;
  templateId: string;
  gameData: any; // Personalized game configuration
  createdAt: Date;
  expiresAt?: Date;
  views: number;
  completed: boolean;
}

export interface PersonalizationParams {
  characterName: string;
  senderName: string;
  occasion: string;
  customMessages: {
    intro: string;
    milestones: string[];
    victory: string;
  };
  visualTheme: {
    primaryColor: string;
    accentColor: string;
    style: string;
  };
  gameplay: {
    duration: number; // in seconds
    difficulty: number; // 1-5
    mechanics: Record<string, any>;
  };
}

class GiftGameService {
  private questionnaires: Map<string, GiftQuestionnaire> = new Map();
  private giftGames: Map<string, GiftGame> = new Map();

  /**
   * Create a new gift questionnaire
   */
  createQuestionnaire(): GiftQuestionnaire {
    const questionnaire: GiftQuestionnaire = {
      id: `quest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      occasion: 'birthday',
      recipientName: '',
      relationship: 'friend',
      recipientTraits: [],
      interests: [],
      emotionalTone: 'warm-heartfelt',
      gameStyle: 'runner',
      senderName: '',
      gameDuration: '10-min',
      difficultyLevel: 'easy',
      createdAt: new Date(),
      status: 'draft',
    };

    this.questionnaires.set(questionnaire.id, questionnaire);
    return questionnaire;
  }

  /**
   * Update questionnaire
   */
  updateQuestionnaire(
    id: string,
    updates: Partial<GiftQuestionnaire>
  ): GiftQuestionnaire {
    const questionnaire = this.questionnaires.get(id);
    if (!questionnaire) {
      throw new Error(`Questionnaire ${id} not found`);
    }

    const updated = { ...questionnaire, ...updates };
    this.questionnaires.set(id, updated);
    return updated;
  }

  /**
   * Get questionnaire by ID
   */
  getQuestionnaire(id: string): GiftQuestionnaire | undefined {
    return this.questionnaires.get(id);
  }

  /**
   * Map questionnaire answers to personalization parameters
   */
  mapToPersonalizationParams(
    questionnaire: GiftQuestionnaire
  ): PersonalizationParams {
    // Determine color scheme based on tone and interests
    const colorSchemes = {
      'warm-heartfelt': { primary: '#FF6B9D', accent: '#FFC371' },
      'fun-playful': { primary: '#667EEA', accent: '#F093FB' },
      'funny-silly': { primary: '#FFD93D', accent: '#FF6F91' },
      inspirational: { primary: '#4ECDC4', accent: '#44A08D' },
      nostalgic: { primary: '#A8DADC', accent: '#F1FAEE' },
    };

    const colors = colorSchemes[questionnaire.emotionalTone];

    // Generate personalized messages
    const messages = this.generateMessages(questionnaire);

    // Calculate gameplay parameters
    const durationMap = {
      '5-min': 300,
      '10-min': 600,
      '15-min': 900,
    };

    const difficultyMap = {
      easy: 1,
      medium: 3,
      challenging: 5,
    };

    return {
      characterName: questionnaire.recipientName,
      senderName: questionnaire.senderName,
      occasion: questionnaire.occasion,
      customMessages: messages,
      visualTheme: {
        primaryColor: colors.primary,
        accentColor: colors.accent,
        style: this.determineArtStyle(questionnaire),
      },
      gameplay: {
        duration: durationMap[questionnaire.gameDuration],
        difficulty: difficultyMap[questionnaire.difficultyLevel],
        mechanics: this.generateGameMechanics(questionnaire),
      },
    };
  }

  /**
   * Generate personalized messages based on questionnaire
   */
  private generateMessages(questionnaire: GiftQuestionnaire): {
    intro: string;
    milestones: string[];
    victory: string;
  } {
    const { recipientName, senderName, occasion, emotionalTone, customMessage } =
      questionnaire;

    // AI would generate these, but here are templates
    const introTemplates = {
      'warm-heartfelt': `Dear ${recipientName},\n\n${senderName} created something special just for you. Ready for an adventure? ❤️`,
      'fun-playful': `Hey ${recipientName}! 🎮\n\n${senderName} made you a game! Let's play!`,
      'funny-silly': `Yo ${recipientName}! 😄\n\n${senderName} got weird and made this for you. Enjoy the chaos!`,
      inspirational: `${recipientName},\n\n${senderName} believes in you. This journey is yours. ✨`,
      nostalgic: `Remember when... 💭\n\n${recipientName}, ${senderName} made this to celebrate our memories.`,
    };

    const victoryTemplates = {
      birthday: `Happy Birthday, ${recipientName}! 🎂\n\nFrom ${senderName} with love. Here's to another amazing year!`,
      anniversary: `Happy Anniversary, ${recipientName}! 💕\n\n${senderName} cherishes every moment with you.`,
      graduation: `Congratulations, ${recipientName}! 🎓\n\n${senderName} is so proud of you!`,
      'thank-you': `Thank you, ${recipientName}! 🙏\n\n${senderName} appreciates you more than words can say.`,
      'just-because': `Just because, ${recipientName}! ✨\n\n${senderName} was thinking of you today.`,
      valentines: `Happy Valentine's Day, ${recipientName}! 💘\n\nLove, ${senderName}`,
      friendship: `To my amazing friend ${recipientName}! 👯‍♀️\n\n${senderName} values our friendship so much!`,
    };

    return {
      intro: customMessage || introTemplates[emotionalTone],
      milestones: [
        `Keep going, ${recipientName}!`,
        `${senderName} knew you could do it!`,
        `Almost there! You're amazing!`,
      ],
      victory: victoryTemplates[occasion],
    };
  }

  /**
   * Determine art style based on interests and traits
   */
  private determineArtStyle(questionnaire: GiftQuestionnaire): string {
    const { interests, recipientTraits, emotionalTone } = questionnaire;

    // Simple logic - in production, use AI
    if (interests.includes('retro') || interests.includes('gaming')) {
      return 'pixel';
    }
    if (emotionalTone === 'nostalgic') {
      return 'watercolor';
    }
    if (recipientTraits.includes('creative') || recipientTraits.includes('artistic')) {
      return 'handdrawn';
    }
    if (interests.includes('tech') || interests.includes('futuristic')) {
      return 'cyberpunk';
    }
    return 'lowpoly'; // Default
  }

  /**
   * Generate game mechanics based on preferences
   */
  private generateGameMechanics(questionnaire: GiftQuestionnaire): Record<string, any> {
    const { gameStyle, interests, difficultyLevel } = questionnaire;

    const mechanicsMap: Record<string, Record<string, any>> = {
      runner: {
        speed: difficultyLevel === 'easy' ? 2 : difficultyLevel === 'medium' ? 3 : 4,
        obstacles: difficultyLevel === 'easy' ? 'low' : difficultyLevel === 'medium' ? 'medium' : 'high',
        collectibles: interests.includes('cats') ? 'cats' : interests.includes('stars') ? 'stars' : 'hearts',
        powerUps: true,
      },
      'story-choice': {
        branches: difficultyLevel === 'easy' ? 2 : difficultyLevel === 'medium' ? 3 : 4,
        endings: difficultyLevel === 'easy' ? 2 : 3,
        theme: interests[0] || 'adventure',
      },
      puzzle: {
        gridSize: difficultyLevel === 'easy' ? '3x3' : difficultyLevel === 'medium' ? '4x4' : '5x5',
        timeLimit: difficultyLevel === 'challenging',
        hints: difficultyLevel === 'easy',
      },
      'mini-quest': {
        stages: difficultyLevel === 'easy' ? 3 : difficultyLevel === 'medium' ? 5 : 7,
        combat: difficultyLevel !== 'easy',
        exploration: true,
      },
      educational: {
        subject: interests.includes('science') ? 'science' : interests.includes('math') ? 'math' : 'general',
        difficulty: difficultyLevel,
        interactive: true,
      },
    };

    return mechanicsMap[gameStyle] || mechanicsMap.runner;
  }

  /**
   * Generate gift game from questionnaire
   */
  async generateGiftGame(questionnaireId: string): Promise<GiftGame> {
    const questionnaire = this.questionnaires.get(questionnaireId);
    if (!questionnaire) {
      throw new Error(`Questionnaire ${questionnaireId} not found`);
    }

    // Update status
    questionnaire.status = 'generating';
    this.questionnaires.set(questionnaireId, questionnaire);

    // Simulate generation time
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Get personalization params
    const params = this.mapToPersonalizationParams(questionnaire);

    // Create gift game
    const giftGame: GiftGame = {
      id: `gift_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      questionnaireId,
      shareableUrl: this.generateShareableUrl(),
      recipientName: questionnaire.recipientName,
      senderName: questionnaire.senderName,
      gameType: questionnaire.gameStyle,
      templateId: `template_${questionnaire.gameStyle}`,
      gameData: {
        params,
        questionnaire,
      },
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
      views: 0,
      completed: false,
    };

    this.giftGames.set(giftGame.id, giftGame);

    // Update questionnaire status
    questionnaire.status = 'ready';
    this.questionnaires.set(questionnaireId, questionnaire);

    return giftGame;
  }

  /**
   * Generate a unique shareable URL
   */
  private generateShareableUrl(): string {
    const uniqueCode = Math.random().toString(36).substr(2, 12);
    return `https://gameforge.app/play/${uniqueCode}`;
  }

  /**
   * Get gift game by ID
   */
  getGiftGame(id: string): GiftGame | undefined {
    return this.giftGames.get(id);
  }

  /**
   * Get gift game by shareable URL
   */
  getGiftGameByUrl(url: string): GiftGame | undefined {
    return Array.from(this.giftGames.values()).find(
      (game) => game.shareableUrl === url
    );
  }

  /**
   * Track game view
   */
  trackView(gameId: string): void {
    const game = this.giftGames.get(gameId);
    if (game) {
      game.views += 1;
      this.giftGames.set(gameId, game);
    }
  }

  /**
   * Mark game as completed
   */
  markCompleted(gameId: string): void {
    const game = this.giftGames.get(gameId);
    if (game) {
      game.completed = true;
      this.giftGames.set(gameId, game);
    }
  }

  /**
   * Generate preview data for live preview during questionnaire
   */
  generatePreview(questionnaire: Partial<GiftQuestionnaire>): {
    visualPreview: string;
    messagePreview: string;
    gameplayPreview: string;
  } {
    const recipientName = questionnaire.recipientName || '[Name]';
    const senderName = questionnaire.senderName || '[Your Name]';
    const tone = questionnaire.emotionalTone || 'warm-heartfelt';

    return {
      visualPreview: `Art Style: ${questionnaire.gameStyle || 'runner'} with ${tone} theme`,
      messagePreview: `"Dear ${recipientName}, ${senderName} created something special just for you..."`,
      gameplayPreview: `A ${questionnaire.gameDuration || '10-min'} ${
        questionnaire.gameStyle || 'runner'
      } game`,
    };
  }

  /**
   * Get gift game templates optimized for gifts
   */
  getGiftTemplates(): Array<{
    id: string;
    name: string;
    description: string;
    bestFor: string[];
    duration: string;
    preview: string;
  }> {
    return [
      {
        id: 'runner-heartfelt',
        name: 'Heartfelt Runner',
        description: 'A runner where you collect memories and sweet messages',
        bestFor: ['birthday', 'anniversary', 'friendship'],
        duration: '5-10 min',
        preview: '🏃‍♀️💝',
      },
      {
        id: 'story-adventure',
        name: 'Personal Adventure',
        description: 'A story where the recipient is the hero of their own journey',
        bestFor: ['graduation', 'birthday', 'inspirational'],
        duration: '10-15 min',
        preview: '📖✨',
      },
      {
        id: 'puzzle-memory',
        name: 'Memory Puzzle',
        description: 'Piece together photos and memories in a beautiful puzzle',
        bestFor: ['anniversary', 'nostalgic', 'family'],
        duration: '10 min',
        preview: '🧩💭',
      },
      {
        id: 'quest-birthday',
        name: 'Birthday Quest',
        description: 'An epic mini-quest with surprises and birthday wishes',
        bestFor: ['birthday', 'fun-playful'],
        duration: '10-15 min',
        preview: '🎂⚔️',
      },
      {
        id: 'cozy-collection',
        name: 'Cozy Collection',
        description: 'Collect adorable items in a calm, heartwarming experience',
        bestFor: ['just-because', 'thank-you', 'friendship'],
        duration: '5-10 min',
        preview: '🐱🌸',
      },
    ];
  }

  /**
   * Get suggested traits based on interests
   */
  getSuggestedTraits(interests: string[]): string[] {
    const traitMap: Record<string, string[]> = {
      sports: ['competitive', 'energetic', 'determined'],
      music: ['creative', 'passionate', 'expressive'],
      reading: ['thoughtful', 'imaginative', 'curious'],
      travel: ['adventurous', 'open-minded', 'brave'],
      art: ['creative', 'artistic', 'sensitive'],
      tech: ['analytical', 'innovative', 'logical'],
      animals: ['caring', 'nurturing', 'gentle'],
      gaming: ['strategic', 'fun-loving', 'competitive'],
    };

    const suggested = new Set<string>();
    interests.forEach((interest) => {
      const traits = traitMap[interest.toLowerCase()] || [];
      traits.forEach((trait) => suggested.add(trait));
    });

    return Array.from(suggested);
  }

  /**
   * Validate questionnaire completeness
   */
  validateQuestionnaire(questionnaire: GiftQuestionnaire): {
    valid: boolean;
    missingFields: string[];
  } {
    const required: Array<keyof GiftQuestionnaire> = [
      'recipientName',
      'senderName',
      'occasion',
      'relationship',
      'emotionalTone',
      'gameStyle',
    ];

    const missingFields: string[] = [];

    required.forEach((field) => {
      if (!questionnaire[field]) {
        missingFields.push(field);
      }
    });

    return {
      valid: missingFields.length === 0,
      missingFields,
    };
  }
}

export const giftGameService = new GiftGameService();
