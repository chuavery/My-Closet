import { TextStyle } from 'react-native';

export const typography: Record<string, TextStyle> = {
  h1: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
    lineHeight: 34,
  },
  h2: {
    fontSize: 22,
    fontWeight: '600',
    letterSpacing: -0.3,
    lineHeight: 28,
  },
  h3: {
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0,
    lineHeight: 24,
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
    letterSpacing: 0.1,
    lineHeight: 22,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: '400',
    letterSpacing: 0.1,
    lineHeight: 18,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400',
    letterSpacing: 0.2,
    lineHeight: 16,
  },
  button: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.3,
    lineHeight: 20,
  },
  buttonSmall: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.3,
    lineHeight: 18,
  },
};
