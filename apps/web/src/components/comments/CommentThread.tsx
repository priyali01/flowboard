import React from 'react';
import { useComments } from '../../hooks/useComments';
import { useAuthStore } from '../../stores/authStore';
import { formatDistanceToNow } from 'date-fns';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Send, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';

export const CommentThread: React.FC<{ taskId: string }> = ({ taskId }) => {
 const { data: comments, isLoading, createComment, deleteComment } = useComments(taskId);
 const { user } = useAuthStore();
 
 const editor = useEditor({
 extensions: [StarterKit],
 content: '',
 editorProps: {
 attributes: {
 class: 'prose prose-sm focus:outline-none min-h-[80px] p-3 border border-[var(--border-default)] rounded-md bg-[var(--bg-surface)] text-[var(--text-primary)] placeholder-[var(--text-disabled)]',
 },
 },
 });

 const handleSubmit = async () => {
 if (editor && !editor.isEmpty) {
 await createComment(editor.getHTML());
 editor.commands.clearContent();
 }
 };

 return (
 <div className="flex flex-col h-full space-y-4">
 <div className="flex-1 overflow-y-auto space-y-4 pr-2">
 {isLoading ? (
 <p className="text-sm text-[var(--text-secondary)]">Loading comments...</p>
 ) : comments?.length === 0 ? (
 <p className="text-sm text-[var(--text-disabled)] italic text-center py-4">No comments yet. Start the conversation!</p>
 ) : (
 comments?.map(comment => (
 <div key={comment.id} className="flex space-x-3">
 <div className="flex-shrink-0 mt-1">
 <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-sm shadow-sm ring-1 ring-primary-500/20">
 {comment.user.name[0].toUpperCase()}
 </div>
 </div>
 <div className="flex-1 bg-[var(--bg-subtle)] border border-[var(--border-default)] rounded-lg p-3 relative group shadow-sm">
 <div className="flex items-center justify-between mb-2">
 <span className="text-sm font-semibold text-[var(--text-primary)]">{comment.user.name}</span>
 <span className="text-xs text-[var(--text-secondary)] font-medium">
 {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
 </span>
 </div>
 <div className="prose prose-sm text-[var(--text-secondary)] max-w-none" dangerouslySetInnerHTML={{ __html: comment.content }} />
 
 {user?.id === comment.user.id && (
 <button 
 onClick={() => {
 if(window.confirm('Delete comment?')) deleteComment(comment.id);
 }}
 className="absolute -top-2 -right-2 p-1.5 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-full text-[var(--text-disabled)] hover:text-red-500 shadow-sm opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
 >
 <Trash2 size={14} />
 </button>
 )}
 </div>
 </div>
 ))
 )}
 </div>

 <div className="mt-auto pt-4 border-t border-[var(--border-default)]">
 <EditorContent editor={editor} />
 <div className="mt-3 flex justify-end">
 <Button 
 onClick={handleSubmit}
 size="sm"
 className="flex items-center"
 >
 <Send size={14} className="mr-2" />
 Comment
 </Button>
 </div>
 </div>
 </div>
 );
};
