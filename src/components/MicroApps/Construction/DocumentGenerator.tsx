import React, { useState } from 'react';
import { FileText } from 'lucide-react';
import SideMenu from './SideMenu';
import Document from './Document';
import Projects from './Projects';
import Assets from './Assets';
import DocumentTypes from './DocumentTypes';
import TextBlocks from './TextBlocks';

const DocumentGenerator: React.FC = () => {
  const [selectedComponent, setSelectedComponent] = useState<string>('Document');

  const renderComponent = () => {
    switch (selectedComponent) {
      case 'Document':
        return <Document />;
      case 'Projects':
        return <Projects />;
      case 'Assets':
        return <Assets />;
      case 'DocumentTypes':
        return <DocumentTypes />;
      case 'TextBlocks':
        return <TextBlocks />;
      default:
        return <Document />;
    }
  };

  return (
    <div className="h-full flex">
      <SideMenu onSelect={setSelectedComponent} />
      <div className="flex-1 p-4">
        {renderComponent()}
      </div>
    </div>
  );
};

export default DocumentGenerator;