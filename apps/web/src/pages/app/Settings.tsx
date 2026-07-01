import { useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { User, Lock, Bell, Palette, ChevronRight, Check, Loader2, Monitor } from 'lucide-react';

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
    <div className="pb-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-0.5">Manage your account and workspace preferences.</p>
      </div>

      {/* Horizontal Tabs */}
      <div className="flex items-center gap-8 border-b border-gray-200 mb-8 overflow-x-auto hide-scrollbar">
        {settingsSections.map((section) => {
          const isActive = activeSection === section.id;
          return (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`pb-3 text-sm font-semibold transition-all relative whitespace-nowrap ${
                isActive ? 'text-gray-900' : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              {section.label}
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#5961F9] via-[#A855F7] to-[#F97316] rounded-t-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="min-w-0">
        {activeSection === 'profile' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="px-6 py-5 border-b border-gray-100">
              <h2 className="text-base font-bold text-gray-800">Profile Information</h2>
              <p className="text-sm text-gray-400 mt-0.5">Update your personal details</p>
            </div>
            <form onSubmit={handleSaveProfile} className="p-6 space-y-6">
              {/* Avatar */}
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-primary-500 to-purple-400 flex items-center justify-center text-white font-black text-3xl shadow-md border-4 border-white">
                  {user?.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <div>
                  <div className="flex gap-3 mb-2">
                    <button type="button" className="px-4 py-1.5 bg-gray-900 text-white rounded-xl text-sm font-semibold shadow-sm hover:bg-gray-800 transition-colors">Upload</button>
                    <button type="button" className="px-4 py-1.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors">Remove</button>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">Recommended size: 256x256px.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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

                {/* Username */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Username <span className="text-gray-400 font-normal">(optional)</span></label>
                  <div className="relative">
                    <span className="absolute left-4 top-2.5 text-gray-400 font-medium">@</span>
                    <input type="text" className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400/30 focus:border-indigo-400 transition-all text-gray-800" placeholder="username" />
                  </div>
                </div>

                {/* Email */}
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

                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone Number</label>
                  <input type="tel" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400/30 focus:border-indigo-400 transition-all text-gray-800" placeholder="+1 (555) 000-0000" />
                </div>

                {/* Timezone */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Timezone</label>
                  <select className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400/30 focus:border-indigo-400 transition-all text-gray-800 bg-white">
                    <option>Pacific Time (PT)</option>
                    <option>Eastern Time (ET)</option>
                    <option>Coordinated Universal Time (UTC)</option>
                  </select>
                </div>

                {/* Language */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Language</label>
                  <select className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400/30 focus:border-indigo-400 transition-all text-gray-800 bg-white">
                    <option>English (US)</option>
                    <option>Spanish</option>
                    <option>French</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex items-center gap-3 border-t border-gray-100">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#5961F9] via-[#A855F7] to-[#F97316] text-white rounded-xl text-sm font-bold hover:opacity-90 transition-all shadow-md hover:shadow-lg disabled:opacity-60"
                >
                  {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                  Save Changes
                </button>
                {saved && <span className="text-sm text-green-600 font-semibold animate-in fade-in zoom-in">✓ Profile Updated</span>}
              </div>
            </form>
          </div>
        )}

        {activeSection === 'account' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="px-6 py-5 border-b border-gray-100">
              <h2 className="text-base font-bold text-gray-800">Account & Security</h2>
              <p className="text-sm text-gray-400 mt-0.5">Manage your password and security settings</p>
            </div>
            <div className="p-6 space-y-8">
              {/* Password Section */}
              <section>
                <h3 className="text-sm font-bold text-gray-800 mb-4">Change Password</h3>
                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Current Password</label>
                    <input type="password" placeholder="••••••••" className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400/30 focus:border-indigo-400" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">New Password</label>
                    <input type="password" placeholder="••••••••" className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400/30 focus:border-indigo-400" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirm New Password</label>
                    <input type="password" placeholder="••••••••" className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400/30 focus:border-indigo-400" />
                  </div>
                  <button className="px-5 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-gray-800 shadow-sm hover:shadow transition-all">Update Password</button>
                </div>
              </section>

              <hr className="border-gray-100" />

              {/* 2FA */}
              <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-gray-800">Two-factor Authentication</h3>
                  <p className="text-xs text-gray-500 mt-1 max-w-sm leading-relaxed">Add an extra layer of security to your account by requiring a code from an authenticator app.</p>
                </div>
                <button className="px-4 py-2 bg-indigo-50 text-indigo-600 border border-indigo-200 rounded-xl text-sm font-bold hover:bg-indigo-100 transition-colors whitespace-nowrap">Enable 2FA</button>
              </section>

              <hr className="border-gray-100" />

              {/* Active Sessions */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-gray-800">Active Sessions</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Devices currently signed in to your account</p>
                  </div>
                  <button className="text-sm font-semibold text-red-500 hover:text-red-600 transition-colors">Log out of all</button>
                </div>
                <div className="border border-gray-200 rounded-xl divide-y divide-gray-100">
                  <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between bg-gray-50/50 gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center shadow-sm">
                         <Monitor size={18} className="text-gray-500" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-800">MacBook Pro • Chrome</p>
                        <p className="text-xs text-gray-500 mt-0.5">San Francisco, CA • Active now</p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-green-600 bg-green-50 border border-green-100 px-2 py-1 rounded-lg w-fit">Current</span>
                  </div>
                </div>
              </section>
            </div>
          </div>
        )}

        {activeSection === 'notifications' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="px-6 py-5 border-b border-gray-100">
              <h2 className="text-base font-bold text-gray-800">Notifications</h2>
              <p className="text-sm text-gray-400 mt-0.5">Choose how you want to be notified</p>
            </div>
            <div className="p-6 space-y-8">
              {[
                { title: 'Email Notifications', items: [
                  { label: 'Weekly Summary', sub: 'Receive a weekly digest of your tasks', on: true },
                  { label: 'Project Updates', sub: 'When a project you are in is updated', on: false }
                ]},
                { title: 'Push Notifications', items: [
                  { label: 'Task Due Alerts', sub: 'Get notified when a task is due soon', on: true },
                  { label: 'Reminder Preferences', sub: 'Remind me about tasks I have ignored', on: true },
                  { label: 'Team Mentions', sub: 'When someone @mentions you', on: true }
                ]}
              ].map((group, idx) => (
                <div key={idx}>
                  <h3 className="text-xs font-bold text-gray-400 mb-4 uppercase tracking-wider">{group.title}</h3>
                  <div className="space-y-1">
                    {group.items.map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors">
                        <div>
                          <p className="text-sm font-semibold text-gray-700">{item.label}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{item.sub}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" defaultChecked={item.on} className="sr-only peer" />
                          <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-500"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'appearance' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="px-6 py-5 border-b border-gray-100">
              <h2 className="text-base font-bold text-gray-800">Appearance</h2>
              <p className="text-sm text-gray-400 mt-0.5">Customize your workspace</p>
            </div>
            <div className="p-6 space-y-8">
              <section>
                <h3 className="text-sm font-semibold text-gray-700 mb-4">Theme</h3>
                <div className="grid grid-cols-3 gap-4 max-w-sm">
                  {['Light', 'Dark', 'System'].map((theme) => (
                    <button key={theme} className={`p-4 rounded-xl border-2 transition-all hover:-translate-y-1 hover:shadow-md ${theme === 'Light' ? 'border-primary-500 bg-primary-50/50' : 'border-gray-100 hover:border-gray-300 bg-white'}`}>
                      <div className={`w-full h-12 rounded-lg bg-gray-100 mb-3 border border-gray-200 ${theme === 'Dark' ? 'bg-gray-800 border-gray-700' : ''} ${theme === 'System' ? 'bg-gradient-to-r from-gray-100 to-gray-800' : ''}`} />
                      <p className="text-sm font-bold text-gray-700 text-center">{theme}</p>
                    </button>
                  ))}
                </div>
              </section>
              
              <section>
                <h3 className="text-sm font-semibold text-gray-700 mb-4">Accent Color</h3>
                <div className="flex gap-4">
                   <button className="w-8 h-8 rounded-full bg-primary-500 ring-2 ring-offset-2 ring-primary-500" />
                   <button className="w-8 h-8 rounded-full bg-pink-500 hover:scale-110 transition-transform" />
                   <button className="w-8 h-8 rounded-full bg-emerald-500 hover:scale-110 transition-transform" />
                   <button className="w-8 h-8 rounded-full bg-orange-500 hover:scale-110 transition-transform" />
                   <button className="w-8 h-8 rounded-full bg-blue-500 hover:scale-110 transition-transform" />
                </div>
              </section>

              <hr className="border-gray-100" />

              <section>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700">Sidebar Density</h3>
                    <p className="text-xs text-gray-400 mt-0.5">Compact or comfortable spacing</p>
                  </div>
                  <select className="px-3 py-2 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary-400/30 text-gray-700 bg-white">
                    <option>Comfortable</option>
                    <option>Compact</option>
                  </select>
                </div>
              </section>

              <section>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700">UI Animations</h3>
                    <p className="text-xs text-gray-400 mt-0.5">Reduce motion for accessibility</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-500"></div>
                  </label>
                </div>
              </section>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
