import React from 'react';
import { StyleSheet, View, ScrollView, Pressable, TextInput, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { GlassCard } from '@/components/GlassCard';
import { RootState, addPayoutRequest } from '@/store';
import { BottomTabInset, Spacing, Theme } from '@/constants/theme';
import Svg, { Rect, Path, Circle } from 'react-native-svg';
import { DollarSign, Users, Award, TrendingUp, AlertTriangle } from 'lucide-react-native';

export default function CreatorDashboardScreen() {
  const dispatch = useDispatch();
  const { creatorStats } = useSelector((state: RootState) => state.ecosystem);
  const [payoutAmount, setPayoutAmount] = React.useState('');
  
  // Calculate max withdrawable
  const pendingPayouts = creatorStats.payoutHistory
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);
  const completedPayouts = creatorStats.payoutHistory
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);
  
  const withdrawableAmount = creatorStats.totalRevenue - completedPayouts - pendingPayouts;

  const handleRequestPayout = () => {
    const amt = parseFloat(payoutAmount);
    if (isNaN(amt) || amt <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid payout amount.');
      return;
    }
    if (amt > withdrawableAmount) {
      Alert.alert('Insufficient Balance', 'You cannot request more than your withdrawable balance.');
      return;
    }
    
    dispatch(addPayoutRequest(amt));
    setPayoutAmount('');
    Alert.alert('Success', `Payout request for $${amt.toFixed(2)} has been submitted!`);
  };

  // Simple SVG Line Chart generator
  const renderChart = () => {
    const data = creatorStats.revenueHistory;
    const maxVal = Math.max(...data.map(d => d.amount));
    const minVal = Math.min(...data.map(d => d.amount));
    const range = maxVal - minVal;
    
    const chartHeight = 120;
    const chartWidth = 300;
    const padding = 15;
    
    const points = data.map((d, index) => {
      const x = padding + (index * (chartWidth - padding * 2)) / (data.length - 1);
      const y = chartHeight - padding - ((d.amount - minVal) * (chartHeight - padding * 2)) / range;
      return { x, y };
    });

    const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    
    // Gradient fill path
    const fillPath = `${linePath} L ${points[points.length - 1].x} ${chartHeight - padding} L ${points[0].x} ${chartHeight - padding} Z`;

    return (
      <View style={styles.chartWrapper}>
        <Svg height={chartHeight} width="100%" viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
          {/* Grid lines */}
          <Path d={`M ${padding} ${chartHeight - padding} L ${chartWidth - padding} ${chartHeight - padding}`} stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
          <Path d={`M ${padding} ${padding} L ${chartWidth - padding} ${padding}`} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
          
          {/* Gradient Fill under the line */}
          <Path d={fillPath} fill="rgba(109, 40, 217, 0.15)" />

          {/* Sparkline */}
          <Path d={linePath} fill="none" stroke={Theme.colors.primary} strokeWidth="3" />

          {/* Data Nodes */}
          {points.map((p, i) => (
            <Circle key={i} cx={p.cx ?? p.x} cy={p.cy ?? p.y} r="4" fill={Theme.colors.accent} />
          ))}
        </Svg>
        <View style={styles.chartLabels}>
          {data.map((d, i) => (
            <ThemedText key={i} style={styles.chartLabelText}>{d.month}</ThemedText>
          ))}
        </View>
      </View>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Title */}
          <View style={styles.header}>
            <ThemedText style={styles.titleText}>Creator Dashboard</ThemedText>
            <ThemedText style={styles.subtitleText}>Manage your agent business & payouts</ThemedText>
          </View>

          {/* Grid Stats */}
          <View style={styles.statsGrid}>
            <GlassCard style={styles.statCard} borderColor="rgba(109, 40, 217, 0.2)">
              <DollarSign size={20} color={Theme.colors.primary} />
              <ThemedText style={styles.statVal}>${creatorStats.totalRevenue.toLocaleString()}</ThemedText>
              <ThemedText style={styles.statLabel}>Total Earnings</ThemedText>
            </GlassCard>

            <GlassCard style={styles.statCard} borderColor="rgba(6, 182, 212, 0.2)">
              <Users size={20} color={Theme.colors.accent} />
              <ThemedText style={styles.statVal}>{creatorStats.subscribersCount}</ThemedText>
              <ThemedText style={styles.statLabel}>Active Subs</ThemedText>
            </GlassCard>
            
            <GlassCard style={styles.statCard}>
              <Award size={20} color="#F59E0B" />
              <ThemedText style={styles.statVal}>{creatorStats.activeUsersCount}</ThemedText>
              <ThemedText style={styles.statLabel}>Monthly Users</ThemedText>
            </GlassCard>

            <GlassCard style={styles.statCard}>
              <TrendingUp size={20} color="#10B981" />
              <ThemedText style={styles.statVal}>+{creatorStats.growthRate}%</ThemedText>
              <ThemedText style={styles.statLabel}>Growth Rate</ThemedText>
            </GlassCard>
          </View>

          {/* Chart Section */}
          <ThemedText style={styles.sectionTitle}>Revenue Trend (6 months)</ThemedText>
          <GlassCard style={styles.chartCard}>
            {renderChart()}
          </GlassCard>

          {/* Payout Workspace */}
          <ThemedText style={styles.sectionTitle}>Withdraw Earnings</ThemedText>
          <GlassCard style={styles.payoutCard} borderColor="rgba(245, 158, 11, 0.3)">
            <View style={styles.payoutHeader}>
              <View>
                <ThemedText style={styles.withdrawableLabel}>Withdrawable Balance</ThemedText>
                <ThemedText style={styles.withdrawableVal}>${withdrawableAmount.toFixed(2)}</ThemedText>
              </View>
              {pendingPayouts > 0 && (
                <View style={styles.pendingBadge}>
                  <ThemedText style={styles.pendingBadgeText}>${pendingPayouts.toFixed(2)} Pending</ThemedText>
                </View>
              )}
            </View>

            <View style={styles.payoutForm}>
              <TextInput
                style={styles.payoutInput}
                placeholder="Enter amount to withdraw ($)"
                placeholderTextColor={Theme.colors.textMuted}
                keyboardType="numeric"
                value={payoutAmount}
                onChangeText={setPayoutAmount}
              />
              <Pressable style={styles.payoutButton} onPress={handleRequestPayout}>
                <ThemedText style={styles.payoutButtonText}>Request</ThemedText>
              </Pressable>
            </View>
            <View style={styles.alertRow}>
              <AlertTriangle size={12} color="#F59E0B" style={{ marginRight: 6 }} />
              <ThemedText style={styles.alertText}>Payouts process via Stripe/Razorpay within 3 business days.</ThemedText>
            </View>
          </GlassCard>

          {/* History */}
          <ThemedText style={styles.sectionTitle}>Payout History</ThemedText>
          {creatorStats.payoutHistory.map((payout) => (
            <GlassCard key={payout.id} style={styles.historyCard}>
              <View style={styles.historyRow}>
                <View>
                  <ThemedText style={styles.historyDate}>{payout.date}</ThemedText>
                  <ThemedText style={styles.historyId}>{payout.id}</ThemedText>
                </View>
                <View style={{ alignItems: 'end' }}>
                  <ThemedText style={styles.historyAmount}>${payout.amount.toFixed(2)}</ThemedText>
                  <View style={[
                    styles.statusBadge,
                    payout.status === 'completed' ? styles.statusCompleted : styles.statusPending
                  ]}>
                    <ThemedText style={[
                      styles.statusText,
                      payout.status === 'completed' ? styles.statusTextCompleted : styles.statusTextPending
                    ]}>
                      {payout.status}
                    </ThemedText>
                  </View>
                </View>
              </View>
            </GlassCard>
          ))}

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
    marginBottom: Spacing.lg,
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -Spacing.xs,
    marginBottom: Spacing.md,
  },
  statCard: {
    width: '50%',
    padding: Spacing.md,
    paddingVertical: Spacing.lg,
    marginVertical: Spacing.xs,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  statVal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Theme.colors.text,
    marginTop: Spacing.sm,
  },
  statLabel: {
    fontSize: 11,
    color: Theme.colors.textMuted,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Theme.colors.text,
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
  },
  chartCard: {
    padding: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartWrapper: {
    width: '100%',
    alignItems: 'center',
  },
  chartLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginTop: Spacing.sm,
  },
  chartLabelText: {
    fontSize: 10,
    color: Theme.colors.textMuted,
  },
  payoutCard: {
    padding: Spacing.lg,
  },
  payoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  withdrawableLabel: {
    fontSize: 11,
    color: Theme.colors.textMuted,
  },
  withdrawableVal: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Theme.colors.text,
    marginTop: 4,
  },
  pendingBadge: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Theme.roundness.sm,
  },
  pendingBadgeText: {
    fontSize: 11,
    color: '#F59E0B',
    fontWeight: '600',
  },
  payoutForm: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  payoutInput: {
    flex: 1,
    backgroundColor: '#0B1120',
    borderRadius: Theme.roundness.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    color: Theme.colors.text,
    paddingHorizontal: Spacing.md,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
  },
  payoutButton: {
    backgroundColor: Theme.colors.primary,
    borderRadius: Theme.roundness.md,
    paddingHorizontal: Spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  payoutButtonText: {
    color: Theme.colors.text,
    fontWeight: 'bold',
    fontSize: 13,
  },
  alertRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  alertText: {
    fontSize: 10,
    color: Theme.colors.textMuted,
  },
  historyCard: {
    padding: Spacing.md,
    marginVertical: Spacing.xs,
  },
  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyDate: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Theme.colors.text,
  },
  historyId: {
    fontSize: 11,
    color: Theme.colors.textMuted,
    marginTop: 2,
  },
  historyAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Theme.colors.text,
    textAlign: 'right',
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Theme.roundness.sm,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  statusCompleted: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
  },
  statusPending: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
  },
  statusText: {
    fontSize: 9,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  statusTextCompleted: {
    color: '#10B981',
  },
  statusTextPending: {
    color: '#F59E0B',
  },
});
