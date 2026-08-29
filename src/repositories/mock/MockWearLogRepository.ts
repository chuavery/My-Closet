import { WearLog } from '@/models/WearLog';
import { WearLogRepository } from '@/repositories/interfaces/WearLogRepository';

let wearLogs: WearLog[] = [];

export class MockWearLogRepository implements WearLogRepository {
  async logArticleWorn(articleId: string): Promise<WearLog> {
    const log: WearLog = {
      id: `wl-${String(wearLogs.length + 1).padStart(3, '0')}`,
      articleId,
      outfitId: null,
      wornDate: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
    };
    wearLogs.push(log);
    return log;
  }

  async logOutfitWorn(outfitId: string): Promise<WearLog> {
    const log: WearLog = {
      id: `wl-${String(wearLogs.length + 1).padStart(3, '0')}`,
      articleId: null,
      outfitId,
      wornDate: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
    };
    wearLogs.push(log);
    return log;
  }

  async getLogsForArticle(articleId: string): Promise<WearLog[]> {
    return wearLogs.filter((l) => l.articleId === articleId);
  }

  async getLogsForOutfit(outfitId: string): Promise<WearLog[]> {
    return wearLogs.filter((l) => l.outfitId === outfitId);
  }

  async getAll(): Promise<WearLog[]> {
    return [...wearLogs];
  }
}
