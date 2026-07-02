import { useState } from 'react';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { useTasks } from '../../hooks/useTasks';
import { format, isToday, isTomorrow, isFuture, formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const upcomingColors = ['bg-primary-500', 'bg-green-500', 'bg-orange-500'];
const upcomingIcons = ['📋', '🗓️', '📁'];

export const RightSidebar = () => {
    const { data: tasks } = useTasks('global');
    const navigate = useNavigate();

    // Upcoming tasks with due dates
    const upcomingTasks = tasks
        ?.filter(t => t.dueDate && (isFuture(new Date(t.dueDate)) || isToday(new Date(t.dueDate))) && t.status !== 'DONE')
        .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
        .slice(0, 3) || [];

    // Recent activity (mock based on recently updated tasks)
    const recentTasks = [...(tasks || [])]
        .sort((a, b) => new Date(b.updatedAt || b.createdAt || 0).getTime() - new Date(a.updatedAt || a.createdAt || 0).getTime())
        .slice(0, 3);

    // Calendar
    const [currentDate, setCurrentDate] = useState(new Date());
    const physicalNow = new Date();
    
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const isCurrentMonthAndYear = physicalNow.getFullYear() === year && physicalNow.getMonth() === month;
    const today = isCurrentMonthAndYear ? physicalNow.getDate() : -1;

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0=Sun
    const startOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

    const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

    const calendarDays: (number | null)[] = [
        ...Array(startOffset).fill(null),
        ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
    ];
    while (calendarDays.length % 7 !== 0) calendarDays.push(null);

    // Task due dates for calendar highlights
    const taskDueDates = new Set(
        tasks
            ?.filter(t => {
                if (!t.dueDate) return false;
                const d = new Date(t.dueDate);
                return d.getFullYear() === year && d.getMonth() === month;
            })
            .map(t => new Date(t.dueDate!).getDate())
    );

    return (
        <aside className="w-[280px] hidden xl:flex flex-col h-full bg-white/50 backdrop-blur-xl border-l border-white/50 overflow-y-auto p-5 space-y-6 flex-shrink-0">

            {/* ── Upcoming ─────────────────────────────────────────────── */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-gray-800 ">Upcoming</h3>
                    <button onClick={() => navigate('/upcoming')} className="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center gap-0.5">
                        View All <ChevronRight size={12} />
                    </button>
                </div>

                {upcomingTasks.length === 0 ? (
                    <p className="text-xs text-gray-500 font-medium text-center py-4">No upcoming deadlines 🎉</p>
                ) : (
                    <div className="space-y-3">
                        {upcomingTasks.map((task, i) => {
                            const date = new Date(task.dueDate!);
                            let timeLabel = format(date, 'MMM d');
                            if (isToday(date)) timeLabel = 'Today';
                            else if (isTomorrow(date)) timeLabel = 'Tomorrow';

                            return (
                                <div key={task.id} className="flex items-start gap-3 p-3 bg-[var(--bg-app)] rounded-xl border border-[var(--border-default)]">
                                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm flex-shrink-0 ${upcomingColors[i % upcomingColors.length]} bg-opacity-10`}>
                                        <span>{upcomingIcons[i % upcomingIcons.length]}</span>
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs font-bold text-gray-800 truncate">{task.title}</p>
                                        <p className="text-[10px] text-gray-500 font-medium mt-0.5 flex items-center gap-1">
                                            <Clock size={10} /> {timeLabel}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* ── Recent Activity ─────────────────────────────────────────── */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-gray-800 ">Recent Activity</h3>
                    <button onClick={() => navigate('/analytics')} className="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center gap-0.5">
                        View All <ChevronRight size={12} />
                    </button>
                </div>

                {recentTasks.length === 0 ? (
                    <p className="text-xs text-gray-500 font-medium text-center py-4">No recent activity</p>
                ) : (
                    <div className="space-y-4">
                        {recentTasks.map((task, i) => {
                            const avatarColors = ['from-primary-500 to-blue-500', 'from-green-400 to-teal-500', 'from-orange-400 to-red-400'];
                            
                            // Determine realistic action based on task status and dates
                            let actionLabel = 'updated';
                            if (task.status === 'DONE') actionLabel = 'completed';
                            else if (task.createdAt === task.updatedAt) actionLabel = 'created a new task';

                            // Calculate relative time
                            let timeAgoLabel = 'just now';
                            if (task.updatedAt || task.createdAt) {
                                try {
                                    timeAgoLabel = formatDistanceToNow(new Date(task.updatedAt || task.createdAt), { addSuffix: true });
                                    // short-hand format replacements to match the UI aesthetic
                                    timeAgoLabel = timeAgoLabel.replace('about ', '').replace('less than a minute', 'just now').replace(' minutes', 'm').replace(' minute', 'm').replace(' hours', 'h').replace(' hour', 'h');
                                } catch (e) {
                                    // fallback if date parse fails
                                }
                            }

                            return (
                                <div key={task.id} className="flex items-start gap-3">
                                    <div className={`w-8 h-8 rounded-full bg-gradient-to-tr ${avatarColors[i % avatarColors.length]} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                                        {task.title[0]?.toUpperCase() || 'U'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-gray-500 ">
                                            You <span className="font-semibold text-gray-700 ">{actionLabel}</span>
                                        </p>
                                        <p className="text-xs font-bold text-gray-800 truncate mt-0.5">{task.title}</p>
                                    </div>
                                    <span className="text-[10px] text-gray-400 font-medium flex-shrink-0">{timeAgoLabel}</span>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* ── Calendar ─────────────────────────────────────────────── */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-gray-800 ">Calendar</h3>
                    <button onClick={() => navigate('/upcoming')} className="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center gap-0.5">
                        View Calendar <ChevronRight size={12} />
                    </button>
                </div>

                <div className="bg-[var(--bg-app)] rounded-2xl p-4 border border-[var(--border-default)]">
                    {/* Month navigation */}
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold text-gray-700 ">
                            {format(currentDate, 'MMMM yyyy')}
                        </span>
                        <div className="flex gap-1">
                            <button onClick={handlePrevMonth} className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-white :bg-gray-700 transition-colors">
                                <ChevronLeft size={14} />
                            </button>
                            <button onClick={handleNextMonth} className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-white :bg-gray-700 transition-colors">
                                <ChevronRight size={14} />
                            </button>
                        </div>
                    </div>

                    {/* Day headers */}
                    <div className="grid grid-cols-7 mb-1">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
                            <div key={d} className="text-center text-[9px] font-bold text-gray-400 py-1">{d}</div>
                        ))}
                    </div>

                    {/* Days grid */}
                    <div className="grid grid-cols-7 gap-0.5">
                        {calendarDays.map((day, i) => {
                            const isToday_ = day === today;
                            const hasTask = day !== null && taskDueDates.has(day);
                            return (
                                <div
                                    key={i}
                                    className={`
 relative flex flex-col items-center justify-center h-7 text-[11px] font-semibold rounded-lg cursor-pointer transition-colors
 ${day === null ? '' : 'hover:bg-white :bg-gray-700'}
 ${isToday_ ? 'bg-primary-500 text-white shadow-sm font-bold' : 'text-gray-600 '}
 `}
                                >
                                    {day}
                                    {hasTask && !isToday_ && (
                                        <span className="absolute bottom-0.5 w-1 h-1 bg-primary-500 rounded-full" />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </aside>
    );
};
