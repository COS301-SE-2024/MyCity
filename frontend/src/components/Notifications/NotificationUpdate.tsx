import React from 'react';
import { User } from 'lucide-react'; // Importing User icon from lucide-react

const UpdateComponent = () => {
  return (
    <div className="flex items-center  text-white text-opacity-80 text-center justify-center p-4 rounded-md ">
      <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center bg-gray-200 border border-gray-300">
        <User size={32} color="#6B7280" />
      </div>
      <div className="ml-4">
        <div className="font-bold ">City of Ekurhuleni</div>
        <div className="text-sm ">updated the status of a Ticket you made (SA0239):</div>
        <div className="bg-blue-200 bg-opacity-75 text-black font-bold rounded-lg px-3 py-1 mt-1">
          Fix in Progress
        </div>
      </div>
    </div>
  );
};

export default UpdateComponent;