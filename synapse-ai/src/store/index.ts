import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserProfile, AIAgent, Conversation, Message, KnowledgeBase, DocumentItem, Workflow, CreatorStats, TeamWorkspace } from '../types';
import { MOCK_AGENTS, MOCK_CONVERSATIONS, MOCK_KNOWLEDGE_BASES, MOCK_DOCUMENTS, MOCK_WORKFLOWS, MOCK_CREATOR_STATS, MOCK_TEAMS } from '../constants/mockData';

// --- AUTH SLICE ---
interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isOnboarded: boolean;
  interestsSelected: string[];
}

const initialAuthState: AuthState = {
  user: {
    id: 'user_123',
    name: 'Hariprasath',
    email: 'hari@synapse.ai',
    role: 'creator',
    bio: 'AI enthusiast & Full Stack Developer building automated pipelines.',
    interests: ['Coding', 'Finance', 'Marketing'],
    mfaEnabled: false,
    biometricsEnabled: true,
  },
  isAuthenticated: true, // Default true for immediate demo capability
  isOnboarded: true,    // Set to true so user sees dashboard first, can reset in settings
  interestsSelected: ['Coding', 'Marketing', 'Finance'],
};

const authSlice = createSlice({
  name: 'auth',
  initialState: initialAuthState,
  reducers: {
    loginSuccess(state, action: PayloadAction<UserProfile>) {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
    },
    setOnboarded(state, action: PayloadAction<boolean>) {
      state.isOnboarded = action.payload;
    },
    updateInterests(state, action: PayloadAction<string[]>) {
      state.interestsSelected = action.payload;
      if (state.user) {
        state.user.interests = action.payload;
      }
    },
    updateUserProfile(state, action: PayloadAction<Partial<UserProfile>>) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    }
  }
});

// --- AGENT SLICE ---
interface AgentState {
  agents: AIAgent[];
  categories: string[];
  selectedCategory: string;
  searchQuery: string;
}

const initialAgentState: AgentState = {
  agents: MOCK_AGENTS,
  categories: ['All', 'Coding', 'Business', 'Education', 'Research', 'Marketing', 'Finance', 'Fitness', 'Healthcare', 'Productivity', 'Legal', 'Startup'],
  selectedCategory: 'All',
  searchQuery: '',
};

const agentSlice = createSlice({
  name: 'agents',
  initialState: initialAgentState,
  reducers: {
    addAgent(state, action: PayloadAction<AIAgent>) {
      state.agents.unshift(action.payload);
    },
    toggleBookmark(state, action: PayloadAction<string>) {
      const agent = state.agents.find(a => a.id === action.payload);
      if (agent) {
        agent.isBookmarked = !agent.isBookmarked;
      }
    },
    setSelectedCategory(state, action: PayloadAction<string>) {
      state.selectedCategory = action.payload;
    },
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    }
  }
});

// --- CHAT SLICE ---
interface ChatState {
  conversations: Conversation[];
  messages: { [conversationId: string]: Message[] };
  isStreaming: boolean;
}

const initialChatState: ChatState = {
  conversations: MOCK_CONVERSATIONS,
  messages: {
    conv_1: [
      { id: 'm1', conversationId: 'conv_1', role: 'user', content: 'Can you help me set up a Kubernetes deployment for a node app?', type: 'text', timestamp: '2:10 PM' },
      { id: 'm2', conversationId: 'conv_1', role: 'assistant', content: 'Certainly! To deploy a Node.js app, you will need a Deployment resource and a Service resource. Here is a baseline Kubernetes config: \n\n```yaml\napiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: node-app\nspec:\n  replicas: 3\n  selector:\n    matchLabels:\n      app: node-app\n  template:\n    metadata:\n      labels:\n        app: node-app\n    spec:\n      containers:\n      - name: node-app\n        image: node:18-alpine\n        ports:\n        - containerPort: 3000\n```\nApply this configuration with `kubectl apply -f deployment.yaml`. Let me know if you need to expose this via an Ingress controller!', type: 'text', timestamp: '2:12 PM' },
      { id: 'm3', conversationId: 'conv_1', role: 'user', content: 'What if I want to scale replicas dynamically?', type: 'text', timestamp: '2:14 PM' },
      { id: 'm4', conversationId: 'conv_1', role: 'assistant', content: 'The Kubernetes Deployment schema issue has been fixed. I updated the replica spec from 1 to 3.', type: 'text', timestamp: '2:15 PM' }
    ],
    conv_2: [
      { id: 'm5', conversationId: 'conv_2', role: 'user', content: 'Write a landing page hook for an AI agent marketplace.', type: 'text', timestamp: 'Yesterday' },
      { id: 'm6', conversationId: 'conv_2', role: 'assistant', content: 'Here are 5 viral headline ideas for your new tech startup launch.', type: 'text', timestamp: 'Yesterday' }
    ]
  },
  isStreaming: false,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState: initialChatState,
  reducers: {
    addMessage(state, action: PayloadAction<Message>) {
      const { conversationId } = action.payload;
      if (!state.messages[conversationId]) {
        state.messages[conversationId] = [];
      }
      state.messages[conversationId].push(action.payload);
      
      // Update last message in conversation list
      const conv = state.conversations.find(c => c.id === conversationId);
      if (conv) {
        conv.lastMessage = action.payload.content;
        conv.updatedAt = 'Just now';
      }
    },
    createConversation(state, action: PayloadAction<Conversation>) {
      if (!state.conversations.some(c => c.id === action.payload.id)) {
        state.conversations.unshift(action.payload);
        state.messages[action.payload.id] = [];
      }
    },
    setStreaming(state, action: PayloadAction<boolean>) {
      state.isStreaming = action.payload;
    },
    togglePin(state, action: PayloadAction<string>) {
      const conv = state.conversations.find(c => c.id === action.payload);
      if (conv) {
        conv.pinned = !conv.pinned;
      }
    },
    clearUnread(state, action: PayloadAction<string>) {
      const conv = state.conversations.find(c => c.id === action.payload);
      if (conv) {
        conv.unreadCount = 0;
      }
    }
  }
});

