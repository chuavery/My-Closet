import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing, borderRadius } from '@/theme/spacing';

interface QRTileProps {
  value: string;
  label?: string;
}

export function QRTile({ value, label }: QRTileProps) {
  return (
    <View style={styles.container}>
      <View style={styles.qrPlaceholder}>
        <Text style={styles.qrText}>QR</Text>
      </View>
      {label && <Text style={styles.label}>{label}</Text>}
      <Text style={styles.value} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  qrPlaceholder: {
    width: 120,
    height: 120,
    backgroundColor: colors.paperDark,
    borderRadius: borderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  qrText: {
    ...typography.h2,
    color: colors.inkLight,
  },
  label: {
    ...typography.bodySmall,
    color: colors.ink,
    fontWeight: '600',
    marginBottom: 2,
  },
  value: {
    ...typography.caption,
    color: colors.inkLight,
  },
});
