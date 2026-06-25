import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import type { Label } from '../api/client';

export const useLabels = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['labels'],
    queryFn: async (): Promise<Label[]> => {
      const { data } = await apiClient.get('/labels');
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (newLabel: { name: string; color: string }) => {
      const { data } = await apiClient.post('/labels', newLabel);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['labels'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Label> & { id: string }) => {
      const { data } = await apiClient.patch(`/labels/${id}`, updates);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['labels'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/labels/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['labels'] });
    },
  });

  return {
    ...query,
    createLabel: createMutation.mutateAsync,
    updateLabel: updateMutation.mutateAsync,
    deleteLabel: deleteMutation.mutateAsync,
  };
};
