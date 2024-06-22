import React, { useState } from "react";
import {
  FaTimes,
  FaArrowUp,
  FaCommentAlt,
  FaEye,
  FaExclamationTriangle,
  FaTicketAlt,
  FaUser,
} from "react-icons/fa";

interface FaultCardUserViewProps {
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

const FaultCardUserView: React.FC<FaultCardUserViewProps> = ({
  show,
  onClose,
  title,
  address,
  arrowCount,
  commentCount,
  viewCount,
  ticketNumber,
  description,
  image,
  createdBy,
}) => {
  const [arrowColor, setArrowColor] = useState("black");
  const [commentColor, setCommentColor] = useState("black");
  const [eyeColor, setEyeColor] = useState("black");

  const handleArrowClick = () =>
    setArrowColor(arrowColor === "black" ? "blue" : "black");
  const handleCommentClick = () =>
    setCommentColor(commentColor === "black" ? "blue" : "black");
  const handleEyeClick = () =>
    setEyeColor(eyeColor === "black" ? "blue" : "black");

  if (!show) return null;

  const addressParts = address.split(",");

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-2/3 xl:w-1/2 p-4 relative">
        <button
          className="absolute top-2 right-2 text-gray-700"
          onClick={onClose}
        >
          <FaTimes size={24} />
        </button>
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

          {/* Image Section - hidden for now!
          <div className="mb-4">
            <img src={image} alt="Fault" className="rounded-lg" />
          </div>
          */}

          {/* Stats Section */}
          <div className="flex justify-around mb-4">
            <div className="flex flex-col items-center">
              <div
                className="text-xl cursor-pointer transition duration-300 ease-in-out transform hover:scale-110"
                style={{ color: arrowColor }}
                onClick={handleArrowClick}
              >
                <FaArrowUp />
              </div>
              <span className="mt-2 text-gray-700">{arrowCount}</span>
            </div>
            <div className="flex flex-col items-center">
              <div
                className="text-xl cursor-pointer transition duration-300 ease-in-out transform hover:scale-110"
                style={{ color: eyeColor }}
                onClick={handleEyeClick}
              >
                <FaEye />
              </div>
              <span className="mt-2 text-gray-700">{viewCount}</span>
            </div>
            <div className="flex flex-col items-center">
              <div
                className="text-xl cursor-pointer transition duration-300 ease-in-out transform hover:scale-110"
                style={{ color: commentColor }}
                onClick={handleCommentClick}
              >
                <FaCommentAlt />
              </div>
              <span className="mt-2 text-gray-700">{commentCount}</span>
            </div>
          </div>

          {/* Address and Created By Section */}
          <div className="flex justify-between">
            <div className="flex flex-col items-start">
              <h3 className="font-bold text-lg">Address</h3>
              {addressParts.map((part, index) => (
                <p key={index} className="text-gray-700">
                  {part.trim()}
                </p>
              ))}
            </div>
            <div className="flex flex-col items-center">
              <h3 className="font-bold text-lg">Created By</h3>
              <FaUser className="text-2xl mb-2" />
              <p className="text-gray-700">{createdBy}</p>
            </div>
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

export default FaultCardUserView;
