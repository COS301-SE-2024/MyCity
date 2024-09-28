import React, { useState, useEffect } from "react";
import Image from "next/image";

const ServiceProvidersGrid = ({
  serviceProviders,
}: {
  serviceProviders: string;
}) => {
  const [parsedProviders, setParsedProviders] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const providersPerPage = 10; // 5x2 grid means 10 providers per page

  useEffect(() => {
    if (typeof serviceProviders === "string") {
      // Parse the string into an array, removing curly braces and splitting by commas
      let cleanedProviders = serviceProviders
        .replace(/{|}/g, "") // Remove curly braces
        .split(",") // Split by commas
        .map((provider) => provider.replace(/'/g, "").trim()); // Remove single quotes and trim whitespace

      // Find the provider containing " - Inhouse"
      const inhouseProvider = cleanedProviders.find((provider) =>
        provider.includes(" - Inhouse")
      );

      // Remove the inhouse provider from the array and place it at the front
      if (inhouseProvider) {
        cleanedProviders = [
          inhouseProvider,
          ...cleanedProviders.filter(
            (provider) => provider !== inhouseProvider
          ),
        ];
      }

      setParsedProviders(cleanedProviders);
    }
  }, [serviceProviders]);

  // Calculate the number of pages
  const totalPages = Math.ceil(parsedProviders.length / providersPerPage);

  // Get the providers to display on the current page
  const startIndex = (currentPage - 1) * providersPerPage;
  let displayedProviders = parsedProviders.slice(
    startIndex,
    startIndex + providersPerPage
  );

  // Add placeholders if there are fewer than 10 providers
  if (displayedProviders.length < providersPerPage) {
    const placeholders = new Array(providersPerPage - displayedProviders.length).fill(null);
    displayedProviders = [...displayedProviders, ...placeholders];
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  function formatServiceProvider(mun: string): string {
    if (typeof mun !== "string") {
      return ""; // Or some other default value
    }
    return mun.replace(/ /g, "_");
  }

  return (
    <div className="bg-white bg-opacity-90 rounded-lg p-4 shadow-lg h-[38vh]">
      <h2 className="text-2xl font-bold mb-2 text-center">Service Providers</h2>
      <div className="grid grid-cols-5 gap-2 h-[75%] overflow-hidden mb-2">
        {displayedProviders.map((provider, index) => (
          provider ? (
            <div
              key={index}
              className="bg-white bg-opacity-80 h-full text-sm font-bold rounded-lg p-2 text-center flex flex-col items-center mb-2"
            >
              {provider.includes(" - Inhouse") ? (
                <Image
                  src={`https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/municipality_logos/${formatServiceProvider(
                    provider.substring(0, provider.length - 10)
                  )}.png`}
                  alt={`${provider} logo`}
                  className="w-[50%] mb-2 object-contain rounded-full"
                />
              ) : (
                <Image
                  src={`https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/service-providers/${formatServiceProvider(
                    provider
                  )}.webp`}
                  alt={`${provider} logo`}
                  className="w-[50%] mb-2 object-contain rounded-full"
                />
              )}
              {provider}
            </div>
          ) : (
            <div
              key={index}
              className="bg-transparent h-full rounded-lg p-2"
            />
          )
        ))}
      </div>

      {/* Pagination controls */}
      <div className="flex justify-between mt-2">
        <button
          className="bg-gray-600 text-white font-bold py-2 w-1/4 rounded-full disabled:opacity-50"
          onClick={handlePrevPage}
          disabled={currentPage === 1}
        >
          Previous
        </button>

        <span className="text-lg font-bold ">{`Page ${currentPage} of ${totalPages}`}</span>
        <button
          className="bg-blue-300 font-bold py-2 w-1/4 rounded-full disabled:opacity-50"
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ServiceProvidersGrid;
