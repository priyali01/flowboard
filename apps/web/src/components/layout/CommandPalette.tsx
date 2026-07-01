import { useEffect } from 'react';
import { Command } from 'cmdk';
import { useNavigate } from 'react-router-dom';
import { useProjects } from '../../hooks/useProjects';
import { Search, Inbox, Sun, Calendar, Folder, FolderPlus, FilePlus, LogOut } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { create } from 'zustand';

// Global store so any component can open the palette
interface PaletteStore {
  open: boolean;
  setOpen: (v: boolean) => void;
}
export const useCommandPaletteStore = create<PaletteStore>((set) => ({
  open: false,
  setOpen: (v) => set({ open: v }),
}));

export const CommandPalette = () => {
  const { open, setOpen } = useCommandPaletteStore();
  const navigate = useNavigate();
  const { data: projects } = useProjects();
  const { logout } = useAuthStore();

  // Toggle on Ctrl+K / ⌘K and close on Escape
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(!open);
      }
      if (e.key === 'Escape' && open) {
        e.preventDefault();
        setOpen(false);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [open, setOpen]);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-start justify-center pt-[15vh]">
      <div className="w-full max-w-xl mx-4 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden overflow-y-auto max-h-[60vh]">
        <Command label="Global Command Menu" shouldFilter={true} className="flex flex-col">
          <div className="flex items-center px-4 border-b border-gray-100">
            <Search className="w-5 h-5 text-gray-400 shrink-0" />
            <Command.Input
              autoFocus
              placeholder="Search tasks, projects, navigate..."
              className="w-full bg-transparent border-none outline-none focus:ring-0 px-3 py-4 text-base text-gray-800 placeholder-gray-400"
            />
            <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-xs font-mono text-gray-400 bg-gray-100 rounded border border-gray-200">
              Esc
            </kbd>
          </div>

          <Command.List className="p-2 overflow-y-auto">
            <Command.Empty className="py-6 text-center text-sm text-gray-400">No results found.</Command.Empty>

            <Command.Group heading="Navigation" className="px-2 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              <Command.Item
                onSelect={() => runCommand(() => navigate('/inbox'))}
                className="flex items-center px-3 py-2 mt-1 rounded-xl text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-50 aria-selected:bg-gray-50"
              >
                <Inbox className="w-4 h-4 mr-3 text-gray-400" /> Go to Dashboard
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => navigate('/today'))}
                className="flex items-center px-3 py-2 rounded-xl text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-50 aria-selected:bg-gray-50"
              >
                <Sun className="w-4 h-4 mr-3 text-gray-400" /> Go to Today
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => navigate('/upcoming'))}
                className="flex items-center px-3 py-2 rounded-xl text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-50 aria-selected:bg-gray-50"
              >
                <Calendar className="w-4 h-4 mr-3 text-gray-400" /> Go to Upcoming
              </Command.Item>
            </Command.Group>

            {projects && projects.length > 0 && (
              <Command.Group heading="Projects" className="px-2 py-1 mt-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                {projects.map((project) => (
                  <Command.Item
                    key={project.id}
                    onSelect={() => runCommand(() => navigate(`/projects/${project.id}`))}
                    className="flex items-center px-3 py-2 mt-1 rounded-xl text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-50 aria-selected:bg-gray-50"
                  >
                    <Folder className="w-4 h-4 mr-3 text-gray-400" /> {project.name}
                  </Command.Item>
                ))}
              </Command.Group>
            )}

            <Command.Group heading="Actions" className="px-2 py-1 mt-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              <Command.Item
                onSelect={() => runCommand(() => {
                  const btn = document.getElementById('new-task-btn');
                  if (btn) (btn as HTMLButtonElement).click();
                })}
                className="flex items-center px-3 py-2 mt-1 rounded-xl text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-50 aria-selected:bg-gray-50"
              >
                <FilePlus className="w-4 h-4 mr-3 text-gray-400" /> Create new task
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => navigate('/projects?create=true'))}
                className="flex items-center px-3 py-2 mt-1 rounded-xl text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-50 aria-selected:bg-gray-50"
              >
                <FolderPlus className="w-4 h-4 mr-3 text-gray-400" /> Create new project
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => { logout(); navigate('/login'); })}
                className="flex items-center px-3 py-2 rounded-xl text-sm font-medium text-red-600 cursor-pointer hover:bg-red-50 aria-selected:bg-red-50"
              >
                <LogOut className="w-4 h-4 mr-3 text-red-400" /> Sign out
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
