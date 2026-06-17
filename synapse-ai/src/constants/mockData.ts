import { AIAgent, Conversation, KnowledgeBase, DocumentItem, Workflow, CreatorStats, TeamWorkspace } from '../types';

export const MOCK_AGENTS: AIAgent[] = [
  {
    id: 'agent_1',
    name: 'DevOps Architect',
    description: 'Specialist in Kubernetes, CI/CD pipelines, AWS/GCP, and Infrastructure as Code. Ready to debug your YAMLs and Terraform configs.',
    avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&q=80',
    category: 'Coding',
    rating: 4.9,
    reviewsCount: 184,
    usageCount: 14200,
    price: 9.99,
    isSubscription: true,
    creatorId: 'creator_alex',
    creatorName: 'Alex Thorne',
    capabilities: ['Kubernetes Debugging', 'Terraform Generation', 'GitHub Actions Automation', 'Cloud Cost Optimization'],
    knowledgeBases: ['AWS EKS Blueprint', 'Terraform Docs v1.5'],
    tools: ['Terminal Access', 'Web Search', 'GitHub Repo Sync'],
    memoryEnabled: true,
    version: '2.1.0',
    isBookmarked: true,
  },
  {
    id: 'agent_2',
    name: 'NeuroScribe AI',
    description: 'Advanced copywriter and content strategist. Generates viral blog posts, high-converting ad copy, and SEO plans in seconds.',
    avatar: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=150&q=80',
    category: 'Marketing',
    rating: 4.8,
    reviewsCount: 320,
    usageCount: 28400,
    price: 0,
    isSubscription: false,
    creatorId: 'creator_elena',
    creatorName: 'Elena Rostova',
    capabilities: ['SEO Writing', 'Copywriting Formulas', 'Newsletter Design', 'Headline Optimization'],
    knowledgeBases: ['Marketing Playbooks 2026', 'SEO Best Practices'],
    tools: ['Web Search', 'Grammar Checker'],
    memoryEnabled: true,
    version: '1.4.2',
    isBookmarked: false,
  },
  {
    id: 'agent_3',
    name: 'FinSafe Analyst',
    description: 'Expert financial analyst for market prediction, portfolio optimization, tax strategies, and detailed financial modeling.',
    avatar: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=150&q=80',
    category: 'Finance',
    rating: 4.7,
    reviewsCount: 92,
    usageCount: 5200,
    price: 29.99,
    isSubscription: true,
    creatorId: 'creator_marcus',
    creatorName: 'Marcus Sterling',
    capabilities: ['Portfolio Analytics', 'DCF Valuation Modeling', 'Tax Optimization', 'Macro Trend Reports'],
    knowledgeBases: ['US Tax Code 2026', 'SEC Filings Library'],
    tools: ['Live Stock Feed', 'Calculator Engine'],
    memoryEnabled: false,
    version: '1.0.5',
    isBookmarked: true,
  },
  {
    id: 'agent_4',
    name: 'LegalShield Guide',
    description: 'Analyzes legal documents, flags high-risk clauses, generates NDA drafts, and answers compliance queries instantly.',
    avatar: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=150&q=80',
    category: 'Legal',
    rating: 4.6,
    reviewsCount: 114,
    usageCount: 8900,
    price: 14.99,
    isSubscription: false,
    creatorId: 'creator_sarah',
    creatorName: 'Sarah Jenkins, Esq.',
    capabilities: ['Contract Review', 'Risk Assessment', 'NDA Creation', 'Compliance Verification'],
    knowledgeBases: ['Standard Contract Boilerplates', 'GDPR Guidelines'],
    tools: ['Document Analysis', 'Regulatory Web Check'],
    memoryEnabled: true,
    version: '3.0.1',
    isBookmarked: false,
  },
  {
    id: 'agent_5',
    name: 'BioFit Coach',
    description: 'AI Personal Trainer and nutritionist. Creates customized workout routines, food diaries, and monitors sleep metrics.',
    avatar: 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=150&q=80',
    category: 'Fitness',
    rating: 4.9,
    reviewsCount: 201,
    usageCount: 16800,
    price: 0,
    isSubscription: false,
    creatorId: 'creator_coach_k',
    creatorName: 'Coach K-Fit',
    capabilities: ['Meal Planning', 'Weight Training Guides', 'Calorie Counter', 'Heart Rate Analysis'],
    knowledgeBases: ['Nutrition Science Standard v2'],
    tools: ['Health App Sync', 'Recipe Parser'],
    memoryEnabled: true,
    version: '2.0.4',
    isBookmarked: false,
  }
];

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv_1',
    agentId: 'agent_1',
    agentName: 'DevOps Architect',
    agentAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&q=80',
    lastMessage: 'The Kubernetes Deployment schema issue has been fixed. I updated the replica spec from 1 to 3.',
    unreadCount: 0,
    updatedAt: '2:15 PM',
    pinned: true,
  },
  {
    id: 'conv_2',
    agentId: 'agent_2',
    agentName: 'NeuroScribe AI',
    agentAvatar: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=150&q=80',
    lastMessage: 'Here are 5 viral headline ideas for your new tech startup launch.',
    unreadCount: 2,
    updatedAt: 'Yesterday',
  },
  {
    id: 'conv_3',
    agentId: 'agent_3',
    agentName: 'FinSafe Analyst',
    agentAvatar: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=150&q=80',
    lastMessage: 'Your annual savings projection table is ready. Feel free to view the spreadsheet attachment.',
    unreadCount: 0,
    updatedAt: 'Jun 15',
  }
];

