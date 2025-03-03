import React from 'react';
import { Client } from '../../../../../../lib/database/models/Client';
import { Project } from '../../../../../../lib/database/models/Project';
import { DocumentType } from '../../../../../../lib/database/models/DocumentType';
import { ConstructionElement } from '../../../../../../lib/database/models/ConstructionElement';

interface SelectionStepProps {
  clients: Client[];
  projects: Project[];
  documentTypes: DocumentType[];
  elements: ConstructionElement[];
  selectedClient: string | '';
  selectedProject: string | '';
  selectedElement: string | '';
  selectedType: string | '';
  onClientChange: (clientId: string | '') => void;
  onProjectChange: (projectId: string | '') => void;
  onElementChange: (elementId: string | '') => void;
  onTypeChange: (typeId: string | '') => void;
  disabled?: boolean;
}

const SelectionStep: React.FC<SelectionStepProps> = ({
  clients,
  projects,
  documentTypes,
  elements,
  selectedClient,
  selectedProject,
  selectedElement,
  selectedType,
  onClientChange,
  onProjectChange,
  onElementChange,
  onTypeChange,
  disabled
}) => {
  // Filter projects by selected client
  const availableProjects = selectedClient
    ? projects.filter(p => p.clientId === selectedClient)
    : [];

  // Filter elements by selected project
  const availableElements = selectedProject
    ? elements.filter(e => e.projectId === selectedProject)
    : [];

  return (
    <div className="space-y-4 bg-white p-4 border-b">
      {/* Client Selection */}
      <div className="w-full">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Client
        </label>
        <select
          value={selectedClient}
          onChange={(e) => onClientChange(e.target.value ? e.target.value : '')}
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
          disabled={disabled}
        >
          <option value="">Select Client</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.name}
            </option>
          ))}
        </select>
      </div>

      {/* Project Selection */}
      {selectedClient && (
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Project
          </label>
          <select
            value={selectedProject}
            onChange={(e) => onProjectChange(e.target.value ? e.target.value : '')}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
            disabled={disabled}
          >
            <option value="">Select Project</option>
            {availableProjects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Element Selection */}
      {selectedProject && (
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Construction Element
          </label>
          <select
            value={selectedElement}
            onChange={(e) => onElementChange(e.target.value ? e.target.value : '')}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
            disabled={disabled}
          >
            <option value="">Select Element</option>
            {availableElements.map((element) => (
              <option key={element.id} value={element.id}>
                {element.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Document Type Selection */}
      {selectedElement && (
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Document Type
          </label>
          <select
            value={selectedType}
            onChange={(e) => onTypeChange(e.target.value ? e.target.value : '')}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
            disabled={disabled}
          >
            <option value="">Select Type</option>
            {documentTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default SelectionStep;