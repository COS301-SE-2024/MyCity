import React, { useState } from "react";
import { FaArrowUp, FaEye, FaCommentAlt } from "react-icons/fa";
import { Image as ImageIcon } from "lucide-react"; // Importing the Image icon

interface CardData {
  title: string;
  address: string;
  arrowCount: number;
  commentCount: number;
  viewCount: number;
  ticketNumber: string;
  ticketId: string;
  description: string;
  image: string;
  createdBy: string;
  municipality_id: string;
  state: string;
}

interface FaultCardUserProps {
  data: CardData;
  onClick?: () => void;
}

// states.ts
export const notificationStates = {
  AssigningContract: {
    color: "bg-blue-200",
    text: "Assigning Contract",
  },
  Closed: {
    color: "bg-green-200",
    text: "Closed",
  },
  InProgress: {
    color: "bg-yellow-200",
    text: "In Progress",
  },
  Opened: {
    color: "bg-red-200",
    text: "Opened",
  },
  TakingTenders: {
    color: "bg-purple-200",
    text: "Taking Tenders",
  },
  Default: {
    color: "bg-gray-200",
    text: "Taking Tenders",
  },
};

const FaultCardUser: React.FC<FaultCardUserProps> = ({ data, onClick }) => {
  const { title, address, arrowCount, commentCount, viewCount, image, state } =
    data;
  const [imgSrc, setImgSrc] = useState(image);

  function formatState(state: string | undefined): string {
    if (typeof state !== "string") {
      return ""; // Or some other default value
    }
    return state.replace(/ /g, "");
  }

  const formattedStateKey = formatState(state);

  let color = "bg-gray-200"; // Default color
  let text = "Default"; // Default text

  if (formattedStateKey in notificationStates) {
    color =
      notificationStates[formattedStateKey as keyof typeof notificationStates]
        .color;
    text =
      notificationStates[formattedStateKey as keyof typeof notificationStates]
        .text;
  } else {
    color = notificationStates.Default.color;
    text = notificationStates.Default.text;
  }
  const handleImageError = () => {
    setImgSrc(""); // Clear the image source to show the icon instead
  };

  return (
    <div>
      {/* Desktop View */}
      <div className="hidden sm:block">
        <div
          className="w-full h-[18vh] bg-white bg-opacity-70 cursor-pointer rounded-lg shadow-md overflow-hidden transform transition-transform duration-300 hover:scale-105 flex flex-col"
          onClick={onClick}
        >
          <div className="relative flex-grow-0 h-2/3 w-full bg-gray-200 flex items-center justify-center">
            {/* Image */}
            {imgSrc ? (
              <img
                src={imgSrc}
                alt={title}
                className="w-full h-full object-cover"
                onError={handleImageError}
              />
            ) : (
              <ImageIcon className="text-gray-500" size={48} /> // Placeholder icon
            )}

            {/* Status */}
            <div
              className={`${color} bg-opacity-75 text-black font-bold sm:text-xs md:text-sm lg:text-md text-center rounded-lg px-3 py-1 mt-1 absolute top-0 right-0 m-2`}
            >
              {state}
              {/* {"In Progress"} */}
            </div>
          </div>

          <div className="flex-grow h-1/3 p-1 flex flex-col justify-center text-center">
            <div className="font-bold sm:text-sm md:text-md lg:text-lg truncate">{title}</div>
            <p className="text-black md:text-2xs lg:text-xs  truncate">{address}</p>
          </div>
        </div>
      </div>


      {/* Mobile View */}
      <div className="block sm:hidden">
        <div
          className="w-[10rem] h-[10rem] bg-white bg-opacity-70 cursor-pointer rounded-lg shadow-md overflow-hidden m-2 transform transition-transform duration-300 hover:scale-105 flex flex-col"
          onClick={onClick}
        >
          <div className="flex-grow-0 h-2/3 w-full bg-gray-200 flex items-center justify-center">
            {imgSrc ? (
              <img
                src={imgSrc}
                alt={title}
                className="w-full h-full object-cover"
                onError={handleImageError}
              />
            ) : (
              <ImageIcon className="text-gray-500" size={48} /> // Placeholder icon
            )}
          </div>
          <div className="flex-grow h-1/3 p-2 flex flex-col justify-center text-center">
            <div className="font-bold text-md mb-1 ">{title}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaultCardUser;
