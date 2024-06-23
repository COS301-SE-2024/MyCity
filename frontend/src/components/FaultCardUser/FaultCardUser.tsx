import React from "react";
import { FaArrowUp, FaEye, FaCommentAlt } from "react-icons/fa";

interface CardData {
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

interface FaultCardUserProps extends CardData {
  onClick?: () => void; // Make onClick optional
}

function formatNumber(num: number): string {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "k";
  }
  return num.toString();
}

const FaultCardUser: React.FC<FaultCardUserProps> = ({
  title,
  address,
  arrowCount,
  commentCount,
  viewCount,
  image,
  onClick,
}) => {
  return (
    <div
      className="w-80 h-60 bg-white cursor-pointer rounded-lg shadow-md overflow-hidden m-2 transform transition-transform duration-300 hover:scale-105"
      onClick={onClick}
    >
      <div className="p-4 flex flex-col justify-center items-center h-full">
        <div className="text-center">
          <div className="font-bold text-xl mb-2">{title}</div>
          <p className="text-gray-700 text-base">{address}</p>
        </div>
      </div>
    </div>
  );
};

export default FaultCardUser;
