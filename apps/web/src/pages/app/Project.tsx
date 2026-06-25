import { useParams } from 'react-router-dom';
import { useProjects } from '../../hooks/useProjects';
import { TaskList } from '../../components/tasks/TaskList';

export const ProjectView = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { data: projects } = useProjects();
  
  const project = projects?.find(p => p.id === projectId);

  if (!projectId) return <div>No project selected</div>;

  return (
    <div className="p-8 h-full bg-white">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        {project?.name || 'Loading project...'}
      </h1>
      
      <TaskList projectId={projectId} />
    </div>
  );
};
