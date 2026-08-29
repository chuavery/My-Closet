import { useState, useEffect, useCallback } from 'react';
import { Outfit } from '@/models/Outfit';
import { OutfitArticle } from '@/models/OutfitArticle';
import { Article } from '@/models/Article';
import { Tag } from '@/models/Tag';
import { useRepositories } from '@/providers/RepositoryProvider';

export function useOutfitDetail(outfitId: string) {
  const {
    outfitRepository,
    articleRepository,
    tagRepository,
    wearLogRepository,
    settingsRepository,
  } = useRepositories();

  const [outfit, setOutfit] = useState<Outfit | null>(null);
  const [outfitArticles, setOutfitArticles] = useState<OutfitArticle[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [wearHistoryEnabled, setWearHistoryEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const [existing, settings] = await Promise.all([
      outfitRepository.getById(outfitId),
      settingsRepository.get(),
    ]);
    setWearHistoryEnabled(settings.wearHistoryEnabled);

    if (existing) {
      setOutfit(existing);
      const [oas, outfitTags] = await Promise.all([
        outfitRepository.getArticlesForOutfit(outfitId),
        tagRepository.getTagsForOutfit(outfitId),
      ]);
      setOutfitArticles(oas);
      setTags(outfitTags);

      const articleIds = oas.map((oa) => oa.articleId);
      const articlePromises = articleIds.map((id) => articleRepository.getById(id));
      const articleResults = await Promise.all(articlePromises);
      setArticles(articleResults.filter(Boolean) as Article[]);
    }
    setLoading(false);
  }, [
    outfitId,
    outfitRepository,
    articleRepository,
    tagRepository,
    settingsRepository,
  ]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const markWorn = useCallback(async () => {
    if (!wearHistoryEnabled) return;
    await wearLogRepository.logOutfitWorn(outfitId);
    for (const oa of outfitArticles) {
      const article = await articleRepository.getById(oa.articleId);
      if (article) {
        await articleRepository.update(oa.articleId, {
          wearCount: article.wearCount + 1,
          lastWornAt: new Date().toISOString(),
        });
      }
    }
    if (outfit) {
      await outfitRepository.update(outfitId, {
        wearCount: outfit.wearCount + 1,
        lastWornAt: new Date().toISOString(),
      });
    }
    await refresh();
  }, [
    outfitId,
    outfit,
    outfitArticles,
    wearHistoryEnabled,
    wearLogRepository,
    articleRepository,
    outfitRepository,
    refresh,
  ]);

  const deleteOutfit = useCallback(async () => {
    await outfitRepository.delete(outfitId);
  }, [outfitId, outfitRepository]);

  return {
    outfit,
    outfitArticles,
    articles,
    tags,
    wearHistoryEnabled,
    loading,
    refresh,
    markWorn,
    deleteOutfit,
  };
}
