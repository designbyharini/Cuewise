import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Video, 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  ArrowRight,
  MessageSquare,
  Sparkles,
  ChevronDown,
  Users,
  Filter,
  User
} from 'lucide-react';
import { Meeting, NavSection, UserProfile } from '../../types';
import { mockMeetings, mockTeamMembers } from '../../data/mockData';

interface MeetingsViewProps {
  onNavigate: (section: NavSection, id?: string) => void;
  onOpenScheduleModal: () => void;
  currentUser?: UserProfile;
}

export const MeetingsView: React.FC<MeetingsViewProps> = ({ onNavigate, onOpenScheduleModal, currentUser }) => {
  const [selectedDate, setSelectedDate] = useState<number>(15);
  const [repFilter, setRepFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const isManager = currentUser?.role === 'Sales Manager';

  const filteredMeetings = mockMeetings.filter(meeting => {
    if (statusFilter !== 'all' && meeting.status !== statusFilter) return false;
    if (isManager && repFilter !== 'all') {
      const hasParticipant = meeting.participants.some(p => p.name === repFilter);
      if (!hasParticipant) return false;
    }
    return true;
  });

  // Calendar days generation for May 2025
  const calendarDays = [
    { day: 28, currentMonth: false },
    { day: 29, currentMonth: false },
    { day: 30, currentMonth: false },
    { day: 1, currentMonth: true },
    { day: 2, currentMonth: true },
    { day: 3, currentMonth: true },
    { day: 4, currentMonth: true },
    { day: 5, currentMonth: true },
    { day: 6, currentMonth: true, hasMeeting: true },
    { day: 7, currentMonth: true, hasMeeting: true },
    { day: 8, currentMonth: true, hasMeeting: true },
    { day: 9, currentMonth: true, hasMeeting: true },
    { day: 10, currentMonth: true },
    { day: 11, currentMonth: true },
    { day: 12, currentMonth: true },
    { day: 13, currentMonth: true, hasMeeting: true },
    { day: 14, currentMonth: true, hasMeeting: true },
    { day: 15, currentMonth: true, hasMeeting: true, isToday: true },
    { day: 16, currentMonth: true, hasMeeting: true },
    { day: 17, currentMonth: true },
    { day: 18, currentMonth: true },
    { day: 19, currentMonth: true, hasMeeting: true },
    { day: 20, currentMonth: true },
    { day: 21, currentMonth: true },
    { day: 22, currentMonth: true },
    { day: 23, currentMonth: true },
    { day: 24, currentMonth: true },
    { day: 25, currentMonth: true },
    { day: 26, currentMonth: true },
    { day: 27, currentMonth: true },
    { day: 28, currentMonth: true },
    { day: 29, currentMonth: true },
    { day: 30, currentMonth: true },
    { day: 31, currentMonth: true },
    { day: 1, currentMonth: false },
  ];

  return (
    <div id="meetings-view" className="flex-1 min-w-0 min-h-0 h-full flex flex-col xl:flex-row overflow-hidden">
      {/* Main Area (65-70%): Recorded Meetings */}
      <div className="flex-1 min-w-0 min-h-0 h-full overflow-y-auto overscroll-contain px-8 py-7 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-medium text-white tracking-tight">
              {isManager ? "Team Meetings & Conversation Intelligence" : "Meetings"}
            </h1>
            <p className="text-xs text-[#8E9CA8] mt-1 font-normal">
              {isManager 
                ? "Review recorded sales calls, talk-time balance, coaching moments, and key deal signals across direct reps." 
                : "Conversation intelligence, automated transcripts, and deal signals."}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {isManager && (
              <select
                value={repFilter}
                onChange={(e) => setRepFilter(e.target.value)}
                aria-label="Filter by rep"
                className="px-3 py-2 bg-[#0D0F12] border border-[rgba(47,127,122,0.25)] rounded-xl text-xs text-white focus:outline-none focus:border-[#4FA8A1]"
              >
                <option value="all">All Direct Reps</option>
                {mockTeamMembers.map(m => (
                  <option key={m.id} value={m.name}>{m.name}</option>
                ))}
              </select>
            )}

            <button
              id="btn-schedule-meeting"
              onClick={onOpenScheduleModal}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2F7F7A] hover:bg-[#4FA8A1] text-white text-xs font-semibold shadow-md shadow-[#2F7F7A]/20 transition-all duration-150"
            >
              <Plus className="w-4 h-4" />
              <span>Schedule</span>
            </button>
          </div>
        </div>

        {/* Section Heading */}
        <div className="flex items-center justify-between pt-2">
          <h2 className="text-sm font-semibold text-[#E2E8F0] uppercase tracking-wider">
            Recorded Meetings ({filteredMeetings.length})
          </h2>
          <div className="flex items-center gap-3">
            <span className="text-xs text-[#8E9CA8]">
              Sorted by most recent
            </span>
          </div>
        </div>

        {/* Recorded Meetings List */}
        <div className="space-y-3">
          {filteredMeetings.map((meeting) => (
            <div
              key={meeting.id}
              id={`meeting-card-${meeting.id}`}
              onClick={() => onNavigate('meeting-detail', meeting.id)}
              className="surface surface-hover p-4.5 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              {/* Meeting Details */}
              <div className="flex items-start md:items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-[rgba(47,127,122,0.15)] border border-[rgba(47,127,122,0.3)] flex items-center justify-center text-[#4FA8A1] shrink-0">
                  <CalendarIcon className="w-5 h-5" />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h3 className="text-sm font-semibold text-[#E4E7E7] group-hover:text-[#9ED9D4] transition-colors">
                      {meeting.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-[#718096] flex-wrap">
                    <span className="text-[#C2D0DC] font-medium">{meeting.accountName}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#718096]" />
                      <span>{meeting.date} · {meeting.time}</span>
                    </span>
                    <span>•</span>
                    <span className="font-mono text-[#9ED9D4]">{meeting.duration}</span>
                  </div>
                </div>
              </div>

              {/* Participants & Status & Action */}
              <div className="flex items-center gap-4 self-end md:self-center">
                {/* Participant Avatars */}
                <div className="flex items-center -space-x-2 overflow-hidden">
                  {meeting.participants.map((p, idx) => (
                    <img
                      key={idx}
                      src={p.avatar}
                      alt={p.name}
                      title={`${p.name} (${p.company})`}
                      className="inline-block h-7 w-7 rounded-full ring-2 ring-[#0D0F10] object-cover"
                    />
                  ))}
                </div>

                {/* Status Badges */}
                <div className="flex items-center gap-2">
                  {meeting.status === 'Analysis ready' ? (
                    <span className="status-pill pill-green">
                      <Sparkles className="w-3 h-3" />
                      <span>Analysis ready</span>
                    </span>
                  ) : (
                    <span className="status-pill pill-amber">
                      <MessageSquare className="w-3 h-3" />
                      <span>Feedback</span>
                    </span>
                  )}
                </div>

                {/* View Meeting Link */}
                <div className="flex items-center gap-1 text-xs font-semibold text-[#4FA8A1] group-hover:text-[#9ED9D4] transition-all">
                  <span>View →</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Area: Calendar and Upcoming Schedule */}
      <aside 
        id="meetings-calendar-rail"
        className="w-full xl:w-80 flex-shrink-0 h-full min-h-0 overflow-y-auto overscroll-contain border-t xl:border-t-0 xl:border-l border-[rgba(47,127,122,0.1)] bg-[rgba(13,15,16,0.3)] px-5 py-7 space-y-6"
      >
        {/* Compact Monthly Calendar */}
        <div className="surface p-4">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-[#E4E7E7] tracking-wide uppercase">
              May 2025
            </span>
            <div className="flex items-center gap-1">
              <button className="p-1 rounded-lg hover:bg-[rgba(47,127,122,0.1)] text-[#718096] hover:text-white transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="p-1 rounded-lg hover:bg-[rgba(47,127,122,0.1)] text-[#718096] hover:text-white transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Days Header */}
          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((d, i) => (
              <span key={i} className="text-[11px] font-medium text-[#718096]">
                {d}
              </span>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {calendarDays.map((item, idx) => {
              const isSelected = selectedDate === item.day && item.currentMonth;
              return (
                <button
                  key={idx}
                  onClick={() => item.currentMonth && setSelectedDate(item.day)}
                  disabled={!item.currentMonth}
                  className={`h-8 rounded-lg flex flex-col items-center justify-center relative text-xs font-medium transition-all ${
                    !item.currentMonth
                      ? 'text-[#3E4A56] cursor-not-allowed'
                      : isSelected
                      ? 'bg-[#2F7F7A] text-white shadow-sm shadow-[#2F7F7A]/40 font-semibold'
                      : item.isToday
                      ? 'border border-[#4FA8A1] text-[#9ED9D4] hover:bg-[rgba(47,127,122,0.1)]'
                      : 'text-[#C2D0DC] hover:bg-[rgba(47,127,122,0.08)]'
                  }`}
                >
                  <span>{item.day}</span>
                  {item.hasMeeting && item.currentMonth && !isSelected && (
                    <span className="w-1 h-1 rounded-full bg-[#4FA8A1] absolute bottom-1" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Today's Scheduled Meetings */}
        <div className="space-y-3">
          <div className="card-title mb-2">
            <span>Today's Calls</span>
            <span className="text-xs text-[#718096] font-mono normal-case">May 15, 2025</span>
          </div>

          <div className="space-y-2.5">
            {[
              { time: '10:00 AM', title: 'Northwind — Follow up', duration: '45m', type: 'Discovery call', meetingId: 'm-2' },
              { time: '2:00 PM', title: 'Acme Demo', duration: '30m', type: 'Demo', meetingId: 'm-1' },
              { time: '4:00 PM', title: 'Recurve Review', duration: '50m', type: 'Review', meetingId: 'm-4' },
            ].map((slot, idx) => (
              <div
                key={idx}
                onClick={() => onNavigate('meeting-detail', slot.meetingId)}
                className="p-3 rounded-xl bg-[rgba(25,28,31,0.5)] border border-[rgba(47,127,122,0.1)] hover:border-[rgba(47,127,122,0.3)] cursor-pointer transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="px-2 py-1 rounded-lg bg-[rgba(47,127,122,0.15)] text-center shrink-0 border border-[rgba(47,127,122,0.25)]">
                    <span className="text-[11px] font-mono font-bold text-[#9ED9D4] block leading-none">
                      {slot.time.split(' ')[0]}
                    </span>
                    <span className="text-[9px] text-[#718096] uppercase font-mono block mt-0.5">
                      {slot.time.split(' ')[1]}
                    </span>
                  </div>

                  <div className="space-y-0.5">
                    <div className="text-xs font-semibold text-[#E4E7E7] group-hover:text-[#9ED9D4] transition-colors">
                      {slot.title}
                    </div>
                    <div className="text-[11px] text-[#718096]">
                      {slot.duration} · {slot.type}
                    </div>
                  </div>
                </div>

                <div className="p-1.5 rounded-lg bg-[rgba(25,28,31,0.8)] group-hover:bg-[#2F7F7A] text-[#4FA8A1] group-hover:text-white transition-colors">
                  <Video className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Coming Up */}
        <div className="space-y-3">
          <div className="card-title mb-2">
            <span>Coming Up</span>
            <span className="text-[11px] text-[#718096] lowercase">this week</span>
          </div>

          <div className="space-y-2">
            {[
              { date: 'May 16', day: 'FRI', title: 'BetaCo Check-in', time: '11:00 AM · 30m', meetingId: 'm-3' },
              { date: 'May 16', day: 'FRI', title: 'Kinext Strategy Call', time: '2:30 PM · 45m', meetingId: 'm-5' },
              { date: 'May 19', day: 'MON', title: 'Acme Follow-up', time: '10:30 AM · 30m', meetingId: 'm-1' },
            ].map((item, idx) => (
              <div
                key={idx}
                onClick={() => onNavigate('meeting-detail', item.meetingId)}
                className="p-2.5 rounded-xl bg-[rgba(25,28,31,0.3)] border border-[rgba(47,127,122,0.08)] hover:border-[rgba(47,127,122,0.25)] transition-colors flex items-center justify-between cursor-pointer group text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="text-left w-12 shrink-0">
                    <span className="font-medium text-[#E4E7E7] block leading-none">
                      {item.date}
                    </span>
                    <span className="text-[9px] font-mono text-[#718096] block mt-0.5">
                      {item.day}
                    </span>
                  </div>

                  <div className="space-y-0.5">
                    <div className="font-medium text-[#C2D0DC] group-hover:text-white truncate">
                      {item.title}
                    </div>
                    <div className="text-[10px] text-[#718096]">
                      {item.time}
                    </div>
                  </div>
                </div>

                <Video className="w-3.5 h-3.5 text-[#718096] group-hover:text-[#4FA8A1]" />
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
};
