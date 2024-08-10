import React, { useState, useEffect } from "react";
import { FaCircle, FaRegCircle, FaUserCircle } from "react-icons/fa";
import TicketViewCompany from "../TicketViewCompany/TicketViewCompany";

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
        title: "Aliens",
        address: "1234 Mock Street, Happy City",
        description: "Help me.",
        status: "Opened",
        municipalityImage: "https://via.placeholder.com/50",
        user_picture: "https://via.placeholder.com/50",
        createdBy: "Kyle Marshall",
        longitude: "30.0",
        latitude: "-25.0",
        upvotes: 15,
        ticket_id: "12345",
        imageURL: "https://via.placeholder.com/200",
        urgency: "high",
      };
      setTicketData(mockData);
    };

    fetchTicketData();
  }, [ticketNumber]);

  const getActionText = () => {
    switch (action) {
      case "upvoted":
        return "upvoted";
      case "commented on":
        return "commented on";
      case "watchlisted":
        return "watchlisted";
      case "updated status to:":
        return "updated";
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

  const circleStyle = isNew ? 'bg-blue-500' : 'border-2 border-blue-500';

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
            <span className="font-bold">Ticket #{ticketNumber}</span> was{" "}
            <span className="font-bold">{getActionText()}</span>.
          </div>
        </div>
      </div>

      {showTicketView && ticketData && (
        <>
          <TicketViewCompany
            show={true}
            onClose={handleTicketViewClose}
            title="Road Repair"
            address="123 Main Street, Springfield, USA"
            arrowCount={10}
            commentCount={3}
            viewCount={15}
            tenderId="TND-001"
            description="Repair the main road."
            user_picture="https://via.placeholder.com/150"
            createdBy="John Doe"
            status="Active"
            imageURL="https://via.placeholder.com/200"
            municipalityImage="https://via.placeholder.com/50"
            upvotes={10} //this is being conflated with arrowCount
            latitude="37.7749"
            longitude="-122.4194"
            urgency="high"
          />
        </>
      )}
    </>
  );
};

export default TicketNotification;
