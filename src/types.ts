export type NavSection = 'home' | 'team' | 'meetings' | 'meeting-detail' | 'deals' | 'accounts' | 'account-detail' | 'tasks' | 'notifications' | 'settings' | 'profile';

export type ThemeSetting = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

export type DealStage = 'Prospecting' | 'Qualification' | 'Proposal' | 'Negotiation' | 'Closed Won';

export type HealthStatus = 'Healthy' | 'Needs attention' | 'At risk' | 'Inactive';

export type TaskPriority = 'High' | 'Medium' | 'Low';

export type TaskSource = 'AI Suggested' | 'Manager' | 'Manual';

export interface UserProfile {
  id: string;
  name: string;
  role: string;
  title: string;
  avatar: string;
  email: string;
  company: string;
}

export interface TeamMember {
  id: string;
  name: string;
  title: string;
  avatar: string;
  email: string;
  quotaTarget: number;
  quotaClosed: number;
  pipelineValue: number;
  winRate: number;
  callsAnalyzed: number;
  avgTalkRatio: number; // e.g. 48
  coachingScore: number; // e.g. 92
  topStrength: string;
  coachingNeed: string;
  recentDeal: string;
  activeDealsCount: number;
}

export interface Participant {
  name: string;
  role: string;
  avatar: string;
  talkRatio: number; // percentage
  company?: string;
}

export interface KeySignal {
  id: string;
  text: string;
  type: 'positive' | 'neutral' | 'concern' | 'action';
}

export interface MeetingTask {
  id: string;
  text: string;
  owner: string;
  date: string;
  completed: boolean;
}

export interface ManagerFeedbackItem {
  id: string;
  author: string;
  avatar: string;
  text: string;
  timestamp: string; // e.g. "14:32"
  targetTimeSec: number;
}

export interface TranscriptLine {
  id: string;
  speaker: string;
  avatar?: string;
  time: string;
  timestampSec: number;
  text: string;
  highlightType?: 'question' | 'pricing' | 'objection' | 'competitor' | 'next-step' | 'none';
  hasFeedback?: boolean;
}

export interface CoachingData {
  strengths: string[];
  improvements: string[];
  metrics: {
    talkListenRatio: string; // "48% / 52%"
    repTalkPercent: number;
    questionsAsked: number;
    longestMonologue: string;
    repPaceWpm: number;
    patienceScore: string;
  };
  aiCoachingMoments: {
    id: string;
    title: string;
    timestamp: string;
    timestampSec: number;
    observation: string;
    recommendation: string;
  }[];
  managerComments: {
    id: string;
    author: string;
    avatar: string;
    date: string;
    comment: string;
  }[];
}

export interface Meeting {
  id: string;
  title: string;
  accountName: string;
  accountId: string;
  date: string;
  time: string;
  duration: string;
  durationSec: number;
  participants: Participant[];
  status: 'Analysis ready' | 'Feedback' | 'Scheduled' | 'Analyzing';
  linkedDealId?: string;
  linkedDealName?: string;
  summaryBullets: string[];
  keySignals: KeySignal[];
  nextSteps: MeetingTask[];
  managerFeedback?: ManagerFeedbackItem[];
  dealImpact: {
    stage: DealStage;
    probability: number;
    health: HealthStatus;
    nextMilestone: string;
  };
  transcript: TranscriptLine[];
  coaching: CoachingData;
}

export interface Deal {
  id: string;
  name: string;
  accountName: string;
  accountId: string;
  industry: string;
  stage: DealStage;
  value: number;
  owner: {
    name: string;
    avatar: string;
  };
  lastActivity: string;
  nextStep: {
    title: string;
    date: string;
  };
  health: HealthStatus;
  probability: number;
  createdAt: string;
}

export interface AccountContact {
  id: string;
  name: string;
  role: 'Decision maker' | 'Champion' | 'Procurement' | 'End user' | 'Executive Sponsor' | 'Technical Lead';
  email: string;
  avatar: string;
  phone?: string;
}

export interface AccountActivity {
  id: string;
  type: 'meeting' | 'proposal' | 'note' | 'call' | 'task';
  title: string;
  description: string;
  time: string;
  author: string;
}

export interface Account {
  id: string;
  name: string;
  industry: string;
  initial: string;
  openDealsCount: number;
  pipelineValue: number;
  lastContact: string;
  status: HealthStatus;
  primaryContact: {
    name: string;
    role: string;
    email: string;
  };
  owner: {
    name: string;
    avatar: string;
  };
  contacts: AccountContact[];
  activities: AccountActivity[];
  connectedDeals: {
    id: string;
    name: string;
    stage: DealStage;
    value: number;
    health: HealthStatus;
  }[];
  openTasks: {
    id: string;
    title: string;
    due: string;
    priority: TaskPriority;
    completed: boolean;
  }[];
}

export interface TaskItem {
  id: string;
  title: string;
  relatedTo: {
    name: string;
    subtext: string;
    type: 'deal' | 'account' | 'meeting';
    id?: string;
  };
  due: string;
  dueTimeRaw?: string;
  priority: TaskPriority;
  source: TaskSource;
  owner: {
    name: string;
    avatar: string;
  };
  completed: boolean;
  isOverdue?: boolean;
  aiDismissed?: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  type: 'deal' | 'meeting' | 'feedback' | 'task';
  read: boolean;
  linkSection?: NavSection;
  linkId?: string;
}
