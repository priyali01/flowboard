import { useState } from 'react';
import type { Task } from '../../api/client';
import { useTasks } from '../../hooks/useTasks';
import { CheckCircle, Circle, Trash2 } from 'lucide-react';
import classNames from 'classnames';

interface TaskItemProps {
  task: Task;
  projectId: string;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, projectId }) => {
  const { updateTask, deleteTask } = useTasks(projectId);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);

  const toggleStatus = () => {
    updateTask({ id: task.id, status: task.status === 'DONE' ? 'TODO' : 'DONE' });
  };

  const handleTitleSubmit = () => {
    if (title.trim() && title !== task.title) {
      updateTask({ id: task.id, title: title.trim() });
    }
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask({ id: task.id, projectId });
    }
  };

  return (
    <div className="flex items-center group py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 px-2 rounded-md transition-colors">
      <button 
        onClick={toggleStatus}
        className={classNames('mr-3 focus:outline-none', {
          'text-gray-300 hover:text-indigo-500': task.status !== 'DONE',
          'text-green-500 hover:text-green-600': task.status === 'DONE',
        })}
      >
        {task.status === 'DONE' ? <CheckCircle size={20} /> : <Circle size={20} />}
      </button>

      <div className="flex-1 min-w-0">
        {isEditing ? (
          <input
            type="text"
            className="w-full bg-white border border-indigo-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleTitleSubmit}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleTitleSubmit();
              if (e.key === 'Escape') {
                setTitle(task.title);
                setIsEditing(false);
              }
            }}
            autoFocus
          />
        ) : (
          <p 
            className={classNames('text-sm font-medium truncate cursor-pointer', {
              'text-gray-900': task.status !== 'DONE',
              'text-gray-400 line-through': task.status === 'DONE',
            })}
            onClick={() => setIsEditing(true)}
          >
            {task.title}
          </p>
        )}
      </div>

      <div className="ml-4 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={handleDelete}
          className="text-gray-400 hover:text-red-500 p-1"
          title="Delete task"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};
