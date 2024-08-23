import React, { useState, useEffect } from "react";
import { FaCircle, FaRegCircle, FaUserCircle } from "react-icons/fa";
import TenderMax from "../Tenders/MuniTenderMax"; // Adjust the import path as necessary

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
        tender_id: tenderId,
        status: getStatus(action),
        companyname: "Happy Builders Inc.",
        contractdatetime: "2024-08-08T00:00:00Z",
        finalCost: 75000,
        finalDuration: 14,
        ticketnumber: "TKT-12345",
        latitude: 37.7749,
        longitude: -122.4194,
        completedatetime: "2024-08-14T00:00:00Z",
        contractnumber: "CNTR-56789",
        upload: null,
        hasReportedCompletion: action === "completion report received",
      };
      setTenderData(mockData);
    };

    fetchTenderData();
  }, [tenderId, action]);

  const getActionText = () => {
    switch (action) {
      case "bid received":
        return " bid was received";
      case "completion report received":
        return " received a completion report";
      default:
        return "";
    }
  };

  const getStatus = (action: string) => {
    switch (action) {
      case "bid received":
        return "received";
      case "completion report received":
        return "completed";
      default:
        return "submitted";
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
          tender={tenderData}
        />
      )}
    </>
  );
};

export default TenderNotification;
