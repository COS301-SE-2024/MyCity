import React from 'react';
import { User } from 'lucide-react'; // Importing User icon from lucide-react

const CreatedComponent = () => {
  return (
    <div className="flex items-center  text-white text-opacity-80 text-center justify-center p-4 rounded-md ">
      <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center bg-gray-200 border border-gray-300">
        <User size={32} color="#6B7280" />
      </div>
      <div className="ml-4">
        <div className="font-bold ">Benson Boone</div>
        <div className="text-sm ">created a new Ticket.</div>
      </div>
    </div>
  );
};

export default CreatedComponent;