import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getSocket } from '../api/socket';

export const useSocketSync = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    socket.on('task_created', () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    });

    socket.on('task_updated', (updatedTask) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['activity', updatedTask.id] });
    });

    socket.on('task_deleted', () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    });

    socket.on('task_reordered', () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    });

    socket.on('new_comment', (comment) => {
      queryClient.invalidateQueries({ queryKey: ['comments', comment.taskId] });
    });

    return () => {
      socket.off('task_created');
      socket.off('task_updated');
      socket.off('task_deleted');
      socket.off('task_reordered');
      socket.off('new_comment');
    };
  }, [queryClient]);
};
