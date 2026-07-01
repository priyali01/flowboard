import axios from 'axios';
import { useAuthStore } from '../stores/authStore';
import toast from 'react-hot-toast';

export const apiClient = axios.create({
  baseURL: 'http://localhost:3000/v1',
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: { resolve: (token: string) => void; reject: (error: any) => void }[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If it's a 401, not the refresh endpoint itself, and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== '/auth/refresh') {
      
      if (isRefreshing) {
        return new Promise(function(resolve, reject) {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = 'Bearer ' + token;
          return apiClient(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await axios.post('http://localhost:3000/v1/auth/refresh', {}, { withCredentials: true });
        
        // Update the Zustand store with the new token (keep existing user object)
        const currentUser = useAuthStore.getState().user;
        if (currentUser) {
          useAuthStore.getState().setAuth(currentUser, data.accessToken);
        }
        
        processQueue(null, data.accessToken);
        
        // Retry the original request
        originalRequest.headers.Authorization = 'Bearer ' + data.accessToken;
        return apiClient(originalRequest);
      } catch (err) {
        processQueue(err, null);
        toast.error('Your session has expired. Please sign in again.');
        useAuthStore.getState().logout();
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

export interface Project {
  id: string;
  name: string;
  color?: string;
  icon?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Label {
  id: string;
  ownerId: string;
  name: string;
  color: string;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE' | 'ARCHIVED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  dueDate?: string;
  parentId?: string;
  position: number;
  labels?: Label[];
  subtasks?: Task[];
  assigneeId?: string | null;
  assignee?: { id: string; name: string; avatarUrl: string | null } | null;
  recurrenceRule?: string | null;
  templateId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TaskTemplate {
  id: string;
  workspaceId: string;
  title: string;
  description?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  labelIds: string[];
  createdAt: string;
  updatedAt: string;
}
