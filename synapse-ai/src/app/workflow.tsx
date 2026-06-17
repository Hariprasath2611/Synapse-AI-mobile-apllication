import React from 'react';
import { StyleSheet, View, ScrollView, Pressable, Switch, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { router } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { GlassCard } from '@/components/GlassCard';
import { RootState, toggleWorkflowActive } from '@/store';
import { Spacing, Theme } from '@/constants/theme';
import { ChevronLeft, Play, Zap, Calendar, GitPullRequest, ToggleLeft, Activity, Info } from 'lucide-react-native';

export default function WorkflowScreen() {
  const dispatch = useDispatch();
  const { workflows, executions } = useSelector((state: RootState) => state.ecosystem);

  const handleToggleActive = (id: string) => {
    dispatch(toggleWorkflowActive(id));
  };

  const handleRunWorkflow = (name: string) => {
    Alert.alert('Workflow Executed', `Automation pipeline "${name}" ran successfully. Execution logs synced to cloud registry.`);
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.headerButton}>
            <ChevronLeft size={20} color={Theme.colors.text} />
          </Pressable>
          <ThemedText style={styles.headerTitle}>Workflow Automations</ThemedText>
          <Pressable style={styles.headerButton} onPress={() => Alert.alert('New Workflow', 'Workflow Creator Engine is launching...')}>
            <Play size={20} color={Theme.colors.accent} />
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Dashboard Summary */}
          <GlassCard style={styles.summaryCard} borderColor="rgba(6, 182, 212, 0.2)">
            <View style={styles.summaryHeader}>
              <Activity size={20} color={Theme.colors.accent} style={{ marginRight: Spacing.sm }} />
              <ThemedText style={styles.summaryTitle}>Active Agents Pipelines</ThemedText>
            </View>
            <ThemedText style={styles.summaryText}>
              Your connected workflows qualifies incoming payloads and delegates tasks to target agent models in real-time.
            </ThemedText>
          </GlassCard>

          {/* Workflows List */}
          <ThemedText style={styles.sectionTitle}>Automations Registry</ThemedText>
          {workflows.map((wf) => (
            <GlassCard key={wf.id} style={styles.workflowCard} borderColor="rgba(109, 40, 217, 0.25)">
              <View style={styles.wfHeaderRow}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Zap size={18} color={wf.isActive ? Theme.colors.accent : Theme.colors.textMuted} style={{ marginRight: Spacing.sm }} />
                  <ThemedText style={styles.wfName}>{wf.name}</ThemedText>
                </View>
                <Switch
                  value={wf.isActive}
                  onValueChange={() => handleToggleActive(wf.id)}
                  trackColor={{ false: '#1F2937', true: Theme.colors.primary }}
                  thumbColor={wf.isActive ? Theme.colors.accent : '#94A3B8'}
                />
              </View>

              <ThemedText style={styles.wfDesc}>{wf.description}</ThemedText>

              {/* Connected Nodes Visual block */}
              <View style={styles.nodePipeline}>
                <ThemedText style={styles.pipelineTitle}>Execution Steps</ThemedText>
                {wf.nodes.map((node, i) => (
                  <View key={node.id} style={styles.pipelineStepRow}>
                    <View style={styles.nodeCircle}>
                      <ThemedText style={styles.nodeCircleText}>{i + 1}</ThemedText>
                    </View>
                    <View style={styles.nodeBody}>
                      <ThemedText style={styles.nodeLabel}>{node.label}</ThemedText>
                      <ThemedText style={styles.nodeType}>{node.type.toUpperCase()}</ThemedText>
                    </View>
                    {i < wf.nodes.length - 1 && <View style={styles.nodeConnectorLine} />}
                  </View>
                ))}
              </View>

              <View style={styles.wfFooter}>
                <ThemedText style={styles.wfRuns}>Last Run: {wf.lastExecuted || 'Never'}</ThemedText>
                <Pressable 
                  style={[styles.runBtn, !wf.isActive && styles.runBtnDisabled]}
                  disabled={!wf.isActive}
                  onPress={() => handleRunWorkflow(wf.name)}
                >
                  <Play size={10} color="#0B1120" style={{ marginRight: 4 }} />
                  <ThemedText style={styles.runBtnText}>Run</ThemedText>
                </Pressable>
              </View>
            </GlassCard>
          ))}

          {/* Recent execution histories */}
          <ThemedText style={styles.sectionTitle}>Recent Execution Log History</ThemedText>
          {executions.map((exec) => (
            <GlassCard key={exec.id} style={styles.logCard}>
              <View style={styles.logHeader}>
                <View>
                  <ThemedText style={styles.logTitle}>{exec.workflowName}</ThemedText>
                  <ThemedText style={styles.logId}>{exec.id} • Latency: {exec.executionTime}</ThemedText>
                </View>
                <View style={[
                  styles.statusBadge,
                  exec.status === 'success' ? styles.statusSuccess : styles.statusFailed
                ]}>
                  <ThemedText style={[
                    styles.statusText,
                    exec.status === 'success' ? { color: '#10B981' } : { color: '#EF4444' }
                  ]}>
                    {exec.status.toUpperCase()}
                  </ThemedText>
                </View>
              </View>

              {/* Execution Steps Log Details */}
              <View style={styles.logSteps}>
                {exec.steps.map((step, index) => (
                  <View key={index} style={styles.logStepRow}>
                    <View style={[styles.stepDot, { backgroundColor: Theme.colors.success }]} />
                    <ThemedText style={styles.stepLogText}>{step.name} - Successful</ThemedText>
                  </View>
                ))}
              </View>
            </GlassCard>
          ))}
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
    paddingBottom: Spacing.xxl,
  },
  summaryCard: {
    backgroundColor: 'rgba(6, 182, 212, 0.06)',
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  summaryTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Theme.colors.accent,
  },
  summaryText: {
    fontSize: 12.5,
    color: Theme.colors.textMuted,
    lineHeight: 18,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Theme.colors.text,
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
  },
  workflowCard: {
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  wfHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  wfName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Theme.colors.text,
  },
  wfDesc: {
    fontSize: 12,
    color: Theme.colors.textMuted,
    lineHeight: 18,
    marginBottom: Spacing.lg,
  },
  nodePipeline: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: Theme.roundness.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  pipelineTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: Theme.colors.primary,
    textTransform: 'uppercase',
    marginBottom: Spacing.md,
    letterSpacing: 0.5,
  },
  pipelineStepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.sm,
    position: 'relative',
  },
  nodeCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  nodeCircleText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: Theme.colors.text,
  },
  nodeBody: {
    marginLeft: Spacing.md,
    flex: 1,
  },
  nodeLabel: {
    fontSize: 12.5,
    color: Theme.colors.text,
    fontWeight: '500',
  },
  nodeType: {
    fontSize: 9,
    color: Theme.colors.textMuted,
    marginTop: 2,
  },
  nodeConnectorLine: {
    position: 'absolute',
    left: 9,
    top: 20,
    bottom: -24,
    width: 2,
    backgroundColor: 'rgba(109, 40, 217, 0.3)',
    zIndex: 1,
  },
  wfFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    paddingTop: Spacing.md,
  },
  wfRuns: {
    fontSize: 11,
    color: Theme.colors.textMuted,
  },
  runBtn: {
    backgroundColor: Theme.colors.accent,
    borderRadius: Theme.roundness.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  runBtnDisabled: {
    backgroundColor: '#334155',
    opacity: 0.5,
  },
  runBtnText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#0B1120',
  },
  logCard: {
    padding: Spacing.md,
    marginVertical: Spacing.xs,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Theme.colors.text,
  },
  logId: {
    fontSize: 10,
    color: Theme.colors.textMuted,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Theme.roundness.sm,
  },
  statusSuccess: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
  },
  statusFailed: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
  },
  statusText: {
    fontSize: 9,
    fontWeight: 'bold',
  },
  logSteps: {
    marginTop: Spacing.md,
    paddingLeft: Spacing.sm,
    gap: 6,
  },
  logStepRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: Spacing.sm,
  },
  stepLogText: {
    fontSize: 11,
    color: Theme.colors.textMuted,
  },
});
