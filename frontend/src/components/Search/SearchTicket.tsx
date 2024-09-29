import React, { useState, useMemo } from "react";
import { AlertTriangle } from "lucide-react";
import { Municipality, Ticket } from "@/types/custom.types";
import { ThreeDots } from "react-loader-spinner";
import { Image as ImageIcon } from "lucide-react";
import { getImageBucketUrl } from "@/config/s3bucket.config";

interface SearchTicketProps {
  tickets: Ticket[];
  municipalities: Municipality[];
}

// Notification states mapping
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
    text: "Default",
  },
};

const SearchTicket: React.FC<SearchTicketProps> = ({
  tickets,
  municipalities = [],
}) => {
  // Create a map for quick municipality lookup
  const municipalityMap = useMemo(() => {
    const map = new Map<string, Municipality>();
    (Array.isArray(municipalities) ? municipalities : []).forEach((muni) => {
      map.set(muni.municipality_id, muni);
    });
    return map;
  }, [municipalities]);
  

  // Function to format the state color
  const formatStateColor = (state: string | undefined): string => {
    if (typeof state !== "string") return notificationStates.Default.color;
    state = state.replace(/ /g, "");
    return (
      notificationStates[state as keyof typeof notificationStates]?.color ||
      notificationStates.Default.color
    );
  };

  // Function to format the state title
  const formatStateTitle = (state: string | undefined): string => {
    if (typeof state !== "string") return notificationStates.Default.text;
    state = state.replace(/ /g, "");
    return (
      notificationStates[state as keyof typeof notificationStates]?.text ||
      notificationStates.Default.text
    );
  };

  // Function to calculate the distance
  const calculateDistance = (
    lat1: string,
    lon1: string,
    lat2: string,
    lon2: string
  ) => {
    const clean = (str: any) => String(str).replace(/'/g, "").trim();
    lat1 = clean(lat1);
    lon1 = clean(lon1);
    lat2 = clean(lat2);
    lon2 = clean(lon2);

    if (!lat1 || !lon1 || !lat2 || !lon2) return "N/A";

    const toRadians = (degree: number) => (degree * Math.PI) / 180;
    const R = 6371; // Earth's radius in kilometers
    const lat1Rad = toRadians(parseFloat(lat1));
    const lon1Rad = toRadians(parseFloat(lon1));
    const lat2Rad = toRadians(parseFloat(lat2));
    const lon2Rad = toRadians(parseFloat(lon2));

    if (isNaN(lat1Rad) || isNaN(lon1Rad) || isNaN(lat2Rad) || isNaN(lon2Rad)) {
      return "N/A";
    }

    const dLat = lat2Rad - lat1Rad;
    const dLon = lon2Rad - lon1Rad;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1Rad) *
        Math.cos(lat2Rad) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const totalDistance = R * c;

    return totalDistance.toFixed(2) + " km";
  };

  // Pre-calculate data for all tickets using useMemo
  const ticketData = useMemo(() => {
    return tickets.map((ticket) => {
      const municipality = municipalityMap.get(ticket.municipality_id);
      const color = formatStateColor(ticket.state);
      const title = formatStateTitle(ticket.state);
      const image = ticket.imageURL;

      const distance = municipality
        ? calculateDistance(
            ticket.latitude,
            ticket.longitude,
            municipality.latitude ?? "",
            municipality.longitude ?? ""
          )
        : "N/A";

      return {
        ticket,
        municipality,
        color,
        title,
        image,
        distance,
        assetType: ticket.asset_id,
        dateOpened: new Date(ticket.dateOpened).toLocaleDateString(),
        municipalityLogo: municipality?.municipalityLogo || null,
        municipalityName: municipality?.municipality_id || "Unknown",
        ticketDistance: distance !== "N/A" ? distance : "N/A",
      };
    });
  }, [tickets, municipalityMap]);

  // State to track image loading errors
  const [imageErrors, setImageErrors] = useState<boolean[]>(
    new Array(tickets.length).fill(false)
  );

  const handleImageError = (index: number) => {
    const updatedErrors = [...imageErrors];
    updatedErrors[index] = true;
    setImageErrors(updatedErrors);
  };

  // Render the component views
  return (
    <div>
      {ticketData.map(
        (
          {
            ticket,
            municipality,
            color,
            title,
            image,
            distance,
            assetType,
            dateOpened,
            municipalityLogo,
            municipalityName,
            ticketDistance,
          },
          index
        ) => (
          <div key={index}>
            {/* Desktop View */}
            <div className="hidden lg:block">
              <div className="space-y-1 px-6 rounded-3xl">
                <div className="flex w-full gap-2 bg-white bg-opacity-70 rounded-3xl mt-2 shadow-md p-4">
                  {/* Urgent */}
                  <div className="flex w-[5%] flex-col items-center justify-center">
                    <AlertTriangle width={"100%"} color="red" />
                  </div>

                  {/* Fault Image */}
                  <div className="w-[10%] overflow-hidden flex items-center justify-center">
                    {image && !imageErrors[index] ? (
                      <img
                        src={getImageBucketUrl(image)}
                        alt="Ticket"
                        width={100}
                        height={100}
                        className="w-[70%] h-full object-cover overflow-hidden rounded-md"
                        onError={() => handleImageError(index)}
                      />
                    ) : (
                      <ImageIcon size={32} color="#6B7280" />
                    )}
                  </div>

                  {/* Asset Type */}
                  <div className="flex w-[25%] flex-col items-start justify-center">
                    <span className="text-black lg:text-lg md:text-md font-bold">
                      {assetType}
                    </span>
                  </div>

                  {/* Date Opened */}
                  <div className="flex w-[10%] flex-col items-center justify-center font-bold">
                    <span className="text-xs text-black">Date Opened</span>
                    <span className="text-black">{dateOpened}</span>
                  </div>

                  {/* Municipality Logo and Name */}
                  <div className="flex w-[20%] items-center justify-center gap-2">
                    <div>
                      {municipalityLogo ? (
                        <ImageWithLoader
                          src={municipalityLogo}
                          alt={"Municipality Logo"}
                        />
                      ) : (
                        <p>Municipality data not available</p>
                      )}
                    </div>
                    <div className="flex flex-col items-center text-start break-words">
                      <span className="lg:text-md md:text-sm font-bold">
                        {municipalityName}
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
                    <span className="text-black">{ticketDistance}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile View */}
            <div className="block lg:hidden">
  <div className="space-y-2 px-4 rounded-3xl">
    <div className="relative flex flex-col bg-white bg-opacity-70 rounded-3xl mt-2 shadow-md p-4">
      {/* Urgent Icon - Top Left */}
      <div className="absolute top-2 left-2">
        <AlertTriangle width={"24px"} color="red" />
      </div>

      {/* Top Section (Fault Image) */}
      <div className="flex items-center justify-center mb-4">
        {image && !imageErrors[index] ? (
          <img
            src={getImageBucketUrl(image)}
            alt="Ticket"
            width={100}
            height={80}
            className="w-[100px] h-[80px] object-cover rounded-md overflow-hidden"
            onError={() => handleImageError(index)}
          />
        ) : (
          <ImageIcon size={40} color="#6B7280" />
        )}
      </div>

      {/* Information Section */}
      <div className="space-y-3">
        {/* Asset Type */}
        <div className="flex flex-col items-center">
          <span className="text-md text-black font-bold">{assetType}</span>
        </div>

        {/* State and Date Opened - Side by Side */}
        <div className="flex justify-between items-center">
          {/* State */}
          <div className="flex flex-col items-center w-1/2">
            <span className="text-xs text-gray-500">Status</span>
            <div
              className={`${color} bg-opacity-75 text-black font-bold text-sm text-center flex items-center justify-center rounded-lg py-1 px-4`}
            >
              {title}
            </div>
          </div>

          {/* Date Opened */}
          <div className="flex flex-col items-center w-1/2">
            <span className="text-xs text-gray-500">Opened On</span>
            <span className="text-black font-semibold">{dateOpened}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>


          </div>
        )
      )}
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
        style={{ display: loading ? "none" : "block" }}
      />
    </div>
  );
};

export default SearchTicket;
