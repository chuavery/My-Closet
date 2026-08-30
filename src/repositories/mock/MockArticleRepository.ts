import { Article, ArticleType, Color, Source } from '@/models/Article';
import { ArticleRepository } from '@/repositories/interfaces/ArticleRepository';
import { sampleArticles } from './fixtures/sampleArticles';

let articles = [...sampleArticles];

export class MockArticleRepository implements ArticleRepository {
  async getAll(): Promise<Article[]> {
    return [...articles];
  }

  async getById(id: string): Promise<Article | null> {
    return articles.find((a) => a.id === id) ?? null;
  }

  async create(
    article: Omit<Article, 'id' | 'wearCount' | 'lastWornAt' | 'createdAt'>
  ): Promise<Article> {
    const newArticle: Article = {
      ...article,
      id: `art-${String(Math.max(0, ...articles.map((a) => parseInt(a.id.split('-')[1] ?? '0', 10))) + 1).padStart(3, '0')}`,
      wearCount: 0,
      lastWornAt: null,
      createdAt: new Date().toISOString(),
    };
    articles.push(newArticle);
    return newArticle;
  }

  async update(id: string, updates: Partial<Article>): Promise<void> {
    const idx = articles.findIndex((a) => a.id === id);
    if (idx !== -1) {
      articles[idx] = { ...articles[idx], ...updates };
    }
  }

  async delete(id: string): Promise<void> {
    articles = articles.filter((a) => a.id !== id);
  }

  async getByStorageSpace(storageSpaceId: string): Promise<Article[]> {
    return articles.filter((a) => a.storageSpaceId === storageSpaceId);
  }

  async getUnassigned(): Promise<Article[]> {
    return articles.filter((a) => a.storageSpaceId === null);
  }

  async setStorageSpace(
    articleId: string,
    storageSpaceId: string | null
  ): Promise<void> {
    const idx = articles.findIndex((a) => a.id === articleId);
    if (idx !== -1) {
      articles[idx] = { ...articles[idx], storageSpaceId };
    }
  }

  async getByTag(tagId: string): Promise<Article[]> {
    return articles;
  }
}
