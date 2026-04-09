/**
 * Gift Store — GiftVerse
 * Central state for gift creation, history, and persistence.
 */
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { GiftExperience } from '../types';

const GIFTS_KEY = '@giftverse_gifts';

interface GiftStore {
  gifts: GiftExperience[];
  isLoaded: boolean;
  loadGifts: () => Promise<void>;
  addGift: (gift: GiftExperience) => Promise<void>;
  removeGift: (id: string) => Promise<void>;
}

export const useGiftStore = create<GiftStore>((set, get) => ({
  gifts: [],
  isLoaded: false,

  loadGifts: async () => {
    try {
      const raw = await AsyncStorage.getItem(GIFTS_KEY);
      const gifts: GiftExperience[] = raw ? JSON.parse(raw) : [];
      set({ gifts, isLoaded: true });
    } catch {
      set({ gifts: [], isLoaded: true });
    }
  },

  addGift: async (gift) => {
    const updated = [gift, ...get().gifts];
    set({ gifts: updated });
    await AsyncStorage.setItem(GIFTS_KEY, JSON.stringify(updated));
  },

  removeGift: async (id) => {
    const updated = get().gifts.filter((g) => g.id !== id);
    set({ gifts: updated });
    await AsyncStorage.setItem(GIFTS_KEY, JSON.stringify(updated));
  },
}));
