import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import type { Task } from '../api/client';
import { addToQueue } from '../utils/offlineQueue';

export const useTasks = (projectId: string, filters: Record<string, string> = {}) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['tasks', projectId, filters],
    queryFn: async (): Promise<Task[]> => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      const { data } = await apiClient.get(`/projects/${projectId}/tasks?${params.toString()}`);
      return data;
    },
    enabled: !!projectId,
  });

  const createMutation = useMutation({
    mutationFn: async (newTask: { projectId: string; title: string; status?: string; priority?: string; parentId?: string; labelIds?: string[]; assigneeId?: string | null }) => {
      if (!navigator.onLine) {
        await addToQueue({
          url: `/projects/${newTask.projectId}/tasks`,
          method: 'POST',
          body: newTask
        });
        // Optimistic mock return
        return { ...newTask, id: 'temp-' + Date.now(), createdAt: new Date().toISOString() } as any;
      }
      const { data } = await apiClient.post(`/projects/${newTask.projectId}/tasks`, newTask);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tasks', variables.projectId] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Task> & { id: string; labelIds?: string[]; assigneeId?: string | null }) => {
      if (!navigator.onLine) {
        await addToQueue({
          url: `/tasks/${id}`,
          method: 'PATCH',
          body: updates
        });
        return { id, ...updates } as any;
      }
      const { data } = await apiClient.patch(`/tasks/${id}`, updates);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['tasks', data.projectId] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async ({ id }: { id: string; projectId: string }) => {
      if (!navigator.onLine) {
        await addToQueue({
          url: `/tasks/${id}`,
          method: 'DELETE'
        });
        return;
      }
      await apiClient.delete(`/tasks/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', projectId] });
      queryClient.invalidateQueries({ queryKey: ['tasks', 'global'] });
    },
  });

  const reorderMutation = useMutation({
    mutationFn: async (tasks: { id: string; position: number }[]) => {
      await apiClient.patch(`/projects/${projectId}/tasks/reorder`, { tasks });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', projectId] });
    },
  });

  return {
    ...query,
    createTask: createMutation.mutateAsync,
    updateTask: updateMutation.mutateAsync,
    deleteTask: deleteMutation.mutateAsync,
    reorderTasks: reorderMutation.mutateAsync,
  };
};
