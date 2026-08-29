import React, { createContext, useContext, useMemo } from 'react';
import { ArticleRepository } from '@/repositories/interfaces/ArticleRepository';
import { StorageSpaceRepository } from '@/repositories/interfaces/StorageSpaceRepository';
import { OutfitRepository } from '@/repositories/interfaces/OutfitRepository';
import { TagRepository } from '@/repositories/interfaces/TagRepository';
import { WearLogRepository } from '@/repositories/interfaces/WearLogRepository';
import { SettingsRepository } from '@/repositories/interfaces/SettingsRepository';
import { MockArticleRepository } from '@/repositories/mock/MockArticleRepository';
import { MockStorageSpaceRepository } from '@/repositories/mock/MockStorageSpaceRepository';
import { MockOutfitRepository } from '@/repositories/mock/MockOutfitRepository';
import { MockTagRepository } from '@/repositories/mock/MockTagRepository';
import { MockWearLogRepository } from '@/repositories/mock/MockWearLogRepository';
import { MockSettingsRepository } from '@/repositories/mock/MockSettingsRepository';
import { LocalArticleRepository } from '@/repositories/local/LocalArticleRepository';
import { LocalStorageSpaceRepository } from '@/repositories/local/LocalStorageSpaceRepository';
import { LocalOutfitRepository } from '@/repositories/local/LocalOutfitRepository';
import { LocalTagRepository } from '@/repositories/local/LocalTagRepository';
import { LocalWearLogRepository } from '@/repositories/local/LocalWearLogRepository';
import { LocalSettingsRepository } from '@/repositories/local/LocalSettingsRepository';

export interface RepositorySet {
  articleRepository: ArticleRepository;
  storageSpaceRepository: StorageSpaceRepository;
  outfitRepository: OutfitRepository;
  tagRepository: TagRepository;
  wearLogRepository: WearLogRepository;
  settingsRepository: SettingsRepository;
}

const RepositoryContext = createContext<RepositorySet | null>(null);

function createMockRepositories(): RepositorySet {
  return {
    articleRepository: new MockArticleRepository(),
    storageSpaceRepository: new MockStorageSpaceRepository(),
    outfitRepository: new MockOutfitRepository(),
    tagRepository: new MockTagRepository(),
    wearLogRepository: new MockWearLogRepository(),
    settingsRepository: new MockSettingsRepository(),
  };
}

function createLocalRepositories(): RepositorySet {
  return {
    articleRepository: new LocalArticleRepository(),
    storageSpaceRepository: new LocalStorageSpaceRepository(),
    outfitRepository: new LocalOutfitRepository(),
    tagRepository: new LocalTagRepository(),
    wearLogRepository: new LocalWearLogRepository(),
    settingsRepository: new LocalSettingsRepository(),
  };
}

export function RepositoryProvider({ children }: { children: React.ReactNode }) {
  const dataSource = process.env.EXPO_PUBLIC_DATA_SOURCE;

  const repositories = useMemo(() => {
    if (dataSource === 'mock') {
      return createMockRepositories();
    }
    return createLocalRepositories();
  }, [dataSource]);

  return (
    <RepositoryContext.Provider value={repositories}>
      {children}
    </RepositoryContext.Provider>
  );
}

export function useRepositories(): RepositorySet {
  const ctx = useContext(RepositoryContext);
  if (!ctx) {
    throw new Error('useRepositories must be used within a RepositoryProvider');
  }
  return ctx;
}
