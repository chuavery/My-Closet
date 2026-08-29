export type TagCategory = 'theme_occasion' | 'custom';

export interface Tag {
  id: string;
  name: string;
  category: TagCategory;
}
