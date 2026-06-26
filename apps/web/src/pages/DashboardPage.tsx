import { useWorkspaceStore } from '../hooks/useWorkspaces';
import { useAnalytics } from '../hooks/useAnalytics';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Download, CheckCircle, Clock, CheckSquare, Zap } from 'lucide-react';
import { apiClient } from '../api/client';

export const DashboardPage = () => {
  const { activeWorkspaceId } = useWorkspaceStore();
  const { data, isLoading } = useAnalytics(activeWorkspaceId || undefined);

  if (!activeWorkspaceId) {
    return <div className="p-8 text-center text-gray-500">Please select a workspace.</div>;
  }

  if (isLoading || !data) {
    return <div className="p-8 text-center text-gray-500">Loading analytics...</div>;
  }

  const handleExport = async (format: 'csv' | 'pdf') => {
    try {
      const response = await apiClient.get(`/workspaces/${activeWorkspaceId}/export?format=${format}`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `tasks_export.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      alert(`Failed to export ${format.toUpperCase()}`);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Workspace Analytics</h1>
          <div className="flex gap-3">
            <button 
              onClick={() => handleExport('csv')}
              className="flex items-center px-4 py-2 bg-white dark:bg-gray-800 border dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-750"
            >
              <Download size={16} className="mr-2" /> Export CSV
            </button>
            <button 
              onClick={() => handleExport('pdf')}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700"
            >
              <Download size={16} className="mr-2" /> Export PDF
            </button>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-750">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Tasks</h3>
              <CheckSquare className="text-gray-400" size={20} />
            </div>
            <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{data.totalTasks}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-750">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Completed</h3>
              <CheckCircle className="text-green-500" size={20} />
            </div>
            <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{data.completedTasks}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-750">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Overdue</h3>
              <Clock className="text-red-500" size={20} />
            </div>
            <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{data.overdueTasks}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-750">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Current Streak</h3>
              <Zap className="text-yellow-500" size={20} />
            </div>
            <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{data.currentStreak} days</p>
          </div>
        </div>

        {/* Charts & Project Progress */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-750">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">Completed Tasks (Last 30 Days)</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(val) => new Date(val).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    tick={{ fontSize: 12 }}
                    stroke="#9ca3af"
                  />
                  <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" allowDecimals={false} />
                  <Tooltip 
                    cursor={{ fill: 'rgba(243, 244, 246, 0.5)' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="completed" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-750">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">Project Progress</h3>
            <div className="space-y-6">
              {data.projectCompletion.map((p: any) => (
                <div key={p.id}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{p.name}</span>
                    <span className="text-sm font-medium text-gray-500">{p.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${p.percentage}%` }}></div>
                  </div>
                </div>
              ))}
              {data.projectCompletion.length === 0 && (
                <p className="text-gray-500 text-sm text-center">No projects found.</p>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
