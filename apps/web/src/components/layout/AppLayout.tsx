import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../stores/authStore';
import {
  LayoutDashboard, CheckSquare, FolderOpen, CalendarDays, Users,
  BarChart2, MessageSquare, Plus, Search,
  Tag, LayoutTemplate, LogOut, User, Settings, Lock, Bell, Palette, HelpCircle, Menu, X
} from 'lucide-react';
import { LabelManagerModal } from '../labels/LabelManagerModal';
import { TemplatesModal } from '../tasks/TemplatesModal';
import { CreateTaskModal } from '../tasks/CreateTaskModal';
import { useState } from 'react';
import { NotificationTray } from './NotificationTray';
import { useSocketSync } from '../../hooks/useSocketSync';
import { useNetworkSync } from '../../hooks/useNetworkSync';
import { useDarkMode } from '../../hooks/useDarkMode';
import { cn } from '../../lib/utils';
import { CommandPalette, useCommandPaletteStore } from './CommandPalette';
import { RightSidebar } from './RightSidebar';
import { useProjects } from '../../hooks/useProjects';

const AuroraBackground = () => (
  <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
    {/* Base color */}
    <div className="absolute inset-0 bg-[#f0f4ff]"></div>

    {/* Center white radial glow — keeps text area bright & readable */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[65vw] h-[65vh] bg-white rounded-full blur-[130px] opacity-75"></div>

    {/* Bottom-Left: Blue → Cyan → Mint ribbon */}
    <div className="absolute -bottom-[25%] -left-[5%] w-[55%] h-[75%] bg-gradient-to-tr from-[#5961F9]/45 via-[#38BDF8]/35 to-[#34D399]/20 rounded-full blur-[110px] opacity-85"></div>

    {/* Bottom-Right: Peach → Pink → Yellow ribbon */}
    <div className="absolute -bottom-[25%] -right-[5%] w-[55%] h-[75%] bg-gradient-to-bl from-[#F97316]/35 via-[#F472B6]/30 to-[#FDE047]/20 rounded-full blur-[110px] opacity-85"></div>

    {/* Top-Right: Soft lavender */}
    <div className="absolute -top-[15%] -right-[5%] w-[38%] h-[50%] bg-gradient-to-bl from-[#A855F7]/28 to-[#818CF8]/18 rounded-full blur-[100px] opacity-75"></div>

    {/* Top-Left: Soft mint/cyan */}
    <div className="absolute -top-[15%] -left-[5%] w-[38%] h-[50%] bg-gradient-to-br from-[#2DD4BF]/28 to-[#38BDF8]/18 rounded-full blur-[100px] opacity-75"></div>

    {/* Subtle diagonal light streaks */}
    <div className="absolute inset-0 opacity-[0.10] mix-blend-overlay" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 100px, rgba(255,255,255,0.8) 100px, rgba(255,255,255,0.8) 101px)' }}></div>
  </div>
);

