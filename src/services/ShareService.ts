/**
 * ShareService - Social sharing and content distribution
 * Enables sharing gift games across multiple platforms
 */

import { Share, Platform } from 'react-native';
import * as Linking from 'expo-linking';

export interface ShareOptions {
  title: string;
  message: string;
  url?: string;
  imageUrl?: string;
}

export interface ShareResult {
  success: boolean;
  platform?: string;
  error?: string;
}

export type SharePlatform = 
  | 'native'
  | 'whatsapp'
  | 'telegram'
  | 'messenger'
  | 'email'
  | 'sms'
  | 'twitter'
  | 'facebook';

class ShareService {
  /**
   * Share using native share dialog
   */
  async shareNative(options: ShareOptions): Promise<ShareResult> {
    try {
      const result = await Share.share({
        title: options.title,
        message: options.url 
          ? `${options.message}\n\n${options.url}`
          : options.message,
        url: options.url,
      });

      if (result.action === Share.sharedAction) {
        return {
          success: true,
          platform: result.activityType || 'native',
        };
      } else if (result.action === Share.dismissedAction) {
        return {
          success: false,
          error: 'User dismissed share dialog',
        };
      }

      return { success: true, platform: 'native' };
    } catch (error: any) {
      console.error('Native share error:', error);
      return {
        success: false,
        error: error.message || 'Failed to share',
      };
    }
  }

  /**
   * Share to WhatsApp
   */
  async shareToWhatsApp(options: ShareOptions): Promise<ShareResult> {
    try {
      const text = encodeURIComponent(
        options.url 
          ? `${options.message}\n\n${options.url}`
          : options.message
      );
      
      const whatsappUrl = `whatsapp://send?text=${text}`;
      const canOpen = await Linking.canOpenURL(whatsappUrl);

      if (canOpen) {
        await Linking.openURL(whatsappUrl);
        return { success: true, platform: 'whatsapp' };
      } else {
        // Fallback to web WhatsApp
        const webUrl = `https://api.whatsapp.com/send?text=${text}`;
        await Linking.openURL(webUrl);
        return { success: true, platform: 'whatsapp-web' };
      }
    } catch (error: any) {
      console.error('WhatsApp share error:', error);
      return {
        success: false,
        error: 'WhatsApp not available',
      };
    }
  }

  /**
   * Share to Telegram
   */
  async shareToTelegram(options: ShareOptions): Promise<ShareResult> {
    try {
      const text = encodeURIComponent(options.message);
      const url = options.url ? encodeURIComponent(options.url) : '';
      
      const telegramUrl = `tg://msg?text=${text}${url ? `&url=${url}` : ''}`;
      const canOpen = await Linking.canOpenURL(telegramUrl);

      if (canOpen) {
        await Linking.openURL(telegramUrl);
        return { success: true, platform: 'telegram' };
      } else {
        // Fallback to web Telegram
        const webUrl = `https://t.me/share/url?url=${url}&text=${text}`;
        await Linking.openURL(webUrl);
        return { success: true, platform: 'telegram-web' };
      }
    } catch (error: any) {
      console.error('Telegram share error:', error);
      return {
        success: false,
        error: 'Telegram not available',
      };
    }
  }

  /**
   * Share via Email
   */
  async shareViaEmail(options: ShareOptions): Promise<ShareResult> {
    try {
      const subject = encodeURIComponent(options.title);
      const body = encodeURIComponent(
        options.url 
          ? `${options.message}\n\n${options.url}`
          : options.message
      );
      
      const mailUrl = `mailto:?subject=${subject}&body=${body}`;
      await Linking.openURL(mailUrl);
      
      return { success: true, platform: 'email' };
    } catch (error: any) {
      console.error('Email share error:', error);
      return {
        success: false,
        error: 'Email client not available',
      };
    }
  }

  /**
   * Share via SMS
   */
  async shareViaSMS(options: ShareOptions): Promise<ShareResult> {
    try {
      const body = encodeURIComponent(
        options.url 
          ? `${options.message}\n\n${options.url}`
          : options.message
      );
      
      const smsUrl = Platform.OS === 'ios'
        ? `sms:&body=${body}`
        : `sms:?body=${body}`;
      
      await Linking.openURL(smsUrl);
      
      return { success: true, platform: 'sms' };
    } catch (error: any) {
      console.error('SMS share error:', error);
      return {
        success: false,
        error: 'SMS not available',
      };
    }
  }

