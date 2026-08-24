import React, { useState } from 'react';
import { 
  Home, 
  Video, 
  Briefcase, 
  Building2, 
  CheckSquare, 
  Users,
  Bell, 
  Settings, 
  ChevronLeft,
  ChevronRight,
  ArrowRightLeft,
  Check,
  User
} from 'lucide-react';
import { NavSection, UserProfile } from '../types';

interface SidebarProps {
  currentSection: NavSection;
  onNavigate: (section: NavSection, id?: string) => void;
  currentUser: UserProfile;
  onSwitchUser: (user: UserProfile) => void;
  allUsers: UserProfile[];
  unreadNotifsCount: number;
  onOpenNotifications: () => void;
  onOpenSettings: () => void;
  onOpenProfile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentSection,
  onNavigate,
  currentUser,
  onSwitchUser,
  allUsers,
  unreadNotifsCount,
  onOpenNotifications,
  onOpenSettings,
  onOpenProfile,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const isManager = currentUser.role === 'Sales Manager';

  const navItems: { id: NavSection; label: string; icon: React.ElementType }[] = [
    { id: 'home', label: 'Home', icon: Home },
    ...(isManager ? [{ id: 'team' as NavSection, label: 'Team', icon: Users }] : []),
    { id: 'meetings', label: 'Meetings', icon: Video },
    { id: 'deals', label: 'Deals', icon: Briefcase },
    { id: 'accounts', label: 'Accounts', icon: Building2 },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
  ];

  const isSelected = (id: NavSection) => {
    if (id === 'meetings' && currentSection === 'meeting-detail') return true;
    if (id === 'accounts' && currentSection === 'account-detail') return true;
    return currentSection === id;
  };

