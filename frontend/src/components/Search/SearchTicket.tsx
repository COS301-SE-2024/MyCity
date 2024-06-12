import React from 'react';
import { AlertTriangle } from 'lucide-react';

const SearchTicket = () => {
  return (
    <div className="grid grid-cols-6 gap-4 bg-white rounded-md shadow-md p-4">
      {/* First Field */}
      <div className="flex flex-col items-center">
        <span className="text-xs text-gray-500">Ticket</span>
        <span className="text-gray-800">SA0284</span>
      </div>

      {/* Second Field */}
      <div className="flex flex-col items-center">
        <span className="text-xs text-gray-500">Urgent</span>
        <AlertTriangle size={40} color='red'/>
      </div>

      <div className="flex flex-col items-center">
        <span className="text-xs text-gray-500">Created by</span>
        <span className="text-gray-800">Kyle Marshall</span>
      </div>

      {/* Third Field */}
      <div className="flex flex-col items-center">
        <span className="text-xs text-gray-500">Unassigned</span>
        <span className="text-gray-800">Status</span>
      </div>

      {/* Fourth Field */}
      <div className="flex flex-col items-center">
        <span className="text-xs text-gray-500">Fault Type</span>
        <span className="text-gray-800">Leaking Sewerage</span>
      </div>

      {/* Fifth Field */}
      <div className="flex flex-col items-center">
        <span className="text-xs text-gray-500">Address</span>
        <span className="text-gray-800">312 Rupert Street...</span>
      </div>

      {/* Sixth Field */}
      <div className="flex flex-col items-center">
        {/* Add content for the sixth field if necessary */}
      </div>
    </div>
  );
};

export default SearchTicket;
