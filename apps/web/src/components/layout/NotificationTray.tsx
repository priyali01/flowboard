import { Bell, Check, Inbox } from 'lucide-react';
import { useNotifications } from '../../hooks/useNotifications';
import { formatDistanceToNow } from 'date-fns';
import * as Popover from '@radix-ui/react-popover';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export const NotificationTray = () => {
  const { data: notifications, markAsRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications?.filter(n => !n.isRead).length || 0;

  return (
    <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
      <Popover.Trigger asChild>
        <button 
          className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] relative focus:outline-none rounded-full transition-colors"
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white shadow-sm ring-2 ring-[var(--bg-surface)]">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
      </Popover.Trigger>

      <AnimatePresence>
        {isOpen && (
          <Popover.Portal forceMount>
            <Popover.Content 
              asChild 
              align="end" 
              sideOffset={8}
            >
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="w-80 bg-[var(--bg-surface)] shadow-xl rounded-xl border border-[var(--border-default)] z-50 overflow-hidden flex flex-col max-h-[400px]"
              >
                <div className="p-4 border-b border-[var(--border-default)] bg-[var(--bg-subtle)]/50 flex justify-between items-center shrink-0">
                  <h3 className="text-sm font-semibold text-[var(--text-primary)]">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="text-xs font-medium text-primary-600 bg-primary-50 dark:bg-primary-900/30 px-2 py-0.5 rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                
                <div className="overflow-y-auto flex-1 p-1">
                  {notifications?.length === 0 ? (
                    <div className="p-8 text-center flex flex-col items-center">
                      <Inbox size={24} className="text-[var(--text-disabled)] mb-2 opacity-50" />
                      <p className="text-sm text-[var(--text-secondary)]">You're all caught up!</p>
                    </div>
                  ) : (
                    <ul className="space-y-1">
                      {notifications?.map(n => (
                        <li 
                          key={n.id} 
                          className={`p-3 rounded-lg cursor-pointer transition-colors flex gap-3 ${
                            !n.isRead 
                              ? 'bg-primary-50/50 dark:bg-primary-900/10 hover:bg-primary-50 dark:hover:bg-primary-900/20' 
                              : 'hover:bg-[var(--bg-subtle)]'
                          }`}
                          onClick={() => {
                            if (!n.isRead) markAsRead(n.id);
                          }}
                        >
                          <div className="shrink-0 mt-0.5">
                            {!n.isRead ? (
                              <div className="w-2 h-2 rounded-full bg-primary-500 mt-1.5" />
                            ) : (
                              <Check size={14} className="text-[var(--text-disabled)] mt-0.5" />
                            )}
                          </div>
                          <div>
                            <p className={`text-sm ${!n.isRead ? 'font-medium text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>
                              {n.message}
                            </p>
                            <p className="text-xs text-[var(--text-disabled)] mt-1 font-medium">
                              {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </motion.div>
            </Popover.Content>
          </Popover.Portal>
        )}
      </AnimatePresence>
    </Popover.Root>
  );
};
