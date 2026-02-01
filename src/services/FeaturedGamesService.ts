/**
 * FeaturedGamesService - Bridges agent-created games to user app
 * 
 * This service fetches games from the shared content database
 * (populated by GameDevelopmentHub agents) and serves them to users.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

// Types
export type GameTier = 'free' | 'featured' | 'premium' | 'exclusive';
export type GameCategory = 'seasonal' | 'trending' | 'curated' | 'classic';

export interface FeaturedGame {
  id: string;
  name: string;
  tagline: string;
  description: string;
  thumbnail: string;
  tier: GameTier;
  priceAED: number;
  category: GameCategory;
  occasion?: string;
  seasonalTag?: string;
  validUntil?: Date;
  stats: {
    gifted: number;
    avgRating: number;
    trending: boolean;
  };
  personalization: {
    recipientName: boolean;
    senderName: boolean;
    customMessage: boolean;
    photoUpload: boolean;
    voiceMessage: boolean;
  };
  previewUrl: string;
  duration: string; // "5-10 min"
  createdBy: 'agent' | 'community' | 'internal';
  createdAt: Date;
}

export interface SeasonalDrop {
  id: string;
  name: string;
  tagline: string;
  startDate: Date;
  endDate: Date;
  theme: string; // matches seasonal theme ID
  games: FeaturedGame[];
  banner: {
    title: string;
    subtitle: string;
    gradient: string[];
  };
}

export interface GiftOrder {
  id: string;
  gameId: string;
  recipientName: string;
  senderName: string;
  message: string;
  priceAED: number;
  shareUrl: string;
  createdAt: Date;
  status: 'pending' | 'paid' | 'shared' | 'played';
}

const FEATURED_CACHE_KEY = '@gameforge_featured_cache';
const ORDERS_KEY = '@gameforge_orders';

class FeaturedGamesService {
  private cache: FeaturedGame[] = [];
  private lastFetch: Date | null = null;
  private cacheTimeout = 1000 * 60 * 30; // 30 minutes

  /**
   * Get all featured games (with caching)
   */
  async getFeaturedGames(): Promise<FeaturedGame[]> {
    // Check cache freshness
    if (this.cache.length > 0 && this.lastFetch) {
      const age = Date.now() - this.lastFetch.getTime();
      if (age < this.cacheTimeout) {
        return this.cache;
      }
    }

    // Try to load from AsyncStorage
    try {
      const stored = await AsyncStorage.getItem(FEATURED_CACHE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        this.cache = parsed.games;
        this.lastFetch = new Date(parsed.lastFetch);
        
        // If cache is still fresh, use it
        const age = Date.now() - this.lastFetch.getTime();
        if (age < this.cacheTimeout) {
          return this.cache;
        }
      }
    } catch (e) {
      console.log('Failed to load featured games cache');
    }

    // Fetch fresh data (in production, this would call the Content API)
    const games = await this.fetchFromAPI();
    
    // Update cache
    this.cache = games;
    this.lastFetch = new Date();
    
    // Persist to AsyncStorage
    try {
      await AsyncStorage.setItem(FEATURED_CACHE_KEY, JSON.stringify({
        games: this.cache,
        lastFetch: this.lastFetch.toISOString(),
      }));
    } catch (e) {
      console.log('Failed to save featured games cache');
    }

    return games;
  }

  /**
   * Get current seasonal drop (if active)
   */
  async getCurrentSeasonalDrop(): Promise<SeasonalDrop | null> {
    const now = new Date();
    const month = now.getMonth() + 1;
    const day = now.getDate();

    // Valentine's Drop (Feb 1-14)
    if (month === 2 && day >= 1 && day <= 14) {
      return {
        id: 'valentines-2026',
        name: "Valentine's Drop",
        tagline: '3 New Games · Limited Time',
        startDate: new Date('2026-02-01'),
        endDate: new Date('2026-02-14'),
        theme: 'eternal-romance',
        banner: {
          title: "Valentine's Drop",
          subtitle: 'Made with love, share with love',
          gradient: ['#8B0A1A', '#D4AF37'],
        },
        games: [
          {
            id: 'love-quest-v2026',
            name: 'Love Quest',
            tagline: 'A journey through your love story',
            description: 'Guide your partner through memories you share together',
            thumbnail: 'assets/games/love-quest.png',
            tier: 'featured',
            priceAED: 15,
            category: 'seasonal',
            occasion: 'valentines',
            seasonalTag: 'valentines-2026',
            validUntil: new Date('2026-02-14'),
            stats: { gifted: 247, avgRating: 4.8, trending: true },
            personalization: {
              recipientName: true,
              senderName: true,
              customMessage: true,
              photoUpload: true,
              voiceMessage: false,
            },
            previewUrl: 'https://gameforge.app/preview/love-quest',
            duration: '10-15 min',
            createdBy: 'agent',
            createdAt: new Date('2026-01-28'),
          },
          {
            id: 'memory-lane-v2026',
            name: 'Memory Lane',
            tagline: 'A puzzle of your precious moments',
            description: 'Match memories and unlock sweet messages',
            thumbnail: 'assets/games/memory-lane.png',
            tier: 'featured',
            priceAED: 12,
            category: 'seasonal',
            occasion: 'valentines',
            seasonalTag: 'valentines-2026',
            validUntil: new Date('2026-02-14'),
            stats: { gifted: 189, avgRating: 4.6, trending: true },
            personalization: {
              recipientName: true,
              senderName: true,
              customMessage: true,
              photoUpload: false,
              voiceMessage: false,
            },
            previewUrl: 'https://gameforge.app/preview/memory-lane',
            duration: '5-10 min',
            createdBy: 'agent',
            createdAt: new Date('2026-01-30'),
          },
          {
            id: 'rose-runner-v2026',
            name: 'Rose Runner',
            tagline: 'Collect roses, dodge thorns, find love',
            description: 'A sweet endless runner collecting roses for your love',
            thumbnail: 'assets/games/rose-runner.png',
            tier: 'free',
            priceAED: 0,
            category: 'seasonal',
            occasion: 'valentines',
            seasonalTag: 'valentines-2026',
            validUntil: new Date('2026-02-14'),
            stats: { gifted: 412, avgRating: 4.4, trending: true },
            personalization: {
              recipientName: true,
              senderName: true,
              customMessage: true,
              photoUpload: false,
              voiceMessage: false,
            },
            previewUrl: 'https://gameforge.app/preview/rose-runner',
            duration: '3-5 min',
            createdBy: 'agent',
            createdAt: new Date('2026-01-25'),
          },
        ],
      };
    }

    // Ramadan Drop (Feb 18 - Mar 19 for 2026)
    if ((month === 2 && day >= 18) || (month === 3 && day <= 19)) {
      return {
        id: 'ramadan-2026',
        name: 'Ramadan Collection',
        tagline: 'Games for the blessed month',
        startDate: new Date('2026-02-18'),
        endDate: new Date('2026-03-19'),
        theme: 'nocturnal-revival',
        banner: {
          title: 'Ramadan Collection',
          subtitle: 'Send blessings, share joy',
          gradient: ['#4A3F6B', '#F4B942'],
        },
        games: [], // Would be populated by agents
      };
    }

    return null;
  }

  /**
   * Get trending games (most gifted this week)
   */
  async getTrendingGames(limit: number = 6): Promise<FeaturedGame[]> {
    const all = await this.getFeaturedGames();
    return all
      .filter(g => g.stats.trending || g.stats.gifted > 50)
      .sort((a, b) => b.stats.gifted - a.stats.gifted)
      .slice(0, limit);
  }

  /**
   * Get curated/premium games
   */
  async getCuratedGames(limit: number = 4): Promise<FeaturedGame[]> {
    const all = await this.getFeaturedGames();
    return all
      .filter(g => g.tier === 'premium' || g.tier === 'exclusive')
      .sort((a, b) => b.stats.avgRating - a.stats.avgRating)
      .slice(0, limit);
  }

  /**
   * Get games by occasion
   */
  async getGamesByOccasion(occasion: string): Promise<FeaturedGame[]> {
    const all = await this.getFeaturedGames();
    return all.filter(g => g.occasion === occasion);
  }

  /**
   * Create an instant gift (minimal personalization)
   */
  async createInstantGift(
    gameId: string,
    recipientName: string,
    senderName: string
  ): Promise<GiftOrder> {
    const games = await this.getFeaturedGames();
    const game = games.find(g => g.id === gameId);
    
    if (!game) {
      throw new Error('Game not found');
    }

    const order: GiftOrder = {
      id: `gift-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      gameId,
      recipientName,
      senderName,
      message: '', // Instant gifts have no custom message
      priceAED: game.priceAED,
      shareUrl: `https://gameforge.app/play/${gameId}?gift=${Date.now()}`,
      createdAt: new Date(),
      status: game.priceAED === 0 ? 'paid' : 'pending',
    };

    // Save order
    await this.saveOrder(order);

    return order;
  }

  /**
   * Save a gift order
   */
  private async saveOrder(order: GiftOrder): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem(ORDERS_KEY);
      const orders: GiftOrder[] = stored ? JSON.parse(stored) : [];
      orders.push(order);
      await AsyncStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    } catch (e) {
      console.error('Failed to save order:', e);
    }
  }

  /**
   * Get user's gift history
   */
  async getMyGifts(): Promise<GiftOrder[]> {
    try {
      const stored = await AsyncStorage.getItem(ORDERS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  }

  /**
   * Fetch from API (mock for now)
   * In production, this calls the shared Supabase/Firebase database
   */
  private async fetchFromAPI(): Promise<FeaturedGame[]> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    // Return mock data (in production, fetch from shared database)
    return [
      {
        id: 'birthday-bash-classic',
        name: 'Birthday Bash',
        tagline: 'The ultimate birthday celebration game',
        description: 'A fun party game with cake, candles, and surprises',
        thumbnail: 'assets/games/birthday-bash.png',
        tier: 'free',
        priceAED: 0,
        category: 'classic',
        occasion: 'birthday',
        stats: { gifted: 1247, avgRating: 4.7, trending: true },
        personalization: {
          recipientName: true,
          senderName: true,
          customMessage: true,
          photoUpload: false,
          voiceMessage: false,
        },
        previewUrl: 'https://gameforge.app/preview/birthday-bash',
        duration: '5-7 min',
        createdBy: 'internal',
        createdAt: new Date('2025-12-01'),
      },
      {
        id: 'graduate-glory',
        name: 'Graduate Glory',
        tagline: 'Celebrate their achievement',
        description: 'A triumphant journey through graduation day',
        thumbnail: 'assets/games/graduate-glory.png',
        tier: 'featured',
        priceAED: 10,
        category: 'trending',
        occasion: 'graduation',
        stats: { gifted: 589, avgRating: 4.5, trending: true },
        personalization: {
          recipientName: true,
          senderName: true,
          customMessage: true,
          photoUpload: true,
          voiceMessage: false,
        },
        previewUrl: 'https://gameforge.app/preview/graduate-glory',
        duration: '8-10 min',
        createdBy: 'agent',
        createdAt: new Date('2026-01-15'),
      },
      {
        id: 'cozy-cat-quest',
        name: 'Cozy Cat Quest',
        tagline: 'For the cat lover in your life',
        description: 'A heartwarming adventure with adorable cats',
        thumbnail: 'assets/games/cozy-cat-quest.png',
        tier: 'premium',
        priceAED: 20,
        category: 'curated',
        stats: { gifted: 156, avgRating: 4.9, trending: false },
        personalization: {
          recipientName: true,
          senderName: true,
          customMessage: true,
          photoUpload: true,
          voiceMessage: true,
        },
        previewUrl: 'https://gameforge.app/preview/cozy-cat-quest',
        duration: '10-15 min',
        createdBy: 'agent',
        createdAt: new Date('2026-01-28'),
      },
      {
        id: 'farewell-friend',
        name: 'Farewell Friend',
        tagline: 'Say goodbye in style',
        description: 'A touching tribute for someone moving on',
        thumbnail: 'assets/games/farewell-friend.png',
        tier: 'featured',
        priceAED: 15,
        category: 'trending',
        occasion: 'farewell',
        stats: { gifted: 312, avgRating: 4.6, trending: true },
        personalization: {
          recipientName: true,
          senderName: true,
          customMessage: true,
          photoUpload: true,
          voiceMessage: false,
        },
        previewUrl: 'https://gameforge.app/preview/farewell-friend',
        duration: '7-10 min',
        createdBy: 'agent',
        createdAt: new Date('2026-01-20'),
      },
    ];
  }

  /**
   * Clear cache (for testing/refresh)
   */
  async clearCache(): Promise<void> {
    this.cache = [];
    this.lastFetch = null;
    await AsyncStorage.removeItem(FEATURED_CACHE_KEY);
  }
}

export const featuredGamesService = new FeaturedGamesService();
