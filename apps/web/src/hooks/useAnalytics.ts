import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../api/client';

export interface AnalyticsData {
  totalTasks: number;
  completedTasks: number;
  overdueTasks: number;
  currentStreak: number;
  chartData: { date: string; completed: number }[];
  projectCompletion: { id: string; name: string; percentage: number }[];
}

export const useAnalytics = (workspaceId?: string) => {
  return useQuery({
    queryKey: ['analytics', workspaceId],
    queryFn: async () => {
      if (!workspaceId) return null;
      const { data } = await apiClient.get<AnalyticsData>(`/workspaces/${workspaceId}/analytics`);
      return data;
    },
    enabled: !!workspaceId,
  });
};
