import React from 'react';
import { Star } from 'lucide-react';
import Image from 'next/image';

interface ServiceProvider {
  companyLogo?: string;
  name: string;
  contactNumber: string;
  email: string;
  qualityRating?: number;
}

interface SearchSPProps {
  serviceProviders: ServiceProvider[];
}

const SearchSP: React.FC<SearchSPProps> = ({ serviceProviders }) => {
  if (!serviceProviders || serviceProviders.length === 0) {
    return <div>No service providers found.</div>;
  }

  return (
    <div className="space-y-4">
      {serviceProviders.map((sp: ServiceProvider, index: number) => (
        <div key={index} className="flex items-center bg-white rounded-md shadow-md p-4 h-24">
          {/* Service Provider text and Company Logo */}
          <div className="flex items-center w-1/4">
            <span className="text-sm font-medium text-black mr-3">Service Provider</span>
            {sp.companyLogo ? (
              <Image src={sp.companyLogo} alt={`${sp.name} logo`} width={16} height={16} className="w-16 h-16 object-cover rounded-full ml-40" />
            ) : (
              <div className="w-16 h-16 bg-gray-200 flex items-center justify-center text-gray-500 rounded-full ml-40">
                No Logo
              </div>
            )}
          </div>

          {/* Company Information */}
          <div className="flex-grow flex flex-col items-center justify-center">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <span className="text-xs text-gray-500">Name</span>
                <div className="text-gray-800">{sp.name}</div>
              </div>
              <div>
                <span className="text-xs text-gray-500">Contact</span>
                <div className="text-gray-800">{sp.contactNumber}</div>
              </div>
              <div>
                <span className="text-xs text-gray-500">Email</span>
                <div className="text-gray-800">{sp.email}</div>
              </div>
            </div>
          </div>

          {/* Quality Rating */}
          <div className="w-1/4 flex flex-col items-center">
            <span className="text-xs text-gray-500">Quality Rating</span>
            {typeof sp.qualityRating === 'number' && sp.qualityRating > 0 ? (
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={16}
                    className={star <= sp.qualityRating! 
                      ? "text-yellow-500" 
                      : star <= Math.ceil(sp.qualityRating!) && star > sp.qualityRating!
                      ? "text-yellow-500 opacity-50"
                      : "text-gray-300"
                    }
                    fill={star <= sp.qualityRating! ? "currentColor" : "none"}
                  />
                ))}
                <span className="text-gray-800 ml-1">{sp.qualityRating.toFixed(1)}</span>
              </div>
            ) : (
              <span className="text-gray-800">N/A</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SearchSP;
