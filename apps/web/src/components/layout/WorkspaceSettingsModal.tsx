import React, { useState } from 'react';
import { X, UserPlus, Shield } from 'lucide-react';
import { useWorkspaces } from '../../hooks/useWorkspaces';
import type { Workspace } from '../../hooks/useWorkspaces';
import { useAuthStore } from '../../stores/authStore';

interface Props {
  workspace: Workspace;
  onClose: () => void;
}

export const WorkspaceSettingsModal = ({ workspace, onClose }: Props) => {
  const { inviteMember } = useWorkspaces();
  const { user } = useAuthStore();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('MEMBER');
  const [error, setError] = useState('');

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await inviteMember({ workspaceId: workspace.id, email, role });
      setEmail('');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to invite member');
    }
  };

  const currentUserMember = workspace.members.find(m => m.user.id === user?.id);
  const canInvite = currentUserMember?.role === 'OWNER' || currentUserMember?.role === 'ADMIN';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">{workspace.name} Settings</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">Members</h3>
          
          <ul className="space-y-4 mb-8">
            {workspace.members.map((member) => (
              <li key={member.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                    {member.user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{member.user.name}</p>
                    <p className="text-xs text-gray-500">{member.user.email}</p>
                  </div>
                </div>
                <div className="flex items-center text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  <Shield size={12} className="mr-1" />
                  {member.role}
                </div>
              </li>
            ))}
          </ul>

          {canInvite && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">Invite Member</h3>
              <form onSubmit={handleInvite} className="flex space-x-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  required
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="ADMIN">Admin</option>
                  <option value="MEMBER">Member</option>
                  <option value="VIEWER">Viewer</option>
                </select>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center"
                >
                  <UserPlus size={16} className="mr-2" />
                  Invite
                </button>
              </form>
              {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
