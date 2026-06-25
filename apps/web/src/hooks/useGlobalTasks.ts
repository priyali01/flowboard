import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import type { Task } from '../api/client';

interface GlobalTaskFilters {
  search?: string;
  status?: string;
  priority?: string;
  labelId?: string;
  dueDateStart?: string;
  dueDateEnd?: string;
  sortBy?: string;
  sortOrder?: string;
}

export const useGlobalTasks = (filters: GlobalTaskFilters = {}) => {
  return useQuery({
    queryKey: ['tasks', 'global', filters],
    queryFn: async (): Promise<Task[]> => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      const { data } = await apiClient.get(`/tasks?${params.toString()}`);
      return data;
    },
  });
};
