import React from 'react';
import { StyleSheet, View, ScrollView, Pressable, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { useSelector, useDispatch } from 'react-redux';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { GlassCard } from '@/components/GlassCard';
import { RootState, toggleBookmark, createConversation } from '@/store';
import { Spacing, Theme } from '@/constants/theme';
import { ChevronLeft, Star, Bookmark, MessageSquare, Play, HelpCircle, FileText, Settings } from 'lucide-react-native';

export default function AgentProfileScreen() {
  const dispatch = useDispatch();
  const { id } = useLocalSearchParams();
  const { agents } = useSelector((state: RootState) => state.agents);
  
  const agent = agents.find(a => a.id === id);

  if (!agent) {
    return (
      <ThemedView style={styles.container}>
        <SafeAreaView style={styles.errorContainer}>
          <ActivityIndicator size="large" color={Theme.colors.primary} />
          <ThemedText style={{ marginTop: Spacing.md }}>Locating Agent Profile Node...</ThemedText>
        </SafeAreaView>
      </ThemedView>
    );
  }

  const handleLaunchChat = () => {
    // Generate new conversation if not already existing
    const conversationId = `conv_${agent.id}`;
    dispatch(createConversation({
      id: conversationId,
      agentId: agent.id,
      agentName: agent.name,
      agentAvatar: agent.avatar,
      lastMessage: 'Chat initialized with agent node.',
      unreadCount: 0,
      updatedAt: 'Just now',
    }));

    router.push({ pathname: '/chat/[id]', params: { id: agent.id } } as any);
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Custom Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.headerButton}>
            <ChevronLeft size={20} color={Theme.colors.text} />
          </Pressable>
          <ThemedText style={styles.headerTitle}>Agent Specification</ThemedText>
          <Pressable onPress={() => dispatch(toggleBookmark(agent.id))} style={styles.headerButton}>
            <Bookmark 
              size={20} 
              color={agent.isBookmarked ? Theme.colors.accent : Theme.colors.text} 
              fill={agent.isBookmarked ? Theme.colors.accent : 'transparent'}
            />
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Summary Card */}
          <GlassCard style={styles.agentHeaderCard} borderColor="rgba(6, 182, 212, 0.2)">
            <View style={styles.topInfo}>
              <Image source={{ uri: agent.avatar }} style={styles.avatar} />
              <View style={{ flex: 1, marginLeft: Spacing.md }}>
                <ThemedText style={styles.name}>{agent.name}</ThemedText>
                <ThemedText style={styles.creator}>Created by {agent.creatorName}</ThemedText>
                <View style={styles.categoryBadge}>
                  <ThemedText style={styles.categoryText}>{agent.category}</ThemedText>
                </View>
              </View>
            </View>

            {/* Performance metrics row */}
            <View style={styles.metricsRow}>
              <View style={styles.metricItem}>
                <Star size={14} color="#F59E0B" fill="#F59E0B" />
                <ThemedText style={styles.metricVal}>{agent.rating}</ThemedText>
                <ThemedText style={styles.metricLabel}>{agent.reviewsCount} reviews</ThemedText>
              </View>
              
              <View style={styles.metricItem}>
                <Play size={14} color={Theme.colors.accent} />
                <ThemedText style={styles.metricVal}>{(agent.usageCount / 1000).toFixed(1)}k</ThemedText>
                <ThemedText style={styles.metricLabel}>runs executed</ThemedText>
              </View>

              <View style={styles.metricItem}>
                <Settings size={14} color={Theme.colors.primary} />
                <ThemedText style={styles.metricVal}>v{agent.version}</ThemedText>
                <ThemedText style={styles.metricLabel}>latest spec</ThemedText>
              </View>
            </View>
          </GlassCard>

          {/* Launch Buttons */}
          <View style={styles.buttonRow}>
            <Pressable style={styles.primaryButton} onPress={handleLaunchChat}>
              <MessageSquare size={18} color="#0B1120" style={{ marginRight: 6 }} />
              <ThemedText style={styles.primaryButtonText}>Initialize Chat Session</ThemedText>
            </Pressable>
          </View>

          {/* Description */}
          <ThemedText style={styles.sectionTitle}>Overview</ThemedText>
          <GlassCard>
            <ThemedText style={styles.bodyText}>{agent.description}</ThemedText>
          </GlassCard>

          {/* Capabilities */}
          <ThemedText style={styles.sectionTitle}>Capabilities & Skills</ThemedText>
          <View style={styles.capabilitiesContainer}>
            {agent.capabilities.map((cap, index) => (
              <GlassCard key={index} style={styles.capabilityItem} borderColor="rgba(109, 40, 217, 0.15)">
                <Cpu size={16} color={Theme.colors.primary} style={{ marginRight: Spacing.sm }} />
                <ThemedText style={styles.capabilityText}>{cap}</ThemedText>
              </GlassCard>
            ))}
          </View>

          {/* Knowledge Bases */}
          <ThemedText style={styles.sectionTitle}>Reference Knowledge Bases</ThemedText>
          {agent.knowledgeBases.length === 0 ? (
            <GlassCard>
              <ThemedText style={styles.bodyTextMuted}>No external document databases connected.</ThemedText>
            </GlassCard>
          ) : (
            agent.knowledgeBases.map((kb, index) => (
              <GlassCard key={index} style={styles.kbItem}>
                <FileText size={18} color={Theme.colors.accent} style={{ marginRight: Spacing.md }} />
                <View style={{ flex: 1 }}>
                  <ThemedText style={styles.kbName}>{kb}</ThemedText>
                  <ThemedText style={styles.kbType}>Vector Database Sync Active</ThemedText>
                </View>
              </GlassCard>
            ))
          )}

          {/* Pricing Model */}
          <ThemedText style={styles.sectionTitle}>Access Configuration</ThemedText>
          <GlassCard style={styles.priceCard} borderColor="rgba(245, 158, 11, 0.2)">
            <View style={styles.priceHeader}>
              <ThemedText style={styles.priceLabel}>Usage License Rate</ThemedText>
              <ThemedText style={styles.priceValue}>
                {agent.price === 0 ? 'Free Open Access' : `$${agent.price} / Month`}
              </ThemedText>
            </View>
            <ThemedText style={styles.priceDesc}>
              {agent.price === 0 
                ? 'Free tiers allow standard API calling cycles with shared rate throttling.'
                : 'Subscribing unlocks maximum token context size, custom memory databases, and zero-throttling API limits.'
              }
            </ThemedText>
          </GlassCard>

          <View style={{ height: 40 }} />
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  headerButton: {
    padding: Spacing.sm,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Theme.colors.text,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
  agentHeaderCard: {
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  topInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: Theme.roundness.md,
    backgroundColor: Theme.colors.card,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Theme.colors.text,
  },
  creator: {
    fontSize: 12,
    color: Theme.colors.textMuted,
    marginTop: 2,
  },
  categoryBadge: {
    backgroundColor: 'rgba(6, 182, 212, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Theme.roundness.sm,
    alignSelf: 'flex-start',
    marginTop: Spacing.sm,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: Theme.colors.accent,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.xl,
    borderTopWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    paddingTop: Spacing.lg,
  },
  metricItem: {
    alignItems: 'center',
    flex: 1,
  },
  metricVal: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Theme.colors.text,
    marginTop: 4,
  },
  metricLabel: {
    fontSize: 10,
    color: Theme.colors.textMuted,
    marginTop: 2,
  },
  buttonRow: {
    marginVertical: Spacing.md,
  },
  primaryButton: {
    backgroundColor: Theme.colors.accent,
    borderRadius: Theme.roundness.md,
    paddingVertical: Spacing.md,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0B1120',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Theme.colors.text,
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
  },
  bodyText: {
    fontSize: 13,
    color: Theme.colors.textMuted,
    lineHeight: 20,
  },
  bodyTextMuted: {
    fontSize: 13,
    color: Theme.colors.textMuted,
    fontStyle: 'italic',
  },
  capabilitiesContainer: {
    gap: Spacing.xs,
  },
  capabilityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    marginVertical: 0,
  },
  capabilityText: {
    fontSize: 13,
    color: Theme.colors.text,
  },
  kbItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
  },
  kbName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Theme.colors.text,
  },
  kbType: {
    fontSize: 11,
    color: Theme.colors.textMuted,
    marginTop: 2,
  },
  priceCard: {
    padding: Spacing.lg,
  },
  priceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  priceLabel: {
    fontSize: 11,
    color: Theme.colors.textMuted,
  },
  priceValue: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Theme.colors.accent,
  },
  priceDesc: {
    fontSize: 12,
    color: Theme.colors.textMuted,
    lineHeight: 18,
  },
});
