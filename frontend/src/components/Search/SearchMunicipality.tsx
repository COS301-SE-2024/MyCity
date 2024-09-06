import React from 'react';
import { UserCircle } from 'lucide-react';
import { Municipality } from '@/types/custom.types';

interface SearchMunicipalityProps {
  municipalities: Municipality[];
}

const SearchMunicipality: React.FC<SearchMunicipalityProps> = ({ municipalities }) => {
  return (
    <div>
      {/* Desktop View */}
      <div className="hidden lg:block">
        <div className="space-y-1 px-6 rounded-3xl">
          {municipalities.map((municipality: Municipality, index: number) => (
            <div
              key={index}
              className="grid grid-cols-6 gap-2 bg-white bg-opacity-70 rounded-3xl mt-2 shadow-md p-4"
            >
              {/* Municipality text */}
              <div className="flex flex-col justify-center items-center">
                <span className="text-s font-bold text-black-500">Municipality</span>
              </div>

              {/* User Circle Icon */}
              <div className="flex flex-col items-center">
                <UserCircle size={40} />
              </div>

              {/* Municipality Name */}
              <div className="flex flex-col items-center">
                <span className="text-xs text-black">Name</span>
                <span className="text-black">{municipality.municipality_id}</span>
              </div>

              {/* Province */}
              <div className="flex flex-col items-center">
                <span className="text-xs text-black">Province</span>
                <span className="text-black">{municipality.province}</span>
              </div>

              {/* Email */}
              <div className="flex flex-col items-center">
                <span className="text-sm text-black">Email</span>
                <span
                  className="text-black truncate max-w-[15rem]"
                  style={{ fontSize: municipality.email.length > 35 ? '0.75rem' : '1rem' }}
                >
                  {municipality.email}
                </span>
              </div>

              {/* Contact Number */}
              <div className="flex flex-col items-center">
                <span className="text-xs text-black">Contact Number</span>
                <span className="text-black">{municipality.contactNumber}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile View */}
      <div className="block lg:hidden">
        <div className="space-y-1 px-4 rounded-3xl">
          {municipalities.map((municipality: Municipality, index: number) => (
            <div
              key={index}
              className="flex flex-col bg-white bg-opacity-70 rounded-3xl mt-2 shadow-md p-4 space-y-4"
            >
              {/* Municipality text */}
              <div className="text-center">
                <span className="text-sm font-bold text-black">Municipality</span>
              </div>

              {/* User Circle Icon */}
              <div className="flex items-center justify-center">
                <UserCircle size={40} />
              </div>

              {/* Municipality Information */}
              <div className="flex flex-col items-start space-y-2">
                <div className="flex flex-col">
                  <span className="text-xs text-black">Name</span>
                  <span className="text-black">{municipality.municipality_id}</span>
                </div>

                <div className="flex flex-col">
                  <span className="text-xs text-black">Province</span>
                  <span className="text-black">{municipality.province}</span>
                </div>

                <div className="flex flex-col">
                  <span className="text-xs text-black">Email</span>
                  <span
                    className="text-black max-w-[150px] text-sm overflow-hidden whitespace-nowrap text-ellipsis"
                  >
                    {municipality.email}
                  </span>
                </div>

                <div className="flex flex-col">
                  <span className="text-xs text-black">Contact Number</span>
                  <span className="text-black">{municipality.contactNumber}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchMunicipality;
