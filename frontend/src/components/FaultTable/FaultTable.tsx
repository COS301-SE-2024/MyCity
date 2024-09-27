import React, { useState, useRef, useEffect } from "react";
import {
  FaArrowUp,
  FaComment,
  FaEye,
  FaExclamationTriangle,
  FaTimes,
} from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import FaultCardUserView from "@/components/FaultCardUserView/FaultCardUserView";
import { AlertCircle } from "lucide-react";
import { S3_BUCKET_BASE_URL } from "@/config/s3bucket.config";

interface Incident {
  ticket_id: string;
  ticketnumber: string;
  asset_id: string;
  upvotes: number;
  viewcount: number;
  commentcount: number;
  address: string;
  description: string;
  username: string;
  imageURL: string;
  createdby: string;
  latitude: number;
  longitude: number;
  municipality_id: string;
  state: string;
  urgency: "high" | "medium" | "low";
}

interface IncidentProps {
  tableitems: Incident[];
  refreshwatch: () => void;
}

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

function formatMunicipalityID(mun: string): string {
  if (typeof mun !== "string") {
    return ""; // Or some other default value
  }
  return mun.replace(/ /g, "_");
}

function formatState(state: string | undefined): string {
  if (typeof state !== "string") {
    return ""; // Or some other default value
  }
  return state.replace(/ /g, "");
}

const urgencyMapping = {
  high: { icon: <AlertCircle className="text-red-500" />, label: "Urgent" },
  medium: {
    icon: <AlertCircle className="text-yellow-500" />,
    label: "Moderate",
  },
  low: {
    icon: <AlertCircle className="text-green-500" />,
    label: "Not Urgent",
  },
};