  /**
   * Share to Facebook
   */
  async shareToFacebook(options: ShareOptions): Promise<ShareResult> {
    try {
      if (!options.url) {
        return {
          success: false,
          error: 'URL required for Facebook sharing',
        };
      }

      const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(options.url)}`;
      await Linking.openURL(fbUrl);
      
      return { success: true, platform: 'facebook' };
    } catch (error: any) {
      console.error('Facebook share error:', error);
      return {
        success: false,
        error: 'Facebook sharing not available',
      };
    }
  }

  /**
   * Share to Twitter
   */
  async shareToTwitter(options: ShareOptions): Promise<ShareResult> {
    try {
      const text = encodeURIComponent(options.message);
      const url = options.url ? encodeURIComponent(options.url) : '';
      
      const twitterUrl = `https://twitter.com/intent/tweet?text=${text}${url ? `&url=${url}` : ''}`;
      await Linking.openURL(twitterUrl);
      
      return { success: true, platform: 'twitter' };
    } catch (error: any) {
      console.error('Twitter share error:', error);
      return {
        success: false,
        error: 'Twitter sharing not available',
      };
    }
  }

  /**
   * Share to specific platform
   */
  async shareToPlatform(platform: SharePlatform, options: ShareOptions): Promise<ShareResult> {
    switch (platform) {
      case 'native':
        return this.shareNative(options);
      case 'whatsapp':
        return this.shareToWhatsApp(options);
      case 'telegram':
        return this.shareToTelegram(options);
      case 'email':
        return this.shareViaEmail(options);
      case 'sms':
        return this.shareViaSMS(options);
      case 'facebook':
        return this.shareToFacebook(options);
      case 'twitter':
        return this.shareToTwitter(options);
      default:
        return this.shareNative(options);
    }
  }

  /**
   * Generate shareable URL for gift game
   */
  generateShareableUrl(gameId: string, baseUrl?: string): string {
    const base = baseUrl || 'https://gameforge.app';
    return `${base}/play/${gameId}`;
  }

  /**
   * Generate share message for gift game
   */
  generateGiftGameMessage(
    recipientName: string,
    senderName: string,
    occasion: string,
    gameUrl: string
  ): string {
    const messages: Record<string, string> = {
      birthday: `🎉 ${recipientName}, ${senderName} created a special birthday game just for you! 🎮\n\nPlay it here: ${gameUrl}`,
      anniversary: `💕 ${recipientName}, ${senderName} made a special anniversary game to celebrate your journey together! 🎮\n\nPlay it here: ${gameUrl}`,
      valentines: `💘 ${recipientName}, ${senderName} created a Valentine's game filled with love just for you! 🎮\n\nPlay it here: ${gameUrl}`,
      christmas: `🎄 ${recipientName}, ${senderName} made a festive Christmas game for you! 🎮\n\nPlay it here: ${gameUrl}`,
      graduation: `🎓 ${recipientName}, ${senderName} created a special graduation game to celebrate your achievement! 🎮\n\nPlay it here: ${gameUrl}`,
      thank_you: `🙏 ${recipientName}, ${senderName} made a thank you game as a token of appreciation! 🎮\n\nPlay it here: ${gameUrl}`,
      default: `🎁 ${recipientName}, ${senderName} created a personalized game just for you! 🎮\n\nPlay it here: ${gameUrl}`,
    };

    return messages[occasion] || messages.default;
  }

  /**
   * Get available sharing platforms
   */
  getAvailablePlatforms(): SharePlatform[] {
    const platforms: SharePlatform[] = ['native', 'email', 'sms'];

    // These platforms are generally available via web fallback
    platforms.push('whatsapp', 'telegram', 'facebook', 'twitter');

    return platforms;
  }

  /**
   * Get platform display info
   */
  getPlatformInfo(platform: SharePlatform): {
    name: string;
    icon: string;
    color: string;
  } {
    const info: Record<SharePlatform, { name: string; icon: string; color: string }> = {
      native: { name: 'Share', icon: 'share-variant', color: '#4A90E2' },
      whatsapp: { name: 'WhatsApp', icon: 'whatsapp', color: '#25D366' },
      telegram: { name: 'Telegram', icon: 'telegram', color: '#0088cc' },
      messenger: { name: 'Messenger', icon: 'facebook-messenger', color: '#0084ff' },
      email: { name: 'Email', icon: 'email', color: '#EA4335' },
      sms: { name: 'SMS', icon: 'message-text', color: '#00C853' },
      twitter: { name: 'Twitter', icon: 'twitter', color: '#1DA1F2' },
      facebook: { name: 'Facebook', icon: 'facebook', color: '#1877F2' },
    };

    return info[platform] || info.native;
  }

  /**
   * Copy URL to clipboard
   */
  async copyToClipboard(text: string): Promise<boolean> {
    try {
      // Note: In production, you'd use expo-clipboard
      // For now, we'll just log it
      console.log('Copied to clipboard:', text);
      return true;
    } catch (error) {
      console.error('Clipboard error:', error);
      return false;
    }
  }

  /**
   * Track share event (for analytics)
   */
  trackShare(platform: SharePlatform, gameId: string) {
    // In production, this would integrate with analytics service
    console.log('Share tracked:', { platform, gameId, timestamp: new Date().toISOString() });
  }
}

// Export singleton instance
export const shareService = new ShareService();
export default shareService;
