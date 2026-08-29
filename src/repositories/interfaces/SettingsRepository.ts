import { UserSettings } from '@/models/UserSettings';

export interface SettingsRepository {
  get(): Promise<UserSettings>;
  update(updates: Partial<UserSettings>): Promise<void>;
}
