import React from 'react';
import { FileText, FolderOpen, Image, FileStack, Blocks, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type ActiveView = 'documents' | 'projects' | 'assets' | 'documentTypes' | 'textBlocks' | 'clients';

interface SideMenuProps {
  activeView: ActiveView;
  onViewChange: (view: ActiveView) => void;
}

const menuItems = [
  { id: 'documents', translationKey: 'navigation.documents', icon: FileText },    
  { id: 'documentTypes', translationKey: 'navigation.documentTypes', icon: FileStack },
  { id: 'textBlocks', translationKey: 'navigation.textBlocks', icon: Blocks },
  { id: 'clients', translationKey: 'navigation.clients', icon: Users },
  { id: 'projects', translationKey: 'navigation.projects', icon: FolderOpen },
  { id: 'assets', translationKey: 'navigation.assets', icon: Image },
] as const;

const SideMenu: React.FC<SideMenuProps> = ({ activeView, onViewChange }) => {
  const { t } = useTranslation();

  return (
    <div className="w-64 bg-white border-r">
      <div className="p-4 border-b bg-gray-50">
        <h3 className="text-sm font-medium text-gray-700">{t('common.navigation')}</h3>
      </div>
      <nav className="p-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id as ActiveView)}
            className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
              activeView === item.id
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <item.icon className="h-5 w-5" />
            <span>{t(item.translationKey)}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default SideMenu;