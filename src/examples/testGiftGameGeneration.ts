/**
 * Example usage of generateGiftGameContent
 * 
 * This file demonstrates how to use the generateGiftGameContent function
 * You can copy this code into any button handler or screen
 */

import { Alert } from 'react-native';
import { generateGiftGameContent } from '../services/GrokService';

/**
 * Test function for generateGiftGameContent
 * Call this from any button's onPress handler
 */
export const testGenerateGiftGameContent = async () => {
  try {
    const result = await generateGiftGameContent({
      occasion: "Valentine's Day",
      recipientDescription: "my girlfriend, 28 years old, loves cats and romantic surprises",
      relationshipAndTone: "playful and loving boyfriend",
      gameType: "simple puzzle gift game",
      visualStyle: "Neon Cyberpunk",
      personalMessage: "You make every day brighter than the neon lights",
      personality: "Creative Mentor"
    });

    console.log('GROK RESPONSE:', result);
    
    // Parse the result to show a preview
    const gameData = JSON.parse(result);
    Alert.alert(
      'Success! 🎉',
      `Generated game: "${gameData.title}"\n\n` +
      `Game ID: ${gameData.id}\n` +
      `Visual Style: ${gameData.visualStyle}\n\n` +
      `Preview: ${result.substring(0, 100)}...`,
      [{ text: 'OK' }]
    );
  } catch (err: any) {
    console.error('GROK ERROR:', err);
    Alert.alert('Error', err.message || 'Failed to generate game');
  }
};

/**
 * Example: Add to any button in your screen
 * 
 * <TouchableOpacity onPress={testGenerateGiftGameContent}>
 *   <Text>Test Gift Game Generation</Text>
 * </TouchableOpacity>
 */
