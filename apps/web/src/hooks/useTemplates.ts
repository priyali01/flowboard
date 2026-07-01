import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import type { TaskTemplate } from '../api/client';

export const useTemplates = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['templates'],
    queryFn: async () => {
      const { data } = await apiClient.get<TaskTemplate[]>('/templates');
      return data;
    },
  });

  const createTemplate = useMutation({
    mutationFn: async (template: Omit<TaskTemplate, 'id' | 'createdAt' | 'updatedAt' | 'workspaceId'>) => {
      const { data } = await apiClient.post<TaskTemplate>('/templates', template);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
    },
  });

  const deleteTemplate = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/templates/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
    },
  });

  const instantiateTemplate = useMutation({
    mutationFn: async ({ id, projectId, assigneeId, dueDate }: { id: string; projectId: string; assigneeId?: string; dueDate?: Date }) => {
      const { data } = await apiClient.post(`/templates/${id}/instantiate`, { projectId, assigneeId, dueDate });
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tasks', variables.projectId] });
    },
  });

  return {
    ...query,
    createTemplate,
    deleteTemplate,
    instantiateTemplate,
  };
};
