import React from "react";
import { FaArrowUp, FaEye, FaCommentAlt } from "react-icons/fa";
import { User, ArrowBigUp } from "lucide-react";
import { Default } from "node_modules/react-toastify/dist/utils";
import { getImageBucketUrl } from "@/config/s3bucket.config";


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
  state: string;
  municipality_id: string;
  stateFormat: keyof typeof notificationStates;
}

interface StatusCardUserProps extends CardData {
  onClick?: () => void; // Make onClick optional
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

function formatState(state: string): string {
  return state.replace(/ /g, "");
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
  stateFormat,
}) => {
  const formattedStateKey = formatState(state);
  // const { color, text } = notificationStates[formattedStateKey];
  // const { color, text } = notificationStates["AssigningContract"];

  console.log(formatState(state));

  // const iconColor = color.replace("bg-", "#").replace("-200", "");
  return (
    <div className="py-2 px-4">
      {/* Comment Container */}
      <div className="flex flex-col border border-gray-300 w-full rounded-md p-4 items-center">
        <div className="font-bold text-start text-lg">{title}</div>
        <div className="flex flex-col w-full">
          <div className="flex justify-between items-start w-full">
            <div className="flex flex-col">
              <div
              // className={`${color} bg-opacity-75 text-black font-bold rounded-lg px-3 py-1 mt-1`}
              >
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
                  width={50}
                  height={50}
                />
              </div>
              <div className="ml-2 border">{municipality_id}</div>
            </div>
          </div>
          <div className="flex items-center justify-center w-full mt-4">
            <img
              src={getImageBucketUrl(image)}
              alt="Fault image"
              width={200}
              height={200}
              className="rounded-md"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusCardUser;
