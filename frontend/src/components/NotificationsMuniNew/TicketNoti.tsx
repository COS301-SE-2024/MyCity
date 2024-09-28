import React, { useState, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import TicketViewMuni from "../TicketViewMuni/TicketViewMuni"; // Adjust the import path as necessary
import Image from "next/image";

interface TicketNotificationProps {
  ticketNumber: string;
  image: string | null;
  action: string;
  isNew: boolean;
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
    const mockData = {
      title: "Aliens",
      address: "1234 Mock Street, Happy City",
      description: "Help me.",
      status: "Opened",
      municipalityImage: "",
      user_picture: "",
      createdBy: "Kyle Marshall",
      longitude: "30.0",
      latitude: "-25.0",
      upvotes: 15,
      ticket_id: "12345",
      imageURL: "",
      urgency: "high",
    };
    setTicketData(mockData);
  }, [ticketNumber]);

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
        className="hidden sm:flex items-center text-black bg-white bg-opacity-70 rounded-3xl p-4 mb-2 mx-4 cursor-pointer hover:bg-opacity-80 transition-colors"
        onClick={handleNotificationClick}
      >
        <div className={`w-4 h-4 rounded-full ${circleStyle} mr-4`}></div>
        <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gray-200 border border-gray-300 mr-4">
          {image ? (
            <Image src={image} alt="Ticket" className="w-full h-full object-cover" />
          ) : (
            <FaUserCircle size={32} color="#6B7280" />
          )}
        </div>
        <div className="flex-1 text-center overflow-hidden whitespace-nowrap">
          <div className="text-sm inline-block">
            <span className="font-bold">Ticket #{ticketNumber}</span> was {action}.
          </div>
        </div>
      </div>

      {/* Mobile View */}
      <div className="block sm:hidden flex flex-col text-black bg-white bg-opacity-70 rounded-2xl p-3 mb-2 mx-2 cursor-pointer hover:bg-opacity-80 transition-colors">
        <div className="flex flex-col items-center w-full" onClick={handleNotificationClick}>
          <div className="text-sm text-center font-bold mb-2">
            Ticket #{ticketNumber} was {action}.
          </div>
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gray-200 border border-gray-300">
            {image ? (
              <Image src={image} alt="Ticket" className="w-full h-full object-cover" />
            ) : (
              <FaUserCircle size={32} color="#6B7280" />
            )}
          </div>
        </div>
      </div>

      {showTicketView && ticketData && (
        <TicketViewMuni
          show={true}
          onClose={handleTicketViewClose}
          title="Road Repair"
          address="123 Main Street, Springfield, USA"
          arrowCount={10}
          commentCount={3}
          viewCount={15}
          ticketNumber={ticketNumber}
          ticket_id={ticketData.ticket_id}
          description="Repair the main road."
          user_picture=""
          createdBy="John Doe"
          status="Active"
          imageURL=""
          municipalityImage="https://via.placeholder.com/50"
          upvotes={10}
          latitude="37.7749"
          longitude="-1.4194"
          urgency="high"
        />
      )}
    </>
  );
};

export default TicketNotification;
