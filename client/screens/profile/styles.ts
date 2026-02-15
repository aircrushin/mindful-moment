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
    profileCard: {
      alignItems: 'center',
      paddingVertical: Spacing['3xl'],
    },
    avatar: {
      width: 100,
      height: 100,
      borderRadius: 50,
      marginBottom: Spacing.lg,
    },
    userName: {
      marginBottom: Spacing.xs,
    },
    userEmail: {},
    statsGrid: {
      flexDirection: 'row',
      gap: Spacing.md,
      marginBottom: Spacing['3xl'],
    },
    statCard: {
      flex: 1,
      backgroundColor: theme.backgroundDefault,
      borderRadius: BorderRadius.xl,
      padding: Spacing.lg,
      alignItems: 'center',
    },
    statValue: {
      fontSize: 28,
      fontWeight: '700',
    },
    statLabel: {
      marginTop: Spacing.xs,
    },
    section: {
      marginBottom: Spacing['3xl'],
    },
    sectionTitle: {
      marginBottom: Spacing.lg,
    },
    historyCard: {
      flexDirection: 'row',
      backgroundColor: theme.backgroundDefault,
      borderRadius: BorderRadius.lg,
      padding: Spacing.md,
      marginBottom: Spacing.md,
      alignItems: 'center',
      gap: Spacing.md,
    },
    historyImage: {
      width: 50,
      height: 50,
      borderRadius: BorderRadius.md,
    },
    historyInfo: {
      flex: 1,
    },
    historyTitle: {
      marginBottom: Spacing.xs,
    },
    menuCard: {
      backgroundColor: theme.backgroundDefault,
      borderRadius: BorderRadius.xl,
      overflow: 'hidden',
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: Spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: theme.borderLight,
    },
    menuItemLast: {
      borderBottomWidth: 0,
    },
    menuIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.primary + '20',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: Spacing.md,
    },
    menuText: {
      flex: 1,
    },
    logoutButton: {
      backgroundColor: theme.error,
      paddingVertical: Spacing.lg,
      borderRadius: BorderRadius.lg,
      alignItems: 'center',
      marginTop: Spacing['2xl'],
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
};
