import { StyleSheet } from 'react-native';
import { Spacing, BorderRadius, Theme } from '@/constants/theme';

export const createStyles = (theme: Theme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: Spacing['2xl'],
      paddingTop: Spacing['6xl'],
    },
    header: {
      marginBottom: Spacing['4xl'],
    },
    title: {
      textAlign: 'center',
      marginBottom: Spacing.sm,
    },
    subtitle: {
      textAlign: 'center',
    },
    form: {
      gap: Spacing.lg,
      marginBottom: Spacing['2xl'],
    },
    inputContainer: {
      gap: Spacing.xs,
    },
    label: {
      fontWeight: '500',
    },
    input: {
      backgroundColor: theme.backgroundTertiary,
      borderRadius: BorderRadius.lg,
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.md,
      fontSize: 16,
      color: theme.textPrimary,
      borderWidth: 1,
      borderColor: theme.borderLight,
    },
    inputError: {
      borderColor: theme.error,
    },
    errorText: {
      color: theme.error,
    },
    button: {
      backgroundColor: theme.primary,
      paddingVertical: Spacing.lg,
      borderRadius: BorderRadius.lg,
      alignItems: 'center',
      marginTop: Spacing.md,
    },
    buttonDisabled: {
      opacity: 0.6,
    },
    buttonText: {
      fontWeight: '600',
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: Spacing.xs,
      marginTop: Spacing['2xl'],
    },
    link: {
      color: theme.primary,
      fontWeight: '600',
    },
    logo: {
      width: 100,
      height: 100,
      alignSelf: 'center',
      marginBottom: Spacing['2xl'],
    },
    divider: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: Spacing['2xl'],
      gap: Spacing.md,
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: theme.border,
    },
    dividerText: {
      color: theme.textMuted,
    },
  });
};
