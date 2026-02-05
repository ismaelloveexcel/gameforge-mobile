/**
 * WildCardService - Surprise and randomization features
 * Adds unexpected delights and random elements to games
 */

export interface WildCardEvent {
  id: string;
  type: WildCardType;
  title: string;
  description: string;
  effect: WildCardEffect;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  duration?: number; // in seconds
  icon?: string;
  color?: string;
}

export type WildCardType =
  | 'power_up'
  | 'challenge'
  | 'surprise_gift'
  | 'mini_game'
  | 'easter_egg'
  | 'plot_twist'
  | 'bonus_round'
  | 'mystery_box';

export interface WildCardEffect {
  type: 'positive' | 'negative' | 'neutral';
  impact: 'minor' | 'moderate' | 'major';
  action?: string;
  value?: number;
}

export interface RandomizerOptions {
  seed?: number;
  weighted?: boolean;
  weights?: number[];
}

class WildCardService {
  private eventHistory: WildCardEvent[] = [];
  private randomSeed: number = Date.now();

  /**
   * Generate a random wildcard event
   */
  generateWildCard(
    context: 'game' | 'gift' | 'story',
    difficulty: 'easy' | 'medium' | 'hard' = 'medium'
  ): WildCardEvent {
    const events = this.getWildCardPool(context, difficulty);
    const selected = this.randomSelect(events);
    
    this.eventHistory.push(selected);
    return selected;
  }

  /**
   * Get a mystery surprise
   */
  getMysterySurprise(): {
    revealed: boolean;
    surprise: string;
    emoji: string;
  } {
    const surprises = [
      { surprise: 'Double points for the next round!', emoji: '⭐' },
      { surprise: 'Unlock a secret level!', emoji: '🔓' },
      { surprise: 'Extra life granted!', emoji: '❤️' },
      { surprise: 'Time freeze activated!', emoji: '⏸️' },
      { surprise: 'Rainbow power-up!', emoji: '🌈' },
      { surprise: 'Bonus treasure chest!', emoji: '💎' },
      { surprise: 'Speed boost!', emoji: '⚡' },
      { surprise: 'Invincibility shield!', emoji: '🛡️' },
      { surprise: 'Golden ticket found!', emoji: '🎫' },
      { surprise: 'Magical transformation!', emoji: '✨' },
    ];

    const selected = this.randomSelect(surprises);
    return {
      revealed: true,
      ...selected,
    };
  }

  /**
   * Generate random power-ups
   */
  generatePowerUp(): {
    name: string;
    description: string;
    duration: number;
    icon: string;
    effect: string;
  } {
    const powerUps = [
      {
        name: 'Speed Burst',
        description: 'Move twice as fast!',
        duration: 10,
        icon: '⚡',
        effect: 'speed_boost',
      },
      {
        name: 'Shield',
        description: 'Become invincible!',
        duration: 15,
        icon: '🛡️',
        effect: 'invincibility',
      },
      {
        name: 'Magnet',
        description: 'Attract all collectibles!',
        duration: 12,
        icon: '🧲',
        effect: 'magnet',
      },
      {
        name: 'Double Score',
        description: 'Earn 2x points!',
        duration: 20,
        icon: '💰',
        effect: 'score_multiplier',
      },
      {
        name: 'Time Freeze',
        description: 'Stop time!',
        duration: 8,
        icon: '⏸️',
        effect: 'time_freeze',
      },
      {
        name: 'Super Jump',
        description: 'Jump extra high!',
        duration: 15,
        icon: '🚀',
        effect: 'jump_boost',
      },
      {
        name: 'X-Ray Vision',
        description: 'See hidden items!',
        duration: 10,
        icon: '👁️',
        effect: 'reveal_hidden',
      },
      {
        name: 'Lucky Charm',
        description: 'Increase rare drops!',
        duration: 30,
        icon: '🍀',
        effect: 'luck_boost',
      },
    ];

    return this.randomSelect(powerUps);
  }

  /**
   * Create random challenges
   */
  generateChallenge(): {
    title: string;
    description: string;
    difficulty: 'easy' | 'medium' | 'hard';
    reward: string;
    timeLimit?: number;
  } {
    const challenges = [
      {
        title: 'Speed Run',
        description: 'Complete in under 30 seconds!',
        difficulty: 'medium' as const,
        reward: 'Bonus 500 points',
        timeLimit: 30,
      },
      {
        title: 'Perfect Score',
        description: 'Get 100% completion!',
        difficulty: 'hard' as const,
        reward: 'Golden trophy',
      },
      {
        title: 'No Mistakes',
        description: 'Complete without errors!',
        difficulty: 'hard' as const,
        reward: 'Perfect badge',
      },
      {
        title: 'Collector',
        description: 'Collect all items!',
        difficulty: 'medium' as const,
        reward: 'Treasure chest',
      },
      {
        title: 'Marathon',
        description: 'Survive for 2 minutes!',
        difficulty: 'easy' as const,
        reward: 'Endurance medal',
        timeLimit: 120,
      },
    ];

    return this.randomSelect(challenges);
  }

