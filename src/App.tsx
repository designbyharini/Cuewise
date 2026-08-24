import React, { useState, useEffect } from 'react';
import { NavSection, UserProfile } from './types';
import { mockUsers, mockMeetings, mockAccounts } from './data/mockData';
import { Sidebar } from './components/Sidebar';
import { HomeView } from './components/home/HomeView';
import { MeetingsView } from './components/meetings/MeetingsView';
import { MeetingDetailView } from './components/meetings/MeetingDetailView';
import { DealsView } from './components/deals/DealsView';
import { AccountsView } from './components/accounts/AccountsView';
import { AccountDetailView } from './components/accounts/AccountDetailView';
import { TasksView } from './components/tasks/TasksView';
import { TeamView } from './components/team/TeamView';
import { NotificationsView, SettingsView, ProfileView } from './components/secondary/Utilities';
import { ScheduleMeetingModal, AddDealModal, AddTaskModal } from './components/modals/ActionModals';
import { ThemeProvider } from './context/ThemeContext';

function AppContent() {
  const [currentSection, setCurrentSection] = useState<NavSection>('home');
  const [selectedMeetingId, setSelectedMeetingId] = useState<string>('m-1');
  const [selectedAccountId, setSelectedAccountId] = useState<string>('acc-1');
  const [currentUser, setCurrentUser] = useState<UserProfile>(mockUsers[0]);

  // If user switches role to Sales Rep while on team page, redirect to home
  useEffect(() => {
    if (currentUser.role !== 'Sales Manager' && currentSection === 'team') {
      setCurrentSection('home');
    }
  }, [currentUser, currentSection]);

  // Modal open states
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isAddDealModalOpen, setIsAddDealModalOpen] = useState(false);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);

  // Navigation router
  const handleNavigate = (section: NavSection, id?: string) => {
    if (id) {
      if (section === 'meeting-detail') {
        setSelectedMeetingId(id);
      } else if (section === 'account-detail') {
        setSelectedAccountId(id);
      }
    }
    setCurrentSection(section);
  };

  const handleSwitchUser = (user: UserProfile) => {
    setCurrentUser(user);
  };

  // Find active entity
  const activeMeeting = mockMeetings.find(m => m.id === selectedMeetingId) || mockMeetings[0];
  const activeAccount = mockAccounts.find(a => a.id === selectedAccountId) || mockAccounts[0];

  return (
    <div id="cuewise-app-root" className="cuewise-bg flex h-screen w-screen overflow-hidden antialiased select-none font-sans">
      {/* Primary Left Navigation Sidebar */}
      <Sidebar
        currentSection={currentSection}
        onNavigate={handleNavigate}
        currentUser={currentUser}
        onSwitchUser={handleSwitchUser}
        allUsers={mockUsers}
        unreadNotifsCount={2}
        onOpenNotifications={() => setCurrentSection('notifications')}
        onOpenSettings={() => setCurrentSection('settings')}
        onOpenProfile={() => setCurrentSection('profile')}
      />

      {/* Main App Work Area */}
      <main id="main-content" className="flex-1 min-w-0 min-h-0 h-full flex flex-col overflow-hidden bg-transparent">
        {currentSection === 'home' && (
          <HomeView
            onNavigate={handleNavigate}
            currentUser={currentUser}
          />
        )}

        {currentSection === 'meetings' && (
          <MeetingsView
            onNavigate={handleNavigate}
            onOpenScheduleModal={() => setIsScheduleModalOpen(true)}
            currentUser={currentUser}
          />
        )}

        {currentSection === 'meeting-detail' && (
          <MeetingDetailView
            meeting={activeMeeting}
            onNavigate={handleNavigate}
            currentUser={currentUser}
          />
        )}

        {currentSection === 'deals' && (
          <DealsView
            onNavigate={handleNavigate}
            onOpenAddDeal={() => setIsAddDealModalOpen(true)}
            currentUser={currentUser}
          />
        )}

        {currentSection === 'accounts' && (
          <AccountsView
            onNavigate={handleNavigate}
            onOpenAddAccount={() => setIsAddDealModalOpen(true)}
            currentUser={currentUser}
          />
        )}

        {currentSection === 'account-detail' && (
          <AccountDetailView
            account={activeAccount}
            onNavigate={handleNavigate}
            currentUser={currentUser}
            onOpenLogActivity={() => setIsAddTaskModalOpen(true)}
            onOpenScheduleMeeting={() => setIsScheduleModalOpen(true)}
          />
        )}

        {currentSection === 'tasks' && (
          <TasksView
            onNavigate={handleNavigate}
            onOpenAddTask={() => setIsAddTaskModalOpen(true)}
            currentUser={currentUser}
          />
        )}

        {currentSection === 'team' && (
          <TeamView
            onNavigate={handleNavigate}
            currentUser={currentUser}
          />
        )}

        {currentSection === 'notifications' && (
          <NotificationsView onNavigate={handleNavigate} />
        )}

        {currentSection === 'settings' && (
          <SettingsView currentUser={currentUser} />
        )}

        {currentSection === 'profile' && (
          <ProfileView 
            currentUser={currentUser} 
            onSwitchPerspective={(role) => {
              const matched = mockUsers.find(u => u.role === role);
              if (matched) setCurrentUser(matched);
            }} 
          />
        )}
      </main>

      {/* Global Quick Action Modals */}
      <ScheduleMeetingModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        onSubmit={() => {
          setIsScheduleModalOpen(false);
        }}
      />

      <AddDealModal
        isOpen={isAddDealModalOpen}
        onClose={() => setIsAddDealModalOpen(false)}
        onSubmit={() => {
          setIsAddDealModalOpen(false);
        }}
      />

      <AddTaskModal
        isOpen={isAddTaskModalOpen}
        onClose={() => setIsAddTaskModalOpen(false)}
        onSubmit={() => {
          setIsAddTaskModalOpen(false);
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

