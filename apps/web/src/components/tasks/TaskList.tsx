import React from 'react';
import { TaskItem, type TaskItemProps } from './TaskItem';

export interface TaskListProps {
  tasks: TaskItemProps['task'][];
  onToggle: (id: string, completed: boolean) => void;
  onClick?: (id: string) => void;
}

export const TaskList = ({ tasks, onToggle, onClick }: TaskListProps) => {
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-[var(--text-secondary)]">
        <div className="w-24 h-24 mb-4 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay" />
        <p className="text-sm font-medium">No tasks found in this view.</p>
        <p className="text-xs">Create a task to get started.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {tasks.map(task => (
        <TaskItem 
          key={task.id} 
          task={task} 
          onToggle={onToggle} 
          onClick={onClick} 
        />
      ))}
    </div>
  );
};
