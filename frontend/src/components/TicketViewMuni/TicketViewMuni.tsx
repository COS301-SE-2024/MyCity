import React, { useState, useEffect } from "react";
import {
  FaArrowUp,
  FaCommentAlt,
  FaEye,
  FaExclamationTriangle,
  FaTimes,
} from "react-icons/fa";
import { AlertCircle } from "lucide-react";
import TenderMax from "../Tenders/MuniTenderMax"; // Adjust the import path as necessary
import MuniTenders from "../RecordsTable/MuniTenders";
import mapboxgl, {Map, Marker } from 'mapbox-gl';
import { getTicketTenders,getContract } from "@/services/tender.service";
import { useProfile } from "@/hooks/useProfile";
import { Tenor_Sans } from "next/font/google";
import MapComponent from "@/context/MapboxMap";


interface TicketViewMuniProps {
  show: boolean;
  onClose: () => void;
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
  imageURL : string;
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
}) => {
  const [showTenderMax, setShowTenderMax] = useState(false);
  const userProfile = useProfile();
  const [showMuniTenders, setShowMuniTenders] = useState(false);
  const [tenders,setTenders] = useState<any>(null)
  const [contract,setContract] = useState<any>()



  const getStatusColor = () => {
    switch (status) {
      case "Opened":
        return "text-green-500";
      case "Fix in progress":
        return "text-blue-500";
      case "Assigning Contract":
        return "text-blue-500";
      case "Taking Tenders":
        return "text-green-500";
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

  function formatDate(given_date : string){
    return given_date.slice(0,given_date.indexOf('T'))
  }
  

  const handleTenderContractClick = async () => {
    try {
      const user_data = await userProfile.getUserProfile();
      const user_session = String(user_data.current?.session_token);
      const rspgettenders = await getTicketTenders(ticket_id,user_session);
      setTenders(rspgettenders);
      console.log(rspgettenders);
      if(rspgettenders == null)
      {
        return 
      }
      let tender_contract = ""
      rspgettenders.forEach((item: { status: string;tender_id : string })  => {
        
        console.log(item.tender_id)
        if(item.status == "accepted" || item.status == "approved")
        {
          tender_contract = item.tender_id;
          console.log(item.tender_id)
        }
      });
      if(tender_contract == "")
      {
        setShowTenderMax(false);
      }
      else {
        const response_contract = await getContract(tender_contract || "",user_session) ; // Replace with your API endpoint
      
        console.log(response_contract);
        if(response_contract != null)
          {
            setContract(response_contract)
            setShowTenderMax(true);
          }
          else setShowTenderMax(false);
      }
      
      
      // Handle the fetched data
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleTenderMaxClose = () => {
    setShowTenderMax(false);
  };

  const handleViewTendersClick = async () => {
    const user_data = await userProfile.getUserProfile();
    const user_session = String(user_data.current?.session_token);
    // console.log(user_session); //
    const rspgettenders = await getTicketTenders(ticket_id,user_session);
    
    if(rspgettenders === null)
    {
      setShowMuniTenders(false);
    }
    else 
    {
      setShowMuniTenders(true)
      setTenders(rspgettenders)
    }
  };

  const handleBack = () => {
    setShowMuniTenders(false);
  };

  // eslint-disable-next-line react-hooks/rules-of-hooks
  

  return (
    <>
      {!showTenderMax && !showMuniTenders && (
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
                  {urgencyMapping[getUrgency(upvotes)].icon}
                </div>
                <img
                  src={municipalityImage}
                  alt="Municipality"
                  className="w-16 h-16 mb-2 rounded-full"
                />
                <div className="flex items-center justify-center mb-2">
                  <div
                    className={`flex items-center ${getStatusColor()} border-2 rounded-full px-2 py-1`}
                  >
                    <span className="ml-1">{status}</span>
                  </div>
                </div>
                <div className="mt-2 mb-2 text-center">
                  <p className="text-gray-700 font-bold">{title}</p>
                </div>

                <div className="mb-2 text-center">
                  <p className="text-gray-700 text-sm">{description}</p>
                </div>

                {user_picture && (
                  <div className="mb-2 flex justify-center">
                    <img
                      src={imageURL}
                      alt="Fault"
                      className="rounded-lg w-48 h-36 object-cover"
                    />
                  </div>
                )}

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
                    onClick={onClose}
                  >
                    Back
                  </button>
                  {(status === "In Progress" || status === "Assigning Contract")  && (
                    <button
                      className="border border-blue-500 text-blue-500 rounded-lg px-2 py-1 hover:bg-blue-500 hover:text-white"
                      onClick={handleTenderContractClick}
                    >
                      Tender Contract
                    </button>
                  )}
                  {(status === "Opened" || status === "Taking Tenders") && (
                    <button
                      className="border border-blue-500 text-blue-500 rounded-lg px-2 py-1 hover:bg-blue-500 hover:text-white"
                      onClick={handleViewTendersClick}
                    >
                      View Tenders
                    </button>
                  )}
                </div>
              </div>
              {/* Right Section (Map Placeholder) */}
              <div className="w-full lg:w-2/3 bg-gray-200 flex items-center justify-center">
                <div className="w-full h-full flex items-center justify-center text-gray-500" id="map">
                <MapComponent longitude={Number(longitude)} latitude={Number(latitude)} zoom={14} containerId="map" style="mapbox://styles/mapbox/streets-v12" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showTenderMax && (
        <TenderMax
          tender={{
            tender_id: contract.tender_id,
            status: contract.status,
            companyname: tenders.companyname,
            contractdatetime: formatDate(String(contract.contractdatetime)),
            finalCost: contract.finalCost,
            finalDuration: contract.finalDuration,
            upload: null,
            ticketnumber : ticketNumber,
            latitude : Number(latitude),
            longitude : Number(longitude),
            completedatetime: contract.completedatetime,
            contractnumber : contract.contractnumber,
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