  return (
    <aside 
      id="cuewise-sidebar"
      aria-label="Sidebar Navigation"
      className={`${
        isCollapsed ? 'w-[68px]' : 'w-[216px]'
      } flex-shrink-0 h-full bg-[rgba(13,15,18,0.85)] border-r border-[rgba(47,127,122,0.18)] flex flex-col justify-between select-none relative z-40 transition-all duration-300 ease-in-out backdrop-blur-md`}
    >
      {/* Small Chevron Collapse / Expand Edge Control */}
      <button
        id="sidebar-collapse-toggle"
        onClick={() => {
          setIsCollapsed(!isCollapsed);
          setProfileMenuOpen(false);
        }}
        title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        className="absolute -right-3 top-7 w-6 h-6 rounded-full bg-[#131619] border border-[rgba(47,127,122,0.35)] text-[#A0AEC0] hover:text-[#4FA8A1] hover:border-[#4FA8A1] flex items-center justify-center shadow-lg shadow-black/80 transition-all duration-200 z-50 hover:scale-110 focus:outline-none"
      >
        <ChevronLeft 
          className={`w-3.5 h-3.5 transition-transform duration-300 ${
            isCollapsed ? 'rotate-180 text-[#4FA8A1]' : 'text-[#A0AEC0]'
          }`} 
        />
      </button>

      {/* Top Section: Brand Header & Primary Navigation */}
      <div>
        {/* Brand Header */}
        <div className={`py-6 flex items-center ${isCollapsed ? 'justify-center px-2' : 'px-4 justify-start'} transition-all duration-200`}>
          <div 
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2.5 cursor-pointer group"
            title="Cuewise Home"
          >
            {/* Cuewise Logo Mark */}
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#2F7F7A] to-[#132A29] border border-[#4FA8A1]/40 flex items-center justify-center shadow-md shadow-black/50 shrink-0 group-hover:border-[#4FA8A1] transition-all">
              <svg 
                viewBox="0 0 24 24" 
                className="w-4 h-4 text-[#4FA8A1] group-hover:text-[#9ED9D4] fill-none stroke-current stroke-[2.4]" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M16 8A6 6 0 1 0 16 16" />
                <circle cx="18" cy="12" r="1.5" className="fill-[#4FA8A1] group-hover:fill-[#9ED9D4]" stroke="none" />
              </svg>
            </div>

            {/* Cuewise Wordmark (shown when expanded) */}
            {!isCollapsed && (
              <div className="flex items-center tracking-tight overflow-hidden whitespace-nowrap animate-in fade-in duration-200">
                <span className="font-extrabold text-[19px] text-[#4FA8A1] group-hover:text-[#9ED9D4] transition-colors">
                  Cuewise
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Primary Navigation Menu */}
        <nav className={`space-y-1 mt-1 ${isCollapsed ? 'px-2' : 'px-3'}`}>
          {navItems.map((item) => {
            const active = isSelected(item.id);
            const Icon = item.icon;
            return (
              <div key={item.id} className="relative group">
                <button
                  id={`nav-${item.id}`}
                  onClick={() => onNavigate(item.id)}
                  aria-label={item.label}
                  className={`w-full flex items-center ${
                    isCollapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2.5'
                  } rounded-xl text-sm font-medium transition-all duration-150 relative text-left ${
                    active
                      ? 'bg-[rgba(47,127,122,0.18)] text-[#4FA8A1] border border-[rgba(47,127,122,0.3)]'
                      : 'text-[#A0AEC0] hover:text-[#E4E7E7] hover:bg-[rgba(47,127,122,0.08)] border border-transparent'
                  }`}
                >
                  <div className="w-[18px] h-[18px] flex items-center justify-center shrink-0">
                    <Icon className="w-[18px] h-[18px] stroke-[1.8]" />
                  </div>
                  {!isCollapsed && (
                    <span className="text-[13.5px] truncate font-medium">{item.label}</span>
                  )}
                </button>

                {/* Floating Tooltip in Collapsed State */}
                {isCollapsed && (
                  <div className="absolute left-[calc(100%+12px)] top-1/2 -translate-y-1/2 px-2.5 py-1.5 bg-[#131619] border border-[rgba(47,127,122,0.3)] text-[#E4E7E7] text-xs font-medium rounded-lg shadow-xl shadow-black/80 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-150 z-50 transform -translate-x-1 group-hover:translate-x-0">
                    <span>{item.label}</span>
                    <div className="absolute right-full top-1/2 -translate-y-1/2 border-[5px] border-transparent border-r-[#131619]" />
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      {/* Secondary Bottom Section: Notifications, Settings, Profile */}
      <div className={`border-t border-[rgba(47,127,122,0.12)] space-y-1 relative ${isCollapsed ? 'p-2' : 'p-3'}`}>
        {/* Notifications Button */}
        <div className="relative group">
          <button
            id="btn-notifications"
            onClick={onOpenNotifications}
            aria-label="Notifications"
            className={`w-full flex items-center ${
              isCollapsed ? 'justify-center p-2.5' : 'justify-between px-3 py-2'
            } rounded-xl text-xs text-[#A0AEC0] hover:text-[#E4E7E7] hover:bg-[rgba(47,127,122,0.08)] transition-colors relative`}
          >
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <Bell className="w-4 h-4 text-[#A0AEC0] group-hover:text-[#9ED9D4]" />
                {isCollapsed && unreadNotifsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#2F7F7A] ring-2 ring-[#0D0F12] rounded-full" />
                )}
              </div>
              {!isCollapsed && <span>Notifications</span>}
            </div>

            {!isCollapsed && unreadNotifsCount > 0 && (
              <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-[#2F7F7A] text-white rounded-full">
                {unreadNotifsCount}
              </span>
            )}
          </button>

          {/* Floating Tooltip in Collapsed State */}
          {isCollapsed && (
            <div className="absolute left-[calc(100%+12px)] top-1/2 -translate-y-1/2 px-2.5 py-1.5 bg-[#131619] border border-[rgba(47,127,122,0.3)] text-[#E4E7E7] text-xs font-medium rounded-lg shadow-xl shadow-black/80 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-150 z-50 transform -translate-x-1 group-hover:translate-x-0 flex items-center gap-2">
              <span>Notifications</span>
              {unreadNotifsCount > 0 && (
                <span className="px-1.5 py-0.2 text-[9px] font-bold bg-[#2F7F7A] text-white rounded-full">
                  {unreadNotifsCount}
                </span>
              )}
              <div className="absolute right-full top-1/2 -translate-y-1/2 border-[5px] border-transparent border-r-[#131619]" />
            </div>
          )}
        </div>

        {/* Settings Button */}
        <div className="relative group">
          <button
            id="btn-settings"
            onClick={onOpenSettings}
            aria-label="Settings"
            className={`w-full flex items-center ${
              isCollapsed ? 'justify-center p-2.5' : 'gap-2.5 px-3 py-2'
            } rounded-xl text-xs text-[#A0AEC0] hover:text-[#E4E7E7] hover:bg-[rgba(47,127,122,0.08)] transition-colors`}
          >
            <Settings className="w-4 h-4 text-[#A0AEC0] group-hover:text-[#9ED9D4]" />
            {!isCollapsed && <span>Settings</span>}
          </button>

          {/* Floating Tooltip in Collapsed State */}
          {isCollapsed && (
            <div className="absolute left-[calc(100%+12px)] top-1/2 -translate-y-1/2 px-2.5 py-1.5 bg-[#131619] border border-[rgba(47,127,122,0.3)] text-[#E4E7E7] text-xs font-medium rounded-lg shadow-xl shadow-black/80 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-150 z-50 transform -translate-x-1 group-hover:translate-x-0">
              <span>Settings</span>
              <div className="absolute right-full top-1/2 -translate-y-1/2 border-[5px] border-transparent border-r-[#131619]" />
            </div>
          )}
        </div>

        {/* Profile & Perspective Switcher */}
        <div className="pt-1.5 relative group">
          <button
            id="btn-user-profile"
            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            aria-label={`Profile: ${currentUser.name}`}
            className={`w-full flex items-center ${
              isCollapsed ? 'justify-center p-1.5' : 'justify-between p-2'
            } rounded-xl bg-[rgba(25,28,31,0.6)] hover:bg-[rgba(30,34,38,0.85)] border border-[rgba(47,127,122,0.18)] transition-all`}
          >
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="relative shrink-0">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-lg object-cover ring-1 ring-[#2F7F7A]/60"
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-[#10B981] ring-1 ring-[#0D0F12] rounded-full" />
              </div>

              {!isCollapsed && (
                <div className="text-left truncate">
                  <div className="text-[12px] font-medium text-[#E4E7E7] truncate group-hover:text-white">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-[#718096] truncate">
                    {currentUser.role}
                  </div>
                </div>
              )}
            </div>

            {!isCollapsed && (
              <ChevronRight 
                className={`w-3.5 h-3.5 text-[#718096] transition-transform duration-200 ${
                  profileMenuOpen ? '-rotate-90 text-[#4FA8A1]' : ''
                }`} 
              />
            )}
          </button>

          {/* Floating Tooltip in Collapsed State (hidden when profile menu open) */}
          {isCollapsed && !profileMenuOpen && (
            <div className="absolute left-[calc(100%+12px)] top-1/2 -translate-y-1/2 px-2.5 py-1.5 bg-[#131619] border border-[rgba(47,127,122,0.3)] text-[#E4E7E7] text-xs font-medium rounded-lg shadow-xl shadow-black/80 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-150 z-50 transform -translate-x-1 group-hover:translate-x-0">
              <div className="font-medium text-white">{currentUser.name}</div>
              <div className="text-[10px] text-[#718096]">{currentUser.role}</div>
              <div className="absolute right-full top-1/2 -translate-y-1/2 border-[5px] border-transparent border-r-[#131619]" />
            </div>
          )}

          {/* Perspective Switcher Popover */}
          {profileMenuOpen && (
            <div 
              id="profile-dropdown-menu"
              className={`absolute ${
                isCollapsed 
                  ? 'bottom-0 left-[calc(100%+12px)] w-56' 
                  : 'bottom-16 left-2 right-2'
              } bg-[#131619] border border-[rgba(47,127,122,0.3)] rounded-2xl p-2.5 shadow-2xl shadow-black/95 space-y-1.5 animate-in fade-in zoom-in-95 duration-150 z-50`}
            >
              <div className="flex items-center justify-between px-2 py-1 border-b border-[rgba(47,127,122,0.12)] pb-2">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-[#4FA8A1] flex items-center gap-1.5">
                  <ArrowRightLeft className="w-3 h-3" />
                  <span>Switch Perspective</span>
                </div>
                {onOpenProfile && (
                  <button
                    onClick={() => {
                      onOpenProfile();
                      setProfileMenuOpen(false);
                    }}
                    className="text-[10px] text-[#A0AEC0] hover:text-white flex items-center gap-1 transition-colors"
                  >
                    <User className="w-3 h-3" />
                    <span>View Profile</span>
                  </button>
                )}
              </div>

              <div className="space-y-1 pt-1">
                {allUsers.map((user) => {
                  const isCurrent = user.id === currentUser.id;
                  return (
                    <button
                      key={user.id}
                      onClick={() => {
                        onSwitchUser(user);
                        setProfileMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-xs transition-colors ${
                        isCurrent
                          ? 'bg-[rgba(47,127,122,0.2)] text-white border border-[#2F7F7A]/50'
                          : 'text-[#A0AEC0] hover:text-white hover:bg-[rgba(47,127,122,0.1)] border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <img src={user.avatar} alt={user.name} className="w-5 h-5 rounded-md object-cover" />
                        <div className="text-left">
                          <div className="font-medium text-[#E4E7E7] text-[11px]">{user.name}</div>
                          <div className="text-[9px] text-[#718096]">{user.role}</div>
                        </div>
                      </div>
                      {isCurrent && <Check className="w-3.5 h-3.5 text-[#4FA8A1]" />}
                    </button>
                  );
                })}
              </div>

              <div className="pt-1.5 border-t border-[rgba(47,127,122,0.12)] px-2 text-[10px] text-[#718096] flex items-center justify-between">
                <span>Active mode:</span>
                <span className="text-[#9ED9D4] font-medium">
                  {currentUser.role === 'Sales Manager' ? 'Manager View' : 'Rep View'}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
