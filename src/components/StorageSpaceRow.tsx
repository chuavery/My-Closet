import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { StorageSpace } from '@/models/StorageSpace';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing, borderRadius } from '@/theme/spacing';

interface StorageSpaceRowProps {
  space: StorageSpace;
  articleCount: number;
  onPress?: () => void;
}

export function StorageSpaceRow({
  space,
  articleCount,
  onPress,
}: StorageSpaceRowProps) {
  return (
    <Pressable style={styles.row} onPress={onPress}>
      <View style={styles.icon}>
        <Text style={styles.iconText}>{space.name.charAt(0)}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{space.name}</Text>
        {space.subLocation && (
          <Text style={styles.subLocation}>{space.subLocation}</Text>
        )}
      </View>
      <Text style={styles.count}>{articleCount} items</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.sm,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.paperDark,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  iconText: {
    ...typography.h3,
    color: colors.accent,
  },
  info: {
    flex: 1,
  },
  name: {
    ...typography.body,
    color: colors.ink,
    fontWeight: '600',
  },
  subLocation: {
    ...typography.caption,
    color: colors.inkLight,
    marginTop: 2,
  },
  count: {
    ...typography.bodySmall,
    color: colors.inkLight,
  },
});
