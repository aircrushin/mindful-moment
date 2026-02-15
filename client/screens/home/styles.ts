import { StyleSheet } from 'react-native';
import { Spacing, BorderRadius, Theme } from '@/constants/theme';

export const createStyles = (theme: Theme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
    },
    scrollContent: {
      paddingHorizontal: Spacing['2xl'],
      paddingBottom: Spacing['6xl'],
    },
    header: {
      marginBottom: Spacing['3xl'],
    },
    greeting: {
      marginBottom: Spacing.xs,
    },
    statsGrid: {
      flexDirection: 'row',
      gap: Spacing.md,
      marginBottom: Spacing['3xl'],
    },
    statCard: {
      flex: 1,
      backgroundColor: theme.primary,
      borderRadius: BorderRadius.xl,
      padding: Spacing.lg,
      alignItems: 'center',
    },
    statValue: {
      fontSize: 32,
      fontWeight: '700',
      color: '#FFFFFF',
    },
    statLabel: {
      color: 'rgba(255,255,255,0.8)',
      marginTop: Spacing.xs,
    },
    section: {
      marginBottom: Spacing['3xl'],
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: Spacing.lg,
    },
    sectionTitle: {},
    seeAll: {
      color: theme.primary,
    },
    featuredCard: {
      backgroundColor: theme.backgroundDefault,
      borderRadius: BorderRadius.xl,
      overflow: 'hidden',
      marginBottom: Spacing.lg,
    },
    featuredImage: {
      width: '100%',
      height: 200,
    },
    featuredContent: {
      padding: Spacing.lg,
    },
    featuredTitle: {
      marginBottom: Spacing.xs,
    },
    featuredMeta: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.md,
    },
    durationBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.xs,
      backgroundColor: theme.primary + '20',
      paddingHorizontal: Spacing.sm,
      paddingVertical: Spacing.xs,
      borderRadius: BorderRadius.md,
    },
    categoryBadge: {
      backgroundColor: theme.accent + '20',
      paddingHorizontal: Spacing.sm,
      paddingVertical: Spacing.xs,
      borderRadius: BorderRadius.md,
    },
    meditationRow: {
      flexDirection: 'row',
      backgroundColor: theme.backgroundDefault,
      borderRadius: BorderRadius.lg,
      padding: Spacing.md,
      marginBottom: Spacing.md,
      alignItems: 'center',
      gap: Spacing.md,
    },
    meditationImage: {
      width: 60,
      height: 60,
      borderRadius: BorderRadius.md,
    },
    meditationInfo: {
      flex: 1,
    },
    meditationTitle: {
      marginBottom: Spacing.xs,
    },
    playButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: theme.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    emptyState: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: Spacing['5xl'],
    },
    emptyIcon: {
      width: 80,
      height: 80,
      marginBottom: Spacing.lg,
    },
    emptyText: {
      textAlign: 'center',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
};
