import React from 'react';
import { UserCircle } from 'lucide-react'

const SearchSP = () => {
  return (
    <div className="grid grid-cols-6 gap-4 bg-white rounded-md shadow-md p-4">
      {/* First Field */}
      <div className="flex flex-col items-center">
        <span className="text-s text-black-500">Service Provider</span>
      </div>

      {/* Second Field */}
      <div className="flex flex-col items-center">
        <UserCircle size={40} />
      </div>

      <div className="flex flex-col items-center">
        <span className="text-xs text-gray-500">Name</span>
        <span className="text-gray-800">BBL Plumbing</span>
      </div>

      {/* Third Field */}
      <div className="flex flex-col items-center">
        <span className="text-xs text-gray-500">Plumbing</span>
        <span className="text-gray-800">Service Type</span>
      </div>

      {/* Fourth Field */}
      <div className="flex flex-col items-center">
        <span className="text-xs text-gray-500">Province</span>
        <span className="text-gray-800">Gauteng</span>
      </div>

      {/* Fifth Field */}
      <div className="flex flex-col items-center">
        <span className="text-xs text-gray-500">Active Jobs</span>
        <span className="text-gray-800">29</span>
      </div>
    </div>
  );
};

export default SearchSP;
