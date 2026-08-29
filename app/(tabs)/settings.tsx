import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { useSettings } from '@/viewmodels/useSettings';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing } from '@/theme/spacing';

export default function SettingsScreen() {
  const { settings, loading, toggleWearHistory } = useSettings();

  if (loading) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Wear Tracking</Text>
        <View style={styles.row}>
          <View style={styles.rowInfo}>
            <Text style={styles.label}>Wear History</Text>
            <Text style={styles.description}>
              Track how often you wear items
            </Text>
          </View>
          <Switch
            value={settings.wearHistoryEnabled}
            onValueChange={toggleWearHistory}
            trackColor={{ false: colors.border, true: colors.accentLight }}
            thumbColor={settings.wearHistoryEnabled ? colors.accent : colors.white}
          />
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.aboutText}>My Closet v1.0</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.paper,
    padding: spacing.lg,
  },
  section: {
    marginBottom: spacing.xxxl,
  },
  sectionTitle: {
    ...typography.caption,
    color: colors.inkLight,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  rowInfo: {
    flex: 1,
    marginRight: spacing.lg,
  },
  label: {
    ...typography.body,
    color: colors.ink,
    fontWeight: '600',
  },
  description: {
    ...typography.bodySmall,
    color: colors.inkLight,
    marginTop: 2,
  },
  aboutText: {
    ...typography.body,
    color: colors.inkLight,
  },
});
