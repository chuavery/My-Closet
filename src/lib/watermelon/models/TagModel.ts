import { Model } from '@nozbe/watermelondb';
import { field, children } from '@nozbe/watermelondb/decorators';

export class TagModel extends Model {
  static table = 'tags';

  static associations = {
    article_tags: { type: 'has_many' as const, foreignKey: 'tag_id' },
    outfit_tags: { type: 'has_many' as const, foreignKey: 'tag_id' },
  };

  @field('name') name!: string;
  @field('category') category!: string;

  @children('article_tags') articleTags: any;
  @children('outfit_tags') outfitTags: any;
}
