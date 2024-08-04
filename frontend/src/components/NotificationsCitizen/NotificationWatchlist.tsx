import React from "react";
import { User } from "lucide-react"; // Importing User icon from lucide-react

const WatchlistComponent = () => {
  return (
    <div className=" flex items-center border border-gray-300 w-full">
      <div className="border">
        <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center bg-gray-200 border border-gray-300 ">
          <User size={32} color="#6B7280" />
        </div>
      </div>

      <div className="flex items-center text-opacity-80 justify-center p-4 rounded-md w-full">
        <div className="ml-4">
          <div className="font-bold ">City of Ekurhuleni</div>
          <div className="text-sm ">
            updated the status of a Ticket on your Watchlist (EKU2-4080-45GE)
          </div>
          <div className="bg-blue-200 bg-opacity-75 text-black  text-center font-bold rounded-lg px-3 py-1 mt-1">
            Fix in Progress
          </div>
        </div>
      </div>
    </div>
  );
};

export default WatchlistComponent;
