import { Outfit } from './Outfit';
import { Tag } from './Tag';

export interface OutfitSummary {
  outfit: Outfit;
  tags: Tag[];
  articleCount: number;
}
