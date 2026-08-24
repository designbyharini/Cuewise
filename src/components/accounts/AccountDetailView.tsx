import React, { useState } from 'react';
import { 
  ChevronLeft, 
  Building2, 
  Calendar, 
  Plus, 
  Clock, 
  Mail, 
  Phone, 
  FileText, 
  Video, 
  CheckCircle2, 
  AlertCircle, 
  MoreHorizontal, 
  Check, 
  DollarSign, 
  Briefcase, 
  UserCheck, 
  Sparkles,
  MessageSquare
} from 'lucide-react';
import { Account, NavSection, UserProfile } from '../../types';

interface AccountDetailViewProps {
  account: Account;
  onNavigate: (section: NavSection, id?: string) => void;
  currentUser: UserProfile;
  onOpenLogActivity: () => void;
  onOpenScheduleMeeting: () => void;
}

export const AccountDetailView: React.FC<AccountDetailViewProps> = ({
  account,
  onNavigate,
  currentUser,
  onOpenLogActivity,
  onOpenScheduleMeeting,
}) => {
  const [tasks, setTasks] = useState(account.openTasks);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const toggleTask = (taskId: string) => {
    setTasks(prev => 
      prev.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t)
    );
  };

  return (
    <div id="account-detail-view" className="flex-1 min-w-0 min-h-0 h-full overflow-y-auto px-8 py-7 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => onNavigate('accounts')}
            className="p-2 rounded-xl bg-[rgba(25,28,31,0.6)] hover:bg-[rgba(25,28,31,0.9)] border border-[rgba(47,127,122,0.2)] text-[#718096] hover:text-white transition-colors"
            title="Back to Accounts"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[rgba(47,127,122,0.15)] border border-[rgba(47,127,122,0.3)] flex items-center justify-center font-bold text-xl text-[#9ED9D4] shadow-lg shadow-[#2F7F7A]/10">
              {account.initial}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-white tracking-tight">
                  {account.name}
                </h1>
                <span className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-medium border ${
                  account.status === 'Healthy'
                    ? 'status-pill pill-green'
                    : account.status === 'Needs attention'
                    ? 'status-pill pill-amber'
                    : 'status-pill'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    account.status === 'Healthy' ? 'bg-[#4FA8A1]' : 'bg-[#FBBF24]'
                  }`} />
                  <span>{account.status}</span>
                </span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-[#718096] mt-1 flex-wrap">
                <span>{account.industry}</span>
                <span>•</span>
                <span>Primary: <strong className="text-[#C2D0DC] font-normal">{account.primaryContact.name} ({account.primaryContact.role})</strong></span>
                <span>•</span>
                <span>Owner: <strong className="text-[#C2D0DC] font-normal">{account.owner.name}</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 self-end sm:self-center">
          <button
            onClick={onOpenLogActivity}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[rgba(25,28,31,0.6)] hover:bg-[rgba(25,28,31,0.9)] border border-[rgba(47,127,122,0.2)] text-xs font-medium text-[#C2D0DC] hover:text-white transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-[#4FA8A1]" />
            <span>Log activity</span>
          </button>
          <button
            onClick={onOpenScheduleMeeting}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2F7F7A] hover:bg-[#4FA8A1] text-white text-xs font-semibold shadow-md shadow-[#2F7F7A]/20 transition-all duration-150"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Schedule meeting</span>
          </button>
        </div>
      </div>

      {/* Account Summary 4-Item Strip */}
      <div 
        id="account-summary-strip"
        className="surface p-4 grid grid-cols-2 sm:grid-cols-4 gap-4"
      >
        <div className="p-3 rounded-xl bg-[rgba(25,28,31,0.4)] border border-[rgba(47,127,122,0.1)]">
          <span className="text-[11px] text-[#718096] block">Open deals</span>
          <div className="text-lg font-bold text-white font-mono mt-0.5">{account.openDealsCount}</div>
        </div>

        <div className="p-3 rounded-xl bg-[rgba(25,28,31,0.4)] border border-[rgba(47,127,122,0.1)]">
          <span className="text-[11px] text-[#718096] block">Pipeline value</span>
          <div className="text-lg font-bold text-white font-mono mt-0.5">{formatCurrency(account.pipelineValue)}</div>
        </div>

        <div className="p-3 rounded-xl bg-[rgba(25,28,31,0.4)] border border-[rgba(47,127,122,0.1)]">
          <span className="text-[11px] text-[#718096] block">Last contact</span>
          <div className="text-lg font-bold text-white font-mono mt-0.5">{account.lastContact}</div>
        </div>

        <div className="p-3 rounded-xl bg-[rgba(25,28,31,0.4)] border border-[rgba(47,127,122,0.1)]">
          <span className="text-[11px] text-[#718096] block">Open tasks</span>
          <div className="text-lg font-bold text-white font-mono mt-0.5">{tasks.filter(t => !t.completed).length}</div>
        </div>
      </div>

      {/* Main 65 / 35 Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (65% — dominant): Recent Activity Timeline & Connected Deals */}
        <div className="lg:col-span-8 space-y-6">
          {/* Recent Activity Timeline */}
          <div className="surface p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="card-title">Recent Activity & Relationship History</span>
              </div>
              <span className="text-xs text-[#718096]">Chronological log</span>
            </div>

            {/* Timeline List */}
            <div className="space-y-4 relative before:absolute before:top-3 before:bottom-3 before:left-4 before:w-0.5 before:bg-[rgba(47,127,122,0.15)]">
              {account.activities.map((act) => (
                <div key={act.id} className="flex items-start gap-4 relative">
                  {/* Icon Node */}
                  <div className={`w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 z-10 ${
                    act.type === 'meeting'
                      ? 'bg-[rgba(47,127,122,0.15)] border-[rgba(47,127,122,0.3)] text-[#4FA8A1]'
                      : act.type === 'proposal'
                      ? 'bg-[rgba(96,165,250,0.12)] border-[rgba(96,165,250,0.3)] text-[#60A5FA]'
                      : act.type === 'note'
                      ? 'bg-[rgba(245,158,11,0.12)] border-[rgba(245,158,11,0.3)] text-[#FBBF24]'
                      : 'bg-[rgba(25,28,31,0.8)] border-[rgba(47,127,122,0.2)] text-[#9ED9D4]'
                  }`}>
                    {act.type === 'meeting' && <Video className="w-3.5 h-3.5" />}
                    {act.type === 'proposal' && <FileText className="w-3.5 h-3.5" />}
                    {act.type === 'note' && <MessageSquare className="w-3.5 h-3.5" />}
                    {act.type === 'call' && <Phone className="w-3.5 h-3.5" />}
                  </div>

                  {/* Content card */}
                  <div 
                    onClick={() => {
                      if (act.type === 'meeting') onNavigate('meeting-detail', 'm-1');
                    }}
                    className={`flex-1 p-3.5 rounded-xl bg-[rgba(25,28,31,0.5)] border border-[rgba(47,127,122,0.12)] transition-all ${
                      act.type === 'meeting' ? 'hover:border-[#4FA8A1] cursor-pointer group' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-semibold text-[#E4E7E7] group-hover:text-[#9ED9D4]">
                        {act.title}
                      </h4>
                      <span className="text-[11px] text-[#718096] font-mono">{act.time}</span>
                    </div>
                    <p className="text-xs text-[#718096] mt-1 leading-relaxed">
                      {act.description}
                    </p>
                    <div className="text-[10px] text-[#718096] mt-2 flex items-center gap-1.5">
                      <span>Logged by {act.author}</span>
                      {act.type === 'meeting' && (
                        <span className="text-[#4FA8A1] font-medium ml-2 group-hover:underline">
                          View intelligence recording →
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Connected Deals Table */}
          <div className="surface p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="card-title">
                Active Deals with {account.name}
              </span>
              <button 
                onClick={() => onNavigate('deals')}
                className="text-xs text-[#4FA8A1] hover:underline"
              >
                View all in Deals →
              </button>
            </div>

            <div className="space-y-2.5">
              {account.connectedDeals.map((deal) => (
                <div
                  key={deal.id}
                  onClick={() => onNavigate('deals')}
                  className="p-3.5 rounded-xl bg-[rgba(25,28,31,0.5)] hover:bg-[rgba(25,28,31,0.8)] border border-[rgba(47,127,122,0.12)] hover:border-[#4FA8A1]/50 transition-all cursor-pointer flex items-center justify-between"
                >
                  <div className="space-y-0.5">
                    <div className="text-xs font-semibold text-[#E4E7E7]">
                      {deal.name}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#718096]">
                      <span className="px-2 py-0.5 rounded bg-[#0D0F12] text-[#C2D0DC] border border-[rgba(47,127,122,0.2)]">
                        {deal.stage}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-sm font-bold text-white font-mono">
                      {formatCurrency(deal.value)}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${
                      deal.health === 'Healthy'
                        ? 'status-pill pill-green'
                        : 'status-pill pill-amber'
                    }`}>
                      {deal.health}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (35% — supporting): Key Contacts with Relationship Roles & Open Tasks */}
        <div className="lg:col-span-4 space-y-6">
          {/* Key Contacts */}
          <div className="surface p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#718096] uppercase tracking-wider">
                Key Contacts ({account.contacts.length})
              </span>
            </div>

            <div className="space-y-3">
              {account.contacts.map((contact) => (
                <div
                  key={contact.id}
                  className="p-3 rounded-xl bg-[rgba(25,28,31,0.5)] border border-[rgba(47,127,122,0.1)] space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={contact.avatar}
                        alt={contact.name}
                        className="w-8 h-8 rounded-full object-cover ring-1 ring-[rgba(47,127,122,0.3)]"
                      />
                      <div>
                        <div className="text-xs font-semibold text-[#E4E7E7]">
                          {contact.name}
                        </div>
                        <div className="text-[10px] text-[#718096]">{contact.email}</div>
                      </div>
                    </div>
                  </div>

                  {/* Relationship Role Tag */}
                  <div className="pt-1 flex items-center justify-between border-t border-[rgba(47,127,122,0.08)]">
                    <span className="text-[10px] text-[#718096]">Buying Role</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-medium border ${
                      contact.role === 'Decision maker'
                        ? 'status-pill pill-teal'
                        : contact.role === 'Champion'
                        ? 'bg-[rgba(96,165,250,0.12)] text-[#60A5FA] border-[#60A5FA]/30'
                        : contact.role === 'Procurement'
                        ? 'status-pill pill-amber'
                        : 'status-pill'
                    }`}>
                      {contact.role}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Open Tasks */}
          <div className="surface p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#718096] uppercase tracking-wider">
                Open Tasks ({tasks.filter(t => !t.completed).length})
              </span>
              <button
                onClick={() => onNavigate('tasks')}
                className="text-xs text-[#4FA8A1] hover:underline"
              >
                All tasks →
              </button>
            </div>

            <div className="space-y-2">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-start gap-2.5 ${
                    task.completed
                      ? 'bg-[rgba(25,28,31,0.3)] border-transparent opacity-60'
                      : 'bg-[rgba(25,28,31,0.7)] border-[rgba(47,127,122,0.15)] hover:border-[#4FA8A1]'
                  }`}
                >
                  <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                    task.completed 
                      ? 'bg-[#2F7F7A] border-[#4FA8A1] text-white' 
                      : 'border-[#718096]'
                  }`}>
                    {task.completed && <Check className="w-3 h-3" />}
                  </div>
                  <div className="flex-1 text-xs">
                    <div className={`font-medium ${task.completed ? 'line-through text-[#718096]' : 'text-[#E4E7E7]'}`}>
                      {task.title}
                    </div>
                    <div className="text-[10px] text-[#718096] mt-0.5 flex items-center gap-2">
                      <span className="text-[#9ED9D4] font-mono">{task.due}</span>
                      <span>•</span>
                      <span className={`font-medium ${
                        task.priority === 'High' ? 'text-[#F87171]' : 'text-[#FBBF24]'
                      }`}>
                        {task.priority}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
