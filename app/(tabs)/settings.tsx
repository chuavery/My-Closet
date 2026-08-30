import React from 'react';
import { View, Text, Switch, StyleSheet, Pressable } from 'react-native';
import { useSettings } from '@/viewmodels/useSettings';
import { useTheme } from '@/providers/ThemeContext';
import { ThemeMode } from '@/models/UserSettings';
import { colors as lightColors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing, borderRadius } from '@/theme/spacing';

const THEME_OPTIONS: { label: string; value: ThemeMode }[] = [
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' },
  { label: 'System', value: 'system' },
];

export default function SettingsScreen() {
  const { settings, loading, toggleWearHistory, setThemeMode } = useSettings();
  const { colors, isDark } = useTheme();

  if (loading) {
    return null;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.paper }]}>
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.inkLight }]}>Appearance</Text>
        <View style={[styles.row, { backgroundColor: colors.white, borderColor: colors.border }]}>
          <View style={styles.rowInfo}>
            <Text style={[styles.label, { color: colors.ink }]}>Theme</Text>
            <Text style={[styles.description, { color: colors.inkLight }]}>
              Choose light, dark, or follow system
            </Text>
          </View>
        </View>
        <View style={styles.themeChips}>
          {THEME_OPTIONS.map((opt) => {
            const isActive = settings.themeMode === opt.value;
            return (
              <Pressable
                key={opt.value}
                style={[
                  styles.themeChip,
                  {
                    backgroundColor: isActive ? colors.accent : colors.white,
                    borderColor: isActive ? colors.accent : colors.border,
                  },
                ]}
                onPress={() => setThemeMode(opt.value)}
              >
                <Text
                  style={[
                    styles.themeChipLabel,
                    { color: isActive ? lightColors.white : colors.ink },
                  ]}
                >
                  {opt.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.inkLight }]}>Wear Tracking</Text>
        <View style={[styles.row, { backgroundColor: colors.white, borderColor: colors.border }]}>
          <View style={styles.rowInfo}>
            <Text style={[styles.label, { color: colors.ink }]}>Wear History</Text>
            <Text style={[styles.description, { color: colors.inkLight }]}>
              Track how often you wear items
            </Text>
          </View>
          <Switch
            value={settings.wearHistoryEnabled}
            onValueChange={toggleWearHistory}
            trackColor={{ false: colors.border, true: colors.accentLight }}
            thumbColor={settings.wearHistoryEnabled ? colors.accent : lightColors.white}
          />
        </View>
      </View>
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.inkLight }]}>About</Text>
        <Text style={[styles.aboutText, { color: colors.inkLight }]}>My Closet v1.0</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
  },
  section: {
    marginBottom: spacing.xxxl,
  },
  sectionTitle: {
    ...typography.caption,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    borderWidth: 1,
  },
  rowInfo: {
    flex: 1,
    marginRight: spacing.lg,
  },
  label: {
    ...typography.body,
    fontWeight: '600',
  },
  description: {
    ...typography.bodySmall,
    marginTop: 2,
  },
  themeChips: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  themeChip: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.round,
    borderWidth: 1,
    alignItems: 'center',
  },
  themeChipLabel: {
    ...typography.buttonSmall,
  },
  aboutText: {
    ...typography.body,
  },
});
