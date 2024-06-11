import React from 'react';
import { User } from 'lucide-react'; // Importing User icon from lucide-react

const CommentComponent = () => {
  return (
    <div className="flex items-center text-center justify-center p-4 bg-white rounded-md border border-gray-200">
      <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center bg-gray-200 border border-gray-300">
        <User size={32} color="#6B7280" />
      </div>
      <div className="ml-4">
        <div className="font-bold text-gray-800">Kyle Marshall</div>
        <div className="text-sm text-gray-600">commented on a Ticket you made (SA0239):</div>
        <div className="text-gray-800">Yes please fix this!!</div>
      </div>
    </div>
  );
};

export default CommentComponent;
