import { useGlobalTasks } from '../../hooks/useGlobalTasks';
import { 
 XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
 PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { CheckCircle2, Clock, ListTodo, TrendingUp } from 'lucide-react';

export const Analytics = () => {
 const { data: tasks = [], isLoading } = useGlobalTasks();

 if (isLoading) {
 return (
 <div className="flex items-center justify-center h-full">
 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
 </div>
 );
 }

 // Calculate stats
 const totalTasks = tasks.length;
 const completedTasks = tasks.filter(t => t.status === 'DONE').length;
 const inProgressTasks = tasks.filter(t => t.status === 'IN_PROGRESS').length;
 const completionRate = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;

 // Priority distribution
 const priorityCount = tasks.reduce((acc, task) => {
 acc[task.priority] = (acc[task.priority] || 0) + 1;
 return acc;
 }, {} as Record<string, number>);

 const priorityData = [
 { name: 'Low', value: priorityCount['LOW'] || 0, color: '#94a3b8' },
 { name: 'Medium', value: priorityCount['MEDIUM'] || 0, color: '#3b82f6' },
 { name: 'High', value: priorityCount['HIGH'] || 0, color: '#f59e0b' },
 { name: 'Urgent', value: priorityCount['URGENT'] || 0, color: '#ef4444' },
 ].filter(d => d.value > 0);

 // Completion by day (mock logic for the last 7 days based on updated/created dates)
 const last7Days = Array.from({ length: 7 }, (_, i) => {
 const d = new Date();
 d.setDate(d.getDate() - (6 - i));
 return d.toISOString().split('T')[0];
 });

 const completionsByDay = last7Days.map(date => {
 const count = tasks.filter(t => t.status === 'DONE' && t.updatedAt.startsWith(date)).length;
 // Format date nicely (e.g. "Mon")
 const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
 return { name: dayName, completed: count };
 });

 const trendData = completionsByDay;

 const StatCard = ({ title, value, icon: Icon, colorClass }: any) => (
 <div className="bg-[var(--bg-surface)] p-6 rounded-2xl border border-[var(--border-default)] shadow-sm">
 <div className="flex items-center justify-between">
 <div>
 <p className="text-sm font-medium text-[var(--text-secondary)]">{title}</p>
 <h3 className="text-3xl font-bold text-[var(--text-primary)] mt-2">{value}</h3>
 </div>
 <div className={`p-3 rounded-xl ${colorClass}`}>
 <Icon size={24} />
 </div>
 </div>
 </div>
 );

 return (
 <div className="max-w-6xl mx-auto px-6 py-8 relative">
 <div className="mb-8">
 <h1 className="text-3xl font-bold text-[var(--text-primary)]">Analytics Overview</h1>
 <p className="text-[var(--text-secondary)] mt-1">Track your productivity and task progress.</p>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
 <StatCard 
 title="Total Tasks" 
 value={totalTasks} 
 icon={ListTodo} 
 colorClass="bg-blue-50 text-blue-600 " 
 />
 <StatCard 
 title="Completed" 
 value={completedTasks} 
 icon={CheckCircle2} 
 colorClass="bg-green-50 text-green-600 " 
 />
 <StatCard 
 title="In Progress" 
 value={inProgressTasks} 
 icon={Clock} 
 colorClass="bg-amber-50 text-amber-600 " 
 />
 <StatCard 
 title="Completion Rate" 
 value={`${completionRate}%`} 
 icon={TrendingUp} 
 colorClass="bg-primary-50 text-primary-600 " 
 />
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
 <div className="lg:col-span-2 bg-[var(--bg-surface)] p-6 rounded-2xl border border-[var(--border-default)] shadow-sm">
 <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-6">Productivity Trend (Last 7 Days)</h3>
 <div className="h-[300px]">
 <ResponsiveContainer width="100%" height="100%">
 <LineChart data={trendData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-default)" />
 <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} dy={10} />
 <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
 <Tooltip 
 contentStyle={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-default)', borderRadius: '8px', color: 'var(--text-primary)' }}
 itemStyle={{ color: 'var(--text-primary)' }}
 />
 <Line type="monotone" dataKey="completed" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, fill: '#6366f1', strokeWidth: 2, stroke: 'var(--bg-surface)' }} activeDot={{ r: 6 }} />
 </LineChart>
 </ResponsiveContainer>
 </div>
 </div>

 <div className="bg-[var(--bg-surface)] p-6 rounded-2xl border border-[var(--border-default)] shadow-sm">
 <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-6">Tasks by Priority</h3>
 <div className="h-[300px] flex items-center justify-center">
 {priorityData.length > 0 ? (
 <ResponsiveContainer width="100%" height="100%">
 <PieChart>
 <Pie
 data={priorityData}
 cx="50%"
 cy="50%"
 innerRadius={60}
 outerRadius={90}
 paddingAngle={5}
 dataKey="value"
 >
 {priorityData.map((entry, index) => (
 <Cell key={`cell-${index}`} fill={entry.color} />
 ))}
 </Pie>
 <Tooltip 
 contentStyle={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-default)', borderRadius: '8px', color: 'var(--text-primary)' }}
 itemStyle={{ color: 'var(--text-primary)' }}
 />
 </PieChart>
 </ResponsiveContainer>
 ) : (
 <p className="text-sm text-[var(--text-disabled)]">No tasks available.</p>
 )}
 </div>
 
 <div className="mt-4 space-y-2">
 {priorityData.map((entry, index) => (
 <div key={index} className="flex items-center justify-between text-sm">
 <div className="flex items-center gap-2">
 <span className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
 <span className="text-[var(--text-secondary)]">{entry.name}</span>
 </div>
 <span className="font-medium text-[var(--text-primary)]">{entry.value}</span>
 </div>
 ))}
 </div>
 </div>
 </div>
 </div>
 );
};
