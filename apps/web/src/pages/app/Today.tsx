import { useState } from 'react';
import type { Task } from '../../api/client';
import { useGlobalTasks } from '../../hooks/useGlobalTasks';
import { TaskItem } from '../../components/tasks/TaskItem';
import { TaskDetailPanel } from '../../components/tasks/TaskDetailPanel';

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
          <p className="text-gray-500">Loading tasks...</p>
        ) : tasks && tasks.length > 0 ? (
          <div className="bg-white rounded-lg shadow p-4">
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
          <p className="text-gray-500 text-sm">No tasks due today. Enjoy your day!</p>
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
