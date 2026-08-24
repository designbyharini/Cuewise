import React, { useState } from 'react';
import { 
  Building2, 
  Search, 
  Filter, 
  Plus, 
  ChevronRight, 
  ChevronLeft,
  DollarSign,
  TrendingUp,
  Clock,
  Users
} from 'lucide-react';
import { Account, HealthStatus, NavSection, UserProfile } from '../../types';
import { mockAccounts, mockTeamMembers } from '../../data/mockData';

interface AccountsViewProps {
  onNavigate: (section: NavSection, id?: string) => void;
  onOpenAddAccount: () => void;
  currentUser?: UserProfile;
}

export const AccountsView: React.FC<AccountsViewProps> = ({ onNavigate, onOpenAddAccount, currentUser }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Healthy' | 'Needs attention' | 'Inactive'>('All');
  const [repFilter, setRepFilter] = useState<string>('all');
  const [accounts, setAccounts] = useState<Account[]>(mockAccounts);

  const isManager = currentUser?.role === 'Sales Manager';

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const statusCounts = {
    All: 24,
    Healthy: 9,
    'Needs attention': 11,
    Inactive: 4,
  };

  const filteredAccounts = accounts.filter(acc => {
    const matchesSearch = acc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          acc.industry.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (statusFilter !== 'All' && acc.status !== statusFilter) return false;
    if (isManager && repFilter !== 'all' && acc.owner.name !== repFilter) return false;
    return true;
  });

  return (
    <div id="accounts-view" className="flex-1 min-w-0 min-h-0 h-full overflow-y-auto px-8 py-7 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-medium text-white tracking-tight">
            {isManager ? "Team Accounts & Portfolios" : "Accounts"}
          </h1>
          <p className="text-xs text-[#718096] mt-1 font-normal">
            {isManager
              ? "Account relationships, buyer engagement signals, and territory health across direct reports."
              : "Account relationships, deal history, and buyer engagement signals."}
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
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

          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#718096] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search accounts or industry..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 bg-[#0D0F12] border border-[rgba(47,127,122,0.2)] rounded-xl text-xs text-[#E4E7E7] placeholder-[#718096] focus:outline-none focus:border-[#4FA8A1] w-56"
            />
          </div>

          <button
            id="btn-add-account"
            onClick={onOpenAddAccount}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2F7F7A] hover:bg-[#4FA8A1] text-white text-xs font-semibold shadow-md shadow-[#2F7F7A]/20 transition-all duration-150"
          >
            <Plus className="w-4 h-4" />
            <span>Add Account</span>
          </button>
        </div>
      </div>

      {/* Filter Status Pills */}
      <div className="flex items-center gap-2 flex-wrap">
        {(['All', 'Healthy', 'Needs attention', 'Inactive'] as const).map((st) => {
          const isActive = statusFilter === st;
          return (
            <button
              key={st}
              id={`filter-pill-${st.toLowerCase().replace(' ', '-')}`}
              onClick={() => setStatusFilter(st)}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                isActive
                  ? 'bg-[#2F7F7A] text-white border border-[#4FA8A1] shadow-sm'
                  : 'bg-[rgba(25,28,31,0.6)] border border-[rgba(47,127,122,0.15)] text-[#718096] hover:text-[#E4E7E7] hover:bg-[rgba(25,28,31,0.9)]'
              }`}
            >
              {st !== 'All' && (
                <span className={`w-1.5 h-1.5 rounded-full ${
                  st === 'Healthy' ? 'bg-[#4FA8A1]' : st === 'Needs attention' ? 'bg-[#FBBF24]' : 'bg-[#718096]'
                }`} />
              )}
              <span>{st} ({statusCounts[st]})</span>
            </button>
          );
        })}
      </div>

      {/* Main Account Table Surface */}
      <div 
        id="accounts-table-container"
        className="surface overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[rgba(47,127,122,0.12)] text-[11px] font-semibold text-[#718096] uppercase tracking-wider bg-[rgba(13,15,18,0.5)]">
                <th className="py-4 px-6">Company</th>
                <th className="py-4 px-6">Open deals</th>
                <th className="py-4 px-6">Deal value</th>
                <th className="py-4 px-6">Last contact</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(47,127,122,0.08)] text-xs">
              {filteredAccounts.map((account) => (
                <tr
                  key={account.id}
                  id={`account-row-${account.id}`}
                  onClick={() => onNavigate('account-detail', account.id)}
                  className="hover:bg-[rgba(47,127,122,0.08)] transition-colors cursor-pointer group"
                >
                  {/* Company */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3.5">
                      <div className={`w-10 h-10 rounded-xl border flex items-center justify-center font-bold text-base shrink-0 ${
                        account.status === 'Healthy'
                          ? 'bg-[rgba(47,127,122,0.15)] border-[rgba(47,127,122,0.3)] text-[#9ED9D4]'
                          : account.status === 'Needs attention'
                          ? 'bg-[rgba(245,158,11,0.12)] border-[rgba(245,158,11,0.3)] text-[#FBBF24]'
                          : 'bg-[rgba(25,28,31,0.8)] border-[rgba(47,127,122,0.15)] text-[#718096]'
                      }`}>
                        {account.initial}
                      </div>
                      <div>
                        <div className="font-semibold text-white group-hover:text-[#9ED9D4] transition-colors text-sm">
                          {account.name}
                        </div>
                        <div className="text-[11px] text-[#718096]">
                          {account.industry}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Open Deals */}
                  <td className="py-4 px-6 font-mono font-medium text-[#E4E7E7]">
                    {account.openDealsCount}
                  </td>

                  {/* Deal Value */}
                  <td className="py-4 px-6 font-mono font-semibold text-white">
                    {formatCurrency(account.pipelineValue)}
                  </td>

                  {/* Last Contact */}
                  <td className="py-4 px-6 text-[#718096] font-mono">
                    {account.lastContact}
                  </td>

                  {/* Status */}
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium border ${
                      account.status === 'Healthy'
                        ? 'status-pill pill-green'
                        : account.status === 'Needs attention'
                        ? 'status-pill pill-amber'
                        : 'status-pill'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        account.status === 'Healthy' ? 'bg-[#4FA8A1]' : account.status === 'Needs attention' ? 'bg-[#FBBF24]' : 'bg-[#718096]'
                      }`} />
                      <span>{account.status}</span>
                    </span>
                  </td>

                  {/* Open Arrow */}
                  <td className="py-4 px-6 text-right">
                    <ChevronRight className="w-4 h-4 text-[#718096] group-hover:text-[#4FA8A1] group-hover:translate-x-1 transition-all inline-block" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Pagination */}
        <div className="p-4 border-t border-[rgba(47,127,122,0.12)] flex items-center justify-between text-xs text-[#718096]">
          <span>Showing 1–{filteredAccounts.length} of 24 accounts</span>

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
            <button className="w-7 h-7 rounded-lg bg-[rgba(25,28,31,0.6)] text-[#718096] hover:text-white text-xs">
              3
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
