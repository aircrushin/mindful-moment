import React, { useEffect, useMemo } from 'react';
import { View, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { useTheme } from '@/hooks/useTheme';
import { Screen } from '@/components/Screen';
import { ThemedText } from '@/components/ThemedText';
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchMeditations } from '@/store/slices/meditationSlice';
import { fetchStats } from '@/store/slices/progressSlice';
import { createStyles } from './styles';
import { Meditation } from '@/types';

export default function HomeScreen() {
  const { theme, isDark } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const router = useSafeRouter();
  const dispatch = useAppDispatch();
  
  const { user } = useAppSelector((state) => state.auth);
  const { meditations, featuredMeditations, isLoading: meditationLoading } = useAppSelector((state) => state.meditations);
  const { stats, isLoading: statsLoading } = useAppSelector((state) => state.progress);
  
  const [refreshing, setRefreshing] = React.useState(false);

  const loadData = async () => {
    await Promise.all([
      dispatch(fetchMeditations(undefined)),
      dispatch(fetchMeditations({ featured: true })),
      dispatch(fetchStats()),
    ]);
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handlePlayMeditation = (meditation: Meditation) => {
    router.push('/player', { id: meditation.id });
  };

  const isLoading = meditationLoading || statsLoading;

  if (isLoading && !refreshing && meditations.length === 0) {
    return (
      <Screen backgroundColor={theme.backgroundRoot} statusBarStyle={isDark ? 'light' : 'dark'}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      </Screen>
    );
  }

  return (
    <Screen backgroundColor={theme.backgroundRoot} statusBarStyle={isDark ? 'light' : 'dark'}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.primary} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <ThemedText variant="h3" style={styles.greeting} color={theme.textPrimary}>
            Hello, {user?.displayName || 'there'} 👋
          </ThemedText>
          <ThemedText variant="body" color={theme.textSecondary}>
            Ready for today&apos;s mindfulness practice?
          </ThemedText>
        </View>

        {/* Stats Grid */}
        {stats && (
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <ThemedText variant="stat" style={styles.statValue}>
                {stats.currentStreak}
              </ThemedText>
              <ThemedText variant="caption" style={styles.statLabel}>
                Day Streak
              </ThemedText>
            </View>
            <View style={[styles.statCard, { backgroundColor: theme.accent }]}>
              <ThemedText variant="stat" style={styles.statValue}>
                {stats.totalMinutes}
              </ThemedText>
              <ThemedText variant="caption" style={styles.statLabel}>
                Total Minutes
              </ThemedText>
            </View>
            <View style={[styles.statCard, { backgroundColor: '#10B981' }]}>
              <ThemedText variant="stat" style={styles.statValue}>
                {stats.totalSessions}
              </ThemedText>
              <ThemedText variant="caption" style={styles.statLabel}>
                Sessions
              </ThemedText>
            </View>
          </View>
        )}

        {/* Featured Meditation */}
        {featuredMeditations.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <ThemedText variant="h4" style={styles.sectionTitle} color={theme.textPrimary}>
                Featured
              </ThemedText>
            </View>
            {featuredMeditations.slice(0, 1).map((meditation) => (
              <TouchableOpacity
                key={meditation.id}
                style={styles.featuredCard}
                onPress={() => handlePlayMeditation(meditation)}
              >
                <Image
                  source={{ uri: meditation.imageUrl }}
                  style={styles.featuredImage}
                  contentFit="cover"
                />
                <View style={styles.featuredContent}>
                  <ThemedText variant="title" style={styles.featuredTitle} color={theme.textPrimary}>
                    {meditation.title}
                  </ThemedText>
                  <View style={styles.featuredMeta}>
                    <View style={styles.durationBadge}>
                      <FontAwesome6 name="clock" size={12} color={theme.primary} />
                      <ThemedText variant="caption" color={theme.primary}>
                        {meditation.durationMinutes} min
                      </ThemedText>
                    </View>
                    <View style={styles.categoryBadge}>
                      <ThemedText variant="caption" color={theme.accent}>
                        {meditation.category}
                      </ThemedText>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Quick Start */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText variant="h4" style={styles.sectionTitle} color={theme.textPrimary}>
              Quick Start
            </ThemedText>
            <TouchableOpacity onPress={() => router.push('/library')}>
              <ThemedText variant="smallMedium" style={styles.seeAll}>
                See All
              </ThemedText>
            </TouchableOpacity>
          </View>
          {meditations.slice(0, 4).map((meditation) => (
            <TouchableOpacity
              key={meditation.id}
              style={styles.meditationRow}
              onPress={() => handlePlayMeditation(meditation)}
            >
              <Image
                source={{ uri: meditation.imageUrl }}
                style={styles.meditationImage}
                contentFit="cover"
              />
              <View style={styles.meditationInfo}>
                <ThemedText variant="bodyMedium" style={styles.meditationTitle} color={theme.textPrimary}>
                  {meditation.title}
                </ThemedText>
                <ThemedText variant="caption" color={theme.textSecondary}>
                  {meditation.durationMinutes} min • {meditation.category}
                </ThemedText>
              </View>
              <View style={styles.playButton}>
                <FontAwesome6 name="play" size={16} color="#FFFFFF" solid />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </Screen>
  );
}
