import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Plus, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useProjects } from '../../hooks/useProjects';
import type { Project } from '../../api/client';
import { ProjectFormModal } from './ProjectFormModal';

export const ProjectList = () => {
  const { data: projects, createProject, updateProject, deleteProject } = useProjects();
  const location = useLocation();

 const [isFormOpen, setIsFormOpen] = useState(false);
 const [editingProject, setEditingProject] = useState<Project | null>(null);

  const handleCreate = (data: { name: string; color: string }) => {
    createProject({ ...data });
  };

 const handleUpdate = (data: { name: string; color: string }) => {
 if (!editingProject) return;
 updateProject({ id: editingProject.id, ...data });
 setEditingProject(null);
 };

 const handleDelete = (id: string) => {
 if (confirm('Are you sure you want to delete this project?')) {
 deleteProject(id);
 }
 };

 const openEdit = (project: Project) => {
 setEditingProject(project);
 setIsFormOpen(true);
 };

 const openCreate = () => {
 setEditingProject(null);
 setIsFormOpen(true);
 };

 return (
 <>
 <div className="flex items-center justify-between px-3 mb-2">
 <h2 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Projects</h2>
 <button onClick={openCreate} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
 <Plus className="h-4 w-4" />
 </button>
 </div>
 <div className="space-y-1 px-2">
 {projects?.map(project => {
 const isActive = location.pathname === `/projects/${project.id}`;
 return (
 <div key={project.id} className="group relative flex items-center">
 <Link 
 to={`/projects/${project.id}`} 
 className={cn(
 "flex-1 flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
 isActive 
 ? "bg-primary-50 text-primary-700 " 
 : "text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)]"
 )}
 >
 <span 
 className="w-2.5 h-2.5 rounded-full mr-3 shrink-0" 
 style={{ backgroundColor: project.color ? `var(--color-${project.color}-500, ${project.color})` : 'var(--color-gray-500)' }}
 />
 <span className="flex-1 truncate">{project.name}</span>
 </Link>

 <DropdownMenu.Root>
 <DropdownMenu.Trigger asChild>
 <button className={cn(
 "absolute right-2 p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity",
 "text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)]",
 "focus:opacity-100 data-[state=open]:opacity-100"
 )}>
 <MoreHorizontal className="h-4 w-4" />
 </button>
 </DropdownMenu.Trigger>
 <DropdownMenu.Portal>
 <DropdownMenu.Content 
 align="end"
 sideOffset={5}
 className="z-50 min-w-[160px] bg-[var(--bg-surface)] rounded-lg p-1 shadow-lg border border-[var(--border-default)] animate-in fade-in zoom-in-95"
 >
 <DropdownMenu.Item 
 onSelect={() => openEdit(project)}
 className="flex items-center px-2 py-1.5 text-sm outline-none cursor-pointer rounded-md text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] focus:bg-[var(--bg-subtle)]"
 >
 <Pencil className="mr-2 h-4 w-4 text-[var(--text-secondary)]" />
 Edit Project
 </DropdownMenu.Item>
 <DropdownMenu.Separator className="h-px bg-[var(--border-default)] my-1" />
 <DropdownMenu.Item 
 onSelect={() => handleDelete(project.id)}
 className="flex items-center px-2 py-1.5 text-sm outline-none cursor-pointer rounded-md text-red-600 hover:bg-red-50 focus:bg-red-50 :bg-red-900/20 :bg-red-900/20"
 >
 <Trash2 className="mr-2 h-4 w-4 text-red-500" />
 Delete Project
 </DropdownMenu.Item>
 </DropdownMenu.Content>
 </DropdownMenu.Portal>
 </DropdownMenu.Root>
 </div>
 );
 })}
 </div>

 <ProjectFormModal 
 isOpen={isFormOpen} 
 onClose={() => {
 setIsFormOpen(false);
 setEditingProject(null);
 }}
 onSubmit={editingProject ? handleUpdate : handleCreate}
 initialData={editingProject ? { name: editingProject.name, color: editingProject.color || 'gray' } : undefined}
 title={editingProject ? 'Edit Project' : 'New Project'}
 />
 </>
 );
};
