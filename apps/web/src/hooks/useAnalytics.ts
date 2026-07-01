import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import { useAuthStore } from '../stores/authStore';

export interface AnalyticsData {
  totalTasks: number;
  completedTasks: number;
  overdueTasks: number;
  currentStreak: number;
  chartData: { date: string; completed: number }[];
  projectCompletion: { id: string; name: string; percentage: number }[];
}

// Fetch analytics scoped to the current user (no workspace required)
export const useAnalytics = () => {
  const { accessToken } = useAuthStore();
  return useQuery({
    queryKey: ['analytics'],
    queryFn: async () => {
      const { data } = await apiClient.get<AnalyticsData>('/analytics');
      return data;
    },
    enabled: !!accessToken,
  });
};
