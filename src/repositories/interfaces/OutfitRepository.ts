import { Outfit } from '@/models/Outfit';
import { OutfitArticle, LayerType } from '@/models/OutfitArticle';

export interface OutfitRepository {
  getAll(): Promise<Outfit[]>;
  getById(id: string): Promise<Outfit | null>;
  create(outfit: Omit<Outfit, 'id' | 'wearCount' | 'lastWornAt' | 'createdAt'>): Promise<Outfit>;
  update(id: string, updates: Partial<Outfit>): Promise<void>;
  delete(id: string): Promise<void>;
  addArticle(outfitId: string, articleId: string, layerType: LayerType, zIndex: number): Promise<OutfitArticle>;
  removeArticle(outfitId: string, articleId: string): Promise<void>;
  getArticlesForOutfit(outfitId: string): Promise<OutfitArticle[]>;
  getArticleCountsForOutfits(outfitIds: string[]): Promise<Record<string, number>>;
}