// --- WORKFLOW & KNOWLEDGE & CREATOR SLICES ---
interface EcosystemState {
  workflows: Workflow[];
  executions: WorkflowExecution[];
  knowledgeBases: KnowledgeBase[];
  documents: DocumentItem[];
  creatorStats: CreatorStats;
  teams: TeamWorkspace[];
}

const initialEcosystemState: EcosystemState = {
  workflows: MOCK_WORKFLOWS,
  executions: [
    {
      id: 'exec_1',
      workflowId: 'work_1',
      workflowName: 'Lead Qualification Bot',
      status: 'success',
      executionTime: '2.4s',
      steps: [
        { name: 'Webhook trigger', status: 'completed' },
        { name: 'FinSafe Agent Analysis', status: 'completed' },
        { name: 'NeuroScribe Auto-Email', status: 'completed' }
      ]
    }
  ],
  knowledgeBases: MOCK_KNOWLEDGE_BASES,
  documents: MOCK_DOCUMENTS,
  creatorStats: MOCK_CREATOR_STATS,
  teams: MOCK_TEAMS,
};

const ecosystemSlice = createSlice({
  name: 'ecosystem',
  initialState: initialEcosystemState,
  reducers: {
    addWorkflow(state, action: PayloadAction<Workflow>) {
      state.workflows.unshift(action.payload);
    },
    toggleWorkflowActive(state, action: PayloadAction<string>) {
      const wf = state.workflows.find(w => w.id === action.payload);
      if (wf) {
        wf.isActive = !wf.isActive;
      }
    },
    addKnowledgeBase(state, action: PayloadAction<KnowledgeBase>) {
      state.knowledgeBases.unshift(action.payload);
    },
    addDocument(state, action: PayloadAction<DocumentItem>) {
      state.documents.push(action.payload);
      const kb = state.knowledgeBases.find(k => k.id === action.payload.kbId);
      if (kb) {
        kb.documentCount += 1;
      }
    },
    updateDocStatus(state, action: PayloadAction<{ id: string; status: DocumentItem['status']; progress: number }>) {
      const doc = state.documents.find(d => d.id === action.payload.id);
      if (doc) {
        doc.status = action.payload.status;
        doc.progress = action.payload.progress;
      }
    },
    addPayoutRequest(state, action: PayloadAction<number>) {
      const today = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
      state.creatorStats.payoutHistory.unshift({
        id: `pay_${Date.now()}`,
        date: today,
        amount: action.payload,
        status: 'pending',
      });
    },
    addTeam(state, action: PayloadAction<TeamWorkspace>) {
      state.teams.unshift(action.payload);
    }
  }
});

// --- STORE EXPORTS ---
export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    agents: agentSlice.reducer,
    chat: chatSlice.reducer,
    ecosystem: ecosystemSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const { loginSuccess, logout, setOnboarded, updateInterests, updateUserProfile } = authSlice.actions;
export const { addAgent, toggleBookmark, setSelectedCategory, setSearchQuery } = agentSlice.actions;
export const { addMessage, createConversation, setStreaming, togglePin, clearUnread } = chatSlice.actions;
export const { addWorkflow, toggleWorkflowActive, addKnowledgeBase, addDocument, updateDocStatus, addPayoutRequest, addTeam } = ecosystemSlice.actions;
