import { useEffect, useState } from 'react';
import { Command } from 'cmdk';
import { useNavigate } from 'react-router-dom';
import { useProjects } from '../../hooks/useProjects';
import { useWorkspaceStore } from '../../hooks/useWorkspaces';
import { Search, Inbox, Sun, Calendar, Folder, FilePlus, LogOut } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';

export const CommandPalette = () => {
 const [open, setOpen] = useState(false);
 const navigate = useNavigate();
 const { activeWorkspaceId } = useWorkspaceStore();
 const { data: projects } = useProjects(activeWorkspaceId || undefined);
 const { logout } = useAuthStore();

 // Toggle the menu when ⌘K is pressed
 useEffect(() => {
 const down = (e: KeyboardEvent) => {
 if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
 e.preventDefault();
 setOpen((open) => !open);
 }
 };

 document.addEventListener('keydown', down);
 return () => document.removeEventListener('keydown', down);
 }, []);

 const runCommand = (command: () => void) => {
 setOpen(false);
 command();
 };

 if (!open) return null;

 return (
 <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-start justify-center pt-[15vh]">
 <div className="w-full max-w-xl mx-4 bg-[var(--bg-surface)] rounded-xl shadow-2xl border border-[var(--border-default)] overflow-hidden overflow-y-auto max-h-[60vh] animate-in fade-in zoom-in-95">
 <Command label="Global Command Menu" shouldFilter={true} className="flex flex-col">
 <div className="flex items-center px-4 border-b border-[var(--border-default)]">
 <Search className="w-5 h-5 text-[var(--text-disabled)] shrink-0" />
 <Command.Input 
 autoFocus 
 placeholder="Type a command or search..." 
 className="w-full bg-transparent border-none outline-none focus:ring-0 px-3 py-4 text-base text-[var(--text-primary)] placeholder-[var(--text-disabled)]" 
 />
 </div>
 
 <Command.List className="p-2 overflow-y-auto">
 <Command.Empty className="py-6 text-center text-sm text-[var(--text-secondary)]">No results found.</Command.Empty>

 <Command.Group heading="Navigation" className="px-2 py-1 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
 <Command.Item 
 onSelect={() => runCommand(() => navigate('/inbox'))}
 className="flex items-center px-2 py-2 mt-1 rounded-md text-sm font-medium text-[var(--text-primary)] cursor-pointer hover:bg-[var(--bg-subtle)] focus:bg-[var(--bg-subtle)] focus:text-[var(--text-primary)] aria-selected:bg-[var(--bg-subtle)]"
 >
 <Inbox className="w-4 h-4 mr-3 text-[var(--text-secondary)]" /> Go to Inbox
 </Command.Item>
 <Command.Item 
 onSelect={() => runCommand(() => navigate('/today'))}
 className="flex items-center px-2 py-2 rounded-md text-sm font-medium text-[var(--text-primary)] cursor-pointer hover:bg-[var(--bg-subtle)] focus:bg-[var(--bg-subtle)] focus:text-[var(--text-primary)] aria-selected:bg-[var(--bg-subtle)]"
 >
 <Sun className="w-4 h-4 mr-3 text-[var(--text-secondary)]" /> Go to Today
 </Command.Item>
 <Command.Item 
 onSelect={() => runCommand(() => navigate('/upcoming'))}
 className="flex items-center px-2 py-2 rounded-md text-sm font-medium text-[var(--text-primary)] cursor-pointer hover:bg-[var(--bg-subtle)] focus:bg-[var(--bg-subtle)] focus:text-[var(--text-primary)] aria-selected:bg-[var(--bg-subtle)]"
 >
 <Calendar className="w-4 h-4 mr-3 text-[var(--text-secondary)]" /> Go to Upcoming
 </Command.Item>
 </Command.Group>

 {projects && projects.length > 0 && (
 <Command.Group heading="Projects" className="px-2 py-1 mt-3 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
 {projects.map((project) => (
 <Command.Item
 key={project.id}
 onSelect={() => runCommand(() => navigate(`/project/${project.id}`))}
 className="flex items-center px-2 py-2 mt-1 rounded-md text-sm font-medium text-[var(--text-primary)] cursor-pointer hover:bg-[var(--bg-subtle)] focus:bg-[var(--bg-subtle)] focus:text-[var(--text-primary)] aria-selected:bg-[var(--bg-subtle)]"
 >
 <Folder className="w-4 h-4 mr-3 text-[var(--text-secondary)]" /> {project.name}
 </Command.Item>
 ))}
 </Command.Group>
 )}

 <Command.Group heading="Actions" className="px-2 py-1 mt-3 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
 <Command.Item 
 onSelect={() => runCommand(() => { navigate('/inbox'); /* Future: open task modal */ })}
 className="flex items-center px-2 py-2 mt-1 rounded-md text-sm font-medium text-[var(--text-primary)] cursor-pointer hover:bg-[var(--bg-subtle)] focus:bg-[var(--bg-subtle)] focus:text-[var(--text-primary)] aria-selected:bg-[var(--bg-subtle)]"
 >
 <FilePlus className="w-4 h-4 mr-3 text-[var(--text-secondary)]" /> Create new task
 </Command.Item>
 <Command.Item 
 onSelect={() => runCommand(() => { logout(); navigate('/login'); })}
 className="flex items-center px-2 py-2 rounded-md text-sm font-medium text-red-600 cursor-pointer hover:bg-red-50 focus:bg-red-50 :bg-red-900/20 :bg-red-900/20 aria-selected:bg-red-50 :bg-red-900/20"
 >
 <LogOut className="w-4 h-4 mr-3 text-red-500" /> Sign out
 </Command.Item>
 </Command.Group>
 </Command.List>
 </Command>
 </div>
 
 {/* Click outside to close */}
 <div className="fixed inset-0 z-[-1]" onClick={() => setOpen(false)} />
 </div>
 );
};
