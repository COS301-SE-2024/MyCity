import React, { useState, useEffect } from "react";
import {FaArrowUp,FaCommentAlt,FaEye,FaExclamationTriangle,FaTicketAlt} from "react-icons/fa";

interface StatusCardUserViewProps {
  show: boolean;
  onClose: () => void;
  title: string;
  address: string;
  arrowCount: number;
  commentCount: number;
  viewCount: number;
  ticketNumber: string;
  description: string;
  image: string;
  createdBy: string;
}

const StatusCardUserView: React.FC<StatusCardUserViewProps> = ({
  show,
  onClose,
  title,
  address,
  arrowCount,
  commentCount,
  viewCount,
  ticketNumber,
  description,
  image
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
      <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-3/4 xl:w-1/2 p-4 relative">
        
        <div className="p-4">
          {/* Header Section */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <FaTicketAlt className="mr-2 text-2xl" />
              <h2 className="font-bold text-2xl">{`Ticket ${ticketNumber}`}</h2>
            </div>
            <div className="flex items-center text-red-500">
              <FaExclamationTriangle size={24} />
              <span className="ml-2">Unaddressed</span>
            </div>
          </div>

          {/* Fault Type Section */}
          <div className="mb-4">
            <h3 className="font-bold text-lg">Fault Type</h3>
            <p className="text-gray-700">{title}</p>
          </div>

          {/* Description Section */}
          <div className="mb-4">
            <h3 className="font-bold text-lg">Description</h3>
            <p className="text-gray-700">{description}</p>
          </div>

          {/* Image and Stats Section */}
          <div className="flex justify-center items-center mb-4">
            <div className="mb-4 text-center">
              <img src={image} alt="Fault" className="rounded-lg w-72 h-54" />
            </div>
            <div className="flex flex-col items-center ml-4">
              <div className="flex flex-col items-center mb-4">
                <div
                  className="text-xl cursor-pointer transition duration-300 ease-in-out transform hover:scale-110"
                  style={{ color: arrowColor }}
                  onClick={handleArrowClick}
                >
                  <FaArrowUp />
                </div>
                <span className="mt-2 text-gray-700">{currentArrowCount}</span>
              </div>
              <div className="flex flex-col items-center mb-4">
                <div
                  className="text-xl cursor-pointer transition duration-300 ease-in-out transform hover:scale-110"
                  style={{ color: eyeColor }}
                  onClick={handleEyeClick}
                >
                  <FaEye />
                </div>
                <span className="mt-2 text-gray-700">{currentViewCount}</span>
              </div>
              <div className="flex flex-col items-center mb-4">
                <div
                  className="text-xl cursor-pointer transition duration-300 ease-in-out transform hover:scale-110"
                  style={{ color: commentColor }}
                  onClick={handleCommentClick}
                >
                  <FaCommentAlt />
                </div>
                <span className="mt-2 text-gray-700">
                  {currentCommentCount}
                </span>
              </div>
            </div>
          </div>

          {/* Address and Created By Section */}
          {/* Address Section */}
          <div className="flex flex-col text-center items-center mb-4">
            <h3 className="font-bold text-center text-lg">Address</h3>
            <p className="text-gray-700">{addressParts.join(", ")}</p>
          </div>

          {/* Back Button */}
          <div className="mt-4 flex justify-center">
            <button
              className="bg-gray-200 text-gray-700 rounded-lg px-4 py-2"
              onClick={onClose}
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusCardUserView;
