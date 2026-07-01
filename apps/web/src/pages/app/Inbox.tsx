import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TaskList } from '../../components/tasks/TaskList';
import { TaskDetail } from '../../components/tasks/TaskDetail';
import type { TaskItemProps } from '../../components/tasks/TaskItem';
import { useTasks } from '../../hooks/useTasks';
import { useProjects } from '../../hooks/useProjects';
import {
 CheckSquare, RefreshCw, AlertCircle, TrendingUp,
 ChevronRight, MoreHorizontal, Plus
} from 'lucide-react';
import { cn } from '../../lib/utils';
import {
 BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer,
 PieChart, Pie, Cell, Tooltip
} from 'recharts';

// ── Stat Card ──────────────────────────────────────────────────────────────
const StatCard = ({ title, value, change, changePositive, icon: Icon, iconBg, iconColor }: any) => (
 <div className="bg-white rounded-2xl p-5 shadow-sm border border-[var(--border-default)] hover:shadow-md transition-shadow">
 <div className="flex items-center justify-between mb-3">
 <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">{title}</p>
 <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center', iconBg)}>
 <Icon size={18} className={iconColor} />
 </div>
 </div>
 <p className="text-3xl font-black text-gray-900 mb-1">{value}</p>
 {change !== undefined && (
 <p className={cn('text-xs font-semibold', changePositive ? 'text-green-500' : 'text-red-500')}>
 {changePositive ? '+' : ''}{change}% from last week
 </p>
 )}
 </div>
);

