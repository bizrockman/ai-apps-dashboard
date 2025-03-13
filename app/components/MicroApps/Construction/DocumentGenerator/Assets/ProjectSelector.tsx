import React from 'react';
import { Project } from '../../../../../lib/database/models/Project';

interface ProjectSelectorProps {
  projects: Project[];
  selectedProject: Project | null;
  onSelect: (project: Project | null) => void;
}

const ProjectSelector: React.FC<ProjectSelectorProps> = ({ projects, selectedProject, onSelect }) => {
  return (
    <select
      value={selectedProject?.id || ''}
      onChange={(e) => {
        const project = projects.find(p => p.id === Number(e.target.value));
        onSelect(project || null);
      }}
      className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
    >
      <option value="">Select a project</option>
      {projects.map((project) => (
        <option key={project.id} value={project.id}>
          {project.name}
        </option>
      ))}
    </select>
  );
};

export default ProjectSelector