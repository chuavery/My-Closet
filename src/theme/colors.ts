export const colors = {
  ink: '#2C2C2C',
  inkLight: '#6B6B6B',
  paper: '#F5F0E8',
  paperDark: '#E8E0D4',
  accent: '#C45B3E',
  accentLight: '#E8826A',
  accentDark: '#9E3E24',
  border: '#D4CFC6',
  borderDashed: '#B8B0A4',
  success: '#5A8F6A',
  error: '#C44B3E',
  white: '#FFFFFF',
  overlay: 'rgba(44, 44, 44, 0.5)',
} as const;

export type ColorToken = keyof typeof colors;
