import React, { useState } from 'react';
import { FileText } from 'lucide-react';
import SideMenu from './SideMenu';
import Documents from './Documents/index';
import Projects from './Projects';
import Assets from './Assets/index';
import DocumentTypes from './DocumentTypes';
import TextBlocks from './TextBlocks';
import Clients from './Clients/index';
import ContactPersons from './ContactPersons';

type ActiveView = 'documents' | 'projects' | 'assets' | 'documentTypes' | 'textBlocks' | 'clients' | 'contactPersons';

const DocumentGenerator: React.FC = () => {
  const [activeView, setActiveView] = useState<ActiveView>('documents');

  const renderContent = () => {
    switch (activeView) {
      case 'documents':
        return <Documents />;
      case 'projects':
        return <Projects />;
      case 'assets':
        return <Assets />;
      case 'documentTypes':
        return <DocumentTypes />;
      case 'textBlocks':
        return <TextBlocks />;
      case 'clients':
        return <Clients />;
      case 'contactPersons':
        return <ContactPersons />;
      default:
        return <Documents />;
    }
  };

  return (
    <div className="h-full flex">
      <SideMenu activeView={activeView} onViewChange={setActiveView} />
      <div className="flex-1 bg-gray-50">
        
        <div className="p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default DocumentGenerator;