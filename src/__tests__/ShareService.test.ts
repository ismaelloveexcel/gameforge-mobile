/**
 * ShareService Tests
 */
import shareService from '../services/ShareService';
import { Share } from 'react-native';

jest.mock('react-native', () => ({
  Share: {
    share: jest.fn(),
    sharedAction: 'sharedAction',
    dismissedAction: 'dismissedAction',
  },
  Platform: {
    OS: 'ios',
  },
}));

jest.mock('expo-linking', () => ({
  canOpenURL: jest.fn(() => Promise.resolve(true)),
  openURL: jest.fn(() => Promise.resolve()),
}));

describe('ShareService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('shareNative', () => {
    it('shares using native share dialog', async () => {
      (Share.share as jest.Mock).mockResolvedValue({
        action: Share.sharedAction,
      });

      const result = await shareService.shareNative({
        title: 'Test Title',
        message: 'Test Message',
        url: 'https://example.com',
      });

      expect(result.success).toBe(true);
      expect(Share.share).toHaveBeenCalled();
    });

    it('handles dismissed action', async () => {
      (Share.share as jest.Mock).mockResolvedValue({
        action: Share.dismissedAction,
      });

      const result = await shareService.shareNative({
        title: 'Test',
        message: 'Test',
      });

      expect(result.success).toBe(false);
    });

    it('handles errors', async () => {
      (Share.share as jest.Mock).mockRejectedValue(new Error('Share failed'));

      const result = await shareService.shareNative({
        title: 'Test',
        message: 'Test',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBeTruthy();
    });
  });

  describe('generateShareableUrl', () => {
    it('generates shareable URL', () => {
      const url = shareService.generateShareableUrl('game123');
      expect(url).toContain('game123');
      expect(url).toContain('play');
    });

    it('uses custom base URL', () => {
      const url = shareService.generateShareableUrl('game123', 'https://custom.com');
      expect(url).toBe('https://custom.com/play/game123');
    });
  });

  describe('generateGiftGameMessage', () => {
    it('generates birthday message', () => {
      const message = shareService.generateGiftGameMessage(
        'Alice',
        'Bob',
        'birthday',
        'https://example.com/game'
      );

      expect(message).toContain('Alice');
      expect(message).toContain('Bob');
      expect(message).toContain('birthday');
      expect(message).toContain('https://example.com/game');
    });

    it('generates default message for unknown occasion', () => {
      const message = shareService.generateGiftGameMessage(
        'Alice',
        'Bob',
        'unknown',
        'https://example.com/game'
      );

      expect(message).toContain('Alice');
      expect(message).toContain('Bob');
    });
  });

  describe('getAvailablePlatforms', () => {
    it('returns list of available platforms', () => {
      const platforms = shareService.getAvailablePlatforms();
      expect(platforms).toContain('native');
      expect(platforms).toContain('whatsapp');
      expect(platforms).toContain('email');
    });
  });

  describe('getPlatformInfo', () => {
    it('returns platform info', () => {
      const info = shareService.getPlatformInfo('whatsapp');
      expect(info.name).toBe('WhatsApp');
      expect(info.icon).toBe('whatsapp');
      expect(info.color).toBeTruthy();
    });
  });

  describe('copyToClipboard', () => {
    it('copies text to clipboard', async () => {
      const result = await shareService.copyToClipboard('test text');
      expect(result).toBe(true);
    });
  });

  describe('trackShare', () => {
    it('tracks share event', () => {
      const spy = jest.spyOn(console, 'log');
      shareService.trackShare('whatsapp', 'game123');
      expect(spy).toHaveBeenCalled();
    });
  });
});
