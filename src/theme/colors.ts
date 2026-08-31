// Sage Atelier — Light mode palette
export const colors = {
  // Core palette
  background: '#EEF1EA',
  surface: '#FFFFFF',
  surfaceAlt: '#F7F8F4',
  border: '#DDE2D3',
  borderDashed: '#DDE2D3',

  // Text
  inkPrimary: '#2E2E2A',
  inkSecondary: '#6B6E63',
  inkMuted: '#A3A79A',

  // Accent
  accent: '#B9705F',
  accentPressed: '#9C5B4C',
  accentLight: '#D98A78',

  // Semantic
  destructive: '#C1392B',
  success: '#6E8F71',

  // Overlay
  overlay: 'rgba(44, 44, 44, 0.5)',

  // Legacy aliases (map old names → new values for backward compatibility)
  ink: '#2E2E2A',
  inkLight: '#6B6E63',
  paper: '#EEF1EA',
  paperDark: '#F7F8F4',
  accentDark: '#9C5B4C',
  error: '#C1392B',
  white: '#FFFFFF',
} as const;

export type ColorToken = keyof typeof colors;

// Article color enum → hex mapping (11 controlled colors)
export const ARTICLE_COLORS: Record<string, string> = {
  red: '#C1392B',
  orange: '#D4884A',
  yellow: '#C9B44A',
  green: '#6E8F71',
  blue: '#4A6FE8',
  indigo: '#5A4AE8',
  violet: '#8A4AE8',
  pink: '#D47098',
  white: '#F0EDE6',
  brown: '#8B6F47',
  black: '#2E2E2A',
};
