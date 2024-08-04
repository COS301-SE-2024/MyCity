import React from "react";
import { User, MessageCirclePlus  } from "lucide-react"; // Importing User icon from lucide-react
const CommentComponent = () => {
  return (
    // NotificationComment
<div>
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
        <div className="text-md">upvoted Ticket (EKU2-4080-45GE)</div>
        {/* <div className="">Yes please fix this!!</div> */}
      </div>
    </div>
  </div>
  <div className="text-center" style={{ marginLeft: "auto" }}>
    <p className="text-sm">10:52</p>
    <div className="text-center">
      <MessageCirclePlus   size={32} color="#7034a9" strokeWidth={3}></MessageCirclePlus  >
    </div>
  </div>
</div>
</div>
  );
};

export default CommentComponent;
