import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import type { Task } from '../../api/client';
import { useProjects } from '../../hooks/useProjects';
import { TaskList } from '../../components/tasks/TaskList';
import { TaskDetailPanel } from '../../components/tasks/TaskDetailPanel';
import { Search, Filter } from 'lucide-react';

export const ProjectView = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { data: projects } = useProjects();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const [filters, setFilters] = useState<Record<string, string>>({});
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const timeout = setTimeout(() => {
      setFilters(prev => ({ ...prev, search: searchTerm }));
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchTerm]);
  
  const project = projects?.find(p => p.id === projectId);

  if (!projectId) return <div>No project selected</div>;

  return (
    <div className="p-8 h-full bg-white relative">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        {project?.name || 'Loading project...'}
      </h1>
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search tasks..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:ring-indigo-500 focus:border-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-gray-400" />
          <select
            className="border-gray-300 rounded-md text-sm shadow-sm focus:ring-indigo-500 focus:border-indigo-500 py-2 pl-3 pr-8"
            value={filters.status || ''}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
          >
            <option value="">All Statuses</option>
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
          </select>
          <select
            className="border-gray-300 rounded-md text-sm shadow-sm focus:ring-indigo-500 focus:border-indigo-500 py-2 pl-3 pr-8"
            value={filters.priority || ''}
            onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
          >
            <option value="">All Priorities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </select>
        </div>
      </div>
      
      <TaskList projectId={projectId} onSelectTask={setSelectedTask} filters={filters} />

      {selectedTask && (
        <TaskDetailPanel 
          task={selectedTask} 
          projectId={projectId} 
          onClose={() => setSelectedTask(null)} 
        />
      )}
    </div>
  );
};
