import React from 'react';
import { StyleSheet, View, ScrollView, Pressable, TextInput, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { router } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { GlassCard } from '@/components/GlassCard';
import { RootState, addTeam } from '@/store';
import { Spacing, Theme } from '@/constants/theme';
import { ChevronLeft, Users, Plus, Shield, UserPlus, FolderSync } from 'lucide-react-native';

export default function TeamWorkspaceScreen() {
  const dispatch = useDispatch();
  const { teams } = useSelector((state: RootState) => state.ecosystem);

  const [teamName, setTeamName] = React.useState('');
  const [showAdd, setShowAdd] = React.useState(false);

  const handleCreateTeam = () => {
    if (!teamName.trim()) {
      Alert.alert('Error', 'Please enter a team name');
      return;
    }

    const newTeam = {
      id: `team_${Date.now()}`,
      name: teamName,
      membersCount: 1,
      agentsCount: 0,
      workflowsCount: 0,
      role: 'admin' as const,
    };

    dispatch(addTeam(newTeam));
    setTeamName('');
    setShowAdd(false);
    Alert.alert('Team Initialized', `${teamName} organization space created.`);
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.headerButton}>
            <ChevronLeft size={20} color={Theme.colors.text} />
          </Pressable>
          <ThemedText style={styles.headerTitle}>Team Organizations</ThemedText>
          <Pressable onPress={() => setShowAdd(!showAdd)} style={styles.headerButton}>
            <Plus size={20} color={Theme.colors.accent} />
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Add Team Panel */}
          {showAdd && (
            <GlassCard style={styles.createCard} borderColor={Theme.colors.accent}>
              <ThemedText style={styles.createTitle}>Create Organization Workspace</ThemedText>
              <TextInput
                style={styles.input}
                placeholder="Organization Name (e.g. Synapse Dev Team)"
                placeholderTextColor={Theme.colors.textMuted}
                value={teamName}
                onChangeText={setTeamName}
              />
              <View style={styles.btnRow}>
                <Pressable style={styles.cancelBtn} onPress={() => setShowAdd(false)}>
                  <ThemedText style={styles.cancelBtnText}>Cancel</ThemedText>
                </Pressable>
                <Pressable style={styles.confirmBtn} onPress={handleCreateTeam}>
                  <ThemedText style={styles.confirmBtnText}>Create</ThemedText>
                </Pressable>
              </View>
            </GlassCard>
          )}

          <ThemedText style={styles.sectionTitle}>Shared Workspaces</ThemedText>
          {teams.map((team: any) => (
            <GlassCard key={team.id} style={styles.teamCard} borderColor="rgba(16, 185, 129, 0.2)">
              <View style={styles.teamHeader}>
                <Users size={22} color={Theme.colors.accent} />
                <View style={{ flex: 1, marginLeft: Spacing.md }}>
                  <ThemedText style={styles.teamName}>{team.name}</ThemedText>
                  <View style={styles.roleBadge}>
                    <Shield size={10} color={Theme.colors.primary} style={{ marginRight: 4 }} />
                    <ThemedText style={styles.roleText}>{team.role.toUpperCase()}</ThemedText>
                  </View>
                </View>
              </View>

              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <ThemedText style={styles.statVal}>{team.membersCount}</ThemedText>
                  <ThemedText style={styles.statLabel}>Members</ThemedText>
                </View>
                <View style={styles.statItem}>
                  <ThemedText style={styles.statVal}>{team.agentsCount}</ThemedText>
                  <ThemedText style={styles.statLabel}>Shared Agents</ThemedText>
                </View>
                <View style={styles.statItem}>
                  <ThemedText style={styles.statVal}>{team.workflowsCount}</ThemedText>
                  <ThemedText style={styles.statLabel}>Shared Workflows</ThemedText>
                </View>
              </View>

              <View style={styles.actionRow}>
                <Pressable 
                  style={styles.actionBtn}
                  onPress={() => Alert.alert('Invite Member', 'Sharing email generation link...')}
                >
                  <UserPlus size={12} color="#0B1120" style={{ marginRight: 4 }} />
                  <ThemedText style={styles.actionBtnText}>Invite</ThemedText>
                </Pressable>
                
                <Pressable 
                  style={[styles.actionBtn, styles.actionBtnOutline]}
                  onPress={() => Alert.alert('Sync Assets', 'Synapse shared memory databases synced.')}
                >
                  <FolderSync size={12} color={Theme.colors.accent} style={{ marginRight: 4 }} />
                  <ThemedText style={styles.actionBtnTextOutline}>Sync</ThemedText>
                </Pressable>
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
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Theme.colors.text,
    marginBottom: Spacing.md,
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
  teamCard: {
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  teamHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  teamName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Theme.colors.text,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(109, 40, 217, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Theme.roundness.sm,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  roleText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: Theme.colors.primary,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: Spacing.lg,
    backgroundColor: 'rgba(0,0,0,0.15)',
    padding: Spacing.md,
    borderRadius: Theme.roundness.md,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statVal: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Theme.colors.text,
  },
  statLabel: {
    fontSize: 10,
    color: Theme.colors.textMuted,
    marginTop: 2,
  },
  actionRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionBtn: {
    backgroundColor: Theme.colors.accent,
    borderRadius: Theme.roundness.sm,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0B1120',
  },
  actionBtnOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Theme.colors.accent,
  },
  actionBtnTextOutline: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Theme.colors.accent,
  },
});
