import React, { useState } from 'react';
import { X, Play, Trash2, Plus } from 'lucide-react';
import { useTemplates } from '../../hooks/useTemplates';
import { useWorkspaceStore } from '../../hooks/useWorkspaces';
import { useProjects } from '../../hooks/useProjects';

interface Props {
  onClose: () => void;
}

export const TemplatesModal: React.FC<Props> = ({ onClose }) => {
  const { activeWorkspaceId } = useWorkspaceStore();
  const { data: templates = [], deleteTemplate, instantiateTemplate, createTemplate } = useTemplates(activeWorkspaceId || undefined);
  const { data: projects = [] } = useProjects(activeWorkspaceId || undefined);
  
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [selectedProject, setSelectedProject] = useState('');

  const handleInstantiate = (templateId: string) => {
    if (!selectedProject) return alert('Select a project first');
    instantiateTemplate.mutate({ id: templateId, projectId: selectedProject }, {
      onSuccess: () => {
        onClose();
      }
    });
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    createTemplate.mutate({ title: newTitle, priority: 'MEDIUM', labelIds: [] }, {
      onSuccess: () => {
        setNewTitle('');
        setShowCreate(false);
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Workspace Templates</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
            <X size={20} className="text-gray-500" />
          </button>
        </div>
        
        <div className="p-4 flex-1 overflow-y-auto">
          {!showCreate ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <select 
                  className="px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  value={selectedProject}
                  onChange={e => setSelectedProject(e.target.value)}
                >
                  <option value="">Select project to instantiate into...</option>
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
                <button 
                  onClick={() => setShowCreate(true)}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400"
                >
                  <Plus size={16} /> New Template
                </button>
              </div>

              {templates.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No templates found in this workspace.</div>
              ) : (
                <div className="space-y-2">
                  {templates.map((template: any) => (
                    <div key={template.id} className="flex items-center justify-between p-3 border dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-750">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{template.title}</h4>
                        <span className="text-xs text-gray-500">{template.priority} Priority</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleInstantiate(template.id)}
                          disabled={!selectedProject}
                          className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-full disabled:opacity-50"
                          title="Instantiate Task"
                        >
                          <Play size={18} />
                        </button>
                        <button 
                          onClick={() => deleteTemplate.mutate(template.id)}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full"
                          title="Delete Template"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Template Title
                </label>
                <input
                  autoFocus
                  type="text"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g., Weekly TPS Report"
                  required
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button 
                  type="button" 
                  onClick={() => setShowCreate(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={createTemplate.isPending || !newTitle.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  Create
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
