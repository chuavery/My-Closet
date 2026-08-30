import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { useRepositories } from '@/providers/RepositoryProvider';
import { ThemeMode } from '@/models/UserSettings';
import { colors as lightColors } from '@/theme/colors';
import { darkColors } from '@/theme/darkColors';

type ThemeColors = typeof lightColors;

interface ThemeContextValue {
  isDark: boolean;
  colors: ThemeColors;
}

const ThemeContext = createContext<ThemeContextValue>({
  isDark: false,
  colors: lightColors,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { settingsRepository } = useRepositories();
  const systemScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState<ThemeMode>('system');

  useEffect(() => {
    settingsRepository.get().then((s) => {
      setThemeMode(s.themeMode);
    });
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
    }),
    [isDark]
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