  /**
   * Generate plot twist for stories
   */
  generatePlotTwist(storyContext: string): string {
    const twists = [
      'Suddenly, the mysterious stranger reveals they knew you all along!',
      'The treasure you seek was with you the entire time!',
      'A secret door appears that wasn\'t there before...',
      'Your companion has been hiding a magical power!',
      'The villain turns out to be trying to help you!',
      'You discover you\'re in a simulation within a simulation!',
      'The map was actually leading you home all along!',
      'Your memory of past events has been altered!',
      'The quest was a test, and you\'ve already won!',
      'Everything transforms into its opposite!',
    ];

    return this.randomSelect(twists);
  }

  /**
   * Randomize array order
   */
  shuffle<T>(array: T[], options?: RandomizerOptions): T[] {
    const arr = [...array];
    const seed = options?.seed || this.randomSeed;
    
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(this.seededRandom(seed + i) * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    
    return arr;
  }

  /**
   * Pick random items from array
   */
  randomPick<T>(array: T[], count: number = 1, options?: RandomizerOptions): T[] {
    if (count >= array.length) return [...array];
    
    const shuffled = this.shuffle(array, options);
    return shuffled.slice(0, count);
  }

  /**
   * Weighted random selection
   */
  weightedRandom<T>(items: T[], weights: number[]): T {
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    let random = Math.random() * totalWeight;
    
    for (let i = 0; i < items.length; i++) {
      random -= weights[i];
      if (random <= 0) {
        return items[i];
      }
    }
    
    return items[items.length - 1];
  }

  /**
   * Generate random number in range
   */
  randomInRange(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Roll dice
   */
  rollDice(sides: number = 6, count: number = 1): number[] {
    return Array.from({ length: count }, () => this.randomInRange(1, sides));
  }

  /**
   * Coin flip
   */
  coinFlip(): 'heads' | 'tails' {
    return Math.random() < 0.5 ? 'heads' : 'tails';
  }

  /**
   * Generate random Easter egg
   */
  generateEasterEgg(): {
    type: 'secret_message' | 'hidden_character' | 'bonus_content' | 'achievement';
    content: string;
    hint: string;
  } {
    const easterEggs = [
      {
        type: 'secret_message' as const,
        content: 'You found the developer\'s secret message! 🎉',
        hint: 'Look in the most unexpected places...',
      },
      {
        type: 'hidden_character' as const,
        content: 'A mysterious character appears!',
        hint: 'They only show up to the curious...',
      },
      {
        type: 'bonus_content' as const,
        content: 'Unlocked: Secret level!',
        hint: 'Sometimes the journey matters more than the destination...',
      },
      {
        type: 'achievement' as const,
        content: 'Achievement Unlocked: Easter Egg Hunter!',
        hint: 'Keep exploring!',
      },
    ];

    return this.randomSelect(easterEggs);
  }

  /**
   * Get wildcard event history
   */
  getEventHistory(): WildCardEvent[] {
    return [...this.eventHistory];
  }

  /**
   * Clear event history
   */
  clearHistory(): void {
    this.eventHistory = [];
  }

  // Private helper methods

  private getWildCardPool(context: string, difficulty: string): WildCardEvent[] {
    const baseEvents: WildCardEvent[] = [
      {
        id: 'power_boost',
        type: 'power_up',
        title: 'Power Boost!',
        description: 'You feel a surge of energy!',
        effect: { type: 'positive', impact: 'moderate', action: 'boost_power' },
        rarity: 'common',
        duration: 15,
        icon: '⚡',
        color: '#FFD700',
      },
      {
        id: 'surprise_gift',
        type: 'surprise_gift',
        title: 'Surprise Gift!',
        description: 'You found a mysterious gift!',
        effect: { type: 'positive', impact: 'minor', action: 'give_item' },
        rarity: 'uncommon',
        icon: '🎁',
        color: '#FF69B4',
      },
      {
        id: 'plot_twist',
        type: 'plot_twist',
        title: 'Unexpected Turn!',
        description: 'The story takes an unexpected turn!',
        effect: { type: 'neutral', impact: 'major', action: 'change_story' },
        rarity: 'rare',
        icon: '🌀',
        color: '#9370DB',
      },
      {
        id: 'bonus_round',
        type: 'bonus_round',
        title: 'Bonus Round!',
        description: 'Enter a special bonus challenge!',
        effect: { type: 'positive', impact: 'major', action: 'start_bonus' },
        rarity: 'epic',
        duration: 60,
        icon: '🌟',
        color: '#00CED1',
      },
      {
        id: 'mystery_box',
        type: 'mystery_box',
        title: 'Mystery Box!',
        description: 'What could be inside?',
        effect: { type: 'neutral', impact: 'moderate', action: 'random_effect' },
        rarity: 'uncommon',
        icon: '📦',
        color: '#8B4513',
      },
    ];

    return baseEvents;
  }

  private randomSelect<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  private seededRandom(seed: number): number {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  }
}

// Export singleton instance
export const wildCardService = new WildCardService();
export default wildCardService;
