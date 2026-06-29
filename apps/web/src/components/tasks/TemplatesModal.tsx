import React, { useState } from 'react';
import { X, Play, Trash2, Plus, LayoutTemplate } from 'lucide-react';
import { useTemplates } from '../../hooks/useTemplates';
import { useWorkspaceStore } from '../../hooks/useWorkspaces';
import { useProjects } from '../../hooks/useProjects';
import * as Dialog from '@radix-ui/react-dialog';
import { motion, AnimatePresence } from 'framer-motion';

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
    <Dialog.Root open={true} onOpenChange={(open) => !open && onClose()}>
      <AnimatePresence>
        <Dialog.Portal forceMount>
          <Dialog.Overlay asChild>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            />
          </Dialog.Overlay>
          <Dialog.Content asChild>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="fixed left-[50%] top-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%] bg-[var(--bg-surface)] border border-[var(--border-default)] shadow-xl rounded-xl flex flex-col max-h-[85vh]"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-default)] bg-[var(--bg-subtle)]/50 shrink-0 rounded-t-xl">
                <Dialog.Title className="text-lg font-semibold text-[var(--text-primary)]">Workspace Templates</Dialog.Title>
                <Dialog.Close asChild>
                  <button className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                    <X size={20} />
                  </button>
                </Dialog.Close>
              </div>
              
              <div className="p-6 flex-1 overflow-y-auto">
                {!showCreate ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center bg-[var(--bg-subtle)] p-3 rounded-lg border border-[var(--border-default)]">
                      <select 
                        className="bg-transparent border-none text-sm text-[var(--text-primary)] focus:ring-0 cursor-pointer"
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
                        className="flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
                      >
                        <Plus size={16} /> New
                      </button>
                    </div>

                    {templates.length === 0 ? (
                      <div className="text-center py-12">
                        <LayoutTemplate size={32} className="mx-auto text-[var(--text-disabled)] mb-3 opacity-50" />
                        <p className="text-sm text-[var(--text-secondary)]">No templates found.</p>
                        <p className="text-xs text-[var(--text-disabled)] mt-1">Create reusable tasks for your workspace.</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {templates.map((template: any) => (
                          <div key={template.id} className="flex items-center justify-between p-3 border border-[var(--border-default)] rounded-lg hover:bg-[var(--bg-subtle)] group transition-colors">
                            <div>
                              <h4 className="font-medium text-sm text-[var(--text-primary)]">{template.title}</h4>
                              <span className="text-xs font-medium text-[var(--text-secondary)]">{template.priority} Priority</span>
                            </div>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button 
                                onClick={() => handleInstantiate(template.id)}
                                disabled={!selectedProject}
                                className="p-2 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                title="Instantiate Task"
                              >
                                <Play size={16} />
                              </button>
                              <button 
                                onClick={() => deleteTemplate.mutate(template.id)}
                                className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                                title="Delete Template"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <form onSubmit={handleCreate} className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Template Title</label>
                      <input 
                        type="text" 
                        autoFocus
                        value={newTitle}
                        onChange={e => setNewTitle(e.target.value)}
                        placeholder="e.g. Weekly Report"
                        className="w-full bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-[var(--text-primary)] placeholder-[var(--text-disabled)]"
                      />
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                      <button 
                        type="button" 
                        onClick={() => setShowCreate(false)}
                        className="px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit"
                        disabled={!newTitle.trim()}
                        className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                      >
                        Create
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </Dialog.Content>
        </Dialog.Portal>
      </AnimatePresence>
    </Dialog.Root>
  );
};
