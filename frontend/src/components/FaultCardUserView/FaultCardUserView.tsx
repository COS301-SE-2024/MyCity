import React, { useState, useEffect } from "react";
import {
  FaArrowUp,
  FaComment,
  FaEye,
  FaExclamationTriangle,
  FaTimes,
} from "react-icons/fa";
import Comments from "../Comments/comments"; // Adjust the import path as necessary
import { Button } from "@nextui-org/react";
import { MapPin, Image as ImageIcon } from "lucide-react"; // Added ImageIcon from lucide-react
import { InteractTicket, addWatchlist } from "@/services/tickets.service";
import { useProfile } from "@/hooks/useProfile";
import { Eye, Key } from "lucide-react";
import { MessageCirclePlus } from "lucide-react";
import { ArrowBigUp } from "lucide-react";
import dynamic from "next/dynamic";
import { ThreeDots } from "react-loader-spinner";

const MapboxMap = dynamic(() => import("../MapboxMap/MapboxMap"), {
  ssr: false,
});

interface cardDataWatchlist {
  title: string;
  address: string;
  arrowCount: number;
  commentCount: number;
  viewCount: number;
  ticketNumber: string;
  description: string;
  image: string;
  createdBy: string;
  state: string;
  municipality_id: string;
  key: string;
  stateFormat: keyof typeof notificationStates;
}

interface StatusCardUserProps extends cardDataWatchlist {
  onClick?: () => void; // Make onClick optional
}

// states.ts
export const notificationStates = {
  AssigningContract: {
    color: "bg-blue-200",
    text: "Assigning Contract",
  },
  Closed: {
    color: "bg-green-200",
    text: "Closed",
  },
  InProgress: {
    color: "bg-yellow-200",
    text: "In Progress",
  },
  Opened: {
    color: "bg-red-200",
    text: "Opened",
  },
  TakingTenders: {
    color: "bg-purple-200",
    text: "Taking Tenders",
  },
  Default: {
    color: "bg-gray-200",
    text: "Taking Tenders",
  },
};

function formatMunicipalityID(mun: string): string {
  if (typeof mun !== "string") {
    return ""; // Or some other default value
  }
  return mun.replace(/ /g, "_");
}

function getDate(date: string): string {
  return date.split("T")[0];
}
function getTime(date: string): string {
  return date.split("T")[1].split(".")[0];
}

function displayDate(date: string): string {
  const inputDate = new Date(date);
  const currentDate = new Date();

  const inputDay = inputDate.toISOString().split("T")[0];
  const currentDay = currentDate.toISOString().split("T")[0];

  if (inputDay === currentDay) {
    return getTime(date);
  } else {
    return getDate(date);
  }
}

function formatState(state: string | undefined): string {
  if (typeof state !== "string") {
    return ""; // Or some other default value
  }
  return state.replace(/ /g, "");
}

interface FaultCardUserViewProps {
  show: boolean;
  refreshwatchlist: () => void;
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
  state: string;
  municipality_id: string;
  urgency: "high" | "medium" | "low";
}

const urgencyMapping = {
  high: {
    icon: <FaExclamationTriangle className="text-red-500" />,
    label: "Urgent",
  },
  medium: {
    icon: <FaExclamationTriangle className="text-yellow-500" />,
    label: "Moderate",
  },
  low: {
    icon: <FaExclamationTriangle className="text-green-500" />,
    label: "Not Urgent",
  },
};

