import { useState } from 'react';
import type { Task } from '../../api/client';
import { useGlobalTasks } from '../../hooks/useGlobalTasks';
import { TaskItem } from '../../components/tasks/TaskItem';
import { TaskDetailPanel } from '../../components/tasks/TaskDetailPanel';
import { TaskListSkeleton } from '../../components/common/SkeletonLoader';
import { Calendar } from 'lucide-react';

export const Upcoming = () => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const start = new Date();
  start.setDate(start.getDate() + 1);
  start.setHours(0, 0, 0, 0);
  
  const end = new Date();
  end.setDate(end.getDate() + 7);
  end.setHours(23, 59, 59, 999);

  const { data: tasks, isLoading } = useGlobalTasks({
    dueDateStart: start.toISOString(),
    dueDateEnd: end.toISOString(),
  });

  return (
    <div className="p-8 h-full bg-white relative">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Upcoming (Next 7 Days)</h1>
      
      <div className="max-w-3xl mx-auto">
        {isLoading ? (
          <TaskListSkeleton />
        ) : tasks && tasks.length > 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            {tasks.map(task => (
              <TaskItem 
                key={task.id} 
                task={task} 
                projectId={task.projectId} 
                onClick={() => setSelectedTask(task)} 
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <Calendar className="h-16 w-16 text-indigo-200 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Nothing coming up</h3>
            <p className="mt-2 text-sm text-gray-500">You don't have any tasks scheduled for the next 7 days.</p>
          </div>
        )}
      </div>

      {selectedTask && (
        <TaskDetailPanel 
          task={selectedTask} 
          projectId={selectedTask.projectId} 
          onClose={() => setSelectedTask(null)} 
        />
      )}
    </div>
  );
};
