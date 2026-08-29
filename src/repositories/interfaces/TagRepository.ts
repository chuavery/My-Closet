import { Tag, TagCategory } from '@/models/Tag';

export interface TagRepository {
  getAll(): Promise<Tag[]>;
  getByCategory(category: TagCategory): Promise<Tag[]>;
  getById(id: string): Promise<Tag | null>;
  create(tag: Omit<Tag, 'id'>): Promise<Tag>;
  delete(id: string): Promise<void>;
  getTagsForArticle(articleId: string): Promise<Tag[]>;
  getTagsForOutfit(outfitId: string): Promise<Tag[]>;
  addTagToArticle(articleId: string, tagId: string): Promise<void>;
  removeTagFromArticle(articleId: string, tagId: string): Promise<void>;
  addTagToOutfit(outfitId: string, tagId: string): Promise<void>;
  removeTagFromOutfit(outfitId: string, tagId: string): Promise<void>;
}
