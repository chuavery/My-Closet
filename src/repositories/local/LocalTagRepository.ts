import { Q } from '@nozbe/watermelondb';
import { Tag, TagCategory } from '@/models/Tag';
import { TagRepository } from '@/repositories/interfaces/TagRepository';
import { database } from '@/lib/watermelon/database';
import { TagModel } from '@/lib/watermelon/models/TagModel';
import { ArticleTagModel } from '@/lib/watermelon/models/ArticleTagModel';
import { OutfitTagModel } from '@/lib/watermelon/models/OutfitTagModel';

function mapToTag(model: TagModel): Tag {
  return {
    id: model.id,
    name: model.name,
    category: model.category as TagCategory,
  };
}

export class LocalTagRepository implements TagRepository {
  private get collection() {
    return database.get<TagModel>('tags');
  }

  private get articleTags() {
    return database.get<ArticleTagModel>('article_tags');
  }

  private get outfitTags() {
    return database.get<OutfitTagModel>('outfit_tags');
  }

  async getAll(): Promise<Tag[]> {
    const models = await this.collection.query().fetch();
    return models.map(mapToTag);
  }

  async getByCategory(category: TagCategory): Promise<Tag[]> {
    const models = await this.collection
      .query(Q.where('category', category))
      .fetch();
    return models.map(mapToTag);
  }

  async getById(id: string): Promise<Tag | null> {
    try {
      const model = await this.collection.find(id);
      return mapToTag(model);
    } catch {
      return null;
    }
  }

  async create(tag: Omit<Tag, 'id'>): Promise<Tag> {
    const model = await this.collection.create((rec) => {
      rec.name = tag.name;
      rec.category = tag.category;
    });
    return mapToTag(model);
  }

  async delete(id: string): Promise<void> {
    const aTags = await this.articleTags
      .query(Q.where('tag_id', id))
      .fetch();
    for (const at of aTags) {
      await at.destroyPermanently();
    }
    const oTags = await this.outfitTags
      .query(Q.where('tag_id', id))
      .fetch();
    for (const ot of oTags) {
      await ot.destroyPermanently();
    }
    const model = await this.collection.find(id);
    await model.destroyPermanently();
  }

  async getTagsForArticle(articleId: string): Promise<Tag[]> {
    const links = await this.articleTags
      .query(Q.where('article_id', articleId))
      .fetch();
    const tagIds = links.map((l) => l.tag?.id ?? '');
    if (tagIds.length === 0) return [];
    const models = await this.collection
      .query(Q.where('id', Q.oneOf(tagIds)))
      .fetch();
    return models.map(mapToTag);
  }

  async getTagsForOutfit(outfitId: string): Promise<Tag[]> {
    const links = await this.outfitTags
      .query(Q.where('outfit_id', outfitId))
      .fetch();
    const tagIds = links.map((l) => l.tag?.id ?? '');
    if (tagIds.length === 0) return [];
    const models = await this.collection
      .query(Q.where('id', Q.oneOf(tagIds)))
      .fetch();
    return models.map(mapToTag);
  }

  async addTagToArticle(articleId: string, tagId: string): Promise<void> {
    await this.articleTags.create((rec) => {
      rec.article.id = articleId;
      rec.tag.id = tagId;
    });
  }

  async removeTagFromArticle(articleId: string, tagId: string): Promise<void> {
    const links = await this.articleTags
      .query(
        Q.where('article_id', articleId),
        Q.where('tag_id', tagId)
      )
      .fetch();
    for (const link of links) {
      await link.destroyPermanently();
    }
  }

  async addTagToOutfit(outfitId: string, tagId: string): Promise<void> {
    await this.outfitTags.create((rec) => {
      rec.outfit.id = outfitId;
      rec.tag.id = tagId;
    });
  }

  async removeTagFromOutfit(outfitId: string, tagId: string): Promise<void> {
    const links = await this.outfitTags
      .query(
        Q.where('outfit_id', outfitId),
        Q.where('tag_id', tagId)
      )
      .fetch();
    for (const link of links) {
      await link.destroyPermanently();
    }
  }
}
