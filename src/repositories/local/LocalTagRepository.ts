import { Q } from '@nozbe/watermelondb';
import { Tag, TagCategory } from '@/models/Tag';
import { TagRepository } from '@/repositories/interfaces/TagRepository';
import { getDatabase } from '@/lib/watermelon/database';
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
    return getDatabase().get<TagModel>('tags');
  }

  private get articleTags() {
    return getDatabase().get<ArticleTagModel>('article_tags');
  }

  private get outfitTags() {
    return getDatabase().get<OutfitTagModel>('outfit_tags');
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

  async getTagsForOutfits(outfitIds: string[]): Promise<Record<string, Tag[]>> {
    if (outfitIds.length === 0) return {};
    const links = await this.outfitTags
      .query(Q.where('outfit_id', Q.oneOf(outfitIds)))
      .fetch();
    const allTagIds = [...new Set(links.map((l) => l.tag?.id ?? '').filter(Boolean))];
    if (allTagIds.length === 0) {
      const result: Record<string, Tag[]> = {};
      for (const id of outfitIds) result[id] = [];
      return result;
    }
    const tagModels = await this.collection
      .query(Q.where('id', Q.oneOf(allTagIds)))
      .fetch();
    const tagMap = new Map(tagModels.map((m) => [m.id, mapToTag(m)]));
    const result: Record<string, Tag[]> = {};
    for (const id of outfitIds) {
      const outfitTagIds = links
        .filter((l) => (l.outfit?.id ?? '') === id)
        .map((l) => l.tag?.id ?? '');
      result[id] = outfitTagIds.map((tid) => tagMap.get(tid)).filter(Boolean) as Tag[];
    }
    return result;
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