const formatNumber = (num: number | undefined) => {
  if (typeof num !== "number" || isNaN(num)) {
    return "0"; // Return a default value like "0" if num is undefined or invalid
  }

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
  refreshwatchlist,
  title,
  address,
  arrowCount,
  commentCount,
  viewCount,
  ticketId,
  ticketNumber,
  state,
  municipality_id,
  description,
  image,
  latitude,
  longitude,
  urgency,
}) => {
  const formattedStateKey = formatState(state);

  let color = "bg-gray-200"; // Default color
  let text = "Default"; // Default text

  if (formattedStateKey in notificationStates) {
    color =
      notificationStates[formattedStateKey as keyof typeof notificationStates]
        .color;
    text =
      notificationStates[formattedStateKey as keyof typeof notificationStates]
        .text;
  } else {
    color = notificationStates.Default.color;
    text = notificationStates.Default.text;
  }

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
  const [isImageExpanded, setIsImageExpanded] = useState(false);
  const [isMapLeft, setIsMapLeft] = useState(true);
  const [loading, setLoading] = useState(true);

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
    } else {
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
  }, [ticketNumber, isInitialRender]);

  const toggleComments = () => {
    setShowComments((prev) => !prev);

    const toggleImageSize = () => {
      setIsImageExpanded((prev) => !prev);
    };
  };

  const handleArrowClick = async () => {
    if (arrowColor === "black") {
      setArrowColor("blue");
      console.log("inside arrwossss");
      const user_data = await userProfile.getUserProfile();
      const userSession = String(user_data.current?.session_token);
      const rspvotes = await InteractTicket(ticketId, "UPVOTE", userSession);
      if (rspvotes !== -1) {
        console.log("Inside rspmovetss");
        setCurrentArrowCount(rspvotes);
        const data = {
          arrowCount: rspvotes,
          commentCount: currentCommentCount,
          viewCount: currentViewCount,
          arrowColor: "blue",
          commentColor,
          eyeColor,
        };
        localStorage.setItem(`ticket-${ticketNumber}`, JSON.stringify(data));
      } else setCurrentArrowCount((prevCount: any) => prevCount + 1);
    } else {
      setArrowColor("black");
      const user_data = await userProfile.getUserProfile();
      const userSession = String(user_data.current?.session_token);
      const rspvotes = await InteractTicket(ticketId, "UNVOTE", userSession);
      if (rspvotes !== -1) {
        setCurrentArrowCount(rspvotes);
        const data = {
          arrowCount: rspvotes,
          commentCount: currentCommentCount,
          viewCount: currentViewCount,
          arrowColor: "black",
          commentColor,
          eyeColor,
        };
        localStorage.setItem(`ticket-${ticketNumber}`, JSON.stringify(data));
      } else setCurrentArrowCount((prevCount: any) => prevCount - 1);
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

  const handleEyeClick = async () => {
    if (eyeColor === "black") {
      const user_data = await userProfile.getUserProfile();
      const username = String(user_data.current?.email);
      const userSession = String(user_data.current?.session_token);
      const rspaddwatch = await addWatchlist(ticketId, username, userSession);
      refreshwatchlist();
      if (rspaddwatch == true) {
        setEyeColor("blue");
        const data = {
          arrowCount,
          commentCount: currentCommentCount,
          viewCount: currentViewCount,
          arrowColor,
          commentColor,
          eyeColor: "blue",
        };
        localStorage.setItem(`ticket-${ticketNumber}`, JSON.stringify(data));
      }
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

  const toggleImageSize = () => {
    setIsImageExpanded((prev) => !prev);
  };

  // New state for swapping map and image

  const toggleLayout = () => {
    setIsMapLeft((prev) => !prev); // Toggle the layout
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 overflow-auto"
      onClick={onClose} // Close modal when clicking outside
    >
      <div
        className="dark:bg-gray-700 dark:text-white bg-white rounded-lg shadow-lg w-[85%] h-[70%] p-4 relative flex flex-col justify-center"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <button
          className="absolute top-2 right-2 text-gray-700 z-50"
          onClick={onClose}
        >
          <FaTimes size={24} />
        </button>

        {/* Desktop View */}
        <div className="hidden sm:flex w-full h-full gap-4">
          {/* Left Section */}
          <div className="relative w-[33%] pr-1 flex flex-col items-center">
            {/* Title */}
            <div className="flex w-full justify-start items-center">
              <div className="font-bold lg:text-2xl md:text-xl sm:text-lg pb-1 text-black">
                {title}
              </div>
            </div>

            {/* Ticket Number */}
            <div className="flex w-full justify-start items-center lg:pb-2 md:pb-1">
              <div className="lg:text-lg md:text-md sm:text-sm font-bold text-gray-400">
                {ticketNumber}
              </div>
            </div>

            {/* Description */}
            <div className="lg:mb-2 md:mb-1 w-full">
              <h3 className="font-bold text-black lg:text-lg md:text-md sm:text-sm">
                Description
              </h3>
              <div className="h-[5%]">
                <p className="text-gray-700">{description}</p>
              </div>
            </div>

            {/* Status */}
            <div
              className={`${color} bg-opacity-75 text-black font-bold lg:text-lg md:text-md sm:text-sm text-center rounded-lg px-3 py-1 mt-1 w-full`}
            >
              {state}
            </div>

            {/* Date Opened */}
            <div className="flex justify-between mt-2 w-full">
              <div className="lg:text-lg md:text-md sm:text-sm font-bold text-gray-500">
                Date Opened:
              </div>
              <div className="lg:text-md md:text-sm sm:text-xs font-bold text-gray-500">
                2 August 2024
              </div>
            </div>

            {/* ETC */}
            <div className="flex justify-between lg:mb-2 md:mb-1 w-full">
              <div className="lg:text-lg md:text-md sm:text-sm font-bold text-gray-500">
                ETC:
              </div>
              <div className="lg:text-md md:text-sm sm:text-xs font-bold text-gray-500">
                18 hours
              </div>
            </div>

            {/* Address */}
            <div className="flex w-full">
              <div className="flex justify-between lg:mb-2 md:mb-1 w-full">
                <div className="lg:text-sm md:text-xs font-bold text-gray-500">
                  {address}
                </div>
              </div>
            </div>

            {/* Fault Image */}
            <div className="w-full h-full border flex items-center justify-center mt-2">
              {image && !imageError ? (
                <div className="flex justify-center relative">
                  {/* Loading Icon */}
                  {loading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <ThreeDots
                        height="80"
                        width="80"
                        radius="9"
                        color="#ADD8E6"
                        ariaLabel="three-dots-loading"
                        visible={true}
                      />
                    </div>
                  )}

                  <img
                    src={image}
                    alt="Fault"
                    className={`rounded-lg object-cover ${
                      loading ? "hidden" : "block"
                    }`}
                    onLoad={() => setLoading(false)} // Set loading to false when image loads
                    onError={() => setImageError(true)} // Set error state if image fails to load
                  />
                </div>
              ) : (
                <div className="mb-2 flex justify-center items-center w-48 h-36 rounded-lg">
                  <ImageIcon size={48} color="#6B7280" />
                </div>
              )}
            </div>

            {/* Google Maps and Actions */}
            <div className="w-full flex pt-2 border">
              {/* Google Maps */}
              <Button
                className="w-[50%] bg-opacity-45 text-black font-bold lg:text-md md:text-sm text-center rounded-lg lg:mx-2 md:mx-1"
                onClick={showDirections}
              >
                {"Google Maps"}
                <img
                  src="https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/resources/google_maps_icon.webp"
                  className="h-[50%] border"
                  alt="Google"
                />
              </Button>

              {/* Actions */}
              <div className="lg:mb-4 md:mb-2 flex justify-between w-[50%] lg:mx-2 md:mx-1">
                {/* Upvotes */}
                <div className="flex flex-col items-center justify-center">
                  <FaArrowUp
                    className="text-gray-600 cursor-pointer transform transition-transform hover:scale-110"
                    style={{ color: arrowColor }}
                    onClick={handleArrowClick}
                  />
                  <span className="text-gray-700">
                    {formatNumber(currentArrowCount)}
                  </span>
                </div>

                {/* Comments */}
                <div
                  className="flex flex-col items-center cursor-pointer transform transition-transform hover:scale-105 justify-center"
                  onClick={toggleComments}
                >
                  <FaComment
                    className="text-gray-600"
                    style={{ color: commentColor }}
                  />
                  <span className="text-gray-700">
                    {formatNumber(currentCommentCount)}
                  </span>
                </div>

                {/* Watchlist */}
                <div className="flex flex-col items-center justify-center">
                  <FaEye
                    className="text-gray-600 cursor-pointer transform transition-transform hover:scale-110 justify-center"
                    style={{ color: eyeColor }}
                    onClick={handleEyeClick}
                  />
                  <span className="text-gray-700">
                    {formatNumber(currentViewCount)}
                  </span>
                </div>
              </div>
            </div>

            {/* Fault's Municipality */}
            <div className="flex w-full items-center justify-start mt-2">
              <div className="text-black w-12 h-12 rounded-full overflow-hidden flex items-center justify-center bg-gray-200 border border-gray-300">
                <img
                  src={`https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/municipality_logos/${formatMunicipalityID(
                    municipality_id
                  )}.png`}
                  alt=""
                />
              </div>
              <div className="ml-2 text-black">{municipality_id}</div>
            </div>
          </div>

          {/* Right Section */}
          <div className="relative w-2/3 mt-5 mb-2 flex flex-col justify-center overflow-hidden">
            {/* Map Display */}
            <div className="relative w-full h-full bg-blue-400">
              <MapboxMap
                centerLng={Number(longitude)}
                centerLat={Number(latitude)}
                dropMarker={true}
                zoom={14}
              />
            </div>

            {/* Comments Section with Slide Animation */}
            <div
              className={`absolute top-0 left-0 w-full h-full bg-white z-20 transform transition-transform duration-300 ${
                showComments ? "translate-x-0" : "translate-x-full"
              }`}
              style={{ pointerEvents: showComments ? "auto" : "none" }}
            >
              <Comments
                onBack={toggleComments}
                isCitizen={false}
                ticketId={ticketId}
              />
            </div>
          </div>
        </div>

        {/* Mobile View */}
        <div className="block sm:hidden h-full overflow-auto flex justify-center items-center">
          <div className="flex flex-col w-full gap-2 text-black relative h-full overflow-y-auto justify-center">
            {/* Title and Ticket Number */}
            <div className="text-center">
              <div className="font-bold text-base sm:text-lg truncate">
                {title}
              </div>
              <div className="text-gray-400 text-sm sm:text-md truncate">
                {ticketNumber}
              </div>
            </div>

            {/* Status */}
            <div
              className={`${color} bg-opacity-75 text-black font-bold text-center rounded-lg px-2 py-1 w-full`}
            >
              {text}
            </div>

            {/* Description */}
            <div className="text-gray-700 text-xs sm:text-sm text-center px-2 truncate overflow-hidden">
              {description}
            </div>

            {/* Address */}
            <div className="text-gray-500 text-xs sm:text-sm text-center px-2 truncate overflow-hidden">
              {address}
            </div>

            {/* Image */}
            <div className="relative w-full flex justify-center mt-2 h-[30%]">
              {!imageError ? (
                <img
                  src={image || undefined}
                  alt="Fault"
                  className="rounded-lg object-cover w-full h-full"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="flex justify-center items-center w-full h-full bg-gray-200">
                  <ImageIcon size={32} color="#6B7280" />
                </div>
              )}
            </div>

            {/* Google Maps Button */}
            <Button
              className="w-full mt-2 bg-opacity-45 text-black font-bold text-center rounded-lg py-1 border text-sm"
              onClick={showDirections}
            >
              Google Maps
            </Button>

            {/* Actions */}
            <div className="flex justify-around w-full mt-2">
              {/* Upvote */}
              <div className="flex flex-col items-center text-xs sm:text-sm">
                <FaArrowUp
                  className="text-gray-600 cursor-pointer transform transition-transform hover:scale-110"
                  style={{ color: arrowColor }}
                  onClick={handleArrowClick}
                />
                <span className="text-gray-700">
                  {formatNumber(currentArrowCount)}
                </span>
              </div>

              {/* Comments */}
              <div
                className="flex flex-col items-center text-xs sm:text-sm cursor-pointer transform transition-transform hover:scale-105"
                onClick={toggleComments}
              >
                <FaComment
                  className="text-gray-600"
                  style={{ color: commentColor }}
                />
                <span className="text-gray-700">
                  {formatNumber(currentCommentCount)}
                </span>
              </div>

              {/* Watchlist */}
              <div className="flex flex-col items-center text-xs sm:text-sm">
                <FaEye
                  className="text-gray-600 cursor-pointer transform transition-transform hover:scale-110"
                  style={{ color: eyeColor }}
                  onClick={handleEyeClick}
                />
                <span className="text-gray-700">
                  {formatNumber(currentViewCount)}
                </span>
              </div>
            </div>

            {/* Fault's Municipality */}
            <div className="flex w-full items-center justify-center mt-2">
              <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-gray-200 border border-gray-300">
                <img
                  src={`https://mycity-storage-bucket.s3.eu-west-1.amazonaws.com/municipality_logos/${formatMunicipalityID(
                    municipality_id
                  )}.png`}
                  alt=""
                />
              </div>
              <div className="ml-2 text-sm">{municipality_id}</div>
            </div>

            {/* Comments Section (only visible when showComments is true) */}
            {showComments && (
              <div className="absolute top-0 left-0 w-full h-full bg-white z-20">
                <Comments
                  onBack={toggleComments}
                  isCitizen={false}
                  ticketId={ticketId}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaultCardUserView;
