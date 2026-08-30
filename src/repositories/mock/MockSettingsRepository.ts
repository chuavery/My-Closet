import { UserSettings } from '@/models/UserSettings';
import { SettingsRepository } from '@/repositories/interfaces/SettingsRepository';

let settings: UserSettings = {
  wearHistoryEnabled: false,
  themeMode: 'system',
};

export class MockSettingsRepository implements SettingsRepository {
  async get(): Promise<UserSettings> {
    return { ...settings };
  }

  async update(updates: Partial<UserSettings>): Promise<void> {
    settings = { ...settings, ...updates };
  }
}
