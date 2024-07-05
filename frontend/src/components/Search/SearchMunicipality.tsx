import React from 'react';
import { UserCircle } from 'lucide-react';

interface Municipality {
  municipality_id: string;
  name: string;
  province: string;
  email: string;
  contactNumber: string;
}

interface SearchMunicipalityProps {
  municipalities: Municipality[];
}

const SearchMunicipality: React.FC<SearchMunicipalityProps> = ({ municipalities }) => {
  /*if (!municipalities || municipalities.length === 0) {
    return <div>No municipalities found.</div>;
  }*/

  return (
    <div className="space-y-4">
      {municipalities.map((municipality: Municipality, index: number) => (
        <div key={index} className="grid grid-cols-6 gap-4 bg-white bg-opacity-70 mb-4 rounded-md shadow-md p-4">
          {/* Municipality text */}
          <div className="flex flex-col justify-center items-center">
            <span className="text-s text-black-500">Municipality</span>
          </div>

          {/* User Circle Icon */}
          <div className="flex flex-col items-center">
            <UserCircle size={40} />
          </div>

          {/* Municipality Name */}
          <div className="flex flex-col items-center">
            <span className="text-xs text-gray-500">Name</span>
            <span className="text-gray-800">{municipality.municipality_id}</span>
          </div>

          {/* Province */}
          <div className="flex flex-col items-center">
            <span className="text-xs text-gray-500">Province</span>
            <span className="text-gray-800">{municipality.province}</span>
          </div>

          {/* Email */}
          <div className="flex flex-col items-center">
            <span className="text-xs text-gray-500">Email</span>
            <span className="text-gray-800">{municipality.email}</span>
          </div>

          {/* Contact Number */}
          <div className="flex flex-col items-center">
            <span className="text-xs text-gray-500">Contact Number</span>
            <span className="text-gray-800">{municipality.contactNumber}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SearchMunicipality;
