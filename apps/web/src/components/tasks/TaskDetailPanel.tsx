import React, { useState, useEffect } from 'react';
import type { Task } from '../../api/client';
import { useTasks } from '../../hooks/useTasks';
import { useLabels } from '../../hooks/useLabels';
import { X, Flag, Tag, CheckCircle, Circle, Plus, Trash2, MessageSquare, Activity as ActivityIcon, CheckSquare } from 'lucide-react';
import classNames from 'classnames';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { CommentThread } from '../comments/CommentThread';
import { ActivityFeed } from '../activity/ActivityFeed';

interface TaskDetailPanelProps {
  task: Task;
  projectId: string;
  onClose: () => void;
}

export const TaskDetailPanel: React.FC<TaskDetailPanelProps> = ({ task, projectId, onClose }) => {
  const { updateTask, createTask, deleteTask } = useTasks(projectId);
  const { data: globalLabels } = useLabels();
  
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [activeTab, setActiveTab] = useState<'SUBTASKS' | 'COMMENTS' | 'ACTIVITY'>('SUBTASKS');

  const editor = useEditor({
    extensions: [StarterKit],
    content: task.description || '',
    editable: isEditingDesc,
    editorProps: {
      attributes: {
        class: classNames('prose prose-sm focus:outline-none min-h-[100px] rounded-md transition-colors', {
          'p-3 bg-white border border-indigo-300 shadow-sm': isEditingDesc,
          'p-3 bg-gray-50 border border-transparent hover:bg-gray-100 cursor-text': !isEditingDesc
        }),
      },
    },
  });

  useEffect(() => {
    if (editor) {
      editor.setEditable(isEditingDesc);
    }
  }, [isEditingDesc, editor]);

  useEffect(() => {
    if (editor && task.description !== editor.getHTML() && !isEditingDesc) {
      editor.commands.setContent(task.description || '');
    }
  }, [task.id, editor]);

  const handleDescSave = () => {
    if (editor) {
      updateTask({ id: task.id, description: editor.getHTML() });
      setIsEditingDesc(false);
    }
  };

  const toggleStatus = () => {
    updateTask({ id: task.id, status: task.status === 'DONE' ? 'TODO' : 'DONE' });
  };

  const handlePriorityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateTask({ id: task.id, priority: e.target.value as any });
  };

  const handleCreateSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSubtaskTitle.trim()) {
      createTask({ projectId, title: newSubtaskTitle.trim(), parentId: task.id });
      setNewSubtaskTitle('');
    }
  };

  const toggleLabel = (labelId: string) => {
    const currentLabelIds = task.labels?.map(l => l.id) || [];
    const newLabelIds = currentLabelIds.includes(labelId)
      ? currentLabelIds.filter(id => id !== labelId)
      : [...currentLabelIds, labelId];
    updateTask({ id: task.id, labelIds: newLabelIds });
  };

  return (
    <div className="fixed inset-y-0 right-0 w-[450px] bg-white shadow-2xl border-l border-gray-200 z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100 flex-shrink-0">
        <button 
          onClick={toggleStatus}
          className={classNames('flex items-center text-sm font-medium px-3 py-1.5 rounded-md border transition-colors', {
            'text-gray-700 bg-white hover:bg-gray-50 border-gray-300': task.status !== 'DONE',
            'text-green-700 bg-green-50 border-green-200 hover:bg-green-100': task.status === 'DONE',
          })}
        >
          {task.status === 'DONE' ? <CheckCircle size={16} className="mr-2" /> : <Circle size={16} className="mr-2" />}
          {task.status === 'DONE' ? 'Completed' : 'Mark Complete'}
        </button>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto flex flex-col">
        {/* Top Content: Title, Meta, Desc */}
        <div className="p-6 space-y-6 flex-shrink-0">
          {/* Title */}
          <h2 className="text-xl font-bold text-gray-900">{task.title}</h2>

          {/* Meta properties */}
          <div className="grid grid-cols-3 gap-y-4 text-sm text-gray-500">
            <div className="flex items-center"><Flag size={16} className="mr-2" /> Priority</div>
            <div className="col-span-2">
              <select 
                value={task.priority}
                onChange={handlePriorityChange}
                className="border-none bg-transparent focus:ring-0 p-0 font-medium cursor-pointer hover:bg-gray-50 rounded"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>

            <div className="flex items-start mt-2"><Tag size={16} className="mr-2 mt-1" /> Labels</div>
            <div className="col-span-2 flex flex-wrap gap-1 mt-2">
              {task.labels?.map(l => (
                <span key={l.id} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: l.color + '20', color: l.color }}>
                  {l.name}
                </span>
              ))}
              <div className="group relative">
                <button className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600 hover:bg-gray-200">
                  <Plus size={12} className="mr-1" /> Add Label
                </button>
                <div className="hidden group-hover:block absolute top-full left-0 mt-1 w-48 bg-white shadow-lg rounded-md border border-gray-200 z-10 p-2">
                  {globalLabels?.map(l => (
                    <div 
                      key={l.id} 
                      className="flex items-center px-2 py-1 hover:bg-gray-50 cursor-pointer rounded"
                      onClick={() => toggleLabel(l.id)}
                    >
                      <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: l.color }}></div>
                      <span className="text-sm flex-1">{l.name}</span>
                      {task.labels?.some(tl => tl.id === l.id) && <CheckCircle size={14} className="text-indigo-600" />}
                    </div>
                  ))}
                  {globalLabels?.length === 0 && (
                    <div className="text-xs text-gray-500 px-1 py-1">No labels created yet.</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-2">Description</h3>
            <div onClick={() => { if (!isEditingDesc) setIsEditingDesc(true); }}>
              <EditorContent editor={editor} />
              {!isEditingDesc && (!task.description || task.description === '<p></p>') && (
                <div className="text-gray-400 text-sm italic mt-[-70px] ml-4 pointer-events-none">Add a more detailed description...</div>
              )}
            </div>
            
            {isEditingDesc && (
              <div className="flex space-x-2 mt-2">
                <button onClick={handleDescSave} className="bg-indigo-600 text-white px-3 py-1 rounded text-sm font-medium hover:bg-indigo-700">Save</button>
                <button 
                  onClick={() => { 
                    setIsEditingDesc(false); 
                    editor?.commands.setContent(task.description || ''); 
                  }} 
                  className="bg-white text-gray-700 border border-gray-300 px-3 py-1 rounded text-sm font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="border-t border-gray-200 flex-shrink-0">
          <div className="flex px-6 space-x-6 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('SUBTASKS')}
              className={classNames('py-3 text-sm font-medium border-b-2 flex items-center transition-colors', {
                'border-indigo-500 text-indigo-600': activeTab === 'SUBTASKS',
                'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300': activeTab !== 'SUBTASKS',
              })}
            >
              <CheckSquare size={16} className="mr-2" /> Subtasks
            </button>
            <button
              onClick={() => setActiveTab('COMMENTS')}
              className={classNames('py-3 text-sm font-medium border-b-2 flex items-center transition-colors', {
                'border-indigo-500 text-indigo-600': activeTab === 'COMMENTS',
                'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300': activeTab !== 'COMMENTS',
              })}
            >
              <MessageSquare size={16} className="mr-2" /> Comments
            </button>
            <button
              onClick={() => setActiveTab('ACTIVITY')}
              className={classNames('py-3 text-sm font-medium border-b-2 flex items-center transition-colors', {
                'border-indigo-500 text-indigo-600': activeTab === 'ACTIVITY',
                'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300': activeTab !== 'ACTIVITY',
              })}
            >
              <ActivityIcon size={16} className="mr-2" /> Activity
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6 flex-1 overflow-hidden flex flex-col">
          {activeTab === 'SUBTASKS' && (
            <div className="flex-1 overflow-y-auto">
              <div className="space-y-2 mb-3">
                {task.subtasks?.map(sub => (
                  <div key={sub.id} className="flex items-center group bg-gray-50 p-2 rounded-md border border-gray-100">
                    <button onClick={() => updateTask({ id: sub.id, status: sub.status === 'DONE' ? 'TODO' : 'DONE' })}>
                      {sub.status === 'DONE' ? <CheckCircle size={16} className="text-green-500 mr-2" /> : <Circle size={16} className="text-gray-300 hover:text-indigo-500 mr-2" />}
                    </button>
                    <span className={classNames('text-sm flex-1', {'line-through text-gray-400': sub.status === 'DONE', 'text-gray-700': sub.status !== 'DONE'})}>{sub.title}</span>
                    <button onClick={() => deleteTask({ id: sub.id, projectId })} className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
              <form onSubmit={handleCreateSubtask} className="flex items-center mt-4">
                <Plus size={16} className="text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Add a subtask..."
                  value={newSubtaskTitle}
                  onChange={e => setNewSubtaskTitle(e.target.value)}
                  className="flex-1 text-sm border-0 focus:ring-0 p-1 bg-transparent"
                />
              </form>
            </div>
          )}

          {activeTab === 'COMMENTS' && (
            <div className="flex-1 overflow-hidden">
              <CommentThread taskId={task.id} />
            </div>
          )}

          {activeTab === 'ACTIVITY' && (
            <div className="flex-1 overflow-hidden">
              <ActivityFeed taskId={task.id} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
