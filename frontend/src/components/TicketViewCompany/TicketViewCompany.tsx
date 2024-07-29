import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { AlertCircle } from "lucide-react";
import TenderMax from "../Tenders/CompanyTenderMax"; // Adjust the import path as necessary
import MuniTenders from "../RecordsTable/MuniTenders";
import CreateBid from "../Tenders/CreateBid"; // Adjust the import path as necessary

interface TicketViewCompanyProps {
  show: boolean;
  onClose: () => void;
  title: string;
  address: string;
  ticketNumber: string;
  description: string;
  image: string;
  createdBy: string;
  status: string;
  municipalityImage: string;
  urgency: "high" | "medium" | "low";
}

const urgencyMapping = {
  high: { icon: <AlertCircle className="text-red-500" />, label: "Urgent" },
  medium: { icon: <AlertCircle className="text-yellow-500" />, label: "Moderate" },
  low: { icon: <AlertCircle className="text-green-500" />, label: "Not Urgent" },
};

const TicketViewCompany: React.FC<TicketViewCompanyProps> = ({
  show,
  onClose,
  title,
  address,
  ticketNumber,
  description,
  image,
  createdBy,
  status,
  municipalityImage,
  urgency,
}) => {
  const [showTenderMax, setShowTenderMax] = useState(false);
  const [showMuniTenders, setShowMuniTenders] = useState(false);
  const [showCreateBid, setShowCreateBid] = useState(false);

  const getStatusColor = () => {
    switch (status) {
      case "Unaddressed":
        return "text-red-500";
      case "Fix in progress":
        return "text-blue-500";
      default:
        return "text-gray-500";
    }
  };

  if (!show) return null;

  const addressParts = address.split(",");

  const handleTenderContractClick = () => {
    setShowTenderMax(true);
  };

  const handleTenderMaxClose = () => {
    setShowTenderMax(false);
  };

  const handleViewTendersClick = () => {
    setShowMuniTenders(true);
  };

  const handleBack = () => {
    setShowMuniTenders(false);
  };

  const handleCreateBidClick = () => {
    setShowCreateBid(true);
  };

  const handleCreateBidClose = () => {
    setShowCreateBid(false);
  };

  const ticket = {
    id: ticketNumber,
    faultType: title,
    description,
    address,
    municipalityImage,
  };

  return (
    <>
      {!showTenderMax && !showMuniTenders && !showCreateBid && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 overflow-auto">
          <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-3/4 xl:w-2/3 max-w-4xl max-h-[90vh] p-4 relative flex flex-col lg:flex-row">
            <button className="absolute top-2 right-2 text-gray-700" onClick={onClose}>
              <FaTimes size={24} />
            </button>
            <div className="flex flex-col lg:flex-row w-full overflow-auto">
              {/* Left Section */}
              <div className="relative w-full lg:w-1/3 p-2 flex flex-col items-center">
                <div className="absolute top-2 left-2">
                  {urgencyMapping[urgency].icon}
                </div>
                <img
                  src={municipalityImage}
                  alt="Municipality"
                  className="w-16 h-16 mb-2 rounded-full"
                />
                <div className="flex items-center justify-center mb-2">
                  <div className={`flex items-center ${getStatusColor()} border-2 rounded-full px-2 py-1`}>
                    <span className="ml-1">{status}</span>
                  </div>
                </div>
                <div className="mt-2 mb-2 text-center">
                  <p className="text-gray-700 font-bold">{title}</p>
                </div>
                <div className="mb-2 text-center">
                  <p className="text-gray-700 text-sm">{description}</p>
                </div>
                {image && (
                  <div className="mb-2 flex justify-center">
                    <img src={image} alt="Fault" className="rounded-lg w-48 h-36 object-cover" />
                  </div>
                )}
                <div className="flex justify-around mb-2 w-full">
                  <div className="flex flex-col items-center justify-center">
                    <h3 className="font-bold text-md">Address</h3>
                    {addressParts.map((part, index) => (
                      <p key={index} className="text-gray-700 text-sm">
                        {part.trim()}
                      </p>
                    ))}
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <h3 className="font-bold text-md">Created By</h3>
                    <img src="https://via.placeholder.com/40" alt="Created By" className="rounded-full mb-1" />
                    <p className="text-gray-700 text-sm">{createdBy}</p>
                  </div>
                </div>
                <div className="mt-2 flex justify-center gap-2">
                  <button className="bg-gray-200 text-gray-700 rounded-lg px-2 py-1 hover:bg-gray-300" onClick={onClose}>
                    Back
                  </button>
                  {status === "Fix in progress" && (
                    <button
                      className="border border-blue-500 text-blue-500 rounded-lg px-2 py-1 hover:bg-blue-500 hover:text-white"
                      onClick={handleTenderContractClick}
                    >
                      Tender Contract
                    </button>
                  )}
                  {status === "Unaddressed" && (
                    <button
                      className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600"
                      onClick={handleCreateBidClick}
                    >
                      Create Bid
                    </button>
                  )}
                </div>
              </div>
              {/* Right Section (Map Placeholder) */}
              <div className="w-full lg:w-2/3 bg-gray-200 flex items-center justify-center">
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  Map Placeholder
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showTenderMax && (
        <TenderMax
          tender={{
            id: ticketNumber,
            ticketId: ticketNumber,
            status: status === "Fix in progress" ? "Active" : "Unassigned",
            serviceProvider: createdBy,
            issueDate: new Date().toISOString().split('T')[0],
            price: 1000,
            estimatedDuration: 5,
            upload: null,
            hasReportedCompletion: false,
          }}
          onClose={handleTenderMaxClose}
        />
      )}

      {showMuniTenders && (
        <MuniTenders
          ticketId={ticketNumber}
          onBack={handleBack}
        />
      )}

{showCreateBid && (
  <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
    <div className="transform scale-80 w-full">
      <CreateBid
        ticket={ticket}
        onBack={handleCreateBidClose}
      />
    </div>
  </div>
)}



    </>
  );
};

export default TicketViewCompany;
