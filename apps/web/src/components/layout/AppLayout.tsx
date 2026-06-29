import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { LogOut, Plus, Tag, Calendar, BarChart, Sun, Moon, Inbox, Settings, Bell, Search, LayoutTemplate, MessageSquare } from 'lucide-react';
import { LabelManagerModal } from '../labels/LabelManagerModal';
import { TemplatesModal } from '../tasks/TemplatesModal';
import { useState } from 'react';
import { NotificationTray } from './NotificationTray';
import { WorkspaceSwitcher } from './WorkspaceSwitcher';
import { useSocketSync } from '../../hooks/useSocketSync';
import { useWorkspaceStore } from '../../hooks/useWorkspaces';
import { useNetworkSync } from '../../hooks/useNetworkSync';
import { useDarkMode } from '../../hooks/useDarkMode';
import { cn } from '../../lib/utils';
import { ProjectList } from '../projects/ProjectList';
import { CommandPalette } from './CommandPalette';
import { RightSidebar } from './RightSidebar'; // We will create this

export const AppLayout = () => {
  useSocketSync();
  const { isOnline, isSyncing } = useNetworkSync();
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [showLabelModal, setShowLabelModal] = useState(false);
  const [showTemplatesModal, setShowTemplatesModal] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const NavItem = ({ to, icon: Icon, label, badge, dotColor }: { to: string, icon?: any, label: string, badge?: number, dotColor?: string }) => {
    const isActive = location.pathname === to;
    return (
      <Link 
        to={to} 
        className={cn(
          "flex items-center px-4 py-2.5 text-sm font-medium rounded-xl transition-all group",
          isActive 
            ? "bg-primary-50/50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300" 
            : "text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)]"
        )}
      >
        {Icon && (
          <Icon className={cn(
            "mr-3 flex-shrink-0 h-[18px] w-[18px]",
            isActive ? "text-primary-600 dark:text-primary-400" : "text-[var(--text-secondary)] group-hover:text-primary-500 transition-colors"
          )} />
        )}
        {!Icon && dotColor && (
          <span className="mr-3 flex-shrink-0 h-2 w-2 rounded-full" style={{ backgroundColor: dotColor }} />
        )}
        <span className="flex-1 truncate">{label}</span>
        {badge !== undefined && (
          <span className={cn(
            "ml-3 inline-flex items-center justify-center h-5 px-2 text-xs font-semibold rounded-full",
            isActive ? "bg-primary-600 text-white" : "bg-[var(--bg-subtle)] text-[var(--text-secondary)] border border-[var(--border-default)]"
          )}>
            {badge}
          </span>
        )}
      </Link>
    );
  };

  return (
    <div className="flex h-screen bg-transparent overflow-hidden selection:bg-primary-200 selection:text-primary-900">
      {/* Left Sidebar */}
      <div className="w-[260px] flex-shrink-0 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border-r border-white/20 dark:border-gray-800/50 flex flex-col z-20 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        {/* Logo Area */}
        <div className="h-20 flex items-center px-6">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center shadow-lg shadow-primary-500/30">
              <span className="text-white font-bold text-lg leading-none">F</span>
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 tracking-tight">FlowBoard</span>
          </div>
        </div>

        {/* Sync/Offline Status */}
        <div className="px-4 pb-2">
          {!isOnline && (
            <div className="text-xs font-medium text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100 text-center shadow-sm">
              Offline Mode
            </div>
          )}
          {isSyncing && (
            <div className="text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 text-center shadow-sm">
              Syncing changes...
            </div>
          )}
        </div>
        
        {/* Nav Links */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-8 scrollbar-hide">
          {/* Main Navigation */}
          <div>
            <h2 className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-4 mb-3">Main</h2>
            <div className="space-y-1">
              <NavItem to="/inbox" icon={Inbox} label="Inbox" badge={3} />
              <NavItem to="/today" icon={Sun} label="Today" badge={5} />
              <NavItem to="/upcoming" icon={Calendar} label="Upcoming" />
              <NavItem to="/analytics" icon={BarChart} label="Analytics" />
              <NavItem to="/search" icon={Search} label="Search" />
            </div>
          </div>

          {/* Projects (Handled by ProjectList component, needs styling tweaks internally) */}
          <div>
            <ProjectList />
          </div>

          {/* Labels & Workspace Tools */}
          <div>
            <h2 className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-4 mb-3">Labels & Tools</h2>
            <div className="space-y-1">
              <button onClick={() => setShowLabelModal(true)} className="w-full flex items-center px-4 py-2.5 text-sm font-medium rounded-xl text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)] transition-all group">
                <Tag className="mr-3 h-[18px] w-[18px] group-hover:text-primary-500 transition-colors" /> Manage Labels
              </button>
              <button onClick={() => setShowTemplatesModal(true)} className="w-full flex items-center px-4 py-2.5 text-sm font-medium rounded-xl text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)] transition-all group">
                <LayoutTemplate className="mr-3 h-[18px] w-[18px] group-hover:text-primary-500 transition-colors" /> Templates
              </button>
            </div>
          </div>
        </div>

        {/* User Footer Card */}
        <div className="p-4">
          <div className="bg-[var(--bg-subtle)]/50 backdrop-blur-md border border-[var(--border-default)] rounded-2xl p-3 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3 truncate">
              <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-primary-500 to-purple-400 flex items-center justify-center text-white font-bold text-sm shadow-md flex-shrink-0 border-2 border-white dark:border-gray-800">
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="flex flex-col truncate">
                <span className="text-sm font-bold text-[var(--text-primary)] truncate">{user?.name}</span>
                <span className="text-xs text-[var(--text-secondary)] truncate">{user?.email}</span>
              </div>
            </div>
            <button onClick={handleLogout} className="p-2 text-[var(--text-secondary)] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all">
              <Settings className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Top Navbar */}
        <header className="h-20 flex items-center justify-between px-8 z-10">
          {/* Global Search Bar */}
          <div className="flex-1 max-w-xl">
            <button className="w-full flex items-center px-4 py-2.5 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/40 dark:border-gray-700/50 shadow-soft rounded-2xl text-[var(--text-secondary)] hover:bg-white dark:hover:bg-gray-800 transition-all group">
              <Search className="h-5 w-5 mr-3 text-gray-400 group-hover:text-primary-500 transition-colors" />
              <span className="text-sm font-medium">Search tasks, projects, labels...</span>
              <div className="ml-auto flex gap-1">
                <kbd className="hidden sm:inline-block px-2 py-0.5 text-xs font-semibold text-gray-400 bg-gray-100 dark:bg-gray-700 rounded-md">⌘</kbd>
                <kbd className="hidden sm:inline-block px-2 py-0.5 text-xs font-semibold text-gray-400 bg-gray-100 dark:bg-gray-700 rounded-md">K</kbd>
              </div>
            </button>
          </div>
          
          <div className="flex items-center gap-4 pl-8">
            <button className="flex items-center justify-center px-5 py-2.5 bg-gradient-to-r from-primary-500 to-purple-500 hover:from-primary-600 hover:to-purple-600 text-white rounded-xl font-semibold shadow-lg shadow-primary-500/30 transition-all hover:scale-105 active:scale-95">
              <Plus className="h-5 w-5 mr-2" /> New Task
            </button>
            <button onClick={toggleDarkMode} className="p-2.5 text-gray-500 hover:text-gray-900 bg-white/70 hover:bg-white rounded-xl shadow-soft transition-all">
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <div className="bg-white/70 rounded-xl shadow-soft">
              <NotificationTray />
            </div>
            <button className="p-2.5 text-gray-500 hover:text-gray-900 bg-white/70 hover:bg-white rounded-xl shadow-soft transition-all">
              <MessageSquare className="h-5 w-5" />
            </button>
          </div>
        </header>

        {/* 3-Column Split (Center Main + Right Sidebar) */}
        <main className="flex-1 overflow-hidden flex">
          {/* Center Main Content */}
          <div className="flex-1 overflow-y-auto px-8 pb-8 pt-4">
            <div className="max-w-5xl mx-auto">
              <Outlet />
            </div>
          </div>
          
          {/* Right Sidebar Widgets */}
          <RightSidebar />
        </main>
      </div>

      {/* Modals */}
      <CommandPalette />
      {showLabelModal && <LabelManagerModal onClose={() => setShowLabelModal(false)} />}
      {showTemplatesModal && <TemplatesModal onClose={() => setShowTemplatesModal(false)} />}
    </div>
  );
};
