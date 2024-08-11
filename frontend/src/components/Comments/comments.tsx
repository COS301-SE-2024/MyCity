'use client'

import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaPaperPlane } from 'react-icons/fa';
import Comment from './comment'; // Adjust the import path as necessary
import { useProfile } from "@/hooks/useProfile";
import { 
  addCommentWithImage,
  addCommentWithoutImage,
  getTicketComments,
  getUserFirstLastName,
} from '@/services/tickets.service';


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


  /* Original Mock data to test what a comment would look like*/
  /*const [comments, setComments] = useState([
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
  ]);*/

  // Function to fetch comments
  const fetchComments = async () => {
    try {
      const user_data = await userProfile.getUserProfile();
      const user_picture = String(user_data.current?.picture);
      const userSession =  String(user_data.current?.session_token); // verification and will be used for new comments
      // console.log("Ticket ID: ",ticketId); //checking whether we are fetching the ticket id
      const response= await getTicketComments(ticketId, userSession);
      const commentsData = response.data;

      const userPoolId = process.env.USER_POOL_ID;
      if (!userPoolId) {
        throw new Error("USER_POOL_ID is not defined");
      }
      
       // Enriching the comments with user details
      const enrichedComments = await Promise.all(commentsData.map(async (comment: any) => {
        const userAttributes = await getUserFirstLastName(comment.user_id, userPoolId);
        //const userAttributes = await getUserFirstLastName("janedoe@example.com", "eu-west-1_xhcBZxRZk");
        return {
          ...comment,
          userName: `${userAttributes?.given_name} ${userAttributes?.family_name}`,
          time: new Date(comment.date) // Ensure time is a Date object
        };
      }));
      
      setComments(enrichedComments);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching comments:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);



  // Function to handle adding a new comment
  const handleNewComment = () => {
    if (newComment.trim() !== '') {
      const newCommentData = {
        userName: 'Current User', // Replace with actual logged-in user's name
        userImage: 'https://via.placeholder.com/150',
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
        {loading ? (
          <p>Loading comments...</p>
        ) : (
          comments.map((comment, index) => (
            <Comment
              key={index}
              userName={comment.userName}
              //userImage={comment.userImage || 'https://via.placeholder.com/150'}
              userImage= {'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541'}
              time={new Date(comment.time)}
              commentText={comment.comment}
            />
          ))
        )}
      </div>
      {/*isCitizen &&*/ (
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
