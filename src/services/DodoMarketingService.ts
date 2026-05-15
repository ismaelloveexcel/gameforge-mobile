/**
 * Dodo Marketing Service
 * 
 * Generates Dodo character marketing assets using internal OpenAI/DALL-E 3
 * Creates themed videos and promotional content for Valentine's & Ramadan
 */

import { openAIService } from './OpenAIService';

export type DodoTheme = 'valentine' | 'ramadan' | 'eid' | 'birthday' | 'generic';

export interface DodoMarketingAsset {
  type: 'image' | 'video' | 'gif';
  theme: DodoTheme;
  imageUrl?: string;
  prompt: string;
  purpose: 'social-post' | 'ad' | 'story' | 'hero';
}

class DodoMarketingService {
  /**
   * Generate Dodo character in themed setting
   */
  async generateDodoCharacter(config: {
    theme: DodoTheme;
    action: 'brewing' | 'celebrating' | 'waving' | 'thinking';
    includeText?: string;
  }): Promise<{ imageUrl: string; prompt: string }> {
    
    const themeDescriptions = {
      valentine: `romantic futuristic background with floating hearts and rose petals,
                  pink and red gradient, soft dreamy lighting, wearing heart-shaped VR goggles,
                  holding glowing pink love potion bottle`,
      
      ramadan: `Arabian majlis setting with glowing lanterns, crescent moon in background,
                warm golden and deep blue colors, wearing traditional embroidered vest,
                brewing golden glowing potion, Islamic geometric patterns subtle in background,
                peaceful night atmosphere`,
      
      eid: `festive celebration setting, wearing golden festive outfit,
            surrounded by gift boxes and celebration elements, mosque silhouette,
            warm joyful colors, family-friendly aesthetic`,
      
      birthday: `birthday party setting with cake and balloons, wearing party hat,
                 holding magic wand with sparkles, confetti in air, vibrant colors`,
      
      generic: `magical laboratory with bubbling potions, wizard outfit,
                mystical background, purple and blue magical lighting`
    };

    const actionDescriptions = {
      brewing: 'carefully brewing magical potion with concentrated expression',
      celebrating: 'jumping with joy, arms raised in celebration, big smile',
      waving: 'friendly wave gesture with wing, welcoming expression',
      thinking: 'thoughtful pose with wing on chin, pondering'
    };

    const basePrompt = `
      Cute friendly dodo bird character as magical alchemist,
      round fluffy body, small wings, orange beak, adorable expression,
      ${actionDescriptions[config.action]},
      ${themeDescriptions[config.theme]},
      Pixar-Disney quality 3D rendering,
      professional game cinematics,
      character-focused composition,
      high detail, premium lighting
      ${config.includeText ? `, speech bubble with text "${config.includeText}"` : ''}
    `.trim();

    try {
      const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.EXPO_PUBLIC_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'dall-e-3',
          prompt: basePrompt,
          size: '1024x1024',
          quality: 'hd',
          n: 1
        })
      });

      if (!response.ok) {
        throw new Error(`DALL-E API error: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        imageUrl: data.data[0].url,
        prompt: data.data[0].revised_prompt
      };
    } catch (error) {
      console.error('Failed to generate Dodo character:', error);
      throw error;
    }
  }

  /**
   * Generate complete Valentine's marketing package
   */
  async generateValentinePackage(): Promise<DodoMarketingAsset[]> {
    const assets: DodoMarketingAsset[] = [];

    // Scene 1: Dodo brewing love potion
    const scene1 = await this.generateDodoCharacter({
      theme: 'valentine',
      action: 'brewing',
      includeText: '60 seconds to create love ❤️'
    });
    
    assets.push({
      type: 'image',
      theme: 'valentine',
      imageUrl: scene1.imageUrl,
      prompt: scene1.prompt,
      purpose: 'hero'
    });

    // Scene 2: Dodo celebrating with heart effects
    const scene2 = await this.generateDodoCharacter({
      theme: 'valentine',
      action: 'celebrating',
      includeText: 'Made with AI, sent with love'
    });
    
    assets.push({
      type: 'image',
      theme: 'valentine',
      imageUrl: scene2.imageUrl,
      prompt: scene2.prompt,
      purpose: 'social-post'
    });

    // Scene 3: Dodo waving (for Stories)
    const scene3 = await this.generateDodoCharacter({
      theme: 'valentine',
      action: 'waving',
      includeText: 'Download GameForge!'
    });
    
    assets.push({
      type: 'image',
      theme: 'valentine',
      imageUrl: scene3.imageUrl,
      prompt: scene3.prompt,
      purpose: 'story'
    });

    console.log(`✅ Generated ${assets.length} Valentine's assets for AED ${(assets.length * 0.08 * 3.67).toFixed(2)}`);
    
    return assets;
  }

  /**
   * Generate Ramadan marketing package
   */
  async generateRamadanPackage(): Promise<DodoMarketingAsset[]> {
    const assets: DodoMarketingAsset[] = [];

    // Scene 1: Dodo in Arabian majlis with lanterns
    const scene1 = await this.generateDodoCharacter({
      theme: 'ramadan',
      action: 'thinking',
      includeText: 'Ramadan Kareem 🌙'
    });
    
    assets.push({
      type: 'image',
      theme: 'ramadan',
      imageUrl: scene1.imageUrl,
      prompt: scene1.prompt,
      purpose: 'hero'
    });

    // Scene 2: Dodo brewing golden potion
    const scene2 = await this.generateDodoCharacter({
      theme: 'ramadan',
      action: 'brewing',
      includeText: 'Share blessings through games ✨'
    });
    
    assets.push({
      type: 'image',
      theme: 'ramadan',
      imageUrl: scene2.imageUrl,
      prompt: scene2.prompt,
      purpose: 'social-post'
    });

    // Scene 3: Dodo celebrating for Eid
    const scene3 = await this.generateDodoCharacter({
      theme: 'eid',
      action: 'celebrating',
      includeText: 'Eid Mubarak! 🎉'
    });
    
    assets.push({
      type: 'image',
      theme: 'eid',
      imageUrl: scene3.imageUrl,
      prompt: scene3.prompt,
      purpose: 'social-post'
    });

    console.log(`✅ Generated ${assets.length} Ramadan/Eid assets`);
    
    return assets;
  }

  /**
   * Generate marketing copy for social media
   */
  async generateMarketingCopy(campaign: 'valentine' | 'ramadan'): Promise<{
    captions: string[];
    hashtags: string[];
    cta: string;
  }> {
    
    const prompt = campaign === 'valentine' 
      ? `Generate 5 Instagram captions for GameForge Valentine's Day launch.
         Features: AI-powered gift game creator with cute Dodo alchemist character
         Target: UAE couples 25-40
         Tone: Premium, romantic, urgent (Valentine's in days!)
         Include: Dodo character mentions, emotional appeal, last-minute angle
         Format: Each caption on new line, max 150 characters`
      : `Generate 5 Instagram captions for GameForge Ramadan campaign.
         Features: AI gift games with Dodo alchemist, perfect for Eid
         Target: UAE families, Arabic speakers
         Tone: Respectful, warm, family-focused
         Cultural: Post-iftar timing, no food/drink, emphasize blessings
         Format: Each caption on new line, Arabic + English`;

    const response = await openAIService.complete(prompt);
    
    if (!response.success) {
      return this.getFallbackCopy(campaign);
    }

    const captions = response.content!
      .split('\n')
      .filter(line => line.trim().length > 0)
      .slice(0, 5);

    const hashtags = campaign === 'valentine'
      ? ['#GameForgeUAE', '#ValentinesUAE', '#DigitalGifts', '#DubaiTech', '#DodoMagic', '#AIGifts']
      : ['#GameForge', '#RamadanKareem', '#EidGifts', '#UAEApps', '#DodoAlchemist', '#BlessedMonth'];

    const cta = campaign === 'valentine'
      ? 'Create your love game now → Link in bio'
      : 'Share Ramadan blessings → Download GameForge';

    return { captions, hashtags, cta };
  }

  /**
   * Generate video script for Dodo marketing
   */
  async generateVideoScript(theme: DodoTheme): Promise<{
    scenes: Array<{
      duration: number;
      visual: string;
      text: string;
      voiceover?: string;
    }>;
    totalDuration: number;
  }> {
    
    const valentineScript = {
      scenes: [
        {
          duration: 3,
          visual: 'Dodo with VR headset brewing pink love potion',
          text: 'Meet Dodo 🦤',
          voiceover: 'This is Dodo, your AI alchemist'
        },
        {
          duration: 3,
          visual: 'User typing on phone, Dodo watches',
          text: 'Add their name',
          voiceover: 'Just enter their name and what you want to say'
        },
        {
          duration: 3,
          visual: 'Dodo casts spell, magic happens',
          text: '60 seconds later...',
          voiceover: 'Dodo works his magic'
        },
        {
          duration: 3,
          visual: 'Beautiful game appears, Dodo celebrates',
          text: 'Boom! Pixar-quality gift 💝',
          voiceover: 'A personalized game ready to share'
        },
        {
          duration: 3,
          visual: 'Recipient playing, hearts appearing',
          text: 'They play, they smile',
          voiceover: 'Last-minute Valentine\'s? Nailed it.'
        }
      ],
      totalDuration: 15
    };

    const ramadanScript = {
      scenes: [
        {
          duration: 3,
          visual: 'Dodo in Arabian setting with lanterns',
          text: 'Ramadan Kareem 🌙',
          voiceover: 'Share blessings this Ramadan'
        },
        {
          duration: 3,
          visual: 'Dodo brewing golden potion',
          text: 'Create Eid gifts with Dodo',
          voiceover: 'Our Dodo alchemist helps you create'
        },
        {
          duration: 3,
          visual: 'Family members receiving gifts',
          text: 'Perfect for family abroad',
          voiceover: 'Send to family near and far'
        },
        {
          duration: 3,
          visual: 'Beautiful Islamic-themed game',
          text: 'Culturally respectful ✨',
          voiceover: 'Made with love for UAE families'
        },
        {
          duration: 3,
          visual: 'Dodo celebrating under crescent moon',
          text: 'GameForge - هدايا من القلب',
          voiceover: 'GameForge. Gifts from the heart.'
        }
      ],
      totalDuration: 15
    };

    return theme === 'valentine' ? valentineScript : ramadanScript;
  }

  /**
   * Fallback marketing copy
   */
  private getFallbackCopy(campaign: 'valentine' | 'ramadan') {
    if (campaign === 'valentine') {
      return {
        captions: [
          "Dodo's brewing something special for Valentine's Day! 💝",
          "60 seconds with Dodo = perfect gift for your love ❤️",
          "Last-minute Valentine's? Dodo's got your back! 🦤",
          "Premium gifts created by your magical alchemist 🧙‍♂️",
          "Made with AI, sent with love. That's the Dodo way! ✨"
        ],
        hashtags: ['#GameForgeUAE', '#ValentinesUAE', '#DodoMagic', '#AIGifts'],
        cta: 'Create your love game now → Link in bio'
      };
    } else {
      return {
        captions: [
          "Ramadan Kareem from Dodo! 🌙 Share blessings through games",
          "Dodo's brewing Eid magic! Perfect gifts for family ✨",
          "رمضان كريم 🦤 Create meaningful Eid gifts with Dodo",
          "From Dodo's heart to yours - Ramadan blessings 💝",
          "Share joy, share games. Ramadan with GameForge 🌙"
        ],
        hashtags: ['#RamadanKareem', '#GameForgeUAE', '#EidGifts', '#Dodo Alchemist'],
        cta: 'Download GameForge - صمم لعبتك'
      };
    }
  }
}

export const dodoMarketingService = new DodoMarketingService();
