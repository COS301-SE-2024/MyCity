import React from 'react';
import { AlertTriangle } from 'lucide-react'; // Importing AlertTriangle icon from lucide-react

const UrgentComponent = () => {
  return (
    <div className="flex items-center text-white text-opacity-80 text-center justify-center p-4 rounded-md ">
      <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center bg-gray-200 border border-gray-300">
        <AlertTriangle size={32} color="#FBBF24" /> {/* Changed icon to AlertTriangle and color to yellow */}
      </div>
      <div className="ml-4">
        <div className="font-bold ">One of your tickets has 100 upvotes.</div>
      </div>
    </div>
  );
};

export default UrgentComponent;
