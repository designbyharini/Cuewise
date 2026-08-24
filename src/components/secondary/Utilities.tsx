import React, { useState } from 'react';
import { 
  Bell, 
  Settings, 
  User, 
  Sparkles, 
  MessageSquare, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  Video, 
  Lock, 
  Sliders, 
  Link2, 
  Check, 
  Zap, 
  Award,
  ChevronRight,
  RefreshCw,
  Sun,
  Moon,
  Laptop
} from 'lucide-react';
import { NavSection, UserProfile, ThemeSetting } from '../../types';
import { useTheme } from '../../context/ThemeContext';

interface NotificationsViewProps {
  onNavigate: (section: NavSection, id?: string) => void;
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({ onNavigate }) => {
  const [notifications, setNotifications] = useState([
    {
      id: 'n1',
      type: 'feedback',
      title: 'Jordan Lee added coaching feedback',
      desc: '“Strong discovery around implementation needs [14:32]” on Discovery Call with Acme Inc.',
      time: '12m ago',
      read: false,
      meetingId: 'm-1',
    },
    {
      id: 'n2',
      type: 'ai-alert',
      title: 'Deal Risk Alert: Northwind Traders',
      desc: 'Competitor Mentioned (Retool) + Timeline Push. Automated suggestion generated.',
      time: '1h ago',
      read: false,
      accountId: 'acc-2',
    },
    {
      id: 'n3',
      type: 'analysis-ready',
      title: 'Meeting Analysis Ready: Recurve Tech',
      desc: 'Talk ratio 52/48%, 4 action items extracted, sentiment +8.4/10.',
      time: '3h ago',
      read: true,
      meetingId: 'm-4',
    },
    {
      id: 'n4',
      type: 'task',
      title: 'New AI action item suggested',
      desc: '“Follow up on ERP compatibility requirements with Sarah Johnson”.',
      time: 'Yesterday',
      read: true,
      section: 'tasks',
    }
  ]);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <div id="notifications-view" className="flex-1 min-w-0 min-h-0 h-full overflow-y-auto px-8 py-7 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium text-white tracking-tight">
            Notifications & Signals
          </h1>
          <p className="text-xs text-[#718096] mt-1 font-normal">
            Real-time updates on conversation analyses, manager feedback, and pipeline risk flags.
          </p>
        </div>

        <button
          onClick={markAllRead}
          className="text-xs text-[#4FA8A1] hover:text-[#9ED9D4] font-medium"
        >
          Mark all as read
        </button>
      </div>

      <div className="surface divide-y divide-[rgba(47,127,122,0.1)] overflow-hidden">
        {notifications.map((n) => (
          <div
            key={n.id}
            onClick={() => {
              if (n.meetingId) onNavigate('meeting-detail', n.meetingId);
              else if (n.accountId) onNavigate('account-detail', n.accountId);
              else onNavigate('tasks');
            }}
            className={`p-5 flex items-start gap-4 hover:bg-[rgba(47,127,122,0.08)] transition-colors cursor-pointer group ${
              !n.read ? 'bg-[rgba(47,127,122,0.06)]' : ''
            }`}
          >
            <div className={`p-2.5 rounded-xl border shrink-0 ${
              n.type === 'feedback'
                ? 'bg-[rgba(96,165,250,0.12)] border-[#60A5FA]/30 text-[#60A5FA]'
                : n.type === 'ai-alert'
                ? 'bg-[rgba(239,68,68,0.12)] border-[#EF4444]/30 text-[#F87171]'
                : n.type === 'analysis-ready'
                ? 'bg-[rgba(47,127,122,0.15)] border-[rgba(47,127,122,0.3)] text-[#4FA8A1]'
                : 'bg-[rgba(25,28,31,0.8)] border-[rgba(47,127,122,0.2)] text-[#9ED9D4]'
            }`}>
              {n.type === 'feedback' && <MessageSquare className="w-4 h-4" />}
              {n.type === 'ai-alert' && <AlertTriangle className="w-4 h-4" />}
              {n.type === 'analysis-ready' && <Sparkles className="w-4 h-4" />}
              {n.type === 'task' && <CheckCircle2 className="w-4 h-4" />}
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold text-white group-hover:text-[#9ED9D4] transition-colors">
                  {n.title}
                </h4>
                <span className="text-[10px] text-[#718096] font-mono">{n.time}</span>
              </div>
              <p className="text-xs text-[#718096] leading-relaxed">
                {n.desc}
              </p>
            </div>

            {!n.read && (
              <span className="w-2 h-2 rounded-full bg-[#4FA8A1] shrink-0 mt-2" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

interface SettingsViewProps {
  currentUser: UserProfile;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ currentUser }) => {
  const [activeTab, setActiveTab] = useState<'general' | 'recording' | 'integrations'>('general');
  const { theme, resolvedTheme, setTheme } = useTheme();

  const [integrations, setIntegrations] = useState([
    { name: 'Zoom Video', desc: 'Auto-join sales calls and record meetings', connected: true },
    { name: 'Google Meet', desc: 'Calendar sync & auto-bot join', connected: true },
    { name: 'Salesforce CRM', desc: 'Bi-directional deal and opportunity sync', connected: true },
    { name: 'HubSpot', desc: 'Sync contacts, deals, and engagement history', connected: false },
    { name: 'Slack', desc: 'Get deal alerts and coaching notes in team channels', connected: true },
  ]);

  const toggleIntegration = (name: string) => {
    setIntegrations(prev => 
      prev.map(i => i.name === name ? { ...i, connected: !i.connected } : i)
    );
  };

  const themeOptions: { id: ThemeSetting; label: string; icon: React.ElementType; description: string }[] = [
    {
      id: 'light',
      label: 'Light',
      icon: Sun,
      description: 'Soft off-white canvas with subtle depth and crisp petrol contrast',
    },
    {
      id: 'dark',
      label: 'Dark',
      icon: Moon,
      description: 'Atmospheric deep petrol dark canvas with glowing teal accents',
    },
    {
      id: 'system',
      label: 'System',
      icon: Laptop,
      description: `Automatically follows your operating system setting (currently ${resolvedTheme === 'dark' ? 'Dark' : 'Light'})`,
    },
  ];

  return (
    <div id="settings-view" className="flex-1 min-w-0 min-h-0 h-full overflow-y-auto px-8 py-7 space-y-6">
      <div>
        <h1 className="text-2xl font-medium text-white tracking-tight">
          Settings & Preferences
        </h1>
        <p className="text-xs text-[#718096] mt-1 font-normal">
          Manage workspace settings, visual appearance, intelligence engine, and CRM synchronization.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[rgba(47,127,122,0.12)] pb-2">
        {(['general', 'recording', 'integrations'] as const).map((tab) => (
          <button
            key={tab}
            id={`settings-tab-${tab}`}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors ${
              activeTab === tab
                ? 'bg-[#2F7F7A] text-white border border-[#4FA8A1]'
                : 'text-[#718096] hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* General Tab Content */}
      {activeTab === 'general' && (
        <div className="space-y-6">
          {/* 1. Profile & Workspace */}
          <div id="profile-workspace-section" className="surface p-6 space-y-5">
            <div>
              <h3 className="card-title !mb-1">Profile & Workspace</h3>
              <p className="text-xs text-[#718096]">
                Manage your account credentials, role identity, and active organization workspace.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-[#718096] mb-1.5 font-medium">Display Name</label>
                <input
                  type="text"
                  defaultValue={currentUser.name}
                  className="w-full px-3.5 py-2.5 bg-[#0D0F12] border border-[rgba(47,127,122,0.2)] rounded-xl text-white focus:outline-none focus:border-[#4FA8A1]"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label className="block text-[#718096] mb-1.5 font-medium">Email Address</label>
                <input
                  type="email"
                  defaultValue={currentUser.email}
                  className="w-full px-3.5 py-2.5 bg-[#0D0F12] border border-[rgba(47,127,122,0.2)] rounded-xl text-white focus:outline-none focus:border-[#4FA8A1]"
                  placeholder="your.email@company.com"
                />
              </div>
              <div>
                <label className="block text-[#718096] mb-1.5 font-medium">Job Title</label>
                <input
                  type="text"
                  defaultValue={currentUser.title || currentUser.role}
                  className="w-full px-3.5 py-2.5 bg-[#0D0F12] border border-[rgba(47,127,122,0.2)] rounded-xl text-white focus:outline-none focus:border-[#4FA8A1]"
                  placeholder="Senior Account Executive"
                />
              </div>
              <div>
                <label className="block text-[#718096] mb-1.5 font-medium">Workspace / Company</label>
                <input
                  type="text"
                  defaultValue={currentUser.company || 'Cuewise Technologies Inc.'}
                  className="w-full px-3.5 py-2.5 bg-[#0D0F12] border border-[rgba(47,127,122,0.2)] rounded-xl text-white focus:outline-none focus:border-[#4FA8A1]"
                  placeholder="Company name"
                />
              </div>
            </div>
          </div>

          {/* 2. Appearance */}
          <div id="appearance-settings-section" className="surface p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="card-title !mb-1">Appearance</h3>
                <p className="text-xs text-[#718096]">
                  Choose how Cuewise appears across all dashboards, transcripts, and modals.
                </p>
              </div>

              {/* Segmented Control */}
              <div className="flex items-center p-1 bg-[rgba(25,28,31,0.6)] border border-[rgba(47,127,122,0.18)] rounded-xl self-start sm:self-auto">
                {(['light', 'dark', 'system'] as const).map((mode) => (
                  <button
                    key={mode}
                    id={`segmented-theme-${mode}`}
                    onClick={() => setTheme(mode)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all flex items-center gap-1.5 ${
                      theme === mode
                        ? 'bg-[#2F7F7A] text-white shadow-sm'
                        : 'text-[#718096] hover:text-[#E4E7E7]'
                    }`}
                  >
                    {mode === 'light' && <Sun className="w-3.5 h-3.5" />}
                    {mode === 'dark' && <Moon className="w-3.5 h-3.5" />}
                    {mode === 'system' && <Laptop className="w-3.5 h-3.5" />}
                    <span>{mode}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Selectable Theme Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
              {themeOptions.map((opt) => {
                const isSelected = theme === opt.id;
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.id}
                    id={`theme-card-${opt.id}`}
                    onClick={() => setTheme(opt.id)}
                    className={`p-4 rounded-2xl border text-left transition-all relative flex flex-col justify-between h-full ${
                      isSelected
                        ? 'bg-[rgba(47,127,122,0.15)] border-[#4FA8A1] shadow-md'
                        : 'bg-[rgba(25,28,31,0.4)] border-[rgba(47,127,122,0.12)] hover:border-[rgba(47,127,122,0.3)] hover:bg-[rgba(25,28,31,0.6)]'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3 w-full">
                      <div className={`p-2 rounded-xl border ${
                        isSelected
                          ? 'bg-[#2F7F7A] text-white border-[#4FA8A1]'
                          : 'bg-[rgba(47,127,122,0.1)] text-[#4FA8A1] border-[rgba(47,127,122,0.2)]'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>

                      {isSelected && (
                        <span className="flex items-center gap-1 text-[11px] font-semibold text-[#4FA8A1] bg-[rgba(47,127,122,0.2)] px-2 py-0.5 rounded-full border border-[rgba(47,127,122,0.35)]">
                          <Check className="w-3 h-3" />
                          Selected
                        </span>
                      )}
                    </div>

                    <div>
                      <div className="font-semibold text-white text-sm flex items-center gap-2">
                        <span>{opt.label}</span>
                        {opt.id === 'system' && (
                          <span className="text-[10px] font-normal text-[#718096]">
                            ({resolvedTheme === 'dark' ? 'Dark' : 'Light'})
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#718096] mt-1 leading-relaxed">
                        {opt.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Regional Preferences */}
          <div id="regional-preferences-section" className="surface p-6 space-y-5">
            <div>
              <h3 className="card-title !mb-1">Regional Preferences</h3>
              <p className="text-xs text-[#718096]">
                Configure timezones, formatting conventions, and currency for deal values across Cuewise.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-[#718096] mb-1.5 font-medium">Time Zone</label>
                <select 
                  defaultValue="America/New_York"
                  className="w-full px-3.5 py-2.5 bg-[#0D0F12] border border-[rgba(47,127,122,0.2)] rounded-xl text-white focus:outline-none focus:border-[#4FA8A1]"
                >
                  <option value="America/New_York">America/New_York (Eastern Time - UTC-5)</option>
                  <option value="America/Chicago">America/Chicago (Central Time - UTC-6)</option>
                  <option value="America/Denver">America/Denver (Mountain Time - UTC-7)</option>
                  <option value="America/Los_Angeles">America/Los_Angeles (Pacific Time - UTC-8)</option>
                  <option value="Europe/London">Europe/London (Greenwich Mean Time - UTC+0)</option>
                  <option value="Europe/Berlin">Europe/Berlin (Central European Time - UTC+1)</option>
                  <option value="Asia/Tokyo">Asia/Tokyo (Japan Standard Time - UTC+9)</option>
                  <option value="Asia/Singapore">Asia/Singapore (Singapore Time - UTC+8)</option>
                  <option value="Australia/Sydney">Australia/Sydney (AEST - UTC+10)</option>
                </select>
              </div>

              <div>
                <label className="block text-[#718096] mb-1.5 font-medium">Date Format</label>
                <select 
                  defaultValue="MMM D, YYYY"
                  className="w-full px-3.5 py-2.5 bg-[#0D0F12] border border-[rgba(47,127,122,0.2)] rounded-xl text-white focus:outline-none focus:border-[#4FA8A1]"
                >
                  <option value="MMM D, YYYY">MMM D, YYYY (e.g., Oct 24, 2026)</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY (e.g., 10/24/2026)</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY (e.g., 24/10/2026)</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD (e.g., 2026-10-24)</option>
                </select>
              </div>

              <div>
                <label className="block text-[#718096] mb-1.5 font-medium">Time Format</label>
                <select 
                  defaultValue="12h"
                  className="w-full px-3.5 py-2.5 bg-[#0D0F12] border border-[rgba(47,127,122,0.2)] rounded-xl text-white focus:outline-none focus:border-[#4FA8A1]"
                >
                  <option value="12h">12-hour (e.g., 2:30 PM)</option>
                  <option value="24h">24-hour (e.g., 14:30)</option>
                </select>
              </div>

              <div>
                <label className="block text-[#718096] mb-1.5 font-medium">Currency</label>
                <select 
                  defaultValue="USD"
                  className="w-full px-3.5 py-2.5 bg-[#0D0F12] border border-[rgba(47,127,122,0.2)] rounded-xl text-white focus:outline-none focus:border-[#4FA8A1]"
                >
                  <option value="USD">USD ($) - US Dollar</option>
                  <option value="EUR">EUR (€) - Euro</option>
                  <option value="GBP">GBP (£) - British Pound</option>
                  <option value="CAD">CAD ($) - Canadian Dollar</option>
                  <option value="AUD">AUD ($) - Australian Dollar</option>
                  <option value="JPY">JPY (¥) - Japanese Yen</option>
                  <option value="SGD">SGD ($) - Singapore Dollar</option>
                </select>
              </div>
            </div>
          </div>

          {/* 4. Default Behavior */}
          <div id="default-behavior-section" className="surface p-6 space-y-5">
            <div>
              <h3 className="card-title !mb-1">Default Behavior</h3>
              <p className="text-xs text-[#718096]">
                Configure navigation defaults and automated post-call intelligence workflows.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-[#718096] mb-1.5 font-medium">Default Landing Page</label>
                <select 
                  defaultValue="home"
                  className="w-full md:w-1/2 px-3.5 py-2.5 bg-[#0D0F12] border border-[rgba(47,127,122,0.2)] rounded-xl text-white focus:outline-none focus:border-[#4FA8A1]"
                >
                  <option value="home">Home / Executive Dashboard</option>
                  <option value="meetings">Meetings / Call Intelligence</option>
                  <option value="deals">Deals / Pipeline Hub</option>
                  <option value="accounts">Accounts Overview</option>
                  <option value="tasks">Action Items & Tasks</option>
                </select>
              </div>

              <div className="space-y-3 pt-2">
                <div className="p-3.5 rounded-xl bg-[rgba(25,28,31,0.5)] border border-[rgba(47,127,122,0.12)] flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-white block">Open meeting after analysis is complete</span>
                    <span className="text-[11px] text-[#718096] mt-0.5 block">
                      Automatically navigate to the meeting transcript and summary once AI processing finishes.
                    </span>
                  </div>
                  <input type="checkbox" defaultChecked className="accent-[#2F7F7A] w-4 h-4 rounded cursor-pointer" />
                </div>

                <div className="p-3.5 rounded-xl bg-[rgba(25,28,31,0.5)] border border-[rgba(47,127,122,0.12)] flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-white block">Show AI suggestions on Home</span>
                    <span className="text-[11px] text-[#718096] mt-0.5 block">
                      Display proactive AI deal coaching, risk alerts, and priority action recommendations on your home view.
                    </span>
                  </div>
                  <input type="checkbox" defaultChecked className="accent-[#2F7F7A] w-4 h-4 rounded cursor-pointer" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recording Tab Content */}
      {activeTab === 'recording' && (
        <div className="surface p-6 space-y-4">
          <h3 className="card-title">Conversation Intelligence Rules</h3>
          
          <div className="space-y-3 text-xs">
            {[
              { title: 'Auto-join external calendar meetings', desc: 'Cuewise recorder automatically joins when non-team attendees are present', checked: true },
              { title: 'Real-time objection detection', desc: 'Identify price resistance, competitor mentions, and timing delays during calls', checked: true },
              { title: 'Automated deal signal sync', desc: 'Automatically update stage probabilities based on spoken budget confirmation', checked: true },
              { title: 'Manager coaching alerts', desc: 'Notify sales manager when talk time exceeds 65% or monologue exceeds 3 minutes', checked: false }
            ].map((opt, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-[rgba(25,28,31,0.5)] border border-[rgba(47,127,122,0.12)] flex items-center justify-between">
                <div>
                  <span className="font-semibold text-white block">{opt.title}</span>
                  <span className="text-[11px] text-[#718096] mt-0.5 block">{opt.desc}</span>
                </div>
                <input type="checkbox" defaultChecked={opt.checked} className="accent-[#2F7F7A] w-4 h-4 rounded" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Integrations Tab Content */}
      {activeTab === 'integrations' && (
        <div className="surface p-6 space-y-4">
          <h3 className="card-title">Connected Platforms</h3>
          
          <div className="space-y-3">
            {integrations.map((item, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-[rgba(25,28,31,0.5)] border border-[rgba(47,127,122,0.12)] flex items-center justify-between">
                <div>
                  <span className="font-semibold text-white text-xs block">{item.name}</span>
                  <span className="text-[11px] text-[#718096]">{item.desc}</span>
                </div>

                <button
                  onClick={() => toggleIntegration(item.name)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                    item.connected
                      ? 'status-pill pill-teal'
                      : 'bg-[rgba(25,28,31,0.8)] text-[#718096] border border-[rgba(47,127,122,0.2)] hover:text-white'
                  }`}
                >
                  {item.connected ? 'Connected' : 'Connect'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

interface ProfileViewProps {
  currentUser: UserProfile;
  onSwitchPerspective: (role: 'Account Executive' | 'Sales Manager') => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ currentUser, onSwitchPerspective }) => {
  return (
    <div id="profile-view" className="flex-1 min-w-0 min-h-0 h-full overflow-y-auto px-8 py-7 space-y-6">
      {/* Header Profile Card */}
      <div className="surface p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-[#2F7F7A]/50"
          />
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-bold text-white tracking-tight">
                {currentUser.name}
              </h1>
              <span className="status-pill pill-teal">
                {currentUser.role}
              </span>
            </div>
            <p className="text-xs text-[#718096] mt-1">{currentUser.email}</p>
          </div>
        </div>

        {/* Perspective Switcher */}
        <div className="p-3 rounded-xl bg-[rgba(25,28,31,0.8)] border border-[rgba(47,127,122,0.2)] flex items-center gap-3">
          <span className="text-xs text-[#718096]">Active Perspective:</span>
          <button
            onClick={() => onSwitchPerspective(currentUser.role === 'Account Executive' ? 'Sales Manager' : 'Account Executive')}
            className="px-3 py-1.5 rounded-lg bg-[#2F7F7A] hover:bg-[#4FA8A1] text-white text-xs font-medium transition-colors"
          >
            Switch to {currentUser.role === 'Account Executive' ? 'Sales Manager' : 'Account Executive'}
          </button>
        </div>
      </div>

      {/* Performance Scorecard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="surface p-5 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#718096] uppercase">
            <Award className="w-4 h-4 text-[#4FA8A1]" />
            <span>Coaching Score</span>
          </div>
          <div className="text-3xl font-bold text-white font-mono">92/100</div>
          <p className="text-xs text-[#4FA8A1]">Top 5% across team benchmark</p>
        </div>

        <div className="surface p-5 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#718096] uppercase">
            <TrendingUp className="w-4 h-4 text-[#4FA8A1]" />
            <span>Avg Talk / Listen</span>
          </div>
          <div className="text-3xl font-bold text-white font-mono">48% / 52%</div>
          <p className="text-xs text-[#4FA8A1]">Optimal active listening balance</p>
        </div>

        <div className="surface p-5 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#718096] uppercase">
            <Zap className="w-4 h-4 text-[#FBBF24]" />
            <span>Signals Acted On</span>
          </div>
          <div className="text-3xl font-bold text-white font-mono">94%</div>
          <p className="text-xs text-[#FBBF24]">29 action items closed in 7d</p>
        </div>
      </div>
    </div>
  );
};
