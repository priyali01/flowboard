import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar as CalendarIcon, Flag, CheckCircle2, Circle, MessageSquare, Activity } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';
import type { TaskItemProps } from './TaskItem';
import { CommentThread } from '../comments/CommentThread';
import { ActivityFeed } from '../activity/ActivityFeed';

export interface TaskDetailProps {
  task: TaskItemProps['task'] | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (id: string, updates: any) => void;
}

type TabType = 'comments' | 'activity';

export const TaskDetail = ({ task, isOpen, onClose, onUpdate }: TaskDetailProps) => {
  const [title, setTitle] = useState(task?.title || '');
  const [activeTab, setActiveTab] = useState<TabType>('comments');

  // Sync internal state if task changes from outside
  useEffect(() => {
    if (task) {
      setTitle(task.title);
    }
  }, [task]);

  if (!task) return null;

  const handleTitleBlur = () => {
    if (title !== task.title) {
      onUpdate(task.id, { title });
    }
  };

  const isCompleted = task.status === 'DONE';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: '100%', opacity: 0.5 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0.5 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed top-0 right-0 h-full w-full max-w-md bg-[var(--bg-app)] border-l border-[var(--border-default)] shadow-2xl z-50 flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-[var(--border-default)]">
            <Button variant="ghost" className="h-8 w-8 p-0" onClick={() => onUpdate(task.id, { status: isCompleted ? 'TODO' : 'DONE' })}>
              {isCompleted ? <CheckCircle2 className="h-5 w-5 text-indigo-500" /> : <Circle className="h-5 w-5 text-[var(--text-secondary)]" />}
            </Button>
            <Button variant="ghost" className="h-8 w-8 p-0" onClick={onClose}>
              <X className="h-5 w-5 text-[var(--text-secondary)]" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleTitleBlur}
              className="text-2xl font-semibold bg-transparent border-none outline-none text-[var(--text-primary)] placeholder:text-[var(--text-disabled)] w-full"
              placeholder="Task title"
            />

            {/* Properties Grid */}
            <div className="grid grid-cols-[100px_1fr] gap-y-4 items-center text-sm">
              <div className="text-[var(--text-secondary)] flex items-center gap-2">
                <Flag className="h-4 w-4" />
                Priority
              </div>
              <div>
                <select 
                  className="bg-transparent text-[var(--text-primary)] font-medium outline-none cursor-pointer"
                  value={task.priority}
                  onChange={(e) => onUpdate(task.id, { priority: e.target.value })}
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent</option>
                </select>
              </div>

              <div className="text-[var(--text-secondary)] flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                Due Date
              </div>
              <div className="text-[var(--text-secondary)] font-medium cursor-pointer hover:text-[var(--text-primary)] transition-colors">
                {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}
              </div>
            </div>

            <hr className="border-[var(--border-default)]" />

            {/* Placeholder for Description Editor */}
            <div className="flex flex-col gap-2 shrink-0">
              <span className="text-sm font-semibold text-[var(--text-primary)]">Description</span>
              <textarea 
                className="w-full h-24 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-md p-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-disabled)] outline-none focus:ring-1 focus:ring-[var(--border-focus)] transition-all resize-none"
                placeholder="Add a more detailed description..."
                defaultValue=""
              />
            </div>

            {/* Tabs for Comments and Activity */}
            <div className="flex-1 flex flex-col min-h-[300px]">
              <div className="flex items-center gap-6 border-b border-[var(--border-default)] mb-4">
                <button 
                  onClick={() => setActiveTab('comments')}
                  className={cn(
                    "pb-3 text-sm font-medium flex items-center gap-2 transition-colors relative",
                    activeTab === 'comments' 
                      ? "text-primary-600" 
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  )}
                >
                  <MessageSquare className="h-4 w-4" />
                  Comments
                  {activeTab === 'comments' && (
                    <motion.div layoutId="activeTabIndicator" className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary-600" />
                  )}
                </button>
                <button 
                  onClick={() => setActiveTab('activity')}
                  className={cn(
                    "pb-3 text-sm font-medium flex items-center gap-2 transition-colors relative",
                    activeTab === 'activity' 
                      ? "text-primary-600" 
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  )}
                >
                  <Activity className="h-4 w-4" />
                  Activity
                  {activeTab === 'activity' && (
                    <motion.div layoutId="activeTabIndicator" className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary-600" />
                  )}
                </button>
              </div>
              
              <div className="flex-1 overflow-hidden">
                {activeTab === 'comments' ? (
                  <CommentThread taskId={task.id} />
                ) : (
                  <ActivityFeed taskId={task.id} />
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
