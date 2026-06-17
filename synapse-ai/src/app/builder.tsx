import React from 'react';
import { StyleSheet, View, ScrollView, TextInput, Pressable, Switch, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { router } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { GlassCard } from '@/components/GlassCard';
import { RootState, addAgent } from '@/store';
import { Spacing, Theme } from '@/constants/theme';
import { ChevronLeft, Info, HelpCircle, Save, Settings, Upload, Check } from 'lucide-react-native';

export default function AgentBuilderScreen() {
  const dispatch = useDispatch();
  const { categories } = useSelector((state: RootState) => state.agents);
  const { user } = useSelector((state: RootState) => state.auth);

  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [category, setCategory] = React.useState('Coding');
  const [instructions, setInstructions] = React.useState('');
  const [price, setPrice] = React.useState('');
  const [isSub, setIsSub] = React.useState(false);
  const [memoryEnabled, setMemoryEnabled] = React.useState(true);
  const [avatarUrl, setAvatarUrl] = React.useState('https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=150&q=80');

  const handleSaveAgent = () => {
    if (!name.trim()) {
      Alert.alert('Missing Field', 'Please enter a name for your agent.');
      return;
    }
    if (!description.trim()) {
      Alert.alert('Missing Field', 'Please describe what your agent does.');
      return;
    }

    const priceNum = parseFloat(price) || 0;

    const newAgent = {
      id: `agent_${Date.now()}`,
      name,
      description,
      avatar: avatarUrl,
      category,
      rating: 5.0,
      reviewsCount: 0,
      usageCount: 0,
      price: priceNum,
      isSubscription: isSub,
      creatorId: user?.id || 'creator_anonymous',
      creatorName: user?.name || 'Anonymous Creator',
      capabilities: instructions.split('\n').filter(line => line.trim() !== ''),
      knowledgeBases: [],
      tools: ['Web Search', 'Terminal Code Executor'],
      memoryEnabled,
      version: '1.0.0',
      isBookmarked: false,
    };

    dispatch(addAgent(newAgent));
    Alert.alert('Agent Created', `${name} has been published successfully and is now active in the marketplace!`, [
      { text: 'Done', onPress: () => router.replace('/marketplace' as any) }
    ]);
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.headerButton}>
            <ChevronLeft size={20} color={Theme.colors.text} />
          </Pressable>
          <ThemedText style={styles.headerTitle}>Build Agent Node</ThemedText>
          <Pressable onPress={handleSaveAgent} style={styles.headerButton}>
            <Save size={20} color={Theme.colors.accent} />
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Main Info */}
          <ThemedText style={styles.sectionTitle}>Agent Profile Identifiers</ThemedText>
          <GlassCard>
            <View style={styles.formGroup}>
              <ThemedText style={styles.label}>Agent Name</ThemedText>
              <TextInput
                style={styles.input}
                placeholder="e.g. DevOps Assistant"
                placeholderTextColor={Theme.colors.textMuted}
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={styles.formGroup}>
              <ThemedText style={styles.label}>Short Description</ThemedText>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="What specialized skills does this agent perform?"
                placeholderTextColor={Theme.colors.textMuted}
                multiline
                numberOfLines={3}
                value={description}
                onChangeText={setDescription}
              />
            </View>

            <View style={styles.formGroup}>
              <ThemedText style={styles.label}>Avatar Node Image URL</ThemedText>
              <View style={{ flexDirection: 'row', gap: Spacing.sm }}>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="Paste URL link"
                  placeholderTextColor={Theme.colors.textMuted}
                  value={avatarUrl}
                  onChangeText={setAvatarUrl}
                />
                <Pressable style={styles.uploadBtn}>
                  <Upload size={16} color={Theme.colors.accent} />
                </Pressable>
              </View>
            </View>
          </GlassCard>

          {/* Configuration */}
          <ThemedText style={styles.sectionTitle}>Capabilities & System Rules</ThemedText>
          <GlassCard>
            <View style={styles.formGroup}>
              <ThemedText style={styles.label}>Category</ThemedText>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: Spacing.sm }}>
                {categories.filter(c => c !== 'All').map((cat) => {
                  const isSelected = category === cat;
                  return (
                    <Pressable
                      key={cat}
                      onPress={() => setCategory(cat)}
                      style={[
                        styles.catTab,
                        isSelected && styles.catTabSelected
                      ]}
                    >
                      <ThemedText style={[styles.catTabText, isSelected && styles.catTabTextSelected]}>
                        {cat}
                      </ThemedText>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>

            <View style={styles.formGroup}>
              <View style={styles.labelRow}>
                <ThemedText style={styles.label}>Core Directives & Instructions</ThemedText>
                <HelpCircle size={14} color={Theme.colors.textMuted} />
              </View>
              <TextInput
                style={[styles.input, styles.codeArea]}
                placeholder="Enter instructions (one capability per line) e.g.&#10;Analyze Node.js deploy setups&#10;Optimise Kubernetes replica scales"
                placeholderTextColor={Theme.colors.textMuted}
                multiline
                numberOfLines={5}
                value={instructions}
                onChangeText={setInstructions}
              />
            </View>
          </GlassCard>

          {/* Pricing & Memory */}
          <ThemedText style={styles.sectionTitle}>System Settings & Monetization</ThemedText>
          <GlassCard>
            <View style={styles.switchRow}>
              <View>
                <ThemedText style={styles.switchLabel}>Persistent Memory Cache</ThemedText>
                <ThemedText style={styles.switchDesc}>Agent retains user session context details.</ThemedText>
              </View>
              <Switch
                value={memoryEnabled}
                onValueChange={setMemoryEnabled}
                trackColor={{ false: '#1F2937', true: Theme.colors.primary }}
                thumbColor={memoryEnabled ? Theme.colors.accent : '#94A3B8'}
              />
            </View>

            <View style={[styles.formGroup, { marginTop: Spacing.lg }]}>
              <ThemedText style={styles.label}>Subscription Price / Month ($)</ThemedText>
              <TextInput
                style={styles.input}
                placeholder="0.00 for free access"
                placeholderTextColor={Theme.colors.textMuted}
                keyboardType="numeric"
                value={price}
                onChangeText={setPrice}
              />
            </View>

            <View style={styles.switchRow}>
              <View>
                <ThemedText style={styles.switchLabel}>Subscription Required</ThemedText>
                <ThemedText style={styles.switchDesc}>Lock full features behind monthly payout rates.</ThemedText>
              </View>
              <Switch
                value={isSub}
                onValueChange={setIsSub}
                trackColor={{ false: '#1F2937', true: Theme.colors.primary }}
                thumbColor={isSub ? Theme.colors.accent : '#94A3B8'}
              />
            </View>
          </GlassCard>

          {/* Save Button */}
          <Pressable style={styles.saveBtn} onPress={handleSaveAgent}>
            <Check size={18} color="#0B1120" style={{ marginRight: Spacing.sm }} />
            <ThemedText style={styles.saveBtnText}>Compile & Deploy Agent Node</ThemedText>
          </Pressable>

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
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Theme.colors.accent,
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  formGroup: {
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: Theme.colors.text,
    marginBottom: 6,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#0B1120',
    borderRadius: Theme.roundness.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    color: Theme.colors.text,
    paddingHorizontal: Spacing.md,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    fontSize: 14,
  },
  textArea: {
    textAlignVertical: 'top',
    height: 70,
  },
  codeArea: {
    fontFamily: Theme.fonts?.mono,
    textAlignVertical: 'top',
    height: 110,
    fontSize: 12.5,
  },
  uploadBtn: {
    backgroundColor: 'rgba(6, 182, 212, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(6, 182, 212, 0.25)',
    borderRadius: Theme.roundness.md,
    justifyContent: 'center',
    alignItems: 'center',
    width: 46,
    height: 46,
  },
  catTab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Theme.roundness.full,
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginRight: Spacing.sm,
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  catTabSelected: {
    backgroundColor: Theme.colors.primary,
    borderColor: Theme.colors.primary,
  },
  catTabText: {
    fontSize: 11,
    color: Theme.colors.textMuted,
    fontWeight: '600',
  },
  catTabTextSelected: {
    color: Theme.colors.text,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  switchLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Theme.colors.text,
  },
  switchDesc: {
    fontSize: 11,
    color: Theme.colors.textMuted,
    marginTop: 2,
    maxWidth: '85%',
  },
  saveBtn: {
    backgroundColor: Theme.colors.accent,
    borderRadius: Theme.roundness.md,
    paddingVertical: Spacing.md,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.xl,
    marginBottom: Spacing.xl,
  },
  saveBtnText: {
    color: '#0B1120',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
