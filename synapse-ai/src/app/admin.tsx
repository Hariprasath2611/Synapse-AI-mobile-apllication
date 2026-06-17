import React from 'react';
import { StyleSheet, View, ScrollView, Pressable, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { router } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { GlassCard } from '@/components/GlassCard';
import { RootState } from '@/store';
import { Spacing, Theme } from '@/constants/theme';
import { ChevronLeft, ShieldCheck, Server, AlertOctagon, CheckCircle, XCircle } from 'lucide-react-native';

export default function AdminPanelScreen() {
  const { agents } = useSelector((state: RootState) => state.agents);
  
  // Simulated moderation queue
  const [queue, setQueue] = React.useState([
    { id: 'mod_1', name: 'MedScribe AI', category: 'Healthcare', creator: 'Dr. Lucas Patel', date: '2 hours ago' },
    { id: 'mod_2', name: 'ContractShield', category: 'Legal', creator: 'LegalOps Inc.', date: '1 day ago' }
  ]);

  const handleApprove = (id: string, name: string) => {
    setQueue(prev => prev.filter(q => q.id !== id));
    Alert.alert('Ecosystem Synchronized', `Agent Node "${name}" has been approved and registered in the public catalog.`);
  };

  const handleReject = (id: string, name: string) => {
    setQueue(prev => prev.filter(q => q.id !== id));
    Alert.alert('Agent Refused', `Agent Node "${name}" has been flagged and rejected. Creator notified.`);
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.headerButton}>
            <ChevronLeft size={20} color={Theme.colors.text} />
          </Pressable>
          <ThemedText style={styles.headerTitle}>System Moderation</ThemedText>
          <View style={styles.headerButton} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Health Stats */}
          <GlassCard style={styles.statsCard} borderColor="rgba(239, 68, 68, 0.25)">
            <View style={styles.statsHeader}>
              <Server size={20} color="#EF4444" style={{ marginRight: Spacing.sm }} />
              <ThemedText style={styles.statsTitle}>System Status Registry</ThemedText>
            </View>
            <View style={styles.metricsGrid}>
              <View style={styles.metric}>
                <ThemedText style={styles.metricVal}>99.98%</ThemedText>
                <ThemedText style={styles.metricLabel}>API SLA</ThemedText>
              </View>
              <View style={styles.metric}>
                <ThemedText style={styles.metricVal}>14 ms</ThemedText>
                <ThemedText style={styles.metricLabel}>Socket Lag</ThemedText>
              </View>
              <View style={styles.metric}>
                <ThemedText style={styles.metricVal}>1.2M</ThemedText>
                <ThemedText style={styles.metricLabel}>Total Keys</ThemedText>
              </View>
            </View>
          </GlassCard>

          {/* Moderation Queue */}
          <ThemedText style={styles.sectionTitle}>Agent Node Verification Queue ({queue.length})</ThemedText>
          {queue.length === 0 ? (
            <GlassCard style={styles.emptyCard}>
              <ShieldCheck size={36} color={Theme.colors.success} style={{ marginBottom: 8 }} />
              <ThemedText style={styles.emptyTitle}>Queue Clean</ThemedText>
              <ThemedText style={styles.emptyDesc}>All pending submission modules have been audited.</ThemedText>
            </GlassCard>
          ) : (
            queue.map((item) => (
              <GlassCard key={item.id} style={styles.modCard}>
                <View style={styles.modHeader}>
                  <View style={{ flex: 1 }}>
                    <ThemedText style={styles.modName}>{item.name}</ThemedText>
                    <ThemedText style={styles.modCreator}>
                      by {item.creator} • {item.date}
                    </ThemedText>
                  </View>
                  <View style={styles.badge}>
                    <ThemedText style={styles.badgeText}>{item.category}</ThemedText>
                  </View>
                </View>

                <View style={styles.actionRow}>
                  <Pressable 
                    style={[styles.actionBtn, styles.rejectBtn]}
                    onPress={() => handleReject(item.id, item.name)}
                  >
                    <XCircle size={14} color="#EF4444" style={{ marginRight: 4 }} />
                    <ThemedText style={styles.rejectText}>Reject</ThemedText>
                  </Pressable>

                  <Pressable 
                    style={[styles.actionBtn, styles.approveBtn]}
                    onPress={() => handleApprove(item.id, item.name)}
                  >
                    <CheckCircle size={14} color="#10B981" style={{ marginRight: 4 }} />
                    <ThemedText style={styles.approveText}>Approve</ThemedText>
                  </Pressable>
                </View>
              </GlassCard>
            ))
          )}
          
          {/* Logs */}
          <ThemedText style={styles.sectionTitle}>Ecosystem System Audit Logs</ThemedText>
          <GlassCard style={styles.logCard}>
            <View style={styles.logRow}>
              <AlertOctagon size={14} color="#F59E0B" style={{ marginRight: 8 }} />
              <ThemedText style={styles.logText}>Rate limit exceeded by client node: 192.168.1.42 (DevOps Architect)</ThemedText>
            </View>
            <View style={styles.logRow}>
              <ShieldCheck size={14} color="#10B981" style={{ marginRight: 8 }} />
              <ThemedText style={styles.logText}>Pinecone database shards verified: 10,240 records active</ThemedText>
            </View>
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
    width: 40,
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
  statsCard: {
    padding: Spacing.lg,
    backgroundColor: 'rgba(239, 68, 68, 0.06)',
    marginBottom: Spacing.lg,
  },
  statsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  statsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#EF4444',
  },
  metricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0,0,0,0.15)',
    padding: Spacing.md,
    borderRadius: Theme.roundness.md,
  },
  metric: {
    alignItems: 'center',
    flex: 1,
  },
  metricVal: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Theme.colors.text,
  },
  metricLabel: {
    fontSize: 10,
    color: Theme.colors.textMuted,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Theme.colors.text,
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
  },
  emptyCard: {
    padding: Spacing.xxl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Theme.colors.text,
  },
  emptyDesc: {
    fontSize: 12,
    color: Theme.colors.textMuted,
    textAlign: 'center',
    marginTop: 4,
  },
  modCard: {
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  modHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  modName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Theme.colors.text,
  },
  modCreator: {
    fontSize: 11,
    color: Theme.colors.textMuted,
    marginTop: 2,
  },
  badge: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Theme.roundness.sm,
  },
  badgeText: {
    fontSize: 10,
    color: Theme.colors.textMuted,
  },
  actionRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  actionBtn: {
    flex: 1,
    borderRadius: Theme.roundness.sm,
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  rejectBtn: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderColor: 'rgba(239, 68, 68, 0.25)',
  },
  rejectText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#EF4444',
  },
  approveBtn: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderColor: 'rgba(16, 185, 129, 0.25)',
  },
  approveText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#10B981',
  },
  logCard: {
    padding: Spacing.md,
  },
  logRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  logText: {
    fontSize: 11,
    color: Theme.colors.textMuted,
    flex: 1,
  },
});
