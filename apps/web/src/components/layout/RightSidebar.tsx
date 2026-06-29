import React from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Folder, LayoutGrid, Upload, Clock, Sun } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useTasks } from '../../hooks/useTasks';
import { format, isFuture, isToday, isTomorrow } from 'date-fns';

export const RightSidebar = () => {
  const { data: tasks } = useTasks('global');

  // Calculate Progress
  const totalTasks = tasks?.length || 0;
  const completedTasks = tasks?.filter(t => t.status === 'DONE').length || 0;
  const progressPercent = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  const progressData = [
    { name: 'Completed', value: progressPercent, color: '#8b5cf6' }, // Primary
    { name: 'Remaining', value: 100 - progressPercent, color: 'rgba(139, 92, 246, 0.1)' }, // Background
  ];

  // Upcoming Reminders
  const upcomingTasks = tasks
    ?.filter(t => t.dueDate && (isFuture(new Date(t.dueDate)) || isToday(new Date(t.dueDate))) && t.status !== 'DONE')
    .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
    .slice(0, 3) || [];

  return (
    <div className="w-[320px] hidden xl:flex flex-col bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl border-l border-white/40 dark:border-gray-700/50 p-6 overflow-y-auto scrollbar-hide shadow-[-4px_0_24px_rgba(0,0,0,0.02)] z-10 space-y-8">
      
      {/* Mini Calendar Widget */}
      <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl p-5 shadow-soft border border-white/60 dark:border-gray-700/50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[15px] font-bold text-[var(--text-primary)]">{format(new Date(), 'MMMM yyyy')}</h3>
          <div className="flex gap-1">
            <button className="p-1 text-gray-400 hover:text-gray-900 transition-colors">
              <ChevronLeft size={16} />
            </button>
            <button className="p-1 text-gray-400 hover:text-gray-900 transition-colors">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} className="text-gray-400 py-1">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-sm font-medium">
          {/* Mock days, just to look good visually for now */}
          {Array.from({ length: 30 }).map((_, i) => (
            <div 
              key={i} 
              className={`py-1.5 rounded-lg flex items-center justify-center ${
                i + 1 === new Date().getDate() ? 'bg-primary-500 text-white shadow-md shadow-primary-500/30 font-bold' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer'
              }`}
            >
              {(i + 1)}
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Progress */}
      {totalTasks > 0 && (
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl p-5 shadow-soft border border-white/60 dark:border-gray-700/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[15px] font-bold text-[var(--text-primary)]">Progress</h3>
            <select className="bg-transparent text-xs font-semibold text-gray-500 outline-none cursor-pointer">
              <option>All Time</option>
            </select>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative w-24 h-24 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={progressData}
                    cx="50%"
                    cy="50%"
                    innerRadius={32}
                    outerRadius={44}
                    startAngle={90}
                    endAngle={-270}
                    dataKey="value"
                    stroke="none"
                    cornerRadius={10}
                  >
                    {progressData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-bold text-[var(--text-primary)] leading-none">{progressPercent}%</span>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-bold text-[var(--text-primary)]">
                {progressPercent === 100 ? 'All done! 🎉' : progressPercent >= 50 ? 'Great Progress! 🚀' : 'Keep it up! 💪'}
              </h4>
              <p className="text-xs text-[var(--text-secondary)] mt-1 leading-snug">
                {completedTasks} of {totalTasks} tasks completed
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Upcoming Reminders */}
      {upcomingTasks.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4 px-2">
            <h3 className="text-[15px] font-bold text-[var(--text-primary)]">Upcoming Reminders</h3>
            <button className="text-xs font-semibold text-primary-600 hover:text-primary-700">View All</button>
          </div>
          <div className="space-y-3">
            {upcomingTasks.map((task, i) => {
              const date = new Date(task.dueDate!);
              let timeText = format(date, 'MMM d, h:mm a');
              if (isToday(date)) timeText = `Today, ${format(date, 'h:mm a')}`;
              else if (isTomorrow(date)) timeText = `Tomorrow, ${format(date, 'h:mm a')}`;

              const colors = ['bg-amber-500', 'bg-purple-500', 'bg-blue-500'];
              
              return (
                <div key={task.id} className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl p-4 shadow-soft border border-white/60 dark:border-gray-700/50 flex gap-3 relative overflow-hidden group">
                  <div className={`absolute left-0 top-0 bottom-0 w-1 ${colors[i % colors.length]} rounded-l-2xl`} />
                  <div className="pl-2">
                    <h4 className="text-sm font-semibold text-[var(--text-primary)] truncate">{task.title}</h4>
                    <p className="text-xs text-[var(--text-secondary)] font-medium mt-1 flex items-center gap-1">
                      <Clock size={12} /> {timeText}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div>
        <h3 className="text-[15px] font-bold text-[var(--text-primary)] mb-4 px-2">Quick Actions</h3>
        <div className="grid grid-cols-4 gap-3">
          <button className="flex flex-col items-center justify-center gap-2 p-3 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-soft border border-white/60 dark:border-gray-700/50 hover:-translate-y-1 transition-transform group">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
              <Sun size={20} />
            </div>
            <span className="text-[10px] font-bold text-gray-500 text-center leading-tight">Today<br/>View</span>
          </button>
          <button className="flex flex-col items-center justify-center gap-2 p-3 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-soft border border-white/60 dark:border-gray-700/50 hover:-translate-y-1 transition-transform group">
            <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-900/30 flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform">
              <CalendarIcon size={20} />
            </div>
            <span className="text-[10px] font-bold text-gray-500 text-center leading-tight">Upcoming</span>
          </button>
          <button className="flex flex-col items-center justify-center gap-2 p-3 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-soft border border-white/60 dark:border-gray-700/50 hover:-translate-y-1 transition-transform group">
            <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center text-primary-500 group-hover:scale-110 transition-transform">
              <Folder size={20} />
            </div>
            <span className="text-[10px] font-bold text-gray-500 text-center leading-tight">Add<br/>Project</span>
          </button>
          <button className="flex flex-col items-center justify-center gap-2 p-3 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-soft border border-white/60 dark:border-gray-700/50 hover:-translate-y-1 transition-transform group">
            <div className="w-10 h-10 rounded-xl bg-green-50 dark:bg-green-900/30 flex items-center justify-center text-green-500 group-hover:scale-110 transition-transform">
              <Upload size={20} />
            </div>
            <span className="text-[10px] font-bold text-gray-500 text-center leading-tight">Import<br/>Tasks</span>
          </button>
        </div>
      </div>

    </div>
  );
};
