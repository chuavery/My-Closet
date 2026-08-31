import React, { useRef } from 'react';
import { View, Text, Pressable, StyleSheet, Animated } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { StorageSpace } from '@/models/StorageSpace';
import { useTheme } from '@/providers/ThemeContext';
import { typography } from '@/theme/typography';
import { spacing, borderRadius } from '@/theme/spacing';
import { Trash2 } from 'lucide-react-native';

interface StorageSpaceRowProps {
  space: StorageSpace;
  articleCount: number;
  onPress?: () => void;
  onDelete?: () => void;
}

const SPACE_COLORS = ['#B9705F', '#6E8F71', '#4A6FE8', '#8B6F47', '#8A4AE8'];

function getSpaceColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return SPACE_COLORS[Math.abs(hash) % SPACE_COLORS.length];
}

export function StorageSpaceRow({
  space,
  articleCount,
  onPress,
  onDelete,
}: StorageSpaceRowProps) {
  const { colors } = useTheme();
  const swipeableRef = useRef<Swipeable>(null);
  const avatarColor = getSpaceColor(space.name);
  const displayName = space.subLocation
    ? `${space.name} — ${space.subLocation}`
    : space.name;

  const renderRightActions = (progress: Animated.AnimatedInterpolation<number>) => {
    const translateX = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [80, 0],
    });

    return (
      <Animated.View style={[styles.deleteAction, { transform: [{ translateX }] }]}>
        <Pressable
          style={[styles.deleteButton, { backgroundColor: colors.destructive }]}
          onPress={() => {
            swipeableRef.current?.close();
            onDelete?.();
          }}
        >
          <Trash2 size={20} color={colors.surface} />
        </Pressable>
      </Animated.View>
    );
  };

  return (
    <Swipeable ref={swipeableRef} renderRightActions={renderRightActions} overshootRight={false}>
      <Pressable style={[styles.row, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={onPress}>
        <View style={[styles.icon, { backgroundColor: avatarColor + '20' }]}>
          <Text style={[styles.iconText, { color: avatarColor }]}>{space.name.charAt(0)}</Text>
        </View>
        <View style={styles.info}>
          <Text style={[styles.name, { color: colors.inkPrimary }]} numberOfLines={2}>
            {displayName}
          </Text>
        </View>
        <Text style={[styles.count, { color: colors.inkSecondary }]}>{articleCount} items</Text>
      </Pressable>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    marginBottom: spacing.sm,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  iconText: {
    ...typography.h3,
  },
  info: {
    flex: 1,
  },
  name: {
    ...typography.body,
    fontWeight: '600',
  },
  count: {
    ...typography.bodySmall,
  },
  deleteAction: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginBottom: spacing.sm,
    marginLeft: spacing.sm,
  },
  deleteButton: {
    width: 56,
    height: '100%',
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
