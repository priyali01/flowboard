import { get, update, del } from 'idb-keyval';

export interface OfflineRequest {
  id: string;
  url: string;
  method: 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: any;
  timestamp: number;
}

const QUEUE_KEY = 'flowboard-offline-queue';

export const addToQueue = async (request: Omit<OfflineRequest, 'id' | 'timestamp'>) => {
  const newRequest: OfflineRequest = {
    ...request,
    id: Math.random().toString(36).substring(2, 9),
    timestamp: Date.now(),
  };

  await update(QUEUE_KEY, (val: any) => {
    const currentQueue = val || [];
    return [...currentQueue, newRequest];
  });
};

export const getQueue = async (): Promise<OfflineRequest[]> => {
  const val = await get(QUEUE_KEY);
  return val || [];
};

export const clearQueue = async () => {
  await del(QUEUE_KEY);
};

export const removeFromQueue = async (id: string) => {
  await update(QUEUE_KEY, (val: any) => {
    const currentQueue = val || [];
    return currentQueue.filter((req: OfflineRequest) => req.id !== id);
  });
};
