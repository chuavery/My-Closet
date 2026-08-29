export const ARTICLE_TYPES = [
  'shirt', 'jacket', 'coat', 'sweater', 'dress', 'pants',
  'shorts', 'skirt', 'shoes', 'accessory', 'suit', 'activewear', 'other',
] as const;
export type ArticleType = typeof ARTICLE_TYPES[number];

export const ARTICLE_TYPE_LABELS: Record<ArticleType, string> = {
  shirt: 'Shirt', jacket: 'Jacket', coat: 'Coat', sweater: 'Sweater',
  dress: 'Dress', pants: 'Trousers', shorts: 'Shorts', skirt: 'Skirt',
  shoes: 'Shoes', accessory: 'Accessory', suit: 'Suit', activewear: 'Activewear',
  other: 'Other',
};

export const COLORS = [
  'red', 'orange', 'yellow', 'green', 'blue', 'indigo',
  'violet', 'pink', 'white', 'brown', 'black',
] as const;
export type Color = typeof COLORS[number];

export const COLOR_HEX: Record<Color, string> = {
  red: '#DC2626', orange: '#EA580C', yellow: '#CA8A04',
  green: '#16A34A', blue: '#1D4ED8', indigo: '#4338CA',
  violet: '#7C3AED', pink: '#DB2777', white: '#E8E4DC',
  brown: '#78350F', black: '#1C1917',
};

export const OCCASIONS = [
  'casual', 'formal', 'smart casual', 'business',
  'athletic', 'evening', 'beach', 'outdoor', 'travel',
] as const;
export type Occasion = typeof OCCASIONS[number];

export const LAYERS = ['base', 'mid', 'outer', 'bottom', 'footwear', 'accessory'] as const;
export type Layer = typeof LAYERS[number];

export const LAYER_LABELS: Record<Layer, string> = {
  base: 'Base', mid: 'Mid Layer', outer: 'Outer', bottom: 'Bottom',
  footwear: 'Footwear', accessory: 'Accessory',
};

export interface Article {
  id: string;
  name: string;
  brand: string;
  type: ArticleType;
  color: Color;
  fabric: string;
  fit: string;
  size: string;
  photoUrl: string;
  storageSpaceId: string;
  createdAt: string;
  lastWornAt: string;
  wearCount: number;
}

export interface StorageSpace {
  id: string;
  name: string;
  subLocation: string;
  createdAt: string;
}

export interface OutfitArticle {
  articleId: string;
  layer: Layer;
}

export interface Outfit {
  id: string;
  name: string;
  occasions: Occasion[];
  articles: OutfitArticle[];
  createdAt: string;
  lastWornAt: string;
  wearCount: number;
}

export interface UserSettings {
  wearHistoryEnabled: boolean;
}
