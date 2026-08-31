import React, { useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Image, Animated } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { Article } from '@/models/Article';
import { useTheme } from '@/providers/ThemeContext';
import { capitalize } from '@/lib/capitalize';
import { ARTICLE_COLORS } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing, borderRadius } from '@/theme/spacing';
import { typeTagStyles, fitTagStyles, colorTagStyles } from '@/theme/chipStyles';
import { Trash2 } from 'lucide-react-native';

interface ArticleCardProps {
  article: Article;
  onPress?: () => void;
  onDelete?: () => void;
}

function CardInner({ article, onPress }: { article: Article; onPress?: () => void }) {
  const { colors, isDark } = useTheme();

  const typeStyle = typeTagStyles(colors);
  const fitStyle = fitTagStyles(colors);
  const colorStyle = colorTagStyles(
    colors,
    ARTICLE_COLORS[article.color] ?? colors.accent,
    article.color === 'white',
    isDark
  );

  return (
    <Pressable style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={onPress}>
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
              { backgroundColor: ARTICLE_COLORS[article.color] ?? colors.paperDark },
            ]}
          >
            <Text style={[styles.placeholderText, { color: colors.surface }]}>
              {article.name?.charAt(0) ?? article.articleType.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
      </View>
      <View style={styles.info}>
        <Text style={[styles.name, { color: colors.inkPrimary }]} numberOfLines={2}>
          {article.name ?? capitalize(article.articleType)}
        </Text>
        {article.brand && (
          <Text style={[styles.brand, { color: colors.inkSecondary }]} numberOfLines={1}>
            {article.brand}
          </Text>
        )}
        <View style={styles.tags}>
          <View style={typeStyle.container}>
            <Text style={typeStyle.label}>{capitalize(article.articleType)}</Text>
          </View>
          <View style={colorStyle.container}>
            <Text style={colorStyle.label}>{capitalize(article.color)}</Text>
          </View>
          <View style={fitStyle.container}>
            <Text style={fitStyle.label}>{article.fit ? capitalize(article.fit) : "—"}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

export function ArticleCard({ article, onPress, onDelete }: ArticleCardProps) {
  const { colors } = useTheme();
  const swipeableRef = useRef<Swipeable>(null);

  if (!onDelete) {
    return <CardInner article={article} onPress={onPress} />;
  }

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
            onDelete();
          }}
        >
          <Trash2 size={20} color={colors.surface} />
        </Pressable>
      </Animated.View>
    );
  };

  return (
    <Swipeable ref={swipeableRef} renderRightActions={renderRightActions} overshootRight={false}>
      <CardInner article={article} onPress={onPress} />
    </Swipeable>
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
  deleteAction: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginBottom: spacing.md,
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
