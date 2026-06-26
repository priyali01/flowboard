import { useState, useRef, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { useNotifications } from '../../hooks/useNotifications';
import { formatDistanceToNow } from 'date-fns';

export const NotificationTray = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: notifications, markAsRead } = useNotifications();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications?.filter(n => !n.isRead).length || 0;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-500 hover:text-gray-700 relative focus:outline-none rounded-full hover:bg-gray-100"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white shadow-xl rounded-md border border-gray-100 z-50 overflow-hidden">
          <div className="p-3 border-b bg-gray-50">
            <h3 className="text-sm font-semibold text-gray-800">Notifications</h3>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications?.length === 0 ? (
              <div className="p-4 text-sm text-gray-500 text-center">No notifications</div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {notifications?.map(n => (
                  <li 
                    key={n.id} 
                    className={`p-4 hover:bg-gray-50 cursor-pointer ${!n.isRead ? 'bg-blue-50/30' : ''}`}
                    onClick={() => {
                      if (!n.isRead) markAsRead(n.id);
                    }}
                  >
                    <p className={`text-sm ${!n.isRead ? 'font-medium text-gray-900' : 'text-gray-600'}`}>
                      {n.message}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
