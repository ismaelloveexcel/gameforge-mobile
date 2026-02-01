/**
 * Command Centre - Unified dashboard for non-technical management
 * 
 * Provides at-a-glance monitoring and control of:
 * - System health
 * - Content pipeline
 * - Business metrics
 * - Seasonal themes
 * - Agent workflows
 */
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, {
  FadeIn,
  FadeInUp,
  FadeInDown,
} from 'react-native-reanimated';
import { useTheme, THEME_OPTIONS } from '../contexts/ThemeContext';
import { spacing, typography, radii } from '../design-tokens/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Types
interface SystemStatus {
  app: 'online' | 'degraded' | 'offline';
  agents: 'running' | 'idle' | 'error';
  deployments: 'healthy' | 'pending' | 'failed';
  alerts: number;
}

interface DailyMetrics {
  gamesCreated: number;
  gamesShared: number;
  shareRate: number;
  estimatedRevenue: number;
  changeVsYesterday: number;
}

interface PipelineItem {
  id: string;
  name: string;
  stage: 'research' | 'validation' | 'testing' | 'live';
  score?: number;
  revenueEstimate?: number;
}

interface AgentStatus {
  id: string;
  name: string;
  icon: string;
  status: 'running' | 'idle' | 'error';
  lastRun: string;
}

// Mock data (replace with real API calls)
const mockSystemStatus: SystemStatus = {
  app: 'online',
  agents: 'running',
  deployments: 'healthy',
  alerts: 0,
};

const mockMetrics: DailyMetrics = {
  gamesCreated: 47,
  gamesShared: 31,
  shareRate: 66,
  estimatedRevenue: 890,
  changeVsYesterday: 12,
};

const mockPipeline: PipelineItem[] = [
  { id: '1', name: 'Cozy Cat Quest', stage: 'validation', revenueEstimate: 12000 },
  { id: '2', name: 'Memory Lane', stage: 'testing', score: 8.5 },
  { id: '3', name: 'Heartfelt Runner', stage: 'live', score: 9.2 },
];

const mockAgents: AgentStatus[] = [
  { id: 'sniper', name: 'Concept Sniper', icon: 'target', status: 'idle', lastRun: '2h ago' },
  { id: 'monetization', name: 'Monetization Enforcer', icon: 'currency-usd', status: 'running', lastRun: 'Now' },
  { id: 'automation', name: 'Automation Architect', icon: 'cog', status: 'idle', lastRun: '4h ago' },
  { id: 'killswitch', name: 'Kill-Switch Governor', icon: 'traffic-light', status: 'idle', lastRun: '6h ago' },
];

