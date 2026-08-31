import { useState, useEffect, useCallback } from 'react';
import { UserSettings, ThemeMode } from '@/models/UserSettings';
import { useRepositories } from '@/providers/RepositoryProvider';
import { useTheme } from '@/providers/ThemeContext';

export function useSettings() {
  const { settingsRepository } = useRepositories();
  const { setThemeMode: setGlobalThemeMode } = useTheme();
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
    await setGlobalThemeMode(mode);
    setSettings((prev) => ({ ...prev, themeMode: mode }));
  }, [setGlobalThemeMode]);

  return {
    settings,
    loading,
    toggleWearHistory,
    setThemeMode,
  };
}
