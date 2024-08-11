import React, { useState, useEffect } from "react";
import { FaCircle, FaUserCircle } from "react-icons/fa";
import FaultCardUserView from "../FaultCardUserView/FaultCardUserView"; // Adjust the import path as necessary

interface TicketNotificationProps {
  ticketNumber: string;
  image: string | null;
  action: string;
  isNew: boolean; // Determines if the notification is new or viewed
}

const TicketNotification: React.FC<TicketNotificationProps> = ({
  ticketNumber,
  image,
  action,
  isNew,
}) => {
  const [showTicketView, setShowTicketView] = useState(false);
  const [ticketData, setTicketData] = useState<any>(null);

  useEffect(() => {
    // Mock data - Replace this with actual backend call when available
    const fetchTicketData = async () => {
      const mockData = {
        title: "Road Repair",
        address: "123 Main Street, Springfield, USA",
        description: "Repair the main road.",
        image: "https://via.placeholder.com/200",
        createdBy: "John Doe",
        arrowCount: 10,
        commentCount: 3,
        viewCount: 15,
        latitude: 37.7749,
        longitude: -122.4194,
        urgency: "high",
      };
      setTicketData(mockData);
    };

    fetchTicketData();
  }, [ticketNumber]);

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

      {showTicketView && ticketData && (
        <FaultCardUserView
          show={true}
          onClose={handleTicketViewClose}
          title={ticketData.title}
          address={ticketData.address}
          arrowCount={ticketData.arrowCount}
          commentCount={ticketData.commentCount}
          viewCount={ticketData.viewCount}
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
