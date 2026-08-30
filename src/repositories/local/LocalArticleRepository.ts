import { Q } from '@nozbe/watermelondb';
import { Article } from '@/models/Article';
import { ArticleRepository } from '@/repositories/interfaces/ArticleRepository';
import { getDatabase } from '@/lib/watermelon/database';
import { ArticleModel } from '@/lib/watermelon/models/ArticleModel';

function mapToArticle(model: ArticleModel): Article {
  return {
    id: model.id,
    name: model.name,
    brand: model.brand,
    articleType: model.articleType as Article['articleType'],
    color: model.color as Article['color'],
    fabricType: model.fabricType,
    fit: model.fit as Article['fit'],
    size: model.size,
    originalImageUrl: model.originalImageUrl,
    processedImageUrl: model.processedImageUrl,
    storageSpaceId: model.storageSpace?.id ?? null,
    source: model.source as Article['source'],
    wearCount: model.wearCount,
    lastWornAt: model.lastWornAt ?? null,
    createdAt: new Date((model._raw as any).created_at * 1000).toISOString(),
  };
}

export class LocalArticleRepository implements ArticleRepository {
  private get collection() {
    return getDatabase().get<ArticleModel>('articles');
  }

  async getAll(): Promise<Article[]> {
    const models = await this.collection.query().fetch();
    return models.map(mapToArticle);
  }

  async getById(id: string): Promise<Article | null> {
    try {
      const model = await this.collection.find(id);
      return mapToArticle(model);
    } catch {
      return null;
    }
  }

  async create(
    article: Omit<Article, 'id' | 'wearCount' | 'lastWornAt' | 'createdAt'>
  ): Promise<Article> {
    const model = await this.collection.create((rec) => {
      rec.name = article.name;
      rec.brand = article.brand;
      rec.articleType = article.articleType;
      rec.color = article.color;
      rec.fabricType = article.fabricType;
      rec.fit = article.fit;
      rec.size = article.size;
      rec.originalImageUrl = article.originalImageUrl;
      rec.processedImageUrl = article.processedImageUrl;
      rec.source = article.source;
      rec.wearCount = 0;
    });
    return mapToArticle(model);
  }

  async update(id: string, updates: Partial<Article>): Promise<void> {
    const model = await this.collection.find(id);
    await model.update((rec) => {
      if (updates.name !== undefined) rec.name = updates.name;
      if (updates.brand !== undefined) rec.brand = updates.brand;
      if (updates.articleType !== undefined) rec.articleType = updates.articleType;
      if (updates.color !== undefined) rec.color = updates.color;
      if (updates.fabricType !== undefined) rec.fabricType = updates.fabricType;
      if (updates.fit !== undefined) rec.fit = updates.fit;
      if (updates.size !== undefined) rec.size = updates.size;
      if (updates.originalImageUrl !== undefined) rec.originalImageUrl = updates.originalImageUrl;
      if (updates.processedImageUrl !== undefined) rec.processedImageUrl = updates.processedImageUrl;
      if (updates.storageSpaceId !== undefined) rec.storageSpace.id = updates.storageSpaceId;
      if (updates.source !== undefined) rec.source = updates.source;
      if (updates.wearCount !== undefined) rec.wearCount = updates.wearCount;
      if (updates.lastWornAt !== undefined) rec.lastWornAt = updates.lastWornAt ?? undefined;
    });
  }

  async delete(id: string): Promise<void> {
    const model = await this.collection.find(id);
    await model.destroyPermanently();
  }

  async getByStorageSpace(storageSpaceId: string): Promise<Article[]> {
    const models = await this.collection
      .query(Q.where('storage_space_id', storageSpaceId))
      .fetch();
    return models.map(mapToArticle);
  }

  async getUnassigned(): Promise<Article[]> {
    const models = await this.collection
      .query(Q.where('storage_space_id', null))
      .fetch();
    return models.map(mapToArticle);
  }

  async setStorageSpace(
    articleId: string,
    storageSpaceId: string | null
  ): Promise<void> {
    const model = await this.collection.find(articleId);
    await model.update((rec) => {
      rec.storageSpace.id = storageSpaceId;
    });
  }

  async getByTag(tagId: string): Promise<Article[]> {
    const articleTags = getDatabase().get('article_tags');
    const links = await articleTags
      .query(Q.where('tag_id', tagId))
      .fetch();
    const articleIds = links.map((l: any) => l.article_id);
    if (articleIds.length === 0) return [];
    const models = await this.collection
      .query(Q.where('id', Q.oneOf(articleIds)))
      .fetch();
    return models.map(mapToArticle);
  }
}
