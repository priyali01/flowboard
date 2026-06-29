import React, { useState } from 'react';
import { TaskList } from '../../components/tasks/TaskList';
import { TaskDetail } from '../../components/tasks/TaskDetail';
import type { TaskItemProps } from '../../components/tasks/TaskItem';
import { useTasks } from '../../hooks/useTasks';
import { useProjects } from '../../hooks/useProjects';
import { useAuthStore } from '../../stores/authStore';
import { Folder, Calendar, Clock, CheckCircle, TrendingUp, Flag, Tag, Bell, Send } from 'lucide-react';
import { cn } from '../../lib/utils';

const WavyCard = ({ title, value, subtitle, icon: Icon, color, waveColor }: any) => {
  return (
    <div className="relative bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl p-5 shadow-soft border border-white/60 dark:border-gray-700/50 overflow-hidden group hover:-translate-y-1 transition-transform">
      <div className="flex items-center gap-4 mb-4 z-10 relative">
        <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center", color.bg, color.text)}>
          <Icon size={20} />
        </div>
        <div>
          <h3 className="text-[13px] font-bold text-gray-400 dark:text-gray-500">{title}</h3>
        </div>
      </div>
      <div className="z-10 relative">
        <div className="text-3xl font-black text-[var(--text-primary)] mb-1">{value}</div>
        <div className="text-[11px] font-bold text-gray-400">{subtitle}</div>
      </div>
      
      {/* Wavy Background (CSS generated or simplified SVG) */}
      <div className="absolute bottom-0 left-0 right-0 h-16 opacity-30 pointer-events-none transition-transform group-hover:scale-105" 
           style={{
             backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'%3E%3Cpath fill='${encodeURIComponent(waveColor)}' fill-opacity='1' d='M0,256L48,229.3C96,203,192,149,288,154.7C384,160,480,224,576,218.7C672,213,768,139,864,128C960,117,1056,171,1152,197.3C1248,224,1344,224,1392,224L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z'%3E%3C/path%3E%3C/svg%3E")`,
             backgroundSize: 'cover',
             backgroundPosition: 'bottom'
           }}
      />
    </div>
  );
};

export const Inbox = () => {
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const { user } = useAuthStore();

  const { data: tasks, isLoading, createTask, updateTask, reorderTasks } = useTasks('global');
  const { data: projects } = useProjects();
  const defaultProjectId = projects?.[0]?.id;

  const handleToggle = (id: string, completed: boolean) => {
    updateTask({ id, status: completed ? 'DONE' : 'TODO' });
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    if (!defaultProjectId) {
      alert("No project available to create a task in.");
      return;
    }
    createTask({ title: newTaskTitle, projectId: defaultProjectId, status: 'TODO', priority: 'MEDIUM' });
    setNewTaskTitle('');
  };

  const handleReorder = (reorderedTasks: TaskItemProps['task'][]) => {
    if (!defaultProjectId) return;
    const updates = reorderedTasks.map((t, index) => ({ id: t.id, position: index }));
    reorderTasks(updates);
  };

  const selectedTask = tasks?.find(t => t.id === selectedTaskId) || null;

  return (
    <div className="w-full relative">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-[var(--text-primary)] tracking-tight">Good Morning, {user?.name?.split(' ')[0] || 'There'}! 👋</h1>
          <p className="text-[var(--text-secondary)] font-medium mt-1">Let's make today productive</p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-5 gap-4 mb-8">
        <WavyCard 
          title="Total Tasks" 
          value={tasks?.length || 0} 
          subtitle="All Time" 
          icon={Folder} 
          color={{ bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-600' }} 
          waveColor="#9333ea" 
        />
        <WavyCard 
          title="Today" 
          value={tasks?.filter(t => t.dueDate && new Date(t.dueDate).toDateString() === new Date().toDateString()).length || 0} 
          subtitle="Due Today" 
          icon={Calendar} 
          color={{ bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-500' }} 
          waveColor="#f97316" 
        />
        <WavyCard 
          title="In Progress" 
          value={tasks?.filter(t => t.status !== 'DONE').length || 0} 
          subtitle="Pending" 
          icon={Clock} 
          color={{ bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-500' }} 
          waveColor="#ef4444" 
        />
        <WavyCard 
          title="Completed" 
          value={tasks?.filter(t => t.status === 'DONE').length || 0} 
          subtitle="All Time" 
          icon={CheckCircle} 
          color={{ bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-500' }} 
          waveColor="#10b981" 
        />
        <WavyCard 
          title="Completion Rate" 
          value={`${tasks?.length ? Math.round((tasks.filter(t => t.status === 'DONE').length / tasks.length) * 100) : 0}%`} 
          subtitle="Productivity" 
          icon={TrendingUp} 
          color={{ bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-500' }} 
          waveColor="#3b82f6" 
        />
      </div>

      {/* Quick Add Bar */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-4 shadow-soft border border-white/60 dark:border-gray-700/50 mb-8">
        <form onSubmit={handleAdd}>
          <input 
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="What needs to be done?"
            className="w-full bg-transparent border-none outline-none text-lg font-medium text-[var(--text-primary)] placeholder:text-gray-400 px-2 py-2 mb-4"
          />
          <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-700/50 pt-3">
            <div className="flex items-center gap-2">
              <button type="button" className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <Flag size={14} /> Priority
              </button>
              <button type="button" className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <Calendar size={14} /> Due Date
              </button>
              <button type="button" className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <Folder size={14} /> Project
              </button>
              <button type="button" className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <Tag size={14} /> Labels
              </button>
              <button type="button" className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <Bell size={14} /> Reminder
              </button>
            </div>
            <button type="submit" className="flex items-center px-6 py-2 bg-gradient-to-r from-primary-500 to-purple-500 hover:from-primary-600 hover:to-purple-600 text-white rounded-xl font-bold text-sm shadow-md shadow-primary-500/20 transition-all hover:scale-105 active:scale-95">
              Add Task <Send size={14} className="ml-2" />
            </button>
          </div>
        </form>
      </div>

      {/* Task List Section */}
      <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl p-6 shadow-soft border border-white/60 dark:border-gray-700/50">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-6 border-b border-gray-200 dark:border-gray-700 w-full relative">
            <button className="text-sm font-bold text-primary-600 pb-3 border-b-2 border-primary-600 -mb-[1px]">All</button>
            <button className="text-sm font-bold text-gray-400 pb-3 hover:text-gray-600 transition-colors">Tasks <span className="ml-1 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-md text-xs">3</span></button>
            <button className="text-sm font-bold text-gray-400 pb-3 hover:text-gray-600 transition-colors">Completed</button>
            <button className="text-sm font-bold text-gray-400 pb-3 hover:text-gray-600 transition-colors">Archived</button>
            
            <div className="ml-auto pb-3 flex items-center gap-2 text-xs font-bold text-gray-400">
              Sort: Recently Updated <ChevronDown size={14} />
            </div>
          </div>
        </div>
        
        <div className="min-h-[400px]">
          {isLoading ? (
            <div className="p-8 text-center text-[var(--text-secondary)]">Loading tasks...</div>
          ) : (
            <TaskList 
              tasks={tasks || []} 
              onToggle={handleToggle}
              onClick={(id) => setSelectedTaskId(id)}
              onReorder={handleReorder}
            />
          )}
        </div>
      </div>

      <TaskDetail 
        task={selectedTask}
        isOpen={!!selectedTask}
        onClose={() => setSelectedTaskId(null)}
        onUpdate={(id, updates) => updateTask({ id, ...updates })}
      />
    </div>
  );
};

const ChevronDown = ({ size }: { size: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
);
