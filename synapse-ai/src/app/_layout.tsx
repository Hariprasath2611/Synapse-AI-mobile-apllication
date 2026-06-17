import React from 'react';
import { DarkTheme, ThemeProvider } from 'expo-router';
import { useColorScheme } from 'react-native';
import { Provider as ReduxProvider } from 'react-redux';
import { Provider as PaperProvider } from 'react-native-paper';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';
import { store } from '@/store';

const queryClient = new QueryClient();

export default function TabLayout() {
  const colorScheme = useColorScheme();
  
  // Custom Dark Theme matching our Brand Design System
  const CustomDarkTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      primary: '#6D28D9',      // Cyber Purple
      background: '#0B1120',   // Deep Indigo Background
      card: '#111827',         // Dark Card
      text: '#F8FAFC',         // White slate text
      border: '#1F2937',       // Dark Grey border
      notification: '#06B6D4', // Electric Cyan
    },
  };

  return (
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>
        <PaperProvider>
          <ThemeProvider value={CustomDarkTheme}>
            <AnimatedSplashOverlay />
            <AppTabs />
          </ThemeProvider>
        </PaperProvider>
      </QueryClientProvider>
    </ReduxProvider>
  );
}
