/**
 * ContentDatabase - Unified database layer for GameForge ecosystem
 * 
 * Uses Firebase Firestore as the shared database between:
 * - GameDevelopmentHub (agents push content)
 * - GameForge Mobile (users consume content)
 * 
 * Collections:
 * - featured_games: Agent-created and curated games
 * - seasonal_drops: Limited-time themed collections
 * - gift_orders: Purchase and gift records
 * - gift_memories: User's gift history (sent/received)
 * - analytics: Aggregated performance data
 */

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  Firestore,
  DocumentData,
} from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FeaturedGame, SeasonalDrop, GiftOrder, GameTier, GameCategory } from './FeaturedGamesService';

// Firebase config - use environment variables in production
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || 'demo-key',
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || 'gameforge-demo.firebaseapp.com',
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || 'gameforge-demo',
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || 'gameforge-demo.appspot.com',
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || '1:123456789:web:abcdef',
};

// Collection names
const COLLECTIONS = {
  FEATURED_GAMES: 'featured_games',
  SEASONAL_DROPS: 'seasonal_drops',
  GIFT_ORDERS: 'gift_orders',
  GIFT_MEMORIES: 'gift_memories',
  ANALYTICS: 'analytics',
  PENDING_APPROVALS: 'pending_approvals',
} as const;

// Cache keys
const CACHE_KEYS = {
  FEATURED_GAMES: '@gameforge_featured_v2',
  SEASONAL_DROP: '@gameforge_seasonal_v2',
  USER_ID: '@gameforge_user_id',
};

class ContentDatabase {
  private app: FirebaseApp | null = null;
  private db: Firestore | null = null;
  private initialized: boolean = false;
  private userId: string | null = null;
  private isOfflineMode: boolean = false;

  /**
   * Initialize Firebase connection
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      // Check if Firebase app already exists
      if (getApps().length === 0) {
        this.app = initializeApp(firebaseConfig);
      } else {
        this.app = getApps()[0];
      }
      
      this.db = getFirestore(this.app);
      this.initialized = true;
      
      // Get or create user ID for gift tracking
      await this.ensureUserId();
      
      console.log('ContentDatabase initialized');
    } catch (error) {
      console.warn('Firebase initialization failed, running in offline mode:', error);
      this.isOfflineMode = true;
      this.initialized = true;
    }
  }

  /**
   * Ensure we have a unique user ID for gift tracking
   */
  private async ensureUserId(): Promise<string> {
    if (this.userId) return this.userId;

    try {
      const stored = await AsyncStorage.getItem(CACHE_KEYS.USER_ID);
      if (stored) {
        this.userId = stored;
      } else {
        this.userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        await AsyncStorage.setItem(CACHE_KEYS.USER_ID, this.userId);
      }
    } catch {
      this.userId = `anon_${Date.now()}`;
    }
    
    return this.userId;
  }

  /**
   * Fetch all live featured games
   */
  async getFeaturedGames(): Promise<FeaturedGame[]> {
    await this.initialize();

    // In offline mode, return cached or mock data
    if (this.isOfflineMode || !this.db) {
      return this.getOfflineFeaturedGames();
    }

    try {
      const gamesRef = collection(this.db, COLLECTIONS.FEATURED_GAMES);
      const q = query(
        gamesRef,
        where('status', '==', 'live'),
        orderBy('stats.gifted', 'desc'),
        limit(50)
      );
      
      const snapshot = await getDocs(q);
      const games: FeaturedGame[] = [];
      
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        games.push(this.transformGameDoc(docSnap.id, data));
      });

      // Cache the results
      await this.cacheGames(games);
      
