import React from 'react';
import { StyleSheet, View, ScrollView, TextInput, Pressable, Image, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { router } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { GlassCard } from '@/components/GlassCard';
import { RootState, togglePin, clearUnread } from '@/store';
import { BottomTabInset, Spacing, Theme } from '@/constants/theme';
import { Search, Pin, MessageSquare, Plus } from 'lucide-react-native';

export default function ChatListScreen() {
  const dispatch = useDispatch();
  const { conversations } = useSelector((state: RootState) => state.chat);
  const [search, setSearch] = React.useState('');

  const filteredConversations = conversations.filter((c: any) => 
    c.agentName.toLowerCase().includes(search.toLowerCase()) ||
    c.lastMessage.toLowerCase().includes(search.toLowerCase())
  );

  // Separate pinned vs standard
  const pinnedConvs = filteredConversations.filter((c: any) => c.pinned);
  const standardConvs = filteredConversations.filter((c: any) => !c.pinned);
  const sortedConversations = [...pinnedConvs, ...standardConvs];

  const handleChatPress = (agentId: string, convId: string) => {
    dispatch(clearUnread(convId));
    router.push({ pathname: '/chat/[id]', params: { id: agentId } } as any);
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <ThemedText style={styles.titleText}>Conversations</ThemedText>
          <Pressable 
            style={styles.newChatButton} 
            onPress={() => router.push('/marketplace' as any)}
          >
            <Plus size={16} color="#0B1120" />
            <ThemedText style={styles.newChatText}>New Chat</ThemedText>
          </Pressable>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={18} color={Theme.colors.textMuted} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search conversations..."
              placeholderTextColor={Theme.colors.textMuted}
              value={search}
              onChangeText={setSearch}
            />
          </View>
        </View>

        {/* Conversations List */}
        {sortedConversations.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MessageSquare size={44} color={Theme.colors.textMuted} style={{ marginBottom: 12 }} />
            <ThemedText style={styles.emptyTitle}>No Conversations Yet</ThemedText>
            <ThemedText style={styles.emptyDesc}>Choose an AI Agent from the marketplace to initialize communication.</ThemedText>
          </View>
        ) : (
          <FlatList
            data={sortedConversations}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <Pressable onPress={() => handleChatPress(item.agentId, item.id)}>
                <GlassCard 
                  style={[
                    styles.convCard, 
                    item.unreadCount > 0 ? styles.unreadCard : null
                  ]}
                  borderColor={item.pinned ? 'rgba(6, 182, 212, 0.35)' : 'rgba(99, 102, 241, 0.15)'}
                >
                  <View style={styles.convHeader}>
                    <Image source={{ uri: item.agentAvatar }} style={styles.convAvatar} />
                    <View style={{ flex: 1, marginLeft: Spacing.md }}>
                      <View style={styles.convTitleRow}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <ThemedText style={styles.convName}>{item.agentName}</ThemedText>
                          {item.pinned && (
                            <Pin size={10} color={Theme.colors.accent} style={{ marginLeft: 6 }} fill={Theme.colors.accent} />
                          )}
                        </View>
                        <ThemedText style={styles.convTime}>{item.updatedAt}</ThemedText>
                      </View>
                      
                      <View style={styles.messageRow}>
                        <ThemedText 
                          style={[
                            styles.convMessage, 
                            item.unreadCount > 0 && styles.unreadMessage
                          ]} 
                          numberOfLines={1}
                        >
                          {item.lastMessage}
                        </ThemedText>
                        
                        {item.unreadCount > 0 && (
                          <View style={styles.badge}>
                            <ThemedText style={styles.badgeText}>{item.unreadCount}</ThemedText>
                          </View>
                        )}
                      </View>
                    </View>
                  </View>
                </GlassCard>
              </Pressable>
            )}
          />
        )}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    marginBottom: Spacing.md,
  },
  titleText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Theme.colors.text,
  },
  newChatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.accent,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Theme.roundness.md,
  },
  newChatText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0B1120',
    marginLeft: 4,
  },
  searchContainer: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(17, 24, 39, 0.8)',
    borderRadius: Theme.roundness.md,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.15)',
  },
  searchIcon: {
    marginRight: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    color: Theme.colors.text,
    fontSize: 14,
    paddingVertical: 10,
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: BottomTabInset + Spacing.lg,
  },
  convCard: {
    padding: Spacing.md,
    marginVertical: Spacing.xs,
  },
  unreadCard: {
    backgroundColor: 'rgba(109, 40, 217, 0.08)',
  },
  convHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  convAvatar: {
    width: 44,
    height: 44,
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
  messageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  convMessage: {
    fontSize: 12,
    color: Theme.colors.textMuted,
    flex: 1,
  },
  unreadMessage: {
    color: Theme.colors.text,
    fontWeight: '500',
  },
  badge: {
    backgroundColor: Theme.colors.accent,
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: Spacing.sm,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#0B1120',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xxl,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Theme.colors.text,
  },
  emptyDesc: {
    fontSize: 13,
    color: Theme.colors.textMuted,
    textAlign: 'center',
    marginTop: Spacing.sm,
    lineHeight: 18,
  },
});
