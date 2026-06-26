import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import { create } from 'zustand';

export interface WorkspaceMember {
  id: string;
  role: 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER';
  user: { id: string; name: string; email: string; avatarUrl: string | null };
}

export interface Workspace {
  id: string;
  name: string;
  ownerId: string;
  members: WorkspaceMember[];
}

interface WorkspaceState {
  activeWorkspaceId: string | null;
  setActiveWorkspaceId: (id: string | null) => void;
}

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  activeWorkspaceId: localStorage.getItem('activeWorkspaceId'),
  setActiveWorkspaceId: (id) => {
    if (id) localStorage.setItem('activeWorkspaceId', id);
    else localStorage.removeItem('activeWorkspaceId');
    set({ activeWorkspaceId: id });
  },
}));

export const useWorkspaces = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['workspaces'],
    queryFn: async (): Promise<Workspace[]> => {
      const { data } = await apiClient.get('/workspaces');
      return data;
    }
  });

  const createWorkspace = useMutation({
    mutationFn: async (data: { name: string }) => {
      const res = await apiClient.post('/workspaces', data);
      return res.data;
    },
    onSuccess: (newWorkspace) => {
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
      useWorkspaceStore.getState().setActiveWorkspaceId(newWorkspace.id);
    }
  });

  const inviteMember = useMutation({
    mutationFn: async ({ workspaceId, email, role }: { workspaceId: string; email: string; role: string }) => {
      const res = await apiClient.post(`/workspaces/${workspaceId}/members`, { email, role });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
    }
  });

  return {
    ...query,
    createWorkspace: createWorkspace.mutateAsync,
    inviteMember: inviteMember.mutateAsync,
  };
};
