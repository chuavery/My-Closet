import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
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

async function pickAndSaveImage(useCamera: boolean): Promise<string | null> {
  const permissionFn = useCamera
    ? ImagePicker.requestCameraPermissionsAsync
    : ImagePicker.requestMediaLibraryPermissionsAsync;

  const { status } = await permissionFn();
  if (status !== 'granted') {
    Alert.alert(
      'Permission needed',
      useCamera
        ? 'Camera permission is required to take photos.'
        : 'Photo library permission is required to select images.'
    );
    return null;
  }

  const launchFn = useCamera
    ? ImagePicker.launchCameraAsync
    : ImagePicker.launchImageLibraryAsync;

  const result = await launchFn({
    mediaTypes: ['images'],
    quality: 0.8,
    allowsEditing: true,
    aspect: [3, 4],
  });

  if (result.canceled || !result.assets?.[0]) return null;

  const asset = result.assets[0];
  const filename = `article_${Date.now()}.jpg`;
  const dest = `${FileSystem.documentDirectory}articles/${filename}`;

  await FileSystem.makeDirectoryAsync(`${FileSystem.documentDirectory}articles`, {
    intermediates: true,
  });

  await FileSystem.copyAsync({ from: asset.uri, to: dest });
  return dest;
}

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

  const pickImage = useCallback(async () => {
    const uri = await pickAndSaveImage(false);
    if (uri) {
      setForm((prev) => ({ ...prev, originalImageUrl: uri }));
    }
  }, []);

  const takePhoto = useCallback(async () => {
    const uri = await pickAndSaveImage(true);
    if (uri) {
      setForm((prev) => ({ ...prev, originalImageUrl: uri }));
    }
  }, []);

  const validate = useCallback((): string | null => {
    if (!form.originalImageUrl) return 'Please add a photo.';
    if (!form.name.trim()) return 'Please enter a name.';
    if (!form.brand.trim()) return 'Please enter a brand.';
    if (!form.articleType) return 'Please select a type.';
    if (!form.color) return 'Please select a color.';
    return null;
  }, [form]);

  const save = useCallback(async (): Promise<Article | null> => {
    const error = validate();
    if (error) {
      Alert.alert('Missing details', error);
      return null;
    }
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
  }, [isNew, articleId, form, articleRepository, validate]);

  const remove = useCallback(async () => {
    if (articleId) {
      await articleRepository.delete(articleId);
    }
  }, [articleId, articleRepository]);

  return {
    form,
    updateField,
    pickImage,
    takePhoto,
    save,
    remove,
    loading,
    saving,
    isNew,
  };
}
