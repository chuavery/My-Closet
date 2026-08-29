import { WearLog } from '@/models/WearLog';

export interface WearLogRepository {
  logArticleWorn(articleId: string): Promise<WearLog>;
  logOutfitWorn(outfitId: string): Promise<WearLog>;
  getLogsForArticle(articleId: string): Promise<WearLog[]>;
  getLogsForOutfit(outfitId: string): Promise<WearLog[]>;
  getAll(): Promise<WearLog[]>;
}
