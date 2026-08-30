import { useState, useEffect, useCallback, useMemo } from 'react';
import { Article, ArticleType, Color, Fit } from '@/models/Article';
import { Tag } from '@/models/Tag';
import { useRepositories } from '@/providers/RepositoryProvider';

export interface ClosetFilters {
  articleType: ArticleType | null;
  color: Color | null;
  fit: Fit | null;
  tagId: string | null;
}

export function useClosetHome() {
  const { articleRepository, tagRepository } = useRepositories();
  const [articles, setArticles] = useState<Article[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<ClosetFilters>({
    articleType: null,
    color: null,
    fit: null,
    tagId: null,
  });
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const [allArticles, allTags] = await Promise.all([
      articleRepository.getAll(),
      tagRepository.getAll(),
    ]);
    setArticles(allArticles);
    setTags(allTags);
    setLoading(false);
  }, [articleRepository, tagRepository]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const filteredArticles = useMemo(() => {
    let result = articles;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (a) =>
          a.name?.toLowerCase().includes(q) ||
          a.brand?.toLowerCase().includes(q)
      );
    }

    if (filters.articleType) {
      result = result.filter((a) => a.articleType === filters.articleType);
    }

    if (filters.color) {
      result = result.filter((a) => a.color === filters.color);
    }

    if (filters.fit) {
      result = result.filter((a) => a.fit === filters.fit);
    }

    return result;
  }, [articles, searchQuery, filters]);

  const setFilter = useCallback(
    (key: keyof ClosetFilters, value: string | null) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  return {
    articles: filteredArticles,
    allArticles: articles,
    tags,
    searchQuery,
    setSearchQuery,
    filters,
    setFilter,
    loading,
    refresh,
  };
}
