import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { Article } from '@/models/Article';
import { useTheme } from '@/providers/ThemeContext';
import { capitalize } from '@/lib/capitalize';
import { colors as lightColors } from '@/theme/colors';
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
  const { colors, isDark } = useTheme();
  const isWhiteColor = article.color === 'white';
  const colorTagBg = isWhiteColor && !isDark
    ? 'transparent'
    : (COLOR_MAP[article.color] ?? colors.accent) + "20";
  const colorTagBorder = isWhiteColor && !isDark
    ? { borderWidth: 1, borderColor: colors.border }
    : {};
  const colorTagTextColor = isWhiteColor && !isDark
    ? colors.ink
    : COLOR_MAP[article.color] ?? colors.accent;

  return (
    <Pressable style={[styles.card, { backgroundColor: colors.white, borderColor: colors.border }]} onPress={onPress}>
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
        <Text style={[styles.name, { color: colors.ink }]} numberOfLines={1}>
          {article.name ?? capitalize(article.articleType)}
        </Text>
        {article.brand && (
          <Text style={[styles.brand, { color: colors.inkLight }]} numberOfLines={1}>
            {article.brand}
          </Text>
        )}
        <View style={styles.tags}>
          <View style={[styles.tag, { backgroundColor: colors.accent + "20" }]}>
            <Text style={[styles.tagLabel, { color: colors.accent }]}>{capitalize(article.articleType)}</Text>
          </View>
          <View style={[styles.tag, { backgroundColor: colorTagBg, ...colorTagBorder }]}>
            <Text style={[styles.tagLabel, { color: colorTagTextColor }]}>{capitalize(article.color)}</Text>
          </View>
          <View style={[styles.tag, { backgroundColor: colors.accent + "20" }]}>
            <Text style={[styles.tagLabel, { color: colors.accent }]}>{article.fit ? capitalize(article.fit) : "—"}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '48%',
    borderRadius: borderRadius.md,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 4 / 5,
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
    ...typography.h1,
    color: lightColors.white,
    opacity: 0.8,
  },
  info: {
    padding: spacing.sm,
  },
  name: {
    ...typography.bodySmall,
    fontWeight: '600',
  },
  brand: {
    ...typography.caption,
    marginTop: 2,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  tag: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.round,
  },
  tagLabel: {
    ...typography.caption,
    fontSize: 10,
  },
});
