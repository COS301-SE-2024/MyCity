import React, { useState, useEffect, useRef } from "react";
import { FaTimes, FaArrowUp, FaComment, FaEye } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import { AlertCircle } from "lucide-react";
import TenderMax from "../Tenders/MuniTenderMax"; // Adjust the import path as necessary
import MuniTenders from "../RecordsTableCompany/MuniTenders";
import Comments from "../Comments/comments"; // Adjust the import path as necessary
import {
  getTicketTenders,
  getContract,
  getMuniContract,
} from "@/services/tender.service";
import { AcceptTicket, CloseTicket } from "@/services/tickets.service";
import { useProfile } from "@/hooks/useProfile";
import Modal from "react-modal";
import { Image as ImageIcon } from "lucide-react";
import { User as UserIcon } from "lucide-react";
import { S3_BUCKET_BASE_URL } from "@/config/s3bucket.config";

interface TicketViewMuniProps {
  show: boolean;
  onClose: (data: number) => void;
  title: string;
  address: string;
  arrowCount: number;
  commentCount: number;
  viewCount: number;
  ticketNumber: string;
  ticket_id: string;
  description: string;
  user_picture: string;
  createdBy: string;
  status: string;
  imageURL: string;
  municipalityImage: string;
  upvotes: number;
  latitude: string;
  longitude: string;
  urgency: "high" | "medium" | "low";
}

const urgencyMapping = {
  high: { icon: <AlertCircle className="text-red-500" />, label: "Urgent" },
  medium: {
    icon: <AlertCircle className="text-yellow-500" />,
    label: "Moderate",
  },
  low: {
    icon: <AlertCircle className="text-green-500" />,
    label: "Not Urgent",
  },
};

