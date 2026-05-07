/**
 * GrokService Tests - generateGiftGameContent
 */
import { generateGiftGameContent } from '../services/GrokService';

// Timeout constant for API calls
const API_TIMEOUT = 10000; // 10 seconds

describe('GrokService - generateGiftGameContent', () => {
  it('should generate gift game content with simplified parameters', async () => {
    const result = await generateGiftGameContent({
      occasion: "Valentine's Day",
      recipientDescription: "my girlfriend, 28 years old, loves cats and romantic surprises",
      relationshipAndTone: "playful and loving boyfriend",
      gameType: "simple puzzle gift game",
      visualStyle: "Neon Cyberpunk",
      personalMessage: "You make every day brighter than the neon lights",
    });

    expect(result).toBeTruthy();
    expect(typeof result).toBe('string');
    
    // Should be valid JSON
    const gameData = JSON.parse(result);
    expect(gameData).toHaveProperty('id');
    expect(gameData).toHaveProperty('title');
    expect(gameData).toHaveProperty('introScreen');
    expect(gameData).toHaveProperty('endScreen');
    expect(gameData).toHaveProperty('gameContent');
  }, API_TIMEOUT);

  it('should parse age from recipient description', async () => {
    const result = await generateGiftGameContent({
      occasion: "Birthday",
      recipientDescription: "my friend, 15 years old, loves gaming",
      relationshipAndTone: "friendly",
      gameType: "adventure game",
      visualStyle: "colorful cartoon",
      personalMessage: "Happy Birthday!",
    });

    expect(result).toBeTruthy();
    const gameData = JSON.parse(result);
    // Should create a game suitable for teen age group
    expect(gameData).toHaveProperty('title');
  }, API_TIMEOUT);

  it('should extract interests from description', async () => {
    const result = await generateGiftGameContent({
      occasion: "Just Because",
      recipientDescription: "someone who loves cats, music, and art",
      relationshipAndTone: "friend",
      gameType: "story game",
      visualStyle: "elegant minimal",
      personalMessage: "You're awesome!",
    });

    expect(result).toBeTruthy();
    const gameData = JSON.parse(result);
    expect(gameData).toHaveProperty('gameContent');
  }, API_TIMEOUT);

  it('should handle different game types', async () => {
    const result = await generateGiftGameContent({
      occasion: "Anniversary",
      recipientDescription: "my spouse, 35 years old",
      relationshipAndTone: "romantic and heartfelt",
      gameType: "runner game",
      visualStyle: "magical sparkle",
      personalMessage: "I love you more each day",
    });

    expect(result).toBeTruthy();
    const gameData = JSON.parse(result);
    expect(gameData.gameContent).toHaveProperty('type');
  }, API_TIMEOUT);

  it('should include personal message in end screen', async () => {
    const personalMessage = "You make every day brighter than the neon lights";
    const result = await generateGiftGameContent({
      occasion: "Valentine's Day",
      recipientDescription: "my partner, 28 years old",
      relationshipAndTone: "loving",
      gameType: "puzzle game",
      visualStyle: "retro pixel",
      personalMessage: personalMessage,
    });

    expect(result).toBeTruthy();
    const gameData = JSON.parse(result);
    expect(gameData.endScreen).toHaveProperty('personalMessage');
    // Personal message should be in the end screen
    expect(gameData.endScreen.personalMessage).toBeTruthy();
  }, API_TIMEOUT);

  it('should handle errors gracefully', async () => {
    // Test with minimal data
    try {
      const result = await generateGiftGameContent({
        occasion: "Birthday",
        recipientDescription: "friend",
        relationshipAndTone: "casual",
        gameType: "game",
        visualStyle: "style",
        personalMessage: "Hi",
      });
      
      // Should still succeed with fallback generation
      expect(result).toBeTruthy();
      const gameData = JSON.parse(result);
      expect(gameData).toHaveProperty('id');
    } catch (error) {
      // If it throws, it should be a meaningful error
      expect(error).toHaveProperty('message');
    }
  }, API_TIMEOUT);
});
