import { useState, useEffect, useCallback } from 'react';
import { Article, ArticleType, Color, Source } from '@/models/Article';
import { useRepositories } from '@/providers/RepositoryProvider';

export interface ArticleFormData {
  name: string;
  brand: string;
  articleType: ArticleType;
  color: Color;
  fabricType: string;
  fit: string;
  size: string;
  originalImageUrl: string;
  processedImageUrl?: string;
  storageSpaceId: string | null;
  source: Source;
}

const INITIAL_FORM: ArticleFormData = {
  name: '',
  brand: '',
  articleType: 'shirt',
  color: 'black',
  fabricType: '',
  fit: '',
  size: '',
  originalImageUrl: '',
  storageSpaceId: null,
  source: 'manual',
};

export function useArticleForm(articleId?: string) {
  const { articleRepository } = useRepositories();
  const [form, setForm] = useState<ArticleFormData>(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isNew, setIsNew] = useState(!articleId);

  useEffect(() => {
    if (articleId) {
      setLoading(true);
      articleRepository.getById(articleId).then((article) => {
        if (article) {
          setForm({
            name: article.name ?? '',
            brand: article.brand ?? '',
            articleType: article.articleType,
            color: article.color,
            fabricType: article.fabricType ?? '',
            fit: article.fit ?? '',
            size: article.size ?? '',
            originalImageUrl: article.originalImageUrl,
            processedImageUrl: article.processedImageUrl,
            storageSpaceId: article.storageSpaceId,
            source: article.source,
          });
        }
        setLoading(false);
      });
    }
  }, [articleId, articleRepository]);

  const updateField = useCallback(
    <K extends keyof ArticleFormData>(key: K, value: ArticleFormData[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const save = useCallback(async (): Promise<Article | null> => {
    setSaving(true);
    try {
      if (isNew) {
        const article = await articleRepository.create(form);
        return article;
      } else if (articleId) {
        await articleRepository.update(articleId, form);
        return { ...form, id: articleId, wearCount: 0, lastWornAt: null, createdAt: '' };
      }
      return null;
    } finally {
      setSaving(false);
    }
  }, [isNew, articleId, form, articleRepository]);

  const remove = useCallback(async () => {
    if (articleId) {
      await articleRepository.delete(articleId);
    }
  }, [articleId, articleRepository]);

  return {
    form,
    updateField,
    save,
    remove,
    loading,
    saving,
    isNew,
  };
}
