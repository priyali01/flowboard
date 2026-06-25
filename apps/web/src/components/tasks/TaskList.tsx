import React, { useState, useEffect } from 'react';
import { useTasks } from '../../hooks/useTasks';
import { TaskItem } from './TaskItem';
import type { Task } from '../../api/client';
import { Plus } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

export const TaskList: React.FC<{ projectId: string; onSelectTask: (task: Task) => void; filters?: Record<string, string> }> = ({ projectId, onSelectTask, filters = {} }) => {
  const { data: tasks, isLoading, createTask, reorderTasks } = useTasks(projectId, filters);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [localTasks, setLocalTasks] = useState<Task[]>([]);

  useEffect(() => {
    if (tasks) {
      setLocalTasks(tasks.filter(t => !t.parentId).sort((a, b) => a.position - b.position));
    }
  }, [tasks]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setLocalTasks((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);
        
        const newItems = arrayMove(items, oldIndex, newIndex);
        const updates = newItems.map((item, index) => ({ id: item.id, position: index }));
        
        // Optimistic update locally
        reorderTasks(updates);
        return newItems;
      });
    }
  };

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
        {localTasks.length === 0 ? (
          <p className="text-gray-500 text-sm italic mb-4">No tasks yet. Create one below!</p>
        ) : (
          <DndContext 
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext 
              items={localTasks.map(t => t.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="mb-4">
                {localTasks.map((task: Task) => (
                  <TaskItem key={task.id} task={task} projectId={projectId} onClick={() => onSelectTask(task)} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
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
