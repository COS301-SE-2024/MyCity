import React, { useEffect, useState, useRef } from "react";
import { FaTimes } from "react-icons/fa";
import mapboxgl from "mapbox-gl";
import { FiMap, FiArrowRight } from "react-icons/fi";
import { ToastContainer } from "react-toastify";

// Define possible statuses
type TenderStatus = "under_review" | "rejected" | "submitted" | "approved";

interface TenderType {
  tender_id: string;
  tendernumber: string;
  company_id: string;
  companyname: string;
  datetimesubmitted: string;
  ticket_id: string;
  status: TenderStatus;  // Status must be one of the valid keys
  quote: number;
  estimatedTimeHours: number;
  longitude: string;
  latitude: string;
  upload: File | null;
  hasReportedCompletion: boolean;
}

const statusStyles: Record<TenderStatus, string> = {
  under_review: "text-blue-500 border-blue-500 rounded-full px-2 py-1",
  rejected: "text-red-500 bg-red-200 border-red-200 rounded-full px-2 py-1",
  submitted: "text-black bg-gray-200 border-gray-200 rounded-full px-2 py-1",
  approved: "text-green-500 bg-green-200 border-green-200 rounded-full px-2 py-1",
};

const TenderContainer = ({ tender, onClose }: { tender: TenderType; onClose: (data: number) => void }) => {
  const [isMapVisible, setIsMapVisible] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const handleBack = () => {
    onClose(0);
  };

  const toggleMapView = () => {
    setIsMapVisible((prev) => !prev);
  };


  const handleDecline = () => {
    onClose(2); // Example number to send back
  };

  // Map "Fix in progress" to "Active" for the tender's status
  const tenderStatus = tender.status.charAt(0).toUpperCase() + tender.status.slice(1);

  console.log(tender.company_id)
  const handleAction = async (action: string) => {
    if(action == "Accept")
    {  
        setDialog({ action, show: true });
        console.log("inside true")
    }
    else if(action == "Decline")
    {
        
        setDialog({ action, show: true });
        console.log("inside true")
        ///uhygiygh

    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    if (isMapVisible) {
      const map = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/streets-v12",
        center: [Number(tender.longitude), Number(tender.latitude)],
        zoom: 14,
      });
      new mapboxgl.Marker().setLngLat([Number(tender.longitude), Number(tender.latitude)]).addTo(map);
    }
  }, [isMapVisible, tender.longitude, tender.latitude]);

  const formattedDate = tender.datetimesubmitted.split("T")[0]; // Format date to YYYY-MM-DD

  return (
    <>
      {/* Unified View for All Screen Sizes */}
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 overflow-auto">
        <div
          ref={modalRef}
          className="bg-white rounded-lg shadow-lg w-11/12 max-w-3xl max-h-[90vh] p-4 relative flex flex-col"
        >
          <button
            className="absolute top-4 right-4 text-gray-700 focus:outline-none"
            onClick={handleBack}
          >
            <FaTimes size={24} />
          </button>

          {/* Conditional Rendering: Show either the card or the map based on the state */}
          {isMapVisible ? (
            <div className="w-full h-[400px] bg-gray-200 flex items-center justify-center p-4 rounded-lg">
              <div className="w-full h-full flex items-center justify-center text-gray-500 rounded-lg" id="map">
                Map Placeholder
              </div>
            </div>
          ) : (
            <div className="flex flex-col w-full overflow-auto">
              <div className="w-full p-2 flex flex-col items-center">
                <div className="text-center text-black text-2xl font-bold mb-2">Tender</div>
                <div className={`px-2 py-1 rounded-full text-sm border mb-2 ${statusStyles[tender.status]}`}>
                  {tender.status.charAt(0).toUpperCase() + tender.status.slice(1)}
                </div>
                <div className="text-gray-700 mb-2">
                  <strong>Tender number:</strong> {tender.tendernumber}
                </div>
                <div className="text-gray-700 mb-2">
                  <strong>Issue Date:</strong> {formattedDate}
                </div>
                <div className="text-gray-700 mb-2">
                  <strong>Proposed Price:</strong> R{tender.quote}
                </div>
                <div className="text-gray-700 mb-2">
                  <strong>Estimated Duration:</strong> {Math.ceil(Number(tender.estimatedTimeHours) / 24)} days
                </div>
                <div className="text-gray-700 mb-2">
                  <strong>Upload:</strong>{" "}
                  {tender.upload ? (
                    <a href={URL.createObjectURL(tender.upload)} download className="text-blue-500 underline ml-2">
                      {tender.upload.name}
                    </a>
                  ) : (
                    "No files attached"
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Toggle between Map and Card */}
          <div className="flex justify-center mt-4">
            <button
              className="flex items-center text-blue-500 bg-white border-2 border-blue-500 rounded-lg px-4 py-2"
              onClick={toggleMapView}
            >
              <FiMap size={24} />
              <FiArrowRight size={24} className={`ml-2 ${isMapVisible ? "rotate-180" : ""}`} />
              <span className="ml-2">{isMapVisible ? "Back to Details" : "View Map"}</span>
            </button>
          </div>
        </div>
      </div>

      <ToastContainer />
    </>
  );
};

export default TenderContainer;
