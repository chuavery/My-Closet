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

let _database: Database | null = null;

export function getDatabase(): Database {
  if (!_database) {
    const adapter = new SQLiteAdapter({
      schema,
      jsi: false,
      onSetUpError: (error) => {
        console.error('Database setup error:', error);
      },
    });

    _database = new Database({
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
  }
  return _database;
}
