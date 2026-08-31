import React, { useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Image, Animated } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { Article } from '@/models/Article';
import { capitalize } from '@/lib/capitalize';
import { useTheme } from '@/providers/ThemeContext';
import { ARTICLE_COLORS } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing, borderRadius } from '@/theme/spacing';
import { Trash2 } from 'lucide-react-native';

interface ArticleListItemProps {
  article: Article;
  onPress?: () => void;
  onDelete?: () => void;
}

function ListItemInner({ article, onPress }: { article: Article; onPress?: () => void }) {
  const { colors } = useTheme();
  return (
    <Pressable style={[styles.row, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={onPress}>
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
        {article.brand ? (
          <Text style={[styles.brand, { color: colors.inkSecondary }]} numberOfLines={1}>
            {article.brand}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}

export function ArticleListItem({ article, onPress, onDelete }: ArticleListItemProps) {
  const { colors } = useTheme();
  const swipeableRef = useRef<Swipeable>(null);

  if (!onDelete) {
    return <ListItemInner article={article} onPress={onPress} />;
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
      <ListItemInner article={article} onPress={onPress} />
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.md,
    borderWidth: 1,
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
    opacity: 0.8,
  },
  info: {
    flex: 1,
    marginLeft: spacing.md,
  },
  name: {
    ...typography.body,
    fontWeight: '600',
  },
  brand: {
    ...typography.bodySmall,
    marginTop: 2,
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
