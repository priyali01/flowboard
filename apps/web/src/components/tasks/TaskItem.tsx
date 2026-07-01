import { cn } from '../../lib/utils';
import { GripVertical, MoreVertical, Calendar as CalendarIcon, MessageSquare, Flag, Paperclip } from 'lucide-react';
import { format, isToday, isTomorrow, isPast } from 'date-fns';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export interface TaskItemProps {
  task: {
    id: string;
    title: string;
    status: 'TODO' | 'IN_PROGRESS' | 'DONE' | 'ARCHIVED';
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
    dueDate?: string | null;
    labels?: { name: string; color: string }[];
    project?: { name: string; color: string };
    commentCount?: number;
    assigneeAvatar?: string;
  };
  onToggle: (id: string, completed: boolean) => void;
  onClick?: (id: string) => void;
}

export const TaskItem = ({ task, onToggle, onClick }: TaskItemProps) => {
  const isCompleted = task.status === 'DONE';

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const priorityConfig = {
    LOW: { color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-100', label: 'LOW' },
    MEDIUM: { color: 'text-amber-600', bg: 'bg-amber-50 border-amber-100', label: 'MEDIUM' },
    HIGH: { color: 'text-red-600', bg: 'bg-red-50 border-red-100', label: 'HIGH' },
    URGENT: { color: 'text-white', bg: 'bg-gradient-to-r from-red-500 to-rose-500 border-transparent shadow-sm shadow-red-200', label: 'URGENT' },
  };

  const pConfig = priorityConfig[task.priority] ?? priorityConfig.MEDIUM;

  const renderDueDate = () => {
    if (!task.dueDate) return null;
    const date = new Date(task.dueDate);
    const isOverdue = isPast(date) && !isToday(date) && !isCompleted;
    
    let text = format(date, 'MMM d');
    if (isToday(date)) text = 'Today';
    if (isTomorrow(date)) text = 'Tomorrow';
    
    let colorClass = 'text-gray-500 bg-gray-50 border-gray-200';
    let Icon = CalendarIcon;
    
    if (isCompleted) {
       colorClass = 'text-gray-400 bg-transparent border-transparent';
    } else if (isOverdue) {
       colorClass = 'text-red-600 bg-red-50 border-red-100 font-bold';
    } else if (isToday(date)) {
       colorClass = 'text-amber-600 bg-amber-50 border-amber-100 font-bold';
    }

    return (
      <div className={cn("flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs whitespace-nowrap transition-colors", colorClass)}>
        <Icon size={12} className={cn(isOverdue && "animate-pulse")} />
        {text}
      </div>
    );
  };

  const mockProject = task.project || { name: 'FlowBoard', color: '#5961F9' };
  const leftBorderColor = isCompleted ? '#10b981' : (task.labels?.[0]?.color || mockProject.color);

  return (
    <div 
      ref={setNodeRef}
      style={style}
      onClick={() => onClick?.(task.id)}
      className={cn(
        "group flex items-center p-4 pl-4 bg-white/80 backdrop-blur-xl border border-gray-200/60 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-[1px] hover:border-gray-300/80 transition-all cursor-pointer relative overflow-hidden mb-3",
        isCompleted && "opacity-60 hover:opacity-100",
        isDragging && "opacity-40 shadow-xl ring-2 ring-primary-500 z-10 scale-[1.02]"
      )}
    >
      {/* Colored Project Strip */}
      <div 
        className="absolute left-0 top-0 bottom-0 w-1.5 transition-colors"
        style={{ backgroundColor: leftBorderColor }}
      />

      {/* Drag Handle */}
      <div 
        {...attributes}
        {...listeners}
        className="text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing px-1 -ml-2 mr-2 focus:outline-none"
      >
        <GripVertical className="h-5 w-5" />
      </div>
      
      {/* Checkbox */}
      <div className="mr-4 shrink-0" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={() => onToggle(task.id, !isCompleted)}
          className={cn(
            "w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:ring-offset-1",
            isCompleted 
              ? "bg-[#10b981] border-[#10b981] scale-110 shadow-sm" 
              : "border-gray-300 bg-gray-50 hover:border-primary-400 hover:bg-primary-50"
          )}
        >
          {isCompleted && (
            <svg className="w-3.5 h-3.5 text-white animate-in zoom-in-50 duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 min-w-0 flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
        {/* Title and Labels */}
        <div className="flex-1 min-w-0 flex items-center gap-3">
          <span className={cn(
            "text-[15px] font-bold truncate transition-all duration-300",
            isCompleted ? "text-gray-400 line-through decoration-gray-300" : "text-gray-800"
          )}>
            {task.title}
          </span>
          {task.labels?.[0] && (
            <span 
              className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide shrink-0"
              style={{ backgroundColor: `${task.labels[0].color}15`, color: task.labels[0].color, border: `1px solid ${task.labels[0].color}30` }}
            >
              {task.labels[0].name}
            </span>
          )}
        </div>
        
        {/* Middle Metadata (Project, Due Date) */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-md border border-gray-100 bg-gray-50/50 text-xs font-semibold text-gray-500 hidden sm:flex">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: mockProject.color }} />
            {mockProject.name}
          </div>
          {renderDueDate()}
        </div>
      </div>

      {/* Right Actions & Badges */}
      <div className="flex items-center shrink-0 ml-4 gap-4">
        {/* Priority Badge */}
        <div className={cn("hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[11px] font-bold tracking-wide", pConfig.bg, pConfig.color, isCompleted && "opacity-50 saturate-50")}>
          <Flag size={12} strokeWidth={2.5} />
          {pConfig.label}
        </div>

        {/* Counters (Comments & Attachments) */}
        <div className="flex items-center gap-3 text-gray-400">
          {(task.commentCount ?? 0) > 0 && (
            <div className="flex items-center gap-1 text-[11px] font-bold">
              <MessageSquare size={13} strokeWidth={2.5} />
              {task.commentCount}
            </div>
          )}
          {/* Mock attachment count for now to match design */}
          <div className="flex items-center gap-1 text-[11px] font-bold hidden sm:flex">
            <Paperclip size={13} strokeWidth={2.5} />
            {task.id.length % 3}
          </div>
        </div>

        {/* Assignee Avatar */}
        {task.assigneeAvatar ? (
          <img 
            src={task.assigneeAvatar} 
            alt="Assignee" 
            className="w-7 h-7 rounded-full border-2 border-white shadow-sm ml-1"
          />
        ) : (
          <div className="w-7 h-7 rounded-full bg-primary-100 border-2 border-white shadow-sm ml-1 flex items-center justify-center">
            <span className="text-primary-700 text-[10px] font-bold">P</span>
          </div>
        )}

        {/* Menu */}
        <button 
          onClick={(e) => e.stopPropagation()}
          className="text-gray-400 hover:text-gray-700 hover:bg-gray-100 p-1.5 rounded-lg transition-colors focus:outline-none"
        >
          <MoreVertical size={16} />
        </button>
      </div>
    </div>
  );
};
