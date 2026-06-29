import { Construction } from 'lucide-react';

export const ComingSoon = ({ title }: { title: string }) => (
 <div className="flex flex-col items-center justify-center h-[60vh] text-center">
 <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mb-4">
 <Construction size={32} className="text-primary-500" />
 </div>
 <h2 className="text-xl font-bold text-gray-800 mb-2">{title}</h2>
 <p className="text-sm text-gray-500 max-w-sm">
 This page is coming soon. We're working hard to bring you an amazing experience.
 </p>
 </div>
);

export const TeamPage = () => <ComingSoon title="Team Collaboration" />;
export const MessagesPage = () => <ComingSoon title="Messages" />;
export const SettingsPage = () => <ComingSoon title="Settings" />;
