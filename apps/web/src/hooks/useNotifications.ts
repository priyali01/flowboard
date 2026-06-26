import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import { useEffect } from 'react';
import { getSocket } from '../api/socket';

export interface Notification {
  id: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export const useNotifications = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['notifications'],
    queryFn: async (): Promise<Notification[]> => {
      const { data } = await apiClient.get('/notifications');
      return data;
    }
  });

  const markAsRead = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.patch(`/notifications/${id}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    socket.on('new_notification', () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    });

    return () => {
      socket.off('new_notification');
    };
  }, [queryClient]);

  return {
    ...query,
    markAsRead: markAsRead.mutateAsync
  };
};
