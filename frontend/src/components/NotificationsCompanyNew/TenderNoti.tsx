import React, { useState, useEffect } from "react";
import { FaCircle, FaRegCircle, FaUserCircle } from "react-icons/fa";
import TenderMax from "../Tenders/CompanyTenderMax";// Adjust the import path as necessary

interface TenderNotificationProps {
  tenderId: string;
  image: string | null;
  action: string;
  isNew: boolean; // Determines if the notification is new or viewed
}

const TenderNotification: React.FC<TenderNotificationProps> = ({
  tenderId,
  image,
  action,
  isNew,
}) => {
  const [showTenderView, setShowTenderView] = useState(false);
  const [tenderData, setTenderData] = useState<any>(null);

  useEffect(() => {
    // Mock data - Replace this with actual backend call when available
    const fetchTenderData = async () => {
      const mockData = {
        title: "Infrastructure Repair",
        municipality: "Happy City Municipality",
        description: "Urgent repair needed.",
        status: "Active",
        municipalityImage: "https://via.placeholder.com/50",
        user_picture: "https://via.placeholder.com/50",
        createdBy: "Jane Doe",
        issueDate: "2024-08-08T00:00:00Z",
        price: 50000,
        estimatedDuration: 7,
        upload: null,
        id: tenderId,
      };
      setTenderData(mockData);
    };

    fetchTenderData();
  }, [tenderId]);

  const getActionText = () => {
    switch (action) {
      case "bid accepted":
        return ": your bid was accepted";
      case "bid rejected":
        return ": your bid was rejected";
      case "contract terminated":
        return ": your contract was terminated";
      case "contract completed":
        return " your contract was completed";
      default:
        return "";
    }
  };

  const handleNotificationClick = () => {
    setShowTenderView(true);
  };

  const handleTenderViewClose = () => {
    setShowTenderView(false);
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
            <img src={image} alt="Tender" className="w-full h-full object-cover" />
          ) : (
            <FaUserCircle size={32} color="#6B7280" />
          )}
        </div>
        <div className="flex-1 text-center overflow-hidden whitespace-nowrap">
          <div className="text-sm inline-block">
            <span className="font-bold">Tender #{tenderId}</span>{""}
            {getActionText()}.
          </div>
        </div>
      </div>

      {showTenderView && tenderData && (
        <TenderMax
          onClose={handleTenderViewClose}
          municipality={tenderData.municipality}
          tender={tenderData}
        />
      )}
    </>
  );
};

export default TenderNotification;
