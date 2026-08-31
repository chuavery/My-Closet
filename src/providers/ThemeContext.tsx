import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { useColorScheme } from 'react-native';
import { useRepositories } from '@/providers/RepositoryProvider';
import { ThemeMode } from '@/models/UserSettings';
import { colors as lightColors } from '@/theme/colors';
import { darkColors } from '@/theme/darkColors';

type ThemeColors = typeof lightColors;

interface ThemeContextValue {
  isDark: boolean;
  colors: ThemeColors;
  setThemeMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  isDark: false,
  colors: lightColors,
  setThemeMode: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { settingsRepository } = useRepositories();
  const systemScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');

  useEffect(() => {
    settingsRepository.get().then((s) => {
      setThemeModeState(s.themeMode);
    });
  }, [settingsRepository]);

  const setThemeMode = useCallback(async (mode: ThemeMode) => {
    setThemeModeState(mode);
    await settingsRepository.update({ themeMode: mode });
  }, [settingsRepository]);

  const isDark = useMemo(() => {
    if (themeMode === 'light') return false;
    if (themeMode === 'dark') return true;
    return systemScheme === 'dark';
  }, [themeMode, systemScheme]);

  const value = useMemo(
    () => ({
      isDark,
      colors: (isDark ? darkColors : lightColors) as ThemeColors,
      setThemeMode,
    }),
    [isDark, setThemeMode]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return ctx;
}
