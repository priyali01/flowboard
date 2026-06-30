import { useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { User, Lock, Bell, Palette, ChevronRight, Check, Loader2 } from 'lucide-react';

const settingsSections = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'account', label: 'Account & Security', icon: Lock },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'appearance', label: 'Appearance', icon: Palette },
];

export const SettingsPage = () => {
  const { user } = useAuthStore();
  const [activeSection, setActiveSection] = useState('profile');
  const [name, setName] = useState(user?.name || '');
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    // Simulate save — in real app would call PATCH /users/me
    await new Promise((r) => setTimeout(r, 800));
    setIsSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-0.5">Manage your account and workspace preferences</p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar nav */}
        <div className="w-56 flex-shrink-0">
          <nav className="flex flex-col gap-1">
            {settingsSections.map((section) => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all text-left ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-gray-600 hover:bg-white hover:text-gray-900'
                  }`}
                >
                  <Icon size={17} className={isActive ? 'text-indigo-600' : 'text-gray-400'} />
                  {section.label}
                  {isActive && <ChevronRight size={14} className="ml-auto text-indigo-400" />}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {activeSection === 'profile' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100">
                <h2 className="text-base font-bold text-gray-800">Profile Information</h2>
                <p className="text-sm text-gray-400 mt-0.5">Update your personal details</p>
              </div>
              <form onSubmit={handleSaveProfile} className="p-6 space-y-5">
                {/* Avatar */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-400 flex items-center justify-center text-white font-black text-2xl shadow-md">
                    {user?.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-700">Profile Photo</p>
                    <p className="text-xs text-gray-400 mt-0.5">Avatar based on your initials</p>
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Display Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400/30 focus:border-indigo-400 transition-all text-gray-800"
                  />
                </div>

                {/* Email (read-only) */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    readOnly
                    className="w-full px-4 py-2.5 border border-gray-100 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-[#5961F9] via-[#A855F7] to-[#F97316] text-white rounded-xl text-sm font-bold hover:opacity-90 transition-all disabled:opacity-60"
                  >
                    {isSaving ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
                    Save Changes
                  </button>
                  {saved && <span className="text-sm text-green-600 font-semibold">✓ Saved!</span>}
                </div>
              </form>
            </div>
          )}

          {activeSection === 'account' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100">
                <h2 className="text-base font-bold text-gray-800">Account & Security</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-50">
                  <div>
                    <p className="text-sm font-semibold text-gray-700">Password</p>
                    <p className="text-xs text-gray-400">Last changed: Never</p>
                  </div>
                  <button className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">Change Password</button>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-gray-50">
                  <div>
                    <p className="text-sm font-semibold text-gray-700">Two-Factor Authentication</p>
                    <p className="text-xs text-gray-400">Add an extra layer of security</p>
                  </div>
                  <button className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">Enable 2FA</button>
                </div>
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-semibold text-red-600">Delete Account</p>
                    <p className="text-xs text-gray-400">Permanently delete your account and data</p>
                  </div>
                  <button className="text-sm font-semibold text-red-500 hover:text-red-600 transition-colors">Delete</button>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'notifications' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100">
                <h2 className="text-base font-bold text-gray-800">Notification Preferences</h2>
              </div>
              <div className="p-6 space-y-4">
                {[
                  { label: 'Task assigned to me', sub: 'Get notified when a task is assigned to you' },
                  { label: 'Task completed', sub: 'Get notified when a task you created is marked done' },
                  { label: 'Due date reminders', sub: 'Get reminded 1 day before a task is due' },
                  { label: 'Team mentions', sub: 'Get notified when someone mentions you' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                    <div>
                      <p className="text-sm font-semibold text-gray-700">{item.label}</p>
                      <p className="text-xs text-gray-400">{item.sub}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked={i < 2} className="sr-only peer" />
                      <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-500"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'appearance' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100">
                <h2 className="text-base font-bold text-gray-800">Appearance</h2>
              </div>
              <div className="p-6">
                <p className="text-sm font-semibold text-gray-700 mb-3">Theme</p>
                <div className="flex gap-3">
                  {['Light', 'Dark', 'System'].map((theme) => (
                    <button
                      key={theme}
                      className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                        theme === 'Light'
                          ? 'border-indigo-300 bg-indigo-50 text-indigo-700'
                          : 'border-gray-200 text-gray-500 hover:border-gray-300'
                      }`}
                    >
                      {theme}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
