import { Tag, TagCategory } from '@/models/Tag';
import { TagRepository } from '@/repositories/interfaces/TagRepository';
import { sampleTags } from './fixtures/sampleTags';

let tags = [...sampleTags];

let articleTagLinks: { articleId: string; tagId: string }[] = [
  { articleId: 'art-001', tagId: 'tag-002' },
  { articleId: 'art-001', tagId: 'tag-003' },
  { articleId: 'art-005', tagId: 'tag-001' },
  { articleId: 'art-005', tagId: 'tag-006' },
  { articleId: 'art-006', tagId: 'tag-005' },
];

let outfitTagLinks: { outfitId: string; tagId: string }[] = [
  { outfitId: 'out-001', tagId: 'tag-002' },
  { outfitId: 'out-001', tagId: 'tag-003' },
  { outfitId: 'out-002', tagId: 'tag-001' },
];

export class MockTagRepository implements TagRepository {
  async getAll(): Promise<Tag[]> {
    return [...tags];
  }

  async getByCategory(category: TagCategory): Promise<Tag[]> {
    return tags.filter((t) => t.category === category);
  }

  async getById(id: string): Promise<Tag | null> {
    return tags.find((t) => t.id === id) ?? null;
  }

  async create(tag: Omit<Tag, 'id'>): Promise<Tag> {
    const newTag: Tag = {
      ...tag,
      id: `tag-${String(tags.length + 1).padStart(3, '0')}`,
    };
    tags.push(newTag);
    return newTag;
  }

  async delete(id: string): Promise<void> {
    tags = tags.filter((t) => t.id !== id);
    articleTagLinks = articleTagLinks.filter((l) => l.tagId !== id);
    outfitTagLinks = outfitTagLinks.filter((l) => l.tagId !== id);
  }

  async getTagsForArticle(articleId: string): Promise<Tag[]> {
    const tagIds = articleTagLinks
      .filter((l) => l.articleId === articleId)
      .map((l) => l.tagId);
    return tags.filter((t) => tagIds.includes(t.id));
  }

  async getTagsForOutfit(outfitId: string): Promise<Tag[]> {
    const tagIds = outfitTagLinks
      .filter((l) => l.outfitId === outfitId)
      .map((l) => l.tagId);
    return tags.filter((t) => tagIds.includes(t.id));
  }

  async addTagToArticle(articleId: string, tagId: string): Promise<void> {
    articleTagLinks.push({ articleId, tagId });
  }

  async removeTagFromArticle(articleId: string, tagId: string): Promise<void> {
    articleTagLinks = articleTagLinks.filter(
      (l) => !(l.articleId === articleId && l.tagId === tagId)
    );
  }

  async addTagToOutfit(outfitId: string, tagId: string): Promise<void> {
    outfitTagLinks.push({ outfitId, tagId });
  }

  async removeTagFromOutfit(outfitId: string, tagId: string): Promise<void> {
    outfitTagLinks = outfitTagLinks.filter(
      (l) => !(l.outfitId === outfitId && l.tagId === tagId)
    );
  }
}
