import React from 'react';
import { StyleSheet, View, ScrollView, TextInput, Pressable, Image, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { router } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { GlassCard } from '@/components/GlassCard';
import { RootState, setSelectedCategory, setSearchQuery } from '@/store';
import { BottomTabInset, MaxContentWidth, Spacing, Theme } from '@/constants/theme';
import { Search, Star, ArrowUpRight, Filter, Bookmark } from 'lucide-react-native';
import { toggleBookmark } from '@/store';

export default function MarketplaceScreen() {
  const dispatch = useDispatch();
  const { agents, categories, selectedCategory, searchQuery } = useSelector((state: RootState) => state.agents);

  // Filter logic
  const filteredAgents = agents.filter(agent => {
    const matchesCategory = selectedCategory === 'All' || agent.category === selectedCategory;
    const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          agent.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Search Header */}
        <View style={styles.header}>
          <ThemedText style={styles.titleText}>AI Marketplace</ThemedText>
          <ThemedText style={styles.subtitleText}>Discover & deploy pre-trained agent nodes</ThemedText>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={18} color={Theme.colors.textMuted} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search agents, skills, creators..."
              placeholderTextColor={Theme.colors.textMuted}
              value={searchQuery}
              onChangeText={(text) => dispatch(setSearchQuery(text))}
            />
          </View>
          <Pressable style={styles.filterButton}>
            <Filter size={18} color={Theme.colors.accent} />
          </Pressable>
        </View>

        {/* Category List */}
        <View style={styles.categoriesContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categories.map((category) => {
              const isSelected = selectedCategory === category;
              return (
                <Pressable
                  key={category}
                  onPress={() => dispatch(setSelectedCategory(category))}
                  style={[
                    styles.categoryTab,
                    isSelected && styles.categoryTabSelected
                  ]}
                >
                  <ThemedText
                    style={[
                      styles.categoryTabText,
                      isSelected && styles.categoryTabTextSelected
                    ]}
                  >
                    {category}
                  </ThemedText>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* Agents List */}
        {filteredAgents.length === 0 ? (
          <View style={styles.emptyContainer}>
            <ThemedText style={styles.emptyTitle}>No Agents Found</ThemedText>
            <ThemedText style={styles.emptyDesc}>Try searching for different terms or reset your filters.</ThemedText>
          </View>
        ) : (
          <FlatList
            data={filteredAgents}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <GlassCard style={styles.agentCard}>
                <View style={styles.agentTop}>
                  <Image source={{ uri: item.avatar }} style={styles.agentAvatar} />
                  <View style={{ flex: 1, marginLeft: Spacing.md }}>
                    <View style={styles.nameRow}>
                      <ThemedText style={styles.agentName}>{item.name}</ThemedText>
                      <Pressable onPress={() => dispatch(toggleBookmark(item.id))}>
                        <Bookmark
                          size={18}
                          color={item.isBookmarked ? Theme.colors.accent : Theme.colors.textMuted}
                          fill={item.isBookmarked ? Theme.colors.accent : 'transparent'}
                        />
                      </Pressable>
                    </View>
                    <ThemedText style={styles.creatorName}>by {item.creatorName}</ThemedText>
                    <View style={styles.ratingRow}>
                      <Star size={12} color="#F59E0B" fill="#F59E0B" />
                      <ThemedText style={styles.ratingText}>
                        {item.rating} ({item.reviewsCount} reviews)
                      </ThemedText>
                      <ThemedText style={styles.divider}>•</ThemedText>
                      <ThemedText style={styles.usageText}>
                        {(item.usageCount / 1000).toFixed(1)}k runs
                      </ThemedText>
                    </View>
                  </View>
                </View>

                <ThemedText style={styles.agentDesc} numberOfLines={2}>
                  {item.description}
                </ThemedText>

                <View style={styles.capabilities}>
                  {item.capabilities.slice(0, 2).map((cap, i) => (
                    <View key={i} style={styles.capBadge}>
                      <ThemedText style={styles.capBadgeText}>{cap}</ThemedText>
                    </View>
                  ))}
                  {item.capabilities.length > 2 && (
                    <View style={styles.capBadge}>
                      <ThemedText style={styles.capBadgeText}>+{item.capabilities.length - 2} more</ThemedText>
                    </View>
                  )}
                </View>

                <View style={styles.cardFooter}>
                  <View style={styles.priceRow}>
                    <ThemedText style={styles.priceLabel}>Price</ThemedText>
                    <ThemedText style={styles.priceValue}>
                      {item.price === 0 ? 'Free' : `$${item.price}/mo`}
                    </ThemedText>
                  </View>

                  <Pressable
                    style={styles.deployButton}
                    onPress={() => router.push({ pathname: '/agent/[id]', params: { id: item.id } } as any)}
                  >
                    <ThemedText style={styles.deployText}>View Profile</ThemedText>
                    <ArrowUpRight size={14} color="#0B1120" style={{ marginLeft: 2 }} />
                  </Pressable>
                </View>
              </GlassCard>
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
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    marginBottom: Spacing.md,
  },
  titleText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Theme.colors.text,
  },
  subtitleText: {
    fontSize: 13,
    color: Theme.colors.textMuted,
    marginTop: 2,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  searchBar: {
    flex: 1,
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
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
  },
  filterButton: {
    width: 46,
    height: 46,
    borderRadius: Theme.roundness.md,
    backgroundColor: 'rgba(17, 24, 39, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.15)',
  },
  categoriesContainer: {
    paddingLeft: Spacing.lg,
    marginBottom: Spacing.md,
  },
  categoryTab: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Theme.roundness.full,
    backgroundColor: 'rgba(17, 24, 39, 0.5)',
    marginRight: Spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.1)',
  },
  categoryTabSelected: {
    backgroundColor: Theme.colors.primary,
    borderColor: Theme.colors.primary,
  },
  categoryTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: Theme.colors.textMuted,
  },
  categoryTabTextSelected: {
    color: Theme.colors.text,
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: BottomTabInset + Spacing.lg,
  },
  agentCard: {
    padding: Spacing.md,
    marginVertical: Spacing.sm,
  },
  agentTop: {
    flexDirection: 'row',
  },
  agentAvatar: {
    width: 50,
    height: 50,
    borderRadius: Theme.roundness.md,
    backgroundColor: Theme.colors.card,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  agentName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Theme.colors.text,
  },
  creatorName: {
    fontSize: 12,
    color: Theme.colors.textMuted,
    marginTop: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingText: {
    fontSize: 11,
    color: Theme.colors.textMuted,
    marginLeft: 4,
  },
  divider: {
    color: Theme.colors.textMuted,
    marginHorizontal: 6,
    fontSize: 10,
  },
  usageText: {
    fontSize: 11,
    color: Theme.colors.accent,
    fontWeight: '600',
  },
  agentDesc: {
    fontSize: 13,
    color: Theme.colors.textMuted,
    marginTop: Spacing.md,
    lineHeight: 18,
  },
  capabilities: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: Spacing.md,
    gap: Spacing.xs,
  },
  capBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Theme.roundness.sm,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  capBadgeText: {
    fontSize: 10,
    color: Theme.colors.textMuted,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.lg,
    borderTopWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    paddingTop: Spacing.md,
  },
  priceRow: {
    flexDirection: 'column',
  },
  priceLabel: {
    fontSize: 10,
    color: Theme.colors.textMuted,
    textTransform: 'uppercase',
  },
  priceValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Theme.colors.text,
    marginTop: 2,
  },
  deployButton: {
    backgroundColor: Theme.colors.accent,
    borderRadius: Theme.roundness.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deployText: {
    fontSize: 12,
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
  },
});
