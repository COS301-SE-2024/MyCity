
import React, { useState, useEffect } from "react";
import { FaArrowUp, FaCommentAlt, FaEye, FaTimes } from "react-icons/fa";
import { AlertCircle } from 'lucide-react';
import mapboxgl, { Map, Marker } from 'mapbox-gl';
import { S3_BUCKET_BASE_URL } from "@/config/s3bucket.config";

mapboxgl.accessToken = String(process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN);

interface FaultCardUserViewProps {
  show: boolean;
  onClose: () => void;
  title: string;
  address: string;
  arrowCount: number;
  commentCount: number;
  viewCount: number;
  ticketNumber: string;
  description: string;
  image: string;
  createdBy: string;
  status: string;
  municipalityImage: string;
  longitude: string;
  latitude: string;
  urgency: 'high' | 'medium' | 'low'; // Added urgency field
}

const urgencyMapping = {
  high: { icon: <AlertCircle className="text-red-500" />, label: 'Urgent' },
  medium: { icon: <AlertCircle className="text-yellow-500" />, label: 'Moderate' },
  low: { icon: <AlertCircle className="text-green-500" />, label: 'Not Urgent' }
};

const FaultCardUserView: React.FC<FaultCardUserViewProps> = ({
  show,
  onClose,
  title,
  address,
  arrowCount,
  commentCount,
  viewCount,
  ticketNumber,
  description,
  image,
  createdBy,
  status,
  municipalityImage,
  longitude,
  latitude,
  urgency
}) => {


  const getUrgency = (votes: number) => {
    if (votes < 10) {
      return "low";
    } else if (votes >= 10 && votes < 20) {
      return "medium";
    } else if (votes >= 20 && votes <= 40) {
      return "high";
    } else {
      return "low"; // Default case
    }
  }

  const getLocalStorageData = () => {
    const data = localStorage.getItem(`ticket-${ticketNumber}`);
    return data
      ? JSON.parse(data)
      : {
        arrowCount: arrowCount * 1000,
        commentCount,
        viewCount: viewCount * 1000,
        arrowColor: "black",
        commentColor: "black",
        eyeColor: "black",
      };
  };

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: "mapcontainer", // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: [Number(longitude), Number(latitude)], // starting position [lng, lat]
      zoom: 15 // starting zoom
    });

    new mapboxgl.Marker()
      .setLngLat([Number(longitude), Number(latitude)])
      .addTo(map);
  })


  const initialData = getLocalStorageData();

  const [currentArrowCount, setCurrentArrowCount] = useState(initialData.arrowCount);
  const [currentCommentCount, setCurrentCommentCount] = useState(initialData.commentCount);
  const [currentViewCount, setCurrentViewCount] = useState(initialData.viewCount);
  const [arrowColor, setArrowColor] = useState(initialData.arrowColor);
  const [commentColor, setCommentColor] = useState(initialData.commentColor);
  const [eyeColor, setEyeColor] = useState(initialData.eyeColor);

  useEffect(() => {
    const data = {
      arrowCount: currentArrowCount,
      commentCount: currentCommentCount,
      viewCount: currentViewCount,
      arrowColor,
      commentColor,
      eyeColor,
    };

    localStorage.setItem(`ticket-${ticketNumber}`, JSON.stringify(data));
  }, [currentArrowCount, currentCommentCount, currentViewCount, arrowColor, commentColor, eyeColor, ticketNumber]);

  const handleArrowClick = () => {
    if (arrowColor === "black") {
      setArrowColor("blue");
      setCurrentArrowCount((prevCount: any) => prevCount + 1);
    } else {
      setArrowColor("black");
      setCurrentArrowCount((prevCount: any) => prevCount - 1);
    }
  };

  const handleCommentClick = () => {
    if (commentColor === "black") {
      setCommentColor("blue");
      setCurrentCommentCount((prevCount: any) => prevCount + 1);
    } else {
      setCommentColor("black");
      setCurrentCommentCount((prevCount: any) => prevCount - 1);
    }
  };

  const handleEyeClick = () => {
    if (eyeColor === "black") {
      setEyeColor("blue");
      setCurrentViewCount((prevCount: any) => prevCount + 1);
    } else {
      setEyeColor("black");
      setCurrentViewCount((prevCount: any) => prevCount - 1);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  const getStatusColor = () => {
    switch (status) {
      case 'Unaddressed':
        return 'text-red-500';
      case 'In Progress':
        return 'text-blue-500';
      case 'Resolved':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  if (!show) return null;

  const addressParts = address.split(",");

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 overflow-auto">
      <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-3/4 xl:w-2/3 max-w-4xl max-h-[90vh] p-4 relative flex flex-col lg:flex-row">
        <button
          className="absolute top-2 right-2 text-gray-700"
          onClick={onClose}
        >
          <FaTimes size={24} />
        </button>
        <div className="flex flex-col lg:flex-row w-full overflow-auto">
          {/* Left Section */}
          <div className="relative w-full lg:w-1/3 p-2 flex flex-col items-center">
            <div className="absolute top-2 left-2">
              {urgencyMapping[getUrgency(viewCount)].icon}
            </div>
            <img src={municipalityImage} alt="Municipality" className="w-16 h-16 mb-2 rounded-full" />
            <div className="flex items-center justify-center mb-2">
              <div className={`flex items-center ${getStatusColor()} border-2 rounded-full px-2 py-1`}>
                <span className="ml-1">{status}</span>
              </div>
            </div>
            <div className="mt-2 mb-2 text-center">
              <p className="text-gray-700 font-bold">{title}</p>
            </div>

            <div className="mb-2 text-center">
              <p className="text-gray-700 text-sm">{description}</p>
            </div>

            {image && (
              <div className="mb-2 flex justify-center">
                <img src={`${S3_BUCKET_BASE_URL}${image}`} alt="Fault" className="rounded-lg w-48 h-36 object-cover" />
              </div>
            )}

            <div className="flex gap-8">
              <div className="flex flex-col items-center">
                <div
                  className="text-lg cursor-pointer transition duration-300 ease-in-out transform hover:scale-110"
                  style={{ color: arrowColor }}
                  onClick={handleArrowClick}
                >
                  <FaArrowUp />
                </div>
                <span className="mt-1 text-gray-700">{formatNumber(currentArrowCount)}</span>
              </div>
              <div className="flex flex-col items-center">
                <div
                  className="text-lg cursor-pointer transition duration-300 ease-in-out transform hover:scale-110"
                  style={{ color: eyeColor }}
                  onClick={handleEyeClick}
                >
                  <FaEye />
                </div>
                <span className="mt-1 text-gray-700">{formatNumber(currentViewCount)}</span>
              </div>
              <div className="flex flex-col items-center">
                <div
                  className="text-lg cursor-pointer transition duration-300 ease-in-out transform hover:scale-110"
                  style={{ color: commentColor }}
                  onClick={handleCommentClick}
                >
                  <FaCommentAlt />
                </div>
                <span className="mt-1 text-gray-700">{formatNumber(currentCommentCount)}</span>
              </div>
            </div>

            <div className="flex justify-around mb-2 w-full">
              <div className="flex flex-col items-center justify-center">
                <h3 className="font-bold text-md">Address</h3>
                {addressParts.map((part, index) => (
                  <p key={index} className="text-gray-700 text-sm">
                    {part.trim()}
                  </p>
                ))}
              </div>
              <div className="flex flex-col items-center justify-center">
                <h3 className="font-bold text-md">Created By</h3>
                <img src="https://via.placeholder.com/40" alt="Created By" className="rounded-full mb-1" />
                <p className="text-gray-700 text-sm">{createdBy}</p>
              </div>
            </div>

            <div className="mt-2 flex justify-center">
              <button
                className="bg-gray-200 text-gray-700 rounded-lg px-2 py-1 hover:bg-gray-300"
                onClick={onClose}
              >
                Back
              </button>
            </div>
          </div>
          {/* Right Section (Map Placeholder) */}
          <div className="w-full lg:w-2/3 bg-gray-200 flex items-center justify-center">
            <div className="w-full h-full flex items-center justify-center text-gray-500" id="mapcontainer">
              Map Placeholder
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaultCardUserView;
