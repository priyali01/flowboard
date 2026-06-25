import { useState } from 'react';
import { useTasks } from '../../hooks/useTasks';
import { TaskItem } from './TaskItem';
import type { Task } from '../../api/client';
import { Plus } from 'lucide-react';

export const TaskList: React.FC<{ projectId: string; onSelectTask: (task: Task) => void }> = ({ projectId, onSelectTask }) => {
  const { data: tasks, isLoading, createTask } = useTasks(projectId);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskTitle.trim()) {
      createTask({ projectId, title: newTaskTitle.trim() });
      setNewTaskTitle('');
    }
  };

  if (isLoading) return <div className="p-4 text-gray-500">Loading tasks...</div>;

  return (
    <div className="max-w-3xl mx-auto w-full bg-white rounded-lg shadow mt-6 overflow-hidden">
      <div className="p-4">
        {tasks?.length === 0 ? (
          <p className="text-gray-500 text-sm italic mb-4">No tasks yet. Create one below!</p>
        ) : (
          <div className="mb-4">
            {tasks?.filter((t: Task) => !t.parentId).map((task: Task) => (
              <TaskItem key={task.id} task={task} projectId={projectId} onClick={() => onSelectTask(task)} />
            ))}
          </div>
        )}
        
        <form onSubmit={handleCreateTask} className="flex items-center mt-2 border-t border-gray-100 pt-4">
          <Plus className="text-gray-400 mr-2" size={20} />
          <input
            type="text"
            placeholder="Add a new task..."
            className="flex-1 text-sm border-0 focus:ring-0 p-2"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
          />
          <button 
            type="submit" 
            disabled={!newTaskTitle.trim()}
            className="ml-2 bg-indigo-600 text-white px-4 py-1.5 rounded-md text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
          >
            Add Task
          </button>
        </form>
      </div>
    </div>
  );
};
