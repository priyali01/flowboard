import React, { useState } from 'react';
import { TaskList } from '../../components/tasks/TaskList';
import { TaskQuickAdd } from '../../components/tasks/TaskQuickAdd';
import type { TaskItemProps } from '../../components/tasks/TaskItem';

// Temporary mock data to see the UI
const initialTasks: TaskItemProps['task'][] = [
  {
    id: '1',
    title: 'Review PR for the new navigation bar',
    status: 'TODO',
    priority: 'HIGH',
    dueDate: new Date().toISOString(),
    labels: [{ name: 'Frontend', color: 'blue' }, { name: 'Review', color: 'purple' }]
  },
  {
    id: '2',
    title: 'Update documentation for API v2',
    status: 'IN_PROGRESS',
    priority: 'MEDIUM',
    dueDate: new Date(Date.now() + 86400000).toISOString(), // tomorrow
    labels: [{ name: 'Docs', color: 'gray' }]
  },
  {
    id: '3',
    title: 'Fix styling issues in dark mode',
    status: 'DONE',
    priority: 'LOW',
  }
];

export const Inbox = () => {
  const [tasks, setTasks] = useState(initialTasks);

  const handleToggle = (id: string, completed: boolean) => {
    setTasks(tasks.map(t => 
      t.id === id ? { ...t, status: completed ? 'DONE' : 'TODO' } : t
    ));
  };

  const handleAdd = (title: string) => {
    const newTask: TaskItemProps['task'] = {
      id: Date.now().toString(),
      title,
      status: 'TODO',
      priority: 'MEDIUM',
    };
    setTasks([newTask, ...tasks]);
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">Inbox</h1>
        <p className="text-[var(--text-secondary)] mt-1">Capture tasks before organizing them.</p>
      </div>

      <div className="bg-[var(--bg-surface)] rounded-xl border border-[var(--border-default)] shadow-sm overflow-hidden">
        <div className="p-4 border-b border-[var(--border-default)] bg-[var(--bg-subtle)]/50">
          <TaskQuickAdd onAdd={handleAdd} placeholder="What needs to be done?" />
        </div>
        
        <div className="p-2">
          <TaskList 
            tasks={tasks} 
            onToggle={handleToggle}
            onClick={(id) => console.log('Clicked task', id)}
          />
        </div>
      </div>
    </div>
  );
};
