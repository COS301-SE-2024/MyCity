import React, { useState, useEffect, useRef } from "react";
import { FaTimes, FaArrowUp, FaComment, FaEye } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner"
import { AlertCircle } from "lucide-react";
import TenderMax from "../Tenders/MuniTenderMax"; // Adjust the import path as necessary
import MuniTenders from "../RecordsTable/MuniTenders";
import MapComponent from "@/context/MapboxMap"; // Adjust the import path as necessary
import Comments from "../Comments/comments"; // Adjust the import path as necessary
import { getTicketTenders, getContract } from "@/services/tender.service";
import { AcceptTicket, CloseTicket } from "@/services/tickets.service";
import { useProfile } from "@/hooks/useProfile";

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
  medium: { icon: <AlertCircle className="text-yellow-500" />, label: "Moderate" },
  low: { icon: <AlertCircle className="text-green-500" />, label: "Not Urgent" },
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
  const userProfile = useProfile();  // Hook moved to the top level
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [showTenderMax, setShowTenderMax] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showMuniTenders, setShowMuniTenders] = useState(false);
  const [tenders, setTenders] = useState<any>(null);
  const [contract, setContract] = useState<any>();
  const [ticketstatus, setTicketstatus] = useState<string>("");

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTicketstatus(status);
  }, [status]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
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

  if (!show) return null;

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
      console.error('Error fetching data:', error);
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
      onClose(0);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleTenderContractClick = async () => {
    setIsLoading(true); // Start loading
  
    try {
      const user_data = await userProfile.getUserProfile();
      const user_session = String(user_data.current?.session_token);
      const rspgettenders = await getTicketTenders(ticket_id, user_session, true);
      setTenders(rspgettenders);
  
      if (!rspgettenders) return;
  
      let tender_contract = "";
      rspgettenders.forEach((item: { status: string; tender_id: string }) => {
        if (item.status === "accepted" || item.status === "approved") {
          tender_contract = item.tender_id;
        }
      });
  
      if (!tender_contract) {
        setShowTenderMax(false);
      } else {
        const response_contract = await getContract(tender_contract, user_session);
        if (response_contract) {
          setContract(response_contract);
          setShowTenderMax(true);
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
  

  const handleTenderMaxClose = () => {
    setTicketstatus("Closed");
    onClose(-2)
    setShowTenderMax(false);
  };

  const handleCloseClick = () => {
    onClose(0);
  };

  const handleViewTendersClick = async () => {
    setIsLoading(true); // Start loading
    const user_data = await userProfile.getUserProfile();
    const user_session = String(user_data.current?.session_token);
    const rspgettenders = await getTicketTenders(ticket_id, user_session, true);
    setIsLoading(false); // Stop loading
    if (rspgettenders === null) {
      setShowMuniTenders(false);
    } else {
      setShowMuniTenders(true);
      setTenders(rspgettenders);
    }
  };

  const handleBack = (data: number) => {
    setShowMuniTenders(false);
    if (data === 1) {
      setTicketstatus("In Progress");
      onClose(1);
    }
  };

  return (
    <>
      {!showTenderMax && !showMuniTenders && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 overflow-auto">
          <div ref={modalRef} className="bg-white rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-3/4 xl:w-2/3 max-w-4xl max-h-[90vh] p-4 relative flex flex-col lg:flex-row">
            <button
              className="absolute top-2 right-2 text-gray-700 z-20"
              onClick={handleCloseClick}
            >
              <FaTimes size={24} />
            </button>
            <div className="flex flex-col lg:flex-row w-full overflow-auto">
              {/* Left Section */}
              <div className="relative w-full lg:w-1/3 p-2 flex flex-col items-center">
                <div className="absolute top-2 left-2 z-10">
                  {urgencyMapping[getUrgency(upvotes)].icon}
                </div>
                <img
                  src={municipalityImage}
                  alt="Municipality"
                  className="w-16 h-16 mb-2 rounded-full z-10"
                />
                <div className="flex items-center justify-center mb-2">
                  <div
                    className={`flex items-center ${getStatusColor(ticketstatus)} border-2 rounded-full px-2 py-1`}
                  >
                    <span className="ml-1">{ticketstatus}</span>
                  </div>
                </div>
                <div className="mt-2 mb-2 text-center">
                  <p className="text-gray-700 font-bold">{title}</p>
                </div>

                <div className="mb-2 text-center">
                  <p className="text-gray-700 text-sm">{description}</p>
                </div>

                {imageURL && (
                  <div className="mb-2 flex justify-center">
                    <img
                      src={imageURL}
                      alt="Fault"
                      className="rounded-lg w-48 h-36 object-cover"
                    />
                  </div>
                )}
                <div className="mb-4 flex justify-between w-full px-4">
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
                    <h3 className="font-bold text-sm">Created By</h3>
                    <img
                      src={user_picture}
                      alt="Created By"
                      className="rounded-full mb-1 object-cover w-12 h-12"
                    />
                    <p className="text-gray-700 text-sm">{createdBy}</p>
                  </div>
                </div>
                <div className="mt-2 flex justify-center gap-2">
                  <button
                    className="bg-gray-200 text-gray-700 rounded-lg px-2 py-1 hover:bg-gray-300"
                    onClick={handleCloseClick}
                  >
                    Back
                  </button>
                  {(ticketstatus === "In Progress" || ticketstatus === "Assigning Contract") && (
                    <button
                      className="border border-blue-500 text-blue-500 rounded-lg px-2 py-1 hover:bg-blue-500 hover:text-white"
                      onClick={handleTenderContractClick}
                    >
                      Tender Contract
                    </button>
                  )}
                  {(ticketstatus === "Taking Tenders") && (
                    <button
                      className="border border-blue-500 text-blue-500 rounded-lg px-2 py-1 hover:bg-blue-500 hover:text-white"
                      onClick={handleViewTendersClick}
                    >
                      View Tenders
                    </button>
                  )}
                  {(ticketstatus === "Opened") && (
                    <>
                    <button
                      className="bg-red-500 text-white rounded-lg px-2 py-1 hover:bg-red-600"
                      onClick={handleCloseTicket}
                    >
                      Close Ticket
                    </button>
                    <button
                      className="bg-blue-500 text-white rounded-lg px-2 py-1 hover:bg-blue-600"
                      onClick={handleApproveTicket}
                    >
                      Take Tender Bids
                    </button>
                  </>
                  
                    
                  )}
                </div>
              </div>
              {/* Right Section (Map Placeholder) */}
              <div className="w-full lg:w-2/3 bg-gray-200 flex items-center justify-center relative overflow-hidden">
              {isLoading ? (
                  <div className="flex items-center justify-center w-full h-full">
                    <ThreeDots height="40" width="80" radius="9" color="#ADD8E6" ariaLabel="three-dots-loading" visible={true} />
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500" id="map">
                    <MapComponent longitude={Number(longitude)} latitude={Number(latitude)} zoom={14} containerId="map" style="mapbox://styles/mapbox/streets-v12" />
                  </div>
                )}
                {/* Comments Section with Slide Animation */}
                <div
                  className={`absolute top-0 left-0 w-full h-full bg-white z-10 transform transition-transform duration-300 ${
                    showComments ? "translate-x-0" : "translate-x-full"
                  }`}
                  style={{ pointerEvents: showComments ? "auto" : "none" }}
                >
                  <Comments ticketId={ticket_id} onBack={toggleComments} isCitizen={false} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showTenderMax && (
        <TenderMax
          tender={{
            tender_id: contract?.tender_id,
            status: contract?.status,
            companyname: tenders?.companyname,
            contractdatetime: formatDate(String(contract?.contractdatetime)),
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

      {showMuniTenders && (
        <MuniTenders
          tenders={tenders}
          onBack={handleBack}
        />
      )}
    </>
  );
};

export default TicketViewMuni;
