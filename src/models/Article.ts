export type ArticleType =
  | 'shirt'
  | 'jacket'
  | 'dress'
  | 'pants'
  | 'shorts'
  | 'skirt'
  | 'sweater'
  | 'coat'
  | 'shoes'
  | 'accessories'
  | 'other';

export type Color =
  | 'red'
  | 'orange'
  | 'yellow'
  | 'green'
  | 'blue'
  | 'indigo'
  | 'violet'
  | 'pink'
  | 'white'
  | 'brown'
  | 'black';

export type Fit =
  | 'slim'
  | 'regular'
  | 'straight'
  | 'oversized'
  | 'relaxed'
  | 'tailored';

export type Source = 'manual' | 'ai_on_device' | 'ai_online';

export interface Article {
  id: string;
  name?: string;
  brand?: string;
  articleType: ArticleType;
  color: Color;
  fabricType?: string;
  fit?: Fit;
  size?: string;
  originalImageUrl: string;
  processedImageUrl?: string;
  storageSpaceId: string | null;
  source: Source;
  wearCount: number;
  lastWornAt: string | null;
  createdAt: string;
}
