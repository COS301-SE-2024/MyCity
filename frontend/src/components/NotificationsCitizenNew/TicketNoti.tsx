import React, { useState } from "react";
import { Image as ImageIcon } from "lucide-react";
import FaultCardUserView from "../FaultCardUserView/FaultCardUserView";
import { getImageBucketUrl } from "@/config/s3bucket.config";
import Image from "next/image";

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
      {/* Desktop View */}
      <div
        className="hidden sm:flex items-center justify-center w-[95%] shadow h-full text-black bg-white bg-opacity-70 rounded-3xl p-4 mb-2 mx-4 cursor-pointer hover:bg-opacity-80 transition-colors"
        onClick={handleNotificationClick}
      >
        <div className={`w-4 h-4 rounded-full ${circleStyle} mr-4`} />

        <div className="w-[7%] overflow-hidden flex items-center justify-center bg-gray-200  mr-4 rounded-md">
          {image && !imageError ? (
            <Image
              src={getImageBucketUrl(image)}
              alt="Ticket"
              className="w-full h-full object-cover overflow-hidden"
              onError={() => setImageError(true)}
            />
          ) : (
            <ImageIcon size={32} color="#6B7280" />
          )}
        </div>

        <div className="flex-1 text-center overflow-hidden whitespace-nowrap">
          <div className="flex gap-6 text-sm inline-block w-full h-full ">

            <div className="flex flex-col h-full w-[25%] " >
              {/*Fault Type*/}
              <div className="flex lg:text-xl md:text-lg font-bold">
                {title}
              </div>
              {/*Ticket ID*/}
              <div className="flex lg:text-md md:text-sm font-bold">
                {ticketNumber}
              </div>
            </div>

            <div className="flex justify-center gap-2  w-[50%]">
              <div className="flex h-full lg:text-lg md:text-md font-bold justify-center items-center text-center">
                {getActionText()}.
              </div>
            </div>

            {/* Fault's Municipality */}
            <div className="flex items-center justify-end gap-2  w-[30%]">
              <div className="lg:text-md md:text-sm font-bold">
                {municipality_id}
              </div>
              <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center bg-gray-200 border border-gray-300">
                <Image
                  src={`https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/municipality_logos/${formatMunicipalityID(
                    municipality_id
                  )}.png`}
                  alt=""
                />
              </div>
            </div>
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
              <Image
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
