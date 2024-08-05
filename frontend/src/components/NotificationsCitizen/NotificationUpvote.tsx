import React from "react";
import { User, ArrowBigUp  } from "lucide-react"; // Importing User icon from lucide-react

const UpvoteComponent = () => {
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
              <div className="font-bold">James May</div>
              <div className="bg-pink-200 bg-opacity-75 text-black font-bold rounded-lg px-3 py-1 mt-1">
              Upvoted (EKU2-4080-45GE)
              </div>
              {/* <div className="">Yes please fix this!!</div> */}
            </div>
          </div>
        </div>
        <div className="text-center" style={{ marginLeft: "auto" }}>
          <p className="text-sm">10:52</p>
          <div className="text-center">
            <ArrowBigUp  size={32} color="#fcdbee" fill="#fcdbee" strokeWidth={3}></ArrowBigUp >
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpvoteComponent;
