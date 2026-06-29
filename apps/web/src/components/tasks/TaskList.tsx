import React, { useMemo } from 'react';
import { TaskItem, type TaskItemProps } from './TaskItem';
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
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';

export interface TaskListProps {
  tasks: TaskItemProps['task'][];
  onToggle: (id: string, completed: boolean) => void;
  onClick?: (id: string) => void;
  onReorder?: (tasks: TaskItemProps['task'][]) => void;
}

export const TaskList = ({ tasks, onToggle, onClick, onReorder }: TaskListProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id && onReorder) {
      const oldIndex = tasks.findIndex((t) => t.id === active.id);
      const newIndex = tasks.findIndex((t) => t.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newTasks = [...tasks];
        const [movedTask] = newTasks.splice(oldIndex, 1);
        newTasks.splice(newIndex, 0, movedTask);
        onReorder(newTasks);
      }
    }
  };

  const taskIds = useMemo(() => tasks.map((t) => t.id), [tasks]);

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-[var(--text-secondary)]">
        <div className="w-24 h-24 mb-4 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay" />
        <p className="text-sm font-medium">No tasks found in this view.</p>
        <p className="text-xs">Create a task to get started.</p>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToVerticalAxis]}
    >
      <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col">
          {tasks.map(task => (
            <TaskItem 
              key={task.id} 
              task={task} 
              onToggle={onToggle} 
              onClick={onClick} 
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};
