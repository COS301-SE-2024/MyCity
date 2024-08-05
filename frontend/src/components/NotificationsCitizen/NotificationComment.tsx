import React from "react";
import { User, MessageCirclePlus } from "lucide-react"; // Importing User icon from lucide-react
const CommentComponent = () => {
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
              <div className="bg-orange-200 bg-opacity-75 text-black font-bold rounded-lg px-3 py-1 mt-1">
                Commented on (EKU2-4080-45GE)
              </div>

            </div>
          </div>
        </div>
        <div className="text-center" style={{ marginLeft: "auto" }}>
          <p className="text-sm">10:52</p>
          <div className="text-center">
            <MessageCirclePlus
              size={32}
              color="#fee1bf"
              strokeWidth={3}
            ></MessageCirclePlus>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentComponent;
