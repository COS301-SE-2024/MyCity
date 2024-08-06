import React from "react";
import { Eye } from "lucide-react";
import { MessageCirclePlus } from "lucide-react";
import { ArrowBigUp } from "lucide-react";

interface cardDataWatchlist {
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

interface UpvoteCardUserProps extends cardDataWatchlist {
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

const UpvoteCardUser: React.FC<UpvoteCardUserProps> = ({
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
  const { color, text } = notificationStates[formattedStateKey];
  // const { color, text } = notificationStates["AssigningContract"];

  console.log(formatState(state));

  const iconColor = color.replace("bg-", "#").replace("-200", "");
  return (
    <div className="py-2 px-4">
      {/* Comment Container */}
      <div className="flex flex-col border border-gray-300 w-full rounded-md p-4 items-center">
        <div className="flex w-full justify-between items-center">
          <div className="flex justify-start items-center">
            <div className="text-xl font-bold text-gray-400 ">
              UMZ2-4051-7J62
            </div>
          </div>

          <div className="flex justify-end items-center ">
            <div className="font-bold text-2xl pb-4">{title}</div>
          </div>

          <div className="flex justify-end items-center  text-gray-400">
            <div className="font-bold text-lg pb-4">2 August</div>
          </div>
        </div>

        <div className="flex w-full justify-between items-center">
          {/* Users Profile */}
          <div className=" flex">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center bg-gray-200 border border-gray-300">
                <img
                  src={`https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/municipality_logos/${formatMunicipalityID(
                    municipality_id
                  )}.png`}
                  alt=""
                />
              </div>
              <div className="ml-2">{municipality_id}</div>
            </div>
          </div>

          {/* Status */}
          <div className="flex  w-1/3">
            <div className="flex items-center justify-center w-full">
              <div className="flex flex-col justify-center items-start w-full">
                {/*Status Button*/}
                <div
                  className={`bg-pink-300 bg-opacity-75 text-black font-bold text-lg rounded-lg px-3 py-1 mt-1 w-full`}
                >
                  Upvoted
                </div>
              </div>
            </div>
          </div>

          {/* Upvotes */}
          <div className="flex text-gray-400">
            {" "}
            <div className="flex items-center justify-center">
              <ArrowBigUp size={48} />
              <div className="ml-1 text-lg font-bold ">{arrowCount}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpvoteCardUser;
