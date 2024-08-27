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
}

interface FaultCardUserProps {
  data: CardData;
  onClick?: () => void;
}

const FaultCardUser: React.FC<FaultCardUserProps> = ({ data, onClick }) => {
  const { title, address, arrowCount, commentCount, viewCount, image } = data;
  const [imgSrc, setImgSrc] = useState(image);

  const handleImageError = () => {
    setImgSrc(""); // Clear the image source to show the icon instead
  };

  return (
    <div>
      {/* Desktop View */}
      <div className="hidden sm:block">
        <div
          className="w-72 h-48 bg-white bg-opacity-70 cursor-pointer rounded-lg shadow-md overflow-hidden m-2 transform transition-transform duration-300 hover:scale-105 flex flex-col"
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
            <div className="font-bold text-lg mb-1 truncate">{title}</div>
            <p className="text-black text-xs truncate">{address}</p>
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
