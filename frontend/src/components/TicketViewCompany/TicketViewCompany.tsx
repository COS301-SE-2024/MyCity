import React, { useState, useEffect, useRef } from "react";
import { FaTimes } from "react-icons/fa";
import { AlertCircle, Image as ImageIcon } from "lucide-react";
import TenderMax from "../Tenders/CompanyTenderMax";
import CreateBid from "../Tenders/CreateBid";
import ViewBid from "../Tenders/ViewBid";
import { useProfile } from "@/hooks/useProfile";
import { ThreeDots } from "react-loader-spinner"; // Import a loading spinner
import {
  DidBid,
  getCompanyTenders,
  getCompanyTicketContract,
} from "@/services/tender.service";
import dynamic from "next/dynamic";
import { getImageBucketUrl } from "@/config/s3bucket.config";

const MapboxMap = dynamic(() => import("../MapboxMap/MapboxMap"), {
  ssr: false,
});

interface TicketViewCompanyProps {
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
  const modalRef = useRef<HTMLDivElement>(null); // Create a ref for the modal
  const [showTenderMax, setShowTenderMax] = useState(false);
  const [company, setCompany] = useState(String);
  const [showBid, setShowBid] = useState(false);
  const [hasBidded, setHasBidded] = useState(false);
  const [tender, setTender] = useState<any>(null);
  const [contract, setContract] = useState<any>(null);
  const [reRender, setReRender] = useState(Boolean);
  const [mapKey, setMapKey] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [bidLoading, setBidLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Start loading before data fetching

      try {
        const user_data = await userProfile.getUserProfile();
        const user_company = String(user_data.current?.company_name);
        const user_session = String(user_data.current?.session_token);
        setCompany(user_company);

        const rsptenders = await DidBid(user_company, ticket_id, user_session);
        console.log(rsptenders);

        if (rsptenders == null) {
          setHasBidded(false);
        } else {
          setTender(rsptenders);
          setHasBidded(true);
        }
      } catch (error) {
        console.error("Error fetching bid data:", error);
      } finally {
        setLoading(false); // End loading once data fetching is complete
      }
    };

