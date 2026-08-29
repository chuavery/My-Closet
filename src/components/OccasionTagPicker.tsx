import React from 'react';
import { ScrollView, Pressable, Text, StyleSheet } from 'react-native';
import { Tag } from '@/models/Tag';
import { colors } from '@/theme/colors';
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
            style={[styles.chip, isSelected && styles.chipSelected]}
            onPress={() => onToggle(tag.id)}
          >
            <Text style={[styles.label, isSelected && styles.labelSelected]}>
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
    borderColor: colors.accent,
    backgroundColor: colors.white,
  },
  chipSelected: {
    backgroundColor: colors.accent,
  },
  label: {
    ...typography.buttonSmall,
    color: colors.accent,
  },
  labelSelected: {
    color: colors.white,
  },
});