const TicketViewMuni: React.FC<TicketViewMuniProps> = ({
  show,
  onClose,
  title,
  address,
  ticketNumber,
  description,
  user_picture,
  createdBy,
  status,
  municipalityImage,
  upvotes,
  longitude,
  latitude,
  ticket_id,
  imageURL,
  urgency,
  arrowCount,
  commentCount,
  viewCount,
}) => {
  const userProfile = useProfile(); // Hook moved to the top level
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [imageLoading, setImageLoading] = useState(true);
  const [showTenderMax, setShowTenderMax] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showMuniTenders, setShowMuniTenders] = useState(false);
  const [tenders, setTenders] = useState<any>(null);
  const [contract, setContract] = useState<any>();
  const [ticketstatus, setTicketstatus] = useState<string>("");
  const [loadingImage, setLoadingImage] = useState(true);
  const [imageError, setImageError] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTicketstatus(status);
  }, [status]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose(0);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const getStatusColor = (state: string) => {
    switch (state) {
      case "Opened":
        return "text-green-500";
      case "In Progress":
        return "text-blue-500";
      case "Closed":
        return "text-red-500";
      case "Taking Tenders":
        return "text-purple-500";
      default:
        return "text-gray-500";
    }
  };

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
  };

  // if (!show) return null;

  const addressParts = address.split(",");

  const formatDate = (given_date: string) => {
    return given_date.slice(0, given_date.indexOf("T"));
  };

  const toggleComments = () => {
    setShowComments((prev) => !prev);
  };

  const handleApproveTicket = async () => {
    try {
      const user_data = await userProfile.getUserProfile();
      const user_session = String(user_data.current?.session_token);
      const rspapprove = await AcceptTicket(ticket_id, user_session);
      if (rspapprove === true) {
        setTicketstatus("Taking Tenders");
      }
      onClose(-1);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleCloseTicket = async () => {
    try {
      const user_data = await userProfile.getUserProfile();
      const user_session = String(user_data.current?.session_token);
      const rspapprove = await CloseTicket(ticket_id, user_session);
      if (rspapprove === true) {
        setTicketstatus("Closed");
      }
      onClose(-2);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleTenderContractClick = async () => {
    setIsLoading(true); // Start loading

    try {
      const user_data = await userProfile.getUserProfile();
      const user_session = String(user_data.current?.session_token);
      const response_contract = await getMuniContract(
        ticket_id,
        user_session,
        true
      );

      if (response_contract == null) {
        setShowTenderMax(false);
      } else {
        if (response_contract) {
          setContract(response_contract);
          setShowTenderMax(true);
          setShowMuniTenders(false); // Hide MuniTenders if it's open
        } else {
          setShowTenderMax(false);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false); // Stop loading after the operation is complete
    }
  };

  const handleTenderMaxClose = (data: number) => {
    if (data == -2) {
      setTicketstatus("Closed");
      onClose(-2);
    } else if (data == -1) {
      setTicketstatus("Taking Tenders");
      onClose(-1);
    }
    setShowTenderMax(false);
  };

  const handleCloseClick = () => {
    onClose(0);
  };

  const handleViewTendersClick = async () => {
    setIsLoading(true);
    const user_data = await userProfile.getUserProfile();
    const user_session = String(user_data.current?.session_token);

    const rspgettenders = await getTicketTenders(ticket_id, user_session, true);
    console.log(ticket_id);
    console.log(rspgettenders); // Add this line to inspect the data

    setIsLoading(false);

    if (!rspgettenders || rspgettenders.length === 0) {
      setTenders(null); // No tenders available
    } else {
      setTenders(rspgettenders); // Ensure tenders data is set
      // Show the MuniTenders component
    }
    setShowMuniTenders(true);
  };

  const handleBack = (data: number) => {
    setShowMuniTenders(false);
    if (data === 1) {
      setTicketstatus("In Progress");
      onClose(1);
    } else onClose(0);
  };

  return (
    <>
      {/* Render MuniTenders if it is visible */}
      {showMuniTenders && (
        <div className="mt-4">
          <MuniTenders tenders={tenders} onBack={handleBack} />
        </div>
      )}

      {/* Mobile-first layout with centered content */}
      {!showMuniTenders && (
        <div
          className={`fixed inset-0 flex justify-center items-center ${!showTenderMax ? "bg-black bg-opacity-50" : ""
            } z-50`}
        >
          {!showTenderMax && !showMuniTenders && (
            <div
            className="relative bg-white rounded-lg shadow-lg w-full max-w-md p-4 flex flex-col"
            style={{ maxHeight: '75vh', height: 'auto', overflowY: 'auto' }}
          >
          
              <button
                className="absolute top-2 right-2 text-gray-700 z-20"
                onClick={handleCloseClick}
              >
                <FaTimes size={24} />
              </button>

              <div className="flex flex-col w-full text-black overflow-auto">
                {/* Title and Status */}
                <div className="text-center mb-2">
                  <div className="font-bold text-lg">{title}</div>
                  <div
                    className={`text-sm font-bold ${getStatusColor(
                      ticketstatus
                    )}`}
                  >
                    {ticketstatus}
                  </div>
                </div>

                {/* Image and Description */}
                <div className="text-center">
                  <div className="relative w-full h-[300px]">
                    {/* Wrapper div to enforce size of loader */}
                    <div className="absolute inset-0 flex items-center justify-center w-full h-full">
                      {/* Show loading spinner only if the image is loading */}
                      {loadingImage && !imageError && (
                        <div className="flex justify-center items-center w-full h-full rounded-lg bg-gray-200 border border-gray-300">
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

                      {/* Conditionally render image only when successfully loaded */}
                      {!imageError && (
                        <img
                          src={imageURL?`${S3_BUCKET_BASE_URL}${imageURL}`: undefined}
                          alt="Fault"
                          className={`rounded-lg w-full h-full object-cover ${
                            loadingImage ? "hidden" : "block"
                          }`}
                          onLoad={() => setLoadingImage(false)} // Set loadingImage to false when image loads
                          onError={() => {
                            setImageError(true); // Set imageError to true if loading fails
                            setLoadingImage(false); // Stop showing loader on error
                          }}
                        />
                      )}

                      {/* Render the placeholder if image fails to load */}
                      {imageError && (
                        <div
                          id="image-placeholder"
                          className="flex justify-center items-center w-full h-full rounded-lg bg-gray-200 border border-gray-300"
                        >
                          <ImageIcon size={48} className="text-gray-500" />
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="text-gray-700 text-sm mt-2 mb-4">
                    {description}
                  </p>
                </div>

                {/* Interactions */}
                <div className="mt-2 flex justify-around w-full px-4">
                  <div className="flex items-center">
                    <FaArrowUp className="text-gray-600 mr-2" />
                    <span className="text-gray-700">{arrowCount}</span>
                  </div>
                  <div
                    className="flex items-center cursor-pointer transform transition-transform hover:scale-105"
                    onClick={toggleComments}
                  >
                    <FaComment className="text-gray-600 mr-2" />
                    <span className="text-gray-700">{commentCount}</span>
                  </div>
                  <div className="flex items-center">
                    <FaEye className="text-gray-600 mr-2" />
                    <span className="text-gray-700">{viewCount}</span>
                  </div>
                </div>

                {/* Address and Created By */}
                <div className="flex justify-between items-center mt-4">
                  {/* Address Section */}
                  <div className="flex flex-col items-center w-1/2 text-center">
                    <h3 className="font-bold text-sm whitespace-nowrap">
                      Address
                    </h3>
                    <div className="text-center">
                      {addressParts.map((part, index) => (
                        <p key={index} className="text-gray-700 text-xs">
                          {part.trim()}
                        </p>
                      ))}
                    </div>
                  </div>

                  {/* Created By Section */}
                  <div className="flex flex-col items-center w-1/2">
                    <h3 className="font-bold text-sm whitespace-nowrap">
                      Created By
                    </h3>
                    {user_picture ? (
                      <img
                        src={user_picture}
                        alt="Created By"
                        className="rounded-full mb-1 object-cover w-10 h-10"
                        onError={(e) => {
                          e.currentTarget.src =
                            "/path/to/placeholder-avatar.jpg"; // Fallback for avatar
                        }}
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-200 border border-gray-300 flex items-center justify-center">
                        <UserIcon size={24} color="#6B7280" />
                      </div>
                    )}
                    <p className="text-gray-700 text-xs text-center">
                      {createdBy}
                    </p>
                  </div>
                </div>

                {/* Buttons */}
                <div className="mt-4 flex justify-center gap-2">
                  <button
                    className="bg-gray-200 text-gray-700 rounded-lg px-2 py-1 hover:bg-gray-300"
                    onClick={handleCloseClick}
                  >
                    Back
                  </button>
                  {(ticketstatus === "In Progress" ||
                    ticketstatus === "Assigning Contract") && (
                      <button
                        className="border border-blue-500 text-blue-500 rounded-lg px-2 py-1 hover:bg-blue-500 hover:text-white"
                        onClick={handleTenderContractClick}
                      >
                        Tender Contract
                      </button>
                    )}
                  {ticketstatus === "Taking Tenders" && (
                    <button
                      className="border border-blue-500 text-blue-500 rounded-lg px-2 py-1 hover:bg-blue-500 hover:text-white transition duration-300"
                      onClick={handleViewTendersClick}
                    >
                      View Bids
                    </button>
                  )}
                  {ticketstatus === "Opened" && (
                    <>
                      <button
                        className="bg-red-500 text-white rounded-lg px-2 py-1 hover:bg-red-600"
                        onClick={handleCloseTicket}
                      >
                        Close
                      </button>
                      <button
                        className="bg-blue-500 text-white rounded-lg px-2 py-1 hover:bg-blue-600"
                        onClick={handleApproveTicket}
                      >
                        Take Tenders
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Comments Section with Right-to-Left Slide Animation */}
              {showComments && (
                <div
                  className={`absolute top-0 left-0 w-full h-full bg-white z-20 rounded-3xl transform transition-transform duration-500 ease-in-out ${showComments ? "translate-x-0" : "translate-x-full"
                    }`}
                >
                  <Comments
                    ticketId={ticket_id}
                    onBack={toggleComments}
                    isCitizen={false}
                  />
                </div>
              )}
            </div>
          )}

          {/* TenderMax Section */}
          {showTenderMax && (
            <TenderMax
              tender={{
                contract_id: contract?.contract_id,
                tender_id: contract?.tender_id,
                status: contract?.status,
                companyname: tenders?.companyname,
                contractdatetime: formatDate(
                  String(contract?.contractdatetime)
                ),
                finalCost: contract?.finalCost,
                finalDuration: contract?.finalDuration,
                upload: null,
                ticketnumber: ticketNumber,
                latitude: Number(latitude),
                longitude: Number(longitude),
                completedatetime: contract?.completedatetime,
                contractnumber: contract?.contractnumber,
                hasReportedCompletion: false,
              }}
              onClose={handleTenderMaxClose}
            />
          )}
        </div>
      )}
    </>
  );
};

export default TicketViewMuni;
