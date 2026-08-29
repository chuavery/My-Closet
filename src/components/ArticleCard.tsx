import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Article } from '@/models/Article';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing, borderRadius } from '@/theme/spacing';

interface ArticleCardProps {
  article: Article;
  onPress?: () => void;
}

const COLOR_MAP: Record<string, string> = {
  red: '#C45B3E',
  orange: '#E88A4A',
  yellow: '#E8C84A',
  green: '#5A8F6A',
  blue: '#4A7AE8',
  indigo: '#5A4AE8',
  violet: '#8A4AE8',
  pink: '#E87AB0',
  white: '#F0EDE6',
  brown: '#8B6F47',
  black: '#2C2C2C',
};

export function ArticleCard({ article, onPress }: ArticleCardProps) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.imageContainer}>
        <View
          style={[
            styles.imagePlaceholder,
            { backgroundColor: COLOR_MAP[article.color] ?? colors.paperDark },
          ]}
        >
          <Text style={styles.placeholderText}>
            {article.name?.charAt(0) ?? article.articleType.charAt(0).toUpperCase()}
          </Text>
        </View>
      </View>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {article.name ?? article.articleType}
        </Text>
        {article.brand && (
          <Text style={styles.brand} numberOfLines={1}>
            {article.brand}
          </Text>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '48%',
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 4 / 5,
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    ...typography.h1,
    color: colors.white,
    opacity: 0.8,
  },
  info: {
    padding: spacing.sm,
  },
  name: {
    ...typography.bodySmall,
    color: colors.ink,
    fontWeight: '600',
  },
  brand: {
    ...typography.caption,
    color: colors.inkLight,
    marginTop: 2,
  },
});
