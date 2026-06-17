import React from 'react';
import { StyleSheet, View, ViewStyle, Platform, StyleProp } from 'react-native';
import { Theme } from '../constants/theme';

interface GlassCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  borderColor?: string;
  backgroundColor?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  style, 
  borderColor, 
  backgroundColor 
}) => {
  return (
    <View style={[
      styles.card, 
      backgroundColor ? { backgroundColor } : null,
      borderColor ? { borderColor } : null,
      style
    ]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Theme.colors.glassBackground,
    borderRadius: Theme.roundness.md,
    borderWidth: 1,
    borderColor: Theme.colors.glassBorder,
    padding: Theme.spacing.lg,
    marginVertical: Theme.spacing.sm,
    ...Platform.select({
      ios: {
        shadowColor: Theme.colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
      web: {
        backdropFilter: 'blur(16px)',
        shadowColor: Theme.colors.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
      }
    } as any),
  },
});