// ── Days for bar chart ─────────────────────────────────────────────────────
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const Inbox = () => {
 const navigate = useNavigate();
 const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
 const [activeTab, setActiveTab] = useState<'All' | 'To Do' | 'In Progress' | 'Done'>('All');
 const [newTaskTitle, setNewTaskTitle] = useState('');

 const { data: tasks, isLoading, createTask, updateTask, deleteTask, reorderTasks } = useTasks('global');
 const { data: projects } = useProjects();
 const defaultProjectId = projects?.[0]?.id;

 const totalTasks = tasks?.length || 0;
 const completedTasks = tasks?.filter(t => t.status === 'DONE').length || 0;
 const inProgressTasks = tasks?.filter(t => t.status === 'IN_PROGRESS').length || 0;
 const overdueTasks = tasks?.filter(t => {
 if (!t.dueDate || t.status === 'DONE') return false;
 return new Date(t.dueDate) < new Date();
 }).length || 0;
 const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

 // ── Bar chart data: real per-day counts for the current week ──────────
 // Build a map: dayIndex (0=Mon … 6=Sun) → { Completed, InProgress, Overdue }
 const weeklyMap: Record<number, { Completed: number; 'In Progress': number; Overdue: number }> = {};
 DAYS.forEach((_, i) => { weeklyMap[i] = { Completed: 0, 'In Progress': 0, Overdue: 0 }; });

 const now = new Date();
 // Get start of the current week (Monday)
 const dayOfWeek = now.getDay(); // 0=Sun,1=Mon,...,6=Sat
 const diffToMonday = (dayOfWeek === 0 ? -6 : 1 - dayOfWeek);
 const weekStart = new Date(now);
 weekStart.setDate(now.getDate() + diffToMonday);
 weekStart.setHours(0, 0, 0, 0);
 const weekEnd = new Date(weekStart);
 weekEnd.setDate(weekStart.getDate() + 7);

 (tasks || []).forEach(t => {
   // For completed tasks: use updatedAt (= when they were marked Done)
   // For others: use createdAt (= when the task was added this week)
   const rawDate = t.status === 'DONE'
     ? (t.updatedAt ? new Date(t.updatedAt) : new Date(t.createdAt))
     : new Date(t.createdAt);

   if (rawDate < weekStart || rawDate >= weekEnd) return;

   // getDay: 0=Sun,1=Mon,...,6=Sat → remap to 0=Mon,...,6=Sun
   const rawDay = rawDate.getDay();
   const dayIdx = rawDay === 0 ? 6 : rawDay - 1;

   if (t.status === 'DONE') {
     weeklyMap[dayIdx].Completed++;
   } else if (t.status === 'IN_PROGRESS') {
     weeklyMap[dayIdx]['In Progress']++;
   } else if (t.dueDate && new Date(t.dueDate) < now) {
     weeklyMap[dayIdx].Overdue++;
   }
 });

 const barData = DAYS.map((day, i) => ({
 day,
 ...weeklyMap[i],
 }));

 // ── Donut chart data ───────────────────────────────────────────────────
 const donutData = [
 { name: 'Completed', value: completedTasks || 0, color: '#6366f1' },
 { name: 'In Progress', value: inProgressTasks || 0, color: '#f59e0b' },
 { name: 'Overdue', value: overdueTasks || 0, color: '#ef4444' },
 ].filter(d => d.value > 0);

 // If no tasks, add a placeholder
 const donutDisplay = donutData.length > 0 ? donutData : [{ name: 'No Tasks', value: 1, color: '#e2e8f0' }];

 const handleToggle = (id: string, completed: boolean) => {
 updateTask({ id, status: completed ? 'DONE' : 'TODO' });
 };

 const handleAdd = (e: React.FormEvent) => {
 e.preventDefault();
 if (!newTaskTitle.trim()) return;
 if (!defaultProjectId) {
  alert('Please create a project first before adding tasks.');
  return;
 }
 createTask({ title: newTaskTitle, projectId: defaultProjectId, status: 'TODO', priority: 'MEDIUM' });
 setNewTaskTitle('');
 };

 const handleReorder = (reorderedTasks: TaskItemProps['task'][]) => {
 if (!defaultProjectId) return;
 const updates = reorderedTasks.map((t, index) => ({ id: t.id, position: index }));
 reorderTasks(updates);
 };

 const selectedTask = tasks?.find(t => t.id === selectedTaskId) || null;

 const filteredTasks = tasks?.filter(t => {
 if (activeTab === 'All') return true;
 if (activeTab === 'To Do') return t.status === 'TODO';
 if (activeTab === 'In Progress') return t.status === 'IN_PROGRESS';
 if (activeTab === 'Done') return t.status === 'DONE';
 return true;
 }) || [];

 const tabs = ['All', 'To Do', 'In Progress', 'Done'] as const;

 return (
 <div className="space-y-6">
 {/* ── Stat Cards ── */}
 <div className="grid grid-cols-4 gap-4">
 <StatCard
 title="Total Tasks"
 value={totalTasks}
 change={12}
 changePositive={true}
 icon={CheckSquare}
 iconBg="bg-primary-50 "
 iconColor="text-primary-600 "
 />
 <StatCard
 title="Completed"
 value={completedTasks}
 change={8}
 changePositive={true}
 icon={TrendingUp}
 iconBg="bg-green-50 "
 iconColor="text-green-600"
 />
 <StatCard
 title="In Progress"
 value={inProgressTasks}
 change={-5}
 changePositive={false}
 icon={RefreshCw}
 iconBg="bg-amber-50 "
 iconColor="text-amber-500"
 />
 <StatCard
 title="Overdue"
 value={overdueTasks}
 change={-2}
 changePositive={false}
 icon={AlertCircle}
 iconBg="bg-red-50 "
 iconColor="text-red-500"
 />
 </div>

 {/* ── Charts Row ── */}
 <div className="grid grid-cols-5 gap-4">
 {/* Task Overview Bar Chart */}
 <div className="col-span-3 bg-white rounded-2xl p-5 shadow-sm border border-[var(--border-default)]">
 <div className="flex items-center justify-between mb-5">
 <h2 className="text-base font-bold text-gray-800 ">Task Overview</h2>
 <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-500 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
 This Week <MoreHorizontal size={14} />
 </button>
 </div>
 {totalTasks > 0 ? (
 <ResponsiveContainer width="100%" height={180}>
 <BarChart data={barData} barSize={10} barCategoryGap="30%">
 <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
 <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
 <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} allowDecimals={false} />
 <Tooltip
 contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 12 }}
 />
 <Bar dataKey="Completed" fill="#6366f1" radius={[4, 4, 0, 0]} stackId="a" />
 <Bar dataKey="In Progress" fill="#f59e0b" radius={[0, 0, 0, 0]} stackId="a" />
 <Bar dataKey="Overdue" fill="#ef4444" radius={[0, 0, 0, 0]} stackId="a" />
 </BarChart>
 </ResponsiveContainer>
 ) : (
 <div className="h-[180px] flex items-center justify-center text-gray-400 text-sm">
 No task data yet. Create some tasks to see your overview.
 </div>
 )}
 <div className="flex items-center gap-5 mt-3">
 {[{ color: '#6366f1', label: 'Completed' }, { color: '#f59e0b', label: 'In Progress' }, { color: '#ef4444', label: 'Overdue' }].map(l => (
 <div key={l.label} className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
 <span className="w-2 h-2 rounded-full" style={{ backgroundColor: l.color }} />
 {l.label}
 </div>
 ))}
 </div>
 </div>

 {/* My Progress Donut */}
 <div className="col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-[var(--border-default)]">
 <div className="flex items-center justify-between mb-3">
 <h2 className="text-base font-bold text-gray-800 ">My Progress</h2>
 <MoreHorizontal size={16} className="text-gray-400 cursor-pointer" />
 </div>
 <div className="relative flex items-center justify-center mb-4" style={{ height: 140 }}>
 <ResponsiveContainer width="100%" height={140}>
 <PieChart>
 <Pie
 data={donutDisplay}
 cx="50%"
 cy="50%"
 innerRadius={45}
 outerRadius={60}
 startAngle={90}
 endAngle={-270}
 dataKey="value"
 stroke="none"
 >
 {donutDisplay.map((entry, i) => (
 <Cell key={i} fill={entry.color} />
 ))}
 </Pie>
 </PieChart>
 </ResponsiveContainer>
 <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
 <span className="text-2xl font-black text-gray-900 ">{completionRate}%</span>
 <span className="text-xs text-gray-500 font-semibold">Completed</span>
 </div>
 </div>
 <div className="space-y-2">
 {[
 { label: 'Completed', value: completedTasks, color: '#6366f1' },
 { label: 'In Progress', value: inProgressTasks, color: '#f59e0b' },
 { label: 'Overdue', value: overdueTasks, color: '#ef4444' },
 ].map(item => (
 <div key={item.label} className="flex items-center justify-between text-xs font-semibold">
 <div className="flex items-center gap-2 text-gray-500">
 <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
 {item.label}
 </div>
 <span className="text-gray-700 ">{item.value}</span>
 </div>
 ))}
 </div>
 </div>
 </div>

 {/* ── My Tasks Section ── */}
 <div className="bg-white rounded-2xl shadow-sm border border-[var(--border-default)]">
 <div className="flex items-center justify-between px-6 pt-5 pb-0">
 <h2 className="text-base font-bold text-gray-800 ">My Tasks</h2>
 <button onClick={() => navigate('/today')} className="flex items-center gap-1 text-xs font-bold text-primary-600 hover:text-primary-700 transition-colors">
 View All <ChevronRight size={14} />
 </button>
 </div>

 {/* Tabs */}
 <div className="flex items-center gap-1 px-6 pt-4 pb-0 border-b border-[var(--border-default)]">
 {tabs.map(tab => (
 <button
 key={tab}
 onClick={() => setActiveTab(tab)}
 className={cn(
 'px-4 py-2 text-sm font-bold rounded-t-lg -mb-px transition-all',
 activeTab === tab
 ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50/50 '
 : 'text-gray-400 hover:text-gray-600 :text-gray-300'
 )}
 >
 {tab}
 </button>
 ))}
 </div>

 {/* Quick Add */}
 <form onSubmit={handleAdd} className="px-6 py-3 border-b border-[var(--border-default)]">
 <div className="flex items-center gap-3">
 <div className="w-5 h-5 rounded-md border-2 border-dashed border-gray-300 flex items-center justify-center">
 <Plus size={12} className="text-gray-400" />
 </div>
 <input
 type="text"
 value={newTaskTitle}
 onChange={e => setNewTaskTitle(e.target.value)}
 placeholder="Add a new task..."
 className="flex-1 bg-transparent border-none outline-none text-sm text-gray-700 placeholder:text-gray-400 font-medium"
 />
 {newTaskTitle && (
 <button
 type="submit"
 className="px-3 py-1 text-xs font-bold bg-gradient-to-r from-[#5961F9] via-[#A855F7] to-[#F97316] hover:opacity-90 transition-colors"
 >
 Add
 </button>
 )}
 </div>
 </form>

 {/* Task List */}
 <div className="min-h-[200px] max-h-[400px] overflow-y-auto">
 {isLoading ? (
 <div className="p-8 text-center text-gray-400 text-sm">Loading tasks...</div>
 ) : filteredTasks.length === 0 ? (
 <div className="p-10 text-center text-gray-400">
 <CheckSquare size={32} className="mx-auto mb-3 text-gray-300" />
 <p className="text-sm font-semibold">No tasks here</p>
 <p className="text-xs mt-1">Add a task using the field above</p>
 </div>
 ) : (
 <TaskList
 tasks={filteredTasks}
 onToggle={handleToggle}
 onClick={(id) => setSelectedTaskId(id)}
 onReorder={handleReorder}
 />
 )}
 </div>
 </div>

 <TaskDetail
 task={selectedTask}
 isOpen={!!selectedTask}
 onClose={() => setSelectedTaskId(null)}
 onUpdate={(id, updates) => updateTask({ id, ...updates })}
      onDelete={(id) => { const task = tasks?.find(t => t.id === id); if (task) deleteTask({ id, projectId: task.projectId }); }}
      />
 </div>
 );
};
