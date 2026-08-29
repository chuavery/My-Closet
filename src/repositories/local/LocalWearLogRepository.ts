import { Q } from '@nozbe/watermelondb';
import { WearLog } from '@/models/WearLog';
import { WearLogRepository } from '@/repositories/interfaces/WearLogRepository';
import { getDatabase } from '@/lib/watermelon/database';
import { WearLogModel } from '@/lib/watermelon/models/WearLogModel';

function mapToWearLog(model: WearLogModel): WearLog {
  return {
    id: model.id,
    articleId: model.article?.id ?? null,
    outfitId: model.outfit?.id ?? null,
    wornDate: model.wornDate,
    createdAt: new Date((model._raw as any).created_at * 1000).toISOString(),
  };
}

export class LocalWearLogRepository implements WearLogRepository {
  private get collection() {
    return getDatabase().get<WearLogModel>('wear_logs');
  }

  async logArticleWorn(articleId: string): Promise<WearLog> {
    const model = await this.collection.create((rec) => {
      rec.article.id = articleId;
      rec.wornDate = new Date().toISOString().split('T')[0];
    });
    return mapToWearLog(model);
  }

  async logOutfitWorn(outfitId: string): Promise<WearLog> {
    const model = await this.collection.create((rec) => {
      rec.outfit.id = outfitId;
      rec.wornDate = new Date().toISOString().split('T')[0];
    });
    return mapToWearLog(model);
  }

  async getLogsForArticle(articleId: string): Promise<WearLog[]> {
    const models = await this.collection
      .query(Q.where('article_id', articleId))
      .fetch();
    return models.map(mapToWearLog);
  }

  async getLogsForOutfit(outfitId: string): Promise<WearLog[]> {
    const models = await this.collection
      .query(Q.where('outfit_id', outfitId))
      .fetch();
    return models.map(mapToWearLog);
  }

  async getAll(): Promise<WearLog[]> {
    const models = await this.collection.query().fetch();
    return models.map(mapToWearLog);
  }
}
