import React from 'react';
import { StyleSheet, View, ScrollView, Pressable, Image, Platform, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { router } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { GlassCard } from '@/components/GlassCard';
import { RootState, toggleBookmark } from '@/store';
import { BottomTabInset, MaxContentWidth, Spacing, Theme } from '@/constants/theme';
import { Sparkles, Bot, MessageSquare, Zap, Cpu, TrendingUp, User, Bookmark } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { agents } = useSelector((state: RootState) => state.agents);
  const { conversations } = useSelector((state: RootState) => state.chat);

  const trendingAgents = agents.slice(0, 3);
  const recentChats = conversations.slice(0, 3);

  const handleCreateAgent = () => {
    // We will simulate routing to builder by shifting active view or pushing route
    router.push('/builder' as any);
  };

  const handleWorkflowBuilder = () => {
    router.push('/workflow' as any);
  };

  const handleKnowledgeBase = () => {
    router.push('/knowledge' as any);
  };

  const handleTeamWorkspace = () => {
    router.push('/team' as any);
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View>
              <ThemedText style={styles.welcomeText}>Welcome back,</ThemedText>
              <ThemedText style={styles.usernameText}>{user?.name || 'Developer'}</ThemedText>
            </View>
            <Pressable onPress={() => router.push('/profile' as any)} style={styles.avatarWrapper}>
              <View style={styles.avatarPlaceholder}>
                <User color={Theme.colors.accent} size={20} />
              </View>
            </Pressable>
          </View>

          {/* Banner Insight */}
          <GlassCard style={styles.insightBanner} borderColor="rgba(6, 182, 212, 0.4)">
            <View style={styles.insightRow}>
              <Cpu color={Theme.colors.accent} size={28} style={styles.insightIcon} />
              <View style={{ flex: 1 }}>
                <ThemedText style={styles.insightTitle}>Synapse Neural Engine</ThemedText>
                <ThemedText style={styles.insightDesc}>
                  DevOps Architect is seeing 40% higher traffic today. We recommend training its knowledge base with your latest repo schemas.
                </ThemedText>
              </View>
            </View>
          </GlassCard>

          {/* Quick Actions */}
          <ThemedText style={styles.sectionTitle}>Quick Actions</ThemedText>
          <View style={styles.actionsGrid}>
            <Pressable style={styles.actionCard} onPress={handleCreateAgent}>
              <GlassCard style={styles.actionInner}>
                <Bot color={Theme.colors.primary} size={24} />
                <ThemedText style={styles.actionText}>Build Agent</ThemedText>
              </GlassCard>
            </Pressable>
            <Pressable style={styles.actionCard} onPress={handleWorkflowBuilder}>
              <GlassCard style={styles.actionInner}>
                <Zap color={Theme.colors.accent} size={24} />
                <ThemedText style={styles.actionText}>Workflows</ThemedText>
              </GlassCard>
            </Pressable>
            <Pressable style={styles.actionCard} onPress={handleKnowledgeBase}>
              <GlassCard style={styles.actionInner}>
                <Sparkles color="#F59E0B" size={24} />
                <ThemedText style={styles.actionText}>Knowledge</ThemedText>
              </GlassCard>
            </Pressable>
            <Pressable style={styles.actionCard} onPress={handleTeamWorkspace}>
              <GlassCard style={styles.actionInner}>
                <TrendingUp color="#10B981" size={24} />
                <ThemedText style={styles.actionText}>Teams</ThemedText>
              </GlassCard>
            </Pressable>
          </View>

          {/* Trending Agents */}
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>Trending Agents</ThemedText>
            <Pressable onPress={() => router.push('/marketplace' as any)}>
              <ThemedText style={styles.seeAllText}>See All</ThemedText>
            </Pressable>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
            {trendingAgents.map((agent) => (
              <GlassCard key={agent.id} style={styles.agentCard}>
                <View style={styles.agentHeader}>
                  <Image source={{ uri: agent.avatar }} style={styles.agentAvatar} />
                  <View style={{ flex: 1, marginLeft: Spacing.sm }}>
                    <ThemedText style={styles.agentName} numberOfLines={1}>{agent.name}</ThemedText>
                    <ThemedText style={styles.agentCreator}>by {agent.creatorName}</ThemedText>
                  </View>
                  <Pressable onPress={() => dispatch(toggleBookmark(agent.id))}>
                    <Bookmark 
                      size={18} 
                      color={agent.isBookmarked ? Theme.colors.accent : Theme.colors.textMuted} 
                      fill={agent.isBookmarked ? Theme.colors.accent : 'transparent'}
                    />
                  </Pressable>
                </View>
                <ThemedText style={styles.agentDesc} numberOfLines={2}>
                  {agent.description}
                </ThemedText>
                <View style={styles.agentFooter}>
                  <View style={styles.badge}>
                    <ThemedText style={styles.badgeText}>{agent.category}</ThemedText>
                  </View>
                  <ThemedText style={styles.priceText}>
                    {agent.price === 0 ? 'Free' : `$${agent.price}/mo`}
                  </ThemedText>
                </View>
                <Pressable 
                  style={styles.chatButton} 
                  onPress={() => router.push({ pathname: '/chat/[id]', params: { id: agent.id } } as any)}
                >
                  <MessageSquare size={16} color="#0B1120" style={{ marginRight: 4 }} />
                  <ThemedText style={styles.chatButtonText}>Chat Agent</ThemedText>
                </Pressable>
              </GlassCard>
            ))}
          </ScrollView>

          {/* Recent Conversations */}
          <ThemedText style={styles.sectionTitle}>Recent Conversations</ThemedText>
          {recentChats.length === 0 ? (
            <GlassCard style={styles.emptyCard}>
              <ThemedText style={styles.emptyText}>No recent chats. Head to the marketplace to get started!</ThemedText>
            </GlassCard>
          ) : (
            recentChats.map((chat) => (
              <Pressable 
                key={chat.id} 
                onPress={() => router.push({ pathname: '/chat/[id]', params: { id: chat.agentId } } as any)}
              >
                <GlassCard style={styles.conversationCard}>
                  <View style={styles.convHeader}>
                    <Image source={{ uri: chat.agentAvatar }} style={styles.convAvatar} />
                    <View style={{ flex: 1, marginLeft: Spacing.md }}>
                      <View style={styles.convTitleRow}>
                        <ThemedText style={styles.convName}>{chat.agentName}</ThemedText>
                        <ThemedText style={styles.convTime}>{chat.updatedAt}</ThemedText>
                      </View>
                      <ThemedText style={styles.convMessage} numberOfLines={1}>{chat.lastMessage}</ThemedText>
                    </View>
                  </View>
                </GlassCard>
              </Pressable>
            ))
          )}
          
          <View style={{ height: BottomTabInset + 20 }} />
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
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  welcomeText: {
    fontSize: 14,
    color: Theme.colors.textMuted,
  },
  usernameText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Theme.colors.text,
  },
  avatarWrapper: {
    borderRadius: Theme.roundness.full,
    padding: 2,
    borderWidth: 1.5,
    borderColor: Theme.colors.accent,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: Theme.roundness.full,
    backgroundColor: Theme.colors.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  insightBanner: {
    marginBottom: Spacing.lg,
    backgroundColor: 'rgba(6, 182, 212, 0.08)',
  },
  insightRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  insightIcon: {
    marginRight: Spacing.md,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Theme.colors.accent,
    marginBottom: 4,
  },
  insightDesc: {
    fontSize: 12,
    color: Theme.colors.textMuted,
    lineHeight: 18,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Theme.colors.text,
    marginTop: Spacing.md,
    marginBottom: Spacing.md,
  },
  seeAllText: {
    fontSize: 14,
    color: Theme.colors.accent,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -Spacing.xs,
  },
  actionCard: {
    width: '50%',
    paddingHorizontal: Spacing.xs,
  },
  actionInner: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.lg,
    marginVertical: Spacing.xs,
  },
  actionText: {
    marginTop: Spacing.sm,
    fontSize: 13,
    fontWeight: '600',
    color: Theme.colors.text,
  },
  horizontalScroll: {
    marginHorizontal: -Spacing.lg,
    paddingLeft: Spacing.lg,
    marginBottom: Spacing.md,
  },
  agentCard: {
    width: width * 0.75,
    marginRight: Spacing.md,
    maxWidth: 320,
  },
  agentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  agentAvatar: {
    width: 44,
    height: 44,
    borderRadius: Theme.roundness.md,
    backgroundColor: Theme.colors.card,
  },
  agentName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Theme.colors.text,
  },
  agentCreator: {
    fontSize: 12,
    color: Theme.colors.textMuted,
  },
  agentDesc: {
    fontSize: 12,
    color: Theme.colors.textMuted,
    height: 36,
    lineHeight: 18,
    marginBottom: Spacing.sm,
  },
  agentFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  badge: {
    backgroundColor: 'rgba(109, 40, 217, 0.25)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Theme.roundness.sm,
    borderWidth: 0.5,
    borderColor: Theme.colors.primary,
  },
  badgeText: {
    fontSize: 10,
    color: '#A78BFA',
    fontWeight: '600',
  },
  priceText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Theme.colors.accent,
  },
  chatButton: {
    backgroundColor: Theme.colors.accent,
    borderRadius: Theme.roundness.md,
    paddingVertical: Spacing.sm,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatButtonText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#0B1120',
  },
  conversationCard: {
    padding: Spacing.md,
    marginVertical: Spacing.xs,
  },
  convHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  convAvatar: {
    width: 40,
    height: 40,
    borderRadius: Theme.roundness.full,
    backgroundColor: Theme.colors.card,
  },
  convTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  convName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Theme.colors.text,
  },
  convTime: {
    fontSize: 11,
    color: Theme.colors.textMuted,
  },
  convMessage: {
    fontSize: 12,
    color: Theme.colors.textMuted,
    marginTop: 4,
  },
  emptyCard: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xl,
  },
  emptyText: {
    fontSize: 13,
    color: Theme.colors.textMuted,
    textAlign: 'center',
  },
});
