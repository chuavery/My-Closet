import { useState, useEffect, useCallback } from 'react';
import { StorageSpace } from '@/models/StorageSpace';
import { Article } from '@/models/Article';
import { useRepositories } from '@/providers/RepositoryProvider';

export function useStorageSpaces() {
  const { storageSpaceRepository, articleRepository } = useRepositories();
  const [spaces, setSpaces] = useState<StorageSpace[]>([]);
  const [articlesBySpace, setArticlesBySpace] = useState<
    Record<string, Article[]>
  >({});
  const [unassignedArticles, setUnassignedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const [allSpaces, allArticles, unassigned] = await Promise.all([
      storageSpaceRepository.getAll(),
      articleRepository.getAll(),
      articleRepository.getUnassigned(),
    ]);

    const bySpace: Record<string, Article[]> = {};
    for (const space of allSpaces) {
      bySpace[space.id] = [];
    }
    for (const article of allArticles) {
      if (article.storageSpaceId && bySpace[article.storageSpaceId]) {
        bySpace[article.storageSpaceId].push(article);
      }
    }

    setSpaces(allSpaces);
    setArticlesBySpace(bySpace);
    setUnassignedArticles(unassigned);
    setLoading(false);
  }, [storageSpaceRepository, articleRepository]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const createSpace = useCallback(
    async (data: { name: string; subLocation?: string; qrCodeValue: string }) => {
      const space = await storageSpaceRepository.create(data);
      await refresh();
      return space;
    },
    [storageSpaceRepository, refresh]
  );

  const deleteSpace = useCallback(
    async (id: string) => {
      await storageSpaceRepository.delete(id);
      await refresh();
    },
    [storageSpaceRepository, refresh]
  );

  const findByQrCode = useCallback(
    async (qrCodeValue: string) => {
      return storageSpaceRepository.getByQrCode(qrCodeValue);
    },
    [storageSpaceRepository]
  );

  return {
    spaces,
    articlesBySpace,
    unassignedArticles,
    loading,
    refresh,
    createSpace,
    deleteSpace,
    findByQrCode,
  };
}
