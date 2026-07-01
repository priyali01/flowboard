import { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { TaskItemProps } from '../../components/tasks/TaskItem';
import { TaskList } from '../../components/tasks/TaskList';
import { TaskDetail } from '../../components/tasks/TaskDetail';
import { TaskListSkeleton } from '../../components/common/SkeletonLoader';
import { CheckCircle2, CheckSquare, Calendar, AlertCircle, ChevronDown, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { useTasks } from '../../hooks/useTasks';
import { cn } from '../../lib/utils';
import { isToday, isPast } from 'date-fns';

// ── Stat Card Component ──────────────────────────────────────────────────
const StatCard = ({ title, value, change, changePositive, icon: Icon, iconBg, iconColor }: any) => (
  <motion.div 
    variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
    transition={{ type: 'spring', stiffness: 300, damping: 24 }}
    className="bg-white/80 backdrop-blur-xl rounded-2xl p-5 shadow-sm border border-gray-200/60 hover:shadow-md hover:-translate-y-1 transition-all duration-300 group cursor-pointer"
  >
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
  </motion.div>
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
  
  // Advanced Filter/Sort State
  const [sortBy, setSortBy] = useState<'default' | 'dueDate' | 'priority' | 'alphabetical'>('default');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [filterPriority, setFilterPriority] = useState<string[]>([]);
  
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);
  
  const filterRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setShowFilterMenu(false);
      }
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setShowSortMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
  const { todayTasks, upcomingTasks, overdueTasks, completedTasks, filteredTotalCount } = useMemo(() => {
    let processedTasks = [...(tasks || [])];

    // 1. FILTERING
    if (filterPriority.length > 0) {
      processedTasks = processedTasks.filter(t => filterPriority.includes(t.priority));
    }

    // 2. SORTING
    if (sortBy !== 'default') {
      processedTasks.sort((a, b) => {
        let valA: any = 0;
        let valB: any = 0;
        
        if (sortBy === 'alphabetical') {
          valA = a.title.toLowerCase();
          valB = b.title.toLowerCase();
        } else if (sortBy === 'priority') {
          const pMap = { URGENT: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
          valA = pMap[a.priority as keyof typeof pMap] || 0;
          valB = pMap[b.priority as keyof typeof pMap] || 0;
        } else if (sortBy === 'dueDate') {
          valA = a.dueDate ? new Date(a.dueDate).getTime() : (sortDir === 'asc' ? Infinity : -Infinity);
          valB = b.dueDate ? new Date(b.dueDate).getTime() : (sortDir === 'asc' ? Infinity : -Infinity);
        }

        if (valA < valB) return sortDir === 'asc' ? -1 : 1;
        if (valA > valB) return sortDir === 'asc' ? 1 : -1;
        return 0;
      });
    }

    // 3. GROUPING
    const today: TaskItemProps['task'][] = [];
    const upcoming: TaskItemProps['task'][] = [];
    const overdue: TaskItemProps['task'][] = [];
    const completed: TaskItemProps['task'][] = [];

    processedTasks.forEach(task => {
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

    return { 
      todayTasks: today, 
      upcomingTasks: upcoming, 
      overdueTasks: overdue, 
      completedTasks: completed,
      filteredTotalCount: processedTasks.length
    };
  }, [tasks, filterPriority, sortBy, sortDir]);

  const filters = ['All Tasks', 'Today', 'Upcoming', 'Overdue', 'Completed'] as const;

  const totalTasksCount = filteredTotalCount;
  const todayCount = todayTasks.length;
  const overdueCount = overdueTasks.length;
  const completedCount = completedTasks.length;

  return (
    <div className="pb-8 relative">
      {/* ── Page Header ── */}
      <div className="mb-6">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">My Tasks</h1>
        <p className="text-gray-500 mt-1 font-medium">View and manage all your tasks across projects.</p>
      </div>

      {/* ── Summary Cards ── */}
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 0 },
          show: { opacity: 1, transition: { staggerChildren: 0.1 } }
        }}
      >
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
      </motion.div>

      {/* ── Filter / Sort Actions ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 bg-white/60 backdrop-blur-xl p-2 rounded-2xl border border-gray-200/50 shadow-sm relative z-40">
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
          
          {/* Filters Button & Menu */}
          <div className="relative" ref={filterRef}>
            <button 
              onClick={() => setShowFilterMenu(!showFilterMenu)}
              className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold transition-colors border", showFilterMenu || filterPriority.length > 0 ? "bg-primary-50 text-primary-600 border-primary-200" : "text-gray-600 hover:bg-gray-100 border-transparent hover:border-gray-200")}
            >
              <SlidersHorizontal size={14} />
              Filters
              {filterPriority.length > 0 && <span className="ml-1 bg-primary-100 text-primary-700 px-1.5 py-0.5 rounded-md text-[10px]">{filterPriority.length}</span>}
            </button>
            <AnimatePresence>
              {showFilterMenu && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 p-3 z-50"
                >
                  <p className="text-xs font-bold text-gray-500 mb-2 uppercase px-1">Priority</p>
                  <div className="space-y-1">
                    {['URGENT', 'HIGH', 'MEDIUM', 'LOW'].map(p => (
                      <label key={p} className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-50 rounded-lg cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          checked={filterPriority.includes(p)}
                          onChange={(e) => {
                            if (e.target.checked) setFilterPriority([...filterPriority, p]);
                            else setFilterPriority(filterPriority.filter(x => x !== p));
                          }}
                        />
                        <span className="text-sm font-medium text-gray-700">{p}</span>
                      </label>
                    ))}
                  </div>
                  {filterPriority.length > 0 && (
                    <button 
                      onClick={() => setFilterPriority([])}
                      className="w-full mt-2 text-xs font-bold text-gray-500 hover:text-gray-800 text-left px-3 py-1.5"
                    >
                      Clear Filters
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sort Button & Menu */}
          <div className="relative" ref={sortRef}>
            <button 
              onClick={() => setShowSortMenu(!showSortMenu)}
              className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold transition-colors border", showSortMenu || sortBy !== 'default' ? "bg-primary-50 text-primary-600 border-primary-200" : "text-gray-600 hover:bg-gray-100 border-transparent hover:border-gray-200")}
            >
              <ArrowUpDown size={14} />
              Sort
            </button>
            <AnimatePresence>
              {showSortMenu && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 p-2 z-50"
                >
                  <div className="space-y-1">
                    {[
                      { id: 'default', label: 'Default' },
                      { id: 'dueDate', label: 'Due Date' },
                      { id: 'priority', label: 'Priority' },
                      { id: 'alphabetical', label: 'Alphabetical' }
                    ].map(s => (
                      <button 
                        key={s.id}
                        onClick={() => {
                          if (sortBy === s.id && s.id !== 'default') {
                            setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
                          } else {
                            setSortBy(s.id as any);
                            setSortDir('asc');
                          }
                        }}
                        className={cn("w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors", sortBy === s.id ? "bg-primary-50 text-primary-700" : "text-gray-700 hover:bg-gray-50")}
                      >
                        {s.label}
                        {sortBy === s.id && s.id !== 'default' && (
                          <span className="text-[10px] bg-primary-100 px-1.5 py-0.5 rounded text-primary-600 uppercase font-bold">
                            {sortDir}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

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
