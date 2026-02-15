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
    backButton: {
      position: 'absolute',
      top: Spacing.xl,
      left: Spacing.lg,
      zIndex: 10,
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: 'rgba(0,0,0,0.3)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    imageContainer: {
      height: 300,
      marginBottom: Spacing['3xl'],
      borderRadius: BorderRadius['2xl'],
      overflow: 'hidden',
    },
    meditationImage: {
      width: '100%',
      height: '100%',
    },
    content: {
      flex: 1,
    },
    title: {
      textAlign: 'center',
      marginBottom: Spacing.sm,
    },
    category: {
      textAlign: 'center',
      marginBottom: Spacing['2xl'],
    },
    progressBar: {
      marginBottom: Spacing.xl,
    },
    progressTrack: {
      height: 6,
      backgroundColor: theme.border,
      borderRadius: 3,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      backgroundColor: theme.primary,
      borderRadius: 3,
    },
    timeRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: Spacing.sm,
    },
    controls: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: Spacing['4xl'],
      marginBottom: Spacing['3xl'],
    },
    controlButton: {
      width: 64,
      height: 64,
      borderRadius: 32,
      alignItems: 'center',
      justifyContent: 'center',
    },
    playButton: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: theme.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    playButtonDisabled: {
      opacity: 0.6,
    },
    infoCard: {
      backgroundColor: theme.backgroundDefault,
      borderRadius: BorderRadius.xl,
      padding: Spacing.lg,
      marginBottom: Spacing.lg,
    },
    infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.md,
      marginBottom: Spacing.md,
    },
    infoIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.primary + '20',
      alignItems: 'center',
      justifyContent: 'center',
    },
    ratingContainer: {
      marginTop: Spacing.lg,
    },
    ratingLabel: {
      marginBottom: Spacing.md,
    },
    ratingRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: Spacing.md,
    },
    starButton: {
      padding: Spacing.xs,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    completeButton: {
      backgroundColor: theme.success,
      paddingVertical: Spacing.lg,
      borderRadius: BorderRadius.lg,
      alignItems: 'center',
      marginTop: Spacing.lg,
    },
    descriptionContainer: {
      marginTop: Spacing.lg,
    },
    sectionTitle: {
      marginBottom: Spacing.md,
    },
    instructorRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.sm,
      marginTop: Spacing.md,
    },
    completionSection: {
      marginTop: Spacing['2xl'],
      paddingVertical: Spacing.lg,
    },
  });
};
