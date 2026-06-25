import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../api/client';

export interface Activity {
  id: string;
  taskId: string;
  action: string;
  oldValue?: string;
  newValue?: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
}

export const useActivity = (taskId: string) => {
  return useQuery({
    queryKey: ['activity', taskId],
    queryFn: async (): Promise<Activity[]> => {
      const { data } = await apiClient.get(`/tasks/${taskId}/activity`);
      return data;
    },
    enabled: !!taskId,
  });
};
