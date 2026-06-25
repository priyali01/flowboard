import React, { useState } from 'react';
import { useLabels } from '../../hooks/useLabels';
import { X, Trash2 } from 'lucide-react';

export const LabelManagerModal = ({ onClose }: { onClose: () => void }) => {
  const { data: labels, createLabel, deleteLabel } = useLabels();
  const [name, setName] = useState('');
  const [color, setColor] = useState('#3b82f6'); // default blue

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      createLabel({ name: name.trim(), color });
      setName('');
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-medium">Manage Labels</h2>
          <button onClick={onClose}><X size={20} className="text-gray-400 hover:text-gray-600" /></button>
        </div>
        <div className="p-4">
          <form onSubmit={handleCreate} className="flex gap-2 mb-4">
            <input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-10 h-10 p-1 border rounded" />
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Label name" className="flex-1 border rounded p-2 text-sm" />
            <button type="submit" disabled={!name.trim()} className="bg-indigo-600 text-white px-4 py-2 rounded text-sm disabled:opacity-50">Add</button>
          </form>
          
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {labels?.map(l => (
              <div key={l.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded border border-transparent hover:border-gray-100">
                <div className="flex items-center">
                  <span className="w-4 h-4 rounded-full mr-3" style={{ backgroundColor: l.color }}></span>
                  <span className="text-sm font-medium text-gray-700">{l.name}</span>
                </div>
                <button onClick={() => deleteLabel(l.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={16} /></button>
              </div>
            ))}
            {labels?.length === 0 && <p className="text-sm text-gray-500 text-center py-4">No labels yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};
