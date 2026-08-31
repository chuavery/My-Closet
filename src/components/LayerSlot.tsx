import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { LayerType } from '@/models/OutfitArticle';
import { useTheme } from '@/providers/ThemeContext';
import { typography } from '@/theme/typography';
import { spacing, borderRadius } from '@/theme/spacing';

interface LayerSlotProps {
  layerType: LayerType;
  articleName?: string | null;
  onPress?: () => void;
  onRemove?: () => void;
}

const LAYER_LABELS: Record<LayerType, string> = {
  base: 'Base',
  mid: 'Mid Layer',
  outer: 'Outer',
  bottom: 'Bottom',
  footwear: 'Footwear',
  accessory: 'Accessory',
};

export function LayerSlot({
  layerType,
  articleName,
  onPress,
  onRemove,
}: LayerSlotProps) {
  const { colors } = useTheme();
  return (
    <Pressable style={[styles.slot, { borderColor: colors.borderDashed, backgroundColor: colors.surface }]} onPress={onPress}>
      <View style={styles.header}>
        <Text style={[styles.layerLabel, { color: colors.inkMuted }]}>{LAYER_LABELS[layerType]}</Text>
        {articleName && onRemove && (
          <Pressable onPress={onRemove} hitSlop={8}>
            <Text style={[styles.remove, { color: colors.destructive }]}>Remove</Text>
          </Pressable>
        )}
      </View>
      {articleName ? (
        <Text style={[styles.articleName, { color: colors.inkPrimary }]} numberOfLines={1}>
          {articleName}
        </Text>
      ) : (
        <Text style={[styles.empty, { color: colors.inkMuted }]}>Tap to add</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  slot: {
    padding: spacing.md,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  layerLabel: {
    ...typography.caption,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  remove: {
    ...typography.buttonSmall,
  },
  articleName: {
    ...typography.body,
  },
  empty: {
    ...typography.body,
  },
});
