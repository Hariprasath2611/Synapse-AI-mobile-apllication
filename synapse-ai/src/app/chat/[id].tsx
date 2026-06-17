import React from 'react';
import { StyleSheet, View, ScrollView, TextInput, Pressable, Image, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { useSelector, useDispatch } from 'react-redux';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { GlassCard } from '@/components/GlassCard';
import { RootState, addMessage, setStreaming } from '@/store';
import { Spacing, Theme } from '@/constants/theme';
import { ChevronLeft, Send, Mic, Paperclip, AlertCircle, Bot, User, Volume2, VolumeX } from 'lucide-react-native';

export default function ChatSessionScreen() {
  const dispatch = useDispatch();
  const { id } = useLocalSearchParams();
  const { agents } = useSelector((state: RootState) => state.agents);
  const { messages, isStreaming } = useSelector((state: RootState) => state.chat);
  
  const agent = agents.find(a => a.id === id);
  const conversationId = `conv_${id}`;
  const sessionMessages = messages[conversationId] || [];

  const [input, setInput] = React.useState('');
  const [ttsActive, setTtsActive] = React.useState(false);
  const scrollViewRef = React.useRef<ScrollView>(null);

  React.useEffect(() => {
    // Scroll to bottom on load or new messages
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 200);
  }, [sessionMessages.length, isStreaming]);

  if (!agent) {
    return (
      <ThemedView style={styles.container}>
        <SafeAreaView style={styles.errorContainer}>
          <ActivityIndicator size="large" color={Theme.colors.primary} />
          <ThemedText style={{ marginTop: Spacing.md }}>Initializing Chat Node...</ThemedText>
        </SafeAreaView>
      </ThemedView>
    );
  }

  const handleSendMessage = () => {
    if (!input.trim() || isStreaming) return;

    const userMessageId = `msg_${Date.now()}`;
    const userMsg = {
      id: userMessageId,
      conversationId,
      role: 'user' as const,
      content: input.trim(),
      type: 'text' as const,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    dispatch(addMessage(userMsg));
    setInput('');
    dispatch(setStreaming(true));

    // Simulate Agent response streaming
    setTimeout(() => {
      simulateAgentResponse(userMsg.content);
    }, 1200);
  };

  const simulateAgentResponse = (userQuery: string) => {
    let reply = '';
    const queryLower = userQuery.toLowerCase();

    // Custom matching context for special agents
    if (agent.id === 'agent_1') { // DevOps Architect
      if (queryLower.includes('kubernetes') || queryLower.includes('k8s') || queryLower.includes('deployment')) {
        reply = 'I reviewed your spec. Try scaling replicas dynamically:\n```bash\nkubectl scale deployment node-app --replicas=5\n```\nAlso check your NodePort boundaries to prevent subnet blocking.';
      } else {
        reply = 'Understood. DevOps system metrics are normal. Ready to inspect your CI/CD configuration files, YAML specs, or Dockerfiles.';
      }
    } else if (agent.id === 'agent_2') { // NeuroScribe
      if (queryLower.includes('headline') || queryLower.includes('hook') || queryLower.includes('marketing')) {
        reply = 'Here is a high-converting landing page structure:\n\n**Header Hook:** "Synthesize Your Workflows with Autonomous Agent Swarms."\n**Sub-header:** "Deploy self-learning agent layers. Scale from 0 to enterprise automation in minutes."';
      } else {
        reply = 'Understood. Copywriting algorithms are active. Describe your target audience, tone, or campaign metrics.';
      }
    } else if (agent.id === 'agent_3') { // FinSafe
      if (queryLower.includes('tax') || queryLower.includes('save') || queryLower.includes('model')) {
        reply = 'Based on tax rules: standard deduction structures allow custom 1099 optimizations when routing payouts to a LLC ledger. Shall we run a 10-year discount cash flow projection?';
      } else {
        reply = 'FinSafe analysis terminal online. I can compute portfolio metrics, tax allocations, or DCF projections.';
      }
    } else {
      reply = `Hello! I am ${agent.name}. I have loaded my knowledge base and configured tools. How can I assist you with your project tasks today?`;
    }

    const words = reply.split(' ');
    let currentText = '';
    let wordIndex = 0;

    const assistantMsgId = `msg_${Date.now() + 1}`;
    
    // Setup initial empty assistant message
    const emptyAssistantMsg = {
      id: assistantMsgId,
      conversationId,
      role: 'assistant' as const,
      content: '',
      type: 'text' as const,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isStreaming: true,
    };
    dispatch(addMessage(emptyAssistantMsg));

    const interval = setInterval(() => {
      if (wordIndex < words.length) {
        currentText += (wordIndex === 0 ? '' : ' ') + words[wordIndex];
        dispatch(addMessage({
          ...emptyAssistantMsg,
          content: currentText,
        }));
        wordIndex++;
      } else {
        clearInterval(interval);
        dispatch(addMessage({
          ...emptyAssistantMsg,
          content: currentText,
          isStreaming: false,
        }));
        dispatch(setStreaming(false));
      }
    }, 80);
  };

  const handleVoiceInput = () => {
    setInput('Simulated Speech-to-Text translation input');
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.headerButton}>
            <ChevronLeft size={20} color={Theme.colors.text} />
          </Pressable>
          <View style={styles.headerTitleContainer}>
            <Image source={{ uri: agent.avatar }} style={styles.headerAvatar} />
            <View>
              <ThemedText style={styles.headerName}>{agent.name}</ThemedText>
              <ThemedText style={styles.headerStatus}>
                {isStreaming ? 'Streaming response...' : 'Online • Synapse Node'}
              </ThemedText>
            </View>
          </View>
          <Pressable onPress={() => setTtsActive(!ttsActive)} style={styles.headerButton}>
            {ttsActive ? (
              <Volume2 size={20} color={Theme.colors.accent} />
            ) : (
              <VolumeX size={20} color={Theme.colors.textMuted} />
            )}
          </Pressable>
        </View>

        {/* Messaging Area */}
        <KeyboardAvoidingView 
          style={{ flex: 1 }} 
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
          <ScrollView 
            ref={scrollViewRef}
            contentContainerStyle={styles.messageList}
            showsVerticalScrollIndicator={false}
          >
            {sessionMessages.length === 0 ? (
              <View style={styles.welcomeBox}>
                <Image source={{ uri: agent.avatar }} style={styles.welcomeAvatar} />
                <ThemedText style={styles.welcomeTitle}>Session Connected</ThemedText>
                <ThemedText style={styles.welcomeDesc}>
                  You are communicating directly with **{agent.name}** (v{agent.version}). Ask a question to begin computing instructions.
                </ThemedText>
              </View>
            ) : (
              sessionMessages.map((msg, index) => {
                const isUser = msg.role === 'user';
                return (
                  <View 
                    key={msg.id || index} 
                    style={[
                      styles.messageRow,
                      isUser ? styles.userRow : styles.assistantRow
                    ]}
                  >
                    {!isUser && (
                      <View style={styles.chatIconWrapper}>
                        <Bot size={16} color={Theme.colors.accent} />
                      </View>
                    )}
                    
                    <View style={[
                      styles.bubble,
                      isUser ? styles.userBubble : styles.assistantBubble
                    ]}>
                      <ThemedText style={styles.messageContent}>{msg.content}</ThemedText>
                      <ThemedText style={styles.messageTime}>{msg.timestamp}</ThemedText>
                    </View>

                    {isUser && (
                      <View style={[styles.chatIconWrapper, styles.userIconWrapper]}>
                        <User size={16} color="#0B1120" />
                      </View>
                    )}
                  </View>
                );
              })
            )}

            {isStreaming && (
              <View style={styles.loadingRow}>
                <ActivityIndicator size="small" color={Theme.colors.accent} />
                <ThemedText style={styles.loadingText}>Computing weights...</ThemedText>
              </View>
            )}
          </ScrollView>

          {/* Action Input Panel */}
          <GlassCard style={styles.inputCard}>
            <View style={styles.inputRow}>
              <Pressable style={styles.iconButton}>
                <Paperclip size={20} color={Theme.colors.textMuted} />
              </Pressable>
              
              <TextInput
                style={styles.textInput}
                placeholder={`Message ${agent.name}...`}
                placeholderTextColor={Theme.colors.textMuted}
                value={input}
                onChangeText={setInput}
                editable={!isStreaming}
                onSubmitEditing={handleSendMessage}
              />

              <Pressable style={styles.iconButton} onPress={handleVoiceInput}>
                <Mic size={20} color={Theme.colors.accent} />
              </Pressable>

              <Pressable 
                style={[
                  styles.sendButton,
                  (!input.trim() || isStreaming) && styles.sendButtonDisabled
                ]} 
                onPress={handleSendMessage}
                disabled={!input.trim() || isStreaming}
              >
                <Send size={16} color={(!input.trim() || isStreaming) ? '#475569' : '#0B1120'} />
              </Pressable>
            </View>
          </GlassCard>
        </KeyboardAvoidingView>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: Spacing.md,
  },
  headerAvatar: {
    width: 36,
    height: 36,
    borderRadius: Theme.roundness.md,
    backgroundColor: Theme.colors.card,
    marginRight: Spacing.md,
  },
  headerName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Theme.colors.text,
  },
  headerStatus: {
    fontSize: 10,
    color: Theme.colors.accent,
    marginTop: 2,
  },
  messageList: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  welcomeBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxl,
    paddingHorizontal: Spacing.xl,
    marginVertical: Spacing.xxl,
  },
  welcomeAvatar: {
    width: 70,
    height: 70,
    borderRadius: Theme.roundness.md,
    backgroundColor: Theme.colors.card,
    marginBottom: Spacing.lg,
  },
  welcomeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Theme.colors.text,
    marginBottom: Spacing.sm,
  },
  welcomeDesc: {
    fontSize: 13,
    color: Theme.colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
  messageRow: {
    flexDirection: 'row',
    marginVertical: Spacing.sm,
    maxWidth: '85%',
  },
  userRow: {
    alignSelf: 'flex-end',
    justifyContent: 'flex-end',
  },
  assistantRow: {
    alignSelf: 'flex-start',
    justifyContent: 'flex-start',
  },
  chatIconWrapper: {
    width: 28,
    height: 28,
    borderRadius: Theme.roundness.full,
    backgroundColor: 'rgba(99, 102, 241, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
    alignSelf: 'flex-end',
  },
  userIconWrapper: {
    backgroundColor: Theme.colors.accent,
    marginRight: 0,
    marginLeft: Spacing.sm,
  },
  bubble: {
    padding: Spacing.md,
    borderRadius: Theme.roundness.md,
    borderWidth: 0.5,
  },
  userBubble: {
    backgroundColor: Theme.colors.primary,
    borderColor: 'rgba(109, 40, 217, 0.4)',
    borderBottomRightRadius: 2,
  },
  assistantBubble: {
    backgroundColor: Theme.colors.card,
    borderColor: Theme.colors.cardBorder,
    borderBottomLeftRadius: 2,
  },
  messageContent: {
    fontSize: 13.5,
    color: Theme.colors.text,
    lineHeight: 20,
  },
  messageTime: {
    fontSize: 9,
    color: Theme.colors.textMuted,
    alignSelf: 'flex-end',
    marginTop: 6,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.md,
    alignSelf: 'flex-start',
    marginLeft: 36,
  },
  loadingText: {
    fontSize: 12,
    color: Theme.colors.textMuted,
    marginLeft: Spacing.sm,
  },
  inputCard: {
    margin: Spacing.md,
    padding: Spacing.xs,
    borderRadius: Theme.roundness.xl,
    backgroundColor: 'rgba(17, 24, 39, 0.95)',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: Spacing.md,
  },
  textInput: {
    flex: 1,
    color: Theme.colors.text,
    fontSize: 14,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
  },
  sendButton: {
    backgroundColor: Theme.colors.accent,
    width: 36,
    height: 36,
    borderRadius: Theme.roundness.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 4,
  },
  sendButtonDisabled: {
    backgroundColor: '#334155',
  },
});
