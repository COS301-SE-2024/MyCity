import React from "react";
import { FaArrowUp, FaEye, FaCommentAlt } from "react-icons/fa";
import { User, ArrowBigUp } from "lucide-react";

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

interface StatusCardUserProps extends CardData {
  onClick?: () => void; // Make onClick optional
}

function formatNumber(num: number): string {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "k";
  }
  return num.toString();
}

function formatMunicipalityID(mun: string): string {
  return mun.replace(/ /g, '_');
}



const StatusCardUser: React.FC<StatusCardUserProps> = ({
  title,
  address,
  arrowCount,
  commentCount,
  viewCount,
  image,
  createdBy,
  onClick,
  municipality_id,
  state,
}) => {
  return (
    // NotificationComment
    <div className="py-2 px-4">
      {/* Comment Container */}
      <div className="flex border border-gray-300 w-full rounded-md p-4">
        <div className="flex ">
          {/* User Profile */}
          <div>
            <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center bg-gray-200 border border-gray-300">
            <img src={`https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/municipality_logos/${formatMunicipalityID(municipality_id)}.png`} alt="" />

            </div>
          </div>
          {/* Comment Content */}
          <div className="flex items-center text-opacity-80 justify-center">
            <div className="ml-4">
              <div className="font-bold text-start">{municipality_id}</div>
              <div className="bg-pink-200 bg-opacity-75 text-black font-bold rounded-lg px-3 py-1 mt-1">
                {title} - {state}
              </div>
            </div>
          </div>
        </div>
        <div className="text-center" style={{ marginLeft: "auto" }}>
          <p className="text-sm">{createdBy}</p>
          <div className="text-center">
            <ArrowBigUp
              size={32}
              color="#fcdbee"
              fill="#fcdbee"
              strokeWidth={3}
            ></ArrowBigUp>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusCardUser;
