import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import type { Task } from '../api/client';

export const useTasks = (projectId?: string) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['tasks', projectId],
    queryFn: async (): Promise<Task[]> => {
      if (!projectId) return [];
      const { data } = await apiClient.get(`/projects/${projectId}/tasks`);
      return data;
    },
    enabled: !!projectId,
  });

  const createMutation = useMutation({
    mutationFn: async (newTask: { projectId: string; title: string; status?: string; priority?: string }) => {
      const { data } = await apiClient.post(`/projects/${newTask.projectId}/tasks`, newTask);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tasks', variables.projectId] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Task> & { id: string }) => {
      const { data } = await apiClient.patch(`/tasks/${id}`, updates);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['tasks', data.projectId] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async ({ id }: { id: string; projectId: string }) => {
      await apiClient.delete(`/tasks/${id}`);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tasks', variables.projectId] });
    },
  });

  return { 
    ...query, 
    createTask: createMutation.mutateAsync, 
    updateTask: updateMutation.mutateAsync, 
    deleteTask: deleteMutation.mutateAsync 
  };
};
