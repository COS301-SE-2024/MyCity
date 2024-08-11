import React from "react";
import { FaArrowUp, FaEye, FaCommentAlt } from "react-icons/fa";

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

  return (
    <div
      className="w-80 h-auto bg-white bg-opacity-70 cursor-pointer rounded-lg shadow-md overflow-hidden m-2 transform transition-transform duration-300 hover:scale-105"
      onClick={onClick}
    >
      <div className="w-full bg-gray-200">
        {image ? (
          <img src={image} alt={title} className="w-[20rem] h-[10rem] object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            Image Placeholder
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col justify-center items-center">
        <div className="text-center">
          <div className="font-bold text-xl mb-2">{title}</div>
          <p className="text-gray-700 text-base">{address}</p>
        </div>
      </div>
    </div>
  );
};

export default FaultCardUser;
