import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import type { TaskItemProps } from '../../components/tasks/TaskItem';
import { useProjects } from '../../hooks/useProjects';
import { TaskList } from '../../components/tasks/TaskList';
import { TaskDetail } from '../../components/tasks/TaskDetail';
import { TaskQuickAdd } from '../../components/tasks/TaskQuickAdd';
import { useTasks } from '../../hooks/useTasks';
import { Search, Filter, Hash, Edit2, Trash2, Check, X } from 'lucide-react';
import { TaskListSkeleton } from '../../components/common/SkeletonLoader';
import toast from 'react-hot-toast';

export const ProjectView = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { data: projects, updateProject, deleteProject } = useProjects();
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const [filters, setFilters] = useState<Record<string, string>>({});
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editTitleValue, setEditTitleValue] = useState('');
  
  const [sortBy, setSortBy] = useState<'default' | 'dueDate' | 'priority' | 'alphabetical'>('default');

  useEffect(() => {
    const timeout = setTimeout(() => {
      setFilters(prev => ({ ...prev, search: searchTerm }));
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchTerm]);
  
  const project = projects?.find(p => p.id === projectId);
  
  useEffect(() => {
    if (project?.name) setEditTitleValue(project.name);
  }, [project?.name]);
  
  const { data: tasks, isLoading, createTask, updateTask, reorderTasks, deleteTask } = useTasks(projectId || 'global', filters);

  const processedTasks = useMemo(() => {
    if (!tasks) return [];
    let result = [...tasks];
    
    if (sortBy === 'dueDate') {
      result.sort((a, b) => {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      });
    } else if (sortBy === 'priority') {
      const pMap = { URGENT: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
      result.sort((a, b) => (pMap[b.priority as keyof typeof pMap] || 0) - (pMap[a.priority as keyof typeof pMap] || 0));
    } else if (sortBy === 'alphabetical') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      // default: position
      result.sort((a, b) => (a.position || 0) - (b.position || 0));
    }
    return result;
  }, [tasks, sortBy]);

  const handleToggle = (id: string, completed: boolean) => {
    updateTask({ id, status: completed ? 'DONE' : 'TODO' });
  };

  const handleReorder = (reorderedTasks: TaskItemProps['task'][]) => {
    // Only allow reordering if we are in default sort mode
    if (sortBy !== 'default') {
      toast.error("Can't reorder while sorted by " + sortBy);
      return;
    }
    const updates = reorderedTasks.map((t, index) => ({ id: t.id, position: index }));
    reorderTasks(updates);
  };

  const handleAdd = (title: string) => {
    if (!projectId) return;
    createTask({ title, projectId, status: 'TODO', priority: 'MEDIUM' });
  };

  const selectedTask = tasks?.find(t => t.id === selectedTaskId) || null;

  const handleRename = async () => {
    if (!project || editTitleValue.trim() === '' || editTitleValue === project.name) {
      setIsEditingTitle(false);
      return;
    }
    try {
      await updateProject({ id: project.id, name: editTitleValue.trim() });
      toast.success('Project renamed');
      setIsEditingTitle(false);
    } catch (err) {
      toast.error('Failed to rename project');
    }
  };

  const handleDeleteProject = async () => {
    if (!project) return;
    if (window.confirm('Are you sure you want to delete this project and all its tasks?')) {
      try {
        await deleteProject(project.id);
        toast.success('Project deleted');
        navigate('/inbox');
      } catch (err) {
        toast.error('Failed to delete project');
      }
    }
  };

  if (!projectId) return <div>No project selected</div>;

  return (
    <div className="pb-8 relative">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <span 
            className="w-4 h-4 rounded-full shadow-sm flex-shrink-0" 
            style={{ backgroundColor: project?.color ? `var(--color-${project.color}-500, ${project.color})` : 'var(--color-gray-500)' }}
          />
          {isEditingTitle ? (
            <div className="flex items-center gap-2 flex-1 max-w-sm">
              <input
                autoFocus
                type="text"
                className="w-full px-2 py-1 text-2xl font-bold bg-[var(--bg-surface)] border border-[var(--border-focus)] rounded focus:outline-none focus:ring-2 focus:ring-primary-500 text-[var(--text-primary)]"
                value={editTitleValue}
                onChange={(e) => setEditTitleValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleRename();
                  if (e.key === 'Escape') {
                    setEditTitleValue(project?.name || '');
                    setIsEditingTitle(false);
                  }
                }}
              />
              <button onClick={handleRename} className="p-1.5 text-green-600 hover:bg-green-50 rounded"><Check size={18} /></button>
              <button onClick={() => { setEditTitleValue(project?.name || ''); setIsEditingTitle(false); }} className="p-1.5 text-gray-500 hover:bg-gray-100 rounded"><X size={18} /></button>
            </div>
          ) : (
            <h1 
              className="text-3xl font-bold text-[var(--text-primary)] cursor-pointer hover:opacity-80 transition-opacity flex items-center gap-2 group"
              onClick={() => setIsEditingTitle(true)}
            >
              {project?.name || 'Loading project...'}
              <Edit2 size={16} className="opacity-0 group-hover:opacity-100 text-gray-400" />
            </h1>
          )}
        </div>
        
        <button 
          onClick={handleDeleteProject}
          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1 text-sm font-medium"
        >
          <Trash2 size={16} /> <span className="hidden sm:inline">Delete Project</span>
        </button>
      </div>
      
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-disabled)]" size={18} />
          <input
            type="text"
            placeholder="Search tasks..."
            className="w-full pl-10 pr-4 py-2 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-lg shadow-sm text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-[var(--text-primary)] placeholder-[var(--text-disabled)]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-[var(--text-secondary)]" />
          <select
            className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-lg text-sm shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 py-2 pl-3 pr-8 text-[var(--text-primary)]"
            value={filters.status || ''}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
          >
            <option value="">All Statuses</option>
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
          </select>
          <select
            className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-lg text-sm shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 py-2 pl-3 pr-8 text-[var(--text-primary)]"
            value={filters.priority || ''}
            onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
          >
            <option value="">All Priorities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </select>
          <select
            className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-lg text-sm shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 py-2 pl-3 pr-8 text-[var(--text-primary)]"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
          >
            <option value="default">Default Sort</option>
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
            <option value="alphabetical">Alphabetical</option>
          </select>
        </div>
      </div>
      
      <div className="bg-[var(--bg-surface)] rounded-xl border border-[var(--border-default)] shadow-sm overflow-hidden">
        <div className="p-4 border-b border-[var(--border-default)] bg-[var(--bg-subtle)]/50">
          <TaskQuickAdd onAdd={handleAdd} placeholder="Add task to project..." />
        </div>
        <div className="p-2">
          {isLoading ? (
            <TaskListSkeleton />
          ) : processedTasks && processedTasks.length > 0 ? (
            <TaskList 
              tasks={processedTasks} 
              onToggle={handleToggle}
              onClick={(id) => setSelectedTaskId(id)}
              onReorder={handleReorder}
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <Hash className="h-16 w-16 text-[var(--text-disabled)] mb-4 opacity-50" />
              <h3 className="text-lg font-medium text-[var(--text-primary)]">No tasks found</h3>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">
                {Object.keys(filters).length > 0 ? "Try clearing your filters." : "Create a new task to get started."}
              </p>
            </div>
          )}
        </div>
      </div>

      <TaskDetail 
        task={selectedTask}
        isOpen={!!selectedTask}
        onClose={() => setSelectedTaskId(null)}
        onUpdate={(id, updates) => updateTask({ id, ...updates })}
      onDelete={(id) => { const task = tasks?.find(t => t.id === id); if (task) deleteTask({ id, projectId: task.projectId }); }}
      />
    </div>
  );
};
