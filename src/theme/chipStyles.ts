// Tag/chip style variants for different tag categories
// Type tags: neutral outline pill
// Fit tags: dashed outline pill
// Occasion tags: accent-tinted fill pill
// Color tags: filled with actual color

import { StyleSheet } from 'react-native';
import { borderRadius, spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

export function typeTagStyles(colors: any) {
  return {
    container: {
      paddingHorizontal: spacing.sm,
      paddingVertical: 2,
      borderRadius: borderRadius.round,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: 'transparent',
    },
    label: {
      ...typography.caption,
      fontSize: 10,
      color: colors.inkSecondary,
    },
  };
}

export function fitTagStyles(colors: any) {
  return {
    container: {
      paddingHorizontal: spacing.sm,
      paddingVertical: 2,
      borderRadius: borderRadius.round,
      borderWidth: 1,
      borderColor: colors.inkMuted,
      borderStyle: 'dashed' as const,
      backgroundColor: 'transparent',
    },
    label: {
      ...typography.caption,
      fontSize: 10,
      color: colors.inkSecondary,
    },
  };
}

export function occasionTagStyles(colors: any) {
  return {
    container: {
      paddingHorizontal: spacing.sm,
      paddingVertical: 2,
      borderRadius: borderRadius.round,
      backgroundColor: colors.accent + '15',
    },
    label: {
      ...typography.caption,
      fontSize: 10,
      color: colors.accent,
    },
  };
}

export function colorTagStyles(colors: any, fillColor: string, isWhite: boolean, isDark: boolean) {
  const bg = isWhite && !isDark ? 'transparent' : fillColor + '15';
  const border = isWhite && !isDark ? { borderWidth: 1, borderColor: colors.border } : {};
  const textColor = isWhite && !isDark ? colors.inkPrimary : fillColor;
  return {
    container: {
      paddingHorizontal: spacing.sm,
      paddingVertical: 2,
      borderRadius: borderRadius.round,
      backgroundColor: bg,
      ...border,
    },
    label: {
      ...typography.caption,
      fontSize: 10,
      color: textColor,
    },
  };
}