const IncidentTable: React.FC<IncidentProps> = ({
  tableitems = [],
  refreshwatch,
}) => {
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isOverflowing, setIsOverflowing] = useState<{
    [key: number]: boolean;
  }>({});
  const addressRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [startIndex, setStartIndex] = useState(0);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(tableitems.length / itemsPerPage);

  // Functions to navigate pages
  const goToNextPage = () => {
    if (startIndex + itemsPerPage < tableitems.length) {
      setStartIndex(startIndex + itemsPerPage);
    }
  };

  const goToPreviousPage = () => {
    if (startIndex - itemsPerPage >= 0) {
      setStartIndex(startIndex - itemsPerPage);
    }
  };

  const currentPageItems = tableitems.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  useEffect(() => {
    const overflowState: { [key: number]: boolean } = {};
    addressRefs.current.forEach((ref, index) => {
      if (ref) {
        overflowState[index] = ref.scrollWidth > ref.clientWidth;
      }
    });
    setIsOverflowing(overflowState);
  }, [addressRefs]);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  const handleRowClick = (incident: Incident) => {
    setSelectedIncident(incident);
  };

  const handleClose = () => {
    setSelectedIncident(null);
  };

  const getUrgency = (votes: number) => {
    if (votes < 10) return "low";
    if (votes >= 10 && votes < 20) return "medium";
    if (votes >= 20 && votes <= 40) return "high";
    return "low";
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "k";
    return num.toString();
  };

  const truncateAddress = (address: string) => {
    const [firstPart] = address.split(",");
    return firstPart.length > 20 ? `${firstPart.slice(0, 20)}...` : firstPart;
  };

  return (
    <div className="text-white text-opacity-80 p-5 sm:p-10">
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <ThreeDots
            height="80"
            width="80"
            radius="9"
            color="#ADD8E6"
            ariaLabel="three-dots-loading"
            visible={true}
          />
        </div>
      ) : (
        <>
          {/* Desktop View */}
          <div className="hidden sm:block w-full h-[80%] overflow-hidden">
            {currentPageItems.map((incident, index) => {
              const formattedStateKey = formatState(incident.state);
  
              let color = "bg-gray-200";
              let text = "Default";
  
              if (formattedStateKey in notificationStates) {
                color =
                  notificationStates[
                    formattedStateKey as keyof typeof notificationStates
                  ].color;
                text =
                  notificationStates[
                    formattedStateKey as keyof typeof notificationStates
                  ].text;
              }
  
              return (
                <div
                  key={index}
                  className="flex gap-4 items-center mb-2 px-2 py-1 h-[10%] rounded-3xl bg-white bg-opacity-70 text-black cursor-pointer overflow-y-auto transform transition-colors duration-300 hover:bg-gray-200"
                  onClick={() => handleRowClick(incident)}
                >
                  {/* Urgency */}
                  <div className="w-[3%] flex justify-center">
                    {urgencyMapping[getUrgency(incident.upvotes)].icon}
                  </div>
  
                  {/* Ticket Number */}
                  <div className="w-[12%] lg:text-md md:text-sm font-bold">
                    {incident.ticketnumber}
                  </div>
  
                  {/* Fault Type */}
                  <div className="w-[20%] font-bold">{incident.asset_id}</div>
  
                  {/* Status */}
                  <div
                    className={`${color} w-[15%] bg-opacity-75 text-black font-bold text-center rounded-lg px-3 py-2 mt-1`}
                  >
                    {incident.state}
                  </div>
  
                  {/* Fault Image */}
                  <div className="flex w-[7%] items-center">
                    <div className="h-[80%] rounded-lg overflow-hidden bg-gray-200 border border-gray-300">
                      <img src={incident.imageURL?`${S3_BUCKET_BASE_URL}${incident.imageURL}`:undefined} alt="" />
                    </div>
                  </div>
  
                  {/* Municipality */}
                  <div className="w-[15%] flex items-center">
                    <img
                      src={`https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/municipality_logos/${formatMunicipalityID(
                        incident.municipality_id
                      )}.png`}
                      alt="Ticket"
                      className="w-[22%] h-full object-cover rounded-full"
                    />
                    <div className="ml-2 font-bold">
                      {incident.municipality_id}
                    </div>
                  </div>
  
                  {/* Upvotes */}
                  <div className="w-[3%] flex justify-center">
                    <div className="flex flex-col items-center">
                      <FaArrowUp />
                      <div>{formatNumber(incident.upvotes)}</div>
                    </div>
                  </div>
  
                  {/* Comments */}
                  <div className="w-[3%] flex justify-center">
                    <div className="flex flex-col items-center">
                      <FaComment />
                      <div>{formatNumber(incident.commentcount)}</div>
                    </div>
                  </div>
  
                  {/* Address */}
                  <div
                    className="w-[17%] flex justify-start overflow-hidden whitespace-nowrap"
                    ref={(el) => {
                      addressRefs.current[index] = el;
                    }}
                  >
                    <div style={{ display: "inline-block", whiteSpace: "nowrap" }}>
                      {truncateAddress(incident.address)}
                    </div>
                  </div>
                </div>
              );
            })}
  
            {/* Desktop Pagination Controls */}
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={goToPreviousPage}
                className={`px-4 py-2 text-white ${
                  startIndex === 0 ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={startIndex === 0}
              >
                Previous
              </button>
  
              <span className="text-white text-opacity-80">
                Page {startIndex / itemsPerPage + 1} of {totalPages}
              </span>
  
              <button
                onClick={goToNextPage}
                className={`px-4 py-2 text-white ${
                  startIndex + itemsPerPage >= tableitems.length
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                disabled={startIndex + itemsPerPage >= tableitems.length}
              >
                Next
              </button>
            </div>
          </div>
  
          {/* Mobile View */}
          <div className="block sm:hidden h-[80vh] overflow-y-auto pb-16">
            {currentPageItems.map((incident, index) => (
              <div
                key={index}
                className="p-4 rounded-3xl bg-white bg-opacity-70 text-black border-b border-gray-200 cursor-pointer hover:bg-gray-200 mb-2"
                onClick={() => handleRowClick(incident)}
              >
                <div className="flex justify-between items-center mb-2">
                  <div>{urgencyMapping[getUrgency(incident.upvotes)].icon}</div>
                  <div className="font-bold">{incident.ticketnumber}</div>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <div>{incident.asset_id}</div>
                  <div className="flex items-center">
                    <FaArrowUp className="mr-1" />
                    {formatNumber(incident.upvotes)}
                  </div>
                </div>
                <div
                  className="overflow-hidden whitespace-nowrap"
                  ref={(el) => {
                    addressRefs.current[index] = el;
                  }}
                >
                  {truncateAddress(incident.address)}
                </div>
              </div>
            ))}
  
            {/* Mobile Pagination Controls */}
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={goToPreviousPage}
                className={`px-4 py-2 text-white ${
                  startIndex === 0 ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={startIndex === 0}
              >
                Previous
              </button>
  
              <span className="text-white text-opacity-80">
                Page {startIndex / itemsPerPage + 1} of {totalPages}
              </span>
  
              <button
                onClick={goToNextPage}
                className={`px-4 py-2 text-white ${
                  startIndex + itemsPerPage >= tableitems.length
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                disabled={startIndex + itemsPerPage >= tableitems.length}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
  
      {selectedIncident && (
        <FaultCardUserView
          show={!!selectedIncident}
          onClose={handleClose}
          title={selectedIncident.asset_id}
          address={selectedIncident.address}
          arrowCount={selectedIncident.upvotes}
          commentCount={selectedIncident.commentcount}
          viewCount={selectedIncident.viewcount}
          ticketNumber={selectedIncident.ticketnumber}
          description={selectedIncident.description}
          image={selectedIncident.imageURL}
          createdBy={selectedIncident.createdby}
          urgency={selectedIncident.urgency}
          longitude={selectedIncident.longitude}
          latitude={selectedIncident.latitude}
          ticketId={selectedIncident.ticket_id}
          state={selectedIncident.state}
          municipality_id={selectedIncident.municipality_id}
          refreshwatchlist={refreshwatch}
        />
      )}
    </div>
  );
  
};


export default IncidentTable;
