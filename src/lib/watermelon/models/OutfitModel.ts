import { Model } from '@nozbe/watermelondb';
import { field, children } from '@nozbe/watermelondb/decorators';

export class OutfitModel extends Model {
  static table = 'outfits';

  static associations = {
    outfit_articles: { type: 'has_many' as const, foreignKey: 'outfit_id' },
    outfit_tags: { type: 'has_many' as const, foreignKey: 'outfit_id' },
    wear_logs: { type: 'has_many' as const, foreignKey: 'outfit_id' },
  };

  @field('name') name!: string;
  @field('wear_count') wearCount!: number;
  @field('last_worn_at') lastWornAt?: string;
  @field('created_at') createdAt!: string;

  @children('outfit_articles') outfitArticles: any;
  @children('outfit_tags') outfitTags: any;
}
