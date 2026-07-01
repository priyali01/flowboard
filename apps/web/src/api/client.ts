import axios from 'axios';
import { useAuthStore } from '../stores/authStore';
import toast from 'react-hot-toast';

export const apiClient = axios.create({
  baseURL: 'http://localhost:3000/v1',
});

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      toast.error('Your session has expired. Please sign in again.');
      useAuthStore.getState().logout();
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
