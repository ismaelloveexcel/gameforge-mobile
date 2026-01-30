import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Dimensions,
} from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useTheme } from '../contexts/ThemeContext';
import { RootStackParamList } from '../types';

type MarketingDashboardRouteProp = RouteProp<RootStackParamList, 'MarketingDashboard'>;

const { width } = Dimensions.get('window');

export default function MarketingDashboardScreen() {
  const { theme } = useTheme();
  const route = useRoute<MarketingDashboardRouteProp>();
  const [activeTab, setActiveTab] = useState<'overview' | 'campaigns' | 'analytics'>('overview');
  
  // Mock data - in production, this would come from the MarketingService
  const stats = [
    { 
      label: 'Total Reach', 
      value: '12.5K', 
      change: '+15%',
      trend: 'up' as const,
      icon: 'account-group',
      color: theme.colors.primary 
    },
    { 
      label: 'Engagement', 
      value: '3.2K', 
      change: '+8%',
      trend: 'up' as const,
      icon: 'chart-line',
      color: theme.colors.success 
    },
    { 
      label: 'Conversions', 
      value: '856', 
      change: '+23%',
      trend: 'up' as const,
      icon: 'cash',
      color: theme.colors.accent 
    },
    { 
      label: 'CTR', 
      value: '6.8%', 
      change: '-2%',
      trend: 'down' as const,
      icon: 'cursor-default-click',
      color: theme.colors.warning 
    },
  ];
  
  const campaigns = [
    {
      id: '1',
      name: 'Launch Campaign',
      type: 'Social Media',
      status: 'active' as const,
      startDate: '2024-01-15',
      impressions: '8.2K',
      clicks: '564',
      budget: '$500',
    },
    {
      id: '2',
      name: 'Holiday Special',
      type: 'Email',
      status: 'scheduled' as const,
      startDate: '2024-02-01',
      impressions: '—',
      clicks: '—',
      budget: '$300',
    },
    {
      id: '3',
      name: 'Influencer Collab',
      type: 'Partnership',
      status: 'draft' as const,
      startDate: '2024-02-15',
      impressions: '—',
      clicks: '—',
      budget: '$750',
    },
  ];
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return theme.colors.success;
      case 'scheduled': return theme.colors.warning;
      case 'draft': return theme.colors.text + '60';
      default: return theme.colors.text;
    }
  };
  
  const getTrendIcon = (trend: string) => {
    return trend === 'up' ? 'trending-up' : 'trending-down';
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Animated.View 
          entering={FadeInDown.duration(500)}
          style={styles.header}
        >
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Marketing Dashboard
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.text + '80' }]}>
            Track your campaign performance
          </Text>
        </Animated.View>
        
        {/* Stats Grid */}
        <Animated.View 
          entering={FadeInUp.duration(500).delay(100)}
          style={styles.statsGrid}
        >
          {stats.map((stat, index) => (
            <Animated.View
              key={index}
              entering={FadeInUp.duration(400).delay(200 + index * 80)}
              style={[
                styles.statCard,
                { 
                  backgroundColor: theme.colors.card,
                  ...Platform.select({
                    web: { boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
                    default: { elevation: 3 },
                  }),
                },
              ]}
            >
              <View style={[styles.statIconBg, { backgroundColor: stat.color + '15' }]}>
                <Icon name={stat.icon} size={24} color={stat.color} />
              </View>
              <Text style={[styles.statLabel, { color: theme.colors.text + '80' }]}>
                {stat.label}
              </Text>
              <Text style={[styles.statValue, { color: theme.colors.text }]}>
                {stat.value}
              </Text>
              <View style={styles.statChange}>
                <Icon 
                  name={getTrendIcon(stat.trend)} 
                  size={14} 
                  color={stat.trend === 'up' ? theme.colors.success : theme.colors.error} 
                />
                <Text style={[
                  styles.statChangeText, 
                  { color: stat.trend === 'up' ? theme.colors.success : theme.colors.error }
                ]}>
                  {stat.change}
                </Text>
              </View>
            </Animated.View>
          ))}
        </Animated.View>
        
        {/* Tabs */}
        <Animated.View 
          entering={FadeInUp.duration(400).delay(400)}
          style={styles.tabContainer}
        >
          {(['overview', 'campaigns', 'analytics'] as const).map((tab) => (
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
              {/* Quick Actions */}
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                  Quick Actions
                </Text>
                <View style={styles.actionGrid}>
                  {[
                    { icon: 'plus-circle', label: 'New Campaign', color: theme.colors.primary },
                    { icon: 'chart-bar', label: 'View Reports', color: theme.colors.secondary },
                    { icon: 'share-variant', label: 'Share Assets', color: theme.colors.accent },
                    { icon: 'cog', label: 'Settings', color: theme.colors.warning },
                  ].map((action, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[styles.actionCard, { backgroundColor: theme.colors.card }]}
                    >
                      <View style={[styles.actionIcon, { backgroundColor: action.color + '15' }]}>
                        <Icon name={action.icon} size={28} color={action.color} />
                      </View>
                      <Text style={[styles.actionLabel, { color: theme.colors.text }]}>
                        {action.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              {/* Recent Activity */}
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                  Recent Activity
                </Text>
                {[
                  { icon: 'rocket-launch', text: 'Launch Campaign started', time: '2 hours ago', color: theme.colors.success },
                  { icon: 'eye', text: 'Reached 10K impressions', time: '5 hours ago', color: theme.colors.primary },
                  { icon: 'account-multiple', text: '150 new followers', time: '1 day ago', color: theme.colors.accent },
                ].map((activity, index) => (
                  <View
                    key={index}
                    style={[styles.activityItem, { backgroundColor: theme.colors.card }]}
                  >
                    <View style={[styles.activityIconBg, { backgroundColor: activity.color + '15' }]}>
                      <Icon name={activity.icon} size={20} color={activity.color} />
                    </View>
                    <View style={styles.activityContent}>
                      <Text style={[styles.activityText, { color: theme.colors.text }]}>
                        {activity.text}
                      </Text>
                      <Text style={[styles.activityTime, { color: theme.colors.text + '60' }]}>
                        {activity.time}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </Animated.View>
          )}
          
          {activeTab === 'campaigns' && (
            <Animated.View entering={FadeInUp.duration(300)}>
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                    Active Campaigns
                  </Text>
                  <TouchableOpacity style={[styles.addButton, { backgroundColor: theme.colors.primary }]}>
                    <Icon name="plus" size={20} color="#fff" />
                  </TouchableOpacity>
                </View>
                
                {campaigns.map((campaign, index) => (
                  <Animated.View
                    key={campaign.id}
                    entering={FadeInUp.duration(300).delay(index * 80)}
                    style={[styles.campaignCard, { backgroundColor: theme.colors.card }]}
                  >
                    <View style={styles.campaignHeader}>
                      <Text style={[styles.campaignName, { color: theme.colors.text }]}>
                        {campaign.name}
                      </Text>
                      <View style={[
                        styles.statusBadge,
                        { backgroundColor: getStatusColor(campaign.status) + '20' }
                      ]}>
                        <Text style={[styles.statusText, { color: getStatusColor(campaign.status) }]}>
                          {campaign.status}
                        </Text>
                      </View>
                    </View>
                    
                    <Text style={[styles.campaignType, { color: theme.colors.text + '80' }]}>
                      {campaign.type}
                    </Text>
                    
                    <View style={styles.campaignStats}>
                      <View style={styles.campaignStat}>
                        <Icon name="eye" size={16} color={theme.colors.text + '60'} />
                        <Text style={[styles.campaignStatText, { color: theme.colors.text + '80' }]}>
                          {campaign.impressions}
                        </Text>
                      </View>
                      <View style={styles.campaignStat}>
                        <Icon name="cursor-default-click" size={16} color={theme.colors.text + '60'} />
                        <Text style={[styles.campaignStatText, { color: theme.colors.text + '80' }]}>
                          {campaign.clicks}
                        </Text>
                      </View>
                      <View style={styles.campaignStat}>
                        <Icon name="cash" size={16} color={theme.colors.text + '60'} />
                        <Text style={[styles.campaignStatText, { color: theme.colors.text + '80' }]}>
                          {campaign.budget}
                        </Text>
                      </View>
                    </View>
                  </Animated.View>
                ))}
              </View>
            </Animated.View>
          )}
          
          {activeTab === 'analytics' && (
            <Animated.View entering={FadeInUp.duration(300)}>
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                  Performance Analytics
                </Text>
                
                {/* Chart Placeholder */}
                <View style={[styles.chartPlaceholder, { backgroundColor: theme.colors.card }]}>
                  <Icon name="chart-line" size={64} color={theme.colors.primary + '40'} />
                  <Text style={[styles.chartText, { color: theme.colors.text + '60' }]}>
                    Analytics charts coming soon
                  </Text>
                  <Text style={[styles.chartSubtext, { color: theme.colors.text + '40' }]}>
                    Track engagement, conversions, and ROI
                  </Text>
                </View>
                
                {/* Key Metrics */}
                <View style={styles.metricsGrid}>
                  {[
                    { label: 'Avg. Engagement Rate', value: '4.2%', icon: 'heart' },
                    { label: 'Best Performing Time', value: '2-4 PM', icon: 'clock' },
                    { label: 'Top Platform', value: 'Instagram', icon: 'instagram' },
                    { label: 'ROI', value: '3.5x', icon: 'trending-up' },
                  ].map((metric, index) => (
                    <View
                      key={index}
                      style={[styles.metricCard, { backgroundColor: theme.colors.card }]}
                    >
                      <Icon name={metric.icon} size={20} color={theme.colors.primary} />
                      <Text style={[styles.metricValue, { color: theme.colors.text }]}>
                        {metric.value}
                      </Text>
                      <Text style={[styles.metricLabel, { color: theme.colors.text + '70' }]}>
                        {metric.label}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </Animated.View>
          )}
        </View>
        
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    letterSpacing: 0.1,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12,
    gap: 12,
  },
  statCard: {
    width: (width - 48) / 2,
    padding: 16,
    borderRadius: 16,
  },
  statIconBg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statLabel: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 6,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  statChange: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statChangeText: {
    fontSize: 13,
    fontWeight: '600',
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    marginTop: 8,
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
    marginBottom: 28,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    width: (width - 56) / 2,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    ...Platform.select({
      web: { boxShadow: '0 1px 4px rgba(0,0,0,0.06)' },
      default: { elevation: 2 },
    }),
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  actionLabel: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  activityItem: {
    flexDirection: 'row',
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    ...Platform.select({
      web: { boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
      default: { elevation: 1 },
    }),
  },
  activityIconBg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
    justifyContent: 'center',
  },
  activityText: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 13,
  },
  campaignCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    ...Platform.select({
      web: { boxShadow: '0 2px 6px rgba(0,0,0,0.06)' },
      default: { elevation: 2 },
    }),
  },
  campaignHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  campaignName: {
    fontSize: 17,
    fontWeight: '700',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  campaignType: {
    fontSize: 14,
    marginBottom: 12,
  },
  campaignStats: {
    flexDirection: 'row',
    gap: 16,
  },
  campaignStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  campaignStatText: {
    fontSize: 14,
    fontWeight: '500',
  },
  chartPlaceholder: {
    height: 200,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  chartText: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
  },
  chartSubtext: {
    fontSize: 14,
    marginTop: 4,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  metricCard: {
    width: (width - 56) / 2,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    ...Platform.select({
      web: { boxShadow: '0 1px 4px rgba(0,0,0,0.06)' },
      default: { elevation: 2 },
    }),
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '800',
    marginTop: 8,
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  metricLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
});
