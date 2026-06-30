import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjects } from '../../hooks/useProjects';
import { Plus, FolderOpen, CheckCircle2, Circle, Loader2 } from 'lucide-react';

const projectColors = [
  { label: 'Indigo', value: '#5961F9' },
  { label: 'Purple', value: '#A855F7' },
  { label: 'Pink', value: '#EC4899' },
  { label: 'Orange', value: '#F97316' },
  { label: 'Emerald', value: '#10B981' },
  { label: 'Sky', value: '#0EA5E9' },
  { label: 'Rose', value: '#F43F5E' },
  { label: 'Amber', value: '#F59E0B' },
];

const CreateProjectModal = ({ onClose }: { onClose: () => void }) => {
  const [name, setName] = useState('');
  const [color, setColor] = useState('#5961F9');
  const { createProject, isCreating } = useProjects();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    await createProject({ name: name.trim(), color });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800">New Project</h2>
          <p className="text-sm text-gray-500 mt-0.5">Create a new project to organize your tasks</p>
        </div>
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Project Name</label>
            <input
              autoFocus
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Website Redesign"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400/30 focus:border-indigo-400 transition-all text-gray-800"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Color</label>
            <div className="flex flex-wrap gap-2">
              {projectColors.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setColor(c.value)}
                  className="w-8 h-8 rounded-full transition-all hover:scale-110 flex items-center justify-center"
                  style={{ backgroundColor: c.value }}
                  title={c.label}
                >
                  {color === c.value && <CheckCircle2 size={16} className="text-white drop-shadow" />}
                </button>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-all">
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim() || isCreating}
              className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-[#5961F9] via-[#A855F7] to-[#F97316] text-white rounded-xl text-sm font-bold hover:opacity-90 transition-all disabled:opacity-50"
            >
              {isCreating ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const Projects = () => {
  const navigate = useNavigate();
  const { data: projects, isLoading } = useProjects();
  const [showCreateModal, setShowCreateModal] = useState(false);

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="h-8 w-32 bg-gray-200 rounded-xl animate-pulse mb-2"></div>
            <div className="h-4 w-48 bg-gray-100 rounded-lg animate-pulse"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-5 h-36 animate-pulse border border-gray-100 shadow-sm"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="text-sm text-gray-500 mt-0.5">{projects?.length || 0} project{projects?.length !== 1 ? 's' : ''} in your workspace</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#5961F9] via-[#A855F7] to-[#F97316] text-white rounded-xl text-sm font-bold hover:opacity-90 shadow-md shadow-indigo-200 hover:shadow-lg transition-all"
        >
          <Plus size={16} /> New Project
        </button>
      </div>

      {/* Empty State */}
      {!projects || projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-dashed border-gray-200 shadow-sm">
          <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-4">
            <FolderOpen size={32} className="text-indigo-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-700 mb-1">No projects yet</h3>
          <p className="text-sm text-gray-400 max-w-xs mb-5">Create your first project to start organizing tasks by teams, goals, or initiatives.</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#5961F9] via-[#A855F7] to-[#F97316] text-white rounded-xl text-sm font-bold hover:opacity-90 transition-all"
          >
            <Plus size={16} /> Create First Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <button
              key={project.id}
              onClick={() => navigate(`/projects/${project.id}`)}
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all text-left group"
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
                  style={{ backgroundColor: `${project.color || '#5961F9'}18` }}
                >
                  <FolderOpen size={20} style={{ color: project.color || '#5961F9' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-gray-800 truncate group-hover:text-indigo-600 transition-colors">{project.name}</h3>
                  <p className="text-xs text-gray-400 font-medium mt-0.5">
                    {new Date(project.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
                <div
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: project.color || '#5961F9' }}
                />
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Circle size={12} />
                <span>Click to open project</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {showCreateModal && <CreateProjectModal onClose={() => setShowCreateModal(false)} />}
    </div>
  );
};
