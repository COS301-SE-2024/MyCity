import React, { useState } from 'react';
import { FaArrowLeft, FaPaperPlane } from 'react-icons/fa';
import Comment from './comment'; // Adjust the import path as necessary

interface CommentsProps {
  onBack: () => void;
  isCitizen: boolean;
}

const Comments: React.FC<CommentsProps> = ({ onBack, isCitizen }) => {
  const [newComment, setNewComment] = useState(''); // State for new comment input
  const [comments, setComments] = useState([
    {
      userName: 'John Doe',
      userImage: 'https://via.placeholder.com/150',
      time: new Date(new Date().setHours(new Date().getHours() - 13)),
      commentText: 'This is a sample comment.',
    },
    {
      userName: 'Jane Smith',
      userImage: 'https://via.placeholder.com/150',
      time: new Date(new Date().setDate(new Date().getDate() - 3)),
      commentText: 'Another example of a comment.',
    },
    {
      userName: 'Bob Johnson',
      userImage: 'https://via.placeholder.com/150',
      time: new Date(new Date().setDate(new Date().getDate() - 10)),
      commentText: 'This is a longer comment that demonstrates how text is handled in this layout.',
    },
  ]);

  // Function to handle adding a new comment
  const handleNewComment = () => {
    if (newComment.trim() !== '') {
      const newCommentData = {
        userName: 'Current User', // Replace with actual logged-in user's name
        userImage: 'https://via.placeholder.com/150', // Replace with actual logged-in user's image
        time: new Date(),
        commentText: newComment,
      };
      setComments([...comments, newCommentData]); // Add new comment to the list
      setNewComment(''); // Clear the input field after submission
    }
  };

  return (
    <div className="relative h-full flex flex-col">
      <div className="flex items-center mb-4">
        <button className="text-gray-700 mr-4" onClick={onBack}>
          <FaArrowLeft size={24} />
        </button>
        <h2 className="text-xl font-bold">Comments</h2>
      </div>
      <div className="flex-grow overflow-auto mb-4">
        {comments.map((comment, index) => (
          <Comment
            key={index}
            userName={comment.userName}
            userImage={comment.userImage}
            time={comment.time}
            commentText={comment.commentText}
          />
        ))}
      </div>
      {isCitizen && (
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
            className={`flex items-center justify-center p-2 rounded-full ${
              newComment.trim() ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            onClick={handleNewComment}
            disabled={!newComment.trim()}
          >
            <FaPaperPlane />
          </button>
        </div>
      )}
    </div>
  );
};

export default Comments;
