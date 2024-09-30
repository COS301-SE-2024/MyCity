// components/Statistics/citizen/MunicipalityTicketsInfo.tsx

import React from "react";

interface ServiceProviderTicketsInfoProps {
  serviceProvider: string;
  contracts: number;
}

// Function to format municipality name for the image URL
function formatServiceProvider(mun: string): string {


  if (typeof mun !== "string") {
    return ""; // Or some other default value
  }
  return mun.replace(/ /g, "_");
}

const serviceProviderTicketsInfo: React.FC<ServiceProviderTicketsInfoProps> = ({
  serviceProvider,
  contracts,
}) => {
  console.log("Service Provider: ", serviceProvider);
  return (
    <div className="h-[38vh] bg-opacity-90  w-full flex flex-col justify-center items-center border bg-white shadow-lg rounded-lg p-4">
      {serviceProvider && serviceProvider.includes(" - Inhouse") ? (
        <img
          src={`https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/municipality_logos/${formatServiceProvider(
            serviceProvider.substring(0, serviceProvider.length - 10)
          )}.png`}
          alt={`${serviceProvider} logo`}
          width={128}
          height={128}
          className="w-[50%] mb-2 object-contain rounded-full"
        />
      ) : (
        <img
          src={`https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/service-providers/${formatServiceProvider(
            serviceProvider
          )}.webp`}
          alt={`${serviceProvider} logo`}
          width={128}
          height={128}
          className="w-[50%] mb-2 object-contain rounded-full"
        />
      )}

      {/* Municipality Name */}
      <h2 className="text-3xl font-bold mb-2 text-center">{serviceProvider}</h2>

      {/* Total Tickets */}
      <p className="text-xl font-semibold">Total Contracts: {contracts}</p>
      {/* Total Citizens */}
      {/* <p className="text-xl font-semibold">Active Citizens: {citizens}</p> */}
    </div>
  );
};

export default serviceProviderTicketsInfo;
