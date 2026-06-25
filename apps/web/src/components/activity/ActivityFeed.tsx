import React from 'react';
import { useActivity } from '../../hooks/useActivity';
import { formatDistanceToNow } from 'date-fns';
import { Activity as ActivityIcon, Edit, PlusCircle, CheckCircle, Clock } from 'lucide-react';

export const ActivityFeed: React.FC<{ taskId: string }> = ({ taskId }) => {
  const { data: activities, isLoading } = useActivity(taskId);

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'CREATED': return <PlusCircle size={16} className="text-green-500" />;
      case 'STATUS_CHANGED': return <CheckCircle size={16} className="text-indigo-500" />;
      case 'UPDATED': return <Edit size={16} className="text-blue-500" />;
      default: return <ActivityIcon size={16} className="text-gray-500" />;
    }
  };

  const getActionText = (activity: any) => {
    switch (activity.action) {
      case 'CREATED': return 'created this task';
      case 'STATUS_CHANGED': return `changed status from ${activity.oldValue || 'unknown'} to ${activity.newValue}`;
      case 'UPDATED': return 'updated the task details';
      default: return 'performed an action';
    }
  };

  return (
    <div className="flow-root h-full overflow-y-auto pr-2 pt-2">
      {isLoading ? (
        <p className="text-sm text-gray-500">Loading activity...</p>
      ) : activities?.length === 0 ? (
        <p className="text-sm text-gray-500 italic">No activity yet.</p>
      ) : (
        <ul role="list" className="-mb-8">
          {activities?.map((activity, eventIdx) => (
            <li key={activity.id}>
              <div className="relative pb-8">
                {eventIdx !== activities.length - 1 ? (
                  <span className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                ) : null}
                <div className="relative flex space-x-3">
                  <div>
                    <span className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center ring-8 ring-white">
                      {getActionIcon(activity.action)}
                    </span>
                  </div>
                  <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                    <div>
                      <p className="text-sm text-gray-500">
                        <span className="font-medium text-gray-900 mr-1">{activity.user.name}</span>
                        {getActionText(activity)}
                      </p>
                    </div>
                    <div className="whitespace-nowrap text-right text-xs text-gray-500 flex items-center">
                      <Clock size={12} className="mr-1" />
                      {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
