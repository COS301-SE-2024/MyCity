import React, { useEffect, useRef, useState } from "react";
import { UserCircle } from "lucide-react";
import { Municipality } from "@/types/custom.types";
import { ThreeDots } from "react-loader-spinner"; // Import a small black loading spinner


interface SearchMunicipalityProps {
  municipalities: Municipality[];
}

const SearchMunicipality: React.FC<SearchMunicipalityProps> = ({
  municipalities,
}) => {
  return (
    <div>
      {/* Desktop View */}
      <div className="hidden lg:block">
        <div className="space-y-1 px-6 rounded-3xl">
          {municipalities.map((municipality: Municipality, index: number) => (
            <div
              key={index}
              className="grid grid-cols-5 gap-2 bg-white bg-opacity-70 rounded-3xl mt-2 shadow-md p-4"
            >
              {/* Company Logo */}
              <div className="flex items-center justify-center">
                {municipality.municipalityLogo ? (
                  <ImageWithLoader
                    src={municipality.municipalityLogo}
                    alt={`${municipality.name} logo`}
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-200 flex items-center justify-center text-black rounded-full">
                    No Logo
                  </div>
                )}
              </div>

              {/* Municipality Name */}
              <div className="flex flex-col items-center">
                <span className="text-xs text-black">Name</span>
                <span className="text-black">
                  {municipality.municipality_id}
                </span>
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
                  style={{
                    fontSize:
                      municipality.email.length > 35 ? "0.75rem" : "1rem",
                  }}
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
        <div className="space-y-2 px-4 rounded-3xl">
          {municipalities.map((municipality: Municipality, index: number) => (
            <div
              key={index}
              className="flex flex-col bg-white bg-opacity-70 rounded-3xl mt-2 shadow-md p-4"
            >
              {/* Company Logo */}
              <div className="flex items-center justify-center mb-2">
                {municipality.municipalityLogo ? (
                  <ImageWithLoader
                    src={municipality.municipalityLogo}
                    alt={`${municipality.name} logo`}
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-200 flex items-center justify-center text-black rounded-full">
                    No Logo
                  </div>
                )}
              </div>

              {/* Municipality Information */}
              <div className="space-y-2">
                <div className="flex flex-col">
                  <span className="text-xs text-black">Name</span>
                  <span className="text-black">
                    {municipality.municipality_id}
                  </span>
                </div>

                <div className="flex flex-col">
                  <span className="text-xs text-black">Province</span>
                  <span className="text-black">{municipality.province}</span>
                </div>

                <div className="flex flex-col">
                  <span className="text-xs text-black">Email</span>
                  <span
                    className="text-black truncate max-w-full"
                    style={{
                      fontSize:
                        municipality.email.length > 35 ? "0.75rem" : "1rem",
                    }}
                  >
                    {municipality.email}
                  </span>
                </div>

                <div className="flex flex-col">
                  <span className="text-xs text-black">Contact Number</span>
                  <span className="text-black">
                    {municipality.contactNumber}
                  </span>
                </div>
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

export default SearchMunicipality;
