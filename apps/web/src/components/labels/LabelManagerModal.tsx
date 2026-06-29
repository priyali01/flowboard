import React, { useState } from 'react';
import { useLabels } from '../../hooks/useLabels';
import { X, Trash2, Tag } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import { motion, AnimatePresence } from 'framer-motion';

export const LabelManagerModal = ({ onClose }: { onClose: () => void }) => {
  const { data: labels, createLabel, deleteLabel } = useLabels();
  const [name, setName] = useState('');
  const [color, setColor] = useState('#6366f1'); // default indigo

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      createLabel({ name: name.trim(), color });
      setName('');
    }
  };

  return (
    <Dialog.Root open={true} onOpenChange={(open) => !open && onClose()}>
      <AnimatePresence>
        <Dialog.Portal forceMount>
          <Dialog.Overlay asChild>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            />
          </Dialog.Overlay>
          <Dialog.Content asChild>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="fixed left-[50%] top-[50%] z-50 w-full max-w-md translate-x-[-50%] translate-y-[-50%] bg-[var(--bg-surface)] border border-[var(--border-default)] shadow-xl rounded-xl overflow-hidden flex flex-col"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-default)] bg-[var(--bg-subtle)]/50">
                <Dialog.Title className="text-lg font-semibold text-[var(--text-primary)]">Manage Labels</Dialog.Title>
                <Dialog.Close asChild>
                  <button className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                    <X size={20} />
                  </button>
                </Dialog.Close>
              </div>

              <div className="p-6">
                <form onSubmit={handleCreate} className="flex gap-2 mb-6">
                  <div className="relative">
                    <input 
                      type="color" 
                      value={color} 
                      onChange={e => setColor(e.target.value)} 
                      className="w-10 h-10 p-0 border-0 rounded-lg cursor-pointer overflow-hidden" 
                      style={{ backgroundColor: color }}
                    />
                  </div>
                  <input 
                    type="text" 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    placeholder="Label name..." 
                    className="flex-1 bg-[var(--bg-subtle)] border border-[var(--border-default)] rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-[var(--text-primary)] placeholder-[var(--text-disabled)]" 
                  />
                  <button 
                    type="submit" 
                    disabled={!name.trim()} 
                    className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add
                  </button>
                </form>
                
                <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                  {labels?.map(l => (
                    <div key={l.id} className="flex items-center justify-between p-3 bg-[var(--bg-subtle)] rounded-lg border border-[var(--border-default)] group">
                      <div className="flex items-center">
                        <Tag size={16} className="mr-3" style={{ color: l.color }} />
                        <span className="text-sm font-medium text-[var(--text-primary)]">{l.name}</span>
                      </div>
                      <button 
                        onClick={() => deleteLabel(l.id)} 
                        className="text-[var(--text-disabled)] hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                  {labels?.length === 0 && (
                    <div className="text-center py-8">
                      <Tag size={32} className="mx-auto text-[var(--text-disabled)] mb-3 opacity-50" />
                      <p className="text-sm text-[var(--text-secondary)]">No labels yet.</p>
                      <p className="text-xs text-[var(--text-disabled)] mt-1">Create one above to organize your tasks.</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </Dialog.Content>
        </Dialog.Portal>
      </AnimatePresence>
    </Dialog.Root>
  );
};
