import { Platform } from 'react-native';

export const Theme = {
  colors: {
    primary: '#6D28D9',       // Cyber Purple
    secondary: '#312E81',     // Deep Indigo
    accent: '#06B6D4',        // Electric Cyan
    background: '#0B1120',    // Deep Space/Indigo-950
    card: '#111827',          // Dark Card Background
    cardBorder: '#1F2937',    // Card Border
    text: '#F8FAFC',          // Light slate text
    textMuted: '#94A3B8',     // Muted text
    success: '#10B981',       // Emerald success
    warning: '#F59E0B',       // Amber warning
    error: '#EF4444',         // Red error
    glassBackground: 'rgba(17, 24, 39, 0.75)', // Glassmorphism container
    glassBorder: 'rgba(99, 102, 241, 0.15)',   // Glassmorphism border
    gradientPrimary: ['#6D28D9', '#4F46E5'],
    gradientAccent: ['#06B6D4', '#0EA5E9'],
    gradientDark: ['#0B1120', '#111827'],
  },
  fonts: Platform.select({
    ios: {
      sans: 'system-ui',
      rounded: 'ui-rounded',
      mono: 'ui-monospace',
    },
    default: {
      sans: 'normal',
      rounded: 'normal',
      mono: 'monospace',
    },
  }),
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
  },
  roundness: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
  },
  shadow: {
    light: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    dark: {
      shadowColor: '#6D28D9',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 8,
      elevation: 5,
    },
  },
};

export const Colors = {
  light: {
    text: Theme.colors.text,
    background: Theme.colors.background,
    backgroundElement: Theme.colors.card,
    backgroundSelected: Theme.colors.secondary,
    textSecondary: Theme.colors.textMuted,
  },
  dark: {
    text: Theme.colors.text,
    background: Theme.colors.background,
    backgroundElement: Theme.colors.card,
    backgroundSelected: Theme.colors.secondary,
    textSecondary: Theme.colors.textMuted,
  },
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
