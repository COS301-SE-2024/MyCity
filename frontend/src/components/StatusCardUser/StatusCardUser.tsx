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
  return mun.replace(/ /g, "_");
}

function getDate(date: string): string {
  return date.split("T")[0];
}
function getTime(date: string): string {
  return date.split("T")[1].split(".")[0];
}

function displayDate(date: string): string {
  const inputDate = new Date(date);
  const currentDate = new Date();

  const inputDay = inputDate.toISOString().split("T")[0];
  const currentDay = currentDate.toISOString().split("T")[0];

  if (inputDay === currentDay) {
    return getTime(date);
  } else {
    return getDate(date);
  }
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
    // <div className="py-2 px-4">
    //   {/* Comment Container */}
    //   <div className="flex border border-gray-300 w-full rounded-md p-4">
    //     <div className="flex ">
    //       {/* User Profile */}
    //       <div>
    //         <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center bg-gray-200 border border-gray-300">
    //           <img
    //             src={`https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/municipality_logos/${formatMunicipalityID(
    //               municipality_id
    //             )}.png`}
    //             alt=""
    //           />
    //         </div>
    //       </div>
    //       {/* Comment Content */}
    //       <div className="flex items-start text-opacity-80 justify-center border">
    //         <div className="ml-4">
    //           <div className="font-bold text-start">{municipality_id}</div>
    //           <div className="text-start">{title}</div>
    //           <div className=" bg-pink-200 bg-opacity-75 text-black font-bold rounded-lg px-3 py-1 mt-1">
    //             {state}
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //     <div className="text-center" style={{ marginLeft: "auto" }}>
    //       <p className="text-sm">{displayDate(createdBy)}</p>
    //       <div className="w">
    //         <img src={image} alt="Fault image" />
    //       </div>

    //     </div>
    //   </div>
    // </div>

    <div className="py-2 px-4">
      {/* Comment Container */}
      <div className="flex flex-col border border-gray-300 w-full rounded-md p-4 items-center">
        <div className="font-bold text-start text-lg">{title}</div>
        <div className="flex ">
          {/* User Profile */}

          {/* Comment Content */}
          <div className="flex flex-col justify-between text-opacity-80 border ml-4">
            <div className="flex items-start justify-center">
              <div className="bg-pink-200 bg-opacity-75 text-black font-bold rounded-lg px-3 py-1 mt-1">
                {state}
              </div>
            </div>
            <div className="flex items-end justify-center p-4">
            <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center bg-gray-200 border border-gray-300">
              <img
                src={`https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/municipality_logos/${formatMunicipalityID(
                  municipality_id
                )}.png`}
                alt=""
              />
            </div>
              <div className="border">{municipality_id}</div>
            </div>
          </div>

          {/* Comment Content */}
          <div className="flex items-start text-opacity-80 justify-center">
            <div className="ml-4">
              <img
                src={image}
                alt="Fault image"
                width={300}
                className="rounded-md"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusCardUser;
