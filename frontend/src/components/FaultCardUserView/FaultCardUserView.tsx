import React, { useState, useEffect } from "react";
import { FaArrowUp, FaComment, FaEye, FaExclamationTriangle, FaTimes } from "react-icons/fa";
import MapComponent from "@/context/MapboxMap"; // Adjust the import path as necessary
import Comments from "../Comments/comments"; // Adjust the import path as necessary
import { Button } from "@nextui-org/react";
import { MapPin, Image as ImageIcon } from "lucide-react"; // Added ImageIcon from lucide-react
import { InteractTicket } from "@/services/tickets.service";
import { useProfile } from "@/hooks/useProfile";

interface FaultCardUserViewProps {
  show: boolean;
  onClose: () => void;
  title: string;
  address: string;
  arrowCount: number;
  commentCount: number;
  viewCount: number;
  ticketId: string;
  ticketNumber: string;
  description: string;
  image: string | null; // Updated to allow null
  createdBy: string;
  latitude: number;
  longitude: number;
  urgency: "high" | "medium" | "low";
}

const urgencyMapping = {
  high: { icon: <FaExclamationTriangle className="text-red-500" />, label: "Urgent" },
  medium: { icon: <FaExclamationTriangle className="text-yellow-500" />, label: "Moderate" },
  low: { icon: <FaExclamationTriangle className="text-green-500" />, label: "Not Urgent" },
};

const formatNumber = (num: number) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + "k";
  }
  return num.toString();
};

