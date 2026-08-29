import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import { schema } from './schema';
import { ArticleModel } from './models/ArticleModel';
import { StorageSpaceModel } from './models/StorageSpaceModel';
import { OutfitModel } from './models/OutfitModel';
import { OutfitArticleModel } from './models/OutfitArticleModel';
import { TagModel } from './models/TagModel';
import { ArticleTagModel } from './models/ArticleTagModel';
import { OutfitTagModel } from './models/OutfitTagModel';
import { WearLogModel } from './models/WearLogModel';
import { UserSettingsModel } from './models/UserSettingsModel';

const adapter = new SQLiteAdapter({
  schema,
  jsi: true,
  onSetUpError: (error) => {
    console.error('Database setup error:', error);
  },
});

export const database = new Database({
  adapter,
  modelClasses: [
    ArticleModel,
    StorageSpaceModel,
    OutfitModel,
    OutfitArticleModel,
    TagModel,
    ArticleTagModel,
    OutfitTagModel,
    WearLogModel,
    UserSettingsModel,
  ],
});
