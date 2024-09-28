import React, { useState, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import TenderMax from "../Tenders/MuniTenderMax"; // Adjust the import path as necessary


interface TenderNotificationProps {
  tenderId: string;
  image: string | null;
  action: string;
  isNew: boolean;
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
    const mockData = {
      tender_id: tenderId,
      status: action === "completion report received" ? "completed" : "received",
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
  }, [tenderId, action]);

  const handleNotificationClick = () => {
    setShowTenderView(true);
  };

  const handleTenderViewClose = () => {
    setShowTenderView(false);
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
            <img src={image} alt="Tender" width={100} height={100} className="w-full h-full object-cover" />
          ) : (
            <FaUserCircle size={32} color="#6B7280" />
          )}
        </div>
        <div className="flex-1 text-center overflow-hidden whitespace-nowrap">
          <div className="text-sm inline-block">
            <span className="font-bold">Tender #{tenderId}</span> {action}.
          </div>
        </div>
      </div>

      {/* Mobile View */}
      <div className="block sm:hidden flex flex-col text-black bg-white bg-opacity-70 rounded-2xl p-3 mb-2 mx-2 cursor-pointer hover:bg-opacity-80 transition-colors">
        <div className="flex flex-col items-center w-full" onClick={handleNotificationClick}>
          <div className="text-sm text-center font-bold mb-2">
            Tender #{tenderId} {action}.
          </div>
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gray-200 border border-gray-300">
            {image ? (
              <img src={image} alt="Tender" width={100} height={100} className="w-full h-full object-cover" />
            ) : (
              <FaUserCircle size={32} color="#6B7280" />
            )}
          </div>
        </div>
      </div>

      {showTenderView && tenderData && (
        <TenderMax onClose={handleTenderViewClose} tender={tenderData} />
      )}
    </>
  );
};

export default TenderNotification;
