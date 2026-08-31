import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/providers/ThemeContext';
import { typography } from '@/theme/typography';
import { spacing, borderRadius } from '@/theme/spacing';

interface WornTodayButtonProps {
  onPress: () => void;
}

export function WornTodayButton({ onPress }: WornTodayButtonProps) {
  const { colors } = useTheme();
  return (
    <Pressable style={[styles.button, { backgroundColor: colors.success }]} onPress={onPress}>
      <Text style={[styles.label, { color: colors.surface }]}>Worn Today</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.round,
    alignItems: 'center',
  },
  label: {
    ...typography.button,
  },
});
