import { useState, useEffect, useCallback } from 'react';
import { Outfit } from '@/models/Outfit';
import { OutfitArticle, LayerType } from '@/models/OutfitArticle';
import { Article } from '@/models/Article';
import { Tag } from '@/models/Tag';
import { useRepositories } from '@/providers/RepositoryProvider';

export function useOutfitBuilder(outfitId?: string) {
  const {
    outfitRepository,
    articleRepository,
    tagRepository,
  } = useRepositories();

  const [outfit, setOutfit] = useState<Outfit | null>(null);
  const [outfitArticles, setOutfitArticles] = useState<OutfitArticle[]>([]);
  const [allArticles, setAllArticles] = useState<Article[]>([]);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const [articles, tags] = await Promise.all([
        articleRepository.getAll(),
        tagRepository.getAll(),
      ]);
      setAllArticles(articles);
      setAllTags(tags);

      if (outfitId) {
        const existing = await outfitRepository.getById(outfitId);
        if (existing) {
          setOutfit(existing);
          const oas = await outfitRepository.getArticlesForOutfit(outfitId);
          setOutfitArticles(oas);
          const outfitTags = await tagRepository.getTagsForOutfit(outfitId);
          setSelectedTagIds(outfitTags.map((t) => t.id));
        }
      }
      setLoading(false);
    }
    load();
  }, [outfitId, articleRepository, tagRepository, outfitRepository]);

  const addArticle = useCallback(
    async (articleId: string, layerType: LayerType) => {
      const maxZ = outfitArticles.reduce(
        (max, oa) => Math.max(max, oa.zIndex),
        -1
      );
      const oa = await outfitRepository.addArticle(
        outfitId ?? '',
        articleId,
        layerType,
        maxZ + 1
      );
      setOutfitArticles((prev) => [...prev, oa]);
    },
    [outfitId, outfitArticles, outfitRepository]
  );

  const removeArticle = useCallback(
    async (articleId: string) => {
      await outfitRepository.removeArticle(outfitId ?? '', articleId);
      setOutfitArticles((prev) =>
        prev.filter((oa) => oa.articleId !== articleId)
      );
    },
    [outfitId, outfitRepository]
  );

  const save = useCallback(async (): Promise<Outfit | null> => {
    setSaving(true);
    try {
      if (outfitId) {
        await outfitRepository.update(outfitId, { name: outfit?.name ?? '' });
        const updated = await outfitRepository.getById(outfitId);
        return updated;
      } else {
        const created = await outfitRepository.create({
          name: outfit?.name ?? 'New Outfit',
        });
        setOutfit(created);
        return created;
      }
    } finally {
      setSaving(false);
    }
  }, [outfitId, outfit, outfitRepository]);

  return {
    outfit,
    setOutfit,
    outfitArticles,
    allArticles,
    allTags,
    selectedTagIds,
    setSelectedTagIds,
    addArticle,
    removeArticle,
    save,
    loading,
    saving,
  };
}
