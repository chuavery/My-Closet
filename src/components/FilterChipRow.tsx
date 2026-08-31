import React from 'react';
import { ScrollView, Pressable, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/providers/ThemeContext';
import { typography } from '@/theme/typography';
import { spacing, borderRadius } from '@/theme/spacing';

interface FilterChipRowProps {
  options: { label: string; value: string }[];
  selectedValue: string | null;
  onSelect: (value: string | null) => void;
}

export function FilterChipRow({
  options,
  selectedValue,
  onSelect,
}: FilterChipRowProps) {
  const { colors } = useTheme();
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {options.map((option) => {
        const isSelected = selectedValue === option.value;
        return (
          <Pressable
            key={option.value}
            style={[
              styles.chip,
              { borderColor: colors.border, backgroundColor: colors.surface },
              isSelected && { backgroundColor: colors.accent, borderColor: colors.accent },
            ]}
            onPress={() => onSelect(isSelected ? null : option.value)}
          >
            <Text style={[styles.label, { color: colors.inkPrimary }, isSelected && { color: colors.surface }]}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.round,
    borderWidth: 1,
  },
  label: {
    ...typography.buttonSmall,
  },
});
