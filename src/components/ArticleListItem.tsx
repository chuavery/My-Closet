import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { Article } from '@/models/Article';
import { capitalize } from '@/lib/capitalize';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing, borderRadius } from '@/theme/spacing';

interface ArticleListItemProps {
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

export function ArticleListItem({ article, onPress }: ArticleListItemProps) {
  return (
    <Pressable style={styles.row} onPress={onPress}>
      <View style={styles.imageContainer}>
        {article.originalImageUrl ? (
          <Image
            source={{ uri: article.originalImageUrl }}
            style={styles.image}
          />
        ) : (
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
        )}
      </View>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {article.name ?? capitalize(article.articleType)}
        </Text>
        {article.brand ? (
          <Text style={styles.brand} numberOfLines={1}>
            {article.brand}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.sm,
    marginBottom: spacing.sm,
  },
  imageContainer: {
    width: 48,
    height: 64,
    borderRadius: borderRadius.sm,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    ...typography.h3,
    color: colors.white,
    opacity: 0.8,
  },
  info: {
    flex: 1,
    marginLeft: spacing.md,
  },
  name: {
    ...typography.body,
    color: colors.ink,
    fontWeight: '600',
  },
  brand: {
    ...typography.bodySmall,
    color: colors.inkLight,
    marginTop: 2,
  },
});
