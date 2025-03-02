import React from 'react';

interface SideMenuProps {
  onSelect: (component: string) => void;
}

const SideMenu: React.FC<SideMenuProps> = ({ onSelect }) => {
  return (
    <div className="w-64 bg-gray-100 h-full p-4">
      <ul>
        <li className="mb-4 cursor-pointer" onClick={() => onSelect('Document')}>Document</li>
        <li className="mb-4 cursor-pointer" onClick={() => onSelect('Projects')}>Projects</li>
        <li className="mb-4 cursor-pointer" onClick={() => onSelect('Assets')}>Assets</li>
        <li className="mb-4 cursor-pointer" onClick={() => onSelect('DocumentTypes')}>Document Types</li>
        <li className="mb-4 cursor-pointer" onClick={() => onSelect('TextBlocks')}>Text Blocks</li>
      </ul>
    </div>
  );
};

export default SideMenu;