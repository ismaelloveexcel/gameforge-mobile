/**
 * Marketing Dashboard Screen
 * 
 * Real-time marketing analytics and campaign management
 * Tracks social media, ads, conversions, revenue
 * 
 * Auto-refreshes every 5 minutes
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../contexts/ThemeContext';
import { spacing, typography, radii } from '../design-tokens/theme';
import DodoCompanion from '../components/DodoCompanion';

interface CampaignMetrics {
  name: string;
  status: 'active' | 'scheduled' | 'completed';
  metrics: {
    impressions: number;
    clicks: number;
    conversions: number;
    revenue: number;
    ctr: number;
    cpc: number;
    roas: number;
  };
}

interface SocialMetrics {
  platform: 'instagram' | 'tiktok' | 'facebook';
  followers: number;
  postsThisWeek: number;
  avgEngagement: number;
  topPost: {
    caption: string;
    likes: number;
    comments: number;
  };
}

export default function MarketingDashboardScreen() {
  const { theme } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [campaigns, setCampaigns] = useState<CampaignMetrics[]>([]);
  const [socialMetrics, setSocialMetrics] = useState<SocialMetrics[]>([]);
  const [todayStats, setTodayStats] = useState({
    downloads: 0,
    giftsCreated: 0,
    revenue: 0,
    adSpend: 0,
  });

  useEffect(() => {
    loadMetrics();
    
    // Auto-refresh every 5 minutes
    const interval = setInterval(loadMetrics, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const loadMetrics = async () => {
    setRefreshing(true);
    
    try {
      // In production, fetch from Firebase Analytics
      // For now, use mock data
      
      setCampaigns([
        {
          name: "Valentine's Day 2026",
          status: 'active',
          metrics: {
            impressions: 12547,
            clicks: 892,
            conversions: 47,
            revenue: 705, // AED
            ctr: 7.1,
            cpc: 0.56,
            roas: 126, // 126% return on ad spend
          }
        }
      ]);

      setSocialMetrics([
        {
          platform: 'instagram',
          followers: 342,
          postsThisWeek: 12,
          avgEngagement: 8.4,
          topPost: {
            caption: 'Dodo brewing love magic! 💝',
            likes: 127,
            comments: 23
          }
        }
      ]);

      setTodayStats({
        downloads: 47,
        giftsCreated: 31,
        revenue: 465,
        adSpend: 89,
      });
      
    } catch (error) {
      console.error('Failed to load metrics:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    loadMetrics();
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          Marketing Dashboard
        </Text>
        <DodoCompanion mood="thinking" size="mini" showBubble={false} />
      </View>

      {/* Today's Stats */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Today's Performance
        </Text>
        
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: theme.colors.card }]}>
            <Icon name="download" size={24} color="#10B981" />
            <Text style={[styles.statValue, { color: theme.colors.text }]}>
              {todayStats.downloads}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.notification }]}>
              Downloads
            </Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: theme.colors.card }]}>
            <Icon name="gift" size={24} color="#F59E0B" />
            <Text style={[styles.statValue, { color: theme.colors.text }]}>
              {todayStats.giftsCreated}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.notification }]}>
              Gifts Created
            </Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: theme.colors.card }]}>
            <Icon name="cash" size={24} color="#8B5CF6" />
            <Text style={[styles.statValue, { color: theme.colors.text }]}>
              AED {todayStats.revenue}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.notification }]}>
              Revenue
            </Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: theme.colors.card }]}>
            <Icon name="chart-line" size={24} color="#EC4899" />
            <Text style={[styles.statValue, { color: theme.colors.text }]}>
              {((todayStats.revenue / todayStats.adSpend) * 100 - 100).toFixed(0)}%
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.notification }]}>
              ROAS
            </Text>
          </View>
        </View>
      </View>

      {/* Active Campaigns */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Active Campaigns
        </Text>

        {campaigns.map((campaign, index) => (
          <View 
            key={index}
            style={[styles.campaignCard, { backgroundColor: theme.colors.card }]}
          >
            <View style={styles.campaignHeader}>
              <Text style={[styles.campaignName, { color: theme.colors.text }]}>
                {campaign.name}
              </Text>
              <View style={[
                styles.statusBadge,
                { backgroundColor: campaign.status === 'active' ? '#10B981' : '#6B7280' }
              ]}>
                <Text style={styles.statusText}>{campaign.status}</Text>
              </View>
            </View>

            <View style={styles.metricsGrid}>
              <View style={styles.metric}>
                <Text style={[styles.metricValue, { color: theme.colors.text }]}>
                  {campaign.metrics.impressions.toLocaleString()}
                </Text>
                <Text style={[styles.metricLabel, { color: theme.colors.notification }]}>
                  Impressions
                </Text>
              </View>

              <View style={styles.metric}>
                <Text style={[styles.metricValue, { color: theme.colors.text }]}>
                  {campaign.metrics.clicks}
                </Text>
                <Text style={[styles.metricLabel, { color: theme.colors.notification }]}>
                  Clicks
                </Text>
              </View>

              <View style={styles.metric}>
                <Text style={[styles.metricValue, { color: theme.colors.text }]}>
                  {campaign.metrics.ctr}%
                </Text>
                <Text style={[styles.metricLabel, { color: theme.colors.notification }]}>
                  CTR
                </Text>
              </View>

              <View style={styles.metric}>
                <Text style={[styles.metricValue, { color: theme.colors.text }]}>
                  AED {campaign.metrics.revenue}
                </Text>
                <Text style={[styles.metricLabel, { color: theme.colors.notification }]}>
                  Revenue
                </Text>
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* Social Media Performance */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Social Media
        </Text>

        {socialMetrics.map((social, index) => (
          <View 
            key={index}
            style={[styles.socialCard, { backgroundColor: theme.colors.card }]}
          >
            <View style={styles.socialHeader}>
              <Icon 
                name={
                  social.platform === 'instagram' ? 'instagram' :
                  social.platform === 'tiktok' ? 'music-note' :
                  'facebook'
                } 
                size={24} 
                color={theme.colors.primary} 
              />
              <Text style={[styles.platformName, { color: theme.colors.text }]}>
                {social.platform.charAt(0).toUpperCase() + social.platform.slice(1)}
              </Text>
              <Text style={[styles.followerCount, { color: theme.colors.notification }]}>
                {social.followers} followers
              </Text>
            </View>

            <View style={styles.socialStats}>
              <Text style={[styles.socialStat, { color: theme.colors.text }]}>
                📝 {social.postsThisWeek} posts this week
              </Text>
              <Text style={[styles.socialStat, { color: theme.colors.text }]}>
                💚 {social.avgEngagement}% avg engagement
              </Text>
            </View>

            {social.topPost && (
              <View style={[styles.topPost, { borderColor: theme.colors.border }]}>
                <Text style={[styles.topPostLabel, { color: theme.colors.notification }]}>
                  Top Post:
                </Text>
                <Text style={[styles.topPostCaption, { color: theme.colors.text }]}>
                  "{social.topPost.caption}"
                </Text>
                <Text style={[styles.topPostStats, { color: theme.colors.notification }]}>
                  ❤️ {social.topPost.likes} • 💬 {social.topPost.comments}
                </Text>
              </View>
            )}
          </View>
        ))}
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Quick Actions
        </Text>

        <TouchableOpacity style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}>
          <Icon name="plus" size={20} color="#fff" />
          <Text style={styles.actionButtonText}>Create New Campaign</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionButton, { backgroundColor: theme.colors.card }]}>
          <Icon name="calendar" size={20} color={theme.colors.text} />
          <Text style={[styles.actionButtonText, { color: theme.colors.text }]}>
            View Schedule
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionButton, { backgroundColor: theme.colors.card }]}>
          <Icon name="chart-bar" size={20} color={theme.colors.text} />
          <Text style={[styles.actionButtonText, { color: theme.colors.text }]}>
            Export Report
          </Text>
        </TouchableOpacity>
      </View>

      {/* Dodo's Marketing Tip */}
      <View style={[styles.dodoTip, { backgroundColor: theme.colors.card }]}>
        <DodoCompanion mood="thinking" size="small" showBubble={false} />
        <Text style={[styles.tipText, { color: theme.colors.text }]}>
          💡 Dodo's Tip: Post at 10 AM, 2 PM, and 8 PM UAE time for best engagement!
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  headerTitle: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
  },
  section: {
    padding: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    marginBottom: spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    padding: spacing.md,
    borderRadius: radii.lg,
    alignItems: 'center',
    gap: spacing.xs,
  },
  statValue: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
  },
  statLabel: {
    fontSize: typography.size.sm,
  },
  campaignCard: {
    padding: spacing.md,
    borderRadius: radii.lg,
    marginBottom: spacing.md,
  },
  campaignHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  campaignName: {
    flex: 1,
    fontSize: typography.size.base,
    fontWeight: typography.weight.semibold,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radii.sm,
  },
  statusText: {
    color: '#fff',
    fontSize: typography.size.xs,
    fontWeight: typography.weight.bold,
    textTransform: 'uppercase',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  metric: {
    flex: 1,
    minWidth: '22%',
    alignItems: 'center',
  },
  metricValue: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.bold,
  },
  metricLabel: {
    fontSize: typography.size.xs,
    marginTop: 2,
  },
  socialCard: {
    padding: spacing.md,
    borderRadius: radii.lg,
    marginBottom: spacing.md,
  },
  socialHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  platformName: {
    flex: 1,
    fontSize: typography.size.base,
    fontWeight: typography.weight.semibold,
  },
  followerCount: {
    fontSize: typography.size.sm,
  },
  socialStats: {
    marginBottom: spacing.sm,
  },
  socialStat: {
    fontSize: typography.size.sm,
    marginBottom: 4,
  },
  topPost: {
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
  },
  topPostLabel: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.semibold,
    marginBottom: 4,
  },
  topPostCaption: {
    fontSize: typography.size.sm,
    marginBottom: 4,
    fontStyle: 'italic',
  },
  topPostStats: {
    fontSize: typography.size.xs,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    borderRadius: radii.md,
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  actionButtonText: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.semibold,
    color: '#fff',
  },
  dodoTip: {
    margin: spacing.lg,
    padding: spacing.md,
    borderRadius: radii.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  tipText: {
    flex: 1,
    fontSize: typography.size.sm,
    lineHeight: typography.size.sm * 1.4,
  },
});
