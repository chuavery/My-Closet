import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
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
      <View style={styles.qrWrapper}>
        <QRCode
          value={value}
          size={160}
          color={colors.ink}
          backgroundColor={colors.white}
        />
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
  qrWrapper: {
    padding: spacing.md,
    backgroundColor: colors.white,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.sm,
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
