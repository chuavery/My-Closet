import { Model } from '@nozbe/watermelondb';
import { relation } from '@nozbe/watermelondb/decorators';

export class OutfitTagModel extends Model {
  static table = 'outfit_tags';

  static associations = {
    outfits: { type: 'belongs_to' as const, key: 'outfit_id' },
    tags: { type: 'belongs_to' as const, key: 'tag_id' },
  };

  @relation('outfits', 'outfit_id') outfit: any;
  @relation('tags', 'tag_id') tag: any;
}
