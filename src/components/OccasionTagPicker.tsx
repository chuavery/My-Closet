import React from 'react';
import { ScrollView, Pressable, Text, StyleSheet } from 'react-native';
import { Tag } from '@/models/Tag';
import { useTheme } from '@/providers/ThemeContext';
import { typography } from '@/theme/typography';
import { spacing, borderRadius } from '@/theme/spacing';

interface OccasionTagPickerProps {
  tags: Tag[];
  selectedTagIds: string[];
  onToggle: (tagId: string) => void;
}

export function OccasionTagPicker({
  tags,
  selectedTagIds,
  onToggle,
}: OccasionTagPickerProps) {
  const { colors } = useTheme();
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {tags.map((tag) => {
        const isSelected = selectedTagIds.includes(tag.id);
        return (
          <Pressable
            key={tag.id}
            style={[
              styles.chip,
              { borderColor: colors.accent, backgroundColor: 'transparent' },
              isSelected && { backgroundColor: colors.accent + '15' },
            ]}
            onPress={() => onToggle(tag.id)}
          >
            <Text style={[styles.label, { color: colors.accent }, isSelected && { fontWeight: '600' }]}>
              {tag.name}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
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