export const AppLayout = () => {
  useSocketSync();
  const { isOnline, isSyncing } = useNetworkSync();
  useDarkMode();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const { data: projects } = useProjects();

  const [showLabelModal, setShowLabelModal] = useState(false);
  const [showTemplatesModal, setShowTemplatesModal] = useState(false);
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/inbox', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/today', icon: CheckSquare, label: 'My Tasks' },
    { to: '/projects', icon: FolderOpen, label: 'Projects' },
    { to: '/upcoming', icon: CalendarDays, label: 'Calendar' },
    { to: '/analytics', icon: BarChart2, label: 'Personal Report' },
    { to: '/team', icon: Users, label: 'Team' },
    { to: '/messages', icon: MessageSquare, label: 'Messages' },
  ];

  const NavItem = ({ to, icon: Icon, label }: { to: string; icon: any; label: string }) => {
    const isActive = location.pathname === to || (to === '/inbox' && location.pathname === '/');
    return (
      <Link
        to={to}
        onClick={() => setSidebarOpen(false)}
        className={cn(
          'flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all',
          isActive
            ? 'text-primary-700 shadow-sm'
            : 'text-gray-600 hover:bg-white/60 hover:text-gray-900'
        )}
        style={isActive ? {
          background: 'linear-gradient(135deg, rgba(219,234,254,0.9) 0%, rgba(237,233,254,0.7) 50%, rgba(252,231,243,0.7) 100%)',
        } : undefined}
      >
        <Icon
          size={18}
          className={cn(
            isActive ? 'text-primary-700' : 'text-gray-500'
          )}
        />
        {label}
      </Link>
    );
  };

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="h-16 flex items-center px-5 border-b border-white/50 flex-shrink-0">
        <img src="/logo.png" alt="FlowBoard" className="h-8 object-contain" />
        <button
          onClick={() => setSidebarOpen(false)}
          className="ml-auto lg:hidden p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      {/* Offline/Syncing notice */}
      {(!isOnline || isSyncing) && (
        <div className="px-4 py-2 flex-shrink-0">
          {!isOnline && (
            <div className="text-xs font-medium text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg text-center shadow-sm">
              Offline Mode
            </div>
          )}
          {isSyncing && (
            <div className="text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg text-center shadow-sm">
              Syncing...
            </div>
          )}
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 flex flex-col px-3 py-4 overflow-hidden">
        <div className="space-y-1 flex-shrink-0">
          {navItems.map((item) => (
            <NavItem key={item.to} {...item} />
          ))}
        </div>

        {/* Project quick-links */}
        {projects && projects.length > 0 && (
          <div className="flex-1 overflow-y-auto mt-2 px-3 pt-2 min-h-0 hide-scrollbar space-y-0.5">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-1 mb-2">Your Projects</p>
            {projects.map((p) => (
              <Link
                key={p.id}
                to={`/projects/${p.id}`}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  'flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all truncate',
                  location.pathname === `/projects/${p.id}`
                    ? 'bg-white/70 text-gray-800'
                    : 'text-gray-500 hover:text-gray-800 hover:bg-white/40'
                )}
              >
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: p.color || '#5961F9' }} />
                <span className="truncate">{p.name}</span>
              </Link>
            ))}
          </div>
        )}

        <div className="flex-shrink-0 pt-4 border-t border-white/50 mt-4 space-y-1">
          <button
            onClick={() => { setShowLabelModal(true); setSidebarOpen(false); }}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-white/60 hover:text-gray-900 transition-all"
          >
            <Tag size={18} className="text-gray-500" />
            Labels
          </button>
          <button
            onClick={() => { setShowTemplatesModal(true); setSidebarOpen(false); }}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-white/60 hover:text-gray-900 transition-all"
          >
            <LayoutTemplate size={18} className="text-gray-500" />
            Templates
          </button>
        </div>
      </nav>
    </>
  );

  return (
    <div className="flex h-screen overflow-hidden relative">
      <AuroraBackground />

      {/* ── MOBILE SIDEBAR OVERLAY ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-gray-900/40 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── LEFT SIDEBAR ── */}
      <aside
        className={cn(
          'fixed lg:relative inset-y-0 left-0 z-40 w-[240px] flex-shrink-0',
          'bg-white/80 backdrop-blur-xl border-r border-white/50 flex flex-col',
          'shadow-[4px_0_24px_rgba(0,0,0,0.05)] transition-transform duration-300 ease-in-out',
          'lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <SidebarContent />
      </aside>

      {/* ── MAIN CONTENT AREA ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-white/40 backdrop-blur-xl">
        {/* Top Header */}
        <header className="h-14 md:h-16 flex items-center justify-between px-3 sm:px-5 md:px-8 bg-transparent border-b border-white/50 z-10 flex-shrink-0 gap-2">
          {/* Left: Greeting */}
          <div className="flex items-center gap-2 min-w-0">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-gray-500 hover:bg-white/60 hover:text-gray-900 transition-all flex-shrink-0"
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
            <div className="hidden sm:block min-w-0">
              <h2 className="text-sm md:text-base font-bold text-gray-900 truncate">
                {greeting()}, {user?.name?.split(' ')[0] || 'there'} 👋
              </h2>
              <p className="text-xs text-gray-600 font-medium hidden md:block">Let's make today productive!</p>
            </div>
          </div>

          {/* Center: Search — opens Command Palette */}
          <div className="flex-1 max-w-[140px] sm:max-w-xs md:max-w-sm mx-1 sm:mx-4 md:mx-8">
            <button
              onClick={() => useCommandPaletteStore.getState().setOpen(true)}
              className="w-full flex items-center gap-2 px-3 py-2 bg-white/60 hover:bg-white/80 border border-white/50 rounded-xl text-sm text-gray-500 transition-all shadow-sm"
            >
              <Search size={16} className="text-gray-400 flex-shrink-0" />
              <span className="flex-1 text-left text-xs sm:text-sm truncate">Search tasks, projects...</span>
              <kbd className="hidden md:inline-flex text-[10px] font-mono text-gray-400 bg-gray-100/80 border border-gray-200 rounded px-1.5 py-0.5">Ctrl K</kbd>
            </button>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 flex-shrink-0">
            <div className="relative">
              <NotificationTray />
            </div>
            <button
              id="new-task-btn"
              onClick={() => setShowNewTaskModal(true)}
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-2 bg-gradient-to-r from-[#5961F9] via-[#A855F7] to-[#F97316] hover:opacity-90 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-primary-500/20 hover:shadow-lg transition-all"
            >
              <Plus size={15} />
              <span className="hidden sm:inline">New Task</span>
            </button>

            {/* Account Menu */}
            <div className="relative ml-0.5 sm:ml-2">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gradient-to-tr from-primary-500 to-purple-400 flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-md border-2 border-white hover:scale-105 transition-transform"
              >
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </button>
              
              {showUserMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                  <div className="absolute right-0 mt-2 w-56 sm:w-64 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in duration-200">
                    <div className="px-4 py-3 border-b border-gray-100 mb-2">
                      <p className="text-sm font-bold text-gray-900 truncate">{user?.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                    </div>
                    
                    <div className="px-2 space-y-1">
                      <Link to="/settings" onClick={() => setShowUserMenu(false)} className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-primary-600 transition-colors">
                        <User size={16} className="text-gray-400" /> My Profile
                      </Link>
                      <Link to="/settings" onClick={() => setShowUserMenu(false)} className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-primary-600 transition-colors">
                        <Settings size={16} className="text-gray-400" /> Account Settings
                      </Link>
                      <Link to="/settings" onClick={() => setShowUserMenu(false)} className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-primary-600 transition-colors">
                        <Palette size={16} className="text-gray-400" /> Appearance
                      </Link>
                      <Link to="/settings" onClick={() => setShowUserMenu(false)} className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-primary-600 transition-colors">
                        <Bell size={16} className="text-gray-400" /> Notifications
                      </Link>
                      <Link to="/settings" onClick={() => setShowUserMenu(false)} className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-primary-600 transition-colors">
                        <Lock size={16} className="text-gray-400" /> Security
                      </Link>
                    </div>
                    
                    <div className="mt-2 pt-2 border-t border-gray-100 px-2 space-y-1">
                      <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                        <HelpCircle size={16} className="text-gray-400" /> Help & Support
                      </button>
                      <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
                        <LogOut size={16} className="text-red-400" /> Sign Out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Main + Right Sidebar */}
        <main className="flex-1 overflow-hidden flex">
          <div className="flex-1 overflow-y-auto px-3 sm:px-5 md:px-8 py-4 md:py-6 relative z-20">
            <div className="max-w-5xl mx-auto h-full">
              <AnimatePresence mode="wait">
                <motion.div
                  key={location.pathname}
                  initial={{ opacity: 0, filter: 'blur(5px)', scale: 0.98 }}
                  animate={{ opacity: 1, filter: 'blur(0px)', scale: 1, transitionEnd: { filter: 'none', transform: 'none' } }}
                  exit={{ opacity: 0, filter: 'blur(5px)', scale: 0.98 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="h-full"
                >
                  <Outlet />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
          {!location.pathname.startsWith('/settings') && (
            <RightSidebar />
          )}
        </main>
      </div>

      {/* Modals */}
      <CommandPalette />
      {showLabelModal && <LabelManagerModal onClose={() => setShowLabelModal(false)} />}
      {showTemplatesModal && <TemplatesModal onClose={() => setShowTemplatesModal(false)} />}
      {showNewTaskModal && <CreateTaskModal onClose={() => setShowNewTaskModal(false)} />}
    </div>
  );
};
