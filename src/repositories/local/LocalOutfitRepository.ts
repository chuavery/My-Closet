import { Q } from '@nozbe/watermelondb';
import { Outfit } from '@/models/Outfit';
import { OutfitArticle, LayerType } from '@/models/OutfitArticle';
import { OutfitRepository } from '@/repositories/interfaces/OutfitRepository';
import { getDatabase } from '@/lib/watermelon/database';
import { OutfitModel } from '@/lib/watermelon/models/OutfitModel';
import { OutfitArticleModel } from '@/lib/watermelon/models/OutfitArticleModel';

function mapToOutfit(model: OutfitModel): Outfit {
  return {
    id: model.id,
    name: model.name,
    wearCount: model.wearCount,
    lastWornAt: model.lastWornAt ?? null,
    createdAt: new Date((model._raw as any).created_at * 1000).toISOString(),
  };
}

function mapToOutfitArticle(model: OutfitArticleModel): OutfitArticle {
  return {
    outfitId: model.outfit?.id ?? '',
    articleId: model.article?.id ?? '',
    layerType: model.layerType as LayerType,
    zIndex: model.zIndex,
  };
}

export class LocalOutfitRepository implements OutfitRepository {
  private get collection() {
    return getDatabase().get<OutfitModel>('outfits');
  }

  private get outfitArticles() {
    return getDatabase().get<OutfitArticleModel>('outfit_articles');
  }

  async getAll(): Promise<Outfit[]> {
    const models = await this.collection.query().fetch();
    return models.map(mapToOutfit);
  }

  async getById(id: string): Promise<Outfit | null> {
    try {
      const model = await this.collection.find(id);
      return mapToOutfit(model);
    } catch {
      return null;
    }
  }

  async create(
    outfit: Omit<Outfit, 'id' | 'wearCount' | 'lastWornAt' | 'createdAt'>
  ): Promise<Outfit> {
    const model = await this.collection.create((rec) => {
      rec.name = outfit.name;
      rec.wearCount = 0;
    });
    return mapToOutfit(model);
  }

  async update(id: string, updates: Partial<Outfit>): Promise<void> {
    const model = await this.collection.find(id);
    await model.update((rec) => {
      if (updates.name !== undefined) rec.name = updates.name;
      if (updates.wearCount !== undefined) rec.wearCount = updates.wearCount;
      if (updates.lastWornAt !== undefined) rec.lastWornAt = updates.lastWornAt ?? undefined;
    });
  }

  async delete(id: string): Promise<void> {
    const links = await this.outfitArticles
      .query(Q.where('outfit_id', id))
      .fetch();
    for (const link of links) {
      await link.destroyPermanently();
    }
    const model = await this.collection.find(id);
    await model.destroyPermanently();
  }

  async addArticle(
    outfitId: string,
    articleId: string,
    layerType: LayerType,
    zIndex: number
  ): Promise<OutfitArticle> {
    const model = await this.outfitArticles.create((rec) => {
      rec.outfit.id = outfitId;
      rec.article.id = articleId;
      rec.layerType = layerType;
      rec.zIndex = zIndex;
    });
    return mapToOutfitArticle(model);
  }

  async removeArticle(outfitId: string, articleId: string): Promise<void> {
    const links = await this.outfitArticles
      .query(
        Q.where('outfit_id', outfitId),
        Q.where('article_id', articleId)
      )
      .fetch();
    for (const link of links) {
      await link.destroyPermanently();
    }
  }

  async getArticlesForOutfit(outfitId: string): Promise<OutfitArticle[]> {
    const models = await this.outfitArticles
      .query(Q.where('outfit_id', outfitId))
      .fetch();
    return models.map(mapToOutfitArticle);
  }
}
