import { useState } from 'react';
import { useWorkspaces } from '../../hooks/useWorkspaces';
import { useAuthStore } from '../../stores/authStore';
import { Users, Mail, Shield, Crown, UserCheck, Loader2 } from 'lucide-react';

const roleConfig: Record<string, { label: string; color: string; icon: any }> = {
  OWNER:  { label: 'Owner',  color: 'text-amber-600 bg-amber-50',  icon: Crown },
  ADMIN:  { label: 'Admin',  color: 'text-indigo-600 bg-indigo-50', icon: Shield },
  MEMBER: { label: 'Member', color: 'text-green-600 bg-green-50',   icon: UserCheck },
  VIEWER: { label: 'Viewer', color: 'text-gray-500 bg-gray-100',    icon: Users },
};

export const TeamPage = () => {
  const { data: workspaces, isLoading, inviteMember } = useWorkspaces();
  const { user } = useAuthStore();
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'ADMIN' | 'MEMBER' | 'VIEWER'>('MEMBER');
  const [isInviting, setIsInviting] = useState(false);
  const [inviteSuccess, setInviteSuccess] = useState(false);

  const workspace = workspaces?.[0];
  const members = workspace?.members || [];

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim() || !workspace) return;
    setIsInviting(true);
    try {
      await inviteMember({ workspaceId: workspace.id, email: inviteEmail.trim(), role: inviteRole });
      setInviteEmail('');
      setInviteSuccess(true);
      setTimeout(() => setInviteSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    }
    setIsInviting(false);
  };

  return (
    <div className="pb-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Team</h1>
        <p className="text-sm text-gray-500 mt-0.5">Manage your workspace members and roles</p>
      </div>

      {/* Invite Section */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
        <h2 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Mail size={18} className="text-indigo-500" /> Invite Member
        </h2>
        <form onSubmit={handleInvite} className="flex gap-3">
          <input
            type="email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            placeholder="colleague@company.com"
            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400/30 focus:border-indigo-400 transition-all"
          />
          <select
            value={inviteRole}
            onChange={(e) => setInviteRole(e.target.value as any)}
            className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400/30 focus:border-indigo-400 text-gray-700"
          >
            <option value="MEMBER">Member</option>
            <option value="ADMIN">Admin</option>
            <option value="VIEWER">Viewer</option>
          </select>
          <button
            type="submit"
            disabled={!inviteEmail.trim() || isInviting}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#5961F9] via-[#A855F7] to-[#F97316] text-white rounded-xl text-sm font-bold hover:opacity-90 transition-all disabled:opacity-50"
          >
            {isInviting ? <Loader2 size={15} className="animate-spin" /> : <Mail size={15} />}
            Invite
          </button>
        </form>
        {inviteSuccess && (
          <p className="mt-2 text-sm text-green-600 font-medium flex items-center gap-1">
            <UserCheck size={14} /> Invitation sent successfully!
          </p>
        )}
      </div>

      {/* Members List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
            <Users size={18} className="text-indigo-500" /> Members
          </h2>
          <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-2.5 py-1 rounded-lg">
            {members.length} member{members.length !== 1 ? 's' : ''}
          </span>
        </div>

        {isLoading ? (
          <div className="p-6 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 animate-pulse">
                <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                <div className="flex-1">
                  <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 w-48 bg-gray-100 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : members.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Users size={36} className="text-gray-200 mb-3" />
            <p className="text-sm font-semibold text-gray-500">No members yet</p>
            <p className="text-xs text-gray-400 mt-1">Invite someone to get started</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {members.map((member) => {
              const cfg = roleConfig[member.role] || roleConfig.MEMBER;
              const RoleIcon = cfg.icon;
              const isMe = member.user.id === user?.id;
              return (
                <div key={member.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50/50 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-400 to-purple-400 flex items-center justify-center text-white font-bold text-sm shadow-sm flex-shrink-0">
                    {member.user.name?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-gray-800 truncate">{member.user.name}</p>
                      {isMe && <span className="text-xs font-semibold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full">You</span>}
                    </div>
                    <p className="text-xs text-gray-400 truncate">{member.user.email}</p>
                  </div>
                  <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${cfg.color}`}>
                    <RoleIcon size={12} />
                    {cfg.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
