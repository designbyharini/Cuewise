import React, { useState } from 'react';
import { X, Calendar, DollarSign, Building2, CheckSquare, Sparkles, Video, User, Clock } from 'lucide-react';
import { mockAccounts } from '../../data/mockData';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

// 1. Schedule Meeting Modal
export const ScheduleMeetingModal: React.FC<ModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [accountId, setAccountId] = useState(mockAccounts[0].id);
  const [date, setDate] = useState('2025-05-16');
  const [time, setTime] = useState('14:00');
  const [duration, setDuration] = useState('45m');
  const [autoRecord, setAutoRecord] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const account = mockAccounts.find(a => a.id === accountId);
    onSubmit({
      title: title || `Meeting with ${account?.name || 'Client'}`,
      accountName: account?.name || 'Acme Inc',
      accountId,
      date,
      time,
      duration,
      autoRecord
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto surface rounded-2xl shadow-2xl p-6 space-y-5 animate-in fade-in duration-150">
        <div className="flex items-center justify-between border-b border-[rgba(47,127,122,0.12)] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[rgba(47,127,122,0.15)] border border-[rgba(47,127,122,0.3)] text-[#4FA8A1]">
              <Video className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Schedule Meeting</h3>
              <p className="text-xs text-[#718096]">Add to calendar with automated Cuewise AI recording.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-[#718096] hover:text-white hover:bg-[rgba(47,127,122,0.1)]">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-[#718096] mb-1.5 font-medium">Meeting Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Solution Review & Commercials"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#0D0F12] border border-[rgba(47,127,122,0.2)] rounded-xl text-white placeholder-[#718096] focus:outline-none focus:border-[#4FA8A1]"
            />
          </div>

          <div>
            <label className="block text-[#718096] mb-1.5 font-medium">Account / Company</label>
            <select
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#0D0F12] border border-[rgba(47,127,122,0.2)] rounded-xl text-white focus:outline-none focus:border-[#4FA8A1]"
            >
              {mockAccounts.map(a => (
                <option key={a.id} value={a.id}>{a.name} ({a.industry})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[#718096] mb-1.5 font-medium">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-[#0D0F12] border border-[rgba(47,127,122,0.2)] rounded-xl text-white focus:outline-none focus:border-[#4FA8A1]"
              />
            </div>
            <div>
              <label className="block text-[#718096] mb-1.5 font-medium">Time</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 bg-[#0D0F12] border border-[rgba(47,127,122,0.2)] rounded-xl text-white focus:outline-none focus:border-[#4FA8A1]"
              />
            </div>
            <div>
              <label className="block text-[#718096] mb-1.5 font-medium">Duration</label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-3 py-2 bg-[#0D0F12] border border-[rgba(47,127,122,0.2)] rounded-xl text-white focus:outline-none focus:border-[#4FA8A1]"
              >
                <option value="30m">30m</option>
                <option value="45m">45m</option>
                <option value="60m">60m</option>
              </select>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[rgba(25,28,31,0.6)] border border-[rgba(47,127,122,0.2)] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#4FA8A1]" />
              <div>
                <span className="font-semibold text-white block">Auto-invite Cuewise Bot</span>
                <span className="text-[10px] text-[#718096]">Record, transcribe, and extract deal signals</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={autoRecord}
              onChange={(e) => setAutoRecord(e.target.checked)}
              className="accent-[#2F7F7A] w-4 h-4 rounded"
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[rgba(25,28,31,0.8)] border border-[rgba(47,127,122,0.2)] text-[#718096] hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#2F7F7A] hover:bg-[#4FA8A1] text-white font-medium shadow-md transition-colors"
            >
              Schedule Meeting
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// 2. Add Deal Modal
export const AddDealModal: React.FC<ModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [accountId, setAccountId] = useState(mockAccounts[0].id);
  const [value, setValue] = useState('180000');
  const [stage, setStage] = useState('Qualification');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const account = mockAccounts.find(a => a.id === accountId);
    onSubmit({
      name: name || `${account?.name} Expansion`,
      accountName: account?.name || 'Client',
      accountId,
      value: parseInt(value, 10) || 100000,
      stage,
      health: 'Healthy'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto surface rounded-2xl shadow-2xl p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-[rgba(47,127,122,0.12)] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[rgba(47,127,122,0.15)] border border-[rgba(47,127,122,0.3)] text-[#4FA8A1]">
              <DollarSign className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Create New Deal</h3>
              <p className="text-xs text-[#718096]">Track pipeline value and progression milestones.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-[#718096] hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-[#718096] mb-1.5 font-medium">Deal Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Enterprise Intelligence Rollout"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#0D0F12] border border-[rgba(47,127,122,0.2)] rounded-xl text-white placeholder-[#718096] focus:outline-none focus:border-[#4FA8A1]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[#718096] mb-1.5 font-medium">Account</label>
              <select
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#0D0F12] border border-[rgba(47,127,122,0.2)] rounded-xl text-white focus:outline-none focus:border-[#4FA8A1]"
              >
                {mockAccounts.map(a => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[#718096] mb-1.5 font-medium">Deal Value ($ USD)</label>
              <input
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#0D0F12] border border-[rgba(47,127,122,0.2)] rounded-xl text-white focus:outline-none focus:border-[#4FA8A1]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#718096] mb-1.5 font-medium">Initial Stage</label>
            <select
              value={stage}
              onChange={(e) => setStage(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#0D0F12] border border-[rgba(47,127,122,0.2)] rounded-xl text-white focus:outline-none focus:border-[#4FA8A1]"
            >
              <option value="Prospecting">Prospecting</option>
              <option value="Qualification">Qualification</option>
              <option value="Proposal">Proposal</option>
              <option value="Negotiation">Negotiation</option>
              <option value="Closed Won">Closed Won</option>
            </select>
          </div>

          <div className="pt-3 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[rgba(25,28,31,0.8)] border border-[rgba(47,127,122,0.2)] text-[#718096] hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#2F7F7A] hover:bg-[#4FA8A1] text-white font-medium"
            >
              Create Deal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// 3. Add Task Modal
export const AddTaskModal: React.FC<ModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [accountId, setAccountId] = useState(mockAccounts[0].id);
  const [priority, setPriority] = useState('High');
  const [due, setDue] = useState('Today, 5:00 PM');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const account = mockAccounts.find(a => a.id === accountId);
    onSubmit({
      title,
      relatedTo: {
        name: account?.name || 'Account',
        subtext: 'Sales action item'
      },
      due,
      priority,
      source: 'Manual'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto surface rounded-2xl shadow-2xl p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-[rgba(47,127,122,0.12)] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[rgba(47,127,122,0.15)] border border-[rgba(47,127,122,0.3)] text-[#4FA8A1]">
              <CheckSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Create Task</h3>
              <p className="text-xs text-[#718096]">Add actionable next step to queue.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-[#718096] hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-[#718096] mb-1.5 font-medium">Task Description</label>
            <input
              type="text"
              required
              placeholder="e.g. Send revised security SOC2 package"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#0D0F12] border border-[rgba(47,127,122,0.2)] rounded-xl text-white placeholder-[#718096] focus:outline-none focus:border-[#4FA8A1]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[#718096] mb-1.5 font-medium">Related Account</label>
              <select
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#0D0F12] border border-[rgba(47,127,122,0.2)] rounded-xl text-white focus:outline-none focus:border-[#4FA8A1]"
              >
                {mockAccounts.map(a => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[#718096] mb-1.5 font-medium">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#0D0F12] border border-[rgba(47,127,122,0.2)] rounded-xl text-white focus:outline-none focus:border-[#4FA8A1]"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[#718096] mb-1.5 font-medium">Due Date / Time</label>
            <input
              type="text"
              value={due}
              onChange={(e) => setDue(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#0D0F12] border border-[rgba(47,127,122,0.2)] rounded-xl text-white focus:outline-none focus:border-[#4FA8A1]"
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[rgba(25,28,31,0.8)] border border-[rgba(47,127,122,0.2)] text-[#718096] hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#2F7F7A] hover:bg-[#4FA8A1] text-white font-medium"
            >
              Add Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
