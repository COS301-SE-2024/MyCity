import React from 'react';
import { Star } from 'lucide-react';

// Define an interface for the service provider object
interface ServiceProvider {
  companyLogo?: string;
  name: string;
  contactNumber: string;
  email: string;
  qualityRating?: number;
}

// Define props interface for the SearchSP component
interface SearchSPProps {
  serviceProviders: ServiceProvider[];
}

const SearchSP: React.FC<SearchSPProps> = ({ serviceProviders }) => {
  if (!serviceProviders || serviceProviders.length === 0) {
    return <div className="text-center text-gray-500 mt-4">No service providers found.</div>;
  }

  return (
    <div className="space-y-4">
      {serviceProviders.map((sp: ServiceProvider, index: number) => (
        <div key={index} className="bg-white rounded-md shadow-md p-4">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
            {/* Company Logo */}
            <div className="flex justify-center md:justify-start">
              <img 
                src={sp.companyLogo || '/default-logo.png'}
                alt={`${sp.name} logo`} 
                className="w-16 h-16 object-contain rounded-full"
              />
            </div>

            {/* Name */}
            <div className="text-center md:text-left">
              <span className="text-xs text-gray-500">Name</span>
              <p className="text-gray-800 font-semibold">{sp.name}</p>
            </div>

            {/* Contact Number */}
            <div className="text-center md:text-left">
              <span className="text-xs text-gray-500">Contact</span>
              <p className="text-gray-800">{sp.contactNumber}</p>
            </div>

            {/* Email */}
            <div className="text-center md:text-left">
              <span className="text-xs text-gray-500">Email</span>
              <p className="text-gray-800 truncate">{sp.email}</p>
            </div>

            {/* Quality Rating */}
            <div className="flex flex-col items-center md:items-start col-span-2">
              <span className="text-xs text-gray-500">Quality Rating</span>
              <div className="flex items-center">
                <Star className="text-yellow-400 fill-current" size={16} />
                <span className="text-gray-800 ml-1">
                  {typeof sp.qualityRating === 'number' 
                    ? sp.qualityRating.toFixed(1) 
                    : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SearchSP;