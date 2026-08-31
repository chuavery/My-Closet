import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { useTheme } from '@/providers/ThemeContext';
import { borderRadius, spacing } from '@/theme/spacing';

interface SkeletonLoaderProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: any;
}

export function SkeletonLoader({
  width = '100%',
  height = 20,
  borderRadius: br = borderRadius.md,
  style,
}: SkeletonLoaderProps) {
  const { colors } = useTheme();
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, {
          toValue: 1,
          duration: 1000,
          easing: Easing.ease,
          useNativeDriver: false,
        }),
        Animated.timing(shimmer, {
          toValue: 0,
          duration: 1000,
          easing: Easing.ease,
          useNativeDriver: false,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [shimmer]);

  const opacity = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.6],
  });

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius: br,
          backgroundColor: colors.border,
          opacity,
        },
        style,
      ]}
    />
  );
}

// Presbuilt skeleton layouts for common screens
export function ArticleCardSkeleton({ colors }: { colors: any }) {
  return (
    <View style={[skeletonStyles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <SkeletonLoader height={180} borderRadius={0} />
      <View style={skeletonStyles.cardInfo}>
        <SkeletonLoader width="70%" height={16} />
        <SkeletonLoader width="40%" height={12} style={{ marginTop: 6 }} />
        <View style={skeletonStyles.cardTags}>
          <SkeletonLoader width={50} height={18} borderRadius={999} />
          <SkeletonLoader width={40} height={18} borderRadius={999} />
        </View>
      </View>
    </View>
  );
}

export function ListItemSkeleton({ colors }: { colors: any }) {
  return (
    <View style={[skeletonStyles.listItem, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <SkeletonLoader width={48} height={64} borderRadius={borderRadius.sm} />
      <View style={skeletonStyles.listInfo}>
        <SkeletonLoader width="60%" height={16} />
        <SkeletonLoader width="40%" height={12} style={{ marginTop: 6 }} />
      </View>
    </View>
  );
}

const skeletonStyles = StyleSheet.create({
  card: {
    width: '48%',
    borderRadius: borderRadius.md,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  cardInfo: {
    padding: spacing.sm,
    gap: 4,
  },
  cardTags: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.md,
    borderWidth: 1,
    padding: spacing.sm,
    marginBottom: spacing.sm,
    gap: spacing.md,
  },
  listInfo: {
    flex: 1,
    gap: 4,
  },
});
