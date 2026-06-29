import React, { useState } from 'react';
import { TaskList } from '../../components/tasks/TaskList';
import { TaskQuickAdd } from '../../components/tasks/TaskQuickAdd';
import { TaskDetail } from '../../components/tasks/TaskDetail';
import type { TaskItemProps } from '../../components/tasks/TaskItem';
import { useTasks } from '../../hooks/useTasks';
import { useProjects } from '../../hooks/useProjects';

export const Inbox = () => {
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  // We fetch global tasks for the inbox
  const { data: tasks, isLoading, createTask, updateTask, reorderTasks } = useTasks('global');
  
  // We need a project ID to create a task, so we grab the first available project.
  // In a full implementation, you might have a dedicated 'Inbox' project.
  const { data: projects } = useProjects();
  const defaultProjectId = projects?.[0]?.id;

  const handleToggle = (id: string, completed: boolean) => {
    updateTask({ id, status: completed ? 'DONE' : 'TODO' });
  };

  const handleAdd = (title: string) => {
    if (!defaultProjectId) {
      alert("No project available to create a task in. Please create a project first.");
      return;
    }
    createTask({ title, projectId: defaultProjectId, status: 'TODO', priority: 'MEDIUM' });
  };

  const handleReorder = (reorderedTasks: TaskItemProps['task'][]) => {
    if (!defaultProjectId) return;
    const updates = reorderedTasks.map((t, index) => ({ id: t.id, position: index }));
    reorderTasks(updates);
  };

  const selectedTask = tasks?.find(t => t.id === selectedTaskId) || null;

  return (
    <div className="max-w-3xl mx-auto px-6 py-8 relative">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">Inbox</h1>
        <p className="text-[var(--text-secondary)] mt-1">Capture tasks before organizing them.</p>
      </div>

      <div className="bg-[var(--bg-surface)] rounded-xl border border-[var(--border-default)] shadow-sm overflow-hidden">
        <div className="p-4 border-b border-[var(--border-default)] bg-[var(--bg-subtle)]/50">
          <TaskQuickAdd onAdd={handleAdd} placeholder="What needs to be done?" />
        </div>
        
        <div className="p-2">
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
