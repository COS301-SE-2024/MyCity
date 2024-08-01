import React from 'react';
import { User } from 'lucide-react'; // Importing User icon from lucide-react

const UpvoteComponent = () => {
  return (
    <div className="flex items-center  text-white text-opacity-80 text-center justify-center p-4 rounded-md ">
      <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center bg-gray-200 border border-gray-300">
        <User size={32} color="#6B7280" />
      </div>
      <div className="ml-4">
        <div className="font-bold ">Kyle Marshall</div>
        <div className="text-sm ">upvoted a Ticket you made (SA0239).</div>
      </div>
    </div>
  );
};

export default UpvoteComponent;