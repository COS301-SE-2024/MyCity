import React, { useState } from "react";
import { Star } from "lucide-react";
import { ServiceProvider } from "@/types/custom.types";
import { ThreeDots } from "react-loader-spinner"; // Import a small black loading spinner


interface SearchSPProps {
  serviceProviders: ServiceProvider[];
}

const SearchSP: React.FC<SearchSPProps> = ({ serviceProviders }) => {
  return (
    <div>
      {/* Desktop View */}
      <div className="hidden lg:block">
        {/* Show desktop view on large screens and above */}
        <div className="space-y-1 px-6 rounded-3xl">
          {serviceProviders.map((sp: ServiceProvider, index: number) => (
            <div
              key={index}
              className="grid grid-cols-5 items-center bg-white bg-opacity-70 rounded-3xl mt-2 shadow-md p-2"
            >
              {/* Company Logo */}
              <div className="col-span-1 flex items-center justify-center">
                {sp.companyLogo ? (
                  <ImageWithLoader
                    src={sp.companyLogo}
                    alt={`${sp.name} logo`}
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-200 flex items-center justify-center text-black rounded-full">
                    No Logo
                  </div>
                )}
              </div>

              {/* Company Information */}
              <div className="col-span-1 flex flex-col items-center">
                <div className="flex text-start items-start lg:text-xl md:text-lg font-bold w-full">
                  {sp.name}
                </div>
              </div>

              {/* Contact Number */}
              <div className="col-span-1 flex flex-col items-center ml-[-1rem]">
                <div className="text-black text-center">{sp.contactNumber}</div>
              </div>

              {/* Email */}
              <div className="col-span-1 flex flex-col items-center">
                <div className="text-black truncate max-w-[15rem]">
                  {sp.email}
                </div>
              </div>

              {/* Quality Rating */}
              <div className="col-span-1 flex flex-col items-center">
                <span className="text-xs text-black">Quality Rating</span>
                {(() => {
                  const randomRating = Math.floor(Math.random() * 5) + 1;
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
      </div>

      {/* Mobile View */}
      <div className="block lg:hidden">
        {/* Show mobile view on medium screens and below */}
        <div className="space-y-2 px-4 rounded-3xl">
          {serviceProviders.map((sp: ServiceProvider, index: number) => (
            <div
              key={index}
              className="flex flex-col bg-white bg-opacity-70 rounded-3xl mt-2 shadow-md p-4"
            >
              {/* Company Logo */}
              <div className="flex items-center justify-center mb-2">
                {sp.companyLogo ? (
                  <ImageWithLoader
                    src={sp.companyLogo}
                    alt={`${sp.name} logo`}
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-200 flex items-center justify-center text-black rounded-full">
                    No Logo
                  </div>
                )}
              </div>

              {/* Company Information */}
              <div className="space-y-2">
                <div className="flex flex-col">
                  <span className="text-xs text-black">Name</span>
                  <div className="text-black">{sp.name}</div>
                </div>

                <div className="flex flex-col">
                  <span className="text-xs text-black">Contact</span>
                  <div className="text-black">{sp.contactNumber}</div>
                </div>

                <div className="flex flex-col">
                  <span className="text-xs text-black">Email</span>
                  <div
                    className="text-black truncate max-w-full"
                    style={{
                      fontSize: sp.email.length > 35 ? "0.75rem" : "1rem",
                    }}
                  >
                    {sp.email}
                  </div>
                </div>
              </div>

              {/* Quality Rating */}
              <div className="flex flex-col items-center mt-2">
                <span className="text-xs text-black">Quality Rating</span>
                {(() => {
                  const randomRating = Math.floor(Math.random() * 5) + 1;
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
      </div>
    </div>
  );
};

// A custom component that shows a loading spinner while the image is loading
const ImageWithLoader: React.FC<{ src: string; alt: string }> = ({
  src,
  alt,
}) => {
  const [loading, setLoading] = useState(true);

  return (
    <div className="relative w-16 h-16">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <ThreeDots
            height="16"
            width="16"
            radius="9"
            color="black"
            ariaLabel="loading"
            visible={true}
          />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover rounded-full"
        onLoad={() => setLoading(false)}
        style={{ display: loading ? "none" : "block" }} // Hide the image until it has loaded
      />
    </div>
  );
};

export default SearchSP;
