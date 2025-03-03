import React from 'react';
import { X } from 'lucide-react';
import { Client } from '../../../../../../lib/database/models/Client';
import { Project } from '../../../../../../lib/database/models/Project';
import { DocumentType } from '../../../../../../lib/database/models/DocumentType';
import { ConstructionElement } from '../../../../../../lib/database/models/ConstructionElement';

interface SelectionSummaryProps {
  clients: Client[];
  projects: Project[];
  documentTypes: DocumentType[];
  elements: ConstructionElement[];
  selectedClient: string;
  selectedProject: string;
  selectedElement: string;
  selectedType: string;
  onReset: () => void;
}

const SelectionSummary: React.FC<SelectionSummaryProps> = ({
  clients,
  projects,
  documentTypes,
  elements,
  selectedClient,
  selectedProject,
  selectedElement,
  selectedType,
  onReset
}) => {
  return (
    <div className="flex items-center justify-between bg-gray-50 p-4 border-b">
      <div className="space-x-2">
        <span className="text-gray-600">Selected:</span>
        <span className="font-medium">
          {clients.find(c => c.id === selectedClient)?.name} →{' '}
          {projects.find(p => p.id === selectedProject)?.name} →{' '}
          {elements.find(e => e.id === selectedElement)?.name} →{' '}
          {documentTypes.find(t => t.id === selectedType)?.name}
        </span>
      </div>
      <button
        onClick={onReset}
        className="text-gray-500 hover:text-gray-700"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
};

export default SelectionSummary;