'use client';

import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaPaperPlane } from 'react-icons/fa';
import Comment from './comment'; // Adjust the import path as necessary
import { useProfile } from "@/hooks/useProfile";
import {
  addCommentWithoutImage,
  getTicketComments,
} from '@/services/tickets.service';
import { UserRole } from '@/types/custom.types';

interface CommentsProps {
  onBack: () => void;
  isCitizen: boolean;
  ticketId: string; // Add ticketId as a prop to identify the ticket
}

const Comments: React.FC<CommentsProps> = ({ onBack, isCitizen, ticketId }) => {
  const [newComment, setNewComment] = useState(''); // State for new comment input
  const [comments, setComments] = useState<any[]>([]); // State for all comments
  const [loading, setLoading] = useState(true); // State to manage loading
  const userProfile = useProfile();

  const fetchComments = async () => {
    try {
      const user_data = await userProfile.getUserProfile();
      const userSession = String(user_data.current?.session_token);
      const commentsData = await getTicketComments(ticketId, userSession);

      setComments(commentsData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching comments:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handleNewComment = async () => {
    if (newComment.trim() !== '') {
      try {
        const user_data = await userProfile.getUserProfile();
        const userName = `${user_data.current?.given_name} ${user_data.current?.family_name}`;
        const user_picture = String(user_data.current?.picture);
        const userSession = String(user_data.current?.session_token);
        const user_email = String(user_data.current?.email);
        const userRole = user_data.current?.user_role || UserRole.CITIZEN; // default to citizen if user_role is not set

        const dateCommentCreated = new Date().toISOString();

        const newCommentData = {
          userName: userName,
          userImage: user_picture || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541",
          date: dateCommentCreated,
          comment: newComment,
        };

        await addCommentWithoutImage(newCommentData.comment, ticketId, user_email, dateCommentCreated, userRole, userSession);

        setComments([...comments, newCommentData]);
        setNewComment('');
      } catch (error) {
        console.error("Error adding comment:", error);
      }
    }
  };

  return (
    <div className="relative h-full rounded-3xl flex flex-col">
      <div className="flex items-center mb-4">
        <button className="text-gray-700 mr-4" onClick={onBack}>
          <FaArrowLeft size={24} />
        </button>
        <h2 className="text-xl text-black font-bold">Comments</h2>
      </div>
      <div className="flex-grow text-black overflow-auto mb-4">
        {loading ? (
          <p>Loading comments...</p>
        ) : comments.length > 0 ? (
          comments.map((comment, index) => (
            <Comment
              key={index}
              userName={comment.userName}
              userImage={comment.userImage}
              time={new Date(comment.date)}
              commentText={comment.comment} // Use commentText to ensure the actual comment is displayed
            />
          ))
        ) : (
          <p>No comments to display.</p>
        )}

      </div>
      <div className="flex items-center p-2 border-t">
        <div className="border-l-4 border-gray-200 h-full mr-4"></div> {/* Vertical separator */}
        <input
          type="text"
          className="flex-grow border rounded-3xl px-2 py-1 mr-2"
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button
          className={`flex items-center justify-center p-2 rounded-full ${newComment.trim() ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          onClick={handleNewComment}
          disabled={!newComment.trim()}
        >
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
};

export default Comments;
