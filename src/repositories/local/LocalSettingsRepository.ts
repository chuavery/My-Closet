import { UserSettings } from '@/models/UserSettings';
import { SettingsRepository } from '@/repositories/interfaces/SettingsRepository';
import { getDatabase } from '@/lib/watermelon/database';
import { UserSettingsModel } from '@/lib/watermelon/models/UserSettingsModel';

export class LocalSettingsRepository implements SettingsRepository {
  private get collection() {
    return getDatabase().get<UserSettingsModel>('user_settings');
  }

  async get(): Promise<UserSettings> {
    const models = await this.collection.query().fetch();
    if (models.length === 0) {
      const created = await this.collection.create((rec) => {
        rec.wearHistoryEnabled = false;
        rec.themeMode = 'system';
      });
      return { wearHistoryEnabled: created.wearHistoryEnabled, themeMode: created.themeMode as UserSettings['themeMode'] };
    }
    return {
      wearHistoryEnabled: models[0].wearHistoryEnabled,
      themeMode: (models[0].themeMode as UserSettings['themeMode']) ?? 'system',
    };
  }

  async update(updates: Partial<UserSettings>): Promise<void> {
    const models = await this.collection.query().fetch();
    if (models.length === 0) {
      await this.collection.create((rec) => {
        rec.wearHistoryEnabled = updates.wearHistoryEnabled ?? false;
        rec.themeMode = updates.themeMode ?? 'system';
      });
      return;
    }
    await models[0].update((rec) => {
      if (updates.wearHistoryEnabled !== undefined) {
        rec.wearHistoryEnabled = updates.wearHistoryEnabled;
      }
      if (updates.themeMode !== undefined) {
        rec.themeMode = updates.themeMode;
      }
    });
  }
}
