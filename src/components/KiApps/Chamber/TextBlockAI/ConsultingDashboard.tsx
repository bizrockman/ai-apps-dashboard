import React from 'react';
import { Consultation } from './types';

interface ConsultingDashboardProps {
  consultations: Consultation[];
  onNewConsultation: () => void;
  onEdit: (id: number) => void;
}

const ConsultingDashboard: React.FC<ConsultingDashboardProps> = ({ 
  consultations, 
  onNewConsultation,
  onEdit 
}) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Beratungsübersicht</h1>
        <button
          onClick={onNewConsultation}
          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
        >
          Neue Beratung
        </button>
      </div>

      <div className="bg-white rounded-lg border shadow-sm">
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2 text-gray-600">Name</th>
                  <th className="text-left p-2 text-gray-600">Branche</th>
                  <th className="text-left p-2 text-gray-600">Status</th>
                  <th className="text-left p-2 text-gray-600">Aktionen</th>
                </tr>
              </thead>
              <tbody>
                {consultations.map((item) => (
                  <tr key={item.id} className="border-b">
                    <td className="p-2">{item.name}</td>
                    <td className="p-2">{item.industry}</td>
                    <td className="p-2">{item.status}</td>
                    <td className="p-2">
                      <button
                        onClick={() => onEdit(item.id)}
                        className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      >
                        Bearbeiten
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultingDashboard;