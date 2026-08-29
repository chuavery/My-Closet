import { useState, useEffect, useCallback } from 'react';
import { UserSettings } from '@/models/UserSettings';
import { useRepositories } from '@/providers/RepositoryProvider';

export function useSettings() {
  const { settingsRepository } = useRepositories();
  const [settings, setSettings] = useState<UserSettings>({
    wearHistoryEnabled: false,
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
    setSettings({ wearHistoryEnabled: newValue });
  }, [settings, settingsRepository]);

  return {
    settings,
    loading,
    toggleWearHistory,
  };
}
