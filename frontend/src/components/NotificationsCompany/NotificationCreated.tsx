import React from 'react';
import { User, Circle, Trash2 } from 'lucide-react'; // Importing User, Circle, and Trash icons from lucide-react

const CreatedComponent = ({ seen }: any) => {
  const circleStyle = seen ? 'bg-blue-500' : 'border-2 border-blue-500';

  return (
    <div className="flex items-center bg-white bg-opacity-70 text-black text-center justify-between p-4 mb-2 mx-4 rounded-lg">
      <div className={`w-4 h-4 rounded-full ${circleStyle} mr-4`}></div>
      <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center bg-gray-200 border border-gray-300 mr-4">
        <User size={32} color="#6B7280" />
      </div>
      <div className="flex-1">
        <div className="font-bold">Benson Boone</div>
        <div className="text-sm whitespace-nowrap overflow-hidden overflow-ellipsis">created a new Ticket nearby.</div>
      </div>
      <div className="ml-4">
        <Trash2 size={16} color="#000000" />
      </div>
    </div>
  );
};

export default CreatedComponent;
