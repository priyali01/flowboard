import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import {
 LayoutDashboard, CheckSquare, FolderOpen, CalendarDays, Users,
 BarChart2, MessageSquare, Settings, Plus, Search,
 Tag, LayoutTemplate, LogOut
} from 'lucide-react';
import { LabelManagerModal } from '../labels/LabelManagerModal';
import { TemplatesModal } from '../tasks/TemplatesModal';
import { useState } from 'react';
import { NotificationTray } from './NotificationTray';
import { useSocketSync } from '../../hooks/useSocketSync';
import { useNetworkSync } from '../../hooks/useNetworkSync';
import { useDarkMode } from '../../hooks/useDarkMode';
import { cn } from '../../lib/utils';
import { CommandPalette } from './CommandPalette';
import { RightSidebar } from './RightSidebar';

export const AppLayout = () => {
 useSocketSync();
 const { isOnline, isSyncing } = useNetworkSync();
 useDarkMode(); // ensures light mode is applied
 const { user, logout } = useAuthStore();
 const navigate = useNavigate();
 const location = useLocation();
 
 const [showLabelModal, setShowLabelModal] = useState(false);
 const [showTemplatesModal, setShowTemplatesModal] = useState(false);
 const [showUserMenu, setShowUserMenu] = useState(false);

 const handleLogout = () => {
 logout();
 navigate('/login');
 };

 const navItems = [
 { to: '/inbox', icon: LayoutDashboard, label: 'Dashboard' },
 { to: '/today', icon: CheckSquare, label: 'My Tasks' },
 { to: '/projects', icon: FolderOpen, label: 'Projects' },
 { to: '/upcoming', icon: CalendarDays, label: 'Calendar' },
 { to: '/team', icon: Users, label: 'Team' },
 { to: '/analytics', icon: BarChart2, label: 'Reports' },
 { to: '/messages', icon: MessageSquare, label: 'Messages' },
 { to: '/settings', icon: Settings, label: 'Settings' },
 ];

 const NavItem = ({ to, icon: Icon, label }: { to: string; icon: any; label: string }) => {
 const isActive = location.pathname === to || (to === '/inbox' && location.pathname === '/');
 return (
 <Link
 to={to}
 className={cn(
 'flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all',
 isActive
 ? 'bg-white/80 shadow-sm text-primary-600'
 : 'text-gray-600 hover:bg-white/60 hover:text-gray-900'
 )}
 >
 <Icon
 size={18}
 className={cn(
 isActive ? 'text-primary-600' : 'text-gray-500'
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

 return (
 <div 
 className="flex h-screen overflow-hidden bg-[#f4f7fc]"
 style={{
 backgroundImage: "url('/LOGIN_IMG.png')",
 backgroundSize: 'cover',
 backgroundPosition: 'center',
 backgroundRepeat: 'no-repeat',
 backgroundAttachment: 'fixed'
 }}
 >
 {/* ── LEFT SIDEBAR ── */}
 <aside className="w-[240px] flex-shrink-0 bg-white/60 backdrop-blur-xl border-r border-white/50 flex flex-col z-20 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
 {/* Logo */}
 <div className="h-16 flex items-center px-5 border-b border-white/50">
 <img src="/logo.png" alt="FlowBoard" className="h-8 object-contain" />
 </div>

 {/* Offline/Syncing notice */}
 {(!isOnline || isSyncing) && (
 <div className="px-4 py-2">
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
 <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
 {navItems.map((item) => (
 <NavItem key={item.to} {...item} />
 ))}

 <div className="pt-4 border-t border-white/50 mt-4 space-y-1">
 <button
 onClick={() => setShowLabelModal(true)}
 className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-white/60 hover:text-gray-900 transition-all"
 >
 <Tag size={18} className="text-gray-500" />
 Labels
 </button>
 <button
 onClick={() => setShowTemplatesModal(true)}
 className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-white/60 hover:text-gray-900 transition-all"
 >
 <LayoutTemplate size={18} className="text-gray-500" />
 Templates
 </button>
 </div>
 </nav>



 {/* User Profile Footer */}
 <div className="px-4 pb-4">
 <div
 className="flex items-center gap-3 p-3 bg-white/50 backdrop-blur-md rounded-2xl hover:bg-white/80 border border-white/40 cursor-pointer transition-all shadow-sm"
 onClick={() => setShowUserMenu(!showUserMenu)}
 >
 <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-primary-500 to-purple-400 flex items-center justify-center text-white font-bold text-sm shadow-md flex-shrink-0 border-2 border-white">
 {user?.name?.[0]?.toUpperCase() || 'U'}
 </div>
 <div className="flex-1 min-w-0">
 <p className="text-sm font-bold text-gray-800 truncate">{user?.name}</p>
 <p className="text-xs text-gray-500 truncate">{user?.email?.split('@')[0]}</p>
 </div>
 <button
 onClick={(e) => { e.stopPropagation(); handleLogout(); }}
 className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
 title="Logout"
 >
 <LogOut size={14} />
 </button>
 </div>
 </div>
 </aside>

 {/* ── MAIN CONTENT AREA ── */}
 <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-white/40 backdrop-blur-xl">
 {/* Top Header */}
 <header className="h-16 flex items-center justify-between px-8 bg-transparent border-b border-white/50 z-10 flex-shrink-0">
 {/* Left: Greeting */}
 <div>
 <h2 className="text-base font-bold text-gray-900">
 {greeting()}, {user?.name?.split(' ')[0] || 'there'} 👋
 </h2>
 <p className="text-xs text-gray-600 font-medium">Let's make today productive!</p>
 </div>

 {/* Center: Search */}
 <div className="flex-1 max-w-sm mx-8">
 <button className="w-full flex items-center gap-2 px-4 py-2 bg-white/60 hover:bg-white/80 border border-white/50 rounded-xl text-sm text-gray-500 transition-all shadow-sm">
 <Search size={16} className="text-gray-500 flex-shrink-0" />
 <span>Search tasks, projects...</span>
 </button>
 </div>

 {/* Right: Actions */}
 <div className="flex items-center gap-3">
 <div className="relative">
 <NotificationTray />
 </div>
 <button
 onClick={() => navigate('/inbox')}
 className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-bold shadow-md shadow-primary-500/20 hover:shadow-lg transition-all"
 >
 <Plus size={16} />
 New Task
 </button>
 </div>
 </header>

 {/* Main + Right Sidebar */}
 <main className="flex-1 overflow-hidden flex">
 <div className="flex-1 overflow-y-auto px-8 py-6">
 <div className="max-w-5xl mx-auto">
 <Outlet />
 </div>
 </div>
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
