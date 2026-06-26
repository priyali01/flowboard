import { useEffect, useState } from 'react';
import { getQueue, removeFromQueue } from '../utils/offlineQueue';
import { apiClient } from '../api/client';
import { useQueryClient } from '@tanstack/react-query';

export const useNetworkSync = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleOnline = async () => {
      setIsOnline(true);
      await flushQueue();
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const flushQueue = async () => {
    setIsSyncing(true);
    try {
      const queue = await getQueue();
      if (queue.length === 0) {
        setIsSyncing(false);
        return;
      }

      for (const req of queue) {
        try {
          await apiClient.request({
            url: req.url,
            method: req.method,
            data: req.body,
          });
          await removeFromQueue(req.id);
        } catch (error) {
          console.error('Failed to sync offline request', req, error);
          // depending on the error, we might want to keep it in the queue
        }
      }

      // Invalidate relevant queries after sync
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });

    } finally {
      setIsSyncing(false);
    }
  };

  return { isOnline, isSyncing, flushQueue };
};
