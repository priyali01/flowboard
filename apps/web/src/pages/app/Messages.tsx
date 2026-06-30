import { MessageSquare, Inbox } from 'lucide-react';

export const MessagesPage = () => (
  <div className="max-w-3xl mx-auto px-6 py-8">
    <div className="mb-8">
      <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
      <p className="text-sm text-gray-500 mt-0.5">Team conversations and direct messages</p>
    </div>

    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
        <Inbox size={18} className="text-indigo-500" />
        <span className="text-base font-bold text-gray-800">Inbox</span>
        <span className="ml-auto text-xs font-semibold text-gray-400 bg-gray-100 px-2.5 py-1 rounded-lg">0 messages</span>
      </div>

      <div className="flex flex-col items-center justify-center py-20 text-center px-8">
        <div className="relative mb-5">
          <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center">
            <MessageSquare size={32} className="text-indigo-400" />
          </div>
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-[#5961F9] to-[#A855F7] rounded-full flex items-center justify-center">
            <span className="text-[10px] text-white font-bold">0</span>
          </div>
        </div>
        <h3 className="text-lg font-bold text-gray-700 mb-1">No messages yet</h3>
        <p className="text-sm text-gray-400 max-w-xs">
          Team messaging is coming soon. You'll be able to discuss tasks, share updates, and collaborate in real-time.
        </p>
        <div className="mt-6 px-4 py-3 bg-indigo-50 rounded-xl text-sm text-indigo-600 font-medium">
          💡 Tip: Use task comments to collaborate for now
        </div>
      </div>
    </div>
  </div>
);
