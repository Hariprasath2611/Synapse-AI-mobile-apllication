import React from 'react';
import { DarkTheme, ThemeProvider, router } from 'expo-router';
import { useColorScheme } from 'react-native';
import { Provider as ReduxProvider, useSelector } from 'react-redux';
import { Provider as PaperProvider } from 'react-native-paper';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';
import { store, RootState } from '@/store';

const queryClient = new QueryClient();

function NavigationWrapper() {
  const { isOnboarded } = useSelector((state: RootState) => state.auth);

  React.useEffect(() => {
    // If onboarding is not completed, route to onboarding screen on mount
    if (!isOnboarded) {
      router.replace('/onboarding' as any);
    }
  }, [isOnboarded]);

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
    <ThemeProvider value={CustomDarkTheme}>
      <AnimatedSplashOverlay />
      <AppTabs />
    </ThemeProvider>
  );
}

export default function TabLayout() {
  return (
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>
        <PaperProvider>
          <NavigationWrapper />
        </PaperProvider>
      </QueryClientProvider>
    </ReduxProvider>
  );
}
