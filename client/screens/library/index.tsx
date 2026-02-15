import React, { useEffect, useMemo, useState } from 'react';
import { View, ScrollView, TouchableOpacity, ActivityIndicator, TextInput, RefreshControl } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { useTheme } from '@/hooks/useTheme';
import { Screen } from '@/components/Screen';
import { ThemedText } from '@/components/ThemedText';
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchMeditations, fetchCategories } from '@/store/slices/meditationSlice';
import { createStyles } from './styles';
import { Meditation } from '@/types';

const DURATIONS = [
  { label: 'All', value: null },
  { label: '1 min', value: 1 },
  { label: '3 min', value: 3 },
  { label: '5 min', value: 5 },
];

export default function LibraryScreen() {
  const { theme, isDark } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const router = useSafeRouter();
  const dispatch = useAppDispatch();
  
  const { meditations, categories, isLoading } = useAppSelector((state) => state.meditations);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    const params: { category?: string; duration?: number } = {};
    if (selectedCategory) params.category = selectedCategory;
    if (selectedDuration) params.duration = selectedDuration;
    await dispatch(fetchMeditations(Object.keys(params).length > 0 ? params : undefined));
  };

  useEffect(() => {
    dispatch(fetchCategories());
    loadData();
  }, []);

  useEffect(() => {
    loadData();
  }, [selectedCategory, selectedDuration]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handlePlayMeditation = (meditation: Meditation) => {
    router.push('/player', { id: meditation.id });
  };

  const filteredMeditations = meditations.filter((m) => {
    if (!searchQuery) return true;
    return (
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

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
          <ThemedText variant="h2" color={theme.textPrimary}>
            Meditation Library
          </ThemedText>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <FontAwesome6 name="magnifying-glass" size={18} color={theme.textMuted} />
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search meditations..."
            placeholderTextColor={theme.textMuted}
          />
        </View>

        {/* Duration Filter */}
        <View style={styles.filterRow}>
          {DURATIONS.map((duration) => (
            <TouchableOpacity
              key={duration.label}
              style={[
                styles.filterButton,
                selectedDuration === duration.value && styles.filterButtonActive,
              ]}
              onPress={() => setSelectedDuration(duration.value)}
            >
              <ThemedText
                variant="smallMedium"
                color={selectedDuration === duration.value ? '#FFFFFF' : theme.textPrimary}
              >
                {duration.label}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>

        {/* Categories */}
        {categories.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesScroll}
            contentContainerStyle={styles.categoriesContent}
          >
            <TouchableOpacity
              style={[styles.categoryChip, !selectedCategory && styles.categoryChipActive]}
              onPress={() => setSelectedCategory(null)}
            >
              <ThemedText
                variant="smallMedium"
                color={!selectedCategory ? '#FFFFFF' : theme.textPrimary}
              >
                All
              </ThemedText>
            </TouchableOpacity>
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[styles.categoryChip, selectedCategory === category && styles.categoryChipActive]}
                onPress={() => setSelectedCategory(category)}
              >
                <ThemedText
                  variant="smallMedium"
                  color={selectedCategory === category ? '#FFFFFF' : theme.textPrimary}
                >
                  {category}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* Meditation List */}
        {filteredMeditations.length === 0 ? (
          <View style={styles.emptyState}>
            <FontAwesome6 name="magnifying-glass" size={48} color={theme.textMuted} />
            <ThemedText variant="body" color={theme.textSecondary} style={{ marginTop: 16 }}>
              No meditations found
            </ThemedText>
          </View>
        ) : (
          filteredMeditations.map((meditation) => (
            <TouchableOpacity
              key={meditation.id}
              style={styles.meditationCard}
              onPress={() => handlePlayMeditation(meditation)}
            >
              <Image
                source={{ uri: meditation.imageUrl }}
                style={styles.meditationImage}
                contentFit="cover"
              />
              <View style={styles.meditationContent}>
                <ThemedText variant="h4" style={styles.meditationTitle} color={theme.textPrimary}>
                  {meditation.title}
                </ThemedText>
                <ThemedText
                  variant="small"
                  style={styles.meditationDescription}
                  color={theme.textSecondary}
                  numberOfLines={2}
                >
                  {meditation.description}
                </ThemedText>
                <View style={styles.meditationMeta}>
                  <View style={styles.metaLeft}>
                    <View style={styles.badge}>
                      <FontAwesome6 name="clock" size={12} color={theme.textMuted} />
                      <ThemedText variant="caption" color={theme.textMuted}>
                        {meditation.durationMinutes} min
                      </ThemedText>
                    </View>
                    <View style={styles.badge}>
                      <ThemedText variant="caption" color={theme.textMuted}>
                        {meditation.category}
                      </ThemedText>
                    </View>
                  </View>
                  <TouchableOpacity style={styles.playButton}>
                    <FontAwesome6 name="play" size={18} color="#FFFFFF" solid />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </Screen>
  );
}
