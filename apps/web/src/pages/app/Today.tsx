import { useState } from 'react';
import type { Task } from '../../api/client';
import { useGlobalTasks } from '../../hooks/useGlobalTasks';
import { TaskItem } from '../../components/tasks/TaskItem';
import { TaskDetailPanel } from '../../components/tasks/TaskDetailPanel';
import { TaskListSkeleton } from '../../components/common/SkeletonLoader';
import { CheckCircle2 } from 'lucide-react';

export const Today = () => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const { data: tasks, isLoading } = useGlobalTasks({
    dueDateStart: todayStart.toISOString(),
    dueDateEnd: todayEnd.toISOString(),
  });

  return (
    <div className="p-8 h-full bg-white relative">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Today</h1>
      
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
            <CheckCircle2 className="h-16 w-16 text-indigo-200 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">You're all caught up!</h3>
            <p className="mt-2 text-sm text-gray-500">No tasks due today. Enjoy your day or plan ahead.</p>
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
