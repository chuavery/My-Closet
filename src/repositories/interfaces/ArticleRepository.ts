import { Article } from '@/models/Article';

export interface ArticleRepository {
  getAll(): Promise<Article[]>;
  getById(id: string): Promise<Article | null>;
  create(article: Omit<Article, 'id' | 'wearCount' | 'lastWornAt' | 'createdAt'>): Promise<Article>;
  update(id: string, updates: Partial<Article>): Promise<void>;
  delete(id: string): Promise<void>;
  getByStorageSpace(storageSpaceId: string): Promise<Article[]>;
  getUnassigned(): Promise<Article[]>;
  setStorageSpace(articleId: string, storageSpaceId: string | null): Promise<void>;
  getByTag(tagId: string): Promise<Article[]>;
}
