import React from "react";
import { User } from "lucide-react"; // Importing User icon from lucide-react

const UpvoteComponent = () => {
  return (
    // <div className="flex items-center text-opacity-80 text-center justify-center p-4 rounded-md border border-gray-300">
    //   <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center bg-gray-200 border border-gray-300">
    //     <User size={32} color="#6B7280" />
    //   </div>
    //   <div className="ml-4">
    //     <div className="font-bold ">Kyle Marshall</div>
    //     <div className="text-sm ">upvoted a Ticket you made (SA0239).</div>
    //   </div>
    // </div>

    // NotificationUpvote
    <div>
      {/* Upvote Container */}
      <div className="flex border border-gray-300 w-full rounded-md p-4">
        {/* User Profile */}
        <div>
          <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center bg-gray-200 border border-gray-300">
            <User size={32} color="#6B7280" />
          </div>
        </div>
        {/* Upvote Content */}
        <div className="flex items-center text-opacity-80  justify-center">
          <div className="ml-4">
            <div className="font-bold">Kyle Marshall</div>
            <div className="text-md ">upvoted a Ticket you made (SA0239).</div>
            {/* <div className="">Yes please fix this!!</div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpvoteComponent;
