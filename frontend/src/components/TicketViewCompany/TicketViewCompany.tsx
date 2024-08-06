import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { AlertCircle } from "lucide-react";
import TenderMax from "../Tenders/CompanyTenderMax"; // Adjust the import path as necessary
import CreateBid from "../Tenders/CreateBid"; // Adjust the import path as necessary
import ViewBid from "../Tenders/ViewBid"; // Adjust the import path as necessary
import { useProfile } from "@/hooks/useProfile";
import RenderMap from "@/hooks/mapboxmap";

import { getCompanyTenders } from "@/services/tender.service";

interface TicketViewCompanyProps {
  show: boolean;
  onClose: () => void;
  title: string;
  address: string;
  arrowCount: number;
  commentCount: number;
  viewCount: number;
  ticketNumber: string;
  ticket_id : string;
  description: string;
  user_picture: string;
  createdBy: string;
  status: string;
  imageURL : string;
  municipalityImage: string;
  upvotes : number;
  latitude : string;
  longitude : string;
  urgency: "high" | "medium" | "low";
}

const urgencyMapping = {
  high: { icon: <AlertCircle className="text-red-500" />, label: "Urgent" },
  medium: { icon: <AlertCircle className="text-yellow-500" />, label: "Moderate" },
  low: { icon: <AlertCircle className="text-green-500" />, label: "Not Urgent" },
};

const TicketViewCompany: React.FC<TicketViewCompanyProps> = ({
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
  const userProfile = useProfile();
  const [showTenderMax, setShowTenderMax] = useState(false);
  const [company,setCompany] = useState(String)
  const [showBid, setShowBid] = useState(false);
  const [hasBidded, setHasBidded] = useState(false);
  const [tender,setTender] = useState<any>(null)
  
  console.log("ticket id: " + ticket_id)
  useEffect(() => {
    const fetchData = async () => {
      // try {
      const user_data = await userProfile.getUserProfile();
      const user_company = String(user_data.current?.company_name);
      const user_session = String(user_data.current?.session_token)
      setCompany(user_company);
      const rsptenders = await getCompanyTenders(user_company, user_session)
      if(rsptenders == null)
      {
        setHasBidded(false);
      }
      else {
        rsptenders.forEach((item: { ticket_id: string; }) => {
            console.log(item)
            if(item.ticket_id == ticket_id)
            {
              setTender(item)
            } 
        });
        if(tender == null)
        {
            setHasBidded(false);
        }
        else {
            setHasBidded(true);
        }
      }
    };

    fetchData();
  }, [ userProfile]);

  const getStatusColor = () => {
    switch (status) {
      case "Opened":
        return "text-green-500";
      case "In Progress":
        return "text-blue-500";
      default:
        return "text-gray-500";
    }
  };

  if (!show) return null;

  const addressParts = address.split(",");

  const handleTenderContractClick = () => {
    setShowTenderMax(true);
  };

  const handleTenderMaxClose = () => {
    setShowTenderMax(false);
  };

  const handleBidClick = async () => {
    const user_data = await userProfile.getUserProfile();
    const company_name = String(user_data.current?.company_name)
    const user_session = String(user_data.current?.session_token)
    const rsptenders = await getCompanyTenders(company_name, user_session)
    if(rsptenders == null)
    {
      setShowBid(true);
      setHasBidded(false);
    }
    else {
       rsptenders.forEach((item: { ticket_id: string; }) => {
          console.log(item)
          if(item.ticket_id == ticket_id)
          {
            setTender(item)
          } 
       });
       if(tender == null)
       {
          setShowBid(true);
          setHasBidded(false);
       }
       else {
          setShowBid(true);
          setHasBidded(true);
       }
    }
  };

  const handleBidClose = () => {
    setShowBid(false);
  };

  const getUrgency = (votes : number) =>{
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


  // eslint-disable-next-line react-hooks/rules-of-hooks
  RenderMap(Number(longitude),Number(latitude))

  return (
    <>
      {!showTenderMax && !showBid && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 overflow-auto">
          <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-3/4 xl:w-2/3 max-w-4xl max-h-[90vh] p-4 relative flex flex-col lg:flex-row">
            <button className="absolute top-2 right-2 text-gray-700" onClick={onClose}>
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
                {imageURL && (
                  <div className="mb-2 flex justify-center">
                    <img src={imageURL} alt="Fault" className="rounded-lg w-48 h-36 object-cover" />
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
                    <img src={user_picture} alt="Created By" className="rounded-full mb-1 w-12 h-12 object-cover" />
                    <p className="text-gray-700 text-sm">{createdBy}</p>
                  </div>
                </div>
                <div className="mt-2 flex justify-center gap-2">
                  <button className="bg-gray-200 text-gray-700 rounded-lg px-2 py-1 hover:bg-gray-300" onClick={onClose}>
                    Back
                  </button>
                  {(status === "In Progress" || status === "Assigning Contract") && (
                    <button
                      className="border border-blue-500 text-blue-500 rounded-lg px-2 py-1 hover:bg-blue-500 hover:text-white"
                      onClick={handleTenderContractClick}
                    >
                      Tender Contract
                    </button>
                  )}
                  {(status === "Opened" || status === "Taking Tenders" || status === "Closed") && (
                    <button
                      className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600"
                      onClick={handleBidClick}
                    >
                      {hasBidded ? "View Bid" : "Create Bid"}
                    </button>
                  )}
                </div>
              </div>
              {/* Right Section (Map Placeholder) */}
              <div className="w-full lg:w-2/3 bg-gray-200 flex items-center justify-center">
                <div className="w-full h-full flex items-center justify-center text-gray-500" id="map">
                  Map Placeholder
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* {showTenderMax && (
        <TenderMax
          tender={{
            id: ticketNumber,
            ticketId: ticketNumber,
            status: status === "Fix in progress" ? "Active" : "Unassigned",
            municipality: municipality,
            issueDate: new Date().toISOString().split('T')[0],
            price: 1000,
            estimatedDuration: 5,
            upload: null,
            hasReportedCompletion: false,
          }}
          onClose={handleTenderMaxClose}
          municipality={municipality}
        />
      )} */}

      {showBid && hasBidded && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="transform scale-80 w-full">
            <ViewBid
              companyname={tender.companyname}
              tendernumber={tender.tendernumber}
              company_id={tender.company_id}
              datetimesubmitted={tender.datetimesubmitted}
              ticket_id={tender.ticket_id}
              status={tender.status}
              quote={tender.quote}
              description={description}
              estimatedTimeHours={tender.estimatedTimeHours}
              longitude={longitude}
              latitude={latitude}
              municipalityImage={municipalityImage}
              title={title}
              address={address}
              tender_id={tender.tender_id}
              onBack={handleBidClose}
            />
          </div>
        </div>
      )}

      {showBid && !hasBidded && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="transform scale-80 w-full">
            <CreateBid
              longitude={longitude}
              latitude={latitude}
              ticket_id={ticket_id}
              company_name={company}
              ticketnumber={ticketNumber}
              faultType={title}
              address={address}
              municipalityImage={municipalityImage}
              description={description}
              onBack={handleBidClose}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default TicketViewCompany;
