import axios from 'axios';
import { useAuthStore } from '../stores/authStore';

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
  createdAt: string;
  updatedAt: string;
}
