import { useState, useMemo } from 'react';
import type { TaskItemProps } from '../../components/tasks/TaskItem';
import { TaskList } from '../../components/tasks/TaskList';
import { TaskDetail } from '../../components/tasks/TaskDetail';
import { TaskListSkeleton } from '../../components/common/SkeletonLoader';
import { CheckCircle2, CheckSquare, Calendar, AlertCircle, ChevronDown, ChevronRight, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { useTasks } from '../../hooks/useTasks';
import { cn } from '../../lib/utils';
import { isToday, isPast, startOfDay, isTomorrow } from 'date-fns';

// ── Stat Card Component ──────────────────────────────────────────────────
const StatCard = ({ title, value, change, changePositive, icon: Icon, iconBg, iconColor }: any) => (
  <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-5 shadow-sm border border-gray-200/60 hover:shadow-md hover:-translate-y-1 transition-all duration-300 group cursor-pointer">
    <div className="flex items-center justify-between mb-3">
      <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110', iconBg)}>
        <Icon size={20} className={iconColor} strokeWidth={2.5} />
      </div>
      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">{title}</p>
    </div>
    <div className="flex items-end justify-between">
      <p className="text-3xl font-black text-gray-900 leading-none">{value}</p>
      {change !== undefined && (
        <p className={cn('text-xs font-bold mb-1', changePositive ? 'text-emerald-500' : 'text-red-500')}>
          {changePositive ? '+' : ''}{change}% from last week
        </p>
      )}
    </div>
  </div>
);

// ── Group Header Component ───────────────────────────────────────────────
const GroupHeader = ({ title, count, colorClass, icon: Icon, isExpanded, onToggle }: any) => (
  <button 
    onClick={onToggle}
    className="flex items-center gap-2 w-full text-left py-2 mb-2 group focus:outline-none"
  >
    <Icon size={18} className={cn("transition-transform", colorClass, isExpanded ? "" : "-rotate-90")} />
    <h3 className={cn("text-lg font-bold transition-colors group-hover:opacity-80", colorClass)}>{title}</h3>
    <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 text-xs font-bold ml-2">
      {count}
    </span>
  </button>
);

export const Today = () => {
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<'All Tasks' | 'Today' | 'Upcoming' | 'Overdue' | 'Completed'>('All Tasks');
  
  // Expanded states for groups
  const [expandedGroups, setExpandedGroups] = useState({
    overdue: true,
    today: true,
    upcoming: true,
    completed: false
  });

  const toggleGroup = (group: keyof typeof expandedGroups) => {
    setExpandedGroups(prev => ({ ...prev, [group]: !prev[group] }));
  };

  const { data: tasks, isLoading, updateTask, reorderTasks, deleteTask } = useTasks('global', {});

  const handleToggle = (id: string, completed: boolean) => {
    updateTask({ id, status: completed ? 'DONE' : 'TODO' });
  };

  const handleReorder = (reorderedTasks: TaskItemProps['task'][]) => {
    const updates = reorderedTasks.map((t, index) => ({ id: t.id, position: index }));
    reorderTasks(updates);
  };

  const selectedTask = tasks?.find(t => t.id === selectedTaskId) || null;

  // ── Group Tasks ────────────────────────────────────────────────────────
  const { todayTasks, upcomingTasks, overdueTasks, completedTasks } = useMemo(() => {
    const today: TaskItemProps['task'][] = [];
    const upcoming: TaskItemProps['task'][] = [];
    const overdue: TaskItemProps['task'][] = [];
    const completed: TaskItemProps['task'][] = [];

    (tasks || []).forEach(task => {
      if (task.status === 'DONE') {
        completed.push(task);
        return;
      }

      if (!task.dueDate) {
        upcoming.push(task); // Treat no-due-date as upcoming for now
        return;
      }

      const date = new Date(task.dueDate);
      if (isPast(date) && !isToday(date)) {
        overdue.push(task);
      } else if (isToday(date)) {
        today.push(task);
      } else {
        upcoming.push(task);
      }
    });

    return { todayTasks: today, upcomingTasks: upcoming, overdueTasks: overdue, completedTasks: completed };
  }, [tasks]);

  const filters = ['All Tasks', 'Today', 'Upcoming', 'Overdue', 'Completed'] as const;

  const totalTasksCount = tasks?.length || 0;
  const todayCount = todayTasks.length;
  const overdueCount = overdueTasks.length;
  const completedCount = completedTasks.length;

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 relative">
      {/* ── Page Header ── */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">My Tasks</h1>
        <p className="text-gray-500 mt-1 font-medium">View and manage all your tasks across projects.</p>
      </div>

      {/* ── Summary Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Tasks"
          value={totalTasksCount}
          change={12}
          changePositive={true}
          icon={CheckSquare}
          iconBg="bg-primary-100"
          iconColor="text-primary-600"
        />
        <StatCard
          title="Due Today"
          value={todayCount}
          change={8}
          changePositive={true}
          icon={Calendar}
          iconBg="bg-amber-100"
          iconColor="text-amber-600"
        />
        <StatCard
          title="Overdue"
          value={overdueCount}
          change={-5}
          changePositive={false}
          icon={AlertCircle}
          iconBg="bg-red-100"
          iconColor="text-red-500"
        />
        <StatCard
          title="Completed"
          value={completedCount}
          change={15}
          changePositive={true}
          icon={CheckCircle2}
          iconBg="bg-emerald-100"
          iconColor="text-emerald-600"
        />
      </div>

      {/* ── Modern Filter Bar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 bg-white/60 backdrop-blur-xl p-2 rounded-2xl border border-gray-200/50 shadow-sm">
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 hide-scrollbar">
          {filters.map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-300",
                activeFilter === filter 
                  ? "bg-white text-primary-600 shadow-sm border border-gray-200/50" 
                  : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
              )}
            >
              {filter}
              {filter !== 'All Tasks' && (
                <span className={cn(
                  "ml-2 px-1.5 py-0.5 rounded-full text-[10px]",
                  activeFilter === filter ? "bg-primary-50 text-primary-600" : "bg-gray-100 text-gray-400"
                )}>
                  {filter === 'Today' && todayCount}
                  {filter === 'Upcoming' && upcomingTasks.length}
                  {filter === 'Overdue' && overdueCount}
                  {filter === 'Completed' && completedCount}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 px-2 shrink-0">
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200">
            <SlidersHorizontal size={14} />
            Filters
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200">
            <ArrowUpDown size={14} />
            Sort
          </button>
        </div>
      </div>

      {/* ── Tasks List Area ── */}
      <div className="space-y-6">
        {isLoading ? (
          <TaskListSkeleton />
        ) : tasks && tasks.length > 0 ? (
          <>
            {/* Overdue Section */}
            {(activeFilter === 'All Tasks' || activeFilter === 'Overdue') && overdueTasks.length > 0 && (
              <div className="mb-6">
                <GroupHeader 
                  title="Overdue" 
                  count={overdueCount} 
                  colorClass="text-red-500" 
                  icon={ChevronDown} 
                  isExpanded={expandedGroups.overdue}
                  onToggle={() => toggleGroup('overdue')}
                />
                {expandedGroups.overdue && (
                  <div className="mt-2 animate-in fade-in slide-in-from-top-2 duration-300">
                    <TaskList tasks={overdueTasks} onToggle={handleToggle} onClick={(id) => setSelectedTaskId(id)} onReorder={handleReorder} />
                  </div>
                )}
              </div>
            )}

            {/* Today Section */}
            {(activeFilter === 'All Tasks' || activeFilter === 'Today') && (
              <div className="mb-6">
                <GroupHeader 
                  title="Today" 
                  count={todayCount} 
                  colorClass="text-amber-500" 
                  icon={ChevronDown} 
                  isExpanded={expandedGroups.today}
                  onToggle={() => toggleGroup('today')}
                />
                {expandedGroups.today && (
                  <div className="mt-2 animate-in fade-in slide-in-from-top-2 duration-300">
                    {todayTasks.length > 0 ? (
                      <TaskList tasks={todayTasks} onToggle={handleToggle} onClick={(id) => setSelectedTaskId(id)} onReorder={handleReorder} />
                    ) : (
                      <div className="p-8 text-center bg-white/40 border border-dashed border-gray-300 rounded-2xl text-gray-500 font-medium">
                        🎉 Nothing due today! You're completely caught up.
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Upcoming Section */}
            {(activeFilter === 'All Tasks' || activeFilter === 'Upcoming') && upcomingTasks.length > 0 && (
              <div className="mb-6">
                <GroupHeader 
                  title="Upcoming" 
                  count={upcomingTasks.length} 
                  colorClass="text-primary-500" 
                  icon={ChevronDown} 
                  isExpanded={expandedGroups.upcoming}
                  onToggle={() => toggleGroup('upcoming')}
                />
                {expandedGroups.upcoming && (
                  <div className="mt-2 animate-in fade-in slide-in-from-top-2 duration-300">
                    <TaskList tasks={upcomingTasks} onToggle={handleToggle} onClick={(id) => setSelectedTaskId(id)} onReorder={handleReorder} />
                  </div>
                )}
              </div>
            )}

            {/* Completed Section */}
            {(activeFilter === 'All Tasks' || activeFilter === 'Completed') && completedTasks.length > 0 && (
              <div className="mb-6">
                <GroupHeader 
                  title="Completed" 
                  count={completedCount} 
                  colorClass="text-emerald-500" 
                  icon={ChevronDown} 
                  isExpanded={expandedGroups.completed}
                  onToggle={() => toggleGroup('completed')}
                />
                {expandedGroups.completed && (
                  <div className="mt-2 animate-in fade-in slide-in-from-top-2 duration-300">
                    <TaskList tasks={completedTasks} onToggle={handleToggle} onClick={(id) => setSelectedTaskId(id)} onReorder={handleReorder} />
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center p-16 text-center bg-white/60 backdrop-blur-xl rounded-3xl border border-gray-200/50 shadow-sm">
            <CheckCircle2 className="h-20 w-20 text-emerald-400 mb-6 drop-shadow-md" />
            <h3 className="text-2xl font-black text-gray-900 tracking-tight">You're all caught up!</h3>
            <p className="mt-3 text-base text-gray-500 font-medium max-w-sm">No active tasks right now. Create a new task to start planning your workflow.</p>
          </div>
        )}
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
