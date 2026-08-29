import { Model } from '@nozbe/watermelondb';
import { field, relation } from '@nozbe/watermelondb/decorators';

export class ArticleModel extends Model {
  static table = 'articles';

  static associations = {
    storage_spaces: { type: 'belongs_to' as const, key: 'storage_space_id' },
    article_tags: { type: 'has_many' as const, foreignKey: 'article_id' },
    outfit_articles: { type: 'has_many' as const, foreignKey: 'article_id' },
    wear_logs: { type: 'has_many' as const, foreignKey: 'article_id' },
  };

  @field('name') name?: string;
  @field('brand') brand?: string;
  @field('article_type') articleType!: string;
  @field('color') color!: string;
  @field('fabric_type') fabricType?: string;
  @field('fit') fit?: string;
  @field('size') size?: string;
  @field('original_image_url') originalImageUrl!: string;
  @field('processed_image_url') processedImageUrl?: string;
  @relation('storage_spaces', 'storage_space_id') storageSpace: any;
  @field('source') source!: string;
  @field('wear_count') wearCount!: number;
  @field('last_worn_at') lastWornAt?: string;
  @field('created_at') createdAt!: string;
}
