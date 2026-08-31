import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useTheme } from '@/providers/ThemeContext';
import { typography } from '@/theme/typography';
import { spacing, borderRadius } from '@/theme/spacing';

interface QRTileProps {
  value: string;
  label?: string;
}

export function QRTile({ value, label }: QRTileProps) {
  const { colors } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={[styles.qrWrapper, { backgroundColor: colors.surface }]}>
        <QRCode
          value={value}
          size={160}
          color={colors.inkPrimary}
          backgroundColor={colors.surface}
        />
      </View>
      {label && <Text style={[styles.label, { color: colors.inkPrimary }]}>{label}</Text>}
      <Text style={[styles.value, { color: colors.inkSecondary }]} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
  },
  qrWrapper: {
    padding: spacing.md,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.sm,
  },
  label: {
    ...typography.bodySmall,
    fontWeight: '600',
    marginBottom: 2,
  },
  value: {
    ...typography.caption,
  },
});
