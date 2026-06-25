import React from 'react';
import { useComments } from '../../hooks/useComments';
import { useAuthStore } from '../../stores/authStore';
import { formatDistanceToNow } from 'date-fns';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Send, Trash2 } from 'lucide-react';

export const CommentThread: React.FC<{ taskId: string }> = ({ taskId }) => {
  const { data: comments, isLoading, createComment, deleteComment } = useComments(taskId);
  const { user } = useAuthStore();
  
  const editor = useEditor({
    extensions: [StarterKit],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-sm focus:outline-none min-h-[80px] p-2 border border-gray-300 rounded-md bg-white',
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
          <p className="text-sm text-gray-500">Loading comments...</p>
        ) : comments?.length === 0 ? (
          <p className="text-sm text-gray-500 italic">No comments yet.</p>
        ) : (
          comments?.map(comment => (
            <div key={comment.id} className="flex space-x-3">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm">
                  {comment.user.name[0].toUpperCase()}
                </div>
              </div>
              <div className="flex-1 bg-gray-50 border border-gray-100 rounded-lg p-3 relative group">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-900">{comment.user.name}</span>
                  <span className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                  </span>
                </div>
                <div className="prose prose-sm text-gray-700 max-w-none" dangerouslySetInnerHTML={{ __html: comment.content }} />
                
                {user?.id === comment.user.id && (
                  <button 
                    onClick={() => {
                      if(window.confirm('Delete comment?')) deleteComment(comment.id);
                    }}
                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-auto pt-4 border-t border-gray-200">
        <EditorContent editor={editor} />
        <div className="mt-2 flex justify-end">
          <button 
            onClick={handleSubmit}
            className="flex items-center bg-indigo-600 text-white px-3 py-1.5 rounded-md text-sm hover:bg-indigo-700 font-medium"
          >
            <Send size={14} className="mr-1" />
            Comment
          </button>
        </div>
      </div>
    </div>
  );
};