      return games;
    } catch (error) {
      console.warn('Failed to fetch games, using cache:', error);
      return this.getOfflineFeaturedGames();
    }
  }

  /**
   * Get currently active seasonal drop
   */
  async getCurrentSeasonalDrop(): Promise<SeasonalDrop | null> {
    await this.initialize();

    const now = new Date();
    
    if (this.isOfflineMode || !this.db) {
      return this.getOfflineSeasonalDrop(now);
    }

    try {
      const dropsRef = collection(this.db, COLLECTIONS.SEASONAL_DROPS);
      const q = query(
        dropsRef,
        where('startDate', '<=', Timestamp.fromDate(now)),
        where('endDate', '>=', Timestamp.fromDate(now)),
        where('status', '==', 'active'),
        limit(1)
      );
      
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        return this.getOfflineSeasonalDrop(now);
      }
      
      const docSnap = snapshot.docs[0];
      const data = docSnap.data();
      
      // Fetch games for this drop
      const games = await this.getGamesBySeasonalTag(data.id);
      
      return {
        id: docSnap.id,
        name: data.name,
        tagline: data.tagline,
        startDate: data.startDate.toDate(),
        endDate: data.endDate.toDate(),
        theme: data.theme,
        games,
        banner: data.banner,
      };
    } catch (error) {
      console.warn('Failed to fetch seasonal drop:', error);
      return this.getOfflineSeasonalDrop(now);
    }
  }

  /**
   * Get games by seasonal tag
   */
  private async getGamesBySeasonalTag(seasonalTag: string): Promise<FeaturedGame[]> {
    if (!this.db) return [];

    try {
      const gamesRef = collection(this.db, COLLECTIONS.FEATURED_GAMES);
      const q = query(
        gamesRef,
        where('seasonalTag', '==', seasonalTag),
        where('status', '==', 'live')
      );
      
      const snapshot = await getDocs(q);
      const games: FeaturedGame[] = [];
      
      snapshot.forEach((docSnap) => {
        games.push(this.transformGameDoc(docSnap.id, docSnap.data()));
      });
      
      return games;
    } catch {
      return [];
    }
  }

  /**
   * Create a gift order
   */
  async createGiftOrder(
    game: FeaturedGame,
    recipientName: string,
    senderName: string,
    message: string = ''
  ): Promise<GiftOrder> {
    await this.initialize();
    const userId = await this.ensureUserId();
    
    const orderId = `gift_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const shareUrl = `https://gameforge.app/play/${game.id}?gift=${orderId}`;
    
    const order: GiftOrder = {
      id: orderId,
      gameId: game.id,
      recipientName,
      senderName,
      message,
      priceAED: game.priceAED,
      shareUrl,
      createdAt: new Date(),
      status: game.priceAED === 0 ? 'paid' : 'pending',
    };

    // Save to Firestore if online
    if (!this.isOfflineMode && this.db) {
      try {
        await setDoc(doc(this.db, COLLECTIONS.GIFT_ORDERS, orderId), {
          ...order,
          createdAt: Timestamp.fromDate(order.createdAt),
          userId,
          gameName: game.name,
          gameTier: game.tier,
        });
      } catch (error) {
        console.warn('Failed to save order to Firestore:', error);
      }
    }

    // Always save locally for offline access
    await this.saveLocalOrder(order);

    return order;
  }

  /**
   * Update gift order status (after payment)
   */
  async updateOrderStatus(orderId: string, status: GiftOrder['status']): Promise<void> {
    await this.initialize();

    if (!this.isOfflineMode && this.db) {
      try {
        await updateDoc(doc(this.db, COLLECTIONS.GIFT_ORDERS, orderId), { status });
      } catch (error) {
        console.warn('Failed to update order status:', error);
      }
    }

    // Update local cache
    await this.updateLocalOrderStatus(orderId, status);
  }

  /**
   * Record gift memory (for Gift Memories screen)
   */
  async recordGiftMemory(
    orderId: string,
    type: 'sent' | 'received',
    gameName: string,
    otherPartyName: string
  ): Promise<void> {
    await this.initialize();
    const userId = await this.ensureUserId();

    const memory = {
      id: `memory_${Date.now()}`,
      orderId,
      type,
      gameName,
      otherPartyName,
      createdAt: new Date(),
      playCount: type === 'received' ? 0 : undefined,
    };

    if (!this.isOfflineMode && this.db) {
      try {
        const memoryId = `${userId}_${orderId}`;
        await setDoc(doc(this.db, COLLECTIONS.GIFT_MEMORIES, memoryId), {
          ...memory,
          userId,
          createdAt: Timestamp.fromDate(memory.createdAt),
        });
      } catch (error) {
        console.warn('Failed to save gift memory:', error);
      }
    }

    // Save locally
    await this.saveLocalMemory(memory);
  }

  /**
   * Get user's gift memories
   */
  async getGiftMemories(): Promise<{
    sent: Array<{ id: string; gameName: string; recipientName: string; date: Date }>;
    received: Array<{ id: string; gameName: string; senderName: string; date: Date; playCount: number }>;
  }> {
    await this.initialize();
    const userId = await this.ensureUserId();

    // Try to get from Firestore first
    if (!this.isOfflineMode && this.db) {
      try {
        const memoriesRef = collection(this.db, COLLECTIONS.GIFT_MEMORIES);
        const q = query(
          memoriesRef,
          where('userId', '==', userId),
          orderBy('createdAt', 'desc'),
          limit(100)
        );
        
        const snapshot = await getDocs(q);
        const sent: Array<{ id: string; gameName: string; recipientName: string; date: Date }> = [];
        const received: Array<{ id: string; gameName: string; senderName: string; date: Date; playCount: number }> = [];
        
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          if (data.type === 'sent') {
            sent.push({
              id: docSnap.id,
              gameName: data.gameName,
              recipientName: data.otherPartyName,
              date: data.createdAt.toDate(),
            });
          } else {
            received.push({
              id: docSnap.id,
              gameName: data.gameName,
              senderName: data.otherPartyName,
              date: data.createdAt.toDate(),
              playCount: data.playCount || 0,
            });
          }
        });
        
        return { sent, received };
      } catch (error) {
        console.warn('Failed to fetch memories:', error);
      }
    }

    // Fall back to local storage
    return this.getLocalMemories();
  }

  /**
   * Increment analytics counter
   */
  async trackEvent(event: 'game_created' | 'game_shared' | 'game_played' | 'gift_sent', gameId?: string): Promise<void> {
    await this.initialize();
    
    if (!this.isOfflineMode && this.db) {
      try {
        const today = new Date().toISOString().split('T')[0];
        const analyticsRef = doc(this.db, COLLECTIONS.ANALYTICS, today);
        
        // Use increment in production
        await updateDoc(analyticsRef, {
          [`counts.${event}`]: 1, // Would use FieldValue.increment(1) in production
          lastUpdated: Timestamp.now(),
        }).catch(async () => {
          // Document doesn't exist, create it
          await setDoc(analyticsRef, {
            date: today,
            counts: { [event]: 1 },
            lastUpdated: Timestamp.now(),
          });
        });
      } catch (error) {
        console.warn('Analytics tracking failed:', error);
      }
    }
  }

  // ==================== Private Helper Methods ====================

  private transformGameDoc(id: string, data: DocumentData): FeaturedGame {
    return {
      id,
      name: data.name,
      tagline: data.tagline,
      description: data.description || '',
      thumbnail: data.thumbnail,
      tier: data.tier as GameTier,
      priceAED: data.priceAED || 0,
      category: data.category as GameCategory,
      occasion: data.occasion,
      seasonalTag: data.seasonalTag,
      validUntil: data.validUntil?.toDate(),
      stats: {
        gifted: data.stats?.gifted || 0,
        avgRating: data.stats?.avgRating || 0,
        trending: data.stats?.trending || false,
      },
      personalization: data.personalization || {
        recipientName: true,
        senderName: true,
        customMessage: true,
        photoUpload: false,
        voiceMessage: false,
      },
      previewUrl: data.previewUrl || '',
      duration: data.duration || '5-10 min',
      createdBy: data.createdBy || 'agent',
      createdAt: data.createdAt?.toDate() || new Date(),
    };
  }

  private async cacheGames(games: FeaturedGame[]): Promise<void> {
    try {
      await AsyncStorage.setItem(CACHE_KEYS.FEATURED_GAMES, JSON.stringify({
        games,
        cachedAt: new Date().toISOString(),
      }));
    } catch {
      // Ignore cache errors
    }
  }

  private async getOfflineFeaturedGames(): Promise<FeaturedGame[]> {
    try {
      const cached = await AsyncStorage.getItem(CACHE_KEYS.FEATURED_GAMES);
      if (cached) {
        const { games } = JSON.parse(cached);
        return games;
      }
    } catch {
      // Fall through to mock data
    }

    // Return hardcoded games for offline mode
    return this.getMockGames();
  }

  private getOfflineSeasonalDrop(now: Date): SeasonalDrop | null {
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
        games: this.getValentineGames(),
      };
    }

    // Ramadan Drop
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
        games: [],
      };
    }

    return null;
  }

  private getValentineGames(): FeaturedGame[] {
    return [
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
    ];
  }

  private getMockGames(): FeaturedGame[] {
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

  private async saveLocalOrder(order: GiftOrder): Promise<void> {
    try {
      const key = '@gameforge_orders';
      const stored = await AsyncStorage.getItem(key);
      const orders: GiftOrder[] = stored ? JSON.parse(stored) : [];
      orders.unshift(order);
      await AsyncStorage.setItem(key, JSON.stringify(orders.slice(0, 100))); // Keep last 100
    } catch {
      // Ignore
    }
  }

  private async updateLocalOrderStatus(orderId: string, status: GiftOrder['status']): Promise<void> {
    try {
      const key = '@gameforge_orders';
      const stored = await AsyncStorage.getItem(key);
      if (stored) {
        const orders: GiftOrder[] = JSON.parse(stored);
        const updated = orders.map(o => o.id === orderId ? { ...o, status } : o);
        await AsyncStorage.setItem(key, JSON.stringify(updated));
      }
    } catch {
      // Ignore
    }
  }

  private async saveLocalMemory(memory: { id: string; type: string; gameName: string; otherPartyName: string; createdAt: Date }): Promise<void> {
    try {
      const key = '@gameforge_memories';
      const stored = await AsyncStorage.getItem(key);
      const memories: typeof memory[] = stored ? JSON.parse(stored) : [];
      memories.unshift(memory);
      await AsyncStorage.setItem(key, JSON.stringify(memories.slice(0, 200))); // Keep last 200
    } catch {
      // Ignore
    }
  }

  private async getLocalMemories(): Promise<{
    sent: Array<{ id: string; gameName: string; recipientName: string; date: Date }>;
    received: Array<{ id: string; gameName: string; senderName: string; date: Date; playCount: number }>;
  }> {
    try {
      const key = '@gameforge_memories';
      const stored = await AsyncStorage.getItem(key);
      if (stored) {
        const memories = JSON.parse(stored);
        const sent = memories
          .filter((m: { type: string }) => m.type === 'sent')
          .map((m: { id: string; gameName: string; otherPartyName: string; createdAt: string }) => ({
            id: m.id,
            gameName: m.gameName,
            recipientName: m.otherPartyName,
            date: new Date(m.createdAt),
          }));
        const received = memories
          .filter((m: { type: string }) => m.type === 'received')
          .map((m: { id: string; gameName: string; otherPartyName: string; createdAt: string; playCount?: number }) => ({
            id: m.id,
            gameName: m.gameName,
            senderName: m.otherPartyName,
            date: new Date(m.createdAt),
            playCount: m.playCount || 0,
          }));
        return { sent, received };
      }
    } catch {
      // Fall through
    }
    return { sent: [], received: [] };
  }
}

export const contentDatabase = new ContentDatabase();
