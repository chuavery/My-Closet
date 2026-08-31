import { Outfit } from '@/models/Outfit';
import { OutfitArticle, LayerType } from '@/models/OutfitArticle';
import { OutfitRepository } from '@/repositories/interfaces/OutfitRepository';
import { sampleOutfits } from './fixtures/sampleOutfits';

let outfits = [...sampleOutfits];
let outfitArticles: OutfitArticle[] = [
  { outfitId: 'out-001', articleId: 'art-001', layerType: 'base', zIndex: 0 },
  { outfitId: 'out-001', articleId: 'art-002', layerType: 'bottom', zIndex: 1 },
  { outfitId: 'out-001', articleId: 'art-004', layerType: 'outer', zIndex: 2 },
  { outfitId: 'out-001', articleId: 'art-003', layerType: 'footwear', zIndex: 3 },
  { outfitId: 'out-001', articleId: 'art-008', layerType: 'accessory', zIndex: 4 },
  { outfitId: 'out-002', articleId: 'art-005', layerType: 'base', zIndex: 0 },
  { outfitId: 'out-002', articleId: 'art-002', layerType: 'bottom', zIndex: 1 },
];

export class MockOutfitRepository implements OutfitRepository {
  async getAll(): Promise<Outfit[]> {
    return [...outfits];
  }

  async getById(id: string): Promise<Outfit | null> {
    return outfits.find((o) => o.id === id) ?? null;
  }

  async create(
    outfit: Omit<Outfit, 'id' | 'wearCount' | 'lastWornAt' | 'createdAt'>
  ): Promise<Outfit> {
    const newOutfit: Outfit = {
      ...outfit,
      id: `out-${String(Math.max(0, ...outfits.map((o) => parseInt(o.id.split('-')[1] ?? '0', 10))) + 1).padStart(3, '0')}`,
      wearCount: 0,
      lastWornAt: null,
      createdAt: new Date().toISOString(),
    };
    outfits.push(newOutfit);
    return newOutfit;
  }

  async update(id: string, updates: Partial<Outfit>): Promise<void> {
    const idx = outfits.findIndex((o) => o.id === id);
    if (idx !== -1) {
      outfits[idx] = { ...outfits[idx], ...updates };
    }
  }

  async delete(id: string): Promise<void> {
    outfits = outfits.filter((o) => o.id !== id);
    outfitArticles = outfitArticles.filter((oa) => oa.outfitId !== id);
  }

  async addArticle(
    outfitId: string,
    articleId: string,
    layerType: LayerType,
    zIndex: number
  ): Promise<OutfitArticle> {
    const newOA: OutfitArticle = { outfitId, articleId, layerType, zIndex };
    outfitArticles.push(newOA);
    return newOA;
  }

  async removeArticle(outfitId: string, articleId: string): Promise<void> {
    outfitArticles = outfitArticles.filter(
      (oa) => !(oa.outfitId === outfitId && oa.articleId === articleId)
    );
  }

  async getArticlesForOutfit(outfitId: string): Promise<OutfitArticle[]> {
    return outfitArticles.filter((oa) => oa.outfitId === outfitId);
  }

  async getArticleCountsForOutfits(outfitIds: string[]): Promise<Record<string, number>> {
    const counts: Record<string, number> = {};
    for (const id of outfitIds) {
      counts[id] = outfitArticles.filter((oa) => oa.outfitId === id).length;
    }
    return counts;
  }
}
