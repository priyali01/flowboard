import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { useProjects } from '../../hooks/useProjects';
import { Folder, LogOut, Plus } from 'lucide-react';

export const AppLayout = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const { data: projects, isLoading, createProject, isCreating } = useProjects();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleCreateProject = () => {
    const name = prompt('Enter project name:');
    if (name) {
      createProject({ name });
    }
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <div className="w-64 flex-shrink-0 border-r border-gray-200 bg-gray-50 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">FlowBoard</h1>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Projects</h2>
            <button 
              onClick={handleCreateProject}
              disabled={isCreating}
              className="text-gray-400 hover:text-gray-600"
            >
              <Plus size={18} />
            </button>
          </div>
          
          <nav className="space-y-1">
            {isLoading ? (
              <div className="text-sm text-gray-500">Loading projects...</div>
            ) : projects?.length === 0 ? (
              <div className="text-sm text-gray-500 italic">No projects yet.</div>
            ) : (
              projects?.map((project) => (
                <Link
                  key={project.id}
                  to={`/projects/${project.id}`}
                  className="flex items-center px-2 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100"
                >
                  <Folder className="mr-3 flex-shrink-0 h-5 w-5 text-gray-400" />
                  {project.name}
                </Link>
              ))
            )}
          </nav>
        </div>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center mb-4">
            <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">{user?.name}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-2 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100"
          >
            <LogOut className="mr-3 h-5 w-5 text-gray-400" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};
