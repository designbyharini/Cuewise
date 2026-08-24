import React, { useState } from 'react';
import { 
  Briefcase, 
  Search, 
  Filter, 
  Plus, 
  Download, 
  SlidersHorizontal, 
  ChevronDown, 
  MoreHorizontal, 
  TrendingUp, 
  Trophy, 
  Target, 
  DollarSign, 
  Calendar, 
  Phone, 
  Mail, 
  MessageSquare, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Users
} from 'lucide-react';
import { Deal, DealStage, HealthStatus, NavSection, UserProfile } from '../../types';
import { mockDeals, mockTeamMembers } from '../../data/mockData';

interface DealsViewProps {
  onNavigate: (section: NavSection, id?: string) => void;
  onOpenAddDeal: () => void;
  currentUser?: UserProfile;
}

export const DealsView: React.FC<DealsViewProps> = ({ onNavigate, onOpenAddDeal, currentUser }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedStage, setSelectedStage] = useState<string>('all');
  const [selectedHealth, setSelectedHealth] = useState<string>('all');
  const [selectedRep, setSelectedRep] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [deals, setDeals] = useState<Deal[]>(mockDeals);

  const isManager = currentUser?.role === 'Sales Manager';

  // Format currency
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const stagesData = [
    { name: 'Prospecting', dealsCount: 12, value: '$1.24M', color: 'from-[#1F5F5B] to-[#2F7F7A]' },
    { name: 'Qualification', dealsCount: 8, value: '$2.31M', color: 'from-[#2F7F7A] to-[#4FA8A1]' },
    { name: 'Proposal', dealsCount: 6, value: '$1.86M', color: 'from-[#4FA8A1] to-[#9ED9D4]' },
    { name: 'Negotiation', dealsCount: 4, value: '$1.07M', color: 'from-[#F59E0B] to-[#FBBF24]' },
    { name: 'Closed Won', dealsCount: 5, value: '$950K', color: 'from-[#10B981] to-[#34D399]' },
  ];

  // Filtering
  const filteredDeals = deals.filter(deal => {
    const matchesSearch = deal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          deal.accountName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          deal.owner.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (selectedStage !== 'all' && deal.stage !== selectedStage) return false;
    if (selectedHealth !== 'all' && deal.health !== selectedHealth) return false;
    if (isManager && selectedRep !== 'all' && deal.owner.name !== selectedRep) return false;
    return true;
  });

  return (
    <div id="deals-view" className="flex-1 min-w-0 min-h-0 h-full overflow-y-auto px-8 py-7 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-medium text-white tracking-tight">
            {isManager ? "Team Deal Pipeline" : "Deals"}
          </h1>
          <p className="text-xs text-[#718096] mt-1 font-normal">
            {isManager 
              ? "Track deal health, stage conversion rates, and revenue forecasts across all direct sales reps." 
              : "Manage your pipeline and close more deals."}
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Rep filter for manager */}
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
              placeholder="Search deals, accounts, or owners..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 bg-[#0D0F12] border border-[rgba(47,127,122,0.2)] rounded-xl text-xs text-[#E4E7E7] placeholder-[#718096] focus:outline-none focus:border-[#4FA8A1] w-56"
            />
          </div>

          <button 
            id="btn-deals-filter"
            onClick={() => {
              if (selectedStage !== 'all' || selectedHealth !== 'all') {
                setSelectedStage('all');
                setSelectedHealth('all');
              } else {
                setSelectedHealth('Needs attention');
              }
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-medium transition-colors ${
              selectedStage !== 'all' || selectedHealth !== 'all'
                ? 'bg-[#2F7F7A] text-white border-[#4FA8A1]'
                : 'bg-[rgba(25,28,31,0.6)] border-[rgba(47,127,122,0.2)] text-[#C2D0DC] hover:text-white'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>{selectedHealth === 'Needs attention' ? 'Filtering: At Risk/Attention' : 'Filters'}</span>
          </button>

          <button
            id="btn-add-deal"
            onClick={onOpenAddDeal}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2F7F7A] hover:bg-[#4FA8A1] text-white text-xs font-semibold shadow-md shadow-[#2F7F7A]/20 transition-all duration-150"
          >
            <Plus className="w-4 h-4" />
            <span>Add deal</span>
          </button>
        </div>
      </div>

      {/* Upper Pipeline Overview Surface */}
      <div 
        id="pipeline-overview-card"
        className="surface p-6 space-y-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="card-title">Pipeline overview</span>
            <HelpCircle className="w-3.5 h-3.5 text-[#718096]" />
          </div>

          <div className="flex items-center gap-2 text-xs text-[#718096]">
            <button className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#0D0F12] border border-[rgba(47,127,122,0.2)] text-white font-medium">
              <span>This month</span>
              <ChevronDown className="w-3 h-3 text-[#718096]" />
            </button>
          </div>
        </div>

        {/* 5 Stages Horizontal Chevron Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {stagesData.map((st, idx) => {
            const isFilterActive = selectedStage === st.name;
            return (
              <div
                key={idx}
                onClick={() => setSelectedStage(selectedStage === st.name ? 'all' : st.name)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer relative overflow-hidden group ${
                  isFilterActive
                    ? 'bg-[rgba(25,28,31,0.9)] border-[#4FA8A1] shadow-md'
                    : 'bg-[rgba(25,28,31,0.4)] border-[rgba(47,127,122,0.12)] hover:border-[rgba(47,127,122,0.35)]'
                }`}
              >
                {/* Top colored accent line */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${st.color}`} />

                <div className="text-xs font-semibold text-[#E4E7E7] group-hover:text-white">
                  {st.name}
                </div>
                <div className="flex items-baseline justify-between mt-2 font-mono">
                  <span className="text-xs text-[#718096]">{st.dealsCount} deals</span>
                  <span className="text-sm font-bold text-white">{st.value}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* 4 Summary Metrics Inside the Grouped Surface */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-[rgba(47,127,122,0.12)]">
          {/* Total pipeline */}
          <div className="flex items-center gap-3.5 p-3 rounded-xl bg-[rgba(25,28,31,0.4)] border border-[rgba(47,127,122,0.1)]">
            <div className="w-9 h-9 rounded-xl bg-[rgba(47,127,122,0.15)] border border-[rgba(47,127,122,0.3)] flex items-center justify-center text-[#4FA8A1]">
              <DollarSign className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] text-[#718096] block">Total pipeline</span>
              <div className="text-base font-bold text-white font-mono mt-0.5">$7.42M</div>
              <span className="text-[10px] text-[#4FA8A1] font-medium font-mono">↑ 18% vs last month</span>
            </div>
          </div>

          {/* Deals won */}
          <div className="flex items-center gap-3.5 p-3 rounded-xl bg-[rgba(25,28,31,0.4)] border border-[rgba(47,127,122,0.1)]">
            <div className="w-9 h-9 rounded-xl bg-[rgba(47,127,122,0.15)] border border-[rgba(47,127,122,0.3)] flex items-center justify-center text-[#4FA8A1]">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] text-[#718096] block">Deals won</span>
              <div className="text-base font-bold text-white font-mono mt-0.5">5</div>
              <span className="text-[10px] text-[#4FA8A1] font-medium font-mono">↑ 25% vs last month</span>
            </div>
          </div>

          {/* Win rate */}
          <div className="flex items-center gap-3.5 p-3 rounded-xl bg-[rgba(25,28,31,0.4)] border border-[rgba(47,127,122,0.1)]">
            <div className="w-9 h-9 rounded-xl bg-[rgba(47,127,122,0.15)] border border-[rgba(47,127,122,0.3)] flex items-center justify-center text-[#4FA8A1]">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] text-[#718096] block">Win rate</span>
              <div className="text-base font-bold text-white font-mono mt-0.5">31%</div>
              <span className="text-[10px] text-[#4FA8A1] font-medium font-mono">↑ 6pp vs last month</span>
            </div>
          </div>

          {/* Avg deal size */}
          <div className="flex items-center gap-3.5 p-3 rounded-xl bg-[rgba(25,28,31,0.4)] border border-[rgba(47,127,122,0.1)]">
            <div className="w-9 h-9 rounded-xl bg-[rgba(47,127,122,0.15)] border border-[rgba(47,127,122,0.3)] flex items-center justify-center text-[#4FA8A1]">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] text-[#718096] block">Avg. deal size</span>
              <div className="text-base font-bold text-white font-mono mt-0.5">$190K</div>
              <span className="text-[10px] text-[#4FA8A1] font-medium font-mono">↑ 12% vs last month</span>
            </div>
          </div>
        </div>
      </div>

      {/* All Deals Large Table Surface */}
      <div 
        id="all-deals-table-container"
        className="surface overflow-hidden"
      >
        {/* Table Controls Header */}
        <div className="p-5 flex items-center justify-between border-b border-[rgba(47,127,122,0.12)]">
          <div className="flex items-center gap-3">
            <h2 className="card-title">All deals</h2>
            <span className="text-xs text-[#718096] font-mono">{filteredDeals.length} deals shown</span>
            {selectedStage !== 'all' && (
              <span className="status-pill pill-teal">
                Stage: {selectedStage}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[rgba(25,28,31,0.6)] border border-[rgba(47,127,122,0.2)] text-xs text-[#718096] hover:text-white transition-colors">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Columns</span>
              <ChevronDown className="w-3 h-3 text-[#718096]" />
            </button>
            <button className="p-1.5 rounded-xl bg-[rgba(25,28,31,0.6)] border border-[rgba(47,127,122,0.2)] text-[#718096] hover:text-white transition-colors">
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Deals Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[rgba(47,127,122,0.12)] text-[11px] font-semibold text-[#718096] uppercase tracking-wider bg-[rgba(13,15,18,0.5)]">
                <th className="py-3 px-6">Deal / Account</th>
                <th className="py-3 px-4">Stage</th>
                <th className="py-3 px-4">Value</th>
                <th className="py-3 px-4">Owner</th>
                <th className="py-3 px-4">Last activity</th>
                <th className="py-3 px-4">Next step</th>
                <th className="py-3 px-4">Health</th>
                <th className="py-3 px-4 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(47,127,122,0.08)] text-xs">
              {filteredDeals.map((deal) => (
                <tr
                  key={deal.id}
                  onClick={() => onNavigate('account-detail', deal.accountId)}
                  className="hover:bg-[rgba(47,127,122,0.08)] transition-colors cursor-pointer group"
                >
                  {/* Deal / Account */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[rgba(47,127,122,0.15)] border border-[rgba(47,127,122,0.3)] flex items-center justify-center font-bold text-sm text-[#9ED9D4] shrink-0">
                        {deal.accountName.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-[#E4E7E7] group-hover:text-[#9ED9D4] transition-colors">
                          {deal.accountName}
                        </div>
                        <div className="text-[11px] text-[#718096]">
                          {deal.industry}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Stage */}
                  <td className="py-4 px-4">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-[rgba(25,28,31,0.8)] border border-[rgba(47,127,122,0.2)] text-[#C2D0DC]">
                      {deal.stage}
                    </span>
                  </td>

                  {/* Value */}
                  <td className="py-4 px-4 font-mono font-semibold text-white">
                    {formatCurrency(deal.value)}
                  </td>

                  {/* Owner */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <img
                        src={deal.owner.avatar}
                        alt={deal.owner.name}
                        className="w-6 h-6 rounded-full object-cover ring-1 ring-[rgba(47,127,122,0.3)]"
                      />
                      <span className="text-[#C2D0DC]">{deal.owner.name}</span>
                    </div>
                  </td>

                  {/* Last Activity */}
                  <td className="py-4 px-4 text-[#718096] font-mono">
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-[#718096]" />
                      <span>{deal.lastActivity}</span>
                    </div>
                  </td>

                  {/* Next step */}
                  <td className="py-4 px-4">
                    <div>
                      <span className="text-[#E4E7E7] font-medium block">{deal.nextStep.title}</span>
                      <span className="text-[10px] text-[#718096] font-mono">{deal.nextStep.date}</span>
                    </div>
                  </td>

                  {/* Health Status */}
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border ${
                      deal.health === 'Healthy'
                        ? 'status-pill pill-green'
                        : deal.health === 'Needs attention'
                        ? 'status-pill pill-amber'
                        : 'status-pill pill-red'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        deal.health === 'Healthy' ? 'bg-[#4FA8A1]' : deal.health === 'Needs attention' ? 'bg-[#FBBF24]' : 'bg-[#EF4444]'
                      }`} />
                      <span>{deal.health}</span>
                    </span>
                  </td>

                  {/* Action */}
                  <td className="py-4 px-4 text-right">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigate('account-detail', deal.accountId);
                      }}
                      className="p-1.5 rounded-lg text-[#718096] hover:text-white hover:bg-[rgba(47,127,122,0.15)] transition-colors"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Pagination Footer */}
        <div className="p-4 border-t border-[rgba(47,127,122,0.12)] flex items-center justify-between text-xs text-[#718096]">
          <span>Showing 1–{filteredDeals.length} of 35 deals</span>

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
