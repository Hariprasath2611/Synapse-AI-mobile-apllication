import React from 'react';
import { StyleSheet, View, ScrollView, Pressable, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { router } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { GlassCard } from '@/components/GlassCard';
import { RootState, updateUserProfile } from '@/store';
import { BottomTabInset, Spacing, Theme } from '@/constants/theme';
import { 
  User, Shield, Bell, Cpu, HelpCircle, 
  ChevronRight, Bot, Zap, Sparkles, Users, Lock, LogOut
} from 'lucide-react-native';

export default function ProfileScreen() {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  const [biometrics, setBiometrics] = React.useState(user?.biometricsEnabled || false);
  const [mfa, setMfa] = React.useState(user?.mfaEnabled || false);
  const [notifications, setNotifications] = React.useState(true);

  const handleToggleBiometrics = (val: boolean) => {
    setBiometrics(val);
    dispatch(updateUserProfile({ biometricsEnabled: val }));
  };

  const handleToggleMfa = (val: boolean) => {
    setMfa(val);
    dispatch(updateUserProfile({ mfaEnabled: val }));
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: () => router.replace('/' as any) }
    ]);
  };

  const handleAdminPanel = () => {
    router.push('/admin' as any);
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Header Card */}
          <GlassCard style={styles.profileHeaderCard} borderColor="rgba(109, 40, 217, 0.35)">
            <View style={styles.profileRow}>
              <View style={styles.avatarLarge}>
                <User color={Theme.colors.accent} size={32} />
              </View>
              <View style={{ flex: 1, marginLeft: Spacing.md }}>
                <ThemedText style={styles.profileName}>{user?.name || 'Developer'}</ThemedText>
                <ThemedText style={styles.profileEmail}>{user?.email || 'hari@synapse.ai'}</ThemedText>
                <View style={styles.roleBadge}>
                  <ThemedText style={styles.roleBadgeText}>{user?.role?.toUpperCase() || 'CREATOR'}</ThemedText>
                </View>
              </View>
            </View>
            <ThemedText style={styles.profileBio}>
              {user?.bio || 'No bio written yet. Customize it in settings.'}
            </ThemedText>
          </GlassCard>

          {/* Module Navigations */}
          <ThemedText style={styles.sectionTitle}>Agent Workspaces</ThemedText>
          <GlassCard style={styles.navGroupCard}>
            <Pressable style={styles.navItem} onPress={() => router.push('/builder' as any)}>
              <Bot size={20} color={Theme.colors.primary} />
              <ThemedText style={styles.navText}>AI Agent Builder</ThemedText>
              <ChevronRight size={16} color={Theme.colors.textMuted} style={styles.chevron} />
            </Pressable>

            <Pressable style={styles.navItem} onPress={() => router.push('/workflow' as any)}>
              <Zap size={20} color={Theme.colors.accent} />
              <ThemedText style={styles.navText}>Workflow Automations</ThemedText>
              <ChevronRight size={16} color={Theme.colors.textMuted} style={styles.chevron} />
            </Pressable>

            <Pressable style={styles.navItem} onPress={() => router.push('/knowledge' as any)}>
              <Sparkles size={20} color="#F59E0B" />
              <ThemedText style={styles.navText}>Knowledge Base Hub</ThemedText>
              <ChevronRight size={16} color={Theme.colors.textMuted} style={styles.chevron} />
            </Pressable>

            <Pressable style={styles.navItem} onPress={() => router.push('/team' as any)}>
              <Users size={20} color="#10B981" />
              <ThemedText style={styles.navText}>Organizations & Teams</ThemedText>
              <ChevronRight size={16} color={Theme.colors.textMuted} style={styles.chevron} />
            </Pressable>
          </GlassCard>

          {/* Security & System Settings */}
          <ThemedText style={styles.sectionTitle}>Security & Settings</ThemedText>
          <GlassCard style={styles.navGroupCard}>
            <View style={styles.switchItem}>
              <View style={styles.switchLabelRow}>
                <Shield size={18} color={Theme.colors.accent} style={{ marginRight: Spacing.sm }} />
                <ThemedText style={styles.switchText}>Biometric Authentication</ThemedText>
              </View>
              <Switch
                value={biometrics}
                onValueChange={handleToggleBiometrics}
                trackColor={{ false: '#1F2937', true: Theme.colors.primary }}
                thumbColor={biometrics ? Theme.colors.accent : '#94A3B8'}
              />
            </View>

            <View style={styles.switchItem}>
              <View style={styles.switchLabelRow}>
                <Lock size={18} color={Theme.colors.primary} style={{ marginRight: Spacing.sm }} />
                <ThemedText style={styles.switchText}>Multi-Factor Auth (MFA)</ThemedText>
              </View>
              <Switch
                value={mfa}
                onValueChange={handleToggleMfa}
                trackColor={{ false: '#1F2937', true: Theme.colors.primary }}
                thumbColor={mfa ? Theme.colors.accent : '#94A3B8'}
              />
            </View>

            <View style={styles.switchItem}>
              <View style={styles.switchLabelRow}>
                <Bell size={18} color="#F59E0B" style={{ marginRight: Spacing.sm }} />
                <ThemedText style={styles.switchText}>Push Notifications</ThemedText>
              </View>
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: '#1F2937', true: Theme.colors.primary }}
                thumbColor={notifications ? Theme.colors.accent : '#94A3B8'}
              />
            </View>
          </GlassCard>

          {/* Admin Controls */}
          <ThemedText style={styles.sectionTitle}>Administrative Management</ThemedText>
          <GlassCard style={styles.navGroupCard}>
            <Pressable style={styles.navItem} onPress={handleAdminPanel}>
              <Cpu size={20} color="#EF4444" />
              <ThemedText style={styles.navText}>Admin Control Center</ThemedText>
              <ChevronRight size={16} color={Theme.colors.textMuted} style={styles.chevron} />
            </Pressable>
          </GlassCard>

          {/* Logout Action */}
          <Pressable style={styles.logoutButton} onPress={handleLogout}>
            <LogOut size={18} color="#EF4444" style={{ marginRight: Spacing.sm }} />
            <ThemedText style={styles.logoutText}>Sign Out Account</ThemedText>
          </Pressable>

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
  profileHeaderCard: {
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarLarge: {
    width: 64,
    height: 64,
    borderRadius: Theme.roundness.full,
    backgroundColor: '#1F2937',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Theme.colors.accent,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Theme.colors.text,
  },
  profileEmail: {
    fontSize: 13,
    color: Theme.colors.textMuted,
    marginTop: 2,
  },
  roleBadge: {
    backgroundColor: 'rgba(6, 182, 212, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Theme.roundness.sm,
    alignSelf: 'flex-start',
    marginTop: Spacing.sm,
  },
  roleBadgeText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: Theme.colors.accent,
  },
  profileBio: {
    fontSize: 13,
    color: Theme.colors.textMuted,
    lineHeight: 18,
    marginTop: Spacing.lg,
    borderTopWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    paddingTop: Spacing.md,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Theme.colors.text,
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
  },
  navGroupCard: {
    padding: 0,
    overflow: 'hidden',
    backgroundColor: Theme.colors.glassBackground,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    borderBottomWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  navText: {
    flex: 1,
    fontSize: 14,
    color: Theme.colors.text,
    marginLeft: Spacing.md,
  },
  chevron: {
    alignSelf: 'center',
  },
  switchItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    borderBottomWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  switchLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchText: {
    fontSize: 14,
    color: Theme.colors.text,
  },
  logoutButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: Theme.roundness.md,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.25)',
    paddingVertical: Spacing.md,
    marginVertical: Spacing.xl,
  },
  logoutText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#EF4444',
  },
});
