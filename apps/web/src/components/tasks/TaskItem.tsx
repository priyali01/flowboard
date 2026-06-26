import React from 'react';
import { cn } from '../../lib/utils';
import { GripVertical, MoreHorizontal, Calendar as CalendarIcon } from 'lucide-react';
import { Checkbox } from '../ui/checkbox';
import { Badge } from '../ui/badge';
import { format, isPast, isToday } from 'date-fns';

export interface TaskItemProps {
  task: {
    id: string;
    title: string;
    status: 'TODO' | 'IN_PROGRESS' | 'DONE';
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
    dueDate?: string | null;
    labels?: { name: string; color: string }[];
  };
  onToggle: (id: string, completed: boolean) => void;
  onClick?: (id: string) => void;
}

export const TaskItem = ({ task, onToggle, onClick }: TaskItemProps) => {
  const isCompleted = task.status === 'DONE';

  const priorityColors = {
    LOW: 'bg-gray-400',
    MEDIUM: 'bg-blue-500',
    HIGH: 'bg-orange-500',
    URGENT: 'bg-red-500',
  };

  const renderDueDate = () => {
    if (!task.dueDate) return null;
    const date = new Date(task.dueDate);
    const overdue = isPast(date) && !isToday(date) && !isCompleted;
    
    return (
      <div className={cn(
        "flex items-center text-xs font-medium mr-3",
        overdue ? "text-red-600" : isToday(date) ? "text-amber-600" : "text-[var(--text-secondary)]"
      )}>
        {isToday(date) ? 'Today' : format(date, 'MMM d')}
      </div>
    );
  };

  return (
    <div 
      onClick={() => onClick?.(task.id)}
      className={cn(
        "group flex items-center py-2 px-1 border-b border-[var(--border-default)] hover:bg-[var(--bg-subtle)] transition-colors cursor-pointer",
        isCompleted && "opacity-60"
      )}
    >
      <div className="text-[var(--text-secondary)] opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing px-1 mr-1">
        <GripVertical className="h-4 w-4" />
      </div>
      
      <div className="mr-3" onClick={(e) => e.stopPropagation()}>
        <Checkbox 
          checked={isCompleted} 
          onCheckedChange={(checked) => onToggle(task.id, checked)} 
        />
      </div>

      <div className={cn(
        "flex-1 text-sm font-medium transition-all",
        isCompleted ? "text-[var(--text-secondary)] line-through" : "text-[var(--text-primary)]"
      )}>
        {task.title}
      </div>

      <div className="flex items-center shrink-0 ml-4">
        {task.labels?.slice(0, 2).map((label, i) => (
          <Badge key={i} variant="secondary" className="mr-2 text-[10px] py-0 font-medium">
            {label.name}
          </Badge>
        ))}
        {task.labels && task.labels.length > 2 && (
          <span className="text-xs text-[var(--text-secondary)] mr-2">+{task.labels.length - 2}</span>
        )}

        {renderDueDate()}

        <div className="w-6 flex items-center justify-center">
          <div className={cn("w-2 h-2 rounded-full", priorityColors[task.priority])} />
        </div>

        <button className="opacity-0 group-hover:opacity-100 p-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--border-default)] rounded transition-all ml-1">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
