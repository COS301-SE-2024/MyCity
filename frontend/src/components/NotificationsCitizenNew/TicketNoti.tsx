import React, { useState } from "react";
import { FaCircle, FaUserCircle } from "react-icons/fa";
import FaultCardUserView from "../FaultCardUserView/FaultCardUserView";

interface TicketNotificationProps {
  ticketNumber: string;
  image: string ;
  action: string;
  isNew: boolean; // Determines if the notification is new or viewed
  title: string;
  address: string;
  description: string;
  createdBy: string;
  arrowCount: number;
  commentCount: number;
  viewCount: number;
  latitude: number;
  longitude: number;
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
}) => {
  const [showTicketView, setShowTicketView] = useState(false);

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
        className="flex items-center text-black bg-white bg-opacity-70 rounded-3xl p-4 mb-2 mx-4 cursor-pointer hover:bg-opacity-80 transition-colors"
        onClick={handleNotificationClick}
      >
        <div className={`w-4 h-4 rounded-full ${circleStyle} mr-4`}></div>
        <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center bg-gray-200 border border-gray-300 mr-4">
          {image ? (
            <img src={image} alt="Ticket" className="w-full h-full object-cover" />
          ) : (
            <FaUserCircle size={32} color="#6B7280" />
          )}
        </div>
        <div className="flex-1 text-center overflow-hidden whitespace-nowrap">
          <div className="text-sm inline-block">
            <span className="font-bold">Ticket #{ticketNumber}</span> {getActionText()}.
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
          description={ticketData.description}
          image={ticketData.image}
          createdBy={ticketData.createdBy}
          latitude={ticketData.latitude}
          longitude={ticketData.longitude}
          urgency={ticketData.urgency}
          ticketId={ticketData.ticket_id}

        />
      )}
    </>
  );
};

export default TicketNotification;
