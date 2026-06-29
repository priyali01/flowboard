import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { Folder, LogOut, Plus, Tag, Calendar, Clock, BarChart, Sun, Moon, Inbox, Settings, Bell, Search, LayoutTemplate, MoreHorizontal } from 'lucide-react';
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
import { motion, AnimatePresence } from 'framer-motion';

import { ProjectList } from '../projects/ProjectList';

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

  const NavItem = ({ to, icon: Icon, label, badge }: { to: string, icon: any, label: string, badge?: number }) => {
    const isActive = location.pathname === to;
    return (
      <Link 
        to={to} 
        className={cn(
          "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all group",
          isActive 
            ? "bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300" 
            : "text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)]"
        )}
      >
        <Icon className={cn(
          "mr-3 flex-shrink-0 h-4 w-4",
          isActive ? "text-primary-600 dark:text-primary-400" : "text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]"
        )} />
        <span className="flex-1 truncate">{label}</span>
        {badge !== undefined && (
          <span className={cn(
            "ml-3 inline-block py-0.5 px-2 text-xs font-medium rounded-full",
            isActive ? "bg-primary-100 text-primary-700 dark:bg-primary-800 dark:text-primary-300" : "bg-[var(--bg-subtle)] text-[var(--text-secondary)]"
          )}>
            {badge}
          </span>
        )}
      </Link>
    );
  };

  return (
    <div className="flex h-screen bg-[var(--bg-app)] overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 flex-shrink-0 border-r border-[var(--border-default)] bg-[var(--bg-surface)] flex flex-col z-20">
        {/* Header/WorkspaceSwitcher Area */}
        <div className="p-4 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <WorkspaceSwitcher />
          </div>
          {!isOnline && (
            <div className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-1 rounded-md border border-amber-200 text-center">
              Offline Mode
            </div>
          )}
          {isSyncing && (
            <div className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-md border border-blue-200 text-center">
              Syncing changes...
            </div>
          )}
        </div>
        
        {/* Nav Links */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-6">
          <div className="space-y-1">
            <NavItem to="/inbox" icon={Inbox} label="Inbox" badge={3} />
            <NavItem to="/today" icon={Sun} label="Today" badge={5} />
            <NavItem to="/upcoming" icon={Calendar} label="Upcoming" />
            <NavItem to="/search" icon={Search} label="Search" />
          </div>

          {/* Projects */}
          <div className="pt-2">
            <ProjectList />
          </div>

          {/* Labels & Templates */}
          <div>
            <h2 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider px-3 mb-2">Workspace Tools</h2>
            <div className="space-y-1">
              <button onClick={() => setShowLabelModal(true)} className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)] transition-colors">
                <Tag className="mr-3 h-4 w-4" /> Labels
              </button>
              <button onClick={() => setShowTemplatesModal(true)} className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)] transition-colors">
                <LayoutTemplate className="mr-3 h-4 w-4" /> Templates
              </button>
              <Link to="/analytics" className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)] transition-colors">
                <BarChart className="mr-3 h-4 w-4" /> Analytics
              </Link>
            </div>
          </div>
        </div>

        {/* User Footer */}
        <div className="p-4 border-t border-[var(--border-default)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 truncate">
              <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary-500 to-primary-300 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <span className="text-sm font-medium text-[var(--text-primary)] truncate">{user?.name}</span>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={toggleDarkMode} className="p-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] rounded-md transition-colors">
                {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
              <button onClick={handleLogout} className="p-1.5 text-[var(--text-secondary)] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors">
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[var(--bg-app)] relative">
        {/* Main Header */}
        <header className="h-14 flex items-center justify-between px-6 border-b border-[var(--border-default)] bg-[var(--bg-surface)]">
          <div className="flex items-center gap-4">
            {/* Placeholder for page title */}
          </div>
          <div className="flex items-center gap-4">
            <button className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
              <Search className="h-5 w-5" />
            </button>
            <NotificationTray />
          </div>
        </header>
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>

      {/* Modals */}
      {showLabelModal && <LabelManagerModal onClose={() => setShowLabelModal(false)} />}
      {showTemplatesModal && <TemplatesModal onClose={() => setShowTemplatesModal(false)} />}
    </div>
  );
};
