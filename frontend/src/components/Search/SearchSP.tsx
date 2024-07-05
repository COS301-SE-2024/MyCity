import React from "react";
import { Star } from "lucide-react";
import { ServiceProvider } from "@/types/custom.types";

interface SearchSPProps {
  serviceProviders: ServiceProvider[];
}

const SearchSP: React.FC<SearchSPProps> = ({ serviceProviders }) => {
  /*if (!serviceProviders || serviceProviders.length === 0) {
    return <div>No service providers found.</div>;
  }*/

  return (
    <div className="space-y-4">
      {serviceProviders.map((sp: ServiceProvider, index: number) => (
        <div
          key={index}
          className="grid grid-cols-6 items-center bg-white bg-opacity-80 rounded-md mt-4 shadow-md p-4 h-24 gap-4"
        >
          {/* Service Provider text */}
          <div className="col-span-1 flex flex-col items-center">
            <span className="text-sm font-medium text-black">
              Service Provider
            </span>
          </div>
          {/* Company Logo */}
          <div className="col-span-1 flex items-center justify-center">
            {sp.companyLogo ? (
              <img
                src={sp.companyLogo}
                alt={`${sp.name} logo`}
                width={64}
                height={64}
                className="w-16 h-16 object-cover rounded-full"
              />
            ) : (
              <div className="w-16 h-16 bg-gray-200 flex items-center justify-center text-gray-500 rounded-full">
                No Logo
              </div>
            )}
          </div>

          {/* Company Information */}
          <div className="col-span-1 flex flex-col items-center ml-[-1rem]">
            <span className="text-xs text-gray-500">Name</span>
            <div className="text-gray-800 text-center">{sp.name}</div>
          </div>
          <div className="col-span-1 flex flex-col items-center ml-[-1rem]">
            <span className="text-xs text-gray-500">Contact</span>
            <div className="text-gray-800 text-center">{sp.contactNumber}</div>
          </div>
          <div className="col-span-1 flex flex-col items-center">
            <span className="text-xs text-gray-500">Email</span>
            <div className="text-gray-800 text-center">{sp.email}</div>
          </div>

          {/* Quality Rating */}
          <div className="col-span-1 flex flex-col items-center">
            <span className="text-xs text-gray-500">Quality Rating</span>
            {/*
  {typeof sp.qualityRating === 'number' && sp.qualityRating > 0 ? (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={16}
          className={
            star <= sp.qualityRating
              ? "text-yellow-500"
              : star <= Math.ceil(sp.qualityRating) && star > sp.qualityRating
              ? "text-yellow-500 opacity-50"
              : "text-gray-300"
          }
          fill={star <= sp.qualityRating ? "currentColor" : "none"}
        />
      ))}
      <span className="text-gray-800 ml-1">{sp.qualityRating.toFixed(1)}</span>
    </div>
  ) : (
    <span className="text-gray-800">N/A</span>
  )}
  */}
            {/*
    Placeholder for a random rating
  */}
            {(() => {
              const randomRating = Math.floor(Math.random() * 5) + 1; // Random rating between 1 and 5
              return (
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={16}
                      className={
                        star <= randomRating
                          ? "text-yellow-500"
                          : "text-gray-300"
                      }
                      fill={star <= randomRating ? "currentColor" : "none"}
                    />
                  ))}
                </div>
              );
            })()}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SearchSP;
