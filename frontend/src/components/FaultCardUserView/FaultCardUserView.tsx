import React, { useState, useEffect } from "react";
import { FaArrowUp, FaCommentAlt, FaEye, FaExclamationTriangle, FaTicketAlt, FaTimes } from "react-icons/fa";
import MapComponent from "@/context/MapboxMap"; // Adjust the import path as necessary
import Comments from "../Comments/comments"; // Adjust the import path as necessary
import { Button } from "@nextui-org/react";
import { Route } from "lucide-react";

interface FaultCardUserViewProps {
  show: boolean;
  onClose: () => void;
  title: string;
  address: string;
  arrowCount: number;
  commentCount: number;
  viewCount: number;
  ticketId: string;
  ticketNumber: string;
  description: string;
  image: string;
  createdBy: string;
  latitude: number;
  longitude: number;
  urgency: "high" | "medium" | "low";
}

const urgencyMapping = {
  high: { icon: <FaExclamationTriangle className="text-red-500" />, label: "Urgent" },
  medium: { icon: <FaExclamationTriangle className="text-yellow-500" />, label: "Moderate" },
  low: { icon: <FaExclamationTriangle className="text-green-500" />, label: "Not Urgent" },
};

const FaultCardUserView: React.FC<FaultCardUserViewProps> = ({
  show,
  onClose,
  title,
  address,
  arrowCount,
  commentCount,
  viewCount,
  ticketId,
  ticketNumber,
  description,
  image,
  latitude,
  longitude,
  urgency
}) => {
  const getLocalStorageData = () => {
    const data = localStorage.getItem(`ticket-${ticketNumber}`);
    return data
      ? JSON.parse(data)
      : {
          arrowCount,
          commentCount,
          viewCount,
          arrowColor: "black",
          commentColor: "black",
          eyeColor: "black",
        };
  };

  const initialData = getLocalStorageData();

  const [currentArrowCount, setCurrentArrowCount] = useState(
    initialData.arrowCount
  );
  const [currentCommentCount, setCurrentCommentCount] = useState(
    initialData.commentCount
  );
  const [currentViewCount, setCurrentViewCount] = useState(
    initialData.viewCount
  );
  const [arrowColor, setArrowColor] = useState(initialData.arrowColor);
  const [commentColor, setCommentColor] = useState(initialData.commentColor);
  const [eyeColor, setEyeColor] = useState(initialData.eyeColor);
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    const data = {
      arrowCount: currentArrowCount,
      commentCount: currentCommentCount,
      viewCount: currentViewCount,
      arrowColor,
      commentColor,
      eyeColor,
    };

    localStorage.setItem(`ticket-${ticketNumber}`, JSON.stringify(data));
  }, [
    currentArrowCount,
    currentCommentCount,
    currentViewCount,
    arrowColor,
    commentColor,
    eyeColor,
    ticketNumber,
  ]);

  const toggleComments = () => {
    setShowComments((prev) => !prev);
  };

  const handleArrowClick = () => {
    if (arrowColor === "black") {
      setArrowColor("blue");
      setCurrentArrowCount((prevCount: number) => prevCount + 1);
    } else {
      setArrowColor("black");
      setCurrentArrowCount((prevCount: number) => prevCount - 1);
    }
  };

  const handleCommentClick = () => {
    if (commentColor === "black") {
      setCommentColor("blue");
      setCurrentCommentCount((prevCount: number) => prevCount + 1);
    } else {
      setCommentColor("black");
      setCurrentCommentCount((prevCount: number) => prevCount - 1);
    }
  };

  const handleEyeClick = () => {
    if (eyeColor === "black") {
      setEyeColor("blue");
      setCurrentViewCount((prevCount: number) => prevCount + 1);
    } else {
      setEyeColor("black");
      setCurrentViewCount((prevCount: number) => prevCount - 1);
    }
  };

  if (!show) return null;

  const addressParts = address.split(",");

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 overflow-auto">
      <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-3/4 xl:w-2/3 max-w-4xl max-h-[90vh] p-4 relative flex flex-col lg:flex-row">
        <button
          className="absolute top-2 right-2 text-gray-700"
          onClick={onClose}
        >
          <FaTimes size={24} />
        </button>

        <div className="absolute bottom-6 right-8 z-40">
          <Button className="min-w-fit h-fit p-2 bg-gray-200" onClick={showDirections}>
            <Route size={23} />
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row w-full overflow-auto">
          {/* Left Section */}
          <div className="relative w-full lg:w-1/3 p-2 flex flex-col items-center">
            <div className="absolute top-2 left-2">
            </div>
            <div className="flex items-center">
              <h2 className="font-bold text-2xl">{`Ticket`}</h2>
            </div>
            <div className="flex items-center justify-center mb-2">
              <span className="text-red-500 ml-2"></span>
            </div>
            <div className="mt-2 mb-2 text-center">
              <h3 className="font-bold text-lg">Fault Type</h3>
              <p className="text-gray-700">{title}</p>
            </div>
            <div className="mb-2 text-center">
              <h3 className="font-bold text-lg">Description</h3>
              <p className="text-gray-700">{description}</p>
            </div>
            {image && (
              <div className="mb-2 flex justify-center">
                <img src={image} alt="Fault" className="rounded-lg w-48 h-36 object-cover" />
              </div>
            )}
            <div className="mb-4 flex justify-between w-full px-4">
              <div className="flex items-center">
                <FaArrowUp
                  className="text-gray-600 mr-2 cursor-pointer transform transition-transform hover:scale-110"
                  style={{ color: arrowColor }}
                  onClick={handleArrowClick}
                />
                <span className="text-gray-700">{currentArrowCount}</span>
              </div>
              <div
                className="flex items-center cursor-pointer transform transition-transform hover:scale-105"
                onClick={toggleComments}
              >
                <FaCommentAlt
                  className="text-gray-600 mr-2"
                  style={{ color: commentColor }}
                />
                <span className="text-gray-700">{currentCommentCount}</span>
              </div>
              <div className="flex items-center">
                <FaEye
                  className="text-gray-600 mr-2 cursor-pointer transform transition-transform hover:scale-110"
                  style={{ color: eyeColor }}
                  onClick={handleEyeClick}
                />
                <span className="text-gray-700">{currentViewCount}</span>
              </div>
            </div>

            <div className="flex flex-col text-center items-center mb-4">
              <h3 className="font-bold text-lg">Address</h3>
              <p className="text-gray-700">{addressParts.join(", ")}</p>
            </div>

            <div className="mt-2 flex justify-center gap-2">
              <button
                className="bg-gray-200 text-gray-700 rounded-lg px-2 py-1 hover:bg-gray-300"
                onClick={onClose}
              >
                Back
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
              <Comments onBack={toggleComments} isCitizen={false} ticketId={ticketId}/>
              {/*Added the ticket Number for the comments */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaultCardUserView;
