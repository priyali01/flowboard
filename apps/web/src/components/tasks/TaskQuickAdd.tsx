import React, { useState } from 'react';
import { Plus } from 'lucide-react';

export interface TaskQuickAddProps {
  onAdd: (title: string) => void;
  placeholder?: string;
}

export const TaskQuickAdd = ({ onAdd, placeholder = "Add a task..." }: TaskQuickAddProps) => {
  const [title, setTitle] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd(title.trim());
      setTitle('');
    }
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className={`group flex items-center py-2 px-1 border-b border-[var(--border-default)] transition-colors ${isFocused ? 'bg-[var(--bg-subtle)]' : 'hover:bg-[var(--bg-subtle)]'}`}
    >
      <div className="w-5 h-5 mr-3 flex items-center justify-center ml-5">
        <Plus className={`h-4 w-4 transition-colors ${isFocused || title ? 'text-primary-500' : 'text-[var(--text-secondary)] group-hover:text-primary-500'}`} />
      </div>
      
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className="flex-1 bg-transparent border-none outline-none text-sm font-medium text-[var(--text-primary)] placeholder:text-[var(--text-disabled)]"
      />
    </form>
  );
};
