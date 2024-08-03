import React from 'react';
import { User, Trash2 } from 'lucide-react';

const UpvoteComponent = ({ name, onDelete, seen }: any) => {
  const circleStyle = seen ? 'bg-blue-500' : 'border-2 border-blue-500';

  return (
    <div className="flex items-center text-black bg-white bg-opacity-70 rounded-lg p-4 mb-2 mx-4">
      <div className={`w-4 h-4 rounded-full ${circleStyle} mr-4`}></div>
      <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center bg-gray-200 border border-gray-300 mr-4">
        <User size={32} color="#6B7280" />
      </div>
      <div className="flex-1 text-center overflow-hidden whitespace-nowrap">
        <div className="font-bold">{name}</div>
        <div className="text-sm inline-block">
          {name} upvoted a Ticket you&apos;re assigned to fix.
        </div>
      </div>
      <button onClick={onDelete} className="ml-4">
        <Trash2 size={16} color="#000000" />
      </button>
    </div>
  );
};

export default UpvoteComponent;
