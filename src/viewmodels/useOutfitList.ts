import { useState, useEffect } from 'react';
import { OutfitSummary } from '@/models/OutfitSummary';
import { useRepositories } from '@/providers/RepositoryProvider';

export function useOutfitList() {
  const { outfitRepository, tagRepository } = useRepositories();
  const [outfits, setOutfits] = useState<OutfitSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const allOutfits = await outfitRepository.getAll();
      const ids = allOutfits.map((o) => o.id);
      const [articleCounts, tagsByOutfit] = await Promise.all([
        outfitRepository.getArticleCountsForOutfits(ids),
        tagRepository.getTagsForOutfits(ids),
      ]);
      setOutfits(
        allOutfits.map((o) => ({
          outfit: o,
          tags: tagsByOutfit[o.id] ?? [],
          articleCount: articleCounts[o.id] ?? 0,
        }))
      );
      setLoading(false);
    }
    load();
  }, [outfitRepository, tagRepository]);

  return { outfits, loading };
}