    fetchData();
  }, [userProfile]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose(); // Close the modal when clicking outside
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

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

  const handleTenderContractClick = async () => {
    const user_data = await userProfile.getUserProfile();
    const company_name = String(user_data.current?.company_name);
    const user_session = String(user_data.current?.session_token);
    const rspcontract = await getCompanyTicketContract(
      company_name,
      ticket_id,
      user_session,
      true
    );
    if (rspcontract != null) {
      setContract(rspcontract);
      setReRender(false);
      setShowTenderMax(true);
    } else {
    }
  };

  const handleBidClick = async () => {
    setBidLoading(true); // Set loading to true when the button is clicked
    const user_data = await userProfile.getUserProfile();
    const company_name = String(user_data.current?.company_name);
    const user_session = String(user_data.current?.session_token);

    const rsptenders = await getCompanyTenders(
      company_name,
      user_session,
      true
    );
    rsptenders.forEach((item: { ticket_id: string }) => {
      if (item.ticket_id === ticket_id) {
        setTender(item);
        setHasBidded(true);
      }
    });

    setReRender(false);
    setShowBid(true);
    setHasBidded(!!tender);
    setBidLoading(false); // Set loading to false after component has mounted
  };

  const getUrgency = (votes: number) => {
    if (votes < 10) {
      return "low";
    } else if (votes >= 10 && votes < 20) {
      return "medium";
    } else if (votes >= 20 && votes <= 40) {
      return "high";
    } else {
      return "low";
    }
  };

  return (
    <>
      {!showTenderMax && !showBid && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 overflow-auto">
          <div
            ref={modalRef}
            className="bg-white rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-3/4 xl:w-2/3 max-w-4xl max-h-[90vh] p-4 relative flex flex-col lg:flex-row"
          >
            <button
              className="absolute top-2 right-2 text-gray-700 z-20"
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
                  width={64}
                  height={64}
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
                {/* Image Placeholder Logic */}
                <div className="mb-2 flex justify-center">
                  {!imageError ? (
                    <img
                      src={getImageBucketUrl(imageURL)}
                      alt="Fault"
                      width={192}
                      height={144}
                      className="rounded-lg w-48 h-36 object-cover"
                      onError={(e) => {
                        setImageError(true); // Set state to show placeholder
                      }}
                    />
                  ) : (
                    <div className="flex justify-center items-center w-48 h-36 rounded-lg bg-gray-200 border border-gray-300">
                      <ImageIcon size={48} className="text-gray-500" />
                    </div>
                  )}
                </div>
                <div className="flex justify-around mb-2 w-full">
                  {/* Address Section */}
                  <div className="flex-1 flex flex-col items-center justify-center text-center px-2">
                    <h3 className="font-bold text-md text-black">Address</h3>
                    {addressParts.map((part, index) => (
                      <p
                        key={index}
                        className="text-gray-700 text-sm break-words truncate"
                      >
                        {part.trim().length > 25
                          ? `${part.trim().substring(0, 22)}...`
                          : part.trim()}
                      </p>
                    ))}
                  </div>

                  {/* Created By Section */}
                  <div className="flex-1 flex flex-col items-center justify-center text-center px-2">
                    <img
                      src={user_picture}
                      alt="Created By"
                      width={48}
                      height={48}
                      className="rounded-full mb-1 w-12 h-12 object-cover"
                    />
                    {/* Truncate "Created By" text to one line */}
                    <p className="text-gray-700 text-sm truncate max-w-[150px] whitespace-nowrap">
                      {createdBy.length > 20
                        ? `${createdBy.substring(0, 17)}...`
                        : createdBy}
                    </p>
                  </div>
                </div>

                <div className="mt-2 flex justify-center gap-2">
                  <button
                    className="bg-gray-200 text-gray-700 rounded-lg px-2 py-1 hover:bg-gray-300"
                    onClick={onClose}
                  >
                    Back
                  </button>
                  {(status === "In Progress" ||
                    status === "Assigning Contract") && (
                    <button
                      className="border border-blue-500 text-blue-500 rounded-lg px-2 py-1 hover:bg-blue-500 hover:text-white"
                      onClick={handleTenderContractClick}
                    >
                      Tender Contract
                    </button>
                  )}

                  {(status === "Opened" || status === "Taking Tenders") &&
                    (loading ? (
                      // Display the loading icon while processing
                      <div className="flex justify-center items-center">
                        <ThreeDots
                          height="20"
                          width="40"
                          radius="9"
                          color="#ADD8E6"
                          ariaLabel="three-dots-loading"
                          visible={true}
                        />
                      </div>
                    ) : (
                      <button
                        className={`bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 ${
                          bidLoading ? "cursor-not-allowed" : ""
                        }`}
                        onClick={handleBidClick}
                        disabled={bidLoading} // Disable button while loading
                      >
                        {bidLoading ? (
                          <div className="flex justify-center items-center">
                            <ThreeDots
                              height="20"
                              width="40"
                              radius="9"
                              color="#FFFFFF"
                              ariaLabel="three-dots-loading"
                            />
                          </div>
                        ) : hasBidded ? (
                          "View Bid"
                        ) : (
                          "Create Bid"
                        )}
                      </button>
                    ))}
                </div>
              </div>
              {/* Right Section (Map Placeholder) */}
              <div className="w-full lg:w-2/3 bg-gray-200 flex items-center justify-center">
                <div
                  className="w-full h-full flex items-center justify-center text-gray-500"
                  id="map"
                >
                  <MapboxMap
                    centerLng={Number(longitude)}
                    centerLat={Number(latitude)}
                    dropMarker={true}
                    zoom={14}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showTenderMax && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="w-full h-full overflow-auto">
            <TenderMax
              contract_id={contract.contract_id}
              status={contract.status}
              companyname={contract.companyname}
              contractdatetime={contract.contractdatetime}
              finalCost={contract.finalCost}
              finalDuration={contract.finalDuration}
              ticketnumber={ticketNumber}
              longitude={longitude}
              latitude={latitude}
              completedatetime={contract.completedatetime}
              contractnumber={contract.contractnumber}
              municipality="Umdoni"
              upload={tender.upload}
              hasReportedCompletion={tender.hasReportedCompletion}
              onClose={() => {
                setShowTenderMax(false);
                setReRender(true); // Re-render the main view when closing TenderMax
              }}
            />
          </div>
        </div>
      )}

      {showBid && hasBidded && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="transform scale-100 w-full">
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
              onBack={onClose}
            />
          </div>
        </div>
      )}

      {showBid && !hasBidded && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="text-black transform scale-100 w-full">
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
              onBack={onClose}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default TicketViewCompany;
