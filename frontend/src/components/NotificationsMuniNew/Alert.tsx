import React, { useState } from "react";
import { FaExclamationTriangle, FaCircle } from "react-icons/fa";
import TicketViewMuni from "../TicketViewMuni/TicketViewMuni"; // Adjust the import path as necessary

interface AlertProps {
  alerts: { message: string; ticketId: string; isNew: boolean; ticketNumber: string }[]; // Array of alerts with ticketId, ticketNumber, and isNew
}

const Alert: React.FC<AlertProps> = ({ alerts }) => {
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);

  const handleAlertClick = (ticketId: string) => {
    setSelectedTicket(ticketId);
  };

  const handleTicketViewClose = () => {
    setSelectedTicket(null);
  };

  return (
    <>
      <div className="flex flex-col items-center text-black bg-white bg-opacity-70 rounded-3xl p-4 mb-2 mx-4  hover:bg-opacity-80 transition-colors">
        {alerts.map((alert, index) => (
          <div
            key={index}
            className="flex items-center w-full mb-2 cursor-pointer"
            onClick={() => handleAlertClick(alert.ticketId)}
          >
            <div className={`w-4 h-4 rounded-full ${alert.isNew ? "bg-blue-500" : "border-2 border-blue-500"} mr-4`}></div>
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-yellow-100 border border-yellow-300 mr-4">
              <FaExclamationTriangle size={32} color="#FFA500" />
            </div>
            <div className="flex-1 text-center overflow-hidden whitespace-nowrap">
              <div className="text-sm inline-block font-bold">
                Ticket #{alert.ticketNumber}: {alert.message}
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedTicket && (
        <TicketViewMuni
          show={true}
          onClose={handleTicketViewClose}
          title="Road Repair"
          address="123 Main Street, Springfield, USA"
          arrowCount={25}
          commentCount={3}
          viewCount={15}
          ticketNumber={selectedTicket}
          ticket_id={selectedTicket}
          description="Repair the main road."
          user_picture="https://via.placeholder.com/150"
          createdBy="John Doe"
          status="Active"
          imageURL="https://via.placeholder.com/200"
          municipalityImage="https://via.placeholder.com/50"
          upvotes={10}
          latitude="37.7749"
          longitude="-122.4194"
          urgency="high"
        />
      )}
    </>
  );
};

export default Alert;
