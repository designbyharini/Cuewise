import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  Share2, 
  MoreHorizontal, 
  Play, 
  Pause, 
  Volume2, 
  Maximize2, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  MessageSquare, 
  TrendingUp, 
  Search, 
  Filter, 
  Bookmark, 
  Plus, 
  Award, 
  AlertTriangle, 
  CheckSquare, 
  ArrowRight,
  Send,
  Sliders,
  Check
} from 'lucide-react';
import { Meeting, NavSection, UserProfile, TranscriptLine } from '../../types';

interface MeetingDetailViewProps {
  meeting: Meeting;
  onNavigate: (section: NavSection, id?: string) => void;
  currentUser: UserProfile;
}

export const MeetingDetailView: React.FC<MeetingDetailViewProps> = ({
  meeting,
  onNavigate,
  currentUser,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'transcript' | 'coaching'>('overview');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTimeSec, setCurrentTimeSec] = useState<number>(872); // 14:32 default for manager feedback showcase
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [transcriptFilter, setTranscriptFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [nextSteps, setNextSteps] = useState(meeting.nextSteps);
  const [selectedTranscriptLine, setSelectedTranscriptLine] = useState<string | null>(null);
  const [newManagerComment, setNewManagerComment] = useState<string>('');
  const [managerComments, setManagerComments] = useState(meeting.coaching.managerComments || []);
  const [copiedLink, setCopiedLink] = useState(false);

  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Handle jumping to a timestamp
  const jumpToTime = (secs: number) => {
    setCurrentTimeSec(secs);
    setIsPlaying(true);
  };

  const toggleTaskCompletion = (taskId: string) => {
    setNextSteps(prev => 
      prev.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t)
    );
  };

  const handleAddManagerComment = () => {
    if (!newManagerComment.trim()) return;
    const newComment = {
      id: `mc-${Date.now()}`,
      author: currentUser.name,
      avatar: currentUser.avatar,
      date: 'Just now',
      comment: newManagerComment.trim(),
    };
    setManagerComments([newComment, ...managerComments]);
    setNewManagerComment('');
  };

  const handleShare = () => {
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Filter transcript
  const filteredTranscript = meeting.transcript.filter(t => {
    const matchesSearch = t.text.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.speaker.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (transcriptFilter === 'all') return true;
    if (transcriptFilter === 'questions') return t.highlightType === 'question';
    if (transcriptFilter === 'pricing') return t.highlightType === 'pricing';
    if (transcriptFilter === 'objections') return t.highlightType === 'objection';
    if (transcriptFilter === 'competitors') return t.highlightType === 'competitor';
    if (transcriptFilter === 'next-steps') return t.highlightType === 'next-step';
    return true;
  });

  return (
    <div id="meeting-detail-view" className="flex-1 min-w-0 min-h-0 h-full flex flex-col overflow-hidden">
      {/* Top Header Strip */}
      <div className="px-8 py-5 border-b border-[rgba(47,127,122,0.15)] bg-[rgba(13,15,18,0.7)] backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-4">
          <button
            id="btn-back-to-meetings"
            onClick={() => onNavigate('meetings')}
            className="p-2 rounded-xl bg-[rgba(25,28,31,0.6)] hover:bg-[rgba(47,127,122,0.2)] border border-[rgba(47,127,122,0.2)] text-[#718096] hover:text-white transition-colors"
            title="Back to Meetings"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-semibold text-[#E4E7E7] tracking-tight">
                {meeting.title}
              </h1>
              <span className="status-pill pill-green flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>Analyzed</span>
              </span>
            </div>

            <div className="flex items-center gap-2.5 text-xs text-[#718096] mt-1 flex-wrap">
              <button 
                onClick={() => onNavigate('account-detail', meeting.accountId)}
                className="text-[#9ED9D4] hover:underline font-medium"
              >
                {meeting.accountName}
              </button>
              <span>•</span>
              <span>{meeting.participants.length} participants</span>
              <span>•</span>
              <span>{meeting.date}</span>
              <span>•</span>
              <span className="font-mono text-[#E4E7E7]">{meeting.duration}</span>
              {meeting.linkedDealName && (
                <>
                  <span>•</span>
                  <button 
                    onClick={() => onNavigate('deals')}
                    className="text-[#C2D0DC] hover:text-white flex items-center gap-1 font-medium"
                  >
                    <span>Deal: {meeting.linkedDealName}</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 self-end sm:self-center">
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[rgba(25,28,31,0.6)] hover:bg-[rgba(47,127,122,0.2)] border border-[rgba(47,127,122,0.2)] text-xs font-medium text-[#C2D0DC] hover:text-white transition-colors"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-[#4FA8A1]" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'Link Copied' : 'Share'}</span>
          </button>

          {/* Tab Navigation Pill in Header */}
          <div className="flex items-center p-1 rounded-xl bg-[rgba(25,28,31,0.6)] border border-[rgba(47,127,122,0.2)]">
            {(['overview', 'transcript', 'coaching'] as const).map((tab) => (
              <button
                key={tab}
                id={`tab-${tab}`}
                onClick={() => setActiveTab(tab)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
                  activeTab === tab
                    ? 'bg-[#2F7F7A] text-white shadow-sm shadow-[#2F7F7A]/30'
                    : 'text-[#718096] hover:text-[#E4E7E7]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Workspace Body */}
      <div className="flex-1 min-w-0 min-h-0 overflow-y-auto px-8 py-6">
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column (7 cols): Large Video Player & Talk/Listen Metrics */}
            <div className="lg:col-span-7 space-y-6">
              {/* Interactive Video Container */}
              <div 
                id="meeting-video-container"
                className="surface overflow-hidden shadow-xl relative group"
              >
                {/* Simulated Meeting Video Frame */}
                <div className="relative aspect-video bg-[#0D0F12] flex items-center justify-center overflow-hidden">
                  {/* Atmospheric Petrol Halo in video background */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#163B3A]/40 via-[#0D0F12] to-[#1F5F5B]/30" />
                  
                  {/* Participant Video Gallery Grid */}
                  <div className="grid grid-cols-2 gap-3 p-4 w-full h-full relative z-10">
                    {meeting.participants.map((p, idx) => (
                      <div 
                        key={idx} 
                        className="relative rounded-xl overflow-hidden bg-[rgba(25,28,31,0.8)] border border-[rgba(47,127,122,0.15)] flex items-center justify-center"
                      >
                        <img 
                          src={p.avatar} 
                          alt={p.name}
                          className="w-16 h-16 rounded-full object-cover ring-2 ring-[#2F7F7A]/40"
                        />
                        <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur-xs text-[10px] text-white font-medium flex items-center gap-1.5">
                          <span className={`w-1.5 h-1.5 rounded-full ${idx === 0 ? 'bg-[#4FA8A1] animate-pulse' : 'bg-[#718096]'}`} />
                          <span>{p.name} ({p.company || 'Cuewise'})</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Big Play/Pause Overlay on Hover */}
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/50 transition-colors z-20"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-[#2F7F7A]/90 hover:bg-[#4FA8A1] text-white border border-[#9ED9D4]/40 flex items-center justify-center shadow-lg transition-transform group-hover:scale-105">
                      {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
                    </div>
                  </button>

                  {/* Active Timestamp Pill */}
                  <div className="absolute top-3 left-3 z-20 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-xs text-[11px] font-mono text-[#9ED9D4] border border-[rgba(47,127,122,0.2)]">
                    {formatTime(currentTimeSec)} / {meeting.duration}
                  </div>
                </div>

                {/* Custom Color-Coded Multi-Speaker & Signal Scrubber */}
                <div className="p-4 bg-[rgba(25,28,31,0.95)] border-t border-[rgba(47,127,122,0.12)] space-y-3">
                  {/* Timeline Bar with Color Coded Segments */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] text-[#718096] font-mono">
                      <span>00:00</span>
                      <span>15:00</span>
                      <span>30:00</span>
                      <span>{meeting.duration}</span>
                    </div>

                    {/* Multi-segment colored timeline */}
                    <div 
                      className="h-3 w-full bg-[#0D0F12] rounded-full overflow-hidden relative cursor-pointer flex border border-[rgba(47,127,122,0.2)]"
                      onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const pos = (e.clientX - rect.left) / rect.width;
                        setCurrentTimeSec(Math.floor(pos * meeting.durationSec));
                      }}
                    >
                      {/* Segment 1: Intro / Alex */}
                      <div style={{ width: '15%' }} className="h-full bg-[#4FA8A1]/70 hover:bg-[#4FA8A1]" title="Rep Intro (Alex)" />
                      {/* Segment 2: Sarah (Customer pain point) */}
                      <div style={{ width: '20%' }} className="h-full bg-[#2F7F7A] hover:bg-[#3FA29A]" title="Customer Pain (Sarah)" />
                      {/* Segment 3: SE Architecture & Demo */}
                      <div style={{ width: '25%' }} className="h-full bg-[#60A5FA]/80 hover:bg-[#60A5FA]" title="Tech Architecture (Jordan)" />
                      {/* Segment 4: Budget & Decision (Key Signal) */}
                      <div style={{ width: '20%' }} className="h-full bg-[#4FA8A1]/90 hover:bg-[#4FA8A1]" title="Budget Signal ($250K)" />
                      {/* Segment 5: Next Steps & Closing */}
                      <div style={{ width: '20%' }} className="h-full bg-[#9ED9D4]/70 hover:bg-[#9ED9D4]" title="Action Planning" />

                      {/* Current Time Scrubber Pin */}
                      <div 
                        className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_8px_#ffffff] z-10"
                        style={{ left: `${(currentTimeSec / meeting.durationSec) * 100}%` }}
                      />
                    </div>

                    {/* Timeline Legend */}
                    <div className="flex items-center justify-between pt-1 text-[10px] text-[#718096] flex-wrap gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#4FA8A1]" />
                        <span>Sales Rep</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#2F7F7A]" />
                        <span>Customer</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#60A5FA]" />
                        <span>Sales Engineer</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#9ED9D4]" />
                        <span>Key Signal</span>
                      </div>
                    </div>
                  </div>

                  {/* Playback Controls Strip */}
                  <div className="flex items-center justify-between pt-2 border-t border-[rgba(47,127,122,0.1)]">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="p-1.5 rounded-lg bg-[rgba(47,127,122,0.2)] text-[#4FA8A1] hover:text-white transition-colors"
                      >
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </button>
                      <button 
                        onClick={() => jumpToTime(Math.max(0, currentTimeSec - 10))}
                        className="text-xs text-[#718096] hover:text-white font-mono"
                      >
                        -10s
                      </button>
                      <button 
                        onClick={() => jumpToTime(Math.min(meeting.durationSec, currentTimeSec + 10))}
                        className="text-xs text-[#718096] hover:text-white font-mono"
                      >
                        +10s
                      </button>
                      <span className="text-xs font-mono text-[#E4E7E7]">
                        {formatTime(currentTimeSec)}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Playback Speed Switcher */}
                      <div className="flex items-center gap-1 bg-[#0D0F12] p-0.5 rounded-lg border border-[rgba(47,127,122,0.2)]">
                        {[1, 1.25, 1.5].map((speed) => (
                          <button
                            key={speed}
                            onClick={() => setPlaybackSpeed(speed)}
                            className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
                              playbackSpeed === speed
                                ? 'bg-[#2F7F7A] text-white'
                                : 'text-[#718096] hover:text-white'
                            }`}
                          >
                            {speed}x
                          </button>
                        ))}
                      </div>

                      <button className="p-1.5 text-[#718096] hover:text-white transition-colors">
                        <Volume2 className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-[#718096] hover:text-white transition-colors">
                        <Maximize2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Talk / Listen Breakdown Surface */}
              <div className="surface p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="card-title">Talk / Listen Breakdown</span>
                  <span className="text-xs text-[#4FA8A1] font-medium">Healthy dynamic (48% rep)</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {meeting.participants.map((p, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-[rgba(25,28,31,0.5)] border border-[rgba(47,127,122,0.1)] space-y-1.5">
                      <div className="flex items-center gap-2">
                        <img src={p.avatar} alt={p.name} className="w-6 h-6 rounded-full object-cover" />
                        <div className="truncate">
                          <span className="text-xs font-medium text-[#E4E7E7] block truncate">
                            {p.name.split(' ')[0]}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-baseline justify-between">
                        <span className="text-lg font-bold text-white font-mono">{p.talkRatio}%</span>
                        <span className="text-[10px] text-[#718096]">{p.role.split(' ')[0]}</span>
                      </div>
                      <div className="w-full h-1.5 bg-[#0D0F12] rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            idx === 0 ? 'bg-[#4FA8A1]' : idx === 1 ? 'bg-[#60A5FA]' : 'bg-[#2F7F7A]'
                          }`}
                          style={{ width: `${p.talkRatio}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column (5 cols): AI Summary, Signals, Next Steps, Manager Feedback, Deal Impact */}
            <div className="lg:col-span-5 space-y-5">
              {/* 1. AI Summary */}
              <div className="surface p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-semibold text-[#E4E7E7]">
                    <Sparkles className="w-4 h-4 text-[#4FA8A1]" />
                    <span>AI Executive Summary</span>
                  </div>
                  <span className="status-pill pill-teal">
                    4 Key Takeaways
                  </span>
                </div>

                <ul className="space-y-2.5">
                  {meeting.summaryBullets.map((bullet, idx) => (
                    <li key={idx} className="text-xs text-[#C2D0DC] leading-relaxed flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#4FA8A1] shrink-0 mt-1.5" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 2. Key Signals */}
              <div className="surface p-5 space-y-3">
                <span className="card-title block">
                  Detected Key Signals
                </span>

                <div className="flex flex-wrap gap-2">
                  {meeting.keySignals.map((signal) => (
                    <span
                      key={signal.id}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium border ${
                        signal.type === 'positive'
                          ? 'bg-[rgba(47,127,122,0.2)] text-[#9ED9D4] border-[rgba(47,127,122,0.4)]'
                          : signal.type === 'concern'
                          ? 'bg-[#F59E0B]/10 text-[#FBBF24] border-[#F59E0B]/30'
                          : 'bg-[rgba(25,28,31,0.6)] text-[#C2D0DC] border-[rgba(47,127,122,0.15)]'
                      }`}
                    >
                      {signal.text}
                    </span>
                  ))}
                </div>
              </div>

              {/* 3. Next Steps (Interactive) */}
              <div className="surface p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="card-title">
                    Next Steps ({nextSteps.filter(t => !t.completed).length} open)
                  </span>
                  <button 
                    onClick={() => onNavigate('tasks')}
                    className="text-xs text-[#4FA8A1] hover:underline"
                  >
                    View in Tasks →
                  </button>
                </div>

                <div className="space-y-2">
                  {nextSteps.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => toggleTaskCompletion(task.id)}
                      className={`p-2.5 rounded-xl border transition-all flex items-start gap-3 cursor-pointer ${
                        task.completed
                          ? 'bg-[rgba(25,28,31,0.3)] border-transparent opacity-60'
                          : 'bg-[rgba(25,28,31,0.6)] border-[rgba(47,127,122,0.15)] hover:border-[#4FA8A1]'
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
                        <div className={`font-medium ${task.completed ? 'line-through text-[#718096]' : 'text-white'}`}>
                          {task.text}
                        </div>
                        <div className="text-[10px] text-[#718096] mt-0.5 flex items-center gap-2">
                          <span>Owner: {task.owner}</span>
                          <span>•</span>
                          <span className="text-[#9ED9D4] font-mono">{task.date}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. Manager Feedback (Clickable to jump timeline) */}
              {meeting.managerFeedback && meeting.managerFeedback.length > 0 && (
                <div className="surface p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="card-title flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-[#4FA8A1]" />
                      <span>Manager Feedback</span>
                    </span>
                    <span className="text-[10px] text-[#718096]">Click timestamp to jump</span>
                  </div>

                  <div className="space-y-2.5">
                    {meeting.managerFeedback.map((fb) => (
                      <div 
                        key={fb.id}
                        onClick={() => jumpToTime(fb.targetTimeSec)}
                        className="p-3 rounded-xl bg-[rgba(25,28,31,0.5)] border border-[rgba(47,127,122,0.15)] hover:border-[#4FA8A1] transition-all cursor-pointer group"
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <img src={fb.avatar} alt={fb.author} className="w-5 h-5 rounded-full object-cover" />
                            <span className="text-xs font-medium text-white">{fb.author}</span>
                          </div>
                          <span className="text-[10px] font-mono font-bold text-[#4FA8A1] bg-[rgba(47,127,122,0.2)] px-2 py-0.5 rounded border border-[rgba(47,127,122,0.3)] group-hover:bg-[#2F7F7A] group-hover:text-white transition-colors">
                            ▶ @ {fb.timestamp}
                          </span>
                        </div>
                        <p className="text-xs text-[#C2D0DC] leading-relaxed italic border-l-2 border-[#4FA8A1] pl-2.5 group-hover:text-white">
                          “{fb.text}”
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 5. Deal Impact */}
              <div className="surface p-5 space-y-3">
                <span className="card-title block">
                  Deal Impact & Progression
                </span>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2.5 rounded-xl bg-[rgba(25,28,31,0.5)] border border-[rgba(47,127,122,0.12)]">
                    <span className="text-[10px] text-[#718096] block">Stage</span>
                    <span className="text-xs font-bold text-[#E4E7E7] mt-0.5 block">{meeting.dealImpact.stage}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[rgba(25,28,31,0.5)] border border-[rgba(47,127,122,0.12)]">
                    <span className="text-[10px] text-[#718096] block">Probability</span>
                    <span className="text-xs font-bold text-[#4FA8A1] font-mono mt-0.5 block">{meeting.dealImpact.probability}%</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[rgba(25,28,31,0.5)] border border-[rgba(47,127,122,0.12)]">
                    <span className="text-[10px] text-[#718096] block">Health</span>
                    <span className="text-xs font-bold text-[#9ED9D4] mt-0.5 block">{meeting.dealImpact.health}</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-[rgba(25,28,31,0.3)] text-xs text-[#718096]">
                  <span className="text-[#E4E7E7] font-medium">Next Milestone: </span>
                  {meeting.dealImpact.nextMilestone}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TRANSCRIPT */}
        {activeTab === 'transcript' && (
          <div className="space-y-6">
            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl surface">
              {/* Search input */}
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-[#718096] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search transcript..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-[#0D0F12] border border-[rgba(47,127,122,0.2)] rounded-xl text-xs text-[#E4E7E7] placeholder-[#718096] focus:outline-none focus:border-[#4FA8A1]"
                />
              </div>

              {/* Contextual Filters */}
              <div className="flex items-center gap-1.5 flex-wrap self-start sm:self-auto">
                {[
                  { id: 'all', label: 'All Dialog' },
                  { id: 'questions', label: 'Questions' },
                  { id: 'pricing', label: 'Pricing' },
                  { id: 'objections', label: 'Objections' },
                  { id: 'competitors', label: 'Competitors' },
                  { id: 'next-steps', label: 'Next Steps' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setTranscriptFilter(f.id)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                      transcriptFilter === f.id
                        ? 'bg-[#2F7F7A] text-white'
                        : 'text-[#718096] hover:text-white bg-[rgba(25,28,31,0.5)] hover:bg-[rgba(47,127,122,0.15)]'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Transcript Lines */}
            <div className="space-y-3">
              {filteredTranscript.map((line) => {
                const isSelected = selectedTranscriptLine === line.id;
                return (
                  <div
                    key={line.id}
                    onClick={() => setSelectedTranscriptLine(line.id)}
                    className={`p-4 rounded-2xl border transition-all duration-150 cursor-pointer ${
                      isSelected
                        ? 'bg-[rgba(25,28,31,0.9)] border-[#4FA8A1] shadow-lg shadow-black/40'
                        : 'surface surface-hover'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      {/* Speaker info */}
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[rgba(47,127,122,0.2)] border border-[rgba(47,127,122,0.3)] flex items-center justify-center font-bold text-xs text-[#9ED9D4]">
                          {line.speaker.charAt(0)}
                        </div>
                        <div>
                          <span className="text-xs font-semibold text-[#E4E7E7] block">
                            {line.speaker}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              jumpToTime(line.timestampSec);
                            }}
                            className="text-[11px] font-mono text-[#4FA8A1] hover:underline flex items-center gap-1"
                          >
                            <Play className="w-2.5 h-2.5 fill-current" />
                            <span>{line.time}</span>
                          </button>
                        </div>
                      </div>

                      {/* Highlight Tag */}
                      {line.highlightType && line.highlightType !== 'none' && (
                        <span className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded-md border ${
                          line.highlightType === 'pricing'
                            ? 'bg-[rgba(47,127,122,0.2)] text-[#4FA8A1] border-[rgba(47,127,122,0.3)]'
                            : line.highlightType === 'objection'
                            ? 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/30'
                            : line.highlightType === 'competitor'
                            ? 'bg-[#EF4444]/10 text-[#F87171] border-[#EF4444]/30'
                            : 'bg-[rgba(47,127,122,0.2)] text-[#9ED9D4] border-[rgba(47,127,122,0.4)]'
                        }`}>
                          {line.highlightType}
                        </span>
                      )}
                    </div>

                    {/* Dialog content */}
                    <p className="mt-2.5 text-xs text-[#C2D0DC] leading-relaxed pl-11">
                      {line.text}
                    </p>

                    {/* Selection Quick Actions */}
                    {isSelected && (
                      <div className="mt-3.5 pt-3 border-t border-[rgba(47,127,122,0.12)] pl-11 flex items-center gap-2.5 flex-wrap">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            jumpToTime(line.timestampSec);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-[#2F7F7A] text-white text-xs font-medium hover:bg-[#4FA8A1] flex items-center gap-1.5"
                        >
                          <Play className="w-3 h-3 fill-current" />
                          <span>Play from here</span>
                        </button>
                        <button className="px-2.5 py-1 rounded-lg bg-[rgba(25,28,31,0.6)] border border-[rgba(47,127,122,0.2)] text-xs text-[#718096] hover:text-white flex items-center gap-1.5">
                          <Bookmark className="w-3 h-3" />
                          <span>Save clip</span>
                        </button>
                        <button className="px-2.5 py-1 rounded-lg bg-[rgba(25,28,31,0.6)] border border-[rgba(47,127,122,0.2)] text-xs text-[#718096] hover:text-white flex items-center gap-1.5">
                          <MessageSquare className="w-3 h-3" />
                          <span>Attach feedback</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: COACHING */}
        {activeTab === 'coaching' && (
          <div className="space-y-6">
            {/* Top Coaching Metrics Strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="surface p-4.5 space-y-1">
                <span className="text-[11px] text-[#718096]">Talk / Listen Ratio</span>
                <div className="text-xl font-bold text-white font-mono">
                  {meeting.coaching.metrics.talkListenRatio}
                </div>
                <span className="text-[10px] text-[#4FA8A1]">Within recommended 45-55% range</span>
              </div>

              <div className="surface p-4.5 space-y-1">
                <span className="text-[11px] text-[#718096]">Questions Asked</span>
                <div className="text-xl font-bold text-white font-mono">
                  {meeting.coaching.metrics.questionsAsked}
                </div>
                <span className="text-[10px] text-[#9ED9D4]">High discovery depth</span>
              </div>

              <div className="surface p-4.5 space-y-1">
                <span className="text-[11px] text-[#718096]">Longest Monologue</span>
                <div className="text-xl font-bold text-white font-mono">
                  {meeting.coaching.metrics.longestMonologue}
                </div>
                <span className="text-[10px] text-[#4FA8A1]">Concise responses</span>
              </div>

              <div className="surface p-4.5 space-y-1">
                <span className="text-[11px] text-[#718096]">Speech Cadence</span>
                <div className="text-xl font-bold text-white font-mono">
                  {meeting.coaching.metrics.repPaceWpm} WPM
                </div>
                <span className="text-[10px] text-[#718096]">Patience: {meeting.coaching.metrics.patienceScore}</span>
              </div>
            </div>

            {/* Strengths & Improvement Areas Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Strengths */}
              <div className="surface p-5 space-y-3.5">
                <div className="flex items-center gap-2 text-sm font-semibold text-[#E4E7E7]">
                  <Award className="w-4 h-4 text-[#4FA8A1]" />
                  <span>Observed Strengths</span>
                </div>

                <ul className="space-y-2.5">
                  {meeting.coaching.strengths.map((str, idx) => (
                    <li key={idx} className="text-xs text-[#C2D0DC] leading-relaxed flex items-start gap-2.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#4FA8A1] shrink-0 mt-0.5" />
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Improvement Areas */}
              <div className="surface p-5 space-y-3.5">
                <div className="flex items-center gap-2 text-sm font-semibold text-[#E4E7E7]">
                  <AlertTriangle className="w-4 h-4 text-[#F59E0B]" />
                  <span>Growth & Coaching Opportunities</span>
                </div>

                <ul className="space-y-2.5">
                  {meeting.coaching.improvements.map((imp, idx) => (
                    <li key={idx} className="text-xs text-[#C2D0DC] leading-relaxed flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] shrink-0 mt-1.5" />
                      <span>{imp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* AI Coaching Moments */}
            {meeting.coaching.aiCoachingMoments.length > 0 && (
              <div className="surface p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-semibold text-[#E4E7E7]">
                    <Sparkles className="w-4 h-4 text-[#4FA8A1]" />
                    <span>AI Coaching Key Moments</span>
                  </div>
                  <span className="text-xs text-[#718096]">Targeted improvement points</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {meeting.coaching.aiCoachingMoments.map((m) => (
                    <div key={m.id} className="p-4 rounded-xl bg-[rgba(25,28,31,0.5)] border border-[rgba(47,127,122,0.15)] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-white">{m.title}</span>
                        <button 
                          onClick={() => jumpToTime(m.timestampSec)}
                          className="text-[10px] font-mono text-[#4FA8A1] hover:underline"
                        >
                          @{m.timestamp}
                        </button>
                      </div>
                      <p className="text-xs text-[#718096] leading-relaxed">
                        <strong className="text-[#C2D0DC]">Observation: </strong>{m.observation}
                      </p>
                      <p className="text-xs text-[#9ED9D4] leading-relaxed">
                        <strong className="text-white">Recommendation: </strong>{m.recommendation}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Manager Comments Section */}
            <div className="surface p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-semibold text-[#E4E7E7]">
                  <MessageSquare className="w-4 h-4 text-[#60A5FA]" />
                  <span>Manager Comments & Coaching Log</span>
                </div>
                <span className="text-xs text-[#718096]">{managerComments.length} notes</span>
              </div>

              {/* Add Comment Input */}
              <div className="flex items-center gap-3 p-2 rounded-xl bg-[#0D0F12] border border-[rgba(47,127,122,0.2)]">
                <img src={currentUser.avatar} alt={currentUser.name} className="w-7 h-7 rounded-full object-cover" />
                <input
                  type="text"
                  placeholder={currentUser.role === 'Sales Manager' ? "Add a coaching note or feedback..." : "Add a private rep note..."}
                  value={newManagerComment}
                  onChange={(e) => setNewManagerComment(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddManagerComment()}
                  className="flex-1 bg-transparent text-xs text-[#E4E7E7] placeholder-[#718096] focus:outline-none"
                />
                <button
                  onClick={handleAddManagerComment}
                  className="p-1.5 rounded-lg bg-[#2F7F7A] text-white hover:bg-[#4FA8A1] transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Comments list */}
              <div className="space-y-3">
                {managerComments.map((mc) => (
                  <div key={mc.id} className="p-3 rounded-xl bg-[rgba(25,28,31,0.4)] border border-[rgba(47,127,122,0.1)] flex items-start gap-3">
                    <img src={mc.avatar} alt={mc.author} className="w-7 h-7 rounded-full object-cover shrink-0" />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-white">{mc.author}</span>
                        <span className="text-[10px] text-[#718096]">{mc.date}</span>
                      </div>
                      <p className="text-xs text-[#C2D0DC] leading-relaxed">
                        {mc.comment}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
