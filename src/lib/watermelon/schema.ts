import { appSchema, tableSchema } from '@nozbe/watermelondb';

export const schema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'articles',
      columns: [
        { name: 'name', type: 'string', isOptional: true },
        { name: 'brand', type: 'string', isOptional: true },
        { name: 'article_type', type: 'string' },
        { name: 'color', type: 'string' },
        { name: 'fabric_type', type: 'string', isOptional: true },
        { name: 'fit', type: 'string', isOptional: true },
        { name: 'size', type: 'string', isOptional: true },
        { name: 'original_image_url', type: 'string' },
        { name: 'processed_image_url', type: 'string', isOptional: true },
        { name: 'storage_space_id', type: 'string', isOptional: true, isIndexed: true },
        { name: 'source', type: 'string' },
        { name: 'wear_count', type: 'number' },
        { name: 'last_worn_at', type: 'string', isOptional: true },
        { name: 'created_at', type: 'string' },
      ],
    }),
    tableSchema({
      name: 'storage_spaces',
      columns: [
        { name: 'name', type: 'string' },
        { name: 'sub_location', type: 'string', isOptional: true },
        { name: 'qr_code_value', type: 'string' },
        { name: 'created_at', type: 'string' },
      ],
    }),
    tableSchema({
      name: 'outfits',
      columns: [
        { name: 'name', type: 'string' },
        { name: 'wear_count', type: 'number' },
        { name: 'last_worn_at', type: 'string', isOptional: true },
        { name: 'created_at', type: 'string' },
      ],
    }),
    tableSchema({
      name: 'outfit_articles',
      columns: [
        { name: 'outfit_id', type: 'string', isIndexed: true },
        { name: 'article_id', type: 'string', isIndexed: true },
        { name: 'layer_type', type: 'string' },
        { name: 'z_index', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'tags',
      columns: [
        { name: 'name', type: 'string' },
        { name: 'category', type: 'string' },
      ],
    }),
    tableSchema({
      name: 'article_tags',
      columns: [
        { name: 'article_id', type: 'string', isIndexed: true },
        { name: 'tag_id', type: 'string', isIndexed: true },
      ],
    }),
    tableSchema({
      name: 'outfit_tags',
      columns: [
        { name: 'outfit_id', type: 'string', isIndexed: true },
        { name: 'tag_id', type: 'string', isIndexed: true },
      ],
    }),
    tableSchema({
      name: 'wear_logs',
      columns: [
        { name: 'article_id', type: 'string', isOptional: true, isIndexed: true },
        { name: 'outfit_id', type: 'string', isOptional: true, isIndexed: true },
        { name: 'worn_date', type: 'string' },
        { name: 'created_at', type: 'string' },
      ],
    }),
    tableSchema({
      name: 'user_settings',
      columns: [
        { name: 'wear_history_enabled', type: 'boolean' },
      ],
    }),
  ],
});