export default function CommandCentreScreen() {
  const { theme, seasonalTheme, themeChoice, setThemeChoice } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [systemStatus, setSystemStatus] = useState<SystemStatus>(mockSystemStatus);
  const [metrics, setMetrics] = useState<DailyMetrics>(mockMetrics);
  const [pipeline, setPipeline] = useState<PipelineItem[]>(mockPipeline);
  const [agents, setAgents] = useState<AgentStatus[]>(mockAgents);
  
  const colors = seasonalTheme.colors;

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    // In production, fetch real data here
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
      case 'running':
      case 'healthy':
      case 'live':
        return '#10B981';
      case 'degraded':
      case 'pending':
      case 'testing':
      case 'idle':
        return '#FBBF24';
      case 'offline':
      case 'error':
      case 'failed':
        return '#EF4444';
      default:
        return colors.muted;
    }
  };

  const getStageLabel = (stage: string) => {
    switch (stage) {
      case 'research': return 'Researching';
      case 'validation': return 'Awaiting Approval';
      case 'testing': return 'Testing';
      case 'live': return 'Live';
      default: return stage;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <Animated.View 
          entering={FadeInDown.duration(500)}
          style={styles.header}
        >
          <Text style={[styles.title, { color: colors.text }]}>
            Command Centre
          </Text>
          <Text style={[styles.subtitle, { color: colors.muted }]}>
            GameForge HQ
          </Text>
        </Animated.View>

        {/* System Health */}
        <Animated.View 
          entering={FadeIn.delay(100)}
          style={[styles.section, styles.healthSection, { backgroundColor: colors.surface }]}
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            System Health
          </Text>
          <View style={styles.healthGrid}>
            <View style={styles.healthItem}>
              <View style={[styles.statusDot, { backgroundColor: getStatusColor(systemStatus.app) }]} />
              <Text style={[styles.healthLabel, { color: colors.muted }]}>App</Text>
              <Text style={[styles.healthValue, { color: colors.text }]}>
                {systemStatus.app.toUpperCase()}
              </Text>
            </View>
            <View style={styles.healthItem}>
              <View style={[styles.statusDot, { backgroundColor: getStatusColor(systemStatus.agents) }]} />
              <Text style={[styles.healthLabel, { color: colors.muted }]}>Agents</Text>
              <Text style={[styles.healthValue, { color: colors.text }]}>
                {systemStatus.agents.toUpperCase()}
              </Text>
            </View>
            <View style={styles.healthItem}>
              <View style={[styles.statusDot, { backgroundColor: getStatusColor(systemStatus.deployments) }]} />
              <Text style={[styles.healthLabel, { color: colors.muted }]}>Deploy</Text>
              <Text style={[styles.healthValue, { color: colors.text }]}>
                {systemStatus.deployments.toUpperCase()}
              </Text>
            </View>
            <View style={styles.healthItem}>
              <Icon 
                name={systemStatus.alerts > 0 ? 'bell-ring' : 'bell-outline'} 
                size={20} 
                color={systemStatus.alerts > 0 ? '#EF4444' : colors.muted} 
              />
              <Text style={[styles.healthLabel, { color: colors.muted }]}>Alerts</Text>
              <Text style={[styles.healthValue, { color: colors.text }]}>
                {systemStatus.alerts}
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Today's Metrics */}
        <Animated.View 
          entering={FadeInUp.delay(200)}
          style={[styles.section, { backgroundColor: colors.surface }]}
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Today's Numbers
          </Text>
          <View style={styles.metricsGrid}>
            <View style={[styles.metricCard, { backgroundColor: colors.background }]}>
              <Icon name="gamepad-variant" size={24} color={colors.accent} />
              <Text style={[styles.metricValue, { color: colors.text }]}>
                {metrics.gamesCreated}
              </Text>
              <Text style={[styles.metricLabel, { color: colors.muted }]}>
                Games Created
              </Text>
              <Text style={[styles.metricChange, { color: '#10B981' }]}>
                ↑ {metrics.changeVsYesterday}%
              </Text>
            </View>
            <View style={[styles.metricCard, { backgroundColor: colors.background }]}>
              <Icon name="share-variant" size={24} color={colors.accent} />
              <Text style={[styles.metricValue, { color: colors.text }]}>
                {metrics.gamesShared}
              </Text>
              <Text style={[styles.metricLabel, { color: colors.muted }]}>
                Games Shared
              </Text>
              <Text style={[styles.metricChange, { color: colors.muted }]}>
                {metrics.shareRate}% rate
              </Text>
            </View>
            <View style={[styles.metricCard, { backgroundColor: colors.background }]}>
              <Icon name="cash" size={24} color={colors.accent} />
              <Text style={[styles.metricValue, { color: colors.text }]}>
                {metrics.estimatedRevenue}
              </Text>
              <Text style={[styles.metricLabel, { color: colors.muted }]}>
                Est. Revenue (AED)
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Active Theme */}
        <Animated.View 
          entering={FadeInUp.delay(300)}
          style={[styles.section, { backgroundColor: colors.surface }]}
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Active Theme
          </Text>
          <View style={[styles.themePreview, { borderColor: colors.accent + '40' }]}>
            <View style={[styles.themeColorSwatch, { backgroundColor: colors.primary }]} />
            <View style={[styles.themeColorSwatch, { backgroundColor: colors.accent }]} />
            <View style={[styles.themeColorSwatch, { backgroundColor: colors.secondary }]} />
            <View style={styles.themeInfo}>
              <Text style={[styles.themeName, { color: colors.text }]}>
                {seasonalTheme.name}
              </Text>
              <Text style={[styles.themeMood, { color: colors.muted }]}>
                {seasonalTheme.mood.split(',')[0]}
              </Text>
            </View>
          </View>
          <View style={styles.themeOptions}>
            {THEME_OPTIONS.slice(0, 4).map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.themeOption,
                  themeChoice === option.id && { backgroundColor: colors.accent + '20', borderColor: colors.accent }
                ]}
                onPress={() => setThemeChoice(option.id)}
              >
                <Text style={[
                  styles.themeOptionText,
                  { color: themeChoice === option.id ? colors.accent : colors.muted }
                ]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Content Pipeline */}
        <Animated.View 
          entering={FadeInUp.delay(400)}
          style={[styles.section, { backgroundColor: colors.surface }]}
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Content Pipeline
          </Text>
          {pipeline.map((item) => (
            <View 
              key={item.id} 
              style={[styles.pipelineItem, { borderColor: colors.muted + '30' }]}
            >
              <View style={[styles.pipelineStage, { backgroundColor: getStatusColor(item.stage) + '20' }]}>
                <Text style={[styles.pipelineStageText, { color: getStatusColor(item.stage) }]}>
                  {getStageLabel(item.stage)}
                </Text>
              </View>
              <View style={styles.pipelineContent}>
                <Text style={[styles.pipelineName, { color: colors.text }]}>
                  {item.name}
                </Text>
                {item.score && (
                  <Text style={[styles.pipelineScore, { color: colors.muted }]}>
                    Score: {item.score}/10
                  </Text>
                )}
                {item.revenueEstimate && (
                  <Text style={[styles.pipelineScore, { color: colors.muted }]}>
                    Est: AED {(item.revenueEstimate / 1000).toFixed(0)}k/mo
                  </Text>
                )}
              </View>
              {item.stage === 'validation' && (
                <View style={styles.pipelineActions}>
                  <TouchableOpacity style={[styles.actionBtn, styles.approveBtn]}>
                    <Icon name="check" size={16} color="#FFF" />
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.actionBtn, styles.rejectBtn]}>
                    <Icon name="close" size={16} color="#FFF" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))}
        </Animated.View>

        {/* Agent Workflows */}
        <Animated.View 
          entering={FadeInUp.delay(500)}
          style={[styles.section, { backgroundColor: colors.surface }]}
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Agent Workflows
          </Text>
          {agents.map((agent) => (
            <View 
              key={agent.id} 
              style={[styles.agentItem, { borderColor: colors.muted + '30' }]}
            >
              <Icon name={agent.icon} size={24} color={colors.accent} />
              <View style={styles.agentInfo}>
                <Text style={[styles.agentName, { color: colors.text }]}>
                  {agent.name}
                </Text>
                <Text style={[styles.agentLastRun, { color: colors.muted }]}>
                  {agent.lastRun}
                </Text>
              </View>
              <View style={[styles.agentStatus, { backgroundColor: getStatusColor(agent.status) + '20' }]}>
                <View style={[styles.statusDotSmall, { backgroundColor: getStatusColor(agent.status) }]} />
                <Text style={[styles.agentStatusText, { color: getStatusColor(agent.status) }]}>
                  {agent.status}
                </Text>
              </View>
              {agent.status === 'idle' && (
                <TouchableOpacity style={[styles.runBtn, { backgroundColor: colors.accent }]}>
                  <Icon name="play" size={14} color={colors.background} />
                </TouchableOpacity>
              )}
            </View>
          ))}
          <TouchableOpacity 
            style={[styles.runAllBtn, { backgroundColor: colors.accent }]}
          >
            <Icon name="play-circle" size={20} color={colors.background} />
            <Text style={[styles.runAllText, { color: colors.background }]}>
              Run All Agents
            </Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Quick Actions */}
        <Animated.View 
          entering={FadeInUp.delay(600)}
          style={styles.quickActions}
        >
          <TouchableOpacity style={[styles.quickAction, { backgroundColor: colors.surface }]}>
            <Icon name="chart-line" size={24} color={colors.accent} />
            <Text style={[styles.quickActionText, { color: colors.text }]}>Reports</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.quickAction, { backgroundColor: colors.surface }]}>
            <Icon name="gamepad-variant" size={24} color={colors.accent} />
            <Text style={[styles.quickActionText, { color: colors.text }]}>Test</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.quickAction, { backgroundColor: colors.surface }]}>
            <Icon name="rocket-launch" size={24} color={colors.accent} />
            <Text style={[styles.quickActionText, { color: colors.text }]}>Deploy</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.quickAction, { backgroundColor: colors.surface }]}>
            <Icon name="cog" size={24} color={colors.accent} />
            <Text style={[styles.quickActionText, { color: colors.text }]}>Settings</Text>
          </TouchableOpacity>
        </Animated.View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  title: {
    fontSize: typography.size.xxl,
    fontWeight: typography.weight.black,
  },
  subtitle: {
    fontSize: typography.size.sm,
    marginTop: spacing.xxs,
  },
  section: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    borderRadius: radii.lg,
    padding: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.bold,
    marginBottom: spacing.md,
  },
  healthSection: {},
  healthGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  healthItem: {
    alignItems: 'center',
    flex: 1,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginBottom: spacing.xs,
  },
  statusDotSmall: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  healthLabel: {
    fontSize: typography.size.xs,
    marginBottom: 2,
  },
  healthValue: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.semibold,
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  metricCard: {
    flex: 1,
    borderRadius: radii.md,
    padding: spacing.md,
    alignItems: 'center',
  },
  metricValue: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    marginTop: spacing.xs,
  },
  metricLabel: {
    fontSize: typography.size.xs,
    textAlign: 'center',
    marginTop: 2,
  },
  metricChange: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.medium,
    marginTop: spacing.xxs,
  },
  themePreview: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radii.md,
    borderWidth: 1,
    marginBottom: spacing.md,
  },
  themeColorSwatch: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: spacing.xs,
  },
  themeInfo: {
    marginLeft: spacing.sm,
    flex: 1,
  },
  themeName: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.semibold,
  },
  themeMood: {
    fontSize: typography.size.xs,
    marginTop: 2,
  },
  themeOptions: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  themeOption: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: 'transparent',
    alignItems: 'center',
  },
  themeOptionText: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.medium,
  },
  pipelineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
  },
  pipelineStage: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: radii.sm,
    marginRight: spacing.sm,
  },
  pipelineStageText: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.medium,
  },
  pipelineContent: {
    flex: 1,
  },
  pipelineName: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
  },
  pipelineScore: {
    fontSize: typography.size.xs,
    marginTop: 2,
  },
  pipelineActions: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  actionBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  approveBtn: {
    backgroundColor: '#10B981',
  },
  rejectBtn: {
    backgroundColor: '#EF4444',
  },
  agentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
  },
  agentInfo: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  agentName: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
  },
  agentLastRun: {
    fontSize: typography.size.xs,
    marginTop: 2,
  },
  agentStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: radii.sm,
    marginRight: spacing.sm,
  },
  agentStatusText: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.medium,
    textTransform: 'capitalize',
  },
  runBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  runAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderRadius: radii.md,
    marginTop: spacing.md,
    gap: spacing.xs,
  },
  runAllText: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.bold,
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  quickAction: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderRadius: radii.md,
  },
  quickActionText: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.medium,
    marginTop: spacing.xs,
  },
});
