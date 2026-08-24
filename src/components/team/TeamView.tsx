import React, { useState } from 'react';
import { 
  Users, 
  TrendingUp, 
  Award, 
  Target, 
  Video, 
  MessageSquare, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  ChevronRight, 
  Filter, 
  Plus, 
  Calendar, 
  BarChart3, 
  ExternalLink,
  Search,
  Check,
  X,
  Zap,
  Clock,
  ArrowUpRight
} from 'lucide-react';
import { NavSection, TeamMember, Meeting, Deal, TaskItem } from '../../types';
import { mockTeamMembers, mockMeetings, mockDeals } from '../../data/mockData';

interface TeamViewProps {
  onNavigate: (section: NavSection, id?: string) => void;
  onAddTask?: (task: TaskItem) => void;
}

export const TeamView: React.FC<TeamViewProps> = ({ onNavigate, onAddTask }) => {
  const [selectedRepId, setSelectedRepId] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<'q2' | 'month' | 'ytd'>('q2');
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedMemberForTask, setSelectedMemberForTask] = useState<TeamMember | null>(null);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskPriority, setTaskPriority] = useState<'High' | 'Medium' | 'Low'>('High');
  const [taskDue, setTaskDue] = useState('Tomorrow, 5:00 PM');
  const [taskSuccessToast, setTaskSuccessToast] = useState<string | null>(null);

  const teamMembers = mockTeamMembers;

  const totalQuota = teamMembers.reduce((acc, m) => acc + m.quotaTarget, 0);
  const totalClosed = teamMembers.reduce((acc, m) => acc + m.quotaClosed, 0);
  const totalPipeline = teamMembers.reduce((acc, m) => acc + m.pipelineValue, 0);
  const avgWinRate = (teamMembers.reduce((acc, m) => acc + m.winRate, 0) / teamMembers.length).toFixed(1);
  const avgCoachingScore = (teamMembers.reduce((acc, m) => acc + m.coachingScore, 0) / teamMembers.length).toFixed(1);
  const totalCalls = teamMembers.reduce((acc, m) => acc + m.callsAnalyzed, 0);
  const progressPercent = Math.round((totalClosed / totalQuota) * 100);

  const filteredMembers = selectedRepId === 'all' 
    ? teamMembers 
    : teamMembers.filter(m => m.id === selectedRepId);

  const handleOpenAssignModal = (member?: TeamMember) => {
    setSelectedMemberForTask(member || teamMembers[0]);
    setIsAssignModalOpen(true);
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim() || !selectedMemberForTask) return;

    const newTask: TaskItem = {
      id: `tsk-mgr-${Date.now()}`,
      title: taskTitle.trim(),
      relatedTo: {
        name: selectedMemberForTask.recentDeal.split(' (')[0] || 'Team Coaching',
        subtext: 'Assigned by Manager',
        type: 'deal'
      },
      due: taskDue,
      priority: taskPriority,
      source: 'Manager',
      owner: {
        name: selectedMemberForTask.name,
        avatar: selectedMemberForTask.avatar
      },
      completed: false
    };

    if (onAddTask) {
      onAddTask(newTask);
    }

    setTaskSuccessToast(`Task assigned to ${selectedMemberForTask.name}`);
    setTimeout(() => setTaskSuccessToast(null), 3500);

    setTaskTitle('');
    setIsAssignModalOpen(false);
  };

  return (
    <div id="team-view" className="flex-1 min-w-0 min-h-0 h-full overflow-y-auto px-8 py-7 space-y-7 animate-in fade-in duration-200">
      {/* Toast Notification */}
      {taskSuccessToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#131619] border border-[#4FA8A1] text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-[#4FA8A1]" />
          <span className="text-xs font-medium">{taskSuccessToast}</span>
          <button onClick={() => setTaskSuccessToast(null)} className="text-[#718096] hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header with Title and Global Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Team Performance & Coaching Hub
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[rgba(47,127,122,0.18)] text-[#4FA8A1] border border-[rgba(47,127,122,0.35)]">
              4 Direct Reps
            </span>
          </div>
          <p className="text-xs text-[#718096] mt-1 font-normal">
            Real-time pipeline progression, quota pacing, conversation health, and targeted coaching for your sales team.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Time range selector */}
          <div className="flex items-center bg-[rgba(25,28,31,0.8)] border border-[rgba(47,127,122,0.2)] rounded-xl p-1 text-xs">
            <button
              onClick={() => setTimeRange('q2')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                timeRange === 'q2' ? 'bg-[#2F7F7A] text-white font-medium shadow-sm' : 'text-[#718096] hover:text-white'
              }`}
            >
              Q2 2025
            </button>
            <button
              onClick={() => setTimeRange('month')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                timeRange === 'month' ? 'bg-[#2F7F7A] text-white font-medium shadow-sm' : 'text-[#718096] hover:text-white'
              }`}
            >
              This Month
            </button>
            <button
              onClick={() => setTimeRange('ytd')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                timeRange === 'ytd' ? 'bg-[#2F7F7A] text-white font-medium shadow-sm' : 'text-[#718096] hover:text-white'
              }`}
            >
              YTD
            </button>
          </div>

          <button
            onClick={() => handleOpenAssignModal()}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#2F7F7A] hover:bg-[#4FA8A1] text-white text-xs font-semibold shadow-md shadow-black/40 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Assign Coaching Task</span>
          </button>
        </div>
      </div>

      {/* Top Level Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="surface p-5 space-y-3 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#718096] uppercase tracking-wider">
              Team Quota Closed
            </span>
            <div className="p-2 rounded-xl bg-[rgba(47,127,122,0.15)] text-[#4FA8A1] border border-[rgba(47,127,122,0.3)]">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white font-mono">
              ${(totalClosed / 1000000).toFixed(2)}M <span className="text-xs font-normal text-[#718096]">/ ${(totalQuota / 1000000).toFixed(2)}M</span>
            </div>
            <div className="flex items-center justify-between text-xs mt-2">
              <span className="text-[#4FA8A1] font-semibold">{progressPercent}% Paced</span>
              <span className="text-[#718096] font-mono text-[11px]">+8.4% vs last Q</span>
            </div>
            <div className="w-full h-1.5 bg-[#131619] rounded-full overflow-hidden mt-1.5 border border-[rgba(47,127,122,0.2)]">
              <div 
                className="h-full bg-gradient-to-r from-[#2F7F7A] to-[#4FA8A1] rounded-full transition-all duration-500" 
                style={{ width: `${progressPercent}%` }} 
              />
            </div>
          </div>
        </div>

        <div className="surface p-5 space-y-3 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#718096] uppercase tracking-wider">
              Active Team Pipeline
            </span>
            <div className="p-2 rounded-xl bg-[rgba(47,127,122,0.15)] text-[#4FA8A1] border border-[rgba(47,127,122,0.3)]">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white font-mono">
              ${(totalPipeline / 1000000).toFixed(2)}M
            </div>
            <div className="flex items-center justify-between text-xs mt-2">
              <span className="text-[#718096]">35 total opportunities</span>
              <span className="text-[#4FA8A1] font-semibold">1.81x Target Cov.</span>
            </div>
            <div className="w-full h-1.5 bg-[#131619] rounded-full overflow-hidden mt-1.5 border border-[rgba(47,127,122,0.2)]">
              <div className="h-full bg-[#3B82F6] rounded-full" style={{ width: '78%' }} />
            </div>
          </div>
        </div>

        <div className="surface p-5 space-y-3 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#718096] uppercase tracking-wider">
              Avg Team Win Rate
            </span>
            <div className="p-2 rounded-xl bg-[rgba(245,158,11,0.15)] text-[#F59E0B] border border-[rgba(245,158,11,0.3)]">
              <BarChart3 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white font-mono">
              {avgWinRate}%
            </div>
            <div className="flex items-center justify-between text-xs mt-2">
              <span className="text-[#F59E0B] font-semibold">+3.8% benchmark</span>
              <span className="text-[#718096] text-[11px]">42 deals won</span>
            </div>
            <div className="w-full h-1.5 bg-[#131619] rounded-full overflow-hidden mt-1.5 border border-[rgba(47,127,122,0.2)]">
              <div className="h-full bg-[#F59E0B] rounded-full" style={{ width: `${parseFloat(avgWinRate) * 2}%` }} />
            </div>
          </div>
        </div>

        <div className="surface p-5 space-y-3 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#718096] uppercase tracking-wider">
              Coaching Index
            </span>
            <div className="p-2 rounded-xl bg-[rgba(16,185,129,0.15)] text-[#10B981] border border-[rgba(16,185,129,0.3)]">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white font-mono">
              {avgCoachingScore} <span className="text-xs font-normal text-[#718096]">/ 100</span>
            </div>
            <div className="flex items-center justify-between text-xs mt-2">
              <span className="text-[#10B981] font-semibold">{totalCalls} calls analyzed</span>
              <span className="text-[#718096] text-[11px]">94% signal health</span>
            </div>
            <div className="w-full h-1.5 bg-[#131619] rounded-full overflow-hidden mt-1.5 border border-[rgba(47,127,122,0.2)]">
              <div className="h-full bg-[#10B981] rounded-full" style={{ width: `${avgCoachingScore}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Direct Reports Performance Table / Cards */}
      <div className="surface overflow-hidden">
        <div className="p-5 border-b border-[rgba(47,127,122,0.15)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="card-title text-base flex items-center gap-2">
              <Users className="w-4 h-4 text-[#4FA8A1]" />
              <span>Direct Sales Rep Roster</span>
            </h3>
            <p className="text-xs text-[#718096] mt-0.5">
              Individual quota pacing, talk ratios, and actionable coaching recommendations.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedRepId}
              onChange={(e) => setSelectedRepId(e.target.value)}
              aria-label="Filter by rep"
              className="px-3 py-1.5 bg-[#0D0F12] border border-[rgba(47,127,122,0.25)] rounded-xl text-xs text-white focus:outline-none focus:border-[#4FA8A1]"
            >
              <option value="all">All Direct Reps (4)</option>
              {teamMembers.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="divide-y divide-[rgba(47,127,122,0.1)]">
          {filteredMembers.map((member) => {
            const memberPacing = Math.round((member.quotaClosed / member.quotaTarget) * 100);
            return (
              <div 
                key={member.id}
                className="p-5 hover:bg-[rgba(47,127,122,0.04)] transition-colors space-y-4"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Member Profile */}
                  <div className="flex items-center gap-3.5">
                    <img 
                      src={member.avatar} 
                      alt={member.name} 
                      className="w-11 h-11 rounded-xl object-cover ring-1 ring-[#4FA8A1]/40 shrink-0" 
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white hover:text-[#4FA8A1] transition-colors cursor-pointer"
                            onClick={() => onNavigate('meetings')}>
                          {member.name}
                        </h4>
                        <span className="px-2 py-0.5 text-[10px] font-semibold bg-[rgba(25,28,31,0.8)] border border-[rgba(47,127,122,0.2)] rounded-md text-[#A0AEC0]">
                          {member.title}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#718096] mt-0.5 flex items-center gap-3">
                        <span>{member.email}</span>
                        <span>•</span>
                        <span>{member.activeDealsCount} active deals</span>
                        <span>•</span>
                        <span>{member.callsAnalyzed} calls logged</span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Action Controls */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleOpenAssignModal(member)}
                      className="px-3 py-1.5 rounded-lg bg-[rgba(47,127,122,0.12)] hover:bg-[rgba(47,127,122,0.25)] border border-[rgba(47,127,122,0.3)] text-[#4FA8A1] text-xs font-medium flex items-center gap-1.5 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Assign Task</span>
                    </button>
                    <button
                      onClick={() => onNavigate('meetings')}
                      className="px-3 py-1.5 rounded-lg bg-[rgba(25,28,31,0.8)] hover:bg-[rgba(35,40,46,0.9)] border border-[rgba(47,127,122,0.2)] text-[#A0AEC0] hover:text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
                    >
                      <Video className="w-3.5 h-3.5 text-[#4FA8A1]" />
                      <span>View Calls</span>
                    </button>
                    <button
                      onClick={() => onNavigate('deals')}
                      className="px-3 py-1.5 rounded-lg bg-[rgba(25,28,31,0.8)] hover:bg-[rgba(35,40,46,0.9)] border border-[rgba(47,127,122,0.2)] text-[#A0AEC0] hover:text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
                    >
                      <TrendingUp className="w-3.5 h-3.5 text-[#3B82F6]" />
                      <span>Deals</span>
                    </button>
                  </div>
                </div>

                {/* Metrics Breakdown Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 p-3.5 rounded-xl bg-[rgba(13,15,18,0.6)] border border-[rgba(47,127,122,0.12)] text-xs">
                  <div>
                    <span className="text-[#718096] text-[10px] uppercase font-semibold block">Closed / Quota</span>
                    <span className="text-white font-mono font-bold block mt-0.5">
                      ${(member.quotaClosed / 1000).toFixed(0)}k <span className="text-[10px] text-[#718096]">/ ${(member.quotaTarget / 1000).toFixed(0)}k</span>
                    </span>
                    <div className="w-full h-1 bg-[#1A1E23] rounded-full overflow-hidden mt-1.5">
                      <div 
                        className={`h-full rounded-full ${memberPacing >= 70 ? 'bg-[#4FA8A1]' : 'bg-[#F59E0B]'}`} 
                        style={{ width: `${Math.min(memberPacing, 100)}%` }} 
                      />
                    </div>
                  </div>

                  <div>
                    <span className="text-[#718096] text-[10px] uppercase font-semibold block">Pacing</span>
                    <span className={`font-mono font-bold block mt-0.5 ${memberPacing >= 70 ? 'text-[#4FA8A1]' : 'text-[#F59E0B]'}`}>
                      {memberPacing}%
                    </span>
                    <span className="text-[10px] text-[#718096] mt-1 block">On track for Q2</span>
                  </div>

                  <div>
                    <span className="text-[#718096] text-[10px] uppercase font-semibold block">Open Pipeline</span>
                    <span className="text-white font-mono font-bold block mt-0.5">
                      ${(member.pipelineValue / 1000000).toFixed(2)}M
                    </span>
                    <span className="text-[10px] text-[#718096] mt-1 block">{member.activeDealsCount} opportunities</span>
                  </div>

                  <div>
                    <span className="text-[#718096] text-[10px] uppercase font-semibold block">Win Rate</span>
                    <span className="text-white font-mono font-bold block mt-0.5">
                      {member.winRate}%
                    </span>
                    <span className="text-[10px] text-[#4FA8A1] mt-1 block">Healthy</span>
                  </div>

                  <div>
                    <span className="text-[#718096] text-[10px] uppercase font-semibold block">Avg Talk Ratio</span>
                    <span className={`font-mono font-bold block mt-0.5 ${member.avgTalkRatio > 54 ? 'text-[#F87171]' : 'text-[#4FA8A1]'}`}>
                      {member.avgTalkRatio}% / {100 - member.avgTalkRatio}%
                    </span>
                    <span className="text-[10px] text-[#718096] mt-1 block">
                      {member.avgTalkRatio > 54 ? '⚠️ High monologue' : 'Optimal listening'}
                    </span>
                  </div>

                  <div>
                    <span className="text-[#718096] text-[10px] uppercase font-semibold block">Coaching Score</span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-white font-mono font-bold">{member.coachingScore}</span>
                      <span className="text-[10px] text-[#718096]">/100</span>
                      <span className={`w-2 h-2 rounded-full ${member.coachingScore >= 90 ? 'bg-[#10B981]' : member.coachingScore >= 85 ? 'bg-[#4FA8A1]' : 'bg-[#F59E0B]'}`} />
                    </div>
                    <span className="text-[10px] text-[#718096] mt-1 block">Top 10% team</span>
                  </div>
                </div>

                {/* Coaching Insight Pills */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-xs">
                  <div className="flex-1 flex items-center gap-2 p-2.5 rounded-lg bg-[rgba(16,185,129,0.06)] border border-[rgba(16,185,129,0.18)] text-[#A7F3D0]">
                    <Check className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
                    <span className="text-[#718096] font-medium text-[11px]">Strength:</span>
                    <span className="text-white text-[11px] font-medium">{member.topStrength}</span>
                  </div>

                  <div className="flex-1 flex items-center gap-2 p-2.5 rounded-lg bg-[rgba(239,68,68,0.06)] border border-[rgba(239,68,68,0.18)] text-[#FECACA]">
                    <Sparkles className="w-3.5 h-3.5 text-[#F87171] shrink-0" />
                    <span className="text-[#718096] font-medium text-[11px]">Coaching Area:</span>
                    <span className="text-white text-[11px] font-medium">{member.coachingNeed}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two-Column Bottom Section: High Priority Coaching Queue & Team Call Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Manager High-Priority Coaching Queue */}
        <div className="surface p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="card-title flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#4FA8A1]" />
              <span>AI-Flagged Coaching Opportunities</span>
            </h3>
            <span className="px-2 py-0.5 text-[10px] font-semibold bg-[rgba(239,68,68,0.15)] text-[#F87171] border border-[rgba(239,68,68,0.3)] rounded-full">
              3 Pending Action
            </span>
          </div>

          <div className="space-y-3">
            {[
              {
                id: 'co-1',
                rep: 'Maya Thompson',
                avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
                deal: 'Delta Systems ($180K)',
                issue: 'Rep talk ratio exceeded 56% with 3m10s monologue on product architecture.',
                recommendation: 'Encourage discovery check-ins and customer validation before moving slides.',
                type: 'Pacing & Listening',
                urgency: 'Medium'
              },
              {
                id: 'co-2',
                rep: 'Sarah Chen',
                avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
                deal: 'BetaCo Fintech ($310K)',
                issue: 'Customer objected to Enterprise tier pricing without economic buyer in the room.',
                recommendation: 'Review CFO stakeholder alignment battlecard during Friday 1-on-1.',
                type: 'Objection Handling',
                urgency: 'High'
              },
              {
                id: 'co-3',
                rep: 'Alex Ramirez',
                avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
                deal: 'Acme Corp ($250K)',
                issue: 'Competitor mentioned (Gong); rep handled smoothly but should reinforce automated workflow ROI in follow-up.',
                recommendation: 'Validate final proposal deck before sending to VP Ops.',
                type: 'Competitor Strategy',
                urgency: 'Low'
              }
            ].map((item) => (
              <div 
                key={item.id}
                className="p-4 rounded-xl bg-[rgba(25,28,31,0.6)] border border-[rgba(47,127,122,0.15)] space-y-2.5 hover:border-[rgba(47,127,122,0.35)] transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img src={item.avatar} alt={item.rep} className="w-6 h-6 rounded-md object-cover" />
                    <span className="text-xs font-semibold text-white">{item.rep}</span>
                    <span className="text-[10px] text-[#718096]">on {item.deal}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                    item.urgency === 'High' 
                      ? 'bg-[rgba(239,68,68,0.15)] text-[#F87171] border border-[rgba(239,68,68,0.3)]' 
                      : 'bg-[rgba(245,158,11,0.15)] text-[#F59E0B] border border-[rgba(245,158,11,0.3)]'
                  }`}>
                    {item.type}
                  </span>
                </div>

                <p className="text-xs text-[#E4E7E7] leading-relaxed">
                  {item.issue}
                </p>

                <div className="p-2.5 rounded-lg bg-[rgba(13,15,18,0.7)] border border-[rgba(47,127,122,0.12)] text-[11px] text-[#9ED9D4] flex items-start gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#4FA8A1] shrink-0 mt-0.5" />
                  <span><strong>Recommendation:</strong> {item.recommendation}</span>
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    onClick={() => {
                      const member = teamMembers.find(m => m.name === item.rep);
                      handleOpenAssignModal(member);
                    }}
                    className="px-2.5 py-1 text-[11px] font-medium text-[#4FA8A1] hover:text-[#9ED9D4] transition-colors"
                  >
                    Assign Coaching Action
                  </button>
                  <button
                    onClick={() => onNavigate('meetings')}
                    className="px-2.5 py-1 rounded-lg bg-[rgba(47,127,122,0.15)] hover:bg-[rgba(47,127,122,0.25)] text-white text-[11px] font-medium transition-colors"
                  >
                    Review Meeting
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team Activity & Deal Risk Signals */}
        <div className="surface p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="card-title flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#F59E0B]" />
              <span>Team High-Risk Deal Signals</span>
            </h3>
            <button 
              onClick={() => onNavigate('deals')}
              className="text-xs text-[#4FA8A1] hover:text-[#9ED9D4] font-medium flex items-center gap-1"
            >
              <span>View All Pipeline</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {mockDeals.filter(d => d.health !== 'Healthy').map((deal) => (
              <div 
                key={deal.id}
                onClick={() => onNavigate('deals')}
                className="p-4 rounded-xl bg-[rgba(25,28,31,0.6)] border border-[rgba(47,127,122,0.15)] hover:bg-[rgba(47,127,122,0.06)] cursor-pointer transition-all space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{deal.name}</span>
                    <span className="text-[10px] text-[#718096]">({deal.accountName})</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-white">
                    ${(deal.value / 1000).toFixed(0)}k
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <img src={deal.owner.avatar} alt={deal.owner.name} className="w-5 h-5 rounded-md object-cover" />
                    <span className="text-[#A0AEC0] text-[11px]">{deal.owner.name}</span>
                  </div>
                  <span className={`status-pill ${deal.health === 'At risk' ? 'pill-risk' : 'pill-attention'}`}>
                    {deal.health}
                  </span>
                </div>

                <div className="pt-1 text-[11px] text-[#718096] flex items-center justify-between border-t border-[rgba(47,127,122,0.1)]">
                  <span>Next: {deal.nextStep.title}</span>
                  <span className="font-mono text-[#4FA8A1]">{deal.nextStep.date}</span>
                </div>
              </div>
            ))}

            {/* Quick 1-on-1 Calendar Schedule card */}
            <div className="p-4 rounded-xl bg-[rgba(47,127,122,0.08)] border border-[rgba(47,127,122,0.25)] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#2F7F7A] text-white">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Upcoming Weekly Team Pipeline Review</h4>
                  <p className="text-[11px] text-[#718096]">Thursday, 2:00 PM • 4 Reps attending</p>
                </div>
              </div>

              <button
                onClick={() => onNavigate('meetings')}
                className="px-3 py-1.5 rounded-lg bg-[#2F7F7A] hover:bg-[#4FA8A1] text-white text-xs font-medium transition-colors"
              >
                Join / Prep
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Assign Coaching Task Modal */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#131619] border border-[rgba(47,127,122,0.35)] rounded-2xl w-full max-w-md p-6 space-y-5 shadow-2xl shadow-black animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[rgba(47,127,122,0.15)] pb-3">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-[#4FA8A1]" />
                <h3 className="text-base font-bold text-white">Assign Coaching Action</h3>
              </div>
              <button 
                onClick={() => setIsAssignModalOpen(false)}
                className="text-[#718096] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#A0AEC0] mb-1.5 font-medium">Assign To Sales Rep</label>
                <select
                  value={selectedMemberForTask?.id || ''}
                  onChange={(e) => {
                    const m = teamMembers.find(item => item.id === e.target.value);
                    if (m) setSelectedMemberForTask(m);
                  }}
                  className="w-full px-3.5 py-2.5 bg-[#0D0F12] border border-[rgba(47,127,122,0.25)] rounded-xl text-white focus:outline-none focus:border-[#4FA8A1]"
                >
                  {teamMembers.map(m => (
                    <option key={m.id} value={m.id}>{m.name} ({m.title})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[#A0AEC0] mb-1.5 font-medium">Task / Coaching Focus</label>
                <input
                  type="text"
                  placeholder="e.g. Schedule economic buyer alignment call before Friday"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#0D0F12] border border-[rgba(47,127,122,0.25)] rounded-xl text-white focus:outline-none focus:border-[#4FA8A1]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#A0AEC0] mb-1.5 font-medium">Priority</label>
                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-[#0D0F12] border border-[rgba(47,127,122,0.25)] rounded-xl text-white focus:outline-none focus:border-[#4FA8A1]"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#A0AEC0] mb-1.5 font-medium">Target Due Date</label>
                  <input
                    type="text"
                    value={taskDue}
                    onChange={(e) => setTaskDue(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#0D0F12] border border-[rgba(47,127,122,0.25)] rounded-xl text-white focus:outline-none focus:border-[#4FA8A1]"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-[rgba(47,127,122,0.12)]">
                <button
                  type="button"
                  onClick={() => setIsAssignModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-[#718096] hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#2F7F7A] hover:bg-[#4FA8A1] text-white font-semibold shadow-md transition-colors"
                >
                  Assign Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
