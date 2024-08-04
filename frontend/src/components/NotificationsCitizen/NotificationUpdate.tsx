'use client';
import React from "react";
import { User } from "lucide-react";

// states.ts
export const notificationStates = {
  AssigningContract: {
    color: 'bg-blue-200',
    text: 'Assigning Contract'
  },
  Closed: {
    color: 'bg-green-200',
    text: 'Closed'
  },
  InProgress: {
    color: 'bg-yellow-200',
    text: 'In Progress'
  },
  Opened: {
    color: 'bg-red-200',
    text: 'Opened'
  },
  TakingTenders: {
    color: 'bg-purple-200',
    text: 'Taking Tenders'
  }
};

interface UpdateComponentProps {
  state: keyof typeof notificationStates;
}

const UpdateComponent: React.FC<UpdateComponentProps> = ({ state }) => {
  const { color, text } = notificationStates[state];

  return (
// NotificationComment
<div className="py-2 px-4">
{/* Comment Container */}
<div className="flex border border-gray-300 w-full rounded-md p-4">
  <div className="flex ">
    {/* User Profile */}
    <div>
      <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center bg-gray-200 border border-gray-300">
        <User size={32} color="#6B7280" />
      </div>
    </div>
    {/* Comment Content */}
    <div className="flex items-center text-opacity-80 justify-center">
      <div className="ml-4">
        <div className="font-bold">Kyle Marshall</div>
        <div className={`${color} bg-opacity-75 text-black font-bold rounded-lg px-3 py-1 mt-1`}>
            {text} (EKU2-4080-45GE)
          </div>
        {/* <div className="">Yes please fix this!!</div> */}
      </div>
    </div>
  </div>
  <div className="text-center" style={{ marginLeft: "auto" }}>
    <p className="text-sm">10:52</p>
  </div>
</div>
</div>
  );
};

export default UpdateComponent;
