"use client";
import React from "react";
import { User, CircleCheck } from "lucide-react";

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
};

interface UpdateComponentProps {
  state: keyof typeof notificationStates;
}

const UpdateComponent: React.FC<UpdateComponentProps> = ({ state }) => {
  const { color, text } = notificationStates[state];
  const iconColor = color.replace('bg-', '#').replace('-200', ''); // Convert Tailwind color class to hex code

  return (
    <div className="py-2 px-4">
      {/* Comment Container */}
      <div className="flex border border-gray-300 w-full rounded-md p-4">
        <div className="flex">
          {/* User Profile */}
          <div>
            <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center bg-gray-200 border border-gray-300">
              <img src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/municipality_logos/City_of_Ekurhuleni_Metropolitan.png"/>
            </div>
          </div>
          {/* Comment Content */}
          <div className="flex items-center text-opacity-80 justify-center">
            <div className="ml-4">
              <div className="font-bold">City of Ekurhuleni Metropolitan</div>
              <div
                className={`${color} bg-opacity-75 text-black font-bold rounded-lg px-3 py-1 mt-1`}
              >
                {text} (EKU2-4080-45GE)
              </div>
            </div>
          </div>
        </div>
        <div className="text-center" style={{ marginLeft: "auto" }}>
          <p className="text-sm">10:52</p>
          <div className="text-center">
            <CircleCheck
              size={32}
              color={iconColor} // Use dynamic color for the icon
              strokeWidth={3}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateComponent;
