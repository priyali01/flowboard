
import { cn } from '../../lib/utils';
import { GripVertical, MoreVertical, Calendar as CalendarIcon, MessageSquare, Flag } from 'lucide-react';
import { format, isToday, isTomorrow } from 'date-fns';
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
 // Mocking project and comments for UI purposes
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
 LOW: { color: 'text-green-500', bg: 'bg-green-100 ', label: 'Low' },
 MEDIUM: { color: 'text-amber-500', bg: 'bg-amber-100 ', label: 'Medium' },
 HIGH: { color: 'text-red-500', bg: 'bg-red-100 ', label: 'High' },
 URGENT: { color: 'text-red-600', bg: 'bg-red-100 ', label: 'Urgent' },
 };

 const pConfig = priorityConfig[task.priority] ?? priorityConfig.MEDIUM;

 const renderDueDate = () => {
 if (!task.dueDate) return null;
 const date = new Date(task.dueDate);
 
 let text = format(date, 'MMM d');
 if (isToday(date)) text = 'Today';
 if (isTomorrow(date)) text = 'Tomorrow';
 
 return (
 <div className="flex items-center text-xs font-medium text-gray-500">
 <CalendarIcon size={12} className="mr-1" />
 {text}
 </div>
 );
 };

 // Assign mock properties if they don't exist, to match the UI screenshot
 const mockProject = task.project || { name: 'Frontend Project', color: '#3b82f6' };
 const mockCommentCount = task.commentCount ?? Math.floor(Math.random() * 5);
 const mockAvatar = task.assigneeAvatar ?? 'https://i.pravatar.cc/150?u=' + task.id;

 // Determine left border color based on mock project or labels
 const leftBorderColor = isCompleted ? '#10b981' : (task.labels?.[0]?.color || mockProject.color);

 return (
 <div 
 ref={setNodeRef}
 style={style}
 onClick={() => onClick?.(task.id)}
 className={cn(
 "group flex items-center py-4 pr-4 pl-3 bg-white/70 backdrop-blur-xl border-b border-gray-100 hover:bg-white :bg-gray-800 transition-all cursor-pointer relative",
 isCompleted && "opacity-75",
 isDragging && "opacity-40 shadow-lg ring-1 ring-primary-500 z-10 rounded-xl border-none"
 )}
 >
 {/* Left Color Strip */}
 <div 
 className="absolute left-0 top-0 bottom-0 w-1 rounded-r-md transition-colors"
 style={{ backgroundColor: leftBorderColor }}
 />

 {/* Drag Handle */}
 <div 
 {...attributes}
 {...listeners}
 className="text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing px-1 mr-2 focus:outline-none"
 >
 <GripVertical className="h-4 w-4" />
 </div>
 
 {/* Checkbox */}
 <div className="mr-4" onClick={(e) => e.stopPropagation()}>
 <div 
 onClick={() => onToggle(task.id, !isCompleted)}
 className={cn(
 "w-5 h-5 rounded-md border-2 flex items-center justify-center cursor-pointer transition-colors",
 isCompleted 
 ? "bg-primary-500 border-primary-500" 
 : "border-gray-300 hover:border-primary-400"
 )}
 >
 {isCompleted && (
 <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
 <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
 </svg>
 )}
 </div>
 </div>

 {/* Main Content Area */}
 <div className="flex-1 min-w-0 flex flex-col justify-center">
 <div className="flex items-center gap-3 mb-1">
 <span className={cn(
 "text-sm font-bold truncate transition-all",
 isCompleted ? "text-gray-400 line-through" : "text-[var(--text-primary)]"
 )}>
 {task.title}
 </span>
 {task.labels?.[0] && (
 <span 
 className="px-2 py-0.5 rounded-md text-[10px] font-bold"
 style={{ backgroundColor: `${task.labels[0].color}20`, color: task.labels[0].color }}
 >
 {task.labels[0].name}
 </span>
 )}
 </div>
 
 <div className="flex items-center gap-4">
 <div className="flex items-center text-xs font-medium text-gray-500">
 <span className="w-2 h-2 rounded-full mr-1.5" style={{ backgroundColor: mockProject.color }} />
 {mockProject.name}
 </div>
 {renderDueDate()}
 </div>
 </div>

 {/* Right Actions Area */}
 <div className="flex items-center shrink-0 ml-4 gap-6">
 {/* Priority */}
 <div className={cn("flex items-center gap-1.5 text-xs font-bold", pConfig.color)}>
 <Flag size={14} className={isCompleted ? "opacity-50" : ""} />
 {pConfig.label}
 </div>

 {/* Comments */}
 <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400">
 <MessageSquare size={14} />
 {mockCommentCount}
 </div>

 {/* Assignee Avatar */}
 <img 
 src={mockAvatar} 
 alt="Assignee" 
 className="w-7 h-7 rounded-full border-2 border-white shadow-sm"
 />

 {/* More Menu */}
 <button className="text-gray-400 hover:text-gray-600 :text-gray-300 transition-colors">
 <MoreVertical size={16} />
 </button>
 </div>
 </div>
 );
};
