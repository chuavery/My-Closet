export type LayerType = 'base' | 'mid' | 'outer' | 'bottom' | 'footwear' | 'accessory';

export interface OutfitArticle {
  outfitId: string;
  articleId: string;
  layerType: LayerType;
  zIndex: number;
}
