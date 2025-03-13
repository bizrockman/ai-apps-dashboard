import React from 'react';

interface StatCardProps {
  label: string;
  value: number;
  color: 'blue' | 'indigo' | 'purple' | 'pink';
}

const StatCard: React.FC<StatCardProps> = ({ label, value, color }) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    indigo: 'from-indigo-500 to-indigo-600',
    purple: 'from-purple-500 to-purple-600',
    pink: 'from-pink-500 to-pink-600',
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-500">{label}</span>
        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${colorClasses[color]} text-white flex items-center justify-center text-xs font-medium`}>
          {label[0]}
        </div>
      </div>
      <div className="mt-2">
        <span className="text-2xl font-bold text-gray-800">{value.toLocaleString()}</span>
      </div>
    </div>
  );
};

export default StatCard;