import React, { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Municipality, Ticket } from "@/types/custom.types";
import { ThreeDots } from "react-loader-spinner";
import { Image as ImageIcon } from "lucide-react";

interface SearchTicketProps {
  tickets: Ticket[];
  municipalities: Municipality[];
}

// states.ts
export const notificationStates = {
  AssigningContract: {
    color: "bg-blue-200",
    text: "Assigning Contract",
  },
  Closed: {
    color: "bg-green-200",
    text: "Closed",
  },
  InProgress: {
    color: "bg-yellow-200",
    text: "In Progress",
  },
  Opened: {
    color: "bg-red-200",
    text: "Opened",
  },
  TakingTenders: {
    color: "bg-purple-200",
    text: "Taking Tenders",
  },
  Default: {
    color: "bg-gray-200",
    text: "Taking Tenders",
  },
};

const SearchTicket: React.FC<SearchTicketProps> = ({
  tickets,
  municipalities = [],
}) => {
  // Helper function to find the corresponding municipality by id
  const findMunicipality = (municipalityId: string) => {
    // Ensure municipalities is an array before calling .find()
    if (Array.isArray(municipalities)) {
      return municipalities.find(
        (muni) => muni.municipality_id === municipalityId
      );
    }
    return null; // Return null if municipalities is not an array
  };

  function formatStatecolor(state: string | undefined): string {
    if (typeof state !== "string") {
      return ""; // Or some other default value
    }
    state.replace(/ /g, "");

    let color = "bg-gray-200"; // Default color

    if (state.replace(/ /g, "") in notificationStates) {
      color =
        notificationStates[
          state.replace(/ /g, "") as keyof typeof notificationStates
        ].color;
    } else {
      color = notificationStates.Default.color;
    }
    return color;
  }

  function formatStatetitle(state: string | undefined): string {
    if (typeof state !== "string") {
      return ""; // Or some other default value
    }

    state.replace(/ /g, "");

    let text = "Default"; // Default text

    if (state.replace(/ /g, "") in notificationStates) {
      text =
        notificationStates[
          state.replace(/ /g, "") as keyof typeof notificationStates
        ].text;
    } else {
      text = notificationStates.Default.text;
    }
    return text;
  }

  const [imageError, setImageError] = useState(false);

  function calculateDistance(
    lat1: string,
    lon1: string,
    lat2: string,
    lon2: string
  ) {
    if (!lat1 || !lon1 || !lat2 || !lon2) return "N/A"; // If coordinates are missing, return N/A

    const removeSingleQuote = (str: any) => String(str).replace(/'/g, "");

    lat1 = removeSingleQuote(lat1);
    lon1 = removeSingleQuote(lon1);
    lat2 = removeSingleQuote(lat2);
    lon2 = removeSingleQuote(lon2);

    const toRadians = (degree: number) => (degree * Math.PI) / 180;

    const R = 6371; // Radius of the Earth in kilometers

    const lat1Rad = toRadians(parseFloat(lat1));
    const lon1Rad = toRadians(parseFloat(lon1));
    const lat2Rad = toRadians(parseFloat(lat2));
    const lon2Rad = toRadians(parseFloat(lon2));

    const dLat = lat2Rad - lat1Rad;
    const dLon = lon2Rad - lon1Rad;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1Rad) *
        Math.cos(lat2Rad) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const totalDistance = R * c; // Distance in kilometers

    return totalDistance.toFixed(2) + " km";
  }

  return (
    <div>
      {/* Desktop View */}
      <div className="hidden lg:block">
        <div className="space-y-1 px-6 rounded-3xl">
          {tickets.map((ticket: Ticket, index: number) => {
            const municipality = findMunicipality(ticket.municipality_id);
            let color = formatStatecolor(ticket.state);
            let title = formatStatetitle(ticket.state);
            let image = ticket.imageURL;
            let distance = municipality
              ? calculateDistance(
                  ticket.latitude,
                  ticket.longitude,
                  municipality.latitude ?? "",
                  municipality.longitude ?? ""
                )
              : "N/A"; // Fallback if municipality data is unavailable

            return (
              <div
                key={index}
                className="flex w-full h-full gap-2 bg-white bg-opacity-70 rounded-3xl mt-2 shadow-md p-4"
              >
                {/* Urgent */}
                <div className="flex w-[5%] flex-col items-center justify-center">
                  <AlertTriangle width={"100%"} color="red" />
                </div>

                {/* Fault Image */}
                <div className="w-[10%] overflow-hidden flex items-center justify-center ">
                  {image && !imageError ? (
                    <img
                      src={image}
                      alt="Ticket"
                      className="w-[70%] h-full object-cover overflow-hidden rounded-md"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <ImageIcon size={32} color="#6B7280" />
                  )}
                </div>

                {/*Asset Type */}
                <div className="flex w-[25%] flex-col items-start justify-center align-center ">
                  <span className="text-black align-center lg:text-lg md:text-md font-bold">
                    {ticket.asset_id}
                  </span>
                </div>

                {/* Date Opened */}
                <div className="flex w-[10%] flex-col items-center justify-center font-bold">
                  <span className="text-xs text-black">Date Opened</span>
                  <span className="text-black">
                    {new Date(ticket.dateOpened).toLocaleDateString()}
                  </span>
                </div>

                {/* Municipality Logo */}
                <div className="flex w-[20%] items-center justify-center gap-2">
                  <div key={ticket.municipality_id}>
                    {municipality ? (
                      <ImageWithLoader
                        src={municipality.municipalityLogo || ""}
                        alt={"Municipality Logo"}
                      />
                    ) : (
                      <p>Municipality data not available</p>
                    )}
                  </div>
                  {/* Municipality Name */}
                  <div className="flex flex-col items-center text-start break-words">
                    <span className="lg:text-md md:text-sm font-bold">
                      {municipality?.name || "Unknown"}
                    </span>
                  </div>
                </div>

                {/* State */}
                <div className="flex w-[15%] items-center justify-center py-2">
                  <div
                    className={`${color} bg-opacity-75 text-black font-bold sm:text-xs md:text-sm lg:text-md text-center flex items-center justify-center rounded-lg h-full w-full`}
                  >
                    {title}
                  </div>
                </div>

                {/* Distance */}
                <div className="flex flex-col font-bold w-[15%] items-center justify-center">
                  <span className="text-xs text-black">Distance</span>
                  <span className="text-black">{distance}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile View */}
<div className="block lg:hidden">
  <div className="space-y-4 px-4">
    {tickets.map((ticket: Ticket, index: number) => {
      // Calculate variables
      const municipality = findMunicipality(ticket.municipality_id);
      const color = formatStatecolor(ticket.state);
      const title = formatStatetitle(ticket.state);
      const image = ticket.imageURL;
      const distance =
        ticket.latitude && ticket.longitude && municipality?.latitude && municipality?.longitude
          ? calculateDistance(
              ticket.latitude,
              ticket.longitude,
              municipality.latitude,
              municipality.longitude
            )
          : "N/A";

      return (
        <div
          key={index}
          className="relative bg-white bg-opacity-70 rounded-3xl mt-2 shadow-md p-4"
        >
          {/* Top Section - Asset ID & Urgency */}
          <div className="flex items-center justify-center mb-2 relative">
            {/* Urgency Indicator - Aligned to Asset ID */}
            <div className="absolute left-0">
              <AlertTriangle size={20} color="red" />
            </div>
            {/* Asset Type - Centered */}
            <span className="text-black font-bold text-lg">{ticket.asset_id}</span>
          </div>

          {/* Fault Image - Centered Below Asset Type */}
          <div className="flex justify-center mb-4">
            {image && !imageError ? (
              <img
                src={image}
                className="w-full max-w-[300px] h-40 object-cover rounded-md"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full max-w-[300px] h-40 bg-gray-200 flex items-center justify-center rounded-md">
                <ImageIcon size={40} color="#6B7280" />
              </div>
            )}
          </div>

          {/* Municipality Info - Logo and Name on One Line */}
          <div className="flex items-center justify-center mb-4">
            {/* Municipality Logo */}
            {municipality?.municipalityLogo ? (
              <img
                src={municipality.municipalityLogo}
                className="w-10 h-10 object-cover rounded-full mr-2"
              />
            ) : (
              <div className="w-10 h-10 bg-gray-200 flex items-center justify-center text-black rounded-full mr-2">
                <ImageIcon size={24} color="#6B7280" />
              </div>
            )}
            {/* Municipality Name */}
            <span className="text-black font-bold text-center">
              {municipality?.name || "Unknown"}
            </span>
          </div>

          {/* Details Section - Aligned Columns */}
          <div className="flex justify-around mt-4">
            {/* Column 1: Date Opened */}
            <div className="flex flex-col items-center space-y-1">
              <span className="block text-xs text-gray-600">Date Opened</span>
              <span className="text-black font-bold">
                {new Date(ticket.dateOpened).toLocaleDateString()}
              </span>
            </div>

            {/* Column 2: State (Center) */}
            <div className="flex flex-col items-center space-y-1">
              <span className="block text-xs text-gray-600">State</span>
              <div
                className={`${color} text-black font-bold text-center py-1 px-3 rounded-full`}
              >
                {title}
              </div>
            </div>

            {/* Column 3: Distance */}
            <div className="flex flex-col items-center space-y-1">
              <span className="block text-xs text-gray-600">Distance</span>
              <span className="text-black font-bold">{distance}</span>
            </div>
          </div>
        </div>
      );
    })}
  </div>
</div>

    </div>
  );
};

const ImageWithLoader: React.FC<{ src: string; alt: string }> = ({
  src,
  alt,
}) => {
  const [loading, setLoading] = useState(true);

  return (
    <div className="relative w-12 h-12">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <ThreeDots
            height="12"
            width="12"
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

export default SearchTicket;
