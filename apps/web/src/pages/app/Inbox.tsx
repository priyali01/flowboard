import React, { useState } from 'react';
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
  PieChart, Pie, Cell, Tooltip, Legend
} from 'recharts';

// ── Stat Card ──────────────────────────────────────────────────────────────
const StatCard = ({ title, value, change, changePositive, icon: Icon, iconBg, iconColor }: any) => (
  <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border border-[var(--border-default)] hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between mb-3">
      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{title}</p>
      <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center', iconBg)}>
        <Icon size={18} className={iconColor} />
      </div>
    </div>
    <p className="text-3xl font-black text-gray-900 dark:text-white mb-1">{value}</p>
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
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'All' | 'To Do' | 'In Progress' | 'Done'>('All');
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const { data: tasks, isLoading, createTask, updateTask, reorderTasks } = useTasks('global');
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

  // ── Bar chart data (mock weekly distribution) ──────────────────────────
  const barData = DAYS.map((day, i) => ({
    day,
    Completed: Math.max(0, Math.floor((completedTasks / 7) * (0.5 + Math.sin(i) * 0.5 + 0.5))),
    'In Progress': Math.max(0, Math.floor((inProgressTasks / 7) * (0.5 + Math.cos(i) * 0.5 + 0.5))),
    Overdue: Math.max(0, Math.floor((overdueTasks / 7) * (0.3 + Math.sin(i * 2) * 0.3 + 0.3))),
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
    if (!newTaskTitle.trim() || !defaultProjectId) return;
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
          iconBg="bg-primary-50 dark:bg-primary-900/30"
          iconColor="text-primary-600 dark:text-primary-400"
        />
        <StatCard
          title="Completed"
          value={completedTasks}
          change={8}
          changePositive={true}
          icon={TrendingUp}
          iconBg="bg-green-50 dark:bg-green-900/30"
          iconColor="text-green-600"
        />
        <StatCard
          title="In Progress"
          value={inProgressTasks}
          change={-5}
          changePositive={false}
          icon={RefreshCw}
          iconBg="bg-amber-50 dark:bg-amber-900/30"
          iconColor="text-amber-500"
        />
        <StatCard
          title="Overdue"
          value={overdueTasks}
          change={-2}
          changePositive={false}
          icon={AlertCircle}
          iconBg="bg-red-50 dark:bg-red-900/30"
          iconColor="text-red-500"
        />
      </div>

      {/* ── Charts Row ── */}
      <div className="grid grid-cols-5 gap-4">
        {/* Task Overview Bar Chart */}
        <div className="col-span-3 bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border border-[var(--border-default)]">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-bold text-gray-800 dark:text-gray-200">Task Overview</h2>
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-500 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 transition-colors">
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
        <div className="col-span-2 bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border border-[var(--border-default)]">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-gray-800 dark:text-gray-200">My Progress</h2>
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
              <span className="text-2xl font-black text-gray-900 dark:text-white">{completionRate}%</span>
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
                <span className="text-gray-700 dark:text-gray-300">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── My Tasks Section ── */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-[var(--border-default)]">
        <div className="flex items-center justify-between px-6 pt-5 pb-0">
          <h2 className="text-base font-bold text-gray-800 dark:text-gray-200">My Tasks</h2>
          <button className="flex items-center gap-1 text-xs font-bold text-primary-600 hover:text-primary-700 transition-colors">
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
                  ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50/50 dark:bg-primary-900/20'
                  : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Quick Add */}
        <form onSubmit={handleAdd} className="px-6 py-3 border-b border-[var(--border-default)]">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-md border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center">
              <Plus size={12} className="text-gray-400" />
            </div>
            <input
              type="text"
              value={newTaskTitle}
              onChange={e => setNewTaskTitle(e.target.value)}
              placeholder="Add a new task..."
              className="flex-1 bg-transparent border-none outline-none text-sm text-gray-700 dark:text-gray-300 placeholder:text-gray-400 font-medium"
            />
            {newTaskTitle && (
              <button
                type="submit"
                className="px-3 py-1 text-xs font-bold bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
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
      />
    </div>
  );
};
