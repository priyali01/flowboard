import { useState } from 'react';
import type { TaskItemProps } from '../../components/tasks/TaskItem';
import { TaskList } from '../../components/tasks/TaskList';
import { TaskDetail } from '../../components/tasks/TaskDetail';
import { TaskListSkeleton } from '../../components/common/SkeletonLoader';
import { Calendar } from 'lucide-react';
import { useTasks } from '../../hooks/useTasks';

export const Upcoming = () => {
 const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

 const start = new Date();
 start.setHours(0, 0, 0, 0); // Include today
 
 const end = new Date();
 end.setDate(end.getDate() + 7);
 end.setHours(23, 59, 59, 999);

 const { data: tasks, isLoading, updateTask, reorderTasks, deleteTask } = useTasks('global', {
 dueDateStart: start.toISOString(),
 dueDateEnd: end.toISOString(),
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
 <div className="pb-8 relative">
 <div className="mb-8">
 <h1 className="text-3xl font-bold text-[var(--text-primary)]">Calendar</h1>
 <p className="text-[var(--text-secondary)] mt-1">Today & Next 7 Days</p>
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
 <Calendar className="h-16 w-16 text-primary-200 mb-4" />
 <h3 className="text-lg font-medium text-[var(--text-primary)]">Your calendar is clear</h3>
 <p className="mt-2 text-sm text-[var(--text-secondary)]">You don't have any tasks scheduled for today or the next 7 days.</p>
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
