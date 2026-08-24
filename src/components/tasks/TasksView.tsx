import React, { useState } from 'react';
import { 
  CheckSquare, 
  Search, 
  Filter, 
  Plus, 
  Clock, 
  AlertCircle, 
  Calendar, 
  CheckCircle2, 
  Sparkles, 
  MoreHorizontal, 
  Check, 
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  X,
  Users
} from 'lucide-react';
import { TaskItem, TaskPriority, TaskSource, NavSection, UserProfile } from '../../types';
import { mockTasks, mockTeamMembers } from '../../data/mockData';

interface TasksViewProps {
  onNavigate: (section: NavSection, id?: string) => void;
  onOpenAddTask: () => void;
  currentUser?: UserProfile;
}

export const TasksView: React.FC<TasksViewProps> = ({ onNavigate, onOpenAddTask, currentUser }) => {
  const [activeTab, setActiveTab] = useState<'today' | 'upcoming' | 'completed'>('today');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [selectedSource, setSelectedSource] = useState<string>('all');
  const [selectedRep, setSelectedRep] = useState<string>('all');
  const [tasks, setTasks] = useState<TaskItem[]>(mockTasks);

  const isManager = currentUser?.role === 'Sales Manager';

  const toggleTask = (taskId: string) => {
    setTasks(prev => 
      prev.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t)
    );
  };

  const dismissAiTask = (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          task.relatedTo.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (selectedPriority !== 'all' && task.priority !== selectedPriority) return false;
    if (selectedSource !== 'all' && task.source !== selectedSource) return false;

    if (activeTab === 'today') {
      return !task.completed && (task.due.includes('Today') || task.isOverdue || task.due.includes('Tomorrow'));
    }
    if (activeTab === 'upcoming') {
      return !task.completed && !task.due.includes('Today') && !task.isOverdue;
    }
    if (activeTab === 'completed') {
      return task.completed;
    }
    return true;
  });

  return (
    <div id="tasks-view" className="flex-1 min-w-0 min-h-0 h-full overflow-y-auto px-8 py-7 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-medium text-white tracking-tight">
            {isManager ? "Team Action Items & Coaching Directives" : "Tasks"}
          </h1>
          <p className="text-xs text-[#718096] mt-1 font-normal">
            {isManager 
              ? "Oversee prioritized follow-ups, AI signals, and coaching assignments delegated across direct reps." 
              : "Prioritized action queue generated from customer conversations and manager directives."}
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {isManager && (
            <select
              value={selectedRep}
              onChange={(e) => setSelectedRep(e.target.value)}
              aria-label="Filter by rep"
              className="px-3 py-2 bg-[#0D0F12] border border-[rgba(47,127,122,0.25)] rounded-xl text-xs text-white focus:outline-none focus:border-[#4FA8A1]"
            >
              <option value="all">All Direct Reps</option>
              {mockTeamMembers.map(m => (
                <option key={m.id} value={m.name}>{m.name}</option>
              ))}
            </select>
          )}

          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#718096] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search tasks, accounts, deals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 bg-[#0D0F12] border border-[rgba(47,127,122,0.2)] rounded-xl text-xs text-[#E4E7E7] placeholder-[#718096] focus:outline-none focus:border-[#4FA8A1] w-56"
            />
          </div>

          <button
            onClick={() => setSelectedSource(selectedSource === 'all' ? 'AI Suggested' : 'all')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-medium transition-colors ${
              selectedSource !== 'all'
                ? 'bg-[#2F7F7A] text-white border-[#4FA8A1]'
                : 'bg-[rgba(25,28,31,0.6)] border border-[rgba(47,127,122,0.2)] text-[#C2D0DC] hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#4FA8A1]" />
            <span>{selectedSource !== 'all' ? 'AI Actions Only' : 'Filter AI'}</span>
          </button>

          <button
            id="btn-add-task"
            onClick={onOpenAddTask}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2F7F7A] hover:bg-[#4FA8A1] text-white text-xs font-semibold shadow-md shadow-[#2F7F7A]/20 transition-all duration-150"
          >
            <Plus className="w-4 h-4" />
            <span>Add task</span>
          </button>
        </div>
      </div>

      {/* 4 Compact Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Due Today */}
        <div className="surface p-4 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[rgba(47,127,122,0.15)] border border-[rgba(47,127,122,0.3)] flex items-center justify-center text-[#4FA8A1] shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-[#718096] block">Due today</span>
            <div className="text-xl font-bold text-white font-mono mt-0.5">8</div>
            <span className="text-[10px] text-[#C2D0DC]">4 High priority</span>
          </div>
        </div>

        {/* Overdue */}
        <div className="surface p-4 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[rgba(239,68,68,0.12)] border border-[rgba(239,68,68,0.3)] flex items-center justify-center text-[#F87171] shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-[#718096] block">Overdue</span>
            <div className="text-xl font-bold text-white font-mono mt-0.5">5</div>
            <span className="text-[10px] text-[#F87171]">2 High priority</span>
          </div>
        </div>

        {/* Upcoming */}
        <div className="surface p-4 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[rgba(25,28,31,0.8)] border border-[rgba(47,127,122,0.2)] flex items-center justify-center text-[#9ED9D4] shrink-0">
            <CheckSquare className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-[#718096] block">Upcoming</span>
            <div className="text-xl font-bold text-white font-mono mt-0.5">14</div>
            <span className="text-[10px] text-[#718096]">Next 7 days</span>
          </div>
        </div>

        {/* Completed this week */}
        <div className="surface p-4 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[rgba(47,127,122,0.15)] border border-[rgba(47,127,122,0.3)] flex items-center justify-center text-[#4FA8A1] shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-[#718096] block">Completed this week</span>
            <div className="text-xl font-bold text-white font-mono mt-0.5">18</div>
            <span className="text-[10px] text-[#4FA8A1] font-mono">↑ 20% vs last week</span>
          </div>
        </div>
      </div>

      {/* Tabs & Sort Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[rgba(47,127,122,0.12)] pb-2">
        <div className="flex items-center gap-3">
          {(['today', 'upcoming', 'completed'] as const).map((tab) => {
            const active = activeTab === tab;
            return (
              <button
                key={tab}
                id={`task-tab-${tab}`}
                onClick={() => setActiveTab(tab)}
                className={`pb-2.5 px-3 text-xs font-semibold uppercase tracking-wider capitalize transition-all relative ${
                  active
                    ? 'text-white'
                    : 'text-[#718096] hover:text-[#C2D0DC]'
                }`}
              >
                <span>{tab}</span>
                {active && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4FA8A1] shadow-[0_0_8px_#4FA8A1]" />
                )}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 text-xs text-[#718096]">
          <span>Sort by:</span>
          <button className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#0D0F12] border border-[rgba(47,127,122,0.2)] text-[#C2D0DC]">
            <span>Due time</span>
            <ChevronDown className="w-3 h-3 text-[#718096]" />
          </button>
        </div>
      </div>

      {/* Main Tasks Table Surface */}
      <div 
        id="tasks-table-container"
        className="surface overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[rgba(47,127,122,0.12)] text-[11px] font-semibold text-[#718096] uppercase tracking-wider bg-[rgba(13,15,18,0.5)]">
                <th className="py-3.5 px-4 w-12 text-center"></th>
                <th className="py-3.5 px-4">Task</th>
                <th className="py-3.5 px-4">Related to</th>
                <th className="py-3.5 px-4">Due</th>
                <th className="py-3.5 px-4">Priority</th>
                <th className="py-3.5 px-4">Source</th>
                <th className="py-3.5 px-4">Owner</th>
                <th className="py-3.5 px-4 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(47,127,122,0.08)] text-xs">
              {filteredTasks.map((task) => (
                <tr
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className={`hover:bg-[rgba(47,127,122,0.08)] transition-colors cursor-pointer group ${
                    task.completed ? 'opacity-50 bg-[rgba(13,15,18,0.3)]' : ''
                  }`}
                >
                  {/* Checkbox */}
                  <td className="py-4 px-4 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleTask(task.id);
                      }}
                      className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                        task.completed 
                          ? 'bg-[#2F7F7A] border-[#4FA8A1] text-white' 
                          : 'border-[#718096] hover:border-[#4FA8A1]'
                      }`}
                    >
                      {task.completed && <Check className="w-3 h-3" />}
                    </button>
                  </td>

                  {/* Task Title */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <span className={`font-medium ${task.completed ? 'line-through text-[#718096]' : 'text-[#E4E7E7] group-hover:text-[#9ED9D4] transition-colors'}`}>
                        {task.title}
                      </span>
                      {task.source === 'AI Suggested' && (
                        <Sparkles className="w-3.5 h-3.5 text-[#4FA8A1] shrink-0" title="Suggested by Cuewise Conversation AI" />
                      )}
                    </div>
                  </td>

                  {/* Related to */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-md bg-[rgba(47,127,122,0.15)] border border-[rgba(47,127,122,0.3)] flex items-center justify-center font-bold text-[11px] text-[#9ED9D4] shrink-0">
                        {task.relatedTo.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-[#E4E7E7] text-xs">
                          {task.relatedTo.name}
                        </div>
                        <div className="text-[10px] text-[#718096]">
                          {task.relatedTo.subtext}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Due */}
                  <td className="py-4 px-4">
                    <div>
                      <span className="text-[#C2D0DC] font-mono block">{task.due}</span>
                      {task.isOverdue && !task.completed && (
                        <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase status-pill pill-red mt-0.5">
                          Overdue
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Priority */}
                  <td className="py-4 px-4">
                    <span className={`px-2.5 py-1 rounded-md text-[11px] font-medium border ${
                      task.priority === 'High'
                        ? 'status-pill pill-red'
                        : task.priority === 'Medium'
                        ? 'status-pill pill-amber'
                        : 'status-pill'
                    }`}>
                      {task.priority}
                    </span>
                  </td>

                  {/* Source */}
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium border ${
                      task.source === 'AI Suggested'
                        ? 'status-pill pill-teal'
                        : task.source === 'Manager'
                        ? 'bg-[rgba(96,165,250,0.12)] text-[#60A5FA] border-[#60A5FA]/30'
                        : 'status-pill'
                    }`}>
                      {task.source === 'AI Suggested' && <Sparkles className="w-3 h-3 text-[#4FA8A1]" />}
                      <span>{task.source}</span>
                    </span>
                  </td>

                  {/* Owner */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <img
                        src={task.owner.avatar}
                        alt={task.owner.name}
                        className="w-6 h-6 rounded-full object-cover ring-1 ring-[rgba(47,127,122,0.3)]"
                      />
                      <span className="text-[#718096]">{task.owner.name.split(' ')[0]}</span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-4 text-right">
                    {task.source === 'AI Suggested' && !task.completed ? (
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={(e) => dismissAiTask(task.id, e)}
                          className="p-1 rounded-lg text-[#718096] hover:text-[#F87171] hover:bg-[rgba(239,68,68,0.15)] transition-colors"
                          title="Dismiss AI Suggestion"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleTask(task.id);
                          }}
                          className="p-1 rounded-lg text-[#4FA8A1] hover:text-white hover:bg-[#2F7F7A] transition-colors"
                          title="Accept & Complete"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button className="p-1.5 rounded-lg text-[#718096] hover:text-white hover:bg-[rgba(47,127,122,0.15)]">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[rgba(47,127,122,0.12)] flex items-center justify-between text-xs text-[#718096]">
          <span>Showing 1–{filteredTasks.length} of 24 tasks</span>

          <div className="flex items-center gap-1">
            <button className="p-1.5 rounded-lg bg-[rgba(25,28,31,0.6)] border border-[rgba(47,127,122,0.2)] text-[#718096] hover:text-white">
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button className="w-7 h-7 rounded-lg bg-[#2F7F7A] text-white font-medium text-xs">
              1
            </button>
            <button className="w-7 h-7 rounded-lg bg-[rgba(25,28,31,0.6)] text-[#718096] hover:text-white text-xs">
              2
            </button>
            <button className="p-1.5 rounded-lg bg-[rgba(25,28,31,0.6)] border border-[rgba(47,127,122,0.2)] text-[#718096] hover:text-white">
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
