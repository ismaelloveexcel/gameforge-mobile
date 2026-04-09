import React, { useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useTheme } from '../contexts/ThemeContext';
import { useGiftStore } from '../stores/giftStore';
import {
  RootStackParamList,
  GiftExperience,
  GIFT_TYPE_LABELS,
  OCCASION_LABELS,
} from '../types';

type NavigationProp = StackNavigationProp<RootStackParamList>;

function formatDate(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function GiftHistoryScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const { gifts, loadGifts, isLoaded } = useGiftStore();
  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    loadGifts();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadGifts();
    setRefreshing(false);
  }, [loadGifts]);

  const renderGiftCard = ({ item, index }: { item: GiftExperience; index: number }) => {
    const typeInfo = GIFT_TYPE_LABELS[item.giftType];
    return (
      <Animated.View entering={FadeInUp.duration(400).delay(index * 80)}>
        <TouchableOpacity
          style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('GiftPreview', { giftId: item.id })}
        >
          {/* Thumbnail / Icon */}
          <View style={[styles.thumbnail, { backgroundColor: theme.colors.primary + '15' }]}>
            <Icon
              name={typeInfo?.icon ?? 'gift'}
              size={28}
              color={theme.colors.primary}
            />
          </View>

          {/* Details */}
          <View style={styles.details}>
            <Text style={[styles.recipient, { color: theme.colors.text }]} numberOfLines={1}>
              To {item.recipient.name}
            </Text>
            <Text style={[styles.meta, { color: theme.colors.textMuted }]} numberOfLines={1}>
              {typeInfo?.label} · {OCCASION_LABELS[item.occasion]}
            </Text>
            <Text style={[styles.date, { color: theme.colors.textMuted }]}>
              {formatDate(item.createdAt)}
            </Text>
          </View>

          <Icon name="chevron-right" size={22} color={theme.colors.textMuted} />
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Animated.View entering={FadeInUp.duration(500)} style={styles.emptyContent}>
        <Icon name="gift-open-outline" size={64} color={theme.colors.textMuted} />
        <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
          No gifts yet
        </Text>
        <Text style={[styles.emptySubtitle, { color: theme.colors.textMuted }]}>
          Your created gifts will appear here
        </Text>
        <TouchableOpacity
          style={[styles.emptyButton, { backgroundColor: theme.colors.primary }]}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('GiftWizard')}
        >
          <Text style={styles.emptyButtonText}>Create Your First Gift</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlatList
        data={gifts}
        keyExtractor={(item) => item.id}
        renderItem={renderGiftCard}
        contentContainerStyle={gifts.length === 0 ? styles.emptyList : styles.list}
        ListEmptyComponent={isLoaded ? renderEmpty : null}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary]}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    padding: 20,
    paddingBottom: 40,
  },
  emptyList: {
    flexGrow: 1,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    marginBottom: 12,
  },
  thumbnail: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  details: {
    flex: 1,
  },
  recipient: {
    fontSize: 16,
    fontWeight: '600',
  },
  meta: {
    fontSize: 13,
    marginTop: 2,
  },
  date: {
    fontSize: 12,
    marginTop: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyContent: {
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 15,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 24,
  },
  emptyButton: {
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 12,
  },
  emptyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
