import { useState, useEffect, useCallback } from 'react';
import { UserSettings, ThemeMode } from '@/models/UserSettings';
import { useRepositories } from '@/providers/RepositoryProvider';

export function useSettings() {
  const { settingsRepository } = useRepositories();
  const [settings, setSettings] = useState<UserSettings>({
    wearHistoryEnabled: false,
    themeMode: 'system',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    settingsRepository.get().then((s) => {
      setSettings(s);
      setLoading(false);
    });
  }, [settingsRepository]);

  const toggleWearHistory = useCallback(async () => {
    const newValue = !settings.wearHistoryEnabled;
    await settingsRepository.update({ wearHistoryEnabled: newValue });
    setSettings((prev) => ({ ...prev, wearHistoryEnabled: newValue }));
  }, [settings, settingsRepository]);

  const setThemeMode = useCallback(async (mode: ThemeMode) => {
    await settingsRepository.update({ themeMode: mode });
    setSettings((prev) => ({ ...prev, themeMode: mode }));
  }, [settingsRepository]);

  return {
    settings,
    loading,
    toggleWearHistory,
    setThemeMode,
  };
}
