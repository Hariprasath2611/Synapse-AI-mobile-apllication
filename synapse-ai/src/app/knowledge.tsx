import React from 'react';
import { StyleSheet, View, ScrollView, TextInput, Pressable, ActivityIndicator, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { router } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { GlassCard } from '@/components/GlassCard';
import { RootState, addKnowledgeBase, addDocument, updateDocStatus } from '@/store';
import { Spacing, Theme } from '@/constants/theme';
import { ChevronLeft, Database, Plus, Search, FileText, ArrowUp, RefreshCw, Layers } from 'lucide-react-native';

export default function KnowledgeBaseScreen() {
  const dispatch = useDispatch();
  const { knowledgeBases, documents } = useSelector((state: RootState) => state.ecosystem);

  const [search, setSearch] = React.useState('');
  const [newKbName, setNewKbName] = React.useState('');
  const [newKbDesc, setNewKbDesc] = React.useState('');
  const [isCreating, setIsCreating] = React.useState(false);

  const filteredKbs = knowledgeBases.filter(kb =>
    kb.name.toLowerCase().includes(search.toLowerCase()) ||
    kb.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreateKb = () => {
    if (!newKbName.trim()) {
      Alert.alert('Missing Field', 'Please enter a name.');
      return;
    }

    const newKb = {
      id: `kb_${Date.now()}`,
      name: newKbName,
      description: newKbDesc || 'No custom description provided.',
      documentCount: 0,
      size: '0 KB',
      status: 'ready' as const,
      pineconeSync: true,
      createdAt: new Date().toISOString().split('T')[0],
    };

    dispatch(addKnowledgeBase(newKb));
    setNewKbName('');
    setNewKbDesc('');
    setIsCreating(false);
    Alert.alert('Database Active', 'Vector base sync complete.');
  };

  const handleUploadDocument = (kbId: string) => {
    const docId = `doc_${Date.now()}`;
    const fileNames = ['API_Integration_Manifest.pdf', 'Startup_Valuation_Guide.md', 'Data_Structures_Guide.txt', 'Product_Specs_Core.docx'];
    const randomName = fileNames[Math.floor(Math.random() * fileNames.length)];

    const newDoc = {
      id: docId,
      kbId,
      name: randomName,
      size: '1.2 MB',
      type: randomName.split('.').pop() as any,
      status: 'uploading' as const,
      progress: 10,
    };

    dispatch(addDocument(newDoc));

    // Simulate chunking / embedding pipeline stages
    setTimeout(() => {
      dispatch(updateDocStatus({ id: docId, status: 'chunking', progress: 40 }));
      
      setTimeout(() => {
        dispatch(updateDocStatus({ id: docId, status: 'embedding', progress: 75 }));
        
        setTimeout(() => {
          dispatch(updateDocStatus({ id: docId, status: 'indexed', progress: 100 }));
        }, 1500);
      }, 1500);
    }, 1500);
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.headerButton}>
            <ChevronLeft size={20} color={Theme.colors.text} />
          </Pressable>
          <ThemedText style={styles.headerTitle}>Vector Databases</ThemedText>
          <Pressable onPress={() => setIsCreating(!isCreating)} style={styles.headerButton}>
            <Plus size={20} color={Theme.colors.accent} />
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Create Form */}
          {isCreating && (
            <GlassCard style={styles.createCard} borderColor={Theme.colors.accent}>
              <ThemedText style={styles.createTitle}>Initialize Vector Database</ThemedText>
              <TextInput
                style={styles.input}
                placeholder="Database Name (e.g. AWS EKS Blueprints)"
                placeholderTextColor={Theme.colors.textMuted}
                value={newKbName}
                onChangeText={setNewKbName}
              />
              <TextInput
                style={[styles.input, { marginTop: Spacing.sm }]}
                placeholder="Description"
                placeholderTextColor={Theme.colors.textMuted}
                value={newKbDesc}
                onChangeText={setNewKbDesc}
              />
              <View style={styles.btnRow}>
                <Pressable style={styles.cancelBtn} onPress={() => setIsCreating(false)}>
                  <ThemedText style={styles.cancelBtnText}>Cancel</ThemedText>
                </Pressable>
                <Pressable style={styles.confirmBtn} onPress={handleCreateKb}>
                  <ThemedText style={styles.confirmBtnText}>Connect Index</ThemedText>
                </Pressable>
              </View>
            </GlassCard>
          )}

          {/* Search */}
          <View style={styles.searchBar}>
            <Search size={18} color={Theme.colors.textMuted} style={{ marginRight: Spacing.sm }} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search knowledge bases..."
              placeholderTextColor={Theme.colors.textMuted}
              value={search}
              onChangeText={setSearch}
            />
          </View>

          {/* KBs List */}
          {filteredKbs.map((kb) => {
            const kbDocs = documents.filter(doc => doc.kbId === kb.id);
            return (
              <GlassCard key={kb.id} style={styles.kbCard} borderColor="rgba(109, 40, 217, 0.2)">
                <View style={styles.kbHeader}>
                  <Database size={22} color={Theme.colors.primary} />
                  <View style={{ flex: 1, marginLeft: Spacing.md }}>
                    <ThemedText style={styles.kbName}>{kb.name}</ThemedText>
                    <ThemedText style={styles.kbSize}>
                      {kb.documentCount} items • {kb.size} • Created {kb.createdAt}
                    </ThemedText>
                  </View>
                  <Pressable 
                    style={styles.uploadBtn}
                    onPress={() => handleUploadDocument(kb.id)}
                  >
                    <ArrowUp size={14} color="#0B1120" style={{ marginRight: 2 }} />
                    <ThemedText style={styles.uploadBtnText}>Upload</ThemedText>
                  </Pressable>
                </View>
                
                <ThemedText style={styles.kbDesc}>{kb.description}</ThemedText>

                {/* Documents List */}
                {kbDocs.length > 0 && (
                  <View style={styles.docsList}>
                    <ThemedText style={styles.docsTitle}>Document Embedding Queue</ThemedText>
                    {kbDocs.map((doc) => (
                      <View key={doc.id} style={styles.docItem}>
                        <FileText size={16} color={Theme.colors.textMuted} />
                        <View style={{ flex: 1, marginLeft: Spacing.sm }}>
                          <View style={styles.docInfoRow}>
                            <ThemedText style={styles.docName} numberOfLines={1}>{doc.name}</ThemedText>
                            <ThemedText style={[
                              styles.docStatusText,
                              doc.status === 'indexed' ? { color: Theme.colors.success } : { color: Theme.colors.accent }
                            ]}>
                              {doc.status.toUpperCase()}
                            </ThemedText>
                          </View>
                          
                          {/* Progress bar */}
                          {doc.status !== 'indexed' && (
                            <View style={styles.progressContainer}>
                              <View style={[styles.progressBar, { width: `${doc.progress}%` }]} />
                              <ThemedText style={styles.progressPct}>{doc.progress}%</ThemedText>
                            </View>
                          )}
                        </View>
                      </View>
                    ))}
                  </View>
                )}
              </GlassCard>
            );
          })}
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
    paddingBottom: Spacing.xxl,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(17, 24, 39, 0.8)',
    borderRadius: Theme.roundness.md,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.15)',
    marginBottom: Spacing.lg,
  },
  searchInput: {
    flex: 1,
    color: Theme.colors.text,
    fontSize: 14,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
  },
  createCard: {
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  createTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Theme.colors.text,
    marginBottom: Spacing.md,
  },
  input: {
    backgroundColor: '#0B1120',
    borderRadius: Theme.roundness.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    color: Theme.colors.text,
    paddingHorizontal: Spacing.md,
    paddingVertical: Platform.OS === 'ios' ? 10 : 6,
    fontSize: 13,
  },
  btnRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  cancelBtn: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  cancelBtnText: {
    color: Theme.colors.textMuted,
    fontSize: 13,
  },
  confirmBtn: {
    backgroundColor: Theme.colors.accent,
    borderRadius: Theme.roundness.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  confirmBtnText: {
    color: '#0B1120',
    fontWeight: 'bold',
    fontSize: 13,
  },
  kbCard: {
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  kbHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  kbName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Theme.colors.text,
  },
  kbSize: {
    fontSize: 11,
    color: Theme.colors.textMuted,
    marginTop: 2,
  },
  kbDesc: {
    fontSize: 12.5,
    color: Theme.colors.textMuted,
    marginTop: Spacing.md,
    lineHeight: 18,
  },
  uploadBtn: {
    backgroundColor: Theme.colors.accent,
    borderRadius: Theme.roundness.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
  },
  uploadBtnText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#0B1120',
  },
  docsList: {
    marginTop: Spacing.lg,
    borderTopWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    paddingTop: Spacing.md,
  },
  docsTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Theme.colors.accent,
    marginBottom: Spacing.sm,
  },
  docItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.xs,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    padding: Spacing.sm,
    borderRadius: Theme.roundness.sm,
  },
  docInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  docName: {
    fontSize: 12,
    color: Theme.colors.text,
    flex: 1,
    marginRight: Spacing.sm,
  },
  docStatusText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  progressBar: {
    height: 4,
    backgroundColor: Theme.colors.accent,
    borderRadius: 2,
  },
  progressPct: {
    fontSize: 9,
    color: Theme.colors.textMuted,
    marginLeft: 8,
  },
});
