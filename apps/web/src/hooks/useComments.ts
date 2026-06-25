import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api/client';

export interface Comment {
  id: string;
  taskId: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
}

export const useComments = (taskId: string) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['comments', taskId],
    queryFn: async (): Promise<Comment[]> => {
      const { data } = await apiClient.get(`/tasks/${taskId}/comments`);
      return data;
    },
    enabled: !!taskId,
  });

  const createMutation = useMutation({
    mutationFn: async (content: string) => {
      const { data } = await apiClient.post(`/tasks/${taskId}/comments`, { content });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', taskId] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/comments/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', taskId] });
    },
  });

  return {
    ...query,
    createComment: createMutation.mutateAsync,
    deleteComment: deleteMutation.mutateAsync,
  };
};
