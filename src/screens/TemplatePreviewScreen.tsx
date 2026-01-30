import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useTheme } from '../contexts/ThemeContext';
import { templateLibrary } from '../services/TemplateLibrary';
import { RootStackParamList } from '../types';

type TemplatePreviewRouteProp = RouteProp<RootStackParamList, 'TemplatePreview'>;
type NavigationProp = StackNavigationProp<RootStackParamList>;

const { width } = Dimensions.get('window');

export default function TemplatePreviewScreen() {
  const { theme } = useTheme();
  const route = useRoute<TemplatePreviewRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const [activeTab, setActiveTab] = useState<'overview' | 'features' | 'details'>('overview');
  
  const template = templateLibrary.getTemplateById(route.params.templateId);
  
  if (!template) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.errorText, { color: theme.colors.text }]}>
          Template not found
        </Text>
      </View>
    );
  }
  
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return theme.colors.success;
      case 'intermediate': return theme.colors.warning;
      case 'advanced': return theme.colors.error;
      default: return theme.colors.text;
    }
  };
  
  const getEngineIcon = (engine: string) => {
    switch (engine) {
      case 'pixi': return 'image-area';
      case 'babylon': return 'cube-outline';
      case 'aframe': return 'virtual-reality';
      default: return 'gamepad-variant';
    }
  };
  
  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      puzzle: 'puzzle',
      action: 'run-fast',
      strategy: 'chess-knight',
      racing: 'car-sports',
      educational: 'school',
      vr: 'virtual-reality',
      ar: 'augmented-reality',
      idle: 'clock-outline',
      rhythm: 'music-note',
      story: 'book-open-page-variant',
    };
    return icons[category] || 'gamepad-variant';
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Section with Visual Preview */}
        <Animated.View 
          entering={FadeInDown.duration(600)}
          style={[
            styles.hero, 
            { 
              backgroundColor: theme.dark ? '#1a1a2e' : '#f8f9fa',
            }
          ]}
        >
          {/* Mock game preview area with gradient */}
          <View style={[
            styles.previewArea,
            {
              backgroundColor: template.data.scenes?.[0]?.background || theme.colors.primary,
            }
          ]}>
            <View style={styles.previewOverlay}>
              <Icon 
                name={getEngineIcon(template.engine)} 
                size={80} 
                color="#ffffff60" 
              />
              <Text style={styles.previewLabel}>Game Preview</Text>
            </View>
          </View>
          
          {/* Template Title & Meta */}
          <View style={styles.heroContent}>
            <View style={styles.titleRow}>
              <View style={[styles.categoryBadge, { backgroundColor: theme.colors.primary + '20' }]}>
                <Icon name={getCategoryIcon(template.category)} size={16} color={theme.colors.primary} />
                <Text style={[styles.categoryText, { color: theme.colors.primary }]}>
                  {template.category.charAt(0).toUpperCase() + template.category.slice(1)}
                </Text>
              </View>
              <View style={[
                styles.difficultyBadge,
                { backgroundColor: getDifficultyColor(template.difficulty) + '20' }
              ]}>
                <Text style={[styles.difficultyText, { color: getDifficultyColor(template.difficulty) }]}>
                  {template.difficulty}
                </Text>
              </View>
            </View>
            
            <Text style={[styles.templateName, { color: theme.colors.text }]}>
              {template.name}
            </Text>
            <Text style={[styles.templateDescription, { color: theme.colors.text + '90' }]}>
              {template.description}
            </Text>
            
            {/* Engine Badge */}
            <View style={styles.engineRow}>
              <Icon name={getEngineIcon(template.engine)} size={20} color={theme.colors.text + '80'} />
              <Text style={[styles.engineText, { color: theme.colors.text + '80' }]}>
                {template.engine.toUpperCase()} Engine
              </Text>
            </View>
          </View>
        </Animated.View>
        
        {/* Tabs */}
        <Animated.View 
          entering={FadeInUp.duration(400).delay(200)}
          style={styles.tabContainer}
        >
          {(['overview', 'features', 'details'] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tab,
                activeTab === tab && { borderBottomColor: theme.colors.primary, borderBottomWidth: 3 }
              ]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[
                styles.tabText,
                { color: activeTab === tab ? theme.colors.primary : theme.colors.text + '80' }
              ]}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </Animated.View>
        
        {/* Content */}
        <View style={styles.content}>
          {activeTab === 'overview' && (
            <Animated.View entering={FadeInUp.duration(300)}>
              {/* Features List */}
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                  Key Features
                </Text>
                {template.features.map((feature, index) => (
                  <Animated.View 
                    key={index}
                    entering={FadeInUp.duration(300).delay(index * 50)}
                    style={[styles.featureItem, { backgroundColor: theme.colors.card }]}
                  >
                    <View style={[styles.featureIconBg, { backgroundColor: theme.colors.success + '20' }]}>
                      <Icon name="check-circle" size={20} color={theme.colors.success} />
                    </View>
                    <Text style={[styles.featureText, { color: theme.colors.text }]}>
                      {feature}
                    </Text>
                  </Animated.View>
                ))}
              </View>
              
              {/* Documentation */}
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                  About This Template
                </Text>
                <View style={[styles.docCard, { backgroundColor: theme.colors.card }]}>
                  <Icon name="information-outline" size={24} color={theme.colors.primary} />
                  <Text style={[styles.docText, { color: theme.colors.text + '90' }]}>
                    {template.documentation}
                  </Text>
                </View>
              </View>
            </Animated.View>
          )}
          
          {activeTab === 'features' && (
            <Animated.View entering={FadeInUp.duration(300)}>
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                  Complete Feature List
                </Text>
                {template.features.map((feature, index) => (
                  <Animated.View
                    key={index}
                    entering={FadeInUp.duration(300).delay(index * 80)}
                    style={[styles.detailFeature, { backgroundColor: theme.colors.card }]}
                  >
                    <Icon name="star" size={18} color={theme.colors.accent} />
                    <Text style={[styles.detailFeatureText, { color: theme.colors.text }]}>
                      {feature}
                    </Text>
                  </Animated.View>
                ))}
              </View>
            </Animated.View>
          )}
          
          {activeTab === 'details' && (
            <Animated.View entering={FadeInUp.duration(300)}>
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                  Technical Details
                </Text>
                
                <View style={[styles.detailCard, { backgroundColor: theme.colors.card }]}>
                  <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, { color: theme.colors.text + '80' }]}>
                      Engine
                    </Text>
                    <Text style={[styles.detailValue, { color: theme.colors.text }]}>
                      {template.engine.toUpperCase()}
                    </Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, { color: theme.colors.text + '80' }]}>
                      Difficulty
                    </Text>
                    <Text style={[styles.detailValue, { color: getDifficultyColor(template.difficulty) }]}>
                      {template.difficulty.charAt(0).toUpperCase() + template.difficulty.slice(1)}
                    </Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, { color: theme.colors.text + '80' }]}>
                      Category
                    </Text>
                    <Text style={[styles.detailValue, { color: theme.colors.text }]}>
                      {template.category.charAt(0).toUpperCase() + template.category.slice(1)}
                    </Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, { color: theme.colors.text + '80' }]}>
                      Resolution
                    </Text>
                    <Text style={[styles.detailValue, { color: theme.colors.text }]}>
                      {template.data.settings.resolution.width} × {template.data.settings.resolution.height}
                    </Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, { color: theme.colors.text + '80' }]}>
                      Orientation
                    </Text>
                    <Text style={[styles.detailValue, { color: theme.colors.text }]}>
                      {template.data.settings.orientation.charAt(0).toUpperCase() + template.data.settings.orientation.slice(1)}
                    </Text>
                  </View>
                  
                  {template.data.settings.physics && (
                    <View style={styles.detailRow}>
                      <Text style={[styles.detailLabel, { color: theme.colors.text + '80' }]}>
                        Physics
                      </Text>
                      <Text style={[styles.detailValue, { color: theme.colors.success }]}>
                        Enabled ({template.data.settings.physics.engine})
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </Animated.View>
          )}
        </View>
        
        <View style={{ height: 120 }} />
      </ScrollView>
      
      {/* Action Buttons */}
      <View style={[styles.actionBar, { 
        backgroundColor: theme.colors.background,
        borderTopColor: theme.colors.card,
      }]}>
        <TouchableOpacity
          style={[styles.secondaryButton, { borderColor: theme.colors.primary }]}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={20} color={theme.colors.primary} />
          <Text style={[styles.secondaryButtonText, { color: theme.colors.primary }]}>
            Back
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.primaryButton, { backgroundColor: theme.colors.primary }]}
          onPress={() => {
            // TODO: Navigate to project creation with template
            alert('Creating project from template...');
          }}
        >
          <Icon name="plus-circle" size={20} color="#fff" />
          <Text style={styles.primaryButtonText}>Use Template</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  hero: {
    paddingBottom: 20,
  },
  previewArea: {
    height: 240,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewOverlay: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewLabel: {
    color: '#ffffffcc',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
  },
  heroContent: {
    padding: 20,
  },
  titleRow: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 8,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '600',
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  difficultyText: {
    fontSize: 13,
    fontWeight: '600',
  },
  templateName: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  templateDescription: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  engineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  engineText: {
    fontSize: 14,
    fontWeight: '600',
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    ...Platform.select({
      web: { boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
      default: { elevation: 1 },
    }),
  },
  featureIconBg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  featureText: {
    fontSize: 15,
    flex: 1,
    fontWeight: '500',
  },
  docCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    gap: 12,
    ...Platform.select({
      web: { boxShadow: '0 2px 4px rgba(0,0,0,0.05)' },
      default: { elevation: 1 },
    }),
  },
  docText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
  },
  detailFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 10,
    marginBottom: 8,
    gap: 10,
  },
  detailFeatureText: {
    fontSize: 15,
    flex: 1,
  },
  detailCard: {
    padding: 16,
    borderRadius: 12,
    gap: 14,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 15,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '600',
  },
  actionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
    ...Platform.select({
      web: { boxShadow: '0 -2px 10px rgba(0,0,0,0.08)' },
      default: { elevation: 8 },
    }),
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 2,
    gap: 8,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
  primaryButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  errorText: {
    fontSize: 18,
  },
});
