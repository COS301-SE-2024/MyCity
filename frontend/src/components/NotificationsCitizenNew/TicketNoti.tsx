import React, { useState } from "react";
import { Image as ImageIcon } from "lucide-react";
import FaultCardUserView from "../FaultCardUserView/FaultCardUserView";
import { getImageBucketUrl } from "@/config/s3bucket.config";

interface TicketNotificationProps {
  ticketNumber: string;
  image: string;
  action: string;
  isNew: boolean;
  title: string;
  address: string;
  description: string;
  createdBy: string;
  arrowCount: number;
  commentCount: number;
  viewCount: number;
  latitude: number;
  longitude: number;
  ticket_id: string;
  municipality_id: string;
  state: string;
  refreshwatch: () => void;
  urgency: "high" | "medium" | "low";
}

const TicketNotification: React.FC<TicketNotificationProps> = ({
  ticketNumber,
  image,
  action,
  isNew,
  title,
  address,
  description,
  createdBy,
  arrowCount,
  commentCount,
  viewCount,
  latitude,
  longitude,
  urgency,
  ticket_id,
  state,
  municipality_id,
  refreshwatch,
}) => {
  const [showTicketView, setShowTicketView] = useState(false);
  const [imageError, setImageError] = useState(false);

  function formatMunicipalityID(mun: string): string {
    if (typeof mun !== "string") {
      return ""; // Or some other default value
    }
    return mun.replace(/ /g, "_");
  }

  const getActionText = () => {
    switch (action) {
      case "upvoted":
        return "was upvoted";
      case "commented on":
        return "was commented on";
      case "watchlisted":
        return "was watchlisted";
      case "updated":
        return "was updated";
      default:
        return "";
    }
  };

  const handleNotificationClick = () => {
    setShowTicketView(true);
  };

  const handleTicketViewClose = () => {
    setShowTicketView(false);
  };

  const circleStyle = isNew ? "bg-blue-500" : "border-2 border-blue-500";

  return (
    <>
      <div
        className="hidden sm:flex items-center justify-between w-full max-w-[95%] shadow-lg h-full text-black bg-white bg-opacity-70 rounded-3xl p-4 mb-2 mx-4 cursor-pointer hover:bg-opacity-80 transition-colors"
        onClick={handleNotificationClick}
      >
        {/* Fault and Image Section */}
        <div className="flex items-center w-[30%] gap-4">
          {/* Image Circle */}
          <div className="flex-shrink-0 flex items-center justify-center bg-gray-200 rounded-full overflow-hidden w-10 h-10">
            {image && !imageError ? (
              <img
                src={getImageBucketUrl(image)}
                alt="Ticket"
                className="w-full h-full object-cover rounded-full"
                onError={() => setImageError(true)}
              />
            ) : (
              <ImageIcon size={32} color="#6B7280" />
            )}
          </div>

          {/* Fault Details */}
          <div className="flex flex-col justify-center">
            <div className="text-lg font-bold truncate">{title}</div>
            <div className="text-sm text-gray-600 truncate">{ticketNumber}</div>
          </div>
        </div>

        {/* Action Section */}
        <div className="flex w-[30%] justify-center text-center text-md font-semibold">
          {getActionText()}.
        </div>

        {/* Municipality Section */}
        <div className="flex w-[30%] items-center justify-end gap-4">
          {/* Municipality Name */}
          <div className="text-sm font-bold truncate text-right">
            {municipality_id}
          </div>
          {/* Municipality Logo */}
          <div className="flex-shrink-0 w-10 h-10 rounded-full overflow-hidden bg-gray-200 border border-gray-300 flex items-center justify-center">
            <img
              src={`https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/municipality_logos/${formatMunicipalityID(
                municipality_id
              )}.png`}
              alt="Municipality Logo"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Mobile View */}
      <div
        className="block sm:hidden flex flex-col items-center text-black bg-white bg-opacity-70 rounded-2xl p-3 mb-2 mx-2 cursor-pointer hover:bg-opacity-80 transition-colors"
        onClick={handleNotificationClick}
      >
        <div className="flex flex-col items-center w-full">
          <div className="text-sm text-center">
            <span className="font-bold">Ticket #{ticketNumber}</span>{" "}
            {getActionText()}.
          </div>
        </div>
        <div className="flex justify-center mt-2">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 border border-gray-300 flex items-center justify-center">
            {image && !imageError ? (
              <img
                src={getImageBucketUrl(image)}
                alt="Ticket"
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <ImageIcon size={24} color="#6B7280" />
            )}
          </div>
        </div>
      </div>

      {showTicketView && (
        <FaultCardUserView
          show={true}
          onClose={handleTicketViewClose}
          title={title}
          address={address}
          arrowCount={arrowCount}
          commentCount={commentCount}
          viewCount={viewCount}
          ticketNumber={ticketNumber}
          description={description}
          image={image}
          createdBy={createdBy}
          latitude={latitude}
          longitude={longitude}
          urgency={urgency}
          ticketId={ticket_id}
          state={state}
          municipality_id={municipality_id}
          refreshwatchlist={refreshwatch}
        />
      )}
    </>
  );
};

export default TicketNotification;