export const MOCK_KNOWLEDGE_BASES: KnowledgeBase[] = [
  {
    id: 'kb_1',
    name: 'E-Commerce Marketing Strategy',
    description: 'Contains PDF blueprints for scaling DTC brands to $10M ARR.',
    documentCount: 4,
    size: '12.4 MB',
    status: 'ready',
    pineconeSync: true,
    createdAt: '2026-04-12',
  },
  {
    id: 'kb_2',
    name: 'TypeScript Architectural Specs',
    description: 'Corporate coding guidelines and component library patterns.',
    documentCount: 2,
    size: '3.1 MB',
    status: 'processing',
    pineconeSync: false,
    createdAt: '2026-06-15',
  }
];

export const MOCK_DOCUMENTS: DocumentItem[] = [
  {
    id: 'doc_1',
    kbId: 'kb_1',
    name: 'FB_Ads_Scaling_Handbook.pdf',
    size: '4.8 MB',
    type: 'pdf',
    status: 'indexed',
    progress: 100,
  },
  {
    id: 'doc_2',
    kbId: 'kb_1',
    name: 'SEO_Keywords_2026.csv',
    size: '2.1 MB',
    type: 'csv',
    status: 'indexed',
    progress: 100,
  },
  {
    id: 'doc_3',
    kbId: 'kb_2',
    name: 'Enterprise_Hooks_Structure.md',
    size: '850 KB',
    type: 'md',
    status: 'embedding',
    progress: 75,
  }
];

export const MOCK_WORKFLOWS: Workflow[] = [
  {
    id: 'work_1',
    name: 'Lead Qualification Bot',
    description: 'Qualifies contacts from webhooks, routes them via DevOps bot to Slack, and writes summary.',
    trigger: 'Webhook Received (Stripe Pay)',
    actionCount: 3,
    isActive: true,
    lastExecuted: '10 mins ago',
    nodes: [
      { id: '1', label: 'Stripe Purchase Webhook', type: 'trigger' },
      { id: '2', label: 'FinSafe Agent Analysis', type: 'action', agentId: 'agent_3' },
      { id: '3', label: 'NeuroScribe Auto-Email Generator', type: 'action', agentId: 'agent_2' }
    ]
  },
  {
    id: 'work_2',
    name: 'Automated PR Reviewer',
    description: 'Triggers when a GitHub PR is opened. Reviews code quality, syntax, and comments.',
    trigger: 'GitHub Pull Request Opened',
    actionCount: 2,
    isActive: false,
    lastExecuted: '2 days ago',
    nodes: [
      { id: '1', label: 'GitHub PR Webhook', type: 'trigger' },
      { id: '2', label: 'DevOps Architect Audit', type: 'action', agentId: 'agent_1' }
    ]
  }
];

export const MOCK_CREATOR_STATS: CreatorStats = {
  totalRevenue: 24890.50,
  subscribersCount: 840,
  activeUsersCount: 3200,
  conversationCount: 14900,
  growthRate: 18.5,
  revenueHistory: [
    { month: 'Jan', amount: 1800 },
    { month: 'Feb', amount: 2200 },
    { month: 'Mar', amount: 3100 },
    { month: 'Apr', amount: 4800 },
    { month: 'May', amount: 6200 },
    { month: 'Jun', amount: 6790.50 }
  ],
  payoutHistory: [
    { id: 'pay_1', date: 'Jun 01, 2026', amount: 5200.00, status: 'completed' },
    { id: 'pay_2', date: 'May 01, 2026', amount: 4100.00, status: 'completed' },
    { id: 'pay_3', date: 'Jul 01, 2026', amount: 6500.00, status: 'pending' }
  ]
};

export const MOCK_TEAMS: TeamWorkspace[] = [
  {
    id: 'team_1',
    name: 'Synapse Enterprise R&D',
    membersCount: 12,
    agentsCount: 4,
    workflowsCount: 3,
    role: 'admin',
  },
  {
    id: 'team_2',
    name: 'Marketing Launch Squad',
    membersCount: 5,
    agentsCount: 2,
    workflowsCount: 1,
    role: 'editor',
  }
];
