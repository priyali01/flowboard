import React, { useState } from 'react';
import { useWorkspaces, useWorkspaceStore } from '../../hooks/useWorkspaces';
import { ChevronDown, Plus, Users } from 'lucide-react';
import { WorkspaceSettingsModal } from './WorkspaceSettingsModal';

export const WorkspaceSwitcher = () => {
  const { data: workspaces, isLoading, createWorkspace } = useWorkspaces();
  const { activeWorkspaceId, setActiveWorkspaceId } = useWorkspaceStore();
  const [isOpen, setIsOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const activeWorkspace = workspaces?.find(w => w.id === activeWorkspaceId) || workspaces?.[0];

  React.useEffect(() => {
    if (workspaces && workspaces.length > 0 && !activeWorkspaceId) {
      setActiveWorkspaceId(workspaces[0].id);
    }
  }, [workspaces, activeWorkspaceId, setActiveWorkspaceId]);

  const handleCreate = () => {
    const name = prompt('New Workspace Name:');
    if (name) {
      createWorkspace({ name });
      setIsOpen(false);
    }
  };

  if (isLoading) return <div className="h-10 m-4 animate-pulse bg-gray-200 rounded"></div>;

  return (
    <>
      <div className="relative mx-2 my-2">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between p-2 rounded-md hover:bg-gray-200 transition-colors"
        >
          <div className="flex items-center space-x-2 truncate">
            <div className="h-6 w-6 rounded bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
              {activeWorkspace?.name?.charAt(0).toUpperCase()}
            </div>
            <span className="font-semibold text-gray-900 truncate">{activeWorkspace?.name}</span>
          </div>
          <ChevronDown size={16} className="text-gray-500" />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 overflow-hidden">
            <ul className="max-h-60 overflow-y-auto py-1">
              {workspaces?.map(w => (
                <li key={w.id}>
                  <button
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-indigo-50 ${activeWorkspaceId === w.id ? 'bg-indigo-50 font-medium text-indigo-700' : 'text-gray-700'}`}
                    onClick={() => {
                      setActiveWorkspaceId(w.id);
                      setIsOpen(false);
                    }}
                  >
                    {w.name}
                  </button>
                </li>
              ))}
            </ul>
            <div className="border-t border-gray-100">
              <button 
                onClick={handleCreate}
                className="w-full flex items-center px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
              >
                <Plus size={16} className="mr-2" />
                Create Workspace
              </button>
              <button 
                onClick={() => {
                  setShowSettings(true);
                  setIsOpen(false);
                }}
                className="w-full flex items-center px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
              >
                <Users size={16} className="mr-2" />
                Manage Members
              </button>
            </div>
          </div>
        )}
      </div>

      {showSettings && activeWorkspace && (
        <WorkspaceSettingsModal 
          workspace={activeWorkspace} 
          onClose={() => setShowSettings(false)} 
        />
      )}
    </>
  );
};
