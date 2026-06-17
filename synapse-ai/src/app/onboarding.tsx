import React from 'react';
import { StyleSheet, View, Pressable, ScrollView, Dimensions, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import { router } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { GlassCard } from '@/components/GlassCard';
import { setOnboarded } from '@/store';
import { Spacing, Theme } from '@/constants/theme';
import { Bot, Zap, Coins, Sparkles, ChevronRight, Check } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    title: 'Synapse AI Ecosystem',
    desc: 'Create, train, deploy, and monetize custom AI agent nodes directly from your mobile device.',
    icon: <Bot size={54} color={Theme.colors.accent} />,
  },
  {
    title: 'Automated Workflows',
    desc: 'Chain multiple agent nodes together to automate complex data tasks and qualifications.',
    icon: <Zap size={54} color={Theme.colors.primary} />,
  },
  {
    title: 'Monetize Creations',
    desc: 'Publish your specialized agents to the public marketplace and earn recurring monthly subscription payouts.',
    icon: <Coins size={54} color="#F59E0B" />,
  }
];

export default function OnboardingScreen() {
  const dispatch = useDispatch();
  const [slideIndex, setSlideIndex] = React.useState(0);
  const [selectedInterests, setSelectedInterests] = React.useState<string[]>([]);

  const interestsList = ['Coding', 'Marketing', 'Business', 'Legal', 'Fitness', 'Finance', 'Healthcare', 'Research'];

  const handleNext = () => {
    if (slideIndex < SLIDES.length) {
      setSlideIndex(prev => prev + 1);
    } else {
      // Completed interests setup, finish onboarding
      dispatch(setOnboarded(true));
      router.replace('/' as any);
    }
  };

  const handleToggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(prev => prev.filter(i => i !== interest));
    } else {
      setSelectedInterests(prev => [...prev, interest]);
    }
  };

  const renderInterestsPage = () => {
    return (
      <View style={styles.interestsContainer}>
        <Sparkles size={44} color={Theme.colors.accent} style={{ marginBottom: Spacing.md }} />
        <ThemedText style={styles.title}>Tailor Your Workspace</ThemedText>
        <ThemedText style={styles.desc}>Select the AI Agent categories you are interested in exploring.</ThemedText>
        
        <View style={styles.interestsGrid}>
          {interestsList.map((interest) => {
            const isSelected = selectedInterests.includes(interest);
            return (
              <Pressable
                key={interest}
                style={[
                  styles.interestBadge,
                  isSelected && styles.interestBadgeSelected
                ]}
                onPress={() => handleToggleInterest(interest)}
              >
                <ThemedText style={[
                  styles.interestBadgeText,
                  isSelected && styles.interestBadgeTextSelected
                ]}>
                  {interest}
                </ThemedText>
              </Pressable>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent} scrollEnabled={false}>
          {slideIndex < SLIDES.length ? (
            <View style={styles.slideContainer}>
              <View style={styles.iconWrapper}>
                {SLIDES[slideIndex].icon}
              </View>
              <ThemedText style={styles.title}>{SLIDES[slideIndex].title}</ThemedText>
              <ThemedText style={styles.desc}>{SLIDES[slideIndex].desc}</ThemedText>
              
              {/* Pagination Dots */}
              <View style={styles.dotsRow}>
                {SLIDES.map((_, index) => (
                  <View 
                    key={index} 
                    style={[
                      styles.dot, 
                      slideIndex === index && styles.activeDot
                    ]} 
                  />
                ))}
                <View style={styles.dot} />
              </View>
            </View>
          ) : (
            renderInterestsPage()
          )}

          {/* Action button */}
          <Pressable style={styles.nextBtn} onPress={handleNext}>
            <ThemedText style={styles.nextBtnText}>
              {slideIndex === SLIDES.length ? 'Get Started' : 'Next Step'}
            </ThemedText>
            {slideIndex === SLIDES.length ? (
              <Check size={16} color="#0B1120" style={{ marginLeft: 6 }} />
            ) : (
              <ChevronRight size={16} color="#0B1120" style={{ marginLeft: 6 }} />
            )}
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  slideContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  iconWrapper: {
    width: 120,
    height: 120,
    borderRadius: Theme.roundness.xl,
    backgroundColor: 'rgba(255,255,255,0.03)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    marginBottom: Spacing.xxl,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Theme.colors.text,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  desc: {
    fontSize: 14,
    color: Theme.colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.xl,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: Spacing.xl,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  activeDot: {
    backgroundColor: Theme.colors.accent,
    width: 20,
  },
  interestsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  interestsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.lg,
    paddingHorizontal: Spacing.sm,
  },
  interestBadge: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: Theme.roundness.full,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  interestBadgeSelected: {
    backgroundColor: Theme.colors.primary,
    borderColor: Theme.colors.primary,
  },
  interestBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: Theme.colors.textMuted,
  },
  interestBadgeTextSelected: {
    color: Theme.colors.text,
  },
  nextBtn: {
    backgroundColor: Theme.colors.accent,
    borderRadius: Theme.roundness.md,
    width: '100%',
    paddingVertical: Spacing.md,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  nextBtnText: {
    color: '#0B1120',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
