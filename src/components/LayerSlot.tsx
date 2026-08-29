import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { LayerType } from '@/models/OutfitArticle';
import { colors } from '@/theme/colors';
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
  return (
    <Pressable style={styles.slot} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.layerLabel}>{LAYER_LABELS[layerType]}</Text>
        {articleName && onRemove && (
          <Pressable onPress={onRemove} hitSlop={8}>
            <Text style={styles.remove}>Remove</Text>
          </Pressable>
        )}
      </View>
      {articleName ? (
        <Text style={styles.articleName} numberOfLines={1}>
          {articleName}
        </Text>
      ) : (
        <Text style={styles.empty}>Tap to add</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  slot: {
    padding: spacing.md,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.borderDashed,
    borderRadius: borderRadius.md,
    backgroundColor: colors.white,
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
    color: colors.inkLight,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  remove: {
    ...typography.buttonSmall,
    color: colors.error,
  },
  articleName: {
    ...typography.body,
    color: colors.ink,
  },
  empty: {
    ...typography.body,
    color: colors.borderDashed,
  },
});
