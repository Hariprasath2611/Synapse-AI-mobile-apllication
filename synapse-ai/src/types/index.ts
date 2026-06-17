export type UserRole = 'user' | 'creator' | 'business' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  bio?: string;
  interests?: string[];
  mfaEnabled?: boolean;
  biometricsEnabled?: boolean;
}

export interface AIAgent {
  id: string;
  name: string;
  description: string;
  avatar: string;
  category: string;
  rating: number;
  reviewsCount: number;
  usageCount: number;
  price: number; // 0 for free
  isSubscription: boolean;
  creatorId: string;
  creatorName: string;
  creatorAvatar?: string;
  capabilities: string[];
  knowledgeBases: string[];
  tools: string[];
  memoryEnabled: boolean;
  version: string;
  isBookmarked?: boolean;
}

export interface AgentVersion {
  id: string;
  agentId: string;
  version: string;
  instructions: string;
  changelog: string;
  createdAt: string;
}

export interface Conversation {
  id: string;
  agentId: string;
  agentName: string;
  agentAvatar: string;
  lastMessage: string;
  unreadCount: number;
  updatedAt: string;
  pinned?: boolean;
}

export interface Message {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant';
  content: string;
  type: 'text' | 'image' | 'voice' | 'document';
  mediaUrl?: string;
  timestamp: string;
  isStreaming?: boolean;
}

export interface KnowledgeBase {
  id: string;
  name: string;
  description: string;
  documentCount: number;
  size: string;
  status: 'processing' | 'ready' | 'failed';
  pineconeSync: boolean;
  createdAt: string;
}

export interface DocumentItem {
  id: string;
  kbId: string;
  name: string;
  size: string;
  type: 'pdf' | 'docx' | 'txt' | 'csv' | 'md';
  status: 'uploading' | 'chunking' | 'embedding' | 'indexed' | 'failed';
  progress: number; // 0 - 100
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  trigger: string;
  actionCount: number;
  isActive: boolean;
  lastExecuted?: string;
  nodes: WorkflowNode[];
}

export interface WorkflowNode {
  id: string;
  label: string;
  type: 'trigger' | 'action' | 'condition';
  agentId?: string;
}

export interface WorkflowExecution {
  id: string;
  workflowId: string;
  workflowName: string;
  status: 'success' | 'failed' | 'running';
  executionTime: string;
  steps: { name: string; status: 'completed' | 'failed'; message?: string }[];
}

export interface CreatorStats {
  totalRevenue: number;
  subscribersCount: number;
  activeUsersCount: number;
  conversationCount: number;
  growthRate: number;
  revenueHistory: { month: string; amount: number }[];
  payoutHistory: { id: string; date: string; amount: number; status: 'completed' | 'pending' }[];
}

export interface TeamWorkspace {
  id: string;
  name: string;
  membersCount: number;
  agentsCount: number;
  workflowsCount: number;
  role: 'admin' | 'editor' | 'viewer';
}
