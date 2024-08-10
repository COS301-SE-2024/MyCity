import React, { useState, useEffect } from "react";
import { FaTimes, FaArrowUp, FaComment, FaEye } from "react-icons/fa";
import { AlertCircle } from "lucide-react";
import MapComponent from "@/context/MapboxMap"; // Adjust the import path as necessary
import Comments from "../Comments/comments"; // Adjust the import path as necessary
import TenderMax from "../Tenders/CompanyTenderMax"; // Adjust the import path as necessary

interface TicketViewCompanyProps {
  show: boolean;
  onClose: () => void;
  title: string;
  address: string;
  arrowCount: number;
  commentCount: number;
  viewCount: number;
  tenderId: string;
  description: string;
  user_picture: string;
  createdBy: string;
  status: string;
  imageURL: string;
  municipalityImage: string;
  upvotes: number;
  latitude: string;
  longitude: string;
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
  tenderId,
  description,
  user_picture,
  createdBy,
  status,
  municipalityImage,
  upvotes,
  latitude,
  longitude,
  imageURL,
  urgency,
  arrowCount,
  commentCount,
  viewCount,
}) => {
  const [mapKey, setMapKey] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [showTenderMax, setShowTenderMax] = useState(false);

  useEffect(() => {
    // Force re-render of the map when the component mounts
    setMapKey((prevKey) => prevKey + 1);
  }, []);

  const toggleComments = () => {
    setShowComments((prev) => !prev);
  };

  const handleTenderMaxClose = () => {
    setShowTenderMax(false);
  };

  const getStatusColor = () => { //these states are wrong and need to be changed according to DB.
    switch (status) {            //and then create bid/view bid or view contract button needs to be displayed according to the status
      case "Unassigned":
        return "text-green-500";
      case "Active":
        return "text-blue-500";
      default:
        return "text-gray-500";
    }
  };

  if (!show) return null;

  const addressParts = address.split(",");

  return (
    <>
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
              {imageURL && (
                <div className="mb-2 flex justify-center">
                  <img src={imageURL} alt="Fault" className="rounded-lg w-48 h-36 object-cover" />
                </div>
              )}
              <div className="mb-4 flex justify-between w-full px-4">
                <div className="flex items-center">
                  <FaArrowUp className="text-gray-600 mr-2" />
                  <span className="text-gray-700">{arrowCount}</span>
                </div>
                <div
                  className="flex items-center cursor-pointer transform transition-transform hover:scale-105"
                  onClick={toggleComments}
                >
                  <FaComment className="text-gray-600 mr-2" />
                  <span className="text-gray-700">{commentCount}</span>
                </div>
                <div className="flex items-center">
                  <FaEye className="text-gray-600 mr-2" />
                  <span className="text-gray-700">{viewCount}</span>
                </div>
              </div>
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
                  <h3 className="font-bold text-sm">Created By</h3>
                  <img src={user_picture} alt="Created By" className="rounded-full mb-1 w-12 h-12 object-cover" />
                  <p className="text-gray-700 text-sm">{createdBy}</p>
                </div>
              </div>
              <div className="mt-2 flex justify-center gap-2">
                <button
                  className="bg-gray-200 text-gray-700 rounded-lg px-2 py-1 hover:bg-gray-300"
                  onClick={onClose}
                >
                  Back
                </button>
                <button
                  className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600"
                  onClick={() => setShowTenderMax(true)}
                >
                  View Tender
                </button>
              </div>
            </div>
            {/* Right Section (Map Placeholder) */}
            <div className="w-full lg:w-2/3 bg-gray-200 flex items-center justify-center relative overflow-hidden">
              <div className="w-full h-full flex items-center justify-center text-gray-500" id="map">
                <MapComponent longitude={Number(longitude)} latitude={Number(latitude)} zoom={14} containerId="map" style="mapbox://styles/mapbox/streets-v12" />
              </div>

              {/* Comments Section with Slide Animation */}
              <div
                className={`absolute top-0 left-0 w-full h-full bg-white z-10 transform transition-transform duration-300 ${
                  showComments ? "translate-x-0" : "translate-x-full"
                }`}
                style={{ pointerEvents: showComments ? "auto" : "none" }}
              >
                <Comments onBack={toggleComments} isCitizen={false} />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* This needs to be populated from DB according to the ticketid. It's currently just a mocked active tender*/}
      {showTenderMax && (
        <TenderMax
          tender={{
            id: tenderId,
            ticketId: tenderId,
            status: status === "Active" ? "Active" : "Unassigned",
            municipality: "Municipality Name", // Replace with actual municipality name
            issueDate: new Date().toISOString(),
            price: 1000, // Replace with actual price
            estimatedDuration: 5, // Replace with actual duration
            upload: null, // Replace with actual file if available
            hasReportedCompletion: false,
          }}
          onClose={handleTenderMaxClose}
          municipality="Municipality Name" // Replace with actual municipality name
        />
      )}
    </>
  );
};

export default TicketViewCompany;
