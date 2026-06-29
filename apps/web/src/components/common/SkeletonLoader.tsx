export const TaskListSkeleton = () => {
 return (
 <div className="space-y-3 p-4 animate-pulse">
 {[1, 2, 3, 4, 5].map((i) => (
 <div key={i} className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow-sm border border-gray-100 ">
 <div className="h-4 w-4 bg-gray-200 rounded"></div>
 <div className="flex-1 space-y-2">
 <div className="h-4 bg-gray-200 rounded w-3/4"></div>
 <div className="h-3 bg-gray-200 rounded w-1/4"></div>
 </div>
 </div>
 ))}
 </div>
 );
};
