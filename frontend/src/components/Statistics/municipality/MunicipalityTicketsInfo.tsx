// components/Statistics/citizen/MunicipalityTicketsInfo.tsx

import React from "react";
import Image from "next/image";

interface MunicipalityTicketsInfoProps {
  municipalityName: string;
  totalTickets: number;
  citizens: number;
}

// Function to format municipality name for the image URL
function formatMunicipalityID(mun: string): string {
  if (typeof mun !== "string") {
    return ""; // Or some other default value
  }
  return mun.replace(/ /g, "_");
}

const MunicipalityTicketsInfo: React.FC<MunicipalityTicketsInfoProps> = ({
  municipalityName,
  totalTickets,
  citizens,
}) => {
  return (
    <div className="h-[38vh] bg-opacity-90  w-full flex flex-col justify-center items-center border bg-white shadow-lg rounded-lg p-4">
      {/* Municipality Logo */}
      <Image
        src={`https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/municipality_logos/${formatMunicipalityID(
          municipalityName
        )}.png`}
        alt={`${municipalityName} logo`}
        className="w-32 h-32 mb-4 object-contain rounded-full"
      />

      {/* Municipality Name */}
      <h2 className="text-3xl font-bold mb-2 text-center">{municipalityName}</h2>

      {/* Total Tickets */}
      <p className="text-xl font-semibold">Total Tickets: {totalTickets}</p>
      {/* Total Citizens */}
      <p className="text-xl font-semibold">Active Citizens: {citizens}</p>
    </div>
  );
};

export default MunicipalityTicketsInfo;
