import React, { useState, useEffect } from 'react';
import { X, Check, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useProjects } from '../../hooks/useProjects';
import { useTasks } from '../../hooks/useTasks';

export const CreateTaskModal = ({ onClose }: { onClose: () => void }) => {
  const [title, setTitle] = useState('');
  const [projectId, setProjectId] = useState('');
  
  const { data: projects, isLoading: projectsLoading } = useProjects();
  const { createTask } = useTasks(projectId || 'global');
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (projects && projects.length > 0 && !projectId) {
      setProjectId(projects[0].id);
    }
  }, [projects, projectId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !projectId) return;
    
    setIsSubmitting(true);
    try {
      await createTask({
        title: title.trim(),
        projectId,
        status: 'TODO',
        priority: 'MEDIUM'
      });
      toast.success('Task created!');
      onClose();
    } catch (err) {
      console.error(err);
      toast.error('Failed to create task. Try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800">Create New Task</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
            <input
              autoFocus
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Project</label>
            {projectsLoading ? (
              <div className="h-10 animate-pulse bg-gray-100 rounded-xl w-full"></div>
            ) : (
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all bg-white"
              >
                {projects?.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            )}
          </div>
          
          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim() || !projectId || isSubmitting}
              className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-[#5961F9] via-[#A855F7] to-[#F97316] hover:opacity-90 text-white rounded-xl text-sm font-bold shadow-md shadow-primary-500/20 hover:shadow-lg transition-all disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
