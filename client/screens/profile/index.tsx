import React, { useEffect, useMemo } from 'react';
import { View, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { useTheme } from '@/hooks/useTheme';
import { Screen } from '@/components/Screen';
import { ThemedText } from '@/components/ThemedText';
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchStats, fetchHistory } from '@/store/slices/progressSlice';
import { logout } from '@/store/slices/authSlice';
import { createStyles } from './styles';

export default function ProfileScreen() {
  const { theme, isDark } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const router = useSafeRouter();
  const dispatch = useAppDispatch();
  
  const { user } = useAppSelector((state) => state.auth);
  const { stats, recentSessions, isLoading } = useAppSelector((state) => state.progress);

  useEffect(() => {
    dispatch(fetchStats());
    dispatch(fetchHistory({ limit: 5 }));
  }, []);

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await dispatch(logout());
            router.replace('/login');
          },
        },
      ]
    );
  };

  if (isLoading && !stats) {
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
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <Image
            source={{
              uri: user?.avatarUrl || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
            }}
            style={styles.avatar}
            contentFit="cover"
          />
          <ThemedText variant="h3" style={styles.userName} color={theme.textPrimary}>
            {user?.displayName || 'Mindful User'}
          </ThemedText>
          <ThemedText variant="body" style={styles.userEmail} color={theme.textSecondary}>
            {user?.email}
          </ThemedText>
        </View>

        {/* Stats Grid */}
        {stats && (
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <ThemedText variant="stat" style={styles.statValue} color={theme.primary}>
                {stats.currentStreak}
              </ThemedText>
              <ThemedText variant="caption" style={styles.statLabel} color={theme.textSecondary}>
                Day Streak
              </ThemedText>
            </View>
            <View style={styles.statCard}>
              <ThemedText variant="stat" style={styles.statValue} color={theme.accent}>
                {stats.longestStreak}
              </ThemedText>
              <ThemedText variant="caption" style={styles.statLabel} color={theme.textSecondary}>
                Best Streak
              </ThemedText>
            </View>
            <View style={styles.statCard}>
              <ThemedText variant="stat" style={styles.statValue} color="#10B981">
                {stats.totalMinutes}
              </ThemedText>
              <ThemedText variant="caption" style={styles.statLabel} color={theme.textSecondary}>
                Total Min
              </ThemedText>
            </View>
          </View>
        )}

        {/* Recent Sessions */}
        {recentSessions.length > 0 && (
          <View style={styles.section}>
            <ThemedText variant="h4" style={styles.sectionTitle} color={theme.textPrimary}>
              Recent Sessions
            </ThemedText>
            {recentSessions.slice(0, 3).map((session) => (
              <View key={session.id} style={styles.historyCard}>
                <FontAwesome6 name="circle-check" size={24} color={theme.success} />
                <View style={styles.historyInfo}>
                  <ThemedText variant="bodyMedium" style={styles.historyTitle} color={theme.textPrimary}>
                    {session.title}
                  </ThemedText>
                  <ThemedText variant="caption" color={theme.textSecondary}>
                    {Math.floor(session.actualSeconds / 60)} min • {session.category}
                  </ThemedText>
                </View>
                {session.rating && (
                  <View style={{ flexDirection: 'row' }}>
                    <FontAwesome6 name="star" size={16} color="#FFD700" solid />
                    <ThemedText variant="caption" color={theme.textSecondary}> {session.rating}</ThemedText>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Menu */}
        <View style={styles.section}>
          <ThemedText variant="h4" style={styles.sectionTitle} color={theme.textPrimary}>
            Settings
          </ThemedText>
          <View style={styles.menuCard}>
            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuIcon}>
                <FontAwesome6 name="bell" size={18} color={theme.primary} />
              </View>
              <ThemedText variant="body" style={styles.menuText} color={theme.textPrimary}>
                Notifications
              </ThemedText>
              <FontAwesome6 name="chevron-right" size={16} color={theme.textMuted} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuIcon}>
                <FontAwesome6 name="palette" size={18} color={theme.primary} />
              </View>
              <ThemedText variant="body" style={styles.menuText} color={theme.textPrimary}>
                Appearance
              </ThemedText>
              <FontAwesome6 name="chevron-right" size={16} color={theme.textMuted} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuIcon}>
                <FontAwesome6 name="circle-info" size={18} color={theme.primary} />
              </View>
              <ThemedText variant="body" style={styles.menuText} color={theme.textPrimary}>
                About
              </ThemedText>
              <FontAwesome6 name="chevron-right" size={16} color={theme.textMuted} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.menuItem, styles.menuItemLast]}>
              <View style={[styles.menuIcon, { backgroundColor: theme.error + '20' }]}>
                <FontAwesome6 name="shield-halved" size={18} color={theme.error} />
              </View>
              <ThemedText variant="body" style={styles.menuText} color={theme.textPrimary}>
                Privacy Policy
              </ThemedText>
              <FontAwesome6 name="chevron-right" size={16} color={theme.textMuted} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <ThemedText variant="bodyMedium" color="#FFFFFF">
            Logout
          </ThemedText>
        </TouchableOpacity>
      </ScrollView>
    </Screen>
  );
}
