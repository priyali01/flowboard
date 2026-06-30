import { useState } from 'react';
import type { TaskItemProps } from '../../components/tasks/TaskItem';
import { TaskList } from '../../components/tasks/TaskList';
import { TaskDetail } from '../../components/tasks/TaskDetail';
import { TaskListSkeleton } from '../../components/common/SkeletonLoader';
import { CheckCircle2 } from 'lucide-react';
import { useTasks } from '../../hooks/useTasks';

export const Today = () => {
 const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

 const todayStart = new Date();
 todayStart.setHours(0, 0, 0, 0);
 const todayEnd = new Date();
 todayEnd.setHours(23, 59, 59, 999);

 const { data: tasks, isLoading, updateTask, reorderTasks } = useTasks('global', {
 dueDateStart: todayStart.toISOString(),
 dueDateEnd: todayEnd.toISOString(),
 });

 const handleToggle = (id: string, completed: boolean) => {
 updateTask({ id, status: completed ? 'DONE' : 'TODO' });
 };

 const handleReorder = (reorderedTasks: TaskItemProps['task'][]) => {
 const updates = reorderedTasks.map((t, index) => ({ id: t.id, position: index }));
 reorderTasks(updates);
 };

 const selectedTask = tasks?.find(t => t.id === selectedTaskId) || null;

 return (
 <div className="max-w-3xl mx-auto px-6 py-8 relative">
 <div className="mb-8">
 <h1 className="text-3xl font-bold text-[var(--text-primary)]">Today</h1>
 <p className="text-[var(--text-secondary)] mt-1">Focus on what's due today.</p>
 </div>
 
 <div>
 {isLoading ? (
 <TaskListSkeleton />
 ) : tasks && tasks.length > 0 ? (
 <div className="bg-[var(--bg-surface)] rounded-xl border border-[var(--border-default)] shadow-sm p-2 overflow-hidden">
 <TaskList 
 tasks={tasks} 
 onToggle={handleToggle}
 onClick={(id) => setSelectedTaskId(id)}
 onReorder={handleReorder}
 />
 </div>
 ) : (
 <div className="flex flex-col items-center justify-center p-12 text-center bg-[var(--bg-surface)] rounded-xl border border-[var(--border-default)] border-dashed">
 <CheckCircle2 className="h-16 w-16 text-primary-200 mb-4" />
 <h3 className="text-lg font-medium text-[var(--text-primary)]">You're all caught up!</h3>
 <p className="mt-2 text-sm text-[var(--text-secondary)]">No tasks due today. Enjoy your day or plan ahead.</p>
 </div>
 )}
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