const FaultCardUserView: React.FC<FaultCardUserViewProps> = ({
  show,
  onClose,
  title,
  address,
  arrowCount,
  commentCount,
  viewCount,
  ticketId,
  ticketNumber,
  description,
  image,
  latitude,
  longitude,
  urgency
}) => {
  const [currentArrowCount, setCurrentArrowCount] = useState(arrowCount);
  const [currentCommentCount, setCurrentCommentCount] = useState(commentCount);
  const [currentViewCount, setCurrentViewCount] = useState(viewCount);
  const [arrowColor, setArrowColor] = useState("black");
  const [commentColor, setCommentColor] = useState("black");
  const [eyeColor, setEyeColor] = useState("black");
  const [showComments, setShowComments] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isInitialRender, setIsInitialRender] = useState(true);
  const userProfile = useProfile();


  useEffect(() => {
   
      const storedData = localStorage.getItem(`ticket-${ticketNumber}`);
      if (storedData) {
        const data = JSON.parse(storedData);
        setCurrentArrowCount(data.arrowCount);
        setCurrentCommentCount(data.commentCount);
        setCurrentViewCount(data.viewCount);
        setArrowColor(data.arrowColor);
        setCommentColor(data.commentColor);
        setEyeColor(data.eyeColor);
      }
      else 
      {
        const data = {
          arrowCount: currentArrowCount,
          commentCount: currentCommentCount,
          viewCount: currentViewCount,
          arrowColor,
          commentColor,
          eyeColor,
        };
    
        localStorage.setItem(`ticket-${ticketNumber}`, JSON.stringify(data));
      }
  }, [ticketNumber,isInitialRender]);

  const toggleComments = () => {
    setShowComments((prev) => !prev);
  };

  const handleArrowClick = async () => {
    if (arrowColor === "black") {
      setArrowColor("blue");
      console.log("inside arrwossss")
      const user_data = await userProfile.getUserProfile();
      const userSession = String(user_data.current?.session_token);
      const rspvotes = await InteractTicket(ticketId,"UPVOTE",userSession)
      if(rspvotes !== -1)
      {
        console.log("Inside rspmovetss")
        setCurrentArrowCount(rspvotes);
        const data = {
          arrowCount: rspvotes,
          commentCount: currentCommentCount,
          viewCount: currentViewCount,
          arrowColor : "blue",
          commentColor,
          eyeColor,
        };
        localStorage.setItem(`ticket-${ticketNumber}`, JSON.stringify(data));
      }
      else setCurrentArrowCount((prevCount: any) => prevCount + 1);
    } else {
      setArrowColor("black");
      const user_data = await userProfile.getUserProfile();
      const userSession = String(user_data.current?.session_token);
      const rspvotes = await InteractTicket(ticketId,"UNVOTE",userSession)
      if(rspvotes !== -1)
      {
        setCurrentArrowCount(rspvotes);
        const data = {
          arrowCount: rspvotes,
          commentCount: currentCommentCount,
          viewCount: currentViewCount,
          arrowColor : "black",
          commentColor,
          eyeColor,
        };
        localStorage.setItem(`ticket-${ticketNumber}`, JSON.stringify(data));
      }
      else setCurrentArrowCount((prevCount: any) => prevCount - 1);
    }
  };

  const handleCommentClick = () => {
    if (commentColor === "black") {
      setCommentColor("blue");
      setCurrentCommentCount((prevCount: number) => prevCount + 1);
    } else {
      setCommentColor("black");
      setCurrentCommentCount((prevCount: number) => prevCount - 1);
    }
  };

  const handleEyeClick = () => {
    if (eyeColor === "black") {
      setEyeColor("blue");
      setCurrentViewCount((prevCount: number) => prevCount + 1);
    } else {
      setEyeColor("black");
      setCurrentViewCount((prevCount: number) => prevCount - 1);
    }
  };

  const showDirections = () => {
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=driving`;
    window.open(googleMapsUrl, "_blank", "noopener,noreferrer");
  };

  if (!show) return null;

  const addressParts = address.split(",");

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 overflow-auto"
      onClick={onClose} // Close modal when clicking outside
    >
      <div
        className="bg-white rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-3/4 xl:w-2/3 max-w-4xl max-h-[90vh] p-4 relative flex flex-col lg:flex-row"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <button
          className="absolute top-2 right-2 text-gray-700 z-50"
          onClick={onClose}
        >
          <FaTimes size={24} />
        </button>

        <div className="relative w-full lg:w-1/3 p-2 flex flex-col items-center">
          <div className="flex items-center">
            <h2 className="font-bold text-black text-2xl">{`Ticket`}</h2>
          </div>
          <div className="mt-2 mb-2 text-center">
            <h3 className="font-bold text-black text-lg">Fault Type</h3>
            <p className="text-gray-700">{title}</p>
          </div>
          <div className="mb-2 text-center">
            <h3 className="font-bold text-black text-lg">Description</h3>
            <p className="text-gray-700">{description}</p>
          </div>
          {image && !imageError ? (
            <div className="mb-2 flex justify-center">
              <img
                src={image}
                alt="Fault"
                className="rounded-lg w-48 h-36 object-cover"
                onError={() => setImageError(true)} // Set error state if image fails to load
              />
            </div>
          ) : (
            <div className="mb-2 flex justify-center items-center w-48 h-36 rounded-lg bg-gray-200 border border-gray-300">
              <ImageIcon size={48} color="#6B7280" />
            </div>
          )}
          <div className="mb-4 flex justify-between w-full px-4">
            <div className="flex items-center">
              <FaArrowUp
                className="text-gray-600 mr-2 cursor-pointer transform transition-transform hover:scale-110"
                style={{ color: arrowColor }}
                onClick={handleArrowClick}
              />
              <span className="text-gray-700">{formatNumber(currentArrowCount)}</span>
            </div>
            <div
              className="flex items-center cursor-pointer transform transition-transform hover:scale-105"
              onClick={toggleComments}
            >
              <FaComment
                className="text-gray-600 mr-2"
                style={{ color: commentColor }}
              />
              <span className="text-gray-700">{formatNumber(currentCommentCount)}</span>
            </div>
            <div className="flex items-center">
              <FaEye
                className="text-gray-600 mr-2 cursor-pointer transform transition-transform hover:scale-110"
                style={{ color: eyeColor }}
                onClick={handleEyeClick}
              />
              <span className="text-gray-700">{formatNumber(currentViewCount)}</span>
            </div>
          </div>

          <div className="flex flex-col text-center items-center mb-4">
            <h3 className="font-bold text-black text-lg">Address</h3>
            <p className="text-gray-700">{addressParts.join(", ")}</p>
          </div>

          <div className="mt-2 flex justify-center gap-2">
            <button
              className="bg-gray-200 text-gray-700 rounded-lg px-2 py-1 hover:bg-gray-300"
              onClick={onClose}
            >
              Back
            </button>
          </div>
        </div>

        {/* Right Section (Map Placeholder) */}
        <div className="relative w-full lg:w-2/3 bg-gray-200 flex items-center justify-center overflow-hidden">
          <div className="w-full h-full flex items-center justify-center text-gray-500" id="map">
            <MapComponent longitude={Number(longitude)} latitude={Number(latitude)} zoom={14} containerId="map" style="mapbox://styles/mapbox/streets-v12" />
          </div>

          {/* Move the Directions Button to the Bottom Left */}
          <div className="absolute bottom-2 left-2 z-10">
            <Button className="min-w-fit h-fit p-2 bg-white rounded-3xl" onClick={showDirections}>
              <MapPin size={23} />
            </Button>
          </div>

          {/* Comments Section with Slide Animation */}
          <div
            className={`absolute top-0 left-0 w-full h-full bg-white z-20 transform transition-transform duration-300 ${showComments ? "translate-x-0" : "translate-x-full"
              }`}
            style={{ pointerEvents: showComments ? "auto" : "none" }}
          >
            <Comments onBack={toggleComments} isCitizen={false} ticketId={ticketId} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaultCardUserView;
