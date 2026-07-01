import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar as CalendarIcon, Flag, CheckCircle2, Circle, MessageSquare, Activity, Trash2 } from 'lucide-react';
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
  onDelete?: (id: string) => void;
}

type TabType = 'comments' | 'activity';

export const TaskDetail = ({ task, isOpen, onClose, onUpdate, onDelete }: TaskDetailProps) => {
  const [title, setTitle] = useState(task?.title || '');
  const [activeTab, setActiveTab] = useState<TabType>('comments');
  const [localDueDate, setLocalDueDate] = useState<string>(task?.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '');

  // Sync internal state if task changes from outside
  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setLocalDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '');
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-5xl bg-[var(--bg-app)] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header / Actions Bar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-default)] bg-[var(--bg-surface)]">
              <div className="flex items-center gap-3">
                <Button 
                  variant="outline" 
                  size="sm"
                  className={cn("gap-2", isCompleted && "bg-green-50 text-green-700 border-green-200")}
                  onClick={() => onUpdate(task.id, { status: isCompleted ? 'TODO' : 'DONE' })}
                >
                  {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
                  {isCompleted ? "Completed" : "Mark Complete"}
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="gap-2 text-[var(--text-secondary)]" onClick={() => onUpdate(task.id, { status: 'ARCHIVED' })}>
                  <Activity className="h-4 w-4" />
                  Archive
                </Button>
                {onDelete && (
                  <Button variant="ghost" size="sm" className="gap-2 text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => { onDelete(task.id); onClose(); }}>
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                )}
                <div className="w-[1px] h-4 bg-[var(--border-default)] mx-1" />
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="h-5 w-5 text-[var(--text-secondary)]" />
                </Button>
              </div>
            </div>

            <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
              {/* Left Column (Main Content) */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8 flex flex-col gap-8 md:border-r border-[var(--border-default)]">
                <div>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onBlur={handleTitleBlur}
                    className="text-3xl font-bold bg-transparent border-none outline-none text-[var(--text-primary)] placeholder:text-[var(--text-disabled)] w-full"
                    placeholder="Task title"
                  />
                </div>

                <div className="flex flex-col gap-3">
                  <h3 className="text-sm font-semibold text-[var(--text-primary)]">Description</h3>
                  <textarea 
                    className="w-full min-h-[120px] bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-xl p-4 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-disabled)] outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all resize-y"
                    placeholder="Add a more detailed description..."
                    defaultValue=""
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Checklist Mock */}
                  <div className="flex flex-col gap-3">
                    <h3 className="text-sm font-semibold text-[var(--text-primary)] flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[var(--text-secondary)]" />
                      Checklist
                    </h3>
                    <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-xl p-4 flex flex-col gap-3">
                      <div className="flex items-center gap-3 opacity-60">
                        <input type="checkbox" className="rounded border-gray-300" />
                        <span className="text-sm">Research implementation</span>
                      </div>
                      <Button variant="ghost" size="sm" className="justify-start text-[var(--text-secondary)] -ml-2">
                        + Add item
                      </Button>
                    </div>
                  </div>

                  {/* Files Mock */}
                  <div className="flex flex-col gap-3">
                    <h3 className="text-sm font-semibold text-[var(--text-primary)] flex items-center gap-2">
                      <Activity className="h-4 w-4 text-[var(--text-secondary)]" />
                      Files
                    </h3>
                    <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center gap-2 hover:bg-gray-50 transition-colors cursor-pointer">
                      <div className="h-8 w-8 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center">
                        +
                      </div>
                      <span className="text-sm text-[var(--text-secondary)]">Drop files to attach</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex items-center gap-6 border-b border-[var(--border-default)] mb-6">
                    <button 
                      onClick={() => setActiveTab('comments')}
                      className={cn(
                        "pb-3 text-sm font-medium flex items-center gap-2 transition-colors relative",
                        activeTab === 'comments' ? "text-primary-600" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                      )}
                    >
                      <MessageSquare className="h-4 w-4" />
                      Comments
                      {activeTab === 'comments' && (
                        <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary-600" />
                      )}
                    </button>
                    <button 
                      onClick={() => setActiveTab('activity')}
                      className={cn(
                        "pb-3 text-sm font-medium flex items-center gap-2 transition-colors relative",
                        activeTab === 'activity' ? "text-primary-600" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                      )}
                    >
                      <Activity className="h-4 w-4" />
                      Activity
                      {activeTab === 'activity' && (
                        <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary-600" />
                      )}
                    </button>
                  </div>
                  
                  <div className="min-h-[200px]">
                    {activeTab === 'comments' ? <CommentThread taskId={task.id} /> : <ActivityFeed taskId={task.id} />}
                  </div>
                </div>
              </div>

              {/* Right Column (Properties Sidebar) */}
              <div className="w-full md:w-80 bg-[var(--bg-surface)] p-6 md:p-8 flex flex-col gap-8 overflow-y-auto">
                <div className="flex flex-col gap-6">
                  <h4 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Properties</h4>
                  
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs text-[var(--text-secondary)] flex items-center gap-2">
                        <Activity className="h-3 w-3" /> Status
                      </label>
                      <select 
                        className="w-full bg-[var(--bg-app)] border border-[var(--border-default)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] outline-none focus:ring-2 focus:ring-primary-500/20"
                        value={task.status}
                        onChange={(e) => onUpdate(task.id, { status: e.target.value })}
                      >
                        <option value="TODO">To Do</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="DONE">Done</option>
                        <option value="ARCHIVED">Archived</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-xs text-[var(--text-secondary)] flex items-center gap-2">
                        <Flag className="h-3 w-3" /> Priority
                      </label>
                      <select 
                        className="w-full bg-[var(--bg-app)] border border-[var(--border-default)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] outline-none focus:ring-2 focus:ring-primary-500/20"
                        value={task.priority}
                        onChange={(e) => onUpdate(task.id, { priority: e.target.value })}
                      >
                        <option value="LOW">Low</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HIGH">High</option>
                        <option value="URGENT">Urgent</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-xs text-[var(--text-secondary)] flex items-center gap-2">
                        <CalendarIcon className="h-3 w-3" /> Due Date
                      </label>
                      <input 
                        type="date"
                        className="w-full bg-[var(--bg-app)] border border-[var(--border-default)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] outline-none focus:ring-2 focus:ring-primary-500/20 cursor-pointer"
                        value={localDueDate}
                        onChange={(e) => {
                          const val = e.target.value;
                          setLocalDueDate(val);
                          const newDate = val ? new Date(val).toISOString() : null;
                          onUpdate(task.id, { dueDate: newDate });
                        }}
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-xs text-[var(--text-secondary)] flex items-center gap-2">
                        <Circle className="h-3 w-3" /> Assignee
                      </label>
                      <button className="w-full flex items-center justify-between bg-[var(--bg-app)] border border-[var(--border-default)] rounded-lg px-3 py-2 text-sm text-[var(--text-secondary)] hover:bg-gray-50 transition-colors text-left">
                        <div className="flex items-center gap-2">
                          <div className="h-5 w-5 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-500">?</div>
                          Unassigned
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
