import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import type { Project } from '../api/client';

export const useProjects = (workspaceId?: string) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['projects', workspaceId],
    queryFn: async (): Promise<Project[]> => {
      const url = workspaceId ? `/projects?workspaceId=${workspaceId}` : '/projects';
      const { data } = await apiClient.get(url);
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (newProject: { name: string; color?: string; icon?: string; workspaceId?: string }) => {
      const { data } = await apiClient.post('/projects', newProject);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Project> & { id: string }) => {
      const { data } = await apiClient.patch(`/projects/${id}`, updates);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/projects/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });

  return { 
    ...query, 
    createProject: createMutation.mutateAsync, 
    updateProject: updateMutation.mutateAsync,
    deleteProject: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
  };
};
