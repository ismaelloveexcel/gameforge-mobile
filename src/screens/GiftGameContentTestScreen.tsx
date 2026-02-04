/**
 * GiftGameContentTestScreen - Test screen for generateGiftGameContent function
 * This screen provides a button to test the simplified gift game generation API
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { generateGiftGameContent } from '../services/GrokService';
import { useTheme } from '../contexts/ThemeContext';

export default function GiftGameContentTestScreen() {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const testGeneration = async () => {
    setLoading(true);
    setResult(null);
    
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
      setResult(result);
      
      // Show success alert with preview
      Alert.alert(
        'Success! 🎉',
        result.substring(0, 200) + '...',
        [{ text: 'OK' }]
      );
    } catch (err: any) {
      console.error('GROK ERROR:', err);
      Alert.alert('Error', err.message || 'Failed to generate game');
    } finally {
      setLoading(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      padding: 20,
    },
    header: {
      marginTop: 40,
      marginBottom: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: theme.colors.textMuted,
    },
    testButton: {
      backgroundColor: theme.colors.primary,
      padding: 16,
      borderRadius: 12,
      alignItems: 'center',
      marginBottom: 20,
    },
    testButtonText: {
      color: '#FFFFFF',
      fontSize: 18,
      fontWeight: '600',
    },
    resultContainer: {
      flex: 1,
      backgroundColor: theme.colors.card,
      borderRadius: 12,
      padding: 16,
    },
    resultTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: 12,
    },
    resultText: {
      fontSize: 14,
      color: theme.colors.text,
      fontFamily: 'monospace',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      marginTop: 16,
      fontSize: 16,
      color: theme.colors.textMuted,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Gift Game Content Test</Text>
        <Text style={styles.subtitle}>
          Test the generateGiftGameContent function
        </Text>
      </View>

      <TouchableOpacity
        style={styles.testButton}
        onPress={testGeneration}
        disabled={loading}
      >
        <Text style={styles.testButtonText}>
          {loading ? 'Generating...' : '🎮 Test Generation'}
        </Text>
      </TouchableOpacity>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>
            Creating your personalized game...
          </Text>
        </View>
      ) : result ? (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>Generated Game Data:</Text>
          <ScrollView>
            <Text style={styles.resultText}>{result}</Text>
          </ScrollView>
        </View>
      ) : null}
    </View>
  );
}
