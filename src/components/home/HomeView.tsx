import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  ArrowUpRight, 
  AlertCircle, 
  Sparkles, 
  MessageSquare, 
  ChevronRight, 
  Pin, 
  TrendingUp, 
  CheckCircle2, 
  ExternalLink,
  ChevronDown,
  Users,
  Award,
  Target
} from 'lucide-react';
import { NavSection, UserProfile } from '../../types';
import { quickContacts, mockMeetings, mockDeals, mockTasks, mockTeamMembers } from '../../data/mockData';

interface HomeViewProps {
  onNavigate: (section: NavSection, id?: string) => void;
  currentUser: UserProfile;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate, currentUser }) => {
  const isManager = currentUser.role === 'Sales Manager';

  return (
    <div id="home-view" className="flex-1 min-w-0 min-h-0 h-full flex flex-col xl:flex-row overflow-hidden">
      {/* Centre Dashboard Workspace */}
      <div className="flex-1 min-w-0 min-h-0 h-full overflow-y-auto overscroll-contain p-8 space-y-6">
        {/* Top of Centre Area Greeting */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-[28px] font-medium text-[#E4E7E7] tracking-tight flex items-center gap-2">
              Good morning, {currentUser.name.split(' ')[0]} <span className="text-2xl">👋</span>
            </h1>
            <p className="text-xs text-[#718096] mt-1 font-normal">
              {isManager 
                ? 'Team revenue progression, coaching opportunities, and high-risk deals across 4 direct reps.' 
                : 'Thursday, May 15, 2025 • Your individual sales agenda and active pipeline.'}
            </p>
          </div>

          {/* Role badge & Compact Date Selector */}
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[rgba(47,127,122,0.18)] text-[#4FA8A1] border border-[rgba(47,127,122,0.35)]">
              {isManager ? 'Sales Manager View' : 'Sales Rep View'}
            </span>

            <button 
              id="btn-date-selector"
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-[100px] bg-[rgba(25,28,31,0.8)] border border-[rgba(255,255,255,0.05)] text-xs font-medium text-[#C2D0DC] hover:border-[#2F7F7A] transition-colors"
            >
              <CalendarIcon className="w-3.5 h-3.5 text-[#4FA8A1]" />
              <span>May 1 - May 31, 2025</span>
              <ChevronDown className="w-3 h-3 text-[#718096]" />
            </button>
          </div>
        </div>

        {/* First Row: 3 Grouped Surfaces */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* 1. Schedule (Personal vs Team) */}
          <div 
            id="widget-todays-schedule"
            className="surface flex flex-col justify-between surface-hover"
          >
            <div>
              <div className="card-title">
                <span>{isManager ? "Team Calls Today" : "Today's Schedule"}</span>
                <span className="text-[11px] font-normal text-[#718096] lowercase">
                  {isManager ? "4 across team" : "4 meetings"}
                </span>
              </div>

              {/* Schedule List */}
              <div className="space-y-3">
                {(isManager ? [
                  { time: '10:00 AM', name: 'Northwind Renewal', rep: 'Alex Ramirez', duration: '30m', meetingId: 'm-2' },
                  { time: '11:30 AM', name: 'Product Demo — BetaCo', rep: 'Sarah Chen', duration: '45m', meetingId: 'm-3' },
                  { time: '2:00 PM', name: '1:1 Coaching Sync', rep: 'Maya Thompson', duration: '30m', meetingId: 'm-1' },
                  { time: '4:00 PM', name: 'Acme Corp — ERP Review', rep: 'Alex Ramirez', duration: '50m', meetingId: 'm-1' },
                ] : [
                  { time: '10:00 AM', name: 'Northwind — Follow up', rep: '', duration: '30m', meetingId: 'm-2' },
                  { time: '11:30 AM', name: 'Product Demo — BetaCo', rep: '', duration: '45m', meetingId: 'm-3' },
                  { time: '2:00 PM', name: 'Internal Huddle', rep: '', duration: '35m', meetingId: 'm-1' },
                  { time: '4:00 PM', name: 'Acme Corp — Check-in', rep: '', duration: '30m', meetingId: 'm-1' },
                ]).map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => onNavigate('meeting-detail', item.meetingId)}
                    className="flex items-center justify-between py-1.5 cursor-pointer group text-xs"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="font-mono text-[#718096] shrink-0 w-16">
                        {item.time}
                      </span>
                      <div className="truncate">
                        <span className="text-[#E4E7E7] font-medium truncate group-hover:text-[#9ED9D4] transition-colors block">
                          {item.name}
                        </span>
                        {isManager && item.rep && (
                          <span className="text-[10px] text-[#4FA8A1] block font-medium">
                            {item.rep}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-[11px] text-[#718096] shrink-0 ml-2 font-mono">
                      {item.duration}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Open Calendar Action */}
            <button
              id="link-open-calendar"
              onClick={() => onNavigate('meetings')}
              className="mt-4 pt-3 border-t border-[rgba(47,127,122,0.1)] flex items-center justify-between text-xs text-[#4FA8A1] hover:text-[#9ED9D4] transition-colors font-semibold group"
            >
              <span>{isManager ? "Open team meeting hub →" : "Open calendar →"}</span>
            </button>
          </div>

          {/* 2. Priority Actions (Personal vs Manager Approvals & Coaching) */}
          <div 
            id="widget-priority-actions"
            className="surface flex flex-col justify-between surface-hover"
          >
            <div>
              <div className="card-title">
                <span>{isManager ? "Manager Coaching & Approvals" : "Priority Actions"}</span>
                <span className="text-[10px] text-[#F6E05E] bg-[rgba(236,201,75,0.15)] px-2 py-0.5 rounded-full font-semibold">
                  3 Pending
                </span>
              </div>

              {/* Action items */}
              <div className="space-y-3">
                {(isManager ? [
                  {
                    title: "Review Alex's Acme ERP Proposal",
                    subtext: '$250k pricing tier needs manager signoff',
                    dotColor: 'bg-[#FC8181]',
                    action: () => onNavigate('meeting-detail', 'm-1'),
                  },
                  {
                    title: 'Discount Approval: Northwind 3-Year',
                    subtext: 'Marcus Vance requested 15% multi-year concession',
                    dotColor: 'bg-[#F6E05E]',
                    action: () => onNavigate('meeting-detail', 'm-2'),
                  },
                  {
                    title: 'Coaching follow-up with Maya Thompson',
                    subtext: 'High monologue (3m10s) detected on Delta demo',
                    dotColor: 'bg-[#4FA8A1]',
                    action: () => onNavigate('team'),
                  },
                ] : [
                  {
                    title: 'Acme deal — no activity in 9 days',
                    subtext: 'High intent deal requires touchpoint',
                    dotColor: 'bg-[#FC8181]',
                    action: () => onNavigate('account-detail', 'acc-1'),
                  },
                  {
                    title: 'Follow up with James — due today',
                    subtext: 'Send commercial proposal rev 2',
                    dotColor: 'bg-[#F6E05E]',
                    action: () => onNavigate('tasks'),
                  },
                  {
                    title: 'Prepare BetaCo meeting discovery',
                    subtext: 'Review competitors and tech stack',
                    dotColor: 'bg-[#4FA8A1]',
                    action: () => onNavigate('meeting-detail', 'm-3'),
                  },
                ]).map((action, idx) => (
                  <div
                    key={idx}
                    onClick={action.action}
                    className="flex items-start gap-2.5 cursor-pointer group py-1 text-xs"
                  >
                    <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${action.dotColor}`} />
                    <div className="flex-1 min-w-0">
                      <div className="text-[#E4E7E7] font-medium leading-snug group-hover:text-[#9ED9D4] transition-colors truncate">
                        {action.title}
                      </div>
                      <div className="text-[11px] text-[#718096] truncate">
                        {action.subtext}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              id="link-view-all-actions"
              onClick={() => onNavigate(isManager ? 'team' : 'tasks')}
              className="mt-4 pt-3 border-t border-[rgba(47,127,122,0.1)] flex items-center justify-between text-xs text-[#4FA8A1] hover:text-[#9ED9D4] transition-colors font-semibold group"
            >
              <span>{isManager ? "Open team coaching hub →" : "View all tasks →"}</span>
            </button>
          </div>

          {/* 3. Progress (Personal Quota vs Team Quota) */}
          <div 
            id="widget-weekly-progress"
            className="surface flex flex-col justify-between surface-hover"
          >
            <div>
              <div className="card-title">
                <span>{isManager ? "Team Quota Pacing" : "Weekly Progress"}</span>
                <span className="status-pill pill-green">On track</span>
              </div>

              {/* Progress Circle & Quota Target */}
              <div className="flex items-center gap-4 my-2">
                <div className="progress-circle">
                  {isManager ? "73%" : "68%"}
                </div>
                <div className="space-y-0.5">
                  <div className="text-[11px] text-[#718096] uppercase tracking-wider font-semibold">
                    {isManager ? "Team Target Q2" : "Quota Target"}
                  </div>
                  <div className="text-[18px] font-semibold text-[#E4E7E7] font-mono">
                    {isManager ? "$2.98M / $4.10M" : "$840k / $1.2m"}
                  </div>
                </div>
              </div>

              {/* Mini Target Metrics */}
              <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-[rgba(47,127,122,0.1)] text-xs">
                <div className="p-2 rounded-lg bg-[rgba(25,28,31,0.5)] border border-[rgba(47,127,122,0.08)]">
                  <span className="text-[11px] text-[#718096] block">
                    {isManager ? "Team Deals Won" : "Deals Won"}
                  </span>
                  <span className="text-sm font-semibold text-[#E4E7E7] font-mono">
                    {isManager ? "42" : "7"} <span className="text-[#68D391] text-[10px]">↑ 16%</span>
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-[rgba(25,28,31,0.5)] border border-[rgba(47,127,122,0.08)]">
                  <span className="text-[11px] text-[#718096] block">
                    {isManager ? "Calls Analyzed" : "Calls Analyzed"}
                  </span>
                  <span className="text-sm font-semibold text-[#E4E7E7] font-mono">
                    {isManager ? "93" : "14"} <span className="text-[#68D391] text-[10px]">↑ 12%</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-3 text-[10px] text-[#718096] text-center font-mono">
              12 days remaining in quota cycle
            </div>
          </div>
        </div>

        {/* Second Row: Pipeline Snapshot + Deal Watchlist */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Pipeline Snapshot (7 cols) */}
          <div 
            id="widget-pipeline-snapshot"
            className="lg:col-span-7 surface flex flex-col justify-between surface-hover"
          >
            <div>
              <div className="card-title">
                <span>{isManager ? "Team Aggregate Pipeline" : "Pipeline Snapshot"}</span>
                <span className="text-xs font-mono font-semibold text-[#E4E7E7]">$7.42M · 35 deals</span>
              </div>

              {/* Multi-segment Pipeline Bar */}
              <div className="my-4">
                <div className="pipeline-bar">
                  <div className="pipeline-seg bg-[#1F5F5B]" style={{ width: '20%' }} title="Prospecting: 20%" />
                  <div className="pipeline-seg bg-[#2F7F7A]" style={{ width: '28%' }} title="Qualification: 28%" />
                  <div className="pipeline-seg bg-[#4FA8A1]" style={{ width: '24%' }} title="Proposal: 24%" />
                  <div className="pipeline-seg bg-[#9ED9D4]" style={{ width: '16%' }} title="Negotiation: 16%" />
                  <div className="pipeline-seg bg-[#68D391]" style={{ width: '12%' }} title="Closed Won: 12%" />
                </div>
              </div>

              {/* Breakdown Grid */}
              <div className="grid grid-cols-5 gap-2 text-center text-xs pt-1">
                <div>
                  <div className="text-[11px] text-[#718096] truncate">Prospecting</div>
                  <div className="font-semibold text-[#E4E7E7] font-mono mt-0.5">$1.24M</div>
                  <div className="text-[10px] text-[#718096]">12 deals</div>
                </div>
                <div>
                  <div className="text-[11px] text-[#718096] truncate">Qualification</div>
                  <div className="font-semibold text-[#E4E7E7] font-mono mt-0.5">$2.31M</div>
                  <div className="text-[10px] text-[#718096]">8 deals</div>
                </div>
                <div>
                  <div className="text-[11px] text-[#718096] truncate">Proposal</div>
                  <div className="font-semibold text-[#E4E7E7] font-mono mt-0.5">$1.86M</div>
                  <div className="text-[10px] text-[#718096]">6 deals</div>
                </div>
                <div>
                  <div className="text-[11px] text-[#718096] truncate">Negotiation</div>
                  <div className="font-semibold text-[#E4E7E7] font-mono mt-0.5">$1.07M</div>
                  <div className="text-[10px] text-[#718096]">4 deals</div>
                </div>
                <div>
                  <div className="text-[11px] text-[#718096] truncate">Closed Won</div>
                  <div className="font-semibold text-[#68D391] font-mono mt-0.5">$950K</div>
                  <div className="text-[10px] text-[#718096]">5 deals</div>
                </div>
              </div>
            </div>

            {/* Total Pipeline Footer */}
            <div 
              onClick={() => onNavigate('deals')}
              className="mt-5 pt-3.5 border-t border-[rgba(47,127,122,0.1)] flex items-center justify-between cursor-pointer group text-xs text-[#4FA8A1] font-semibold"
            >
              <span>{isManager ? "View full team pipeline matrix →" : "View full pipeline matrix →"}</span>
              <span className="text-xs font-normal text-[#68D391]">↑ 18% vs last month</span>
            </div>
          </div>

          {/* Deal Watchlist (5 cols) */}
          <div 
            id="widget-deal-watchlist"
            className="lg:col-span-5 surface flex flex-col justify-between surface-hover"
          >
            <div>
              <div className="card-title">
                <span>{isManager ? "Team Risk Watchlist" : "Deal Watchlist"}</span>
                <span className="text-[11px] font-normal text-[#718096] lowercase">signals & risk</span>
              </div>

              {/* Watchlist entries */}
              <div className="space-y-2.5">
                {(isManager ? [
                  {
                    company: 'Northwind Traders',
                    rep: 'Alex Ramirez',
                    stage: 'Proposal',
                    status: 'Waiting 4 days',
                    pillClass: 'pill-amber',
                    action: () => onNavigate('account-detail', 'acc-2'),
                  },
                  {
                    company: 'BetaCo Systems',
                    rep: 'Sarah Chen',
                    stage: 'Qualification',
                    status: 'Blocker flagged',
                    pillClass: 'pill-red',
                    action: () => onNavigate('account-detail', 'acc-3'),
                  },
                  {
                    company: 'Delta Systems',
                    rep: 'Maya Thompson',
                    stage: 'Negotiation',
                    status: 'Redlines accepted',
                    pillClass: 'pill-green',
                    action: () => onNavigate('account-detail', 'acc-4'),
                  },
                ] : [
                  {
                    company: 'Northwind Traders',
                    rep: '',
                    stage: 'Proposal',
                    status: 'Waiting 4 days',
                    pillClass: 'pill-amber',
                    action: () => onNavigate('account-detail', 'acc-2'),
                  },
                  {
                    company: 'BetaCo Systems',
                    rep: '',
                    stage: 'Qualification',
                    status: 'Blocker flagged',
                    pillClass: 'pill-red',
                    action: () => onNavigate('account-detail', 'acc-3'),
                  },
                  {
                    company: 'Acme Corporation',
                    rep: '',
                    stage: 'Negotiation',
                    status: 'High intent · Budget OK',
                    pillClass: 'pill-green',
                    action: () => onNavigate('meeting-detail', 'm-1'),
                  },
                ]).map((deal, idx) => (
                  <div
                    key={idx}
                    onClick={deal.action}
                    className="p-2.5 rounded-xl bg-[rgba(25,28,31,0.5)] border border-[rgba(47,127,122,0.08)] hover:border-[rgba(47,127,122,0.25)] cursor-pointer transition-all flex items-center justify-between text-xs group"
                  >
                    <div>
                      <div className="font-medium text-[#E4E7E7] group-hover:text-[#9ED9D4] transition-colors flex items-center gap-1.5">
                        <span>{deal.company}</span>
                        {isManager && deal.rep && (
                          <span className="text-[10px] text-[#718096] font-normal">({deal.rep})</span>
                        )}
                      </div>
                      <div className="text-[11px] text-[#718096]">
                        {deal.stage}
                      </div>
                    </div>
                    <span className={`status-pill ${deal.pillClass}`}>
                      {deal.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => onNavigate('deals')}
              className="mt-4 pt-3 border-t border-[rgba(47,127,122,0.1)] flex items-center justify-between text-xs text-[#4FA8A1] hover:text-[#9ED9D4] transition-colors font-semibold group"
            >
              <span>{isManager ? "Inspect all team deals →" : "Explore all active deals →"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Right Rail */}
      <aside 
        id="home-utility-rail"
        className="w-[260px] flex-shrink-0 h-full min-h-0 overflow-y-auto overscroll-contain border-l border-[rgba(47,127,122,0.1)] bg-[rgba(13,15,16,0.3)] px-5 py-7 space-y-6 hidden xl:block"
      >
        {/* Manager Team Roster or AI Suggestions */}
        {isManager ? (
          <div className="space-y-3">
            <div className="card-title mb-2 flex items-center justify-between">
              <span>Direct Reps</span>
              <button 
                onClick={() => onNavigate('team')}
                className="text-[10px] text-[#4FA8A1] hover:underline"
              >
                Team Hub →
              </button>
            </div>

            <div className="space-y-2">
              {mockTeamMembers.map((rep) => (
                <div
                  key={rep.id}
                  onClick={() => onNavigate('team')}
                  className="p-2 rounded-xl bg-[rgba(25,28,31,0.5)] border border-[rgba(47,127,122,0.1)] hover:border-[rgba(47,127,122,0.3)] transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <img src={rep.avatar} alt={rep.name} className="w-7 h-7 rounded-lg object-cover ring-1 ring-[#2F7F7A]/50 shrink-0" />
                    <div className="truncate text-xs flex-1">
                      <div className="font-medium text-[#E4E7E7] group-hover:text-white truncate">
                        {rep.name}
                      </div>
                      <div className="text-[10px] text-[#718096] flex items-center justify-between">
                        <span>{Math.round((rep.quotaClosed / rep.quotaTarget) * 100)}% quota</span>
                        <span className="text-[#4FA8A1] font-semibold">{rep.coachingScore} score</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="card-title mb-2">
              <span>AI Suggestions</span>
            </div>

            <div className="space-y-2.5">
              <div 
                onClick={() => onNavigate('account-detail', 'acc-2')}
                className="p-3.5 rounded-xl bg-[rgba(47,127,122,0.08)] border border-[rgba(47,127,122,0.3)] hover:border-[#4FA8A1] transition-all cursor-pointer group"
              >
                <div className="text-xs font-semibold text-[#9ED9D4] mb-1">
                  Northwind Traders
                </div>
                <p className="text-[11px] text-[#A0AEC0] leading-relaxed">
                  Competitor mention (Retool) detected in last call. Recommend sending ROI comparison sheet.
                </p>
                <div className="mt-2 text-[10px] text-[#4FA8A1] font-bold tracking-wider">
                  GENERATE EMAIL →
                </div>
              </div>

              <div 
                onClick={() => onNavigate('meeting-detail', 'm-1')}
                className="p-3.5 rounded-xl bg-[rgba(25,28,31,0.5)] border border-[rgba(47,127,122,0.1)] hover:border-[rgba(47,127,122,0.3)] transition-all cursor-pointer group"
              >
                <div className="text-xs font-semibold text-[#9ED9D4] mb-1">
                  Acme Corporation
                </div>
                <p className="text-[11px] text-[#A0AEC0] leading-relaxed">
                  Budget confirmed at $250K. Deliver ROI model by end of day.
                </p>
                <div className="mt-2 text-[10px] text-[#4FA8A1] font-bold tracking-wider">
                  VIEW ACTION →
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Contacts */}
        <div className="space-y-3">
          <div className="card-title mb-2">
            <span>Quick Contacts</span>
          </div>

          <div className="space-y-2">
            {quickContacts.slice(0, 4).map((contact) => (
              <div
                key={contact.id}
                className="flex items-center gap-3 p-1.5 rounded-lg hover:bg-[rgba(47,127,122,0.08)] transition-colors cursor-pointer group"
              >
                <div className="w-7 h-7 rounded-full bg-[#1F5F5B] text-[#9ED9D4] font-semibold text-xs flex items-center justify-center border border-[rgba(47,127,122,0.3)]">
                  {contact.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="truncate text-xs">
                  <div className="font-medium text-[#E4E7E7] group-hover:text-white truncate">
                    {contact.name}
                  </div>
                  <div className="text-[10px] text-[#718096] truncate">
                    {contact.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Manager Feedback / Coaching Notes */}
        <div className="space-y-3">
          <div className="card-title mb-2">
            <span>{isManager ? "Recent Coaching Sent" : "Manager Feedback"}</span>
          </div>

          <div className="space-y-2.5">
            <div 
              onClick={() => onNavigate('meeting-detail', 'm-1')}
              className="p-3 rounded-xl bg-[rgba(25,28,31,0.5)] border border-[rgba(47,127,122,0.1)] hover:border-[rgba(47,127,122,0.25)] transition-all cursor-pointer text-xs"
            >
              <blockquote className="text-[11px] text-[#CBD5E0] italic border-l-2 border-[#2F7F7A] pl-2.5 leading-relaxed">
                {isManager 
                  ? "“Strong discovery momentum on Acme Corp. Make sure Alex locks in procurement early.”"
                  : "“Great handling of the ERP integration objection. Let’s make sure we lock down timeline before next week.”"}
              </blockquote>
              <div className="mt-2 text-[10px] text-[#4FA8A1] font-medium">
                {isManager ? "To Alex Ramirez · 2h ago" : "Ryan J. · 2h ago"}
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};
