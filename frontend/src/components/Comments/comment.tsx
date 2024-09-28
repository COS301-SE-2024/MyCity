import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import Image from 'next/image';

interface CommentProps {
  userName: string;
  userImage: string;
  time: Date;
  commentText: string;
}

const Comment: React.FC<CommentProps> = ({ userName, userImage, time, commentText }) => {
  return (
    <div className="flex items-start mb-4">
      <div className="flex-shrink-0">
        <img src={userImage} alt={userName} width={100} height={100} className="w-12 h-12 rounded-full" />
      </div>
      <div className="ml-4 flex-1">
        <div className="font-bold">{userName}</div>
        <div className="text-gray-800">{commentText}</div>
        <div className="text-xs text-gray-500 mt-1">
          {/*formatDistanceToNow(new Date(time), { addSuffix: true })*/}
          {formatDistanceToNow(time, { addSuffix: true })} {/* Use Date object directly */}
        </div>
      </div>
    </div>
  );
};

export default Comment;
